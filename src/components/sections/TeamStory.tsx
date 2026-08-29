import Image from 'next/image';
import { Award } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  photo?: string;
}

const TEAM: TeamMember[] = [
  {
    name: 'Oluwabusayo Idowu',
    role: 'Co-Founder & Commercial Lead',
    photo: '/team/oluwabusayo-idowu.png',
  },
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
    <section className="relative bg-white py-24 md:py-32 px-6 md:px-16 lg:px-24">
      <div className="max-w-2xl mx-auto text-center">
        <span className="font-body text-xs tracking-[0.2em] uppercase text-zneako-orange-deep">
          Our Story
        </span>
        <h2 className="mt-4 font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] text-zneako-black">
          THE PEOPLE BEHIND
          <br />
          THE PURPOSE.
        </h2>

        <p className="mt-6 font-body text-sm md:text-base text-black/65 leading-relaxed">
          Zneako started with a simple, uncomfortable fact: the UK throws away over 600,000
          tonnes of tyres every year, much of it incinerated or dumped rather than reused. In
          2020, an illegal tyre stockpile fire in Bradford made that risk impossible to ignore. We
          asked a different question: what if that waste wasn&apos;t a disposal problem, but a
          material waiting for a second life?
        </p>
        <p className="mt-4 font-body text-sm md:text-base text-black/65 leading-relaxed">
          Working with rubber-recycling researchers at the University of Bradford&apos;s Polymer
          Institute, we&apos;re turning end-of-life tyre rubber into durable, sustainable soles,
          starting with children&apos;s footwear. Every part you don&apos;t see carries the same
          purpose as the part you do: a genuine commitment to a better future.
        </p>

        <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-zneako-orange/25 bg-zneako-orange/8 py-1.5 pl-1.5 pr-5">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-zneako-orange shrink-0">
            <Award className="w-3.5 h-3.5 text-zneako-black" strokeWidth={2} />
          </span>
          <span className="font-body text-xs text-black/70">
            Recipient of a rapid funding grant to support prototyping
          </span>
        </div>
      </div>

      <div className="mt-16 md:mt-20 max-w-5xl mx-auto border-t border-black/10 pt-16 md:pt-20">
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 -mx-6 px-6 scroll-pl-6 md:mx-0 md:px-0 md:grid md:grid-cols-4 md:gap-10 md:overflow-visible [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {TEAM.map((member) => (
            <div key={member.name} className="shrink-0 w-64 snap-start md:w-auto text-center">
              <div className="relative aspect-[4/5] rounded-lg overflow-hidden flex items-center justify-center bg-zneako-cream">
                {member.photo ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      sizes="(min-width: 768px) 25vw, 60vw"
                      className="object-cover object-top scale-110 origin-top"
                    />
                  </div>
                ) : (
                  <span className="font-display text-2xl font-bold text-zneako-orange">
                    {initials(member.name)}
                  </span>
                )}
              </div>
              <p className="mt-4 font-display text-base font-semibold text-zneako-black">
                {member.name}
              </p>
              <p className="mt-1 font-body text-xs text-black/55">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
