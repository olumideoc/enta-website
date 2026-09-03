"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  audienceCards,
  faqQuestions,
  footerColumns,
  footerSocialLinks,
  logoStrip,
} from "./entaWebsiteData";
import { CustomerReviews } from "./CustomerReviews";
import { DashboardLoop } from "./DashboardLoop";
import { DEFAULT_FEATURE_ID, FeatureAccordion } from "./FeatureAccordion";
import { FeatureVisual } from "./FeatureVisual";
import { FooterArrowIcon } from "./FooterArrowIcon";
import { FooterSocialIcon } from "./FooterSocialIcon";
import { SavingsCalculator } from "./savings/SavingsCalculator.tsx";
import styles from "./enta-website.module.css";

const cx = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(" ");

const navigationItems = [
  { label: "Individual", href: "#individual" },
  { label: "Business", href: "#business" },
  { label: "Security", href: "#security" },
] as const;

const signupUrl = "https://app.entashiga.io/signup";
const loginUrl = "https://app.entashiga.io/login";


function EntaLogo({
  label,
  business = false,
}: {
  label?: string;
  business?: boolean;
}) {
  return (
    <span
      className={cx(styles.logo, business && styles.logoBusiness)}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <Image
        className={styles.entaLogomark}
        src="/enta-website/enta-logomark.svg"
        alt=""
        width={23}
        height={24}
        priority
      />
      <Image
        className={styles.entaWordmark}
        src="/enta-website/enta-wordmark.svg"
        alt=""
        width={63}
        height={18}
        priority
      />
      {business && <small>BUSINESS</small>}
    </span>
  );
}

