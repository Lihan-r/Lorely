"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { useParams } from "next/navigation";
import { api, ProjectResponse, ApiException } from "@/lib/api";
import { AppHeader } from "@/components/layout/AppHeader";
import { Sidebar } from "@/components/layout/Sidebar";

interface ProjectContextType {
  project: ProjectResponse | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType>({
  project: null,
  isLoading: true,
  error: null,
  refresh: async () => {},
});

export function useProject() {
  return useContext(ProjectContext);
}

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const projectId = params.projectId as string;
  const [project, setProject] = useState<ProjectResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProject = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.getProject(projectId);
      setProject(data);
    } catch (err) {
      if (err instanceof ApiException) {
        setError(err.error.message);
      } else {
        setError("Failed to load project");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      loadProject();
    }
  }, [projectId]);

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
            onClick={loadProject}
            className="text-ink underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProjectContext.Provider value={{ project, isLoading, error, refresh: loadProject }}>
      <div className="h-full flex">
        <Sidebar projectId={projectId} projectName={project?.name} />
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </ProjectContext.Provider>
  );
}
