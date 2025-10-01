import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();
const nextConfig: NextConfig = {
  output: "standalone",
  removeConsole: {
    exclude: ["debug", "error"],
  },
};

export default withNextIntl(nextConfig);
