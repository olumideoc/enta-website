import type { Metadata } from "next";
import entaStyles from "../enta-website.module.css";
import { EntaFaqBand } from "../EntaFaqBand";
import { EntaFeaturesBand } from "../EntaFeaturesBand";
import { EntaSecurityBand } from "../EntaSecurityBand";
import { EntaSiteFooter } from "../EntaSiteFooter";
import { EntaSiteHeader } from "../EntaSiteHeader";
import { EntaSky } from "../EntaSky";
import { PillTabs } from "../PillTabs";
import {
  checkIcon,
  heroBody,
  heroHeading,
  heroPrimaryLabel,
  heroSecondaryLabel,
  individualDescription,
  individualTabs,
  waysHeading,
  waysHeadingId,
  waysSectionId,
  waysTabListLabel,
} from "./individualData";
import styles from "./individual.module.css";

const title = "Individual | Enta";

const signupUrl = "https://app.entashiga.io/signup";

export const metadata: Metadata = {
  title,
  description: individualDescription,
  openGraph: {
    title,
    description: individualDescription,
    siteName: "Enta",
    type: "website",
    images: ["/enta-website/enta-dashboard-snapshot.png"],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: individualDescription,
    images: ["/enta-website/enta-dashboard-snapshot.png"],
  },
};

export default function IndividualPage() {
  return (
    <div className={`${entaStyles.page} ${styles.individualPage}`}>
      <a className={styles.skipLink} href="#main-content">
        Skip to content
      </a>
      <EntaSiteHeader activeHref="/enta-website/individual" />

      <main id="main-content" className={styles.main} tabIndex={-1}>
        <section className={styles.hero} aria-labelledby="individual-title">
          <EntaSky className={styles.heroMedia} videoClassName={styles.heroVideo} />
          <div className={styles.heroRail}>
            <div className={styles.heroCopy}>
              <h1 id="individual-title">{heroHeading}</h1>
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

        <section
          className={styles.waysSection}
          id={waysSectionId}
          aria-labelledby={waysHeadingId}
        >
          <PillTabs
            tabs={individualTabs}
            heading={waysHeading}
            headingId={waysHeadingId}
            tabListLabel={waysTabListLabel}
            checkIcon={checkIcon}
          />
        </section>

        {/*
          The three bands below are shared with the landing page: one
          EntaFeaturesBand, one EntaSecurityBand and one EntaFaqBand render on
          both, so their copy and their markup live in one place. This page
          labels each one by its heading and skips the landing page's scroll
          reveal, which no observer runs here.
        */}
        <EntaFeaturesBand headingId="individual-features-title" />

        <EntaSecurityBand
          exploreHref="/enta-website/security"
          headingId="individual-security-title"
        />

        <EntaFaqBand headingId="individual-faq-title" />
      </main>

      <EntaSiteFooter currentLabel="Individuals" />
    </div>
  );
}
