/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core neutrals — dark surfaces
        ink: {
          DEFAULT: "#0B0A14",   // Void — base page background, darkest
          light: "#120F1F",     // Slightly raised surface
          soft: "#1C1830",      // Elevated surface (cards, modals, panels)
          border: "rgba(255,255,255,0.08)",
        },
        // "paper" now serves as the light/foreground color on dark surfaces
        paper: {
          DEFAULT: "#F5F3FA",   // Primary light text
          dim: "#B9B4C9",       // Secondary light
          card: "#1C1830",      // Card surface (matches ink.soft for consistency)
        },
        slate: {
          DEFAULT: "#A6A0B8",   // Secondary text on dark
          light: "#6E6880",     // Muted / faint text on dark
        },
        // Brand accent — violet/purple
        gold: {
          DEFAULT: "#8B5CF6",   // violet-500
          light: "#A78BFA",     // violet-400, hover
          dark: "#7C3AED",      // violet-600, links/icons
          soft: "#241D3D",      // dark violet wash background
        },
        // Status system — bright on dark washes
        forest: {
          DEFAULT: "#34D399",
          light: "#123024",
          dark: "#10B981",
        },
        amber: {
          DEFAULT: "#FBBF24",
          light: "#332508",
          dark: "#F59E0B",
        },
        rust: {
          DEFAULT: "#FB7185",
          light: "#3A1620",
          dark: "#F43F5E",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "10px",
        DEFAULT: "12px",
        md: "14px",
        lg: "18px",
        xl: "22px",
        "2xl": "28px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.3), 0 20px 45px -20px rgba(0,0,0,0.6)",
        panel: "0 4px 20px -8px rgba(0,0,0,0.55)",
        glow: "0 0 0 1px rgba(139,92,246,0.25), 0 20px 55px -20px rgba(139,92,246,0.5)",
        dark: "0 20px 60px -20px rgba(0,0,0,0.7)",
      },
      backgroundImage: {
        seal: "radial-gradient(circle at 30% 30%, #C4B5FD 0%, #8B5CF6 55%, #6D28D9 100%)",
      },
    },
  },
  plugins: [],
};
