"use client";

import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/Button";

function ProjectsContent() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-bg-light">
      {/* Header */}
      <header className="bg-paper border-b border-border-light">
        <div className="container-wide flex items-center justify-between h-16">
          <span className="text-2xl font-serif font-semibold text-ink">
            Lorely
          </span>
          <div className="flex items-center gap-4">
            <span className="text-sm text-ink/60">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-wide py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-serif font-semibold text-ink">
            Your Projects
          </h1>
          <Button variant="primary">Create Project</Button>
        </div>

        {/* Empty State */}
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
            <Button variant="primary">Create Your First Project</Button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <ProtectedRoute>
      <ProjectsContent />
    </ProtectedRoute>
  );
}
