import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0F172A",
        surface: "rgba(255, 255, 255, 0.05)",
        surfaceBorder: "rgba(255, 255, 255, 0.1)",
        primary: {
          DEFAULT: "#6366F1", // Indigo
          purple: "#A855F7",
        },
        secondary: {
          DEFAULT: "#14B8A6", // Teal
          pink: "#EC4899",
        },
        semantic: {
          success: "#10B981", // Emerald
          warning: "#F59E0B", // Amber
          danger: "#F43F5E",  // Rose
          info: "#0EA5E9",    // Sky
        },
        text: {
          primary: "#F8FAFC",
          secondary: "#94A3B8",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-fira-code)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
