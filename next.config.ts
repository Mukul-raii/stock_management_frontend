import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable ESLint during builds
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
