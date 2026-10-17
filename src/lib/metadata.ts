export type SocialImage = string | { url: string; width?: number; height?: number; alt?: string };
export interface Metadata {
  title?: string;
  robots?: { index: boolean };
  description?: string;
  alternates?: { canonical?: string };
  openGraph?: { images?: readonly SocialImage[]; type?: string; title?: string; description?: string; url?: string; publishedTime?: string; tags?: string[] };
  twitter?: { images?: readonly SocialImage[]; card?: string; title?: string; description?: string };
}
export function notFound(): never { throw new Error("Unknown static content route"); }
