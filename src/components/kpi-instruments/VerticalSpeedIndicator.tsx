import React from 'react';

interface VsiProps {
  kpiUnit?: string;
  kpiMin?: number;
  kpiMax?: number;
  kpiGreenFrac?: number;
  kpiRedFrac?: number;
  kpiInverted?: boolean;
  vsi: number; // feet per minute (-2000 to +2000)
}

export const VerticalSpeedIndicator: React.FC<VsiProps> = ({ kpiUnit, kpiMin, kpiMax, kpiGreenFrac, kpiRedFrac, kpiInverted, vsi }) => {
  // Maps a native fpm tick value (-2000..+2000) onto the KPI's real min-max range,
  // matching how the needle itself is driven: vsi = kpiMin's range midpoint at 0 fpm.
  const relabel = (fpm: number) => {
    if (kpiMax === undefined || kpiMin === undefined) return null;
    const fraction = (fpm + 2000) / 4000;
    return Math.round(kpiMin + fraction * (kpiMax - kpiMin)).toString();
  };
  // Angle conversion:
  // 0 fpm = -90° (9 o'clock)
  // +500 fpm (5) = -45°
  // +1000 fpm (10) = 0° (12 o'clock)
  // +1500 fpm (15) = +45°
  // +2000 fpm (20) = +80°
  // -500 fpm (5 down) = -135°
  // -1000 fpm (10 down) = 180° (6 o'clock)
  // -1500 fpm (15 down) = -225° / +135°
  // -2000 fpm (20 down) = -260° / +100°

  const getVsiAngle = (fpm: number) => {
    const clamped = Math.max(-2000, Math.min(2000, fpm));
    // Linear / slightly expanded initial response
    // 0 -> -90 deg
    // 1000 fpm -> 90 deg change = 0.09 deg per fpm
    // 2000 fpm -> 170 deg change = 0.085 deg per fpm
    return -90 + (clamped / 1000) * 85;
  };

  const needleAngle = getVsiAngle(vsi);

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

  // KPI mode: a red/amber/green arc positioned at this KPI's real thresholds,
  // drawn across the same -2000..+2000 fpm sweep the needle itself uses.
  const hasKpiThresholds = kpiGreenFrac !== undefined && kpiRedFrac !== undefined;
  const vsiStartAngle = getVsiAngle(-2000);
  const vsiEndAngle = getVsiAngle(2000);
  const kpiGreenAngle = hasKpiThresholds ? getVsiAngle(-2000 + kpiGreenFrac! * 4000) : 0;
  const kpiRedAngle = hasKpiThresholds ? getVsiAngle(-2000 + kpiRedFrac! * 4000) : 0;

  const upMarks = [
    { val: 0, text: '0', angle: -90 },
    { val: 500, text: '5', angle: -47.5 },
    { val: 1000, text: '10', angle: -5 },
    { val: 1500, text: '15', angle: 37.5 },
    { val: 2000, text: '20', angle: 80 },
  ];

  const downMarks = [
    { val: -500, text: '5', angle: -132.5 },
    { val: -1000, text: '10', angle: -175 },
    { val: -1500, text: '15', angle: -217.5 },
    { val: -2000, text: '20', angle: -260 },
  ];

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
                <path d={describeArc(120, 120, 84, vsiStartAngle, kpiRedAngle)} fill="none" stroke="#ef4444" strokeWidth="5" strokeLinecap="butt" />
                <path d={describeArc(120, 120, 84, kpiRedAngle, kpiGreenAngle)} fill="none" stroke="#f59e0b" strokeWidth="5" strokeLinecap="butt" />
                <path d={describeArc(120, 120, 84, kpiGreenAngle, vsiEndAngle)} fill="none" stroke="#22c55e" strokeWidth="5" strokeLinecap="butt" />
              </>
            ) : (
              <>
                <path d={describeArc(120, 120, 84, vsiStartAngle, kpiGreenAngle)} fill="none" stroke="#22c55e" strokeWidth="5" strokeLinecap="butt" />
                <path d={describeArc(120, 120, 84, kpiGreenAngle, kpiRedAngle)} fill="none" stroke="#f59e0b" strokeWidth="5" strokeLinecap="butt" />
                <path d={describeArc(120, 120, 84, kpiRedAngle, vsiEndAngle)} fill="none" stroke="#ef4444" strokeWidth="5" strokeLinecap="butt" />
              </>
            )}
          </>
        )}

        {/* Up / Down Arc labels */}
        <text x="75" y="98" fill="#94a3b8" fontSize="8" fontWeight="700" fontFamily="Chivo Mono" textAnchor="middle">
          UP
        </text>
        <text x="75" y="148" fill="#94a3b8" fontSize="8" fontWeight="700" fontFamily="Chivo Mono" textAnchor="middle">
          DOWN
        </text>

        {/* Minor Ticks */}
        {[-1800, -1600, -1400, -1200, -800, -600, -400, -200, 200, 400, 600, 800, 1200, 1400, 1600, 1800].map((fpm) => {
          const angle = getVsiAngle(fpm);
          const p1 = polarToCart(120, 120, 88, angle);
          const p2 = polarToCart(120, 120, 95, angle);
          return <line key={fpm} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#94a3b8" strokeWidth="1.2" />;
        })}

        {/* Major Ticks & Numbers (UP) */}
        {upMarks.map((m) => {
          const p1 = polarToCart(120, 120, 83, m.angle);
          const p2 = polarToCart(120, 120, 96, m.angle);
          const pText = polarToCart(120, 120, 71, m.angle);
          return (
            <g key={`up-${m.val}`}>
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
              >
                {relabel(m.val) ?? m.text}
              </text>
            </g>
          );
        })}

        {/* Major Ticks & Numbers (DOWN) */}
        {downMarks.map((m) => {
          const p1 = polarToCart(120, 120, 83, m.angle);
          const p2 = polarToCart(120, 120, 96, m.angle);
          const pText = polarToCart(120, 120, 71, m.angle);
          return (
            <g key={`down-${m.val}`}>
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
              >
                {relabel(m.val) ?? m.text}
              </text>
            </g>
          );
        })}

        {/* Center Labels */}
        <text
          x="142"
          y="114"
          fill="#cbd5e1"
          fontSize="7.5"
          fontWeight="700"
          letterSpacing="0.6"
          fontFamily="Chivo Mono, monospace"
          textAnchor="middle"
        >
          {kpiMin === undefined ? "VERTICAL SPEED" : ""}
        </text>
        <text
          x="142"
          y="126"
          fill="#94a3b8"
          fontSize="6"
          fontWeight="600"
          letterSpacing="0.5"
          fontFamily="Chivo Mono, monospace"
          textAnchor="middle"
        >
          {kpiUnit || "FEET PER MINUTE"}
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
