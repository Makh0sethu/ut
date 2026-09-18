import React from 'react';
import { kpiTickLabel } from '../../utils/gaugeHelpers';

interface VorProps {
  kpiUnit?: string;
  kpiMin?: number;
  kpiMax?: number;
  kpiGreenFrac?: number;
  kpiRedFrac?: number;
  kpiInverted?: boolean;
  obsHeading?: number; // 0 - 359
  deviation?: number; // -5 to +5 dots (left / right)
  toFrom?: 'TO' | 'FROM' | 'NAV';
}

export const VorIndicator: React.FC<VorProps> = ({
  kpiUnit,
  kpiMin,
  kpiMax,
  kpiGreenFrac,
  kpiRedFrac,
  kpiInverted,
  obsHeading = 360,
  deviation = 0,
  toFrom = 'TO',
}) => {
  const polarToCart = (cx: number, cy: number, r: number, angleDeg: number) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  };

  // Needle displacement: each dot is ~6 pixels
  const cdiOffset = Math.max(-5, Math.min(5, deviation)) * 6.5;

  // KPI mode: the deviation dot row (-5..+5, same axis the CDI needle rides)
  // doubles as this KPI's real min..max scale, with a threshold bar beneath it.
  const hasKpiThresholds = kpiGreenFrac !== undefined && kpiRedFrac !== undefined;
  const BAR_LEFT_X = 120 - 32.5;
  const BAR_RIGHT_X = 120 + 32.5;
  const xAtFrac = (frac: number) => BAR_LEFT_X + frac * (BAR_RIGHT_X - BAR_LEFT_X);
  const kpiGreenX = hasKpiThresholds ? xAtFrac(kpiGreenFrac!) : 0;
  const kpiRedX = hasKpiThresholds ? xAtFrac(kpiRedFrac!) : 0;
  const kpiMode = kpiMin !== undefined && kpiMax !== undefined;
  const minLabel = kpiMode ? kpiTickLabel(kpiMin!, kpiMax!, 0) : null;
  const midLabel = kpiMode ? kpiTickLabel(kpiMin!, kpiMax!, 0.5) : null;
  const maxLabel = kpiMode ? kpiTickLabel(kpiMin!, kpiMax!, 1) : null;

  const headings = [
    { deg: 0, label: '36' },
    { deg: 30, label: '3' },
    { deg: 60, label: '6' },
    { deg: 90, label: '9' },
    { deg: 120, label: '12' },
    { deg: 150, label: '15' },
    { deg: 180, label: '18' },
    { deg: 210, label: '21' },
    { deg: 240, label: '24' },
    { deg: 270, label: '27' },
    { deg: 300, label: '30' },
    { deg: 330, label: '33' },
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg viewBox="0 0 240 240" className="w-full h-full select-none">
        {/* Dial Face */}
        <circle cx="120" cy="120" r="106" fill="#141416" />
        <circle cx="120" cy="120" r="105" fill="none" stroke="#262629" strokeWidth="2" />

        {/* Rotating Compass Ring (Driven by OBS knob) */}
        <g transform={`rotate(${-obsHeading}, 120, 120)`}>
          {/* Compass ring circle */}
          <circle cx="120" cy="120" r="95" fill="none" stroke="#334155" strokeWidth="1" />

          {/* 5-degree Minor Ticks */}
          {Array.from({ length: 72 }).map((_, i) => {
            const angle = i * 5;
            const is10 = angle % 10 === 0;
            const is30 = angle % 30 === 0;
            if (is30) return null;
            const p1 = polarToCart(120, 120, is10 ? 86 : 89, angle);
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

          {/* Major 30-degree Ticks and Labels */}
          {headings.map((h) => {
            const p1 = polarToCart(120, 120, 82, h.deg);
            const p2 = polarToCart(120, 120, 96, h.deg);
            const pText = polarToCart(120, 120, 71, h.deg);
            return (
              <g key={h.deg}>
                <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#f8fafc" strokeWidth="2.2" />
                <text
                  x={pText.x}
                  y={pText.y}
                  fill="#f8fafc"
                  fontSize="12.5"
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
        </g>

        {/* Top Fixed Yellow Index Pointer */}
        <polygon points="120,20 114,32 126,32" fill="#facc15" stroke="#a16207" strokeWidth="0.8" />
        {/* Bottom Reciprocal Index Pointer */}
        <polygon points="120,220 115,209 125,209" fill="#94a3b8" />

        {/* Inner Dial Mask / Display */}
        <circle cx="120" cy="120" r="58" fill="#121214" stroke="#27272a" strokeWidth="1.2" />

        {/* 5 Course Deviation Dots on each side */}
        {[-32.5, -26, -19.5, -13, -6.5, 6.5, 13, 19.5, 26, 32.5].map((x) => (
          <circle key={x} cx={120 + x} cy={120} r="1.8" fill="#cbd5e1" />
        ))}
        {/* Center Target Ring */}
        <circle cx="120" cy="120" r="3.2" fill="none" stroke="#f8fafc" strokeWidth="1.2" />

        {hasKpiThresholds && (
          <>
            {/* KPI threshold bar beneath the deviation dots: real red/amber/green zone */}
            {!kpiInverted ? (
              <>
                <line x1={BAR_LEFT_X} y1="134" x2={kpiRedX} y2="134" stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round" />
                <line x1={kpiRedX} y1="134" x2={kpiGreenX} y2="134" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" />
                <line x1={kpiGreenX} y1="134" x2={BAR_RIGHT_X} y2="134" stroke="#22c55e" strokeWidth="3.5" strokeLinecap="round" />
              </>
            ) : (
              <>
                <line x1={BAR_LEFT_X} y1="134" x2={kpiGreenX} y2="134" stroke="#22c55e" strokeWidth="3.5" strokeLinecap="round" />
                <line x1={kpiGreenX} y1="134" x2={kpiRedX} y2="134" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" />
                <line x1={kpiRedX} y1="134" x2={BAR_RIGHT_X} y2="134" stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round" />
              </>
            )}
            {/* Min / mid / max labels for the same scale */}
            <text x={BAR_LEFT_X} y="146" fill="#f8fafc" fontSize="7" fontWeight="700" fontFamily="Oswald, sans-serif" textAnchor="middle">{minLabel}</text>
            <text x="120" y="146" fill="#f8fafc" fontSize="7" fontWeight="700" fontFamily="Oswald, sans-serif" textAnchor="middle">{midLabel}</text>
            <text x={BAR_RIGHT_X} y="146" fill="#f8fafc" fontSize="7" fontWeight="700" fontFamily="Oswald, sans-serif" textAnchor="middle">{maxLabel}</text>
            {kpiUnit && (
              <text x="120" y="158" fill="#94a3b8" fontSize="6" fontWeight="600" letterSpacing="0.5" fontFamily="Chivo Mono, monospace" textAnchor="middle">
                {kpiUnit}
              </text>
            )}
          </>
        )}

        {/* TO / FROM Flags */}
        <g transform="translate(120, 96)">
          {toFrom === 'TO' && (
            <polygon points="0,-8 -7,4 7,4" fill="#22c55e" stroke="#15803d" strokeWidth="0.8" />
          )}
          {toFrom === 'FROM' && (
            <polygon points="0,8 -7,-4 7,-4" fill="#eab308" stroke="#a16207" strokeWidth="0.8" />
          )}
          {toFrom === 'NAV' && (
            <rect x="-14" y="-5" width="28" height="10" fill="#ef4444" rx="1" />
          )}
        </g>
        <text x="96" y="100" fill="#94a3b8" fontSize="8" fontWeight="700" fontFamily="Chivo Mono">
          TO
        </text>
        <text x="136" y="100" fill="#94a3b8" fontSize="8" fontWeight="700" fontFamily="Chivo Mono">
          FR
        </text>

        {/* Vertical Course Deviation Needle (CDI) */}
        <g transform={`translate(${cdiOffset}, 0)`} style={{ transition: 'transform 0.6s ease-in-out' }}>
          {/* Shadow */}
          <line x1="121" y1="64" x2="121" y2="176" stroke="rgba(0,0,0,0.6)" strokeWidth="2.5" />
          {/* Needle */}
          <line x1="120" y1="62" x2="120" y2="178" stroke="#ffffff" strokeWidth="2.4" />
        </g>

        {/* Fixed Horizontal Center Reference Bar */}
        <line x1="72" y1="120" x2="168" y2="120" stroke="#475569" strokeWidth="1" strokeDasharray="2,4" />

        {/* OBS Knob at bottom right */}
        <g transform="translate(196, 198)">
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
          <text
            x="0"
            y="2.5"
            fill="#ffffff"
            fontSize="6.5"
            fontWeight="700"
            fontFamily="Chivo Mono"
            textAnchor="middle"
          >
            OBS
          </text>
        </g>
      </svg>
    </div>
  );
};
