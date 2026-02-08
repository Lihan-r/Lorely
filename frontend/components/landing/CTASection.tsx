"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

export function CTASection() {
  return (
    <section className="section-padding section-warm-mid">
      <div className="container-narrow text-center">
        <motion.h2
          className="text-4xl lg:text-5xl font-serif font-bold text-text-primary"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Ready to stop losing your lore?
        </motion.h2>

        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Link href="/register">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block"
            >
              <Button
                size="lg"
                variant="primary"
                className="text-lg px-10 py-5 animate-golden-glow"
              >
                Start Writing — It&apos;s Free
              </Button>
            </motion.div>
          </Link>
        </motion.div>

        <motion.p
          className="mt-6 text-sm text-text-muted"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          No credit card. No time limit. Export anytime.
        </motion.p>
      </div>
    </section>
  );
}
