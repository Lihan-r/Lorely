package com.lorely.controller;

import com.lorely.dto.request.CreateTagRequest;
import com.lorely.dto.request.UpdateTagRequest;
import com.lorely.dto.response.TagResponse;
import com.lorely.exception.ForbiddenException;
import com.lorely.model.Project;
import com.lorely.model.Tag;
import com.lorely.security.UserPrincipal;
import com.lorely.service.ProjectService;
import com.lorely.service.TagService;
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
public class TagController {

    private final TagService tagService;
    private final ProjectService projectService;

    @PostMapping("/api/projects/{projectId}/tags")
    public ResponseEntity<TagResponse> createTag(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID projectId,
            @Valid @RequestBody CreateTagRequest request) {
        verifyProjectOwnership(projectId, userPrincipal.getUserId());
        TagResponse response = tagService.createTag(projectId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/api/projects/{projectId}/tags")
    public ResponseEntity<List<TagResponse>> getTags(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID projectId) {
        verifyProjectOwnership(projectId, userPrincipal.getUserId());
        List<TagResponse> tags = tagService.getTagsByProject(projectId);
        return ResponseEntity.ok(tags);
    }

    @GetMapping("/api/tags/{id}")
    public ResponseEntity<TagResponse> getTag(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID id) {
        Tag tag = tagService.getTagById(id);
        verifyProjectOwnership(tag.getProjectId(), userPrincipal.getUserId());
        return ResponseEntity.ok(TagResponse.fromTag(tag));
    }

    @PutMapping("/api/tags/{id}")
    public ResponseEntity<TagResponse> updateTag(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID id,
            @Valid @RequestBody UpdateTagRequest request) {
        Tag tag = tagService.getTagById(id);
        verifyProjectOwnership(tag.getProjectId(), userPrincipal.getUserId());
        TagResponse response = tagService.updateTag(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/api/tags/{id}")
    public ResponseEntity<Void> deleteTag(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID id) {
        Tag tag = tagService.getTagById(id);
        verifyProjectOwnership(tag.getProjectId(), userPrincipal.getUserId());
        tagService.deleteTag(id);
        return ResponseEntity.noContent().build();
    }

    private void verifyProjectOwnership(UUID projectId, UUID userId) {
        Project project = projectService.getProjectById(projectId);
        if (!project.getOwnerId().equals(userId)) {
            throw new ForbiddenException("You do not have permission to access this project");
        }
    }
}
