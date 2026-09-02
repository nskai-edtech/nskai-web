import SiteChrome from "@/components/SiteChrome";
import palettes from "@/components/palettes.module.css";

export default function RudaniLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteChrome palette={palettes.rudani}>{children}</SiteChrome>;
}
