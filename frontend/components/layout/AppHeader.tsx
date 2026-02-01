"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface AppHeaderProps {
  projectId?: string;
  onSearch?: (query: string) => void;
}

export function AppHeader({ projectId, onSearch }: AppHeaderProps) {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <header className="h-14 bg-paper border-b border-border-light flex items-center px-4 gap-4">
      {/* Logo */}
      <Link href="/projects" className="flex items-center gap-2">
        <span className="text-xl font-serif font-semibold text-ink">Lorely</span>
      </Link>

      {/* Search */}
      {projectId && (
        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-auto">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search entities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-bg-light border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink/40"
            />
          </div>
        </form>
      )}

      {/* Spacer when no search */}
      {!projectId && <div className="flex-1" />}

      {/* Theme Toggle */}
      <ThemeToggle />

      {/* User Menu */}
      <div className="relative">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-cream transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-cream flex items-center justify-center">
            <span className="text-sm font-medium text-ink">
              {user?.email?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
          <svg
            className={`w-4 h-4 text-ink/60 transition-transform ${showUserMenu ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showUserMenu && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowUserMenu(false)}
            />
            <div className="absolute right-0 top-full mt-2 w-48 bg-paper rounded-lg shadow-lg border border-border-light py-1 z-20">
              <div className="px-4 py-2 border-b border-border-light">
                <p className="text-sm font-medium text-ink truncate">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  logout();
                }}
                className="w-full text-left px-4 py-2 text-sm text-ink/70 hover:bg-cream hover:text-ink transition-colors"
              >
                Sign out
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
