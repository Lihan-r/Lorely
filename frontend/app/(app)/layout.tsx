"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppHeader } from "@/components/layout/AppHeader";
import { PageTransition } from "@/components/animations/PageTransition";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="h-screen flex flex-col bg-bg-surface">
        <AppHeader />
        <div className="flex flex-1 overflow-hidden">
          <PageTransition>{children}</PageTransition>
        </div>
      </div>
    </ProtectedRoute>
  );
}
