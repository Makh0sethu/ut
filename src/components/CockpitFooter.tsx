import React from 'react';
import { KpiMetric, CockpitTheme } from '../types';
import { getKpiStatus } from '../utils/gaugeHelpers';
import { ShieldCheck, Zap, BarChart, Download, Radio } from 'lucide-react';

interface CockpitFooterProps {
  kpis: KpiMetric[];
  theme: CockpitTheme;
  onExportReport: () => void;
}

export const CockpitFooter: React.FC<CockpitFooterProps> = ({ kpis, theme, onExportReport }) => {
  const statuses = kpis.map((k) => getKpiStatus(k));
  const greenCount = statuses.filter((s) => s === 'green').length;
  const healthIndex = Math.round((greenCount / kpis.length) * 100);

  const isNight = theme === 'night-amber';

  const isDay = theme === 'daylight';

  return (
    <footer
      className={`border-t py-3 px-4 transition-colors duration-300 select-none ${
        isNight
          ? 'bg-neutral-950 border-amber-900/40 text-amber-100'
          : isDay
          ? 'bg-white border-slate-200 text-slate-700 shadow-lg'
          : 'bg-canvas border-line text-slate-300'
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-mono">
        {/* System Health Index */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl border ${
              isDay ? 'bg-accent/10 border-accent/30 text-accent' : 'bg-panel border-line text-accent'
            }`}>
              <Zap size={16} />
            </div>
            <div>
              <div className={`text-[10px] uppercase font-sans tracking-wider ${
                isDay ? 'text-slate-500 font-semibold' : 'text-slate-400'
              }`}>
                SYSTEM HEALTH INDEX
              </div>
              <div className={`text-sm font-bold flex items-center gap-2 ${
                isDay ? 'text-slate-900' : 'text-white'
              }`}>
                <span>{healthIndex}% OPTIMAL</span>
                <div className={`w-24 h-2 rounded-full overflow-hidden border ${
                  isDay ? 'bg-slate-200 border-slate-300' : 'bg-panel-alt border-line'
                }`}>
                  <div
                    className={`h-full transition-all duration-500 ${
                      healthIndex >= 80
                        ? 'bg-emerald-500'
                        : healthIndex >= 50
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${healthIndex}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={`hidden sm:flex items-center gap-2 border-l pl-4 ${
            isDay ? 'border-slate-200 text-slate-500' : 'border-line text-slate-400'
          }`}>
            <Radio size={14} className="text-accent animate-pulse" />
            <span>TELEMETRY STREAM: 100 HZ ACTIVE</span>
          </div>
        </div>

        {/* Category Health Indicators & Utility Branding Logos */}
        <div className="flex items-center gap-4 text-slate-500">
          <div className={`flex items-center gap-2 pr-2 border-r ${
            isDay ? 'border-slate-200' : 'border-line'
          }`}>
            <div className="w-6 h-7 p-0.5 bg-white rounded border border-slate-200 flex items-center justify-center shadow-sm">
              <img src="/zesa-logo.svg" alt="ZESA Logo" className="w-full h-full object-contain" />
            </div>
            <div className="w-6 h-6 p-0.5 bg-white rounded-full border border-accent flex items-center justify-center shadow-sm">
              <img src="/zetdc-logo.svg" alt="ZETDC Logo" className="w-full h-full object-contain" />
            </div>
            <span className={`text-[11px] font-sans font-semibold ${
              isDay ? 'text-slate-800' : 'text-slate-300'
            }`}>ZETDC Operational Cockpit</span>
          </div>

          <div className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span className="font-semibold">9 KPI COCKPIT ACTIVE</span>
          </div>

          <button
            onClick={onExportReport}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border transition-colors font-sans text-xs font-semibold ${
              isDay
                ? 'bg-accent hover:bg-accent-hover text-white border-accent-hover shadow-md'
                : 'bg-panel hover:bg-panel-raised border-line text-slate-200'
            }`}
          >
            <Download size={13} /> EXPORT FLIGHT BRIEFING
          </button>
        </div>
      </div>
    </footer>
  );
};
