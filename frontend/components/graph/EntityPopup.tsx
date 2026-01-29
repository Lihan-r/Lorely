"use client";

import { useEffect, useRef } from "react";
import { EntityResponse } from "@/lib/api";
import { X, ExternalLink, Link2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface EntityPopupProps {
  entity: EntityResponse;
  position: { x: number; y: number };
  onClose: () => void;
  onViewDetails: () => void;
  onConnect: () => void;
}

const ENTITY_COLORS: Record<string, string> = {
  CHARACTER: "#6b8cae",
  LOCATION: "#5d8a66",
  FACTION: "#a67c52",
  ITEM: "#9c6b7a",
  EVENT: "#7c6b9c",
  CHAPTER: "#5a8a8a",
  CONCEPT: "#8a7c52",
};

export function EntityPopup({
  entity,
  position,
  onClose,
  onViewDetails,
  onConnect,
}: EntityPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    // Delay adding listener to avoid immediate close
    const timeout = setTimeout(() => {
      window.addEventListener("mousedown", handleClickOutside);
    }, 100);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Get brief content (first ~100 chars)
  const contentText = entity.content?.text as string || "";
  const briefDescription = contentText.length > 100
    ? contentText.substring(0, 100) + "..."
    : contentText || "No description yet";

  const entityColor = ENTITY_COLORS[entity.type] || "#6b7280";

  // Adjust position to keep popup in viewport
  const adjustedStyle: React.CSSProperties = {
    left: position.x,
    top: position.y,
    transform: "translate(-50%, -100%)",
    marginTop: "-20px",
  };

  return (
    <div
      ref={popupRef}
      className={cn(
        "absolute z-50 w-72 bg-bg-surface border border-border-subtle rounded-lg shadow-xl",
        "animate-in fade-in-0 zoom-in-95 duration-200"
      )}
      style={adjustedStyle}
    >
      {/* Header */}
      <div className="flex items-start justify-between p-3 border-b border-border-subtle">
        <div className="flex-1 min-w-0">
          <span
            className="inline-block px-2 py-0.5 text-xs font-medium rounded-full mb-1"
            style={{
              backgroundColor: entityColor + "20",
              color: entityColor,
            }}
          >
            {entity.type}
          </span>
          <h3 className="text-sm font-semibold text-text-primary truncate">
            {entity.title}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-text-muted hover:text-text-primary transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-3">
        <p className="text-xs text-text-secondary line-clamp-3">
          {briefDescription}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2 p-3 pt-0">
        <Button
          variant="outline"
          size="sm"
          onClick={onConnect}
          className="flex-1"
        >
          <Link2 className="w-3 h-3 mr-1" />
          Connect
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={onViewDetails}
          className="flex-1"
        >
          <ExternalLink className="w-3 h-3 mr-1" />
          View
        </Button>
      </div>

      {/* Arrow pointing down */}
      <div
        className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-full"
        style={{
          width: 0,
          height: 0,
          borderLeft: "8px solid transparent",
          borderRight: "8px solid transparent",
          borderTop: "8px solid #1e2433",
        }}
      />
    </div>
  );
}
