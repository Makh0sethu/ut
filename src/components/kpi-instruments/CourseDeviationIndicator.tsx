import React from 'react';
import { kpiTickLabel } from '../../utils/gaugeHelpers';

interface CdiProps {
  kpiUnit?: string;
  kpiMin?: number;
  kpiMax?: number;
  kpiGreenFrac?: number;
  kpiRedFrac?: number;
  kpiInverted?: boolean;
  localizer?: number; // -5 to +5 dots (left / right)
  glideSlope?: number; // -5 to +5 dots (up / down)
}

export const CourseDeviationIndicator: React.FC<CdiProps> = ({
  kpiUnit,
  kpiMin,
  kpiMax,
  kpiGreenFrac,
  kpiRedFrac,
  kpiInverted,
  localizer = 0,
  glideSlope = 0,
}) => {
  // Dot spacing: 8 pixels per dot
  const locX = Math.max(-5, Math.min(5, localizer)) * 8;
  const gsY = Math.max(-5, Math.min(5, glideSlope)) * 8;

  const dots = [-32, -24, -16, -8, 8, 16, 24, 32];

  // KPI mode: only the localizer (horizontal) axis actually carries the KPI's
  // value in FlightDashboardApp, so it doubles as the real min..max scale with
  // a threshold bar; the glideslope (vertical) needle stays centered/inert.
  const hasKpiThresholds = kpiGreenFrac !== undefined && kpiRedFrac !== undefined;
  const BAR_LEFT_X = 120 - 32;
  const BAR_RIGHT_X = 120 + 32;
  const xAtFrac = (frac: number) => BAR_LEFT_X + frac * (BAR_RIGHT_X - BAR_LEFT_X);
  const kpiGreenX = hasKpiThresholds ? xAtFrac(kpiGreenFrac!) : 0;
  const kpiRedX = hasKpiThresholds ? xAtFrac(kpiRedFrac!) : 0;
  const kpiMode = kpiMin !== undefined && kpiMax !== undefined;
  const minLabel = kpiMode ? kpiTickLabel(kpiMin!, kpiMax!, 0) : null;
  const midLabel = kpiMode ? kpiTickLabel(kpiMin!, kpiMax!, 0.5) : null;
  const maxLabel = kpiMode ? kpiTickLabel(kpiMin!, kpiMax!, 1) : null;

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg viewBox="0 0 240 240" className="w-full h-full select-none">
        {/* Dial Face */}
        <circle cx="120" cy="120" r="106" fill="#141416" />
        <circle cx="120" cy="120" r="105" fill="none" stroke="#262629" strokeWidth="2" />

        {/* Outer Reference Quadrant Notches */}
        <rect x="117" y="24" width="6" height="12" fill="#ffffff" rx="1" />
        <rect x="117" y="204" width="6" height="12" fill="#ffffff" rx="1" />
        <rect x="24" y="117" width="12" height="6" fill="#ffffff" rx="1" />
        <rect x="204" y="117" width="12" height="6" fill="#ffffff" rx="1" />

        {/* Top Yellow Pointer */}
        <polygon points="120,24 113,38 127,38" fill="#facc15" stroke="#a16207" strokeWidth="0.8" />

        {/* Localizer Horizontal Deviation Dots */}
        {dots.map((d) => (
          <circle key={`loc-${d}`} cx={120 + d} cy={120} r="2.4" fill="#f8fafc" opacity="0.9" />
        ))}

        {/* Glide Slope Vertical Deviation Dots */}
        {dots.map((d) => (
          <circle key={`gs-${d}`} cx={120} cy={120 + d} r="2.4" fill="#f8fafc" opacity="0.9" />
        ))}

        {/* Center Bullseye Ring (On localizer and on glideslope target) */}
        <circle cx="120" cy="120" r="4.5" fill="none" stroke="#facc15" strokeWidth="1.5" />

        {hasKpiThresholds && (
          <>
            {/* KPI threshold bar along the localizer axis: real red/amber/green zone */}
            {!kpiInverted ? (
              <>
                <line x1={BAR_LEFT_X} y1="132" x2={kpiRedX} y2="132" stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round" />
                <line x1={kpiRedX} y1="132" x2={kpiGreenX} y2="132" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" />
                <line x1={kpiGreenX} y1="132" x2={BAR_RIGHT_X} y2="132" stroke="#22c55e" strokeWidth="3.5" strokeLinecap="round" />
              </>
            ) : (
              <>
                <line x1={BAR_LEFT_X} y1="132" x2={kpiGreenX} y2="132" stroke="#22c55e" strokeWidth="3.5" strokeLinecap="round" />
                <line x1={kpiGreenX} y1="132" x2={kpiRedX} y2="132" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" />
                <line x1={kpiRedX} y1="132" x2={BAR_RIGHT_X} y2="132" stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round" />
              </>
            )}
            {/* Min / mid / max labels for the same scale */}
            <text x={BAR_LEFT_X} y="145" fill="#f8fafc" fontSize="7" fontWeight="700" fontFamily="Oswald, sans-serif" textAnchor="middle">{minLabel}</text>
            <text x="120" y="145" fill="#f8fafc" fontSize="7" fontWeight="700" fontFamily="Oswald, sans-serif" textAnchor="middle">{midLabel}</text>
            <text x={BAR_RIGHT_X} y="145" fill="#f8fafc" fontSize="7" fontWeight="700" fontFamily="Oswald, sans-serif" textAnchor="middle">{maxLabel}</text>
            {kpiUnit && (
              <text x="120" y="157" fill="#94a3b8" fontSize="6" fontWeight="600" letterSpacing="0.5" fontFamily="Chivo Mono, monospace" textAnchor="middle">
                {kpiUnit}
              </text>
            )}
          </>
        )}

        {/* Horizontal Glide Slope Needle (Moves Up / Down) */}
        <g transform={`translate(0, ${gsY})`}>
          <line
            x1="45"
            y1="120"
            x2="195"
            y2="120"
            stroke="#ffffff"
            strokeWidth="2.2"
            strokeDasharray="6,4"
            filter="drop-shadow(0 1px 2px rgba(0,0,0,0.6))"
          />
        </g>

        {/* Vertical Localizer Needle (Moves Left / Right) */}
        <g transform={`translate(${locX}, 0)`} style={{ transition: 'transform 0.6s ease-in-out' }}>
          <line
            x1="120"
            y1="45"
            x2="120"
            y2="195"
            stroke="#ffffff"
            strokeWidth="2.2"
            strokeDasharray="6,4"
            filter="drop-shadow(1px 0 2px rgba(0,0,0,0.6))"
          />
        </g>

        {/* Bottom Label: CDI */}
        <text
          x="120"
          y="188"
          fill="#cbd5e1"
          fontSize="9"
          fontWeight="700"
          letterSpacing="1.2"
          fontFamily="Chivo Mono, monospace"
          textAnchor="middle"
        >
          CDI
        </text>
      </svg>
    </div>
  );
};
