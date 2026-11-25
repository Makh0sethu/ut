import React from 'react';
import { KpiMetric, InstrumentAesthetic } from '../types';
import {
  getKpiStatus,
  calculateNeedleAngle,
  formatValue,
  describeSvgArc,
  KPI_TICK_FRACTIONS,
  kpiTickLabel,
} from '../utils/gaugeHelpers';
import {
  Zap,
  Clock,
  Repeat,
  Network,
  Gauge,
  Wallet,
  Waves,
  Smile,
  Siren,
  Hourglass,
  Info,
  LucideIcon,
} from 'lucide-react';

interface KpiInstrumentGaugeProps {
  kpi: KpiMetric;
  onClick: () => void;
}

// Each KPI carries a distinct InstrumentAesthetic so the 10-instrument panel reads as a set
// of purpose-built analog gauges (fault counter, chronometer, compass, etc.) rather than 10
// copies of the same dial.
const AESTHETIC_ICON: Record<InstrumentAesthetic, LucideIcon> = {
  FAULTS_FREQ: Zap,
  SAIDI_DURATION: Clock,
  SAIFI_FREQ: Repeat,
  ACCESS_GRID: Network,
  ENERGY_SALES: Gauge,
  COLLECTION_INDEX: Wallet,
  SYSTEM_LOSSES: Waves,
  CSAT_RATING: Smile,
  FAULT_RESPONSE: Siren,
  WAITING_PERIOD: Hourglass,
};

const STATUS_COLOR: Record<'green' | 'amber' | 'red', string> = {
  green: '#10b981',
  amber: '#f59e0b',
  red: '#ef4444',
};

