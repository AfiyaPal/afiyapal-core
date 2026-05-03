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
          500: "#17a36b",
          600: "#118255",
          700: "#0f6847"
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
