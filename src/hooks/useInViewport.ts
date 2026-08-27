'use client';

import { useEffect, useState, type RefObject } from 'react';

// True only while the element is on-screen AND the tab itself is visible —
// used to pause the hero animation/render loop when it can't be seen.
export function useInViewport(
  ref: RefObject<HTMLElement | null>,
  threshold: number = 0.25
): boolean {
  const [intersecting, setIntersecting] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting),
      { threshold }
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, [ref, threshold]);

  useEffect(() => {
    const onVisibilityChange = () => setTabVisible(!document.hidden);
    onVisibilityChange();
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, []);

  return intersecting && tabVisible;
}
