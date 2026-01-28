"use client";

import { useParams } from "next/navigation";
import { useProject } from "@/contexts/ProjectContext";
import { Sidebar } from "@/components/layout/Sidebar";

export default function PlanLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const projectId = params.projectId as string;
  const { project } = useProject();

  return (
    <div className="h-full w-full flex">
      <Sidebar projectId={projectId} projectName={project?.name} />
      <div className="flex-1 overflow-auto min-w-0">
        {children}
      </div>
    </div>
  );
}
