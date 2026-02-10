package com.lorely.dto.export;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectExportWrapper {
    private String version;
    private Instant exportedAt;
    private ProjectExportData project;
}
