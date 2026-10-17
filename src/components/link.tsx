import type { ComponentProps } from "react";
export default function Link({href, ...props}: ComponentProps<"a">) {
  if (href?.startsWith("/") && !href.startsWith("//")) {
    const url = new URL(href, "https://sebmer.com");
    if (!url.pathname.endsWith("/") && !url.pathname.split("/").pop()?.includes(".")) url.pathname += "/";
    href = url.pathname + url.search + url.hash;
  }
  return <a href={href} {...props} />;
}
