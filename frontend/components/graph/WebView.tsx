"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import cytoscape, { Core, ElementDefinition } from "cytoscape";
import { EntityResponse, RelationshipResponse } from "@/lib/api";
import { getRelationshipLabel } from "@/lib/relationshipTypes";

interface WebViewProps {
  entities: EntityResponse[];
  relationships: RelationshipResponse[];
  onEntityClick?: (entityId: string) => void;
  onRelationshipClick?: (relationshipId: string) => void;
  selectedEntityId?: string;
}

// Color mapping for entity types
const ENTITY_COLORS: Record<string, string> = {
  CHARACTER: "#6366f1", // indigo
  LOCATION: "#22c55e", // green
  FACTION: "#f59e0b", // amber
  ITEM: "#ec4899", // pink
  EVENT: "#8b5cf6", // violet
  CHAPTER: "#06b6d4", // cyan
  CONCEPT: "#f97316", // orange
};

export function WebView({
  entities,
  relationships,
  onEntityClick,
  onRelationshipClick,
  selectedEntityId,
}: WebViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Build Cytoscape elements from entities and relationships
  const buildElements = useCallback((): ElementDefinition[] => {
    const nodes: ElementDefinition[] = entities.map((entity) => ({
      data: {
        id: entity.id,
        label: entity.title,
        type: entity.type,
        color: ENTITY_COLORS[entity.type] || "#6b7280",
      },
    }));

    const edges: ElementDefinition[] = relationships.map((rel) => ({
      data: {
        id: rel.id,
        source: rel.fromEntityId,
        target: rel.toEntityId,
        label: getRelationshipLabel(rel.relationType),
        relationType: rel.relationType,
      },
    }));

    return [...nodes, ...edges];
  }, [entities, relationships]);

  // Initialize Cytoscape
  useEffect(() => {
    if (!containerRef.current || isInitialized) return;

    const cy = cytoscape({
      container: containerRef.current,
      elements: buildElements(),
      style: [
        {
          selector: "node",
          style: {
            "background-color": "data(color)",
            label: "data(label)",
            "text-valign": "bottom",
            "text-halign": "center",
            "font-size": "12px",
            "text-margin-y": 8,
            color: "#1a1a1a",
            width: 40,
            height: 40,
            "border-width": 2,
            "border-color": "#ffffff",
          },
        },
        {
          selector: "node:selected",
          style: {
            "border-width": 3,
            "border-color": "#000000",
            "background-color": "data(color)",
          },
        },
        {
          selector: "node.highlighted",
          style: {
            "border-width": 3,
            "border-color": "#000000",
          },
        },
        {
          selector: "edge",
          style: {
            width: 2,
            "line-color": "#9ca3af",
            "target-arrow-color": "#9ca3af",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
            label: "data(label)",
            "font-size": "10px",
            "text-rotation": "autorotate",
            "text-margin-y": -10,
            color: "#6b7280",
          },
        },
        {
          selector: "edge:selected",
          style: {
            width: 3,
            "line-color": "#000000",
            "target-arrow-color": "#000000",
          },
        },
      ],
      layout: {
        name: "cose",
        animate: true,
        animationDuration: 500,
        nodeRepulsion: () => 8000,
        idealEdgeLength: () => 100,
        edgeElasticity: () => 100,
        nestingFactor: 0.1,
        gravity: 0.25,
        numIter: 1000,
        initialTemp: 200,
        coolingFactor: 0.95,
        minTemp: 1.0,
      },
      minZoom: 0.2,
      maxZoom: 3,
      wheelSensitivity: 0.3,
    });

    // Event handlers
    cy.on("tap", "node", (evt) => {
      const nodeId = evt.target.id();
      onEntityClick?.(nodeId);
    });

    cy.on("tap", "edge", (evt) => {
      const edgeId = evt.target.id();
      onRelationshipClick?.(edgeId);
    });

    cyRef.current = cy;
    setIsInitialized(true);

    return () => {
      cy.destroy();
      cyRef.current = null;
      setIsInitialized(false);
    };
  }, [buildElements, onEntityClick, onRelationshipClick, isInitialized]);

  // Update elements when data changes
  useEffect(() => {
    if (!cyRef.current || !isInitialized) return;

    const cy = cyRef.current;
    const newElements = buildElements();

    // Remove old elements and add new ones
    cy.elements().remove();
    cy.add(newElements);

    // Re-run layout
    cy.layout({
      name: "cose",
      animate: true,
      animationDuration: 500,
      nodeRepulsion: () => 8000,
      idealEdgeLength: () => 100,
    }).run();
  }, [entities, relationships, buildElements, isInitialized]);

  // Highlight selected entity
  useEffect(() => {
    if (!cyRef.current || !isInitialized) return;

    const cy = cyRef.current;
    cy.nodes().removeClass("highlighted");

    if (selectedEntityId) {
      const node = cy.getElementById(selectedEntityId);
      if (node.length) {
        node.addClass("highlighted");
        cy.animate({
          center: { eles: node },
          zoom: 1.5,
        });
      }
    }
  }, [selectedEntityId, isInitialized]);

  const handleZoomIn = () => {
    if (cyRef.current) {
      cyRef.current.zoom(cyRef.current.zoom() * 1.2);
    }
  };

  const handleZoomOut = () => {
    if (cyRef.current) {
      cyRef.current.zoom(cyRef.current.zoom() / 1.2);
    }
  };

  const handleFit = () => {
    if (cyRef.current) {
      cyRef.current.fit(undefined, 50);
    }
  };

  const handleResetLayout = () => {
    if (cyRef.current) {
      cyRef.current
        .layout({
          name: "cose",
          animate: true,
          animationDuration: 500,
          nodeRepulsion: () => 8000,
          idealEdgeLength: () => 100,
        })
        .run();
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Graph container */}
      <div
        ref={containerRef}
        className="w-full h-full bg-cream/30 rounded-lg border border-border-light"
      />

      {/* Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="p-2 bg-paper rounded-lg border border-border-light shadow-sm hover:bg-cream transition-colors"
          title="Zoom In"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
          </svg>
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 bg-paper rounded-lg border border-border-light shadow-sm hover:bg-cream transition-colors"
          title="Zoom Out"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
          </svg>
        </button>
        <button
          onClick={handleFit}
          className="p-2 bg-paper rounded-lg border border-border-light shadow-sm hover:bg-cream transition-colors"
          title="Fit to View"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>
        <button
          onClick={handleResetLayout}
          className="p-2 bg-paper rounded-lg border border-border-light shadow-sm hover:bg-cream transition-colors"
          title="Reset Layout"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-paper/90 backdrop-blur-sm rounded-lg border border-border-light p-3 shadow-sm">
        <h4 className="text-xs font-medium text-ink/60 mb-2">Entity Types</h4>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          {Object.entries(ENTITY_COLORS).map(([type, color]) => (
            <div key={type} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs text-ink/80 capitalize">
                {type.toLowerCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Empty state */}
      {entities.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-ink/50">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <p className="text-lg font-medium">No entities yet</p>
            <p className="text-sm mt-1">Create some entities to see them in the web view</p>
          </div>
        </div>
      )}
    </div>
  );
}
