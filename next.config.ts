import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Images come from arbitrary user-provided URLs, so allow any host.
    remotePatterns: [
      { protocol: "http", hostname: "**" },
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
