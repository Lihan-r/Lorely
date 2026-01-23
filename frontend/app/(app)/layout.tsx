"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppHeader } from "@/components/layout/AppHeader";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="h-screen flex flex-col bg-bg-light">
        <AppHeader />
        <div className="flex flex-1 overflow-hidden">
          {children}
        </div>
      </div>
    </ProtectedRoute>
  );
}
