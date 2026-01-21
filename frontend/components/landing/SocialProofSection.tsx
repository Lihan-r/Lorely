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

  return (
    <section className="section-padding bg-paper">
      <div className="container-narrow">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-ink">
            Trusted by worldbuilders
          </h2>
          <p className="mt-4 text-lg text-ink/60">
            Join writers, game designers, and creators who build with Lorely.
          </p>
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-6 rounded-xl bg-bg-light border border-border-light"
            >
              {/* Quote */}
              <blockquote className="text-ink/80 mb-4">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center">
                  <span className="text-sm font-medium text-ink/70">
                    {testimonial.author[0]}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-ink text-sm">
                    {testimonial.author}
                  </p>
                  <p className="text-xs text-ink/50">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Placeholder */}
        <div className="mt-16 grid grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-3xl sm:text-4xl font-serif font-semibold text-ink">
              1,000+
            </p>
            <p className="mt-1 text-sm text-ink/50">Worldbuilders</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-serif font-semibold text-ink">
              50,000+
            </p>
            <p className="mt-1 text-sm text-ink/50">Pages Created</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-serif font-semibold text-ink">
              100,000+
            </p>
            <p className="mt-1 text-sm text-ink/50">Connections Made</p>
          </div>
        </div>
      </div>
    </section>
  );
}
