import type { ReactNode } from "react";
import SiteChrome from "@/components/SiteChrome";
import palettes from "@/components/palettes.module.css";

export default function HubLayout({ children }: { children: ReactNode }) {
  return <SiteChrome palette={palettes.community}>{children}</SiteChrome>;
}
