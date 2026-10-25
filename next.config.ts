import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
