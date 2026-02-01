"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { api, EntityResponse, EntityType, ApiException } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { EntityCard } from "./EntityCard";
import { CreateEntityModal } from "./CreateEntityModal";
import { SkeletonGrid } from "@/components/ui/Skeleton";

interface EntityListProps {
  projectId: string;
  type?: EntityType;
  title: string;
  emptyMessage: string;
}

const typeIcons: Record<EntityType, React.ReactNode> = {
  CHARACTER: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  LOCATION: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  FACTION: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  ITEM: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  EVENT: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  CHAPTER: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  CONCEPT: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
};

export function EntityList({ projectId, type, title, emptyMessage }: EntityListProps) {
  const router = useRouter();
  const [entities, setEntities] = useState<EntityResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadEntities = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.getEntities(projectId, type);
      setEntities(data);
    } catch (err) {
      if (err instanceof ApiException) {
        setError(err.error.message);
      } else {
        setError("Failed to load entities");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEntities();
  }, [projectId, type]);

  const handleCreateEntity = async (entityTitle: string) => {
    if (!type) return;
    const newEntity = await api.createEntity(projectId, { type, title: entityTitle });
    setEntities([newEntity, ...entities]);
  };

  const handleDeleteEntity = async (id: string) => {
    if (!confirm("Are you sure you want to delete this entity?")) {
      return;
    }

    try {
      await api.deleteEntity(id);
      setEntities(entities.filter((e) => e.id !== id));
    } catch (err) {
      if (err instanceof ApiException) {
        alert(err.error.message);
      } else {
        alert("Failed to delete entity");
      }
    }
  };

  const handleEditEntity = (id: string) => {
    router.push(`/projects/${projectId}/plan/entities/${id}`);
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 w-32 bg-bg-elevated rounded animate-pulse" />
          <div className="h-9 w-28 bg-bg-elevated rounded animate-pulse" />
        </div>
        <SkeletonGrid count={6} type="entity" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
          <button
            onClick={loadEntities}
            className="ml-4 underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-semibold text-ink">{title}</h1>
        {type && (
          <Button variant="primary" size="sm" onClick={() => setShowCreateModal(true)}>
            Add {title.slice(0, -1)}
          </Button>
        )}
      </div>

      {entities.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-paper rounded-xl border border-border-light p-12 text-center"
        >
          <div className="max-w-sm mx-auto">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mx-auto mb-4 text-ink/40"
            >
              {type ? typeIcons[type] : typeIcons.CHARACTER}
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-ink/60 mb-6"
            >
              {emptyMessage}
            </motion.p>
            {type && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                  Create First {title.slice(0, -1)}
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {entities.map((entity, index) => (
            <EntityCard
              key={entity.id}
              entity={entity}
              index={index}
              onEdit={handleEditEntity}
              onDelete={handleDeleteEntity}
            />
          ))}
        </div>
      )}

      {type && (
        <CreateEntityModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateEntity}
          entityType={type}
        />
      )}
    </div>
  );
}
