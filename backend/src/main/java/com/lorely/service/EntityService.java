package com.lorely.service;

import com.lorely.dto.request.CreateEntityRequest;
import com.lorely.dto.request.UpdateEntityRequest;
import com.lorely.dto.response.EntityResponse;
import com.lorely.dto.response.PaginatedResponse;
import com.lorely.exception.ResourceNotFoundException;
import com.lorely.model.EntityType;
import com.lorely.model.Tag;
import com.lorely.model.WorldEntity;
import com.lorely.repository.EntityRepository;
import com.lorely.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class EntityService {

    private final EntityRepository entityRepository;
    private final TagRepository tagRepository;

    @Transactional
    public EntityResponse createEntity(UUID projectId, CreateEntityRequest request) {
        log.debug("Creating entity '{}' of type {} in project {}", request.getTitle(), request.getType(), projectId);

        WorldEntity entity = WorldEntity.builder()
                .projectId(projectId)
                .type(request.getType())
                .title(request.getTitle())
                .content(request.getContent() != null ? request.getContent() : new HashMap<>())
                .build();

        WorldEntity savedEntity = entityRepository.save(entity);
        log.info("Entity created: {}", savedEntity.getId());

        return EntityResponse.fromEntity(savedEntity);
    }

    @Transactional(readOnly = true)
    public List<EntityResponse> getEntitiesByProject(UUID projectId) {
        log.debug("Fetching all entities for project {}", projectId);

        return entityRepository.findByProjectIdOrderByCreatedAtDesc(projectId)
                .stream()
                .map(EntityResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PaginatedResponse<EntityResponse> getEntitiesByProjectPaginated(UUID projectId, int page, int size, String sort, String direction) {
        log.debug("Fetching paginated entities for project {}", projectId);

        Pageable pageable = createPageable(page, size, sort, direction);
        Page<WorldEntity> entityPage = entityRepository.findByProjectIdPaginated(projectId, pageable);
        return PaginatedResponse.from(entityPage.map(EntityResponse::fromEntity));
    }

    @Transactional(readOnly = true)
    public PaginatedResponse<EntityResponse> getEntitiesByProjectAndTypePaginated(UUID projectId, EntityType type, int page, int size, String sort, String direction) {
        log.debug("Fetching paginated entities of type {} for project {}", type, projectId);

        Pageable pageable = createPageable(page, size, sort, direction);
        Page<WorldEntity> entityPage = entityRepository.findByProjectIdAndTypePaginated(projectId, type, pageable);
        return PaginatedResponse.from(entityPage.map(EntityResponse::fromEntity));
    }

    @Transactional(readOnly = true)
    public PaginatedResponse<EntityResponse> getEntitiesByProjectAndTagPaginated(UUID projectId, UUID tagId, int page, int size, String sort, String direction) {
        log.debug("Fetching paginated entities with tag {} in project {}", tagId, projectId);

        Pageable pageable = createPageable(page, size, sort, direction);
        Page<WorldEntity> entityPage = entityRepository.findByProjectIdAndTagIdPaginated(projectId, tagId, pageable);
        return PaginatedResponse.from(entityPage.map(EntityResponse::fromEntity));
    }

    @Transactional(readOnly = true)
    public List<EntityResponse> getEntitiesByProjectAndType(UUID projectId, EntityType type) {
        log.debug("Fetching entities of type {} for project {}", type, projectId);

        return entityRepository.findByProjectIdAndTypeOrderByCreatedAtDesc(projectId, type)
                .stream()
                .map(EntityResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public WorldEntity getEntityById(UUID entityId) {
        return entityRepository.findByIdWithTags(entityId)
                .orElseThrow(() -> new ResourceNotFoundException("Entity not found"));
    }

    @Transactional(readOnly = true)
    public WorldEntity getEntityByIdIncludeDeleted(UUID entityId) {
        return entityRepository.findById(entityId)
                .orElseThrow(() -> new ResourceNotFoundException("Entity not found"));
    }

    @Transactional(readOnly = true)
    public EntityResponse getEntityResponseById(UUID entityId) {
        return EntityResponse.fromEntity(getEntityById(entityId));
    }

    @Transactional
    public EntityResponse updateEntity(UUID entityId, UpdateEntityRequest request) {
        log.debug("Updating entity {}", entityId);

        WorldEntity entity = getEntityById(entityId);

        if (request.getType() != null) {
            entity.setType(request.getType());
        }
        entity.setTitle(request.getTitle());
        if (request.getContent() != null) {
            entity.setContent(request.getContent());
        }

        WorldEntity savedEntity = entityRepository.save(entity);
        log.info("Entity updated: {}", savedEntity.getId());

        return EntityResponse.fromEntity(savedEntity);
    }

    @Transactional
    public void deleteEntity(UUID entityId) {
        log.debug("Soft-deleting entity {}", entityId);

        WorldEntity entity = getEntityById(entityId);
        entity.setDeletedAt(Instant.now());
        entityRepository.save(entity);

        log.info("Entity soft-deleted: {}", entityId);
    }

    @Transactional
    public void permanentlyDeleteEntity(UUID entityId) {
        log.debug("Permanently deleting entity {}", entityId);

        WorldEntity entity = entityRepository.findById(entityId)
                .orElseThrow(() -> new ResourceNotFoundException("Entity not found"));
        entityRepository.delete(entity);

        log.info("Entity permanently deleted: {}", entityId);
    }

    @Transactional
    public EntityResponse restoreEntity(UUID entityId) {
        log.debug("Restoring entity {}", entityId);

        WorldEntity entity = entityRepository.findById(entityId)
                .orElseThrow(() -> new ResourceNotFoundException("Entity not found"));
        entity.setDeletedAt(null);
        WorldEntity savedEntity = entityRepository.save(entity);

        log.info("Entity restored: {}", entityId);
        return EntityResponse.fromEntity(savedEntity);
    }

    @Transactional(readOnly = true)
    public List<EntityResponse> searchEntities(UUID projectId, String query) {
        log.debug("Searching entities in project {} for '{}'", projectId, query);

        return entityRepository.searchByTitle(projectId, query)
                .stream()
                .map(EntityResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PaginatedResponse<EntityResponse> searchEntitiesPaginated(UUID projectId, String query, EntityType type, int page, int size) {
        log.debug("Searching entities in project {} for '{}' (paginated)", projectId, query);

        Pageable pageable = PageRequest.of(page, size);

        // Use ILIKE fallback for short queries, full-text for longer ones
        Page<WorldEntity> resultPage;
        if (query.length() < 3) {
            resultPage = entityRepository.searchByTitlePaginated(projectId, query, pageable);
        } else {
            try {
                resultPage = entityRepository.fullTextSearch(projectId, query.trim(), pageable);
            } catch (Exception e) {
                log.warn("Full-text search failed, falling back to ILIKE: {}", e.getMessage());
                resultPage = entityRepository.searchByTitlePaginated(projectId, query, pageable);
            }
        }

        return PaginatedResponse.from(resultPage.map(EntityResponse::fromEntity));
    }

    @Transactional(readOnly = true)
    public List<EntityResponse> getEntitiesByProjectAndTag(UUID projectId, UUID tagId) {
        log.debug("Fetching entities with tag {} in project {}", tagId, projectId);

        return entityRepository.findByProjectIdAndTagId(projectId, tagId)
                .stream()
                .map(EntityResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public EntityResponse addTagToEntity(UUID entityId, UUID tagId) {
        log.debug("Adding tag {} to entity {}", tagId, entityId);

        WorldEntity entity = getEntityById(entityId);
        Tag tag = tagRepository.findById(tagId)
                .orElseThrow(() -> new ResourceNotFoundException("Tag not found"));

        entity.getTags().add(tag);
        WorldEntity savedEntity = entityRepository.save(entity);

        log.info("Tag {} added to entity {}", tagId, entityId);

        return EntityResponse.fromEntity(savedEntity);
    }

    @Transactional
    public EntityResponse removeTagFromEntity(UUID entityId, UUID tagId) {
        log.debug("Removing tag {} from entity {}", tagId, entityId);

        WorldEntity entity = getEntityById(entityId);
        entity.getTags().removeIf(t -> t.getId().equals(tagId));
        WorldEntity savedEntity = entityRepository.save(entity);

        log.info("Tag {} removed from entity {}", tagId, entityId);

        return EntityResponse.fromEntity(savedEntity);
    }

    private Pageable createPageable(int page, int size, String sort, String direction) {
        Sort.Direction sortDirection = "asc".equalsIgnoreCase(direction) ? Sort.Direction.ASC : Sort.Direction.DESC;
        String sortField = switch (sort) {
            case "title" -> "title";
            case "type" -> "type";
            case "createdAt" -> "createdAt";
            default -> "updatedAt";
        };
        return PageRequest.of(page, size, Sort.by(sortDirection, sortField));
    }
}
