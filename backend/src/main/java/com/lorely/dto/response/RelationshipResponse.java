package com.lorely.dto.response;

import com.lorely.model.Relationship;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RelationshipResponse {

    private UUID id;
    private UUID projectId;
    private UUID fromEntityId;
    private UUID toEntityId;
    private String relationType;
    private UUID contextEntityId;
    private Instant createdAt;

    // Optional: Include entity details for graph visualization
    private String fromEntityTitle;
    private String toEntityTitle;
    private String contextEntityTitle;

    public static RelationshipResponse fromRelationship(Relationship relationship) {
        return RelationshipResponse.builder()
                .id(relationship.getId())
                .projectId(relationship.getProjectId())
                .fromEntityId(relationship.getFromEntityId())
                .toEntityId(relationship.getToEntityId())
                .relationType(relationship.getRelationType())
                .contextEntityId(relationship.getContextEntityId())
                .createdAt(relationship.getCreatedAt())
                .build();
    }

    public static RelationshipResponse fromRelationshipWithTitles(
            Relationship relationship,
            String fromTitle,
            String toTitle,
            String contextTitle) {
        return RelationshipResponse.builder()
                .id(relationship.getId())
                .projectId(relationship.getProjectId())
                .fromEntityId(relationship.getFromEntityId())
                .toEntityId(relationship.getToEntityId())
                .relationType(relationship.getRelationType())
                .contextEntityId(relationship.getContextEntityId())
                .createdAt(relationship.getCreatedAt())
                .fromEntityTitle(fromTitle)
                .toEntityTitle(toTitle)
                .contextEntityTitle(contextTitle)
                .build();
    }
}
