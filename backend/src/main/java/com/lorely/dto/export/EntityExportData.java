package com.lorely.dto.export;

import com.lorely.model.EntityType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EntityExportData {
    private UUID id;
    private EntityType type;
    private String title;
    private Map<String, Object> content;
    private List<String> tagNames;
    private Instant createdAt;
    private Instant updatedAt;
}
