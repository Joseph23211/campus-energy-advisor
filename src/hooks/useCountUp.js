import { useEffect, useRef, useState } from 'react';

// Animates a number from 0 to `value` over `duration` ms once `start` is true.
export function useCountUp(value, { duration = 1200, decimals = 1, start = true } = {}) {
  const [display, setDisplay] = useState(0);
  const frame = useRef(null);

  useEffect(() => {
    if (!start) return undefined;
    const startTime = performance.now();
    const from = 0;
    const to = value;

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = from + (to - from) * eased;
      setDisplay(Number(current.toFixed(decimals)));
      if (progress < 1) {
        frame.current = requestAnimationFrame(tick);
      }
    }

    frame.current = requestAnimationFrame(tick);
    return () => frame.current && cancelAnimationFrame(frame.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration, decimals, start]);

  return display;
}
