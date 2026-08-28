import { Trash2, Recycle, Layers, Footprints, ArrowRight, ArrowDown } from 'lucide-react';
import TagPill from '@/components/shared/TagPill';

const STEPS = [
  { icon: Trash2, label: 'Tyre Waste', description: 'Reclaimed from end-of-life tyres.' },
  {
    icon: Recycle,
    label: 'Recycled Rubber Compound',
    description: 'Processed at the Polymer Institute.',
  },
  { icon: Layers, label: 'Moulded Sole', description: 'One compound, sole to midsole.' },
  { icon: Footprints, label: 'Finished Trainer', description: 'Ready for a child to wear.' },
];

function Step({ step, index }: { step: (typeof STEPS)[number]; index: number }) {
  return (
    <div className="flex md:flex-col items-center md:text-center gap-5 md:gap-0 md:w-40">
      <div className="shrink-0 flex flex-col items-center">
        <div className="w-14 h-14 rounded-full border border-zneako-gold/30 bg-zneako-rubber/25 flex items-center justify-center">
          <step.icon className="w-6 h-6 text-zneako-gold" strokeWidth={1.75} />
        </div>
        <p className="mt-2 font-body text-xs text-zneako-sand/40">
          {String(index + 1).padStart(2, '0')}
        </p>
      </div>

      <div className="md:mt-4">
        <p className="font-display text-sm font-semibold text-zneako-cream">{step.label}</p>
        <p className="mt-1 font-body text-xs text-zneako-sand/50 leading-relaxed">
          {step.description}
        </p>
      </div>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section className="relative bg-zneako-black py-24 md:py-32 px-6 md:px-16 lg:px-24">
      <div className="max-w-2xl mx-auto text-center">
        <TagPill label="How It Works" tone="gold" />
        <h2 className="mt-6 font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] text-zneako-cream">
          FROM WASTE
          <br />
          TO WEAR.
        </h2>
      </div>

      <div className="mt-16 md:mt-20 max-w-5xl mx-auto flex flex-col md:flex-row md:items-start md:justify-between gap-8 md:gap-0">
        {STEPS.map((step, i) => (
          <div key={step.label} className="flex flex-col items-center md:contents">
            <Step step={step} index={i} />
            {i < STEPS.length - 1 && (
              <>
                <div className="hidden md:flex items-center justify-center flex-1 pt-7">
                  <ArrowRight className="w-4 h-4 text-zneako-sand/25" strokeWidth={1.75} />
                </div>
                <div className="md:hidden flex flex-col items-center w-14 py-1">
                  <ArrowDown className="w-4 h-4 text-zneako-sand/25" strokeWidth={1.75} />
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
