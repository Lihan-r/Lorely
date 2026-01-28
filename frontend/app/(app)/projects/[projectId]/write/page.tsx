"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

export default function WritePage() {
  const params = useParams();
  const projectId = params.projectId as string;

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mx-auto mb-6 text-ink/40">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </div>
        <h1 className="text-2xl font-serif font-semibold text-ink mb-3">Write Mode</h1>
        <p className="text-ink/60 mb-2">Coming Soon</p>
        <p className="text-sm text-ink/40 mb-8">
          Write mode will let you draft scenes, chapters, and prose while referencing your world&apos;s entities and lore directly from the editor.
        </p>
        <Link
          href={`/projects/${projectId}`}
          className="text-sm text-ink/60 hover:text-ink underline hover:no-underline"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
