/* eslint-disable @next/next/no-img-element */

import type { ComponentPropsWithoutRef } from "react";

type AnchorProps = ComponentPropsWithoutRef<"a">;
type ImageProps = ComponentPropsWithoutRef<"img">;

function isExternalHref(href: AnchorProps["href"]) {
  return typeof href === "string" && /^https?:\/\//i.test(href);
}

export const mdxComponents = {
  a: ({ children, href, ...props }: AnchorProps) => {
    const external = isExternalHref(href);

    return (
      <a
        {...props}
        href={href}
        rel={external ? "noreferrer" : undefined}
        target={external ? "_blank" : undefined}
      >
        {children}
      </a>
    );
  },
  blockquote: ({
    children,
    ...props
  }: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote {...props}>{children}</blockquote>
  ),
  code: ({ children, ...props }: ComponentPropsWithoutRef<"code">) => (
    <code {...props}>{children}</code>
  ),
  h2: ({ children, ...props }: ComponentPropsWithoutRef<"h2">) => (
    <h2 {...props}>{children}</h2>
  ),
  h3: ({ children, ...props }: ComponentPropsWithoutRef<"h3">) => (
    <h3 {...props}>{children}</h3>
  ),
  img: ({ alt, ...props }: ImageProps) => (
    <img {...props} alt={alt ?? ""} />
  ),
  li: ({ children, ...props }: ComponentPropsWithoutRef<"li">) => (
    <li {...props}>{children}</li>
  ),
  ol: ({ children, ...props }: ComponentPropsWithoutRef<"ol">) => (
    <ol {...props}>{children}</ol>
  ),
  p: ({ children, ...props }: ComponentPropsWithoutRef<"p">) => (
    <p {...props}>{children}</p>
  ),
  pre: ({ children, ...props }: ComponentPropsWithoutRef<"pre">) => (
    <pre {...props}>{children}</pre>
  ),
  table: ({ children, ...props }: ComponentPropsWithoutRef<"table">) => (
    <div className="mdx-table-wrap">
      <table {...props}>{children}</table>
    </div>
  ),
  tbody: ({ children, ...props }: ComponentPropsWithoutRef<"tbody">) => (
    <tbody {...props}>{children}</tbody>
  ),
  td: ({ children, ...props }: ComponentPropsWithoutRef<"td">) => (
    <td {...props}>{children}</td>
  ),
  th: ({ children, ...props }: ComponentPropsWithoutRef<"th">) => (
    <th {...props}>{children}</th>
  ),
  thead: ({ children, ...props }: ComponentPropsWithoutRef<"thead">) => (
    <thead {...props}>{children}</thead>
  ),
  tr: ({ children, ...props }: ComponentPropsWithoutRef<"tr">) => (
    <tr {...props}>{children}</tr>
  ),
  ul: ({ children, ...props }: ComponentPropsWithoutRef<"ul">) => (
    <ul {...props}>{children}</ul>
  ),
};
