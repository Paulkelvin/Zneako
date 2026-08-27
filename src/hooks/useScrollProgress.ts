'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

export function useScrollProgress(
  containerRef: React.RefObject<HTMLElement | null>,
  enabled: boolean = true
): number {
  const [progress, setProgress] = useState(0);
  const smoothProgressRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const handleScroll = useCallback(() => {
    if (!containerRef.current || !enabled) return;

    const rect = containerRef.current.getBoundingClientRect();
    const containerTop = rect.top;
    const containerHeight = rect.height;
    const viewportHeight = window.innerHeight;

    const scrollableDistance = containerHeight - viewportHeight;
    if (scrollableDistance <= 0) return;

    const rawProgress = -containerTop / scrollableDistance;
    const clampedProgress = Math.max(0, Math.min(1, rawProgress));

    if (rafRef.current !== null) return;

    rafRef.current = requestAnimationFrame(() => {
      const lerp = 0.08;
      smoothProgressRef.current += (clampedProgress - smoothProgressRef.current) * lerp;

      if (Math.abs(clampedProgress - smoothProgressRef.current) > 0.001) {
        smoothProgressRef.current += (clampedProgress - smoothProgressRef.current) * lerp;
      } else {
        smoothProgressRef.current = clampedProgress;
      }

      setProgress(smoothProgressRef.current);
      rafRef.current = null;
    });
  }, [containerRef, enabled]);

  useEffect(() => {
    if (!enabled) return;

    const onScroll = () => handleScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const interval = setInterval(() => {
      if (containerRef.current) handleScroll();
    }, 16);

    return () => {
      window.removeEventListener('scroll', onScroll);
      clearInterval(interval);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [handleScroll, enabled, containerRef]);

  return progress;
}
