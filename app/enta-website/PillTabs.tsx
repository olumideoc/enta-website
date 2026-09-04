"use client";

import Image from "next/image";
import {
  type CSSProperties,
  type KeyboardEvent,
  useId,
  useRef,
  useState,
} from "react";
import styles from "./pill-tabs.module.css";

const cx = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(" ");

/** The green check the individual page and the business page both point at. */
const defaultCheckIcon = "/enta-website/security/do-check-circle.svg";

export type PillTab = {
  id: string;
  /** Pill label, verbatim from Figma. */
  label: string;
  /** Line version of the glyph, shown while the pill is not selected. */
  icon: string;
  /** Solid version of the glyph, shown while the pill is selected. */
  iconActive: string;
  heading: string;
  body: string;
  /** Check bullets under the copy. A panel carries these or an action. */
  points?: readonly string[];
  /** Outlined button at the foot of the copy, instead of the bullets. */
  action?: { label: string; href: string };
};

type PillTabsProps = {
  tabs: readonly PillTab[];
  heading: string;
  /** id put on the heading so the section can be labelled by it. */
  headingId: string;
  /** Names the pill row for a screen reader; the pills read as tabs. */
  tabListLabel: string;
  /** Overrides the green check beside a bullet. */
  checkIcon?: string;
};

/**
 * The heading, the row of pills and the card under them.
 *
 * Click only: nothing advances on its own. The pills are a WAI-ARIA tab list,
 * so the left and right arrows move between them, Home and End jump to the
 * ends, and only the selected pill is in the tab order.
 *
 * All panels stay mounted in one grid cell, which is what keeps the card from
 * resizing when the panel changes: the card is always as tall as the tallest
 * panel, at every width, without a measured height anywhere.
 *
 * A panel ends either in a list of check bullets, the way the individual page
 * draws all four of its panels, or in one outlined button, the way the
 * business page draws all four of its. Pass whichever the frame shows.
 */
export function PillTabs({
  tabs,
  heading,
  headingId,
  tabListLabel,
  checkIcon = defaultCheckIcon,
}: PillTabsProps) {
  const baseId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [selected, setSelected] = useState(0);

  const tabId = (index: number) => `${baseId}-${tabs[index].id}-tab`;
  const panelId = (index: number) => `${baseId}-${tabs[index].id}-panel`;

  // Selection follows the arrow keys, which is the pattern for tab panels this
  // light: the copy is already on the page, so there is nothing to defer.
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const count = tabs.length;
    const target =
      event.key === "ArrowRight"
        ? selected + 1
        : event.key === "ArrowLeft"
          ? selected - 1
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? count - 1
              : null;
    if (target === null) return;

    event.preventDefault();
    const next = ((target % count) + count) % count;
    setSelected(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className={styles.tabs}>
      <div className={styles.head}>
        <h2 id={headingId}>{heading}</h2>

        <div className={styles.tabList} role="tablist" aria-label={tabListLabel}>
          {tabs.map((tab, index) => {
            const current = index === selected;
            return (
              <button
                className={cx(styles.tab, current && styles.tabSelected)}
                ref={(node) => {
                  tabRefs.current[index] = node;
                }}
                key={tab.id}
                type="button"
                role="tab"
                id={tabId(index)}
                aria-controls={panelId(index)}
                aria-selected={current}
                tabIndex={current ? 0 : -1}
                onClick={() => setSelected(index)}
                onKeyDown={handleKeyDown}
              >
                <span
                  className={styles.tabIcon}
                  style={
                    {
                      "--pill-glyph": `url("${current ? tab.iconActive : tab.icon}")`,
                    } as CSSProperties
                  }
                  aria-hidden="true"
                />
                {/*
                  The label is set twice in one grid cell: a hidden semibold
                  copy holds the width, so a pill neither grows nor nudges its
                  neighbours along the row when it becomes the selected one.
                */}
                <span className={styles.tabLabel}>
                  <span className={styles.tabLabelGhost} aria-hidden="true">
                    {tab.label}
                  </span>
                  <span>{tab.label}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.card}>
        {tabs.map((tab, index) => {
          const current = index === selected;
          return (
            <div
              className={cx(styles.panel, current && styles.panelActive)}
              key={tab.id}
              id={panelId(index)}
              role="tabpanel"
              aria-labelledby={tabId(index)}
              tabIndex={current ? 0 : -1}
            >
              <div
                className={cx(
                  styles.panelCopy,
                  tab.action && styles.panelCopyAction,
                )}
              >
                <div className={styles.panelIntro}>
                  <h3>{tab.heading}</h3>
                  <p>{tab.body}</p>
                </div>

                {tab.points ? (
                  <ul className={styles.panelPoints}>
                    {tab.points.map((point) => (
                      <li key={point}>
                        <Image src={checkIcon} alt="" width={20} height={20} />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {tab.action ? (
                  <a
                    className={styles.panelAction}
                    href={tab.action.href}
                    // Every panel stays mounted, so the three that are not on
                    // screen are taken out of the tab order with the rest of
                    // their panel rather than left focusable behind it.
                    tabIndex={current ? undefined : -1}
                  >
                    {tab.action.label}
                  </a>
                ) : null}
              </div>

              <div className={styles.panelVisual} aria-hidden="true">
                <span className={styles.panelGlow}>
                  <span />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
