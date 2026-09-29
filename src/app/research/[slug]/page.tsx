import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleHeader } from "@/components/content-card";
import { JsonLd } from "@/components/json-ld";
import { mdxComponents } from "@/components/mdx-content";
import { PublicationShell } from "@/components/publication-shell";
import { getEntryBySlug, getResearch } from "@/lib/content";
import { CompiledMdx } from "@/lib/compiled-mdx";
import { contentJsonLd } from "@/lib/json-ld";
import { siteConfig } from "@/lib/site";

type ResearchPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getResearch().map((entry) => ({
    slug: entry.slug,
  }));
}

export async function generateMetadata({
  params,
}: ResearchPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEntryBySlug("research", slug);

  if (!entry) {
    return {};
  }

  return {
    title: entry.title,
    description: entry.description,
    alternates: {
      canonical: entry.href,
    },
    openGraph: {
      type: "article",
      title: entry.title + " — " + siteConfig.name,
      description: entry.description,
      url: entry.href,
      publishedTime: entry.date,
      tags: entry.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: entry.title + " — " + siteConfig.name,
      description: entry.description,
    },
  };
}

export default async function ResearchPage({ params }: ResearchPageProps) {
  const { slug } = await params;
  const entry = getEntryBySlug("research", slug);

  if (!entry) {
    notFound();
  }

  return (
    <>
      <JsonLd data={contentJsonLd(entry)} />
      <PublicationShell active="Research & Essays">
        <article className="article-shell">
          <ArticleHeader entry={entry} />
          <div className="mdx-content">
            <CompiledMdx kind="research" slug={entry.slug} components={mdxComponents} />
          </div>
        </article>
      </PublicationShell>
    </>
  );
}
