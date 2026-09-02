/** Four adjudication traces: the item, the three independent passes, the split,
    and the ruling that amended the spec. */
export type Trace = {
  sector: string;
  summary: string;
  item: string;
  scale: string;
  quote: string;
  passes: { who: string; label: string; reason: string }[];
  split: string;
  adjudicator: string;
  ruling: string;
  reasoning: string;
  amendment: string;
};

export const traces: Trace[] = [
  {
    sector: "Retail banking",
    summary: "A transfer that reversed after value date",
    item: "item 0413 · batch NB-24",
    scale: "12,480 items · 3 passes",
    quote:
      "TRF/REV NIP 08:14 — debit posted, credit not received, value date T+2",
    passes: [
      {
        who: "ANNOTATOR A-07",
        label: "Failed",
        reason: "Credit never landed, so the transfer did not complete.",
      },
      {
        who: "ANNOTATOR A-11",
        label: "Reversed",
        reason: "The reversal flag is present on the record.",
      },
      {
        who: "ANNOTATOR A-02",
        label: "Pending",
        reason: "Value date has not passed; the ledger can still settle.",
      },
    ],
    split: "1 · 1 · 1 — no majority, sent to adjudication",
    adjudicator: "Ruling — adjudicator O. Bassey, payments",
    ruling: "Unresolved",
    reasoning:
      "A reversal flag records an instruction, not an outcome. Until the ledger settles at value date the customer is still out of funds, and a model trained on “reversed” will close the ticket early.",
    amendment:
      "Spec amended §4.2 — settlement state, not the flag, decides the label. 214 earlier items re-labelled under the amendment.",
  },
  {
    sector: "Telecommunications",
    summary: "A support call that switches language mid-sentence",
    item: "item 1187 · batch TC-09",
    scale: "44,100 utterances · 3 passes",
    quote:
      "“I don tire o — the data no dey work since morning, abeg just tell me when e go work.”",
    passes: [
      {
        who: "ANNOTATOR A-19",
        label: "Complaint",
        reason: "Frustration is explicit and the service is down.",
      },
      {
        who: "ANNOTATOR A-04",
        label: "Complaint",
        reason: "Outage reported before any question is asked.",
      },
      {
        who: "ANNOTATOR A-23",
        label: "Enquiry",
        reason: "The request itself is a question about timing.",
      },
    ],
    split: "2 · 1 — majority held, ruling still recorded",
    adjudicator: "Ruling — adjudicator A. Yakubu, speech",
    ruling: "Complaint + ETA",
    reasoning:
      "The utterance carries two intents and the single-label scheme could not hold both. Pidgin markers of frustration were being read as filler by annotators working from an English-only guideline.",
    amendment:
      "Scheme amended — secondary intent allowed. Pidgin and Yoruba sentiment markers added to the guideline with worked examples.",
  },
  {
    sector: "Health",
    summary: "A triage note with an abbreviation the spec missed",
    item: "item 0061 · batch HL-03",
    scale: "8,900 notes · 3 passes · on-site",
    quote: "pt c/o chest tightness ×2/7, no SOB, BP 148/95, for r/v",
    passes: [
      {
        who: "ANNOTATOR A-31",
        label: "Urgent",
        reason: "Chest symptoms with raised blood pressure.",
      },
      {
        who: "ANNOTATOR A-16",
        label: "Routine",
        reason: "Two days, no shortness of breath, review booked.",
      },
      {
        who: "ANNOTATOR A-16",
        label: "Routine",
        reason: "Second pass agreed after re-reading the guideline.",
      },
    ],
    split: "Escalated by clinician review, not by count",
    adjudicator: "Ruling — adjudicator Dr I. Nwosu, clinical",
    ruling: "Urgent",
    reasoning:
      "Cost of error is not symmetric here. A missed urgent case is not the same mistake as an over-triaged routine one, and the label set has to be read that way.",
    amendment:
      "Spec amended — chest symptoms with any abnormal vital sign default to urgent. Non-clinical annotators are no longer qualified for this class.",
  },
  {
    sector: "Energy",
    summary: "A meter photograph where one digit is unreadable",
    item: "item 2298 · batch EN-11",
    scale: "61,300 images · 3 passes",
    quote:
      "meter reading — 0 4 8 [?] 2 · glare across the fourth wheel, dusk capture",
    passes: [
      {
        who: "ANNOTATOR A-08",
        label: "04872",
        reason: "Reads the partial stroke as a seven.",
      },
      {
        who: "ANNOTATOR A-27",
        label: "04812",
        reason: "Reads the same stroke as a one.",
      },
      {
        who: "ANNOTATOR A-12",
        label: "Unreadable",
        reason: "Glare covers the wheel; will not guess.",
      },
    ],
    split: "1 · 1 · 1 — no majority, sent to adjudication",
    adjudicator: "Ruling — adjudicator K. Mensah, vision",
    ruling: "Unreadable",
    reasoning:
      "An invented digit is worse than a gap. The abstain class exists so the model learns to hand the capture back rather than bill against a guess.",
    amendment:
      "Capture guidance returned to the field team — 1,900 dusk images re-shot rather than labelled.",
  },
];
