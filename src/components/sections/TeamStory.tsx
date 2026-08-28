import { Award } from 'lucide-react';
import TagPill from '@/components/shared/TagPill';

interface TeamMember {
  name: string;
  role: string;
  bio?: string;
}

const TEAM: TeamMember[] = [
  {
    name: 'Oluwabusayo Idowu',
    role: 'Co-Founder & Commercial Lead',
    bio: 'Leads product translation, market validation and commercial development, making sure the science becomes something families actually want.',
  },
  {
    name: 'Dr Rob Innie',
    role: 'CTO, Polymer Institute, University of Bradford',
    bio: 'Leads the technical work on rubber compounding, processing and prototype development.',
  },
  {
    name: 'Professor Klaus Pors',
    role: 'Academic Co-Founder, Institute of Cancer Therapeutics',
    bio: 'Provides strategic oversight, ensuring alignment with research, innovation and commercialisation priorities.',
  },
  {
    name: 'Bonnie Clyde',
    role: 'Innovation Officer',
  },
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
      <div className="max-w-2xl">
        <TagPill label="Our Story" tone="gold" />
        <h2 className="mt-6 font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] text-zneako-cream">
          THE PEOPLE BEHIND
          <br />
          THE PURPOSE.
        </h2>
      </div>

      <div className="mt-12 md:mt-16 max-w-3xl">
        <p className="font-display text-xl md:text-2xl lg:text-3xl font-semibold text-zneako-cream leading-snug border-l-2 border-zneako-gold pl-6 md:pl-8">
          Zneako started with a simple, uncomfortable fact: the UK throws away over 600,000
          tonnes of tyres every year, much of it incinerated or dumped rather than reused. In
          2020, an illegal tyre stockpile fire in Bradford made that risk impossible to ignore.
          We asked a different question: what if that waste wasn&apos;t a disposal problem, but a
          material waiting for a second life?
        </p>
        <p className="mt-6 pl-6 md:pl-8 font-body text-sm md:text-base text-zneako-sand/70 leading-relaxed max-w-2xl">
          Working with rubber-recycling researchers at the University of Bradford&apos;s Polymer
          Institute, we&apos;re turning end-of-life tyre rubber into durable, sustainable soles,
          starting with children&apos;s footwear. Every part you don&apos;t see, the sole beneath
          their feet, carries the same purpose as the part you do: a genuine commitment to a
          better future.
        </p>

        <div className="mt-6 pl-6 md:pl-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-zneako-sand/20 bg-zneako-rubber/30 px-4 py-1.5 font-body text-xs text-zneako-sand/70">
            <Award className="w-3.5 h-3.5 text-zneako-gold" strokeWidth={1.75} />
            Recipient of a rapid funding grant to support prototyping
          </span>
        </div>
      </div>

      <div className="mt-16 md:mt-20 max-w-6xl">
        <TagPill label="The Team" />
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {TEAM.map((member) => (
            <div
              key={member.name}
              className="rounded-lg border border-zneako-sand/10 bg-zneako-rubber/20 p-6"
            >
              <div className="w-14 h-14 rounded-full bg-zneako-gold/10 border border-zneako-gold/30 flex items-center justify-center">
                <span className="font-display text-base font-bold text-zneako-gold">
                  {initials(member.name)}
                </span>
              </div>
              <p className="mt-4 font-display text-base font-semibold text-zneako-cream">
                {member.name}
              </p>
              <p className="mt-1 font-body text-xs text-zneako-sand/50">{member.role}</p>
              {member.bio && (
                <p className="mt-3 font-body text-xs text-zneako-sand/60 leading-relaxed">
                  {member.bio}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
