import type { Metadata } from "next";
import Link from "next/link";
import { DISCORD_URL } from "@/lib/nav";
import styles from "./bootcamp.module.css";

export const metadata: Metadata = {
  title: "RAG and AI Agents Bootcamp 2025",
  description:
    "Six weeks of live sessions on retrieval-augmented generation and agent systems, taught free between 19 July and 31 August 2025.",
};

const YOUTUBE = "https://www.youtube.com/@Nskaicommunity";

const partners = [
  "GDG Addis",
  "Women Techmakers Addis",
  "Google Developer Groups on Campus, Sudan University of Science & Technology",
];

const headline = [
  { value: "1,370", label: "Participants" },
  { value: "50", label: "Countries" },
  { value: "7", label: "Live sessions" },
  { value: "0", label: "Cost to attend" },
];

const sessions = [
  {
    n: "01",
    when: "Sat 2 August · 6pm WAT",
    title: "Generative AI Meets Real-World Problem Solving",
    who: "Kevin Tuei",
    role: "AWS UG AI/ML Kenya Leader",
  },
  {
    n: "02",
    when: "Sat 9 August · 6pm WAT",
    title: "Behind the Curtain: building production-grade AI agents that actually work",
    who: "Rajshekar Prabhakar",
    role: "VP of Artificial Intelligence, ServiceLink",
  },
  {
    n: "03",
    when: "Fri 15 August · 6pm WAT",
    title: "Data Analytics Using Agents",
    who: "Prabhu Rajendran",
    role: "Senior Manager, Global Strategic Pricing, Thermo Fisher Scientific",
  },
  {
    n: "04",
    when: "Sat 16 August · 6pm WAT",
    title: "Music Generation",
    who: "Anirudh Mani",
    role: "Co-founder, Lemonaide Music",
  },
  {
    n: "05",
    when: "Thu 21 August · 6pm WAT",
    title: "Merging Minds: introduction and demos of model merging in LLMs",
    who: "Sai Prabhakar",
    role: "AI Researcher, Anterior AI · NSK AI community advisor",
  },
  {
    n: "06",
    when: "Sat 23 August · 6pm WAT",
    title: "Keynote",
    who: "Nimshi Venkat",
    role: "Senior Machine Learning Engineer, Apple",
  },
  {
    n: "07",
    when: "Thu 28 August · 6pm WAT",
    title: "Closing keynote",
    who: "Jesse Zwaan",
    role: "Software Engineer, Anterior AI",
  },
];

const hackathon = [
  { value: "18", label: "Projects submitted" },
  { value: "12", label: "Sectors addressed" },
  { value: "3", label: "Countries per team, minimum" },
  { value: "5", label: "Countries represented" },
];

const projects = [
  {
    name: "Kiisab",
    body: "Adaptive testing across the Senegalese national curriculum, with difficulty set by performance.",
  },
  {
    name: "LifeLine",
    body: "Public service navigator for Kenyan citizens: healthcare, education and NHIF requirements.",
  },
  {
    name: "Credit Explain",
    body: "Cites the clause behind a credit or regulatory decision, with audit-ready metrics.",
  },
  {
    name: "Yeneta",
    body: "Tutoring in six African languages, with progress carried across sessions.",
  },
  {
    name: "MediRAG",
    body: "Hybrid graph and vector retrieval over medical sources, with contradiction detection.",
  },
  {
    name: "Chikka_AI",
    body: "Feeding, vaccination and disease guidance for backyard poultry farmers.",
  },
  {
    name: "OkooAI",
    body: "Trip planning grounded in official Ethiopian tourism records rather than blogs.",
  },
  {
    name: "SupplyChain Genie",
    body: "Reads shipment documents, scores delay risk and proposes alternate routes.",
  },
  {
    name: "EchoCheck",
    body: "Cross-checks a model’s answer against trusted sources before it is shown.",
  },
];

