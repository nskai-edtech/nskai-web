import SiteChrome from "@/components/SiteChrome";
import palettes from "@/components/palettes.module.css";

/** The Udara story page has its own cream-and-gold treatment. */
export default function UdaraLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteChrome palette={palettes.udara}>{children}</SiteChrome>;
}
