-- Create tags table
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(7) DEFAULT '#808080',
    UNIQUE(project_id, name)
);

-- Create entity_tags join table
CREATE TABLE entity_tags (
    entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (entity_id, tag_id)
);

-- Create indexes
CREATE INDEX idx_tags_project ON tags(project_id);
CREATE INDEX idx_entity_tags_entity ON entity_tags(entity_id);
CREATE INDEX idx_entity_tags_tag ON entity_tags(tag_id);
