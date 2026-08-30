import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { siteConfig } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Seb Builds — Products in Public",
    template: "%s — Seb Builds",
  },
  description: siteConfig.description,
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "/rss.xml",
    },
  },
  authors: [{ name: siteConfig.author.name, url: siteConfig.url }],
  creator: siteConfig.author.name,
  publisher: siteConfig.name,
  verification: {
    google: "exxq0qapJW7-X7l0FS_77Tv9bi5NxvcGWidMZQAUK24",
  },
  openGraph: {
    type: "website",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: "Seb Builds — Products in Public",
    description: siteConfig.description,
    locale: siteConfig.locale,
    images: [
      {
        url: "/og-image.png",
        width: 1536,
        height: 864,
        alt: "Seb Builds website preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Seb Builds — Products in Public",
    description: siteConfig.description,
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  colorScheme: "dark light",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="publication-root">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
