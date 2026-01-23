package com.lorely.repository;

import com.lorely.model.Project;
import com.lorely.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
class ProjectRepositoryTest {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = userRepository.save(User.builder()
                .email("test@example.com")
                .passwordHash("hashedPassword")
                .build());
    }

    @Test
    void shouldSaveAndFindProjectById() {
        Project project = Project.builder()
                .ownerId(testUser.getId())
                .name("My Project")
                .build();

        Project savedProject = projectRepository.save(project);

        assertThat(savedProject.getId()).isNotNull();
        assertThat(savedProject.getCreatedAt()).isNotNull();
        assertThat(savedProject.getUpdatedAt()).isNotNull();

        Optional<Project> foundProject = projectRepository.findById(savedProject.getId());

        assertThat(foundProject).isPresent();
        assertThat(foundProject.get().getName()).isEqualTo("My Project");
        assertThat(foundProject.get().getOwnerId()).isEqualTo(testUser.getId());
    }

    @Test
    void shouldFindProjectsByOwnerOrderedByCreatedAtDesc() {
        Project project1 = projectRepository.save(Project.builder()
                .ownerId(testUser.getId())
                .name("First Project")
                .build());

        Project project2 = projectRepository.save(Project.builder()
                .ownerId(testUser.getId())
                .name("Second Project")
                .build());

        List<Project> projects = projectRepository.findByOwnerIdOrderByCreatedAtDesc(testUser.getId());

        assertThat(projects).hasSize(2);
        // Most recent first
        assertThat(projects.get(0).getName()).isEqualTo("Second Project");
        assertThat(projects.get(1).getName()).isEqualTo("First Project");
    }

    @Test
    void shouldReturnEmptyListForNonExistentOwner() {
        List<Project> projects = projectRepository.findByOwnerIdOrderByCreatedAtDesc(UUID.randomUUID());

        assertThat(projects).isEmpty();
    }

    @Test
    void shouldNotFindProjectsFromOtherOwners() {
        User otherUser = userRepository.save(User.builder()
                .email("other@example.com")
                .passwordHash("hashedPassword")
                .build());

        projectRepository.save(Project.builder()
                .ownerId(testUser.getId())
                .name("Test User Project")
                .build());

        projectRepository.save(Project.builder()
                .ownerId(otherUser.getId())
                .name("Other User Project")
                .build());

        List<Project> testUserProjects = projectRepository.findByOwnerIdOrderByCreatedAtDesc(testUser.getId());

        assertThat(testUserProjects).hasSize(1);
        assertThat(testUserProjects.get(0).getName()).isEqualTo("Test User Project");
    }
}
