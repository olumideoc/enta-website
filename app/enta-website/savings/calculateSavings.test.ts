import assert from "node:assert/strict";
import test from "node:test";
import { calculateSavings, pctVsBaseline, type VehicleKey } from "./calculateSavings.ts";
import { findCurrency, marketSeries, savingsCurrencies } from "./savingsData.ts";
import {
  formatBaselineLabel,
  formatLocalCompact,
  formatMonthLabel,
  formatPercent,
} from "./format.ts";

const ngn = findCurrency("NGN");

function usdFor(
  result: ReturnType<typeof calculateSavings>,
  key: VehicleKey,
): number {
  const vehicle = result?.vehicles.find((entry) => entry.key === key);
  assert.ok(vehicle, `expected a ${key} vehicle`);
  return vehicle.usd;
}

test("reproduces the published headline: 66 deposits of NGN 100,000", () => {
  const result = calculateSavings({ currency: ngn, monthlyAmount: 100000, years: 5.5 });
  assert.ok(result);
  assert.equal(result.depositCount, 66);
  assert.equal(result.firstMonth, "2021-03");
  assert.equal(result.lastMonth, "2026-08");
  assert.equal(result.totalLocalIn, 6600000);

  const within = (key: VehicleKey, expected: number) => {
    const actual = usdFor(result, key);
    assert.ok(
      Math.abs(actual - expected) <= 40,
      `${key}: expected ~$${expected}, got $${actual.toFixed(0)}`,
    );
  };

  within("bitcoin", 11453);
  within("gold", 14337);
  within("usd", 6894);
  within("tbills", 7434);
});

test("the deposit window ends on the last month of the series", () => {
  const result = calculateSavings({ currency: ngn, monthlyAmount: 600000, years: 3 });
  assert.ok(result);
  assert.equal(result.depositCount, 36);
  assert.equal(result.firstMonth, "2023-09");
  assert.equal(result.lastMonth, "2026-08");
  assert.equal(formatMonthLabel(result.firstMonth), "Sep 2023");
  assert.equal(result.totalLocalIn, 21600000);
  assert.equal(formatLocalCompact(result.totalLocalIn, "₦"), "₦21.6M");
  assert.equal(result.todayFx, 1393.63);
});

test("every vehicle scales linearly with the monthly amount", () => {
  const single = calculateSavings({ currency: ngn, monthlyAmount: 100000, years: 3 });
  const quadruple = calculateSavings({ currency: ngn, monthlyAmount: 400000, years: 3 });
  assert.ok(single);
  assert.ok(quadruple);

  for (const vehicle of single.vehicles) {
    const scaled = quadruple.vehicles.find((entry) => entry.key === vehicle.key);
    assert.ok(scaled);
    assert.ok(
      Math.abs(scaled.local - vehicle.local * 4) < 1e-6 * Math.max(1, vehicle.local),
      `${vehicle.key} did not scale linearly`,
    );
  }
});

test("the local baseline is exactly what went in, and pills read off it", () => {
  const result = calculateSavings({ currency: ngn, monthlyAmount: 600000, years: 3 });
  assert.ok(result);
  const baseline = result.vehicles.find((entry) => entry.key === "local");
  assert.ok(baseline);
  assert.equal(baseline.local, result.totalLocalIn);
  assert.equal(pctVsBaseline(baseline.local, baseline.local), 0);
  assert.equal(pctVsBaseline(150, 100), 50);
  assert.equal(pctVsBaseline(80, 100), -20);
});

test("vehicles keep a fixed order and both currency legs agree", () => {
  const result = calculateSavings({ currency: ngn, monthlyAmount: 600000, years: 3 });
  assert.ok(result);
  assert.deepEqual(
    result.vehicles.map((vehicle) => vehicle.key),
    ["gold", "bitcoin", "tbills", "usd", "local"],
  );
  for (const vehicle of result.vehicles) {
    assert.ok(Math.abs(vehicle.usd * result.todayFx - vehicle.local) < 1e-6);
  }
});

