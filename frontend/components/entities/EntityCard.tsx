"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { EntityResponse, EntityType } from "@/lib/api";

interface EntityCardProps {
  entity: EntityResponse;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  index?: number;
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
  CHARACTER: "bg-entity-character/20 text-entity-character",
  LOCATION: "bg-entity-location/20 text-entity-location",
  FACTION: "bg-entity-faction/20 text-entity-faction",
  ITEM: "bg-entity-item/20 text-entity-item",
  EVENT: "bg-entity-event/20 text-entity-event",
  CHAPTER: "bg-entity-chapter/20 text-entity-chapter",
  CONCEPT: "bg-entity-concept/20 text-entity-concept",
};

export function EntityCard({ entity, onDelete, onEdit, index = 0 }: EntityCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        delay: index * 0.075,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      whileHover={{
        scale: 1.03,
        transition: { duration: 0.2 },
      }}
      className="bg-paper rounded-lg border border-border-light hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5 transition-colors group"
    >
      <Link
        href={`/projects/${entity.projectId}/plan/entities/${entity.id}`}
        className="block p-4"
      >
        <div className="flex items-start justify-between mb-2">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[entity.type]}`}>
            {typeLabels[entity.type]}
          </span>
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {onEdit && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEdit(entity.id);
                }}
                className="p-1 text-ink/40 hover:text-accent transition-colors"
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
              </motion.button>
            )}
            {onDelete && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete(entity.id);
                }}
                className="p-1 text-ink/40 hover:text-red-600 transition-colors"
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
              </motion.button>
            )}
          </motion.div>
        </div>
        <h3 className="text-base font-medium text-ink mb-1 group-hover:text-accent transition-colors">
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
    </motion.div>
  );
}
