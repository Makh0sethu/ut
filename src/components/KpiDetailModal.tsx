import React, { useState } from 'react';
import { KpiMetric } from '../types';
import { getKpiStatus, formatValue } from '../utils/gaugeHelpers';
import { ZETDC_REGIONS, ZETDC_DISTRICTS } from '../data/zetdcReferenceData';
import { X, Save, RotateCcw, AlertTriangle, ShieldCheck, AlertCircle, BarChart2 } from 'lucide-react';

interface KpiDetailModalProps {
  kpi: KpiMetric | null;
  onClose: () => void;
  onSaveMetric: (updatedKpi: KpiMetric) => void;
}

export const KpiDetailModal: React.FC<KpiDetailModalProps> = ({
  kpi,
  onClose,
  onSaveMetric,
}) => {
  if (!kpi) return null;

  const [value, setValue] = useState(kpi.value);
  const [target, setTarget] = useState(kpi.target);
  const [greenThreshold, setGreenThreshold] = useState(kpi.greenThreshold);
  const [redThreshold, setRedThreshold] = useState(kpi.redThreshold);

  const currentStatus = getKpiStatus(kpi, value);

  const handleSave = () => {
    onSaveMetric({
      ...kpi,
      value,
      target,
      greenThreshold,
      redThreshold,
    });
    onClose();
  };

  // SVG trend chart calculation
  const history = kpi.history;
  const minHist = Math.min(...history, kpi.min);
  const maxHist = Math.max(...history, kpi.max);
  const rangeHist = maxHist - minHist || 1;

  // formatValue already embeds the unit for '%' and '/ 5.0'; append it ourselves otherwise.
  const fmtWithUnit = (val: number) =>
    kpi.unit === '%' || kpi.unit === '/ 5.0'
      ? formatValue(val, kpi.unit)
      : `${formatValue(val, kpi.unit)} ${kpi.unit}`;

  const sparklinePoints = history
    .map((val, idx) => {
      const x = (idx / (history.length - 1)) * 320;
      const y = 80 - ((val - minHist) / rangeHist) * 70;
      return `${x},${y}`;
    })
    .join(' ');

  // The KPI's own regionalBreakdown is authored per-district (18 entries, reused for the
  // sidebar's Region/District filters) — roll those up into ZETDC's 5 operational regions
  // here so the popup's "Regional Sector Breakdown" matches the regions used everywhere else.
  const regionBreakdown = ZETDC_REGIONS.map((regionName) => {
    const districtNames = new Set(
      ZETDC_DISTRICTS.filter((d) => d.region === regionName).map((d) => d.name)
    );
    const entries = kpi.regionalBreakdown.filter((r) => districtNames.has(r.region));
    const avg = entries.length > 0 ? entries.reduce((a, e) => a + e.value, 0) / entries.length : 0;
    return { region: regionName, value: avg };
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-panel border border-line rounded-2xl shadow-2xl overflow-hidden text-ink">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-line bg-panel">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-accent/15 border border-accent/40 text-accent">
              {kpi.code}
            </span>
            <div>
              <h2 className="text-lg font-bold text-ink uppercase">{kpi.name}</h2>
              <p className="text-xs text-ink-muted">{kpi.category} • {kpi.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-panel-raised text-ink-faint hover:text-ink transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Status & Current Readout Header Card */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-panel border border-line">
            <div>
              <span className="text-xs font-mono text-ink-faint uppercase tracking-wider">Live Telemetry Readout</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-mono font-black text-ink">
                  {formatValue(value, kpi.unit)}
                </span>
                <span className="font-mono text-sm text-ink-muted">{kpi.unit}</span>
              </div>
            </div>

            {/* Status LED Badge */}
            <div className="flex items-center gap-2">
              {currentStatus === 'green' && (
                <div className="px-3 py-1.5 rounded-full bg-emerald-500 border border-emerald-600 text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                  <ShieldCheck size={16} /> OPERATIONAL / NOMINAL
                </div>
              )}
              {currentStatus === 'amber' && (
                <div className="px-3 py-1.5 rounded-full bg-amber-500 border border-amber-600 text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-[0_0_8px_rgba(245,158,11,0.3)]">
                  <AlertTriangle size={16} /> CAUTION / DEVIATION
                </div>
              )}
              {currentStatus === 'red' && (
                <div className="px-3 py-1.5 rounded-full bg-red-500 border border-red-600 text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-[0_0_12px_rgba(239,68,68,0.5)] animate-pulse">
                  <AlertCircle size={16} /> CRITICAL / WARNING
                </div>
              )}
            </div>
          </div>

          {/* Thresholds & Values Adjuster Form */}
          <div className="p-4 rounded-xl bg-panel/60 border border-line space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
              <span>Threshold Limits & Target Calibration</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Current Value Slider */}
              <div className="space-y-1">
                <label className="text-xs font-mono text-ink-muted flex justify-between">
                  <span>Current Metric Value:</span>
                  <span className="font-bold text-accent">{value} {kpi.unit}</span>
                </label>
                <input
                  type="range"
                  min={kpi.min}
                  max={kpi.max}
                  step={0.1}
                  value={value}
                  onChange={(e) => setValue(parseFloat(e.target.value))}
                  className="w-full accent-[#055fb3] bg-panel-alt h-2 rounded cursor-pointer"
                />
              </div>

              {/* Target Value Slider */}
              <div className="space-y-1">
                <label className="text-xs font-mono text-ink-muted flex justify-between">
                  <span>Target Benchmark:</span>
                  <span className="font-bold text-amber-600">{target} {kpi.unit}</span>
                </label>
                <input
                  type="range"
                  min={kpi.min}
                  max={kpi.max}
                  step={0.1}
                  value={target}
                  onChange={(e) => setTarget(parseFloat(e.target.value))}
                  className="w-full accent-amber-400 bg-panel-alt h-2 rounded cursor-pointer"
                />
              </div>

              {/* Green Threshold */}
              <div className="space-y-1">
                <label className="text-xs font-mono text-emerald-600 flex justify-between">
                  <span>Green Threshold Limit:</span>
                  <span className="font-bold">{greenThreshold} {kpi.unit}</span>
                </label>
                <input
                  type="range"
                  min={kpi.min}
                  max={kpi.max}
                  step={0.1}
                  value={greenThreshold}
                  onChange={(e) => setGreenThreshold(parseFloat(e.target.value))}
                  className="w-full accent-emerald-400 bg-panel-alt h-2 rounded cursor-pointer"
                />
              </div>

              {/* Red Threshold */}
              <div className="space-y-1">
                <label className="text-xs font-mono text-red-600 flex justify-between">
                  <span>Red Threshold Limit:</span>
                  <span className="font-bold">{redThreshold} {kpi.unit}</span>
                </label>
                <input
                  type="range"
                  min={kpi.min}
                  max={kpi.max}
                  step={0.1}
                  value={redThreshold}
                  onChange={(e) => setRedThreshold(parseFloat(e.target.value))}
                  className="w-full accent-red-400 bg-panel-alt h-2 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Historical Trend Sparkline */}
          <div className="p-4 rounded-xl bg-panel/60 border border-line space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
                <BarChart2 size={14} /> 12-Month Telemetry Trend
              </h3>
              <span className="text-xs font-mono text-ink-faint">12 Periods</span>
            </div>

            {/* Legend & Key Stat Callouts */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-mono text-ink-muted">
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-0.5 rounded bg-accent" /> Actual
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-0.5 rounded bg-amber-500" style={{ borderTop: '1.5px dashed #f59e0b', height: 0 }} /> Target ({fmtWithUnit(kpi.target)})
              </span>
              <span>
                Peak <strong className="text-ink">{fmtWithUnit(maxHist)}</strong>
              </span>
              <span>
                Low <strong className="text-ink">{fmtWithUnit(minHist)}</strong>
              </span>
              <span>
                Latest <strong className="text-ink">{fmtWithUnit(history[history.length - 1])}</strong>
              </span>
            </div>

            <div className="relative h-28 w-full bg-canvas rounded-xl p-2 border border-line flex items-end">
              {/* Y-axis min/max readout */}
              <div className="absolute left-2 top-1 text-[9px] font-mono text-ink-faint">{formatValue(maxHist, kpi.unit)}</div>
              <div className="absolute left-2 bottom-1 text-[9px] font-mono text-ink-faint">{formatValue(minHist, kpi.unit)}</div>

              <svg viewBox="0 0 320 90" className="w-full h-full overflow-visible">
                {/* Target Line */}
                {kpi.target && (
                  <line
                    x1="0"
                    y1={80 - ((kpi.target - minHist) / rangeHist) * 70}
                    x2="320"
                    y2={80 - ((kpi.target - minHist) / rangeHist) * 70}
                    stroke="#f59e0b"
                    strokeDasharray="4 4"
                    strokeWidth="1.5"
                    opacity="0.7"
                  />
                )}
                {/* Trend Polyline */}
                <polyline
                  fill="none"
                  stroke="var(--accent-primary)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={sparklinePoints}
                />
                {/* Historical Points */}
                {history.map((val, idx) => {
                  const x = (idx / (history.length - 1)) * 320;
                  const y = 80 - ((val - minHist) / rangeHist) * 70;
                  const isLatest = idx === history.length - 1;
                  return (
                    <g key={idx}>
                      <circle
                        cx={x}
                        cy={y}
                        r={isLatest ? 4.5 : 3}
                        fill="var(--accent-primary)"
                        stroke="var(--bg-primary)"
                        strokeWidth="1.5"
                      >
                        <title>{`Period ${idx + 1}: ${fmtWithUnit(val)}`}</title>
                      </circle>
                      {isLatest && (
                        <text x={x} y={y - 10} textAnchor="end" fontSize="9" fill="var(--text-primary)" fontFamily="monospace" fontWeight="bold">
                          {formatValue(val, kpi.unit)}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Regional Sector Comparison Bars */}
          <div className="p-4 rounded-xl bg-panel/60 border border-line space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-accent">
              Regional Sector Breakdown
            </h3>
            <div className="space-y-2">
              {regionBreakdown.map((reg) => {
                const maxReg = Math.max(...regionBreakdown.map((r) => r.value), kpi.max);
                const pct = Math.min(100, Math.max(5, (reg.value / maxReg) * 100));

                return (
                  <div key={reg.region} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-ink-muted">{reg.region}</span>
                      <span className="font-bold text-ink">
                        {formatValue(reg.value, kpi.unit)} {kpi.unit}
                      </span>
                    </div>
                    <div className="w-full bg-panel-alt h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-accent h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Formula & Description */}
          <div className="p-4 rounded-xl bg-panel/40 border border-line space-y-2 text-xs">
            <div className="font-mono text-ink-muted">
              <span className="font-bold text-amber-600">Calculation Formula:</span>{' '}
              <code className="bg-canvas px-2 py-1 rounded text-accent border border-line">
                {kpi.formula}
              </code>
            </div>
            <p className="text-ink-faint leading-relaxed">{kpi.description}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-line bg-panel">
          <button
            onClick={() => {
              setValue(kpi.value);
              setTarget(kpi.target);
              setGreenThreshold(kpi.greenThreshold);
              setRedThreshold(kpi.redThreshold);
            }}
            className="flex items-center gap-1.5 text-xs font-mono text-ink-faint hover:text-ink transition-colors"
          >
            <RotateCcw size={14} /> Reset Changes
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-panel-alt hover:bg-panel-raised text-xs font-mono font-bold text-ink-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-mono font-bold transition-colors shadow-lg shadow-accent/20"
            >
              <Save size={14} /> Apply Calibration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
