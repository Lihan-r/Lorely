package com.lorely.controller;

import com.lorely.dto.request.CreateRelationshipRequest;
import com.lorely.dto.request.UpdateRelationshipRequest;
import com.lorely.dto.response.RelationshipResponse;
import com.lorely.exception.ForbiddenException;
import com.lorely.model.Project;
import com.lorely.model.Relationship;
import com.lorely.security.UserPrincipal;
import com.lorely.service.ProjectService;
import com.lorely.service.RelationshipService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Relationships", description = "Entity relationship management")
public class RelationshipController {

    private final RelationshipService relationshipService;
    private final ProjectService projectService;

    @PostMapping("/api/projects/{projectId}/relationships")
    @Operation(summary = "Create a new relationship between entities")
    public ResponseEntity<RelationshipResponse> createRelationship(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID projectId,
            @Valid @RequestBody CreateRelationshipRequest request) {
        verifyProjectOwnership(projectId, userPrincipal.getUserId());
        RelationshipResponse response = relationshipService.createRelationship(projectId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/api/projects/{projectId}/relationships")
    @Operation(summary = "List relationships in a project")
    public ResponseEntity<List<RelationshipResponse>> getRelationships(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID projectId,
            @RequestParam(required = false) String type) {
        verifyProjectOwnership(projectId, userPrincipal.getUserId());

        List<RelationshipResponse> relationships;
        if (type != null) {
            relationships = relationshipService.getRelationshipsByProjectAndType(projectId, type);
        } else {
            relationships = relationshipService.getRelationshipsByProject(projectId);
        }
        return ResponseEntity.ok(relationships);
    }

    @GetMapping("/api/entities/{entityId}/relationships")
    @Operation(summary = "Get relationships for a specific entity")
    public ResponseEntity<List<RelationshipResponse>> getEntityRelationships(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID entityId) {
        List<RelationshipResponse> relationships = relationshipService.getRelationshipsForEntity(entityId);
        if (!relationships.isEmpty()) {
            verifyProjectOwnership(relationships.get(0).getProjectId(), userPrincipal.getUserId());
        }
        return ResponseEntity.ok(relationships);
    }

    @GetMapping("/api/relationships/{id}")
    @Operation(summary = "Get a single relationship by ID")
    public ResponseEntity<RelationshipResponse> getRelationship(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID id) {
        Relationship relationship = relationshipService.getRelationshipById(id);
        verifyProjectOwnership(relationship.getProjectId(), userPrincipal.getUserId());
        return ResponseEntity.ok(relationshipService.getRelationshipResponseById(id));
    }

    @PutMapping("/api/relationships/{id}")
    @Operation(summary = "Update a relationship")
    public ResponseEntity<RelationshipResponse> updateRelationship(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID id,
            @Valid @RequestBody UpdateRelationshipRequest request) {
        Relationship relationship = relationshipService.getRelationshipById(id);
        verifyProjectOwnership(relationship.getProjectId(), userPrincipal.getUserId());
        RelationshipResponse response = relationshipService.updateRelationship(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/api/relationships/{id}")
    @Operation(summary = "Delete a relationship")
    public ResponseEntity<Void> deleteRelationship(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID id) {
        Relationship relationship = relationshipService.getRelationshipById(id);
        verifyProjectOwnership(relationship.getProjectId(), userPrincipal.getUserId());
        relationshipService.deleteRelationship(id);
        return ResponseEntity.noContent().build();
    }

    private void verifyProjectOwnership(UUID projectId, UUID userId) {
        Project project = projectService.getProjectById(projectId);
        if (!project.getOwnerId().equals(userId)) {
            throw new ForbiddenException("You do not have permission to access this project");
        }
    }
}
