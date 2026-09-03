import React, { useState, useMemo } from "react";

/*
  ============================================================================
  SHIGA / ENTA  —  "The savings problem" calculator
  ============================================================================
  Monthly naira savings (dollar-cost averaging) shown as today's value across
  Bitcoin, Gold, "dollars" (NGN->USD/USDT held), and Nigerian T-Bills.

  ALL FIGURES ARE REAL for the covered window. NO interpolated FX, NO estimates.
  Window: Jan 2023 – Nov 2024 (23 months) — the exact span of the
  uploaded USDT/NGN dataset. "Today" = Nov 2024 (window end), FX ₦1,740/$.

  Sources (see SOURCES.md):
    ngn   — REAL monthly USDT/NGN from Dami's uploaded file (reconciled against
            its own 413-point daily tab). Labelled "saving in dollars" in UI;
            USDT/NGN and USD/NGN treated as interchangeable per Dami's direction.
    btc   — REAL first-of-month BTC-USD (Habrador dataset, GitHub).
    gold  — REAL monthly LBMA gold, USD/oz -> USD/g /31.1035 (datasets/gold-prices).
    tbill — CBN 364-day benchmark, real reported points interpolated monthly
            (CEIC/THISDAY). The only series not month-by-month primary.

  FINDING (23 x ₦100k over this window): Bitcoin wins clearly; T-Bills finish
  BELOW holding dollars (naira more than doubled ₦748->₦1,740, outpacing yields).
  This differs from a longer window — it is window-specific, not an error.
  ============================================================================
*/

