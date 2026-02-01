interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`relative overflow-hidden bg-bg-elevated rounded ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-paper rounded-lg border border-border-light p-4">
      <div className="flex items-start justify-between mb-3">
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <Skeleton className="h-5 w-3/4 mb-2" />
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          <Skeleton className="h-4 w-12 rounded" />
          <Skeleton className="h-4 w-16 rounded" />
        </div>
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  );
}

export function SkeletonProjectCard() {
  return (
    <div className="bg-paper rounded-xl border border-border-light p-6">
      <div className="flex items-start justify-between mb-4">
        <Skeleton className="w-12 h-12 rounded-lg" />
      </div>
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}

interface SkeletonGridProps {
  count?: number;
  type?: "entity" | "project";
}

export function SkeletonGrid({ count = 6, type = "entity" }: SkeletonGridProps) {
  const Card = type === "project" ? SkeletonProjectCard : SkeletonCard;

  return (
    <div
      className={`grid gap-4 ${
        type === "project"
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      }`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} />
      ))}
    </div>
  );
}
