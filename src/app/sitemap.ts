import type { MetadataRoute } from "next";
import { getAllEntries } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/projects", "/research", "/logs", "/about", "/legal"].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date("2026-04-29"),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  const entries = getAllEntries().map((project) => ({
    url: `${siteConfig.url}${project.href}`,
    lastModified: new Date(project.date),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  return [...routes, ...entries];
}
