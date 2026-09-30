import type { Metadata } from "next";
import { socialImage } from "@/lib/brand";
import { ContentCard } from "@/components/content-card";
import { EditorialLabel } from "@/components/editorial-label";
import { PublicationShell } from "@/components/publication-shell";
import { getAllTags, getProjects } from "@/lib/content";
import { siteConfig } from "@/lib/site";

const projectsDescription = "Products, experiments, and shipped work by Sebastian Mertens.";

export const metadata: Metadata = {
  title: "Projects",
  description: projectsDescription,
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    images: [socialImage],
    title: "Projects — " + siteConfig.name,
    description: projectsDescription,
    url: "/projects",
  },
};

export default function ProjectsPage() {
  const projects = getProjects();
  const tags = getAllTags(projects);

  return (
    <PublicationShell active="Projects">
      <section className="publication-page" aria-labelledby="projects-title">
        <EditorialLabel>Index / Projects</EditorialLabel>
        <div className="page-heading">
          <h1 id="projects-title">Projects</h1>
          <p>{projectsDescription}</p>
        </div>

        <div className="subject-index" aria-label="Project subjects">
          <span className="metadata-label">Subjects:</span>
          {tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>

        <div className="archive-list">
          {projects.map((project) => (
            <ContentCard entry={project} headingLevel={2} key={project.slug} />
          ))}
        </div>
      </section>
    </PublicationShell>
  );
}
