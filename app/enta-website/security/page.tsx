import type { Metadata } from "next";
import Image from "next/image";
import capTrim from "../cap-trim.module.css";
import entaStyles from "../enta-website.module.css";
import tileStyles from "../icon-tile.module.css";
import { EntaSiteFooter } from "../EntaSiteFooter";
import { EntaSiteHeader } from "../EntaSiteHeader";
import { EntaSky } from "../EntaSky";
import { MaskIcon } from "./MaskIcon";
import { SecurityRecovery } from "./SecurityRecovery";
import styles from "./security.module.css";
import {
  boundariesHeading,
  cannotFootnote,
  cannotPoints,
  cannotTitle,
  doPoints,
  doTitle,
  heroBody,
  heroHeading,
  heroLinkLabel,
  passkeyBody,
  passkeyHeading,
  passkeyPoints,
  recoveryBody,
  recoveryHeading,
  resourceItems,
  resourcesHeading,
  securityDescription,
} from "./securityData";

const title = "Security | Enta";

export const metadata: Metadata = {
  title,
  description: securityDescription,
  openGraph: {
    title,
    description: securityDescription,
    siteName: "Enta",
    type: "website",
    images: ["/enta-website/enta-dashboard-snapshot.png"],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: securityDescription,
    images: ["/enta-website/enta-dashboard-snapshot.png"],
  },
};

export default function SecurityPage() {
  return (
    <div className={`${entaStyles.page} ${styles.securityPage}`}>
      <a className={styles.skipLink} href="#main-content">
        Skip to content
      </a>
      <EntaSiteHeader activeHref="/enta-website/security" />

      <main id="main-content" className={styles.main} tabIndex={-1}>
        <section className={styles.hero} aria-labelledby="security-title">
          <EntaSky className={styles.heroMedia} videoClassName={styles.heroVideo} />
          <div className={styles.heroRail}>
            <div className={styles.heroCopy}>
              <h1 id="security-title">{heroHeading}</h1>
              <p>{heroBody}</p>
            </div>
            <a className={styles.secondaryButton} href="#passkey">
              {heroLinkLabel}
            </a>
          </div>
        </section>

        <section
          className={styles.passkeySection}
          id="passkey"
          aria-labelledby="passkey-title"
        >
          <div className={styles.passkeyInner}>
            <div className={styles.passkeyHeading}>
              <h2 id="passkey-title">{passkeyHeading}</h2>
              <p className={capTrim.capTrim}>{passkeyBody}</p>
            </div>

            <ul className={styles.passkeyPoints}>
              {passkeyPoints.map((point) => (
                <li className={styles.passkeyPoint} key={point.id}>
                  <span className={tileStyles.iconTile}>
                    <span className={tileStyles.iconTileFace}>
                      <MaskIcon src={point.icon} />
                    </span>
                  </span>
                  <h3>{point.title}</h3>
                  <p>{point.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          className={styles.boundariesSection}
          aria-labelledby="boundaries-title"
        >
          <div className={styles.boundariesInner}>
            <h2 id="boundaries-title">{boundariesHeading}</h2>

            <div className={styles.boundariesCard}>
              <div className={styles.boundariesColumn}>
                <div className={styles.boundariesHead}>
                  <MaskIcon src="/enta-website/security/cannot-x-circle.svg" />
                  <h3>{cannotTitle}</h3>
                </div>
                <ul className={styles.boundariesList}>
                  {cannotPoints.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <p className={styles.boundariesFootnote}>{cannotFootnote}</p>
              </div>

              <div className={styles.boundariesDivider} aria-hidden="true" />

              <div
                className={`${styles.boundariesColumn} ${styles.boundariesColumnDo}`}
              >
                <div className={styles.boundariesHead}>
                  <Image
                    src="/enta-website/security/do-check-circle.svg"
                    alt=""
                    width={20}
                    height={20}
                  />
                  <h3>{doTitle}</h3>
                </div>
                <ul className={styles.boundariesList}>
                  {doPoints.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section
          className={styles.recoverySection}
          aria-labelledby="recovery-title"
        >
          <div className={styles.recoveryInner}>
            <div className={styles.recoveryHeading}>
              <h2 id="recovery-title">{recoveryHeading}</h2>
              <p className={capTrim.capTrim}>{recoveryBody}</p>
            </div>

            <SecurityRecovery />
          </div>
        </section>

        <section
          className={styles.resourcesSection}
          aria-labelledby="resources-title"
        >
          <div className={styles.resourcesInner}>
            <h2 id="resources-title">{resourcesHeading}</h2>

            <div className={styles.resourcesCard}>
              <div className={styles.resourcesShield} aria-hidden="true">
                <Image
                  src="/enta-website/security/resources-shield.png"
                  alt=""
                  width={334}
                  height={334}
                />
              </div>

              <ul className={styles.resourceList}>
                {resourceItems.map((item) => {
                  const linkClass = item.capitalize
                    ? `${styles.resourceLink} ${styles.resourceLinkCapitalized}`
                    : styles.resourceLink;
                  const link = (
                    <>
                      <span>{item.linkLabel}</span>
                      <MaskIcon src="/enta-website/security/resource-link-arrow.svg" />
                    </>
                  );

                  return (
                    <li className={styles.resourceItem} key={item.id}>
                      <div>
                        <span className={tileStyles.iconTile}>
                          <span className={tileStyles.iconTileFace}>
                            <MaskIcon src={item.icon} />
                          </span>
                        </span>
                        <h3>{item.title}</h3>
                        <p>{item.body}</p>
                      </div>

                      {item.href ? (
                        <a className={linkClass} href={item.href}>
                          {link}
                        </a>
                      ) : (
                        <span className={linkClass}>{link}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </section>
      </main>

      <EntaSiteFooter currentLabel="Security" />
    </div>
  );
}
