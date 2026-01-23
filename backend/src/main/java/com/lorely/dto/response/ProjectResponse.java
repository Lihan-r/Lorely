package com.lorely.dto.response;

import com.lorely.model.Project;
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
public class ProjectResponse {

    private UUID id;
    private UUID ownerId;
    private String name;
    private Instant createdAt;
    private Instant updatedAt;

    public static ProjectResponse fromProject(Project project) {
        return ProjectResponse.builder()
                .id(project.getId())
                .ownerId(project.getOwnerId())
                .name(project.getName())
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .build();
    }
}
