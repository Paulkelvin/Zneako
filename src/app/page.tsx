import HeroSection from '@/components/hero/HeroSection';
import ProblemSolution from '@/components/sections/ProblemSolution';
import TeamStory from '@/components/sections/TeamStory';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ProblemSolution />
      <TeamStory />
    </main>
  );
}
