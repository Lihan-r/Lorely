package com.lorely.service;

import com.lorely.dto.request.CreateTagRequest;
import com.lorely.dto.request.UpdateTagRequest;
import com.lorely.dto.response.TagResponse;
import com.lorely.exception.ResourceNotFoundException;
import com.lorely.exception.ValidationException;
import com.lorely.model.Tag;
import com.lorely.repository.TagRepository;
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
public class TagService {

    private final TagRepository tagRepository;

    @Transactional
    public TagResponse createTag(UUID projectId, CreateTagRequest request) {
        log.debug("Creating tag '{}' in project {}", request.getName(), projectId);

        if (tagRepository.existsByProjectIdAndName(projectId, request.getName())) {
            throw new ValidationException("Tag with this name already exists in the project");
        }

        Tag tag = Tag.builder()
                .projectId(projectId)
                .name(request.getName())
                .color(request.getColor() != null ? request.getColor() : "#808080")
                .build();

        Tag savedTag = tagRepository.save(tag);
        log.info("Tag created: {}", savedTag.getId());

        return TagResponse.fromTag(savedTag);
    }

    @Transactional(readOnly = true)
    public List<TagResponse> getTagsByProject(UUID projectId) {
        log.debug("Fetching tags for project {}", projectId);

        return tagRepository.findByProjectIdOrderByNameAsc(projectId)
                .stream()
                .map(TagResponse::fromTag)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Tag getTagById(UUID tagId) {
        return tagRepository.findById(tagId)
                .orElseThrow(() -> new ResourceNotFoundException("Tag not found"));
    }

    @Transactional(readOnly = true)
    public TagResponse getTagResponseById(UUID tagId) {
        return TagResponse.fromTag(getTagById(tagId));
    }

    @Transactional
    public TagResponse updateTag(UUID tagId, UpdateTagRequest request) {
        log.debug("Updating tag {}", tagId);

        Tag tag = getTagById(tagId);

        // Check if new name conflicts with existing tag
        if (!tag.getName().equals(request.getName()) &&
                tagRepository.existsByProjectIdAndName(tag.getProjectId(), request.getName())) {
            throw new ValidationException("Tag with this name already exists in the project");
        }

        tag.setName(request.getName());
        if (request.getColor() != null) {
            tag.setColor(request.getColor());
        }

        Tag savedTag = tagRepository.save(tag);
        log.info("Tag updated: {}", savedTag.getId());

        return TagResponse.fromTag(savedTag);
    }

    @Transactional
    public void deleteTag(UUID tagId) {
        log.debug("Deleting tag {}", tagId);

        Tag tag = getTagById(tagId);
        tagRepository.delete(tag);

        log.info("Tag deleted: {}", tagId);
    }
}
