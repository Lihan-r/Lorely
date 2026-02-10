-- Indexes for common sort columns used in pagination
CREATE INDEX IF NOT EXISTS idx_entities_project_updated_at ON entities(project_id, updated_at);
CREATE INDEX IF NOT EXISTS idx_entities_project_title ON entities(project_id, title);
CREATE INDEX IF NOT EXISTS idx_projects_owner_updated_at ON projects(owner_id, updated_at);
