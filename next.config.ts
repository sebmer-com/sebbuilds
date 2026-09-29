import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD } from "next/constants.js";

const nextConfig: NextConfig = {
  // GitHub Pages needs a static export; ohmyho.st builds the normal Next.js edge app.
  output: process.env.GITHUB_ACTIONS === "true" ? "export" : undefined,
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default async function configureNext(phase: string): Promise<NextConfig> {
  if (phase === PHASE_PRODUCTION_BUILD || phase === PHASE_DEVELOPMENT_SERVER) {
    const { compileContentMdx, watchContentMdx } = await import("./scripts/compile-content-mdx.mjs");
    await compileContentMdx();
    if (phase === PHASE_DEVELOPMENT_SERVER) watchContentMdx();
  }
  return nextConfig;
}
