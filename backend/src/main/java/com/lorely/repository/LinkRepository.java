package com.lorely.repository;

import com.lorely.model.Link;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LinkRepository extends JpaRepository<Link, UUID> {

    List<Link> findByProjectIdOrderByCreatedAtDesc(UUID projectId);

    List<Link> findByFromEntityIdOrToEntityIdOrderByCreatedAtDesc(UUID fromEntityId, UUID toEntityId);

    void deleteByProjectId(UUID projectId);
}
