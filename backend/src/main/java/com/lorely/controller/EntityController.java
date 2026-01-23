package com.lorely.controller;

import com.lorely.dto.request.CreateEntityRequest;
import com.lorely.dto.request.UpdateEntityRequest;
import com.lorely.dto.response.EntityResponse;
import com.lorely.exception.ForbiddenException;
import com.lorely.model.EntityType;
import com.lorely.model.Project;
import com.lorely.model.WorldEntity;
import com.lorely.security.UserPrincipal;
import com.lorely.service.EntityService;
import com.lorely.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class EntityController {

    private final EntityService entityService;
    private final ProjectService projectService;

    @PostMapping("/api/projects/{projectId}/entities")
    public ResponseEntity<EntityResponse> createEntity(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID projectId,
            @Valid @RequestBody CreateEntityRequest request) {
        verifyProjectOwnership(projectId, userPrincipal.getUserId());
        EntityResponse response = entityService.createEntity(projectId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/api/projects/{projectId}/entities")
    public ResponseEntity<List<EntityResponse>> getEntities(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID projectId,
            @RequestParam(required = false) EntityType type,
            @RequestParam(required = false) UUID tagId) {
        verifyProjectOwnership(projectId, userPrincipal.getUserId());

        List<EntityResponse> entities;
        if (tagId != null) {
            entities = entityService.getEntitiesByProjectAndTag(projectId, tagId);
        } else if (type != null) {
            entities = entityService.getEntitiesByProjectAndType(projectId, type);
        } else {
            entities = entityService.getEntitiesByProject(projectId);
        }
        return ResponseEntity.ok(entities);
    }

    @GetMapping("/api/projects/{projectId}/entities/search")
    public ResponseEntity<List<EntityResponse>> searchEntities(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID projectId,
            @RequestParam String q) {
        verifyProjectOwnership(projectId, userPrincipal.getUserId());
        List<EntityResponse> results = entityService.searchEntities(projectId, q);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/api/entities/{id}")
    public ResponseEntity<EntityResponse> getEntity(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID id) {
        WorldEntity entity = entityService.getEntityById(id);
        verifyProjectOwnership(entity.getProjectId(), userPrincipal.getUserId());
        return ResponseEntity.ok(EntityResponse.fromEntity(entity));
    }

    @PutMapping("/api/entities/{id}")
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
    public ResponseEntity<Void> deleteEntity(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID id) {
        WorldEntity entity = entityService.getEntityById(id);
        verifyProjectOwnership(entity.getProjectId(), userPrincipal.getUserId());
        entityService.deleteEntity(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/api/entities/{id}/tags/{tagId}")
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
