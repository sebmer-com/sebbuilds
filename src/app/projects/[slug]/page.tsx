import type { Metadata } from "next";
import { socialImage } from "@/lib/brand";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleHeader } from "@/components/content-card";
import { JsonLd } from "@/components/json-ld";
import { mdxComponents } from "@/components/mdx-content";
import { PublicationShell } from "@/components/publication-shell";
import { getEntryBySlug, getProjects } from "@/lib/content";
import { CompiledMdx } from "@/lib/compiled-mdx";
import { contentJsonLd } from "@/lib/json-ld";
import { siteConfig } from "@/lib/site";

const relocatedResearchSlugs = ["the-headless-product", "ai-frontier-acceleration-forecast"];

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return [...getProjects().map((project) => ({ slug: project.slug })),
    ...relocatedResearchSlugs.map((slug) => ({ slug }))];
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const research = relocatedResearchSlugs.includes(slug) ? getEntryBySlug("research", slug) : undefined;
  const project = research ?? getEntryBySlug("projects", slug);

  if (!project) {
    return {};
  }

  return {
    title: project.title,
    description: project.description,
    alternates: {
      canonical: project.href,
    },
    openGraph: {
      images: [socialImage],
      type: "article",
      title: project.title + " — " + siteConfig.name,
      description: project.description,
      url: project.href,
      publishedTime: project.date,
      tags: project.tags,
    },
    twitter: {
      images: [socialImage.url],
      card: "summary_large_image",
      title: project.title + " — " + siteConfig.name,
      description: project.description,
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const research = relocatedResearchSlugs.includes(slug) ? getEntryBySlug("research", slug) : undefined;
  const project = research ?? getEntryBySlug("projects", slug);

  if (!project) {
    notFound();
  }

  if (research) {
    return (
      <PublicationShell active="Research & Essays">
        <section className="publication-page">
          <div className="page-heading">
            <h1>{research.title}</h1>
            <p>This essay is now part of Research & Essays.</p>
          </div>
          <Link className="text-link" href={research.href}>Read {research.title} →</Link>
        </section>
      </PublicationShell>
    );
  }

  return (
    <>
      <JsonLd data={contentJsonLd(project)} />
      <PublicationShell active="Projects">
        <article className="article-shell">
          <ArticleHeader entry={project} />
          <div className="mdx-content">
            <CompiledMdx kind="projects" slug={project.slug} components={mdxComponents} />
          </div>
        </article>
      </PublicationShell>
    </>
  );
}
