import SiteChrome from "@/components/SiteChrome";
import palettes from "@/components/palettes.module.css";

export default function BootcampLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteChrome palette={palettes.bootcamp}>{children}</SiteChrome>;
}
