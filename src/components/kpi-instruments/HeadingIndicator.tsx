import React from 'react';
import { KPI_TICK_FRACTIONS_FULL_SWEEP, kpiTickLabel } from '../../utils/gaugeHelpers';

interface HeadingProps {
  kpiUnit?: string;
  kpiMin?: number;
  kpiMax?: number;
  kpiGreenFrac?: number;
  kpiRedFrac?: number;
  kpiInverted?: boolean;
  heading: number; // degrees (0 - 359.9)
  headingBug?: number; // degrees (0 - 359)
}

export const HeadingIndicator: React.FC<HeadingProps> = ({
  kpiUnit,
  kpiMin,
  kpiMax,
  kpiGreenFrac,
  kpiRedFrac,
  kpiInverted,
  heading,
  headingBug = 0,
}) => {
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

  // KPI mode: the compass card's N/E/S/W rose is meaningless for a KPI, so it's
  // replaced with 5 real min..max ticks (same collision-safe spacing as the
  // Altimeter's full-360 drum), and the fixed center airplane now represents
  // "current reading" — the card rotates to bring that value to 12 o'clock,
  // under the plane, exactly like a real heading indicator brings the flown
  // heading under the lubber line.
  const kpiMode = kpiMin !== undefined && kpiMax !== undefined;
  const hasKpiThresholds = kpiGreenFrac !== undefined && kpiRedFrac !== undefined;
  const kpiGreenAngle = hasKpiThresholds ? kpiGreenFrac! * 360 : 0;
  const kpiRedAngle = hasKpiThresholds ? kpiRedFrac! * 360 : 0;

  const headings = kpiMode
    ? KPI_TICK_FRACTIONS_FULL_SWEEP.map((frac) => ({
        deg: frac * 360,
        label: kpiTickLabel(kpiMin!, kpiMax!, frac),
        isMajor: frac === 0,
      }))
    : [
        { deg: 0, label: 'N', isMajor: true },
        { deg: 30, label: '3', isMajor: false },
        { deg: 60, label: '6', isMajor: false },
        { deg: 90, label: 'E', isMajor: true },
        { deg: 120, label: '12', isMajor: false },
        { deg: 150, label: '15', isMajor: false },
        { deg: 180, label: 'S', isMajor: true },
        { deg: 210, label: '21', isMajor: false },
        { deg: 240, label: '24', isMajor: false },
        { deg: 270, label: 'W', isMajor: true },
        { deg: 300, label: '30', isMajor: false },
        { deg: 330, label: '33', isMajor: false },
      ];

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg viewBox="0 0 240 240" className="w-full h-full select-none">
        {/* Dial Face Background */}
        <circle cx="120" cy="120" r="106" fill="#141416" />
        <circle cx="120" cy="120" r="105" fill="none" stroke="#262629" strokeWidth="2" />

        {/* Rotating Compass Rose / Card (Rotates opposite to aircraft heading) */}
        <g transform={`rotate(${-heading}, 120, 120)`}>
          {/* Compass ring circle */}
          <circle cx="120" cy="120" r="95" fill="none" stroke="#334155" strokeWidth="1" />

          {hasKpiThresholds && (
            <>
              {/* KPI threshold arc: real red/amber/green zone, fixed to the card
                  so it stays put as the card rotates the current reading to the top */}
              {!kpiInverted ? (
                <>
                  <path d={describeArc(120, 120, 90, 0, kpiRedAngle)} fill="none" stroke="#ef4444" strokeWidth="5" strokeLinecap="butt" />
                  <path d={describeArc(120, 120, 90, kpiRedAngle, kpiGreenAngle)} fill="none" stroke="#f59e0b" strokeWidth="5" strokeLinecap="butt" />
                  <path d={describeArc(120, 120, 90, kpiGreenAngle, 360)} fill="none" stroke="#22c55e" strokeWidth="5" strokeLinecap="butt" />
                </>
              ) : (
                <>
                  <path d={describeArc(120, 120, 90, 0, kpiGreenAngle)} fill="none" stroke="#22c55e" strokeWidth="5" strokeLinecap="butt" />
                  <path d={describeArc(120, 120, 90, kpiGreenAngle, kpiRedAngle)} fill="none" stroke="#f59e0b" strokeWidth="5" strokeLinecap="butt" />
                  <path d={describeArc(120, 120, 90, kpiRedAngle, 360)} fill="none" stroke="#ef4444" strokeWidth="5" strokeLinecap="butt" />
                </>
              )}
            </>
          )}

          {/* Minor 5-degree and 10-degree Ticks */}
          {Array.from({ length: 72 }).map((_, i) => {
            const angle = i * 5;
            const is10 = angle % 10 === 0;
            const is30 = angle % 30 === 0;
            if (is30) return null; // handled by major
            const p1 = polarToCart(120, 120, is10 ? 84 : 88, angle);
            const p2 = polarToCart(120, 120, 95, angle);
            return (
              <line
                key={angle}
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke={is10 ? '#cbd5e1' : '#94a3b8'}
                strokeWidth={is10 ? 1.5 : 1}
              />
            );
          })}

          {/* Major Ticks and Heading Numbers / Letters */}
          {headings.map((h) => {
            const p1 = polarToCart(120, 120, 80, h.deg);
            const p2 = polarToCart(120, 120, 96, h.deg);
            const pText = polarToCart(120, 120, 68, h.deg);
            return (
              <g key={h.deg}>
                <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#f8fafc" strokeWidth="2.2" />
                <text
                  x={pText.x}
                  y={pText.y}
                  fill={h.isMajor ? '#f59e0b' : '#f8fafc'}
                  fontSize={h.isMajor ? '15' : '13'}
                  fontWeight="700"
                  fontFamily="Oswald, sans-serif"
                  textAnchor="middle"
                  dominantBaseline="central"
                  transform={`rotate(${h.deg}, ${pText.x}, ${pText.y})`}
                >
                  {h.label}
                </text>
              </g>
            );
          })}

          {/* Heading Bug (Orange Notch) */}
          <g transform={`rotate(${headingBug}, 120, 120)`}>
            <polygon points="120,23 116,33 124,33" fill="#f97316" stroke="#c2410c" strokeWidth="0.8" />
          </g>
        </g>

        {/* Top Fixed Orange Pointer Index at 12 o'clock */}
        <polygon points="120,20 114,32 126,32" fill="#f97316" stroke="#c2410c" strokeWidth="1" />

        {/* 4 Fixed Reference Ticks at 90 deg quadrants (Bank references) */}
        <line x1="120" y1="21" x2="120" y2="28" stroke="#ffffff" strokeWidth="2" />
        <line x1="219" y1="120" x2="212" y2="120" stroke="#ffffff" strokeWidth="2" />
        <line x1="120" y1="219" x2="120" y2="212" stroke="#ffffff" strokeWidth="2" />
        <line x1="21" y1="120" x2="28" y2="120" stroke="#ffffff" strokeWidth="2" />
        {/* 45 degree ticks */}
        <line x1="190" y1="50" x2="185" y2="55" stroke="#94a3b8" strokeWidth="1.5" />
        <line x1="50" y1="50" x2="55" y2="55" stroke="#94a3b8" strokeWidth="1.5" />
        <line x1="190" y1="190" x2="185" y2="185" stroke="#94a3b8" strokeWidth="1.5" />
        <line x1="50" y1="190" x2="55" y2="185" stroke="#94a3b8" strokeWidth="1.5" />

        {/* Fixed Center Airplane Silhouette (White outline aircraft pointing forward) */}
        <g id="center-airplane" filter="drop-shadow(0px 1px 2px rgba(0,0,0,0.8))">
          {/* Fuselage & Nose */}
          <path
            d="M 120,68 L 122.5,90 L 123,148 L 126,155 L 126,162 L 120,158 L 114,162 L 114,155 L 117,148 L 117.5,90 Z"
            fill="#1e293b"
            stroke="#f8fafc"
            strokeWidth="1.8"
          />
          {/* Wings */}
          <path
            d="M 82,106 L 120,96 L 158,106 L 158,112 L 123,105 L 117,105 L 82,112 Z"
            fill="#1e293b"
            stroke="#f8fafc"
            strokeWidth="1.8"
          />
          {/* Horizontal Stabilizer Tail */}
          <path
            d="M 102,156 L 120,150 L 138,156 L 138,160 L 120,156 L 102,160 Z"
            fill="#1e293b"
            stroke="#f8fafc"
            strokeWidth="1.8"
          />
          {/* Center reference dot */}
          <circle cx="120" cy="110" r="2.5" fill="#f8fafc" />
        </g>

        {kpiUnit && (
          <text x="120" y="183" fill="#94a3b8" fontSize="7" fontWeight="600" letterSpacing="0.6" fontFamily="Chivo Mono, monospace" textAnchor="middle">
            {kpiUnit}
          </text>
        )}

        {/* Gyro Sync / Push-to-Cage Knob at lower left */}
        <g transform="translate(42, 198)">
          <circle cx="0" cy="0" r="14" fill="#262626" stroke="#404040" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="11" fill="#171717" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <line
              key={a}
              x1={Math.cos((a * Math.PI) / 180) * 11}
              y1={Math.sin((a * Math.PI) / 180) * 11}
              x2={Math.cos((a * Math.PI) / 180) * 14}
              y2={Math.sin((a * Math.PI) / 180) * 14}
              stroke="#525252"
              strokeWidth="1.2"
            />
          ))}
          <circle cx="0" cy="0" r="4" fill="#737373" />
        </g>
      </svg>
    </div>
  );
};
