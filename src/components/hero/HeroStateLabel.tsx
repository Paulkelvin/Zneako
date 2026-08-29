'use client';

interface HeroStateLabelProps {
  progress: number;
}

const STAGES = ['Tyre Waste', 'Breaking Down', 'Recycled Rubber', 'New Trainer'];

// Each entry is [start, end] of that stage's fully-visible window, with a
// short fade at each edge. Different-length strings centered on top of
// each other during a continuous crossfade read as garbled (letters from
// both strings interleaving), so windows are sequential with a brief gap
// between them rather than overlapping — one is always fully gone before
// the next starts fading in. Boundaries match the visual state changes
// driven by `progress` elsewhere: the tyre pile is fully gone by ~0.45
// (see TyrePile's `progress > 0.45` early-return) and the shoe reads as
// essentially formed by ~0.85.
const EDGE = 0.03;
const WINDOWS: [number, number][] = [
  [-1, 0.13],
  [0.15, 0.45],
  [0.47, 0.81],
  [0.83, 2],
];

function fadeWindow(p: number, start: number, end: number): number {
  if (p <= start || p >= end) return 0;
  if (p < start + EDGE) return (p - start) / EDGE;
  if (p > end - EDGE) return (end - p) / EDGE;
  return 1;
}

// Names the current state of the tyre-to-shoe transformation so the story
// is legible without relying on a visitor already knowing what the
// animation represents.
export default function HeroStateLabel({ progress }: HeroStateLabelProps) {
  return (
    <div className="absolute inset-x-0 bottom-10 flex items-center justify-center pointer-events-none z-10">
      <div className="relative h-5 flex items-center">
        {STAGES.map((label, i) => (
          <span
            key={label}
            className="absolute inset-0 flex items-center justify-center gap-2 font-display text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-zneako-black/55 whitespace-nowrap"
            style={{ opacity: fadeWindow(progress, WINDOWS[i][0], WINDOWS[i][1]) }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-zneako-orange shrink-0" />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
