'use client';

import { useEffect, useState } from 'react';

// True once the page has scrolled past `threshold` — used to switch the
// header from a transparent hero overlay to a solid/blurred bar.
export function useScrolled(threshold: number = 10): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return scrolled;
}
