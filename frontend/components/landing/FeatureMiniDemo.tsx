"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Mini constellation demo
export function WebViewDemo() {
  const [connections, setConnections] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setConnections((prev) => {
        if (prev.length >= 3) return [0];
        return [...prev, prev.length];
      });
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const nodes = [
    { x: 20, y: 30, label: "Hero" },
    { x: 75, y: 25, label: "Castle" },
    { x: 50, y: 65, label: "Sword" },
    { x: 25, y: 80, label: "Dragon" },
  ];

  const connectionPairs = [
    [0, 1],
    [0, 2],
    [2, 3],
  ];

  return (
    <div className="relative w-full h-full min-h-[120px]">
      <svg className="absolute inset-0 w-full h-full">
        {connectionPairs.map(([from, to], i) => (
          <motion.line
            key={i}
            x1={`${nodes[from].x}%`}
            y1={`${nodes[from].y}%`}
            x2={`${nodes[to].x}%`}
            y2={`${nodes[to].y}%`}
            stroke="rgba(201, 162, 39, 0.4)"
            strokeWidth={1.5}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: connections.includes(i) ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          />
        ))}
      </svg>
      {nodes.map((node, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: i * 0.15 }}
        >
          <motion.div
            className="w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
          />
          <span className="absolute left-1/2 -translate-x-1/2 top-4 text-[10px] text-text-secondary whitespace-nowrap">
            {node.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

// Typing demo
export function WriteDemo() {
  const text = "The hero embarked on...";
  const [displayText, setDisplayText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    let index = 0;
    const typeInterval = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1));
        index++;
      } else {
        setTimeout(() => {
          setDisplayText("");
          index = 0;
        }, 2000);
      }
    }, 100);

    const cursorInterval = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 530);

    return () => {
      clearInterval(typeInterval);
      clearInterval(cursorInterval);
    };
  }, []);

  return (
    <div className="p-3 font-serif text-sm text-text-primary">
      <span>{displayText}</span>
      <motion.span
        animate={{ opacity: cursorVisible ? 1 : 0 }}
        className="inline-block w-0.5 h-4 bg-accent ml-0.5 align-middle"
      />
    </div>
  );
}

// @Mentions demo
export function MentionsDemo() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const mentions = [
    { name: "@Elara", type: "Character" },
    { name: "@Eldergrove", type: "Location" },
    { name: "@Elder Council", type: "Faction" },
  ];

  useEffect(() => {
    const cycle = () => {
      setShowDropdown(true);
      setSelectedIndex(-1);

      let index = 0;
      const selectInterval = setInterval(() => {
        if (index < mentions.length) {
          setSelectedIndex(index);
          index++;
        } else {
          clearInterval(selectInterval);
          setTimeout(() => {
            setShowDropdown(false);
          }, 500);
        }
      }, 400);
    };

    cycle();
    const mainInterval = setInterval(cycle, 4000);
    return () => clearInterval(mainInterval);
  }, []);

  return (
    <div className="p-3 relative">
      <div className="text-sm text-text-secondary mb-2">
        <span className="text-accent">@El</span>
        <span className="text-text-muted">|</span>
      </div>
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="bg-bg-surface border border-border-subtle rounded-md overflow-hidden"
          >
            {mentions.map((m, i) => (
              <motion.div
                key={m.name}
                className={`px-3 py-1.5 text-xs flex justify-between ${
                  selectedIndex === i ? "bg-accent/20" : ""
                }`}
                animate={{ backgroundColor: selectedIndex === i ? "rgba(201, 162, 39, 0.2)" : "transparent" }}
              >
                <span className="text-text-primary">{m.name}</span>
                <span className="text-text-muted">{m.type}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Flexible pages demo
export function FlexiblePagesDemo() {
  const [currentType, setCurrentType] = useState(0);
  const types = [
    { name: "Character", icon: "person", color: "bg-entity-character" },
    { name: "Location", icon: "map", color: "bg-entity-location" },
    { name: "Item", icon: "cube", color: "bg-entity-item" },
    { name: "Event", icon: "calendar", color: "bg-entity-event" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentType((prev) => (prev + 1) % types.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const current = types[currentType];

  return (
    <div className="p-3 flex items-center gap-3">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentType}
          initial={{ scale: 0.8, opacity: 0, rotateY: -90 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          exit={{ scale: 0.8, opacity: 0, rotateY: 90 }}
          transition={{ duration: 0.3 }}
          className={`w-10 h-10 rounded-lg ${current.color} flex items-center justify-center`}
        >
          <span className="text-white text-lg">
            {current.icon === "person" && "👤"}
            {current.icon === "map" && "🗺️"}
            {current.icon === "cube" && "📦"}
            {current.icon === "calendar" && "📅"}
          </span>
        </motion.div>
      </AnimatePresence>
      <div>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentType}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-sm font-medium text-text-primary"
          >
            {current.name}
          </motion.div>
        </AnimatePresence>
        <div className="text-xs text-text-muted">Any page type you need</div>
      </div>
    </div>
  );
}
