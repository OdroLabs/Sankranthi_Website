import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: { "2xl": "1200px" },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        /* Violet, anchored on the base of the logo's swirl (#7b2ff7 at 600). */
        brand: {
          50: "#f6f3ff",
          100: "#ede7ff",
          200: "#ddd1ff",
          300: "#c4adff",
          400: "#a880fc",
          500: "#8f52f9",
          600: "#7b2ff7",
          700: "#681ddb",
          800: "#5619b4",
          900: "#471791",
          950: "#2b0b63",
        },
        /* Deep indigo ink for dark sections — the footer, hero overlays. */
        navy: {
          700: "#37306b",
          800: "#262052",
          900: "#191540",
          950: "#0f0c2b",
        },
        /*
         * Pride flag colours, kept at their official values so the identity is
         * never approximated. The last four are the Progress Pride additions
         * for trans and people-of-colour representation.
         */
        pride: {
          red: "#e40303",
          orange: "#ff8c00",
          yellow: "#ffed00",
          green: "#008026",
          blue: "#24408e",
          violet: "#732982",
          brown: "#613915",
          ink: "#000000",
          sky: "#5bcefa",
          pink: "#f5a9b8",
        },
        teal: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
        },
      },
      backgroundImage: {
        /*
         * `spectrum` is the everyday brand gradient — short enough to stay
         * readable behind white text on buttons, pills and avatars.
         * `pride` and `pride-flag` are the full six-colour flag, reserved for
         * thin rules and dividers where the identity should be unmistakable.
         */
        spectrum: "linear-gradient(100deg, #7b2ff7 0%, #e6338c 40%, #f5722b 72%, #f5c518 100%)",
        pride:
          "linear-gradient(90deg, #e40303 0%, #ff8c00 20%, #ffed00 40%, #008026 60%, #24408e 80%, #732982 100%)",
        "pride-flag":
          "linear-gradient(90deg, #e40303 0 16.667%, #ff8c00 16.667% 33.333%, #ffed00 33.333% 50%, #008026 50% 66.667%, #24408e 66.667% 83.333%, #732982 83.333% 100%)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        card: "0 1px 2px rgba(23, 15, 51, 0.04), 0 8px 24px -8px rgba(23, 15, 51, 0.10)",
        "card-hover":
          "0 2px 4px rgba(23, 15, 51, 0.05), 0 20px 40px -12px rgba(123, 47, 247, 0.22)",
        glow: "0 0 0 1px rgba(255,255,255,0.08), 0 24px 60px -20px rgba(0, 0, 0, 0.5)",
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
        "fade-up": {
          from: { opacity: "0", transform: "translateY(18px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "bounce-soft": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(6px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.9s ease both",
        "bounce-soft": "bounce-soft 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
