// import * as path from "node:path"
import type { ViteUserConfig } from "vitest/config"

// const alias = (name: string) => {
//   const target = process.env.TEST_DIST !== undefined ? "dist/dist/esm" : "src"
//   return {
//     [`@template/${name}/test`]: path.join(__dirname, "packages", name, "test"),
//     [`@template/${name}`]: path.join(__dirname, "packages", name, target),
//     [`${name}/test`]: path.join(__dirname, "packages", name, "test"),
//     [`${name}`]: path.join(__dirname, "packages", name, target)
//   }
// }

// This is a workaround, see https://github.com/vitest-dev/vitest/issues/4744
const config: ViteUserConfig = {
  // esbuild: {
  //   target: "es2020"
  // },
  // optimizeDeps: {
  //   exclude: ["bun:sqlite"]
  // },
  test: {
    // alias: {
    //   ...alias("cli"),
    //   ...alias("domain"),
    //   ...alias("runner"),
    //   ...alias("server"),
    //   ...alias("shard-manager")
    // },
    fakeTimers: {
      toFake: undefined,
    },
    // include: ["test/**/*.test.ts"],
    sequence: {
      concurrent: true,
    },
    // setupFiles: [path.join(__dirname, "setupTests.ts")]
  },
}

export default config
