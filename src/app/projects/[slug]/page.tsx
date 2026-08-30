import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ArticleHeader } from "@/components/content-card";
import { JsonLd } from "@/components/json-ld";
import { mdxComponents } from "@/components/mdx-content";
import { PublicationShell } from "@/components/publication-shell";
import { getEntryBySlug, getProjects } from "@/lib/content";
import { contentJsonLd } from "@/lib/json-ld";
import { siteConfig } from "@/lib/site";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getProjects().map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getEntryBySlug("projects", slug);

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
      type: "article",
      title: project.title + " — " + siteConfig.name,
      description: project.description,
      url: project.href,
      publishedTime: project.date,
      tags: project.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title + " — " + siteConfig.name,
      description: project.description,
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getEntryBySlug("projects", slug);

  if (!project) {
    notFound();
  }

  return (
    <>
      <JsonLd data={contentJsonLd(project)} />
      <PublicationShell active="Projects">
        <article className="article-shell">
          <ArticleHeader entry={project} />
          <div className="mdx-content">
            <MDXRemote components={mdxComponents} source={project.content} />
          </div>
        </article>
      </PublicationShell>
    </>
  );
}
