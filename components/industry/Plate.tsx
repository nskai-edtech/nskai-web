import Link from "next/link";
import type { ReactNode } from "react";
import { plates, workedNote, type Plate as PlateData } from "@/lib/industries";
import styles from "./Plate.module.css";

/** Every plate carries the same catalogue furniture; only the copy and the one
    motion piece in the middle change. `children` is that motion piece. */
export default function Plate({
  plate,
  children,
}: {
  plate: PlateData;
  children: ReactNode;
}) {
  const others = plates.filter((p) => p.slug !== plate.slug);

  return (
    <>
      <section className={styles.head}>
        <div className={styles.rule}>
          <div className={styles.breadcrumb}>Solutions &middot; {plate.name}</div>
          <div className={styles.stamp}>
            <div className={styles.stampItem}>Plate {plate.numeral}</div>
            <div className={styles.stampItem}>{plate.code}</div>
          </div>
        </div>

        <div className={styles.hero}>
          <div>
            <h1 className={styles.title}>{plate.title}</h1>
            <p className={styles.lead}>{plate.lead}</p>
            <div className={styles.actions}>
              <Link href="/contact" className={styles.buttonSolid}>
                {plate.cta}
              </Link>
              <Link href="/solutions" className={styles.buttonOutline}>
                All plates
              </Link>
            </div>
          </div>

          <figure className={styles.plateFigure}>
            <div className={styles.plateFrame}>
              {/* Archival photography, self-hosted; see public/plates/README.md. */}
              <img
                src={`/plates/${plate.hero.file}`}
                alt=""
                className={styles.plateImage}
              />
            </div>
            <figcaption className={styles.plateCaption}>
              <div className={styles.captionText}>{plate.hero.caption}</div>
              <div>
                Plate {plate.numeral}
                <br />
                {plate.code}
              </div>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className={styles.problem}>
        <div className={styles.problemGrid}>
          <div className={styles.label}>The problem</div>
          <p className={styles.problemText}>{plate.problem[0]}</p>
          <p className={styles.problemText}>{plate.problem[1]}</p>
        </div>
      </section>

      {children}

      <section className={styles.applies}>
        <div className={styles.appliesHead}>
          <div className={styles.label}>Where it applies</div>
          <div className={styles.appliesNote}>{plate.appliesNote}</div>
        </div>
        <div className={plate.detail ? styles.appliesGrid : styles.appliesWide}>
          <div className={plate.detail ? styles.appliesList : styles.appliesColumns}>
            {plate.applies.map((item) => (
              <div key={item.n} className={styles.applyItem}>
                <div className={styles.applyIndex}>{item.n}</div>
                <div className={styles.applyTitle}>{item.title}</div>
                <p className={styles.applyBody}>{item.body}</p>
              </div>
            ))}
          </div>
          {plate.detail ? (
            <figure className={styles.detailFigure}>
              <div className={styles.detailFrame}>
                <img
                  src={`/plates/${plate.detail.file}`}
                  alt=""
                  className={styles.detailImage}
                />
              </div>
              <figcaption className={styles.detailCaption}>
                {plate.detail.caption}
              </figcaption>
            </figure>
          ) : null}
        </div>
      </section>

      <section className={styles.worked}>
        <div className={styles.workedGrid}>
          <div className={styles.label}>A worked example</div>
          <div className={styles.workedRows}>
            {plate.worked.map((row) => (
              <div key={row.label} className={styles.workedRow}>
                <div className={styles.workedLabel}>{row.label}</div>
                <div className={styles.workedValue}>{row.value}</div>
              </div>
            ))}
            <div className={styles.workedNote}>{workedNote}</div>
          </div>
        </div>
      </section>

      <section className={styles.notes}>
        <div className={styles.notesGrid}>
          <div>
            <div className={styles.label}>Notes on compliance</div>
            <div className={styles.complianceList}>
              {plate.compliance.map((line, i) => (
                <div key={line} className={styles.complianceRow}>
                  <div className={styles.complianceIndex}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <p className={styles.complianceText}>{line}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className={styles.label}>Deployment</div>
            <div className={styles.deploymentList}>
              {plate.deployment.map((step) => (
                <div key={step.when} className={styles.deploymentRow}>
                  <div className={styles.deploymentWhen}>{step.when}</div>
                  <div className={styles.deploymentWhat}>{step.what}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.deployed}>
        <div className={styles.deployedGrid}>
          <div className={styles.label}>Deployed here</div>
          <div>
            {plate.deployedHere.map((item) => (
              <Link key={item.name} href={item.href} className={styles.deployedRow}>
                <div className={styles.deployedName}>{item.name}</div>
                <div className={styles.deployedNote}>{item.note}</div>
                <div className={styles.deployedArrow} aria-hidden="true">
                  &rarr;
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.otherPlates}>
        <div className={styles.label}>The other plates</div>
        <div className={styles.plateGrid}>
          {others.map((other) => (
            <Link
              key={other.slug}
              href={`/solutions/${other.slug}`}
              className={styles.plateLink}
            >
              <div className={styles.plateNumeral}>Plate {other.numeral}</div>
              <div className={styles.plateName}>{other.name}</div>
            </Link>
          ))}
        </div>
      </section>

      <section id="contact" className={styles.closing}>
        <h2 className={styles.closingTitle}>
          Bring us the case you have not been able to close.
        </h2>
        <p className={styles.closingLead}>
          We will tell you which part of it is a model problem and which part is
          not.
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
