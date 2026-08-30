import type { Metadata } from "next";
import { EditorialLabel } from "@/components/editorial-label";
import { PublicationShell } from "@/components/publication-shell";
import { siteConfig } from "@/lib/site";

const legalDescription =
  "Company information, privacy policy, and cookie policy for Seb Builds by Mertens Advies.";

export const metadata: Metadata = {
  title: "Legal, Privacy & Cookies",
  description: legalDescription,
  alternates: {
    canonical: "/legal",
  },
  openGraph: {
    title: "Legal, Privacy & Cookies — " + siteConfig.name,
    description: legalDescription,
    url: "/legal",
  },
};

const legalSections = [
  {
    title: "Company Info",
    items: [
      "Brand: " + siteConfig.name,
      "Registered business: " + siteConfig.legal.businessName,
      "Owner: " + siteConfig.legal.ownerName,
      "KVK number: " + siteConfig.legal.kvkNumber,
      "Website: " + siteConfig.domain,
      "Business address: " + siteConfig.legal.addressLabel,
      "Contact email: " + siteConfig.legal.contactLabel,
    ],
  },
  {
    title: "Privacy Policy",
    items: [
      "This website may process basic server logs for security, reliability, and abuse prevention.",
      "If you use the contact form, Tally processes the details you submit so Sebastian can reply.",
      "External links such as GitHub and social profiles are handled by those third-party services.",
      "This site currently has no account system, newsletter signup, payment flow, or embedded YouTube tracking.",
      "Personal data is kept only as long as needed for the purpose it was submitted or as required by law.",
    ],
  },
  {
    title: "Cookie Policy",
    items: [
      "The site currently uses functional theme preference behavior only.",
      "No ad cookies, Meta Pixel, profiling cookies, or non-essential tracking cookies are used in v1.",
      "Because no non-essential tracking cookies are used, this version does not show a cookie consent banner.",
      "If analytics, ads, embedded video tracking, or other third-party trackers are added later, this page and the consent flow must be updated.",
    ],
  },
];

export default function LegalPage() {
  return (
    <PublicationShell>
      <section className="publication-page legal-page" aria-labelledby="legal-title">
        <EditorialLabel>Information / Legal</EditorialLabel>
        <div className="page-heading">
          <h1 id="legal-title">Legal, Privacy &amp; Cookies</h1>
          <p>Company info, privacy, and cookies for Seb Builds.</p>
        </div>

        <div className="legal-stack">
          {legalSections.map((section, index) => (
            <section className="legal-section" key={section.title}>
              <span className="legal-section__number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h2>{section.title}</h2>
                <ul>
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </section>
          ))}

          <section className="legal-section">
            <span className="legal-section__number">04</span>
            <div>
              <h2>Contact</h2>
              <p>
                Address and direct contact details are available on request via
                the contact form.
              </p>
              <a
                className="button button--primary"
                href={siteConfig.contactUrl}
                rel="noreferrer"
                target="_blank"
              >
                Contact Sebastian
              </a>
            </div>
          </section>

          <p className="legal-note">
            Last updated: May 1, 2026. This page is maintained as a practical
            website notice and is not legal advice.
          </p>
        </div>
      </section>
    </PublicationShell>
  );
}
