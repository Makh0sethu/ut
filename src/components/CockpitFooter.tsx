import React from 'react';
import { KpiMetric, CockpitTheme, SimulationScenario } from '../types';
import { getKpiStatus } from '../utils/gaugeHelpers';
import { ShieldCheck, Zap, Download, Radio, MapPin } from 'lucide-react';

interface CockpitFooterProps {
  kpis: KpiMetric[];
  theme: CockpitTheme;
  onExportReport: () => void;
  activeScenario: SimulationScenario | null;
  location: string;
}

export const CockpitFooter: React.FC<CockpitFooterProps> = ({
  kpis,
  onExportReport,
  location,
}) => {
  const statuses = kpis.map((k) => getKpiStatus(k));
  const greenCount = statuses.filter((s) => s === 'green').length;
  const healthIndex = Math.round((greenCount / kpis.length) * 100);

  return (
    <footer className="border-t py-3 px-4 transition-colors duration-300 select-none bg-panel border-line text-ink-muted shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-mono">
        {/* System Health Index */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl border bg-accent/10 border-accent/30 text-accent-text">
              <Zap size={16} />
            </div>
            <div>
              <div className="text-[10px] uppercase font-sans tracking-wider text-ink-faint font-semibold">
                SYSTEM HEALTH INDEX
              </div>
              <div className="text-sm font-bold flex items-center gap-2 text-ink">
                <span>{healthIndex}% OPTIMAL</span>
                <div className="w-24 h-2 rounded-full overflow-hidden border bg-panel-raised border-line">
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



            <div className="flex items-center gap-1.5 border-l pl-3 border-line">
              <MapPin size={14} className="text-accent-text" />
              <div className="flex flex-col leading-tight">
                <span className="text-[9px] uppercase font-sans tracking-wider text-ink-faint font-semibold">
                  Location
                </span>
                <span className="text-xs font-bold text-ink">{location}</span>
              </div>
            </div>

        </div>

        {/* Category Health Indicators & Utility Branding Logos */}
        <div className="flex items-center gap-4 text-ink-faint">
          <div className="flex items-center gap-2 pr-2 border-r border-line">
            <div className="w-6 h-7 p-0.5 bg-white rounded border border-line flex items-center justify-center shadow-sm">
              <img src="/zesa-logo.png" alt="ZESA Logo" className="w-full h-full object-contain" />
            </div>
            <div className="w-6 h-6 p-0.5 bg-white rounded-full border border-accent flex items-center justify-center shadow-sm">
              <img src="/zetdc-logo.png" alt="ZETDC Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-[11px] font-sans font-semibold text-ink-muted">ZETDC Dashboard</span>
          </div>



          <button
            onClick={onExportReport}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border transition-colors font-sans text-xs font-semibold bg-accent hover:bg-accent-hover text-white border-accent-hover shadow-md"
          >
            <Download size={13} /> EXPORT
          </button>
        </div>
      </div>
    </footer>
  );
};
