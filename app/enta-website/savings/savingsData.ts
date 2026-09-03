/**
 * Dataset behind the savings calculator.
 *
 * 68 monthly rows, Jan 2021 to Aug 2026, split in two: one shared market series
 * (USD-denominated asset prices plus the CBN bill rate) and one FX series per
 * currency (local units per USD). Adding a currency is a data-only change.
 *
 * Provenance (from the data team's SOURCES.md):
 * - NGN per USD is a USDT/NGN basis. Sep 2023 to Aug 2026 (36 rows) is real
 *   Monierate Pro data: daily usdtngn composite candles aggregated to monthly
 *   averages. Monierate has no coverage before Sep 2023 and abokiFX went dark
 *   in Sep 2021, so 2021 to Aug 2023 is interpolated between 7 real dated
 *   anchors (N490 Jan 21, N700 May 21, N570 Sep 21, N710 Sep 22, N745 Dec 22,
 *   N755 Jan 23, N770 Jun 23). That gap is irreducible from public sources.
 *   Monierate changed methodology on 2026-03-17 (single source to trimmed
 *   mean); both eras are used as-is.
 * - Bitcoin: real first-of-month BTC/USD (Habrador dataset), May to Aug 2026
 *   tail from press snapshots.
 * - Gold: real monthly LBMA gold, USD/oz converted to USD/gram.
 * - T-bill: CBN 364-day benchmark, real reported points interpolated monthly.
 *   The only series that is not month-by-month primary. NGN is the only
 *   currency with a bill source, so the T-bills row is NGN-only.
 * - EGP, GHS and KES per USD are official reference rates, monthly averages,
 *   every month real and none interpolated. Each series carries its own source
 *   comment above it.
 *
 * NGN row counts: 36 Monierate, 7 anchors, 25 interpolated.
 */

/**
 * How a month's FX figure was obtained. "real" is the generic label for a
 * directly sourced month; NGN uses the finer "monierate" and "anchor" values.
 */
export type FxProvenance = "real" | "monierate" | "anchor" | "interpolated";

export type FxMonth = {
  /** Calendar month, "YYYY-MM". */
  readonly month: string;
  /** Units of local currency per USD. */
  readonly perUsd: number;
  readonly provenance: FxProvenance;
};

/** USD-denominated prices, shared by every currency, indexed by month. */
export type MarketMonth = {
  readonly month: string;
  readonly btcUsd: number;
  readonly goldUsdPerGram: number;
  /** CBN 364-day benchmark, annualised percent. */
  readonly tbillPct: number;
};

export type CurrencyCode = "NGN" | "EGP" | "GHS" | "KES";

export type SavingsCurrency = {
  readonly code: CurrencyCode;
  readonly symbol: string;
  readonly name: string;
  /** Lower-case plural used in copy: "vs naira", "Held in Cedis". */
  readonly noun: string;
  readonly flag: string;
  /** Monthly deposit the calculator opens on, roughly one dollar value across currencies. */
  readonly defaultMonthlyAmount: number;
  /** False until an FX series exists for the currency. */
  readonly available: boolean;
  /** Government bill benchmark, or null when the currency has no bill source. */
  readonly tbillSource: string | null;
  readonly series: readonly FxMonth[] | null;
};

