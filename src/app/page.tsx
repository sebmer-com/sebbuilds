import {
  Folder,
  ListChecks,
} from "lucide-react";
import Link from "next/link";
import { CommandLine } from "@/components/command-line";
import { ContentCard } from "@/components/content-card";
import { JsonLd } from "@/components/json-ld";
import { SectionPanel } from "@/components/section-panel";
import { TerminalFrame } from "@/components/terminal-frame";
import { getSebastianAbout, getSebastianAboutSectionContent } from "@/lib/about";
import { getFeaturedProjects, getLogs, getProjects } from "@/lib/content";
import { personJsonLd, websiteJsonLd } from "@/lib/json-ld";
import { siteConfig } from "@/lib/site";

export default function Home() {
  const pinnedProjects = getFeaturedProjects();
  const projects = (pinnedProjects.length > 0 ? pinnedProjects : getProjects()).slice(0, 3);
  const latestLogs = getLogs().slice(0, 5);
  const about = getSebastianAbout();
  const shortBioParagraphs = getSebastianAboutSectionContent(about, "Short Bio")
    .split(/\n\s*\n/)
    .filter(Boolean)
    .slice(0, 2);

  return (
    <>
      <JsonLd data={[websiteJsonLd(), personJsonLd()]} />
      <main className="site-shell">
        <TerminalFrame>
          <section className="hero-section" aria-labelledby="home-title">
            <div className="hero-copy">
              <CommandLine command="npx github:sebmer-com/sebbuilds" variant="hero" />
              <h1 className="wordmark" data-text="SEB BUILDS" id="home-title">
                SEB BUILDS
              </h1>
              <p className="hero-lede">
                products in public.
                <span className="cursor-block" aria-hidden="true" />
              </p>

              <div className="cta-row">
                <Link className="button button--primary" href="/projects">
                  <span aria-hidden="true">&gt;_</span>
                  View Projects
                </Link>
                <Link className="button button--secondary" href="/logs">
                  Follow the Build
                  <span aria-hidden="true">-&gt;</span>
                </Link>
              </div>
            </div>

            <aside className="about-card" id="about" aria-label="About Sebastian">
              <div className="about-card__chrome">
                <span>&gt;_ WHO AM I?</span>
                <span aria-hidden="true">- x</span>
              </div>
              {shortBioParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <Link className="about-card__link" href="/about">
                Read more -&gt;
              </Link>
            </aside>
          </section>

          <section className="dashboard-grid" aria-label="Latest updates">
            <SectionPanel
              command="seb@sebmer.com ~ % tail -f build.log"
              href="/logs"
              id="build-log"
              icon={<ListChecks aria-hidden="true" size={18} />}
              linkLabel="All"
              title="Latest Build Log"
            >
              <div className="build-log">
                {latestLogs.map((item) => (
                  <div className="build-log__row" key={item.id}>
                    <span className="build-log__date">{item.date}</span>
                    <span className="build-log__dot" aria-hidden="true" />
                    <span>
                      <strong>{item.text}</strong>
                    </span>
                  </div>
                ))}
              </div>
            </SectionPanel>

            <SectionPanel
              command="seb@sebmer.com ~/projects % ls"
              href="/projects"
              id="projects"
              icon={<Folder aria-hidden="true" size={18} />}
              linkLabel="All"
              title="Projects"
            >
              <div className="content-list">
                {projects.map((project) => (
                  <ContentCard compact entry={project} key={project.slug} />
                ))}
              </div>
            </SectionPanel>
          </section>

          <section className="wide-section" id="follow">
            <div>
              <CommandLine command="cat follow.md" prefix="seb@sebmer.com ~/follow %" />
              <h2>Follow the build.</h2>
            </div>
            <div className="status-pills" aria-label="Current channels">
              {siteConfig.socials.map((social) =>
                social.status === "live" && social.href ? (
                  <a
                    data-status={social.status}
                    href={social.href}
                    key={social.name}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {social.label}
                  </a>
                ) : (
                  <span data-status={social.status} key={social.name}>
                    {social.label}
                  </span>
                ),
              )}
            </div>
          </section>

          <section className="contact-strip" id="contact">
            <div>
              <CommandLine command="open tally.so/r/3jeJVa" prefix="seb@sebmer.com ~ %" />
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
        </TerminalFrame>
      </main>
    </>
  );
}
