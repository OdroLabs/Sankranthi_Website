import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

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
      fontFamily: {
        sans: ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ['"DM Serif Display"', "ui-serif", "Georgia", "serif"],
      },
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
        /*
         * Soft inclusive pastel system — warm cream/blush/lavender/mint/sky
         * tones used for section washes, card tints and gradient blends.
         * Kept separate from `brand`/`pride` so the logo and flag identity
         * colours are never approximated.
         */
        cream: { DEFAULT: "#FFF9F5", 50: "#FFFDF9", 100: "#FFF9F5", 200: "#FFF3ED" },
        blush: { 50: "#FFF9FB", 100: "#FFF0F4", 200: "#FFE4EC", 300: "#FFD0DC" },
        lavender: { 50: "#F5F1FF", 100: "#F5F1FF", 200: "#EDE7FF", 300: "#A995E8" },
        mint: { 50: "#F4FBF7", 100: "#EFF9F4", 200: "#D8F3E8", 300: "#83D8B6" },
        sky: { 50: "#F3FAFD", 100: "#E7F6FB", 200: "#C8EBF7" },
        peach: { 50: "#FFF7F2", 100: "#FFF3ED", 200: "#FFE0D1" },
        sun: { 50: "#FFFBE8", 100: "#FFF8DD", 200: "#FFE9A8" },
        charcoal: { 50: "#F8F5F2", 700: "#667078", 800: "#3D4A52", 900: "#202B33", 950: "#202B33" },
        /* Coral/rose brand — CTA and active states, not electric purple. */
        brand: {
          50: "#FFF0F4",
          100: "#FFE0E8",
          200: "#FFC2D1",
          300: "#FF9AAD",
          400: "#FF7A93",
          500: "#FF6F91",
          600: "#FF617F",
          700: "#C94F72",
          800: "#6D4A7D",
          900: "#4A334F",
          950: "#2C1F30",
        },
        /* Charcoal ink for dark bands — footer, overlays, contact bar. */
        navy: {
          700: "#3D4A52",
          800: "#2A353C",
          900: "#202B33",
          950: "#202B33",
        },
        spectrum: {
          coral: "#FF716D",
          pink: "#FF6F91",
          orange: "#FF9B69",
          yellow: "#FFD66B",
          mint: "#83D8B6",
          sky: "#83CDED",
          lavender: "#A995E8",
          plum: "#6D4A7D",
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
        spectrum: "linear-gradient(135deg, #FF617F 0%, #FF846F 100%)",
        pride:
          "linear-gradient(90deg, rgba(255,113,109,0.9), rgba(255,214,107,0.85), rgba(131,216,182,0.85), rgba(131,205,237,0.85), rgba(169,149,232,0.9))",
        "pride-flag":
          "linear-gradient(90deg, rgba(255,113,109,0.9), rgba(255,214,107,0.85), rgba(131,216,182,0.85), rgba(131,205,237,0.85), rgba(169,149,232,0.9))",
        "living-spectrum":
          "linear-gradient(90deg, #FF716D, #FFD66B, #83D8B6, #83CDED, #A995E8)",
        "cta-coral": "linear-gradient(135deg, #FF617F, #FF846F)",
        "donate-coral": "linear-gradient(135deg, #FF6178, #FF826F)",
        "pastel-mesh":
          "radial-gradient(circle at 18% 30%, rgba(255,111,145,0.10), transparent 32%), radial-gradient(circle at 70% 60%, rgba(131,216,182,0.08), transparent 36%)",
        "pastel-blush": "linear-gradient(180deg, #FFF0F4 0%, #FFF9F5 100%)",
        "pastel-mint": "linear-gradient(180deg, #EFF9F4 0%, #FFFDF9 100%)",
        "pastel-peach": "linear-gradient(180deg, #FFF3ED 0%, #FFF9F5 100%)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        card: "0 15px 45px rgba(31, 41, 51, 0.06)",
        "card-hover": "0 20px 50px rgba(31, 41, 51, 0.08)",
        glow: "0 10px 28px rgba(255, 97, 127, 0.22)",
        pastel: "0 15px 45px rgba(31, 41, 51, 0.06)",
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
  plugins: [animate],
};
export default config;