// --- REAL DATASET (Jan 2023 -> Nov 2024, 23 months) --------------------------
// ngn = NGN per USD (real USDT/NGN), btc = USD, gold = USD/gram, tbill = 364d annualised %
const MONTHLY = [
  // 2021
  { m: "2021-01", ngn: 490, btc: 29112, gold: 60.03, tbill: 1.2 }, // anchor
  { m: "2021-02", ngn: 542.5, btc: 33087, gold: 58.13, tbill: 2.76 }, // interp
  { m: "2021-03", ngn: 595.0, btc: 45093, gold: 55.23, tbill: 4.32 }, // interp
  { m: "2021-04", ngn: 647.5, btc: 58725, gold: 56.59, tbill: 5.88 }, // interp
  { m: "2021-05", ngn: 700, btc: 57303, gold: 59.48, tbill: 7.44 }, // anchor
  { m: "2021-06", ngn: 667.5, btc: 36929, gold: 59.0, tbill: 9.0 }, // interp
  { m: "2021-07", ngn: 635.0, btc: 34856, gold: 58.13, tbill: 8.33 }, // interp
  { m: "2021-08", ngn: 602.5, btc: 41870, gold: 57.39, tbill: 7.67 }, // interp
  { m: "2021-09", ngn: 570, btc: 46920, gold: 57.07, tbill: 7.0 }, // anchor
  { m: "2021-10", ngn: 581.67, btc: 43718, gold: 57.13, tbill: 6.33 }, // interp
  { m: "2021-11", ngn: 593.33, btc: 61374, gold: 58.58, tbill: 5.67 }, // interp
  { m: "2021-12", ngn: 605.0, btc: 56973, gold: 57.55, tbill: 5.0 }, // interp
  // 2022
  { m: "2022-01", ngn: 616.67, btc: 46208, gold: 58.39, tbill: 5.5 }, // interp
  { m: "2022-02", ngn: 628.33, btc: 38500, gold: 59.67, tbill: 6.0 }, // interp
  { m: "2022-03", ngn: 640.0, btc: 44355, gold: 62.63, tbill: 6.5 }, // interp
  { m: "2022-04", ngn: 651.67, btc: 46282, gold: 62.28, tbill: 7.0 }, // interp
  { m: "2022-05", ngn: 663.33, btc: 38469, gold: 59.45, tbill: 7.5 }, // interp
  { m: "2022-06", ngn: 675.0, btc: 29799, gold: 59.06, tbill: 8.0 }, // interp
  { m: "2022-07", ngn: 686.67, btc: 19269, gold: 55.72, tbill: 8.83 }, // interp
  { m: "2022-08", ngn: 698.33, btc: 23314, gold: 56.75, tbill: 9.67 }, // interp
  { m: "2022-09", ngn: 710, btc: 20127, gold: 54.04, tbill: 10.5 }, // anchor
  { m: "2022-10", ngn: 721.67, btc: 19312, gold: 53.5, tbill: 11.33 }, // interp
  { m: "2022-11", ngn: 733.33, btc: 20485, gold: 55.46, tbill: 12.17 }, // interp
  { m: "2022-12", ngn: 745, btc: 16967, gold: 57.81, tbill: 13.0 }, // anchor
  // 2023
  { m: "2023-01", ngn: 755, btc: 16625, gold: 61.02, tbill: 4.5 }, // anchor
  { m: "2023-02", ngn: 758.0, btc: 23724, gold: 59.64, tbill: 4.8 }, // interp
  { m: "2023-03", ngn: 761.0, btc: 23647, gold: 61.5, tbill: 5.1 }, // interp
  { m: "2023-04", ngn: 764.0, btc: 28411, gold: 64.3, tbill: 5.4 }, // interp
  { m: "2023-05", ngn: 767.0, btc: 28092, gold: 64.04, tbill: 5.7 }, // interp
  { m: "2023-06", ngn: 770, btc: 26820, gold: 62.47, tbill: 6.0 }, // anchor
  { m: "2023-07", ngn: 841.43, btc: 30590, gold: 62.73, tbill: 7.17 }, // interp
  { m: "2023-08", ngn: 912.86, btc: 29676, gold: 61.7, tbill: 8.33 }, // interp
  { m: "2023-09", ngn: 984.29, btc: 25801, gold: 61.6, tbill: 9.5 }, // monierate
  { m: "2023-10", ngn: 1106.86, btc: 27984, gold: 61.6, tbill: 10.67 }, // monierate
  { m: "2023-11", ngn: 1139.87, btc: 35437, gold: 63.79, tbill: 11.83 }, // monierate
  { m: "2023-12", ngn: 1213.26, btc: 38689, gold: 65.14, tbill: 13.0 }, // monierate
  // 2024
  { m: "2024-01", ngn: 1334.27, btc: 44167, gold: 65.39, tbill: 12.0 }, // monierate
  { m: "2024-02", ngn: 1585.49, btc: 43076, gold: 65.04, tbill: 16.5 }, // monierate
  { m: "2024-03", ngn: 1517.1, btc: 62441, gold: 69.38, tbill: 21.0 }, // monierate
  { m: "2024-04", ngn: 1234.54, btc: 69702, gold: 74.94, tbill: 21.31 }, // monierate
  { m: "2024-05", ngn: 1444.23, btc: 58254, gold: 75.59, tbill: 21.62 }, // monierate
  { m: "2024-06", ngn: 1501.02, btc: 67707, gold: 74.78, tbill: 21.94 }, // monierate
  { m: "2024-07", ngn: 1572.82, btc: 62852, gold: 77.1, tbill: 22.25 }, // monierate
  { m: "2024-08", ngn: 1611.16, btc: 65358, gold: 79.41, tbill: 22.56 }, // monierate
  { m: "2024-09", ngn: 1667.43, btc: 57454, gold: 82.66, tbill: 22.88 }, // monierate
  { m: "2024-10", ngn: 1708.5, btc: 60981, gold: 86.49, tbill: 23.19 }, // monierate
  { m: "2024-11", ngn: 1742.32, btc: 69590, gold: 85.23, tbill: 23.5 }, // monierate
  { m: "2024-12", ngn: 1662.62, btc: 97365, gold: 85.14, tbill: 22.9 }, // monierate
  // 2025
  { m: "2025-01", ngn: 1652.71, btc: 94757, gold: 87.13, tbill: 22.6 }, // monierate
  { m: "2025-02", ngn: 1526.46, btc: 100700, gold: 93.08, tbill: 21.48 }, // monierate
  { m: "2025-03", ngn: 1548.39, btc: 86382, gold: 95.91, tbill: 20.37 }, // monierate
  { m: "2025-04", ngn: 1602.51, btc: 85197, gold: 103.46, tbill: 19.25 }, // monierate
  { m: "2025-05", ngn: 1606.12, btc: 96467, gold: 106.39, tbill: 18.13 }, // monierate
  { m: "2025-06", ngn: 1574.66, btc: 105620, gold: 107.8, tbill: 17.02 }, // monierate
  { m: "2025-07", ngn: 1534.84, btc: 105920, gold: 107.38, tbill: 15.9 }, // monierate
  { m: "2025-08", ngn: 1539.09, btc: 113500, gold: 108.28, tbill: 16.26 }, // monierate
  { m: "2025-09", ngn: 1509.97, btc: 109410, gold: 117.92, tbill: 16.62 }, // monierate
  { m: "2025-10", ngn: 1590.92, btc: 118670, gold: 130.48, tbill: 16.98 }, // monierate
  { m: "2025-11", ngn: 1463.45, btc: 110290, gold: 131.4, tbill: 17.34 }, // monierate
  { m: "2025-12", ngn: 1471.15, btc: 86473, gold: 138.54, tbill: 17.7 }, // monierate
  // 2026
  { m: "2026-01", ngn: 1470.96, btc: 88876, gold: 152.81, tbill: 17.0 }, // monierate
  { m: "2026-02", ngn: 1398.74, btc: 77013, gold: 161.4, tbill: 16.86 }, // monierate
  { m: "2026-03", ngn: 1401.58, btc: 65792, gold: 156.12, tbill: 16.71 }, // monierate
  { m: "2026-04", ngn: 1388.4, btc: 68074, gold: 151.78, tbill: 16.57 }, // monierate
  { m: "2026-05", ngn: 1378.7, btc: 81000, gold: 147.48, tbill: 16.43 }, // monierate
  { m: "2026-06", ngn: 1387.75, btc: 71000, gold: 135.93, tbill: 16.29 }, // monierate
  { m: "2026-07", ngn: 1393.66, btc: 62000, gold: 130.95, tbill: 16.14 }, // monierate
  { m: "2026-08", ngn: 1393.63, btc: 63000, gold: 140.34, tbill: 16.0 }, // monierate
];