export const marketSeries: readonly MarketMonth[] = [
  { month: "2021-01", btcUsd: 29112, goldUsdPerGram: 60.03, tbillPct: 1.2 },
  { month: "2021-02", btcUsd: 33087, goldUsdPerGram: 58.13, tbillPct: 2.76 },
  { month: "2021-03", btcUsd: 45093, goldUsdPerGram: 55.23, tbillPct: 4.32 },
  { month: "2021-04", btcUsd: 58725, goldUsdPerGram: 56.59, tbillPct: 5.88 },
  { month: "2021-05", btcUsd: 57303, goldUsdPerGram: 59.48, tbillPct: 7.44 },
  { month: "2021-06", btcUsd: 36929, goldUsdPerGram: 59.0, tbillPct: 9.0 },
  { month: "2021-07", btcUsd: 34856, goldUsdPerGram: 58.13, tbillPct: 8.33 },
  { month: "2021-08", btcUsd: 41870, goldUsdPerGram: 57.39, tbillPct: 7.67 },
  { month: "2021-09", btcUsd: 46920, goldUsdPerGram: 57.07, tbillPct: 7.0 },
  { month: "2021-10", btcUsd: 43718, goldUsdPerGram: 57.13, tbillPct: 6.33 },
  { month: "2021-11", btcUsd: 61374, goldUsdPerGram: 58.58, tbillPct: 5.67 },
  { month: "2021-12", btcUsd: 56973, goldUsdPerGram: 57.55, tbillPct: 5.0 },
  { month: "2022-01", btcUsd: 46208, goldUsdPerGram: 58.39, tbillPct: 5.5 },
  { month: "2022-02", btcUsd: 38500, goldUsdPerGram: 59.67, tbillPct: 6.0 },
  { month: "2022-03", btcUsd: 44355, goldUsdPerGram: 62.63, tbillPct: 6.5 },
  { month: "2022-04", btcUsd: 46282, goldUsdPerGram: 62.28, tbillPct: 7.0 },
  { month: "2022-05", btcUsd: 38469, goldUsdPerGram: 59.45, tbillPct: 7.5 },
  { month: "2022-06", btcUsd: 29799, goldUsdPerGram: 59.06, tbillPct: 8.0 },
  { month: "2022-07", btcUsd: 19269, goldUsdPerGram: 55.72, tbillPct: 8.83 },
  { month: "2022-08", btcUsd: 23314, goldUsdPerGram: 56.75, tbillPct: 9.67 },
  { month: "2022-09", btcUsd: 20127, goldUsdPerGram: 54.04, tbillPct: 10.5 },
  { month: "2022-10", btcUsd: 19312, goldUsdPerGram: 53.5, tbillPct: 11.33 },
  { month: "2022-11", btcUsd: 20485, goldUsdPerGram: 55.46, tbillPct: 12.17 },
  { month: "2022-12", btcUsd: 16967, goldUsdPerGram: 57.81, tbillPct: 13.0 },
  { month: "2023-01", btcUsd: 16625, goldUsdPerGram: 61.02, tbillPct: 4.5 },
  { month: "2023-02", btcUsd: 23724, goldUsdPerGram: 59.64, tbillPct: 4.8 },
  { month: "2023-03", btcUsd: 23647, goldUsdPerGram: 61.5, tbillPct: 5.1 },
  { month: "2023-04", btcUsd: 28411, goldUsdPerGram: 64.3, tbillPct: 5.4 },
  { month: "2023-05", btcUsd: 28092, goldUsdPerGram: 64.04, tbillPct: 5.7 },
  { month: "2023-06", btcUsd: 26820, goldUsdPerGram: 62.47, tbillPct: 6.0 },
  { month: "2023-07", btcUsd: 30590, goldUsdPerGram: 62.73, tbillPct: 7.17 },
  { month: "2023-08", btcUsd: 29676, goldUsdPerGram: 61.7, tbillPct: 8.33 },
  { month: "2023-09", btcUsd: 25801, goldUsdPerGram: 61.6, tbillPct: 9.5 },
  { month: "2023-10", btcUsd: 27984, goldUsdPerGram: 61.6, tbillPct: 10.67 },
  { month: "2023-11", btcUsd: 35437, goldUsdPerGram: 63.79, tbillPct: 11.83 },
  { month: "2023-12", btcUsd: 38689, goldUsdPerGram: 65.14, tbillPct: 13.0 },
  { month: "2024-01", btcUsd: 44167, goldUsdPerGram: 65.39, tbillPct: 12.0 },
  { month: "2024-02", btcUsd: 43076, goldUsdPerGram: 65.04, tbillPct: 16.5 },
  { month: "2024-03", btcUsd: 62441, goldUsdPerGram: 69.38, tbillPct: 21.0 },
  { month: "2024-04", btcUsd: 69702, goldUsdPerGram: 74.94, tbillPct: 21.31 },
  { month: "2024-05", btcUsd: 58254, goldUsdPerGram: 75.59, tbillPct: 21.62 },
  { month: "2024-06", btcUsd: 67707, goldUsdPerGram: 74.78, tbillPct: 21.94 },
  { month: "2024-07", btcUsd: 62852, goldUsdPerGram: 77.1, tbillPct: 22.25 },
  { month: "2024-08", btcUsd: 65358, goldUsdPerGram: 79.41, tbillPct: 22.56 },
  { month: "2024-09", btcUsd: 57454, goldUsdPerGram: 82.66, tbillPct: 22.88 },
  { month: "2024-10", btcUsd: 60981, goldUsdPerGram: 86.49, tbillPct: 23.19 },
  { month: "2024-11", btcUsd: 69590, goldUsdPerGram: 85.23, tbillPct: 23.5 },
  { month: "2024-12", btcUsd: 97365, goldUsdPerGram: 85.14, tbillPct: 22.9 },
  { month: "2025-01", btcUsd: 94757, goldUsdPerGram: 87.13, tbillPct: 22.6 },
  { month: "2025-02", btcUsd: 100700, goldUsdPerGram: 93.08, tbillPct: 21.48 },
  { month: "2025-03", btcUsd: 86382, goldUsdPerGram: 95.91, tbillPct: 20.37 },
  { month: "2025-04", btcUsd: 85197, goldUsdPerGram: 103.46, tbillPct: 19.25 },
  { month: "2025-05", btcUsd: 96467, goldUsdPerGram: 106.39, tbillPct: 18.13 },
  { month: "2025-06", btcUsd: 105620, goldUsdPerGram: 107.8, tbillPct: 17.02 },
  { month: "2025-07", btcUsd: 105920, goldUsdPerGram: 107.38, tbillPct: 15.9 },
  { month: "2025-08", btcUsd: 113500, goldUsdPerGram: 108.28, tbillPct: 16.26 },
  { month: "2025-09", btcUsd: 109410, goldUsdPerGram: 117.92, tbillPct: 16.62 },
  { month: "2025-10", btcUsd: 118670, goldUsdPerGram: 130.48, tbillPct: 16.98 },
  { month: "2025-11", btcUsd: 110290, goldUsdPerGram: 131.4, tbillPct: 17.34 },
  { month: "2025-12", btcUsd: 86473, goldUsdPerGram: 138.54, tbillPct: 17.7 },
  { month: "2026-01", btcUsd: 88876, goldUsdPerGram: 152.81, tbillPct: 17.0 },
  { month: "2026-02", btcUsd: 77013, goldUsdPerGram: 161.4, tbillPct: 16.86 },
  { month: "2026-03", btcUsd: 65792, goldUsdPerGram: 156.12, tbillPct: 16.71 },
  { month: "2026-04", btcUsd: 68074, goldUsdPerGram: 151.78, tbillPct: 16.57 },
  { month: "2026-05", btcUsd: 81000, goldUsdPerGram: 147.48, tbillPct: 16.43 },
  { month: "2026-06", btcUsd: 71000, goldUsdPerGram: 135.93, tbillPct: 16.29 },
  { month: "2026-07", btcUsd: 62000, goldUsdPerGram: 130.95, tbillPct: 16.14 },
  { month: "2026-08", btcUsd: 63000, goldUsdPerGram: 140.34, tbillPct: 16.0 },
];

