'use client';

export default function HeroOverlay() {
  return (
    <div className="relative pt-20 md:pt-0 md:absolute md:inset-0 md:flex md:items-center pointer-events-none z-10">
      <div className="max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-5xl px-6 py-5 md:py-0 md:px-16 lg:px-24">
        <h1 className="font-display text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.1] text-zneako-black">
          WHAT&apos;S LEFT BEHIND
          <br />
          CAN MOVE US FORWARD.
        </h1>

        <p className="mt-4 md:mt-6 font-body text-base md:text-lg text-black/70 max-w-md leading-relaxed">
          Turning end-of-life tyre rubber into durable children&apos;s footwear.
        </p>

        <div className="mt-6 md:mt-8 pointer-events-auto">
          <a
            href="#discover"
            className="group inline-flex items-center gap-3 font-display text-sm md:text-base font-semibold tracking-[0.15em] uppercase text-zneako-black border border-black/20 px-8 py-4 rounded-sm transition-all duration-500 hover:bg-zneako-orange hover:text-zneako-black hover:border-zneako-orange"
          >
            Discover Zneako
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
              &rarr;
            </span>
          </a>
        </div>

        <p className="mt-6 md:mt-10 font-display text-xs md:text-sm font-semibold tracking-[0.15em] uppercase text-zneako-orange">
          Giving rubber a second life.
        </p>
        <p className="mt-1 md:mt-2 font-body text-xs text-black/45 max-w-sm leading-relaxed">
          Developed with the University of Bradford&apos;s Polymer Institute.
        </p>
      </div>
    </div>
  );
}
