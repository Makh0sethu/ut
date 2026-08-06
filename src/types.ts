export type KpiCategory = 'Reliability & Operations' | 'Commercial & Revenue' | 'Customer & Access';

export type InstrumentAesthetic = 'SAIDI_DURATION' | 'SAIFI_FREQ' | 'ACCESS_GRID' | 'ENERGY_SALES' | 'COLLECTION_INDEX' | 'SYSTEM_LOSSES' | 'CSAT_RATING' | 'FAULT_RESPONSE' | 'WAITING_PERIOD';

export interface RegionalData {
  region: string;
  value: number;
}

export interface KpiMetric {
  id: string;
  code: string;
  name: string;
  subtitle: string;
  badgeTag: string; // e.g. DURATION, FREQUENCY, COVERAGE, COMMERCIAL, CASH REALISATION, EFFICIENCY, SERVICE, RESPONSE, CONNECTIONS
  category: KpiCategory;
  value: number;
  unit: string;
  min: number;
  max: number;
  target: number;
  // If inverted is true, lower values are better (e.g. SAIDI, SAIFI, Losses, Response Time, Waiting Days)
  inverted: boolean;
  greenThreshold: number; // Border between Green and Amber
  redThreshold: number;   // Border between Amber and Red
  history: number[]; // 12 historical time points
  regionalBreakdown: RegionalData[];
  description: string;
  formula: string;
  aestheticType: InstrumentAesthetic;
}

export type CockpitTheme = 'daylight';

export type RegionFilter = string;

export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  badge: string;
  // Multiplier per KPI id, relative to that KPI's nominal baseline (1 = no change).
  // Applied on top of the region/district/customer-class/network-level value, so a
  // scenario scales whatever the current filters already show rather than replacing it.
  weights: Record<string, number>;
}
