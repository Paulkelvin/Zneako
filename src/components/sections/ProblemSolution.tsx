import { ArrowDown, Check, Circle, ImageIcon } from 'lucide-react';
import TagPill from '@/components/shared/TagPill';

function Connector() {
  return (
    <div className="flex flex-col items-start pl-5">
      <div className="w-px h-10 md:h-12 bg-gradient-to-b from-black/15 to-zneako-orange/50" />
    </div>
  );
}

const PILLARS = [
  {
    label: 'Enhanced Grip',
    description: 'More control, every step.',
  },
  {
    label: 'Made With Recycled Rubber',
    description: 'One compound, sole to midsole.',
  },
  {
    label: 'Built to Last',
    description: 'Built to leave a lighter footprint.',
  },
];

function TransformationPlaceholder() {
  return (
    <div>
      <TagPill label="The Transformation" />
      <div className="mt-4 rounded-lg border border-black/10 bg-zneako-cream overflow-hidden">
        <div className="relative flex flex-col aspect-[4/5]">
          <div className="flex-1 flex flex-col items-center justify-center gap-3 border-b border-black/10 p-6 text-center">
            <ImageIcon className="w-6 h-6 text-black/25" strokeWidth={1.5} />
            <div>
              <p className="font-body text-xs tracking-[0.15em] uppercase text-black/40">
                Before
              </p>
              <p className="mt-1 font-body text-xs text-black/35">Reclaimed tyre rubber</p>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center gap-3 p-6 text-center">
            <ImageIcon className="w-6 h-6 text-zneako-green" strokeWidth={1.5} />
            <div>
              <p className="font-body text-xs tracking-[0.15em] uppercase text-zneako-green-deep">
                After
              </p>
              <p className="mt-1 font-body text-xs text-black/40">Finished Zneako sole</p>
            </div>
          </div>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-zneako-black border border-zneako-orange/50 flex items-center justify-center">
            <ArrowDown className="w-4 h-4 text-zneako-orange" strokeWidth={2} />
          </div>
        </div>
      </div>
      <p className="mt-3 font-body text-xs text-black/35 italic">
        Prototype photography coming soon.
      </p>
    </div>
  );
}

export default function ProblemSolution() {
  return (
    <section
      id="discover"
      className="relative bg-white py-24 md:py-32 px-6 md:px-16 lg:px-24"
    >
      <div className="max-w-2xl">
        <TagPill label="Why Zneako" tone="orange" />
        <h2 className="mt-6 font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] text-zneako-black">
          A WASTE PROBLEM.
          <br />
          A MATERIAL SOLUTION.
        </h2>
      </div>

      <div className="mt-16 md:mt-20 flex flex-col md:flex-row md:justify-between md:items-start gap-10 md:gap-16">
        <div className="max-w-xl">
          <TagPill label="Problem" icon={<Circle className="w-3 h-3" strokeWidth={3} />} />
          <div className="mt-4 rounded-lg border border-black/10 bg-zneako-cream p-8 md:p-10">
            <p className="font-display text-4xl md:text-5xl font-bold text-zneako-black">
              600,000+
            </p>
            <p className="mt-2 font-body text-sm md:text-base text-black/70 leading-relaxed max-w-md">
              tonnes of tyre waste generated in the UK every year, much of it exported or
              processed through environmentally harmful methods.
            </p>
            <p className="mt-6 font-body text-sm text-black/55 leading-relaxed border-t border-black/10 pt-6">
              In 2020, an illegal tyre stockpile in Bradford caught fire, a stark reminder that
              treating tyre waste as a disposal burden rather than a resource carries real
              environmental and community risk.
            </p>
          </div>

          <Connector />

          <TagPill label="Solution" tone="orange" icon={<Check className="w-3 h-3" strokeWidth={3} />} />
          <div className="mt-4 rounded-lg border border-zneako-orange/25 bg-zneako-black p-8 md:p-10">
            <p className="font-body text-sm md:text-base text-white/85 leading-relaxed">
              Zneako redesigns the trainer from the ground up: a single recycled rubber compound
              for the sole and midsole, over-moulded with a simplified upper. Fewer components,
              less manufacturing complexity, and a genuine second life for material that would
              otherwise be burned or buried.
            </p>
            <p className="mt-6 font-display text-lg md:text-xl font-semibold text-white leading-snug border-l-2 border-zneako-orange pl-5">
              &ldquo;Every step begins with purpose. Our sole is more than design, it&apos;s our
              commitment to a better future.&rdquo;
            </p>
          </div>
        </div>

        <div className="w-full md:w-80 lg:w-96 shrink-0 md:sticky md:top-28">
          <TransformationPlaceholder />
        </div>
      </div>

      <div className="mt-16 md:mt-20 max-w-6xl">
        <TagPill label="In Practice" />
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.label}
              className="rounded-lg border border-black/10 bg-zneako-cream p-6"
            >
              <p className="font-display text-base font-semibold text-zneako-black">
                {pillar.label}
              </p>
              <p className="mt-1.5 font-body text-xs text-black/60 leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
