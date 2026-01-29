"use client";

import { useState } from "react";
import { EntityResponse } from "@/lib/api";
import { RELATIONSHIP_CATEGORIES, RELATIONSHIP_LABELS } from "@/lib/relationshipTypes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { ArrowRight, Link2, GitBranch } from "lucide-react";

interface ConnectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  fromEntity: EntityResponse;
  toEntity: EntityResponse;
  onCreateRelationship: (relationType: string) => Promise<void>;
  onCreateLink: (note: string) => Promise<void>;
}

type ConnectionType = "relationship" | "link";

export function ConnectionDialog({
  isOpen,
  onClose,
  fromEntity,
  toEntity,
  onCreateRelationship,
  onCreateLink,
}: ConnectionDialogProps) {
  const [connectionType, setConnectionType] = useState<ConnectionType>("link");
  const [relationType, setRelationType] = useState<string>("");
  const [linkNote, setLinkNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (connectionType === "relationship") {
        if (!relationType) {
          return;
        }
        await onCreateRelationship(relationType);
      } else {
        await onCreateLink(linkNote);
      }
      onClose();
    } catch (error) {
      console.error("Failed to create connection:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setConnectionType("link");
    setRelationType("");
    setLinkNote("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Connection</DialogTitle>
          <DialogDescription className="flex items-center gap-2 pt-2">
            <span className="font-medium text-text-primary">{fromEntity.title}</span>
            <ArrowRight className="w-4 h-4 text-text-muted" />
            <span className="font-medium text-text-primary">{toEntity.title}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Connection Type Selection */}
          <div className="space-y-3">
            <Label>Connection Type</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setConnectionType("link")}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors ${
                  connectionType === "link"
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border-subtle hover:border-border-strong text-text-secondary hover:text-text-primary"
                }`}
              >
                <Link2 className="w-5 h-5" />
                <span className="text-sm font-medium">Link</span>
                <span className="text-xs text-text-muted text-center">
                  Simple connection
                </span>
              </button>
              <button
                type="button"
                onClick={() => setConnectionType("relationship")}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors ${
                  connectionType === "relationship"
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border-subtle hover:border-border-strong text-text-secondary hover:text-text-primary"
                }`}
              >
                <GitBranch className="w-5 h-5" />
                <span className="text-sm font-medium">Relationship</span>
                <span className="text-xs text-text-muted text-center">
                  Typed connection
                </span>
              </button>
            </div>
          </div>

          {/* Relationship Type Dropdown */}
          {connectionType === "relationship" && (
            <div className="space-y-2">
              <Label htmlFor="relationType">Relationship Type</Label>
              <Select value={relationType} onValueChange={setRelationType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a type..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(RELATIONSHIP_CATEGORIES).map(([category, types]) => (
                    <SelectGroup key={category}>
                      <SelectLabel>{category}</SelectLabel>
                      {types.map((type) => (
                        <SelectItem key={type} value={type}>
                          {RELATIONSHIP_LABELS[type] || type}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Link Note Input */}
          {connectionType === "link" && (
            <div className="space-y-2">
              <Label htmlFor="linkNote">Note (optional)</Label>
              <Input
                id="linkNote"
                value={linkNote}
                onChange={(e) => setLinkNote(e.target.value)}
                placeholder="Add a note about this connection..."
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || (connectionType === "relationship" && !relationType)}
          >
            {isSubmitting ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
