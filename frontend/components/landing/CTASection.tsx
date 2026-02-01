"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

function Starfield() {
  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2,
    }));
  }, []);

  const [shootingStars, setShootingStars] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    const spawnShootingStar = () => {
      const id = Date.now();
      const x = Math.random() * 80 + 10;
      const y = Math.random() * 40;

      setShootingStars((prev) => [...prev, { id, x, y }]);

      setTimeout(() => {
        setShootingStars((prev) => prev.filter((s) => s.id !== id));
      }, 1000);
    };

    const interval = setInterval(spawnShootingStar, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Nebula glow - larger and warmer for CTA */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-3xl animate-pulse"
        style={{ backgroundColor: "var(--nebula-primary)" }}
      />

      {/* Stars */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            backgroundColor: "var(--star-color)",
          }}
          animate={{
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Shooting stars */}
      {shootingStars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute h-0.5 w-16"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            rotate: 35,
            background: "linear-gradient(to right, transparent, var(--star-color), var(--accent))",
          }}
          initial={{ x: 0, opacity: 0 }}
          animate={{ x: 200, opacity: [0, 1, 0] }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

export function CTASection() {
  return (
    <section className="relative section-padding section-warm text-text-primary overflow-hidden">
      {/* Starfield background */}
      <Starfield />

      <div className="relative z-10 container-narrow text-center">
        {/* Headline */}
        <ScrollReveal>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold">
            Start building your world today
          </h2>
        </ScrollReveal>

        {/* Subheadline */}
        <ScrollReveal delay={0.1}>
          <p className="mt-6 text-lg sm:text-xl text-text-secondary max-w-xl mx-auto">
            Join thousands of writers who&apos;ve found their home for
            worldbuilding. Free to start, no credit card required.
          </p>
        </ScrollReveal>

        {/* CTA Button */}
        <ScrollReveal delay={0.2}>
          <div className="mt-10">
            <Link href="/register">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="inline-block"
              >
                <Button
                  size="lg"
                  variant="primary"
                  className="animate-golden-glow font-semibold"
                >
                  Get Started Free
                </Button>
              </motion.div>
            </Link>
          </div>
        </ScrollReveal>

        {/* Trust Indicators */}
        <ScrollReveal delay={0.3}>
          <p className="mt-8 text-sm text-text-muted">
            Free plan includes unlimited pages &bull; No credit card required
            &bull; Export anytime
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
