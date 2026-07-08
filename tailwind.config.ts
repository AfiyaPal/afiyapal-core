import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#effdf7",
          100: "#d9fbe9",
          200: "#b2f4d6",
          300: "#7ce7ba",
          400: "#41d197",
          500: "#17a36b",
          600: "#118255",
          700: "#0f6847",
          800: "#0e523a",
          900: "#0c4431",
          950: "#05261b"
        },
        "accent-blue": {
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8"
        },
        "accent-violet": {
          50: "#f5f3ff",
          100: "#ede9fe",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9"
        }
      },
      boxShadow: {
        soft: "0 18px 50px rgba(15, 104, 71, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
