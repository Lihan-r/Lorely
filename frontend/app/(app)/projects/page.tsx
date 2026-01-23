"use client";

import { useState, useEffect } from "react";
import { api, ProjectResponse, ApiException } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { CreateProjectModal } from "@/components/projects/CreateProjectModal";
import { Sidebar } from "@/components/layout/Sidebar";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.getProjects();
      setProjects(data);
    } catch (err) {
      if (err instanceof ApiException) {
        setError(err.error.message);
      } else {
        setError("Failed to load projects");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreateProject = async (name: string) => {
    const newProject = await api.createProject({ name });
    setProjects([newProject, ...projects]);
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      return;
    }

    try {
      await api.deleteProject(id);
      setProjects(projects.filter((p) => p.id !== id));
    } catch (err) {
      if (err instanceof ApiException) {
        alert(err.error.message);
      } else {
        alert("Failed to delete project");
      }
    }
  };

  return (
    <div className="h-full flex">
      <Sidebar />
      <main className="flex-1 overflow-auto p-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ink"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
            <button
              onClick={loadProjects}
              className="ml-4 underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-serif font-semibold text-ink">
                Your Projects
              </h1>
              <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                Create Project
              </Button>
            </div>

            {projects.length === 0 ? (
              <div className="bg-paper rounded-xl border border-border-light p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-ink/40"
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
                  <h2 className="text-xl font-semibold text-ink mb-2">
                    No projects yet
                  </h2>
                  <p className="text-ink/60 mb-6">
                    Create your first project to start building your world.
                  </p>
                  <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                    Create Your First Project
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onDelete={handleDeleteProject}
                  />
                ))}
              </div>
            )}

            <CreateProjectModal
              isOpen={showCreateModal}
              onClose={() => setShowCreateModal(false)}
              onSubmit={handleCreateProject}
            />
          </>
        )}
      </main>
    </div>
  );
}
