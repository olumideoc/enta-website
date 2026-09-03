# Data sources - Enta savings calculator (Monierate-backed final)

68 months, Jan 2021 - Aug 2026. 53% of FX is real Monierate Pro data.

## NGN/USD  (basis: USDT/NGN, labelled "saving in dollars")
- Sep 2023 - Aug 2026 (36 months): REAL. Monierate Pro historical API,
  usdtngn daily composite candles aggregated to monthly averages. Pulled via
  pull_monierate.py. Methodology boundary 2026-03-17 (legacy_host -> trimmedMean).
- Jan 2023 anchor + interpolation and 2021-2022: abokiFX/@naira_rates/press
  anchors (N490 Jan21, N700 May21, N570 Sep21, N710 Sep22, N745 Dec22, N755
  Jan23, N770 Jun23), months between interpolated. Monierate has no data before
  Sep 2023; abokiFX dark since Sep 2021. This gap is irreducible.

## Bitcoin - real first-of-month BTC/USD (Habrador GitHub) + press tail.
## Gold - real monthly LBMA USD/oz -> USD/g (datasets/gold-prices GitHub).
## T-bill - CBN 364-day benchmark (CEIC/THISDAY), real points interpolated.

## Provenance counts
Monierate real: 36 | anchors: 7 | interpolated: 25
