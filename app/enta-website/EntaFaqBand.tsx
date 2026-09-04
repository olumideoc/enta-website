import Image from "next/image";
import { faqQuestions, faqTitle } from "./entaWebsiteData";
import styles from "./enta-website.module.css";

type EntaFaqBandProps = {
  /** id put on the heading when the page labels the section by it. */
  headingId?: string;
  /**
   * Marks the band's blocks for the landing page's scroll reveal. The other
   * pages that render this band run no observer, so they leave it off.
   */
  reveal?: boolean;
};

/**
 * The FAQ band, as the landing page and the individual page both show it: the
 * title on the left and the four questions listed beside it.
 */
export function EntaFaqBand({ headingId, reveal }: EntaFaqBandProps) {
  return (
    <section className={styles.faqSection} aria-labelledby={headingId}>
      <div className={styles.faqInner}>
        <h2 id={headingId} data-reveal={reveal || undefined}>
          {faqTitle}
        </h2>
        <div className={styles.faqList} data-reveal={reveal || undefined}>
          {faqQuestions.map((question) => (
            <div className={styles.faqRow} key={question}>
              <Image
                src="/enta-website/enta-landing/faq-chevron.png"
                loading="eager"
                alt=""
                width={14}
                height={6}
              />
              <h3>{question}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
