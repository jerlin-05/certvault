/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core neutrals
        ink: {
          DEFAULT: "#0E1526",   // Midnight — primary dark surface
          light: "#141D34",     // Navy — secondary dark surface
          soft: "#1E293F",      // raised dark surface (cards on dark bg)
          border: "rgba(250,249,246,0.10)",
        },
        paper: {
          DEFAULT: "#FAF9F6",   // Ivory
          dim: "#F1EEE7",
          card: "#FFFFFF",
        },
        slate: {
          DEFAULT: "#5B6472",
          light: "#8A93A0",
        },
        // Brand gold
        gold: {
          DEFAULT: "#C9A15A",
          light: "#DEBD84",
          dark: "#A67F3D",
          soft: "#F6EDDC",
        },
        // Status system (matches reference palette)
        forest: {
          DEFAULT: "#0FA968",
          light: "#E3F6ED",
          dark: "#0B7C4D",
        },
        amber: {
          DEFAULT: "#F2A70B",
          light: "#FDF0D8",
          dark: "#B87A05",
        },
        rust: {
          DEFAULT: "#E74444",
          light: "#FCE6E6",
          dark: "#B92E2E",
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
        card: "0 1px 2px rgba(14, 21, 38, 0.04), 0 12px 32px -14px rgba(14, 21, 38, 0.16)",
        panel: "0 1px 3px rgba(14, 21, 38, 0.06)",
        glow: "0 0 0 1px rgba(201,161,90,0.15), 0 20px 50px -20px rgba(201,161,90,0.35)",
        dark: "0 20px 60px -20px rgba(0,0,0,0.5)",
      },
      backgroundImage: {
        seal: "radial-gradient(circle at 30% 30%, #E4C381 0%, #C9A15A 55%, #A67F3D 100%)",
      },
    },
  },
  plugins: [],
};
