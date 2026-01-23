"use client";

import { useParams } from "next/navigation";
import { EntityList } from "@/components/entities/EntityList";

export default function ConceptsPage() {
  const params = useParams();
  const projectId = params.projectId as string;

  return (
    <EntityList
      projectId={projectId}
      type="CONCEPT"
      title="Concepts"
      emptyMessage="No concepts yet. Create concepts like magic systems, rules, or lore."
    />
  );
}
