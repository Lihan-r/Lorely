"use client";

import Link from "next/link";
import { EntityResponse, EntityType } from "@/lib/api";

interface EntityCardProps {
  entity: EntityResponse;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

const typeLabels: Record<EntityType, string> = {
  CHARACTER: "Character",
  LOCATION: "Location",
  FACTION: "Faction",
  ITEM: "Item",
  EVENT: "Event",
  CHAPTER: "Chapter",
  CONCEPT: "Concept",
};

const typeColors: Record<EntityType, string> = {
  CHARACTER: "bg-blue-100 text-blue-700",
  LOCATION: "bg-green-100 text-green-700",
  FACTION: "bg-purple-100 text-purple-700",
  ITEM: "bg-amber-100 text-amber-700",
  EVENT: "bg-red-100 text-red-700",
  CHAPTER: "bg-teal-100 text-teal-700",
  CONCEPT: "bg-indigo-100 text-indigo-700",
};

export function EntityCard({ entity, onDelete, onEdit }: EntityCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-paper rounded-lg border border-border-light hover:border-ink/20 hover:shadow-sm transition-all group">
      <Link
        href={`/projects/${entity.projectId}/entities/${entity.id}`}
        className="block p-4"
      >
        <div className="flex items-start justify-between mb-2">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[entity.type]}`}>
            {typeLabels[entity.type]}
          </span>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEdit(entity.id);
                }}
                className="p-1 text-ink/40 hover:text-ink transition-all"
                title="Edit entity"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete(entity.id);
                }}
                className="p-1 text-ink/40 hover:text-red-600 transition-all"
                title="Delete entity"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
        <h3 className="text-base font-medium text-ink mb-1 group-hover:text-ink/80">
          {entity.title}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {entity.tags.slice(0, 3).map((tag) => (
              <span
                key={tag.id}
                className="text-xs px-1.5 py-0.5 rounded bg-cream text-ink/70"
                style={{ backgroundColor: tag.color + "20" }}
              >
                {tag.name}
              </span>
            ))}
            {entity.tags.length > 3 && (
              <span className="text-xs text-ink/50">+{entity.tags.length - 3}</span>
            )}
          </div>
          <span className="text-xs text-ink/40">{formatDate(entity.updatedAt)}</span>
        </div>
      </Link>
    </div>
  );
}