const ngnSeries: readonly FxMonth[] = [
  { month: "2021-01", perUsd: 490, provenance: "anchor" },
  { month: "2021-02", perUsd: 542.5, provenance: "interpolated" },
  { month: "2021-03", perUsd: 595.0, provenance: "interpolated" },
  { month: "2021-04", perUsd: 647.5, provenance: "interpolated" },
  { month: "2021-05", perUsd: 700, provenance: "anchor" },
  { month: "2021-06", perUsd: 667.5, provenance: "interpolated" },
  { month: "2021-07", perUsd: 635.0, provenance: "interpolated" },
  { month: "2021-08", perUsd: 602.5, provenance: "interpolated" },
  { month: "2021-09", perUsd: 570, provenance: "anchor" },
  { month: "2021-10", perUsd: 581.67, provenance: "interpolated" },
  { month: "2021-11", perUsd: 593.33, provenance: "interpolated" },
  { month: "2021-12", perUsd: 605.0, provenance: "interpolated" },
  { month: "2022-01", perUsd: 616.67, provenance: "interpolated" },
  { month: "2022-02", perUsd: 628.33, provenance: "interpolated" },
  { month: "2022-03", perUsd: 640.0, provenance: "interpolated" },
  { month: "2022-04", perUsd: 651.67, provenance: "interpolated" },
  { month: "2022-05", perUsd: 663.33, provenance: "interpolated" },
  { month: "2022-06", perUsd: 675.0, provenance: "interpolated" },
  { month: "2022-07", perUsd: 686.67, provenance: "interpolated" },
  { month: "2022-08", perUsd: 698.33, provenance: "interpolated" },
  { month: "2022-09", perUsd: 710, provenance: "anchor" },
  { month: "2022-10", perUsd: 721.67, provenance: "interpolated" },
  { month: "2022-11", perUsd: 733.33, provenance: "interpolated" },
  { month: "2022-12", perUsd: 745, provenance: "anchor" },
  { month: "2023-01", perUsd: 755, provenance: "anchor" },
  { month: "2023-02", perUsd: 758.0, provenance: "interpolated" },
  { month: "2023-03", perUsd: 761.0, provenance: "interpolated" },
  { month: "2023-04", perUsd: 764.0, provenance: "interpolated" },
  { month: "2023-05", perUsd: 767.0, provenance: "interpolated" },
  { month: "2023-06", perUsd: 770, provenance: "anchor" },
  { month: "2023-07", perUsd: 841.43, provenance: "interpolated" },
  { month: "2023-08", perUsd: 912.86, provenance: "interpolated" },
  { month: "2023-09", perUsd: 984.29, provenance: "monierate" },
  { month: "2023-10", perUsd: 1106.86, provenance: "monierate" },
  { month: "2023-11", perUsd: 1139.87, provenance: "monierate" },
  { month: "2023-12", perUsd: 1213.26, provenance: "monierate" },
  { month: "2024-01", perUsd: 1334.27, provenance: "monierate" },
  { month: "2024-02", perUsd: 1585.49, provenance: "monierate" },
  { month: "2024-03", perUsd: 1517.1, provenance: "monierate" },
  { month: "2024-04", perUsd: 1234.54, provenance: "monierate" },
  { month: "2024-05", perUsd: 1444.23, provenance: "monierate" },
  { month: "2024-06", perUsd: 1501.02, provenance: "monierate" },
  { month: "2024-07", perUsd: 1572.82, provenance: "monierate" },
  { month: "2024-08", perUsd: 1611.16, provenance: "monierate" },
  { month: "2024-09", perUsd: 1667.43, provenance: "monierate" },
  { month: "2024-10", perUsd: 1708.5, provenance: "monierate" },
  { month: "2024-11", perUsd: 1742.32, provenance: "monierate" },
  { month: "2024-12", perUsd: 1662.62, provenance: "monierate" },
  { month: "2025-01", perUsd: 1652.71, provenance: "monierate" },
  { month: "2025-02", perUsd: 1526.46, provenance: "monierate" },
  { month: "2025-03", perUsd: 1548.39, provenance: "monierate" },
  { month: "2025-04", perUsd: 1602.51, provenance: "monierate" },
  { month: "2025-05", perUsd: 1606.12, provenance: "monierate" },
  { month: "2025-06", perUsd: 1574.66, provenance: "monierate" },
  { month: "2025-07", perUsd: 1534.84, provenance: "monierate" },
  { month: "2025-08", perUsd: 1539.09, provenance: "monierate" },
  { month: "2025-09", perUsd: 1509.97, provenance: "monierate" },
  { month: "2025-10", perUsd: 1590.92, provenance: "monierate" },
  { month: "2025-11", perUsd: 1463.45, provenance: "monierate" },
  { month: "2025-12", perUsd: 1471.15, provenance: "monierate" },
  { month: "2026-01", perUsd: 1470.96, provenance: "monierate" },
  { month: "2026-02", perUsd: 1398.74, provenance: "monierate" },
  { month: "2026-03", perUsd: 1401.58, provenance: "monierate" },
  { month: "2026-04", perUsd: 1388.4, provenance: "monierate" },
  { month: "2026-05", perUsd: 1378.7, provenance: "monierate" },
  { month: "2026-06", perUsd: 1387.75, provenance: "monierate" },
  { month: "2026-07", perUsd: 1393.66, provenance: "monierate" },
  { month: "2026-08", perUsd: 1393.63, provenance: "monierate" },
];

