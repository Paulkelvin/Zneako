'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';

const AGE_RANGES = [
  { label: '2–4 yrs', value: '2-4' },
  { label: '5–7 yrs', value: '5-7' },
  { label: '8–10 yrs', value: '8-10' },
  { label: '11–13 yrs', value: '11-13' },
];

function Perforation() {
  return (
    <>
      <div
        className="hidden md:block w-px shrink-0"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(200,184,145,0.35) 1.5px, transparent 1.5px)',
          backgroundSize: '1px 14px',
          backgroundRepeat: 'repeat-y',
        }}
      />
      <div
        className="md:hidden h-px w-full"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(200,184,145,0.35) 1.5px, transparent 1.5px)',
          backgroundSize: '14px 1px',
          backgroundRepeat: 'repeat-x',
        }}
      />
    </>
  );
}

type SubmitState = 'idle' | 'loading' | 'success' | 'error';

export default function Waitlist() {
  const [email, setEmail] = useState('');
  const [ageRange, setAgeRange] = useState<string | null>(null);
  const [state, setState] = useState<SubmitState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [referralCount, setReferralCount] = useState(0);
  const [refParam, setRefParam] = useState<string | null>(null);
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    setRefParam(new URLSearchParams(window.location.search).get('ref'));
    setOrigin(window.location.origin);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !ageRange || state === 'loading') return;

    setState('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, ageRange, ref: refParam }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error ?? 'Something went wrong. Please try again.');
        setState('error');
        return;
      }

      setReferralCode(data.referralCode);
      setReferralCount(data.referralCount ?? 0);
      setState('success');
    } catch {
      setErrorMessage('Something went wrong. Please try again.');
      setState('error');
    }
  };

  return (
    <section
      id="waitlist"
      className="relative bg-zneako-charcoal py-24 md:py-32 px-6 md:px-16 lg:px-24"
    >
      <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden border border-zneako-sand/10 bg-zneako-rubber/20 flex flex-col md:flex-row">
        {/* Pitch half */}
        <div className="flex-1 p-8 md:p-12">
          <span className="font-body text-xs tracking-[0.2em] uppercase text-zneako-gold">
            Limited Access
          </span>
          <h2 className="mt-4 font-display text-2xl md:text-3xl font-bold tracking-tight leading-[1.15] text-zneako-cream">
            BE ONE OF THE
            <br />
            FIRST 50.
          </h2>
          <p className="mt-4 font-body text-sm text-zneako-sand/70 leading-relaxed">
            We&apos;re giving away our first 50 pairs, completely free, to the families who join
            our waitlist first. No cost, just early access to help shape the future of sustainable
            footwear.
          </p>

          <div className="mt-10 mb-4 relative w-44 h-28">
            <div className="absolute inset-0 rounded-lg border border-zneako-gold/15 bg-zneako-charcoal rotate-[10deg] translate-x-2 -translate-y-2" />
            <div className="absolute inset-0 rounded-lg border border-zneako-gold/25 bg-zneako-charcoal rotate-[5deg] translate-x-1 -translate-y-1" />
            <div className="absolute inset-0 flex flex-col justify-center rounded-lg border border-zneako-gold/50 bg-zneako-charcoal px-6 py-4 -rotate-2">
              <p className="font-display text-4xl font-bold text-zneako-gold leading-none">50</p>
              <p className="mt-1 font-body text-[0.65rem] tracking-[0.15em] uppercase text-zneako-sand/60">
                Pairs Available
              </p>
            </div>
          </div>
        </div>

        <Perforation />

        {/* Claim half */}
        <div className="flex-1 p-8 md:p-12 bg-zneako-black/30">
          {state !== 'success' ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div>
                <label
                  htmlFor="waitlist-email"
                  className="block font-body text-xs tracking-[0.1em] uppercase text-zneako-sand/60 mb-2"
                >
                  Email
                </label>
                <Input
                  id="waitlist-email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-zneako-sand/20 text-zneako-cream placeholder:text-zneako-sand/30 focus-visible:ring-zneako-gold"
                />
              </div>

              <div>
                <span className="block font-body text-xs tracking-[0.1em] uppercase text-zneako-sand/60 mb-2">
                  Child&apos;s age range
                </span>
                <div className="flex flex-wrap gap-2">
                  {AGE_RANGES.map((range) => (
                    <button
                      key={range.value}
                      type="button"
                      onClick={() => setAgeRange(range.value)}
                      className={`rounded-full border px-4 py-1.5 font-body text-xs transition-colors ${
                        ageRange === range.value
                          ? 'border-transparent bg-zneako-gold text-zneako-black'
                          : 'border-zneako-sand/20 text-zneako-sand/70 hover:border-zneako-sand/40'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={!email || !ageRange || state === 'loading'}
                className="mt-2 inline-flex items-center justify-center gap-3 font-display text-sm font-semibold tracking-[0.15em] uppercase text-zneako-cream border border-zneako-sand/30 px-8 py-4 rounded-sm transition-all duration-500 hover:bg-zneako-sand/10 hover:border-zneako-sand/60 disabled:opacity-40 disabled:pointer-events-none"
              >
                {state === 'loading' ? 'Claiming…' : 'Claim Your Spot'}
                <span aria-hidden>&rarr;</span>
              </button>

              {state === 'error' && (
                <p className="font-body text-xs text-red-400">{errorMessage}</p>
              )}

              <p className="font-body text-xs text-zneako-sand/40 leading-relaxed">
                By joining, you&apos;ll receive occasional updates about Zneako. No spam.
              </p>
            </form>
          ) : (
            <div className="flex flex-col gap-6">
              <div>
                <p className="font-display text-lg font-semibold text-zneako-cream">
                  You&apos;re on the list.
                </p>
                <p className="mt-1 font-body text-sm text-zneako-sand/60 leading-relaxed md:hidden">
                  Share your link to boost your chances.
                </p>
                <p className="mt-1 font-body text-sm text-zneako-sand/60 leading-relaxed hidden md:block">
                  The first 35 signups get a free pair, guaranteed. The next 15 pairs go to our
                  top referrers — share your link to boost your chances.
                </p>
              </div>

              <div className="rounded-lg border border-zneako-sand/15 bg-zneako-rubber/20 px-4 py-3">
                <p className="font-body text-xs tracking-[0.1em] uppercase text-zneako-sand/50">
                  Your referral link
                </p>
                <p className="mt-1 font-body text-sm text-zneako-gold truncate">
                  {origin.replace(/^https?:\/\//, '')}/?ref={referralCode}
                </p>
              </div>

              <div className="flex items-baseline gap-2">
                <p className="font-display text-2xl font-bold text-zneako-gold">{referralCount}</p>
                <p className="font-body text-xs tracking-[0.1em] uppercase text-zneako-sand/50">
                  {referralCount === 1 ? 'family referred' : 'families referred'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
