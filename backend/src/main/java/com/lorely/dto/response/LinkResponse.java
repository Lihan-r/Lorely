package com.lorely.dto.response;

import com.lorely.model.Link;
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
public class LinkResponse {

    private UUID id;
    private UUID projectId;
    private UUID fromEntityId;
    private UUID toEntityId;
    private String note;
    private Instant createdAt;

    // Optional: Include entity details for display
    private String fromEntityTitle;
    private String toEntityTitle;

    public static LinkResponse fromLink(Link link) {
        return LinkResponse.builder()
                .id(link.getId())
                .projectId(link.getProjectId())
                .fromEntityId(link.getFromEntityId())
                .toEntityId(link.getToEntityId())
                .note(link.getNote())
                .createdAt(link.getCreatedAt())
                .build();
    }

    public static LinkResponse fromLinkWithTitles(
            Link link,
            String fromTitle,
            String toTitle) {
        return LinkResponse.builder()
                .id(link.getId())
                .projectId(link.getProjectId())
                .fromEntityId(link.getFromEntityId())
                .toEntityId(link.getToEntityId())
                .note(link.getNote())
                .createdAt(link.getCreatedAt())
                .fromEntityTitle(fromTitle)
                .toEntityTitle(toTitle)
                .build();
    }
}
