import { KpiMetric, SimulationScenario } from '../types';
import { classifyDistrictTier } from '../data/zetdcReferenceData';

export interface CockpitFilterState {
  region: string;
  district: string;
  customerClass: string;
  networkLevel: string;
  reportingPeriod: string;
}

// Deterministic string -> [0,1) hash (FNV-1a + xorshift finalize). Same input always
// produces the same fraction, so a given district's numbers stay stable across renders.
function seededFraction(seed: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  h ^= h >>> 13;
  h = Math.imul(h, 0x5bd1e995);
  h ^= h >>> 15;
  return ((h >>> 0) % 10000) / 10000;
}

// Degradation factor by district tier: >1 means worse-performing, <1 means better-performing,
// consistent with the Harare/Bulawayo-best, rural-Matabeleland-worst pattern already used
// in the hand-authored regional breakdowns.
const DISTRICT_TIER_DEGRADATION: Record<'metro' | 'urban' | 'rural', number> = {
  metro: 0.78,
  urban: 0.97,
  rural: 1.24,
};

// Per-district, per-KPI multiplier. Combines the district's infrastructure tier with a small
// deterministic jitter so neighboring rural districts don't all read identically.
export function getDistrictMultiplier(district: string, kpiId: string, inverted: boolean): number {
  if (!district || district === 'All Districts') return 1;
  const tier = classifyDistrictTier(district);
  const jitter = (seededFraction(`${district}::${kpiId}`) - 0.5) * 0.22;
  const degradation = Math.max(0.4, DISTRICT_TIER_DEGRADATION[tier] + jitter);
  // Inverted KPIs (SAIDI, SAIFI, losses, response/wait times) get worse as degradation rises.
  // Non-inverted KPIs (access, sales, collection, CSAT) get better as degradation falls.
  return inverted ? degradation : 1 / degradation;
}

// Customer-class adjustment factors, curated per KPI. Absent entries default to 1 (no change).
// Reflects realistic ZETDC tariff-class behaviour: industrial/large ToU customers sit on
// priority-maintained feeders (better reliability, higher volumes); government accounts lag
// on collections; agricultural & public lighting sit at the tail of service priority.
const CUSTOMER_CLASS_FACTORS: Record<string, Partial<Record<string, number>>> = {
  'All Classes': {},
  DOMESTIC: {},
  COMMERCIAL: {
    saidi: 0.86, saifi: 0.88, system_losses: 0.93, collection_index: 1.02, response_time: 0.9,
  },
  INDUSTRIAL: {
    saidi: 0.62, saifi: 0.68, energy_sales: 1.4, system_losses: 0.8, collection_index: 0.95, response_time: 0.72,
  },
  PUBLIC_LIGHTING: {
    energy_sales: 0.12, response_time: 1.65, customer_rating: 0.92, waiting_period: 1.2,
  },
  AGRICULTURAL: {
    saidi: 1.4, saifi: 1.32, access: 0.91, response_time: 1.45, waiting_period: 1.55, energy_sales: 0.55,
  },
  GOVERNMENT: {
    collection_index: 0.83, waiting_period: 1.22, response_time: 1.12, energy_sales: 0.7,
  },
  LARGE: {
    saidi: 0.58, saifi: 0.63, energy_sales: 1.65, collection_index: 0.98, response_time: 0.68, system_losses: 0.82,
  },
  FOUNDRY: {
    saidi: 0.7, saifi: 0.74, energy_sales: 1.85, system_losses: 0.85, response_time: 0.8, collection_index: 0.96,
  },
};

// Network-level adjustment factors. "region" is the aggregate node (baseline, no change).
// Losses and fault-response degrade as you step down the voltage hierarchy toward the
// customer's meter, mirroring the defaultLossPercent progression in ZETDC_NETWORK_LEVELS.
const NETWORK_LEVEL_FACTORS: Record<string, Partial<Record<string, number>>> = {
  'All Voltage Levels': {},
  region: {},
  district: { system_losses: 1.15, response_time: 1.1, saidi: 1.05 },
  depot: { system_losses: 1.35, response_time: 1.32, saidi: 1.2, saifi: 1.15 },
  hv_33kv: { saidi: 0.52, saifi: 0.58, system_losses: 0.48, response_time: 0.58 },
  mv_11kv: { saidi: 0.96, saifi: 0.95, system_losses: 1.0, response_time: 0.96 },
  lv_04kv: { saidi: 1.48, saifi: 1.52, system_losses: 1.62, response_time: 1.38 },
};

function average(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

// Derives a value for the selected reporting period from the KPI's own 12-point history,
// so period switching reuses the already-authored trend instead of inventing new numbers.
// History is treated as trailing months; the most recent points are the current quarter.
export function getPeriodValue(kpi: KpiMetric, period: string): number {
  const h = kpi.history;
  const n = h.length;
  if (n === 0) return kpi.value;

  switch (period) {
    case 'Q2 2026':
      return average(h.slice(Math.max(0, n - 6), Math.max(1, n - 3)));
    case 'YTD 2026':
      return average(h.slice(Math.max(0, n - 9)));
    case 'FY 2025':
      return average(h.slice(0, Math.max(1, n - 9)));
    case 'Q3 2026':
    default:
      return kpi.value;
  }
}

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

function roundForUnit(val: number, unit: string): number {
  if (unit === '%' || unit === '/ 5.0') return Math.round(val * 100) / 100;
  if (val >= 100) return Math.round(val);
  if (val >= 10) return Math.round(val * 10) / 10;
  return Math.round(val * 100) / 100;
}

// Applies the full sidebar filter stack (reporting period -> region -> district -> customer
// class -> network level -> flight scenario) to a KPI, compounding each as an independent
// multiplier so every filter visibly moves the number, in combination with any other active
// filter. A scenario is a weight applied on top of the region/district result, not a flat
// override, so picking a region while a scenario is active still shows that region's own
// variance scaled by the scenario rather than reverting to the plain reference number.
export function computeDisplayKpi(
  kpi: KpiMetric,
  filters: CockpitFilterState,
  scenario?: SimulationScenario | null
): KpiMetric {
  let value = getPeriodValue(kpi, filters.reportingPeriod);

  if (filters.region && filters.region !== 'All Regions') {
    const regData = kpi.regionalBreakdown.find((r) => r.region === filters.region);
    if (regData && kpi.value !== 0) {
      value *= regData.value / kpi.value;
    }
  }

  value *= getDistrictMultiplier(filters.district, kpi.id, kpi.inverted);
  value *= CUSTOMER_CLASS_FACTORS[filters.customerClass]?.[kpi.id] ?? 1;
  value *= NETWORK_LEVEL_FACTORS[filters.networkLevel]?.[kpi.id] ?? 1;
  value *= scenario?.weights[kpi.id] ?? 1;

  value = roundForUnit(clamp(value, kpi.min, kpi.max), kpi.unit);

  return { ...kpi, value };
}
