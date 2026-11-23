import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Plain static files in /out — deployable to Vercel, Netlify, Cloudflare Pages or any web host.
  output: "export",
  trailingSlash: true,
  // Images are pre-optimised WebP files in /public/images, so no runtime optimiser is needed.
  images: { unoptimized: true },
};

export default nextConfig;
