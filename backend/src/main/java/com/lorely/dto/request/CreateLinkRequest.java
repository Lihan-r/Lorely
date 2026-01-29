package com.lorely.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateLinkRequest {

    @NotNull(message = "From entity ID is required")
    private UUID fromEntityId;

    @NotNull(message = "To entity ID is required")
    private UUID toEntityId;

    private String note;
}
