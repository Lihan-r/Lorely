"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, Star, PenLine } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModeSwitcherProps {
  projectId: string;
}

const modes = [
  {
    key: "plan",
    label: "Plan",
    href: (id: string) => `/projects/${id}/plan`,
    icon: <ClipboardList className="w-4 h-4" />,
  },
  {
    key: "constellation",
    label: "Constellation",
    href: (id: string) => `/projects/${id}/constellation`,
    icon: <Star className="w-4 h-4" />,
  },
  {
    key: "write",
    label: "Write",
    href: (id: string) => `/projects/${id}/write`,
    icon: <PenLine className="w-4 h-4" />,
  },
];

export function ModeSwitcher({ projectId }: ModeSwitcherProps) {
  const pathname = usePathname();

  const getActiveMode = () => {
    if (pathname.includes("/plan")) return "plan";
    if (pathname.includes("/constellation")) return "constellation";
    if (pathname.includes("/write")) return "write";
    return null;
  };

  const activeMode = getActiveMode();

  return (
    <nav className="flex items-center gap-1 p-1 bg-bg-surface rounded-lg border border-border-subtle">
      {modes.map((mode) => {
        const isActive = activeMode === mode.key;
        return (
          <Link
            key={mode.key}
            href={mode.href(projectId)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
              isActive
                ? "bg-accent text-bg-deep"
                : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated"
            )}
          >
            {mode.icon}
            {mode.label}
          </Link>
        );
      })}
    </nav>
  );
}