// Egyptian pound (EGP), local currency per USD, monthly averages.
// Source: Bank for International Settlements, US dollar exchange rates (WS_XRU),
//   compiled from Central Bank of Egypt.
// URL: https://stats.bis.org/api/v2/data/dataflow/BIS/WS_XRU/1.0/M.EG.EGP.A?format=csv
// Method: monthly average of daily reference rates; 2026-06 to 2026-08 averaged from
//   daily USD/EGP mid rates (@fawazahmed0 currency-api) because the BIS monthly
//   aggregate is not yet published for those months.
// Retrieved: 2026-09-02.
// Real months: 68 of 68, none interpolated. 65 come from the primary source; 3 (2026-06
//   to 2026-08) come from the daily USD mid rates of the @fawazahmed0 currency-api,
//   averaged over the month, because the official aggregate is not published yet.
const egpSeries: readonly FxMonth[] = [
  { month: "2021-01", perUsd: 15.65, provenance: "real" },
  { month: "2021-02", perUsd: 15.62, provenance: "real" },
  { month: "2021-03", perUsd: 15.66, provenance: "real" },
  { month: "2021-04", perUsd: 15.64, provenance: "real" },
  { month: "2021-05", perUsd: 15.62, provenance: "real" },
  { month: "2021-06", perUsd: 15.62, provenance: "real" },
  { month: "2021-07", perUsd: 15.64, provenance: "real" },
  { month: "2021-08", perUsd: 15.65, provenance: "real" },
  { month: "2021-09", perUsd: 15.66, provenance: "real" },
  { month: "2021-10", perUsd: 15.66, provenance: "real" },
  { month: "2021-11", perUsd: 15.66, provenance: "real" },
  { month: "2021-12", perUsd: 15.66, provenance: "real" },
  { month: "2022-01", perUsd: 15.66, provenance: "real" },
  { month: "2022-02", perUsd: 15.66, provenance: "real" },
  { month: "2022-03", perUsd: 16.68, provenance: "real" },
  { month: "2022-04", perUsd: 18.36, provenance: "real" },
  { month: "2022-05", perUsd: 18.38, provenance: "real" },
  { month: "2022-06", perUsd: 18.68, provenance: "real" },
  { month: "2022-07", perUsd: 18.86, provenance: "real" },
  { month: "2022-08", perUsd: 19.1, provenance: "real" },
  { month: "2022-09", perUsd: 19.34, provenance: "real" },
  { month: "2022-10", perUsd: 20.2, provenance: "real" },
  { month: "2022-11", perUsd: 24.38, provenance: "real" },
  { month: "2022-12", perUsd: 24.62, provenance: "real" },
  { month: "2023-01", perUsd: 28.71, provenance: "real" },
  { month: "2023-02", perUsd: 30.43, provenance: "real" },
  { month: "2023-03", perUsd: 30.8, provenance: "real" },
  { month: "2023-04", perUsd: 30.84, provenance: "real" },
  { month: "2023-05", perUsd: 30.84, provenance: "real" },
  { month: "2023-06", perUsd: 30.84, provenance: "real" },
  { month: "2023-07", perUsd: 30.84, provenance: "real" },
  { month: "2023-08", perUsd: 30.84, provenance: "real" },
  { month: "2023-09", perUsd: 30.84, provenance: "real" },
  { month: "2023-10", perUsd: 30.84, provenance: "real" },
  { month: "2023-11", perUsd: 30.84, provenance: "real" },
  { month: "2023-12", perUsd: 30.84, provenance: "real" },
  { month: "2024-01", perUsd: 30.84, provenance: "real" },
  { month: "2024-02", perUsd: 30.84, provenance: "real" },
  { month: "2024-03", perUsd: 45.36, provenance: "real" },
  { month: "2024-04", perUsd: 47.83, provenance: "real" },
  { month: "2024-05", perUsd: 47.13, provenance: "real" },
  { month: "2024-06", perUsd: 47.7, provenance: "real" },
  { month: "2024-07", perUsd: 48.15, provenance: "real" },
  { month: "2024-08", perUsd: 48.9, provenance: "real" },
  { month: "2024-09", perUsd: 48.42, provenance: "real" },
  { month: "2024-10", perUsd: 48.56, provenance: "real" },
  { month: "2024-11", perUsd: 49.35, provenance: "real" },
  { month: "2024-12", perUsd: 50.51, provenance: "real" },
  { month: "2025-01", perUsd: 50.37, provenance: "real" },
  { month: "2025-02", perUsd: 50.44, provenance: "real" },
  { month: "2025-03", perUsd: 50.56, provenance: "real" },
  { month: "2025-04", perUsd: 51.02, provenance: "real" },
  { month: "2025-05", perUsd: 50.16, provenance: "real" },
  { month: "2025-06", perUsd: 49.98, provenance: "real" },
  { month: "2025-07", perUsd: 49.2, provenance: "real" },
  { month: "2025-08", perUsd: 48.43, provenance: "real" },
  { month: "2025-09", perUsd: 48.17, provenance: "real" },
  { month: "2025-10", perUsd: 47.53, provenance: "real" },
  { month: "2025-11", perUsd: 47.35, provenance: "real" },
  { month: "2025-12", perUsd: 47.52, provenance: "real" },
  { month: "2026-01", perUsd: 47.2, provenance: "real" },
  { month: "2026-02", perUsd: 47.15, provenance: "real" },
  { month: "2026-03", perUsd: 51.95, provenance: "real" },
  { month: "2026-04", perUsd: 52.91, provenance: "real" },
  { month: "2026-05", perUsd: 52.97, provenance: "real" },
  { month: "2026-06", perUsd: 50.85, provenance: "real" },
  { month: "2026-07", perUsd: 50.21, provenance: "real" },
  { month: "2026-08", perUsd: 50.33, provenance: "real" },
];

