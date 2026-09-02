import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import RiseIn from "@/components/RiseIn";
import BenchBoard from "@/components/products/enterprise/BenchBoard";
import RoleFan from "@/components/products/enterprise/RoleFan";
import WeekStrip from "@/components/products/enterprise/WeekStrip";
import styles from "./enterprise.module.css";

export const metadata: Metadata = {
  title: "Enterprise AI",
  description:
    "Engineers who have shipped this work embed with your people, build the thing in your stack, and stay until your team can run it without us.",
};

const models = [
  {
    n: "01",
    dot: "#E8A317",
    name: "Embedded build",
    lead: "A named team joins yours for a fixed engagement and ships the system with you, from assessment to handover.",
    more: "Twelve weeks is typical. One accountable lead, pairing hours written in, and no seats retained afterwards.",
  },
  {
    n: "02",
    dot: "#C08706",
    name: "Managed talent",
    lead: "Our engineers work inside your organisation on your roadmap, and we keep managing them: performance, growth and cover.",
    more: "You direct the work. We hold the line management, the assessment cycle and the bench cover when someone is away.",
  },
  {
    n: "03",
    dot: "#7A5203",
    name: "Call-off projects",
    lead: "Bring us a defined piece of work and we build it, to your interfaces, with the same review standard as an embedded team.",
    more: "Scoped, priced and delivered as a project. Useful when your team is committed elsewhere but the work cannot wait.",
  },
  {
    n: "04",
    dot: "#EBD49B",
    name: "Forward-deployed engineer",
    lead: "One engineer, sitting with your operators, turning what they actually do into working software week by week.",
    more: "Closest to the work of any model. They write in your repositories, sit in your operations reviews, and bring the rest of our team in when the problem grows.",
  },
  {
    n: "05",
    dot: "#9A6604",
    name: "Agents as a service",
    lead: "We run the agents for you: a queue, a policy and a service level, billed on resolved cases rather than seats.",
    more: "Operated by our engineers on your queue, with the receipts and limits visible to you. Bring it in-house whenever you want it.",
  },
];

const keeps = [
  {
    title: "The software",
    body: "In your repositories, under your licences, with no runtime dependency on us and no vendor key in the middle.",
    caption: "Ownership",
    bg: "#E8A317",
    ink: "#191510",
  },
  {
    title: "The judgement",
    body: "Your engineers were in every decision, so they can make the next one without a call to us.",
    caption: "Capability",
    bg: "#C08706",
    ink: "#F7F2EA",
  },
  {
    title: "The record",
    body: "Architecture notes, runbooks, evaluation sets and the reasons behind the choices that look strange later.",
    caption: "Continuity",
    bg: "#7A5203",
    ink: "#F7F2EA",
  },
];

const standards = [
  "Background, right-to-work and reference checks completed before day one",
  "Research and delivery sit on the same team, so decisions are made once",
  "Knowledge transfer to your engineers is contracted, not offered at the end",
  "Replacement within ten business days, briefed from a bench already on the work",
  "One accountable engagement lead, named in the contract",
];

/** Intake to placement, last twelve months. */
const funnel = [
  { label: "Applications reviewed", value: "2,410", width: "100%", bg: "#E8D9B8", ink: "#191510" },
  { label: "Technical assessment", value: "386", width: "74%", bg: "#E3CE9E", ink: "#191510" },
  { label: "Systems interview", value: "92", width: "52%", bg: "#E8A317", ink: "#191510" },
  { label: "Paid trial", value: "41", width: "34%", bg: "#C08706", ink: "#F7F2EA" },
  { label: "Placed", value: "19", width: "22%", bg: "#7A5203", ink: "#F7F2EA" },
];

const figures = [
  ["7.4 yrs", "Median production experience on the bench"],
  ["10 days", "Contracted replacement window, briefed and on the work"],
  ["94%", "Placements extended beyond the initial term"],
  ["Quarterly", "Performance review, shared with your engagement lead"],
];

const rest = [
  { status: "Live", name: "Zerra", href: "/products/zerra" },
  { status: "Private demo", name: "Leri", href: "/products/leri" },
  { status: "Live", name: "Data Annotation", href: "/products/data-annotation" },
  { status: "By engagement", name: "Advanced R&D", href: "/products/advanced-rd" },
];

