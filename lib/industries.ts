/** Content for the six industry plates. The page furniture is identical across
    them; only the copy, the plate number and the motion piece change. */

export type Plate = {
  slug: string;
  /** As it reads in the breadcrumb and the "other plates" list. */
  name: string;
  /** Roman numeral and catalogue code, printed in the corner of every plate. */
  numeral: string;
  code: string;
  title: string;
  lead: string;
  cta: string;
  hero: { file: string; caption: string };
  /** Two paragraphs, side by side under "The problem". */
  problem: [string, string];
  applies: { n: string; title: string; body: string }[];
  /** The second photograph, where the design uses one. */
  detail?: { file: string; caption: string };
  appliesNote: string;
  worked: { label: string; value: string }[];
  compliance: string[];
  deployment: { when: string; what: string }[];
  deployedHere: { name: string; href: string; note: string }[];
};

const WORKED_NOTE =
  "Figures from one deployment, quoted with the client’s permission. Yours will differ.";

export const workedNote = WORKED_NOTE;

export const plates: Plate[] = [
  {
    slug: "financial-services",
    name: "Financial services",
    numeral: "I",
    code: "NSK·SOL·01",
    title: "Reconciliation",
    lead: "Two ledgers that ought to agree, and the small number of lines that do not.",
    cta: "Talk to us about financial services",
    hero: {
      file: "fin-plate-hero.jpg",
      caption:
        "Fig. 1 — The floor of the New York Stock Exchange, shot with a camera hidden in the photographer’s sleeve. Library of Congress, no known restrictions.",
    },
    problem: [
      "A bank closes the day by hand. Statements arrive in four formats and the core ledger in a fifth, and the differences between them are found by eye.",
      "Most lines pair without argument. The value sits in the handful that do not, and those are the ones the team runs out of time for.",
    ],
    appliesNote: "Three places the same pairing engine is used.",
    applies: [
      {
        n: "01",
        title: "The daily close",
        body: "Statements against the core ledger, pairing first and exceptions after, so the close ends at a known list rather than a deadline.",
      },
      {
        n: "02",
        title: "Payments exceptions",
        body: "Chargebacks, duplicates and failed settlements grouped by cause, with the rule that grouped them on the record.",
      },
      {
        n: "03",
        title: "Reporting packs",
        body: "Regulatory and management figures assembled from source rows, each number traceable back to the entries behind it.",
      },
    ],
    detail: {
      file: "fin-det-1.jpg",
      caption:
        "Fig. 2 — Sweeping the exchange floor after the session. Library of Congress, no known restrictions.",
    },
    worked: [
      { label: "Lines a day", value: "41,800" },
      { label: "Paired without review", value: "96.2%" },
      { label: "Exceptions surfaced", value: "1,580" },
      { label: "Median time to close", value: "1h 10m, from 6h 40m" },
      { label: "Value held in suspense", value: "−38%" },
    ],
    compliance: [
      "Central-bank cybersecurity frameworks in each market, with PCI DSS scope held to the tokenised path.",
      "Every pairing carries the rule that produced it and the operator who accepted it.",
      "Records retained seven years; model output is advisory until an operator signs.",
    ],
    deployment: [
      { when: "Week 1–2", what: "Read-only connection to statements and the core ledger" },
      { when: "Week 3–6", what: "Pairing rules learned from a year of resolved breaks" },
      { when: "Week 7–8", what: "Shadow running beside the manual close" },
      { when: "Week 9", what: "Operators accept or reject, each pairing explained" },
    ],
    deployedHere: [
      { name: "Leri", href: "/products/leri", note: "Agents that resolve the break, not describe it" },
      { name: "Rudani", href: "/products/rudani", note: "Answers over policy, contracts and correspondence" },
    ],
  },
  {
    slug: "telecommunications",
    name: "Telecommunications",
    numeral: "II",
    code: "NSK·SOL·02",
    title: "The subscriber’s own language",
    lead: "Support that answers in the language the question was asked in.",
    cta: "Talk to us about telecommunications",
    hero: {
      file: "tel-plate-hero.jpg",
      caption:
        "Fig. 1 — Women working a Bell System telephone switchboard. National Archives, public domain.",
    },
    problem: [
      "An operator with tens of millions of subscribers takes most of its contacts in one language, and loses the rest. Callers who use a second or third language wait longer, repeat themselves more, and abandon more often.",
      "The material needed to fix it is already in the call archive. Nobody had labelled it.",
    ],
    appliesNote: "Three places the same language stack is used.",
    applies: [
      {
        n: "01",
        title: "First-line support",
        body: "Tariffs, balances and device questions answered in the language the subscriber used, on the channel they chose.",
      },
      {
        n: "02",
        title: "Fault triage",
        body: "Symptoms matched against known faults and network events before an engineer is dispatched.",
      },
      {
        n: "03",
        title: "Agent assist",
        body: "Every live conversation drafted for the agent, who edits and sends, with the source document beside it.",
      },
    ],
    worked: [
      { label: "Contacts a month", value: "2.4M" },
      { label: "Handled without an agent", value: "61%" },
      { label: "First-contact resolution", value: "+18 points" },
      { label: "Languages in production", value: "5" },
      { label: "Average handling time", value: "−2m 40s" },
    ],
    compliance: [
      "Breach notification within the window the regulator sets, with consent recorded per channel.",
      "Voice retained ninety days. No transcript leaves the operator’s own cloud or region.",
      "Language coverage is stated per intent, so a gap is visible rather than guessed at.",
    ],
    deployment: [
      { when: "Week 1–3", what: "Archive sampled and labelled by native speakers" },
      { when: "Week 4–8", what: "Retrieval built over tariff, device and policy documents" },
      { when: "Week 9–12", what: "Agent assist first, automation second" },
      { when: "Quarter 2", what: "Voice added in the two largest languages" },
    ],
    deployedHere: [
      { name: "Leri", href: "/products/leri", note: "Contact handled end to end, in five languages" },
      { name: "Data Annotation", href: "/products/data-annotation", note: "The archive labelled to a written spec" },
      { name: "Zerra", href: "/products/zerra", note: "Agents assessed on the calls they actually take" },
    ],
  },
  {
    slug: "public-sector",
    name: "Public sector",
    numeral: "III",
    code: "NSK·SOL·03",
    title: "Records that cannot leave",
    lead: "Search across an archive that is not permitted to move.",
    cta: "Talk to us about public sector",
    hero: {
      file: "pub-plate-hero.jpg",
      caption:
        "Fig. 1 — Research clerks at work on a government archive. Library of Congress, public domain.",
    },
    problem: [
      "A ministry holds forty years of files: scanned, unindexed, and legally resident. A single freedom-of-information request costs a fortnight of somebody’s time.",
      "The same fifty documents are found again from scratch each time, by a different officer.",
    ],
    appliesNote: "Three places the same index is used.",
    applies: [
      {
        n: "01",
        title: "Information requests",
        body: "A request answered from the archive itself, with the page cited and the officer who ran it named.",
      },
      {
        n: "02",
        title: "Case files and precedent",
        body: "Earlier decisions found by their substance, so a new one is taken against what was decided before.",
      },
      {
        n: "03",
        title: "Procurement records",
        body: "Contracts, amendments and correspondence read together, on hardware that never leaves the premises.",
      },
    ],
    detail: {
      file: "pub-det-1.jpg",
      caption: "Fig. 2 — Clerks at typewriters in a government office. Nationaal Archief, public domain.",
    },
    worked: [
      { label: "Documents indexed", value: "41.6M" },
      { label: "Median answer", value: "1.9s" },
      { label: "FOI turnaround", value: "2 days, from 14" },
      { label: "Files that left the building", value: "0" },
      { label: "Answers refused for want of evidence", value: "logged, not hidden" },
    ],
    compliance: [
      "Data resident on ministry hardware, with an air-gapped index.",
      "Every query attributable to a named officer, and every citation to a page.",
      "Retention and disposal schedules are honoured by the index itself.",
    ],
    deployment: [
      { when: "Month 1", what: "Air-gapped install and a scan pipeline for the paper backlog" },
      { when: "Month 2", what: "Index built department by department" },
      { when: "Month 3", what: "Officers query directly, citations point at the page" },
      { when: "Month 4", what: "Disposal schedule wired into the index" },
    ],
    deployedHere: [
      { name: "Rudani", href: "/products/rudani", note: "The answer, with the paragraph behind it" },
      { name: "Enterprise AI", href: "/products/enterprise-ai", note: "Built and operated inside the ministry" },
    ],
  },
  {
    slug: "retail-and-commerce",
    name: "Retail and commerce",
    numeral: "IV",
    code: "NSK·SOL·04",
    title: "The refund decided once",
    lead: "A decision reached in one exchange, with the reason written down.",
    cta: "Talk to us about retail and commerce",
    hero: {
      file: "ret-plate-hero.jpg",
      caption:
        "Fig. 1 — Interior of the Katz drug store, Kansas City. National Archives, public domain.",
    },
    problem: [
      "Returns are decided three times: by a bot that cannot see the order, an agent who cannot see the policy, and a supervisor who cannot see either.",
      "Customers tell the story again at every step, and the eventual answer is inconsistent enough to be worth arguing with.",
    ],
    appliesNote: "Three places the same decision path is used.",
    applies: [
      {
        n: "01",
        title: "Returns and refunds",
        body: "One exchange, one decision, and the policy clause that produced it written into the record.",
      },
      {
        n: "02",
        title: "Order exceptions",
        body: "Late, short and damaged deliveries resolved against the carrier and payment systems rather than described back to the customer.",
      },
      {
        n: "03",
        title: "Policy questions",
        body: "Staff and customers get the same reading of the same policy, with its version attached.",
      },
    ],
    detail: {
      file: "ret-det-1.png",
      caption: "Fig. 2 — Joseph Street, Lagos: shopfronts and the Royal Cinema. Public domain.",
    },
    worked: [
      { label: "Cases a week", value: "96,000" },
      { label: "Decided in one exchange", value: "78%" },
      { label: "Overturned on appeal", value: "2.1%" },
      { label: "Cost per case", value: "−44%" },
      { label: "Policy exceptions", value: "escalated, never guessed" },
    ],
    compliance: [
      "Consumer protection rules applied as written policy, not as model judgement.",
      "Every refusal carries a reason code the customer can read.",
      "Decisions reviewable for six years, with the policy version attached.",
    ],
    deployment: [
      { when: "Week 1–2", what: "Policy written as rules the system can cite" },
      { when: "Week 3–5", what: "Order, payment and logistics systems connected" },
      { when: "Week 6–8", what: "Live on one category, supervised" },
      { when: "Week 9", what: "Rolled out by category, appeal rate watched" },
    ],
    deployedHere: [
      { name: "Leri", href: "/products/leri", note: "One exchange, one decision, one reason" },
      { name: "Zerra", href: "/products/zerra", note: "Supervisors trained on the cases that escalate" },
    ],
  },
  {
    slug: "health-and-insurance",
    name: "Health and insurance",
    numeral: "V",
    code: "NSK·SOL·05",
    title: "Notes, labelled and redacted",
    lead: "Clinical text made usable without being made public.",
    cta: "Talk to us about health and insurance",
    hero: {
      file: "hea-plate-hero.jpg",
      caption: "Fig. 1 — A ward at the Elliot Community Hospital. Public domain.",
    },
    problem: [
      "The note holds the finding and the identity in the same sentence. Every research request stalls on that fact.",
      "So the notes stay unread, and the labelling that would make them useful never happens.",
    ],
    appliesNote: "Three places the same consent register is used.",
    applies: [
      {
        n: "01",
        title: "Cohort building",
        body: "A research cohort assembled from notes under the consent tier that covers it, and no wider.",
      },
      {
        n: "02",
        title: "Coding and labelling",
        body: "Diagnoses and procedures labelled to a schema clinicians signed, with agreement rates published.",
      },
      {
        n: "03",
        title: "Claims review",
        body: "A decision with the note it rests on quoted, so the reviewer reads evidence rather than a score.",
      },
    ],
    detail: {
      file: "hea-det-1.png",
      caption: "Fig. 2 — Mothers waiting at a child clinic centre in Lagos. Public domain.",
    },
    worked: [
      { label: "Notes processed", value: "4.18M" },
      { label: "Inter-annotator agreement", value: "κ 0.91" },
      { label: "Identifiers held in audited sample", value: "100%" },
      { label: "Cohort build", value: "3 days, from 6 weeks" },
      { label: "Successful re-identification in red team", value: "0" },
    ],
    compliance: [
      "Consent recorded per tier and per purpose, and enforced at read time.",
      "Identifiers separated before any model reads the text.",
      "Audit trail per field and per viewer; clinical sign-off on every label schema.",
    ],
    deployment: [
      { when: "Week 1–4", what: "Schema agreed with clinicians, pilot double-labelled" },
      { when: "Week 5–8", what: "Redaction tiers implemented against the consent register" },
      { when: "Week 9–12", what: "Cohort queries opened to research" },
      { when: "Ongoing", what: "An adjudication panel reviews contested labels" },
    ],
    deployedHere: [
      { name: "Data Annotation", href: "/products/data-annotation", note: "Labels with agreement rates attached" },
      { name: "Rudani", href: "/products/rudani", note: "Cohort questions answered with citations" },
      { name: "Advanced R&D", href: "/products/advanced-rd", note: "Re-identification risk studied and published" },
    ],
  },
  {
    slug: "energy-and-industry",
    name: "Energy and industry",
    numeral: "VI",
    code: "NSK·SOL·06",
    title: "Inference at the wellhead",
    lead: "Models sized for the hardware that is actually on site.",
    cta: "Talk to us about energy and industry",
    hero: {
      file: "ene-plate-hero.jpg",
      caption:
        "Fig. 1 — Power house mechanic working on a steam pump, 1920. Lewis Hine, public domain.",
    },
    problem: [
      "The site has a gateway with eight gigabytes of memory, intermittent backhaul, and a standing rule against sending video off the plant.",
      "The useful model was trained for none of that. What matters is how much precision can be given up before it stops being right.",
    ],
    appliesNote: "Three places the same precision budget is used.",
    applies: [
      {
        n: "01",
        title: "Inspection footage",
        body: "Read at the gateway, with counts and alarms crossing the boundary and the video staying on the plant.",
      },
      {
        n: "02",
        title: "Maintenance history",
        body: "Work orders, manuals and shift logs searched together, so a fault is met with what was done last time.",
      },
      {
        n: "03",
        title: "Shift handover",
        body: "The log written from the shift's own records, for an operator to correct and sign.",
      },
    ],
    detail: {
      file: "ene-det-1.jpg",
      caption:
        "Fig. 2 — Mechanic at a steam pump in an electric power house, c. 1921. Public domain.",
    },
    worked: [
      { label: "Model", value: "7B at 4-bit, 3.5 GB" },
      { label: "Throughput", value: "3.2× at equal accuracy" },
      { label: "Error delta at 4-bit", value: "+0.4 points" },
      { label: "Runs on", value: "gateway, handheld, control room" },
      { label: "Video sent off site", value: "none" },
    ],
    compliance: [
      "Site safety cases updated for advisory-only output. No model sits in the control loop.",
      "Footage stays on the plant; only counts and alarms cross the boundary.",
      "The alarm remains the operator’s decision, and is recorded as such.",
    ],
    deployment: [
      { when: "Week 1–2", what: "Hardware audit, and a precision budget agreed" },
      { when: "Week 3–6", what: "Quantized candidates evaluated on site data" },
      { when: "Week 7–10", what: "Deployed to the gateway, shadowed by operators" },
      { when: "Quarter 2", what: "Written up as a precision-budget note" },
    ],
    deployedHere: [
      { name: "Advanced R&D", href: "/products/advanced-rd", note: "The precision question answered on your data" },
      { name: "Enterprise AI", href: "/products/enterprise-ai", note: "Operated on the plant, with your runbooks" },
    ],
  },
];

export const plateBySlug = (slug: string) => plates.find((p) => p.slug === slug)!;
