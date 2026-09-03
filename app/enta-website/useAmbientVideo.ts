"use client";

import { type RefObject, useEffect } from "react";

type AmbientVideoOptions = {
  /** Set false to hold the video paused regardless of where it sits on screen. */
  enabled?: boolean;
  /** How much of the video has to be on screen before it earns playback. */
  threshold?: number;
};

/**
 * Keeps a decorative, muted loop playing only while it is worth the battery:
 * on screen, on a foreground tab, and never for anyone who asked for reduced
 * motion — the poster stands in for the video then.
 */
export function useAmbientVideo(
  ref: RefObject<HTMLVideoElement | null>,
  { enabled = true, threshold = 0.25 }: AmbientVideoOptions = {},
) {
  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let visible = false;

    const syncPlayback = () => {
      if (document.hidden || motionPreference.matches || !visible || !enabled) {
        video.pause();
        return;
      }

      void video.play().catch(() => {
        // The poster remains visible if a browser blocks ambient autoplay.
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Compare the ratio rather than isIntersecting: a sliver of the video
        // still counts as intersecting, and a sliver is not worth playing.
        visible = (entry?.intersectionRatio ?? 1) >= threshold;
        syncPlayback();
      },
      { threshold },
    );

    observer.observe(video);
    video.addEventListener("canplay", syncPlayback);
    document.addEventListener("visibilitychange", syncPlayback);
    motionPreference.addEventListener("change", syncPlayback);
    syncPlayback();

    return () => {
      observer.disconnect();
      video.removeEventListener("canplay", syncPlayback);
      document.removeEventListener("visibilitychange", syncPlayback);
      motionPreference.removeEventListener("change", syncPlayback);
      video.pause();
    };
  }, [ref, enabled, threshold]);
}
