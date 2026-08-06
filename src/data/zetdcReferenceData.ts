export interface ZetdcRegion {
  id: string;
  code: string;
  name: string;
  zone: string;
  primaryDistrict: string;
}

export interface ZetdcProvince {
  name: string;
  districts: string[];
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

// 1. ZETDC 17 Operational Regions
export const ZETDC_OPERATIONAL_REGIONS: ZetdcRegion[] = [
  { id: 'harare_east', code: 'REG-01', name: 'Harare — East', zone: 'Harare Metro', primaryDistrict: 'Harare Municipality' },
  { id: 'harare_north', code: 'REG-02', name: 'Harare — North', zone: 'Harare Metro', primaryDistrict: 'Harare Municipality' },
  { id: 'harare_south', code: 'REG-03', name: 'Harare — South', zone: 'Harare Metro', primaryDistrict: 'Harare Municipality' },
  { id: 'chitungwiza', code: 'REG-04', name: 'Chitungwiza', zone: 'Harare Metro', primaryDistrict: 'Chitungwiza' },
  { id: 'chinhoyi', code: 'REG-05', name: 'Chinhoyi (Northern Region)', zone: 'Northern Region', primaryDistrict: 'Chinhoyi' },
  { id: 'bindura', code: 'REG-06', name: 'Bindura (Northern Region)', zone: 'Northern Region', primaryDistrict: 'Bindura' },
  { id: 'kadoma', code: 'REG-07', name: 'Kadoma (Northern Region)', zone: 'Northern Region', primaryDistrict: 'Kadoma' },
  { id: 'marondera', code: 'REG-08', name: 'Marondera (Northern Region)', zone: 'Northern Region', primaryDistrict: 'Marondera' },
  { id: 'gweru', code: 'REG-09', name: 'Gweru (Midlands)', zone: 'Midlands Region', primaryDistrict: 'Gweru' },
  { id: 'kwekwe', code: 'REG-10', name: 'Kwekwe (Midlands)', zone: 'Midlands Region', primaryDistrict: 'Kwekwe' },
  { id: 'zvishavane', code: 'REG-11', name: 'Zvishavane (Midlands)', zone: 'Midlands Region', primaryDistrict: 'Zvishavane' },
  { id: 'mutare_manicaland', code: 'REG-12', name: 'Mutare / Manicaland', zone: 'Eastern Region', primaryDistrict: 'Mutare' },
  { id: 'masvingo', code: 'REG-13', name: 'Masvingo', zone: 'Southern Region', primaryDistrict: 'Masvingo' },
  { id: 'gwanda', code: 'REG-14', name: 'Gwanda (Matabeleland)', zone: 'Western Region', primaryDistrict: 'Gwanda' },
  { id: 'hwange', code: 'REG-15', name: 'Hwange (Matabeleland)', zone: 'Western Region', primaryDistrict: 'Hwange' },
  { id: 'bulawayo_west', code: 'REG-16', name: 'Bulawayo — West', zone: 'Western Region', primaryDistrict: 'Bulawayo' },
  { id: 'bulawayo_east', code: 'REG-17', name: 'Bulawayo — East', zone: 'Western Region', primaryDistrict: 'Bulawayo' },
];

// 2. ZETDC 83 Districts by 10 Provinces
export const ZETDC_PROVINCES: ZetdcProvince[] = [
  {
    name: 'Bulawayo Province',
    districts: ['Bulawayo'],
  },
  {
    name: 'Harare Province',
    districts: ['Chitungwiza', 'Epworth', 'Harare Municipality', 'Harare Rural'],
  },
  {
    name: 'Manicaland Province',
    districts: ['Buhera', 'Chimanimani', 'Chipinge', 'Chipinge Urban', 'Makoni', 'Mutare', 'Mutare Town', 'Mutasa', 'Nyanga'],
  },
  {
    name: 'Mashonaland Central Province',
    districts: ['Bindura', 'Bindura Urban', 'Guruve', 'Mazowe', 'Mbire', 'Mount Darwin', 'Muzarabani', 'Rushinga', 'Shamva'],
  },
  {
    name: 'Mashonaland East Province',
    districts: ['Chikomba', 'Goromonzi', 'Hwedza', 'Marondera', 'Marondera Town', 'Mudzi', 'Murehwa', 'Mutoko', 'Ruwa', 'Seke', 'UMP'],
  },
  {
    name: 'Mashonaland West Province',
    districts: ['Chegutu', 'Chegutu Town', 'Chinhoyi', 'Hurungwe', 'Kadoma', 'Kariba', 'Kariba Town', 'Karoi', 'Makonde', 'Mhondoro Ngezi', 'Norton', 'Sanyati', 'Zvimba'],
  },
  {
    name: 'Masvingo Province',
    districts: ['Bikita', 'Chiredzi', 'Chiredzi Urban', 'Chivi', 'Gutu', 'Masvingo', 'Masvingo Town', 'Mwenezi', 'Zaka'],
  },
  {
    name: 'Matabeleland North Province',
    districts: ['Binga', 'Bubi', 'Hwange', 'Hwange Town', 'Lupane', 'Nkayi', 'Tsholotsho', 'Umguza', 'Victoria Falls'],
  },
  {
    name: 'Matabeleland South Province',
    districts: ['Beitbridge', 'Beitbridge Town', 'Bulilima (North)', 'Gwanda', 'Gwanda Town', 'Insiza', 'Mangwe (South)', 'Matobo', 'Plumtree', 'Umzingwane'],
  },
  {
    name: 'Midlands Province',
    districts: ['Chirumhanzu', 'Gokwe North', 'Gokwe South', 'Gokwe Urban', 'Gweru', 'Kwekwe', 'Kwekwe Town', 'Mberengwa', 'Redcliff', 'Shurugwi', 'Shurugwi Urban', 'Zvishavane', 'Zvishavane Town'],
  },
];

// Flat list of all 83 Districts
export const ALL_ZETDC_DISTRICTS: string[] = ZETDC_PROVINCES.flatMap((p) => p.districts);

// Metro-tier districts: major city centres with the densest, best-maintained grid infrastructure
const METRO_DISTRICTS = new Set(['Bulawayo', 'Harare Municipality', 'Chitungwiza']);

// Urban/secondary-town-tier districts: provincial capitals & growth points with moderate infrastructure
const URBAN_DISTRICTS = new Set([
  'Epworth', 'Ruwa', 'Norton', 'Redcliff', 'Chinhoyi', 'Bindura Urban', 'Marondera Town',
  'Kadoma', 'Kariba Town', 'Karoi', 'Chegutu Town', 'Mutare Town', 'Chipinge Urban',
  'Masvingo Town', 'Gwanda Town', 'Beitbridge Town', 'Hwange Town', 'Victoria Falls',
  'Gweru', 'Kwekwe Town', 'Gokwe Urban', 'Zvishavane Town', 'Shurugwi Urban', 'Plumtree',
]);

// Classifies a district into an infrastructure tier used to derive realistic mock KPI variance.
// Metro = best-served, Rural = least-served, mirroring the existing regional breakdown pattern.
export function classifyDistrictTier(district: string): 'metro' | 'urban' | 'rural' {
  if (METRO_DISTRICTS.has(district)) return 'metro';
  if (URBAN_DISTRICTS.has(district)) return 'urban';
  return 'rural';
}

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
  { id: 'region', name: 'Region Node (150 MVA)', defaultCapacityMva: 150.0, defaultLossPercent: 3.5 },
  { id: 'district', name: 'District Node (40 MVA)', defaultCapacityMva: 40.0, defaultLossPercent: 4.5 },
  { id: 'depot', name: 'Depot Node (12.5 MVA)', defaultCapacityMva: 12.5, defaultLossPercent: 6.0 },
  { id: 'hv_33kv', name: 'High Voltage (33 kV)', voltageKv: '33kV' },
  { id: 'mv_11kv', name: 'Medium Voltage (11 kV)', voltageKv: '11kV' },
  { id: 'lv_04kv', name: 'Low Voltage (400V)', voltageKv: '0.4kV' },
];
