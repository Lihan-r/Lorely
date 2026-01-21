import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function CTASection() {
  return (
    <section className="section-padding bg-ink text-paper">
      <div className="container-narrow text-center">
        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold">
          Start building your world today
        </h2>

        {/* Subheadline */}
        <p className="mt-6 text-lg sm:text-xl text-paper/70 max-w-xl mx-auto">
          Join thousands of writers who&apos;ve found their home for
          worldbuilding. Free to start, no credit card required.
        </p>

        {/* CTA Button */}
        <div className="mt-10">
          <Link href="/register">
            <Button
              size="lg"
              className="bg-paper text-ink hover:bg-paper/90 focus:ring-paper"
            >
              Get Started Free
            </Button>
          </Link>
        </div>

        {/* Trust Indicators */}
        <p className="mt-8 text-sm text-paper/50">
          Free plan includes unlimited pages &bull; No credit card required
          &bull; Export anytime
        </p>
      </div>
    </section>
  );
}
