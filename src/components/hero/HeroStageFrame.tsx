// Decorative "stage" behind the tyre-to-shoe transformation: a soft glow
// plus a dashed ring, roughly framing where the 3D art actually sits (see
// HeroScene's offsetX/offsetY) so the animation reads as a distinct,
// intentional showcase rather than blending into the page background.
// Positioning is eyeballed against real screenshots, not derived from the
// Three.js world-space offsets directly — the two coordinate systems don't
// map cleanly, and "roughly frames it" is the bar here, not pixel-perfect.
export default function HeroStageFrame() {
  return (
    <div
      className="absolute inset-0 pointer-events-none flex items-center justify-start md:justify-end"
      aria-hidden="true"
    >
      <div className="relative w-[82%] aspect-square max-w-[420px] -translate-y-[6%] md:translate-y-0 md:mr-8 lg:mr-20 xl:mr-28">
        <div
          className="absolute inset-[-18%] rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(247,148,29,0.14) 0%, rgba(247,148,29,0.05) 45%, transparent 70%)',
          }}
        />
        <div className="absolute inset-0 rounded-full border border-dashed border-zneako-orange/30" />
      </div>
    </div>
  );
}