// Ghanaian cedi (GHS), local currency per USD, monthly averages.
// Source: Bank of Ghana, historical interbank FX rates.
// URL: https://www.bog.gov.gh/treasury-and-the-markets/historical-interbank-fx-rates/
// Method: monthly average of daily reference rates.
// Retrieved: 2026-09-02.
// Real months: 68 of 68, all from the primary source. No fallback, no interpolation.
const ghsSeries: readonly FxMonth[] = [
  { month: "2021-01", perUsd: 5.761, provenance: "real" },
  { month: "2021-02", perUsd: 5.758, provenance: "real" },
  { month: "2021-03", perUsd: 5.728, provenance: "real" },
  { month: "2021-04", perUsd: 5.731, provenance: "real" },
  { month: "2021-05", perUsd: 5.733, provenance: "real" },
  { month: "2021-06", perUsd: 5.752, provenance: "real" },
  { month: "2021-07", perUsd: 5.785, provenance: "real" },
  { month: "2021-08", perUsd: 5.826, provenance: "real" },
  { month: "2021-09", perUsd: 5.859, provenance: "real" },
  { month: "2021-10", perUsd: 5.882, provenance: "real" },
  { month: "2021-11", perUsd: 5.907, provenance: "real" },
  { month: "2021-12", perUsd: 5.947, provenance: "real" },
  { month: "2022-01", perUsd: 6.01, provenance: "real" },
  { month: "2022-02", perUsd: 6.308, provenance: "real" },
  { month: "2022-03", perUsd: 7.047, provenance: "real" },
  { month: "2022-04", perUsd: 7.112, provenance: "real" },
  { month: "2022-05", perUsd: 7.126, provenance: "real" },
  { month: "2022-06", perUsd: 7.191, provenance: "real" },
  { month: "2022-07", perUsd: 7.391, provenance: "real" },
  { month: "2022-08", perUsd: 8.059, provenance: "real" },
  { month: "2022-09", perUsd: 8.747, provenance: "real" },
  { month: "2022-10", perUsd: 11.17, provenance: "real" },
  { month: "2022-11", perUsd: 13.07, provenance: "real" },
  { month: "2022-12", perUsd: 10.03, provenance: "real" },
  { month: "2023-01", perUsd: 9.909, provenance: "real" },
  { month: "2023-02", perUsd: 10.86, provenance: "real" },
  { month: "2023-03", perUsd: 11.01, provenance: "real" },
  { month: "2023-04", perUsd: 10.95, provenance: "real" },
  { month: "2023-05", perUsd: 10.92, provenance: "real" },
  { month: "2023-06", perUsd: 10.98, provenance: "real" },
  { month: "2023-07", perUsd: 11, provenance: "real" },
  { month: "2023-08", perUsd: 11.01, provenance: "real" },
  { month: "2023-09", perUsd: 11.06, provenance: "real" },
  { month: "2023-10", perUsd: 11.34, provenance: "real" },
  { month: "2023-11", perUsd: 11.55, provenance: "real" },
  { month: "2023-12", perUsd: 11.65, provenance: "real" },
  { month: "2024-01", perUsd: 11.93, provenance: "real" },
  { month: "2024-02", perUsd: 12.23, provenance: "real" },
  { month: "2024-03", perUsd: 12.67, provenance: "real" },
  { month: "2024-04", perUsd: 13.04, provenance: "real" },
  { month: "2024-05", perUsd: 13.78, provenance: "real" },
  { month: "2024-06", perUsd: 14.33, provenance: "real" },
  { month: "2024-07", perUsd: 14.75, provenance: "real" },
  { month: "2024-08", perUsd: 15.1, provenance: "real" },
  { month: "2024-09", perUsd: 15.56, provenance: "real" },
  { month: "2024-10", perUsd: 15.99, provenance: "real" },
  { month: "2024-11", perUsd: 15.98, provenance: "real" },
  { month: "2024-12", perUsd: 14.78, provenance: "real" },
  { month: "2025-01", perUsd: 14.97, provenance: "real" },
  { month: "2025-02", perUsd: 15.49, provenance: "real" },
  { month: "2025-03", perUsd: 15.53, provenance: "real" },
  { month: "2025-04", perUsd: 15.22, provenance: "real" },
  { month: "2025-05", perUsd: 12.08, provenance: "real" },
  { month: "2025-06", perUsd: 10.28, provenance: "real" },
  { month: "2025-07", perUsd: 10.42, provenance: "real" },
  { month: "2025-08", perUsd: 10.79, provenance: "real" },
  { month: "2025-09", perUsd: 12.14, provenance: "real" },
  { month: "2025-10", perUsd: 11.46, provenance: "real" },
  { month: "2025-11", perUsd: 11.02, provenance: "real" },
  { month: "2025-12", perUsd: 11.28, provenance: "real" },
  { month: "2026-01", perUsd: 10.79, provenance: "real" },
  { month: "2026-02", perUsd: 10.92, provenance: "real" },
  { month: "2026-03", perUsd: 10.87, provenance: "real" },
  { month: "2026-04", perUsd: 11.07, provenance: "real" },
  { month: "2026-05", perUsd: 11.45, provenance: "real" },
  { month: "2026-06", perUsd: 11.41, provenance: "real" },
  { month: "2026-07", perUsd: 11.54, provenance: "real" },
  { month: "2026-08", perUsd: 11.33, provenance: "real" },
];

