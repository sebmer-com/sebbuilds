import type { ComponentType } from "react";
import type { MDXComponents } from "mdx/types";

export type CompiledMdxComponent = ComponentType<{ components?: MDXComponents }>;

export const compiledMdx: Readonly<{
  projects: Readonly<Record<string, CompiledMdxComponent>>;
  research: Readonly<Record<string, CompiledMdxComponent>>;
}>;
