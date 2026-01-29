"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { EntityType } from "@/lib/api";
import {
  User,
  MapPin,
  Users,
  Box,
  Calendar,
  BookOpen,
  Lightbulb,
  LayoutGrid,
  Folder,
  Settings,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  projectId?: string;
  projectName?: string;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  type?: EntityType;
}

const entityTypeIcons: Record<EntityType, React.ReactNode> = {
  CHARACTER: <User className="w-5 h-5" />,
  LOCATION: <MapPin className="w-5 h-5" />,
  FACTION: <Users className="w-5 h-5" />,
  ITEM: <Box className="w-5 h-5" />,
  EVENT: <Calendar className="w-5 h-5" />,
  CHAPTER: <BookOpen className="w-5 h-5" />,
  CONCEPT: <Lightbulb className="w-5 h-5" />,
};

export function Sidebar({ projectId, projectName }: SidebarProps) {
  const pathname = usePathname();

  const getNavItems = (): NavItem[] => {
    if (!projectId) {
      return [
        {
          label: "Projects",
          href: "/projects",
          icon: <Folder className="w-5 h-5" />,
        },
      ];
    }

    return [
      {
        label: "Overview",
        href: `/projects/${projectId}/plan`,
        icon: <LayoutGrid className="w-5 h-5" />,
      },
      { label: "Characters", href: `/projects/${projectId}/plan/characters`, icon: entityTypeIcons.CHARACTER, type: "CHARACTER" },
      { label: "Locations", href: `/projects/${projectId}/plan/locations`, icon: entityTypeIcons.LOCATION, type: "LOCATION" },
      { label: "Factions", href: `/projects/${projectId}/plan/factions`, icon: entityTypeIcons.FACTION, type: "FACTION" },
      { label: "Items", href: `/projects/${projectId}/plan/items`, icon: entityTypeIcons.ITEM, type: "ITEM" },
      { label: "Events", href: `/projects/${projectId}/plan/events`, icon: entityTypeIcons.EVENT, type: "EVENT" },
      { label: "Chapters", href: `/projects/${projectId}/plan/chapters`, icon: entityTypeIcons.CHAPTER, type: "CHAPTER" },
      { label: "Concepts", href: `/projects/${projectId}/plan/concepts`, icon: entityTypeIcons.CONCEPT, type: "CONCEPT" },
    ];
  };

  const navItems = getNavItems();

  const isActive = (href: string) => {
    if (href === "/projects") {
      return pathname === "/projects";
    }
    if (href === `/projects/${projectId}/plan`) {
      return pathname === `/projects/${projectId}/plan`;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-60 h-full bg-bg-surface border-r border-border-subtle flex flex-col">
      {/* Project Selector / Back to Projects */}
      <div className="p-4 border-b border-border-subtle">
        {projectId ? (
          <div>
            <Link
              href="/projects"
              className="text-xs text-text-muted hover:text-text-primary flex items-center gap-1 mb-1 transition-colors"
            >
              <ChevronLeft className="w-3 h-3" />
              All Projects
            </Link>
            <h2 className="font-semibold text-text-primary truncate">{projectName || "Project"}</h2>
          </div>
        ) : (
          <h2 className="font-semibold text-accent">Lorely</h2>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                  isActive(item.href)
                    ? "bg-bg-elevated text-accent font-medium"
                    : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border-subtle">
        <Link
          href="/projects"
          className="flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors"
        >
          <Settings className="w-4 h-4" />
          Settings
        </Link>
      </div>
    </aside>
  );
}
