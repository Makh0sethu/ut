import React from 'react';

interface AttitudeProps {
  pitch: number; // degrees (-30 to +30)
  roll: number; // degrees (-60 to +60)
  trimOffset?: number; // pitch trim adjustment degrees
}

export const AttitudeIndicator: React.FC<AttitudeProps> = ({
  pitch,
  roll,
  trimOffset = 0,
}) => {
  // Pitch moves the horizon sphere vertically:
  // 1 degree ≈ 2.2 pixels vertical offset
  const effectivePitch = pitch + trimOffset;
  const pitchY = Math.max(-60, Math.min(60, effectivePitch * 2.2));

  // Bank angle marks
  const bankAngles = [-90, -60, -45, -30, -20, -10, 0, 10, 20, 30, 45, 60, 90];

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg viewBox="0 0 240 240" className="w-full h-full select-none">
        <defs>
          {/* Clip path for the spherical horizon ball */}
          <clipPath id="attitude-ball-clip">
            <circle cx="120" cy="120" r="88" />
          </clipPath>

          {/* Sky Gradient */}
          <linearGradient id="sky-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>

          {/* Ground Gradient */}
          <linearGradient id="ground-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#78350f" />
            <stop offset="100%" stopColor="#451a03" />
          </linearGradient>
        </defs>

        {/* Outer dark dial mask */}
        <circle cx="120" cy="120" r="106" fill="#141416" />

        {/* Horizon Gyro Ball (Rotates with roll, translates with pitch) */}
        <g clipPath="url(#attitude-ball-clip)">
          <g transform={`rotate(${-roll}, 120, 120)`}>
            {/* Horizon Drum translation */}
            <g transform={`translate(0, ${pitchY})`}>
              {/* Sky Upper Half */}
              <rect x="0" y="-120" width="240" height="240" fill="url(#sky-gradient)" />
              {/* Ground Lower Half */}
              <rect x="0" y="120" width="240" height="240" fill="url(#ground-gradient)" />

              {/* White Horizon Line */}
              <line x1="20" y1="120" x2="220" y2="120" stroke="#ffffff" strokeWidth="2.5" />

              {/* Perspective Ground Lines matching the real instrument */}
              <line x1="120" y1="120" x2="60" y2="240" stroke="#92400e" strokeWidth="1.5" />
              <line x1="120" y1="120" x2="85" y2="240" stroke="#92400e" strokeWidth="1.5" />
              <line x1="120" y1="120" x2="155" y2="240" stroke="#92400e" strokeWidth="1.5" />
              <line x1="120" y1="120" x2="180" y2="240" stroke="#92400e" strokeWidth="1.5" />

              {/* Pitch Ladder (Nose Up) */}
              {/* 5 degrees */}
              <line x1="108" y1="109" x2="132" y2="109" stroke="#ffffff" strokeWidth="1.8" />
              {/* 10 degrees */}
              <line x1="96" y1="98" x2="144" y2="98" stroke="#ffffff" strokeWidth="2" />
              <text x="86" y="100.5" fill="#ffffff" fontSize="8" fontFamily="Oswald" textAnchor="end">10</text>
              <text x="154" y="100.5" fill="#ffffff" fontSize="8" fontFamily="Oswald" textAnchor="start">10</text>
              {/* 15 degrees */}
              <line x1="108" y1="87" x2="132" y2="87" stroke="#ffffff" strokeWidth="1.8" />
              {/* 20 degrees */}
              <line x1="94" y1="76" x2="146" y2="76" stroke="#ffffff" strokeWidth="2" />
              <text x="84" y="78.5" fill="#ffffff" fontSize="8" fontFamily="Oswald" textAnchor="end">20</text>
              <text x="156" y="78.5" fill="#ffffff" fontSize="8" fontFamily="Oswald" textAnchor="start">20</text>

              {/* Pitch Ladder (Nose Down) */}
              {/* 5 degrees */}
              <line x1="108" y1="131" x2="132" y2="131" stroke="#ffffff" strokeWidth="1.8" strokeDasharray="3,2" />
              {/* 10 degrees */}
              <line x1="96" y1="142" x2="144" y2="142" stroke="#ffffff" strokeWidth="2" strokeDasharray="4,2" />
              <text x="86" y="144.5" fill="#ffffff" fontSize="8" fontFamily="Oswald" textAnchor="end">10</text>
              <text x="154" y="144.5" fill="#ffffff" fontSize="8" fontFamily="Oswald" textAnchor="start">10</text>
              {/* 15 degrees */}
              <line x1="108" y1="153" x2="132" y2="153" stroke="#ffffff" strokeWidth="1.8" strokeDasharray="3,2" />
              {/* 20 degrees */}
              <line x1="94" y1="164" x2="146" y2="164" stroke="#ffffff" strokeWidth="2" strokeDasharray="4,2" />
              <text x="84" y="166.5" fill="#ffffff" fontSize="8" fontFamily="Oswald" textAnchor="end">20</text>
              <text x="156" y="166.5" fill="#ffffff" fontSize="8" fontFamily="Oswald" textAnchor="start">20</text>
            </g>

            {/* Roll Index Triangle at top of ball */}
            <polygon points="120,33 115,41 125,41" fill="#ffffff" />
          </g>
        </g>

        {/* Fixed Outer Roll Mask with Bank Angle Index Marks */}
        {bankAngles.map((angle) => {
          const isMajor = Math.abs(angle) === 30 || Math.abs(angle) === 60 || angle === 0;
          const is45 = Math.abs(angle) === 45;
          const r1 = 88;
          const r2 = isMajor ? 99 : is45 ? 96 : 94;
          const rad = ((angle - 90) * Math.PI) / 180;
          const x1 = 120 + r1 * Math.cos(rad);
          const y1 = 120 + r1 * Math.sin(rad);
          const x2 = 120 + r2 * Math.cos(rad);
          const y2 = 120 + r2 * Math.sin(rad);

          return (
            <line
              key={angle}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={angle === 0 ? '#facc15' : '#f8fafc'}
              strokeWidth={isMajor ? 2.5 : 1.5}
            />
          );
        })}

        {/* Top Fixed Triangle Reference (Zero Bank Marker) */}
        <polygon points="120,31 114,21 126,21" fill="#facc15" />

        {/* Fixed Foreground Miniature Aircraft Symbol */}
        <g id="miniature-aircraft" filter="drop-shadow(0px 2px 3px rgba(0,0,0,0.7))">
          {/* Left Wing */}
          <rect x="68" y="118" width="38" height="4.5" rx="1.5" fill="#fbbf24" stroke="#78350f" strokeWidth="0.8" />
          <line x1="106" y1="118" x2="106" y2="124" stroke="#fbbf24" strokeWidth="2.5" />

          {/* Center Pip / Dot */}
          <circle cx="120" cy="120" r="3.5" fill="#fbbf24" stroke="#78350f" strokeWidth="0.8" />

          {/* Right Wing */}
          <rect x="134" y="118" width="38" height="4.5" rx="1.5" fill="#fbbf24" stroke="#78350f" strokeWidth="0.8" />
          <line x1="134" y1="118" x2="134" y2="124" stroke="#fbbf24" strokeWidth="2.5" />
        </g>

        {/* Adjustment Knob at bottom center/left */}
        <g id="pitch-knob" className="cursor-pointer" transform="translate(120, 206)">
          <circle cx="0" cy="0" r="14" fill="#262626" stroke="#404040" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="11" fill="#171717" />
          {/* Knurled grips */}
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
          <circle cx="0" cy="0" r="5" fill="#737373" />
        </g>
      </svg>
    </div>
  );
};
