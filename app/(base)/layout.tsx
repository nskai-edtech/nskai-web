import SiteChrome from "@/components/SiteChrome";

/** The paper pages: homepage, solutions, company, foundation, contact. They use
    the base tokens, so no palette class is needed. */
export default function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteChrome>{children}</SiteChrome>;
}
