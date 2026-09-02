import Link from "next/link";
import type { CSSProperties } from "react";
import FigureCanvas from "@/components/home/FigureCanvas";
import ProductRail from "@/components/home/ProductRail";
import QuantBand from "@/components/home/QuantBand";
import ResolveText from "@/components/home/ResolveText";
import WeightMatrix from "@/components/home/WeightMatrix";
import {
  capabilities,
  deployments,
  productBlocks,
  promises,
  services,
} from "@/lib/home-content";
import { products } from "@/lib/nav";
import styles from "./home.module.css";

const HERO_TITLE = "AI systems your enterprise can actually run.";

/** The rail reuses each product's nav icon, at its own accent colour. */
const railItems = productBlocks.map((block) => ({
  href: `#${block.id}`,
  accent: block.railAccent,
  icon: products.find((p) => p.href === block.href)?.icon,
}));

export default function HomePage() {
  return (
    <>
      <ProductRail items={railItems} />

      <section id="top" className={styles.hero}>
        <div className={styles.heroTitleWrap}>
          <ResolveText
            as="h1"
            className={styles.heroTitle}
            trigger="mount"
            steps={[24, 16, 8, 4]}
            stepMs={240}
            fontSize={80}
            lineHeight={88}
          >
            {HERO_TITLE}
          </ResolveText>
        </div>
        <p className={styles.heroLead}>
          NSK AI designs, deploys and operates AI systems inside your
          organisation, alongside your own engineers. Expert people on the work,
          systems specified for the constraints you actually operate under, and
          the capability left behind with your team.
        </p>
        <div className={styles.heroActions}>
          <Link href="/contact" className={styles.buttonSolid}>
            Contact
          </Link>
          <a href="#products" className={styles.buttonOutline}>
            Explore products
          </a>
        </div>
      </section>

      <section className={styles.bandSection}>
        <div className={styles.bandScale}>
          <div>Two bits</div>
          <div>Four</div>
          <div>Eight</div>
          <div>Resolved</div>
        </div>
        <QuantBand className={styles.band} />
        <div className={styles.bandNote}>
          <div className={styles.bandNoteText}>
            One surface, drawn four times at four bit depths. Two bits keeps the
            shape, four keeps the structure, eight keeps the detail, and the
            resolved pass keeps everything. We specify systems to stay correct at
            the left of that scale, so they still work when the network, the
            compute or the budget cannot carry the right.
          </div>
          <div className={styles.bandFormula}>
            q(v) = &lfloor;v &middot; 2&#8319;&rceil; / 2&#8319;
          </div>
        </div>
      </section>

      <section className={styles.promises}>
        {promises.map((promise) => (
          <div key={promise.label}>
            <div className={styles.promiseLabel}>{promise.label}</div>
            <p className={styles.promiseBody}>{promise.body}</p>
          </div>
        ))}
      </section>

      <section id="solutions" className={styles.sectionHead}>
        <ResolveText className={styles.h2}>What we do</ResolveText>
      </section>

      <section className={styles.capabilitiesSection}>
        <div className={styles.capabilities}>
          {capabilities.map((tile) => {
            const inner = (
              <>
                <div className={styles.tileTop}>
                  {tile.icon}
                  <div className={styles.tileIndex}>{tile.index}</div>
                </div>
                <div>
                  <div className={styles.tileTitle}>{tile.title}</div>
                  <div className={styles.tileCaptionRow}>
                    <div className={styles.tileRule} />
                    <div className={styles.tileCaption}>{tile.caption}</div>
                  </div>
                </div>
              </>
            );
            const style = { "--tile-accent": tile.accent } as CSSProperties;
            return tile.href ? (
              <Link
                key={tile.index}
                href={tile.href}
                className={styles.tile}
                style={style}
              >
                {inner}
              </Link>
            ) : (
              <div key={tile.index} className={styles.tile} style={style}>
                {inner}
              </div>
            );
          })}
        </div>
      </section>

      <section id="products" className={styles.sectionHead}>
        <ResolveText className={styles.h2}>What we build</ResolveText>
        <p className={styles.sectionLead}>
          Five lines of work, each with its own page and its own engineering
          team. Open one.
        </p>
      </section>

      <div className={styles.productsSpacer} />

      {productBlocks.map((block) => (
        <section key={block.id} id={block.id} className={styles.product}>
          <div className={styles.productHead}>
            <h3 className={styles.productTitle}>{block.title}</h3>
            <Link href={block.href} className={styles.buttonGhost}>
              {block.cta} &rarr;
            </Link>
          </div>
          <p className={styles.productLead}>{block.lead}</p>

          <div
            className={styles.plate}
            style={{ "--plate-bg": block.plate } as CSSProperties}
          >
            <div className={styles.plateGrid} aria-hidden="true" />
            <FigureCanvas kind={block.figure} className={styles.figure} />
            <div className={styles.plateNote}>
              <div className={styles.plateRule} />
              <div className={styles.plateFormula}>{block.formula}</div>
            </div>
          </div>

          {/* The chips only come out while the pointer is on this block. */}
          <div className={styles.chips}>
            {block.chips.map((chip) => (
              <div key={chip} className={styles.chip}>
                {chip}
              </div>
            ))}
          </div>
        </section>
      ))}

      <section id="services" className={styles.services}>
        <ResolveText className={styles.h2}>
          Supported by expert partnership
        </ResolveText>
        <p className={styles.servicesLead}>
          Work with world-class AI scientists and engineers to enable
          transformation that drives impact.
        </p>
        <div className={styles.servicesLabel}>Our services</div>
        <div className={styles.serviceGrid}>
          {services.map((service) => (
            <div
              key={service.title}
              className={styles.serviceCard}
              style={{ "--svc-accent": service.accent } as CSSProperties}
            >
              <div className={styles.serviceTop}>
                <div className={styles.serviceTitle}>{service.title}</div>
                <div className={styles.serviceDot} />
              </div>
              <div className={styles.serviceRule} />
              <p className={styles.serviceLead}>{service.lead}</p>
              <div className={styles.serviceBody}>
                <div className={styles.serviceDetail}>
                  {service.detail.map((line, i) => (
                    <div
                      key={line}
                      className={i === 0 ? styles.detailStrong : styles.detailMuted}
                    >
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.deploySection}>
        <ResolveText className={styles.h2}>
          Deploy it where your controls already are
        </ResolveText>
        <div className={styles.deployGrid}>
          {deployments.map((card) => (
            <div
              key={card.title}
              className={styles.deployCard}
              style={
                {
                  "--flood-bg": card.bg,
                  "--flood-ink": card.ink,
                } as CSSProperties
              }
            >
              <div className={styles.deployIcon}>{card.icon}</div>
              <div className={styles.deployEyebrow}>{card.eyebrow}</div>
              <h3 className={styles.deployTitle}>{card.title}</h3>
              <p className={styles.deployBody}>{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="research" className={styles.research}>
        <div>
          <ResolveText className={styles.h2}>
            Open weights, open licences, no lock-in
          </ResolveText>
          <p className={styles.researchLead}>
            We build on open-source models, and we contribute back to them. That
            means weights you can inspect, licences your legal team can read, and
            a system that keeps running if any vendor changes its terms. Our own
            methods and evaluation code go out the same way, in public
            repositories you can run yourself.
          </p>
          {/* TODO: point at the public org once the repositories page exists. */}
          <a href="#research" className={styles.researchLink}>
            Browse our repositories
          </a>
        </div>
        <WeightMatrix />
      </section>

      <section id="contact" className={styles.closing}>
        <ResolveText className={styles.closingTitle}>
          Own your own AI future.
        </ResolveText>
        <p className={styles.closingLead}>
          Build, customize, and deploy tailored AI solutions with complete
          control.
        </p>
        <div className={styles.closingActions}>
          <Link href="/contact" className={styles.closingSolid}>
            Contact
          </Link>
          <a href="#products" className={styles.closingOutline}>
            Explore products
          </a>
        </div>
      </section>
    </>
  );
}
