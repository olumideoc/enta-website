"use client";

import { type CSSProperties, useEffect, useId, useMemo, useRef, useState } from "react";
import { calculateSavings, pctVsBaseline, type VehicleKey } from "./calculateSavings.ts";
import {
  defaultCurrency,
  findCurrency,
  savingsCurrencies,
  type CurrencyCode,
} from "./savingsData.ts";
import {
  formatBaselineLabel,
  formatGrouped,
  formatLocalCompact,
  formatMonthLabel,
  formatPercent,
  parseAmountInput,
} from "./format.ts";
import styles from "../enta-website.module.css";

// The maths is linear, so a one-naira deposit is as valid as a million.
const MIN_AMOUNT = 1;
const MAX_AMOUNT = 1000000000;
const MIN_YEARS = 1;
// The dataset carries 68 deposits, so six years is not on offer.
const MAX_YEARS = 5;
const DEFAULT_YEARS = 3;

type VehicleMeta = {
  readonly label: string;
  /** Read out by screen readers, where the ticker would not help. */
  readonly spoken?: string;
  readonly qualifier?: string;
  readonly color: string;
  /** Decorative coin shown ahead of the label. */
  readonly icon: string;
};

const vehicleMeta: Record<VehicleKey, VehicleMeta> = {
  gold: {
    label: "Held in xAU₮",
    spoken: "Gold",
    qualifier: "(Gold)",
    color: "#d4aa3f",
    icon: "/enta-website/enta-landing/calculator-gold.svg",
  },
  bitcoin: {
    label: "Held in Bitcoin",
    color: "#ff8a00",
    icon: "/enta-website/enta-landing/calculator-bitcoin.svg",
  },
  tbills: {
    label: "Held in T-bills",
    color: "#6f2da8",
    icon: "/enta-website/enta-landing/calculator-tbill.svg",
  },
  usd: {
    label: "Held in US Dollars",
    color: "#c52032",
    icon: "/enta-website/enta-landing/calculator-usd.svg",
  },
  // The baseline row takes its label and its icon from the selected currency.
  local: {
    label: "Held in local currency",
    color: "#165b22",
    icon: "",
  },
};

/** Digits only, leading zeros gone, capped: what the amount field is allowed to hold. */
function toAmountText(value: string): string {
  const parsed = parseAmountInput(value);
  if (parsed === null) return "";
  return String(Math.min(parsed, MAX_AMOUNT));
}

// Compliance-approved wording. Do not reword without a fresh review.
const disclosure =
  "This is historical illustration, not a forecast. FX: real Monierate USD₮/NGN composite from Sep 2023; 2021 – early 2023 interpolated between real dated anchors. Bitcoin and gold real throughout. CBN 364-day T-bill rates. Past performance does not predict future results. Not investment advice. EGP, GHS and KES use monthly average official reference rates from the Bank for International Settlements, the Bank of Ghana and the Central Bank of Kenya.";

