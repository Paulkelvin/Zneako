'use client';

export default function HeroOverlay() {
  return (
    <div className="relative flex-1 md:flex-none md:absolute md:inset-0 md:flex md:items-center pointer-events-none z-10">
      <div className="max-w-xl px-6 py-8 md:py-0 md:px-16 lg:px-24">
        <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] max-w-[14ch]">
          WHAT&apos;S LEFT BEHIND
          <br />
          CAN MOVE US
          <br />
          FORWARD.
        </h1>

        <p className="mt-5 md:mt-6 font-body text-sm md:text-base text-zneako-sand/80 max-w-md leading-relaxed">
          Turning end-of-life tyre rubber into durable children&apos;s footwear.
        </p>

        <div className="mt-8 pointer-events-auto">
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

        <p className="mt-10 font-display text-xs md:text-sm font-semibold tracking-[0.15em] uppercase text-zneako-sand/50">
          Giving rubber a second life.
        </p>
        <p className="mt-2 font-body text-xs text-zneako-sand/40 max-w-sm leading-relaxed">
          Developed with the University of Bradford&apos;s Polymer Institute.
        </p>
      </div>
    </div>
  );
}
