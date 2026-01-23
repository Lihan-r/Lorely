"use client";

import { useParams } from "next/navigation";
import { EntityList } from "@/components/entities/EntityList";

export default function EventsPage() {
  const params = useParams();
  const projectId = params.projectId as string;

  return (
    <EntityList
      projectId={projectId}
      type="EVENT"
      title="Events"
      emptyMessage="No events yet. Create historical moments and story events."
    />
  );
}
