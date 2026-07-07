import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Encre — surfaces app (dark)
        ink: {
          900: "#0F0B06",
          800: "#171009",
          700: "#211A10",
          600: "#2C2416",
        },
        // Parchemin — surfaces branding
        parchment: {
          100: "#F4ECD8",
          200: "#E7DAB9",
          300: "#D8C69B",
          900: "#6B5836",
        },
        // Texte sur fond dark
        linen: {
          100: "#F4ECD8", // titres
          200: "#D7C8A6", // corps
          300: "#C9B78D", // secondaire
          400: "#8A7A56", // discret
          500: "#7D6F52", // très discret
        },
        // Catégories — désaturées, mates
        cat: {
          all: "#5B608C",
          monument: "#C08A3E",
          ingredient: "#7F8A4F",
          dish: "#B0553A",
          sport: "#5F7D8C",
          animal: "#7A5570",
          plant: "#4F7A6B",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "-apple-system", "Segoe UI", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      borderRadius: {
        panel: "22px",
        "panel-lg": "24px",
        card: "14px",
      },
      boxShadow: {
        panel: "0 30px 70px -24px rgba(0,0,0,.9)",
      },
      animation: {
        "slide-in": "slide-in 200ms ease-out",
        "fade-in": "fade-in 220ms ease-out",
      },
      keyframes: {
        "slide-in": {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
