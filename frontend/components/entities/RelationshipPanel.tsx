"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api, EntityResponse, RelationshipResponse, ApiException } from "@/lib/api";
import { RELATIONSHIP_CATEGORIES, getRelationshipLabel } from "@/lib/relationshipTypes";

interface RelationshipPanelProps {
  entityId: string;
  projectId: string;
  allEntities: EntityResponse[];
  onRelationshipsChange?: () => void;
}

export function RelationshipPanel({
  entityId,
  projectId,
  allEntities,
  onRelationshipsChange,
}: RelationshipPanelProps) {
  const [relationships, setRelationships] = useState<RelationshipResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedTargetId, setSelectedTargetId] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadRelationships();
  }, [entityId]);

  const loadRelationships = async () => {
    try {
      setIsLoading(true);
      const data = await api.getEntityRelationships(entityId);
      setRelationships(data);
    } catch (err) {
      console.error("Failed to load relationships", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRelationship = async () => {
    if (!selectedTargetId || !selectedType) return;

    setIsSubmitting(true);
    try {
      await api.createRelationship(projectId, {
        fromEntityId: entityId,
        toEntityId: selectedTargetId,
        relationType: selectedType,
      });
      await loadRelationships();
      setShowAddForm(false);
      setSelectedTargetId("");
      setSelectedType("");
      onRelationshipsChange?.();
    } catch (err) {
      if (err instanceof ApiException) {
        alert(err.error.message);
      } else {
        alert("Failed to add relationship");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRelationship = async (relationshipId: string) => {
    if (!confirm("Delete this relationship?")) return;

    try {
      await api.deleteRelationship(relationshipId);
      setRelationships(relationships.filter((r) => r.id !== relationshipId));
      onRelationshipsChange?.();
    } catch (err) {
      console.error("Failed to delete relationship", err);
    }
  };

  // Filter out the current entity from available targets
  const availableTargets = allEntities.filter((e) => e.id !== entityId);

  // Group relationships by direction
  const outgoing = relationships.filter((r) => r.fromEntityId === entityId);
  const incoming = relationships.filter((r) => r.toEntityId === entityId);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-cream rounded w-24 mb-4"></div>
        <div className="h-8 bg-cream rounded mb-2"></div>
        <div className="h-8 bg-cream rounded"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-ink/60">Relationships</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-sm text-ink/60 hover:text-ink flex items-center gap-1"
        >
          {showAddForm ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add
            </>
          )}
        </button>
      </div>

      {/* Add relationship form */}
      {showAddForm && (
        <div className="mb-4 p-4 bg-cream/50 rounded-lg border border-border-light">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-ink/60 mb-1">
                Relationship Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border-light rounded-lg bg-paper focus:outline-none focus:border-ink/40"
              >
                <option value="">Select type...</option>
                {Object.entries(RELATIONSHIP_CATEGORIES).map(([category, types]) => (
                  <optgroup key={category} label={category}>
                    {types.map((type) => (
                      <option key={type} value={type}>
                        {getRelationshipLabel(type)}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-ink/60 mb-1">
                Target Entity
              </label>
              <select
                value={selectedTargetId}
                onChange={(e) => setSelectedTargetId(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border-light rounded-lg bg-paper focus:outline-none focus:border-ink/40"
              >
                <option value="">Select entity...</option>
                {availableTargets.map((entity) => (
                  <option key={entity.id} value={entity.id}>
                    {entity.title} ({entity.type.toLowerCase()})
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleAddRelationship}
              disabled={!selectedTargetId || !selectedType || isSubmitting}
              className="w-full px-4 py-2 bg-ink text-paper text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-ink/90 transition-colors"
            >
              {isSubmitting ? "Adding..." : "Add Relationship"}
            </button>
          </div>
        </div>
      )}

      {/* Relationship list */}
      {relationships.length === 0 ? (
        <p className="text-sm text-ink/40">No relationships yet</p>
      ) : (
        <div className="space-y-4">
          {/* Outgoing relationships */}
          {outgoing.length > 0 && (
            <div>
              <h3 className="text-xs font-medium text-ink/40 mb-2">Outgoing</h3>
              <ul className="space-y-2">
                {outgoing.map((rel) => {
                  const target = allEntities.find((e) => e.id === rel.toEntityId);
                  return (
                    <li
                      key={rel.id}
                      className="flex items-center justify-between text-sm bg-cream/30 rounded-lg px-3 py-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-ink/40">→</span>
                        <span className="text-ink/60">
                          {getRelationshipLabel(rel.relationType)}
                        </span>
                        <Link
                          href={`/projects/${projectId}/entities/${rel.toEntityId}`}
                          className="font-medium text-ink hover:underline"
                        >
                          {target?.title || rel.toEntityTitle || "Unknown"}
                        </Link>
                      </div>
                      <button
                        onClick={() => handleDeleteRelationship(rel.id)}
                        className="text-ink/40 hover:text-red-500 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Incoming relationships */}
          {incoming.length > 0 && (
            <div>
              <h3 className="text-xs font-medium text-ink/40 mb-2">Incoming</h3>
              <ul className="space-y-2">
                {incoming.map((rel) => {
                  const source = allEntities.find((e) => e.id === rel.fromEntityId);
                  return (
                    <li
                      key={rel.id}
                      className="flex items-center justify-between text-sm bg-cream/30 rounded-lg px-3 py-2"
                    >
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/projects/${projectId}/entities/${rel.fromEntityId}`}
                          className="font-medium text-ink hover:underline"
                        >
                          {source?.title || rel.fromEntityTitle || "Unknown"}
                        </Link>
                        <span className="text-ink/60">
                          {getRelationshipLabel(rel.relationType)}
                        </span>
                        <span className="text-ink/40">→</span>
                      </div>
                      <button
                        onClick={() => handleDeleteRelationship(rel.id)}
                        className="text-ink/40 hover:text-red-500 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
