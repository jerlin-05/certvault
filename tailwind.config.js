/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#121B2E",
          light: "#1B2740",
          soft: "#28324A",
        },
        paper: {
          DEFAULT: "#FBFAF7",
          dim: "#F2EFE8",
        },
        slate: {
          DEFAULT: "#5B6472",
          light: "#8A93A0",
        },
        gold: {
          DEFAULT: "#B8863B",
          light: "#D2A55E",
          dark: "#8E661F",
        },
        forest: {
          DEFAULT: "#2F6844",
          light: "#E4EEE7",
        },
        amber: {
          DEFAULT: "#C97A2B",
          light: "#F6E9D9",
        },
        rust: {
          DEFAULT: "#A1352B",
          light: "#F5E1DF",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(18, 27, 46, 0.06), 0 8px 24px -12px rgba(18, 27, 46, 0.18)",
        panel: "0 1px 3px rgba(18, 27, 46, 0.08)",
      },
      backgroundImage: {
        seal: "radial-gradient(circle at 30% 30%, #D2A55E 0%, #B8863B 55%, #8E661F 100%)",
      },
    },
  },
  plugins: [],
};
