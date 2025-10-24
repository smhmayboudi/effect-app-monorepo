import { FlatCompat } from "@eslint/eslintrc"
import { dirname } from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  ...compat.extends("plugin:testing-library/react"),
  ...compat.extends("plugin:@vitest/legacy-all"),
  ...compat.extends("plugin:perfectionist/recommended-natural-legacy"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
    rules: {
      "react/jsx-sort-props": "error",
    },
  },
]

export default eslintConfig
