import type { ReactNode } from "react";
import type { FigureKind } from "@/components/home/figures";

const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.25 } as const;

/** The square tiles under "What we do". The first five open a product page;
    the last three describe the surrounding work and are not links. */
export type CapabilityTile = {
  index: string;
  title: string;
  caption: string;
  href?: string;
  /** Border, icon and rule colour on hover. */
  accent: string;
  icon: ReactNode;
};

const Tile = ({ children }: { children: ReactNode }) => (
  <svg width="56" height="56" viewBox="0 0 64 64" aria-hidden="true" {...s}>
    {children}
  </svg>
);

export const capabilities: CapabilityTile[] = [
  {
    index: "01",
    title: "Upskill",
    caption: "Zerra",
    href: "/products/zerra",
    accent: "#E01A0D",
    icon: (
      <Tile>
        <rect x="4" y="4" width="56" height="56" />
        <rect x="18" y="18" width="28" height="28" />
        <rect x="27" y="27" width="10" height="10" fill="currentColor" stroke="none" />
      </Tile>
    ),
  },
  {
    index: "02",
    title: "Resolve",
    caption: "Leri",
    href: "/products/leri",
    accent: "#8E1108",
    icon: (
      <Tile>
        <polygon points="32,5 51,13 59,32 51,51 32,59 13,51 5,32 13,13" />
        <line x1="13" y1="13" x2="51" y2="51" />
        <line x1="51" y1="13" x2="13" y2="51" />
        <circle cx="32" cy="32" r="5" fill="currentColor" stroke="none" />
      </Tile>
    ),
  },
  {
    index: "03",
    title: "Label",
    caption: "Data Annotation",
    href: "/products/data-annotation",
    accent: "#F26B5E",
    icon: (
      <Tile>
        <path d="M4 46a28 28 0 0 1 56 0" />
        <line x1="4" y1="46" x2="60" y2="46" />
        <line x1="32" y1="18" x2="32" y2="46" />
        <circle cx="20" cy="38" r="3" fill="currentColor" stroke="none" />
        <circle cx="44" cy="38" r="3" />
      </Tile>
    ),
  },
  {
    index: "04",
    title: "Deploy",
    caption: "Enterprise AI",
    href: "/products/enterprise-ai",
    accent: "#E01A0D",
    icon: (
      <Tile>
        <line x1="8" y1="18" x2="56" y2="18" />
        <line x1="8" y1="32" x2="56" y2="32" />
        <line x1="8" y1="46" x2="56" y2="46" />
        <line x1="18" y1="8" x2="18" y2="56" />
        <line x1="32" y1="8" x2="32" y2="56" />
        <line x1="46" y1="8" x2="46" y2="56" />
        <rect x="29" y="29" width="6" height="6" fill="currentColor" stroke="none" />
      </Tile>
    ),
  },
  {
    index: "05",
    title: "Discover",
    caption: "Advanced R&D",
    href: "/products/advanced-rd",
    accent: "#8E1108",
    icon: (
      <Tile>
        <path d="M6 32C6 12 26 12 32 32C38 52 58 52 58 32C58 12 38 12 32 32C26 52 6 52 6 32Z" />
        <path
          d="M16 32C16 22 27 22 32 32C37 42 48 42 48 32C48 22 37 22 32 32C27 42 16 42 16 32Z"
          strokeOpacity="0.45"
        />
        <circle cx="32" cy="32" r="3.5" fill="currentColor" stroke="none" />
      </Tile>
    ),
  },
  {
    index: "06",
    title: "Host",
    caption: "Your cloud, or ours",
    accent: "#5C4F4C",
    icon: (
      <Tile>
        <path d="M8 34a24 24 0 0 1 48 0" />
        <path d="M20 34a12 12 0 0 1 24 0" fill="currentColor" stroke="none" />
        <line x1="8" y1="34" x2="56" y2="34" />
        <line x1="14" y1="48" x2="50" y2="48" />
      </Tile>
    ),
  },
  {
    index: "07",
    title: "Measure",
    caption: "Evaluation and reporting",
    accent: "#5C4F4C",
    icon: (
      <Tile>
        <line x1="6" y1="56" x2="58" y2="56" />
        <rect x="12" y="40" width="10" height="16" />
        <rect x="27" y="28" width="10" height="28" fill="currentColor" stroke="none" />
        <rect x="42" y="14" width="10" height="42" />
      </Tile>
    ),
  },
  {
    index: "08",
    title: "Integrate",
    caption: "Into the stack you have",
    accent: "#5C4F4C",
    icon: (
      <Tile>
        <rect x="6" y="18" width="28" height="28" />
        <circle cx="42" cy="32" r="14" />
        <path d="M28 18h6v28h-6z" fill="currentColor" stroke="none" />
      </Tile>
    ),
  },
];

