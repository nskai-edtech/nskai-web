import SiteChrome from "@/components/SiteChrome";
import palettes from "@/components/palettes.module.css";

export default function AnnotationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteChrome palette={palettes.annotation}>{children}</SiteChrome>;
}
