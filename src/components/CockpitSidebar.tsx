import React, { useState } from 'react';
import { CockpitTheme, RegionFilter, SimulationScenario, KpiCategory } from '../types';
import { PRESET_SCENARIOS } from '../data/mockKpis';
import {
  ZETDC_OPERATIONAL_REGIONS,
  ZETDC_PROVINCES,
  ZETDC_CUSTOMER_CATEGORIES,
  ZETDC_NETWORK_LEVELS,
  ZETDC_NET_METERING_POLICY,
} from '../data/zetdcReferenceData';
import {
  Activity,
  Sun,
  Moon,
  RefreshCw,
  Play,
  Pause,
  Download,
  Flame,
  Zap,
  ChevronDown,
  LayoutGrid,
  Sliders,
  Sparkles,
  Menu,
  X,
  FileSpreadsheet,
} from 'lucide-react';

interface CockpitSidebarProps {
  theme: CockpitTheme;
  onThemeChange: (theme: CockpitTheme) => void;
  selectedRegion: RegionFilter;
  onRegionChange: (region: RegionFilter) => void;
  categoryFilter: KpiCategory | 'ALL';
  onCategoryChange: (category: KpiCategory | 'ALL') => void;
  onApplyScenario: (scenario: SimulationScenario) => void;
  isSimulating: boolean;
  onToggleSimulation: () => void;
  onResetData: () => void;
  onExportReport: () => void;
  hasRedAlerts: boolean;
  hasAmberAlerts: boolean;
  isMobileOpen: boolean;
  onToggleMobile: () => void;
}