/** The five product blocks, in the order the rail steps through them. */
export type ProductBlock = {
  id: string;
  title: string;
  lead: string;
  cta: string;
  href: string;
  figure: FigureKind;
  /** Plate colour behind the figure. */
  plate: string;
  /** The idea the figure draws, written out. */
  formula: ReactNode;
  chips: string[];
  /** Colour of this block's tile on the rail. */
  railAccent: string;
};

export const productBlocks: ProductBlock[] = [
  {
    id: "zerra",
    title: "Enterprise AI adoption.",
    lead: "Train your teams on the systems they will actually run, taught by the engineers who build them.",
    cta: "Discover Zerra",
    href: "/products/zerra",
    figure: "quadtree",
    plate: "#FFD9D4",
    formula: (
      <>
        s &rarr; s / 2<sup>d</sup>
      </>
    ),
    chips: [
      "Cohorts and embedded programmes",
      "Curriculum built on your stack",
      "Assessment on your own tasks",
      "Named engineers on support",
    ],
    railAccent: "#FF5A1F",
  },
  {
    id: "leri",
    title: "Customer service that resolves.",
    lead: "Agents that reconcile a transaction across your core systems, then take the action that closes the case.",
    cta: "Discover Leri",
    href: "/products/leri",
    figure: "chords",
    plate: "#EBE4E1",
    formula: <>i &#8614; i&middot;k mod n</>,
    chips: [
      "Reconciles before it replies",
      "Chat, email, voice and messaging",
      "Wired to core systems and ticketing",
      "Full audit trail on every action",
    ],
    railAccent: "#E01A0D",
  },
  {
    id: "annotation",
    title: "Human-labelled data.",
    lead: "Domain specialists labelling to a written spec, with disputes adjudicated and agreement reported per batch.",
    cta: "Discover Data Annotation",
    href: "/products/data-annotation",
    figure: "voronoi",
    plate: "#FFD9D4",
    formula: (
      <>
        argmin<sub>i</sub> &#8214;x &minus; c<sub>i</sub>&#8214;
      </>
    ),
    chips: [
      "Text, speech, documents and images",
      "Specialists screened on your task",
      "Multi-pass review and adjudication",
      "Agreement rate on every batch",
    ],
    railAccent: "#1E3A8A",
  },
  {
    id: "enterprise",
    title: "AI built inside your organisation.",
    lead: "Retrieval over your own records, agents wired into your systems, and the infrastructure underneath them.",
    cta: "Discover Enterprise AI",
    href: "/products/enterprise-ai",
    figure: "lattice",
    plate: "#EBE4E1",
    formula: (
      <>
        x + &epsilon;&middot;e<sup>&minus;r&sup2;/2&sigma;&sup2;</sup>
      </>
    ),
    chips: [
      "Retrieval over your records",
      "Agents with permissions and limits",
      "Self-hosted, your cloud, or operated",
      "Architecture and runbooks handed over",
    ],
    railAccent: "#FFD60A",
  },
  {
    id: "rnd",
    title: "Advanced R&D.",
    lead: "Joint research on questions your industry has not answered yet, run against your data and published where possible.",
    cta: "Discover Advanced R&D",
    href: "/products/advanced-rd",
    figure: "lissajous",
    plate: "#FFD9D4",
    formula: <>x = sin(a&theta; + &delta;), y = sin(b&theta;)</>,
    chips: [
      "Quantization and precision budgets",
      "Retrieval on proprietary corpora",
      "Agentic failure analysis",
      "Low-bandwidth and on-device inference",
    ],
    railAccent: "#0E7C66",
  },
];

