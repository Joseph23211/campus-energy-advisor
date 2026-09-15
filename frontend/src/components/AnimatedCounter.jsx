import React from 'react';
import { useCountUp } from '../hooks/useCountUp';

export default function AnimatedCounter({ value, decimals = 1, prefix = '', suffix = '', duration = 1200, start = true, className = '' }) {
  const display = useCountUp(value, { duration, decimals, start });
  return (
    <span className={className}>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}
