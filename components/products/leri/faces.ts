/** Leri's eight faces. The dial, the captions and the ledger are three views of
    this one list, so they can never drift apart. */
export type Face = {
  name: string;
  /** Caption body on the scroll stage. */
  body: string;
  /** The machine line under the caption. */
  trace: string;
  /** Ledger columns: what happened, and the detail behind it. */
  event: string;
  detail: string;
  /** This face's tint, darkening around the dial. */
  tint: string;
};

export const faces: Face[] = [
  {
    name: "Intake",
    body: "A request arrives on whatever channel your customers already use. It is turned into a case with an owner, a clock and a state.",
    trace: "case.open(source: whatsapp) → #48211",
    event: "case opened",
    detail: "source recorded, clock started",
    tint: "#E6D3BC",
  },
  {
    name: "Read",
    body: "Intent, entities and the thing actually being asked for. Ambiguity is recorded as ambiguity, not guessed away.",
    trace: "intent: refund · conf 0.94 · missing: order_id",
    event: "intent parsed",
    detail: "entities extracted, gaps named",
    tint: "#D8C0A2",
  },
  {
    name: "Retrieve",
    body: "The record is pulled from your systems, not from the model's memory. Every field it reads is cited in the receipt.",
    trace: "crm.get(order) · ledger.get(txn) · 2 sources",
    event: "record pulled",
    detail: "two systems, both cited",
    tint: "#C9A57E",
  },
  {
    name: "Decide",
    body: "Your policy, expressed as rules the agent cannot argue with. The decision names the clause it came from.",
    trace: "policy R-14 → refund allowed ≤ 30d",
    event: "policy applied",
    detail: "clause R-14, within window",
    tint: "#B08355",
  },
  {
    name: "Act",
    body: "The write happens here. Scoped credentials, one transaction, reversible, and nothing outside the scope it was granted.",
    trace: "POST /refunds · idempotency-key set",
    event: "write committed",
    detail: "one transaction, idempotent",
    tint: "#96613A",
  },
  {
    name: "Verify",
    body: "The agent re-reads the record it just changed. If the world does not match the intent, the case does not close.",
    trace: "assert(balance −= 14200) · pass",
    event: "state re-read",
    detail: "world matches intent",
    tint: "#7A4A28",
  },
  {
    name: "Log",
    body: "One receipt per case: inputs, sources, clause, action, result. Readable by an auditor with no context.",
    trace: "receipt #48211 · 7 events · signed",
    event: "receipt written",
    detail: "seven events, signed",
    tint: "#5C361A",
  },
  {
    name: "Escalate",
    body: "The eighth face is the honest one. When confidence or authority runs out, a person receives the case already worked.",
    trace: "handover · 0 questions re-asked",
    event: "handover ready",
    detail: "only when authority runs out",
    tint: "#40230F",
  },
];

/** Ink that reads on a given face's tint: the last four are dark enough for paper. */
export const inkOn = (i: number) => (i > 3 ? "#F1E9E2" : "#221309");
