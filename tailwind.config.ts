import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sand: "hsl(var(--sand) / <alpha-value>)",
        ink: "hsl(var(--ink) / <alpha-value>)",
        plum: "hsl(var(--plum) / <alpha-value>)",
        coral: "hsl(var(--coral) / <alpha-value>)",
        sage: "hsl(var(--sage) / <alpha-value>)",
        muted: "hsl(var(--muted-hsl) / <alpha-value>)",
        line: "hsl(var(--line) / <alpha-value>)",
        card: "hsl(var(--card) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      maxWidth: {
        content: "72rem",
      },
    },
  },
  plugins: [],
};

export default config;
