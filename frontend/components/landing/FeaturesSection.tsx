export function FeaturesSection() {
  const features = [
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
          />
        </svg>
      ),
      title: "Web View",
      description:
        "See how all your pages connect in a beautiful, interactive graph. Discover relationships you didn't know existed.",
      badge: "Visual",
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      ),
      title: "Write Drawer",
      description:
        "A distraction-free writing space that slides out when you need it. Focus on your prose while staying connected to your world.",
      badge: "Writing",
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
          />
        </svg>
      ),
      title: "@Mentions",
      description:
        "Reference any character, place, or item with a simple @mention. Instant links keep your lore connected and accessible.",
      badge: "Linking",
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
          />
        </svg>
      ),
      title: "Flexible Pages",
      description:
        "Create any type of page: characters, locations, items, factions, events. Structure your world however makes sense to you.",
      badge: "Organization",
    },
  ];

  return (
    <section id="features" className="section-padding bg-cream/30">
      <div className="container-narrow">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-ink">
            Everything connected. Nothing lost.
          </h2>
          <p className="mt-4 text-lg text-ink/60 max-w-2xl mx-auto">
            Lorely gives you the tools to build, connect, and write in one calm
            workspace.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative p-8 rounded-2xl bg-paper border border-border-light shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Badge */}
              <span className="absolute top-6 right-6 text-xs font-medium px-2 py-1 rounded-full bg-cream text-ink/70">
                {feature.badge}
              </span>

              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-ink flex items-center justify-center text-paper mb-6">
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-ink mb-3">
                {feature.title}
              </h3>
              <p className="text-ink/60 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
