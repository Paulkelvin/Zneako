'use client';

import { useRef } from 'react';
import dynamic from 'next/dynamic';
import { useScrollProgress } from '@/hooks/useScrollProgress';
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
  const progress = useScrollProgress(containerRef);

  return (
    <section
      ref={containerRef}
      className="relative"
      style={{ height: '250vh' }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <HeroScene progress={progress} />
        <HeroOverlay progress={progress} />

        {/* Vignette overlay for depth */}
        <div
          className="absolute inset-0 pointer-events-none z-20"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10,10,10,0.6) 100%)',
          }}
        />
      </div>
    </section>
  );
}
