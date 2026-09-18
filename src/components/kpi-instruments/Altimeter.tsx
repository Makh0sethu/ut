import React from 'react';
import { KPI_TICK_FRACTIONS_FULL_SWEEP, kpiTickLabel } from '../../utils/gaugeHelpers';

interface AltimeterProps {
  kpiUnit?: string;
  kpiMin?: number;
  kpiMax?: number;
  kpiGreenFrac?: number;
  kpiRedFrac?: number;
  kpiInverted?: boolean;
  altitude: number; // feet (0 - 30,000)
  kollsmanPressure?: number; // in. Hg (e.g. 29.92)
}

export const Altimeter: React.FC<AltimeterProps> = ({ kpiUnit, kpiMin, kpiMax, kpiGreenFrac, kpiRedFrac, kpiInverted,
  altitude,
  kollsmanPressure = 29.92,
}) => {
  // Pressure altitude adjustment:
  // (kollsman - 29.92) * 1000 ft
  const effectiveAlt = Math.max(0, altitude + (kollsmanPressure - 29.92) * 1000);

  // 100s hand: 360° per 1,000 ft
  const hundredAngle = ((effectiveAlt % 1000) / 1000) * 360;

  // 1,000s hand: 360° per 10,000 ft
  const thousandAngle = ((effectiveAlt % 10000) / 10000) * 360;

  // 10,000s hand: 360° per 100,000 ft
  const tenThousandAngle = (effectiveAlt / 100000) * 360;

  const polarToCart = (cx: number, cy: number, r: number, angleDeg: number) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  };

  const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCart(x, y, radius, endAngle);
    const end = polarToCart(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(' ');
  };

  // KPI mode: a red/amber/green arc positioned at this KPI's real thresholds
  // (Altimeter has no native warning band to repurpose, so this is added fresh).
  const hasKpiThresholds = kpiGreenFrac !== undefined && kpiRedFrac !== undefined;
  const greenAngle = hasKpiThresholds ? kpiGreenFrac! * 360 : 0;
  const redAngle = hasKpiThresholds ? kpiRedFrac! * 360 : 0;

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg viewBox="0 0 240 240" className="w-full h-full select-none">
        {/* Dial Face */}
        <circle cx="120" cy="120" r="106" fill="#141416" />
        <circle cx="120" cy="120" r="105" fill="none" stroke="#262629" strokeWidth="2" />

        {hasKpiThresholds && (
          <>
            {/* KPI threshold arc: red/amber/green ordered by this KPI's own thresholds */}
            {!kpiInverted ? (
              <>
                {redAngle > 0 && <path d={describeArc(120, 120, 80, 0, redAngle)} fill="none" stroke="#ef4444" strokeWidth="4" strokeLinecap="butt" />}
                {greenAngle > redAngle && <path d={describeArc(120, 120, 80, redAngle, greenAngle)} fill="none" stroke="#f59e0b" strokeWidth="4" strokeLinecap="butt" />}
                {360 > greenAngle && <path d={describeArc(120, 120, 80, greenAngle, 360)} fill="none" stroke="#22c55e" strokeWidth="4" strokeLinecap="butt" />}
              </>
            ) : (
              <>
                {greenAngle > 0 && <path d={describeArc(120, 120, 80, 0, greenAngle)} fill="none" stroke="#22c55e" strokeWidth="4" strokeLinecap="butt" />}
                {redAngle > greenAngle && <path d={describeArc(120, 120, 80, greenAngle, redAngle)} fill="none" stroke="#f59e0b" strokeWidth="4" strokeLinecap="butt" />}
                {360 > redAngle && <path d={describeArc(120, 120, 80, redAngle, 360)} fill="none" stroke="#ef4444" strokeWidth="4" strokeLinecap="butt" />}
              </>
            )}
          </>
        )}

        {/* 10,000 ft Barber Pole Warning Wedge (visible when below 10,000 ft, non-KPI mode only) */}
        {!hasKpiThresholds && effectiveAlt < 10000 && (
          <g transform="translate(120, 120)">
            <path
              d="M 0,0 L -25,-35 A 45,45 0 0,1 25,-35 Z"
              fill="url(#striped-barber)"
            />
          </g>
        )}

        <defs>
          <pattern id="striped-barber" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="8" stroke="#f8fafc" strokeWidth="3" />
            <line x1="4" y1="0" x2="4" y2="8" stroke="#18181b" strokeWidth="5" />
          </pattern>
        </defs>

        {/* Kollsman Window (Right side barometric pressure readout, non-KPI mode only) */}
        {!hasKpiThresholds && <g transform="translate(162, 120)">
          {/* Beveled cutout */}
          <rect x="-18" y="-12" width="36" height="24" rx="2" fill="#09090b" stroke="#3f3f46" strokeWidth="1.2" />
          <text
            x="0"
            y="-1"
            fill="#f8fafc"
            fontSize="9"
            fontWeight="700"
            fontFamily="Share Tech Mono, monospace"
            textAnchor="middle"
            dominantBaseline="central"
          >
            {kollsmanPressure.toFixed(2)}
          </text>
          <text
            x="0"
            y="7"
            fill="#a1a1aa"
            fontSize="5.5"
            fontWeight="600"
            fontFamily="Chivo Mono, monospace"
            textAnchor="middle"
          >
            IN. HG
          </text>
        </g>}

        {/* Minor Ticks (Every 20 ft, 50 ticks total) */}
        {Array.from({ length: 50 }).map((_, i) => {
          const angle = (i / 50) * 360;
          const isMedium = i % 5 === 0;
          if (isMedium) return null; // handled by major/medium
          const p1 = polarToCart(120, 120, 92, angle);
          const p2 = polarToCart(120, 120, 96, angle);
          return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#94a3b8" strokeWidth="1" />;
        })}

        {/* Medium Ticks (Every 50 ft) */}
        {Array.from({ length: 10 }).map((_, i) => {
          const angle = (i * 36) + 18;
          const p1 = polarToCart(120, 120, 89, angle);
          const p2 = polarToCart(120, 120, 97, angle);
          return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#cbd5e1" strokeWidth="1.8" />;
        })}

        {/* Major Ticks & Digits: KPI mode shows 5 clean ticks (min..max) spanning
            the full 360° sweep so the true min/max are always readable, instead
            of the native 10-digit drum ring (which never reaches the real max). */}
        {kpiMin !== undefined && kpiMax !== undefined
          ? KPI_TICK_FRACTIONS_FULL_SWEEP.map((frac) => {
              const angle = frac * 360;
              const p1 = polarToCart(120, 120, 85, angle);
              const p2 = polarToCart(120, 120, 98, angle);
              const pText = polarToCart(120, 120, 72, angle);
              const labelText = kpiTickLabel(kpiMin, kpiMax, frac);
              return (
                <g key={frac}>
                  <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#f8fafc" strokeWidth="2.5" />
                  <text
                    x={pText.x}
                    y={pText.y}
                    fill="#f8fafc"
                    fontSize="15"
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
          : digits.map((num) => {
              const angle = num * 36;
              const p1 = polarToCart(120, 120, 85, angle);
              const p2 = polarToCart(120, 120, 98, angle);
              const pText = polarToCart(120, 120, 72, angle);
              return (
                <g key={num}>
                  <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#f8fafc" strokeWidth="2.5" />
                  <text
                    x={pText.x}
                    y={pText.y}
                    fill="#f8fafc"
                    fontSize="15"
                    fontWeight="700"
                    fontFamily="Oswald, sans-serif"
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    {num}
                  </text>
                </g>
              );
            })}

        {/* Counter Drum Window (Thousands & Ten-Thousands readout for single-hand drum altimeter, non-KPI mode only) */}
        {!hasKpiThresholds && (
          <g transform="translate(120, 100)">
            <rect x="-26" y="-8" width="52" height="15" rx="2" fill="#09090b" stroke="#3f3f46" strokeWidth="1.2" />
            <text
              x="0"
              y="2.5"
              fill="#f8fafc"
              fontSize="8.5"
              fontWeight="700"
              fontFamily="Share Tech Mono, monospace"
              textAnchor="middle"
            >
              {Math.floor(effectiveAlt).toLocaleString().padStart(6, ' ') + " FT"}
            </text>
          </g>
        )}

        {/* Dial Center Labels */}
        <text
          x="120"
          y="68"
          fill="#cbd5e1"
          fontSize="9.5"
          fontWeight="600"
          letterSpacing="0.8"
          fontFamily="Chivo Mono, monospace"
          textAnchor="middle"
        >
          {kpiMin === undefined ? "ALTIMETER" : ""}
        </text>
        <text
          x="120"
          y="158"
          fill="#94a3b8"
          fontSize="8"
          fontWeight="600"
          letterSpacing="0.8"
          fontFamily="Chivo Mono, monospace"
          textAnchor="middle"
        >
          {kpiUnit || "FEET"}
        </text>

        {/* Single Primary 100-Ft Pointer Hand (At most one movable visible hand) */}
        <g transform={`rotate(${hundredAngle}, 120, 120)`} style={{ transition: 'transform 0.6s ease-in-out' }}>
          {/* Shadow */}
          <path
            d="M 118,142 L 118.8,32 L 120,24 L 121.2,32 L 122,142 Z"
            fill="rgba(0,0,0,0.5)"
            transform="translate(2, 3)"
          />
          {/* Needle */}
          <path
            d="M 118,142 L 119,30 L 120,22 L 121,30 L 122,142 Z"
            fill="#f8fafc"
          />
          <circle cx="120" cy="136" r="4.5" fill="#f8fafc" />
        </g>

        {/* Center Hub */}
        <circle cx="120" cy="120" r="10" fill="#29292d" stroke="#18181b" strokeWidth="2" />
        <circle cx="120" cy="120" r="4" fill="#52525b" />

        {/* Calibration Knob in lower left */}
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
