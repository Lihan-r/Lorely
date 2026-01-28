"use client";

import { useParams } from "next/navigation";
import { EntityList } from "@/components/entities/EntityList";

export default function ChaptersPage() {
  const params = useParams();
  const projectId = params.projectId as string;

  return (
    <EntityList
      projectId={projectId}
      type="CHAPTER"
      title="Chapters"
      emptyMessage="No chapters yet. Outline your story structure."
    />
  );
}