export const CockpitSidebar: React.FC<CockpitSidebarProps> = ({
  theme,
  onThemeChange,
  selectedRegion,
  onRegionChange,
  categoryFilter,
  onCategoryChange,
  onApplyScenario,
  isSimulating,
  onToggleSimulation,
  onResetData,
  onExportReport,
  hasRedAlerts,
  hasAmberAlerts,
  isMobileOpen,
  onToggleMobile,
}) => {
  const isNight = theme === 'night-amber';

  const [reportingPeriod, setReportingPeriod] = useState('Q3 2026');
  const [districtFilter, setDistrictFilter] = useState('All Districts');
  const [customerClassFilter, setCustomerClassFilter] = useState('All Classes');
  const [networkLevelFilter, setNetworkLevelFilter] = useState('All Voltage Levels');

  const content = (
    <div className="flex flex-col h-full justify-between p-4 space-y-4 select-none">
      {/* Top Branding Section with Dual Official Utility Logos */}
      <div className={`space-y-3 pb-3.5 border-b ${isNight ? 'border-amber-900/50' : 'border-line'}`}>
        {/* Large Prominent Dual Logos Header */}
        <div className="flex items-center justify-between gap-2">
          {/* Top Left Logo (ZESA Crest Shield) */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-16 h-16 xl:w-20 xl:h-20 shrink-0 flex items-center justify-center p-1.5 bg-white rounded-2xl border-2 border-accent/30 shadow-xl transition-transform hover:scale-105">
              <img
                src="/zesa-logo.svg"
                alt="ZESA Holdings Crest Logo"
                className="w-full h-full object-contain filter drop-shadow"
              />
            </div>
            <span className="text-[9px] font-mono font-bold tracking-widest text-slate-400 uppercase">
              ZESA HOLDINGS
            </span>
          </div>

          {/* Master Status Warning Lamp */}
          <div className="flex flex-col items-center gap-1">
            {hasRedAlerts ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-950/90 border border-red-500 text-red-300 font-mono text-[10px] font-extrabold animate-pulse shadow-[0_0_16px_rgba(239,68,68,0.6)]">
                <Flame size={13} className="text-red-400" />
                <span>MASTER WARNING</span>
              </div>
            ) : hasAmberAlerts ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-950/90 border border-amber-500 text-amber-300 font-mono text-[10px] font-extrabold shadow-md">
                <Activity size={13} className="text-amber-400" />
                <span>MASTER CAUTION</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/90 border border-emerald-500 text-emerald-300 font-mono text-[10px] font-extrabold shadow-md">
                <Zap size={13} className="text-emerald-400" />
                <span>SYSTEMS OPTIMAL</span>
              </div>
            )}
            <span className="text-[9px] font-mono font-medium text-slate-400 tracking-wider uppercase">
              STATUS TELEMETRY
            </span>
          </div>

          {/* Top Right Logo (ZETDC Emblem Roundel) */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-16 h-16 xl:w-20 xl:h-20 shrink-0 rounded-full bg-white p-1.5 border-2 border-accent shadow-xl flex items-center justify-center transition-transform hover:scale-105">
              <img
                src="/zetdc-logo.svg"
                alt="ZETDC Official Emblem Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-[9px] font-mono font-bold tracking-widest text-accent uppercase">
              ZETDC UTILITY
            </span>
          </div>
        </div>

        {/* Title Header */}
        <div className="pt-1">
          <div className="inline-block px-2 py-0.5 rounded bg-accent/10 border border-accent/30 text-accent text-[10px] font-mono font-bold tracking-widest uppercase mb-1">
            NMJTM • MODEL SYSTEM
          </div>
          <h1 className="text-lg xl:text-xl font-black tracking-wider text-white uppercase font-sans leading-tight">
            <span className="text-accent font-extrabold block">ZETDC PERFORMANCE</span>
            <span className="text-xs text-slate-200 font-semibold tracking-wide block">
              Distribution & Retail Cockpit
            </span>
          </h1>
          <p className="text-[10px] text-slate-400 font-mono tracking-tight mt-1">
            Executive BI Aviation Flight Deck Grid
          </p>
        </div>
      </div>

      {/* Category Panel Selection */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1">
          <LayoutGrid size={12} className="text-accent" />
          <span>INSTRUMENT PANEL FILTER</span>
        </label>
        <div className="grid grid-cols-2 gap-1.5 text-xs font-mono font-bold">
          <button
            onClick={() => onCategoryChange('ALL')}
            className={`px-2.5 py-1.5 rounded-xl transition-all text-left flex items-center justify-between ${
              categoryFilter === 'ALL'
                ? 'bg-accent text-white shadow-md'
                : 'bg-panel-alt hover:bg-panel-raised text-slate-300 border border-line'
            }`}
          >
            <span>ALL 9</span>
            <span className="text-[10px] opacity-75 font-mono">3x3</span>
          </button>
          <button
            onClick={() => onCategoryChange('Reliability & Operations')}
            className={`px-2.5 py-1.5 rounded-xl transition-all text-left flex items-center justify-between ${
              categoryFilter === 'Reliability & Operations'
                ? 'bg-accent text-white shadow-md'
                : 'bg-panel-alt hover:bg-panel-raised text-slate-300 border border-line'
            }`}
          >
            <span>RELIABILITY</span>
            <span className="text-[10px] opacity-75 font-mono">(4)</span>
          </button>
          <button
            onClick={() => onCategoryChange('Commercial & Revenue')}
            className={`px-2.5 py-1.5 rounded-xl transition-all text-left flex items-center justify-between ${
              categoryFilter === 'Commercial & Revenue'
                ? 'bg-accent text-white shadow-md'
                : 'bg-panel-alt hover:bg-panel-raised text-slate-300 border border-line'
            }`}
          >
            <span>COMMERCIAL</span>
            <span className="text-[10px] opacity-75 font-mono">(2)</span>
          </button>
          <button
            onClick={() => onCategoryChange('Customer & Access')}
            className={`px-2.5 py-1.5 rounded-xl transition-all text-left flex items-center justify-between ${
              categoryFilter === 'Customer & Access'
                ? 'bg-accent text-white shadow-md'
                : 'bg-panel-alt hover:bg-panel-raised text-slate-300 border border-line'
            }`}
          >
            <span>CUSTOMER</span>
            <span className="text-[10px] opacity-75 font-mono">(3)</span>
          </button>
        </div>
      </div>

      {/* 5 Filter Dropdowns Stacked Vertically */}
      <div className="bg-panel border border-line rounded-2xl p-2.5 space-y-2">
        <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-slate-400 uppercase">
          <Sliders size={12} className="text-accent" />
          <span>TELEMETRY FILTERS (5)</span>
        </div>

        {/* 1. REPORTING PERIOD */}
        <div className="space-y-0.5">
          <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase">
            REPORTING PERIOD
          </label>
          <div className="relative">
            <select
              value={reportingPeriod}
              onChange={(e) => setReportingPeriod(e.target.value)}
              className="w-full bg-panel-alt border border-line text-accent text-xs font-mono font-semibold rounded-lg px-2.5 py-1 appearance-none cursor-pointer focus:outline-none focus:border-accent"
            >
              <option value="Q3 2026">Q3 2026</option>
              <option value="Q2 2026">Q2 2026</option>
              <option value="YTD 2026">YTD 2026</option>
              <option value="FY 2025">Full Year 2025</option>
            </select>
            <ChevronDown size={12} className="absolute right-2 top-2 text-accent pointer-events-none" />
          </div>
        </div>

        {/* 2. REGION (17 ZETDC Operational Regions) */}
        <div className="space-y-0.5">
          <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase">
            ZETDC OPERATIONAL REGION (17)
          </label>
          <div className="relative">
            <select
              value={selectedRegion}
              onChange={(e) => onRegionChange(e.target.value as RegionFilter)}
              className="w-full bg-panel-alt border border-line text-accent text-xs font-mono font-semibold rounded-lg px-2.5 py-1 appearance-none cursor-pointer focus:outline-none focus:border-accent"
            >
              <option value="All Regions">All 17 Operational Regions</option>
              {ZETDC_OPERATIONAL_REGIONS.map((r) => (
                <option key={r.id} value={r.name}>
                  {r.name}
                </option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-2 top-2 text-accent pointer-events-none" />
          </div>
        </div>

        {/* 3. DISTRICT (83 Districts by 10 Provinces) */}
        <div className="space-y-0.5">
          <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase">
            DISTRICT (83 DISTRICTS / 10 PROVINCES)
          </label>
          <div className="relative">
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="w-full bg-panel-alt border border-line text-accent text-xs font-mono font-semibold rounded-lg px-2.5 py-1 appearance-none cursor-pointer focus:outline-none focus:border-accent"
            >
              <option value="All Districts">All 83 ZETDC Districts</option>
              {ZETDC_PROVINCES.map((prov) => (
                <optgroup key={prov.name} label={`── ${prov.name} ──`}>
                  {prov.districts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-2 top-2 text-accent pointer-events-none" />
          </div>
        </div>

        {/* 4. CUSTOMER CLASS (8 ZERA Tariff Classes) */}
        <div className="space-y-0.5">
          <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase">
            CUSTOMER CATEGORY (ZERA TARIFF)
          </label>
          <div className="relative">
            <select
              value={customerClassFilter}
              onChange={(e) => setCustomerClassFilter(e.target.value)}
              className="w-full bg-panel-alt border border-line text-accent text-xs font-mono font-semibold rounded-lg px-2.5 py-1 appearance-none cursor-pointer focus:outline-none focus:border-accent"
            >
              <option value="All Classes">All 8 Customer Categories</option>
              {ZETDC_CUSTOMER_CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label} ({c.tariffCode})
                </option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-2 top-2 text-accent pointer-events-none" />
          </div>
        </div>

        {/* 5. NETWORK LEVEL & NODE HIERARCHY */}
        <div className="space-y-0.5">
          <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase">
            NODE TYPE & VOLTAGE HIERARCHY
          </label>
          <div className="relative">
            <select
              value={networkLevelFilter}
              onChange={(e) => setNetworkLevelFilter(e.target.value)}
              className="w-full bg-panel-alt border border-line text-accent text-xs font-mono font-semibold rounded-lg px-2.5 py-1 appearance-none cursor-pointer focus:outline-none focus:border-accent"
            >
              <option value="All Voltage Levels">All Grid Node Levels</option>
              {ZETDC_NETWORK_LEVELS.map((nl) => (
                <option key={nl.id} value={nl.id}>
                  {nl.name}
                </option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-2 top-2 text-accent pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Policy Data Net Metering Card */}
      <div className="bg-canvas border border-line rounded-xl p-2.5 text-[11px] font-mono space-y-1">
        <div className="flex items-center justify-between text-accent font-bold text-[10px] uppercase">
          <span className="flex items-center gap-1">
            <FileSpreadsheet size={12} />
            POLICY DATA & TARIFFS
          </span>
          <span className="px-1.5 py-0.2 bg-accent/10 border border-accent/30 rounded text-[9px]">
            ZERA Active
          </span>
        </div>
        <div className="flex items-center justify-between text-slate-300 text-[10px]">
          <span>Ref Tariff:</span>
          <span className="font-bold text-white">${ZETDC_NET_METERING_POLICY.referenceTariff}/kWh</span>
        </div>
        <div className="flex items-center justify-between text-slate-300 text-[10px]">
          <span>Net Billing Domestic:</span>
          <span className="font-bold text-emerald-400">85c / $1 export</span>
        </div>
        <div className="flex items-center justify-between text-slate-300 text-[10px]">
          <span>Net Billing Commercial:</span>
          <span className="font-bold text-accent">80c / $1 export</span>
        </div>
      </div>

      {/* Preset Flight Scenarios */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-mono font-bold text-slate-400 uppercase block">
          FLIGHT SCENARIOS
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {PRESET_SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => onApplyScenario(scenario)}
              className="px-2 py-1.5 rounded-xl bg-panel hover:bg-panel-raised border border-line text-[11px] font-mono text-slate-200 flex items-center justify-between transition-all shadow-sm truncate"
            >
              <span className="truncate">{scenario.name}</span>
              <span className="text-[8px] px-1 bg-panel-raised text-accent rounded shrink-0">
                {scenario.badge}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Telemetry Actions & Theme Control */}
      <div className="pt-2 border-t border-line space-y-2">
        <div className="flex items-center justify-between gap-1.5">
          {/* Live Telemetry Auto-Stream Simulator */}
          <button
            onClick={onToggleSimulation}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all border ${
              isSimulating
                ? 'bg-accent text-white border-accent shadow-[0_0_12px_rgba(5,95,179,0.5)]'
                : 'bg-panel hover:bg-panel-raised text-accent border-line'
            }`}
          >
            {isSimulating ? <Pause size={13} /> : <Play size={13} />}
            <span>{isSimulating ? 'SIM LIVE' : 'START SIM'}</span>
          </button>

          {/* Reset */}
          <button
            onClick={onResetData}
            title="Reset telemetry metrics"
            className="p-2 rounded-xl bg-panel hover:bg-panel-raised text-slate-300 border border-line transition-colors"
          >
            <RefreshCw size={14} />
          </button>

          {/* Export */}
          <button
            onClick={onExportReport}
            title="Export Cockpit Report"
            className="p-2 rounded-xl bg-panel hover:bg-panel-raised text-slate-300 border border-line transition-colors"
          >
            <Download size={14} />
          </button>
        </div>

        {/* Theme Mode Switcher */}
        <div className="flex items-center justify-between bg-panel p-1 rounded-xl border border-line">
          <span className="text-[10px] font-mono text-slate-400 pl-1.5 uppercase">THEME MODE</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onThemeChange('dark-graphite')}
              className={`p-1 rounded-lg ${
                theme === 'dark-graphite' ? 'bg-panel-raised text-accent' : 'text-slate-500'
              }`}
              title="Graphite Cockpit"
            >
              <Moon size={13} />
            </button>
            <button
              onClick={() => onThemeChange('night-amber')}
              className={`p-1 rounded-lg ${
                theme === 'night-amber' ? 'bg-amber-900/80 text-amber-300' : 'text-slate-500'
              }`}
              title="Night Vision Amber"
            >
              <Zap size={13} />
            </button>
            <button
              onClick={() => onThemeChange('daylight')}
              className={`p-1 rounded-lg ${
                theme === 'daylight' ? 'bg-slate-200 text-slate-900' : 'text-slate-500'
              }`}
              title="Daylight High-Vis"
            >
              <Sun size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sticky Header Bar with Menu Drawer Toggle */}
      <div className="lg:hidden bg-canvas border-b border-line p-2.5 flex items-center justify-between sticky top-0 z-30 select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 p-0.5 bg-white rounded-lg border border-white/20 flex items-center justify-center">
            <img src="/zesa-logo.svg" alt="ZESA Logo" className="w-full h-full object-contain" />
          </div>
          <div className="w-9 h-9 p-0.5 bg-white rounded-full border border-accent flex items-center justify-center">
            <img src="/zetdc-logo.svg" alt="ZETDC Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="font-bold text-xs text-white font-sans block leading-none">ZETDC COCKPIT</span>
            <span className="text-[9px] text-accent font-mono">NMJTM MODEL</span>
          </div>
        </div>

        <button
          onClick={onToggleMobile}
          className="p-2 rounded-xl bg-panel-alt border border-line text-accent hover:text-white"
        >
          {isMobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Desktop Fixed Left Side Panel */}
      <aside
        className={`hidden lg:block w-72 xl:w-80 shrink-0 h-screen overflow-y-auto border-r transition-colors duration-300 ${
          isNight
            ? 'bg-neutral-950 border-amber-900/50 text-amber-100'
            : 'bg-canvas border-line text-slate-100'
        }`}
      >
        {content}
      </aside>

      {/* Mobile Sliding Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onToggleMobile} />
          <aside className="relative w-80 max-w-[85vw] h-full bg-canvas text-slate-100 overflow-y-auto z-10 shadow-2xl border-r border-line">
            {content}
          </aside>
        </div>
      )}
    </>
  );
};
