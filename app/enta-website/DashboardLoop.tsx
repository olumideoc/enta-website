"use client";

import { useRef } from "react";
import { useAmbientVideo } from "./useAmbientVideo";

/** Bumped whenever the loop is re-rendered, so browsers refetch it. */
const DASHBOARD_LOOP_VERSION = "6";

/** The product shot under the hero: a silent screen recording of the dashboard. */
export function DashboardLoop() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useAmbientVideo(videoRef);

  return (
    <video
      ref={videoRef}
      muted
      loop
      playsInline
      preload="metadata"
      poster={`/enta-website/enta-landing/dashboard-loop-poster.jpg?v=${DASHBOARD_LOOP_VERSION}`}
      disablePictureInPicture
      aria-label="Enta dashboard: quick actions, rate calculator and wallet"
      tabIndex={-1}
    >
      <source
        src={`/enta-website/enta-landing/dashboard-loop.webm?v=${DASHBOARD_LOOP_VERSION}`}
        type="video/webm"
      />
      <source
        src={`/enta-website/enta-landing/dashboard-loop.mp4?v=${DASHBOARD_LOOP_VERSION}`}
        type="video/mp4"
      />
    </video>
  );
}
