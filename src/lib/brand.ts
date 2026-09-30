export const socialImage = {
  url: "/brand/assets/open-graph-dark-v1.png",
  width: 1200,
  height: 630,
  alt: "Seb Builds — products in public. Projects, research and build logs by Sebastian Mertens.",
} as const;

export const socialFormats = [
  { file: "open-graph", label: "Open Graph", width: 1200, height: 630 },
  { file: "linkedin", label: "LinkedIn post", width: 1200, height: 627 },
  { file: "twitter", label: "X / Twitter card", width: 1200, height: 675 },
  { file: "square", label: "Square post", width: 1080, height: 1080 },
  { file: "github", label: "GitHub preview", width: 1280, height: 640 },
  { file: "x-header", label: "X header", width: 1500, height: 500 },
] as const;
