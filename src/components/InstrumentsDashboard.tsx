import React from 'react';

interface InstrumentWidgetProps {
  label: string;
  children?: React.ReactNode;
  knobPosition?: 'bottom-left' | 'bottom-right' | 'none';
  bezelShape?: 'scalloped' | 'square' | 'chamfered';
}

export function InstrumentWidget({ label, children, knobPosition = 'none', bezelShape = 'scalloped' }: InstrumentWidgetProps) {
  return (
    <div className="flex flex-col items-center">
      {/* Bezel Container */}
      <div className="relative w-56 h-56 md:w-64 md:h-64 flex items-center justify-center drop-shadow-2xl mb-1">
        
        {/* Bezel Base Variations */}
        {bezelShape === 'scalloped' && (
          <>
            <div className="absolute w-[85%] h-full bg-gradient-to-br from-gray-700 via-gray-800 to-gray-950 rounded-[2rem] border border-gray-600/30 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)]"></div>
            <div className="absolute w-full h-[85%] bg-gradient-to-br from-gray-700 via-gray-800 to-gray-950 rounded-[2rem] border border-gray-600/30 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)]"></div>
          </>
        )}

        {bezelShape === 'square' && (
          <div className="absolute w-full h-full bg-gradient-to-br from-gray-700 via-gray-800 to-gray-950 rounded-[2.5rem] border border-gray-600/30 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)]"></div>
        )}

        {bezelShape === 'chamfered' && (
          <>
            <div className="absolute w-full h-full bg-gradient-to-br from-gray-500 via-gray-700 to-gray-900 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)]" style={{ clipPath: 'polygon(15% 0, 85% 0, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0 85%, 0 15%)' }}></div>
            <div className="absolute w-[98%] h-[98%] bg-gradient-to-br from-gray-700 via-gray-800 to-gray-950" style={{ clipPath: 'polygon(15% 0, 85% 0, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0 85%, 0 15%)' }}></div>
          </>
        )}

        {/* Center circle overlay to smooth the inner intersection */}
        <div className="absolute w-[91%] h-[91%] bg-gradient-to-br from-gray-700 to-gray-900 rounded-full"></div>

        {/* Corner screws */}
        <div className="absolute top-3.5 left-3.5 w-3.5 h-3.5 rounded-full bg-gray-800 border border-gray-900 shadow-[inset_0_1px_3px_rgba(0,0,0,1),0_1px_0_rgba(255,255,255,0.2)] z-10 flex items-center justify-center">
          <div className="w-full h-[1.5px] bg-black/70 rotate-45"></div>
        </div>
        <div className="absolute top-3.5 right-3.5 w-3.5 h-3.5 rounded-full bg-gray-800 border border-gray-900 shadow-[inset_0_1px_3px_rgba(0,0,0,1),0_1px_0_rgba(255,255,255,0.2)] z-10 flex items-center justify-center">
          <div className="w-full h-[1.5px] bg-black/70 -rotate-12"></div>
        </div>
        <div className="absolute bottom-3.5 left-3.5 w-3.5 h-3.5 rounded-full bg-gray-800 border border-gray-900 shadow-[inset_0_1px_3px_rgba(0,0,0,1),0_1px_0_rgba(255,255,255,0.2)] z-10 flex items-center justify-center">
          <div className="w-full h-[1.5px] bg-black/70 rotate-90"></div>
        </div>
        <div className="absolute bottom-3.5 right-3.5 w-3.5 h-3.5 rounded-full bg-gray-800 border border-gray-900 shadow-[inset_0_1px_3px_rgba(0,0,0,1),0_1px_0_rgba(255,255,255,0.2)] z-10 flex items-center justify-center">
          <div className="w-full h-[1.5px] bg-black/70 -rotate-45"></div>
        </div>
        
        {/* Optional Knob */}
        {knobPosition === 'bottom-left' && (
          <div className="absolute -bottom-1 -left-1 w-11 h-11 rounded-full bg-gradient-to-b from-gray-600 to-gray-900 border border-gray-500 shadow-[0_6px_8px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(255,255,255,0.3)] z-20 flex items-center justify-center">
             <div className="w-9 h-9 rounded-full bg-gray-900 border border-gray-800 shadow-[inset_0_2px_6px_rgba(0,0,0,1)] flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-[repeating-conic-gradient(#444_0_15deg,#222_15deg_30deg)] opacity-60"></div>
             </div>
          </div>
        )}
        {knobPosition === 'bottom-right' && (
          <div className="absolute -bottom-1 -right-1 w-11 h-11 rounded-full bg-gradient-to-b from-gray-600 to-gray-900 border border-gray-500 shadow-[0_6px_8px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(255,255,255,0.3)] z-20 flex items-center justify-center">
             <div className="w-9 h-9 rounded-full bg-gray-900 border border-gray-800 shadow-[inset_0_2px_6px_rgba(0,0,0,1)] flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-[repeating-conic-gradient(#444_0_15deg,#222_15deg_30deg)] opacity-60"></div>
             </div>
          </div>
        )}

        {/* Inner dial cutout */}
        <div className="absolute m-auto w-[87%] h-[87%] bg-black rounded-full border-4 border-gray-800 shadow-[inset_0_16px_32px_rgba(0,0,0,1),0_2px_4px_rgba(255,255,255,0.15)] overflow-hidden z-10 flex items-center justify-center">
           {children}
        </div>
      </div>
      
      {/* Label */}
      <div className="bg-white border-[3px] border-red-600 px-4 py-0.5 text-center font-black text-black text-xs md:text-sm tracking-wider uppercase shadow-[0_4px_8px_rgba(0,0,0,0.4)] relative z-30 mx-4 max-w-full">
        {label}
      </div>
    </div>
  );
}

