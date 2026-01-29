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
        // Background layers
        "bg-deep": "#0a0d14",
        "bg-surface": "#0f1219",
        "bg-elevated": "#161b26",

        // Text colors
        "text-primary": "#f5f5f0",
        "text-secondary": "#9ca3af",
        "text-muted": "#6b7280",

        // Accent (Gold/Amber)
        accent: {
          DEFAULT: "#c9a227",
          hover: "#d4af37",
          muted: "#8b7355",
        },

        // Borders
        "border-subtle": "#1e2433",
        "border-strong": "#2d3548",

        // Entity type colors (desaturated jewel tones)
        entity: {
          character: "#6b8cae",
          location: "#5d8a66",
          faction: "#a67c52",
          item: "#9c6b7a",
          event: "#7c6b9c",
          chapter: "#5a8a8a",
          concept: "#8a7c52",
        },

        // Legacy colors (keeping for gradual migration)
        ink: "#f5f5f0",
        paper: "#0a0d14",
        cream: "#161b26",
        "bg-light": "#0f1219",
        "bg-dark": "#0a0d14",
        "border-light": "#1e2433",
        "border-dark": "#2d3548",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-source-serif)", "Georgia", "serif"],
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
