import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow cross-origin requests during development
  allowedDevOrigins: ['10.60.4.126'],
  
  // Skip trailing slash redirect
  skipTrailingSlashRedirect: true,
  
  // Other config options
};

export default nextConfig;
