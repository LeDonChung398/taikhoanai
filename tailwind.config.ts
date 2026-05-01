import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: "var(--color-brand)",
        coral: "var(--color-coral)",
        mint: "var(--color-mint)",
        ink: "var(--color-ink)",
        sand: "var(--color-sand)",
        ivory: "var(--color-ivory)"
      },
      boxShadow: {
        card: "0 18px 36px -22px rgba(20, 33, 61, 0.45)"
      },
      backgroundImage: {
        "hero-blur": "radial-gradient(circle at top right, rgba(240, 106, 76, 0.26), transparent 48%), radial-gradient(circle at bottom left, rgba(15, 163, 177, 0.2), transparent 38%)"
      }
    }
  },
  plugins: []
};

export default config;
