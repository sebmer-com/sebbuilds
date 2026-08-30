import { getLogs, getProjects } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-static";

type FeedEntry = {
  title: string;
  href: string;
  date: string;
  description: string;
  kind: "log" | "project";
};

export function GET() {
  const projectEntries: FeedEntry[] = getProjects().map((project) => ({
    title: project.title,
    href: project.href,
    date: project.date,
    description: project.description,
    kind: "project",
  }));
  const logEntries: FeedEntry[] = getLogs().map((log) => ({
    title: log.text,
    href: "/logs#" + log.id,
    date: log.date,
    description: log.detail,
    kind: "log",
  }));
  const entries = [...projectEntries, ...logEntries].sort(
    (entryA, entryB) =>
      new Date(entryB.date).getTime() - new Date(entryA.date).getTime(),
  );
  const items = entries
    .map((entry) => {
      const pubDate =
        entry.kind === "project"
          ? "<pubDate>" + new Date(entry.date).toUTCString() + "</pubDate>"
          : "";

      return [
        "        <item>",
        "          <title>" + escapeXml(entry.title) + "</title>",
        "          <link>" + siteConfig.url + entry.href + "</link>",
        "          <guid>" + siteConfig.url + entry.href + "</guid>",
        pubDate ? "          " + pubDate : "",
        "          <description>" + escapeXml(entry.description) + "</description>",
        "        </item>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  const xml = [
    '<?xml version="1.0" encoding="UTF-8" ?>',
    '    <rss version="2.0">',
    "      <channel>",
    "        <title>" + escapeXml(siteConfig.name) + "</title>",
    "        <link>" + siteConfig.url + "</link>",
    "        <description>" + escapeXml(siteConfig.contentDescription) + "</description>",
    "        <language>en</language>",
    items,
    "      </channel>",
    "    </rss>",
  ]
    .filter(Boolean)
    .join("\n");

  return new Response(xml.trim(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
