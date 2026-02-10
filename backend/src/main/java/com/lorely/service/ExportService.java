package com.lorely.service;

import com.lorely.dto.export.*;
import com.lorely.dto.request.ImportRequest;
import com.lorely.dto.response.ProjectResponse;
import com.lorely.exception.ResourceNotFoundException;
import com.lorely.exception.ValidationException;
import com.lorely.model.*;
import com.lorely.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ExportService {

    private final ProjectRepository projectRepository;
    private final EntityRepository entityRepository;
    private final RelationshipRepository relationshipRepository;
    private final LinkRepository linkRepository;
    private final TagRepository tagRepository;

    @Transactional(readOnly = true)
    public ProjectExportWrapper exportProject(UUID projectId) {
        log.debug("Exporting project {}", projectId);

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        // Export entities with tags
        List<WorldEntity> entities = entityRepository.findAllByProjectIdWithTags(projectId);
        List<EntityExportData> entityExports = entities.stream()
                .map(e -> EntityExportData.builder()
                        .id(e.getId())
                        .type(e.getType())
                        .title(e.getTitle())
                        .content(e.getContent())
                        .tagNames(e.getTags().stream().map(Tag::getName).collect(Collectors.toList()))
                        .createdAt(e.getCreatedAt())
                        .updatedAt(e.getUpdatedAt())
                        .build())
                .collect(Collectors.toList());

        // Export relationships
        List<Relationship> relationships = relationshipRepository.findByProjectIdOrderByCreatedAtDesc(projectId);
        List<RelationshipExportData> relationshipExports = relationships.stream()
                .map(r -> RelationshipExportData.builder()
                        .id(r.getId())
                        .fromEntityId(r.getFromEntityId())
                        .toEntityId(r.getToEntityId())
                        .relationType(r.getRelationType())
                        .contextEntityId(r.getContextEntityId())
                        .createdAt(r.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        // Export links
        List<Link> links = linkRepository.findByProjectIdOrderByCreatedAtDesc(projectId);
        List<LinkExportData> linkExports = links.stream()
                .map(l -> LinkExportData.builder()
                        .id(l.getId())
                        .fromEntityId(l.getFromEntityId())
                        .toEntityId(l.getToEntityId())
                        .note(l.getNote())
                        .createdAt(l.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        // Export tags
        List<Tag> tags = tagRepository.findByProjectIdOrderByNameAsc(projectId);
        List<TagExportData> tagExports = tags.stream()
                .map(t -> TagExportData.builder()
                        .name(t.getName())
                        .color(t.getColor())
                        .build())
                .collect(Collectors.toList());

        ProjectExportData projectData = ProjectExportData.builder()
                .name(project.getName())
                .entities(entityExports)
                .relationships(relationshipExports)
                .links(linkExports)
                .tags(tagExports)
                .build();

        log.info("Project {} exported: {} entities, {} relationships, {} links, {} tags",
                projectId, entityExports.size(), relationshipExports.size(), linkExports.size(), tagExports.size());

        return ProjectExportWrapper.builder()
                .version("1.0")
                .exportedAt(Instant.now())
                .project(projectData)
                .build();
    }

    @Transactional
    public ProjectResponse importProject(UUID ownerId, ImportRequest request) {
        log.debug("Importing project for user {}", ownerId);

        ProjectExportData data = request.getProject();
        if (data == null || data.getName() == null) {
            throw new ValidationException("Invalid import data: project name is required");
        }

        // Create the project
        Project project = Project.builder()
                .ownerId(ownerId)
                .name(data.getName())
                .build();
        Project savedProject = projectRepository.save(project);
        UUID projectId = savedProject.getId();

        // Create tags first (need the mapping for entity-tag associations)
        Map<String, Tag> tagMap = new HashMap<>();
        if (data.getTags() != null) {
            for (TagExportData tagData : data.getTags()) {
                Tag tag = Tag.builder()
                        .projectId(projectId)
                        .name(tagData.getName())
                        .color(tagData.getColor() != null ? tagData.getColor() : "#808080")
                        .build();
                Tag savedTag = tagRepository.save(tag);
                tagMap.put(tagData.getName(), savedTag);
            }
        }

        // Create entities and build old-ID to new-ID mapping
        Map<UUID, UUID> entityIdMap = new HashMap<>();
        if (data.getEntities() != null) {
            for (EntityExportData entityData : data.getEntities()) {
                WorldEntity entity = WorldEntity.builder()
                        .projectId(projectId)
                        .type(entityData.getType())
                        .title(entityData.getTitle())
                        .content(entityData.getContent() != null ? entityData.getContent() : new HashMap<>())
                        .build();

                WorldEntity savedEntity = entityRepository.save(entity);
                if (entityData.getId() != null) {
                    entityIdMap.put(entityData.getId(), savedEntity.getId());
                }

                // Associate tags
                if (entityData.getTagNames() != null) {
                    for (String tagName : entityData.getTagNames()) {
                        Tag tag = tagMap.get(tagName);
                        if (tag != null) {
                            savedEntity.getTags().add(tag);
                        }
                    }
                    entityRepository.save(savedEntity);
                }
            }
        }

        // Create relationships with remapped IDs
        if (data.getRelationships() != null) {
            for (RelationshipExportData relData : data.getRelationships()) {
                UUID fromId = entityIdMap.get(relData.getFromEntityId());
                UUID toId = entityIdMap.get(relData.getToEntityId());
                if (fromId == null || toId == null) {
                    log.warn("Skipping relationship with unmapped entity IDs: from={}, to={}",
                            relData.getFromEntityId(), relData.getToEntityId());
                    continue;
                }

                UUID contextId = null;
                if (relData.getContextEntityId() != null) {
                    contextId = entityIdMap.get(relData.getContextEntityId());
                }

                Relationship relationship = Relationship.builder()
                        .projectId(projectId)
                        .fromEntityId(fromId)
                        .toEntityId(toId)
                        .relationType(relData.getRelationType())
                        .contextEntityId(contextId)
                        .build();
                relationshipRepository.save(relationship);
            }
        }

        // Create links with remapped IDs
        if (data.getLinks() != null) {
            for (LinkExportData linkData : data.getLinks()) {
                UUID fromId = entityIdMap.get(linkData.getFromEntityId());
                UUID toId = entityIdMap.get(linkData.getToEntityId());
                if (fromId == null || toId == null) {
                    log.warn("Skipping link with unmapped entity IDs: from={}, to={}",
                            linkData.getFromEntityId(), linkData.getToEntityId());
                    continue;
                }

                Link link = Link.builder()
                        .projectId(projectId)
                        .fromEntityId(fromId)
                        .toEntityId(toId)
                        .note(linkData.getNote())
                        .build();
                linkRepository.save(link);
            }
        }

        log.info("Project imported: {} with {} entities", savedProject.getId(),
                data.getEntities() != null ? data.getEntities().size() : 0);

        return ProjectResponse.fromProject(savedProject);
    }
}
