package com.lorely.repository;

import com.lorely.model.EntityType;
import com.lorely.model.Project;
import com.lorely.model.User;
import com.lorely.model.WorldEntity;
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
class EntityRepositoryTest {

    @Autowired
    private EntityRepository entityRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    private Project testProject;

    @BeforeEach
    void setUp() {
        User testUser = userRepository.save(User.builder()
                .email("test@example.com")
                .passwordHash("hashedPassword")
                .build());

        testProject = projectRepository.save(Project.builder()
                .ownerId(testUser.getId())
                .name("Test Project")
                .build());
    }

    @Test
    void shouldSaveAndFindEntityById() {
        WorldEntity entity = WorldEntity.builder()
                .projectId(testProject.getId())
                .type(EntityType.CHARACTER)
                .title("Elara the Wise")
                .build();

        WorldEntity savedEntity = entityRepository.save(entity);

        assertThat(savedEntity.getId()).isNotNull();
        assertThat(savedEntity.getCreatedAt()).isNotNull();
        assertThat(savedEntity.getUpdatedAt()).isNotNull();
        assertThat(savedEntity.getContent()).isNotNull();

        Optional<WorldEntity> foundEntity = entityRepository.findById(savedEntity.getId());

        assertThat(foundEntity).isPresent();
        assertThat(foundEntity.get().getTitle()).isEqualTo("Elara the Wise");
        assertThat(foundEntity.get().getType()).isEqualTo(EntityType.CHARACTER);
    }

    @Test
    void shouldFindEntitiesByProjectOrderedByCreatedAtDesc() {
        entityRepository.save(WorldEntity.builder()
                .projectId(testProject.getId())
                .type(EntityType.CHARACTER)
                .title("First Entity")
                .build());

        entityRepository.save(WorldEntity.builder()
                .projectId(testProject.getId())
                .type(EntityType.LOCATION)
                .title("Second Entity")
                .build());

        List<WorldEntity> entities = entityRepository.findByProjectIdOrderByCreatedAtDesc(testProject.getId());

        assertThat(entities).hasSize(2);
        // Most recent first
        assertThat(entities.get(0).getTitle()).isEqualTo("Second Entity");
        assertThat(entities.get(1).getTitle()).isEqualTo("First Entity");
    }

    @Test
    void shouldFindEntitiesByProjectAndType() {
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

        List<WorldEntity> characters = entityRepository.findByProjectIdAndTypeOrderByCreatedAtDesc(
                testProject.getId(), EntityType.CHARACTER);

        assertThat(characters).hasSize(2);
        assertThat(characters).extracting(WorldEntity::getType)
                .containsOnly(EntityType.CHARACTER);
    }

    @Test
    void shouldSearchByTitle() {
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

        List<WorldEntity> results = entityRepository.searchByTitle(testProject.getId(), "elara");

        assertThat(results).hasSize(2);
        assertThat(results).extracting(WorldEntity::getTitle)
                .containsExactlyInAnyOrder("Elara the Wise", "Elara's Tower");
    }

    @Test
    void shouldNotFindEntitiesFromOtherProjects() {
        User otherUser = userRepository.save(User.builder()
                .email("other@example.com")
                .passwordHash("hashedPassword")
                .build());

        Project otherProject = projectRepository.save(Project.builder()
                .ownerId(otherUser.getId())
                .name("Other Project")
                .build());

        entityRepository.save(WorldEntity.builder()
                .projectId(testProject.getId())
                .type(EntityType.CHARACTER)
                .title("My Character")
                .build());

        entityRepository.save(WorldEntity.builder()
                .projectId(otherProject.getId())
                .type(EntityType.CHARACTER)
                .title("Other Character")
                .build());

        List<WorldEntity> entities = entityRepository.findByProjectIdOrderByCreatedAtDesc(testProject.getId());

        assertThat(entities).hasSize(1);
        assertThat(entities.get(0).getTitle()).isEqualTo("My Character");
    }

    @Test
    void shouldReturnEmptyListForNonExistentProject() {
        List<WorldEntity> entities = entityRepository.findByProjectIdOrderByCreatedAtDesc(UUID.randomUUID());

        assertThat(entities).isEmpty();
    }
}
