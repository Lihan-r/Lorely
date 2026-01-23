"use client";

import Link from "next/link";
import { ProjectResponse } from "@/lib/api";

interface ProjectCardProps {
  project: ProjectResponse;
  onDelete?: (id: string) => void;
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-paper rounded-xl border border-border-light p-6 hover:border-ink/20 hover:shadow-sm transition-all group">
      <Link href={`/projects/${project.id}`} className="block">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-cream rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-ink/60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          {onDelete && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(project.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-2 text-ink/40 hover:text-red-600 transition-all"
              title="Delete project"
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
        <h3 className="text-lg font-semibold text-ink mb-2 group-hover:text-ink/80">
          {project.name}
        </h3>
        <p className="text-sm text-ink/50">
          Created {formatDate(project.createdAt)}
        </p>
      </Link>
    </div>
  );
}
