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

const playfulVariants = {
  hidden: (i: number) => ({
    opacity: 0,
    x: i % 2 === 0 ? -100 : 100,
    rotate: i % 2 === 0 ? -10 : 10,
    scale: 0.85,
  }),
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    rotate: [-2, 1.5, -1, 0.5][i],
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 50,
      damping: 12,
      delay: i * 0.2,
    },
  }),
};

const floatingElements = [
  { size: "w-4 h-4", color: "bg-accent/15", top: "15%", left: "8%", delay: 0 },
  { size: "w-3 h-3", color: "bg-entity-character/20", top: "35%", right: "5%", delay: 1 },
  { size: "w-5 h-5", color: "bg-entity-location/15", top: "60%", left: "12%", delay: 2 },
  { size: "w-3 h-3", color: "bg-entity-event/20", top: "80%", right: "10%", delay: 0.5 },
  { size: "w-4 h-4", color: "bg-accent/10", top: "45%", left: "3%", delay: 1.5 },
];

const features = [
  {
    badge: "Visual",
    badgeColor: "bg-accent/20 text-accent",
    title: "Constellation View",
    description: "See how all your pages connect in a beautiful, interactive graph. Discover relationships you didn't know existed.",
    Demo: WebViewDemo,
    width: "w-full md:w-3/4",
    align: "ml-auto",
  },
  {
    badge: "Writing",
    badgeColor: "bg-entity-character/20 text-entity-character",
    title: "Write Drawer",
    description: "Distraction-free writing that stays connected to your world.",
    Demo: WriteDemo,
    width: "w-full md:w-3/5",
    align: "mr-auto",
  },
  {
    badge: "Linking",
    badgeColor: "bg-entity-location/20 text-entity-location",
    title: "@Mentions",
    description: "Reference any entity with a simple @mention. Build connections as you write.",
    Demo: MentionsDemo,
    width: "w-full md:w-[65%]",
    align: "mx-auto",
  },
  {
    badge: "Organization",
    badgeColor: "bg-entity-faction/20 text-entity-faction",
    title: "Flexible Pages",
    description: "Create any type of page: characters, locations, items, factions, events. Structure your world however makes sense to you.",
    Demo: FlexiblePagesDemo,
    width: "w-full md:w-[70%]",
    align: "mr-auto",
  },
];

export function FeaturesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section id="features" className="section-padding section-warm relative overflow-hidden">
      {/* Floating decorative elements */}
      {floatingElements.map((el, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full ${el.size} ${el.color} pointer-events-none`}
          style={{ top: el.top, left: el.left, right: el.right }}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 6 + el.delay,
            repeat: Infinity,
            ease: "easeInOut",
            delay: el.delay,
          }}
        />
      ))}

      <div className="container-narrow relative z-10">
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

        {/* Staggered Cards */}
        <div ref={containerRef} className="flex flex-col gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              custom={index}
              variants={playfulVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              whileHover={{ scale: 1.03, rotate: 0, y: -8 }}
              className={`
                ${feature.width}
                ${feature.align}
                rounded-3xl
                bg-bg-elevated/90 backdrop-blur-sm
                border-2 border-border-subtle/50
                shadow-xl shadow-black/5
                hover:border-accent/40 hover:shadow-2xl
                transition-all duration-300
                overflow-hidden
              `}
            >
              <div className="p-6 lg:p-8">
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  {/* Text Content */}
                  <div className="flex-1">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${feature.badgeColor}`}>
                      {feature.badge}
                    </span>
                    <h3 className="text-xl lg:text-2xl font-semibold text-text-primary mt-4 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-text-secondary">
                      {feature.description}
                    </p>
                  </div>

                  {/* Demo */}
                  <div className="flex-shrink-0 w-full lg:w-64 h-40 lg:h-48 rounded-xl bg-bg-surface border border-border-subtle overflow-hidden">
                    <feature.Demo />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
