package com.lorely.dto.request;

import com.lorely.dto.export.ProjectExportData;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImportRequest {
    private String version;

    @NotNull(message = "Project data is required")
    private ProjectExportData project;
}
