/**
 * Pure savings engine.
 *
 * A saver puts the same amount of local currency aside every month. Each
 * deposit converts at that month's rate; Bitcoin and gold accumulate units at
 * that month's price; dollars are simply held; bills compound the local
 * currency monthly at the prevailing annual rate and convert once at the end.
 * "Today" is the last month in the currency's series.
 */

import { marketSeries, type MarketMonth, type SavingsCurrency } from "./savingsData.ts";

export type VehicleKey = "gold" | "bitcoin" | "tbills" | "usd" | "local";

export type VehicleValue = {
  readonly key: VehicleKey;
  /** Worth today in the saver's local currency. */
  readonly local: number;
  /** The same worth in USD, at today's rate. */
  readonly usd: number;
};

export type SavingsResult = {
  readonly currency: SavingsCurrency;
  readonly monthlyAmount: number;
  readonly depositCount: number;
  /** First and last deposit month, "YYYY-MM". */
  readonly firstMonth: string;
  readonly lastMonth: string;
  readonly totalLocalIn: number;
  readonly totalUsdIn: number;
  /** Local currency per USD on the last month of the series. */
  readonly todayFx: number;
  /** Fixed order: gold, bitcoin, tbills (when the currency has bills), usd, local. */
  readonly vehicles: readonly VehicleValue[];
};

const marketByMonth = new Map<string, MarketMonth>(
  marketSeries.map((month) => [month.month, month]),
);

export function calculateSavings({
  currency,
  monthlyAmount,
  years,
}: {
  currency: SavingsCurrency;
  monthlyAmount: number;
  years: number;
}): SavingsResult | null {
  const series = currency.series;
  if (!series || series.length === 0) return null;

  const months = Math.round(years * 12);
  if (!Number.isFinite(months) || months < 1) return null;

  const window = series.slice(-months);
  const today = series[series.length - 1];
  const todayMarket = marketByMonth.get(today.month);
  if (!todayMarket) return null;

  let btcUnits = 0;
  let goldGrams = 0;
  let usdHeld = 0;
  let tbillLocal = 0;
  let totalLocalIn = 0;

  for (const row of window) {
    const market = marketByMonth.get(row.month);
    if (!market) return null;

    const usd = monthlyAmount / row.perUsd;
    totalLocalIn += monthlyAmount;
    btcUnits += usd / market.btcUsd;
    goldGrams += usd / market.goldUsdPerGram;
    usdHeld += usd;
    tbillLocal = tbillLocal * (1 + market.tbillPct / 100 / 12) + monthlyAmount;
  }

  const todayFx = today.perUsd;
  const inLocal = (usd: number) => usd * todayFx;
  const goldUsd = goldGrams * todayMarket.goldUsdPerGram;
  const bitcoinUsd = btcUnits * todayMarket.btcUsd;

  const vehicles: VehicleValue[] = [
    { key: "gold", local: inLocal(goldUsd), usd: goldUsd },
    { key: "bitcoin", local: inLocal(bitcoinUsd), usd: bitcoinUsd },
  ];

  if (currency.tbillSource) {
    vehicles.push({ key: "tbills", local: tbillLocal, usd: tbillLocal / todayFx });
  }

  vehicles.push({ key: "usd", local: inLocal(usdHeld), usd: usdHeld });
  vehicles.push({ key: "local", local: totalLocalIn, usd: totalLocalIn / todayFx });

  return {
    currency,
    monthlyAmount,
    depositCount: window.length,
    firstMonth: window[0].month,
    lastMonth: window[window.length - 1].month,
    totalLocalIn,
    totalUsdIn: usdHeld,
    todayFx,
    vehicles,
  };
}

/** Percentage difference between a vehicle and the idle local-currency baseline. */
export function pctVsBaseline(value: number, baseline: number): number {
  if (!Number.isFinite(baseline) || baseline === 0) return 0;
  return ((value - baseline) / baseline) * 100;
}
