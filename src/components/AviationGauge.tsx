import React, { useState } from 'react';
import { KpiMetric, CockpitTheme } from '../types';
import {
  getKpiStatus,
  calculateNeedleAngle,
  formatValue,
  describeSvgArc,
} from '../utils/gaugeHelpers';
import { SlidersHorizontal, Info, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface AviationGaugeProps {
  kpi: KpiMetric;
  theme: CockpitTheme;
  onUpdateValue: (id: string, newValue: number) => void;
  onOpenDetail: (kpi: KpiMetric) => void;
  className?: string;
}

export const AviationGauge: React.FC<AviationGaugeProps> = ({
  kpi,
  theme,
  onUpdateValue,
  onOpenDetail,
  className,
}) => {
  const [showQuickControls, setShowQuickControls] = useState(false);
  const status = getKpiStatus(kpi);
  const needleAngle = calculateNeedleAngle(kpi.value, kpi.min, kpi.max);

  // Calculate arc angles for Green, Amber, Red zones
  // Angle range is -135deg to +135deg (total 270deg sweep)
  const angleStart = -135;
  const angleEnd = 135;

  const greenValAngle = calculateNeedleAngle(kpi.greenThreshold, kpi.min, kpi.max);
  const redValAngle = calculateNeedleAngle(kpi.redThreshold, kpi.min, kpi.max);

  let greenArc: { start: number; end: number };
  let amberArc: { start: number; end: number };
  let redArc: { start: number; end: number };

  if (!kpi.inverted) {
    // Normal: Higher is better (0 to redThreshold = Red, redThreshold to greenThreshold = Amber, greenThreshold to max = Green)
    redArc = { start: angleStart, end: redValAngle };
    amberArc = { start: redValAngle, end: greenValAngle };
    greenArc = { start: greenValAngle, end: angleEnd };
  } else {
    // Inverted: Lower is better (0 to greenThreshold = Green, greenThreshold to redThreshold = Amber, redThreshold to max = Red)
    greenArc = { start: angleStart, end: greenValAngle };
    amberArc = { start: greenValAngle, end: redValAngle };
    redArc = { start: redValAngle, end: angleEnd };
  }

  // Quick increment step
  const step = kpi.max > 50 ? 5 : kpi.max > 5 ? 0.1 : 0.05;

  const handleNudge = (delta: number) => {
    const newVal = Math.min(kpi.max, Math.max(kpi.min, Number((kpi.value + delta).toFixed(2))));
    onUpdateValue(kpi.id, newVal);
  };

  // Determine trend relative to previous history point
  const prevValue = kpi.history[kpi.history.length - 2] ?? kpi.value;
  const diff = kpi.value - prevValue;
  const isImproving = kpi.inverted ? diff < 0 : diff > 0;
  const isDeteriorating = kpi.inverted ? diff > 0 : diff < 0;

  // Badge pill styling
  const getBadgeStyle = () => {
    if (kpi.badgeTag === 'DURATION' || kpi.badgeTag === 'EFFICIENCY') {
      return 'border-red-600 bg-red-500 text-white';
    }
    if (kpi.badgeTag === 'FREQUENCY' || kpi.badgeTag === 'RESPONSE' || kpi.badgeTag === 'CONNECTIONS') {
      return 'border-amber-600 bg-amber-500 text-white';
    }
    return 'border-accent-hover bg-accent text-white';
  };

  return (
    <div
      className={`relative group w-full h-full min-h-[240px] max-h-[300px] rounded-2xl p-2.5 sm:p-3 xl:p-4 2xl:p-5 transition-all duration-300 flex flex-col justify-between select-none shadow-md border bg-panel border-line text-ink hover:border-accent/50 hover:shadow-lg${className ? ` ${className}` : ''}`}
    >
      {/* Instrument Header Info */}
      <div className="flex items-start justify-between gap-2 mb-1 z-10">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-[11px] xl:text-xs 2xl:text-sm tracking-wider uppercase font-sans leading-tight break-words text-ink">
            {kpi.name}
          </h3>
          <p className="text-[10px] xl:text-[11px] 2xl:text-xs font-sans tracking-tight truncate mt-0.5 text-ink-muted font-medium">
            {kpi.subtitle}
          </p>
        </div>

        {/* Badge Tag Pill & Tools */}
        <div className="flex flex-col items-end gap-1 shrink-0">
          <div className={`px-2 py-0.5 rounded-full border text-[9px] font-mono font-bold tracking-widest uppercase ${getBadgeStyle()}`}>
            {kpi.badgeTag}
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setShowQuickControls(!showQuickControls)}
              title="Quick Telemetry Adjust"
              className={`p-1 rounded transition-colors ${
                showQuickControls ? 'bg-accent text-white' : 'hover:bg-panel-raised text-slate-400'
              }`}
            >
              <SlidersHorizontal size={12} />
            </button>
            <button
              onClick={() => onOpenDetail(kpi)}
              title="Open Detail Inspector"
              className="p-1 rounded hover:bg-panel-raised text-slate-400 transition-colors"
            >
              <Info size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Core Aviation Instrument Bezel & Arc Gauge */}
      <div className="relative my-0.5 flex items-center justify-center flex-1 min-h-[120px] overflow-hidden">
        <div className="relative h-full max-w-full aspect-[5/4] flex items-center justify-center overflow-hidden">
          <svg viewBox="0 0 200 160" className="w-full h-full">
            {/* Outer Arc Frame Segment */}
            {/* Green Arc Segment */}
            {greenArc.end > greenArc.start && (
              <path
                d={describeSvgArc(100, 100, 72, greenArc.start, greenArc.end)}
                fill="none"
                stroke="#10b981"
                strokeWidth="10"
                strokeLinecap="round"
                className="opacity-90"
              />
            )}
            {/* Amber Arc Segment */}
            {amberArc.end > amberArc.start && (
              <path
                d={describeSvgArc(100, 100, 72, amberArc.start, amberArc.end)}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="10"
                strokeLinecap="round"
                className="opacity-90"
              />
            )}
            {/* Red Arc Segment */}
            {redArc.end > redArc.start && (
              <path
                d={describeSvgArc(100, 100, 72, redArc.start, redArc.end)}
                fill="none"
                stroke="#ef4444"
                strokeWidth="10"
                strokeLinecap="round"
                className="opacity-90"
              />
            )}

            {/* Perimeter White Tick Marks */}
            {Array.from({ length: 15 }).map((_, i) => {
              const tickAngle = -135 + i * (270 / 14);
              const rad = ((tickAngle - 90) * Math.PI) / 180;
              const outerR = 84;
              const innerR = i % 2 === 0 ? 76 : 80;

              const x1 = 100 + outerR * Math.cos(rad);
              const y1 = 100 + outerR * Math.sin(rad);
              const x2 = 100 + innerR * Math.cos(rad);
              const y2 = 100 + innerR * Math.sin(rad);

              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="var(--text-primary)"
                  strokeWidth={i % 2 === 0 ? 2 : 1}
                  strokeOpacity={0.85}
                />
              );
            })}

            {/* Moving T-Bar Needle */}
            <g
              style={{ transform: `rotate(${needleAngle}deg)`, transformOrigin: '100px 100px' }}
              className="transition-transform duration-700 ease-in-out"
            >
              {/* Pointer shaft */}
              <line
                x1="100"
                y1="100"
                x2="100"
                y2="34"
                stroke="var(--accent-primary)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              {/* Top T-bar head */}
              <line
                x1="93"
                y1="34"
                x2="107"
                y2="34"
                stroke="var(--accent-primary)"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </g>

            {/* Center Pivot Base Hub Dot */}
            <circle
              cx="100"
              cy="100"
              r="8"
              fill="var(--accent-primary)"
              className="drop-shadow-md"
            />
          </svg>

          {/* Value Display Box under gauge */}
          <div className="absolute bottom-0 font-mono font-bold text-base xl:text-lg 2xl:text-xl tracking-wider px-2.5 py-0.5 xl:px-3 xl:py-1 rounded-md shadow-inner border bg-accent text-white border-accent-hover">
            {formatValue(kpi.value, kpi.unit)}
          </div>
        </div>
      </div>

      {/* Quick Interactive Slider Drawer */}
      {showQuickControls && (
        <div className="mt-2 p-2.5 bg-panel-alt border border-line rounded-xl animate-in fade-in duration-200 z-10 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-ink-muted">
            <span>Telemetry Tuning</span>
            <span className="font-bold text-accent">
              {formatValue(kpi.value, kpi.unit)}
            </span>
          </div>
          <input
            type="range"
            min={kpi.min}
            max={kpi.max}
            step={step}
            value={kpi.value}
            onChange={(e) => onUpdateValue(kpi.id, parseFloat(e.target.value))}
            className="w-full accent-[#055fb3] h-1.5 bg-panel-alt rounded-lg cursor-pointer"
          />
          <div className="flex items-center justify-between gap-1">
            <button
              onClick={() => handleNudge(-step * 2)}
              className="px-2 py-0.5 bg-panel-alt hover:bg-panel-raised text-xs font-mono rounded text-ink-muted border border-line"
            >
              -{step * 2}
            </button>
            <button
              onClick={() => handleNudge(-step)}
              className="px-2 py-0.5 bg-panel-alt hover:bg-panel-raised text-xs font-mono rounded text-ink-muted border border-line"
            >
              -{step}
            </button>
            <button
              onClick={() => onUpdateValue(kpi.id, kpi.target)}
              className="px-2 py-0.5 bg-accent/15 hover:bg-accent/25 text-xs font-mono rounded text-accent border border-accent/40"
            >
              Target ({kpi.target})
            </button>
            <button
              onClick={() => handleNudge(step)}
              className="px-2 py-0.5 bg-panel-alt hover:bg-panel-raised text-xs font-mono rounded text-ink-muted border border-line"
            >
              +{step}
            </button>
            <button
              onClick={() => handleNudge(step * 2)}
              className="px-2 py-0.5 bg-panel-alt hover:bg-panel-raised text-xs font-mono rounded text-ink-muted border border-line"
            >
              +{step * 2}
            </button>
          </div>
        </div>
      )}

      {/* Footer Meter & Direction Status */}
      <div className="mt-2 pt-2 border-t border-line flex items-center justify-between text-xs font-mono">
        {/* Left: TARGET & Metric Spec Unit */}
        <div className="flex flex-col text-ink-muted text-[11px]">
          <div className="flex items-center gap-3">
            <span>
              TARGET <strong className="text-ink font-bold ml-1">{kpi.target}</strong>
            </span>
            <span className="flex items-center gap-1">
              TREND
              {isImproving ? (
                <TrendingUp size={11} className="text-emerald-500 inline ml-0.5" />
              ) : isDeteriorating ? (
                <TrendingDown size={11} className="text-red-500 inline ml-0.5" />
              ) : (
                <Minus size={11} className="text-ink-faint inline ml-0.5" />
              )}
            </span>
          </div>
          {/* Light small text in brackets under the target */}
          <span className="text-[9px] text-ink-faint font-sans tracking-tight">
            ({kpi.unit})
          </span>
        </div>

        {/* Right: LOWER IS BETTER / HIGHER IS BETTER */}
        <div className="font-mono font-bold text-[10px] tracking-wider uppercase">
          {kpi.inverted ? (
            <span className="text-red-500">LOWER IS BETTER</span>
          ) : (
            <span className="text-accent">HIGHER IS BETTER</span>
          )}
        </div>
      </div>
    </div>
  );
};

