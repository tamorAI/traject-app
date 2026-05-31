import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@tamor/ui"],
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
