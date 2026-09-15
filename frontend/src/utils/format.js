export function formatSigned(value, unit = '') {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}${unit}`;
}

export function statusColor(level) {
  switch (level) {
    case 'low':
      return { text: 'text-current-teal', bg: 'bg-current-teal', ring: 'ring-current-teal/30' };
    case 'moderate':
      return { text: 'text-current-amber', bg: 'bg-current-amber', ring: 'ring-current-amber/30' };
    default:
      return { text: 'text-current-coral', bg: 'bg-current-coral', ring: 'ring-current-coral/30' };
  }
}

export function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}
