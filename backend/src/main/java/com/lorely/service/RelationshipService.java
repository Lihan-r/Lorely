package com.lorely.service;

import com.lorely.dto.request.CreateRelationshipRequest;
import com.lorely.dto.response.RelationshipResponse;
import com.lorely.exception.ResourceNotFoundException;
import com.lorely.model.Relationship;
import com.lorely.model.WorldEntity;
import com.lorely.repository.EntityRepository;
import com.lorely.repository.RelationshipRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RelationshipService {

    private final RelationshipRepository relationshipRepository;
    private final EntityRepository entityRepository;

    @Transactional
    public RelationshipResponse createRelationship(UUID projectId, CreateRelationshipRequest request) {
        log.debug("Creating relationship from {} to {} with type '{}' in project {}",
                request.getFromEntityId(), request.getToEntityId(), request.getRelationType(), projectId);

        // Verify entities exist and belong to the project
        WorldEntity fromEntity = entityRepository.findById(request.getFromEntityId())
                .orElseThrow(() -> new ResourceNotFoundException("From entity not found"));
        WorldEntity toEntity = entityRepository.findById(request.getToEntityId())
                .orElseThrow(() -> new ResourceNotFoundException("To entity not found"));

        if (!fromEntity.getProjectId().equals(projectId)) {
            throw new ResourceNotFoundException("From entity does not belong to this project");
        }
        if (!toEntity.getProjectId().equals(projectId)) {
            throw new ResourceNotFoundException("To entity does not belong to this project");
        }

        // Verify context entity if provided
        String contextTitle = null;
        if (request.getContextEntityId() != null) {
            WorldEntity contextEntity = entityRepository.findById(request.getContextEntityId())
                    .orElseThrow(() -> new ResourceNotFoundException("Context entity not found"));
            if (!contextEntity.getProjectId().equals(projectId)) {
                throw new ResourceNotFoundException("Context entity does not belong to this project");
            }
            contextTitle = contextEntity.getTitle();
        }

        Relationship relationship = Relationship.builder()
                .projectId(projectId)
                .fromEntityId(request.getFromEntityId())
                .toEntityId(request.getToEntityId())
                .relationType(request.getRelationType())
                .contextEntityId(request.getContextEntityId())
                .build();

        Relationship savedRelationship = relationshipRepository.save(relationship);
        log.info("Relationship created: {}", savedRelationship.getId());

        return RelationshipResponse.fromRelationshipWithTitles(
                savedRelationship,
                fromEntity.getTitle(),
                toEntity.getTitle(),
                contextTitle
        );
    }

    @Transactional(readOnly = true)
    public List<RelationshipResponse> getRelationshipsByProject(UUID projectId) {
        log.debug("Fetching all relationships for project {}", projectId);

        return relationshipRepository.findByProjectIdOrderByCreatedAtDesc(projectId)
                .stream()
                .map(this::toResponseWithTitles)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RelationshipResponse> getRelationshipsByProjectAndType(UUID projectId, String relationType) {
        log.debug("Fetching relationships of type '{}' for project {}", relationType, projectId);

        return relationshipRepository.findByProjectIdAndRelationTypeOrderByCreatedAtDesc(projectId, relationType)
                .stream()
                .map(this::toResponseWithTitles)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RelationshipResponse> getRelationshipsForEntity(UUID entityId) {
        log.debug("Fetching relationships for entity {}", entityId);

        return relationshipRepository.findByFromEntityIdOrToEntityIdOrderByCreatedAtDesc(entityId, entityId)
                .stream()
                .map(this::toResponseWithTitles)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Relationship getRelationshipById(UUID relationshipId) {
        return relationshipRepository.findById(relationshipId)
                .orElseThrow(() -> new ResourceNotFoundException("Relationship not found"));
    }

    @Transactional(readOnly = true)
    public RelationshipResponse getRelationshipResponseById(UUID relationshipId) {
        Relationship relationship = getRelationshipById(relationshipId);
        return toResponseWithTitles(relationship);
    }

    @Transactional
    public void deleteRelationship(UUID relationshipId) {
        log.debug("Deleting relationship {}", relationshipId);

        Relationship relationship = getRelationshipById(relationshipId);
        relationshipRepository.delete(relationship);

        log.info("Relationship deleted: {}", relationshipId);
    }

    private RelationshipResponse toResponseWithTitles(Relationship relationship) {
        String fromTitle = entityRepository.findById(relationship.getFromEntityId())
                .map(WorldEntity::getTitle)
                .orElse(null);
        String toTitle = entityRepository.findById(relationship.getToEntityId())
                .map(WorldEntity::getTitle)
                .orElse(null);
        String contextTitle = relationship.getContextEntityId() != null
                ? entityRepository.findById(relationship.getContextEntityId())
                        .map(WorldEntity::getTitle)
                        .orElse(null)
                : null;

        return RelationshipResponse.fromRelationshipWithTitles(
                relationship,
                fromTitle,
                toTitle,
                contextTitle
        );
    }
}
