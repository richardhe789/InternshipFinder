import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-manrope)", "system-ui", "sans-serif"],
      },
      colors: {
        "primary-fixed": "#e0e0ff",
        primary: "#000666",
        "primary-container": "#1a237e",
        "on-primary": "#ffffff",
        "on-primary-fixed": "#000767",
        surface: "#f8f9fa",
        "surface-container": "#edeeef",
        "surface-container-high": "#e7e8e9",
        "surface-container-low": "#f3f4f5",
        "surface-container-lowest": "#ffffff",
        "surface-variant": "#e1e3e4",
        "on-surface": "#191c1d",
        "on-surface-variant": "#454652",
        "outline-variant": "#c6c5d4",
        "secondary-container": "#cfe6f2",
        "on-secondary-container": "#526772",
        tertiary: "#00201e",
        "tertiary-container": "#003734",
        "on-tertiary-container": "#00aaa1",
        "tertiary-fixed-dim": "#50dad1",
        secondary: "#4c616c",
        "legacy-accent": "#1b4dff",
        "legacy-paper-200": "#edeae4",
        "legacy-ink-500": "#4b5166",
        "legacy-ink-900": "#0f1115",
      },
      boxShadow: {
        soft: "0 18px 40px rgba(25, 28, 29, 0.08)",
        card: "0 12px 30px rgba(28, 40, 82, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;