import React from 'react';
import { CockpitTheme, RegionFilter, SimulationScenario, KpiCategory } from '../types';
import { PRESET_SCENARIOS } from '../data/mockKpis';
import {
  ZETDC_REGIONS,
  ZETDC_DISTRICTS,
  ZETDC_CUSTOMER_CATEGORIES,
  ZETDC_NETWORK_LEVELS,
} from '../data/zetdcReferenceData';
import {
  RefreshCw,
  Download,
  ChevronDown,
  LayoutGrid,
  Sliders,
  Menu,
  X,
} from 'lucide-react';

interface CockpitSidebarProps {
  theme: CockpitTheme;
  onThemeChange: (theme: CockpitTheme) => void;
  selectedRegion: RegionFilter;
  onRegionChange: (region: RegionFilter) => void;
  selectedDistrict: string;
  onDistrictChange: (district: string) => void;
  selectedCustomerClass: string;
  onCustomerClassChange: (customerClass: string) => void;
  selectedNetworkLevel: string;
  onNetworkLevelChange: (networkLevel: string) => void;
  reportingPeriod: string;
  onReportingPeriodChange: (period: string) => void;
  categoryFilter: KpiCategory | 'ALL';
  onCategoryChange: (category: KpiCategory | 'ALL') => void;
  onApplyScenario: (scenario: SimulationScenario) => void;
  onResetData: () => void;
  onExportReport: () => void;
  hasRedAlerts: boolean;
  hasAmberAlerts: boolean;
  isMobileOpen: boolean;
  onToggleMobile: () => void;
}

