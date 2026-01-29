package com.lorely.service;

import com.lorely.dto.request.CreateLinkRequest;
import com.lorely.dto.response.LinkResponse;
import com.lorely.exception.ResourceNotFoundException;
import com.lorely.model.Link;
import com.lorely.model.WorldEntity;
import com.lorely.repository.EntityRepository;
import com.lorely.repository.LinkRepository;
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
public class LinkService {

    private final LinkRepository linkRepository;
    private final EntityRepository entityRepository;

    @Transactional
    public LinkResponse createLink(UUID projectId, CreateLinkRequest request) {
        log.debug("Creating link from {} to {} in project {}",
                request.getFromEntityId(), request.getToEntityId(), projectId);

        // Verify entities exist and belong to the project
        WorldEntity fromEntity = entityRepository.findById(request.getFromEntityId())
                .orElseThrow(() -> new ResourceNotFoundException("From entity not found"));
        WorldEntity toEntity = entityRepository.findById(request.getToEntityId())
                .orElseThrow(() -> new ResourceNotFoundException("To entity not found"));

        if (!fromEntity.getProjectId().equals(projectId)) {
            throw new ResourceNotFoundException("From entity does not belong to this project");
        }
        if (!toEntity.getProjectId().equals(projectId)) {
            throw new ResourceNotFoundException("To entity does not belong to this project");
        }

        Link link = Link.builder()
                .projectId(projectId)
                .fromEntityId(request.getFromEntityId())
                .toEntityId(request.getToEntityId())
                .note(request.getNote())
                .build();

        Link savedLink = linkRepository.save(link);
        log.info("Link created: {}", savedLink.getId());

        return LinkResponse.fromLinkWithTitles(
                savedLink,
                fromEntity.getTitle(),
                toEntity.getTitle()
        );
    }

    @Transactional(readOnly = true)
    public List<LinkResponse> getLinksByProject(UUID projectId) {
        log.debug("Fetching all links for project {}", projectId);

        return linkRepository.findByProjectIdOrderByCreatedAtDesc(projectId)
                .stream()
                .map(this::toResponseWithTitles)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<LinkResponse> getLinksForEntity(UUID entityId) {
        log.debug("Fetching links for entity {}", entityId);

        return linkRepository.findByFromEntityIdOrToEntityIdOrderByCreatedAtDesc(entityId, entityId)
                .stream()
                .map(this::toResponseWithTitles)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Link getLinkById(UUID linkId) {
        return linkRepository.findById(linkId)
                .orElseThrow(() -> new ResourceNotFoundException("Link not found"));
    }

    @Transactional(readOnly = true)
    public LinkResponse getLinkResponseById(UUID linkId) {
        Link link = getLinkById(linkId);
        return toResponseWithTitles(link);
    }

    @Transactional
    public void deleteLink(UUID linkId) {
        log.debug("Deleting link {}", linkId);

        Link link = getLinkById(linkId);
        linkRepository.delete(link);

        log.info("Link deleted: {}", linkId);
    }

    private LinkResponse toResponseWithTitles(Link link) {
        String fromTitle = entityRepository.findById(link.getFromEntityId())
                .map(WorldEntity::getTitle)
                .orElse(null);
        String toTitle = entityRepository.findById(link.getToEntityId())
                .map(WorldEntity::getTitle)
                .orElse(null);

        return LinkResponse.fromLinkWithTitles(
                link,
                fromTitle,
                toTitle
        );
    }
}