function ClockFace({ variant }: { variant: 'standard' | 'military' | 'minimal' }) {
  // Static time for display (10:08 is classic watch/clock display time)
  const hours = 10;
  const minutes = 8;
  const seconds = 42;

  const hourRotation = (hours % 12) * 30 + minutes * 0.5;
  const minuteRotation = minutes * 6;
  const secondRotation = seconds * 6;

  return (
    <div className="relative w-full h-full rounded-full bg-[#111] flex items-center justify-center text-white">
      {/* Clock numbers/ticks */}
      {[...Array(12)].map((_, i) => {
        const num = i === 0 ? 12 : i;
        const angle = i * 30;
        
        if (variant === 'minimal') {
          return (
            <div key={i} className="absolute w-full h-full flex justify-center" style={{ transform: `rotate(${angle}deg)` }}>
              <div className={`w-1 bg-white rounded-full ${i % 3 === 0 ? 'h-4 mt-2' : 'h-2 mt-2 opacity-50'}`}></div>
            </div>
          );
        }

        return (
          <div key={i} className="absolute w-full h-full flex justify-center" style={{ transform: `rotate(${angle}deg)` }}>
            <div className="absolute top-2" style={{ transform: `rotate(-${angle}deg)` }}>
              <span className={`font-bold ${variant === 'military' ? 'text-orange-500 text-xs' : 'text-lg'}`}>
                {variant === 'military' ? (num + 12).toString() : num}
              </span>
            </div>
            {/* Tick mark */}
            <div className="w-0.5 h-1.5 bg-white/50 mt-[26px]"></div>
          </div>
        );
      })}

      {/* Military inner ring (1-12) */}
      {variant === 'military' && [...Array(12)].map((_, i) => {
        const num = i === 0 ? 12 : i;
        const angle = i * 30;
        return (
          <div key={`inner-${i}`} className="absolute w-full h-full flex justify-center scale-75" style={{ transform: `rotate(${angle}deg)` }}>
            <div className="absolute top-6" style={{ transform: `rotate(-${angle}deg)` }}>
              <span className="font-bold text-white text-[10px]">{num}</span>
            </div>
          </div>
        );
      })}

      {/* Hands */}
      <div className="absolute w-full h-full flex items-center justify-center pointer-events-none">
        {/* Hour Hand */}
        <div 
          className="absolute w-2 h-14 bg-white rounded-full origin-bottom -translate-y-7 shadow-md"
          style={{ transform: `rotate(${hourRotation}deg)` }}
        ></div>
        {/* Minute Hand */}
        <div 
          className="absolute w-1.5 h-20 bg-white rounded-full origin-bottom -translate-y-10 shadow-md"
          style={{ transform: `rotate(${minuteRotation}deg)` }}
        ></div>
        {/* Second Hand */}
        <div 
          className="absolute w-0.5 h-24 origin-bottom -translate-y-10 shadow-sm z-10"
          style={{ 
            backgroundColor: variant === 'military' ? '#f97316' : '#ef4444',
            transform: `rotate(${secondRotation}deg)` 
          }}
        ></div>
        {/* Center Dot */}
        <div className="absolute w-3 h-3 bg-gray-300 rounded-full z-20 shadow-sm border border-gray-500"></div>
      </div>
    </div>
  );
}

export function InstrumentsDashboard() {
  return (
    <div className="min-h-screen bg-[#d09968] p-8 md:p-12 relative overflow-hidden font-sans">
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 20px)' }}></div>
      
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black text-white mb-12 text-center drop-shadow-md">Aviation Bezel Shape Variations</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 place-items-center">
          
          {/* Scalloped - Current Base State */}
          <InstrumentWidget label="Scalloped Corners" knobPosition="bottom-left" bezelShape="scalloped">
             <ClockFace variant="standard" />
          </InstrumentWidget>

          {/* Square - Standard Rounded Box */}
          <InstrumentWidget label="Rounded Square" knobPosition="bottom-left" bezelShape="square">
             <ClockFace variant="standard" />
          </InstrumentWidget>

          {/* Chamfered - Octagonal / Angled Corners */}
          <InstrumentWidget label="Chamfered Corners" knobPosition="bottom-left" bezelShape="chamfered">
             <ClockFace variant="standard" />
          </InstrumentWidget>

        </div>
      </div>
    </div>
  );
}
