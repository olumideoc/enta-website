"use client";

import { useEffect, useRef } from "react";

type EntaSkyProps = {
  /** Class that gives the backdrop its box: the geometry is per page. */
  className?: string;
  /** Class for the video itself, so each page can set its own crop. */
  videoClassName?: string;
};

/**
 * The looping sky behind a page hero. Shared by the changelog and the security
 * page; each one supplies its own geometry through the two class names.
 */
export function EntaSky({ className, videoClassName }: EntaSkyProps) {
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
    <div className={className} aria-hidden="true">
      <video
        ref={videoRef}
        className={videoClassName}
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
