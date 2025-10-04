import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();
const nextConfig: NextConfig = {
  compiler: {
    removeConsole: {
      exclude: ["debug", "error"],
    },
  },
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
  output: "standalone",
};

export default withNextIntl(nextConfig);
