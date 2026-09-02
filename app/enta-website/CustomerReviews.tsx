"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { customerReviews } from "./entaWebsiteData";
import styles from "./enta-website.module.css";

function ArrowIcon({ direction }: { direction: "previous" | "next" }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d={direction === "next" ? "M4 10h12M11 5l5 5-5 5" : "M16 10H4M9 5l-5 5 5 5"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CustomerReviews() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const syncEdges = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    const start = track.scrollLeft <= 1;
    const end = track.scrollLeft >= max - 1;
    setEdges((previous) =>
      previous.start === start && previous.end === end ? previous : { start, end },
    );
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    syncEdges();
    track.addEventListener("scroll", syncEdges, { passive: true });
    const observer = new ResizeObserver(syncEdges);
    observer.observe(track);

    return () => {
      track.removeEventListener("scroll", syncEdges);
      observer.disconnect();
    };
  }, [syncEdges]);

  const step = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;

    const cards = Array.from(track.children) as HTMLElement[];
    if (cards.length === 0) return;

    const max = track.scrollWidth - track.clientWidth;
    const origin = cards[0].offsetLeft;
    // Snap points: every card start that is reachable, plus the end of the track.
    const points = cards
      .map((card) => card.offsetLeft - origin)
      .filter((point) => point < max - 1)
      .concat(max);
    const here = track.scrollLeft;
    const target =
      direction > 0
        ? points.find((point) => point > here + 1) ?? max
        : [...points].reverse().find((point) => point < here - 1) ?? 0;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollTo({ left: target, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <section
      className={styles.reviewsSection}
      aria-labelledby="enta-reviews-title"
      data-nav-dark="true"
    >
      <div className={styles.reviewsInner}>
        <div className={styles.reviewsAside} data-reveal>
          <h2 id="enta-reviews-title">Don’t just take our word for it</h2>
          <div className={styles.reviewsArrows}>
            <button
              className={styles.reviewsArrow}
              type="button"
              aria-label="Previous reviews"
              aria-disabled={edges.start}
              onClick={() => step(-1)}
            >
              <ArrowIcon direction="previous" />
            </button>
            <button
              className={styles.reviewsArrow}
              type="button"
              aria-label="Next reviews"
              aria-disabled={edges.end}
              onClick={() => step(1)}
            >
              <ArrowIcon direction="next" />
            </button>
          </div>
        </div>

        <ul className={styles.reviewsTrack} ref={trackRef} aria-label="Customer reviews" data-reveal>
          {customerReviews.map((review) => (
            <li className={styles.reviewCard} key={review.name}>
              <figure>
                <blockquote>
                  <p>“{review.quote}”</p>
                </blockquote>
                <figcaption className={styles.reviewAuthor}>
                  <strong>{review.name}</strong>
                  <span className={styles.reviewRole}>{review.descriptor}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
