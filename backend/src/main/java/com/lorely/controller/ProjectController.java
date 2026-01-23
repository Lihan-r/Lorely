package com.lorely.controller;

import com.lorely.dto.request.CreateProjectRequest;
import com.lorely.dto.request.UpdateProjectRequest;
import com.lorely.dto.response.ProjectResponse;
import com.lorely.exception.ForbiddenException;
import com.lorely.model.Project;
import com.lorely.security.UserPrincipal;
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
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody CreateProjectRequest request) {
        ProjectResponse response = projectService.createProject(userPrincipal.getUserId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getProjects(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<ProjectResponse> projects = projectService.getProjectsByOwner(userPrincipal.getUserId());
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getProject(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID id) {
        Project project = projectService.getProjectById(id);
        verifyOwnership(project, userPrincipal.getUserId());
        return ResponseEntity.ok(ProjectResponse.fromProject(project));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponse> updateProject(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID id,
            @Valid @RequestBody UpdateProjectRequest request) {
        Project project = projectService.getProjectById(id);
        verifyOwnership(project, userPrincipal.getUserId());
        ProjectResponse response = projectService.updateProject(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID id) {
        Project project = projectService.getProjectById(id);
        verifyOwnership(project, userPrincipal.getUserId());
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }

    private void verifyOwnership(Project project, UUID userId) {
        if (!project.getOwnerId().equals(userId)) {
            throw new ForbiddenException("You do not have permission to access this project");
        }
    }
}
