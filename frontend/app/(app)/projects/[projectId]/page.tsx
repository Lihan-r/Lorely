"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api, EntityType } from "@/lib/api";
import { useProject } from "@/contexts/ProjectContext";

const modeCards = [
  {
    key: "plan",
    title: "Plan",
    description: "Organize entities & lore",
    href: (id: string) => `/projects/${id}/plan`,
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    key: "constellation",
    title: "Constellation",
    description: "Visualize your world",
    href: (id: string) => `/projects/${id}/constellation`,
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
  {
    key: "write",
    title: "Write",
    description: "Draft your story",
    href: (id: string) => `/projects/${id}/write`,
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
  },
];

export default function ProjectDashboardPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const { project } = useProject();
  const [totalEntities, setTotalEntities] = useState(0);
  const [totalRelationships, setTotalRelationships] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoading(true);
        const [entities, relationships] = await Promise.all([
          api.getEntities(projectId),
          api.getRelationships(projectId),
        ]);
        setTotalEntities(entities.length);
        setTotalRelationships(relationships.length);
      } catch (err) {
        console.error("Failed to load stats", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, [projectId]);

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif font-semibold text-ink mb-2">
            {project?.name || "Project"}
          </h1>
          {!isLoading && (
            <p className="text-ink/60">
              {totalEntities} {totalEntities === 1 ? "entity" : "entities"}, {totalRelationships}{" "}
              {totalRelationships === 1 ? "relationship" : "relationships"}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {modeCards.map((mode) => (
            <Link
              key={mode.key}
              href={mode.href(projectId)}
              className="bg-paper rounded-xl border border-border-light p-6 text-center hover:border-ink/20 hover:shadow-md transition-all group"
            >
              <div className="w-14 h-14 bg-cream rounded-full flex items-center justify-center mx-auto mb-4 text-ink/60 group-hover:text-ink transition-colors">
                {mode.icon}
              </div>
              <h2 className="text-lg font-semibold text-ink mb-1">{mode.title}</h2>
              <p className="text-sm text-ink/60">{mode.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
