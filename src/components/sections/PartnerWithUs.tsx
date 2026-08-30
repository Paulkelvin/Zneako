'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type SubmitState = 'idle' | 'loading' | 'success' | 'error';

export default function PartnerWithUs() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [message, setMessage] = useState('');
  const [state, setState] = useState<SubmitState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message || state === 'loading') return;

    setState('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/partner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, organization, message }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error ?? 'Something went wrong. Please try again.');
        setState('error');
        return;
      }

      setState('success');
    } catch {
      setErrorMessage('Something went wrong. Please try again.');
      setState('error');
    }
  };

  return (
    <section
      id="partner"
      className="relative bg-zneako-black py-24 md:py-32 px-6 md:px-16 lg:px-24"
    >
      <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden border border-white/10 bg-zneako-black flex flex-col md:flex-row">
        <div className="flex-1 p-8 md:p-12">
          <span className="font-body text-xs tracking-[0.2em] uppercase text-zneako-orange">
            Investors
          </span>
          <h2 className="mt-4 font-display text-2xl md:text-3xl font-bold tracking-tight leading-[1.15] text-white">
            PARTNER WITH US.
          </h2>
          <p className="mt-4 font-body text-sm text-white/65 leading-relaxed">
            We&apos;re building the case for recycled-rubber footwear from the ground up, with a
            university research partner and a working prototype. If you&apos;re backing early-stage
            sustainable manufacturing, we&apos;d like to talk.
          </p>
        </div>

        <div className="flex-1 p-8 md:p-12 bg-white/[0.03] border-t md:border-t-0 md:border-l border-white/10">
          {state !== 'success' ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label
                  htmlFor="partner-name"
                  className="block font-body text-xs tracking-[0.1em] uppercase text-white/50 mb-2"
                >
                  Name
                </label>
                <Input
                  id="partner-name"
                  type="text"
                  required
                  maxLength={200}
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-white/15 text-white placeholder:text-white/30 focus-visible:ring-zneako-orange"
                />
              </div>

              <div>
                <label
                  htmlFor="partner-email"
                  className="block font-body text-xs tracking-[0.1em] uppercase text-white/50 mb-2"
                >
                  Email
                </label>
                <Input
                  id="partner-email"
                  type="email"
                  required
                  maxLength={254}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-white/15 text-white placeholder:text-white/30 focus-visible:ring-zneako-orange"
                />
              </div>

              <div>
                <label
                  htmlFor="partner-org"
                  className="block font-body text-xs tracking-[0.1em] uppercase text-white/50 mb-2"
                >
                  Company / Organization
                </label>
                <Input
                  id="partner-org"
                  type="text"
                  maxLength={200}
                  placeholder="Optional"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="border-white/15 text-white placeholder:text-white/30 focus-visible:ring-zneako-orange"
                />
              </div>

              <div>
                <label
                  htmlFor="partner-message"
                  className="block font-body text-xs tracking-[0.1em] uppercase text-white/50 mb-2"
                >
                  Message
                </label>
                <Textarea
                  id="partner-message"
                  required
                  rows={3}
                  maxLength={5000}
                  placeholder="Tell us a bit about your interest."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="border-white/15 text-white placeholder:text-white/30 focus-visible:ring-zneako-orange"
                />
              </div>

              <button
                type="submit"
                disabled={!name || !email || !message || state === 'loading'}
                className="mt-2 inline-flex items-center justify-center gap-3 font-display text-sm font-semibold tracking-[0.15em] uppercase text-zneako-black bg-zneako-orange px-8 py-4 rounded-sm transition-all duration-500 hover:bg-white disabled:opacity-40 disabled:pointer-events-none"
              >
                {state === 'loading' ? 'Sending…' : 'Send Inquiry'}
                <span aria-hidden>&rarr;</span>
              </button>

              {state === 'error' && (
                <p className="font-body text-xs text-red-400">{errorMessage}</p>
              )}
            </form>
          ) : (
            <div>
              <p className="font-display text-lg font-semibold text-white">Thanks for reaching out.</p>
              <p className="mt-1 font-body text-sm text-white/60 leading-relaxed">
                We&apos;ve received your message and will get back to you directly.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
