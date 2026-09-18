import React, { useRef, useEffect } from 'react';
import { ClockMovementMode, ClockTimeMode, ClockHandTracking } from '../../types';
import { calculateClockHandAngles } from '../../utils/clockMovement';
import { cockpitAudio } from '../../utils/audio';

interface ClockProps {
  hours?: number;
  minutes?: number;
  seconds?: number;
  stopwatchSeconds?: number;
  isStopwatchRunning?: boolean;
  movementMode?: ClockMovementMode;
  timeMode?: ClockTimeMode;
  handTracking?: ClockHandTracking;
  bezelAngle?: number;
  soundEnabled?: boolean;
  onRotateBezel?: (angle: number) => void;
  onToggleStopwatch?: () => void;
}

export const CockpitClock: React.FC<ClockProps> = ({
  hours = 10,
  minutes = 10,
  seconds = 30,
  stopwatchSeconds = 0,
  isStopwatchRunning = false,
  movementMode = 'mechanical-5hz',
  timeMode = 'local',
  handTracking = 'seconds',
  bezelAngle = 0,
  soundEnabled = false,
  onRotateBezel,
  onToggleStopwatch,
}) => {
  const lastSecFloorRef = useRef<number>(Math.floor(seconds));
  const lastBeatRef = useRef<number>(Math.floor(seconds * 5));

  // Audio tick-tock sync
  useEffect(() => {
    if (!soundEnabled) return;

    if (movementMode === 'mechanical-5hz') {
      const currentBeat = Math.floor(seconds * 5);
      if (currentBeat !== lastBeatRef.current) {
        const isTock = currentBeat % 2 === 1;
        cockpitAudio.playClockTick(isTock);
        lastBeatRef.current = currentBeat;
      }
    } else {
      const currentSecFloor = Math.floor(seconds);
      if (currentSecFloor !== lastSecFloorRef.current) {
        const isTock = currentSecFloor % 2 === 1;
        cockpitAudio.playClockTick(isTock);
        lastSecFloorRef.current = currentSecFloor;
      }
    }
  }, [seconds, soundEnabled, movementMode]);

  // Calculate kinematics
  const {
    secAngle,
    minAngle,
    hrAngle,
    elapsedSecAngle,
  } = calculateClockHandAngles(hours, minutes, seconds, stopwatchSeconds, (movementMode || 'mechanical-5hz') as ClockMovementMode);

  // Single hand target selection: exactly one movable hand tracks the active data
  let singleHandAngle = secAngle;
  let singleHandLabel = 'SECONDS';
  let singleHandColor = '#ef4444'; // Red pointer
  let singleHandLume = '#fca5a5';

  if (handTracking === 'stopwatch') {
    singleHandAngle = elapsedSecAngle;
    singleHandLabel = 'ELAPSED SEC';
    singleHandColor = '#f59e0b'; // Amber chronograph
    singleHandLume = '#fde68a';
  } else if (handTracking === 'minutes') {
    singleHandAngle = minAngle;
    singleHandLabel = 'MINUTES';
    singleHandColor = '#38bdf8'; // Sky blue
    singleHandLume = '#bae6fd';
  } else if (handTracking === 'hours') {
    singleHandAngle = hrAngle;
    singleHandLabel = 'HOURS';
    singleHandColor = '#34d399'; // Mint green
    singleHandLume = '#a7f3d0';
  }

  const polarToCart = (cx: number, cy: number, r: number, angleDeg: number) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  };

  const hoursNumerals = [
    { num: 12, angle: 0 },
    { num: 1, angle: 30 },
    { num: 2, angle: 60 },
    { num: 3, angle: 90 },
    { num: 4, angle: 120 },
    { num: 5, angle: 150 },
    { num: 6, angle: 180 },
    { num: 7, angle: 210 },
    { num: 8, angle: 240 },
    { num: 9, angle: 270 },
    { num: 10, angle: 300 },
    { num: 11, angle: 330 },
  ];

  const formattedHours = Math.floor(hours % 12 || 12).toString().padStart(2, '0');
  const formattedMinutes = Math.floor(minutes % 60).toString().padStart(2, '0');
  const formattedSeconds = Math.floor(seconds % 60).toString().padStart(2, '0');

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg viewBox="0 0 240 240" className="w-full h-full select-none">
        <defs>
          {/* Dial Face Gradient */}
          <radialGradient id="clockDialGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1e1e24" />
            <stop offset="85%" stopColor="#121215" />
            <stop offset="100%" stopColor="#09090b" />
          </radialGradient>

          {/* Knurled Bezel Rim */}
          <linearGradient id="bezelRim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#44403c" />
            <stop offset="50%" stopColor="#1c1917" />
            <stop offset="100%" stopColor="#292524" />
          </linearGradient>

          {/* Luminous Glow */}
          <filter id="lumeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Knurled Bezel (Rotatable 0-359° for flight timing) */}
        <g transform={`rotate(${bezelAngle}, 120, 120)`}>
          <circle cx="120" cy="120" r="114" fill="url(#bezelRim)" stroke="#57534e" strokeWidth="1" />
          
          {/* Fluted Teeth */}
          {Array.from({ length: 72 }).map((_, i) => {
            const angle = i * 5;
            const p1 = polarToCart(120, 120, 110, angle);
            const p2 = polarToCart(120, 120, 114, angle);
            return (
              <line
                key={`flute-${i}`}
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke="#78716c"
                strokeWidth="1.2"
                strokeOpacity="0.75"
              />
            );
          })}

          <circle cx="120" cy="120" r="109" fill="#141416" stroke="#292524" strokeWidth="1.5" />

          {/* Luminous Bezel Index Triangle (12 o'clock marker) */}
          <polygon
            points="120,13 115,22 125,22"
            fill="#86efac"
            filter="url(#lumeGlow)"
            stroke="#15803d"
            strokeWidth="0.5"
          />

          {/* Bezel 15, 30, 45 Minute Numbers */}
          <text x="218" y="123" fill="#a8a29e" fontSize="7" fontWeight="bold" fontFamily="Oswald, sans-serif" textAnchor="middle">15</text>
          <text x="120" y="222" fill="#a8a29e" fontSize="7" fontWeight="bold" fontFamily="Oswald, sans-serif" textAnchor="middle">30</text>
          <text x="22" y="123" fill="#a8a29e" fontSize="7" fontWeight="bold" fontFamily="Oswald, sans-serif" textAnchor="middle">45</text>
        </g>

        {/* Dial Face Plate */}
        <circle cx="120" cy="120" r="102" fill="url(#clockDialGrad)" />
        <circle cx="120" cy="120" r="101.5" fill="none" stroke="#27272a" strokeWidth="1" />

        {/* 60 Minute / Second Railroad Track */}
        {Array.from({ length: 60 }).map((_, i) => {
          const angle = i * 6;
          const is5Min = i % 5 === 0;
          const p1 = polarToCart(120, 120, is5Min ? 85 : 89, angle);
          const p2 = polarToCart(120, 120, 94, angle);
          return (
            <line
              key={`tick-${i}`}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke={is5Min ? '#f4f4f5' : '#71717a'}
              strokeWidth={is5Min ? 2 : 1}
            />
          );
        })}

        {/* 1/5-Second Escapement Subdivisions (Authentic to 5-Hz chronometers) */}
        {Array.from({ length: 300 }).map((_, i) => {
          if (i % 5 === 0) return null;
          const angle = i * 1.2;
          const p1 = polarToCart(120, 120, 91.5, angle);
          const p2 = polarToCart(120, 120, 94, angle);
          return (
            <line
              key={`subtick-${i}`}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke="#52525b"
              strokeWidth="0.6"
              strokeOpacity="0.7"
            />
          );
        })}

        {/* 12-Hour Numerals (Clear, High-Contrast Aviator Font) */}
        {hoursNumerals.map((m) => {
          const p = polarToCart(120, 120, 72, m.angle);
          return (
            <text
              key={`hr-num-${m.num}`}
              x={p.x}
              y={p.y}
              fill="#f8fafc"
              fontSize={m.num === 12 || m.num === 3 || m.num === 6 || m.num === 9 ? '15' : '12'}
              fontWeight="700"
              fontFamily="Oswald, sans-serif"
              textAnchor="middle"
              dominantBaseline="central"
            >
              {m.num}
            </text>
          );
        })}

        {/* Inner 24-Hour Military Reference Ring */}
        {hoursNumerals.map((m) => {
          const milHr = m.num === 12 ? 24 : m.num + 12;
          const p = polarToCart(120, 120, 56, m.angle);
          return (
            <text
              key={`mil-${milHr}`}
              x={p.x}
              y={p.y}
              fill="#71717a"
              fontSize="7.5"
              fontWeight="600"
              fontFamily="Chivo Mono, monospace"
              textAnchor="middle"
              dominantBaseline="central"
            >
              {milHr}
            </text>
          );
        })}

        {/* Digital Flight Time Window in Upper Quadrant (10:10 format) */}
        <g transform="translate(120, 72)">
          <rect x="-34" y="-8" width="68" height="16" rx="2" fill="#09090b" stroke="#3f3f46" strokeWidth="1.2" />
          <text
            x="0"
            y="3"
            fill="#f8fafc"
            fontSize="9"
            fontWeight="700"
            fontFamily="Share Tech Mono, monospace"
            textAnchor="middle"
          >
            {formattedHours}:{formattedMinutes}:{formattedSeconds}
          </text>
        </g>

        {/* Aircraft Chronometer Dial Badge */}
        <text
          x="120"
          y="93"
          fill="#a1a1aa"
          fontSize="6"
          fontWeight="700"
          letterSpacing="1.2"
          fontFamily="Chivo Mono, monospace"
          textAnchor="middle"
        >
          8 DAYS • CHRONOMETER
        </text>

        {/* Time Mode & Active Hand Indicator Badges in Lower Quadrant */}
        <g transform="translate(120, 150)">
          {/* Mode Pill (Local vs UTC) */}
          <rect
            x="-36"
            y="-5.5"
            width="32"
            height="11"
            rx="2"
            fill={timeMode === 'zulu' ? '#450a0a' : '#18181b'}
            stroke={timeMode === 'zulu' ? '#ef4444' : '#3f3f46'}
            strokeWidth="0.8"
          />
          <text
            x="-20"
            y="2.5"
            fill={timeMode === 'zulu' ? '#fca5a5' : '#38bdf8'}
            fontSize="6"
            fontWeight="bold"
            fontFamily="Share Tech Mono, monospace"
            textAnchor="middle"
          >
            {timeMode === 'zulu' ? 'UTC' : 'LOCAL'}
          </text>

          {/* Active Single Hand Tracking Indicator Badge */}
          <rect
            x="4"
            y="-5.5"
            width="32"
            height="11"
            rx="2"
            fill="#18181b"
            stroke={singleHandColor}
            strokeWidth="0.8"
          />
          <text
            x="20"
            y="2.5"
            fill={singleHandColor}
            fontSize="5.5"
            fontWeight="bold"
            fontFamily="Share Tech Mono, monospace"
            textAnchor="middle"
          >
            {singleHandLabel}
          </text>
        </g>

        {/* Stopwatch / Elapsed Time Digital Readout when active */}
        {stopwatchSeconds > 0 && (
          <g transform="translate(120, 166)">
            <rect x="-26" y="-6" width="52" height="12" rx="2" fill="#09090b" stroke="#f59e0b" strokeWidth="0.8" />
            <text
              x="0"
              y="2.8"
              fill="#fbbf24"
              fontSize="7"
              fontWeight="700"
              fontFamily="Share Tech Mono, monospace"
              textAnchor="middle"
            >
              ET {Math.floor(stopwatchSeconds / 60).toString().padStart(2, '0')}:
              {Math.floor(stopwatchSeconds % 60).toString().padStart(2, '0')}
            </text>
          </g>
        )}

        {/* ============================================================ */}
        {/* AT MOST ONE MOVABLE VISIBLE HAND TO TRACK THE DATA */}
        {/* ============================================================ */}
        <g transform={`rotate(${singleHandAngle}, 120, 120)`}>
          {/* Subtle Needle Shadow */}
          <line
            x1="121"
            y1="140"
            x2="121"
            y2="25"
            stroke="#000000"
            strokeWidth="1.6"
            opacity="0.45"
          />

          {/* Main Pointer Needle */}
          <line
            x1="120"
            y1="138"
            x2="120"
            y2="24"
            stroke={singleHandColor}
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* Luminous Diamond / Arrow Inlay at Tip */}
          <polygon
            points="120,20 116.5,30 123.5,30"
            fill={singleHandColor}
          />
          <polygon
            points="120,22 118,28 122,28"
            fill={singleHandLume}
            filter="url(#lumeGlow)"
          />

          {/* Precision Counterbalance Ring */}
          <circle
            cx="120"
            cy="133"
            r="4.2"
            fill="none"
            stroke={singleHandColor}
            strokeWidth="1.2"
          />
          {/* Counterbalance tail */}
          <line
            x1="120"
            y1="137"
            x2="120"
            y2="148"
            stroke={singleHandColor}
            strokeWidth="1.4"
          />
        </g>

        {/* Center Cap Nut / Cannon Pinion Hub */}
        <circle cx="120" cy="120" r="7" fill="#27272a" stroke="#18181b" strokeWidth="1.6" />
        <circle cx="120" cy="120" r="4.5" fill="#3f3f46" />
        <circle cx="120" cy="120" r="2.2" fill={singleHandColor} />

        {/* ============================================================ */}
        {/* Authentic Pusher Knob at Lower Left (Start/Stop Chrono) */}
        {/* ============================================================ */}
        <g
          transform="translate(44, 196)"
          className="cursor-pointer group"
          onClick={() => {
            if (onToggleStopwatch) onToggleStopwatch();
          }}
        >
          <circle cx="0" cy="0" r="16" fill="#141416" stroke="#44403c" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="13" fill="#262626" />

          {/* Knurl Grips */}
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i * 30 * Math.PI) / 180;
            return (
              <line
                key={`knurl-${i}`}
                x1={Math.cos(a) * 9}
                y1={Math.sin(a) * 9}
                x2={Math.cos(a) * 13}
                y2={Math.sin(a) * 13}
                stroke="#525252"
                strokeWidth="1.4"
              />
            );
          })}

          {/* Center Pusher Button */}
          <circle
            cx="0"
            cy="0"
            r="6"
            fill={isStopwatchRunning ? '#b91c1c' : '#404040'}
            stroke="#737373"
            strokeWidth="1"
            className="transition-colors group-hover:fill-amber-600"
          />
          <circle cx="0" cy="0" r="2.5" fill="#e5e5e5" />
        </g>

        {/* Knob Label */}
        <text
          x="44"
          y="218"
          fill="#a8a29e"
          fontSize="5.5"
          fontWeight="700"
          fontFamily="Chivo Mono, monospace"
          textAnchor="middle"
        >
          PUSH ET / WIND
        </text>
      </svg>
    </div>
  );
};
