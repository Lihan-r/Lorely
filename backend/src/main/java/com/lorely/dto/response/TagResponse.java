package com.lorely.dto.response;

import com.lorely.model.Tag;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TagResponse {

    private UUID id;
    private UUID projectId;
    private String name;
    private String color;

    public static TagResponse fromTag(Tag tag) {
        return TagResponse.builder()
                .id(tag.getId())
                .projectId(tag.getProjectId())
                .name(tag.getName())
                .color(tag.getColor())
                .build();
    }
}
