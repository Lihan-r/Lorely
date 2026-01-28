"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ProjectProvider, useProject } from "@/contexts/ProjectContext";
import { ModeSwitcher } from "@/components/layout/ModeSwitcher";

function ProjectLayoutContent({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const projectId = params.projectId as string;
  const { project, isLoading, error, refresh } = useProject();

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ink"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={refresh}
            className="text-ink underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col">
      {/* Slim header with back link, project name, and mode switcher */}
      <header className="shrink-0 h-12 px-4 border-b border-border-light bg-paper flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/projects"
            className="text-sm text-ink/50 hover:text-ink flex items-center gap-1 shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Projects
          </Link>
          <span className="text-ink/20">|</span>
          <Link
            href={`/projects/${projectId}`}
            className="text-sm font-semibold text-ink truncate hover:text-ink/80"
          >
            {project?.name || "Project"}
          </Link>
        </div>
        <ModeSwitcher projectId={projectId} />
      </header>

      {/* Content area */}
      <div className="flex-1 overflow-auto min-w-0 min-h-0">
        {children}
      </div>
    </div>
  );
}

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const projectId = params.projectId as string;

  return (
    <ProjectProvider projectId={projectId}>
      <ProjectLayoutContent>{children}</ProjectLayoutContent>
    </ProjectProvider>
  );
}
