import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: "var(--primary-color)",
        primary_dark: "#0e0e0c",
        primary_light: "#ffffff",
        secondary: "var(--secondary-color)",
        text: "var(--text-color)",
        background: "var(--background-color)",
        "button-bg": "var(--button-background-color)",
        "img-bg": "var(--img-background)",
        border: "var(--border-color)",
        shadow: "var(--shadow-color)",
        accent: "var(--accent-color)",
      },
    },
  },
  plugins: [],
};
export default config;
