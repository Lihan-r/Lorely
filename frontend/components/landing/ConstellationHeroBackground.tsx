"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  layer: number; // 1-4, higher = closer/faster
  twinkleDelay: number;
  twinkleDuration: number;
}

interface ShootingStar {
  id: number;
  startX: number;
  startY: number;
  angle: number;
}

const STAR_COUNT = 30;
const LAYERS = 4;

function generateStars(): Star[] {
  return Array.from({ length: STAR_COUNT }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    layer: Math.floor(Math.random() * LAYERS) + 1,
    twinkleDelay: Math.random() * 5,
    twinkleDuration: Math.random() * 3 + 2,
  }));
}

function getParallaxMultiplier(layer: number): number {
  return layer * 0.015;
}

export function ConstellationHeroBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stars] = useState<Star[]>(generateStars);
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);
  const [mounted, setMounted] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 30 });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const x = e.clientX - rect.left - centerX;
      const y = e.clientY - rect.top - centerY;
      mouseX.set(x);
      mouseY.set(y);
    },
    [mouseX, mouseY]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  // Shooting stars
  useEffect(() => {
    if (!mounted) return;

    const spawnShootingStar = () => {
      const id = Date.now();
      const startX = Math.random() * 60 + 20;
      const startY = Math.random() * 30;
      const angle = Math.random() * 30 + 30;

      setShootingStars((prev) => [...prev, { id, startX, startY, angle }]);

      setTimeout(() => {
        setShootingStars((prev) => prev.filter((s) => s.id !== id));
      }, 1000);
    };

    const interval = setInterval(spawnShootingStar, 4000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, [mounted]);

  // Find nearby stars for connections
  const getConnections = useCallback(() => {
    const connections: { from: Star; to: Star; distance: number }[] = [];
    const maxDistance = 20;

    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const dx = stars[i].x - stars[j].x;
        const dy = stars[i].y - stars[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance && stars[i].layer === stars[j].layer) {
          connections.push({ from: stars[i], to: stars[j], distance });
        }
      }
    }
    return connections;
  }, [stars]);

  const connections = getConnections();

  if (!mounted) {
    return (
      <div className="absolute inset-0 overflow-hidden section-hero" />
    );
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden section-hero"
    >
      {/* Nebula glow patches - theme aware */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse"
          style={{ backgroundColor: "var(--nebula-primary)" }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full blur-3xl animate-pulse"
          style={{ backgroundColor: "var(--nebula-secondary)", animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full blur-3xl animate-pulse"
          style={{ backgroundColor: "var(--nebula-tertiary)", animationDelay: "2s" }}
        />
      </div>

      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {connections.map(({ from, to }, i) => (
          <motion.line
            key={`${from.id}-${to.id}`}
            x1={`${from.x}%`}
            y1={`${from.y}%`}
            x2={`${to.x}%`}
            y2={`${to.y}%`}
            stroke="var(--constellation-line)"
            strokeWidth={1}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: 1,
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              pathLength: { duration: 1, delay: i * 0.1 },
              opacity: { duration: 3 + Math.random() * 2, repeat: Infinity, delay: i * 0.2 },
            }}
            style={{
              transform: `translate(${(springX.get() * getParallaxMultiplier(from.layer))}px, ${(springY.get() * getParallaxMultiplier(from.layer))}px)`,
            }}
          />
        ))}
      </svg>

      {/* Stars */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size + star.layer * 0.5,
            height: star.size + star.layer * 0.5,
            backgroundColor: "var(--star-color)",
            x: springX.get() * getParallaxMultiplier(star.layer),
            y: springY.get() * getParallaxMultiplier(star.layer),
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.2, 1],
            x: springX.get() * getParallaxMultiplier(star.layer),
            y: springY.get() * getParallaxMultiplier(star.layer),
          }}
          transition={{
            opacity: {
              duration: star.twinkleDuration,
              repeat: Infinity,
              delay: star.twinkleDelay,
              ease: "easeInOut",
            },
            scale: {
              duration: star.twinkleDuration,
              repeat: Infinity,
              delay: star.twinkleDelay,
              ease: "easeInOut",
            },
            x: { type: "spring", stiffness: 50, damping: 30 },
            y: { type: "spring", stiffness: 50, damping: 30 },
          }}
        />
      ))}

      {/* Shooting stars */}
      {shootingStars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute h-0.5"
          style={{
            left: `${star.startX}%`,
            top: `${star.startY}%`,
            width: 100,
            transformOrigin: "left center",
            rotate: star.angle,
            background: "linear-gradient(to right, transparent, var(--star-color), var(--accent))",
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: [0, 1, 0], opacity: [0, 1, 0], x: [0, 200, 400] }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      ))}

      {/* Vignette overlay - subtle in light mode */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, var(--bg-deep) 100%)",
          opacity: 0.3,
        }}
      />
    </div>
  );
}
