ALTER TABLE entities ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE projects ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;

CREATE INDEX idx_entities_not_deleted ON entities(project_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_projects_not_deleted ON projects(owner_id) WHERE deleted_at IS NULL;
