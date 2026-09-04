import Link from "next/link";
import { FooterArrowIcon } from "./FooterArrowIcon";
import { FooterSocialIcon } from "./FooterSocialIcon";
import { footerColumns, footerSocialLinks } from "./entaWebsiteData";
import styles from "./enta-website.module.css";
import { EntaLogo } from "./EntaLogo";

type EntaSiteFooterProps = {
  /** Label of the footer link for the page being shown, if it has one. */
  currentLabel?: string;
};

/** The footer every page outside the landing page shares. */
export function EntaSiteFooter({ currentLabel }: EntaSiteFooterProps) {
  return (
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

                  if (!link.href) {
                    return <span key={link.label}>{content}</span>;
                  }

                  // A link to one of this site's own routes goes through
                  // next/link, the way the header's do, so the footer changes
                  // page without reloading the document.
                  if (!isExternal && link.href.startsWith("/")) {
                    return (
                      <Link
                        href={link.href}
                        key={link.label}
                        aria-current={
                          link.label === currentLabel ? "page" : undefined
                        }
                      >
                        {content}
                      </Link>
                    );
                  }

                  return (
                    <a
                      href={link.href}
                      key={link.label}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      aria-current={link.label === currentLabel ? "page" : undefined}
                    >
                      {content}
                    </a>
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

        <div
          className={[
            styles.footerBottom,
            styles.footerBottomAccessible,
          ].join(" ")}
        >
          <span>©2026 Enta</span>
          <div aria-label="Legal information">
            <span>Terms of Use</span>
            <i aria-hidden="true" />
            <span>Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
