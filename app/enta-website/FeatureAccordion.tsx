"use client";

import {
  type KeyboardEvent,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { featureItems } from "./entaWebsiteData";
import styles from "./enta-website.module.css";

const cx = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(" ");

/** How long an item stays open before autoplay moves to the next one. */
export const STEP_MS = 5000;

// Items still waiting on copy render as plain labels, so only the ones that can
// open take part in the roving arrow-key order.
const expandableItems = featureItems.filter((item) => item.description !== null);

/** The item the list opens with, so the visual can match it on first paint. */
export const DEFAULT_FEATURE_ID = expandableItems[0]?.id ?? null;

// An item with a loop dwells for exactly one pass of it, so the flow the copy
// describes finishes before autoplay moves on.
const stepMsFor = (id: string | null) =>
  featureItems.find((item) => item.id === id)?.media?.durationMs ?? STEP_MS;

type FeatureAccordionProps = {
  /** Fires with the open item's id, including the one open on mount. */
  onActiveChange?: (id: string) => void;
};

export function FeatureAccordion({ onActiveChange }: FeatureAccordionProps) {
  const baseId = useId();
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  // The list element belongs to the page, not to this component, so the hover /
  // focus / visibility checks read it back off the first item.
  const listRef = useRef<HTMLElement | null>(null);
  const fillRefs = useRef<Record<string, HTMLSpanElement | null>>({});
  // Exactly one panel is open at all times: clicking the open item only restarts
  // its progress, so the list never collapses to bare labels.
  const [openId, setOpenId] = useState(expandableItems[0]?.id ?? null);
  // Starts true so the first client render matches the server, then the effect
  // below turns the fill off for anyone who asked for reduced motion.
  const [motionOk, setMotionOk] = useState(true);
  const openIdRef = useRef(openId);
  const elapsedRef = useRef(0);

  const captureList = useCallback((node: HTMLDivElement | null) => {
    listRef.current = node?.parentElement ?? null;
  }, []);

  const openItem = useCallback((id: string) => {
    openIdRef.current = id;
    // Opening always restarts the step, including re-opening the open item.
    elapsedRef.current = 0;
    fillRefs.current[id]?.style.setProperty("--feature-progress", "0");
    setOpenId(id);
  }, []);

  useEffect(() => {
    if (openId) onActiveChange?.(openId);
  }, [openId, onActiveChange]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setMotionOk(!query.matches);

    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const list = listRef.current;
    if (!motionOk || !list || expandableItems.length < 2) return;

    // Every reason to stop is a flag rather than a cleared timer, so the fill
    // holds its position and carries on from there once they all clear.
    const paused = { pointer: false, hidden: document.hidden, offscreen: true };
    let frame = 0;
    let previous = 0;
    elapsedRef.current = 0;

    // A mouse click focuses the trigger without matching :focus-visible, so only
    // keyboard focus freezes the step; a click leaves autoplay running.
    const keyboardFocusInside = () => {
      const active = document.activeElement;
      if (!(active instanceof HTMLElement) || !list.contains(active)) return false;
      return active.matches(":focus-visible");
    };

    const tick = (now: number) => {
      frame = window.requestAnimationFrame(tick);
      const delta = previous === 0 ? 0 : now - previous;
      previous = now;
      if (paused.pointer || paused.hidden || paused.offscreen || keyboardFocusInside()) {
        return;
      }

      const stepMs = stepMsFor(openIdRef.current);
      elapsedRef.current += delta;
      if (elapsedRef.current >= stepMs) {
        const index = expandableItems.findIndex((item) => item.id === openIdRef.current);
        const next = expandableItems[(index + 1) % expandableItems.length];
        if (next) {
          openItem(next.id);
          return;
        }
        elapsedRef.current = 0;
      }

      fillRefs.current[openIdRef.current ?? ""]?.style.setProperty(
        "--feature-progress",
        (elapsedRef.current / stepMs).toFixed(4),
      );
    };

    const handlePointerEnter = () => {
      paused.pointer = true;
    };
    const handlePointerLeave = () => {
      paused.pointer = false;
    };
    const handleVisibility = () => {
      paused.hidden = document.hidden;
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        paused.offscreen = !(entry?.isIntersecting ?? false);
      },
      { threshold: 0.35 },
    );

    observer.observe(list);
    list.addEventListener("pointerenter", handlePointerEnter);
    list.addEventListener("pointerleave", handlePointerLeave);
    document.addEventListener("visibilitychange", handleVisibility);
    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      list.removeEventListener("pointerenter", handlePointerEnter);
      list.removeEventListener("pointerleave", handlePointerLeave);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [motionOk, openItem]);

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const count = expandableItems.length;
    const target =
      event.key === "ArrowDown"
        ? index + 1
        : event.key === "ArrowUp"
          ? index - 1
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? count - 1
              : null;
    if (target === null || count === 0) return;

    event.preventDefault();
    buttonRefs.current[((target % count) + count) % count]?.focus();
  };

  return (
    <>
      {featureItems.map((item, itemIndex) => {
        const listRefProp = itemIndex === 0 ? captureList : undefined;

        if (item.description === null) {
          return (
            <div className={styles.featureItem} ref={listRefProp} key={item.id}>
              <div className={styles.featureLabel}>{item.label}</div>
            </div>
          );
        }

        const index = expandableItems.indexOf(item);
        const open = openId === item.id;
        const buttonId = `${baseId}-${item.id}-label`;
        const panelId = `${baseId}-${item.id}-panel`;

        return (
          <div className={styles.featureItem} ref={listRefProp} key={item.id}>
            <h3 className={styles.featureLabel}>
              <button
                className={styles.featureTrigger}
                ref={(node) => {
                  buttonRefs.current[index] = node;
                }}
                type="button"
                id={buttonId}
                aria-controls={panelId}
                aria-expanded={open}
                onClick={() => openItem(item.id)}
                onKeyDown={(event) => handleKeyDown(event, index)}
              >
                {item.label}
              </button>
            </h3>
            <div
              className={cx(styles.featurePanel, open && styles.featurePanelOpen)}
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              aria-hidden={!open}
            >
              <div className={styles.featurePanelInner}>
                <p>{item.description}</p>
              </div>
            </div>
            {open && motionOk ? (
              <span
                className={styles.featureProgress}
                ref={(node) => {
                  fillRefs.current[item.id] = node;
                  return () => {
                    fillRefs.current[item.id] = null;
                  };
                }}
                aria-hidden="true"
              />
            ) : null}
          </div>
        );
      })}
    </>
  );
}
