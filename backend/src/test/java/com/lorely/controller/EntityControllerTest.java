package com.lorely.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lorely.dto.request.CreateEntityRequest;
import com.lorely.dto.request.UpdateEntityRequest;
import com.lorely.model.EntityType;
import com.lorely.model.Project;
import com.lorely.model.User;
import com.lorely.model.WorldEntity;
import com.lorely.repository.EntityRepository;
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

import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class EntityControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private EntityRepository entityRepository;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private User testUser;
    private Project testProject;
    private String accessToken;

    @BeforeEach
    void setUp() {
        entityRepository.deleteAll();
        projectRepository.deleteAll();
        refreshTokenRepository.deleteAll();
        userRepository.deleteAll();

        testUser = userRepository.save(User.builder()
                .email("test@example.com")
                .passwordHash(passwordEncoder.encode("password"))
                .build());

        testProject = projectRepository.save(Project.builder()
                .ownerId(testUser.getId())
                .name("Test Project")
                .build());

        accessToken = jwtTokenProvider.generateAccessToken(testUser.getId(), testUser.getEmail());
    }

    @Test
    void shouldCreateEntity() throws Exception {
        CreateEntityRequest request = CreateEntityRequest.builder()
                .type(EntityType.CHARACTER)
                .title("Elara the Wise")
                .build();

        mockMvc.perform(post("/api/projects/" + testProject.getId() + "/entities")
                        .header("Authorization", "Bearer " + accessToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.title").value("Elara the Wise"))
                .andExpect(jsonPath("$.type").value("CHARACTER"))
                .andExpect(jsonPath("$.projectId").value(testProject.getId().toString()));
    }

    @Test
    void shouldCreateEntityWithContent() throws Exception {
        Map<String, Object> content = new HashMap<>();
        content.put("description", "A wise wizard");
        content.put("age", 150);

        CreateEntityRequest request = CreateEntityRequest.builder()
                .type(EntityType.CHARACTER)
                .title("Elara the Wise")
                .content(content)
                .build();

        mockMvc.perform(post("/api/projects/" + testProject.getId() + "/entities")
                        .header("Authorization", "Bearer " + accessToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.content.description").value("A wise wizard"))
                .andExpect(jsonPath("$.content.age").value(150));
    }

    @Test
    void shouldRejectCreateEntityWithoutAuth() throws Exception {
        CreateEntityRequest request = CreateEntityRequest.builder()
                .type(EntityType.CHARACTER)
                .title("Elara the Wise")
                .build();

        mockMvc.perform(post("/api/projects/" + testProject.getId() + "/entities")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldRejectCreateEntityInOtherUsersProject() throws Exception {
        User otherUser = userRepository.save(User.builder()
                .email("other@example.com")
                .passwordHash(passwordEncoder.encode("password"))
                .build());

        Project otherProject = projectRepository.save(Project.builder()
                .ownerId(otherUser.getId())
                .name("Other Project")
                .build());

        CreateEntityRequest request = CreateEntityRequest.builder()
                .type(EntityType.CHARACTER)
                .title("Elara the Wise")
                .build();

        mockMvc.perform(post("/api/projects/" + otherProject.getId() + "/entities")
                        .header("Authorization", "Bearer " + accessToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldGetAllEntitiesInProject() throws Exception {
        entityRepository.save(WorldEntity.builder()
                .projectId(testProject.getId())
                .type(EntityType.CHARACTER)
                .title("Character 1")
                .build());

        entityRepository.save(WorldEntity.builder()
                .projectId(testProject.getId())
                .type(EntityType.LOCATION)
                .title("Location 1")
                .build());

        mockMvc.perform(get("/api/projects/" + testProject.getId() + "/entities")
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    void shouldFilterEntitiesByType() throws Exception {
        entityRepository.save(WorldEntity.builder()
                .projectId(testProject.getId())
                .type(EntityType.CHARACTER)
                .title("Character 1")
                .build());

        entityRepository.save(WorldEntity.builder()
                .projectId(testProject.getId())
                .type(EntityType.LOCATION)
                .title("Location 1")
                .build());

        entityRepository.save(WorldEntity.builder()
                .projectId(testProject.getId())
                .type(EntityType.CHARACTER)
                .title("Character 2")
                .build());

        mockMvc.perform(get("/api/projects/" + testProject.getId() + "/entities")
                        .header("Authorization", "Bearer " + accessToken)
                        .param("type", "CHARACTER"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].type").value("CHARACTER"))
                .andExpect(jsonPath("$[1].type").value("CHARACTER"));
    }

    @Test
    void shouldSearchEntitiesByTitle() throws Exception {
        entityRepository.save(WorldEntity.builder()
                .projectId(testProject.getId())
                .type(EntityType.CHARACTER)
                .title("Elara the Wise")
                .build());

        entityRepository.save(WorldEntity.builder()
                .projectId(testProject.getId())
                .type(EntityType.CHARACTER)
                .title("Marcus the Bold")
                .build());

        entityRepository.save(WorldEntity.builder()
                .projectId(testProject.getId())
                .type(EntityType.LOCATION)
                .title("Elara's Tower")
                .build());

        mockMvc.perform(get("/api/projects/" + testProject.getId() + "/entities/search")
                        .header("Authorization", "Bearer " + accessToken)
                        .param("q", "elara"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    void shouldGetEntityById() throws Exception {
        WorldEntity entity = entityRepository.save(WorldEntity.builder()
                .projectId(testProject.getId())
                .type(EntityType.CHARACTER)
                .title("Elara the Wise")
                .build());

        mockMvc.perform(get("/api/entities/" + entity.getId())
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(entity.getId().toString()))
                .andExpect(jsonPath("$.title").value("Elara the Wise"));
    }

    @Test
    void shouldReturn404ForNonexistentEntity() throws Exception {
        mockMvc.perform(get("/api/entities/00000000-0000-0000-0000-000000000000")
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldReturn403WhenAccessingOtherUsersEntity() throws Exception {
        User otherUser = userRepository.save(User.builder()
                .email("other@example.com")
                .passwordHash(passwordEncoder.encode("password"))
                .build());

        Project otherProject = projectRepository.save(Project.builder()
                .ownerId(otherUser.getId())
                .name("Other Project")
                .build());

        WorldEntity otherEntity = entityRepository.save(WorldEntity.builder()
                .projectId(otherProject.getId())
                .type(EntityType.CHARACTER)
                .title("Other's Character")
                .build());

        mockMvc.perform(get("/api/entities/" + otherEntity.getId())
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldUpdateEntity() throws Exception {
        WorldEntity entity = entityRepository.save(WorldEntity.builder()
                .projectId(testProject.getId())
                .type(EntityType.CHARACTER)
                .title("Original Name")
                .build());

        UpdateEntityRequest request = UpdateEntityRequest.builder()
                .title("Updated Name")
                .type(EntityType.LOCATION)
                .build();

        mockMvc.perform(put("/api/entities/" + entity.getId())
                        .header("Authorization", "Bearer " + accessToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Name"))
                .andExpect(jsonPath("$.type").value("LOCATION"));
    }

    @Test
    void shouldReturn403WhenUpdatingOtherUsersEntity() throws Exception {
        User otherUser = userRepository.save(User.builder()
                .email("other@example.com")
                .passwordHash(passwordEncoder.encode("password"))
                .build());

        Project otherProject = projectRepository.save(Project.builder()
                .ownerId(otherUser.getId())
                .name("Other Project")
                .build());

        WorldEntity otherEntity = entityRepository.save(WorldEntity.builder()
                .projectId(otherProject.getId())
                .type(EntityType.CHARACTER)
                .title("Other's Character")
                .build());

        UpdateEntityRequest request = UpdateEntityRequest.builder()
                .title("Hacked Name")
                .build();

        mockMvc.perform(put("/api/entities/" + otherEntity.getId())
                        .header("Authorization", "Bearer " + accessToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldDeleteEntity() throws Exception {
        WorldEntity entity = entityRepository.save(WorldEntity.builder()
                .projectId(testProject.getId())
                .type(EntityType.CHARACTER)
                .title("To Delete")
                .build());

        mockMvc.perform(delete("/api/entities/" + entity.getId())
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isNoContent());

        assertThat(entityRepository.findById(entity.getId())).isEmpty();
    }

    @Test
    void shouldReturn403WhenDeletingOtherUsersEntity() throws Exception {
        User otherUser = userRepository.save(User.builder()
                .email("other@example.com")
                .passwordHash(passwordEncoder.encode("password"))
                .build());

        Project otherProject = projectRepository.save(Project.builder()
                .ownerId(otherUser.getId())
                .name("Other Project")
                .build());

        WorldEntity otherEntity = entityRepository.save(WorldEntity.builder()
                .projectId(otherProject.getId())
                .type(EntityType.CHARACTER)
                .title("Other's Character")
                .build());

        mockMvc.perform(delete("/api/entities/" + otherEntity.getId())
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isForbidden());

        // Verify entity still exists
        assertThat(entityRepository.findById(otherEntity.getId())).isPresent();
    }
}
