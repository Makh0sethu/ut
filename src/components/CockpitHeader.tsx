import React, { useState } from 'react';
import { CockpitTheme, RegionFilter, SimulationScenario } from '../types';
import { PRESET_SCENARIOS } from '../data/mockKpis';
import {
  Activity,
  Sun,
  RefreshCw,
  Play,
  Pause,
  Download,
  Flame,
  Zap,
  ChevronDown,
} from 'lucide-react';

interface CockpitHeaderProps {
  theme: CockpitTheme;
  onThemeChange: (theme: CockpitTheme) => void;
  selectedRegion: RegionFilter;
  onRegionChange: (region: RegionFilter) => void;
  onApplyScenario: (scenario: SimulationScenario) => void;
  isSimulating: boolean;
  onToggleSimulation: () => void;
  onResetData: () => void;
  onExportReport: () => void;
  hasRedAlerts: boolean;
  hasAmberAlerts: boolean;
}

export const CockpitHeader: React.FC<CockpitHeaderProps> = ({
  theme,
  onThemeChange,
  selectedRegion,
  onRegionChange,
  onApplyScenario,
  isSimulating,
  onToggleSimulation,
  onResetData,
  onExportReport,
  hasRedAlerts,
  hasAmberAlerts,
}) => {
  const [reportingPeriod, setReportingPeriod] = useState('Q3 2026');
  const [districtFilter, setDistrictFilter] = useState('All Districts');
  const [customerClassFilter, setCustomerClassFilter] = useState('All Classes');
  const [networkLevelFilter, setNetworkLevelFilter] = useState('All Voltage Levels');

  return (
    <header className="border-b transition-colors duration-300 select-none bg-canvas border-line text-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-3 space-y-3">
        {/* Top Branding Header Row with Dual Official Utility Logos */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 stroke border-b border-line">
          {/* Main Title with Top Left Logo (ZESA Crest) */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-14 shrink-0 flex items-center justify-center p-0.5 bg-white/5 rounded-lg border border-white/10 shadow-lg">
              <img
                src="/zesa-logo.png"
                alt="ZESA Holdings Coat of Arms Logo"
                className="w-full h-full object-contain filter drop-shadow"
              />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-wider text-white uppercase font-sans flex items-center gap-2">
                <span className="text-accent font-bold">ZETDC</span>
                <span className="text-slate-600 font-light">|</span>
                <span className="tracking-widest">DISTRIBUTION & RETAIL PERFORMANCE COCKPIT</span>
              </h1>
              <p className="text-xs text-slate-400 font-sans tracking-tight">
                Zimbabwe Electricity Transmission & Distribution Company • Executive BI Flight Deck
              </p>
            </div>
          </div>

          {/* Alert Badge, Subtitle & Top Right Logo (ZETDC Round Emblem) */}
          <div className="flex items-center gap-3.5 justify-between md:justify-end">
            {hasRedAlerts ? (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-500 text-red-300 font-mono text-xs font-bold animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.5)]">
                <Flame size={14} className="text-red-400" />
                <span>MASTER WARNING</span>
              </div>
            ) : hasAmberAlerts ? (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500 text-amber-300 font-mono text-xs font-bold">
                <Activity size={14} className="text-amber-400" />
                <span>MASTER CAUTION</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-600 text-emerald-300 font-mono text-xs font-bold">
                <Zap size={14} className="text-emerald-400" />
                <span>ALL SYSTEMS OPTIMAL</span>
              </div>
            )}

            <div className="text-right hidden sm:block">
              <div className="text-xs font-mono font-bold text-accent tracking-wider uppercase">
                AIRCRAFT SIX-PACK INSPIRED
              </div>
              <div className="text-[11px] font-sans text-slate-400">
                Aviation Telemetry Grid
              </div>
            </div>

            {/* Top Right Logo (ZETDC Emblem) */}
            <div className="w-13 h-13 w-[52px] h-[52px] shrink-0 rounded-full bg-white p-1 border-2 border-accent/35 shadow-xl flex items-center justify-center">
              <img
                src="/zetdc-logo.png"
                alt="ZETDC Official Emblem Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* 5 Dropdown Filters Bar (Exact matching design from image) */}
        <div className="bg-panel border border-line rounded-xl p-2.5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {/* 1. REPORTING PERIOD */}
          <div className="space-y-1">
            <label className="block text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">
              REPORTING PERIOD
            </label>
            <div className="relative">
              <select
                value={reportingPeriod}
                onChange={(e) => setReportingPeriod(e.target.value)}
                className="w-full bg-panel-alt border border-line text-accent text-xs font-mono font-semibold rounded-lg px-2.5 py-1.5 appearance-none cursor-pointer focus:outline-none focus:border-accent"
              >
                <option value="Q3 2026">Q3 2026</option>
                <option value="Q2 2026">Q2 2026</option>
                <option value="YTD 2026">YTD 2026</option>
                <option value="FY 2025">Full Year 2025</option>
              </select>
              <ChevronDown size={14} className="absolute right-2 top-2.5 text-accent pointer-events-none" />
            </div>
          </div>

          {/* 2. REGION */}
          <div className="space-y-1">
            <label className="block text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">
              REGION
            </label>
            <div className="relative">
              <select
                value={selectedRegion}
                onChange={(e) => onRegionChange(e.target.value as RegionFilter)}
                className="w-full bg-panel-alt border border-line text-accent text-xs font-mono font-semibold rounded-lg px-2.5 py-1.5 appearance-none cursor-pointer focus:outline-none focus:border-accent"
              >
                <option value="All Regions">All Regions</option>
                <option value="Metro Zone">Metro Zone</option>
                <option value="Industrial Park">Industrial Park</option>
                <option value="Rural North">Rural North</option>
                <option value="Coastal West">Coastal West</option>
              </select>
              <ChevronDown size={14} className="absolute right-2 top-2.5 text-accent pointer-events-none" />
            </div>
          </div>

          {/* 3. DISTRICT */}
          <div className="space-y-1">
            <label className="block text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">
              DISTRICT
            </label>
            <div className="relative">
              <select
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                className="w-full bg-panel-alt border border-line text-accent text-xs font-mono font-semibold rounded-lg px-2.5 py-1.5 appearance-none cursor-pointer focus:outline-none focus:border-accent"
              >
                <option value="All Districts">All Districts</option>
                <option value="Central Grid">Central Grid</option>
                <option value="North Feeder">North Feeder</option>
                <option value="Harare Sub-grid">Harare Sub-grid</option>
              </select>
              <ChevronDown size={14} className="absolute right-2 top-2.5 text-accent pointer-events-none" />
            </div>
          </div>

          {/* 4. CUSTOMER CLASS */}
          <div className="space-y-1">
            <label className="block text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">
              CUSTOMER CLASS
            </label>
            <div className="relative">
              <select
                value={customerClassFilter}
                onChange={(e) => setCustomerClassFilter(e.target.value)}
                className="w-full bg-panel-alt border border-line text-accent text-xs font-mono font-semibold rounded-lg px-2.5 py-1.5 appearance-none cursor-pointer focus:outline-none focus:border-accent"
              >
                <option value="All Classes">All Classes</option>
                <option value="Industrial & Commercial">Industrial & Commercial</option>
                <option value="Domestic Residential">Domestic Residential</option>
                <option value="Agricultural Mining">Agricultural & Mining</option>
              </select>
              <ChevronDown size={14} className="absolute right-2 top-2.5 text-accent pointer-events-none" />
            </div>
          </div>

          {/* 5. NETWORK LEVEL */}
          <div className="space-y-1">
            <label className="block text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">
              NETWORK LEVEL
            </label>
            <div className="relative">
              <select
                value={networkLevelFilter}
                onChange={(e) => setNetworkLevelFilter(e.target.value)}
                className="w-full bg-panel-alt border border-line text-accent text-xs font-mono font-semibold rounded-lg px-2.5 py-1.5 appearance-none cursor-pointer focus:outline-none focus:border-accent"
              >
                <option value="All Voltage Levels">All Network Levels</option>
                <option value="High Voltage (33kV)">High Voltage (33kV)</option>
                <option value="Medium Voltage (11kV)">Medium Voltage (11kV)</option>
                <option value="Low Voltage (400V)">Low Voltage (400V)</option>
              </select>
              <ChevronDown size={14} className="absolute right-2 top-2.5 text-accent pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Preset Simulation Flight Scenarios Bar & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-[11px] font-mono font-bold text-slate-400 whitespace-nowrap">
              FLIGHT SCENARIOS:
            </span>
            {PRESET_SCENARIOS.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => onApplyScenario(scenario)}
                className="px-2.5 py-1 rounded-lg bg-panel hover:bg-panel-raised border border-line text-xs font-mono text-slate-200 flex items-center gap-1.5 transition-all shadow-sm whitespace-nowrap"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span>{scenario.name}</span>
                <span className="text-[9px] px-1 bg-panel-raised text-accent rounded-md">
                  {scenario.badge}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* Live Telemetry Auto-Stream Simulator */}
            <button
              onClick={onToggleSimulation}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-mono text-xs font-bold transition-all border ${
                isSimulating
                  ? 'bg-accent text-white border-accent shadow-[0_0_12px_rgba(5,95,179,0.5)]'
                  : 'bg-panel hover:bg-panel-raised text-accent border-line'
              }`}
            >
              {isSimulating ? <Pause size={13} /> : <Play size={13} />}
              <span>{isSimulating ? 'SIMULATION LIVE' : 'START SIMULATOR'}</span>
            </button>

            {/* Reset */}
            <button
              onClick={onResetData}
              title="Reset metrics"
              className="p-1.5 rounded-lg bg-panel hover:bg-panel-raised text-slate-300 border border-line transition-colors"
            >
              <RefreshCw size={14} />
            </button>

            {/* Export */}
            <button
              onClick={onExportReport}
              title="Export Cockpit Brief"
              className="p-1.5 rounded-lg bg-panel hover:bg-panel-raised text-slate-300 border border-line transition-colors"
            >
              <Download size={14} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

