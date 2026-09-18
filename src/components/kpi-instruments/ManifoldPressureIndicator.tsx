import React from 'react';
import { KPI_TICK_FRACTIONS, kpiTickLabel } from '../../utils/gaugeHelpers';

interface MapProps {
  kpiUnit?: string;
  kpiMin?: number;
  kpiMax?: number;
  kpiGreenFrac?: number;
  kpiRedFrac?: number;
  kpiInverted?: boolean;
  manifoldPressure: number; // 10 to 40 in. Hg
}

export const ManifoldPressureIndicator: React.FC<MapProps> = ({
  kpiUnit,
  kpiMin,
  kpiMax,
  kpiGreenFrac,
  kpiRedFrac,
  kpiInverted,
  manifoldPressure,
}) => {
  // Scale mapping:
  // 10 in. Hg = -135° (8 o'clock)
  // 20 in. Hg = -45° (10:30)
  // 30 in. Hg = +45° (1:30)
  // 40 in. Hg = +135° (4 o'clock)
  // Total span = 270° for 30 in. Hg -> 9° per in. Hg
  const getMapAngle = (p: number) => {
    const clamped = Math.max(10, Math.min(45, p));
    return -135 + (clamped - 10) * 9;
  };

  const needleAngle = getMapAngle(manifoldPressure);

  const polarToCart = (cx: number, cy: number, r: number, angleDeg: number) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  };

  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCart(x, y, radius, endAngle);
    const end = polarToCart(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(' ');
  };

  // Green arc: 15 to 25 in. Hg
  const greenStart = getMapAngle(15);
  const greenEnd = getMapAngle(25);

  const majorMarks = [10, 20, 30, 40];

  // KPI mode: replace the native 15-25 in.Hg warning band with a 3-segment
  // arc positioned at this KPI's real green/red thresholds.
  const hasKpiThresholds = kpiGreenFrac !== undefined && kpiRedFrac !== undefined;
  const startAngle = getMapAngle(10);
  const endAngle = getMapAngle(40);
  const kpiGreenAngle = hasKpiThresholds ? getMapAngle(10 + kpiGreenFrac! * 30) : 0;
  const kpiRedAngle = hasKpiThresholds ? getMapAngle(10 + kpiRedFrac! * 30) : 0;

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg viewBox="0 0 240 240" className="w-full h-full select-none">
        {/* Dial Face */}
        <circle cx="120" cy="120" r="106" fill="#141416" />
        <circle cx="120" cy="120" r="105" fill="none" stroke="#262629" strokeWidth="2" />

        {hasKpiThresholds ? (
          <>
            {/* KPI threshold arc: red/amber/green ordered by this KPI's own thresholds */}
            {!kpiInverted ? (
              <>
                <path d={describeArc(120, 120, 84, startAngle, kpiRedAngle)} fill="none" stroke="#ef4444" strokeWidth="5" strokeLinecap="butt" />
                <path d={describeArc(120, 120, 84, kpiRedAngle, kpiGreenAngle)} fill="none" stroke="#f59e0b" strokeWidth="5" strokeLinecap="butt" />
                <path d={describeArc(120, 120, 84, kpiGreenAngle, endAngle)} fill="none" stroke="#22c55e" strokeWidth="5" strokeLinecap="butt" />
              </>
            ) : (
              <>
                <path d={describeArc(120, 120, 84, startAngle, kpiGreenAngle)} fill="none" stroke="#22c55e" strokeWidth="5" strokeLinecap="butt" />
                <path d={describeArc(120, 120, 84, kpiGreenAngle, kpiRedAngle)} fill="none" stroke="#f59e0b" strokeWidth="5" strokeLinecap="butt" />
                <path d={describeArc(120, 120, 84, kpiRedAngle, endAngle)} fill="none" stroke="#ef4444" strokeWidth="5" strokeLinecap="butt" />
              </>
            )}
          </>
        ) : (
          <>
            {/* Green Operating Range Arc */}
            <path
              d={describeArc(120, 120, 84, greenStart, greenEnd)}
              fill="none"
              stroke="#22c55e"
              strokeWidth="5"
              strokeLinecap="butt"
            />

            {/* Red Line at 30 in. Hg */}
            {(() => {
              const redAngle = getMapAngle(30);
              const p1 = polarToCart(120, 120, 78, redAngle);
              const p2 = polarToCart(120, 120, 94, redAngle);
              return <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#ef4444" strokeWidth="3" />;
            })()}
          </>
        )}

        {/* Minor Ticks (Every 1 in. Hg) */}
        {Array.from({ length: 31 }).map((_, i) => {
          const val = 10 + i;
          const is5 = val % 5 === 0;
          const isMajor = val % 10 === 0;
          if (isMajor) return null;
          const angle = getMapAngle(val);
          const p1 = polarToCart(120, 120, is5 ? 86 : 90, angle);
          const p2 = polarToCart(120, 120, 95, angle);
          return (
            <line
              key={val}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke={is5 ? '#cbd5e1' : '#94a3b8'}
              strokeWidth={is5 ? 1.8 : 1}
            />
          );
        })}

        {/* Major Ticks & Numbers: KPI mode shows 5 clean ticks (min..max) so
            every dial follows the same consistent tick scheme. */}
        {kpiMin !== undefined && kpiMax !== undefined
          ? KPI_TICK_FRACTIONS.map((frac) => {
              const angle = getMapAngle(10 + frac * 30);
              const p1 = polarToCart(120, 120, 83, angle);
              const p2 = polarToCart(120, 120, 96, angle);
              const pText = polarToCart(120, 120, 71, angle);
              const labelText = kpiTickLabel(kpiMin, kpiMax, frac);
              return (
                <g key={frac}>
                  <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#f8fafc" strokeWidth="2.5" />
                  <text
                    x={pText.x}
                    y={pText.y}
                    fill="#f8fafc"
                    fontSize="13"
                    fontWeight="700"
                    fontFamily="Oswald, sans-serif"
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    {labelText}
                  </text>
                </g>
              );
            })
          : majorMarks.map((m) => {
              const angle = getMapAngle(m);
              const p1 = polarToCart(120, 120, 83, angle);
              const p2 = polarToCart(120, 120, 96, angle);
              const pText = polarToCart(120, 120, 71, angle);
              return (
                <g key={m}>
                  <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#f8fafc" strokeWidth="2.5" />
                  <text
                    x={pText.x}
                    y={pText.y}
                    fill="#f8fafc"
                    fontSize="13"
                    fontWeight="700"
                    fontFamily="Oswald, sans-serif"
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    {m}
                  </text>
                </g>
              );
            })}

        {/* Dial Center Labels */}
        <text
          x="120"
          y="72"
          fill="#cbd5e1"
          fontSize="8.5"
          fontWeight="700"
          letterSpacing="0.8"
          fontFamily="Chivo Mono, monospace"
          textAnchor="middle"
        >
          {kpiMin === undefined ? "MANIFOLD" : ""}
        </text>
        <text
          x="120"
          y="82"
          fill="#cbd5e1"
          fontSize="8.5"
          fontWeight="700"
          letterSpacing="0.8"
          fontFamily="Chivo Mono, monospace"
          textAnchor="middle"
        >
          {kpiMin === undefined ? "PRESSURE" : ""}
        </text>
        <text
          x="120"
          y="158"
          fill="#94a3b8"
          fontSize="7.5"
          fontWeight="700"
          letterSpacing="0.8"
          fontFamily="Chivo Mono, monospace"
          textAnchor="middle"
        >
          {kpiUnit || "IN. HG"}
        </text>

        {/* Needle */}
        <g transform={`rotate(${needleAngle}, 120, 120)`} style={{ transition: 'transform 0.6s ease-in-out' }}>
          <path
            d="M 117.5,138 L 118.8,32 L 120,24 L 121.2,32 L 122.5,138 Z"
            fill="rgba(0,0,0,0.5)"
            transform="translate(2, 3)"
          />
          <path
            d="M 117.5,138 L 119,30 L 120,22 L 121,30 L 122.5,138 Z"
            fill="#f8fafc"
          />
          <circle cx="120" cy="132" r="4.5" fill="#f8fafc" />
        </g>

        {/* Center Hub */}
        <circle cx="120" cy="120" r="10" fill="#29292d" stroke="#18181b" strokeWidth="2" />
        <circle cx="120" cy="120" r="4" fill="#52525b" />
      </svg>
    </div>
  );
};
