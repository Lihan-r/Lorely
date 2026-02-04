"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

const scatteredNotes = [
  {
    label: "character.doc",
    content: "Elena's eye color?",
    x: "10%",
    y: "15%",
    rotate: -8,
  },
  {
    label: "world-notes.txt",
    content: "The war started in...",
    x: "65%",
    y: "10%",
    rotate: 5,
  },
  {
    label: "timeline??",
    content: "Ch 3 before Ch 7?",
    x: "20%",
    y: "55%",
    rotate: -3,
  },
  {
    label: "names.doc",
    content: "Rivermoor or Rivermoore",
    x: "55%",
    y: "60%",
    rotate: 12,
  },
  {
    label: "plot-holes.txt",
    content: "FIX THIS!!!",
    x: "40%",
    y: "35%",
    rotate: -15,
  },
];

export function ProblemSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section className="section-padding section-surface overflow-hidden">
      <div className="container-narrow">
        {/* Headline - more personality */}
        <ScrollReveal className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-text-primary">
            Sound familiar?
          </h2>
        </ScrollReveal>

        {/* Visual chaos scene - scattered "notes" */}
        <div ref={containerRef} className="relative min-h-[350px] sm:min-h-[400px]">
          {/* Center question marks / confusion indicators */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-7xl sm:text-8xl text-text-muted/10 font-serif select-none">
              ?
            </span>
          </motion.div>

          {/* Floating scattered notes */}
          {scatteredNotes.map((note, i) => (
            <motion.div
              key={i}
              className="absolute bg-bg-elevated rounded-lg border border-border-subtle p-3 shadow-lg max-w-[140px] sm:max-w-[160px]"
              style={{
                left: note.x,
                top: note.y,
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
                boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
              }}
            >
              <span className="text-[10px] sm:text-xs text-text-muted font-mono block mb-1 truncate">
                {note.label}
              </span>
              <p className="text-xs sm:text-sm text-text-primary leading-tight">
                {note.content}
              </p>
            </motion.div>
          ))}

          {/* Decorative connection lines (broken/incomplete) */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ opacity: 0.15 }}
          >
            <motion.line
              x1="20%"
              y1="30%"
              x2="35%"
              y2="45%"
              stroke="var(--text-muted)"
              strokeWidth="1"
              strokeDasharray="4 4"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
            <motion.line
              x1="60%"
              y1="25%"
              x2="50%"
              y2="40%"
              stroke="var(--text-muted)"
              strokeWidth="1"
              strokeDasharray="4 4"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
            />
            <motion.line
              x1="45%"
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

        {/* Single punchy line */}
        <ScrollReveal delay={0.3} className="text-center mt-8">
          <p className="text-base sm:text-lg text-text-secondary max-w-lg mx-auto">
            Fifteen tabs. Three notebooks. One very confused writer.
            <br />
            <span className="text-accent font-medium">There&apos;s a better way.</span>
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
