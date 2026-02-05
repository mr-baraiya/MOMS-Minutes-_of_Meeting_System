import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow cross-origin requests during development
  allowedDevOrigins: ['10.60.4.126'],
  
  // Other config options
  experimental: {
    turbo: {
      // Turbopack configuration
    }
  }
};

export default nextConfig;
