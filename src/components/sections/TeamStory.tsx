import { Award } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
}

const TEAM: TeamMember[] = [
  { name: 'Oluwabusayo Idowu', role: 'Co-Founder & Commercial Lead' },
  { name: 'Dr Rob Innie', role: 'CTO, Polymer Institute, University of Bradford' },
  { name: 'Professor Klaus Pors', role: 'Academic Co-Founder, Institute of Cancer Therapeutics' },
  { name: 'Bonnie Clyde', role: 'Innovation Officer' },
];

const TITLES = new Set(['dr', 'prof', 'professor', 'mr', 'mrs', 'ms']);

function initials(name: string): string {
  const words = name.split(' ').filter((w) => w && !TITLES.has(w.toLowerCase().replace('.', '')));
  const first = words[0]?.[0] ?? '';
  const last = words.length > 1 ? words[words.length - 1][0] : '';
  return (first + last).toUpperCase();
}

export default function TeamStory() {
  return (
    <section className="relative bg-zneako-black py-24 md:py-32 px-6 md:px-16 lg:px-24">
      <div className="max-w-2xl mx-auto text-center">
        <span className="font-body text-xs tracking-[0.2em] uppercase text-zneako-gold">
          Our Story
        </span>
        <h2 className="mt-4 font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] text-zneako-cream">
          THE PEOPLE BEHIND
          <br />
          THE PURPOSE.
        </h2>

        <p className="mt-6 font-body text-sm md:text-base text-zneako-sand/70 leading-relaxed">
          Zneako started with a simple, uncomfortable fact: the UK throws away over 600,000
          tonnes of tyres every year, much of it incinerated or dumped rather than reused. In
          2020, an illegal tyre stockpile fire in Bradford made that risk impossible to ignore. We
          asked a different question: what if that waste wasn&apos;t a disposal problem, but a
          material waiting for a second life?
        </p>
        <p className="mt-4 font-body text-sm md:text-base text-zneako-sand/70 leading-relaxed">
          Working with rubber-recycling researchers at the University of Bradford&apos;s Polymer
          Institute, we&apos;re turning end-of-life tyre rubber into durable, sustainable soles,
          starting with children&apos;s footwear. Every part you don&apos;t see carries the same
          purpose as the part you do: a genuine commitment to a better future.
        </p>

        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-zneako-sand/20 px-4 py-1.5 font-body text-xs text-zneako-sand/70">
          <Award className="w-3.5 h-3.5 text-zneako-gold" strokeWidth={1.75} />
          Recipient of a rapid funding grant to support prototyping
        </div>
      </div>

      <div className="mt-16 md:mt-20 max-w-5xl mx-auto border-t border-zneako-sand/10 pt-16 md:pt-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
          {TEAM.map((member) => (
            <div key={member.name} className="text-center">
              <div className="aspect-square md:aspect-[4/5] rounded-lg bg-zneako-rubber/25 flex items-center justify-center">
                <span className="font-display text-2xl font-bold text-zneako-gold/70">
                  {initials(member.name)}
                </span>
              </div>
              <p className="mt-4 font-display text-base font-semibold text-zneako-cream">
                {member.name}
              </p>
              <p className="mt-1 font-body text-xs text-zneako-sand/50">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
