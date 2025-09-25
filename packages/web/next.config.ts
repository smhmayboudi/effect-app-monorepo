import NextBundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextBundleAnalyzer = NextBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});
const withNextIntl = createNextIntlPlugin();
const nextConfig: NextConfig = {
  removeConsole: {
    exclude: ["debug", "error"],
  },
  output: "standalone",
};

export default withNextBundleAnalyzer(withNextIntl(nextConfig));
