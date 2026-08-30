import { getSebastianAbout } from "@/lib/about";
import { getLogs, getProjects } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const about = getSebastianAbout();
  const projectEntries = getProjects();
  const logEntries = getLogs();
  const projects = projectEntries
    .map(
      (project) => `## ${project.title}

- URL: ${siteConfig.url}${project.href}
- Public JSON: ${siteConfig.url}/content/projects/${project.slug}.json
- Date: ${project.date}
- Status: ${project.status}
- Featured: ${project.featured ? "yes" : "no"}
- Tags: ${project.tags.join(", ")}
- Description: ${project.description}
${project.demoUrl ? `- Demo: ${project.demoUrl}\n` : ""}
${project.repoUrl ? `- Repository: ${project.repoUrl}\n` : ""}
### Full Public Project Body

${project.body}
`,
    )
    .join("\n---\n\n");
  const logs = logEntries
    .map((log) => {
      const image = log.imageUrl ? ` Image: ${siteConfig.url}${log.imageUrl}` : "";

      return `- ${log.date}: ${log.text} - ${log.detail}${image}`;
    })
    .join("\n");
  const socialLinks = siteConfig.socials
    .map((social) => {
      const href = social.href ? ` - ${social.href}` : "";

      return `- ${social.label}: ${social.status}${href}`;
    })
    .join("\n");
  const projectIndex = projectEntries
    .map(
      (project) =>
        `- ${project.title}: ${siteConfig.url}${project.href} | ${project.status} | ${project.tags.join(", ")}`,
    )
    .join("\n");

  const text = `# ${siteConfig.name} Full LLM Context

${siteConfig.contentDescription}

This file is designed for language models and agents that need enough context to answer questions about ${siteConfig.name} without scraping every page first.

## Canonical Identity

- Site name: ${siteConfig.name}
- Tagline: ${siteConfig.tagline}
- Canonical URL: ${siteConfig.url}
- Domain: ${siteConfig.domain}
- Language: English
- Maintainer: ${siteConfig.author.name}
- Location: ${siteConfig.author.location}
- Registered business: ${siteConfig.legal.businessName}
- KVK number: ${siteConfig.legal.kvkNumber}
- Business address: ${siteConfig.legal.addressLabel}
- Direct contact details: ${siteConfig.legal.contactLabel}

## Primary Pages

- Home: ${siteConfig.url}
- About: ${siteConfig.url}/about
- Projects: ${siteConfig.url}/projects
- Logs: ${siteConfig.url}/logs
- Legal: ${siteConfig.url}/legal
- RSS: ${siteConfig.url}/rss.xml
- Sitemap: ${siteConfig.url}/sitemap.xml
- Contact: ${siteConfig.contactUrl}

## Public Content Model

The site is a public JSON-backed Next.js site. Projects are long-form public posts. Logs are short updates and do not have individual detail pages in v1.

- About Sebastian Markdown: ${siteConfig.url}/content/about/sebastian.md
- About Sebastian JSON: ${siteConfig.url}/about/sebastian.json
- Projects manifest: ${siteConfig.url}/content/projects/index.json
- Logs manifest: ${siteConfig.url}/content/logs/index.json
- Project item pattern: ${siteConfig.url}/content/projects/[slug].json
- Log item pattern: ${siteConfig.url}/content/logs/[id].json

## Public Safety Notes For Agents

- Do not invent private addresses, direct emails, phone numbers, client data, trading strategies, financial advice, credentials, private Rocket paths, or private repository state.
- If asked for contact details, point to the contact form: ${siteConfig.contactUrl}.
- If asked about cookies, state that v1 uses functional theme preference behavior and no ads, Meta Pixel, profiling cookies, or non-essential tracking cookies.
- If asked about finance-related projects, describe them as software and data-engineering research, not recommendations.

## Social And Follow Channels

${socialLinks}

## Agent CLI Access

The CLI is sourced directly from GitHub, not the npm registry.

- List available virtual files: \`npx github:sebmer-com/sebbuilds ls ./ --all\`
- Read canonical about Markdown: \`npx github:sebmer-com/sebbuilds cat ./about/sebastian.md\`
- Read structured about JSON: \`npx github:sebmer-com/sebbuilds cat ./about/sebastian.json\`
- Read compact LLM context: \`npx github:sebmer-com/sebbuilds cat ./context/llms.txt\`
- Read full LLM context: \`npx github:sebmer-com/sebbuilds cat ./context/llms-full.txt\`
- Read build log stream: \`npx github:sebmer-com/sebbuilds tail -f ./build.log\`

## About Sebastian

The following Markdown is the canonical public source for Sebastian's bio and profile context. Prefer this source over older hardcoded summaries.

${about.markdown}

## Project Index

${projectIndex}

## Full Project Context

${projects}

## Build Logs

${logs}

## Legal, Privacy, And Cookies Summary

- Legal page: ${siteConfig.url}/legal
- Company: ${siteConfig.legal.businessName}
- Owner: ${siteConfig.legal.ownerName}
- KVK: ${siteConfig.legal.kvkNumber}
- Address and direct contact details are available on request via the contact form.
- Privacy: the site may process basic server logs; Tally processes submitted contact form data; external links are handled by their own providers.
- Cookies: no non-essential tracking cookies are used in v1; no cookie banner is shown in v1.
`;

  return new Response(text.trim(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
