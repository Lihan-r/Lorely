package com.lorely.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lorely.dto.request.CreateProjectRequest;
import com.lorely.dto.request.UpdateProjectRequest;
import com.lorely.model.Project;
import com.lorely.model.User;
import com.lorely.repository.ProjectRepository;
import com.lorely.repository.RefreshTokenRepository;
import com.lorely.repository.UserRepository;
import com.lorely.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ProjectControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private User testUser;
    private String accessToken;

    @BeforeEach
    void setUp() {
        projectRepository.deleteAll();
        refreshTokenRepository.deleteAll();
        userRepository.deleteAll();

        testUser = userRepository.save(User.builder()
                .email("test@example.com")
                .passwordHash(passwordEncoder.encode("password"))
                .build());

        accessToken = jwtTokenProvider.generateAccessToken(testUser.getId(), testUser.getEmail());
    }

    @Test
    void shouldCreateProject() throws Exception {
        CreateProjectRequest request = new CreateProjectRequest("My Fantasy World");

        mockMvc.perform(post("/api/projects")
                        .header("Authorization", "Bearer " + accessToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.name").value("My Fantasy World"))
                .andExpect(jsonPath("$.ownerId").value(testUser.getId().toString()))
                .andExpect(jsonPath("$.createdAt").exists())
                .andExpect(jsonPath("$.updatedAt").exists());
    }

    @Test
    void shouldRejectCreateProjectWithoutAuth() throws Exception {
        CreateProjectRequest request = new CreateProjectRequest("My Fantasy World");

        mockMvc.perform(post("/api/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldRejectCreateProjectWithEmptyName() throws Exception {
        CreateProjectRequest request = new CreateProjectRequest("");

        mockMvc.perform(post("/api/projects")
                        .header("Authorization", "Bearer " + accessToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldGetAllProjectsForUserPaginated() throws Exception {
        projectRepository.save(Project.builder()
                .ownerId(testUser.getId())
                .name("Project 1")
                .build());

        projectRepository.save(Project.builder()
                .ownerId(testUser.getId())
                .name("Project 2")
                .build());

        mockMvc.perform(get("/api/projects")
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(2))
                .andExpect(jsonPath("$.totalElements").value(2));
    }

    @Test
    void shouldNotGetProjectsFromOtherUsers() throws Exception {
        User otherUser = userRepository.save(User.builder()
                .email("other@example.com")
                .passwordHash(passwordEncoder.encode("password"))
                .build());

        projectRepository.save(Project.builder()
                .ownerId(otherUser.getId())
                .name("Other's Project")
                .build());

        projectRepository.save(Project.builder()
                .ownerId(testUser.getId())
                .name("My Project")
                .build());

        mockMvc.perform(get("/api/projects")
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(1))
                .andExpect(jsonPath("$.content[0].name").value("My Project"));
    }

    @Test
    void shouldGetProjectById() throws Exception {
        Project project = projectRepository.save(Project.builder()
                .ownerId(testUser.getId())
                .name("My Project")
                .build());

        mockMvc.perform(get("/api/projects/" + project.getId())
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(project.getId().toString()))
                .andExpect(jsonPath("$.name").value("My Project"));
    }

    @Test
    void shouldReturn404ForNonexistentProject() throws Exception {
        mockMvc.perform(get("/api/projects/00000000-0000-0000-0000-000000000000")
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldReturn403WhenAccessingOtherUsersProject() throws Exception {
        User otherUser = userRepository.save(User.builder()
                .email("other@example.com")
                .passwordHash(passwordEncoder.encode("password"))
                .build());

        Project otherProject = projectRepository.save(Project.builder()
                .ownerId(otherUser.getId())
                .name("Other's Project")
                .build());

        mockMvc.perform(get("/api/projects/" + otherProject.getId())
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldUpdateProject() throws Exception {
        Project project = projectRepository.save(Project.builder()
                .ownerId(testUser.getId())
                .name("Original Name")
                .build());

        UpdateProjectRequest request = new UpdateProjectRequest("Updated Name");

        mockMvc.perform(put("/api/projects/" + project.getId())
                        .header("Authorization", "Bearer " + accessToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Name"));
    }

    @Test
    void shouldReturn403WhenUpdatingOtherUsersProject() throws Exception {
        User otherUser = userRepository.save(User.builder()
                .email("other@example.com")
                .passwordHash(passwordEncoder.encode("password"))
                .build());

        Project otherProject = projectRepository.save(Project.builder()
                .ownerId(otherUser.getId())
                .name("Other's Project")
                .build());

        UpdateProjectRequest request = new UpdateProjectRequest("Hacked Name");

        mockMvc.perform(put("/api/projects/" + otherProject.getId())
                        .header("Authorization", "Bearer " + accessToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldSoftDeleteProject() throws Exception {
        Project project = projectRepository.save(Project.builder()
                .ownerId(testUser.getId())
                .name("To Delete")
                .build());

        mockMvc.perform(delete("/api/projects/" + project.getId())
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isNoContent());

        // With @SQLRestriction, soft-deleted project is filtered out
        assertThat(projectRepository.findById(project.getId())).isEmpty();
    }

    @Test
    void shouldReturn403WhenDeletingOtherUsersProject() throws Exception {
        User otherUser = userRepository.save(User.builder()
                .email("other@example.com")
                .passwordHash(passwordEncoder.encode("password"))
                .build());

        Project otherProject = projectRepository.save(Project.builder()
                .ownerId(otherUser.getId())
                .name("Other's Project")
                .build());

        mockMvc.perform(delete("/api/projects/" + otherProject.getId())
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isForbidden());

        // Verify project still exists
        assertThat(projectRepository.findById(otherProject.getId())).isPresent();
    }
}