export const CockpitSidebar: React.FC<CockpitSidebarProps> = ({
 
  selectedRegion,
  onRegionChange,
  selectedDistrict,
  onDistrictChange,
  selectedCustomerClass,
  onCustomerClassChange,
  selectedNetworkLevel,
  onNetworkLevelChange,
  reportingPeriod,
  onReportingPeriodChange,
  categoryFilter,
  onCategoryChange,
  onApplyScenario,
  onResetData,
  onExportReport,
  hasRedAlerts,
  hasAmberAlerts,
  isMobileOpen,
  onToggleMobile,
}) => {

  const content = (
    <div className="flex flex-col h-full justify-between p-4 space-y-4 select-none">
      {/* Top Branding Section with Dual Official Utility Logos */}
      <div className="space-y-3 pb-3.5 border-b border-white/20">
        {/* Large Prominent Dual Logos Header */}
        <div className="flex items-center justify-center gap-6">
          {/* Top Left Logo (ZESA Crest Shield) */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-20 h-20 xl:w-24 xl:h-24 shrink-0 flex items-center justify-center p-1.5 rounded-full shadow-xl transition-transform hover:scale-105">
              <img
                src="/zesa-logo.png"
                alt="ZESA Holdings Crest Logo"
                className="w-full h-full object-contain filter drop-shadow"
              />
            </div>
            <span className="text-[9px] font-mono font-bold tracking-widest text-white/70 uppercase">
              ZESA HOLDINGS
            </span>
          </div>

          {/* Top Right Logo (ZETDC Emblem Roundel) */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-20 h-20 xl:w-24 xl:h-24 shrink-0 rounded-full p-1.5 shadow-xl flex items-center justify-center transition-transform hover:scale-105">
              <img
                src="/zetdc-logo.png"
                alt="ZETDC Official Emblem Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-[9px] font-mono font-bold tracking-widest text-white uppercase">
              ZETDC 
            </span>
          </div>
        </div>

        {/* Title Header */}
        <div className="pt-1 text-center">

          <h1 className="text-lg xl:text-xl font-black tracking-wider text-white uppercase font-sans leading-tight">
            <span className="text-white font-extrabold block">ZESA PERFORMANCE</span>
            <span className="text-xs text-white/70 font-semibold tracking-wide block">
              Distribution & Retail Dashboard
            </span>
          </h1>
        
        </div>
      </div>

      {/* Category Panel Selection */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-mono font-bold tracking-wider text-white/70 uppercase flex items-center gap-1">
          <LayoutGrid size={12} className="text-white" />
          <span>DEMO FILTER</span>
        </label>
        <div className="grid grid-cols-2 gap-1.5 text-xs font-mono font-bold">
          <button
            onClick={() => onCategoryChange('ALL')}
            className={`px-2.5 py-1.5 rounded-xl transition-all text-left flex items-center justify-between ${
              categoryFilter === 'ALL'
                ? 'bg-accent-hover text-white shadow-lg ring-2 ring-white/60'
                : 'bg-panel-alt hover:bg-panel-raised text-ink-muted border border-line'
            }`}
          >
            <span>ALL 9</span>
            <span className="text-[10px] opacity-75 font-mono">3x3</span>
          </button>
          <button
            onClick={() => onCategoryChange('Reliability & Operations')}
            className={`px-2.5 py-1.5 rounded-xl transition-all text-left flex items-center justify-between ${
              categoryFilter === 'Reliability & Operations'
                ? 'bg-accent-hover text-white shadow-lg ring-2 ring-white/60'
                : 'bg-panel-alt hover:bg-panel-raised text-ink-muted border border-line'
            }`}
          >
            <span>RELIABILITY</span>
            <span className="text-[10px] opacity-75 font-mono">(4)</span>
          </button>
          <button
            onClick={() => onCategoryChange('Commercial & Revenue')}
            className={`px-2.5 py-1.5 rounded-xl transition-all text-left flex items-center justify-between ${
              categoryFilter === 'Commercial & Revenue'
                ? 'bg-accent-hover text-white shadow-lg ring-2 ring-white/60'
                : 'bg-panel-alt hover:bg-panel-raised text-ink-muted border border-line'
            }`}
          >
            <span>COMMERCIAL</span>
            <span className="text-[10px] opacity-75 font-mono">(2)</span>
          </button>
          <button
            onClick={() => onCategoryChange('Customer & Access')}
            className={`px-2.5 py-1.5 rounded-xl transition-all text-left flex items-center justify-between ${
              categoryFilter === 'Customer & Access'
                ? 'bg-accent-hover text-white shadow-lg ring-2 ring-white/60'
                : 'bg-panel-alt hover:bg-panel-raised text-ink-muted border border-line'
            }`}
          >
            <span>CUSTOMER</span>
            <span className="text-[10px] opacity-75 font-mono">(3)</span>
          </button>
        </div>
      </div>

      {/* 5 Filter Dropdowns Stacked Vertically */}
      <div className="bg-panel border border-line rounded-2xl p-2.5 space-y-2">
        <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-ink-faint uppercase">
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
              onChange={(e) => onReportingPeriodChange(e.target.value)}
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

        {/* 2. REGION (5 ZETDC Operational Regions) */}
        <div className="space-y-0.5">
          <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase">
            ZETDC OPERATIONAL REGION (5)
          </label>
          <div className="relative">
            <select
              value={selectedRegion}
              onChange={(e) => onRegionChange(e.target.value as RegionFilter)}
              className="w-full bg-panel-alt border border-line text-accent text-xs font-mono font-semibold rounded-lg px-2.5 py-1 appearance-none cursor-pointer focus:outline-none focus:border-accent"
            >
              <option value="All Regions">All 5 Regions</option>
              {ZETDC_REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-2 top-2 text-accent pointer-events-none" />
          </div>
        </div>

        {/* 3. DISTRICT (18 ZETDC Operational Districts) */}
        <div className="space-y-0.5">
          <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase">
            ZETDC OPERATIONAL DISTRICT (18)
          </label>
          <div className="relative">
            <select
              value={selectedDistrict}
              onChange={(e) => onDistrictChange(e.target.value)}
              className="w-full bg-panel-alt border border-line text-accent text-xs font-mono font-semibold rounded-lg px-2.5 py-1 appearance-none cursor-pointer focus:outline-none focus:border-accent"
            >
              <option value="All Districts">All 18 Operational Districts</option>
              {ZETDC_REGIONS.filter((r) => selectedRegion === 'All Regions' || selectedRegion === r).map((region) => (
                <optgroup key={region} label={`── ${region} ──`}>
                  {ZETDC_DISTRICTS.filter((d) => d.region === region).map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name}
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
              value={selectedCustomerClass}
              onChange={(e) => onCustomerClassChange(e.target.value)}
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
              value={selectedNetworkLevel}
              onChange={(e) => onNetworkLevelChange(e.target.value)}
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

      {/* Preset Flight Scenarios */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-mono font-bold text-white/70 uppercase block">
          FLIGHT SCENARIOS
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {PRESET_SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => onApplyScenario(scenario)}
              className="px-2 py-1.5 rounded-xl bg-panel hover:bg-panel-raised border border-line text-[11px] font-mono text-ink flex items-center justify-between transition-all shadow-sm truncate"
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
      <div className="pt-2 border-t border-white/20 space-y-2">
        <div className="flex items-center justify-center gap-1.5">
          {/* Reset */}
          <button
            onClick={onResetData}
            title="Reset telemetry metrics"
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-panel hover:bg-panel-raised text-ink-muted border border-line transition-colors font-mono text-xs font-bold"
          >
            <RefreshCw size={14} />
            <span>RESET</span>
          </button>

          {/* Export */}
          <button
            onClick={onExportReport}
            title="Export Cockpit Report"
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-panel hover:bg-panel-raised text-ink-muted border border-line transition-colors font-mono text-xs font-bold"
          >
            <Download size={14} />
            <span>EXPORT</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sticky Header Bar with Menu Drawer Toggle */}
      <div className="lg:hidden bg-accent border-b border-accent-hover p-2.5 flex items-center justify-between sticky top-0 z-30 select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-11 h-11 p-0.5 rounded-full flex items-center justify-center">
            <img src="/zesa-logo.png" alt="ZESA Logo" className="w-full h-full object-contain" />
          </div>
          <div className="w-11 h-11 p-0.5 rounded-full flex items-center justify-center">
            <img src="/zetdc-logo.png" alt="ZETDC Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="font-bold text-xs text-white font-sans block leading-none">ZETDC COCKPIT</span>
            <span className="text-[9px] text-white/70 font-mono">NMJTM MODEL</span>
          </div>
        </div>

        <button
          onClick={onToggleMobile}
          className="p-2 rounded-xl bg-white/15 border border-white/30 text-white hover:bg-white/25"
        >
          {isMobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Desktop Fixed Left Side Panel */}
      <aside className="hidden lg:block w-72 xl:w-80 shrink-0 h-screen overflow-y-auto border-r transition-colors duration-300 bg-accent border-accent-hover text-white">
        {content}
      </aside>

      {/* Mobile Sliding Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onToggleMobile} />
          <aside className="relative w-80 max-w-[85vw] h-full bg-accent text-white overflow-y-auto z-10 shadow-2xl border-r border-accent-hover">
            {content}
          </aside>
        </div>
      )}
    </>
  );
};