export function SavingsCalculator() {
  const amountId = useId();
  const yearsId = useId();
  const [code, setCode] = useState<CurrencyCode>(defaultCurrency.code);
  // What the field shows, and the last amount worth calculating. An empty or
  // zeroed field leaves the results on the last real amount rather than jumping.
  const [amountText, setAmountText] = useState(
    String(defaultCurrency.defaultMonthlyAmount),
  );
  const [monthlyAmount, setMonthlyAmount] = useState(
    defaultCurrency.defaultMonthlyAmount,
  );
  const [amountFocused, setAmountFocused] = useState(false);
  const [years, setYears] = useState(DEFAULT_YEARS);
  const [announcement, setAnnouncement] = useState("");

  const currency = findCurrency(code);

  const result = useMemo(
    () => calculateSavings({ currency, monthlyAmount, years }),
    [currency, monthlyAmount, years],
  );

  const rows = useMemo(() => {
    if (!result) return [];
    const baseline =
      result.vehicles.find((vehicle) => vehicle.key === "local")?.local ?? 0;
    const largest = Math.max(...result.vehicles.map((vehicle) => vehicle.local));

    return result.vehicles.map((vehicle) => {
      const meta = vehicleMeta[vehicle.key];
      const isBaseline = vehicle.key === "local";
      const change = Math.round(pctVsBaseline(vehicle.local, baseline));
      return {
        key: vehicle.key,
        color: meta.color,
        icon: isBaseline ? currency.flag : meta.icon,
        label: isBaseline ? formatBaselineLabel(currency.noun) : meta.label,
        spoken: isBaseline ? currency.name : (meta.spoken ?? meta.label.replace("Held in ", "")),
        qualifier: meta.qualifier,
        badge: isBaseline ? "Baseline" : formatPercent(change),
        // Split off so the narrowest phones can hide it in CSS rather than
        // letting the pill ellipsis the currency away.
        badgeSuffix: isBaseline ? null : ` vs ${currency.noun}`,
        isBaseline,
        value: formatLocalCompact(vehicle.local, currency.symbol),
        // A tiny share still shows: the bar carries a min-width of one dot.
        progress: `${(vehicle.local / largest) * 100}%`,
      };
    });
  }, [currency, result]);

  const summary = result
    ? `${result.depositCount} monthly deposits · ${formatMonthLabel(
        result.firstMonth,
      )} to ${formatMonthLabel(result.lastMonth)} · ${formatLocalCompact(
        result.totalLocalIn,
        currency.symbol,
      )} put in`
    : `${currency.name} rates are not in the dataset yet.`;

  const spoken = rows.map((row) => `${row.spoken}, ${row.value}`).join(". ");

  // Announce the outcome once the saver stops nudging the controls, not on load.
  const settled = useRef(false);
  useEffect(() => {
    if (!settled.current) {
      settled.current = true;
      return;
    }

    const timer = window.setTimeout(() => {
      setAnnouncement(`${summary}. ${spoken}.`);
    }, 400);
    return () => window.clearTimeout(timer);
  }, [summary, spoken]);

  // A fresh currency gets a fresh sensible deposit; the years the saver picked stay.
  const handleCurrencyChange = (next: CurrencyCode) => {
    const fresh = findCurrency(next).defaultMonthlyAmount;
    setCode(next);
    setAmountText(String(fresh));
    setMonthlyAmount(fresh);
  };

  const handleAmountChange = (value: string) => {
    const next = toAmountText(value);
    setAmountText(next);
    const parsed = Number(next);
    if (next !== "" && parsed >= MIN_AMOUNT) {
      setMonthlyAmount(parsed);
    }
  };

  const handleAmountBlur = () => {
    setAmountFocused(false);
    const parsed = Number(amountText);
    // Nothing to work with: put the amount the results are already showing back.
    if (amountText === "" || !Number.isFinite(parsed) || parsed < MIN_AMOUNT) {
      setAmountText(String(monthlyAmount));
      return;
    }
    setMonthlyAmount(parsed);
    setAmountText(String(parsed));
  };

  return (
    <div className={styles.savingsColumns}>
      <div className={styles.savingsSetup} data-reveal>
        <div className={styles.sectionHeading}>
          <h2>What could your savings be worth today?</h2>
          <p>Compare up to five years across different ways of holding value.</p>
        </div>

        <div className={styles.savingsControls}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor={amountId}>
              Amount saved each month
            </label>
            <div className={styles.amountField}>
              <select
                className={styles.currencySelect}
                style={
                  { "--currency-flag": `url("${currency.flag}")` } as CSSProperties
                }
                aria-label="Saving currency"
                value={code}
                onChange={(event) =>
                  handleCurrencyChange(event.target.value as CurrencyCode)
                }
              >
                {savingsCurrencies.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.code}
                  </option>
                ))}
              </select>
              <input
                className={styles.amountInput}
                id={amountId}
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={
                  // While the caret is in the field, hand back exactly what the
                  // browser produced, so React never rewrites the DOM value.
                  amountFocused || amountText === ""
                    ? amountText
                    : formatGrouped(Number(amountText))
                }
                onChange={(event) => handleAmountChange(event.target.value)}
                onFocus={() => setAmountFocused(true)}
                onBlur={handleAmountBlur}
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor={yearsId}>
              Held for <span className={styles.fieldLabelValue}>{years}</span>{" "}
              {years === 1 ? "year" : "years"}
            </label>
            <input
              className={styles.yearsRange}
              id={yearsId}
              type="range"
              min={MIN_YEARS}
              max={MAX_YEARS}
              step={1}
              value={years}
              aria-valuetext={`${years} ${years === 1 ? "year" : "years"}`}
              onChange={(event) => setYears(Number(event.target.value))}
            />
          </div>
        </div>
      </div>

      <div className={styles.savingsOutcome} data-reveal>
        <p className={styles.savingsSummary}>{summary}</p>

        <div className={styles.savingsRows}>
          {rows.map((row) => (
            <div
              className={styles.savingsRow}
              key={row.key}
              style={
                {
                  "--savings-color": row.color,
                  "--savings-progress": row.progress,
                } as CSSProperties
              }
            >
              <div className={styles.savingsRowTop}>
                <div className={styles.savingsRowLabel}>
                  <span className={styles.savingsRowIcon}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={row.icon}
                      alt=""
                      width={24}
                      height={24}
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                  <strong>{row.label}</strong>
                  {row.qualifier && (
                    <span className={styles.savingsQualifier}>{row.qualifier}</span>
                  )}
                  <em className={styles.savingsBadge}>
                    {row.badge}
                    {row.badgeSuffix && (
                      <span className={styles.savingsBadgeSuffix}>
                        {row.badgeSuffix}
                      </span>
                    )}
                  </em>
                </div>
                <b className={styles.savingsValue}>{row.value}</b>
              </div>
              <div className={styles.savingsBar}>
                <span />
              </div>
            </div>
          ))}
        </div>

        <p className={styles.savingsNote}>{disclosure}</p>

        <p className={styles.visuallyHidden} aria-live="polite">
          {announcement}
        </p>
      </div>
    </div>
  );
}
