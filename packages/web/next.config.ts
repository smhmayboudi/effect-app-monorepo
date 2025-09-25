import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  removeConsole: {
    exclude: ["debug", "error"],
  },
  output: "standalone",
};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

export default withBundleAnalyzer(nextConfig);