export function EntaWebsitePage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [darkNav, setDarkNav] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // The accordion owns which item is open; the page only relays it to the
  // visual so the loop beside the list always matches the open copy.
  const [activeFeatureId, setActiveFeatureId] = useState<string | null>(
    DEFAULT_FEATURE_ID,
  );

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setScrolled(window.scrollY >= 10);
        const dark = [...document.querySelectorAll<HTMLElement>("[data-nav-dark='true']")].some(
          (section) => {
            const rect = section.getBoundingClientRect();
            return rect.top <= 48 && rect.bottom >= 48;
          },
        );
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
    const video = heroVideoRef.current;
    if (!video) return;

    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let heroVisible = false;

    const syncPlayback = () => {
      if (document.hidden || motionPreference.matches || !heroVisible || menuOpen) {
        video.pause();
        return;
      }

      void video.play().catch(() => {
        // The poster remains visible if a browser blocks ambient autoplay.
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        heroVisible = entry?.isIntersecting ?? true;
        syncPlayback();
      },
      { threshold: 0.01 },
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
  }, [menuOpen]);

  useEffect(() => {
    const elements = rootRef.current?.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!elements) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add(styles.revealed);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    const menu = mobileMenuRef.current;
    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : menuButtonRef.current;
    const focusableElements = Array.from(
      menu?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? [],
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
    <div className={styles.page} ref={rootRef}>
      <header className={cx(styles.header, darkNav && styles.headerDark)}>
        <div className={styles.navRail}>
          <nav
            className={cx(styles.nav, scrolled && styles.navScrolled)}
            aria-label="Primary navigation"
          >
            <a className={styles.logoCrop} href="#top" aria-label="Enta home">
              <EntaLogo />
            </a>

            <div className={styles.desktopLinks}>
              {navigationItems.map((item) => (
                <a href={item.href} key={item.label}>
                  {item.label}
                </a>
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
            <a
              className={styles.mobileMenuRow}
              href={item.href}
              key={item.label}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}

          <div className={styles.mobileMenuBottom}>
            <a href={loginUrl}>Log in</a>
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

      <main id="top">
        <section className={styles.hero} aria-labelledby="enta-hero-title">
          <div className={styles.heroMedia} aria-hidden="true">
            <video
              ref={heroVideoRef}
              muted
              loop
              playsInline
              preload="auto"
              poster="/enta-website/enta-landing/hero-background-poster.jpg"
              disablePictureInPicture
              tabIndex={-1}
            >
              <source
                src="/enta-website/enta-landing/hero-background-loop.mp4"
                type="video/mp4"
              />
            </video>
          </div>
          <div className={styles.heroContainer}>
            <div className={styles.heroCopy}>
              <h1 id="enta-hero-title">
                <span>Preserve it.</span>
                <span>Move it. Own it.</span>
              </h1>
              <p>
                Receive to your local bank account. Send it across borders. Hold it in
                Bitcoin. Store it in gold without selling, and without giving up control.
              </p>
            </div>

            <div className={styles.heroActions}>
              <a className={styles.primaryButton} href={signupUrl}>
                Get started
              </a>
              <a className={styles.heroSecondaryButton} href="#individual">
                Know more
              </a>
            </div>
          </div>
        </section>

        <section className={styles.featuredSection} aria-label="Enta product and partners">
          <div className={styles.snapshotGrid}>
            <div className={styles.dashboardFrame}>
              <DashboardLoop />
            </div>
            <div className={styles.snapshotFade} />
          </div>

          <div className={styles.logoSection} aria-label="Enta partners">
            <div className={styles.logoWindow}>
              <div className={styles.logoTrack}>
                {[0, 1].map((groupIndex) => (
                  <div
                    className={styles.logoGroup}
                    aria-hidden={groupIndex === 1}
                    key={groupIndex}
                  >
                    {logoStrip.map(([name, src, width, height]) => (
                      <Image
                        key={`${groupIndex}-${name}`}
                        src={src}
                        alt={groupIndex === 0 ? name : ""}
                        width={width}
                        height={height}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.audienceSection} id="individual">
          <div className={styles.audienceInner}>
            <h2 data-reveal>Two offerings built for where you’re at</h2>

            <div className={styles.audienceCards}>
              {audienceCards.map((card) => (
                <article
                  className={cx(
                    styles.audienceCard,
                    card.tone === "business"
                      ? styles.audienceCardBusiness
                      : styles.audienceCardIndividual,
                  )}
                  id={card.tone === "business" ? "business" : undefined}
                  key={card.label}
                  data-reveal
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className={styles.audienceBackground}
                    src={card.background}
                    alt=""
                    width={452}
                    height={254}
                  />
                  <h3>{card.title}</h3>
                  <div className={styles.audienceArtwork}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={card.artwork} alt="" width={418} height={236} />
                  </div>
                  <a href={signupUrl}>
                    <span>{card.label}</span>
                    <Image
                      src="/enta-website/enta-landing/button-caret-right.svg"
                      alt=""
                      width={17}
                      height={17}
                    />
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.featuresSection}>
          <div className={styles.featuresInner}>
            <div className={styles.sectionHeading} data-reveal>
              <h2>Send, buy and hold digital dollars, gold and Bitcoin</h2>
              <p>
                One account for the money you&apos;re moving and the assets you&apos;re
                keeping.
              </p>
            </div>

            <div className={styles.featuresBody}>
              <div className={styles.featureList} data-reveal>
                <FeatureAccordion onActiveChange={setActiveFeatureId} />
                <a className={styles.primaryButton} href={signupUrl}>
                  Get started
                </a>
              </div>

              <div className={styles.featureVisual} aria-hidden="true" data-reveal>
                <FeatureVisual activeId={activeFeatureId} />
              </div>
            </div>
          </div>
        </section>

        <section className={styles.savingsSection}>
          <div className={styles.savingsInner}>
            <SavingsCalculator />

            <div className={styles.savingsCta} data-reveal>
              <div>
                <h3>
                  The same savings can end very differently depending on where they’re held.
                </h3>
                <p>Give your savings better options with Enta.</p>
              </div>
              <a className={styles.primaryButton} href={signupUrl}>
                Create account
                <Image
                  src="/enta-website/enta-landing/cta-arrow.svg"
                  alt=""
                  width={20}
                  height={20}
                />
              </a>
            </div>
          </div>
        </section>

        <CustomerReviews />

        <section className={styles.securitySection} id="security">
          <Image
            className={styles.securityGridTop}
            src="/enta-website/enta-landing/security-grid-decoration.png"
            loading="eager"
            alt=""
            width={1440}
            height={70}
          />
          <div className={styles.securityInner}>
            <div className={styles.securityHeading} data-reveal>
              <h2>Security that protects you. Intelligence that helps you.</h2>
              <a className={styles.primaryButton} href="#security-panel">
                Explore security
                <Image
                  src="/enta-website/enta-landing/cta-arrow.svg"
                  loading="eager"
                  alt=""
                  width={20}
                  height={20}
                />
              </a>
            </div>

            <div className={styles.securityPanel} id="security-panel" data-reveal>
              <div className={styles.securityIllustration} aria-hidden="true" />
              <div className={styles.securityBenefits}>
                <article>
                  <div className={styles.securityIcon}>
                    <Image
                      src="/enta-website/enta-landing/security-fingerprint.svg"
                      loading="eager"
                      alt=""
                      width={40}
                      height={40}
                    />
                  </div>
                  <h3>Only you can get in</h3>
                  <p>
                    Use your passkey to access your account. If you lose your phone, you can
                    recover it securely—without giving anyone else access.
                  </p>
                </article>

                <article>
                  <div className={styles.securityIcon}>
                    <Image
                      src="/enta-website/enta-landing/security-eyes.svg"
                      loading="eager"
                      alt=""
                      width={40}
                      height={40}
                    />
                  </div>
                  <h3>A second look before you pay</h3>
                  <p>
                    We’ll highlight favourable rates and flag details worth checking, like
                    an incorrect address or an unexpected fee. You always make the final
                    call.
                  </p>
                </article>
              </div>
            </div>
          </div>
          <Image
            className={styles.securityGridBottom}
            src="/enta-website/enta-landing/security-grid-decoration.png"
            loading="eager"
            alt=""
            width={1440}
            height={70}
          />
        </section>

        <section className={styles.faqSection}>
          <div className={styles.faqInner}>
            <h2 data-reveal>FAQs</h2>
            <div className={styles.faqList} data-reveal>
              {faqQuestions.map((question) => (
                <div className={styles.faqRow} key={question}>
                  <Image
                    src="/enta-website/enta-landing/faq-chevron.png"
                    loading="eager"
                    alt=""
                    width={14}
                    height={6}
                  />
                  <h3>{question}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer} data-nav-dark="true">
        <div className={styles.footerInner}>
          <div className={styles.footerMain}>
            <div className={styles.footerBrand}>
              <EntaLogo label="Enta" />
              <p>Money that works everywhere you do</p>
              <a href="mailto:hello@entashiga.io">hello@entashiga.io</a>
            </div>

            <div className={styles.footerLinks}>
              {footerColumns.map((column) => (
                <div className={styles.footerColumn} key={column.title}>
                  <h3>{column.title}</h3>
                  {column.links.map((link) => {
                    const isExternal = "external" in link && link.external;
                    const content = (
                      <>
                        {link.label}
                        {isExternal && <FooterArrowIcon />}
                      </>
                    );

                    return link.href ? (
                      <a
                        href={link.href}
                        key={link.label}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                      >
                        {content}
                      </a>
                    ) : (
                      <span key={link.label}>{content}</span>
                    );
                  })}
                </div>
              ))}

              <div className={styles.footerColumn}>
                <h3>Connect</h3>
                <div className={styles.socialLinks}>
                  {footerSocialLinks.map((social) => (
                    <a
                      href={social.href}
                      aria-label={social.label}
                      key={social.label}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FooterSocialIcon name={social.icon} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <span>©2026 Enta</span>
            <div aria-label="Legal information">
              <span>Terms of Use</span>
              <i aria-hidden="true" />
              <span>Privacy Policy</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
