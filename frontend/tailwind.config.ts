import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Background layers (CSS variables)
        "bg-deep": "var(--bg-deep)",
        "bg-surface": "var(--bg-surface)",
        "bg-elevated": "var(--bg-elevated)",
        "bg-card": "var(--bg-card)",
        "bg-card-hover": "var(--bg-card-hover)",
        "bg-warm": "var(--bg-warm)",

        // Text colors
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-muted": "var(--text-muted)",

        // Accent (Golden hour gold)
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
          muted: "var(--accent-muted)",
          glow: "var(--accent-glow)",
          warm: "var(--accent-warm)",
          earth: "var(--accent-earth)",
        },

        // Button colors (warm rose/coral)
        "btn-primary": "var(--btn-primary)",
        "btn-hover": "var(--btn-hover)",

        // Borders
        "border-subtle": "var(--border-subtle)",
        "border-strong": "var(--border-strong)",

        // Entity type colors (warm-adjusted)
        entity: {
          character: "var(--entity-character)",
          location: "var(--entity-location)",
          faction: "var(--entity-faction)",
          item: "var(--entity-item)",
          event: "var(--entity-event)",
          chapter: "var(--entity-chapter)",
          concept: "var(--entity-concept)",
        },

        // Legacy colors (keeping for gradual migration)
        ink: "var(--text-primary)",
        paper: "var(--bg-deep)",
        cream: "var(--bg-elevated)",
        "bg-light": "var(--bg-surface)",
        "bg-dark": "var(--bg-deep)",
        "border-light": "var(--border-subtle)",
        "border-dark": "var(--border-strong)",
      },
      fontFamily: {
        sans: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        serif: ["var(--font-source-serif)", "Georgia", "serif"],
      },
      backgroundImage: {
        // Gradients for sections
        "gradient-hero": "var(--gradient-hero)",
        "gradient-surface": "var(--gradient-surface)",
        "gradient-warm": "var(--gradient-warm)",
        "gradient-footer": "var(--gradient-footer)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "star-twinkle": {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "golden-glow": {
          "0%, 100%": { boxShadow: "0 0 20px var(--accent-glow)" },
          "50%": { boxShadow: "0 0 40px var(--accent-glow)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "shooting-star": {
          "0%": { transform: "translateX(0) translateY(0)", opacity: "1" },
          "70%": { opacity: "1" },
          "100%": { transform: "translateX(300px) translateY(300px)", opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "star-twinkle": "star-twinkle 3s ease-in-out infinite",
        float: "float 4s ease-in-out infinite",
        "golden-glow": "golden-glow 2s ease-in-out infinite",
        shimmer: "shimmer 1.5s infinite",
        "shooting-star": "shooting-star 1s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
