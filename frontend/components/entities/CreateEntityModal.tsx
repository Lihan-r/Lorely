"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EntityType } from "@/lib/api";
import { Button } from "@/components/ui/Button";

interface CreateEntityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string) => Promise<void>;
  entityType: EntityType;
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

const typePlaceholders: Record<EntityType, string> = {
  CHARACTER: "Elara the Wise",
  LOCATION: "The Crystal Caverns",
  FACTION: "The Silver Order",
  ITEM: "The Moonblade",
  EVENT: "The Great War",
  CHAPTER: "Chapter 1: Beginnings",
  CONCEPT: "Magic System",
};

export function CreateEntityModal({ isOpen, onClose, onSubmit, entityType }: CreateEntityModalProps) {
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(title.trim());
      setTitle("");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create entity");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-ink/60"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
            className="relative bg-paper rounded-xl shadow-xl w-full max-w-md mx-4 p-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center justify-between mb-6"
            >
              <h2 className="text-xl font-semibold text-ink">
                Create New {typeLabels[entityType]}
              </h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-2 text-ink/60 hover:text-ink transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </motion.div>

            <form onSubmit={handleSubmit}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mb-6"
              >
                <label htmlFor="entityTitle" className="block text-sm font-medium text-ink/70 mb-2">
                  Title
                </label>
                <input
                  id="entityTitle"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={typePlaceholders[entityType]}
                  className="w-full px-4 py-3 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                  autoFocus
                />
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-600"
                  >
                    {error}
                  </motion.p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex gap-3 justify-end"
              >
                <Button type="button" variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={isLoading}>
                  {isLoading ? "Creating..." : `Create ${typeLabels[entityType]}`}
                </Button>
              </motion.div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
