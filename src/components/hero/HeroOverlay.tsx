'use client';

import { useMemo } from 'react';

interface HeroOverlayProps {
  progress: number;
}

export default function HeroOverlay({ progress }: HeroOverlayProps) {
  const phase = useMemo(() => {
    if (progress < 0.15) return 'scattered';
    if (progress < 0.5) return 'gathering';
    if (progress < 0.8) return 'forming';
    return 'complete';
  }, [progress]);

  const initialOpacity = progress < 0.2
    ? 1 - progress / 0.2
    : 0;

  const finalOpacity = progress > 0.7
    ? (progress - 0.7) / 0.3
    : 0;

  const ctaOpacity = progress > 0.85
    ? (progress - 0.85) / 0.15
    : 0;

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between">
      {/* Top: Initial tagline — fades out as particles gather */}
      <div
        className="pt-[15vh] px-6 md:px-16 lg:px-24"
        style={{ opacity: initialOpacity }}
      >
        <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] max-w-[14ch]">
          WHAT&apos;S LEFT BEHIND
          <br />
          CAN MOVE US
          <br />
          FORWARD.
        </h1>
        <p className="mt-6 font-body text-sm md:text-base text-zneako-sand/70 max-w-md tracking-wide">
          Scroll to discover
        </p>
      </div>

      {/* Bottom: Final state — fades in as shoe forms */}
      <div
        className="pb-[12vh] px-6 md:px-16 lg:px-24"
        style={{ opacity: finalOpacity }}
      >
        <p className="font-display text-lg md:text-2xl lg:text-3xl font-semibold tracking-tight text-zneako-cream mb-3">
          GIVING RUBBER A SECOND LIFE.
        </p>
        <p className="font-body text-sm md:text-base text-zneako-sand/80 max-w-lg leading-relaxed">
          Durable children&apos;s trainers made with reclaimed tyre rubber.
        </p>

        {/* CTA */}
        <div
          className="mt-8 pointer-events-auto"
          style={{ opacity: ctaOpacity }}
        >
          <a
            href="#discover"
            className="group inline-flex items-center gap-3 font-display text-sm md:text-base font-semibold tracking-[0.15em] uppercase text-zneako-cream border border-zneako-sand/30 px-8 py-4 rounded-sm transition-all duration-500 hover:bg-zneako-sand/10 hover:border-zneako-sand/60"
          >
            Discover Zneako
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
              &rarr;
            </span>
          </a>
        </div>
      </div>

      {/* Scroll progress indicator */}
      <div className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
        <div className="w-px h-24 bg-zneako-sand/20 relative overflow-hidden">
          <div
            className="absolute top-0 left-0 w-full bg-zneako-sand/60 transition-none"
            style={{ height: `${progress * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
