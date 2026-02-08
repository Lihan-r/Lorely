"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const testimonials = [
  {
    quote:
      "I was using a 47-tab Notion setup. Lorely replaced all of it and I can actually find things now.",
    author: "Sarah K.",
    role: "Writing a fantasy trilogy",
    initial: "S",
  },
  {
    quote:
      "The web view alone changed how I approach my worldbuilding. Seeing connections I never noticed before.",
    author: "Marcus T.",
    role: "Indie Game Developer",
    initial: "M",
  },
  {
    quote:
      "Finally, something that works how my brain works. Everything links together naturally.",
    author: "Elena R.",
    role: "TTRPG Campaign Creator",
    initial: "E",
  },
];

export function SocialProofSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section className="section-padding section-warm-mid">
      <div className="container-narrow" ref={containerRef}>
        {/* Simple, honest statement */}
        <motion.p
          className="text-center text-lg text-text-secondary mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          Used by fantasy novelists, game designers, and TTRPG creators
        </motion.p>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.blockquote
              key={testimonial.author}
              className="p-6 rounded-2xl bg-bg-elevated border border-border-subtle"
              initial={{ opacity: 0, y: 30 }}
              animate={
                isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
              }
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <p className="text-text-primary italic leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <footer className="mt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-semibold">
                  {testimonial.initial}
                </div>
                <div>
                  <p className="font-medium text-text-primary">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-text-muted">{testimonial.role}</p>
                </div>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
