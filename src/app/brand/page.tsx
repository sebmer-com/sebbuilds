import type { Metadata } from "next";
import { PublicationShell } from "@/components/publication-shell";
import { socialFormats, socialImage } from "@/lib/brand";
import styles from "./brand.module.css";

export const metadata: Metadata = {
  title: "Brand",
  description: "Seb Builds brand assets: social images, wordmarks, colours, typography and an editable presentation template.",
  alternates: { canonical: "/brand" },
  openGraph: {
    title: "Seb Builds brand resources",
    description: "One editorial identity for products, research and work in public.",
    url: "/brand",
    images: [socialImage],
  },
};

const assets = "/brand/assets/";

export default function BrandPage() {
  return (
    <PublicationShell>
      <div className={styles.brand}>
        <header className={styles.intro}>
          <p className={styles.label}>Seb Builds / Brand resources</p>
          <h1>Products in public.<br /><em>One clear identity.</em></h1>
          <p>Images, wordmarks and an editorial template for the work you share.</p>
          <nav className={styles.links} aria-label="Brand sections">
            <a href="#social">01 / Social images</a>
            <a href="#identity">02 / Colour &amp; type</a>
            <a href="#template">03 / Presentation template</a>
          </nav>
        </header>

        <section className={styles.section} id="social" aria-labelledby="social-title">
          <p className={styles.label}>01 / Social images</p>
          <h2 id="social-title">A preview that belongs to the journal.</h2>
          <p>Large serif type, quiet labels and space to breathe. Choose ink or paper for each format.</p>
          <div className={styles.grid}>
            {(["dark", "light"] as const).map((theme) => (
              <figure className={styles.card} key={theme}>
                {/* eslint-disable-next-line @next/next/no-img-element -- Static native images preserve the site's strict CSP. */}
                <img
                  src={`${assets}open-graph-${theme}${theme === "dark" ? "-v1" : ""}.png`}
                  alt={`Seb Builds editorial social image on ${theme === "dark" ? "ink" : "paper"}`}
                  width={1200}
                  height={630}
                  loading="lazy"
                  decoding="async"
                />
                <figcaption>
                  <span>{theme === "dark" ? "Ink" : "Paper"} / 1200 × 630</span>
                  <a href={`${assets}open-graph-${theme}${theme === "dark" ? "-v1" : ""}.png`} download>PNG ↓</a>
                </figcaption>
              </figure>
            ))}
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <caption>Social image downloads</caption>
              <thead><tr><th scope="col">Format</th><th scope="col">Pixels</th><th scope="col">Ink</th><th scope="col">Paper</th></tr></thead>
              <tbody>
                {socialFormats.map((format) => (
                  <tr key={format.file}>
                    <th scope="row">{format.label}</th>
                    <td>{format.width} × {format.height}</td>
                    <td><a href={`${assets}${format.file}-dark${format.file === "open-graph" ? "-v1" : ""}.png`} download aria-label={`Download ${format.label} on ink`}>PNG ↓</a></td>
                    <td><a href={`${assets}${format.file}-light.png`} download aria-label={`Download ${format.label} on paper`}>PNG ↓</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className={styles.section} id="identity" aria-labelledby="identity-title">
          <p className={styles.label}>02 / Colour &amp; type</p>
          <h2 id="identity-title">Paper. Ink. No decoration needed.</h2>
          <div className={styles.swatches}>
            <div className={styles.swatch}><div className={styles.ink} /><p>Ink <span>#111111</span></p></div>
            <div className={styles.swatch}><div className={styles.paper} /><p>Paper <span>#FFFFFF</span></p></div>
            <div className={styles.swatch}><div className={styles.type} /><p>Text on ink <span>#F2F2F2</span></p></div>
          </div>
          <div className={styles.grid}>
            <div className={styles.typeSample}><h3>Latin Modern.</h3><p>Use the serif for headlines and reading. Keep titles large and regular; use italics for the claim and short emphasis. Georgia is the fallback.</p></div>
            <div className={`${styles.typeSample} ${styles.utility}`}><h3>FUNCTIONAL LABELS.</h3><p>Arial for navigation, labels and dimensions. Uppercase labels use generous tracking. Thin rules divide sections; content carries the emphasis.</p></div>
          </div>
          <div className={styles.wordmarks}>
            <a href={`${assets}seb-builds-wordmark-dark.svg`} download>Wordmark on paper · SVG ↓</a>
            <a href={`${assets}seb-builds-wordmark-light.svg`} download>Wordmark on ink · SVG ↓</a>
            <a href="/brand/brand.json" download>Brand tokens · JSON ↓</a>
          </div>
          <p>Write <strong>Seb Builds</strong>. Keep <em>products in public.</em> lowercase. Use concrete descriptions of the work, with no invented results or figures.</p>
        </section>

        <section className={styles.section} id="template" aria-labelledby="template-title">
          <p className={styles.label}>03 / Presentation template</p>
          <h2 id="template-title">The same editorial system, in slides.</h2>
          <p>Three editable 1600 × 900 layouts: cover, two-column content and a closing slide. Fonts are embedded; the file opens on its own.</p>
          <div className={styles.links}>
            <a href={`${assets}seb-builds-presentation-template.html`} download>Editable HTML ↓</a>
            <a href={`${assets}open-graph-dark-v1.png`} target="_blank" rel="noreferrer">Preview visual style ↗</a>
          </div>
          <blockquote className={styles.prompt}>Use the Seb Builds HTML template for [topic / audience]. Replace the placeholders with verified content. Preserve its fonts, colours, margins, thin rules and layouts.</blockquote>
        </section>
      </div>
    </PublicationShell>
  );
}
