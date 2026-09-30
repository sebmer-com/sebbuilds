import type { Metadata } from "next";
import { socialImage } from "@/lib/brand";
import { ContentCard } from "@/components/content-card";
import { EditorialLabel } from "@/components/editorial-label";
import { PublicationShell } from "@/components/publication-shell";
import { getAllTags, getResearch } from "@/lib/content";
import { siteConfig } from "@/lib/site";

const researchDescription = "Research and essays on AI, products, and the way we build by Sebastian Mertens.";

export const metadata: Metadata = {
  title: "Research & Essays",
  description: researchDescription,
  alternates: {
    canonical: "/research",
  },
  openGraph: {
    images: [socialImage],
    title: "Research & Essays — " + siteConfig.name,
    description: researchDescription,
    url: "/research",
  },
};

export default function ResearchPage() {
  const research = getResearch();
  const tags = getAllTags(research);

  return (
    <PublicationShell active="Research & Essays">
      <section className="publication-page" aria-labelledby="research-title">
        <EditorialLabel>Index / Research & Essays</EditorialLabel>
        <div className="page-heading">
          <h1 id="research-title">Research & Essays</h1>
          <p>{researchDescription}</p>
        </div>

        <div className="subject-index" aria-label="Research subjects">
          <span className="metadata-label">Subjects:</span>
          {tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>

        <div className="archive-list">
          {research.map((entry) => (
            <ContentCard entry={entry} headingLevel={2} key={entry.slug} />
          ))}
        </div>
      </section>
    </PublicationShell>
  );
}
