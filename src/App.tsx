import React, { useState, useEffect } from 'react';
import { KpiMetric, CockpitTheme, RegionFilter, SimulationScenario, KpiCategory } from './types';
import { INITIAL_KPIS } from './data/mockKpis';
import { getKpiStatus } from './utils/gaugeHelpers';
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
  const [categoryFilter, setCategoryFilter] = useState<KpiCategory | 'ALL'>('ALL');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
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

  // Apply simulation scenario
  const handleApplyScenario = (scenario: SimulationScenario) => {
    setKpis((prev) =>
      prev.map((k) => {
        if (scenario.values[k.id] !== undefined) {
          const newVal = scenario.values[k.id];
          return {
            ...k,
            value: newVal,
            history: [...k.history.slice(1), newVal],
          };
        }
        return k;
      })
    );
  };

  // Reset to initial mock data
  const handleResetData = () => {
    setKpis(INITIAL_KPIS);
  };

  // Export report flight brief JSON
  const handleExportReport = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      regionSector: regionFilter,
      kpis: kpis.map((k) => ({
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

  // Live Telemetry Stream Simulation Loop
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setKpis((prev) =>
        prev.map((k) => {
          // Slight random fluctuation (+/- 1.5% max)
          const range = k.max - k.min;
          const fluctuation = (Math.random() - 0.5) * (range * 0.02);
          const rawVal = k.value + fluctuation;
          const clampedVal = Math.min(k.max, Math.max(k.min, Number(rawVal.toFixed(2))));

          return {
            ...k,
            value: clampedVal,
          };
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [isSimulating]);

  // Handle region filtering adjustment
  const displayedKpis = kpis.map((k) => {
    if (regionFilter === 'All Regions') return k;

    // Adjust metric value according to region breakdown ratio
    const regData = k.regionalBreakdown.find((r) => r.region === regionFilter);
    if (!regData) return k;

    return {
      ...k,
      value: regData.value,
    };
  });

  const filteredKpis = categoryFilter === 'ALL'
    ? displayedKpis
    : displayedKpis.filter((k) => k.category === categoryFilter);

  // Check alert statuses for master warning panel
  const hasRedAlerts = kpis.some((k) => getKpiStatus(k) === 'red');
  const hasAmberAlerts = kpis.some((k) => getKpiStatus(k) === 'amber');

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
        onRegionChange={setRegionFilter}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        onApplyScenario={handleApplyScenario}
        isSimulating={isSimulating}
        onToggleSimulation={() => setIsSimulating(!isSimulating)}
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
              const found = kpis.find((k) => k.id === id);
              if (found) setSelectedKpiForDetail(found);
            }}
          />
        </div>

        {/* The 9-Instrument Aviation Cockpit Grid */}
        <main className="flex-1 flex flex-col min-h-0 py-1">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr gap-2.5 sm:gap-3 xl:gap-4 2xl:gap-5 items-stretch min-h-0">
            {filteredKpis.map((kpi) => (
              <AviationGauge
                key={kpi.id}
                kpi={kpi}
                theme={theme}
                onUpdateValue={handleUpdateValue}
                onOpenDetail={(item) => setSelectedKpiForDetail(item)}
              />
            ))}
          </div>
        </main>

        {/* Cockpit Footer */}
        <div className="shrink-0 mt-2">
          <CockpitFooter
            kpis={displayedKpis}
            theme={theme}
            onExportReport={handleExportReport}
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

