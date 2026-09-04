"use client";

import { DEFAULT_FEATURE_ID, FeatureAccordion } from "./FeatureAccordion";
import { FeatureVisual } from "./FeatureVisual";
import { featuresBand } from "./entaWebsiteData";
import { useState } from "react";
import styles from "./enta-website.module.css";

const signupUrl = "https://app.entashiga.io/signup";

type EntaFeaturesBandProps = {
  /** id put on the heading when the page labels the section by it. */
  headingId?: string;
  /**
   * Marks the band's blocks for the landing page's scroll reveal. The other
   * pages that render this band run no observer, so they leave it off.
   */
  reveal?: boolean;
};

/**
 * The send / buy / hold section, as the landing page and the individual page
 * both show it. One implementation, so a change to the copy or the layout
 * reaches every page that renders it.
 */
export function EntaFeaturesBand({ headingId, reveal }: EntaFeaturesBandProps) {
  // The accordion owns which item is open; the band only relays it to the
  // visual so the loop beside the list always matches the open copy.
  const [activeFeatureId, setActiveFeatureId] = useState<string | null>(
    DEFAULT_FEATURE_ID,
  );

  return (
    <section className={styles.featuresSection} aria-labelledby={headingId}>
      <div className={styles.featuresInner}>
        <div className={styles.sectionHeading} data-reveal={reveal || undefined}>
          <h2 id={headingId}>{featuresBand.heading}</h2>
          <p>{featuresBand.description}</p>
        </div>

        <div className={styles.featuresBody}>
          <div className={styles.featureList} data-reveal={reveal || undefined}>
            <FeatureAccordion onActiveChange={setActiveFeatureId} />
            <a className={styles.primaryButton} href={signupUrl}>
              {featuresBand.ctaLabel}
            </a>
          </div>

          <div
            className={styles.featureVisual}
            aria-hidden="true"
            data-reveal={reveal || undefined}
          >
            <FeatureVisual activeId={activeFeatureId} />
          </div>
        </div>
      </div>
    </section>
  );
}
