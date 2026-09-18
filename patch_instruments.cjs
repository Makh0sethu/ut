const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'components', 'kpi-instruments');

function patchAirspeed() {
  const f = path.join(dir, 'AirspeedIndicator.tsx');
  let code = fs.readFileSync(f, 'utf8');
  
  // Add props
  code = code.replace('interface AirspeedProps {', 'interface AirspeedProps {\n  kpiUnit?: string;\n  kpiMin?: number;\n  kpiMax?: number;');
  code = code.replace('export const AirspeedIndicator: React.FC<AirspeedProps> = ({ airspeed }) => {', 'export const AirspeedIndicator: React.FC<AirspeedProps> = ({ airspeed, kpiUnit, kpiMin, kpiMax }) => {');
  
  // Replace unit text
  code = code.replace('{/* Unit Text */}\n        <text', '{/* Unit Text */}\n        <text');
  code = code.replace('>KNOTS</text>', '>{kpiUnit || "KNOTS"}</text>');
  code = code.replace('>\n          KNOTS\n        </text>', '>\n          {kpiUnit || "KNOTS"}\n        </text>');
  
  // Replace labels
  const labelReplacement = `
        {/* Speed Numbers */}
        {speedMarks.map((speed) => {
          const angle = getAngle(speed);
          const pt = polarToCart(120, 120, 58, angle);
          let labelText = speed.toString();
          if (kpiMax !== undefined && kpiMin !== undefined) {
             const fraction = (speed - 40) / 160; 
             labelText = Math.round(kpiMin + fraction * (kpiMax - kpiMin)).toString();
          }
          return (
            <text
              key={speed}
              x={pt.x}
              y={pt.y + 4}
              fill="#f8fafc"
              fontSize="12"
              fontWeight="bold"
              fontFamily="Chivo Mono, monospace"
              textAnchor="middle"
            >
              {labelText}
            </text>
          );
        })}
  `;
  code = code.replace(/\{\/\* Speed Numbers \*\/\}[\s\S]*?\}\)\}/, labelReplacement.trim());
  
  fs.writeFileSync(f, code);
  console.log('Patched Airspeed');
}

function patchTachometer() {
  const f = path.join(dir, 'Tachometer.tsx');
  let code = fs.readFileSync(f, 'utf8');
  
  code = code.replace('interface TachProps {', 'interface TachProps {\n  kpiUnit?: string;\n  kpiMin?: number;\n  kpiMax?: number;');
  code = code.replace('export const Tachometer: React.FC<TachProps> = ({', 'export const Tachometer: React.FC<TachProps> = ({ kpiUnit, kpiMin, kpiMax,');
  
  code = code.replace('>\n          RPM\n        </text>', '>\n          {kpiUnit || "RPM"}\n        </text>');
  
  const labelReplacement = `
        {/* Major Marks Digits */}
        {majorMarks.map((num) => {
          const angle = getAngle(num * 100);
          const pText = polarToCart(120, 120, 72, angle);
          let labelText = num.toString();
          if (kpiMax !== undefined && kpiMin !== undefined) {
             const fraction = num / 35; 
             labelText = Math.round(kpiMin + fraction * (kpiMax - kpiMin)).toString();
          }
          return (
            <text
              key={num}
              x={pText.x}
              y={pText.y + 5}
              fill="#f8fafc"
              fontSize="16"
              fontWeight="700"
              fontFamily="Oswald, sans-serif"
              textAnchor="middle"
            >
              {labelText}
            </text>
          );
        })}
  `;
  code = code.replace(/\{\/\* Major Marks Digits \*\/\}[\s\S]*?\}\)\}/, labelReplacement.trim());
  
  fs.writeFileSync(f, code);
  console.log('Patched Tachometer');
}

