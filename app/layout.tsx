import type { Metadata, Viewport } from "next";
import { SITE_URL } from "@/lib/nav";
import "./globals.css";

const DESCRIPTION =
  "Applied AI from Lagos and London: products, enterprise engineering and the Bambara AI Foundation.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "NSK AI — applied AI for enterprise",
    template: "%s — NSK AI",
  },
  description: DESCRIPTION,
  // "./" resolves to the page's own path, so every route declares itself the
  // canonical one. Without this a search engine picks its own favourite among
  // the apex, the www host and any query-string variant it has crawled.
  alternates: { canonical: "./" },
  // No title or description here on purpose: set them and every page inherits
  // the site blurb, so a shared product link previews as the home page. Left
  // out, each page's own title and description are used.
  openGraph: {
    type: "website",
    siteName: "NSK AI",
    locale: "en_GB",
    url: "./",
  },
  twitter: { card: "summary_large_image" },
};

// The design is drawn at 1440px, but the page now adapts below that rather
// than asking a phone to render a 1440px canvas and scale it down.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB">
      <head>
        {/* TODO: self-host Gambetta and Author for production (both are free
            from Fontshare); the CDN link is carried over from the prototype. */}
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          href="https://api.fontshare.com/v2/css?f%5B%5D=author&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://api.fontshare.com/v2/css?f%5B%5D=gambetta@1,2&display=swap"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Spline+Sans+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
