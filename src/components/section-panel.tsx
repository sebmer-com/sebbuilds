import Link from "next/link";
import type { ReactNode } from "react";

type SectionPanelProps = {
  title: string;
  index?: string;
  id?: string;
  href?: string;
  linkLabel?: string;
  children: ReactNode;
};

export function SectionPanel({
  title,
  index,
  id,
  href,
  linkLabel = "Read all",
  children,
}: SectionPanelProps) {
  return (
    <section className="section-panel" id={id}>
      <header className="section-panel__header">
        <div className="section-panel__heading">
          {index ? <span className="section-panel__index">{index}</span> : null}
          <h2>{title}</h2>
        </div>
        {href ? (
          <Link className="text-link" href={href}>
            {linkLabel} <span aria-hidden="true">→</span>
          </Link>
        ) : null}
      </header>

      <div className="section-panel__body">{children}</div>
    </section>
  );
}
