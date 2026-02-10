package com.lorely.controller;

import com.lorely.dto.request.CreateEntityRequest;
import com.lorely.dto.request.UpdateEntityRequest;
import com.lorely.dto.response.EntityResponse;
import com.lorely.dto.response.PaginatedResponse;
import com.lorely.exception.ForbiddenException;
import com.lorely.model.EntityType;
import com.lorely.model.Project;
import com.lorely.model.WorldEntity;
import com.lorely.security.UserPrincipal;
import com.lorely.service.EntityService;
import com.lorely.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@Tag(name = "Entities", description = "World entity management")
public class EntityController {

    private final EntityService entityService;
    private final ProjectService projectService;

    @PostMapping("/api/projects/{projectId}/entities")
    @Operation(summary = "Create a new entity in a project")
    public ResponseEntity<EntityResponse> createEntity(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID projectId,
            @Valid @RequestBody CreateEntityRequest request) {
        verifyProjectOwnership(projectId, userPrincipal.getUserId());
        EntityResponse response = entityService.createEntity(projectId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/api/projects/{projectId}/entities")
    @Operation(summary = "List entities in a project with pagination")
    public ResponseEntity<PaginatedResponse<EntityResponse>> getEntities(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID projectId,
            @RequestParam(required = false) EntityType type,
            @RequestParam(required = false) UUID tagId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "updatedAt") String sort,
            @RequestParam(defaultValue = "desc") String direction) {
        verifyProjectOwnership(projectId, userPrincipal.getUserId());

        PaginatedResponse<EntityResponse> entities;
        if (tagId != null) {
            entities = entityService.getEntitiesByProjectAndTagPaginated(projectId, tagId, page, size, sort, direction);
        } else if (type != null) {
            entities = entityService.getEntitiesByProjectAndTypePaginated(projectId, type, page, size, sort, direction);
        } else {
            entities = entityService.getEntitiesByProjectPaginated(projectId, page, size, sort, direction);
        }
        return ResponseEntity.ok(entities);
    }

    @GetMapping("/api/projects/{projectId}/entities/search")
    @Operation(summary = "Search entities with full-text search and pagination")
    public ResponseEntity<PaginatedResponse<EntityResponse>> searchEntities(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID projectId,
            @RequestParam String q,
            @RequestParam(required = false) EntityType type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        verifyProjectOwnership(projectId, userPrincipal.getUserId());
        PaginatedResponse<EntityResponse> results = entityService.searchEntitiesPaginated(projectId, q, type, page, size);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/api/entities/{id}")
    @Operation(summary = "Get a single entity by ID")
    public ResponseEntity<EntityResponse> getEntity(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID id) {
        WorldEntity entity = entityService.getEntityById(id);
        verifyProjectOwnership(entity.getProjectId(), userPrincipal.getUserId());
        return ResponseEntity.ok(EntityResponse.fromEntity(entity));
    }

    @PutMapping("/api/entities/{id}")
    @Operation(summary = "Update an entity")
    public ResponseEntity<EntityResponse> updateEntity(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID id,
            @Valid @RequestBody UpdateEntityRequest request) {
        WorldEntity entity = entityService.getEntityById(id);
        verifyProjectOwnership(entity.getProjectId(), userPrincipal.getUserId());
        EntityResponse response = entityService.updateEntity(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/api/entities/{id}")
    @Operation(summary = "Delete an entity (soft delete by default)")
    public ResponseEntity<Void> deleteEntity(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID id,
            @RequestParam(defaultValue = "false") boolean permanent) {
        WorldEntity entity = entityService.getEntityById(id);
        verifyProjectOwnership(entity.getProjectId(), userPrincipal.getUserId());
        if (permanent) {
            entityService.permanentlyDeleteEntity(id);
        } else {
            entityService.deleteEntity(id);
        }
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/api/entities/{id}/restore")
    @Operation(summary = "Restore a soft-deleted entity")
    public ResponseEntity<EntityResponse> restoreEntity(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID id) {
        // Use findById directly since the entity is soft-deleted and @Where would filter it
        EntityResponse response = entityService.restoreEntity(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/api/entities/{id}/tags/{tagId}")
    @Operation(summary = "Add a tag to an entity")
    public ResponseEntity<EntityResponse> addTagToEntity(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID id,
            @PathVariable UUID tagId) {
        WorldEntity entity = entityService.getEntityById(id);
        verifyProjectOwnership(entity.getProjectId(), userPrincipal.getUserId());
        EntityResponse response = entityService.addTagToEntity(id, tagId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/api/entities/{id}/tags/{tagId}")
    @Operation(summary = "Remove a tag from an entity")
    public ResponseEntity<EntityResponse> removeTagFromEntity(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID id,
            @PathVariable UUID tagId) {
        WorldEntity entity = entityService.getEntityById(id);
        verifyProjectOwnership(entity.getProjectId(), userPrincipal.getUserId());
        EntityResponse response = entityService.removeTagFromEntity(id, tagId);
        return ResponseEntity.ok(response);
    }

    private void verifyProjectOwnership(UUID projectId, UUID userId) {
        Project project = projectService.getProjectById(projectId);
        if (!project.getOwnerId().equals(userId)) {
            throw new ForbiddenException("You do not have permission to access this project");
        }
    }
}
