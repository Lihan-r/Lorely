package com.lorely.dto.response;

import com.lorely.model.EntityType;
import com.lorely.model.WorldEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EntityResponse {

    private UUID id;
    private UUID projectId;
    private EntityType type;
    private String title;
    private Map<String, Object> content;
    private List<TagResponse> tags;
    private Instant createdAt;
    private Instant updatedAt;

    public static EntityResponse fromEntity(WorldEntity entity) {
        List<TagResponse> tagResponses = entity.getTags() != null
                ? entity.getTags().stream().map(TagResponse::fromTag).collect(Collectors.toList())
                : List.of();

        return EntityResponse.builder()
                .id(entity.getId())
                .projectId(entity.getProjectId())
                .type(entity.getType())
                .title(entity.getTitle())
                .content(entity.getContent())
                .tags(tagResponses)
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
