-- Add a tsvector column for full-text search
ALTER TABLE entities ADD COLUMN search_vector tsvector;

-- Populate from title + content JSONB text values
UPDATE entities SET search_vector =
    to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(content::text, ''));

-- Create GIN index
CREATE INDEX idx_entities_search_vector ON entities USING gin(search_vector);

-- Trigger to auto-update on insert/update
CREATE OR REPLACE FUNCTION entities_search_vector_update() RETURNS trigger AS $$
BEGIN
    NEW.search_vector := to_tsvector('english', COALESCE(NEW.title, '') || ' ' || COALESCE(NEW.content::text, ''));
    RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER entities_search_vector_trigger
    BEFORE INSERT OR UPDATE ON entities
    FOR EACH ROW EXECUTE FUNCTION entities_search_vector_update();
