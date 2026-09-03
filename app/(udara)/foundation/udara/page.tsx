import type { Metadata } from "next";
import Link from "next/link";
import ReachSwarm from "@/components/udara/ReachSwarm";
import styles from "./udara.module.css";

export const metadata: Metadata = {
  title: "The Udara Project",
  description:
    "Africa’s largest virtual AI class: five days of live teaching in May 2026, free to every participant, followed by a 48-day hackathon.",
};

const headline = [
  { value: "21,000", label: "Learners registered, 2026" },
  { value: "31", label: "African countries" },
  { value: "290", label: "Universities reached" },
  { value: "23,393", label: "Learners across both editions" },
  { value: "7%", label: "Of the cohort from one campus" },
];

const days = [
  { day: "Day 1", title: "Foundations of AI" },
  { day: "Day 2", title: "MLOps & Deployment" },
  { day: "Day 3", title: "AI Agents and RAG" },
  { day: "Day 4", title: "Vibe Coding" },
  { day: "Day 5", title: "Modelling Day" },
];

const reachNotes = [
  {
    label: "Deepest single campus",
    title: "University of Benin",
    body: "7% of all 2026 registrations, and roughly 5% of the campus undergraduate body",
  },
  {
    label: "Beyond the capitals",
    body: "Eight of the top twenty institutions are Ethiopian, six of them regional universities outside Addis Ababa.",
  },
  {
    label: "Twenty-three campuses",
    body: "registered more than a hundred learners each, from Lagos and Benin City to Addis Ababa, Wollo and Nairobi.",
  },
];

const cohort = [
  { value: "72%", body: "under 25 years old", bar: 72 },
  { value: "38%", body: "women, rising to 48% in The Gambia and 43% in Kenya", bar: 38 },
  { value: "50%", body: "from outside STEM — medicine, law, education, finance, nursing", bar: 50 },
];

const languages = [
  "Amharic",
  "Yoruba",
  "Hausa",
  "Oromo",
  "Kirundi",
  "Igbo",
  "Tigrinya",
  "Swahili",
];

const build = [
  { label: "Teams formed", value: "31" },
  { label: "Builders in the hackathon", value: "115" },
  { label: "Days of building", value: "48" },
];

const speakers = [
  { name: "Nimshi Venkat", role: "Machine Learning Scientist, Apple" },
  { name: "Venkatesh Elango", role: "Applied Scientist, Amazon" },
  { name: "Sai Prabhakar", role: "AI Researcher, Anterior · Community advisor, NSK AI" },
  { name: "Vitali Avagyan", role: "Member of technical staff, Anterior" },
  { name: "Jesse Zwaan", role: "Software Engineer, Anterior" },
  { name: "Ifeanyi Okala", role: "Director, NSK AI Foundation · NVIDIA Ambassador" },
];

/** Diaries from the cohort. The two long ones lead their columns. */
const diaries = [
  {
    lead: true,
    quote:
      "The Build was the most intense and rewarding six weeks of my journey as a founder. The weekly deadlines were brutal in the best way. There was no room to overthink. You either shipped or you didn’t.",
    who: "Saddiq Musa Adam · Miva Open University, Nigeria · built PaidSafe with teammates in Kenya and Ethiopia",
  },
  {
    lead: false,
    quote:
      "Building ZeToD entirely on mobile through GitHub Codespaces taught me that constraints don’t stop you, they sharpen you.",
    who: "Omoregie Osafonmwan Kenneth · Nigeria",
  },
  {
    lead: false,
    quote:
      "The weekly ‘ship or fail’ rhythm was the real engine of The Build. It forced us to prioritise, ship publicly, and stay accountable. The self-organising, cross-country team structure felt authentic; it mirrored how real remote teams work.",
    who: "Emmanuel Gbafore · Liberia",
  },
  {
    lead: false,
    quote:
      "This project meant a lot. Which encouraged us to see our potential, to manage our time, to improve team work, confidence, experience sharing, and to think further to solve other problems too.",
    who: "Remla Habib Muhammed · Ethiopia",
  },
  {
    lead: true,
    quote:
      "The emphasis on hands-on building, pan-African team collaboration, and weekly public accountability made this program truly unique compared to standard hackathons. It challenged us to think about real-world African problems, refine our technical architecture, and ship functional products under real pressure.",
    who: "Esmaile Mehbub Keder · Ethiopia",
  },
  {
    lead: false,
    quote:
      "This project was unique where i interacted with people from different continents and also learned more about AI skills which enabled me to explore and invest more in technology.",
    who: "Grace Mwenesi · Jomo Kenyatta University of Agriculture and Technology, Kenya",
  },
  {
    lead: false,
    quote:
      "The real win was the journey: six weeks of building in public, validating our problem with real traders, and shipping a working voice-first AI agent for cross-border trade intelligence.",
    who: "Zerihun Asrat · Wolkite University, Ethiopia",
  },
  {
    lead: false,
    quote:
      "The Udara Project stretched how I think, learn, and collaborate. I left with practical AI skills, new connections, and a stronger belief in building with others.",
    who: "Mustapha Maitama Yusuf · Bayero University, Nigeria",
  },
  {
    lead: false,
    quote:
      "It strengthened my confidence, improved my problem-solving skills, and inspired me to continue developing AI and ICT solutions that can positively impact my community.",
    who: "Ian Ochieng Oriaka · Ramogi Institute of Advanced Technology, Kenya",
  },
  {
    lead: false,
    quote:
      "I received a certificate for participation, which will undoubtedly open more opportunities for me in the technology sector. I look forward to participating fully in the next Udara Project 2027 and, if possible, giving back to the community.",
    who: "Efuwape Ayomide Oreoluwa · Federal University of Agriculture Abeokuta, Nigeria",
  },
];

