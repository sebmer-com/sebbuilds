import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // GitHub Pages needs a static export; ohmyho.st builds the normal Next.js edge app.
  output: process.env.GITHUB_ACTIONS === "true" ? "export" : undefined,
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
