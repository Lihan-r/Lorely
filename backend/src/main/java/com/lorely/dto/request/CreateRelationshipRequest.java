package com.lorely.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateRelationshipRequest {

    @NotNull(message = "From entity ID is required")
    private UUID fromEntityId;

    @NotNull(message = "To entity ID is required")
    private UUID toEntityId;

    @NotBlank(message = "Relation type is required")
    private String relationType;

    private UUID contextEntityId;
}
