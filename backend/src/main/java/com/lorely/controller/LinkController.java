package com.lorely.controller;

import com.lorely.dto.request.CreateLinkRequest;
import com.lorely.dto.response.LinkResponse;
import com.lorely.exception.ForbiddenException;
import com.lorely.model.Link;
import com.lorely.model.Project;
import com.lorely.security.UserPrincipal;
import com.lorely.service.LinkService;
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
public class LinkController {

    private final LinkService linkService;
    private final ProjectService projectService;

    @PostMapping("/api/projects/{projectId}/links")
    public ResponseEntity<LinkResponse> createLink(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID projectId,
            @Valid @RequestBody CreateLinkRequest request) {
        verifyProjectOwnership(projectId, userPrincipal.getUserId());
        LinkResponse response = linkService.createLink(projectId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/api/projects/{projectId}/links")
    public ResponseEntity<List<LinkResponse>> getLinks(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID projectId) {
        verifyProjectOwnership(projectId, userPrincipal.getUserId());
        List<LinkResponse> links = linkService.getLinksByProject(projectId);
        return ResponseEntity.ok(links);
    }

    @GetMapping("/api/entities/{entityId}/links")
    public ResponseEntity<List<LinkResponse>> getEntityLinks(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID entityId) {
        // Get links first, then verify project ownership
        List<LinkResponse> links = linkService.getLinksForEntity(entityId);
        if (!links.isEmpty()) {
            verifyProjectOwnership(links.get(0).getProjectId(), userPrincipal.getUserId());
        }
        return ResponseEntity.ok(links);
    }

    @DeleteMapping("/api/links/{id}")
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