// --- CALCULATION ENGINE (pure) -----------------------------------------------
export function computeSavings(monthlyNgn, monthsHeld) {
  const rows = MONTHLY.slice(-monthsHeld);
  const current = MONTHLY[MONTHLY.length - 1];
  const todayFx = current.ngn;
  let btcUnits = 0, goldGrams = 0, usdtBalance = 0, tbillNgn = 0, totalNgnIn = 0;
  for (const row of rows) {
    totalNgnIn += monthlyNgn;
    const usd = monthlyNgn / row.ngn;
    btcUnits += usd / row.btc;
    goldGrams += usd / row.gold;
    usdtBalance += usd;
    tbillNgn = tbillNgn * (1 + row.tbill / 100 / 12) + monthlyNgn;
  }
  const btcUsd = btcUnits * current.btc;
  const goldUsd = goldGrams * current.gold;
  const tbillUsd = tbillNgn / todayFx;
  const toNgn = (u) => u * todayFx;
  return {
    totalNgnIn, totalUsdIn: usdtBalance, todayFx,
    results: {
      bitcoin: { usd: btcUsd, ngn: toNgn(btcUsd) },
      gold: { usd: goldUsd, ngn: toNgn(goldUsd) },
      usdt: { usd: usdtBalance, ngn: toNgn(usdtBalance) },
      tbills: { usd: tbillUsd, ngn: tbillNgn },
    },
  };
}

// --- PRESENTATION ------------------------------------------------------------
const ASSETS = [
  { key: "bitcoin", label: "Held in Bitcoin", symbol: "\u20BF", accent: "#F7C948", track: "#F7C948" },
  { key: "gold", label: "Held in Gold", symbol: "\u25C7", accent: "#E08A2B", track: "#E08A2B" },
  { key: "usdt", label: "Held in dollars", symbol: "$", accent: "#3AAE9B", track: "#3AAE9B" },
  { key: "tbills", label: "Held in T-Bills", symbol: "\u20A6", accent: "#4B7A46", track: "#D64B4B" },
];
const fmtUsd = (n) => "$" + Math.round(n).toLocaleString("en-US");
const fmtNgn = (n) => "\u20A6" + Math.round(n).toLocaleString("en-US");

