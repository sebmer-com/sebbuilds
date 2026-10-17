import { getLogs } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return getLogs().map((log) => ({
    slug: log.id,
  }));
}

export { metadata } from "../../logs/page";
export { default } from "../../logs/page";
