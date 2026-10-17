import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { compileContentMdx, watchContentMdx } from "./scripts/compile-content-mdx.mjs";
export default defineConfig({
  site: "https://sebmer.com", output: "static", trailingSlash: "always",
  integrations: [react(), { name: "seb-builds-content", hooks: {
    "astro:config:setup": async ({command}) => { await compileContentMdx(); if (command === "dev") watchContentMdx(); },
  }}],
  vite: { plugins: [tailwindcss()] },
});
