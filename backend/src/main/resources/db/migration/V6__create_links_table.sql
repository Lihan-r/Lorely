-- Create links table for simple connections between entities
CREATE TABLE links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    from_entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
    to_entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT unique_link UNIQUE (project_id, from_entity_id, to_entity_id)
);

-- Create indexes for performance
CREATE INDEX idx_links_project ON links(project_id);
CREATE INDEX idx_links_from_entity ON links(from_entity_id);
CREATE INDEX idx_links_to_entity ON links(to_entity_id);
