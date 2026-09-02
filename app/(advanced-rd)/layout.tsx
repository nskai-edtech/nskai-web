import SiteChrome from "@/components/SiteChrome";
import palettes from "@/components/palettes.module.css";

export default function AdvancedRdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteChrome palette={palettes.advancedRd}>{children}</SiteChrome>;
}
