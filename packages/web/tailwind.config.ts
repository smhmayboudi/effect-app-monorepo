import type { Config } from "tailwindcss";

export default {
  content: [
    "app/**/*.{ts,tsx}",
    "component/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
  ],
  darkMode: "media",
  plugins: [],
  theme: {},
} satisfies Config;
