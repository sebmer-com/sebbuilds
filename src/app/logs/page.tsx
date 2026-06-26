import type { Metadata } from "next";
import Image from "next/image";
import { CommandLine } from "@/components/command-line";
import { TerminalFrame } from "@/components/terminal-frame";
import { getLogs } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Latest Build Logs",
  description:
    "Latest updates from Sebastian's public build log on Seb Builds.",
  alternates: {
    canonical: "/logs",
  },
  openGraph: {
    title: `Latest Build Logs - ${siteConfig.name}`,
    description:
      "Latest updates from Sebastian's public build log on Seb Builds.",
    url: "/logs",
  },
};

export default function LogsPage() {
  const logs = getLogs();

  return (
    <main className="site-shell">
      <TerminalFrame active="Build Log">
        <section className="terminal-page" aria-labelledby="logs-title">
          <CommandLine command="tail -f ./build.log --all" />
          <div className="page-heading">
            <h1 id="logs-title">Latest Build Logs</h1>
            <p>Recent shipped updates from the Seb Builds loop.</p>
          </div>

          <div className="log-archive" aria-label="Latest build logs">
            {logs.map((item) => (
              <article className="log-entry" id={item.id} key={item.id}>
                <div className="log-entry__meta">
                  <span>{item.date}</span>
                </div>
                <div>
                  <h2>{item.text}</h2>
                  <p>{item.detail}</p>
                  {item.imageUrl ? (
                    <Image
                      alt={item.imageAlt ?? `Build log visual for ${item.text}`}
                      className="log-entry__image"
                      height={820}
                      loading="lazy"
                      src={item.imageUrl}
                      width={1400}
                    />
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>
      </TerminalFrame>
    </main>
  );
}