export default function EnterpriseAiPage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.breadcrumb}>
          <div className={styles.crumbAccent}>Products</div>
          <div className={styles.crumbDot}>&middot;</div>
          <div className={styles.crumbMuted}>Enterprise AI</div>
        </div>

        <div className={styles.heroGrid}>
          <div>
            <h1 className={styles.heroTitle}>Our engineers, inside your team.</h1>
            <p className={styles.heroLead}>
              We do not sell a workshop and leave. Engineers who have shipped this
              work embed with your people, build the thing in your stack, and stay
              until your team can run it without us. The knowledge is the
              deliverable.
            </p>
          </div>
          <RoleFan />
        </div>

        <div className={styles.compare}>
          <div className={styles.compareLeft}>
            <div className={styles.compareLabelMuted}>Consultancy</div>
            <div className={styles.compareTextMuted}>
              A deck, a roadmap, an invoice.
            </div>
          </div>
          <div className={styles.compareRight}>
            <div className={styles.compareLabelAccent}>Embedded engineering</div>
            <div className={styles.compareText}>
              Working software in your repositories, and your engineers who can
              extend it.
            </div>
          </div>
        </div>
      </section>

      <BenchBoard />

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.h2}>
            Twelve weeks, and what lands in each of them.
          </h2>
          <div className={styles.hint}>hover a week</div>
        </div>
        <WeekStrip />
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.h2}>
            Five ways our engineers end up on your problem.
          </h2>
          <div className={styles.hint}>hover a model</div>
        </div>

        <div className={styles.modelGrid}>
          {models.map((model) => (
            <div key={model.n} className={styles.model}>
              <div className={styles.modelTop}>
                <div
                  className={styles.modelDot}
                  style={{ background: model.dot }}
                />
                <div className={styles.modelIndex}>Model {model.n}</div>
              </div>
              <div className={styles.modelName}>{model.name}</div>
              <p className={styles.modelLead}>{model.lead}</p>
              <div className={styles.modelMore}>
                <div className={styles.modelMoreInner}>{model.more}</div>
              </div>
            </div>
          ))}
          <div className={styles.modelNote}>
            Most engagements start as one of these and become another. The
            contract is written to allow that.
          </div>
        </div>

        <div className={styles.staffed}>
          <div className={styles.staffedTitle}>
            Every enterprise product ships with our engineers still on it.
          </div>
          <p className={styles.staffedBody}>
            Anything we build for you stays staffed by the engineers who built it.
            Our customers&rsquo; success is our success, so go-live is not the end
            of the engagement.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2Small}>What you keep</h2>
        <div className={styles.keeps}>
          {keeps.map((keep) => (
            <div
              key={keep.title}
              className={styles.keepCard}
              style={
                { "--flood-bg": keep.bg, "--flood-ink": keep.ink } as CSSProperties
              }
            >
              <div className={styles.keepTitle}>{keep.title}</div>
              <p className={styles.keepBody}>{keep.body}</p>
              <div className={styles.keepCaption}>{keep.caption}</div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.talent}>
        <div>
          <div className={styles.eyebrowAccent}>Our talent</div>
          <h2 className={styles.h2}>
            Engineers held to an enterprise standard before they reach your team.
          </h2>
          <p className={styles.talentLead}>
            Selection is evidence-based: a systems interview against production
            failure cases, a paid technical trial on real infrastructure, and
            reference checks with the teams they last shipped with. Seniority is
            measured in systems carried under load and incidents owned, not years
            on a CV. Once placed, engineers are re-assessed each quarter against
            the objectives written into your engagement, and the review is shared
            with your lead.
          </p>
          <div className={styles.standards}>
            {standards.map((line, i) => (
              <RiseIn
                key={line}
                className={
                  i === 0
                    ? styles.standardFirst
                    : i === standards.length - 1
                      ? styles.standardLast
                      : styles.standard
                }
              >
                {line}
              </RiseIn>
            ))}
          </div>
        </div>

        <div className={styles.selection}>
          <div className={styles.selectionLabel}>Selection standard</div>
          <div className={styles.funnel}>
            {funnel.map((step) => (
              <RiseIn key={step.label}>
                <div
                  className={styles.funnelBar}
                  style={{ width: step.width, background: step.bg, color: step.ink }}
                >
                  <span className={styles.funnelName}>{step.label}</span>
                  <span className={styles.funnelValue}>{step.value}</span>
                </div>
              </RiseIn>
            ))}
          </div>
          <div className={styles.funnelNote}>
            Intake to placement, last twelve months. 0.8% of applicants placed.
          </div>

          <div className={styles.figures}>
            {figures.map(([value, label]) => (
              <RiseIn key={value}>
                <div className={styles.figureValue}>{value}</div>
                <div className={styles.figureLabel}>{label}</div>
              </RiseIn>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.rest}>
        <h2 className={styles.h2Small}>The rest of the system</h2>
        <div className={styles.restGrid}>
          {rest.map((item) => (
            <Link key={item.name} href={item.href} className={styles.restTile}>
              <div className={styles.restStatus}>{item.status}</div>
              <div className={styles.restName}>{item.name}</div>
            </Link>
          ))}
        </div>
      </section>

      <section id="contact" className={styles.closing}>
        <h2 className={styles.closingTitle}>Own your own AI future.</h2>
        <p className={styles.closingLead}>
          Start with one problem and one team. Keep the engineers you already have.
        </p>
        <div className={styles.closingActions}>
          <Link href="/contact" className={styles.closingSolid}>
            Contact
          </Link>
          <Link href="/" className={styles.closingOutline}>
            Back to NSK AI
          </Link>
        </div>
      </section>
    </>
  );
}
