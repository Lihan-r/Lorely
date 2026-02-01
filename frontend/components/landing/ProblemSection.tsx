"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

// Scattered positions for initial state (rotation, x offset, y offset, scale)
const scatteredStates = [
  { rotate: -5, x: -30, y: 20, scale: 0.95 },
  { rotate: 4, x: 25, y: -15, scale: 1.02 },
  { rotate: -3, x: -20, y: -25, scale: 0.98 },
  { rotate: 6, x: 35, y: 15, scale: 1.05 },
];

export function ProblemSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const painPoints = [
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      title: "Scattered notes everywhere",
      description:
        "Character details in one doc, maps in another, timelines somewhere else. Finding anything takes forever.",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: "Lost lore and forgotten details",
      description:
        "Was her eye color blue or green? When did that battle happen? You know you wrote it somewhere...",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          />
        </svg>
      ),
      title: "No connections between ideas",
      description:
        "Your world is rich and interconnected, but your tools treat every note as an island.",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: "Time lost searching, not writing",
      description:
        "You spend more time hunting for information than actually creating your story.",
    },
  ];

  return (
    <section className="section-padding bg-bg-surface">
      <div className="container-narrow">
        {/* Section Header */}
        <ScrollReveal className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-text-primary">
            Tired of scattered notes and lost lore?
          </h2>
          <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
            Worldbuilding is complex. Your tools shouldn&apos;t make it harder.
          </p>
        </ScrollReveal>

        {/* Pain Points Grid - Scattered to Organized */}
        <div ref={containerRef} className="grid sm:grid-cols-2 gap-6 lg:gap-8">
          {painPoints.map((point, index) => {
            const scattered = scatteredStates[index];
            return (
              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  rotate: scattered.rotate,
                  x: scattered.x,
                  y: scattered.y,
                  scale: scattered.scale,
                }}
                animate={
                  isInView
                    ? { opacity: 1, rotate: 0, x: 0, y: 0, scale: 1 }
                    : {
                        opacity: 0,
                        rotate: scattered.rotate,
                        x: scattered.x,
                        y: scattered.y,
                        scale: scattered.scale,
                      }
                }
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                  delay: index * 0.1,
                }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="p-6 rounded-xl bg-bg-elevated border border-border-subtle hover:border-accent/30 transition-colors"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.4 }}
                  className="w-12 h-12 rounded-lg bg-bg-surface border border-border-subtle flex items-center justify-center text-text-secondary mb-4"
                >
                  {point.icon}
                </motion.div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  {point.title}
                </h3>
                <p className="text-text-secondary">{point.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
