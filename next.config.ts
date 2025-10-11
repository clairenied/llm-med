import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    dirs: ["src"],
  },
  serverExternalPackages: ["@prisma/client"],
};

export default nextConfig;