export const KpiInstrumentGauge: React.FC<KpiInstrumentGaugeProps> = ({ kpi, onClick }) => {
  const status = getKpiStatus(kpi);
  const needleAngle = calculateNeedleAngle(kpi.value, kpi.min, kpi.max);
  const Icon = AESTHETIC_ICON[kpi.aestheticType];

  const angleStart = -135;
  const angleEnd = 135;

  const greenValAngle = calculateNeedleAngle(kpi.greenThreshold, kpi.min, kpi.max);
  const redValAngle = calculateNeedleAngle(kpi.redThreshold, kpi.min, kpi.max);

  let greenArc: { start: number; end: number };
  let amberArc: { start: number; end: number };
  let redArc: { start: number; end: number };

  if (!kpi.inverted) {
    redArc = { start: angleStart, end: redValAngle };
    amberArc = { start: redValAngle, end: greenValAngle };
    greenArc = { start: greenValAngle, end: angleEnd };
  } else {
    greenArc = { start: angleStart, end: greenValAngle };
    amberArc = { start: greenValAngle, end: redValAngle };
    redArc = { start: redValAngle, end: angleEnd };
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative w-full h-full min-h-[240px] max-h-[300px] rounded-2xl p-3 xl:p-4 transition-all duration-300 flex flex-col items-center justify-between select-none instrument-bezel hover:shadow-[0_0_24px_var(--accent-glow)] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      {/* Instrument Nameplate */}
      <div className="flex items-center gap-1.5 w-full px-1">
        <Icon size={12} className="text-ink-faint shrink-0" />
        <h3 className="flex-1 min-w-0 text-left font-bold text-[10px] xl:text-[11px] tracking-widest uppercase font-sans leading-tight truncate text-ink-muted">
          {kpi.name}
        </h3>
        <span className="font-mono text-[9px] text-ink-faint shrink-0">{kpi.code}</span>
      </div>

      {/* Circular Instrument Face */}
      <div className="relative flex-1 w-full flex items-center justify-center min-h-[130px]">
        <svg viewBox="0 0 200 200" className="w-full h-full max-w-[190px] max-h-[190px]">
          {/* Dial face */}
          <circle cx="100" cy="100" r="92" fill="var(--color-canvas)" stroke="var(--color-line)" strokeWidth="2" />

          {/* Status Zone Arc */}
          {greenArc.end > greenArc.start && (
            <path
              d={describeSvgArc(100, 100, 78, greenArc.start, greenArc.end)}
              fill="none"
              stroke="#10b981"
              strokeWidth="8"
              strokeLinecap="round"
              className="opacity-90"
            />
          )}
          {amberArc.end > amberArc.start && (
            <path
              d={describeSvgArc(100, 100, 78, amberArc.start, amberArc.end)}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="8"
              strokeLinecap="round"
              className="opacity-90"
            />
          )}
          {redArc.end > redArc.start && (
            <path
              d={describeSvgArc(100, 100, 78, redArc.start, redArc.end)}
              fill="none"
              stroke="#ef4444"
              strokeWidth="8"
              strokeLinecap="round"
              className="opacity-90"
            />
          )}

          {/* 5-point KPI-range Tick Marks & Labels (always shows true min/max, unlike a native scale) */}
          {KPI_TICK_FRACTIONS.map((fraction) => {
            const tickAngle = angleStart + fraction * (angleEnd - angleStart);
            const rad = ((tickAngle - 90) * Math.PI) / 180;
            const outerR = 88;
            const innerR = 70;
            const labelR = 60;

            const x1 = 100 + outerR * Math.cos(rad);
            const y1 = 100 + outerR * Math.sin(rad);
            const x2 = 100 + innerR * Math.cos(rad);
            const y2 = 100 + innerR * Math.sin(rad);
            const lx = 100 + labelR * Math.cos(rad);
            const ly = 100 + labelR * Math.sin(rad);

            return (
              <g key={fraction}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--text-primary)" strokeWidth="2" strokeOpacity={0.8} />
                <text
                  x={lx}
                  y={ly}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="9"
                  fontFamily="monospace"
                  fill="var(--text-secondary)"
                >
                  {kpiTickLabel(kpi.min, kpi.max, fraction)}
                </text>
              </g>
            );
          })}

          {/* Target Reference Tick */}
          {(() => {
            const targetAngle = calculateNeedleAngle(kpi.target, kpi.min, kpi.max);
            const rad = ((targetAngle - 90) * Math.PI) / 180;
            const x1 = 100 + 92 * Math.cos(rad);
            const y1 = 100 + 92 * Math.sin(rad);
            const x2 = 100 + 78 * Math.cos(rad);
            const y2 = 100 + 78 * Math.sin(rad);
            return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--accent-text)" strokeWidth="3" strokeLinecap="round" />;
          })()}

          {/* Needle — subtle idle float animation mimics an analog servo settling on target */}
          <g
            style={{
              '--angle': `${needleAngle}deg`,
              transform: `rotate(${needleAngle}deg)`,
              transformOrigin: '100px 100px',
              animation: 'needle-float 3.2s ease-in-out infinite',
            }}
            className="transition-transform duration-700 ease-in-out"
          >
            <line x1="100" y1="100" x2="100" y2="28" stroke={STATUS_COLOR[status]} strokeWidth="3" strokeLinecap="round" />
            <line x1="100" y1="100" x2="100" y2="118" stroke={STATUS_COLOR[status]} strokeWidth="3" strokeLinecap="round" opacity="0.5" />
          </g>

          <circle cx="100" cy="100" r="7" fill={STATUS_COLOR[status]} className="drop-shadow-md" />
          <circle cx="100" cy="100" r="3" fill="var(--color-canvas)" />
        </svg>

        {/* Digital Value Readout */}
        <div className="absolute bottom-1 font-mono font-bold text-sm xl:text-base tracking-wider px-2.5 py-0.5 rounded-md shadow-inner border bg-panel-raised text-ink border-line">
          {formatValue(kpi.value, kpi.unit)}
          <span className="ml-1 text-[9px] font-normal text-ink-faint">{kpi.unit}</span>
        </div>
      </div>

      {/* Footer Status Strip */}
      <div className="flex items-center justify-between w-full px-0.5 text-[9px] font-mono">
        <span className="flex items-center gap-1 text-ink-faint">
          <span
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: STATUS_COLOR[status], boxShadow: `0 0 6px ${STATUS_COLOR[status]}` }}
          />
          {status === 'green' ? 'NOMINAL' : status === 'amber' ? 'CAUTION' : 'WARNING'}
        </span>
        <span className="text-ink-faint">TGT {kpi.target}</span>
        <Info size={11} className="text-ink-faint opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </button>
  );
};