/** "Our services" — four cards whose detail lines come out on hover. */
export const services = [
  {
    title: "Use case acceleration.",
    accent: "#E8A317",
    lead: "Prioritise high-value use cases and take them to production fast.",
    detail: [
      "Week 1 scoping workshop",
      "A ranked backlog with cost and impact",
      "First use case live in a quarter",
    ],
  },
  {
    title: "Elite AI expertise.",
    accent: "#E85B10",
    lead: "A cross-functional team that takes initiatives from kickoff to production at scale.",
    detail: [
      "Research, data and platform engineers",
      "Named team, not a queue",
      "They stay through production",
    ],
  },
  {
    title: "Deep customisation.",
    accent: "#1E3A8A",
    lead: "Customise and optimise models for your domain, down to the precision budget.",
    detail: [
      "Fine-tuning on your corpus",
      "Quantized to your latency budget",
      "Evaluated on your own tasks",
    ],
  },
  {
    title: "Enterprise activation.",
    accent: "#E01A0D",
    lead: "Deploy AI in your environment, with full control.",
    detail: [
      "Self-hosted, your cloud, or operated",
      "Your keys, logging and access policy",
      "Runbooks handed to your team",
    ],
  },
];

const Plate = ({ children }: { children: ReactNode }) => (
  <svg width="96" height="96" viewBox="0 0 64 64" aria-hidden="true">
    {children}
  </svg>
);

/** The three deployment cards, each flooding in its own colour on hover. */
export const deployments = [
  {
    eyebrow: "Your building",
    title: "Self-hosted",
    body: "Run on your own hardware or in your data centre, air-gapped if you need it. Nothing leaves your walls.",
    bg: "#FF5A1F",
    ink: "#16100F",
    icon: (
      <Plate>
        <rect x="8" y="8" width="48" height="48" {...s} />
        <circle cx="32" cy="32" r="4.5" fill="currentColor" />
      </Plate>
    ),
  },
  {
    eyebrow: "Your perimeter",
    title: "Your cloud",
    body: "Deploy into your VPC and your cloud account, under your keys, your logging and your access policy.",
    bg: "#FFD60A",
    ink: "#16100F",
    icon: (
      <Plate>
        <path d="M8 20V8h12M44 8h12v12M56 44v12H44M20 56H8V44" {...s} />
        <circle cx="32" cy="32" r="4.5" fill="currentColor" />
      </Plate>
    ),
  },
  {
    eyebrow: "Our watch",
    title: "Operated by us",
    body: "We host and operate the deployment, isolated to your organisation, with your data never used to train anything outside it.",
    bg: "#1E3A8A",
    ink: "#F6F1EF",
    icon: (
      <Plate>
        <circle cx="32" cy="32" r="24" {...s} />
        <circle cx="32" cy="32" r="4.5" fill="currentColor" />
      </Plate>
    ),
  },
];

/** The four claims on the strip under the band. */
export const promises = [
  {
    label: "Runs where you need it",
    body: "Cloud, your VPC, or on your own hardware.",
  },
  {
    label: "Connects to your stack",
    body: "Existing ticketing, core systems, data warehouse.",
  },
  {
    label: "Your data stays yours",
    body: "Never used to train models outside your deployment.",
  },
  {
    label: "Experts on site",
    body: "People who have built this before, in the room with your team.",
  },
];