// Kenyan shilling (KES), local currency per USD, monthly averages.
// Source: Central Bank of Kenya, monthly exchange rate (period average).
// URL: https://www.centralbank.go.ke/statistics/exchange-rates/
// Method: monthly average of daily reference rates; 2026-08 averaged from daily USD/KES
//   mid rates (@fawazahmed0 currency-api) because the CBK monthly aggregate is not yet
//   published for that month.
// Retrieved: 2026-09-02.
// Real months: 68 of 68, none interpolated. 67 come from the primary source; 1
//   (2026-08) comes from the daily USD mid rates of the @fawazahmed0 currency-api,
//   averaged over the month, because the official aggregate is not published yet.
const kesSeries: readonly FxMonth[] = [
  { month: "2021-01", perUsd: 109.8, provenance: "real" },
  { month: "2021-02", perUsd: 109.7, provenance: "real" },
  { month: "2021-03", perUsd: 109.7, provenance: "real" },
  { month: "2021-04", perUsd: 108, provenance: "real" },
  { month: "2021-05", perUsd: 107.4, provenance: "real" },
  { month: "2021-06", perUsd: 107.8, provenance: "real" },
  { month: "2021-07", perUsd: 108.1, provenance: "real" },
  { month: "2021-08", perUsd: 109.2, provenance: "real" },
  { month: "2021-09", perUsd: 110.2, provenance: "real" },
  { month: "2021-10", perUsd: 110.9, provenance: "real" },
  { month: "2021-11", perUsd: 111.9, provenance: "real" },
  { month: "2021-12", perUsd: 112.9, provenance: "real" },
  { month: "2022-01", perUsd: 113.4, provenance: "real" },
  { month: "2022-02", perUsd: 113.7, provenance: "real" },
  { month: "2022-03", perUsd: 114.3, provenance: "real" },
  { month: "2022-04", perUsd: 115.4, provenance: "real" },
  { month: "2022-05", perUsd: 116.3, provenance: "real" },
  { month: "2022-06", perUsd: 117.3, provenance: "real" },
  { month: "2022-07", perUsd: 118.3, provenance: "real" },
  { month: "2022-08", perUsd: 119.5, provenance: "real" },
  { month: "2022-09", perUsd: 120.4, provenance: "real" },
  { month: "2022-10", perUsd: 121, provenance: "real" },
  { month: "2022-11", perUsd: 121.9, provenance: "real" },
  { month: "2022-12", perUsd: 122.9, provenance: "real" },
  { month: "2023-01", perUsd: 123.9, provenance: "real" },
  { month: "2023-02", perUsd: 125.5, provenance: "real" },
  { month: "2023-03", perUsd: 129.7, provenance: "real" },
  { month: "2023-04", perUsd: 134.4, provenance: "real" },
  { month: "2023-05", perUsd: 137.3, provenance: "real" },
  { month: "2023-06", perUsd: 139.7, provenance: "real" },
  { month: "2023-07", perUsd: 141.4, provenance: "real" },
  { month: "2023-08", perUsd: 143.9, provenance: "real" },
  { month: "2023-09", perUsd: 146.8, provenance: "real" },
  { month: "2023-10", perUsd: 149.4, provenance: "real" },
  { month: "2023-11", perUsd: 152, provenance: "real" },
  { month: "2023-12", perUsd: 154.1, provenance: "real" },
  { month: "2024-01", perUsd: 159.7, provenance: "real" },
  { month: "2024-02", perUsd: 151.8, provenance: "real" },
  { month: "2024-03", perUsd: 137.3, provenance: "real" },
  { month: "2024-04", perUsd: 131.6, provenance: "real" },
  { month: "2024-05", perUsd: 131.7, provenance: "real" },
  { month: "2024-06", perUsd: 129.4, provenance: "real" },
  { month: "2024-07", perUsd: 129.9, provenance: "real" },
  { month: "2024-08", perUsd: 129.3, provenance: "real" },
  { month: "2024-09", perUsd: 129.2, provenance: "real" },
  { month: "2024-10", perUsd: 129.2, provenance: "real" },
  { month: "2024-11", perUsd: 129.4, provenance: "real" },
  { month: "2024-12", perUsd: 129.4, provenance: "real" },
  { month: "2025-01", perUsd: 129.4, provenance: "real" },
  { month: "2025-02", perUsd: 129.3, provenance: "real" },
  { month: "2025-03", perUsd: 129.3, provenance: "real" },
  { month: "2025-04", perUsd: 129.5, provenance: "real" },
  { month: "2025-05", perUsd: 129.3, provenance: "real" },
  { month: "2025-06", perUsd: 129.2, provenance: "real" },
  { month: "2025-07", perUsd: 129.2, provenance: "real" },
  { month: "2025-08", perUsd: 129.2, provenance: "real" },
  { month: "2025-09", perUsd: 129.2, provenance: "real" },
  { month: "2025-10", perUsd: 129.2, provenance: "real" },
  { month: "2025-11", perUsd: 129.5, provenance: "real" },
  { month: "2025-12", perUsd: 129.1, provenance: "real" },
  { month: "2026-01", perUsd: 129, provenance: "real" },
  { month: "2026-02", perUsd: 129, provenance: "real" },
  { month: "2026-03", perUsd: 129.4, provenance: "real" },
  { month: "2026-04", perUsd: 129.4, provenance: "real" },
  { month: "2026-05", perUsd: 129.4, provenance: "real" },
  { month: "2026-06", perUsd: 129.5, provenance: "real" },
  { month: "2026-07", perUsd: 129.3, provenance: "real" },
  { month: "2026-08", perUsd: 129.4, provenance: "real" },
];

