/** Three worked questions. `[n]` markers in the answer become citation chips
    that thread back to source card n. */
export type Question = {
  label: string;
  query: string;
  sources: { n: number; domain: string; title: string }[];
  answer: string;
};

export const questions: Question[] = [
  {
    label: "What changed in the data protection rules this year?",
    query: "What changed in the data protection rules this year?",
    sources: [
      { n: 1, domain: "ndpc.gov.ng", title: "Circular 04/2026, breach notification" },
      { n: 2, domain: "gazette.gov.ng", title: "Federal Gazette No. 118, section 12" },
      { n: 3, domain: "ndpc.gov.ng", title: "Adequacy list, March 2026" },
      { n: 4, domain: "internal", title: "Legal memo, 14 April" },
    ],
    answer:
      "The breach notification window is now 72 hours from discovery[1], and any controller holding more than 50,000 records must name a data protection officer[2]. Cross-border transfers still clear through the adequacy list published in March[3]. Retention limits are unchanged, and your standing policy already meets the new bar[4].",
  },
  {
    label: "Which suppliers are exposed to the port strike?",
    query: "Which suppliers are exposed to the port strike?",
    sources: [
      { n: 1, domain: "portauthority.gov", title: "Berth closure notice, 09:40" },
      { n: 2, domain: "internal", title: "Supplier register, ERP export" },
      { n: 3, domain: "status.freight.co", title: "Vessel delays, live feed" },
      { n: 4, domain: "internal", title: "Contract terms, force majeure" },
    ],
    answer:
      "Eleven suppliers route through the affected port and four have shipments at berth today[1][2]. Two of those four carry single-source components with no alternate port on file[2]. Freight partners are quoting six to nine days of delay[3], which sits inside the force majeure window in nine of the eleven contracts[4].",
  },
  {
    label: "Summarise every note that mentions a dosage change.",
    query: "Summarise every note that mentions a dosage change.",
    sources: [
      { n: 1, domain: "internal", title: "Clinical notes export, 4,182 records" },
      { n: 2, domain: "internal", title: "Prescribing policy, version 6" },
      { n: 3, domain: "bnf.nice.org.uk", title: "Titration guidance" },
    ],
    answer:
      "Two hundred and six notes record a dosage change in the period, most of them titrations of the same three drugs[1]. Forty-one changes were made outside the review interval the policy sets[2]. Nine notes describe a reduction the titration guidance would call abrupt[3].",
  },
];

export type Token = { w: string; src?: number };

/** Split an answer into words plus citation markers. */
export function tokenize(text: string): Token[] {
  const out: Token[] = [];
  const re = /\[(\d)\]|([^\s[]+\s*)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m[1]) {
      // The marker hugs the word before it, so drop that word's trailing space.
      const prev = out[out.length - 1];
      if (prev && !prev.src) prev.w = prev.w.replace(/\s+$/, "");
      out.push({ w: m[1], src: parseInt(m[1], 10) });
    } else {
      out.push({ w: m[2] });
    }
  }
  return out;
}
