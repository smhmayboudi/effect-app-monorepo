import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/component/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  darkMode: "media",
  plugins: [],
  theme: {},
} satisfies Config;
