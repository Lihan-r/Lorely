package com.lorely.service;

import com.lorely.dto.request.CreateProjectRequest;
import com.lorely.dto.request.UpdateProjectRequest;
import com.lorely.dto.response.ProjectResponse;
import com.lorely.exception.ResourceNotFoundException;
import com.lorely.model.Project;
import com.lorely.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    public Project getProjectById(UUID projectId) {
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
        log.debug("Deleting project {}", projectId);

        Project project = getProjectById(projectId);
        projectRepository.delete(project);

        log.info("Project deleted: {}", projectId);
    }
}
