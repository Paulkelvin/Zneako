import { Trash2, Recycle, Layers, Footprints, ArrowRight, ArrowDown } from 'lucide-react';
import TagPill from '@/components/shared/TagPill';

const STEPS = [
  { icon: Trash2, label: 'Tyre Waste', description: 'Reclaimed from end-of-life tyres.', tone: 'orange' as const },
  {
    icon: Recycle,
    label: 'Recycled Rubber Compound',
    description: 'Processed at the Polymer Institute.',
    tone: 'orange' as const,
  },
  { icon: Layers, label: 'Moulded Sole', description: 'One compound, sole to midsole.', tone: 'green' as const },
  { icon: Footprints, label: 'Finished Trainer', description: 'Ready for a child to wear.', tone: 'green' as const },
];

function Step({ step, index }: { step: (typeof STEPS)[number]; index: number }) {
  const isOrange = step.tone === 'orange';
  return (
    <div className="flex md:flex-col items-center md:text-center gap-5 md:gap-0 w-full max-w-xs md:w-40 md:max-w-none mx-auto md:mx-0">
      <div className="shrink-0 relative">
        <div
          className={`w-24 h-24 rounded-full border-2 flex items-center justify-center ${
            isOrange ? 'border-zneako-orange bg-zneako-orange/10' : 'border-zneako-green bg-zneako-green/10'
          }`}
        >
          <step.icon
            className={`w-10 h-10 ${isOrange ? 'text-zneako-orange-deep' : 'text-zneako-green-deep'}`}
            strokeWidth={1.5}
          />
        </div>
        <span className="absolute -bottom-1 -right-1 flex items-center justify-center w-6 h-6 rounded-full bg-white border border-black/10 font-body text-[10px] text-black/45">
          {index + 1}
        </span>
      </div>

      <div className="md:mt-4">
        <p className="font-display text-sm font-semibold text-zneako-black">{step.label}</p>
        <p className="mt-1 font-body text-xs text-black/55 leading-relaxed">{step.description}</p>
      </div>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section className="relative bg-white py-24 md:py-32 px-6 md:px-16 lg:px-24">
      <div className="max-w-2xl mx-auto text-center">
        <TagPill label="How It Works" tone="orange" />
        <h2 className="mt-6 font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] text-zneako-black">
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
                <div className="hidden md:flex items-center justify-center flex-1 pt-9">
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
