"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "../enta-website.module.css";
import changelogStyles from "./changelog.module.css";
import { EntaLogo } from "./EntaLogo";

const navigationItems = [
  { label: "Individual", href: "/enta-website#individual" },
  { label: "Business", href: "/enta-website#business" },
  { label: "Security", href: "/enta-website#security" },
] as const;

const signupUrl = "https://app.entashiga.io/signup";
const loginUrl = "https://app.entashiga.io/login";

const cx = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(" ");

export function EntaChangelogHeader() {
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [darkNav, setDarkNav] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setScrolled(window.scrollY >= 10);
        const dark = [
          ...document.querySelectorAll<HTMLElement>("[data-nav-dark='true']"),
        ].some((section) => {
          const rect = section.getBoundingClientRect();
          return rect.top <= 48 && rect.bottom >= 48;
        });
        setDarkNav(dark);
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : menuButtonRef.current;
    const focusableElements = Array.from(
      mobileMenuRef.current?.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])",
      ) ?? [],
    );

    focusableElements[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        return;
      }

      if (event.key !== "Tab" || focusableElements.length === 0) return;

      const first = focusableElements[0];
      const last = focusableElements.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [menuOpen]);

  return (
    <>
      <header className={cx(styles.header, darkNav && styles.headerDark)}>
        <div className={styles.navRail}>
          <nav
            className={cx(styles.nav, scrolled && styles.navScrolled)}
            aria-label="Primary navigation"
          >
            <Link
              className={styles.logoCrop}
              href="/enta-website"
              aria-label="Enta home"
            >
              <EntaLogo />
            </Link>

            <div className={styles.desktopLinks}>
              {navigationItems.map((item) => (
                <Link href={item.href} key={item.label}>
                  {item.label}
                </Link>
              ))}
            </div>

            <div className={styles.navActions}>
              <a className={styles.openApp} href={loginUrl}>
                Log in
              </a>
              <a className={styles.primaryButton} href={signupUrl}>
                Get started
              </a>
              <button
                ref={menuButtonRef}
                className={styles.menuButton}
                type="button"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((open) => !open)}
              >
                <span />
                <span />
              </button>
            </div>
          </nav>
        </div>
      </header>

      <div
        className={cx(
          styles.mobileMenuBackdrop,
          menuOpen && styles.mobileMenuBackdropOpen,
        )}
        aria-hidden={!menuOpen}
      >
        <div
          ref={mobileMenuRef}
          className={styles.mobileMenu}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div className={styles.mobileMenuTop}>
            <EntaLogo label="Enta" />
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            >
              ×
            </button>
          </div>

          {navigationItems.map((item) => (
            <Link
              className={styles.mobileMenuRow}
              href={item.href}
              key={item.label}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          <div className={styles.mobileMenuBottom}>
            <a className={changelogStyles.mobileLogin} href={loginUrl}>
              Log in
            </a>
            <a
              className={styles.primaryButton}
              href={signupUrl}
              onClick={() => setMenuOpen(false)}
            >
              Get started
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
