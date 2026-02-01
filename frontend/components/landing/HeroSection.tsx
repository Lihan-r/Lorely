"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ConstellationHeroBackground } from "./ConstellationHeroBackground";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Constellation Background */}
      <ConstellationHeroBackground />

      {/* Content */}
      <div className="relative z-10 container-narrow text-center py-32 sm:py-40">
        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-serif font-semibold text-text-primary leading-tight">
          <motion.span
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="block"
          >
            Plan your world.
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="block text-text-primary/80"
          >
            Write your story.
          </motion.span>
        </h1>

        {/* Gold underline */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="h-1 w-32 mx-auto mt-6 bg-gradient-to-r from-transparent via-accent to-transparent origin-center"
        />

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="mt-8 text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto"
        >
          The calm workspace for writers who build worlds. Connect your
          worldbuilding notes, write with context, and never lose your lore
          again.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", duration: 0.6, delay: 1.2, bounce: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/register">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button size="lg" variant="primary" className="animate-golden-glow">
                Start Writing Free
              </Button>
            </motion.div>
          </Link>
          <Link href="#features">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button size="lg" variant="outline" className="border-text-secondary/30 text-text-primary hover:border-accent hover:text-accent">
                See How It Works
              </Button>
            </motion.div>
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 text-text-muted"
          >
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
