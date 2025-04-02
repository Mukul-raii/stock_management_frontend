import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ This will prevent ESLint errors from failing the build
  },
};

export default nextConfig;
