import React from 'react';

interface AirspeedProps {
  kpiUnit?: string;
  kpiMin?: number;
  kpiMax?: number;
  kpiGreenFrac?: number;
  kpiRedFrac?: number;
  kpiInverted?: boolean;
  airspeed: number; // knots
}

export const AirspeedIndicator: React.FC<AirspeedProps> = ({ airspeed, kpiUnit, kpiMin, kpiMax, kpiGreenFrac, kpiRedFrac, kpiInverted }) => {
  // Convert knots to angle in degrees (starts at ~40 knots at ~225° / -135°)
  // Standard calibrated dial:
  // 40 kts -> 40 deg from zero-reference
  const getAngle = (speed: number) => {
    const clamped = Math.max(0, Math.min(220, speed));
    if (clamped <= 40) {
      return -135 + (clamped / 40) * 35;
    } else if (clamped <= 100) {
      // 40 to 100 kts -> -100 to +30 deg (130 deg span for 60 kts)
      return -100 + ((clamped - 40) / 60) * 130;
    } else if (clamped <= 160) {
      // 100 to 160 kts -> 30 to 135 deg (105 deg span for 60 kts)
      return 30 + ((clamped - 100) / 60) * 105;
    } else {
      // 160 to 220 kts -> 135 to 215 deg
      return 135 + ((clamped - 160) / 60) * 80;
    }
  };

  const needleAngle = getAngle(airspeed);

  // Arcs on the dial (using SVG arc path):
  // R = 82
  // White Arc: 55 to 100 knots
  // Green Arc: 65 to 160 knots
  // Yellow Arc: 160 to 200 knots
  // Red Line: 200 knots

  // Helper for polar to cartesian
  const polarToCart = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCart(x, y, radius, endAngle);
    const end = polarToCart(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(' ');
  };

  const a55 = getAngle(55);
  const a65 = getAngle(65);
  const a100 = getAngle(100);
  const a160 = getAngle(160);
  const a200 = getAngle(200);

  const speedMarks = [40, 60, 80, 100, 120, 140, 160, 180, 200];
  const minorMarks = [50, 70, 90, 110, 130, 150, 170, 190];

  // KPI mode: replace the native aviation warning bands with a 3-segment
  // arc positioned at this KPI's real green/red thresholds (same red/amber/
  // green logic the main dashboard uses), instead of Airspeed's stock
  // 65-160kt "normal range" which has nothing to do with the KPI's range.
  const hasKpiThresholds = kpiGreenFrac !== undefined && kpiRedFrac !== undefined;
  const nativeAngleAtFrac = (f: number) => getAngle(40 + f * 160);
  const startAngle = nativeAngleAtFrac(0);
  const endAngle = nativeAngleAtFrac(1);
  const greenAngle = hasKpiThresholds ? nativeAngleAtFrac(kpiGreenFrac!) : 0;
  const redAngle = hasKpiThresholds ? nativeAngleAtFrac(kpiRedFrac!) : 0;

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg viewBox="0 0 240 240" className="w-full h-full select-none">
        {/* Dial Face Background */}
        <circle cx="120" cy="120" r="106" fill="#141416" />
        <circle cx="120" cy="120" r="105" fill="none" stroke="#2a2a2e" strokeWidth="2" />

        {hasKpiThresholds ? (
          <>
            {/* KPI threshold arc: red/amber/green ordered by this KPI's own thresholds */}
            {!kpiInverted ? (
              <>
                <path d={describeArc(120, 120, 84, startAngle, redAngle)} fill="none" stroke="#ef4444" strokeWidth="5" strokeLinecap="butt" />
                <path d={describeArc(120, 120, 84, redAngle, greenAngle)} fill="none" stroke="#f59e0b" strokeWidth="5" strokeLinecap="butt" />
                <path d={describeArc(120, 120, 84, greenAngle, endAngle)} fill="none" stroke="#22c55e" strokeWidth="5" strokeLinecap="butt" />
              </>
            ) : (
              <>
                <path d={describeArc(120, 120, 84, startAngle, greenAngle)} fill="none" stroke="#22c55e" strokeWidth="5" strokeLinecap="butt" />
                <path d={describeArc(120, 120, 84, greenAngle, redAngle)} fill="none" stroke="#f59e0b" strokeWidth="5" strokeLinecap="butt" />
                <path d={describeArc(120, 120, 84, redAngle, endAngle)} fill="none" stroke="#ef4444" strokeWidth="5" strokeLinecap="butt" />
              </>
            )}
          </>
        ) : (
          <>
            {/* Flap White Arc (Inner arc) */}
            <path
              d={describeArc(120, 120, 76, a55, a100)}
              fill="none"
              stroke="#f8fafc"
              strokeWidth="4"
              strokeLinecap="butt"
            />

            {/* Green Normal Arc */}
            <path
              d={describeArc(120, 120, 84, a65, a160)}
              fill="none"
              stroke="#22c55e"
              strokeWidth="5"
              strokeLinecap="butt"
            />

            {/* Yellow Caution Arc */}
            <path
              d={describeArc(120, 120, 84, a160, a200)}
              fill="none"
              stroke="#eab308"
              strokeWidth="5"
              strokeLinecap="butt"
            />

            {/* Red Radial Line (Vne at 200 kts) */}
            {(() => {
              const pt1 = polarToCart(120, 120, 78, a200);
              const pt2 = polarToCart(120, 120, 92, a200);
              return <line x1={pt1.x} y1={pt1.y} x2={pt2.x} y2={pt2.y} stroke="#ef4444" strokeWidth="3.5" />;
            })()}
          </>
        )}

        {/* Minor Ticks */}
        {minorMarks.map((speed) => {
          const angle = getAngle(speed);
          const p1 = polarToCart(120, 120, 87, angle);
          const p2 = polarToCart(120, 120, 93, angle);
          return <line key={speed} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#cbd5e1" strokeWidth="1.5" />;
        })}

        {/* Major Ticks and Numbers */}
        {speedMarks.map((speed) => {
          const angle = getAngle(speed);
          const p1 = polarToCart(120, 120, 84, angle);
          const p2 = polarToCart(120, 120, 95, angle);
          const pText = polarToCart(120, 120, 68, angle);
          let labelText = speed.toString();
          if (kpiMax !== undefined && kpiMin !== undefined) {
            const fraction = (speed - 40) / 160;
            labelText = Math.round(kpiMin + fraction * (kpiMax - kpiMin)).toString();
          }
          return (
            <g key={speed}>
              <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#f8fafc" strokeWidth="2.5" />
              <text
                x={pText.x}
                y={pText.y}
                fill="#f8fafc"
                fontSize="12"
                fontWeight="700"
                fontFamily="Oswald, sans-serif"
                textAnchor="middle"
                dominantBaseline="central"
              >
                {labelText}
              </text>
            </g>
          );
        })}

        {/* Center Labels matching real instrument */}
        <text
          x="120"
          y="78"
          fill="#cbd5e1"
          fontSize="9.5"
          fontWeight="600"
          letterSpacing="0.8"
          fontFamily="Chivo Mono, monospace"
          textAnchor="middle"
        >
          {kpiMin === undefined ? "AIRSPEED" : ""}
        </text>
        <text
          x="120"
          y="158"
          fill="#94a3b8"
          fontSize="8.5"
          fontWeight="600"
          letterSpacing="1"
          fontFamily="Chivo Mono, monospace"
          textAnchor="middle"
        >
          {kpiUnit || "KNOTS"}
        </text>

        {/* Pointer Needle with Smooth Shadow and Hub */}
        <g transform={`rotate(${needleAngle}, 120, 120)`} style={{ transition: 'transform 0.6s ease-in-out' }}>
          {/* Needle Shadow */}
          <path
            d="M 117,140 L 118.5,38 L 120,28 L 121.5,38 L 123,140 Z"
            fill="rgba(0,0,0,0.5)"
            transform="translate(2, 3)"
          />
          {/* White Needle */}
          <path
            d="M 117.5,140 L 118.8,36 L 120,26 L 121.2,36 L 122.5,140 Z"
            fill="#f8fafc"
          />
          {/* Needle Counterweight */}
          <circle cx="120" cy="132" r="5" fill="#f8fafc" />
        </g>

        {/* Center Screw / Cap */}
        <circle cx="120" cy="120" r="10" fill="#29292d" stroke="#18181b" strokeWidth="2" />
        <circle cx="120" cy="120" r="4.5" fill="#52525b" />
      </svg>
    </div>
  );
};
