import React from 'react';
import { kpiTickLabel } from '../../utils/gaugeHelpers';

interface TurnCoordinatorProps {
  kpiUnit?: string;
  kpiMin?: number;
  kpiMax?: number;
  kpiGreenFrac?: number;
  kpiRedFrac?: number;
  kpiInverted?: boolean;
  turnRate: number; // deg/sec (-6 to +6)
  slipBall: number; // -1 (left) to +1 (right), 0 centered
}

export const TurnCoordinator: React.FC<TurnCoordinatorProps> = ({
  kpiUnit,
  kpiMin,
  kpiMax,
  kpiGreenFrac,
  kpiRedFrac,
  kpiInverted,
  turnRate,
  slipBall,
}) => {
  // Standard rate turn = 3 deg/sec corresponds to ~16° of miniature plane bank
  // Angle = (turnRate / 3) * 16 degrees
  const planeRoll = Math.max(-30, Math.min(30, (turnRate / 3) * 16));

  // Slip ball displacement:
  // -1 to +1 mapped to -24px to +24px along curved path
  const ballOffset = Math.max(-1, Math.min(1, slipBall)) * 24;
  // slight curve: y drops slightly at the ends
  const ballY = Math.pow(ballOffset / 24, 2) * 2;

  // KPI mode: the L/R "doghouse" ticks double as this KPI's real min/max ends
  // (turnRate -6 = kpiMin, +6 = kpiMax, matching the FlightDashboardApp mapping),
  // and a thin threshold bar between them shows the real red/amber/green zone.
  const hasKpiThresholds = kpiGreenFrac !== undefined && kpiRedFrac !== undefined;
  const BAR_LEFT_X = 47;
  const BAR_RIGHT_X = 193;
  const xAtFrac = (frac: number) => BAR_LEFT_X + frac * (BAR_RIGHT_X - BAR_LEFT_X);
  const kpiGreenX = hasKpiThresholds ? xAtFrac(kpiGreenFrac!) : 0;
  const kpiRedX = hasKpiThresholds ? xAtFrac(kpiRedFrac!) : 0;
  // Inverts the -6..+6 turnRate mapping back to a 0..1 position so a marker can
  // sit directly on the bar — the bank angle alone doesn't visually read as
  // "a point on this scale", so the bar needs its own explicit pointer.
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

        {/* Top Text */}
        <text
          x="120"
          y="56"
          fill="#94a3b8"
          fontSize="8.5"
          fontWeight="700"
          letterSpacing="0.8"
          fontFamily="Chivo Mono, monospace"
          textAnchor="middle"
        >
          {kpiMode ? '' : 'D.C. ELEC.'}
        </text>

        {hasKpiThresholds && (
          <>
            {/* KPI threshold bar: real red/amber/green zone between the L and R ends */}
            {!kpiInverted ? (
              <>
                <line x1={BAR_LEFT_X} y1="108" x2={kpiRedX} y2="108" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
                <line x1={kpiRedX} y1="108" x2={kpiGreenX} y2="108" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
                <line x1={kpiGreenX} y1="108" x2={BAR_RIGHT_X} y2="108" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" />
              </>
            ) : (
              <>
                <line x1={BAR_LEFT_X} y1="108" x2={kpiGreenX} y2="108" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" />
                <line x1={kpiGreenX} y1="108" x2={kpiRedX} y2="108" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
                <line x1={kpiRedX} y1="108" x2={BAR_RIGHT_X} y2="108" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
              </>
            )}
            {/* Value marker: exactly where the current reading sits on the bar */}
            <polygon
              points={`${valueX},103 ${valueX - 4.5},95 ${valueX + 4.5},95`}
              fill="#ffffff"
              stroke="#000000"
              strokeWidth="0.75"
            />
          </>
        )}

        {/* Standard Rate Index Marks: L & R ticks double as this KPI's min/max labels */}
        {/* Level wings reference */}
        <rect x="36" y="117" width="22" height="6" fill="#f8fafc" />
        <rect x="182" y="117" width="22" height="6" fill="#f8fafc" />

        {/* L Turn Index (Lowered tick mark) */}
        <rect x="42" y="132" width="16" height="4" fill="#f8fafc" />
        <text
          x="44"
          y="152"
          fill="#f8fafc"
          fontSize={kpiMode ? '11' : '14'}
          fontWeight="700"
          fontFamily="Oswald, sans-serif"
          textAnchor="middle"
        >
          {minLabel}
        </text>

        {/* R Turn Index (Lowered tick mark) */}
        <rect x="182" y="132" width="16" height="4" fill="#f8fafc" />
        <text
          x="196"
          y="152"
          fill="#f8fafc"
          fontSize={kpiMode ? '11' : '14'}
          fontWeight="700"
          fontFamily="Oswald, sans-serif"
          textAnchor="middle"
        >
          {maxLabel}
        </text>

        {/* Miniature Airplane (Banking with roll/turn rate) */}
        <g transform={`rotate(${planeRoll}, 120, 120)`} style={{ transition: 'transform 0.6s ease-in-out' }}>
          {/* Fuselage & Vertical Fin */}
          <ellipse cx="120" cy="120" rx="5" ry="5" fill="#f8fafc" />
          <polygon points="120,102 117,118 123,118" fill="#f8fafc" />
          {/* Left Wing */}
          <polygon points="120,118 58,118 58,122 120,122" fill="#f8fafc" />
          {/* Right Wing */}
          <polygon points="120,118 182,118 182,122 120,122" fill="#f8fafc" />
          {/* Wingtip Caps */}
          <circle cx="58" cy="120" r="2.5" fill="#f8fafc" />
          <circle cx="182" cy="120" r="2.5" fill="#f8fafc" />
          {/* Center Hub */}
          <circle cx="120" cy="120" r="2.5" fill="#18181b" />
        </g>

        {/* Center Text: native "2 MIN." turn-rate spec is meaningless for a KPI reading, so KPI mode shows the real unit instead */}
        <text
          x="120"
          y="150"
          fill="#f8fafc"
          fontSize="9"
          fontWeight="700"
          letterSpacing="0.8"
          fontFamily="Chivo Mono, monospace"
          textAnchor="middle"
        >
          {kpiMode ? (kpiUnit || '') : '2 MIN.'}
        </text>

        {!kpiMode && (
          <>
            {/* Text: NO PITCH INFORMATION */}
            <text
              x="120"
              y="160"
              fill="#94a3b8"
              fontSize="6.5"
              fontWeight="600"
              letterSpacing="0.6"
              fontFamily="Chivo Mono, monospace"
              textAnchor="middle"
            >
              NO PITCH
            </text>
            <text
              x="120"
              y="168"
              fill="#94a3b8"
              fontSize="6.5"
              fontWeight="600"
              letterSpacing="0.6"
              fontFamily="Chivo Mono, monospace"
              textAnchor="middle"
            >
              INFORMATION
            </text>
          </>
        )}

        {/* Inclinometer Curved Tube (Slip/Skid Indicator) */}
        <g transform="translate(120, 192)">
          {/* Glass tube background */}
          <path
            d="M -38,-6 Q 0,-3 38,-6 L 38,6 Q 0,9 -38,6 Z"
            fill="#09090b"
            stroke="#3f3f46"
            strokeWidth="1.2"
          />
          {/* Damping fluid sheen */}
          <path
            d="M -36,-4 Q 0,-1 36,-4 L 36,4 Q 0,7 -36,4 Z"
            fill="#e2e8f0"
            opacity="0.25"
          />

          {/* Inclinometer Black Ball */}
          <circle
            cx={ballOffset}
            cy={ballY}
            r="5.5"
            fill="#0f172a"
            stroke="#000000"
            strokeWidth="0.8"
            filter="drop-shadow(0 1px 2px rgba(0,0,0,0.8))"
          />
          <circle cx={ballOffset - 1.5} cy={ballY - 1.5} r="1.5" fill="#475569" />

          {/* Two Vertical Reference Lines (Centered target slot) */}
          <line x1="-8" y1="-6" x2="-8" y2="7" stroke="#ffffff" strokeWidth="1.8" />
          <line x1="8" y1="-6" x2="8" y2="7" stroke="#ffffff" strokeWidth="1.8" />
        </g>
      </svg>
    </div>
  );
};
