import React, { useState, useEffect } from 'react';
import { KpiMetric, CockpitTheme, RegionFilter, SimulationScenario, KpiCategory } from './types';
import { INITIAL_KPIS } from './data/mockKpis';
import { ZETDC_DISTRICTS } from './data/zetdcReferenceData';
import { getKpiStatus } from './utils/gaugeHelpers';
import { computeDisplayKpi } from './utils/mockDataEngine';
import { AviationGauge } from './components/AviationGauge';
import { CockpitSidebar } from './components/CockpitSidebar';
import { AnnunciatorStrip } from './components/AnnunciatorStrip';
import { KpiDetailModal } from './components/KpiDetailModal';
import { CockpitFooter } from './components/CockpitFooter';
import { NewConnectionsPanel } from './components/NewConnectionsPanel';



export default function App() {
  const [kpis, setKpis] = useState<KpiMetric[]>(INITIAL_KPIS);
  const [theme, setTheme] = useState<CockpitTheme>('daylight');
  const [regionFilter, setRegionFilter] = useState<RegionFilter>('All Regions');
  const [districtFilter, setDistrictFilter] = useState<string>('All Districts');
  const [depotFilter, setDepotFilter] = useState<string>('All Depots');
  const [customerClassFilter, setCustomerClassFilter] = useState<string>('All Classes');
  const [networkLevelFilter, setNetworkLevelFilter] = useState<string>('All Voltage Levels');
  const [reportingPeriod, setReportingPeriod] = useState<string>('Q3 2026');
  const [categoryFilter, setCategoryFilter] = useState<KpiCategory | 'ALL'>('ALL');
  const [activeScenario, setActiveScenario] = useState<SimulationScenario | null>(null);
  const [selectedKpiForDetail, setSelectedKpiForDetail] = useState<KpiMetric | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Update specific metric value
  const handleUpdateValue = (id: string, newValue: number) => {
    setKpis((prev) =>
      prev.map((k) => (k.id === id ? { ...k, value: newValue } : k))
    );
  };

  // Save metric changes from modal inspector
  const handleSaveMetric = (updatedKpi: KpiMetric) => {
    setKpis((prev) =>
      prev.map((k) => (k.id === updatedKpi.id ? updatedKpi : k))
    );
  };

  // Apply simulation scenario. The scenario itself is just a weight multiplier
  // (see computeDisplayKpi) — it doesn't touch the underlying kpis, so it composes
  // with whatever region/district/customer-class/network-level filter is active.
  const handleApplyScenario = (scenario: SimulationScenario) => {
    setActiveScenario(scenario);
  };

  // Changing region clears any selected district that no longer belongs to it
  const handleRegionChange = (region: RegionFilter) => {
    setRegionFilter(region);
    const currentDistrictRegion = ZETDC_DISTRICTS.find((d) => d.name === districtFilter)?.region;
    if (region !== 'All Regions' && currentDistrictRegion && currentDistrictRegion !== region) {
      setDistrictFilter('All Districts');
    }
  };

  // Reset to initial mock data
  const handleResetData = () => {
    setKpis(INITIAL_KPIS);
    setActiveScenario(null);
  };

  // Export report flight brief JSON
  const handleExportReport = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      regionSector: regionFilter,
      district: districtFilter,
      depot: depotFilter,
      customerClass: customerClassFilter,
      networkLevel: networkLevelFilter,
      reportingPeriod,
      kpis: displayedKpis.map((k) => ({
        code: k.code,
        name: k.name,
        value: k.value,
        unit: k.unit,
        target: k.target,
        status: getKpiStatus(k),
      })),
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zetdc-cockpit-report-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Human-readable current location, reflecting the active district/region filters
  const locationLabel =
    districtFilter !== 'All Districts'
      ? regionFilter !== 'All Regions'
        ? `${districtFilter} · ${regionFilter}`
        : districtFilter
      : regionFilter !== 'All Regions'
      ? regionFilter
      : 'All Regions / All Districts';

  // Apply the full sidebar filter stack (reporting period, region, district, customer
  // class, network level) so every filter change visibly moves the mock telemetry
  const displayedKpis = kpis.map((k) =>
    computeDisplayKpi(
      k,
      {
        region: regionFilter,
        district: districtFilter,
        customerClass: customerClassFilter,
        networkLevel: networkLevelFilter,
        reportingPeriod,
      },
      activeScenario
    )
  );

  const filteredKpis = categoryFilter === 'ALL'
    ? displayedKpis
    : displayedKpis.filter((k) => k.category === categoryFilter);

  // Check alert statuses for master warning panel against what's currently displayed
  const hasRedAlerts = displayedKpis.some((k) => getKpiStatus(k) === 'red');
  const hasAmberAlerts = displayedKpis.some((k) => getKpiStatus(k) === 'amber');

  // Enforce light mode (remove `.dark` class from document.documentElement)
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, [theme]);

  // Background style based on theme
  const getBgStyle = () => 'bg-canvas text-ink min-h-screen';

  return (
    <div className={`${getBgStyle()} transition-colors duration-300 flex flex-col lg:flex-row h-screen overflow-hidden font-sans relative`}>
      {/* Side Navigation Control Panel */}
      <CockpitSidebar
        theme={theme}
        onThemeChange={setTheme}
        selectedRegion={regionFilter}
        onRegionChange={handleRegionChange}
        selectedDistrict={districtFilter}
        onDistrictChange={setDistrictFilter}
        selectedDepot={depotFilter}
        onDepotChange={setDepotFilter}
        selectedCustomerClass={customerClassFilter}
        onCustomerClassChange={setCustomerClassFilter}
        selectedNetworkLevel={networkLevelFilter}
        onNetworkLevelChange={setNetworkLevelFilter}
        reportingPeriod={reportingPeriod}
        onReportingPeriodChange={setReportingPeriod}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        onApplyScenario={handleApplyScenario}
        onResetData={handleResetData}
        onExportReport={handleExportReport}
        hasRedAlerts={hasRedAlerts}
        hasAmberAlerts={hasAmberAlerts}
        isMobileOpen={isMobileSidebarOpen}
        onToggleMobile={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />

      {/* Main Right Cockpit Instrument Canvas */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto justify-between p-2 sm:p-3 xl:p-4 min-w-0">
        {/* Flight Deck Master Annunciator Panel Strip */}
        <div className="shrink-0 mb-2">
          <AnnunciatorStrip
            kpis={displayedKpis}
            onSelectKpi={(id) => {
              const found = displayedKpis.find((k) => k.id === id);
              if (found) setSelectedKpiForDetail(found);
            }}
          />
        </div>

        {/* The 10-Instrument Aviation Cockpit Grid */}
        <main className="flex-1 flex flex-col py-1">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2.5 sm:gap-3 xl:gap-4 2xl:gap-5 items-center lg:flex-1 lg:auto-rows-fr">
            {filteredKpis.map((kpi, index) => {
              const isLastInDanglingRow = index === filteredKpis.length - 1 && filteredKpis.length % 3 === 1;
              return (
                <AviationGauge
                  key={kpi.id}
                  kpi={kpi}
                  theme={theme}
                  onUpdateValue={handleUpdateValue}
                  onOpenDetail={(item) => setSelectedKpiForDetail(item)}
                  className={isLastInDanglingRow ? 'md:col-start-2 xl:col-start-2' : undefined}
                />
              );
            })}
          </div>
        </main>

        {/* Cockpit Footer */}
        <div className="shrink-0 mt-2">
          <CockpitFooter
            kpis={displayedKpis}
            theme={theme}
            onExportReport={handleExportReport}
            activeScenario={activeScenario}
            location={locationLabel}
          />
        </div>
      </div>

      {/* Side Panel: New Connections Rising Bar Chart */}
      <NewConnectionsPanel theme={theme} target={320000} initialValue={30000} />



   

      {/* Detail / Telemetry Modal */}
      <KpiDetailModal
        kpi={selectedKpiForDetail}
        onClose={() => setSelectedKpiForDetail(null)}
        onSaveMetric={handleSaveMetric}
      />
    </div>
  );
}

