import SiteChrome from "@/components/SiteChrome";
import palettes from "@/components/palettes.module.css";

/** Zerra recolours the whole page, footer included, to its blue. */
export default function ZerraLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteChrome palette={palettes.zerra}>{children}</SiteChrome>;
}
