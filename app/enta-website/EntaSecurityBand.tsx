import Image from "next/image";
import { securityBand } from "./entaWebsiteData";
import styles from "./enta-website.module.css";

type EntaSecurityBandProps = {
  /**
   * Where "Explore security" goes: the panel just below on the landing page,
   * the security route from anywhere else.
   */
  exploreHref: string;
  /** id put on the section when a page links to it. */
  sectionId?: string;
  /** id put on the panel when the explore link points at it. */
  panelId?: string;
  /** id put on the heading when the page labels the section by it. */
  headingId?: string;
  /**
   * Marks the band's blocks for the landing page's scroll reveal. The other
   * pages that render this band run no observer, so they leave it off.
   */
  reveal?: boolean;
};

/**
 * The security band, as the landing page and the individual page both show it:
 * a grid decoration above and below, a heading with the explore link beside it,
 * and the illustration with its two points.
 */
export function EntaSecurityBand({
  exploreHref,
  sectionId,
  panelId,
  headingId,
  reveal,
}: EntaSecurityBandProps) {
  return (
    <section
      className={styles.securitySection}
      id={sectionId}
      aria-labelledby={headingId}
    >
      <Image
        className={styles.securityGridTop}
        src="/enta-website/enta-landing/security-grid-decoration.png"
        loading="eager"
        alt=""
        width={1440}
        height={70}
      />
      <div className={styles.securityInner}>
        <div className={styles.securityHeading} data-reveal={reveal || undefined}>
          <h2 id={headingId}>{securityBand.heading}</h2>
          <a className={styles.primaryButton} href={exploreHref}>
            {securityBand.ctaLabel}
            <Image
              src="/enta-website/enta-landing/cta-arrow.svg"
              loading="eager"
              alt=""
              width={20}
              height={20}
            />
          </a>
        </div>

        <div
          className={styles.securityPanel}
          id={panelId}
          data-reveal={reveal || undefined}
        >
          <div className={styles.securityIllustration} aria-hidden="true" />
          <div className={styles.securityBenefits}>
            {securityBand.points.map((point) => (
              <article key={point.title}>
                <div className={styles.securityIcon}>
                  <Image
                    src={point.icon}
                    loading="eager"
                    alt=""
                    width={40}
                    height={40}
                  />
                </div>
                <h3>{point.title}</h3>
                <p>{point.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
      <Image
        className={styles.securityGridBottom}
        src="/enta-website/enta-landing/security-grid-decoration.png"
        loading="eager"
        alt=""
        width={1440}
        height={70}
      />
    </section>
  );
}
