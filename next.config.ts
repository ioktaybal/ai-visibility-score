import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['192.168.1.7'],
  serverExternalPackages: ['playwright', 'playwright-core'],
};

export default nextConfig;
