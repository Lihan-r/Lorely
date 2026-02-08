"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ConstellationPreview } from "./ConstellationPreview";

export function HeroSection() {
  return (
    <section className="min-h-screen flex items-center section-hero">
      <div className="container-narrow">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* LEFT: Mini-app preview */}
          <motion.div
            className="relative order-2 lg:order-1"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="rounded-2xl overflow-hidden border border-border-subtle shadow-2xl bg-bg-deep">
              {/* Interactive constellation mini-demo */}
              <div className="aspect-[4/3]">
                <ConstellationPreview />
              </div>
            </div>
            {/* Subtle glow behind */}
            <div
              className="absolute -inset-4 -z-10 rounded-3xl blur-2xl opacity-30"
              style={{ background: "var(--nebula-primary)" }}
            />
          </motion.div>

          {/* RIGHT: Headline + CTA */}
          <div className="order-1 lg:order-2">
            <motion.h1
              className="text-5xl lg:text-6xl xl:text-7xl font-sans font-bold tracking-tight text-text-primary"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Your world,
              <br />
              <span className="text-accent">connected.</span>
            </motion.h1>

            <motion.p
              className="mt-6 text-xl text-text-secondary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              Stop losing track of characters, places, and plots.
              Everything links together automatically.
            </motion.p>

            <motion.div
              className="mt-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Link href="/register">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-block"
                >
                  <Button size="lg" variant="primary" className="animate-golden-glow">
                    Start Writing
                  </Button>
                </motion.div>
              </Link>
              <p className="mt-3 text-sm text-text-muted">
                Free forever &bull; No credit card
              </p>
            </motion.div>

            {/* Scroll hint */}
            <motion.div
              className="mt-16 text-text-muted text-sm flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: [0, 5, 0] }}
              transition={{
                opacity: { delay: 1.2, duration: 0.5 },
                y: { duration: 2, repeat: Infinity, delay: 1.2 },
              }}
            >
              <span>Scroll to explore</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
