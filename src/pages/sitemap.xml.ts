import { getAllEntries } from "@/lib/content";
import { siteConfig } from "@/lib/site";
export const prerender = true;
export function GET() {
  const fixed = ["", "/projects", "/research", "/logs", "/about", "/legal", "/brand"].map(href => ({ href, date: href === "/brand" ? "2026-09-30" : "2026-04-29" }));
  const entries = [...fixed, ...getAllEntries().map(({href,date}) => ({href,date}))];
  const escape = (s: string) => s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.map(({href,date}) => `<url><loc>${escape(siteConfig.url+href)}</loc><lastmod>${date}</lastmod></url>`).join("")}</urlset>`, { headers: { "content-type": "application/xml; charset=utf-8" } });
}
