"use client";

import { useEffect, useRef, useCallback } from "react";
import * as d3 from "d3";
import { EntityResponse, RelationshipResponse } from "@/lib/api";
import { getRelationshipLabel } from "@/lib/relationshipTypes";

interface ConstellationViewProps {
  entities: EntityResponse[];
  relationships: RelationshipResponse[];
  onEntityClick?: (entityId: string) => void;
  selectedEntityId?: string;
}

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  type: string;
  color: string;
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  id: string;
  label: string;
  relationType: string;
}

const ENTITY_COLORS: Record<string, string> = {
  CHARACTER: "#6366f1",
  LOCATION: "#22c55e",
  FACTION: "#f59e0b",
  ITEM: "#ec4899",
  EVENT: "#8b5cf6",
  CHAPTER: "#06b6d4",
  CONCEPT: "#f97316",
};

const NODE_RADIUS = 8;
const SELECTED_RADIUS = 12;

export function ConstellationView({
  entities,
  relationships,
  onEntityClick,
  selectedEntityId,
}: ConstellationViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const simulationRef = useRef<d3.Simulation<GraphNode, GraphLink> | null>(null);
  const nodesRef = useRef<GraphNode[]>([]);
  const linksRef = useRef<GraphLink[]>([]);
  const transformRef = useRef<d3.ZoomTransform>(d3.zoomIdentity);
  const hoveredNodeRef = useRef<GraphNode | null>(null);
  const draggedNodeRef = useRef<GraphNode | null>(null);
  const animationFrameRef = useRef<number>(0);
  const onEntityClickRef = useRef(onEntityClick);
  onEntityClickRef.current = onEntityClick;
  const selectedEntityIdRef = useRef(selectedEntityId);
  selectedEntityIdRef.current = selectedEntityId;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const transform = transformRef.current;

    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(transform.x, transform.y);
    ctx.scale(transform.k, transform.k);

    // Draw edges
    linksRef.current.forEach((link) => {
      const source = link.source as GraphNode;
      const target = link.target as GraphNode;
      if (source.x == null || source.y == null || target.x == null || target.y == null) return;

      const isConnectedToSelected =
        selectedEntityIdRef.current &&
        (source.id === selectedEntityIdRef.current || target.id === selectedEntityIdRef.current);

      ctx.beginPath();
      ctx.moveTo(source.x, source.y);
      ctx.lineTo(target.x, target.y);
      ctx.strokeStyle = isConnectedToSelected ? "rgba(100, 100, 100, 0.6)" : "rgba(156, 163, 175, 0.3)";
      ctx.lineWidth = isConnectedToSelected ? 1.5 : 0.8;
      ctx.stroke();

      // Edge label
      const midX = (source.x + target.x) / 2;
      const midY = (source.y + target.y) / 2;
      ctx.font = `${10 / transform.k}px system-ui, sans-serif`;
      ctx.fillStyle = isConnectedToSelected ? "rgba(80, 80, 80, 0.8)" : "rgba(107, 114, 128, 0.5)";
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText(link.label, midX, midY - 3 / transform.k);
    });

    // Draw nodes
    nodesRef.current.forEach((node) => {
      if (node.x == null || node.y == null) return;

      const isSelected = node.id === selectedEntityIdRef.current;
      const isHovered = node === hoveredNodeRef.current;
      const radius = isSelected ? SELECTED_RADIUS : isHovered ? NODE_RADIUS + 2 : NODE_RADIUS;

      // Glow effect
      if (isSelected || isHovered) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius + 4, 0, Math.PI * 2);
        ctx.fillStyle = node.color + "30";
        ctx.fill();
      }

      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = node.color;
      ctx.fill();

      // Border
      ctx.strokeStyle = isSelected ? "#000000" : "#ffffff";
      ctx.lineWidth = isSelected ? 2.5 : 1.5;
      ctx.stroke();

      // Label
      ctx.font = `${11 / transform.k}px system-ui, sans-serif`;
      ctx.fillStyle = "#1a1a1a";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText(node.label, node.x, node.y + radius + 4);
    });

    ctx.restore();

    animationFrameRef.current = requestAnimationFrame(draw);
  }, []);

  // Build graph data when entities/relationships change
  useEffect(() => {
    const entityIds = new Set(entities.map((e) => e.id));

    const nodes: GraphNode[] = entities.map((entity) => {
      // Preserve existing position if node already exists
      const existing = nodesRef.current.find((n) => n.id === entity.id);
      return {
        id: entity.id,
        label: entity.title,
        type: entity.type,
        color: ENTITY_COLORS[entity.type] || "#6b7280",
        x: existing?.x,
        y: existing?.y,
        vx: existing?.vx,
        vy: existing?.vy,
      };
    });

    const links: GraphLink[] = relationships
      .filter((rel) => entityIds.has(rel.fromEntityId) && entityIds.has(rel.toEntityId))
      .map((rel) => ({
        id: rel.id,
        source: rel.fromEntityId,
        target: rel.toEntityId,
        label: getRelationshipLabel(rel.relationType),
        relationType: rel.relationType,
      }));

    nodesRef.current = nodes;
    linksRef.current = links;

    // Create or restart simulation
    if (simulationRef.current) {
      simulationRef.current.stop();
    }

    const canvas = canvasRef.current;
    const width = canvas?.width || 800;
    const height = canvas?.height || 600;

    const simulation = d3
      .forceSimulation<GraphNode>(nodes)
      .force(
        "link",
        d3.forceLink<GraphNode, GraphLink>(links)
          .id((d) => d.id)
          .distance(120)
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide(30))
      .alphaDecay(0.02);

    simulationRef.current = simulation;
  }, [entities, relationships]);

  // Canvas setup + interaction
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);

      // Update center force
      if (simulationRef.current) {
        simulationRef.current
          .force("center", d3.forceCenter(rect.width / 2, rect.height / 2))
          .alpha(0.1)
          .restart();
      }
    };

    resizeCanvas();
    const resizeObserver = new ResizeObserver(resizeCanvas);
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    // Start render loop
    animationFrameRef.current = requestAnimationFrame(draw);

    // D3 zoom
    const d3Canvas = d3.select(canvas);
    const zoom = d3.zoom<HTMLCanvasElement, unknown>()
      .scaleExtent([0.2, 5])
      .on("zoom", (event) => {
        transformRef.current = event.transform;
      });

    d3Canvas.call(zoom);

    // Hit testing helper
    const getNodeAtPoint = (clientX: number, clientY: number): GraphNode | null => {
      const rect = canvas.getBoundingClientRect();
      const transform = transformRef.current;
      const x = (clientX - rect.left - transform.x) / transform.k;
      const y = (clientY - rect.top - transform.y) / transform.k;

      // Search in reverse order so topmost node is found first
      for (let i = nodesRef.current.length - 1; i >= 0; i--) {
        const node = nodesRef.current[i];
        if (node.x == null || node.y == null) continue;
        const dx = x - node.x;
        const dy = y - node.y;
        const hitRadius = NODE_RADIUS + 4;
        if (dx * dx + dy * dy < hitRadius * hitRadius) {
          return node;
        }
      }
      return null;
    };

    // Mouse move for hover
    const handleMouseMove = (event: MouseEvent) => {
      if (draggedNodeRef.current) return;
      const node = getNodeAtPoint(event.clientX, event.clientY);
      hoveredNodeRef.current = node;
      canvas.style.cursor = node ? "pointer" : "grab";
    };

    // Drag behavior
    let dragStartX = 0;
    let dragStartY = 0;
    let isDragging = false;

    const handleMouseDown = (event: MouseEvent) => {
      const node = getNodeAtPoint(event.clientX, event.clientY);
      if (node) {
        event.stopPropagation();
        draggedNodeRef.current = node;
        dragStartX = event.clientX;
        dragStartY = event.clientY;
        isDragging = false;

        // Fix node position during drag
        node.fx = node.x;
        node.fy = node.y;
        simulationRef.current?.alphaTarget(0.3).restart();

        // Disable zoom panning while dragging a node
        d3Canvas.on(".zoom", null);
      }
    };

    const handleMouseMoveDrag = (event: MouseEvent) => {
      if (!draggedNodeRef.current) return;

      const dx = event.clientX - dragStartX;
      const dy = event.clientY - dragStartY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        isDragging = true;
      }

      const transform = transformRef.current;
      const rect = canvas.getBoundingClientRect();
      draggedNodeRef.current.fx = (event.clientX - rect.left - transform.x) / transform.k;
      draggedNodeRef.current.fy = (event.clientY - rect.top - transform.y) / transform.k;
    };

    const handleMouseUp = (event: MouseEvent) => {
      if (draggedNodeRef.current) {
        if (!isDragging) {
          // It was a click, not a drag
          onEntityClickRef.current?.(draggedNodeRef.current.id);
        }
        // Release node
        draggedNodeRef.current.fx = null;
        draggedNodeRef.current.fy = null;
        draggedNodeRef.current = null;
        simulationRef.current?.alphaTarget(0);

        // Re-enable zoom
        d3Canvas.call(zoom);
      }
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMoveDrag);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      resizeObserver.disconnect();
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMoveDrag);
      window.removeEventListener("mouseup", handleMouseUp);
      simulationRef.current?.stop();
    };
  }, [draw]);

  const handleZoomIn = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const d3Canvas = d3.select(canvas);
    d3Canvas.transition().duration(300).call(
      d3.zoom<HTMLCanvasElement, unknown>().scaleExtent([0.2, 5]).on("zoom", (event) => {
        transformRef.current = event.transform;
      }).scaleBy,
      1.3
    );
  }, []);

  const handleZoomOut = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const d3Canvas = d3.select(canvas);
    d3Canvas.transition().duration(300).call(
      d3.zoom<HTMLCanvasElement, unknown>().scaleExtent([0.2, 5]).on("zoom", (event) => {
        transformRef.current = event.transform;
      }).scaleBy,
      0.7
    );
  }, []);

  const handleFit = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || nodesRef.current.length === 0) return;

    const rect = canvas.parentElement?.getBoundingClientRect();
    if (!rect) return;

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    nodesRef.current.forEach((node) => {
      if (node.x != null && node.y != null) {
        minX = Math.min(minX, node.x);
        minY = Math.min(minY, node.y);
        maxX = Math.max(maxX, node.x);
        maxY = Math.max(maxY, node.y);
      }
    });

    const padding = 60;
    const graphWidth = maxX - minX + padding * 2;
    const graphHeight = maxY - minY + padding * 2;
    const scale = Math.min(rect.width / graphWidth, rect.height / graphHeight, 2);
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    const transform = d3.zoomIdentity
      .translate(rect.width / 2, rect.height / 2)
      .scale(scale)
      .translate(-centerX, -centerY);

    transformRef.current = transform;

    // Also update the zoom behavior's stored transform
    const d3Canvas = d3.select(canvas);
    d3Canvas.call(
      d3.zoom<HTMLCanvasElement, unknown>().scaleExtent([0.2, 5]).on("zoom", (event) => {
        transformRef.current = event.transform;
      }).transform,
      transform
    );
  }, []);

  const handleResetLayout = useCallback(() => {
    if (simulationRef.current) {
      simulationRef.current.alpha(1).restart();
    }
  }, []);

  return (
    <div className="relative w-full h-full min-h-0">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 bg-cream/30 rounded-lg border border-border-light"
      />

      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
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
      <div className="absolute bottom-4 left-4 z-10 bg-paper/90 backdrop-blur-sm rounded-lg border border-border-light p-3 shadow-sm">
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
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="text-center text-ink/50">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <p className="text-lg font-medium">No entities yet</p>
            <p className="text-sm mt-1">Create entities in Plan mode to see them here</p>
          </div>
        </div>
      )}
    </div>
  );
}
