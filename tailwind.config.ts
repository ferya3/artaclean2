import type { Config } from "tailwindcss";

/**
 * پالت «Premium Industrial»:
 * سطح خنثی + یک رنگ برند به‌عنوان Accent. کل سایت رنگ برند نمی‌شود.
 * مقادیر واقعی در globals.css به‌صورت CSS Variable تعریف شده‌اند تا
 * تعویض رنگ برند فقط یک‌جا انجام شود.
 */
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
        primary: {
          DEFAULT: "rgb(var(--c-primary) / <alpha-value>)",
          soft: "rgb(var(--c-primary-soft) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--c-accent) / <alpha-value>)",
          soft: "rgb(var(--c-accent-soft) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["var(--font-fa)", "system-ui", "sans-serif"],
        num: ["var(--font-num)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        card: "14px",
      },
      boxShadow: {
        card: "0 1px 2px rgb(17 17 17 / 0.04), 0 8px 24px -16px rgb(17 17 17 / 0.18)",
        pop: "0 24px 60px -28px rgb(17 17 17 / 0.35)",
      },
      maxWidth: {
        shell: "1280px",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "none" },
        },
      },
      animation: {
        "fade-up": "fade-up .5s cubic-bezier(.22,1,.36,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
