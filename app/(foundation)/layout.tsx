import SiteChrome from "@/components/SiteChrome";
import palettes from "@/components/palettes.module.css";

/** The Foundation sets itself apart from the commercial pages: black on white. */
export default function FoundationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteChrome palette={palettes.foundation}>{children}</SiteChrome>;
}
