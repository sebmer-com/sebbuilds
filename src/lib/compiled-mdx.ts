import { createElement } from "react";
import type { MDXComponents } from "mdx/types";
import { compiledMdx } from "@/generated/mdx/index.mjs";
import type { ContentKind } from "@/lib/content";

export function CompiledMdx({ kind, slug, components }: {
  kind: ContentKind;
  slug: string;
  components: MDXComponents;
}) {
  const Content = compiledMdx[kind][slug];
  if (!Content) throw new Error(`Missing compiled content: ${kind}/${slug}`);
  return createElement(Content, { components });
}
