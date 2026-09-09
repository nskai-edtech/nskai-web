import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/nav";

/* Every static route, in the order the navigation presents them. Kept by hand
   because the set is small and fixed; a route added without a line here is
   simply left out of the sitemap rather than silently mis-described. */
const ROUTES = [
  "/",
  "/products/leri",
  "/products/zerra",
  "/products/rudani",
  "/products/enterprise-ai",
  "/products/data-annotation",
  "/products/advanced-rd",
  "/solutions",
  "/solutions/financial-services",
  "/solutions/telecommunications",
  "/solutions/health-and-insurance",
  "/solutions/public-sector",
  "/solutions/retail-and-commerce",
  "/solutions/energy-and-industry",
  "/foundation",
  "/foundation/udara",
  "/foundation/rag-bootcamp-2025",
  "/community",
  "/company",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return ROUTES.map((route) => ({
    url: new URL(route, SITE_URL).href,
    lastModified,
    // The home page outranks the section indexes, which outrank leaf pages.
    priority: route === "/" ? 1 : route.split("/").length === 2 ? 0.8 : 0.6,
  }));
}
