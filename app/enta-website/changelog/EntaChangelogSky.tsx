"use client";

import { useEffect, useRef } from "react";
import styles from "./changelog.module.css";

export function EntaChangelogSky() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let isInView = true;

    const syncPlayback = () => {
      if (reducedMotion.matches || document.hidden || !isInView) {
        video.pause();
        return;
      }

      void video.play().catch(() => {
        // The poster remains visible when a browser declines autoplay.
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isInView = entry.isIntersecting;
        syncPlayback();
      },
      { threshold: 0.05 },
    );

    observer.observe(video);
    reducedMotion.addEventListener("change", syncPlayback);
    document.addEventListener("visibilitychange", syncPlayback);
    syncPlayback();

    return () => {
      observer.disconnect();
      reducedMotion.removeEventListener("change", syncPlayback);
      document.removeEventListener("visibilitychange", syncPlayback);
    };
  }, []);

  return (
    <div className={styles.heroMedia} aria-hidden="true">
      <video
        ref={videoRef}
        className={styles.heroVideo}
        muted
        loop
        playsInline
        preload="metadata"
        poster="/enta-website/changelog/sky-poster.jpg"
        tabIndex={-1}
      >
        <source
          src="/enta-website/changelog/sky-loop.mp4"
          type="video/mp4"
        />
      </video>
    </div>
  );
}
