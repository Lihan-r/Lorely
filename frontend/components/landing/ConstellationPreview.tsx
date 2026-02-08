"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Node {
  id: string;
  x: number;
  y: number;
  label: string;
  type: "character" | "location" | "event" | "item" | "faction";
  size: "sm" | "md" | "lg";
}

const nodes: Node[] = [
  { id: "elara", x: 20, y: 25, label: "Elara", type: "character", size: "lg" },
  { id: "kingdom", x: 70, y: 20, label: "The Kingdom", type: "location", size: "md" },
  { id: "war", x: 45, y: 55, label: "Ancient War", type: "event", size: "md" },
  { id: "sword", x: 75, y: 65, label: "Starforged Blade", type: "item", size: "sm" },
  { id: "guild", x: 25, y: 75, label: "Shadow Guild", type: "faction", size: "sm" },
];

const connections: [string, string][] = [
  ["elara", "kingdom"],
  ["elara", "war"],
  ["elara", "guild"],
  ["kingdom", "war"],
  ["war", "sword"],
  ["guild", "sword"],
];

const typeColors: Record<Node["type"], string> = {
  character: "var(--entity-character)",
  location: "var(--entity-location)",
  event: "var(--entity-event)",
  item: "var(--entity-item)",
  faction: "var(--entity-faction)",
};

const sizeClasses: Record<Node["size"], { node: string; glow: number }> = {
  sm: { node: "w-3 h-3", glow: 6 },
  md: { node: "w-4 h-4", glow: 8 },
  lg: { node: "w-5 h-5", glow: 10 },
};

export function ConstellationPreview() {
  const [activeConnection, setActiveConnection] = useState(0);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveConnection((prev) => (prev + 1) % connections.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const getNodeById = (id: string) => nodes.find((n) => n.id === id);

  return (
    <div className="relative w-full h-full bg-bg-deep overflow-hidden">
      {/* Mini sidebar hint */}
      <div className="absolute left-0 top-0 bottom-0 w-10 bg-bg-surface/40 border-r border-border-subtle/30">
        <div className="p-2 space-y-3 mt-3">
          {["character", "location", "event"].map((type) => (
            <div
              key={type}
              className="w-6 h-6 rounded-lg bg-bg-elevated/60 flex items-center justify-center"
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: typeColors[type as Node["type"]] }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Main constellation area */}
      <div className="absolute inset-0 ml-10">
        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full">
          <defs>
            <filter id="connectionGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {connections.map(([fromId, toId], i) => {
            const from = getNodeById(fromId);
            const to = getNodeById(toId);
            if (!from || !to) return null;

            const isActive = i === activeConnection;
            const isHovered =
              hoveredNode === fromId || hoveredNode === toId;

            return (
              <motion.line
                key={`${fromId}-${toId}`}
                x1={`${from.x}%`}
                y1={`${from.y}%`}
                x2={`${to.x}%`}
                y2={`${to.y}%`}
                stroke="var(--constellation-line)"
                strokeWidth={isActive || isHovered ? 2.5 : 1.5}
                filter={isActive ? "url(#connectionGlow)" : undefined}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: 1,
                  opacity: isActive || isHovered ? 0.9 : 0.3,
                }}
                transition={{ duration: 0.5 }}
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {nodes.map((node, i) => {
          const isConnected =
            connections[activeConnection]?.includes(node.id) ||
            hoveredNode === node.id;

          return (
            <motion.div
              key={node.id}
              className="absolute cursor-pointer"
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              {/* Node circle */}
              <motion.div
                className={`${sizeClasses[node.size].node} -translate-x-1/2 -translate-y-1/2 rounded-full`}
                style={{
                  backgroundColor: typeColors[node.type],
                  boxShadow: isConnected
                    ? `0 0 ${sizeClasses[node.size].glow * 2}px ${typeColors[node.type]}`
                    : `0 0 ${sizeClasses[node.size].glow}px ${typeColors[node.type]}40`,
                }}
                animate={{
                  scale: isConnected ? [1, 1.2, 1] : 1,
                }}
                transition={{ duration: 0.6 }}
              />

              {/* Label */}
              <motion.span
                className="absolute left-1/2 -translate-x-1/2 top-4 px-2 py-0.5 text-[10px] bg-bg-elevated/95 text-text-secondary rounded-full whitespace-nowrap border border-border-subtle/50 shadow-lg"
                initial={{ opacity: 0, y: -5 }}
                animate={{
                  opacity: isConnected || hoveredNode === node.id ? 1 : 0.7,
                  y: 0,
                }}
                transition={{ delay: i * 0.1 + 0.2 }}
              >
                {node.label}
              </motion.span>
            </motion.div>
          );
        })}

        {/* Subtle ambient particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-star-color/30"
            style={{
              left: `${15 + Math.random() * 70}%`,
              top: `${15 + Math.random() * 70}%`,
            }}
            animate={{
              opacity: [0.2, 0.5, 0.2],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>
    </div>
  );
}
