import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "NSK AI",
    template: "%s — NSK AI",
  },
  description:
    "Applied AI from Lagos and London: products, enterprise engineering and the Bambara AI Foundation.",
};

// The designs are a fixed 1440px desktop layout with no breakpoints.
export const viewport: Viewport = {
  width: 1440,
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
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
