import { siteConfig } from "@/lib/site";
export const prerender = true;
export function GET() { return new Response(`User-agent: *\nAllow: /\nSitemap: ${siteConfig.url}/sitemap.xml\nHost: ${siteConfig.url}\n`, { headers: { "content-type": "text/plain; charset=utf-8" } }); }
