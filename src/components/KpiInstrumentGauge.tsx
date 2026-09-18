import React from 'react';
import { KpiMetric } from '../types';
import { formatValue } from '../utils/gaugeHelpers';

import { AirspeedIndicator } from './kpi-instruments/AirspeedIndicator';
import { Altimeter } from './kpi-instruments/Altimeter';
import { ManifoldPressureIndicator } from './kpi-instruments/ManifoldPressureIndicator';
import { Tachometer } from './kpi-instruments/Tachometer';
import { VerticalSpeedIndicator } from './kpi-instruments/VerticalSpeedIndicator';
import { TurnCoordinator } from './kpi-instruments/TurnCoordinator';
import { TurnSlipIndicator } from './kpi-instruments/TurnSlipIndicator';
import { VorIndicator } from './kpi-instruments/VorIndicator';
import { HeadingIndicator } from './kpi-instruments/HeadingIndicator';

// ----------------------------------------------------------------------------
// InstrumentWidget: scalloped/square/chamfered bezel with corner screws, a
// heading plate above and a KPI value plate below so the real metric
// identity/value always travels with the dial. Shared by the standalone
// flight-dashboard.html page and the "instruments" theme on the main cockpit.
// ----------------------------------------------------------------------------
interface InstrumentWidgetProps {
  heading: string;
  subtitle?: string;
  valueString: string;
  children?: React.ReactNode;
  bezelShape?: 'scalloped' | 'square' | 'chamfered';
}

