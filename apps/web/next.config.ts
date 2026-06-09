import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@tamor/ui"],
  turbopack: {
    root: path.resolve("../../"),
  },
};

export default nextConfig;
