"use client";

import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
  delay?: number;
}

export function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
  duration = 2,
  className = "",
  delay = 0,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [hasStarted, setHasStarted] = useState(false);

  const spring = useSpring(0, {
    duration: duration * 1000,
    bounce: 0.2,
  });

  const display = useTransform(spring, (current) =>
    Math.round(current).toLocaleString()
  );

  useEffect(() => {
    if (isInView && !hasStarted) {
      const timer = setTimeout(() => {
        setHasStarted(true);
        spring.set(value);
      }, delay * 1000);

      return () => clearTimeout(timer);
    }
  }, [isInView, hasStarted, value, spring, delay]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  );
}

interface AnimatedStatProps {
  value: number;
  suffix?: string;
  label: string;
  delay?: number;
}

export function AnimatedStat({
  value,
  suffix = "+",
  label,
  delay = 0,
}: AnimatedStatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay }}
    >
      <p className="text-3xl sm:text-4xl font-serif font-semibold text-ink">
        <AnimatedCounter
          value={value}
          suffix={suffix}
          duration={2}
          delay={delay + 0.3}
        />
      </p>
      <p className="mt-1 text-sm text-ink/50">{label}</p>
    </motion.div>
  );
}
