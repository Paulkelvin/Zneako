import HeroSection from '@/components/hero/HeroSection';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <section
        id="discover"
        className="min-h-screen bg-zneako-charcoal flex items-center justify-center"
      >
        <p className="font-body text-zneako-sand/40 text-sm tracking-widest uppercase">
          More coming soon
        </p>
      </section>
    </main>
  );
}
