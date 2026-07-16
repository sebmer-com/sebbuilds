import { siteConfig } from "@/lib/site";
import type { ContentEntry } from "@/lib/content";

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: "en",
    publisher: {
      "@type": "Person",
      name: siteConfig.author.name,
    },
  };
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.author.name,
    url: siteConfig.url,
    jobTitle: "Founder in Residence & Member of Technical Staff",
    worksFor: {
      "@type": "Organization",
      name: "Make",
      url: "https://www.make.com",
    },
    knowsAbout: [
      "AI products",
      "Zero-to-one product development",
      "AI agents",
      "Automation",
      "iPaaS",
      "Agentic coding",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.author.location,
    },
  };
}

export function contentJsonLd(entry: ContentEntry) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    headline: entry.title,
    description: entry.description,
    datePublished: entry.date,
    dateModified: entry.date,
    url: `${siteConfig.url}${entry.href}`,
    author: {
      "@type": "Person",
      name: siteConfig.author.name,
    },
    publisher: {
      "@type": "Person",
      name: siteConfig.author.name,
    },
    keywords: entry.tags.join(", "),
  };
}
