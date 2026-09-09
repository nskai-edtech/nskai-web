import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/nav";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Nothing to index behind the contact endpoint.
      disallow: "/api/",
    },
    sitemap: new URL("/sitemap.xml", SITE_URL).href,
  };
}
