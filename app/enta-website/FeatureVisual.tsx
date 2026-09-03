"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { type FeatureItemMedia, featureItems } from "./entaWebsiteData";
import { useAmbientVideo } from "./useAmbientVideo";
import styles from "./enta-website.module.css";

const cx = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(" ");

/** Bumped whenever the loops are re-rendered, so browsers refetch them. */
const FEATURE_MEDIA_VERSION = "1";

/** webm plus mp4: the layer only gives up once neither one loads. */
const SOURCE_COUNT = 2;

function FeatureVisualLayer({
  media,
  active,
}: {
  media: FeatureItemMedia;
  active: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const failureCount = useRef(0);
  // A loop that has not been rendered yet leaves the layer transparent, so the
  // gradient underneath carries the frame instead of a blank box.
  const [failed, setFailed] = useState(false);
  const stem = `/enta-website/enta-landing/${media.basename}-light`;

  useEffect(() => {
    if (!active) return;
    // Taking over the frame restarts the loop, so the flow plays from the top
    // however the item was reached: a click, or autoplay moving on.
    const video = videoRef.current;
    if (video) video.currentTime = 0;
  }, [active]);

  useAmbientVideo(videoRef, { enabled: active && !failed });

  const handleSourceError = () => {
    failureCount.current += 1;
    if (failureCount.current >= SOURCE_COUNT) setFailed(true);
  };

  return (
    <video
      className={cx(
        styles.featureVisualLayer,
        active && !failed && styles.featureVisualLayerActive,
      )}
      ref={videoRef}
      muted
      loop
      playsInline
      preload={active ? "auto" : "metadata"}
      poster={`${stem}-poster.jpg?v=${FEATURE_MEDIA_VERSION}`}
      disablePictureInPicture
      aria-hidden="true"
      tabIndex={-1}
      onError={() => setFailed(true)}
    >
      <source
        src={`${stem}.webm?v=${FEATURE_MEDIA_VERSION}`}
        type="video/webm"
        onError={handleSourceError}
      />
      <source
        src={`${stem}.mp4?v=${FEATURE_MEDIA_VERSION}`}
        type="video/mp4"
        onError={handleSourceError}
      />
    </video>
  );
}

/**
 * The 700x400 frame beside the send / buy / hold list: one silent loop per item
 * stacked in place, with the open item's loop faded in and playing from zero.
 */
export function FeatureVisual({ activeId }: { activeId: string | null }) {
  return (
    <>
      <Image
        src="/enta-website/enta-landing/feature-visual.png"
        alt=""
        width={700}
        height={400}
      />
      {featureItems.map((item) =>
        item.media ? (
          <FeatureVisualLayer
            media={item.media}
            active={item.id === activeId}
            key={item.id}
          />
        ) : null,
      )}
    </>
  );
}
