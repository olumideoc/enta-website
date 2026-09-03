import Image from "next/image";
import styles from "../enta-website.module.css";

const cx = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(" ");

export function EntaLogo({
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
