export type ContentKind = "projects" | "research";

export interface CompileOptions {
  rootDirectory?: string;
  outputDirectory?: string;
}

export interface CompiledEntry {
  kind: ContentKind;
  slug: string;
  modulePath: string;
  bodySha256: string;
}

export function compileContentMdx(options?: CompileOptions): Promise<{
  changed: boolean;
  entries: CompiledEntry[];
}>;

export function watchContentMdx(options?: CompileOptions): { close(): void };