export const InstrumentWidget: React.FC<InstrumentWidgetProps> = ({ heading, subtitle, valueString, children, bezelShape = 'scalloped' }) => {
  return (
    <div className="flex flex-col items-center">
      {/* Nameplate: Heading + Subtitle, sitting on top of the bezel like a placard */}
      <div className="bg-stone-800 border-[2px] border-stone-600 px-3 pt-1 pb-1.5 text-center shadow-[0_4px_8px_rgba(0,0,0,0.4)] relative z-30 mx-4 max-w-full rounded-t-md mb-[-4px]">
        <div className="font-bold text-stone-200 text-xs md:text-sm tracking-wider uppercase leading-tight">
          {heading}
        </div>
        {subtitle && (
          <div className="mt-0.5 text-[9px] md:text-[10px] font-mono text-stone-400 tracking-tight truncate max-w-[200px] md:max-w-[224px] mx-auto">
            {subtitle}
          </div>
        )}
      </div>

      {/* Bezel Container */}
      <div className="relative w-56 h-56 md:w-64 md:h-64 flex items-center justify-center drop-shadow-2xl">

        {/* Bezel Base Variations */}
        {bezelShape === 'scalloped' && (
          <>
            <div className="absolute w-[85%] h-full bg-gradient-to-br from-gray-700 via-gray-800 to-gray-950 rounded-[2rem] border border-gray-600/30 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)]"></div>
            <div className="absolute w-full h-[85%] bg-gradient-to-br from-gray-700 via-gray-800 to-gray-950 rounded-[2rem] border border-gray-600/30 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)]"></div>
          </>
        )}

        {bezelShape === 'square' && (
          <div className="absolute w-full h-full bg-gradient-to-br from-gray-700 via-gray-800 to-gray-950 rounded-[2.5rem] border border-gray-600/30 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)]"></div>
        )}

        {bezelShape === 'chamfered' && (
          <>
            <div className="absolute w-full h-full bg-gradient-to-br from-gray-500 via-gray-700 to-gray-900 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)]" style={{ clipPath: 'polygon(15% 0, 85% 0, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0 85%, 0 15%)' }}></div>
            <div className="absolute w-[98%] h-[98%] bg-gradient-to-br from-gray-700 via-gray-800 to-gray-950" style={{ clipPath: 'polygon(15% 0, 85% 0, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0 85%, 0 15%)' }}></div>
          </>
        )}

        {/* Center circle overlay to smooth the inner intersection */}
        <div className="absolute w-[91%] h-[91%] bg-gradient-to-br from-gray-700 to-gray-900 rounded-full"></div>

        {/* Corner screws */}
        <div className="absolute top-3.5 left-3.5 w-3.5 h-3.5 rounded-full bg-gray-800 border border-gray-900 shadow-[inset_0_1px_3px_rgba(0,0,0,1),0_1px_0_rgba(255,255,255,0.2)] z-10 flex items-center justify-center">
          <div className="w-full h-[1.5px] bg-black/70 rotate-45"></div>
        </div>
        <div className="absolute top-3.5 right-3.5 w-3.5 h-3.5 rounded-full bg-gray-800 border border-gray-900 shadow-[inset_0_1px_3px_rgba(0,0,0,1),0_1px_0_rgba(255,255,255,0.2)] z-10 flex items-center justify-center">
          <div className="w-full h-[1.5px] bg-black/70 -rotate-12"></div>
        </div>
        <div className="absolute bottom-3.5 left-3.5 w-3.5 h-3.5 rounded-full bg-gray-800 border border-gray-900 shadow-[inset_0_1px_3px_rgba(0,0,0,1),0_1px_0_rgba(255,255,255,0.2)] z-10 flex items-center justify-center">
          <div className="w-full h-[1.5px] bg-black/70 rotate-90"></div>
        </div>
        <div className="absolute bottom-3.5 right-3.5 w-3.5 h-3.5 rounded-full bg-gray-800 border border-gray-900 shadow-[inset_0_1px_3px_rgba(0,0,0,1),0_1px_0_rgba(255,255,255,0.2)] z-10 flex items-center justify-center">
          <div className="w-full h-[1.5px] bg-black/70 -rotate-45"></div>
        </div>

        {/* Inner dial cutout - This holds the aviation instrument SVG */}
        <div className="absolute m-auto w-[87%] h-[87%] bg-[#111] rounded-full border-4 border-gray-800 shadow-[inset_0_16px_32px_rgba(0,0,0,1),0_2px_4px_rgba(255,255,255,0.15)] overflow-hidden z-10 flex items-center justify-center">
           {children}
        </div>
      </div>

      {/* Label: KPI Value */}
      <div className="bg-stone-900 border-[2px] border-amber-500/80 px-4 py-1.5 text-center font-mono font-bold text-amber-400 text-sm md:text-base tracking-wider shadow-[0_4px_8px_rgba(0,0,0,0.4)] relative z-30 mx-4 mt-[-8px] rounded-md">
        {valueString}
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------------
// Each KPI is assigned a fixed instrument face (by id, not array position) so
// the mapping survives data edits. Four instruments (Airspeed / Altimeter /
// Manifold / Tachometer) are "absolute" dials that relabel their tick marks
// to the KPI's real min-max range (e.g. Access shows 50-100%, not 40-200
// knots). The other five are "deviation" instruments whose zero point is
// on-target by design (VSI level flight, Turn Coordinator/Slip coordinated,
// VOR on-course, Heading brings the reading to the top under the airplane) —
// a natural fit for showing how far a KPI is running from its target.
// ----------------------------------------------------------------------------
type InstrumentKind = 'airspeed' | 'altimeter' | 'manifold' | 'tachometer' | 'vsi' | 'turnCoordinator' | 'turnSlip' | 'vor' | 'heading';

const KPI_INSTRUMENT_MAP: Record<string, InstrumentKind> = {
  saidi: 'altimeter',
  saifi: 'tachometer',
  response_time: 'manifold',
  access: 'airspeed',
  energy_sales: 'vsi',
  collection_index: 'turnCoordinator',
  system_losses: 'turnSlip',
  customer_rating: 'vor',
  waiting_period: 'heading',
};

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// 0..1 position of the KPI's value within its min-max range. This is exactly
// what the main dashboard's calculateNeedleAngle(value, min, max) uses
// (src/utils/gaugeHelpers.ts) — every dial below places its needle at this
// same fraction of its own native range, so all 9 read the same underlying
// position-in-range that the main dashboard shows, just through a different
// dial shape.
const normalize = (kpi: KpiMetric) => clamp((kpi.value - kpi.min) / (kpi.max - kpi.min || 1), 0, 1);

// Where the KPI's own green/red threshold sits within its min-max range (0..1),
// same basis as normalize(). Passed to the dials so their colored zone arcs
// reflect this KPI's real thresholds instead of a fixed aviation warning band
// (e.g. Airspeed's stock 65-160kt "normal range").
const thresholdFrac = (kpi: KpiMetric, threshold: number) =>
  clamp((threshold - kpi.min) / (kpi.max - kpi.min || 1), 0, 1);

function renderInstrument(kind: InstrumentKind, kpi: KpiMetric) {
  const kpiUnit = kpi.unit.toUpperCase();
  const pos = normalize(kpi);
  const kpiGreenFrac = thresholdFrac(kpi, kpi.greenThreshold);
  const kpiRedFrac = thresholdFrac(kpi, kpi.redThreshold);
  const kpiInverted = kpi.inverted;
  switch (kind) {
    // 1. SAIDI -> Altimeter. Single visible hand sweeps one full turn per
    // 1000 native units; feeding it 10000 (the old code) wrapped the needle
    // around the dial 10x per range, landing it at an angle unrelated to the
    // real value. Scaling by 1000 keeps it to one clean sweep from min to max.
    case 'altimeter': {
      const altitude = pos * 1000;
      return <Altimeter altitude={altitude} kollsmanPressure={29.92} kpiMin={kpi.min} kpiMax={kpi.max} kpiUnit={kpiUnit} kpiGreenFrac={kpiGreenFrac} kpiRedFrac={kpiRedFrac} kpiInverted={kpiInverted} />;
    }
    // 2. SAIFI -> Tachometer. Linear single-turn dial, 0-3500 native range;
    // majorMarks already relabel 0..kpiMax across the same 0..3500 span.
    case 'tachometer': {
      const rpm = pos * 3500;
      return <Tachometer rpm={rpm} hobbsHours={kpi.value} kpiMin={kpi.min} kpiMax={kpi.max} kpiUnit={kpiUnit} kpiGreenFrac={kpiGreenFrac} kpiRedFrac={kpiRedFrac} kpiInverted={kpiInverted} />;
    }
    // 3. Fault Restoration Time -> Manifold Pressure. Linear single-turn dial, 10-40 native range.
    case 'manifold': {
      const manifoldPressure = 10 + pos * 30;
      return <ManifoldPressureIndicator manifoldPressure={manifoldPressure} kpiMin={kpi.min} kpiMax={kpi.max} kpiUnit={kpiUnit} kpiGreenFrac={kpiGreenFrac} kpiRedFrac={kpiRedFrac} kpiInverted={kpiInverted} />;
    }
    // 4. Access -> Airspeed. Native tick scale is labeled 40-200; offsetting
    // the position keeps the needle exactly on the matching relabeled tick.
    case 'airspeed': {
      const airspeed = 40 + pos * 160;
      return <AirspeedIndicator airspeed={airspeed} kpiMin={kpi.min} kpiMax={kpi.max} kpiUnit={kpiUnit} kpiGreenFrac={kpiGreenFrac} kpiRedFrac={kpiRedFrac} kpiInverted={kpiInverted} />;
    }
    // 5. Energy Sales -> Vertical Speed Indicator. Bipolar -2000..+2000 native
    // range: full-down needle = min, level = midpoint of range, full-up = max.
    case 'vsi': {
      const vsi = -2000 + pos * 4000;
      return <VerticalSpeedIndicator vsi={vsi} kpiMin={kpi.min} kpiMax={kpi.max} kpiUnit={kpiUnit} />;
    }
    // 6. Collection Index -> Turn Coordinator. Bipolar -6..+6 turn-rate range
    // (bank left = near min, level = midpoint, bank right = near max); slip
    // ball mirrors the same position on its own -1..+1 range.
    case 'turnCoordinator': {
      return <TurnCoordinator turnRate={-6 + pos * 12} slipBall={-1 + pos * 2} kpiMin={kpi.min} kpiMax={kpi.max} kpiUnit={kpiUnit} kpiGreenFrac={kpiGreenFrac} kpiRedFrac={kpiRedFrac} kpiInverted={kpiInverted} />;
    }
    // 7. System Losses -> Turn & Slip Indicator. Same bipolar mapping as Turn Coordinator.
    case 'turnSlip': {
      return <TurnSlipIndicator turnRate={-6 + pos * 12} slipBall={-1 + pos * 2} kpiMin={kpi.min} kpiMax={kpi.max} kpiUnit={kpiUnit} kpiGreenFrac={kpiGreenFrac} kpiRedFrac={kpiRedFrac} kpiInverted={kpiInverted} />;
    }
    // 8. Customer Rating -> VOR. Bipolar -5..+5 deviation-dot range (full range, no saturation).
    case 'vor': {
      const deviation = -5 + pos * 10;
      return <VorIndicator obsHeading={0} deviation={deviation} toFrom={deviation >= 0 ? 'TO' : 'FROM'} kpiMin={kpi.min} kpiMax={kpi.max} kpiUnit={kpiUnit} kpiGreenFrac={kpiGreenFrac} kpiRedFrac={kpiRedFrac} kpiInverted={kpiInverted} />;
    }
    // 9. Waiting Period -> Heading Indicator. Full 360° sweep brings the current
    // reading to 12 o'clock under the fixed airplane silhouette; the heading
    // bug marks where the KPI's target sits on the same rotating card.
    case 'heading': {
      const heading = pos * 360;
      const targetFrac = clamp((kpi.target - kpi.min) / (kpi.max - kpi.min || 1), 0, 1);
      return <HeadingIndicator heading={heading} headingBug={targetFrac * 360} kpiMin={kpi.min} kpiMax={kpi.max} kpiUnit={kpiUnit} kpiGreenFrac={kpiGreenFrac} kpiRedFrac={kpiRedFrac} kpiInverted={kpiInverted} />;
    }
  }
}

// Deterministic (not random) bezel shape per KPI id, so the same KPI always
// wears the same bezel across renders/reloads and between the standalone
// flight-dashboard page and the main cockpit's "instruments" theme.
const BEZEL_SHAPES: Array<'scalloped' | 'square' | 'chamfered'> = ['scalloped', 'square', 'chamfered'];
function bezelShapeFor(id: string): 'scalloped' | 'square' | 'chamfered' {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return BEZEL_SHAPES[hash % BEZEL_SHAPES.length];
}

interface KpiInstrumentGaugeProps {
  kpi: KpiMetric;
  onClick?: () => void;
}

export const KpiInstrumentGauge: React.FC<KpiInstrumentGaugeProps> = ({ kpi, onClick }) => {
  const kind = KPI_INSTRUMENT_MAP[kpi.id] ?? 'airspeed';
  return (
    <div onClick={onClick} className={onClick ? 'cursor-pointer' : undefined}>
      <InstrumentWidget
        heading={kpi.name}
        subtitle={kpi.subtitle}
        valueString={`${formatValue(kpi.value, kpi.unit)} (TGT ${formatValue(kpi.target, kpi.unit)})`}
        bezelShape={bezelShapeFor(kpi.id)}
      >
        <div className="w-full h-full relative scale-[1.05]">
          {renderInstrument(kind, kpi)}
        </div>
      </InstrumentWidget>
    </div>
  );
};
