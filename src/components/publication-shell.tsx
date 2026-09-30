import Link from "next/link";
import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/lib/site";

type PublicationShellProps = {
  active?: string;
  children: ReactNode;
};

export function PublicationShell({ active, children }: PublicationShellProps) {
  return (
    <div className="publication" data-testid="publication-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <header className="publication-header">
        <div className="publication-masthead">
          <div className="masthead__identity">
            <Link className="masthead__brand" href="/" aria-label="Seb Builds home">
              Seb Builds
            </Link>
            {/* eslint-disable-next-line @next/next/no-img-element -- Native images preserve strict CSP without inline styles. */}
            <img
              className="masthead__portrait"
              src="/images/sebastian-mertens.png"
              alt="Sebastian Mertens"
              width={32}
              height={32}
              loading="lazy"
              decoding="async"
            />
          </div>
          <p className="masthead__tagline">{siteConfig.tagline}</p>
        </div>

        <nav aria-label="Primary navigation" className="primary-nav">
          {siteConfig.nav.map((item) =>
            item.external ? (
              <a
                className="primary-nav__link"
                href={item.href}
                key={item.href}
                rel="noreferrer"
                target="_blank"
              >
                {item.label}
              </a>
            ) : (
              <Link
                aria-current={active === item.label ? "page" : undefined}
                className="primary-nav__link"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ),
          )}
          <ThemeToggle />
        </nav>
      </header>

      <main id="main-content" className="publication-main">
        {children}
      </main>

      <PublicationFooter />
    </div>
  );
}

function PublicationFooter() {
  return (
    <footer className="publication-footer">
      <div className="publication-footer__follow">
        <p className="publication-footer__label">Follow</p>
        <nav aria-label="Follow Sebastian" className="footer-social-list">
          {siteConfig.socials.map((social) => {
            if (social.status === "live" && social.href) {
              return (
                <a
                  href={social.href}
                  key={social.name}
                  rel="noreferrer"
                  target="_blank"
                >
                  {social.label}
                </a>
              );
            }

            return (
              <span
                aria-label={social.name + ", coming soon"}
                key={social.name}
              >
                {social.name} <span aria-hidden="true">(soon)</span>
              </span>
            );
          })}
        </nav>
      </div>

      <div className="publication-footer__details">
        <span>{siteConfig.author.location}</span>
        <span>© 2026 {siteConfig.name}</span>
        <span>
          {siteConfig.legal.businessName} · KVK {siteConfig.legal.kvkNumber}
        </span>
        <Link href="/legal">Legal</Link>
      </div>
    </footer>
  );
}
