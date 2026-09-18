import React from 'react';
import { KPI_TICK_FRACTIONS, kpiTickLabel } from '../../utils/gaugeHelpers';

interface TachProps {
  kpiUnit?: string;
  kpiMin?: number;
  kpiMax?: number;
  kpiGreenFrac?: number;
  kpiRedFrac?: number;
  kpiInverted?: boolean;
  rpm: number; // 0 to 3500
  hobbsHours?: number; // cumulative engine hours e.g. 1248.3
}

export const Tachometer: React.FC<TachProps> = ({ kpiUnit, kpiMin, kpiMax, kpiGreenFrac, kpiRedFrac, kpiInverted,
  rpm,
  hobbsHours = 1248.3,
}) => {
  // Angle conversion:
  // 0 RPM = -140° (approx 7:30)
  // 500 RPM (5) = -105°
  // 1000 RPM (10) = -70°
  // 1500 RPM (15) = -35°
  // 2000 RPM (20) = 0° (12 o'clock)
  // 2500 RPM (25) = 35°
  // 3000 RPM (30) = 70°
  // 3500 RPM (35) = 105°
  // Total span = 245° for 3500 RPM (7° per 100 RPM)
  const getRpmAngle = (r: number) => {
    const clamped = Math.max(0, Math.min(3500, r));
    return -140 + (clamped / 100) * 7;
  };

  const needleAngle = getRpmAngle(rpm);

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

  const greenStart = getRpmAngle(2100);
  const greenEnd = getRpmAngle(2700);
  const yellowStart = getRpmAngle(2700);
  const yellowEnd = getRpmAngle(2900);
  const redAngle = getRpmAngle(2900);

  const majorMarks = [5, 10, 15, 20, 25, 30, 35];

  // KPI mode: replace the native 2100-2900 RPM warning band with a 3-segment
  // arc positioned at this KPI's real green/red thresholds.
  const hasKpiThresholds = kpiGreenFrac !== undefined && kpiRedFrac !== undefined;
  const startAngle = getRpmAngle(0);
  const endAngle = getRpmAngle(3500);
  const kpiGreenAngle = hasKpiThresholds ? getRpmAngle(kpiGreenFrac! * 3500) : 0;
  const kpiRedAngle = hasKpiThresholds ? getRpmAngle(kpiRedFrac! * 3500) : 0;

  // Format Hobbs hours e.g. "01248.3"
  const formattedHobbs = hobbsHours.toFixed(1).padStart(7, '0');

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

            {/* Yellow Caution Arc */}
            <path
              d={describeArc(120, 120, 84, yellowStart, yellowEnd)}
              fill="none"
              stroke="#eab308"
              strokeWidth="5"
              strokeLinecap="butt"
            />

            {/* Red Line at 2900 RPM */}
            {(() => {
              const p1 = polarToCart(120, 120, 78, redAngle);
              const p2 = polarToCart(120, 120, 94, redAngle);
              return <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#ef4444" strokeWidth="3" />;
            })()}
          </>
        )}

        {/* Minor Ticks (Every 100 RPM) */}
        {Array.from({ length: 36 }).map((_, i) => {
          const val = i * 100;
          const is500 = val % 500 === 0;
          if (is500) return null;
          const angle = getRpmAngle(val);
          const p1 = polarToCart(120, 120, 89, angle);
          const p2 = polarToCart(120, 120, 95, angle);
          return (
            <line
              key={val}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke="#94a3b8"
              strokeWidth="1.2"
            />
          );
        })}

        {/* Major Ticks & Numbers: KPI mode shows 5 clean ticks (min..max) spanning
            the full needle sweep (0-3500 native), instead of the native 7-tick
            scale (500-3500) whose spacing doesn't divide most KPI ranges evenly. */}
        {kpiMin !== undefined && kpiMax !== undefined
          ? KPI_TICK_FRACTIONS.map((frac) => {
              const angle = getRpmAngle(frac * 3500);
              const p1 = polarToCart(120, 120, 83, angle);
              const p2 = polarToCart(120, 120, 96, angle);
              const pText = polarToCart(120, 120, 70, angle);
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
              const angle = getRpmAngle(m * 100);
              const p1 = polarToCart(120, 120, 83, angle);
              const p2 = polarToCart(120, 120, 96, angle);
              const pText = polarToCart(120, 120, 70, angle);
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
          y="78"
          fill="#cbd5e1"
          fontSize="9"
          fontWeight="700"
          letterSpacing="1"
          fontFamily="Chivo Mono, monospace"
          textAnchor="middle"
        >
          {kpiUnit || "RPM"}
        </text>

        {/* Hobbs Meter Window in lower quadrant */}
        <g transform="translate(120, 156)">
          <rect x="-26" y="-7" width="52" height="14" rx="1.5" fill="#09090b" stroke="#3f3f46" strokeWidth="1" />
          <text
            x="0"
            y="3"
            fill="#f8fafc"
            fontSize="8"
            fontWeight="700"
            fontFamily="Share Tech Mono"
            textAnchor="middle"
          >
            {formattedHobbs}
          </text>
        </g>
        {kpiMin === undefined && (
          <text
            x="120"
            y="178"
            fill="#94a3b8"
            fontSize="6.5"
            fontWeight="600"
            letterSpacing="0.8"
            fontFamily="Chivo Mono, monospace"
            textAnchor="middle"
          >
            HUNDREDS
          </text>
        )}

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
