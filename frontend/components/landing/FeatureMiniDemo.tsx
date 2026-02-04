"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Realistic constellation view with more nodes, glow effects, and mini sidebar
export function WebViewDemo() {
  const [activeConnections, setActiveConnections] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveConnections((prev) => {
        if (prev.length >= 6) return [0];
        return [...prev, prev.length];
      });
    }, 600);
    return () => clearInterval(interval);
  }, []);

  const nodes = [
    { x: 25, y: 25, label: "Hero", color: "bg-entity-character", size: "w-3.5 h-3.5" },
    { x: 70, y: 20, label: "Castle", color: "bg-entity-location", size: "w-3 h-3" },
    { x: 55, y: 50, label: "Sword", color: "bg-entity-item", size: "w-2.5 h-2.5" },
    { x: 20, y: 70, label: "Dragon", color: "bg-entity-character", size: "w-3.5 h-3.5" },
    { x: 80, y: 60, label: "Guild", color: "bg-entity-faction", size: "w-3 h-3" },
    { x: 45, y: 80, label: "Battle", color: "bg-entity-event", size: "w-2.5 h-2.5" },
  ];

  const connections = [
    [0, 1], [0, 2], [0, 3], [2, 3], [1, 4], [3, 5],
  ];

  return (
    <div className="relative w-full h-full bg-bg-deep">
      {/* Mini sidebar hint */}
      <div className="absolute left-0 top-0 bottom-0 w-6 bg-bg-surface/50 border-r border-border-subtle/30">
        <div className="mt-3 mx-1 space-y-2">
          <div className="w-4 h-1 bg-text-muted/30 rounded" />
          <div className="w-3 h-1 bg-text-muted/20 rounded" />
          <div className="w-4 h-1 bg-text-muted/20 rounded" />
        </div>
      </div>

      {/* Main constellation area */}
      <div className="absolute inset-0 ml-6">
        <svg className="absolute inset-0 w-full h-full">
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {connections.map(([from, to], i) => (
            <motion.line
              key={i}
              x1={`${nodes[from].x}%`}
              y1={`${nodes[from].y}%`}
              x2={`${nodes[to].x}%`}
              y2={`${nodes[to].y}%`}
              stroke="var(--constellation-line)"
              strokeWidth={activeConnections.includes(i) ? 2.5 : 1.5}
              filter={activeConnections.includes(i) ? "url(#glow)" : undefined}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: activeConnections.includes(i) ? 1 : 0.3,
                opacity: activeConnections.includes(i) ? 1 : 0.4,
              }}
              transition={{ duration: 0.4 }}
            />
          ))}
        </svg>

        {nodes.map((node, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
          >
            <motion.div
              className={`${node.size} -translate-x-1/2 -translate-y-1/2 rounded-full ${node.color} shadow-lg`}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 }}
              style={{
                boxShadow: `0 0 8px var(--accent-glow)`,
              }}
            />
            <span className="absolute left-1/2 -translate-x-1/2 top-3 px-1.5 py-0.5 text-[8px] bg-bg-elevated/90 text-text-secondary rounded-full whitespace-nowrap border border-border-subtle/50">
              {node.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Mini editor mockup with toolbar, line numbers, and @mention
export function WriteDemo() {
  const [typedText, setTypedText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const fullText = "met @Elara at the tavern";

  useEffect(() => {
    let index = 0;
    const typeInterval = setInterval(() => {
      if (index < fullText.length) {
        setTypedText(fullText.slice(0, index + 1));
        index++;
      } else {
        setTimeout(() => {
          setTypedText("");
          index = 0;
        }, 2500);
      }
    }, 80);

    const cursorInterval = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 530);

    return () => {
      clearInterval(typeInterval);
      clearInterval(cursorInterval);
    };
  }, []);

  // Split text to highlight @mention
  const renderText = () => {
    if (!typedText) return null;

    const parts = typedText.split(/(@\w+)/);
    return parts.map((part, i) => {
      if (!part) return null;
      return part.startsWith("@") ? (
        <span key={i} className="text-accent font-medium bg-accent/10 px-0.5 rounded">
          {part}
        </span>
      ) : (
        <span key={i}>{part}</span>
      );
    });
  };

  return (
    <div className="w-full h-full bg-bg-deep flex flex-col">
      {/* Faux toolbar */}
      <div className="flex items-center gap-1.5 px-2 py-1.5 border-b border-border-subtle/30 bg-bg-surface/50">
        <div className="w-4 h-4 rounded bg-text-muted/20 flex items-center justify-center text-[8px] font-bold text-text-muted">B</div>
        <div className="w-4 h-4 rounded bg-text-muted/20 flex items-center justify-center text-[8px] italic text-text-muted">I</div>
        <div className="w-4 h-4 rounded bg-text-muted/20 flex items-center justify-center text-[8px] text-text-muted">
          <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </div>
        <div className="w-px h-3 bg-border-subtle/50 mx-1" />
        <div className="w-4 h-4 rounded bg-text-muted/20 flex items-center justify-center text-[8px] text-text-muted">H1</div>
      </div>

      {/* Editor area with line numbers */}
      <div className="flex-1 flex">
        {/* Line numbers */}
        <div className="w-6 py-2 text-right pr-1.5 text-[9px] text-text-muted/50 bg-bg-surface/30 border-r border-border-subtle/20 select-none">
          <div>1</div>
          <div>2</div>
          <div>3</div>
          <div>4</div>
        </div>

        {/* Content */}
        <div className="flex-1 p-2 font-serif text-xs text-text-primary leading-relaxed">
          {/* Previous "written" lines */}
          <div className="h-3 w-3/4 bg-text-muted/15 rounded mb-1.5" />
          <div className="h-3 w-full bg-text-muted/15 rounded mb-1.5" />
          <div className="h-3 w-2/3 bg-text-muted/15 rounded mb-2" />

          {/* Active typing line - wrap in flex with proper spacing */}
          <div className="flex items-center flex-wrap">
            <span className="text-text-secondary">The hero&nbsp;</span>
            {renderText()}
            <motion.span
              animate={{ opacity: cursorVisible ? 1 : 0 }}
              className="inline-block w-0.5 h-3.5 bg-accent ml-0.5"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Rich @mentions dropdown with entity icons and types
export function MentionsDemo() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [typedChars, setTypedChars] = useState("");

  const mentions = [
    { name: "Elara", type: "Character", color: "bg-entity-character" },
    { name: "Eldergrove", type: "Location", color: "bg-entity-location" },
    { name: "Elder Council", type: "Faction", color: "bg-entity-faction" },
  ];

  useEffect(() => {
    const runCycle = () => {
      // Reset
      setTypedChars("");
      setShowDropdown(false);
      setSelectedIndex(-1);

      // Type "@El" character by character
      const chars = "@El";
      let charIndex = 0;
      const typeInterval = setInterval(() => {
        if (charIndex < chars.length) {
          setTypedChars(chars.slice(0, charIndex + 1));
          charIndex++;
          if (charIndex === chars.length) {
            setTimeout(() => setShowDropdown(true), 200);
          }
        }
      }, 150);

      // Cycle through dropdown selection
      setTimeout(() => {
        let selectIndex = 0;
        const selectInterval = setInterval(() => {
          if (selectIndex <= mentions.length) {
            setSelectedIndex(selectIndex - 1);
            selectIndex++;
          } else {
            clearInterval(selectInterval);
            setTimeout(() => setShowDropdown(false), 400);
          }
        }, 350);
      }, 800);

      setTimeout(() => clearInterval(typeInterval), 1000);
    };

    runCycle();
    const mainInterval = setInterval(runCycle, 4500);
    return () => clearInterval(mainInterval);
  }, []);

  return (
    <div className="w-full h-full bg-bg-deep p-3 flex flex-col">
      {/* Faux text area */}
      <div className="bg-bg-surface/50 rounded-lg border border-border-subtle/30 p-2 mb-2 flex-1">
        <div className="h-2.5 w-3/4 bg-text-muted/15 rounded mb-1.5" />
        <div className="h-2.5 w-1/2 bg-text-muted/15 rounded mb-2" />
        <div className="text-sm text-text-secondary">
          She traveled to{" "}
          <span className="text-accent font-medium">{typedChars}</span>
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="inline-block w-0.5 h-3 bg-text-muted ml-0.5"
          />
        </div>
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-bg-elevated border border-border-subtle rounded-lg overflow-hidden shadow-xl"
          >
            {mentions.map((m, i) => (
              <motion.div
                key={m.name}
                className={`px-3 py-2 flex items-center gap-2 transition-colors ${
                  selectedIndex === i
                    ? "bg-accent/15 border-l-2 border-accent"
                    : "border-l-2 border-transparent"
                }`}
              >
                <div className={`w-2.5 h-2.5 rounded-full ${m.color}`} />
                <span className="text-xs text-text-primary font-medium flex-1">
                  {m.name}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-bg-surface text-text-muted">
                  {m.type}
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Mini page-type selector with tabs and preview
export function FlexiblePagesDemo() {
  const [activeIndex, setActiveIndex] = useState(0);

  const types = [
    { name: "Character", color: "bg-entity-character", fields: ["Name", "Role", "Backstory"] },
    { name: "Location", color: "bg-entity-location", fields: ["Name", "Region", "Description"] },
    { name: "Item", color: "bg-entity-item", fields: ["Name", "Type", "Properties"] },
    { name: "Event", color: "bg-entity-event", fields: ["Name", "Date", "Participants"] },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % types.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const current = types[activeIndex];

  return (
    <div className="w-full h-full bg-bg-deep p-3 flex flex-col">
      {/* Type tabs */}
      <div className="flex gap-1 mb-3 overflow-hidden">
        {types.map((type, i) => (
          <motion.button
            key={type.name}
            className={`px-2 py-1 text-[10px] rounded-md transition-all ${
              activeIndex === i
                ? "bg-bg-elevated text-text-primary shadow-sm border border-border-subtle"
                : "text-text-muted hover:text-text-secondary"
            }`}
            animate={{
              scale: activeIndex === i ? 1 : 0.95,
            }}
          >
            <span className={`inline-block w-1.5 h-1.5 rounded-full ${type.color} mr-1`} />
            {type.name}
          </motion.button>
        ))}
      </div>

      {/* Preview area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="flex-1 bg-bg-elevated rounded-lg border border-border-subtle p-2"
        >
          {/* Page header mockup */}
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border-subtle/50">
            <div className={`w-3 h-3 rounded ${current.color}`} />
            <div className="h-2.5 w-16 bg-text-muted/20 rounded" />
          </div>

          {/* Field mockups */}
          <div className="space-y-1.5">
            {current.fields.map((field, i) => (
              <div key={field} className="flex items-center gap-2">
                <span className="text-[9px] text-text-muted w-12">{field}</span>
                <motion.div
                  className="h-2 flex-1 bg-text-muted/10 rounded"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: i * 0.1, duration: 0.3 }}
                />
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
