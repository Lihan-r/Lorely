"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api, EntityResponse, EntityType, TagResponse, ApiException } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { TipTapEditor } from "@/components/editor/TipTapEditor";
import { RelationshipPanel } from "@/components/entities/RelationshipPanel";

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

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [entityData, tagsData, entitiesData] = await Promise.all([
          api.getEntity(entityId),
          api.getTags(projectId),
          api.getEntities(projectId),
        ]);
        setEntity(entityData);
        setEditTitle(entityData.title);
        setEditContent(entityData.content?.text as string || "");
        setProjectTags(tagsData);
        setAllEntities(entitiesData);
      } catch (err) {
        if (err instanceof ApiException) {
          setError(err.error.message);
        } else {
          setError("Failed to load entity");
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [entityId, projectId]);

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

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ink"></div>
        </div>
      </div>
    );
  }

  if (error || !entity) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
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

  return (
    <div className="p-8 max-w-4xl">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href={`/projects/${projectId}/plan/${typeRoutes[entity.type]}`}
          className="text-sm text-ink/60 hover:text-ink flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to {typeLabels[entity.type]}s
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <span className="text-xs px-2 py-0.5 rounded-full bg-cream text-ink/70 font-medium">
            {typeLabels[entity.type]}
          </span>
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="mt-2 w-full text-3xl font-serif font-semibold text-ink bg-transparent border-b-2 border-ink/20 focus:border-ink focus:outline-none"
            />
          ) : (
            <h1 className="mt-2 text-3xl font-serif font-semibold text-ink">
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
        <h2 className="text-sm font-medium text-ink/60 mb-2">Tags</h2>
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
              className="text-sm px-2 py-1 border border-border-light rounded-lg bg-paper text-ink/60 focus:outline-none focus:border-ink/40"
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
      <div className="mb-6 bg-paper rounded-xl border border-border-light p-6">
        <RelationshipPanel
          entityId={entityId}
          projectId={projectId}
          allEntities={allEntities}
        />
      </div>

      {/* Content */}
      <div className="bg-paper rounded-xl border border-border-light p-6">
        <h2 className="text-sm font-medium text-ink/60 mb-4">Content</h2>
        <TipTapEditor
          content={editContent}
          onChange={setEditContent}
          placeholder="Write about this entity..."
          editable={isEditing}
        />
      </div>

      {/* Metadata */}
      <div className="mt-6 text-sm text-ink/40">
        <p>Created: {new Date(entity.createdAt).toLocaleString()}</p>
        <p>Updated: {new Date(entity.updatedAt).toLocaleString()}</p>
      </div>
    </div>
  );
}
