import type { ReactNode } from "react";

export type NavItem = {
  name: string;
  description: string;
  href: string;
  /** Product/industry swatch. Mega-menu tiles always keep their own colour,
      regardless of the page they appear on. */
  color: string;
  /** Ink used on top of `color` for the 36px tile. */
  tileInk: string;
  icon: ReactNode;
};

const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.25 } as const;

const Icon = ({ children }: { children: ReactNode }) => (
  <svg width="20" height="20" viewBox="0 0 32 32" {...s}>
    {children}
  </svg>
);

const LIGHT = "#F6F1EF";
const DARK = "#16100F";

export const products: NavItem[] = [
  {
    name: "Zerra",
    description: "Adaptive upskilling and assessment.",
    href: "/products/zerra",
    color: "#1E3A8A",
    tileInk: LIGHT,
    icon: (
      <Icon>
        <rect x="3" y="3" width="26" height="26" />
        <rect x="10" y="10" width="12" height="12" />
        <rect x="14" y="14" width="4" height="4" fill="currentColor" stroke="none" />
      </Icon>
    ),
  },
  {
    name: "Leri",
    description: "Agents that resolve, not just reply.",
    href: "/products/leri",
    color: "#7A4A28",
    tileInk: LIGHT,
    icon: (
      <Icon>
        <polygon points="16,2 25,6 29,16 25,26 16,30 7,26 3,16 7,6" />
        <circle cx="16" cy="16" r="2.5" fill="currentColor" stroke="none" />
      </Icon>
    ),
  },
  {
    name: "Enterprise AI",
    description: "Systems built inside your organisation.",
    href: "/products/enterprise-ai",
    color: "#E8A317",
    tileInk: DARK,
    icon: (
      <Icon>
        <line x1="4" y1="10" x2="28" y2="10" />
        <line x1="4" y1="16" x2="28" y2="16" />
        <line x1="4" y1="22" x2="28" y2="22" />
        <line x1="10" y1="4" x2="10" y2="28" />
        <line x1="16" y1="4" x2="16" y2="28" />
        <line x1="22" y1="4" x2="22" y2="28" />
      </Icon>
    ),
  },
  {
    name: "Data Annotation",
    description: "Human-labelled data, written to spec.",
    href: "/products/data-annotation",
    color: "#0E7C66",
    tileInk: LIGHT,
    icon: (
      <Icon>
        <path d="M3 23a13 13 0 0 1 26 0" />
        <line x1="3" y1="23" x2="29" y2="23" />
        <circle cx="11" cy="19" r="1.6" fill="currentColor" stroke="none" />
        <circle cx="21" cy="19" r="1.6" />
      </Icon>
    ),
  },
  {
    name: "Rudani",
    description: "Questions answered from your own documents.",
    href: "/products/rudani",
    color: "#3A3A38",
    tileInk: LIGHT,
    icon: (
      <Icon>
        <circle cx="14" cy="14" r="9" />
        <line x1="20.5" y1="20.5" x2="28" y2="28" />
        <line x1="9" y1="12" x2="19" y2="12" />
        <line x1="9" y1="16" x2="16" y2="16" />
      </Icon>
    ),
  },
  {
    name: "Advanced R&D",
    description: "Joint research on open questions.",
    href: "/products/advanced-rd",
    color: "#E01A0D",
    tileInk: LIGHT,
    icon: (
      <Icon>
        <path d="M3 16C3 6 13 6 16 16C19 26 29 26 29 16C29 6 19 6 16 16C13 26 3 26 3 16Z" />
      </Icon>
    ),
  },
];

export const industries: NavItem[] = [
  {
    name: "Financial services",
    description: "Reconciliation and resolution on the ledger.",
    href: "/solutions/financial-services",
    color: "#1E3A8A",
    tileInk: LIGHT,
    icon: (
      <Icon>
        <rect x="4" y="5" width="24" height="22" />
        <line x1="4" y1="12" x2="28" y2="12" />
        <line x1="16" y1="12" x2="16" y2="27" />
      </Icon>
    ),
  },
  {
    name: "Telecommunications",
    description: "Support in the customer’s own language.",
    href: "/solutions/telecommunications",
    color: "#E01A0D",
    tileInk: LIGHT,
    icon: (
      <Icon>
        <path d="M16 26V12" />
        <path d="M8 20a11 11 0 0 1 16 0" />
        <path d="M4 15a17 17 0 0 1 24 0" />
        <circle cx="16" cy="27" r="1.8" fill="currentColor" stroke="none" />
      </Icon>
    ),
  },
  {
    name: "Public sector",
    description: "Retrieval over records that cannot leave.",
    href: "/solutions/public-sector",
    color: "#0E7C66",
    tileInk: LIGHT,
    icon: (
      <Icon>
        <polygon points="16,4 29,11 3,11" />
        <line x1="7" y1="11" x2="7" y2="25" />
        <line x1="16" y1="11" x2="16" y2="25" />
        <line x1="25" y1="11" x2="25" y2="25" />
        <line x1="3" y1="27" x2="29" y2="27" />
      </Icon>
    ),
  },
  {
    name: "Retail and commerce",
    description: "Refund decisions in one exchange.",
    href: "/solutions/retail-and-commerce",
    color: "#E8A317",
    tileInk: DARK,
    icon: (
      <Icon>
        <rect x="6" y="11" width="20" height="16" />
        <path d="M11 11a5 5 0 0 1 10 0" />
      </Icon>
    ),
  },
  {
    name: "Health and insurance",
    description: "Clinical labelling with agreement rates.",
    href: "/solutions/health-and-insurance",
    color: "#8E1108",
    tileInk: LIGHT,
    icon: (
      <Icon>
        <line x1="16" y1="6" x2="16" y2="26" />
        <line x1="6" y1="16" x2="26" y2="16" />
      </Icon>
    ),
  },
  {
    name: "Energy and industry",
    description: "Models quantized for hardware on site.",
    href: "/solutions/energy-and-industry",
    color: "#7A4A28",
    tileInk: LIGHT,
    icon: (
      <Icon>
        <polygon points="18,3 8,18 15,18 13,29 24,13 17,13" />
      </Icon>
    ),
  },
];

export const company: NavItem[] = [
  {
    name: "About us",
    description: "Who we are and how we work.",
    href: "/company",
    color: "#FF5A1F",
    tileInk: LIGHT,
    icon: (
      <Icon>
        <circle cx="12" cy="12" r="4" />
        <circle cx="22" cy="13" r="3" />
        <path d="M5 26a7 7 0 0 1 14 0" />
        <path d="M20 26a5 5 0 0 1 8-4" />
      </Icon>
    ),
  },
  {
    // The prototype points Careers at the Company page too; kept as designed
    // until a Careers route exists.
    name: "Careers",
    description: "Open roles in Lagos and London.",
    href: "/company",
    color: "#1E3A8A",
    tileInk: LIGHT,
    icon: (
      <Icon>
        <circle cx="16" cy="13" r="8" />
        <polyline points="11,20 9,29 16,25 23,29 21,20" />
      </Icon>
    ),
  },
];

export const DISCORD_URL = "https://discord.gg/SxDTz45GRk";
export const CONTACT_EMAIL = "contact@nskai.org";
