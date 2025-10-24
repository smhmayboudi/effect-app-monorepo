/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
export default {
  plugins: ["prettier-plugin-tailwindcss"],
  semi: false,
  tailwindConfig: "./tailwind.config.ts",
  tailwindFunctions: ["cn", "cva"],
  tailwindStylesheet: "./src/app/globals.css",
}