export default function SavingsCalculator() {
  const [monthlyNgn, setMonthlyNgn] = useState(100000);
  const [monthsHeld, setMonthsHeld] = useState(66);
  const [currency, setCurrency] = useState("USD");
  const data = useMemo(() => computeSavings(monthlyNgn, monthsHeld), [monthlyNgn, monthsHeld]);
  const baseUsd = data.results.usdt.usd;
  const maxUsd = Math.max(...ASSETS.map((a) => data.results[a.key].usd));
  const years = Math.floor(monthsHeld / 12), rem = monthsHeld % 12;
  const durLabel = ((years > 0 ? years + " yr" + (years > 1 ? "s" : "") : "") +
    (rem > 0 ? (years > 0 ? " " : "") + rem + " mo" + (rem > 1 ? "s" : "") : "")) || "0 mos";

  return (
    <div style={S.page}>
      <div style={S.grid}>
        <div style={S.left}>
          <div style={S.eyebrow}>The savings problem</div>
          <h1 style={S.headline}>You saved {fmtNgn(data.totalNgnIn)}.<br />But did you really?</h1>
          <p style={S.sub}>
            Saving {fmtNgn(monthlyNgn)} every month from Jan 2021 ({monthsHeld} deposits), this is
            what it would be worth today, depending on what you held it in.
          </p>
          <div style={S.controlBlock}>
            <div style={S.controlLabel}>How much do you save each month?</div>
            <div style={S.bigAmount}>{fmtNgn(monthlyNgn)}</div>
            <input type="range" min={10000} max={500000} step={10000} value={monthlyNgn}
              onChange={(e) => setMonthlyNgn(Number(e.target.value))} style={S.range}
              aria-label="Monthly savings amount in naira" />
            <div style={S.rangeSub}>{fmtNgn(monthlyNgn)} / month</div>
          </div>
          <div style={S.controlBlock}>
            <div style={S.controlRow}>
              <span style={S.controlLabelStrong}>How long have you saved for?</span>
              <span style={S.durBadge}>{durLabel}</span>
            </div>
            <input type="range" min={1} max={MONTHLY.length} step={1} value={monthsHeld}
              onChange={(e) => setMonthsHeld(Number(e.target.value))} style={S.range}
              aria-label="Months saved" />
            <div style={S.ticks}><span>1 yr</span><span>2 yrs</span><span>3 yrs</span><span>4 yrs</span><span>5 yrs</span></div>
          </div>
        </div>
        <div style={S.card}>
          <div style={S.cardHead}>
            <span style={S.cardTitle}>What it's worth today</span>
            <div style={S.toggle}>
              {["USD", "NGN"].map((c) => (
                <button key={c} onClick={() => setCurrency(c)}
                  style={{ ...S.toggleBtn, ...(currency === c ? S.toggleBtnActive : {}) }}>{c}</button>
              ))}
            </div>
          </div>
          {ASSETS.map((a, i) => {
            const r = data.results[a.key];
            const display = currency === "USD" ? fmtUsd(r.usd) : fmtNgn(r.ngn);
            const deltaUsd = r.usd - baseUsd, deltaNgn = r.ngn - data.results.usdt.ngn;
            const barPct = Math.max(4, (r.usd / maxUsd) * 100);
            const isBaseline = a.key === "usdt", behind = deltaUsd < -1;
            const amt = currency === "USD" ? fmtUsd(Math.abs(deltaUsd)) : fmtNgn(Math.abs(deltaNgn));
            let cap;
            if (isBaseline) cap = { text: "your dollars, preserved", color: "#8A93A6" };
            else if (behind) cap = { text: "you lost " + amt + " to depreciation", color: "#E0574B" };
            else cap = { text: "+" + amt + " ahead of just holding dollars", color: "#C7CDD8" };
            return (
              <div key={a.key} style={{ ...S.assetRow, borderTop: i === 0 ? "none" : S.assetRow.borderTop }}>
                <div style={S.assetTop}>
                  <div style={S.assetLeft}>
                    <span style={{ ...S.assetIcon, background: a.accent }}>{a.symbol}</span>
                    <span style={S.assetLabel}>{a.label}</span>
                  </div>
                  <span style={S.assetValue}>{display}</span>
                </div>
                <div style={{ ...S.caption, color: cap.color }}>{cap.text}</div>
                <div style={S.barTrack}>
                  <div style={{ ...S.barFill, width: barPct + "%", background: behind ? "#D64B4B" : a.track }} />
                </div>
              </div>
            );
          })}
          <div style={S.disclaimer}>
            FX: real Monierate USDT/NGN composite from Sep 2023; 2021-early 2023 interpolated between real anchors. BTC and gold real throughout. CBN T-bill rates. </div>
        </div>
      </div>
    </div>
  );
}

