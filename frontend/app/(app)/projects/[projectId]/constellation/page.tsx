"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { api, EntityResponse, RelationshipResponse, LinkResponse } from "@/lib/api";
import { ConstellationView } from "@/components/graph/ConstellationView";
import { EntityPopup } from "@/components/graph/EntityPopup";
import { ConnectionDialog } from "@/components/graph/ConnectionDialog";
import { Button } from "@/components/ui/Button";
import { X, Link2 } from "lucide-react";

function getEntityTypeColor(type: string): string {
  const colors: Record<string, string> = {
    CHARACTER: "#6b8cae",
    LOCATION: "#5d8a66",
    FACTION: "#a67c52",
    ITEM: "#9c6b7a",
    EVENT: "#7c6b9c",
    CHAPTER: "#5a8a8a",
    CONCEPT: "#8a7c52",
  };
  return colors[type] || "#6b7280";
}

export default function ConstellationPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;

  const [entities, setEntities] = useState<EntityResponse[]>([]);
  const [relationships, setRelationships] = useState<RelationshipResponse[]>([]);
  const [links, setLinks] = useState<LinkResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEntityId, setSelectedEntityId] = useState<string | undefined>();

  // Connection mode state
  const [connectingFromId, setConnectingFromId] = useState<string | null>(null);
  const [connectionTarget, setConnectionTarget] = useState<{
    fromEntity: EntityResponse;
    toEntity: EntityResponse;
  } | null>(null);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [entitiesData, relationshipsData, linksData] = await Promise.all([
        api.getEntities(projectId),
        api.getRelationships(projectId),
        api.getLinks(projectId),
      ]);

      setEntities(entitiesData);
      setRelationships(relationshipsData);
      setLinks(linksData);
    } catch (err) {
      setError("Failed to load graph data");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleEntityClick = (entityId: string) => {
    // If in connecting mode, set the target
    if (connectingFromId && connectingFromId !== entityId) {
      const fromEntity = entities.find((e) => e.id === connectingFromId);
      const toEntity = entities.find((e) => e.id === entityId);
      if (fromEntity && toEntity) {
        setConnectionTarget({ fromEntity, toEntity });
      }
      setConnectingFromId(null);
      return;
    }

    // Otherwise, select the entity
    setSelectedEntityId(entityId);
  };

  const handleViewEntity = () => {
    if (selectedEntityId) {
      router.push(`/projects/${projectId}/plan/entities/${selectedEntityId}`);
    }
  };

  const handleStartConnection = () => {
    if (selectedEntityId) {
      setConnectingFromId(selectedEntityId);
      setSelectedEntityId(undefined);
    }
  };

  const handleCancelConnection = () => {
    setConnectingFromId(null);
  };

  const handleCreateRelationship = async (relationType: string) => {
    if (!connectionTarget) return;

    await api.createRelationship(projectId, {
      fromEntityId: connectionTarget.fromEntity.id,
      toEntityId: connectionTarget.toEntity.id,
      relationType,
    });

    setConnectionTarget(null);
    await loadData();
  };

  const handleCreateLink = async (note: string) => {
    if (!connectionTarget) return;

    await api.createLink(projectId, {
      fromEntityId: connectionTarget.fromEntity.id,
      toEntityId: connectionTarget.toEntity.id,
      note: note || undefined,
    });

    setConnectionTarget(null);
    await loadData();
  };

  const selectedEntity = entities.find((e) => e.id === selectedEntityId);
  const connectingFromEntity = entities.find((e) => e.id === connectingFromId);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-bg-deep">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-bg-deep">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-accent underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-bg-deep">
      {/* Header */}
      <div className="shrink-0 px-6 py-4 border-b border-border-subtle flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-text-primary">Constellation</h1>
          <p className="text-sm text-text-muted mt-1">
            {entities.length} entities, {relationships.length} relationships, {links.length} links
          </p>
        </div>

        {/* Connection mode indicator */}
        {connectingFromEntity && (
          <div className="flex items-center gap-3 px-4 py-2 bg-accent/10 border border-accent/30 rounded-lg">
            <Link2 className="w-4 h-4 text-accent" />
            <span className="text-sm text-text-primary">
              Connecting from <strong className="text-accent">{connectingFromEntity.title}</strong>
            </span>
            <span className="text-xs text-text-muted">Click another entity to connect</span>
            <Button variant="ghost" size="sm" onClick={handleCancelConnection}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Graph area */}
      <div className="flex-1 min-h-0 flex">
        {/* Graph */}
        <div className="flex-1 min-w-0 p-4">
          <div className="w-full h-full relative">
            <ConstellationView
              entities={entities}
              relationships={relationships}
              links={links}
              onEntityClick={handleEntityClick}
              selectedEntityId={selectedEntityId}
            />
          </div>
        </div>

        {/* Side panel for selected entity */}
        {selectedEntity && (
          <div className="w-80 shrink-0 border-l border-border-subtle bg-bg-surface p-4 overflow-y-auto">
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
                <h3 className="text-lg font-semibold text-text-primary">{selectedEntity.title}</h3>
              </div>
              <button
                onClick={() => setSelectedEntityId(undefined)}
                className="text-text-muted hover:text-text-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Relationships */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-text-muted mb-2">Relationships</h4>
              {relationships.filter(
                (r) => r.fromEntityId === selectedEntityId || r.toEntityId === selectedEntityId
              ).length === 0 ? (
                <p className="text-sm text-text-muted">No relationships</p>
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
                          className="text-sm text-text-secondary flex items-center gap-2"
                        >
                          <span className="text-text-muted">{isFrom ? "\u2192" : "\u2190"}</span>
                          <span className="text-text-muted">{rel.relationType.replace(/_/g, " ").toLowerCase()}</span>
                          <span className="font-medium text-text-primary">{otherEntity?.title || "Unknown"}</span>
                        </li>
                      );
                    })}
                </ul>
              )}
            </div>

            {/* Links */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-text-muted mb-2">Links</h4>
              {links.filter(
                (l) => l.fromEntityId === selectedEntityId || l.toEntityId === selectedEntityId
              ).length === 0 ? (
                <p className="text-sm text-text-muted">No links</p>
              ) : (
                <ul className="space-y-2">
                  {links
                    .filter(
                      (l) => l.fromEntityId === selectedEntityId || l.toEntityId === selectedEntityId
                    )
                    .map((link) => {
                      const isFrom = link.fromEntityId === selectedEntityId;
                      const otherEntity = entities.find(
                        (e) => e.id === (isFrom ? link.toEntityId : link.fromEntityId)
                      );
                      return (
                        <li
                          key={link.id}
                          className="text-sm text-text-secondary flex items-center gap-2"
                        >
                          <Link2 className="w-3 h-3 text-accent-muted" />
                          <span className="font-medium text-text-primary">{otherEntity?.title || "Unknown"}</span>
                          {link.note && (
                            <span className="text-text-muted text-xs">({link.note})</span>
                          )}
                        </li>
                      );
                    })}
                </ul>
              )}
            </div>

            {/* Tags */}
            {selectedEntity.tags.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-text-muted mb-2">Tags</h4>
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
            <div className="space-y-2">
              <Button
                onClick={handleStartConnection}
                variant="outline"
                className="w-full"
              >
                <Link2 className="w-4 h-4 mr-2" />
                Connect to...
              </Button>
              <Button
                onClick={handleViewEntity}
                className="w-full"
              >
                View Entity
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Connection Dialog */}
      {connectionTarget && (
        <ConnectionDialog
          isOpen={true}
          onClose={() => setConnectionTarget(null)}
          fromEntity={connectionTarget.fromEntity}
          toEntity={connectionTarget.toEntity}
          onCreateRelationship={handleCreateRelationship}
          onCreateLink={handleCreateLink}
        />
      )}
    </div>
  );
}
