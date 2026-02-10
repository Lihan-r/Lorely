package com.lorely.repository;

import com.lorely.model.EntityType;
import com.lorely.model.WorldEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EntityRepository extends JpaRepository<WorldEntity, UUID> {

    @Query("SELECT DISTINCT e FROM WorldEntity e LEFT JOIN FETCH e.tags WHERE e.projectId = :projectId ORDER BY e.createdAt DESC")
    List<WorldEntity> findByProjectIdOrderByCreatedAtDesc(@Param("projectId") UUID projectId);

    @Query("SELECT DISTINCT e FROM WorldEntity e LEFT JOIN FETCH e.tags WHERE e.projectId = :projectId AND e.type = :type ORDER BY e.createdAt DESC")
    List<WorldEntity> findByProjectIdAndTypeOrderByCreatedAtDesc(@Param("projectId") UUID projectId, @Param("type") EntityType type);

    @Query("SELECT DISTINCT e FROM WorldEntity e LEFT JOIN FETCH e.tags WHERE e.id = :id")
    Optional<WorldEntity> findByIdWithTags(@Param("id") UUID id);

    @Query("SELECT DISTINCT e FROM WorldEntity e LEFT JOIN FETCH e.tags WHERE e.projectId = :projectId AND LOWER(e.title) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<WorldEntity> searchByTitle(@Param("projectId") UUID projectId, @Param("query") String query);

    @Query("SELECT DISTINCT e FROM WorldEntity e JOIN e.tags t LEFT JOIN FETCH e.tags WHERE e.projectId = :projectId AND t.id = :tagId ORDER BY e.createdAt DESC")
    List<WorldEntity> findByProjectIdAndTagId(@Param("projectId") UUID projectId, @Param("tagId") UUID tagId);

    // Paginated queries
    @Query(value = "SELECT DISTINCT e FROM WorldEntity e LEFT JOIN FETCH e.tags WHERE e.projectId = :projectId",
            countQuery = "SELECT COUNT(DISTINCT e) FROM WorldEntity e WHERE e.projectId = :projectId")
    Page<WorldEntity> findByProjectIdPaginated(@Param("projectId") UUID projectId, Pageable pageable);

    @Query(value = "SELECT DISTINCT e FROM WorldEntity e LEFT JOIN FETCH e.tags WHERE e.projectId = :projectId AND e.type = :type",
            countQuery = "SELECT COUNT(DISTINCT e) FROM WorldEntity e WHERE e.projectId = :projectId AND e.type = :type")
    Page<WorldEntity> findByProjectIdAndTypePaginated(@Param("projectId") UUID projectId, @Param("type") EntityType type, Pageable pageable);

    @Query(value = "SELECT DISTINCT e FROM WorldEntity e JOIN e.tags t LEFT JOIN FETCH e.tags WHERE e.projectId = :projectId AND t.id = :tagId",
            countQuery = "SELECT COUNT(DISTINCT e) FROM WorldEntity e JOIN e.tags t WHERE e.projectId = :projectId AND t.id = :tagId")
    Page<WorldEntity> findByProjectIdAndTagIdPaginated(@Param("projectId") UUID projectId, @Param("tagId") UUID tagId, Pageable pageable);

    @Query("SELECT DISTINCT e FROM WorldEntity e LEFT JOIN FETCH e.tags WHERE e.projectId = :projectId AND LOWER(e.title) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<WorldEntity> searchByTitlePaginated(@Param("projectId") UUID projectId, @Param("query") String query, Pageable pageable);

    // Full-text search (native query for PostgreSQL tsvector)
    @Query(value = "SELECT * FROM entities WHERE project_id = :projectId " +
            "AND search_vector @@ to_tsquery('english', :query) " +
            "ORDER BY ts_rank(search_vector, to_tsquery('english', :query)) DESC",
            countQuery = "SELECT COUNT(*) FROM entities WHERE project_id = :projectId " +
                    "AND search_vector @@ to_tsquery('english', :query)",
            nativeQuery = true)
    Page<WorldEntity> fullTextSearch(@Param("projectId") UUID projectId, @Param("query") String query, Pageable pageable);

    // For export: find all entities in a project
    @Query("SELECT e FROM WorldEntity e LEFT JOIN FETCH e.tags WHERE e.projectId = :projectId")
    List<WorldEntity> findAllByProjectIdWithTags(@Param("projectId") UUID projectId);
}
