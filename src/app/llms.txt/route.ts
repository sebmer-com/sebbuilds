import { getSebastianAbout, getSebastianAboutSectionContent } from "@/lib/about";
import { getProjects, getResearch } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const about = getSebastianAbout();
  const shortBio = getSebastianAboutSectionContent(about, "Short Bio");
  const projects = getProjects();
  const projectLinks = projects
    .map((project) => `- [${project.title}](${siteConfig.url}${project.href}): ${project.description}`)
    .join("\n");

  const researchLinks = getResearch()
    .map((entry) => `- [${entry.title}](${siteConfig.url}${entry.href}): ${entry.description}`)
    .join("\n");

  const text = `# ${siteConfig.name}

${siteConfig.name} is Sebastian's public builder log for useful products, long-form project posts, research and essays, and short build logs.

## About Sebastian

${shortBio}

## Key Pages

- [Home](${siteConfig.url})
- [About Sebastian](${siteConfig.url}/about)
- [Projects](${siteConfig.url}/projects)
- [Research & Essays](${siteConfig.url}/research)
- [Latest Build Logs](${siteConfig.url}/logs)
- [Legal, Privacy, and Cookies](${siteConfig.url}/legal)
- [Full LLM Context](${siteConfig.url}/llms-full.txt)
- [RSS](${siteConfig.url}/rss.xml)
- [Sitemap](${siteConfig.url}/sitemap.xml)

## Public JSON Content

- [About Sebastian JSON](${siteConfig.url}/about/sebastian.json)
- [About Sebastian Markdown](${siteConfig.url}/content/about/sebastian.md)
- [Projects manifest](${siteConfig.url}/content/projects/index.json)
- [Research manifest](${siteConfig.url}/content/research/index.json)
- [Logs manifest](${siteConfig.url}/content/logs/index.json)

## Projects

${projectLinks}

## Research & Essays

${researchLinks}

## Agent CLI

- \`npx github:sebmer-com/sebbuilds ls ./ --all\`
- \`npx github:sebmer-com/sebbuilds cat ./about/sebastian.md\`
- \`npx github:sebmer-com/sebbuilds cat ./about/sebastian.json\`
- \`npx github:sebmer-com/sebbuilds cat ./context/llms-full.txt\`

## Notes For AI Agents

- Projects are long-form posts with Markdown bodies.
- Research and essays have their own collection, without project status or featured fields.
- Logs are short build updates and do not have individual detail pages.
- The canonical domain is ${siteConfig.url}.
`;

  return new Response(text.trim(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
