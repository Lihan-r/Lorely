package com.lorely.controller;

import com.lorely.dto.request.CreateProjectRequest;
import com.lorely.dto.request.UpdateProjectRequest;
import com.lorely.dto.response.PaginatedResponse;
import com.lorely.dto.response.ProjectResponse;
import com.lorely.exception.ForbiddenException;
import com.lorely.model.Project;
import com.lorely.security.UserPrincipal;
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
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@Tag(name = "Projects", description = "Project management")
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    @Operation(summary = "Create a new project")
    public ResponseEntity<ProjectResponse> createProject(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody CreateProjectRequest request) {
        ProjectResponse response = projectService.createProject(userPrincipal.getUserId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @Operation(summary = "List user's projects with pagination")
    public ResponseEntity<PaginatedResponse<ProjectResponse>> getProjects(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "updatedAt") String sort,
            @RequestParam(defaultValue = "desc") String direction) {
        PaginatedResponse<ProjectResponse> projects = projectService.getProjectsByOwnerPaginated(
                userPrincipal.getUserId(), page, size, sort, direction);
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a single project by ID")
    public ResponseEntity<ProjectResponse> getProject(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID id) {
        Project project = projectService.getProjectById(id);
        verifyOwnership(project, userPrincipal.getUserId());
        return ResponseEntity.ok(ProjectResponse.fromProject(project));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a project")
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
    @Operation(summary = "Delete a project (soft delete by default)")
    public ResponseEntity<Void> deleteProject(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID id,
            @RequestParam(defaultValue = "false") boolean permanent) {
        Project project = projectService.getProjectById(id);
        verifyOwnership(project, userPrincipal.getUserId());
        if (permanent) {
            projectService.permanentlyDeleteProject(id);
        } else {
            projectService.deleteProject(id);
        }
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/restore")
    @Operation(summary = "Restore a soft-deleted project")
    public ResponseEntity<ProjectResponse> restoreProject(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID id) {
        Project project = projectService.getProjectByIdIncludeDeleted(id);
        verifyOwnership(project, userPrincipal.getUserId());
        ProjectResponse response = projectService.restoreProject(id);
        return ResponseEntity.ok(response);
    }

    private void verifyOwnership(Project project, UUID userId) {
        if (!project.getOwnerId().equals(userId)) {
            throw new ForbiddenException("You do not have permission to access this project");
        }
    }
}
