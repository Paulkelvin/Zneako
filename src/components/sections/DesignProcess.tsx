import Image from 'next/image';
import TagPill from '@/components/shared/TagPill';

const CONCEPTS = [
  {
    src: '/concept/design-sketch.jpg',
    alt: 'Early industrial design sketch of a Zneako trainer, annotated with build notes',
    caption: 'Every silhouette starts as a sketch, refined for comfort, durability and purpose.',
  },
  {
    src: '/concept/sole-technology.jpg',
    alt: 'Cutaway illustration of the Zneako recycled-rubber sole, showing grip pattern and construction',
    caption: 'The sole is where the recycled rubber does its work: grip, durability and a lighter footprint.',
  },
];

export default function DesignProcess() {
  return (
    <section className="relative bg-white py-24 md:py-32 px-6 md:px-16 lg:px-24">
      <div className="max-w-2xl mx-auto text-center">
        <TagPill label="Design Process" tone="orange" />
        <h2 className="mt-6 font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] text-zneako-black">
          FROM SKETCH
          <br />
          TO SOLE.
        </h2>
        <p className="mt-4 font-body text-sm text-black/60 leading-relaxed">
          A look at the design work behind the product: the concept sketches and the sole
          engineering that turns recycled rubber into a trainer.
        </p>
      </div>

      <div className="mt-16 md:mt-20 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
        {CONCEPTS.map((concept) => (
          <div key={concept.src}>
            <div className="relative aspect-square rounded-2xl overflow-hidden border border-black/10">
              <Image
                src={concept.src}
                alt={concept.alt}
                fill
                sizes="(min-width: 768px) 45vw, 90vw"
                className="object-cover"
              />
            </div>
            <p className="mt-4 font-body text-sm text-black/60 leading-relaxed text-center">
              {concept.caption}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
