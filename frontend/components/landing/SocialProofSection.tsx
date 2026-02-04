"use client";

import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { AnimatedStat } from "@/components/animations/AnimatedCounter";
import { TestimonialCarousel } from "./TestimonialCarousel";

export function SocialProofSection() {
  const testimonials = [
    {
      quote:
        "Finally, a tool that understands how worldbuilders think. I can actually find my notes now.",
      author: "Fantasy Author",
      role: "Writer",
    },
    {
      quote:
        "The web view alone changed how I approach my worldbuilding. Seeing connections I never noticed before.",
      author: "Indie Game Developer",
      role: "Game Designer",
    },
    {
      quote:
        "Clean, focused, and actually helps me write instead of getting in the way.",
      author: "TTRPG Creator",
      role: "Game Master",
    },
  ];

  const stats = [
    { value: 1000, label: "Worldbuilders" },
    { value: 50000, label: "Pages Created" },
    { value: 100000, label: "Connections Made" },
  ];

  return (
    <section className="section-padding section-warm-mid">
      <div className="container-narrow">
        {/* Section Header */}
        <ScrollReveal className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-text-primary">
            Trusted by worldbuilders
          </h2>
          <p className="mt-4 text-lg text-text-secondary">
            Join writers, game designers, and creators who build with Lorely.
          </p>
        </ScrollReveal>

        {/* Testimonials Carousel */}
        <ScrollReveal delay={0.2}>
          <TestimonialCarousel testimonials={testimonials} />
        </ScrollReveal>

        {/* Animated Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 text-center">
          {stats.map((stat, index) => (
            <AnimatedStat
              key={stat.label}
              value={stat.value}
              label={stat.label}
              delay={index * 0.15}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
