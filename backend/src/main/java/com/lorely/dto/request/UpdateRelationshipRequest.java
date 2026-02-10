package com.lorely.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateRelationshipRequest {

    private String relationType;

    private UUID contextEntityId;
}
