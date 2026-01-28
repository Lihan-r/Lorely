"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface ModeSwitcherProps {
  projectId: string;
}

const modes = [
  {
    key: "plan",
    label: "Plan",
    href: (id: string) => `/projects/${id}/plan`,
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    key: "constellation",
    label: "Constellation",
    href: (id: string) => `/projects/${id}/constellation`,
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
  {
    key: "write",
    label: "Write",
    href: (id: string) => `/projects/${id}/write`,
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
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
    <nav className="flex items-center gap-1">
      {modes.map((mode) => {
        const isActive = activeMode === mode.key;
        return (
          <Link
            key={mode.key}
            href={mode.href(projectId)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? "bg-ink text-paper"
                : "text-ink/60 hover:text-ink hover:bg-cream/50"
            }`}
          >
            {mode.icon}
            {mode.label}
          </Link>
        );
      })}
    </nav>
  );
}