const support = [
  {
    when: "First — reach every learner we already have",
    body: "Messaging across WhatsApp, Telegram and email, so every registered learner hears about every session; supported campus ambassadors; a partnerships lead in post.",
  },
  {
    when: "Then — build the team and the infrastructure",
    body: "A paid core team, twenty mentors on The Build, load-tested streaming infrastructure, and a 2027 edition delivered at several times the scale of the last one.",
  },
  {
    when: "Then — continental scale",
    body: "Paid country leads across four or more nations, the world-record class attempt, the consented multilingual dataset programme, and a path to one million learners by 2029.",
  },
];

export default function UdaraPage() {
  return (
    <>
      <section className={styles.hero}>
        <div>
          <div className={styles.mono}>Foundation &middot; Programme</div>
          <h1 className={styles.heroTitle}>The Udara Project</h1>
          <p className={styles.heroLead}>
            Africa&rsquo;s largest virtual AI class. Five days of live teaching in
            May 2026, free to every participant, followed by a 48-day hackathon
            &mdash; run by an African nonprofit for learners in 31 African
            countries.
          </p>
          <div className={styles.heroActions}>
            <a href="#reach" className={styles.buttonSolid}>
              See the reach
            </a>
            <a href="#support" className={styles.buttonOutline}>
              Where support goes
            </a>
          </div>
        </div>
        <figure className={styles.heroFigure}>
          <div className={styles.frameWide}>
            <img
              src="/udara/participants.png"
              alt="Udara Project participants"
              loading="lazy"
              className={styles.imageBottom}
            />
          </div>
          <figcaption className={styles.monoMuted}>
            Udara 2026 &middot; participants
          </figcaption>
        </figure>
      </section>

      <section className={styles.headline}>
        <div className={styles.headlineGrid}>
          {headline.map((stat) => (
            <div key={stat.label} className={styles.headlineCell}>
              <div className={styles.headlineValue}>{stat.value}</div>
              <div className={styles.monoMuted}>{stat.label}</div>
            </div>
          ))}
        </div>
        <p className={styles.headlineNote}>
          Two editions, 2025 and 2026, reaching learners in 34 African countries.
          18,914 of the 2026 cohort consented to stay in contact &mdash; an opt-in
          rate of 95.9%.
        </p>
      </section>

      <section id="reach" className={styles.section}>
        <div className={styles.reachGrid}>
          <div>
            <h2 className={styles.h2}>From nine students to 290 universities</h2>
            <p className={styles.reachLead}>
              NSK AI began in 2021 with nine students at the University of
              Nigeria, Nsukka. Every mark below is an institution where at least
              five people registered for Udara 2026.
            </p>
            <ReachSwarm />
          </div>
          <div className={styles.notes}>
            {reachNotes.map((note) => (
              <div key={note.label} className={styles.note}>
                <div className={styles.monoMuted}>{note.label}</div>
                {note.title ? (
                  <div className={styles.noteTitle}>{note.title}</div>
                ) : null}
                <div className={styles.noteBody}>{note.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.ruled}>
          <div className={styles.ruledHead}>
            <h2 className={styles.h2}>Five days, then forty-eight</h2>
            <div className={styles.monoMuted}>14&ndash;19 May 2026</div>
          </div>
          <div className={styles.days}>
            {days.map((d) => (
              <div key={d.day} className={styles.day}>
                <div className={styles.monoAccent}>{d.day}</div>
                <div className={styles.dayTitle}>{d.title}</div>
              </div>
            ))}
          </div>
          <p className={styles.daysNote}>
            Every day combined concept teaching, a live demo, hands-on exercises
            and open Q&amp;A. Sessions were streamed live and left online
            afterwards, so a learner who missed a day could still take the whole
            course. In the month after the class, the recordings drew a further
            4,995 engaged views and 1,230 watch-hours, 62% of them from returning
            viewers.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.ruled}>
          <h2 className={styles.h2}>Who was in the room</h2>
          <p className={styles.reachLead}>
            The 2026 cohort was young, gender-diverse and drawn from across the
            university rather than from computer science alone.
          </p>
          <div className={styles.cohort}>
            {cohort.map((item) => (
              <div key={item.value} className={styles.cohortCell}>
                <div className={styles.cohortValue}>{item.value}</div>
                <div className={styles.cohortBody}>{item.body}</div>
                <div className={styles.meter}>
                  <div
                    className={styles.meterFill}
                    style={{ width: `${item.bar}%` }}
                  />
                </div>
              </div>
            ))}
            <div className={styles.cohortCell}>
              <div className={styles.cohortValue}>40+</div>
              <div className={styles.cohortBody}>
                African languages declared as a first language
              </div>
              <div className={styles.languages}>
                {languages.map((language, i) => (
                  <span key={language}>
                    {language}
                    {i < languages.length - 1 ? " · " : ""}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <p className={styles.headlineNote}>
            Almost 19,000 registrants consented to be contacted, and 1,088 were
            under eighteen &mdash; a secondary-school pipeline with its own
            consent framework.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.buildGrid}>
          <div>
            <div className={styles.monoAccent}>
              The Build &middot; 19 May &ndash; 5 July 2026
            </div>
            <h2 className={styles.h2Small}>
              Forty-eight days to ship something real
            </h2>
            <p className={styles.buildLead}>
              Teaching ended where building began. The Build is Udara&rsquo;s
              hackathon: teams formed across borders, worked with mentors, and
              finished with a working product rather than a slide.
            </p>
            <div className={styles.table}>
              {build.map((row) => (
                <div key={row.label} className={styles.tableRow}>
                  <div className={styles.tableLabel}>{row.label}</div>
                  <div className={styles.tableValue}>{row.value}</div>
                </div>
              ))}
            </div>
          </div>
          <figure className={styles.figure}>
            <div className={styles.frameTall}>
              <img
                src="/udara/the-build-flyer.png"
                alt="The Build hackathon flyer"
                loading="lazy"
                className={styles.imageTop}
              />
            </div>
            <figcaption className={styles.monoMuted}>
              The Build &mdash; programme flyer
            </figcaption>
          </figure>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.speakerGrid}>
          <figure className={styles.figure}>
            <div className={styles.frameSquare}>
              <img
                src="/udara/speakers.png"
                alt="Udara 2026 speakers"
                loading="lazy"
                className={styles.imageCover}
              />
            </div>
            <figcaption className={styles.monoMuted}>
              Udara 2026 &mdash; speakers
            </figcaption>
          </figure>
          <div>
            <h2 className={styles.h2Small}>Taught by practitioners</h2>
            <p className={styles.buildLead}>
              From the first session in 2021, the rule has been the same: only
              invite people working at the level we want participants to reach.
            </p>
            <div className={styles.table}>
              {speakers.map((speaker) => (
                <div key={speaker.name} className={styles.speaker}>
                  <div className={styles.speakerName}>{speaker.name}</div>
                  <div className={styles.speakerRole}>{speaker.role}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.ruled}>
          <div className={styles.ruledHead}>
            <h2 className={styles.h2}>Diaries from the cohort</h2>
            <div className={styles.monoMuted}>In participants&rsquo; own words</div>
          </div>
          <div className={styles.diaries}>
            {diaries.map((diary) => (
              <figure
                key={diary.who}
                className={diary.lead ? styles.diaryLead : styles.diary}
              >
                <blockquote
                  className={diary.lead ? styles.quoteLead : styles.quote}
                >
                  &ldquo;{diary.quote}&rdquo;
                </blockquote>
                <figcaption className={styles.diaryWho}>{diary.who}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="support" className={styles.support}>
        <div className={styles.supportHead}>
          <h2 className={styles.supportTitle}>Where support goes</h2>
          <div className={styles.supportEyebrow}>2027 &ndash; 2029</div>
        </div>
        <p className={styles.supportLead}>
          Udara already reaches learners in 31 countries and 290 universities.
          Support makes that reach durable and larger: a paid core team,
          load-tested streaming, messaging on the channels African learners
          actually use, and a properly resourced campus ambassador programme.
        </p>
        <div className={styles.supportGrid}>
          {support.map((item) => (
            <div key={item.when} className={styles.supportCell}>
              <div className={styles.supportWhen}>{item.when}</div>
              <p className={styles.supportBody}>{item.body}</p>
            </div>
          ))}
        </div>
        <div className={styles.supportActions}>
          <Link href="/contact" className={styles.buttonGold}>
            Request the white paper
          </Link>
          <Link href="/foundation" className={styles.buttonGhost}>
            About the Foundation
          </Link>
        </div>
      </section>

      <section id="contact" className={styles.closing}>
        <h2 className={styles.closingTitle}>
          Fund a cohort, teach one, or join one.
        </h2>
        <p className={styles.closingLead}>
          Partners, volunteer instructors and participants all come through the
          same door.
        </p>
        <div className={styles.closingActions}>
          <Link href="/community" className={styles.closingSolid}>
            Join the community
          </Link>
          <Link href="/foundation/rag-bootcamp-2025" className={styles.closingOutline}>
            The 2025 bootcamp
          </Link>
        </div>
      </section>
    </>
  );
}
