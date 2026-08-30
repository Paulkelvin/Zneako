'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowDown } from 'lucide-react';
import TagPill from '@/components/shared/TagPill';

const AFTER_VIEWS = [
  { key: 'tread', label: 'Tread', src: '/transformation/after-sole-tread.jpg' },
  { key: 'top', label: 'Top', src: '/transformation/after-sole-top.jpg' },
] as const;

type AfterViewKey = (typeof AFTER_VIEWS)[number]['key'];

export default function TransformationShowcase() {
  const [afterView, setAfterView] = useState<AfterViewKey>('tread');
  const activeAfter = AFTER_VIEWS.find((v) => v.key === afterView) ?? AFTER_VIEWS[0];

  return (
    <div>
      <TagPill label="The Transformation" />
      <div className="mt-4 rounded-lg border border-black/10 bg-zneako-cream overflow-hidden">
        <div className="relative flex flex-col aspect-[4/5]">
          <div className="relative flex-1 border-b border-black/10">
            <Image
              src="/transformation/before-tyre-rubber.jpg"
              alt="Reclaimed tyre rubber"
              fill
              sizes="(min-width: 768px) 24rem, 100vw"
              className="object-cover"
            />
            <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 font-body text-[10px] tracking-[0.15em] uppercase text-black/60">
              Before
            </span>
          </div>

          <div className="relative flex-1">
            <Image
              src={activeAfter.src}
              alt="Finished Zneako sole"
              fill
              sizes="(min-width: 768px) 24rem, 100vw"
              className="object-cover"
            />
            <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 font-body text-[10px] tracking-[0.15em] uppercase text-zneako-green-deep">
              After
            </span>
            <div className="absolute right-3 top-3 flex gap-0.5 rounded-full bg-white/90 p-0.5">
              {AFTER_VIEWS.map((view) => (
                <button
                  key={view.key}
                  type="button"
                  onClick={() => setAfterView(view.key)}
                  aria-pressed={view.key === afterView}
                  className={`rounded-full px-2.5 py-1 font-body text-[10px] tracking-wide transition-colors ${
                    view.key === afterView ? 'bg-zneako-black text-white' : 'text-black/50 hover:text-black/70'
                  }`}
                >
                  {view.label}
                </button>
              ))}
            </div>
          </div>

          <div className="absolute left-1/2 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-zneako-orange/50 bg-zneako-black">
            <ArrowDown className="h-4 w-4 text-zneako-orange" strokeWidth={2} />
          </div>
        </div>
      </div>
    </div>
  );
}
