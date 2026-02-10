package com.lorely.controller;

import com.lorely.dto.request.CreateLinkRequest;
import com.lorely.dto.response.LinkResponse;
import com.lorely.exception.ForbiddenException;
import com.lorely.model.Link;
import com.lorely.model.Project;
import com.lorely.security.UserPrincipal;
import com.lorely.service.LinkService;
import com.lorely.service.ProjectService;
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
@Tag(name = "Links", description = "Entity link management")
public class LinkController {

    private final LinkService linkService;
    private final ProjectService projectService;

    @PostMapping("/api/projects/{projectId}/links")
    @Operation(summary = "Create a new link between entities")
    public ResponseEntity<LinkResponse> createLink(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID projectId,
            @Valid @RequestBody CreateLinkRequest request) {
        verifyProjectOwnership(projectId, userPrincipal.getUserId());
        LinkResponse response = linkService.createLink(projectId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/api/projects/{projectId}/links")
    @Operation(summary = "List links in a project")
    public ResponseEntity<List<LinkResponse>> getLinks(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID projectId) {
        verifyProjectOwnership(projectId, userPrincipal.getUserId());
        List<LinkResponse> links = linkService.getLinksByProject(projectId);
        return ResponseEntity.ok(links);
    }

    @GetMapping("/api/entities/{entityId}/links")
    @Operation(summary = "Get links for a specific entity")
    public ResponseEntity<List<LinkResponse>> getEntityLinks(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID entityId) {
        List<LinkResponse> links = linkService.getLinksForEntity(entityId);
        if (!links.isEmpty()) {
            verifyProjectOwnership(links.get(0).getProjectId(), userPrincipal.getUserId());
        }
        return ResponseEntity.ok(links);
    }

    @DeleteMapping("/api/links/{id}")
    @Operation(summary = "Delete a link")
    public ResponseEntity<Void> deleteLink(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID id) {
        Link link = linkService.getLinkById(id);
        verifyProjectOwnership(link.getProjectId(), userPrincipal.getUserId());
        linkService.deleteLink(id);
        return ResponseEntity.noContent().build();
    }

    private void verifyProjectOwnership(UUID projectId, UUID userId) {
        Project project = projectService.getProjectById(projectId);
        if (!project.getOwnerId().equals(userId)) {
            throw new ForbiddenException("You do not have permission to access this project");
        }
    }
}
