export interface ZetdcDistrict {
  id: string;
  code: string;
  name: string;
  region: string;
}

export interface ZetdcCustomerCategory {
  key: string;
  label: string;
  tariffCode: string;
  exportRate?: number; // Net billing credit rate
}

export interface NetMeteringPolicy {
  domesticExportRate: number; // 0.85
  commercialExportRate: number; // 0.80
  referenceTariff: number; // $0.1679/kWh
  duosCharge: number; // $0.0200/kWh
  licensingThresholdMw: number; // 10 MW
}

export interface NetworkLevel {
  id: string;
  name: string;
  defaultCapacityMva?: number;
  defaultLossPercent?: number;
  voltageKv?: string;
}

// 1. ZETDC 5 Operational Regions
export const ZETDC_REGIONS: string[] = [
  'Harare Region',
  'Northern Region',
  'Southern Region',
  'Eastern Region',
  'Western Region',
];

// 2. ZETDC 18 Operational Districts, grouped under the 5 Regions above
export const ZETDC_DISTRICTS: ZetdcDistrict[] = [
  { id: 'harare_east', code: 'REG-01', name: 'Harare — East', region: 'Harare Region' },
  { id: 'harare_north', code: 'REG-02', name: 'Harare — North', region: 'Harare Region' },
  { id: 'harare_south', code: 'REG-03', name: 'Harare — South', region: 'Harare Region' },
  { id: 'chitungwiza', code: 'REG-04', name: 'Chitungwiza', region: 'Harare Region' },
  { id: 'chinhoyi', code: 'REG-05', name: 'Chinhoyi (Northern Region)', region: 'Northern Region' },
  { id: 'bindura', code: 'REG-06', name: 'Bindura (Northern Region)', region: 'Northern Region' },
  { id: 'kadoma', code: 'REG-07', name: 'Kadoma (Northern Region)', region: 'Northern Region' },
  { id: 'marondera', code: 'REG-08', name: 'Marondera (Northern Region)', region: 'Northern Region' },
  { id: 'gweru', code: 'REG-09', name: 'Gweru (Southern Region)', region: 'Southern Region' },
  { id: 'kwekwe', code: 'REG-10', name: 'Kwekwe (Southern Region)', region: 'Southern Region' },
  { id: 'zvishavane', code: 'REG-11', name: 'Zvishavane (Southern Region)', region: 'Southern Region' },
  { id: 'mutare', code: 'REG-12', name: 'Mutare', region: 'Eastern Region' },
  { id: 'manicaland', code: 'REG-13', name: 'Manicaland', region: 'Eastern Region' },
  { id: 'masvingo', code: 'REG-14', name: 'Masvingo', region: 'Eastern Region' },
  { id: 'gwanda', code: 'REG-15', name: 'Gwanda (Matabeleland)', region: 'Western Region' },
  { id: 'hwange', code: 'REG-16', name: 'Hwange (Matabeleland)', region: 'Western Region' },
  { id: 'bulawayo_west', code: 'REG-17', name: 'Bulawayo — West', region: 'Western Region' },
  { id: 'bulawayo_east', code: 'REG-18', name: 'Bulawayo — East', region: 'Western Region' },
];

// 3. Customer Classes (TariffRate Model)
export const ZETDC_CUSTOMER_CATEGORIES: ZetdcCustomerCategory[] = [
  { key: 'DOMESTIC', label: 'Domestic (E1.x)', tariffCode: 'E 1.1 - E 1.4', exportRate: 0.85 },
  { key: 'COMMERCIAL', label: 'Commercial (E2.x)', tariffCode: 'E 2.1 - E 2.3', exportRate: 0.80 },
  { key: 'INDUSTRIAL', label: 'Industrial / Mining (E3.x)', tariffCode: 'E 3.1 - E 3.4' },
  { key: 'PUBLIC_LIGHTING', label: 'Public Lighting (E4.x)', tariffCode: 'E 4.1' },
  { key: 'AGRICULTURAL', label: 'Agricultural (E5.x)', tariffCode: 'E 5.1' },
  { key: 'GOVERNMENT', label: 'Government Institutions (E6.x)', tariffCode: 'E 6.1' },
  { key: 'LARGE', label: 'Large Customers (E7.x ToU)', tariffCode: 'E 7.1' },
  { key: 'FOUNDRY', label: 'Foundry (E8.x)', tariffCode: 'E 8.1' },
];

// 4. Net Metering Export Policy
export const ZETDC_NET_METERING_POLICY: NetMeteringPolicy = {
  domesticExportRate: 0.85, // 85c per $1
  commercialExportRate: 0.80, // 80c per $1
  referenceTariff: 0.1679, // $0.1679/kWh
  duosCharge: 0.0200, // $0.0200/kWh DUoS
  licensingThresholdMw: 10, // 10 MW
};

// 5. Grid Node Level Hierarchy
export const ZETDC_NETWORK_LEVELS: NetworkLevel[] = [
  { id: 'hv_33kv', name: 'High Voltage ' },
  { id: 'mv_11kv', name: 'Medium Voltage' },
  { id: 'lv_04kv', name: 'Low Voltage' },
];
