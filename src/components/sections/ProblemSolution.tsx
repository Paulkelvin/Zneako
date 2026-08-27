import { Check, Circle } from 'lucide-react';

interface TagPillProps {
  label: string;
  icon?: React.ReactNode;
  tone?: 'neutral' | 'gold';
}

function TagPill({ label, icon, tone = 'neutral' }: TagPillProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-body text-xs tracking-[0.15em] uppercase ${
        tone === 'gold'
          ? 'border-transparent bg-zneako-gold text-zneako-black'
          : 'border-zneako-sand/25 bg-zneako-rubber/40 text-zneako-sand'
      }`}
    >
      {label}
      {icon}
    </span>
  );
}

function Connector() {
  return (
    <div className="flex flex-col items-start pl-5">
      <div className="w-px h-10 md:h-12 bg-gradient-to-b from-zneako-sand/30 to-zneako-gold/40" />
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

export default function ProblemSolution() {
  return (
    <section
      id="discover"
      className="relative bg-zneako-charcoal py-24 md:py-32 px-6 md:px-16 lg:px-24"
    >
      <div className="max-w-2xl">
        <TagPill label="Why Zneako" tone="gold" />
        <h2 className="mt-6 font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] text-zneako-cream">
          A WASTE PROBLEM.
          <br />
          A MATERIAL SOLUTION.
        </h2>
      </div>

      <div className="mt-16 md:mt-20 max-w-2xl">
        <TagPill label="Problem" icon={<Circle className="w-3 h-3" strokeWidth={3} />} />
        <div className="mt-4 rounded-lg border border-zneako-sand/10 bg-zneako-rubber/25 p-8 md:p-10">
          <p className="font-display text-4xl md:text-5xl font-bold text-zneako-cream">
            600,000+
          </p>
          <p className="mt-2 font-body text-sm md:text-base text-zneako-sand/70 leading-relaxed max-w-md">
            tonnes of tyre waste generated in the UK every year, much of it exported or
            processed through environmentally harmful methods.
          </p>
          <p className="mt-6 font-body text-sm text-zneako-sand/50 leading-relaxed border-t border-zneako-sand/10 pt-6">
            In 2020, an illegal tyre stockpile in Bradford caught fire, a stark reminder that
            treating tyre waste as a disposal burden rather than a resource carries real
            environmental and community risk.
          </p>
        </div>

        <Connector />

        <TagPill label="Solution" tone="gold" icon={<Check className="w-3 h-3" strokeWidth={3} />} />
        <div className="mt-4 rounded-lg border border-zneako-gold/20 bg-zneako-black/40 p-8 md:p-10">
          <p className="font-body text-sm md:text-base text-zneako-sand/80 leading-relaxed">
            Zneako redesigns the trainer from the ground up: a single recycled rubber compound
            for the sole and midsole, over-moulded with a simplified upper. Fewer components,
            less manufacturing complexity, and a genuine second life for material that would
            otherwise be burned or buried.
          </p>
          <p className="mt-6 font-display text-lg md:text-xl font-semibold text-zneako-cream leading-snug border-l-2 border-zneako-gold pl-5">
            &ldquo;Every step begins with purpose. Our sole is more than design, it&apos;s our
            commitment to a better future.&rdquo;
          </p>
        </div>
      </div>

      <div className="mt-16 md:mt-20 max-w-4xl">
        <TagPill label="In Practice" />
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.label}
              className="rounded-lg border border-zneako-sand/10 bg-zneako-rubber/20 p-6"
            >
              <p className="font-display text-base font-semibold text-zneako-cream">
                {pillar.label}
              </p>
              <p className="mt-1.5 font-body text-xs text-zneako-sand/60 leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
