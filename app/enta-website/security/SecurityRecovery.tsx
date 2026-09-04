"use client";

import { useState } from "react";
import entaStyles from "../enta-website.module.css";
import { defaultFeatureId, FeatureAccordion } from "../FeatureAccordion";
import { FeatureVisualLayer } from "../FeatureVisual";
import { recoveryItems, recoveryLinkLabel } from "./securityData";
import styles from "./security.module.css";

const signupUrl = "https://app.entashiga.io/signup";

/**
 * The recovery list and the frame beside it. The list is the landing page's
 * accordion with its own rows, and the frame holds the Figma glow as its
 * resting state; a loop added to a row stacks over the glow and plays while
 * that row is open, exactly as the landing page's frame does.
 */
export function SecurityRecovery() {
  const [activeId, setActiveId] = useState(defaultFeatureId(recoveryItems));

  return (
    <div className={entaStyles.featuresBody}>
      <div className={`${entaStyles.featureList} ${styles.recoveryList}`}>
        <FeatureAccordion items={recoveryItems} onActiveChange={setActiveId} />
        <a className={entaStyles.primaryButton} href={signupUrl}>
          {recoveryLinkLabel}
        </a>
      </div>

      <div
        className={`${entaStyles.featureVisual} ${styles.recoveryPanel}`}
        aria-hidden="true"
      >
        <span className={styles.recoveryGlow} />
        {recoveryItems.map((item) =>
          item.media ? (
            <FeatureVisualLayer
              media={item.media}
              active={item.id === activeId}
              key={item.id}
            />
          ) : null,
        )}
      </div>
    </div>
  );
}
