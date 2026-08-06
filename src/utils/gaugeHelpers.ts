import { KpiMetric } from '../types';

export type KpiStatus = 'green' | 'amber' | 'red';

export function getKpiStatus(kpi: KpiMetric, customVal?: number): KpiStatus {
  const val = customVal ?? kpi.value;
  if (!kpi.inverted) {
    // Higher is better
    if (val >= kpi.greenThreshold) return 'green';
    if (val >= kpi.redThreshold) return 'amber';
    return 'red';
  } else {
    // Lower is better (e.g. SAIDI, SAIFI, Losses)
    if (val <= kpi.greenThreshold) return 'green';
    if (val <= kpi.redThreshold) return 'amber';
    return 'red';
  }
}

/**
 * Calculates needle rotation angle in degrees from -135deg to +135deg (270 deg total arc)
 */
export function calculateNeedleAngle(val: number, min: number, max: number): number {
  const clampedVal = Math.max(min, Math.min(max, val));
  const ratio = (clampedVal - min) / (max - min || 1);
  const startAngle = -135;
  const endAngle = 135;
  return startAngle + ratio * (endAngle - startAngle);
}

/**
 * Formats value with appropriate precision
 */
export function formatValue(val: number, unit: string): string {
  if (unit === '%') {
    return val.toFixed(1) + '%';
  }
  if (unit === '/ 5.0') {
    return val.toFixed(2);
  }
  if (val >= 100) {
    return Math.round(val).toLocaleString();
  }
  if (val >= 10) {
    return val.toFixed(1);
  }
  return val.toFixed(2);
}

/**
 * Generates an SVG path for an arc segment given center (cx, cy), radius, startAngle, endAngle
 */
export function describeSvgArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
): string {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return [
    'M', start.x, start.y,
    'A', r, r, 0, largeArcFlag, 0, end.x, end.y
  ].join(' ');
}

function polarToCartesian(cx: number, cy: number, r: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(angleInRadians),
    y: cy + r * Math.sin(angleInRadians)
  };
}
