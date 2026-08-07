export interface ZetdcDistrict {
  id: string;
  code: string;
  name: string;
  region: string;
}

export interface ZetdcDepot {
  code: string;
  name: string;
  parentDistrictCode: string;
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

// 2b. ZETDC 72 Depots (RegionalGridNode, node_type='DEPOT'), grouped under parent district codes
export const ZETDC_DEPOTS: ZetdcDepot[] = [
  { code: '21020', name: 'MABVUKU DEPOT', parentDistrictCode: '20000' },
  { code: '21030', name: 'BORROWDALE DEPOT', parentDistrictCode: '20000' },
  { code: '21040', name: 'CBD DEPOT', parentDistrictCode: '20000' },
  { code: '21050', name: 'RUWA DEPOT', parentDistrictCode: '20000' },
  { code: '22010', name: 'KUWADZANA DEPOT', parentDistrictCode: '20000' },
  { code: '22030', name: 'MABELREIGN DEPOT', parentDistrictCode: '20000' },
  { code: '22040', name: 'WARREN PARK DEPOT', parentDistrictCode: '20000' },
  { code: '23010', name: 'SOUTHERTON DEPOT', parentDistrictCode: '20000' },
  { code: '23020', name: 'GLENVIEW DEPOT', parentDistrictCode: '20000' },
  { code: '23030', name: 'WATERFALLS DEPOT', parentDistrictCode: '20000' },
  { code: '24020', name: 'SEKE DEPOT', parentDistrictCode: '20000' },
  { code: '24030', name: 'ZENGEZA DEPOT', parentDistrictCode: '20000' },
  { code: '31010', name: 'KARIBA DEPOT', parentDistrictCode: '30000' },
  { code: '31020', name: 'KAROI DEPOT', parentDistrictCode: '30000' },
  { code: '31030', name: 'MHANGURA DEPOT', parentDistrictCode: '30000' },
  { code: '31040', name: 'CHINHOYI DEPOT', parentDistrictCode: '30000' },
  { code: '31050', name: 'CHINHOYI RURAL DEPOT', parentDistrictCode: '30000' },
  { code: '31060', name: 'MUTORASHANGA DEPOT', parentDistrictCode: '30000' },
  { code: '32010', name: 'CENTENARY DEPOT', parentDistrictCode: '30000' },
  { code: '32030', name: 'MVURWI DEPOT', parentDistrictCode: '30000' },
  { code: '32040', name: 'MT DARWIN DEPOT', parentDistrictCode: '30000' },
  { code: '32050', name: 'BINDURA DEPOT', parentDistrictCode: '30000' },
  { code: '32070', name: 'CONCESSION DEPOT', parentDistrictCode: '30000' },
  { code: '33010', name: 'KADOMA DEPOT', parentDistrictCode: '30000' },
  { code: '33030', name: 'CHEGUTU DEPOT', parentDistrictCode: '30000' },
  { code: '33050', name: 'BEATRICE DEPOT', parentDistrictCode: '30000' },
  { code: '33060', name: 'NORTON DEPOT', parentDistrictCode: '30000' },
  { code: '34010', name: 'JURU DEPOT', parentDistrictCode: '30000' },
  { code: '34020', name: 'MUTOKO DEPOT', parentDistrictCode: '30000' },
  { code: '34030', name: 'MARONDERA DEPOT', parentDistrictCode: '30000' },
  { code: '34050', name: 'BROMLEY DEPOT', parentDistrictCode: '30000' },
  { code: '41010', name: 'GWERU URBAN DEPOT', parentDistrictCode: '40000' },
  { code: '41020', name: 'GWERU ENVIRONS DEPOT', parentDistrictCode: '40000' },
  { code: '41030', name: 'MVUMA DEPOT', parentDistrictCode: '40000' },
  { code: '41040', name: 'SHURUGWI DEPOT', parentDistrictCode: '40000' },
  { code: '41050', name: 'CHIVHU DEPOT', parentDistrictCode: '40000' },
  { code: '42010', name: 'KWEKWE URBAN DEPOT', parentDistrictCode: '40000' },
  { code: '42020', name: 'NKAYI DEPOT', parentDistrictCode: '40000' },
  { code: '42030', name: 'GOKWE DEPOT', parentDistrictCode: '40000' },
  { code: '42040', name: 'REDCLIFF DEPOT', parentDistrictCode: '40000' },
  { code: '42050', name: 'NEMBUDZIYA DEPOT', parentDistrictCode: '40000' },
  { code: '43010', name: 'ZVISHAVANE DEPOT', parentDistrictCode: '40000' },
  { code: '43020', name: 'MATAGA DEPOT', parentDistrictCode: '40000' },
  { code: '51010', name: 'MUTARE URBAN DEPOT', parentDistrictCode: '50000' },
  { code: '51020', name: 'MUTARE ENVIRONS DEPOT', parentDistrictCode: '50000' },
  { code: '52010', name: 'NYANGA DEPOT', parentDistrictCode: '50000' },
  { code: '52020', name: 'RUSAPE DEPOT', parentDistrictCode: '50000' },
  { code: '52030', name: 'CHIPINGE DEPOT', parentDistrictCode: '50000' },
  { code: '52040', name: 'CHIMANIMANI DEPOT', parentDistrictCode: '50000' },
  { code: '52050', name: 'MIDDLE SABI DEPOT', parentDistrictCode: '50000' },
  { code: '52060', name: 'MURAMBINDA DEPOT', parentDistrictCode: '50000' },
  { code: '53020', name: 'MASVINGO DEPOT', parentDistrictCode: '50000' },
  { code: '53030', name: 'GUTU DEPOT', parentDistrictCode: '50000' },
  { code: '53040', name: 'MASHAVA DEPOT', parentDistrictCode: '50000' },
  { code: '53050', name: 'RUTENGA DEPOT', parentDistrictCode: '50000' },
  { code: '53060', name: 'CHIREDZI DEPOT', parentDistrictCode: '50000' },
  { code: '61010', name: 'MAPHISA DEPOT', parentDistrictCode: '60000' },
  { code: '61020', name: 'GWANDA DEPOT', parentDistrictCode: '60000' },
  { code: '61030', name: 'PLUMTREE DEPOT', parentDistrictCode: '60000' },
  { code: '61050', name: 'ESIGODINI DEPOT', parentDistrictCode: '60000' },
  { code: '61060', name: 'FILABUSI DEPOT', parentDistrictCode: '60000' },
  { code: '61070', name: 'BEITBRIDGE DEPOT', parentDistrictCode: '60000' },
  { code: '62010', name: 'VICTORIA FALLS DEPOT', parentDistrictCode: '60000' },
  { code: '62020', name: 'HWANGE DEPOT', parentDistrictCode: '60000' },
  { code: '62030', name: 'LUPANI DEPOT', parentDistrictCode: '60000' },
  { code: '62040', name: 'BINGA DEPOT', parentDistrictCode: '60000' },
  { code: '62050', name: 'TURK MINE DEPOT', parentDistrictCode: '60000' },
  { code: '63010', name: 'ENTUMBANE DEPOT', parentDistrictCode: '60000' },
  { code: '63020', name: 'NKETA DEPOT', parentDistrictCode: '60000' },
  { code: '64010', name: 'BYO EAST URBAN DEPOT', parentDistrictCode: '60000' },
  { code: '64020', name: 'THSOLOTSHO DEPOT', parentDistrictCode: '60000' },
  { code: '64030', name: 'BULAWAYO ENVIRONS DEPOT', parentDistrictCode: '60000' },
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
