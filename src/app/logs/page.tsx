import type { Metadata } from "next";
import { EditorialLabel } from "@/components/editorial-label";
import { PublicationShell } from "@/components/publication-shell";
import { getLogs } from "@/lib/content";
import { siteConfig } from "@/lib/site";

const logsDescription =
  "Date-only notes from products and experiments being built in public.";

export const metadata: Metadata = {
  title: "Build Log",
  description: logsDescription,
  alternates: {
    canonical: "/logs",
  },
  openGraph: {
    title: "Build Log — " + siteConfig.name,
    description: logsDescription,
    url: "/logs",
  },
};

export default function LogsPage() {
  const logs = getLogs();

  return (
    <PublicationShell active="Build Log">
      <section className="publication-page" aria-labelledby="logs-title">
        <EditorialLabel>Chronology / Build Log</EditorialLabel>
        <div className="page-heading">
          <h1 id="logs-title">Build Log</h1>
          <p>{logsDescription}</p>
        </div>

        <div className="log-archive" aria-label="Latest build logs">
          {logs.map((item) => (
            <article className="log-entry" id={item.id} key={item.id}>
              <div className="log-entry__meta">
                <time dateTime={item.date}>{item.date}</time>
              </div>
              <div className="log-entry__body">
                <h2>{item.text}</h2>
                <p>{item.detail}</p>
                {/* eslint-disable @next/next/no-img-element -- Native images preserve strict CSP without inline styles. */}
                {item.imageUrl ? (
                  <img
                    alt={item.imageAlt ?? "Build log visual for " + item.text}
                    className="log-entry__image"
                    height={820}
                    loading="lazy"
                    decoding="async"
                    src={item.imageUrl}
                    width={1400}
                  />
                ) : null}
                {/* eslint-enable @next/next/no-img-element */}
              </div>
            </article>
          ))}
        </div>
      </section>
    </PublicationShell>
  );
}
