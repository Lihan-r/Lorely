"use client";

import { useParams } from "next/navigation";
import { EntityList } from "@/components/entities/EntityList";

export default function ItemsPage() {
  const params = useParams();
  const projectId = params.projectId as string;

  return (
    <EntityList
      projectId={projectId}
      type="ITEM"
      title="Items"
      emptyMessage="No items yet. Create artifacts, weapons, and treasures."
    />
  );
}
