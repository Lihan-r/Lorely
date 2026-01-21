import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function HeroSection() {
  return (
    <section className="pt-32 pb-16 sm:pt-40 sm:pb-24 bg-gradient-to-b from-cream/50 to-paper">
      <div className="container-narrow text-center">
        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-semibold text-ink leading-tight">
          Plan your world.
          <br />
          <span className="text-ink/80">Write your story.</span>
        </h1>

        {/* Subheadline */}
        <p className="mt-6 text-lg sm:text-xl text-ink/70 max-w-2xl mx-auto">
          The calm workspace for writers who build worlds. Connect your
          worldbuilding notes, write with context, and never lose your lore
          again.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register">
            <Button size="lg" variant="primary">
              Start Writing Free
            </Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline">
              See How It Works
            </Button>
          </Link>
        </div>

        {/* Hero Image Placeholder */}
        <div className="mt-16 relative">
          <div className="aspect-[16/10] bg-gradient-to-br from-cream to-bg-light rounded-xl border border-border-light shadow-2xl shadow-ink/5 overflow-hidden">
            {/* Placeholder for app screenshot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-ink/5 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-ink/30"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-ink/40 font-medium">
                  App screenshot coming soon
                </p>
              </div>
            </div>
          </div>
          {/* Decorative gradient blur */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-ink/5 blur-xl rounded-full" />
        </div>
      </div>
    </section>
  );
}
