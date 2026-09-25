import Link from "next/link";
import { ContentCard } from "@/components/content-card";
import { EditorialLabel } from "@/components/editorial-label";
import { JsonLd } from "@/components/json-ld";
import { PublicationShell } from "@/components/publication-shell";
import { SectionPanel } from "@/components/section-panel";
import { getSebastianAbout, getSebastianAboutSectionContent } from "@/lib/about";
import { getFeaturedProjects, getLogs, getProjects, getResearch } from "@/lib/content";
import { personJsonLd, websiteJsonLd } from "@/lib/json-ld";
import { siteConfig } from "@/lib/site";

export default function Home() {
  const pinnedProjects = getFeaturedProjects();
  const projects = (pinnedProjects.length > 0 ? pinnedProjects : getProjects()).slice(0, 3);
  const latestLogs = getLogs().slice(0, 5);
  const research = getResearch();
  const about = getSebastianAbout();
  const shortBioParagraphs = getSebastianAboutSectionContent(about, "Short Bio")
    .split(/\n\s*\n/)
    .filter(Boolean)
    .slice(0, 2);

  return (
    <>
      <JsonLd data={[websiteJsonLd(), personJsonLd()]} />
      <PublicationShell>
        <section className="home-cover" aria-labelledby="home-title">
          <div className="home-cover__title">
            <EditorialLabel>A public builder journal by Sebastian Mertens</EditorialLabel>
            <h1 className="display-title" id="home-title">
              Seb Builds
            </h1>
            <p className="cover-tagline">{siteConfig.tagline}</p>
          </div>

          <div className="home-cover__context">
            <div className="home-abstract" id="about">
              <p className="home-abstract__label">Abstract</p>
              {shortBioParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <Link className="text-link" href="/about">
                Read the profile <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="cta-row">
              <Link className="button button--primary" href="/projects">
                View Projects
              </Link>
              <Link className="button button--secondary" href="/logs">
                Follow the Build <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="dashboard-grid" aria-label="Latest updates">
          <SectionPanel
            href="/logs"
            id="build-log"
            index="01"
            linkLabel="Read all"
            title="Latest Build Log"
          >
            <div className="build-log">
              {latestLogs.map((item) => (
                <div className="build-log__row" key={item.id}>
                  <time className="build-log__date" dateTime={item.date}>
                    {item.date}
                  </time>
                  <span>
                    <strong>{item.text}</strong>
                  </span>
                </div>
              ))}
            </div>
          </SectionPanel>

          <SectionPanel
            href="/projects"
            id="projects"
            index="02"
            linkLabel="View all"
            title="Selected Projects"
          >
            <div className="content-list">
              {projects.map((project) => (
                <ContentCard compact entry={project} key={project.slug} />
              ))}
            </div>
          </SectionPanel>
        </section>

        {research.length > 0 && (
          <SectionPanel
            href="/research"
            id="research"
            index="03"
            linkLabel="Read all"
            title="Research & Essays"
          >
            <div className="content-list">
              {research.map((entry) => (
                <ContentCard entry={entry} key={entry.slug} />
              ))}
            </div>
          </SectionPanel>
        )}

        <section className="home-follow" id="follow">
          <div>
            <EditorialLabel>Correspondence / Follow</EditorialLabel>
            <h2>Follow the build.</h2>
          </div>
          <div className="status-pills" aria-label="Current channels">
            {siteConfig.socials.map((social) =>
              social.status === "live" && social.href ? (
                <a
                  href={social.href}
                  key={social.name}
                  rel="noreferrer"
                  target="_blank"
                >
                  {social.label}
                </a>
              ) : (
                <span key={social.name}>{social.label}</span>
              ),
            )}
          </div>
        </section>

        <section className="contact-strip" id="contact">
          <div>
            <EditorialLabel>Work / Contact</EditorialLabel>
            <h2>Build together?</h2>
          </div>
          <a
            className="button button--primary"
            href={siteConfig.contactUrl}
            rel="noreferrer"
            target="_blank"
          >
            Contact Sebastian
          </a>
        </section>
      </PublicationShell>
    </>
  );
}
