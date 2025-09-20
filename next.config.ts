import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for Cloudflare Workers Assets
  output: "export",
  // Disable Next Image optimization (not available in static export)
  images: { unoptimized: true },
};

export default nextConfig;
