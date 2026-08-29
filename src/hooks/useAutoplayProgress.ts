'use client';

import { useEffect, useRef, useState } from 'react';

// Cycle segments, in seconds — mirrors the forward tyre→shoe morph back
// down to rubber→tyre using the same progress-driven shaders, just fed
// in reverse. Sped up from an original ~15s: most visitors scroll past
// the hero within a few seconds, so a slow cycle meant many never saw
// the transformation happen at all.
const HOLD_TYRE = 1.0;
const FORWARD = 3.2;
const HOLD_SHOE = 1.0;
const REVERSE = 2.8;
const CYCLE = HOLD_TYRE + FORWARD + HOLD_SHOE + REVERSE;

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function progressAt(cycleTime: number): number {
  if (cycleTime < HOLD_TYRE) return 0;

  const afterHoldTyre = cycleTime - HOLD_TYRE;
  if (afterHoldTyre < FORWARD) {
    return easeInOutCubic(afterHoldTyre / FORWARD);
  }

  const afterForward = afterHoldTyre - FORWARD;
  if (afterForward < HOLD_SHOE) return 1;

  const afterHoldShoe = afterForward - HOLD_SHOE;
  return 1 - easeInOutCubic(Math.min(1, afterHoldShoe / REVERSE));
}

// Time-based replacement for scroll-driven progress: continuously loops
// tyre -> rubber -> shoe -> rubber -> tyre while `playing`, and freezes
// in place (no accumulated jump) whenever it isn't.
export function useAutoplayProgress(playing: boolean): number {
  const [progress, setProgress] = useState(0);
  const cycleTimeRef = useRef(0);
  const lastTsRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const tick = (ts: number) => {
      if (lastTsRef.current === null) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;

      if (playing) {
        cycleTimeRef.current = (cycleTimeRef.current + dt) % CYCLE;
        setProgress(progressAt(cycleTimeRef.current));
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      lastTsRef.current = null;
    };
  }, [playing]);

  return progress;
}
