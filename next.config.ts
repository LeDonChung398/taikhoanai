import type { NextConfig } from "next";

const r2PublicHost = "pub-2562e381abc44f8a928e9a2b16c6c633.r2.dev";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["react"]
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: r2PublicHost,
      },
    ],
  },
};

export default nextConfig;
