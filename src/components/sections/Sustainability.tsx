import { ShieldCheck } from 'lucide-react';
import TagPill from '@/components/shared/TagPill';

const SDGS = [
  {
    number: 12,
    title: 'Responsible Consumption & Production',
    description: 'Diverting tyre waste from landfill and incineration into a reusable material stream.',
  },
  {
    number: 13,
    title: 'Climate Action',
    description: 'Recycling rubber instead of burning or landfilling it cuts the carbon and emissions impact.',
  },
  {
    number: 9,
    title: 'Industry, Innovation & Infrastructure',
    description: "Developed with the University of Bradford's Polymer Institute: genuine innovation, not a claim.",
  },
  {
    number: 11,
    title: 'Sustainable Cities & Communities',
    description: 'Turning a community hazard, like the 2020 Bradford tyre fire, into a community resource.',
  },
  {
    number: 4,
    title: 'Quality Education',
    description: 'School and lab workshops make circular design tangible for children and families.',
  },
];

const CERTIFICATIONS = [
  { name: 'GRS', description: 'Global Recycled Standard: chain-of-custody for recycled tyre-rubber content.' },
  { name: 'SEDEX & SMETA', description: 'Supplier due diligence and ethical/environmental audits.' },
  { name: 'UK REACH', description: 'Product testing and compliance review ahead of launch.' },
  { name: 'ISO 14001', description: 'Environmental management principles across sourcing and production.' },
];

export default function Sustainability() {
  return (
    <section className="relative bg-zneako-cream py-24 md:py-32 px-6 md:px-16 lg:px-24">
      <div className="max-w-2xl mx-auto text-center">
        <TagPill
          label="Sustainability & Compliance"
          tone="green"
          icon={<ShieldCheck className="w-3 h-3" strokeWidth={2.5} />}
        />
        <h2 className="mt-6 font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] text-zneako-black">
          BUILT ON STANDARDS,
          <br />
          NOT CLAIMS.
        </h2>
        <p className="mt-4 font-body text-sm text-black/60 leading-relaxed">
          Our approach maps directly to five UN Sustainable Development Goals, and to the
          compliance frameworks we&apos;re building toward ahead of commercial launch.
        </p>
      </div>

      <div className="mt-16 md:mt-20 max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {SDGS.map((sdg) => (
          <div
            key={sdg.number}
            className="rounded-lg border border-zneako-green/25 bg-white p-5"
          >
            <span className="font-display text-xs font-bold tracking-[0.1em] text-zneako-green-deep">
              SDG {sdg.number}
            </span>
            <p className="mt-2 font-display text-sm font-semibold text-zneako-black leading-snug">
              {sdg.title}
            </p>
            <p className="mt-2 font-body text-xs text-black/55 leading-relaxed">
              {sdg.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-16 md:mt-20 max-w-5xl mx-auto border-t border-black/10 pt-12 md:pt-16">
        <div className="flex items-center justify-between gap-4">
          <p className="font-body text-xs tracking-[0.15em] uppercase text-black/50">
            Compliance Frameworks
          </p>
          <p className="font-body text-xs text-black/35 italic">Working toward, ahead of launch</p>
        </div>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CERTIFICATIONS.map((cert) => (
            <div
              key={cert.name}
              className="rounded-lg border border-black/10 bg-white p-5"
            >
              <p className="font-display text-sm font-semibold text-zneako-black">{cert.name}</p>
              <p className="mt-1.5 font-body text-xs text-black/55 leading-relaxed">
                {cert.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
