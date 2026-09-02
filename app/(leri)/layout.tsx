import SiteChrome from "@/components/SiteChrome";
import palettes from "@/components/palettes.module.css";

/** Leri shifts the whole paper family warm, footer included. */
export default function LeriLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteChrome palette={palettes.leri}>{children}</SiteChrome>;
}
