"use client";

import { useParams } from "next/navigation";
import { EntityList } from "@/components/entities/EntityList";

export default function LocationsPage() {
  const params = useParams();
  const projectId = params.projectId as string;

  return (
    <EntityList
      projectId={projectId}
      type="LOCATION"
      title="Locations"
      emptyMessage="No locations yet. Create places for your characters to explore."
    />
  );
}
