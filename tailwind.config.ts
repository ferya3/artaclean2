import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        canvas: "rgb(var(--c-canvas) / <alpha-value>)",
        surface: "rgb(var(--c-surface) / <alpha-value>)",
        ink: "rgb(var(--c-ink) / <alpha-value>)",
        muted: "rgb(var(--c-muted) / <alpha-value>)",
        line: "rgb(var(--c-line) / <alpha-value>)",
        deep: {
          DEFAULT: "rgb(var(--c-deep) / <alpha-value>)",
          2: "rgb(var(--c-deep-2) / <alpha-value>)",
          3: "rgb(var(--c-deep-3) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--c-accent) / <alpha-value>)",
          2: "rgb(var(--c-accent-2) / <alpha-value>)",
          soft: "rgb(var(--c-accent-soft) / <alpha-value>)",
        },
        steel: "rgb(var(--c-steel) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-fa)", "system-ui", "sans-serif"],
        num: ["var(--font-num)", "ui-monospace", "monospace"],
      },
      fontSize: {
        display: ["clamp(2.5rem, 6vw, 4.5rem)", { lineHeight: "1.08", letterSpacing: "-0.02em" }],
        hero: ["clamp(2rem, 4.4vw, 3.25rem)", { lineHeight: "1.14", letterSpacing: "-0.015em" }],
        section: ["clamp(1.6rem, 2.6vw, 2.35rem)", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
      },
      borderRadius: {
        card: "16px",
        xl2: "22px",
      },
      boxShadow: {
        card: "0 1px 2px rgb(13 15 18 / 0.04), 0 18px 40px -24px rgb(13 15 18 / 0.35)",
        lift: "0 30px 60px -30px rgb(13 15 18 / 0.45)",
        pop: "0 34px 80px -32px rgb(13 15 18 / 0.55)",
        glow: "0 20px 60px -24px rgb(255 106 26 / 0.55)",
      },
      maxWidth: {
        shell: "1320px",
      },
      animation: {
        "float-soft": "float-soft 7s ease-in-out infinite",
        "marquee-rtl": "marquee-rtl 38s linear infinite",
        "pulse-ring": "pulse-ring 2.6s cubic-bezier(0.22, 1, 0.36, 1) infinite",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
