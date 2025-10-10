import shared from "./vitest.shared.js";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig, mergeConfig } from "vitest/config";

const config = defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    exclude: ["**/e2e/**", "**/node_modules/**"],
    include: ["**/*.test.{ts,tsx}"],
    server: { deps: { inline: ["next-intl"] } },
  },
});

export default mergeConfig(shared, config);
