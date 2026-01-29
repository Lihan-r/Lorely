"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api, EntityResponse, EntityType, TagResponse, LinkResponse, ApiException } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { TipTapEditor } from "@/components/editor/TipTapEditor";
import { RelationshipPanel } from "@/components/entities/RelationshipPanel";
import { ChevronLeft, Trash2, Link2, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";

const typeLabels: Record<EntityType, string> = {
  CHARACTER: "Character",
  LOCATION: "Location",
  FACTION: "Faction",
  ITEM: "Item",
  EVENT: "Event",
  CHAPTER: "Chapter",
  CONCEPT: "Concept",
};

const typeRoutes: Record<EntityType, string> = {
  CHARACTER: "characters",
  LOCATION: "locations",
  FACTION: "factions",
  ITEM: "items",
  EVENT: "events",
  CHAPTER: "chapters",
  CONCEPT: "concepts",
};

export default function EntityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;
  const entityId = params.entityId as string;

  const [entity, setEntity] = useState<EntityResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [projectTags, setProjectTags] = useState<TagResponse[]>([]);
  const [allEntities, setAllEntities] = useState<EntityResponse[]>([]);
  const [links, setLinks] = useState<LinkResponse[]>([]);

  // Link creation state
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [newLinkEntityId, setNewLinkEntityId] = useState("");
  const [newLinkNote, setNewLinkNote] = useState("");

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [entityData, tagsData, entitiesData, linksData] = await Promise.all([
        api.getEntity(entityId),
        api.getTags(projectId),
        api.getEntities(projectId),
        api.getEntityLinks(entityId),
      ]);
      setEntity(entityData);
      setEditTitle(entityData.title);
      setEditContent(entityData.content?.text as string || "");
      setProjectTags(tagsData);
      setAllEntities(entitiesData);
      setLinks(linksData);
    } catch (err) {
      if (err instanceof ApiException) {
        setError(err.error.message);
      } else {
        setError("Failed to load entity");
      }
    } finally {
      setIsLoading(false);
    }
  }, [entityId, projectId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSave = async () => {
    if (!entity) return;

    setIsSaving(true);
    try {
      const content = { ...entity.content, text: editContent };
      const updated = await api.updateEntity(entityId, {
        title: editTitle,
        content,
      });
      setEntity(updated);
      setIsEditing(false);
    } catch (err) {
      if (err instanceof ApiException) {
        alert(err.error.message);
      } else {
        alert("Failed to save changes");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!entity) return;
    if (!confirm("Are you sure you want to delete this entity? This action cannot be undone.")) {
      return;
    }

    try {
      await api.deleteEntity(entityId);
      router.push(`/projects/${projectId}/plan/${typeRoutes[entity.type]}`);
    } catch (err) {
      if (err instanceof ApiException) {
        alert(err.error.message);
      } else {
        alert("Failed to delete entity");
      }
    }
  };

  const handleAddTag = async (tagId: string) => {
    if (!entity) return;
    try {
      const updated = await api.addTagToEntity(entityId, tagId);
      setEntity(updated);
    } catch (err) {
      console.error("Failed to add tag", err);
    }
  };

  const handleRemoveTag = async (tagId: string) => {
    if (!entity) return;
    try {
      const updated = await api.removeTagFromEntity(entityId, tagId);
      setEntity(updated);
    } catch (err) {
      console.error("Failed to remove tag", err);
    }
  };

  const handleAddLink = async () => {
    if (!newLinkEntityId) return;
    try {
      await api.createLink(projectId, {
        fromEntityId: entityId,
        toEntityId: newLinkEntityId,
        note: newLinkNote || undefined,
      });
      setIsAddingLink(false);
      setNewLinkEntityId("");
      setNewLinkNote("");
      await loadData();
    } catch (err) {
      console.error("Failed to create link", err);
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    try {
      await api.deleteLink(linkId);
      await loadData();
    } catch (err) {
      console.error("Failed to delete link", err);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 bg-bg-deep min-h-full">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
        </div>
      </div>
    );
  }

  if (error || !entity) {
    return (
      <div className="p-8 bg-bg-deep min-h-full">
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-red-400">
          {error || "Entity not found"}
          <Link
            href={`/projects/${projectId}/plan`}
            className="ml-4 underline hover:no-underline"
          >
            Back to project
          </Link>
        </div>
      </div>
    );
  }

  const availableTags = projectTags.filter(
    (t) => !entity.tags.some((et) => et.id === t.id)
  );

  const availableEntitiesForLink = allEntities.filter(
    (e) => e.id !== entityId && !links.some((l) => l.fromEntityId === e.id || l.toEntityId === e.id)
  );

  return (
    <div className="p-8 max-w-4xl bg-bg-deep min-h-full">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href={`/projects/${projectId}/plan/${typeRoutes[entity.type]}`}
          className="text-sm text-text-muted hover:text-text-primary flex items-center gap-1 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to {typeLabels[entity.type]}s
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <span className="text-xs px-2 py-0.5 rounded-full bg-bg-elevated text-text-muted font-medium">
            {typeLabels[entity.type]}
          </span>
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="mt-2 w-full text-3xl font-serif font-semibold text-text-primary bg-transparent border-b-2 border-border-subtle focus:border-accent focus:outline-none"
            />
          ) : (
            <h1 className="mt-2 text-3xl font-serif font-semibold text-text-primary">
              {entity.title}
            </h1>
          )}
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsEditing(false);
                  setEditTitle(entity.title);
                  setEditContent(entity.content?.text as string || "");
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDelete}>
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Tags */}
      <div className="mb-6">
        <h2 className="text-sm font-medium text-text-muted mb-2">Tags</h2>
        <div className="flex flex-wrap gap-2">
          {entity.tags.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center gap-1 text-sm px-2 py-1 rounded-full"
              style={{ backgroundColor: tag.color + "20", color: tag.color }}
            >
              {tag.name}
              <button
                onClick={() => handleRemoveTag(tag.id)}
                className="hover:opacity-70"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
          {availableTags.length > 0 && (
            <select
              onChange={(e) => {
                if (e.target.value) {
                  handleAddTag(e.target.value);
                  e.target.value = "";
                }
              }}
              className="text-sm px-2 py-1 border border-border-subtle rounded-lg bg-bg-elevated text-text-muted focus:outline-none focus:border-accent"
              defaultValue=""
            >
              <option value="">+ Add tag</option>
              {availableTags.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Relationships */}
      <div className="mb-6 bg-bg-surface rounded-xl border border-border-subtle p-6">
        <RelationshipPanel
          entityId={entityId}
          projectId={projectId}
          allEntities={allEntities}
        />
      </div>

      {/* Links */}
      <div className="mb-6 bg-bg-surface rounded-xl border border-border-subtle p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-text-muted flex items-center gap-2">
            <Link2 className="w-4 h-4" />
            Links
          </h2>
          {!isAddingLink && (
            <Button variant="ghost" size="sm" onClick={() => setIsAddingLink(true)}>
              <Plus className="w-4 h-4 mr-1" />
              Add Link
            </Button>
          )}
        </div>

        {/* Add Link Form */}
        {isAddingLink && (
          <div className="mb-4 p-4 bg-bg-elevated rounded-lg border border-border-subtle">
            <div className="space-y-3">
              <div>
                <label className="text-xs text-text-muted block mb-1">Link to Entity</label>
                <Select value={newLinkEntityId} onValueChange={setNewLinkEntityId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an entity..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableEntitiesForLink.map((e) => (
                      <SelectItem key={e.id} value={e.id}>
                        {e.title} ({e.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-text-muted block mb-1">Note (optional)</label>
                <Input
                  value={newLinkNote}
                  onChange={(e) => setNewLinkNote(e.target.value)}
                  placeholder="Add a note..."
                />
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setIsAddingLink(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleAddLink} disabled={!newLinkEntityId}>
                  Create Link
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Links List */}
        {links.length === 0 ? (
          <p className="text-sm text-text-muted">No links yet</p>
        ) : (
          <ul className="space-y-2">
            {links.map((link) => {
              const isFrom = link.fromEntityId === entityId;
              const otherEntityId = isFrom ? link.toEntityId : link.fromEntityId;
              const otherEntity = allEntities.find((e) => e.id === otherEntityId);
              return (
                <li
                  key={link.id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-bg-elevated transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <Link2 className="w-4 h-4 text-accent-muted" />
                    <Link
                      href={`/projects/${projectId}/plan/entities/${otherEntityId}`}
                      className="text-sm text-text-primary hover:text-accent transition-colors"
                    >
                      {otherEntity?.title || "Unknown"}
                    </Link>
                    {link.note && (
                      <span className="text-xs text-text-muted">({link.note})</span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteLink(link.id)}
                    className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-red-400 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Content */}
      <div className="bg-bg-surface rounded-xl border border-border-subtle p-6">
        <h2 className="text-sm font-medium text-text-muted mb-4">Content</h2>
        <TipTapEditor
          content={editContent}
          onChange={setEditContent}
          placeholder="Write about this entity..."
          editable={isEditing}
        />
      </div>

      {/* Metadata */}
      <div className="mt-6 text-sm text-text-muted">
        <p>Created: {new Date(entity.createdAt).toLocaleString()}</p>
        <p>Updated: {new Date(entity.updatedAt).toLocaleString()}</p>
      </div>
    </div>
  );
}
