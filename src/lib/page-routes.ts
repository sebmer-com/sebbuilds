import type { ReactElement } from "react";
import type { Metadata } from "./metadata";
import Home from "../views/page";
import Projects, { metadata as projectsMetadata } from "../views/projects/page";
import Research, { metadata as researchMetadata } from "../views/research/page";
import Logs, { metadata as logsMetadata } from "../views/logs/page";
import About, { metadata as aboutMetadata } from "../views/about/page";
import Legal, { metadata as legalMetadata } from "../views/legal/page";
import Brand, { metadata as brandMetadata } from "../views/brand/page";
import Project, { generateMetadata as projectMetadata, generateStaticParams as projectParams } from "../views/projects/[slug]/page";
import Essay, { generateMetadata as essayMetadata, generateStaticParams as essayParams } from "../views/research/[slug]/page";
import { getLogs } from "./content";
export type PageDefinition = { path: string | undefined; render: () => ReactElement | Promise<ReactElement>; metadata: () => Metadata | Promise<Metadata> };
export function pageRoutes(): PageDefinition[] {
  const simple = [ [undefined, Home, {}], ["projects", Projects, projectsMetadata], ["research", Research, researchMetadata], ["logs", Logs, logsMetadata], ["notes", Logs, logsMetadata], ["about", About, aboutMetadata], ["legal", Legal, legalMetadata], ["brand", Brand, brandMetadata] ] as const;
  return [ ...simple.map(([path,render,metadata]) => ({path, render, metadata: () => metadata})),
    ...projectParams().map(({slug}) => ({path: `projects/${slug}`, render: () => Project({params: Promise.resolve({slug})}), metadata: () => projectMetadata({params: Promise.resolve({slug})})})),
    ...essayParams().map(({slug}) => ({path: `research/${slug}`, render: () => Essay({params: Promise.resolve({slug})}), metadata: () => essayMetadata({params: Promise.resolve({slug})})})),
    ...getLogs().map(log => ({path: `notes/${log.id}`, render: Logs, metadata: () => logsMetadata})),
  ];
}
