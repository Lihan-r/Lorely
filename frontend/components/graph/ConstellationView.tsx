"use client";

import { useEffect, useRef, useCallback } from "react";
import * as d3 from "d3";
import { EntityResponse, RelationshipResponse, LinkResponse } from "@/lib/api";
import { getRelationshipLabel } from "@/lib/relationshipTypes";
import { ZoomIn, ZoomOut, Maximize2, RotateCcw, Star } from "lucide-react";

interface ConstellationViewProps {
  entities: EntityResponse[];
  relationships: RelationshipResponse[];
  links?: LinkResponse[];
  onEntityClick?: (entityId: string) => void;
  selectedEntityId?: string;
  onStartConnection?: (entityId: string) => void;
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
  isLink?: boolean; // true for simple links, false for relationships
}

// New muted jewel tone colors
const ENTITY_COLORS: Record<string, string> = {
  CHARACTER: "#6b8cae",
  LOCATION: "#5d8a66",
  FACTION: "#a67c52",
  ITEM: "#9c6b7a",
  EVENT: "#7c6b9c",
  CHAPTER: "#5a8a8a",
  CONCEPT: "#8a7c52",
};

const NODE_RADIUS = 8;
const SELECTED_RADIUS = 12;

export function ConstellationView({
  entities,
  relationships,
  links = [],
  onEntityClick,
  selectedEntityId,
  onStartConnection,
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
    const dpr = window.devicePixelRatio || 1;

    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.scale(dpr, dpr);
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

      // Dashed line for simple links
      if (link.isLink) {
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = isConnectedToSelected ? "rgba(201, 162, 39, 0.6)" : "rgba(139, 115, 85, 0.4)";
        ctx.lineWidth = isConnectedToSelected ? 1.5 : 1;
      } else {
        ctx.setLineDash([]);
        ctx.strokeStyle = isConnectedToSelected ? "rgba(201, 162, 39, 0.6)" : "rgba(107, 114, 128, 0.3)";
        ctx.lineWidth = isConnectedToSelected ? 1.5 : 0.8;
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Edge label
      const midX = (source.x + target.x) / 2;
      const midY = (source.y + target.y) / 2;
      ctx.font = `${10 / transform.k}px system-ui, sans-serif`;
      ctx.fillStyle = isConnectedToSelected ? "rgba(201, 162, 39, 0.9)" : "rgba(156, 163, 175, 0.6)";
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
        ctx.arc(node.x, node.y, radius + 6, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(
          node.x, node.y, radius,
          node.x, node.y, radius + 6
        );
        gradient.addColorStop(0, isSelected ? "rgba(201, 162, 39, 0.4)" : node.color + "40");
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = node.color;
      ctx.fill();

      // Border
      ctx.strokeStyle = isSelected ? "#c9a227" : "rgba(245, 245, 240, 0.3)";
      ctx.lineWidth = isSelected ? 2.5 : 1.5;
      ctx.stroke();

      // Label
      ctx.font = `${11 / transform.k}px system-ui, sans-serif`;
      ctx.fillStyle = "#f5f5f0";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";

      // Text shadow for readability
      ctx.shadowColor = "rgba(10, 13, 20, 0.8)";
      ctx.shadowBlur = 4;
      ctx.fillText(node.label, node.x, node.y + radius + 4);
      ctx.shadowBlur = 0;
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

    const graphLinks: GraphLink[] = [
      // Add relationships
      ...relationships
        .filter((rel) => entityIds.has(rel.fromEntityId) && entityIds.has(rel.toEntityId))
        .map((rel) => ({
          id: rel.id,
          source: rel.fromEntityId,
          target: rel.toEntityId,
          label: getRelationshipLabel(rel.relationType),
          relationType: rel.relationType,
          isLink: false,
        })),
      // Add simple links
      ...links
        .filter((link) => entityIds.has(link.fromEntityId) && entityIds.has(link.toEntityId))
        .map((link) => ({
          id: link.id,
          source: link.fromEntityId,
          target: link.toEntityId,
          label: link.note || "",
          relationType: "LINK",
          isLink: true,
        })),
    ];

    nodesRef.current = nodes;
    linksRef.current = graphLinks;

    // Create or restart simulation
    if (simulationRef.current) {
      simulationRef.current.stop();
    }

    const canvas = canvasRef.current;
    const rect = canvas?.parentElement?.getBoundingClientRect();
    const width = rect?.width || 800;
    const height = rect?.height || 600;

    const simulation = d3
      .forceSimulation<GraphNode>(nodes)
      .force(
        "link",
        d3.forceLink<GraphNode, GraphLink>(graphLinks)
          .id((d) => d.id)
          .distance(120)
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide(30))
      .alphaDecay(0.02);

    simulationRef.current = simulation;
  }, [entities, relationships, links]);

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

    const handleMouseUp = () => {
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
        className="absolute inset-0 starfield-bg rounded-lg border border-border-subtle"
      />

      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="p-2 bg-bg-surface rounded-lg border border-border-subtle shadow-sm hover:bg-bg-elevated hover:border-border-strong transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-5 h-5 text-text-secondary" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 bg-bg-surface rounded-lg border border-border-subtle shadow-sm hover:bg-bg-elevated hover:border-border-strong transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-5 h-5 text-text-secondary" />
        </button>
        <button
          onClick={handleFit}
          className="p-2 bg-bg-surface rounded-lg border border-border-subtle shadow-sm hover:bg-bg-elevated hover:border-border-strong transition-colors"
          title="Fit to View"
        >
          <Maximize2 className="w-5 h-5 text-text-secondary" />
        </button>
        <button
          onClick={handleResetLayout}
          className="p-2 bg-bg-surface rounded-lg border border-border-subtle shadow-sm hover:bg-bg-elevated hover:border-border-strong transition-colors"
          title="Reset Layout"
        >
          <RotateCcw className="w-5 h-5 text-text-secondary" />
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-bg-surface/90 backdrop-blur-sm rounded-lg border border-border-subtle p-3 shadow-sm">
        <h4 className="text-xs font-medium text-text-muted mb-2">Entity Types</h4>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          {Object.entries(ENTITY_COLORS).map(([type, color]) => (
            <div key={type} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs text-text-secondary capitalize">
                {type.toLowerCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Empty state */}
      {entities.length === 0 && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="text-center text-text-muted">
            <Star className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium text-text-secondary">No entities yet</p>
            <p className="text-sm mt-1">Create entities in Plan mode to see them here</p>
          </div>
        </div>
      )}
    </div>
  );
}
