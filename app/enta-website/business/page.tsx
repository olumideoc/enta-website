import type { Metadata } from "next";
import Image from "next/image";
import capTrim from "../cap-trim.module.css";
import entaStyles from "../enta-website.module.css";
import tileStyles from "../icon-tile.module.css";
import { CustomerReviews } from "../CustomerReviews";
import { EntaFaqBand } from "../EntaFaqBand";
import { EntaSecurityBand } from "../EntaSecurityBand";
import { EntaSiteFooter } from "../EntaSiteFooter";
import { EntaSiteHeader } from "../EntaSiteHeader";
import { EntaSky } from "../EntaSky";
import { FeatureAccordion } from "../FeatureAccordion";
import { PillTabs } from "../PillTabs";
import { MaskIcon } from "./MaskIcon";
import {
  businessColumns,
  businessDescription,
  businessTabs,
  checkIcon,
  columnsDescription,
  columnsHeading,
  columnsHeadingId,
  ctaCaretIcon,
  formFactorCards,
  formFactorsHeading,
  formFactorsHeadingId,
  heroBody,
  heroHeading,
  heroPrimaryLabel,
  heroSecondaryLabel,
  teamBody,
  teamCtaLabel,
  teamHeading,
  teamHeadingId,
  teamRows,
  waysHeading,
  waysHeadingId,
  waysSectionId,
  waysTabListLabel,
} from "./businessData";
import styles from "./business.module.css";

const title = "Business | Enta";

const signupUrl = "https://app.entashiga.io/signup";

export const metadata: Metadata = {
  title,
  description: businessDescription,
  openGraph: {
    title,
    description: businessDescription,
    siteName: "Enta",
    type: "website",
    images: ["/enta-website/enta-dashboard-snapshot.png"],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: businessDescription,
    images: ["/enta-website/enta-dashboard-snapshot.png"],
  },
};

export default function BusinessPage() {
  return (
    <div className={`${entaStyles.page} ${styles.businessPage}`}>
      <a className={styles.skipLink} href="#main-content">
        Skip to content
      </a>
      <EntaSiteHeader activeHref="/enta-website/business" />

      <main id="main-content" className={styles.main} tabIndex={-1}>
        <section className={styles.hero} aria-labelledby="business-title">
          <EntaSky className={styles.heroMedia} videoClassName={styles.heroVideo} />
          <div className={styles.heroRail}>
            <div className={styles.heroCopy}>
              <h1 id="business-title">{heroHeading}</h1>
              <p>{heroBody}</p>
            </div>
            <div className={styles.heroActions}>
              <a className={entaStyles.primaryButton} href={signupUrl}>
                {heroPrimaryLabel}
              </a>
              <a className={styles.secondaryButton} href={`#${waysSectionId}`}>
                {heroSecondaryLabel}
              </a>
            </div>
          </div>
        </section>

        {/*
          The pill tabs are the individual page's component: same tab list, same
          keyboard behaviour, same card that never changes height. These four
          panels end in a button where that page's end in a check list.
        */}
        <section
          className={styles.waysSection}
          id={waysSectionId}
          aria-labelledby={waysHeadingId}
        >
          <PillTabs
            tabs={businessTabs}
            heading={waysHeading}
            headingId={waysHeadingId}
            tabListLabel={waysTabListLabel}
          />
        </section>

        <section
          className={styles.formFactorsSection}
          aria-labelledby={formFactorsHeadingId}
        >
          <div className={styles.formFactorsInner}>
            <h2 id={formFactorsHeadingId}>{formFactorsHeading}</h2>

            <div className={styles.formFactorCards}>
              {formFactorCards.map((card) => (
                <article className={styles.formFactorCard} key={card.id}>
                  {/*
                    A plain <img>, the way the landing page's audience cards
                    carry theirs: the wash is stretched rather than kept to its
                    ratio, which next/image warns about.
                  */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className={styles.formFactorWash}
                    src={card.wash}
                    alt=""
                    width={554}
                    height={503}
                  />

                  <div className={styles.formFactorBody}>
                    <div className={styles.formFactorHead}>
                      <p className={styles.formFactorEyebrow}>{card.eyebrow}</p>
                      <div className={styles.formFactorCopy}>
                        <h3>{card.title}</h3>
                        <p>{card.body}</p>
                      </div>
                    </div>

                    <div className={styles.formFactorRule} aria-hidden="true" />

                    <ul className={styles.formFactorPoints}>
                      {card.points.map((point) => (
                        <li key={point}>
                          <Image src={checkIcon} alt="" width={20} height={20} />
                          <span>{point}</span>
                        </li>
                      ))}
                      {card.daggerPoint ? (
                        <li>
                          <Image src={checkIcon} alt="" width={20} height={20} />
                          <span>
                            {card.daggerPoint}
                            <span className={styles.formFactorDagger}>†</span>
                          </span>
                        </li>
                      ) : null}
                    </ul>
                  </div>

                  <div className={styles.formFactorFoot}>
                    <a className={styles.formFactorCta} href={card.ctaHref}>
                      <span>{card.ctaLabel}</span>
                      <MaskIcon src={ctaCaretIcon} />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/*
          The three rows are the landing page's FeatureAccordion: one row open
          at a time, a progress line under the open one, and autoplay that
          pauses on hover, on keyboard focus and off screen.
        */}
        <section className={styles.teamSection} aria-labelledby={teamHeadingId}>
          <div className={styles.teamInner}>
            <div className={styles.teamHeading}>
              <h2 id={teamHeadingId}>{teamHeading}</h2>
              <p className={capTrim.capTrim}>{teamBody}</p>
            </div>

            <div className={styles.teamBody}>
              <div className={entaStyles.featureList}>
                <FeatureAccordion items={teamRows} />
                <a className={entaStyles.primaryButton} href={signupUrl}>
                  {teamCtaLabel}
                </a>
              </div>

              <div className={styles.teamVisual} aria-hidden="true">
                <span className={styles.teamGlow}>
                  <span />
                </span>
              </div>
            </div>
          </div>
        </section>

        {/*
          Figma draws a single testimonial here. The multi-review carousel the
          landing page already runs is shown instead, so the two pages quote the
          same customers.
        */}
        <CustomerReviews />

        <section
          className={styles.columnsSection}
          aria-labelledby={columnsHeadingId}
        >
          <div className={styles.columnsInner}>
            <div className={styles.columnsHeading}>
              <h2 id={columnsHeadingId}>{columnsHeading}</h2>
              <p className={capTrim.capTrim}>{columnsDescription}</p>
            </div>

            <ul className={styles.columnsGrid}>
              {businessColumns.map((column) => (
                <li key={column.id}>
                  <span className={tileStyles.iconTile}>
                    <span className={tileStyles.iconTileFace}>
                      <MaskIcon src={column.icon} />
                    </span>
                  </span>
                  <h3>{column.title}</h3>
                  <p>{column.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/*
          The last two bands are shared with the landing page and the individual
          page, so their copy and their markup live in one place. This page
          labels each one by its heading and skips the landing page's scroll
          reveal, which no observer runs here.
        */}
        <EntaSecurityBand
          exploreHref="/enta-website/security"
          headingId="business-security-title"
        />

        <EntaFaqBand headingId="business-faq-title" />
      </main>

      <EntaSiteFooter currentLabel="Business" />
    </div>
  );
}
