import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@tamor/ui"],
  turbopack: {
    root: path.resolve("../../"),
  },
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: "http://localhost:8001/api/auth/:path*",
      },
    ];
  },
};

export default nextConfig;