function patchAltimeter() {
  const f = path.join(dir, 'Altimeter.tsx');
  let code = fs.readFileSync(f, 'utf8');
  
  code = code.replace('interface AltimeterProps {', 'interface AltimeterProps {\n  kpiUnit?: string;\n  kpiMin?: number;\n  kpiMax?: number;');
  code = code.replace('export const Altimeter: React.FC<AltimeterProps> = ({', 'export const Altimeter: React.FC<AltimeterProps> = ({ kpiUnit, kpiMin, kpiMax,');
  
  code = code.replace('>\n            FT\n          </text>', '>\n            {kpiUnit || "FT"}\n          </text>');
  code = code.replace('>\n          100 FEET\n        </text>', '>\n          {kpiUnit ? "" : "100 FEET"}\n        </text>');
  code = code.replace('>\n            {Math.floor(effectiveAlt).toLocaleString().padStart(6, \' \')} FT\n          </text>', '>\n            {kpiUnit ? "" : Math.floor(effectiveAlt).toLocaleString().padStart(6, \' \') + " FT"}\n          </text>');
  
  const labelReplacement = `
        {/* Major Ticks & Digits (0 to 9) */}
        {digits.map((num) => {
          const angle = num * 36;
          const p1 = polarToCart(120, 120, 85, angle);
          const p2 = polarToCart(120, 120, 98, angle);
          const pText = polarToCart(120, 120, 72, angle);
          
          let labelText = num.toString();
          if (kpiMax !== undefined && kpiMin !== undefined) {
             const fraction = num / 10; 
             labelText = Math.round(kpiMin + fraction * (kpiMax - kpiMin)).toString();
          }

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
                {labelText}
              </text>
            </g>
          );
        })}
  `;
  code = code.replace(/\{\/\* Major Ticks & Digits \(0 to 9\) \*\/\}[\s\S]*?\}\)\}/, labelReplacement.trim());
  
  fs.writeFileSync(f, code);
  console.log('Patched Altimeter');
}

function patchManifold() {
  const f = path.join(dir, 'ManifoldPressureIndicator.tsx');
  let code = fs.readFileSync(f, 'utf8');
  
  code = code.replace('interface ManifoldProps {', 'interface ManifoldProps {\n  kpiUnit?: string;\n  kpiMin?: number;\n  kpiMax?: number;');
  code = code.replace('export const ManifoldPressureIndicator: React.FC<ManifoldProps> = ({', 'export const ManifoldPressureIndicator: React.FC<ManifoldProps> = ({ kpiUnit, kpiMin, kpiMax,');
  
  code = code.replace('>\n          MANIFOLD PRESSURE\n        </text>', '>\n          {kpiUnit || "MANIFOLD PRESSURE"}\n        </text>');
  code = code.replace('>\n          IN. HG.\n        </text>', '>\n          {kpiUnit ? "" : "IN. HG."}\n        </text>');
  
  const labelReplacement = `
        {/* Digits */}
        {majorMarks.map((num) => {
          const angle = getAngle(num);
          const pText = polarToCart(120, 120, 70, angle);
          let labelText = num.toString();
          if (kpiMax !== undefined && kpiMin !== undefined) {
             const fraction = (num - 10) / 25; 
             labelText = Math.round(kpiMin + fraction * (kpiMax - kpiMin)).toString();
          }
          return (
            <text
              key={num}
              x={pText.x}
              y={pText.y + 5}
              fill="#f8fafc"
              fontSize="16"
              fontWeight="700"
              fontFamily="Oswald, sans-serif"
              textAnchor="middle"
            >
              {labelText}
            </text>
          );
        })}
  `;
  code = code.replace(/\{\/\* Digits \*\/\}[\s\S]*?\}\)\}/, labelReplacement.trim());
  
  fs.writeFileSync(f, code);
  console.log('Patched Manifold');
}

try { patchAirspeed(); } catch (e) { console.error(e); }
try { patchTachometer(); } catch (e) { console.error(e); }
try { patchAltimeter(); } catch (e) { console.error(e); }
try { patchManifold(); } catch (e) { console.error(e); }
