import SiteChrome from "@/components/SiteChrome";
import palettes from "@/components/palettes.module.css";

/** All six industry pages share one cool-neutral palette. */
export default function IndustryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteChrome palette={palettes.industry}>{children}</SiteChrome>;
}
