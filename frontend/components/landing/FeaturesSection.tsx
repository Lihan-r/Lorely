"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  WebViewDemo,
  WriteDemo,
  MentionsDemo,
  FlexiblePagesDemo,
} from "./FeatureMiniDemo";

export function FeaturesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section
      id="features"
      className="section-padding section-warm relative overflow-hidden"
    >
      <div className="container-narrow relative z-10" ref={containerRef}>
        {/* Section Header - simple, no animation */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-text-primary">
            Everything connected. Nothing lost.
          </h2>
          <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
            Lorely gives you the tools to build, connect, and write in one calm
            workspace.
          </p>
        </div>

        {/* Feature 1: Constellation - FULL WIDTH with big visual */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative rounded-3xl overflow-hidden bg-bg-deep border border-border-subtle">
            {/* Full-width constellation demo */}
            <div className="absolute inset-0 opacity-60">
              <WebViewDemo />
            </div>

            {/* Text overlay */}
            <div className="relative z-10 p-8 lg:p-12">
              <div className="max-w-md">
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-accent/20 text-accent">
                  Constellation View
                </span>
                <h3 className="text-2xl lg:text-3xl font-serif font-semibold mt-4 text-text-primary">
                  See your world from above
                </h3>
                <p className="text-text-secondary mt-3">
                  Every character, location, and plot point—connected in one
                  visual map. Discover relationships you never noticed before.
                </p>
              </div>
            </div>

            {/* Gradient overlay for readability */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to right, var(--bg-deep) 0%, var(--bg-deep) 40%, transparent 100%)",
              }}
            />
          </div>
        </motion.div>

        {/* Features 2-4: Asymmetric grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Write Drawer - spans 2 rows on larger screens */}
          <motion.div
            className="md:row-span-2 rounded-2xl bg-bg-elevated border border-border-subtle overflow-hidden"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.02, y: -4 }}
          >
            <div className="p-6">
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-entity-character/20 text-entity-character">
                Writing
              </span>
              <h3 className="text-xl font-semibold text-text-primary mt-3 mb-2">
                Write Drawer
              </h3>
              <p className="text-text-secondary text-sm">
                Distraction-free writing that stays connected to your world.
                Focus on the words while the connections happen automatically.
              </p>
            </div>
            <div className="h-56 border-t border-border-subtle/50">
              <WriteDemo />
            </div>
          </motion.div>

          {/* Mentions - compact */}
          <motion.div
            className="rounded-2xl bg-bg-elevated border border-border-subtle overflow-hidden"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ scale: 1.02, y: -4 }}
          >
            <div className="p-5">
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-entity-location/20 text-entity-location">
                Linking
              </span>
              <h3 className="text-lg font-semibold text-text-primary mt-3 mb-1">
                @Mentions
              </h3>
              <p className="text-text-secondary text-sm">
                Reference any entity with a simple @mention.
              </p>
            </div>
            <div className="h-36 border-t border-border-subtle/50">
              <MentionsDemo />
            </div>
          </motion.div>

          {/* Flexible Pages - compact */}
          <motion.div
            className="rounded-2xl bg-bg-elevated border border-border-subtle overflow-hidden"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.02, y: -4 }}
          >
            <div className="p-5">
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-entity-faction/20 text-entity-faction">
                Organization
              </span>
              <h3 className="text-lg font-semibold text-text-primary mt-3 mb-1">
                Flexible Pages
              </h3>
              <p className="text-text-secondary text-sm">
                Characters, locations, items, factions—structure your world
                however makes sense.
              </p>
            </div>
            <div className="h-36 border-t border-border-subtle/50">
              <FlexiblePagesDemo />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