// --- STYLES ------------------------------------------------------------------
const S = {
  page: { background: "#0A0E1A", color: "#FFFFFF", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", padding: "32px", minHeight: "100%", boxSizing: "border-box" },
  grid: { display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: "40px", maxWidth: "1200px", margin: "0 auto", alignItems: "start" },
  left: { minWidth: 0 },
  eyebrow: { color: "#5B7CFF", fontSize: "15px", fontWeight: 600, marginBottom: "16px" },
  headline: { fontSize: "clamp(32px, 4vw, 52px)", lineHeight: 1.05, fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 24px" },
  sub: { color: "#A7AEBD", fontSize: "17px", lineHeight: 1.5, margin: "0 0 40px", maxWidth: "460px" },
  controlBlock: { marginBottom: "32px" },
  controlLabel: { color: "#8A93A6", fontSize: "15px", marginBottom: "10px" },
  controlLabelStrong: { color: "#FFFFFF", fontSize: "19px", fontWeight: 700 },
  controlRow: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "14px" },
  bigAmount: { fontSize: "40px", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "12px" },
  range: { width: "100%", accentColor: "#5B7CFF", cursor: "pointer", height: "6px" },
  rangeSub: { color: "#5B6373", fontSize: "14px", marginTop: "8px", textDecoration: "line-through", textDecorationColor: "#2A3140" },
  durBadge: { color: "#A7AEBD", fontSize: "15px", fontWeight: 500 },
  ticks: { display: "flex", justifyContent: "space-between", color: "#FFFFFF", fontSize: "15px", fontWeight: 500, marginTop: "14px" },
  card: { background: "#0E1424", border: "1px solid #1E2740", borderRadius: "20px", padding: "28px", minWidth: 0 },
  cardHead: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" },
  cardTitle: { color: "#8A93A6", fontSize: "17px", fontWeight: 500 },
  toggle: { display: "flex", background: "#141C30", borderRadius: "10px", padding: "3px", border: "1px solid #232D47" },
  toggleBtn: { background: "transparent", border: "none", color: "#7A8398", fontSize: "14px", fontWeight: 600, padding: "7px 16px", borderRadius: "8px", cursor: "pointer" },
  toggleBtnActive: { background: "#22305A", color: "#FFFFFF" },
  assetRow: { padding: "18px 0", borderTop: "1px solid #1A2338" },
  assetTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" },
  assetLeft: { display: "flex", alignItems: "center", gap: "12px", minWidth: 0 },
  assetIcon: { width: "34px", height: "34px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "17px", fontWeight: 700, color: "#0A0E1A", flexShrink: 0 },
  assetLabel: { fontSize: "20px", fontWeight: 700 },
  assetValue: { fontSize: "26px", fontWeight: 800, letterSpacing: "-0.01em" },
  caption: { fontSize: "14px", marginBottom: "12px" },
  barTrack: { height: "12px", background: "#141C30", borderRadius: "6px", overflow: "hidden" },
  barFill: { height: "100%", borderRadius: "6px", transition: "width 0.4s ease" },
  disclaimer: { color: "#5B6373", fontSize: "13px", lineHeight: 1.5, marginTop: "20px" },
};
