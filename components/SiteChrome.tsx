import type { ReactNode } from "react";
import Footer from "./Footer";
import Header from "./Header";

/** Header, page and footer under one palette.
    Product and industry pages recolour the whole chrome, footer included, so
    the palette class has to sit above the header rather than around the page.
    Each route-group layout picks its palette from `palettes.module.css`. */
export default function SiteChrome({
  palette,
  children,
}: {
  palette?: string;
  children: ReactNode;
}) {
  return (
    <div className={palette}>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
