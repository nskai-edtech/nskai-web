import SiteChrome from "@/components/SiteChrome";
import palettes from "@/components/palettes.module.css";

export default function EnterpriseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteChrome palette={palettes.enterprise}>{children}</SiteChrome>;
}
