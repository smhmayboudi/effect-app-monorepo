import type { NextConfig } from "next"

import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin()
const nextConfig: NextConfig = {
  compiler: {
    removeConsole: {
      exclude: ["debug", "error"],
    },
  },
  output: "standalone",
}

export default withNextIntl(nextConfig)
