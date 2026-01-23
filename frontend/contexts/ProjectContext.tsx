"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api, ProjectResponse, ApiException } from "@/lib/api";

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

interface ProjectProviderProps {
  projectId: string;
  children: ReactNode;
}

export function ProjectProvider({ projectId, children }: ProjectProviderProps) {
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

  return (
    <ProjectContext.Provider value={{ project, isLoading, error, refresh: loadProject }}>
      {children}
    </ProjectContext.Provider>
  );
}
