"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api, EntityResponse, EntityType } from "@/lib/api";
import { useProject } from "@/contexts/ProjectContext";
import { Button } from "@/components/ui/Button";

const entityTypes: { type: EntityType; label: string; pluralLabel: string }[] = [
  { type: "CHARACTER", label: "Character", pluralLabel: "Characters" },
  { type: "LOCATION", label: "Location", pluralLabel: "Locations" },
  { type: "FACTION", label: "Faction", pluralLabel: "Factions" },
  { type: "ITEM", label: "Item", pluralLabel: "Items" },
  { type: "EVENT", label: "Event", pluralLabel: "Events" },
  { type: "CHAPTER", label: "Chapter", pluralLabel: "Chapters" },
  { type: "CONCEPT", label: "Concept", pluralLabel: "Concepts" },
];

const typeRoutes: Record<EntityType, string> = {
  CHARACTER: "characters",
  LOCATION: "locations",
  FACTION: "factions",
  ITEM: "items",
  EVENT: "events",
  CHAPTER: "chapters",
  CONCEPT: "concepts",
};

export default function PlanOverviewPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;
  const { project } = useProject();
  const [recentEntities, setRecentEntities] = useState<EntityResponse[]>([]);
  const [entityCounts, setEntityCounts] = useState<Record<EntityType, number>>({} as Record<EntityType, number>);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOverviewData = async () => {
      try {
        setIsLoading(true);
        const entities = await api.getEntities(projectId);

        // Get recent entities (last 5)
        setRecentEntities(entities.slice(0, 5));

        // Count by type
        const counts = entities.reduce((acc, entity) => {
          acc[entity.type] = (acc[entity.type] || 0) + 1;
          return acc;
        }, {} as Record<EntityType, number>);
        setEntityCounts(counts);
      } catch (err) {
        console.error("Failed to load overview data", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadOverviewData();
  }, [projectId]);

  const totalEntities = Object.values(entityCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-semibold text-ink mb-2">
          {project?.name || "Project Overview"}
        </h1>
        <p className="text-ink/60">
          {totalEntities} {totalEntities === 1 ? "entity" : "entities"} in this project
        </p>
      </div>

      {/* Entity Type Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {entityTypes.map(({ type, pluralLabel }) => (
          <Link
            key={type}
            href={`/projects/${projectId}/plan/${typeRoutes[type]}`}
            className="bg-paper rounded-lg border border-border-light p-4 hover:border-ink/20 hover:shadow-sm transition-all"
          >
            <div className="text-2xl font-semibold text-ink mb-1">
              {entityCounts[type] || 0}
            </div>
            <div className="text-sm text-ink/60">{pluralLabel}</div>
          </Link>
        ))}
      </div>

      {/* Recent Entities */}
      <div className="bg-paper rounded-xl border border-border-light p-6">
        <h2 className="text-lg font-semibold text-ink mb-4">Recent Activity</h2>

        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-ink"></div>
          </div>
        ) : recentEntities.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-ink/60 mb-4">No entities yet. Start building your world!</p>
            <Button variant="primary" onClick={() => router.push(`/projects/${projectId}/plan/characters`)}>
              Create Your First Character
            </Button>
          </div>
        ) : (
          <ul className="space-y-3">
            {recentEntities.map((entity) => (
              <li key={entity.id}>
                <Link
                  href={`/projects/${projectId}/plan/entities/${entity.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-cream/50 transition-colors"
                >
                  <div>
                    <span className="font-medium text-ink">{entity.title}</span>
                    <span className="ml-2 text-xs text-ink/50">{entity.type.toLowerCase()}</span>
                  </div>
                  <span className="text-xs text-ink/40">
                    {new Date(entity.updatedAt).toLocaleDateString()}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
