import Link from "next/link";
import type { ContentEntry, ProjectEntry } from "@/lib/content";
import { formatDate } from "@/lib/format";

type ContentCardProps = {
  entry: ContentEntry;
  compact?: boolean;
  descriptionMode?: "short" | "none";
  headingLevel?: 2 | 3;
  linked?: boolean;
};

export function ContentCard({
  entry,
  compact = false,
  descriptionMode,
  headingLevel = 3,
  linked = true,
}: ContentCardProps) {
  const resolvedDescriptionMode = descriptionMode ?? (compact ? "none" : "short");
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const className = [
    "content-card",
    compact ? "content-card--compact" : "",
    resolvedDescriptionMode === "none" ? "content-card--no-description" : "",
    linked ? "" : "content-card--static",
  ]
    .filter(Boolean)
    .join(" ");

  const cardContent = (
    <>
      <div className="content-card__meta">
        {entry.kind === "projects" ? (
          <><span className="metadata-label">Status:</span> {entry.status}</>
        ) : (
          <time dateTime={entry.date}>{formatDate(entry.date)}</time>
        )}
      </div>
      <div className="content-card__main">
        <Heading className="content-card__title">{entry.title}</Heading>
        {resolvedDescriptionMode === "short" ? (
          <p>{entry.description}</p>
        ) : null}
        <div
          className="tag-row tag-row--card"
          aria-label={"Tags: " + entry.tags.slice(0, 3).join(", ")}
        >
          <span className="metadata-label">Tags:</span>
          {entry.tags.slice(0, 3).map((tag) => (
            <span className="tag-row__tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>
      {linked ? (
        <span aria-hidden="true" className="content-card__arrow">
          →
        </span>
      ) : null}
    </>
  );

  return (
    <article className={className}>
      {linked ? (
        <Link className="content-card__link" href={entry.href}>
          {cardContent}
        </Link>
      ) : (
        <div className="content-card__link">{cardContent}</div>
      )}
    </article>
  );
}

type ArticleHeaderProps = {
  entry: ContentEntry;
};

export function ArticleHeader({ entry }: ArticleHeaderProps) {
  return (
    <header className="article-header">
      <nav aria-label="Breadcrumb" className="article-breadcrumb">
        <Link href={`/${entry.kind}`}>{entry.kind === "projects" ? "Projects" : "Research & Essays"}</Link>
        <span aria-hidden="true"> / </span>
        <span aria-current="page">{entry.title}</span>
      </nav>

      <div className="article-header__meta">
        {entry.kind === "projects" && <span>Status: {entry.status}</span>}
        <time dateTime={entry.date}>{formatDate(entry.date)}</time>
        <span>{entry.readingTime}</span>
      </div>

      <h1>{entry.title}</h1>
      <p className="article-deck">{entry.description}</p>
      <div
        className="tag-row tag-row--large"
        aria-label={"Tags: " + entry.tags.join(", ")}
      >
        <span className="metadata-label">Tags:</span>
        {entry.tags.map((tag) => (
          <span className="tag-row__tag" key={tag}>
            {tag}
          </span>
        ))}
      </div>
      {entry.kind === "projects" ? <ProjectLinks project={entry} /> : entry.demoUrl ? (
        <div className="project-links">
          <a href={entry.demoUrl} rel="noreferrer" target="_blank">
            Related post <span aria-hidden="true">↗</span>
          </a>
        </div>
      ) : null}
    </header>
  );
}

function ProjectLinks({ project }: { project: ProjectEntry }) {
  const links = [
    { label: "Demo", href: project.demoUrl },
    { label: "Repo", href: project.repoUrl },
    { label: "Video", href: project.videoUrl },
  ].filter((link): link is { label: string; href: string } => Boolean(link.href));

  if (links.length === 0) {
    return null;
  }

  return (
    <div className="project-links">
      {links.map((link) => (
        <a href={link.href} key={link.href} rel="noreferrer" target="_blank">
          {link.label} <span aria-hidden="true">↗</span>
        </a>
      ))}
    </div>
  );
}
