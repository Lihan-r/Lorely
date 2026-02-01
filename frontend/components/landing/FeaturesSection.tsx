"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import {
  WebViewDemo,
  WriteDemo,
  MentionsDemo,
  FlexiblePagesDemo,
} from "./FeatureMiniDemo";

export function FeaturesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const cardVariants = {
    hidden: { opacity: 0, y: 30, rotateX: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
        delay: i * 0.15,
      },
    }),
  };

  return (
    <section id="features" className="section-padding section-hero">
      <div className="container-narrow">
        {/* Section Header */}
        <ScrollReveal className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-text-primary">
            Everything connected. Nothing lost.
          </h2>
          <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
            Lorely gives you the tools to build, connect, and write in one calm
            workspace.
          </p>
        </ScrollReveal>

        {/* Bento Grid */}
        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          {/* Web View - Large card spanning 2 rows */}
          <motion.div
            custom={0}
            variants={cardVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            whileHover={{ scale: 1.02, y: -5 }}
            className="md:col-span-2 md:row-span-2 relative rounded-2xl bg-bg-elevated border border-border-subtle overflow-hidden group"
            style={{ perspective: 1000 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-6 lg:p-8">
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-accent/20 text-accent">
                Visual
              </span>
              <h3 className="text-xl lg:text-2xl font-semibold text-text-primary mt-4 mb-2">
                Constellation View
              </h3>
              <p className="text-text-secondary max-w-md">
                See how all your pages connect in a beautiful, interactive graph.
                Discover relationships you didn&apos;t know existed.
              </p>
            </div>
            <div className="px-6 pb-6 lg:px-8 lg:pb-8 h-48 lg:h-64">
              <div className="w-full h-full rounded-xl bg-bg-surface border border-border-subtle overflow-hidden">
                <WebViewDemo />
              </div>
            </div>
          </motion.div>

          {/* Write Drawer */}
          <motion.div
            custom={1}
            variants={cardVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            whileHover={{ scale: 1.02, y: -5 }}
            className="relative rounded-2xl bg-bg-elevated border border-border-subtle overflow-hidden group"
            style={{ perspective: 1000 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-entity-character/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-6">
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-entity-character/20 text-entity-character">
                Writing
              </span>
              <h3 className="text-lg font-semibold text-text-primary mt-4 mb-2">
                Write Drawer
              </h3>
              <p className="text-text-secondary text-sm">
                Distraction-free writing that stays connected to your world.
              </p>
            </div>
            <div className="px-6 pb-6">
              <div className="rounded-lg bg-bg-surface border border-border-subtle overflow-hidden">
                <WriteDemo />
              </div>
            </div>
          </motion.div>

          {/* @Mentions */}
          <motion.div
            custom={2}
            variants={cardVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            whileHover={{ scale: 1.02, y: -5 }}
            className="relative rounded-2xl bg-bg-elevated border border-border-subtle overflow-hidden group"
            style={{ perspective: 1000 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-entity-location/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-6">
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-entity-location/20 text-entity-location">
                Linking
              </span>
              <h3 className="text-lg font-semibold text-text-primary mt-4 mb-2">
                @Mentions
              </h3>
              <p className="text-text-secondary text-sm">
                Reference any entity with a simple @mention.
              </p>
            </div>
            <div className="px-6 pb-6">
              <div className="rounded-lg bg-bg-surface border border-border-subtle overflow-hidden">
                <MentionsDemo />
              </div>
            </div>
          </motion.div>

          {/* Flexible Pages - Full width */}
          <motion.div
            custom={3}
            variants={cardVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            whileHover={{ scale: 1.01, y: -3 }}
            className="md:col-span-3 relative rounded-2xl bg-bg-elevated border border-border-subtle overflow-hidden group"
            style={{ perspective: 1000 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-entity-faction/5 via-transparent to-entity-event/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-entity-faction/20 text-entity-faction">
                  Organization
                </span>
                <h3 className="text-lg font-semibold text-text-primary mt-4 mb-2">
                  Flexible Pages
                </h3>
                <p className="text-text-secondary text-sm max-w-md">
                  Create any type of page: characters, locations, items, factions, events.
                  Structure your world however makes sense to you.
                </p>
              </div>
              <div className="flex-shrink-0 w-full md:w-auto">
                <div className="rounded-lg bg-bg-surface border border-border-subtle overflow-hidden">
                  <FlexiblePagesDemo />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
