import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();
const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
  output: "standalone",
  removeConsole: {
    exclude: ["debug", "error"],
  },
};

export default withNextIntl(nextConfig);
