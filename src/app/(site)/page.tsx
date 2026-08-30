import HeroSection from '@/components/hero/HeroSection';
import ProblemSolution from '@/components/sections/ProblemSolution';
import HowItWorks from '@/components/sections/HowItWorks';
import TeamStory from '@/components/sections/TeamStory';
import Waitlist from '@/components/sections/Waitlist';
import Sustainability from '@/components/sections/Sustainability';
import Footer from '@/components/sections/Footer';

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <HeroSection />
      <ProblemSolution />
      <HowItWorks />
      <TeamStory />
      <Waitlist />
      <Sustainability />
      <Footer />
    </main>
  );
}
