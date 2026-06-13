import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this app (the parent repo has its own lockfile).
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
