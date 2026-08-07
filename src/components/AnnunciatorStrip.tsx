import React from 'react';
import { KpiMetric } from '../types';
import { getKpiStatus } from '../utils/gaugeHelpers';
import { AlertTriangle, ShieldCheck, AlertCircle } from 'lucide-react';

interface AnnunciatorStripProps {
  kpis: KpiMetric[];
  onSelectKpi: (id: string) => void;
}

export const AnnunciatorStrip: React.FC<AnnunciatorStripProps> = ({ kpis, onSelectKpi }) => {
  const statuses = kpis.map((k) => ({
    id: k.id,
    code: k.code,
    name: k.name,
    status: getKpiStatus(k),
  }));

  const redCount = statuses.filter((s) => s.status === 'red').length;
  const amberCount = statuses.filter((s) => s.status === 'amber').length;
  const greenCount = statuses.filter((s) => s.status === 'green').length;

  return (
    <div className="bg-accent border border-accent-hover rounded-xl py-2 px-4 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Annunciator Status Overview Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider font-bold text-white/80">
            <span>ANNUNCIATOR PANEL</span>
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-2.5 py-0.5 rounded-full border border-emerald-600 bg-emerald-500 text-white font-bold flex items-center gap-1">
              <ShieldCheck size={12} /> {greenCount} NOMINAL
            </span>
            {amberCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full border border-amber-600 bg-amber-500 text-white font-bold flex items-center gap-1">
                <AlertTriangle size={12} /> {amberCount} CAUTION
              </span>
            )}
            {redCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full border border-red-600 bg-red-500 text-white font-bold flex items-center gap-1 animate-pulse">
                <AlertCircle size={12} /> {redCount} WARNING
              </span>
            )}
          </div>
        </div>

        {/* 10 Illuminated Cockpit System Tiles */}
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 w-full md:w-auto">
          {statuses.map((s) => {
            const isRed = s.status === 'red';
            const isAmber = s.status === 'amber';

            return (
              <button
                key={s.id}
                onClick={() => onSelectKpi(s.id)}
                className={`px-2 py-1.5 rounded-lg font-mono text-[10px] uppercase font-bold tracking-tight text-center transition-all duration-300 border flex flex-col items-center justify-center ${
                  isRed
                    ? 'bg-red-500 text-white border-red-600 shadow-[0_0_12px_rgba(239,68,68,0.5)] animate-pulse'
                    : isAmber
                    ? 'bg-amber-500 text-white border-amber-600 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                    : 'bg-panel text-accent border-line hover:bg-panel-raised hover:border-accent/40'
                }`}
              >
                <span className="text-[8px] opacity-70">{s.code}</span>
                <span className="leading-tight text-[7px] line-clamp-2 text-center break-words">
                  {s.name.split(' ').slice(0, 2).join(' ')}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
