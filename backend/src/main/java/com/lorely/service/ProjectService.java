package com.lorely.service;

import com.lorely.dto.request.CreateProjectRequest;
import com.lorely.dto.request.UpdateProjectRequest;
import com.lorely.dto.response.PaginatedResponse;
import com.lorely.dto.response.ProjectResponse;
import com.lorely.exception.ResourceNotFoundException;
import com.lorely.model.Project;
import com.lorely.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectService {

    private final ProjectRepository projectRepository;

    @Transactional
    public ProjectResponse createProject(UUID ownerId, CreateProjectRequest request) {
        log.debug("Creating project '{}' for user {}", request.getName(), ownerId);

        Project project = Project.builder()
                .ownerId(ownerId)
                .name(request.getName())
                .build();

        Project savedProject = projectRepository.save(project);
        log.info("Project created: {}", savedProject.getId());

        return ProjectResponse.fromProject(savedProject);
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> getProjectsByOwner(UUID ownerId) {
        log.debug("Fetching projects for user {}", ownerId);

        return projectRepository.findByOwnerIdOrderByCreatedAtDesc(ownerId)
                .stream()
                .map(ProjectResponse::fromProject)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PaginatedResponse<ProjectResponse> getProjectsByOwnerPaginated(UUID ownerId, int page, int size, String sort, String direction) {
        log.debug("Fetching paginated projects for user {}", ownerId);

        Sort.Direction sortDirection = "asc".equalsIgnoreCase(direction) ? Sort.Direction.ASC : Sort.Direction.DESC;
        String sortField = switch (sort) {
            case "name" -> "name";
            case "createdAt" -> "createdAt";
            default -> "updatedAt";
        };
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortField));
        Page<Project> projectPage = projectRepository.findByOwnerId(ownerId, pageable);
        return PaginatedResponse.from(projectPage.map(ProjectResponse::fromProject));
    }

    @Transactional(readOnly = true)
    public Project getProjectById(UUID projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
    }

    @Transactional(readOnly = true)
    public Project getProjectByIdIncludeDeleted(UUID projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
    }

    @Transactional(readOnly = true)
    public ProjectResponse getProjectResponseById(UUID projectId) {
        return ProjectResponse.fromProject(getProjectById(projectId));
    }

    @Transactional
    public ProjectResponse updateProject(UUID projectId, UpdateProjectRequest request) {
        log.debug("Updating project {}", projectId);

        Project project = getProjectById(projectId);
        project.setName(request.getName());

        Project savedProject = projectRepository.save(project);
        log.info("Project updated: {}", savedProject.getId());

        return ProjectResponse.fromProject(savedProject);
    }

    @Transactional
    public void deleteProject(UUID projectId) {
        log.debug("Soft-deleting project {}", projectId);

        Project project = getProjectById(projectId);
        project.setDeletedAt(Instant.now());
        projectRepository.save(project);

        log.info("Project soft-deleted: {}", projectId);
    }

    @Transactional
    public void permanentlyDeleteProject(UUID projectId) {
        log.debug("Permanently deleting project {}", projectId);

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        projectRepository.delete(project);

        log.info("Project permanently deleted: {}", projectId);
    }

    @Transactional
    public ProjectResponse restoreProject(UUID projectId) {
        log.debug("Restoring project {}", projectId);

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        project.setDeletedAt(null);
        Project savedProject = projectRepository.save(project);

        log.info("Project restored: {}", projectId);
        return ProjectResponse.fromProject(savedProject);
    }
}
