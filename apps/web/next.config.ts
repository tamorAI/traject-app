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
      {
        source: "/api/enforcement/:path*",
        destination: "http://localhost:8001/enforcement/:path*",
      },
      {
        source: "/api/approvals/:path*",
        destination: "http://localhost:8001/approvals/:path*",
      },
      {
        source: "/api/request-demo",
        destination: "http://localhost:8001/request-demo",
      },
    ];
  },
};

export default nextConfig;
