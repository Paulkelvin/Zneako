'use client';

import { useRef } from 'react';
import dynamic from 'next/dynamic';
import { useAutoplayProgress } from '@/hooks/useAutoplayProgress';
import { useInViewport } from '@/hooks/useInViewport';
import HeroOverlay from './HeroOverlay';

const HeroScene = dynamic(() => import('./HeroScene'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-zneako-black flex items-center justify-center">
      <div className="w-1 h-1 bg-zneako-sand/40 rounded-full animate-pulse" />
    </div>
  ),
});

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisible = useInViewport(containerRef, 0.25);
  const progress = useAutoplayProgress(isVisible);

  return (
    <section
      ref={containerRef}
      className="relative w-full flex flex-col md:block overflow-hidden bg-zneako-black min-h-[100dvh] md:h-screen md:max-h-[110vh]"
    >
      {/* 3D transformation — full-bleed on desktop, upper portion on mobile */}
      <div className="relative h-[56vh] shrink-0 md:absolute md:inset-0 md:h-auto">
        <HeroScene progress={progress} playing={isVisible} />
      </div>

      <HeroOverlay />

      {/* Vignette overlay for depth */}
      <div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10,10,10,0.6) 100%)',
        }}
      />
    </section>
  );
}
