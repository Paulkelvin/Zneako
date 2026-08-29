'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useAutoplayProgress } from '@/hooks/useAutoplayProgress';
import { useInViewport } from '@/hooks/useInViewport';
import HeroOverlay from './HeroOverlay';
import HeroStateLabel from './HeroStateLabel';

const ScenePlaceholder = () => (
  <div className="absolute inset-0 bg-white flex items-center justify-center">
    <div className="w-1 h-1 bg-zneako-orange/50 rounded-full animate-pulse" />
  </div>
);

const HeroScene = dynamic(() => import('./HeroScene'), {
  ssr: false,
  loading: ScenePlaceholder,
});

// The Three.js/postprocessing chunk this pulls in is ~680KB uncompressed —
// on its own it's fine, but fetching it in the same breath as the page's
// critical text/font/CSS requests makes them compete for bandwidth on a
// slow connection, delaying the content that actually needs to paint first.
// Deferring the import to the browser's idle slot lets the critical path
// win that race; the placeholder already looks identical either way.
function useDeferredMount(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setReady(true), { timeout: 1500 });
      return () => w.cancelIdleCallback?.(id);
    }

    const id = window.setTimeout(() => setReady(true), 200);
    return () => window.clearTimeout(id);
  }, []);

  return ready;
}

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisible = useInViewport(containerRef, 0.25);
  const progress = useAutoplayProgress(isVisible);
  const sceneReady = useDeferredMount();

  return (
    <section
      ref={containerRef}
      className="relative w-full flex flex-col md:block overflow-hidden bg-white min-h-[100dvh] md:h-screen md:max-h-[110vh]"
    >
      {/* Text/buttons first on mobile (stacked flow); on desktop both are
          absolutely positioned and overlaid, so DOM order doesn't matter
          there — HeroOverlay's z-10 already keeps it above the scene. */}
      <HeroOverlay />

      {/* 3D transformation — full-bleed on desktop, upper portion on mobile.
          dvh (not vh) matters here: mobile Safari sizes vh against the
          largest possible viewport (toolbar collapsed), so on page load —
          when the address bar is still expanded — a vh box renders taller
          than what's actually visible, pushing the art below the fold. */}
      <div className="relative h-[56dvh] shrink-0 md:absolute md:inset-0 md:h-auto">
        {sceneReady ? (
          <HeroScene progress={progress} playing={isVisible} />
        ) : (
          <ScenePlaceholder />
        )}
        <HeroStateLabel progress={progress} />
      </div>
    </section>
  );
}
