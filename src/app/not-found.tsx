import Link from "next/link";
import { EditorialLabel } from "@/components/editorial-label";
import { PublicationShell } from "@/components/publication-shell";

export default function NotFound() {
  return (
    <PublicationShell>
      <section className="publication-page not-found-page" aria-labelledby="not-found-title">
        <EditorialLabel>Error / 404</EditorialLabel>
        <h1 id="not-found-title">Page not found</h1>
        <p>The page you asked for is not in this publication.</p>
        <Link className="button button--primary" href="/">
          Return Home
        </Link>
      </section>
    </PublicationShell>
  );
}
