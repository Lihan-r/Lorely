package com.lorely.controller;

import com.lorely.dto.export.ProjectExportWrapper;
import com.lorely.dto.request.ImportRequest;
import com.lorely.dto.response.ProjectResponse;
import com.lorely.exception.ForbiddenException;
import com.lorely.model.Project;
import com.lorely.security.UserPrincipal;
import com.lorely.service.ExportService;
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
@Tag(name = "Export/Import", description = "Project export and import")
public class ExportController {

    private final ExportService exportService;
    private final ProjectService projectService;

    @GetMapping("/api/projects/{projectId}/export")
    @Operation(summary = "Export a project as JSON")
    public ResponseEntity<ProjectExportWrapper> exportProject(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID projectId) {
        verifyProjectOwnership(projectId, userPrincipal.getUserId());
        ProjectExportWrapper export = exportService.exportProject(projectId);
        return ResponseEntity.ok(export);
    }

    @PostMapping("/api/projects/import")
    @Operation(summary = "Import a project from JSON")
    public ResponseEntity<ProjectResponse> importProject(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody ImportRequest request) {
        ProjectResponse response = exportService.importProject(userPrincipal.getUserId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    private void verifyProjectOwnership(UUID projectId, UUID userId) {
        Project project = projectService.getProjectById(projectId);
        if (!project.getOwnerId().equals(userId)) {
            throw new ForbiddenException("You do not have permission to access this project");
        }
    }
}
