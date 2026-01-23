"use client";

import { useParams } from "next/navigation";
import { EntityList } from "@/components/entities/EntityList";

export default function CharactersPage() {
  const params = useParams();
  const projectId = params.projectId as string;

  return (
    <EntityList
      projectId={projectId}
      type="CHARACTER"
      title="Characters"
      emptyMessage="No characters yet. Create your first character to bring your world to life."
    />
  );
}
