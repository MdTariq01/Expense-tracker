/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#006c49",
        "primary-light": "#10b981",
        "primary-container": "#10b981",
        background: "#f0faf4",
        "on-surface": "#161d19",
        surface: "#ffffff",
        error: "#ba1a1a",
        outline: "#6c7a71",
        "mint-light": "#e2f5ec",
        sidebar: "#0a0a0a",
      },
      fontFamily: {
        headline: ["Manrope", "sans-serif"],
        body: ["Inter", "sans-serif"],
        label: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        full: "9999px",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0,0,0,0.04), 0 1px 2px 0 rgba(0,0,0,0.03)",
        "card-hover": "0 4px 12px 0 rgba(0,108,73,0.08)",
        emerald: "0 10px 40px -10px rgba(0,108,73,0.3)",
      },
    },
  },
  plugins: [],
}
