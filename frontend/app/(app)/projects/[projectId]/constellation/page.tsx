"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { api, EntityResponse, RelationshipResponse } from "@/lib/api";
import { ConstellationView } from "@/components/graph/ConstellationView";

function getEntityTypeColor(type: string): string {
  const colors: Record<string, string> = {
    CHARACTER: "#6366f1",
    LOCATION: "#22c55e",
    FACTION: "#f59e0b",
    ITEM: "#ec4899",
    EVENT: "#8b5cf6",
    CHAPTER: "#06b6d4",
    CONCEPT: "#f97316",
  };
  return colors[type] || "#6b7280";
}

export default function ConstellationPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;

  const [entities, setEntities] = useState<EntityResponse[]>([]);
  const [relationships, setRelationships] = useState<RelationshipResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEntityId, setSelectedEntityId] = useState<string | undefined>();

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        setError(null);

        const [entitiesData, relationshipsData] = await Promise.all([
          api.getEntities(projectId),
          api.getRelationships(projectId),
        ]);

        setEntities(entitiesData);
        setRelationships(relationshipsData);
      } catch (err) {
        setError("Failed to load graph data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [projectId]);

  const handleEntityClick = (entityId: string) => {
    setSelectedEntityId(entityId);
  };

  const handleViewEntity = () => {
    if (selectedEntityId) {
      router.push(`/projects/${projectId}/plan/entities/${selectedEntityId}`);
    }
  };

  const selectedEntity = entities.find((e) => e.id === selectedEntityId);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ink"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-ink underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="shrink-0 px-6 py-4 border-b border-border-light flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-ink">Constellation</h1>
          <p className="text-sm text-ink/60 mt-1">
            {entities.length} entities, {relationships.length} relationships
          </p>
        </div>
      </div>

      {/* Graph area */}
      <div className="flex-1 min-h-0 flex">
        {/* Graph */}
        <div className="flex-1 min-w-0 p-4">
          <div className="w-full h-full relative">
            <ConstellationView
              entities={entities}
              relationships={relationships}
              onEntityClick={handleEntityClick}
              selectedEntityId={selectedEntityId}
            />
          </div>
        </div>

        {/* Side panel for selected entity */}
        {selectedEntity && (
          <div className="w-80 shrink-0 border-l border-border-light bg-paper p-4 overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span
                  className="inline-block px-2 py-0.5 text-xs font-medium rounded-full mb-2"
                  style={{
                    backgroundColor: getEntityTypeColor(selectedEntity.type) + "20",
                    color: getEntityTypeColor(selectedEntity.type),
                  }}
                >
                  {selectedEntity.type}
                </span>
                <h3 className="text-lg font-semibold text-ink">{selectedEntity.title}</h3>
              </div>
              <button
                onClick={() => setSelectedEntityId(undefined)}
                className="text-ink/40 hover:text-ink"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Relationships */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-ink/60 mb-2">Relationships</h4>
              {relationships.filter(
                (r) => r.fromEntityId === selectedEntityId || r.toEntityId === selectedEntityId
              ).length === 0 ? (
                <p className="text-sm text-ink/40">No relationships</p>
              ) : (
                <ul className="space-y-2">
                  {relationships
                    .filter(
                      (r) => r.fromEntityId === selectedEntityId || r.toEntityId === selectedEntityId
                    )
                    .map((rel) => {
                      const isFrom = rel.fromEntityId === selectedEntityId;
                      const otherEntity = entities.find(
                        (e) => e.id === (isFrom ? rel.toEntityId : rel.fromEntityId)
                      );
                      return (
                        <li
                          key={rel.id}
                          className="text-sm text-ink/80 flex items-center gap-2"
                        >
                          <span className="text-ink/40">{isFrom ? "\u2192" : "\u2190"}</span>
                          <span className="text-ink/60">{rel.relationType.replace(/_/g, " ").toLowerCase()}</span>
                          <span className="font-medium">{otherEntity?.title || "Unknown"}</span>
                        </li>
                      );
                    })}
                </ul>
              )}
            </div>

            {/* Tags */}
            {selectedEntity.tags.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-ink/60 mb-2">Tags</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedEntity.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-2 py-0.5 text-xs rounded-full"
                      style={{
                        backgroundColor: tag.color + "20",
                        color: tag.color,
                      }}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <button
              onClick={handleViewEntity}
              className="w-full px-4 py-2 bg-ink text-paper rounded-lg text-sm font-medium hover:bg-ink/90 transition-colors"
            >
              View Entity
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
