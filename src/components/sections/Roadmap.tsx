import { Sprout, FlaskConical, Rocket, RefreshCw, Globe2, ArrowRight, ArrowDown } from 'lucide-react';
import TagPill from '@/components/shared/TagPill';

const STAGES = [
  {
    icon: Sprout,
    label: 'Foundation & Material R&D',
    description: 'Brand foundations, sustainable material research and our first prototype.',
    current: true,
  },
  {
    icon: FlaskConical,
    label: 'Prototyping & Testing',
    description: 'Refining the compound, testing durability, building early community awareness.',
  },
  {
    icon: Rocket,
    label: 'Market Launch',
    description: 'E-commerce, campaigns, partnerships and first customer sales.',
  },
  {
    icon: RefreshCw,
    label: 'Growth & Feedback',
    description: 'Customer feedback, product improvement, new designs and personalisation.',
  },
  {
    icon: Globe2,
    label: 'Scale & Impact',
    description: 'Expanded production and partnerships, with measurable environmental impact.',
  },
];

function Stage({ stage, index }: { stage: (typeof STAGES)[number]; index: number }) {
  return (
    <div className="flex md:flex-col items-center md:text-center gap-5 md:gap-0 w-full max-w-xs md:w-40 md:max-w-none mx-auto md:mx-0">
      <div className="shrink-0 relative">
        <div
          className={`w-16 h-16 rounded-full border-2 flex items-center justify-center ${
            stage.current
              ? 'border-zneako-orange bg-zneako-orange/10'
              : 'border-black/15 bg-white'
          }`}
        >
          <stage.icon
            className={`w-6 h-6 ${stage.current ? 'text-zneako-orange-deep' : 'text-black/40'}`}
            strokeWidth={1.5}
          />
        </div>
        <span className="absolute bottom-0 right-0 flex items-center justify-center w-5 h-5 rounded-full bg-white border border-black/10 font-body text-[9px] text-black/45">
          {index + 1}
        </span>
      </div>

      <div className="md:mt-4">
        {stage.current && (
          <span className="inline-block mb-1.5 rounded-full bg-zneako-orange/15 px-2.5 py-0.5 font-body text-[10px] tracking-[0.1em] uppercase text-zneako-orange-deep">
            You are here
          </span>
        )}
        <p className="font-display text-sm font-semibold text-zneako-black">{stage.label}</p>
        <p className="mt-1 font-body text-xs text-black/55 leading-relaxed">{stage.description}</p>
      </div>
    </div>
  );
}

export default function Roadmap() {
  return (
    <section className="relative bg-zneako-cream py-24 md:py-32 px-6 md:px-16 lg:px-24">
      <div className="max-w-2xl mx-auto text-center">
        <TagPill label="Roadmap" tone="orange" />
        <h2 className="mt-6 font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] text-zneako-black">
          FROM PROTOTYPE
          <br />
          TO IMPACT.
        </h2>
        <p className="mt-4 font-body text-sm text-black/60 leading-relaxed">
          We&apos;re early, building the foundation, the material, and the first pair, before
          moving into launch and scale.
        </p>
      </div>

      <div className="mt-16 md:mt-20 max-w-5xl mx-auto flex flex-col md:flex-row md:items-start md:justify-between gap-8 md:gap-0">
        {STAGES.map((stage, i) => (
          <div key={stage.label} className="flex flex-col items-center md:contents">
            <Stage stage={stage} index={i} />
            {i < STAGES.length - 1 && (
              <>
                <div className="hidden md:flex items-center justify-center flex-1 pt-8">
                  <ArrowRight className="w-4 h-4 text-black/20" strokeWidth={1.75} />
                </div>
                <div className="md:hidden flex flex-col items-center w-14 py-1">
                  <ArrowDown className="w-4 h-4 text-black/20" strokeWidth={1.75} />
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