export default function RagBootcampPage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.mono}>Foundation &middot; Programme</div>
        <h1 className={styles.heroTitle}>The 2025 RAG and AI Agents Bootcamp</h1>
        <p className={styles.heroLead}>
          Six weeks of live sessions on retrieval-augmented generation and agent
          systems, taught between 19 July and 31 August 2025 by practitioners from
          Apple, Thermo Fisher Scientific, ServiceLink, Anterior AI and Lemonaide
          Music. Free, online, open to anyone who registered.
        </p>
        <div className={styles.heroActions}>
          <a
            href={YOUTUBE}
            target="_blank"
            rel="noopener"
            className={styles.buttonSolid}
          >
            <svg width="20" height="14" viewBox="0 0 24 17" fill="none" aria-hidden="true">
              <rect
                x="0.6"
                y="0.6"
                width="22.8"
                height="15.8"
                rx="4"
                stroke="currentColor"
                strokeWidth="1.2"
              />
              <polygon points="9.5,4.8 16,8.5 9.5,12.2" fill="currentColor" />
            </svg>
            Watch every session on YouTube
          </a>
          <Link href="/foundation" className={styles.buttonOutline}>
            The Foundation
          </Link>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.splitGrid}>
          <div className={styles.monoMuted}>Why the Foundation ran it</div>
          <div>
            <p className={styles.statement}>
              The NSK AI Foundation exists to put frontier technique in the hands
              of people who would otherwise pay for it or never see it. The
              bootcamp was the clearest form of that: the same retrieval and agent
              engineering our teams do commercially, taught by the people who do
              it, at no cost, on the record, to anyone who signed up.
            </p>
            <p className={styles.statementBody}>
              Every recording stays public. Nothing taught here is held back from
              the Foundation&rsquo;s audience and sold elsewhere.
            </p>
            <p className={styles.statementNote}>
              The Foundation is registered as the Bambara Artificial Intelligence
              Foundation.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.splitGrid}>
          <div>
            <div className={styles.monoMuted}>Run with</div>
            <div className={styles.posterFrame}>
              <img
                src="/bootcamp/poster.png"
                alt="Intro to AI Agents: from RAG to deployment, six-week bootcamp"
                loading="lazy"
                className={styles.poster}
              />
            </div>
          </div>
          <div>
            <p className={styles.statement}>
              The cohort was organised with three developer communities, which
              carried the announcement into their own campuses and chapters rather
              than leaving recruitment to our channels alone.
            </p>
            <div className={styles.partners}>
              {partners.map((partner) => (
                <div key={partner} className={styles.partner}>
                  {partner}
                </div>
              ))}
            </div>
            <p className={styles.partnerNote}>
              Registration was open and free, six weeks from 19 July to 31 August
              2025, with the theme announced as{" "}
              <em>Intro to AI Agents: from RAG to deployment</em>.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.figures}>
        <div className={styles.figureGrid}>
          {headline.map((stat) => (
            <div key={stat.label} className={styles.figureCell}>
              <div className={styles.figureValue}>{stat.value}</div>
              <div className={styles.monoMuted}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.ruledHead}>
          <h2 className={styles.h2}>The programme, as it ran</h2>
          <div className={styles.monoMuted}>
            August 2025 &middot; all sessions 6pm WAT
          </div>
        </div>
        {/* Pointing at one session dims the rest; done in CSS on the list. */}
        <div className={styles.sessions}>
          {sessions.map((session) => (
            <div key={session.n} className={styles.session}>
              <div className={styles.sessionIndex}>{session.n}</div>
              <div>
                <div className={styles.monoAccent}>{session.when}</div>
                <div className={styles.sessionTitle}>{session.title}</div>
              </div>
              <div className={styles.sessionWho}>
                <div className={styles.sessionName}>{session.who}</div>
                <div className={styles.sessionRole}>{session.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.splitGrid}>
          <div>
            <div className={styles.monoMuted}>Who taught, and who ran it</div>
            <div className={styles.teachCount}>14 speakers &middot; 6 organisers</div>
          </div>
          <div>
            <p className={styles.statementBody}>
              Speakers came from Apple, LangChain, Anterior, Stanford Healthcare,
              Thermo Fisher Scientific, ServiceLink, Neptune Medical, Swoop,
              Tublian and Lemonaide Music. None were paid to teach.
            </p>
            <p className={styles.statementBody}>
              A six-person organising team handled curriculum, community, design
              and the Discord across the six weeks.
            </p>
            <div className={styles.monoMutedSpaced}>How it ran</div>
            <p className={styles.statementBody}>
              Every session was live and recorded, with the recording and
              materials left public afterwards, so people in timezones that made
              6pm WAT impossible were not excluded.
            </p>
            <p className={styles.statementBody}>
              Participants were expected to build rather than watch. They formed
              their own teams and shipped a product against a closing hackathon,
              and every team had to draw its members from at least three different
              countries. That rule was the curriculum as much as the lectures
              were: nobody finished the cohort having worked only with people they
              already knew.
            </p>
            <div className={styles.links}>
              <a
                href={YOUTUBE}
                target="_blank"
                rel="noopener"
                className={styles.link}
              >
                Session recordings
              </a>
              <Link href="/foundation" className={styles.link}>
                Back to the Foundation &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.ruledHead}>
          <h2 className={styles.h2}>What the cohort shipped</h2>
          <div className={styles.monoMuted}>
            Closing hackathon &middot; September 2025
          </div>
        </div>
        <div className={styles.figureGridInset}>
          {hackathon.map((stat) => (
            <div key={stat.label} className={styles.figureCell}>
              <div className={styles.figureValue}>{stat.value}</div>
              <div className={styles.monoMuted}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div className={styles.readingGrid}>
          <div className={styles.monoMuted}>Reading the submissions</div>
          <p className={styles.statementBody}>
            Teams were based in Ethiopia, Kenya, Nigeria, Senegal and Chad. Almost
            none of them built a chatbot for its own sake: the recurring shape was
            a retrieval system pointed at a document set a public institution had
            already published but nobody could use &mdash; national curricula,
            tourism records, health guidance, credit policy, government service
            requirements. Adaptive and self-reflective retrieval, graph retrieval
            and citation-backed answers appeared across the field, not just in the
            strongest entries.
          </p>
        </div>

        <div className={styles.projects}>
          {projects.map((project) => (
            <div key={project.name} className={styles.project}>
              <div className={styles.projectName}>{project.name}</div>
              <p className={styles.projectBody}>{project.body}</p>
            </div>
          ))}
        </div>
        <p className={styles.projectsNote}>
          And nine more: Hometown Atlas, CLARIFY, Data Analyzer RAG, SmartCV Chat,
          NewsAI, CookMate AI, Health-RAG-Chatbot, The Answering Machine, RAG
          Chatbot for Businesses.
        </p>
      </section>

      <section className={styles.section}>
        <div className={styles.splitGrid}>
          <div>
            <div className={styles.monoMuted}>One year later</div>
            <div className={styles.personName}>Ian Karanja</div>
            <div className={styles.personWhere}>
              Nairobi, Kenya &middot; team RAGENGINEERS, LifeLine
            </div>
          </div>
          <div>
            <p className={styles.statementBody}>
              We have one piece of feedback from the 2025 cohort, and it arrived
              unprompted a year after the sessions ended. Ian Karanja joined while
              finishing a computer science degree, looking for a way across the
              gap between coursework and production systems. During the cohort he
              worked on LifeLine, a navigator for Kenyan public services.
            </p>
            <blockquote className={styles.quote}>
              &ldquo;The bootcamp specifically helped me master the end-to-end
              process of indexing multi-source data, optimizing vector embeddings,
              and refining retrieval pipelines to reduce hallucination.&rdquo;
            </blockquote>
            <p className={styles.statementBody}>
              In the year since, he has built LungScanAI, a system using
              specialised retrieval pipelines and ensemble analytics over medical
              data. In his words, the cohort &ldquo;strips away the fluff and
              forces you to build real, production-ready RAG architectures and
              systems that solve high-impact, real-world problems from day
              one.&rdquo;
            </p>
            <p className={styles.statementNote}>
              We ran no exit survey. This is the only participant account we hold,
              and we have not generalised from it.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.record}>
        <h2 className={styles.h2}>Six weeks, on the record.</h2>
        <p className={styles.recordLead}>
          Every session from August 2025 is still public, in full, in the order it
          was taught.
        </p>
        <a
          href={YOUTUBE}
          target="_blank"
          rel="noopener"
          className={styles.buttonSolid}
        >
          Watch every session on YouTube
        </a>
      </section>

      <section id="contact" className={styles.closing}>
        <h2 className={styles.closingTitle}>Teach a cohort, or join one.</h2>
        <p className={styles.closingLead}>
          Instructors, partner institutions and participants all come through the
          same door.
        </p>
        <div className={styles.closingActions}>
          <Link href="/contact" className={styles.closingSolid}>
            Get involved
          </Link>
          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noopener"
            className={styles.closingOutline}
          >
            Join the Discord
          </a>
        </div>
      </section>
    </>
  );
}
