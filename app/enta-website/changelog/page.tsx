import type { Metadata } from "next";
import Image from "next/image";
import entaStyles from "../enta-website.module.css";
import { EntaSiteFooter } from "../EntaSiteFooter";
import { EntaSiteHeader } from "../EntaSiteHeader";
import { EntaSky } from "../EntaSky";
import styles from "./changelog.module.css";
import { changelogReleases } from "./entries";

const changelogDescription = "New features and improvements to Enta.";

export const metadata: Metadata = {
  title: "Changelog | Enta",
  description: changelogDescription,
  openGraph: {
    title: "Changelog | Enta",
    description: changelogDescription,
    siteName: "Enta",
    type: "website",
    images: ["/enta-website/enta-dashboard-snapshot.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Changelog | Enta",
    description: changelogDescription,
    images: ["/enta-website/enta-dashboard-snapshot.png"],
  },
};

export default function ChangelogPage() {
  return (
    <div className={entaStyles.page}>
      <a className={styles.skipLink} href="#main-content">
        Skip to content
      </a>
      <EntaSiteHeader />

      <main id="main-content" className={styles.main} tabIndex={-1}>
        <section className={styles.hero} aria-labelledby="changelog-title">
          <EntaSky className={styles.heroMedia} videoClassName={styles.heroVideo} />
          <div className={styles.heroRail}>
            <h1 id="changelog-title">Changelog</h1>
            <p>{changelogDescription}</p>
          </div>
        </section>

        <section className={styles.feed} aria-label="Enta release notes">
          <div className={styles.feedRail}>
            {changelogReleases.map((release) => (
              <section
                className={styles.release}
                aria-labelledby={"release-" + release.id}
                key={release.id}
              >
                <h2
                  id={"release-" + release.id}
                  className={styles.releaseDate}
                >
                  <time dateTime={release.dateTime}>{release.date}</time>
                </h2>

                <div className={styles.releaseEntries}>
                  {release.entries.map((entry) => (
                    <article
                      className={styles.entry}
                      key={release.id + "-" + entry.title}
                    >
                      <p className={styles.entryType}>{entry.type}</p>
                      <h3>{entry.title}</h3>

                      {entry.media ? (
                        <figure className={styles.entryMedia}>
                          <Image
                            src={entry.media.src}
                            alt={entry.media.alt}
                            width={entry.media.width}
                            height={entry.media.height}
                            sizes="(max-width: 809px) calc(100vw - 40px), 740px"
                          />
                        </figure>
                      ) : null}

                      <p className={styles.entryDescription}>
                        {entry.description}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>
      </main>

      <EntaSiteFooter currentLabel="Changelog" />
    </div>
  );
}