test("every currency carries 68 FX rows on the market series months", () => {
  const marketMonths = marketSeries.map((month) => month.month);
  assert.equal(marketMonths.length, 68);
  assert.equal(savingsCurrencies.length, 4);

  for (const currency of savingsCurrencies) {
    assert.equal(currency.available, true, `${currency.code} should be selectable`);
    assert.ok(currency.series, `${currency.code} should have a series`);
    assert.equal(currency.series.length, 68, `${currency.code} row count`);
    assert.deepEqual(
      currency.series.map((row) => row.month),
      marketMonths,
      `${currency.code} months should line up with the market series`,
    );
    for (const row of currency.series) {
      assert.ok(Number.isFinite(row.perUsd) && row.perUsd > 0, `${currency.code} ${row.month}`);
    }
  }
});

test("T-bills are NGN-only: EGP, GHS and KES show four vehicles", () => {
  for (const code of ["EGP", "GHS", "KES"] as const) {
    const currency = findCurrency(code);
    assert.equal(currency.tbillSource, null);
    const result = calculateSavings({
      currency,
      monthlyAmount: currency.defaultMonthlyAmount,
      years: 3,
    });
    assert.ok(result, `${code} should calculate`);
    assert.equal(result.vehicles.length, 4);
    assert.deepEqual(
      result.vehicles.map((vehicle) => vehicle.key),
      ["gold", "bitcoin", "usd", "local"],
    );
  }
  assert.equal(ngn.tbillSource, "CBN 364-day");
});

test("switching currency switches the baseline noun and the pill wording", () => {
  const expected = [
    { code: "NGN", label: "Held in Naira", pill: "+47% vs naira" },
    { code: "EGP", label: "Held in Pounds", pill: "+47% vs pounds" },
    { code: "GHS", label: "Held in Cedis", pill: "+47% vs cedis" },
    { code: "KES", label: "Held in Shillings", pill: "+47% vs shillings" },
  ] as const;

  for (const { code, label, pill } of expected) {
    const currency = findCurrency(code);
    assert.equal(formatBaselineLabel(currency.noun), label);
    assert.equal(`${formatPercent(47)} vs ${currency.noun}`, pill);
  }
});

test("hand-checkable KES case: 36 deposits of 55,000", () => {
  const kes = findCurrency("KES");
  assert.ok(kes.series);
  const result = calculateSavings({ currency: kes, monthlyAmount: 55000, years: 3 });
  assert.ok(result);
  assert.equal(result.depositCount, 36);
  assert.equal(result.firstMonth, "2023-09");
  assert.equal(result.lastMonth, "2026-08");
  assert.equal(result.totalLocalIn, 1980000);
  assert.equal(result.todayFx, 129.4);

  // Dollars held, done by hand: every deposit converted at its own month's rate,
  // then valued back at today's rate.
  const window = kes.series.slice(-36);
  const usdHeld = window.reduce((total, row) => total + 55000 / row.perUsd, 0);
  const expectedLocal = usdHeld * 129.4;

  const held = result.vehicles.find((vehicle) => vehicle.key === "usd");
  assert.ok(held);
  assert.ok(
    Math.abs(held.local - expectedLocal) < 1,
    `expected KSh${expectedLocal.toFixed(2)}, got KSh${held.local.toFixed(2)}`,
  );
  // The same figure, frozen: KSh1,926,467.54 from 14,887.69 dollars.
  assert.ok(Math.abs(held.local - 1926467.54) < 1);
  assert.ok(Math.abs(held.usd - 14887.69) < 0.01);
  assert.equal(formatLocalCompact(result.totalLocalIn, kes.symbol), "KSh2M");
});

test("compact values round before they pick a unit", () => {
  assert.equal(formatLocalCompact(999_960.55, "GH₵"), "GH₵1M");
  assert.equal(formatLocalCompact(999_950_000, "₦"), "₦1B");
  assert.equal(formatLocalCompact(999_949, ""), "999.9k");
  assert.equal(formatLocalCompact(1_000_000, ""), "1M");
  assert.equal(formatLocalCompact(-999_960.55, "GH₵"), "-GH₵1M");
});

test("one year is twelve deposits, five years is sixty", () => {
  for (const [years, deposits] of [
    [1, 12],
    [2, 24],
    [3, 36],
    [4, 48],
    [5, 60],
  ] as const) {
    const result = calculateSavings({ currency: ngn, monthlyAmount: 100000, years });
    assert.ok(result);
    assert.equal(result.depositCount, deposits);
    assert.equal(result.lastMonth, "2026-08");
  }
});
