import React from 'react';
import { kpiTickLabel } from '../../utils/gaugeHelpers';

interface TurnSlipProps {
  kpiUnit?: string;
  kpiMin?: number;
  kpiMax?: number;
  kpiGreenFrac?: number;
  kpiRedFrac?: number;
  kpiInverted?: boolean;
  turnRate: number; // deg/sec (-6 to +6)
  slipBall: number; // -1 to +1
}

export const TurnSlipIndicator: React.FC<TurnSlipProps> = ({
  kpiUnit,
  kpiMin,
  kpiMax,
  kpiGreenFrac,
  kpiRedFrac,
  kpiInverted,
  turnRate,
  slipBall,
}) => {
  // Needle deflects left/right:
  // Standard rate = 3 deg/sec corresponds to reaching the "doghouse" mark (~20° deflection)
  const needleDeflection = Math.max(-35, Math.min(35, (turnRate / 3) * 20));

  const ballOffset = Math.max(-1, Math.min(1, slipBall)) * 26;
  const ballY = Math.pow(ballOffset / 26, 2) * 2.5;

  // KPI mode: the L/R "doghouse" ticks double as this KPI's real min/max ends
  // (turnRate -6 = kpiMin, +6 = kpiMax), with a threshold bar between them.
  const hasKpiThresholds = kpiGreenFrac !== undefined && kpiRedFrac !== undefined;
  const BAR_LEFT_X = 79;
  const BAR_RIGHT_X = 161;
  const xAtFrac = (frac: number) => BAR_LEFT_X + frac * (BAR_RIGHT_X - BAR_LEFT_X);
  const kpiGreenX = hasKpiThresholds ? xAtFrac(kpiGreenFrac!) : 0;
  const kpiRedX = hasKpiThresholds ? xAtFrac(kpiRedFrac!) : 0;
  // Inverts the -6..+6 turnRate mapping back to a 0..1 position so a marker can
  // sit directly on the bar — the needle deflection alone doesn't visually read
  // as "a point on this scale", so the bar needs its own explicit pointer.
  const valueFrac = Math.max(0, Math.min(1, (turnRate + 6) / 12));
  const valueX = hasKpiThresholds ? xAtFrac(valueFrac) : 0;
  const kpiMode = kpiMin !== undefined && kpiMax !== undefined;
  const minLabel = kpiMode ? kpiTickLabel(kpiMin!, kpiMax!, 0) : 'L';
  const maxLabel = kpiMode ? kpiTickLabel(kpiMin!, kpiMax!, 1) : 'R';

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg viewBox="0 0 240 240" className="w-full h-full select-none">
        {/* Dial Face */}
        <circle cx="120" cy="120" r="106" fill="#141416" />
        <circle cx="120" cy="120" r="105" fill="none" stroke="#262629" strokeWidth="2" />

        {/* Top Center Zero Index Mark */}
        <line x1="120" y1="52" x2="120" y2="68" stroke="#ffffff" strokeWidth="3" />

        {hasKpiThresholds && (
          <>
            {/* KPI threshold bar: real red/amber/green zone between the L and R ends */}
            {!kpiInverted ? (
              <>
                <line x1={BAR_LEFT_X} y1="46" x2={kpiRedX} y2="46" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
                <line x1={kpiRedX} y1="46" x2={kpiGreenX} y2="46" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
                <line x1={kpiGreenX} y1="46" x2={BAR_RIGHT_X} y2="46" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" />
              </>
            ) : (
              <>
                <line x1={BAR_LEFT_X} y1="46" x2={kpiGreenX} y2="46" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" />
                <line x1={kpiGreenX} y1="46" x2={kpiRedX} y2="46" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
                <line x1={kpiRedX} y1="46" x2={BAR_RIGHT_X} y2="46" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
              </>
            )}
            {/* Value marker: exactly where the current reading sits on the bar */}
            <polygon
              points={`${valueX},51 ${valueX - 4.5},59 ${valueX + 4.5},59`}
              fill="#ffffff"
              stroke="#000000"
              strokeWidth="0.75"
            />
          </>
        )}

        {/* Left Standard Turn "Doghouse" Index; label doubles as this KPI's min */}
        <rect x="74" y="60" width="10" height="12" fill="#f8fafc" />
        <text
          x="62"
          y="72"
          fill="#f8fafc"
          fontSize={kpiMode ? '11' : '14'}
          fontWeight="700"
          fontFamily="Oswald, sans-serif"
          textAnchor="middle"
        >
          {minLabel}
        </text>

        {/* Right Standard Turn "Doghouse" Index; label doubles as this KPI's max */}
        <rect x="156" y="60" width="10" height="12" fill="#f8fafc" />
        <text
          x="178"
          y="72"
          fill="#f8fafc"
          fontSize={kpiMode ? '11' : '14'}
          fontWeight="700"
          fontFamily="Oswald, sans-serif"
          textAnchor="middle"
        >
          {maxLabel}
        </text>

        {/* Vertical Turn Needle (Pivoted from center/lower-mid) */}
        <g transform={`rotate(${needleDeflection}, 120, 130)`} style={{ transition: 'transform 0.6s ease-in-out' }}>
          {/* Shadow */}
          <path
            d="M 118,130 L 118.5,58 L 120,52 L 121.5,58 L 122,130 Z"
            fill="rgba(0,0,0,0.5)"
            transform="translate(2, 2)"
          />
          {/* Needle Body */}
          <path
            d="M 118,130 L 118.8,56 L 120,50 L 121.2,56 L 122,130 Z"
            fill="#ffffff"
          />
          {/* Needle Center Pivot Cap */}
          <circle cx="120" cy="130" r="7" fill="#27272a" stroke="#18181b" strokeWidth="1.5" />
          <circle cx="120" cy="130" r="3" fill="#71717a" />
        </g>

        {/* Lower Inclinometer Glass Tube */}
        <g transform="translate(120, 168)">
          {/* Beveled frame */}
          <path
            d="M -44,-8 Q 0,-5 44,-8 L 44,8 Q 0,11 -44,8 Z"
            fill="#09090b"
            stroke="#3f3f46"
            strokeWidth="1.5"
          />
          {/* Damping liquid */}
          <path
            d="M -42,-6 Q 0,-3 42,-6 L 42,6 Q 0,9 -42,6 Z"
            fill="#e2e8f0"
            opacity="0.3"
          />

          {/* Black Inclinometer Ball */}
          <circle
            cx={ballOffset}
            cy={ballY}
            r="6"
            fill="#09090b"
            stroke="#1e293b"
            strokeWidth="1"
            filter="drop-shadow(0 1px 2px rgba(0,0,0,0.8))"
          />
          <circle cx={ballOffset - 1.5} cy={ballY - 1.5} r="1.5" fill="#64748b" />

          {/* Target Reference Lines */}
          <line x1="-9" y1="-8" x2="-9" y2="9" stroke="#ffffff" strokeWidth="2" />
          <line x1="9" y1="-8" x2="9" y2="9" stroke="#ffffff" strokeWidth="2" />
        </g>

        {/* Bottom Text: TURN AND SLIP */}
        <text
          x="120"
          y="196"
          fill="#94a3b8"
          fontSize="7.5"
          fontWeight="700"
          letterSpacing="0.8"
          fontFamily="Chivo Mono, monospace"
          textAnchor="middle"
        >
          {kpiUnit || 'TURN AND SLIP'}
        </text>
      </svg>
    </div>
  );
};
