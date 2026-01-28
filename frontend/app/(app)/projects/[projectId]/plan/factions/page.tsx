"use client";

import { useParams } from "next/navigation";
import { EntityList } from "@/components/entities/EntityList";

export default function FactionsPage() {
  const params = useParams();
  const projectId = params.projectId as string;

  return (
    <EntityList
      projectId={projectId}
      type="FACTION"
      title="Factions"
      emptyMessage="No factions yet. Create groups and organizations in your world."
    />
  );
}