export const savingsCurrencies: readonly SavingsCurrency[] = [
  {
    code: "NGN",
    symbol: "₦",
    name: "Nigerian naira",
    noun: "naira",
    flag: "/enta-website/enta-landing/currency-ngn.png",
    defaultMonthlyAmount: 600000,
    available: true,
    tbillSource: "CBN 364-day",
    series: ngnSeries,
  },
  {
    code: "EGP",
    symbol: "E£",
    name: "Egyptian pound",
    noun: "pounds",
    flag: "/enta-website/enta-landing/currency-egp.png",
    defaultMonthlyAmount: 20000,
    available: true,
    tbillSource: null,
    series: egpSeries,
  },
  {
    code: "GHS",
    symbol: "GH₵",
    name: "Ghanaian cedi",
    noun: "cedis",
    flag: "/enta-website/enta-landing/currency-ghs.png",
    defaultMonthlyAmount: 5000,
    available: true,
    tbillSource: null,
    series: ghsSeries,
  },
  {
    code: "KES",
    symbol: "KSh",
    name: "Kenyan shilling",
    noun: "shillings",
    flag: "/enta-website/enta-landing/currency-kes.png",
    defaultMonthlyAmount: 55000,
    available: true,
    tbillSource: null,
    series: kesSeries,
  },
];

export const defaultCurrency: SavingsCurrency = savingsCurrencies[0];

export function findCurrency(code: CurrencyCode): SavingsCurrency {
  return savingsCurrencies.find((currency) => currency.code === code) ?? defaultCurrency;
}
