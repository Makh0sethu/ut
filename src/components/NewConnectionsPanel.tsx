import React, { useEffect, useState } from 'react';
import { CockpitTheme } from '../types';
import { PlugZap, TrendingUp } from 'lucide-react';

interface NewConnectionsPanelProps {
  theme: CockpitTheme;
  target?: number;
  initialValue?: number;
}

export const NewConnectionsPanel: React.FC<NewConnectionsPanelProps> = ({
  theme,
  target = 320000,
  initialValue = 30000,
}) => {
  const [value, setValue] = useState(initialValue);
  const isNight = theme === 'night-amber';
  const isDay = theme === 'daylight';
  const isComplete = value >= target;

  // Live counter that continually rises toward the connections target
  useEffect(() => {
    if (isComplete) return;
    const interval = setInterval(() => {
      setValue((prev) => {
        const step = 180 + Math.random() * 520;
        return Math.min(target, Math.round(prev + step));
      });
    }, 1800);
    return () => clearInterval(interval);
  }, [isComplete, target]);

  const scaleMax = target * 1.15;
  const fillPct = Math.min(100, (value / scaleMax) * 100);
  const targetPctFromTop = 100 - Math.min(100, (target / scaleMax) * 100);
  const progressToTarget = Math.min(100, (value / target) * 100);

  return (
    <aside
      className={`hidden lg:flex w-56 xl:w-64 shrink-0 h-screen flex-col border-l transition-colors duration-300 p-3 xl:p-4 space-y-3 select-none ${
        isNight
          ? 'bg-neutral-950 border-amber-900/50 text-amber-100'
          : isDay
          ? 'bg-slate-50 border-slate-300 text-slate-900'
          : 'bg-canvas border-line text-slate-100'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <PlugZap size={14} className="text-accent" />
          <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-slate-400">
            New Connections
          </span>
        </div>
        <span
          className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${
            isComplete
              ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
              : 'bg-accent/10 border-accent/30 text-accent'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isComplete ? 'bg-emerald-400' : 'bg-accent animate-pulse'}`} />
          {isComplete ? 'TARGET MET' : 'LIVE'}
        </span>
      </div>

      <p className={`text-[10px] font-mono tracking-tight leading-snug ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
        Cumulative energizations, current reporting period
      </p>

      {/* Rising Bar Chart */}
      <div className="flex-1 flex items-stretch gap-4 min-h-0 py-1">
        <div className="flex-1 flex justify-center">
        <div
          className={`relative w-16 xl:w-20 shrink-0 rounded-xl border overflow-hidden ${
            isDay ? 'bg-white border-slate-300' : 'bg-panel border-line'
          }`}
        >
          {/* Target marker line */}
          <div
            className="absolute left-0 right-0 border-t-2 border-dashed border-accent z-10"
            style={{ top: `${targetPctFromTop}%` }}
          />

          {/* Rising fill */}
          <div
            className={`absolute bottom-0 left-0 right-0 transition-[height] duration-[1500ms] ease-out ${
              isComplete
                ? 'bg-gradient-to-t from-emerald-600 to-emerald-400'
                : 'bg-gradient-to-t from-accent to-accent-hover'
            }`}
            style={{ height: `${fillPct}%` }}
          >
            <div className="absolute inset-x-0 top-0 h-1.5 bg-white/40" />
          </div>
        </div>

        {/* Stats column */}
        <div className="flex-1 flex flex-col justify-between py-1">
          <div>
            <div className="text-[9px] font-mono font-bold text-slate-400 uppercase">Target</div>
            <div className="text-xs font-mono font-bold text-accent">{target.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-[9px] font-mono font-bold text-slate-400 uppercase">Progress</div>
            <div className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
              <TrendingUp size={10} />
              {progressToTarget.toFixed(1)}%
            </div>
          </div>
          <div>
            <div className="text-[9px] font-mono font-bold text-slate-400 uppercase">Remaining</div>
            <div className={`text-xs font-mono font-bold ${isDay ? 'text-slate-700' : 'text-slate-300'}`}>
              {(target - value).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Current value readout */}
      <div
        className={`rounded-xl border p-2.5 text-center ${
          isDay ? 'bg-white border-slate-300' : 'bg-panel border-line'
        }`}
      >
        <div className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">
          Connections Made
        </div>
        <div
          className={`text-xl xl:text-2xl font-mono font-black tracking-wider ${
            isDay ? 'text-slate-900' : 'text-white'
          }`}
        >
          {value.toLocaleString()}
        </div>
      </div>
    </aside>
  );
};
