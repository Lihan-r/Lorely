package com.lorely.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "relationships")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Relationship {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "project_id", nullable = false)
    private UUID projectId;

    @Column(name = "from_entity_id", nullable = false)
    private UUID fromEntityId;

    @Column(name = "to_entity_id", nullable = false)
    private UUID toEntityId;

    @Column(name = "relation_type", nullable = false)
    private String relationType;

    @Column(name = "context_entity_id")
    private UUID contextEntityId;

    @Column(name = "created_at")
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }
}
