import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { EditorialLabel } from "@/components/editorial-label";
import { JsonLd } from "@/components/json-ld";
import { PublicationShell } from "@/components/publication-shell";
import { getSebastianAbout, getSebastianAboutSectionContent } from "@/lib/about";
import { personJsonLd } from "@/lib/json-ld";
import { siteConfig } from "@/lib/site";

const aboutDescription =
  "The public profile, work, and builder context of Sebastian Mertens.";

export const metadata: Metadata = {
  title: "About Sebastian Mertens",
  description: aboutDescription,
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Sebastian Mertens — " + siteConfig.name,
    description: aboutDescription,
    url: "/about",
  },
};

type MarkdownBlock =
  | {
      items: string[];
      type: "list";
    }
  | {
      text: string;
      type: "paragraph";
    };

export default function AboutPage() {
  const about = getSebastianAbout();
  const heading = about.sections.find((section) => section.level === 1)?.title ?? "Sebastian Mertens";
  const shortBio = getSebastianAboutSectionContent(about, "Short Bio");
  const shortBioParagraphs = getMarkdownBlocks(shortBio).filter(
    (block): block is Extract<MarkdownBlock, { type: "paragraph" }> =>
      block.type === "paragraph",
  );
  const detailSections = about.sections.filter(
    (section) =>
      section.level === 2 &&
      section.title.trim().toLowerCase() !== "short bio",
  );

  return (
    <>
      <JsonLd data={personJsonLd()} />
      <PublicationShell active="About">
        <section className="publication-page about-page" aria-labelledby="about-title">
          <EditorialLabel>Profile / Sebastian Mertens</EditorialLabel>
          <div className="about-hero">
            <div className="about-introduction">
              <div className="page-heading">
                <h1 id="about-title">{heading}</h1>
                <p>{aboutDescription}</p>
              </div>

              <div className="about-copy">
                {shortBioParagraphs.map((paragraph) => (
                  <p key={paragraph.text}>{renderInlineMarkdown(paragraph.text)}</p>
                ))}
              </div>
            </div>

            {/* eslint-disable-next-line @next/next/no-img-element -- Native images preserve strict CSP without inline styles. */}
            <img
              alt="Sebastian Mertens"
              className="about-portrait"
              height={800}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              src="/images/sebastian-mertens.png"
              width={800}
            />
          </div>

          <div className="about-lines" aria-label="About Sebastian highlights">
            {detailSections.map((section, index) => (
              <section className="about-line" key={section.slug}>
                <span className="about-line__number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h2>{section.title}</h2>
                  {renderMarkdownBlocks(section.content)}
                </div>
              </section>
            ))}
          </div>

          <div className="about-actions">
            <Link className="button button--primary" href="/projects">
              View Projects
            </Link>
            <a
              className="button button--secondary"
              href={siteConfig.contactUrl}
              rel="noreferrer"
              target="_blank"
            >
              Contact Sebastian
            </a>
          </div>
        </section>
      </PublicationShell>
    </>
  );
}

function renderMarkdownBlocks(content: string) {
  return getMarkdownBlocks(content).map((block, index) => {
    if (block.type === "list") {
      return (
        <ul key={block.type + "-" + index}>
          {block.items.map((item) => (
            <li key={item}>{renderInlineMarkdown(item)}</li>
          ))}
        </ul>
      );
    }

    return <p key={block.type + "-" + index}>{renderInlineMarkdown(block.text)}</p>;
  });
}

function getMarkdownBlocks(content: string): MarkdownBlock[] {
  const blocks: MarkdownBlock[] = [];
  let paragraphLines: string[] = [];
  let listItems: string[] = [];

  const flushParagraph = () => {
    if (paragraphLines.length === 0) {
      return;
    }

    blocks.push({
      type: "paragraph",
      text: paragraphLines.join(" "),
    });
    paragraphLines = [];
  };

  const flushList = () => {
    if (listItems.length === 0) {
      return;
    }

    blocks.push({
      type: "list",
      items: listItems,
    });
    listItems = [];
  };

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (trimmed === "") {
      flushParagraph();
      flushList();
      continue;
    }

    if (trimmed.startsWith("- ")) {
      flushParagraph();
      listItems.push(trimmed.slice(2));
      continue;
    }

    flushList();
    paragraphLines.push(trimmed);
  }

  flushParagraph();
  flushList();

  return blocks;
}

function renderInlineMarkdown(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const linkPattern = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
  let lastIndex = 0;

  for (const match of text.matchAll(linkPattern)) {
    const [raw, label, href] = match;
    const index = match.index ?? 0;

    if (index > lastIndex) {
      nodes.push(text.slice(lastIndex, index));
    }

    nodes.push(
      <a href={href} key={href + "-" + index} rel="noreferrer" target="_blank">
        {label}
      </a>,
    );
    lastIndex = index + raw.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes.length > 0 ? nodes : [text];
}
