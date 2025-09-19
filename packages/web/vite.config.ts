import { reactRouter } from "@react-router/dev/vite"
import tailwindcss from "@tailwindcss/vite"
// import * as url from "node:url"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()]
  // resolve: {
  //   alias: {
  //     "@effect-atom/atom": url.fileURLToPath(new URL("../../packages/atom/src", import.meta.url)),
  //     "@effect-atom/atom-react": url.fileURLToPath(new URL("../../packages/atom-vue/src", import.meta.url))
  //   }
  // }
})
