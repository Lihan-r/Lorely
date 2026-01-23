package com.lorely.repository;

import com.lorely.model.EntityType;
import com.lorely.model.WorldEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EntityRepository extends JpaRepository<WorldEntity, UUID> {

    List<WorldEntity> findByProjectIdOrderByCreatedAtDesc(UUID projectId);

    List<WorldEntity> findByProjectIdAndTypeOrderByCreatedAtDesc(UUID projectId, EntityType type);

    @Query("SELECT e FROM WorldEntity e WHERE e.projectId = :projectId AND LOWER(e.title) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<WorldEntity> searchByTitle(@Param("projectId") UUID projectId, @Param("query") String query);

    @Query("SELECT DISTINCT e FROM WorldEntity e JOIN e.tags t WHERE e.projectId = :projectId AND t.id = :tagId ORDER BY e.createdAt DESC")
    List<WorldEntity> findByProjectIdAndTagId(@Param("projectId") UUID projectId, @Param("tagId") UUID tagId);
}
