package com.lorely.dto.export;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectExportData {
    private String name;
    private List<EntityExportData> entities;
    private List<RelationshipExportData> relationships;
    private List<LinkExportData> links;
    private List<TagExportData> tags;
}
