import type { CSSProperties } from "react";
import styles from "./security.module.css";

const cx = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(" ");

type MaskIconProps = {
  /** Path to the exported single-colour SVG under /enta-website/security/. */
  src: string;
  className?: string;
};

/**
 * Paints one of the exported glyphs through a colour token instead of an <img>,
 * so every icon on the page follows the theme the way the text does.
 */
export function MaskIcon({ src, className }: MaskIconProps) {
  return (
    <span
      className={cx(styles.maskIcon, className)}
      style={{ "--sec-glyph": `url("${src}")` } as CSSProperties}
      aria-hidden="true"
    />
  );
}
