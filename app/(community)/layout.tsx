import SiteChrome from "@/components/SiteChrome";
import palettes from "@/components/palettes.module.css";

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteChrome palette={palettes.community}>{children}</SiteChrome>;
}
