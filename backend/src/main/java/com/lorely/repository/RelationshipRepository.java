package com.lorely.repository;

import com.lorely.model.Relationship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RelationshipRepository extends JpaRepository<Relationship, UUID> {

    List<Relationship> findByProjectIdOrderByCreatedAtDesc(UUID projectId);

    List<Relationship> findByProjectIdAndRelationTypeOrderByCreatedAtDesc(UUID projectId, String relationType);

    List<Relationship> findByFromEntityIdOrderByCreatedAtDesc(UUID fromEntityId);

    List<Relationship> findByToEntityIdOrderByCreatedAtDesc(UUID toEntityId);

    List<Relationship> findByFromEntityIdOrToEntityIdOrderByCreatedAtDesc(UUID fromEntityId, UUID toEntityId);

    List<Relationship> findByContextEntityIdOrderByCreatedAtDesc(UUID contextEntityId);

    void deleteByProjectId(UUID projectId);
}
