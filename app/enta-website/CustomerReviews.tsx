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
  // Target of the scroll currently in flight, so rapid clicks stack instead of
  // re-targeting the card the mid-animation scrollLeft happens to be sitting on.
  const pendingRef = useRef<number | null>(null);
  const settleRef = useRef<number | null>(null);
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

  const clearPending = useCallback(() => {
    pendingRef.current = null;
    if (settleRef.current !== null) {
      window.clearTimeout(settleRef.current);
      settleRef.current = null;
    }
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const handleScroll = () => {
      syncEdges();
      // Fallback for browsers without `scrollend`: a smooth scroll emits a scroll
      // event every frame, so 150 ms of silence means it finished or was interrupted.
      if (settleRef.current !== null) window.clearTimeout(settleRef.current);
      settleRef.current = window.setTimeout(clearPending, 150);
    };

    const handleResize = () => {
      clearPending();
      syncEdges();
    };

    syncEdges();
    track.addEventListener("scroll", handleScroll, { passive: true });
    track.addEventListener("scrollend", clearPending);
    track.addEventListener("pointerdown", clearPending, { passive: true });
    track.addEventListener("touchstart", clearPending, { passive: true });
    track.addEventListener("wheel", clearPending, { passive: true });
    const observer = new ResizeObserver(handleResize);
    observer.observe(track);

    return () => {
      track.removeEventListener("scroll", handleScroll);
      track.removeEventListener("scrollend", clearPending);
      track.removeEventListener("pointerdown", clearPending);
      track.removeEventListener("touchstart", clearPending);
      track.removeEventListener("wheel", clearPending);
      observer.disconnect();
      if (settleRef.current !== null) {
        window.clearTimeout(settleRef.current);
        settleRef.current = null;
      }
    };
  }, [clearPending, syncEdges]);

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
    const here = pendingRef.current ?? track.scrollLeft;
    const target =
      direction > 0
        ? points.find((point) => point > here + 1) ?? max
        : [...points].reverse().find((point) => point < here - 1) ?? 0;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    pendingRef.current = target;
    track.scrollTo({ left: target, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <div className={styles.reviewsFrame}>
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

          {/* role="list" is required: WebKit strips list semantics from a list styled with list-style: none. */}
          <ul
            className={styles.reviewsTrack}
            ref={trackRef}
            role="list"
            aria-label="Customer reviews"
            data-reveal
          >
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
    </div>
  );
}
