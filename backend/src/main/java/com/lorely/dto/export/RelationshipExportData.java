package com.lorely.dto.export;

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
public class RelationshipExportData {
    private UUID id;
    private UUID fromEntityId;
    private UUID toEntityId;
    private String relationType;
    private UUID contextEntityId;
    private Instant createdAt;
}
