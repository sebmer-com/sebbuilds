export type SocialLink = {
  name: string;
  href?: string;
  label: string;
  status: "live" | "pending" | "soon";
};

export type NavLink = {
  label: string;
  href: string;
  external?: boolean;
};

const socialLinks: SocialLink[] = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/auto-mate/",
    label: "LinkedIn",
    status: "live",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/sebmer_/",
    label: "Instagram",
    status: "live",
  },
  {
    name: "X",
    href: "https://x.com/sebmer_com",
    label: "X",
    status: "live",
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@Sebmer-automate",
    label: "YouTube",
    status: "live",
  },
  {
    name: "GitHub",
    href: "https://github.com/sebmer-com",
    label: "GitHub",
    status: "live",
  },
  {
    name: "TikTok",
    label: "TikTok soon",
    status: "soon",
  },
];

export const siteConfig = {
  name: "Seb Builds",
  domain: "sebmer.com",
  url: "https://sebmer.com",
  locale: "en_US",
  tagline: "products in public.",
  description:
    "Projects, build logs, and lessons from Sebastian Mertens, published while the work is still in motion.",
  contentDescription:
    "Seb Builds is Sebastian's public builder log for useful products, build logs, videos, and lessons from shipping in public.",
  contactUrl: "https://tally.so/r/3jeJVa",
  legal: {
    businessName: "Mertens Advies",
    ownerName: "Sebastian Mertens",
    kvkNumber: "96847247",
    addressLabel: "Available on request via the contact form",
    contactLabel: "Available on request via the contact form",
  },
  author: {
    name: "Sebastian Mertens",
    location: "Netherlands",
  },
  nav: [
    { label: "Projects", href: "/projects" },
    { label: "Research & Essays", href: "/research" },
    { label: "Build Log", href: "/logs" },
    { label: "About", href: "/about" },
    { label: "Follow", href: "/#follow" },
    { label: "Contact", href: "https://tally.so/r/3jeJVa", external: true },
  ] satisfies NavLink[],
  socials: socialLinks,
} as const;
