"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const chaosNotes = [
  {
    file: "characters.doc",
    content: "Elena's eye color??",
    x: "5%",
    y: "10%",
    rotate: -8,
    color: "var(--entity-character)",
  },
  {
    file: "worldbuilding",
    content: "The war—which year?",
    x: "55%",
    y: "5%",
    rotate: 12,
    color: "var(--entity-location)",
  },
  {
    file: "plot_v2.txt",
    content: "FIX THE TIMELINE",
    x: "10%",
    y: "55%",
    rotate: -3,
    color: "var(--accent-warm)",
    hasScribble: true,
  },
  {
    file: "names.md",
    content: "Rivermoore? Rivermore?",
    x: "50%",
    y: "60%",
    rotate: 6,
    color: "var(--entity-item)",
  },
  {
    file: "ch7_draft",
    content: "wait does she know yet",
    x: "30%",
    y: "35%",
    rotate: -12,
    color: "var(--entity-event)",
  },
];

export function ProblemSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section className="section-padding section-surface overflow-hidden">
      <div className="container-narrow">
        {/* Asymmetric two-column layout */}
        <div
          ref={containerRef}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          {/* Left: Visual chaos */}
          <div className="relative h-[350px] order-2 lg:order-1">
            {/* Scattered, messy sticky notes */}
            {chaosNotes.map((note, i) => (
              <motion.div
                key={i}
                className="absolute bg-[#fff8dc] dark:bg-[#3a3428] p-3 rounded shadow-lg max-w-[150px]"
                style={{
                  left: note.x,
                  top: note.y,
                  borderLeft: `4px solid ${note.color}`,
                }}
                initial={{
                  opacity: 0,
                  scale: 0.8,
                  rotate: note.rotate * 2,
                }}
                animate={
                  isInView
                    ? {
                        opacity: 1,
                        scale: 1,
                        rotate: note.rotate,
                      }
                    : {
                        opacity: 0,
                        scale: 0.8,
                        rotate: note.rotate * 2,
                      }
                }
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                  delay: i * 0.12,
                }}
                whileHover={{
                  scale: 1.08,
                  rotate: 0,
                  zIndex: 10,
                  boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
                }}
              >
                <span className="text-[10px] font-mono text-text-muted block mb-1">
                  {note.file}
                </span>
                <p className="text-sm text-text-primary leading-tight">
                  {note.content}
                </p>
                {note.hasScribble && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 text-accent-warm text-lg font-bold">
                    ✗
                  </div>
                )}
              </motion.div>
            ))}

            {/* Question marks floating */}
            <motion.span
              className="absolute text-8xl font-serif select-none pointer-events-none"
              style={{
                left: "40%",
                top: "30%",
                color: "var(--text-muted)",
                opacity: 0.1,
              }}
              initial={{ opacity: 0 }}
              animate={
                isInView
                  ? {
                      opacity: 0.1,
                      rotate: [0, 5, -5, 0],
                      y: [0, -10, 0],
                    }
                  : { opacity: 0 }
              }
              transition={{
                opacity: { duration: 0.5 },
                rotate: { duration: 4, repeat: Infinity },
                y: { duration: 4, repeat: Infinity },
              }}
            >
              ?
            </motion.span>

            {/* Decorative broken connection lines */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ opacity: 0.15 }}
            >
              <motion.line
                x1="20%"
                y1="25%"
                x2="35%"
                y2="40%"
                stroke="var(--text-muted)"
                strokeWidth="1"
                strokeDasharray="4 4"
                initial={{ pathLength: 0 }}
                animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
              />
              <motion.line
                x1="60%"
                y1="20%"
                x2="45%"
                y2="40%"
                stroke="var(--text-muted)"
                strokeWidth="1"
                strokeDasharray="4 4"
                initial={{ pathLength: 0 }}
                animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
                transition={{ duration: 1, delay: 0.7 }}
              />
              <motion.line
                x1="40%"
                y1="50%"
                x2="55%"
                y2="65%"
                stroke="var(--text-muted)"
                strokeWidth="1"
                strokeDasharray="4 4"
                initial={{ pathLength: 0 }}
                animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
                transition={{ duration: 1, delay: 0.9 }}
              />
            </svg>
          </div>

          {/* Right: Copy */}
          <motion.div
            className="order-1 lg:order-2"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl lg:text-4xl font-serif font-semibold text-text-primary leading-snug">
              Fifteen tabs. Three notebooks.
              <br />
              <span className="text-text-muted">
                Zero idea where you wrote that thing.
              </span>
            </h2>

            <p className="mt-6 text-lg text-text-secondary">
              You&apos;ve tried Notion. You&apos;ve tried Scrivener. You&apos;ve
              got a folder called &quot;FINAL_FINAL_v3&quot; somewhere. Sound
              about right?
            </p>

            <p className="mt-4 text-lg">
              <span className="text-accent font-medium">Lorely fixes this.</span>{" "}
              Everything you write links to everything else—automatically.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
