import type { CSSProperties } from "react";
import styles from "./business.module.css";

const cx = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(" ");

type MaskIconProps = {
  /** Path to the exported single-colour SVG the glyph is drawn from. */
  src: string;
  className?: string;
};

/**
 * Paints one of the exported glyphs through the current text colour instead of
 * an <img>, so the four column icons and the caret inside each card button all
 * follow the theme the way the text beside them does. Same idea as the
 * security page's MaskIcon, with this page's own variable.
 */
export function MaskIcon({ src, className }: MaskIconProps) {
  return (
    <span
      className={cx(styles.maskIcon, className)}
      style={{ "--bus-glyph": `url("${src}")` } as CSSProperties}
      aria-hidden="true"
    />
  );
}
