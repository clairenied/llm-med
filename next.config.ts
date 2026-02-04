import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    dirs: ["src"],
  },
  serverExternalPackages: ["@prisma/client"],
  async redirects() {
    return [
      {
        source: "/admin/graders",
        destination: "/admin/users",
        permanent: true,
      },
      {
        source: "/admin/emails",
        destination: "/admin/templates",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
