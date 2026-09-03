/** Display helpers for the savings calculator. */

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

function trimZero(value: string): string {
  return value.endsWith(".0") ? value.slice(0, -2) : value;
}

/** Digits with thousands separators, no symbol: "600,000". */
export function formatGrouped(amount: number): string {
  return Math.round(amount).toLocaleString("en-US");
}

const COMPACT_UNITS = [
  { divisor: 1e9, suffix: "B" },
  { divisor: 1e6, suffix: "M" },
  { divisor: 1e3, suffix: "k" },
] as const;

/** Row values, compact, symbol as given: "₦21.6M", "E£1.2M", "GH₵850k", "KSh3.4M". */
export function formatLocalCompact(amount: number, symbol: string): string {
  const size = Math.abs(amount);
  const sign = amount < 0 ? "-" : "";

  for (let index = 0; index < COMPACT_UNITS.length; index += 1) {
    const unit = COMPACT_UNITS[index];
    if (size < unit.divisor) continue;

    const text = trimZero((size / unit.divisor).toFixed(1));
    // Rounding can push a figure into the next unit: 999,960 reads 1M, not 1000k.
    if (text === "1000" && index > 0) {
      const larger = COMPACT_UNITS[index - 1];
      const promoted = trimZero((size / larger.divisor).toFixed(1));
      return `${sign}${symbol}${promoted}${larger.suffix}`;
    }
    return `${sign}${symbol}${text}${unit.suffix}`;
  }

  return `${sign}${symbol}${formatGrouped(size)}`;
}

/** Baseline row label, from the currency noun: "Held in Naira", "Held in Cedis". */
export function formatBaselineLabel(noun: string): string {
  return `Held in ${noun.charAt(0).toUpperCase()}${noun.slice(1)}`;
}

/** Percentage pill: "+29%", "-4%", "0%". */
export function formatPercent(value: number): string {
  const rounded = Math.round(value);
  return `${rounded > 0 ? "+" : ""}${rounded}%`;
}

/** "2023-09" to "Sep 2023". */
export function formatMonthLabel(month: string): string {
  const [year, index] = month.split("-");
  const name = MONTH_NAMES[Number(index) - 1];
  return name ? `${name} ${year}` : month;
}

/** Keeps only digits, so a pasted "₦1,000" still reads as 1000. */
export function parseAmountInput(value: string): number | null {
  const digits = value.replace(/[^0-9]/g, "");
  if (digits === "") return null;
  return Number(digits);
}
