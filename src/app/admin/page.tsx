'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface Signup {
  _id: string;
  email: string;
  ageRange: string;
  referralCode: string;
  referralCount: number;
  signupIp: string | null;
  referredByEmail: string | null;
  selectionTier: 'early' | 'referral' | null;
  selectedAt: string | null;
  _createdAt: string;
}

interface PartnerInquiry {
  _id: string;
  name: string;
  email: string;
  organization: string | null;
  message: string;
  _createdAt: string;
}

const STORAGE_KEY = 'zneako_admin_secret';
const EARLY_SLOTS = 35;
const REFERRAL_SLOTS = 15;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

async function fetchWithAuth<T>(url: string, secret: string, key: string): Promise<T> {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${secret}` } });
  if (!res.ok) {
    if (res.status === 401) throw new Error('Incorrect password.');
    throw new Error('Something went wrong loading data.');
  }
  const data = await res.json();
  return data[key] as T;
}

export default function AdminPage() {
  const [secret, setSecret] = useState<string | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [tab, setTab] = useState<'waitlist' | 'partners'>('waitlist');

  const [signups, setSignups] = useState<Signup[] | null>(null);
  const [inquiries, setInquiries] = useState<PartnerInquiry[] | null>(null);
  const [loadError, setLoadError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selecting, setSelecting] = useState(false);
  const [selectMessage, setSelectMessage] = useState('');

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) setSecret(stored);
  }, []);

  useEffect(() => {
    if (!secret) return;
    setLoadError('');
    Promise.all([
      fetchWithAuth<Signup[]>('/api/admin/waitlist', secret, 'signups'),
      fetchWithAuth<PartnerInquiry[]>('/api/admin/partner-inquiries', secret, 'inquiries'),
    ])
      .then(([s, i]) => {
        setSignups(s);
        setInquiries(i);
      })
      .catch((err) => {
        if (err.message === 'Incorrect password.') {
          // A stored secret can go stale if ADMIN_SECRET changes elsewhere
          // (e.g. rotated in Vercel) while this browser still has the old
          // one cached — drop back to the login screen with the reason
          // visible there instead of silently clearing to a blank form.
          sessionStorage.removeItem(STORAGE_KEY);
          setSecret(null);
          setAuthError('Your saved password no longer works — please log in again.');
        } else {
          setLoadError(err.message);
        }
      });
  }, [secret]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput || authLoading) return;
    setAuthLoading(true);
    setAuthError('');
    try {
      await fetchWithAuth<Signup[]>('/api/admin/waitlist', passwordInput, 'signups');
      sessionStorage.setItem(STORAGE_KEY, passwordInput);
      setSecret(passwordInput);
      // On mobile, focusing the password field can scroll the page (the
      // keyboard pushes the viewport up); that scroll position otherwise
      // carries over into the dashboard view, making it look like it opened
      // mid-scroll instead of at the top.
      window.scrollTo({ top: 0 });
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setSecret(null);
    setSignups(null);
    setInquiries(null);
    setPasswordInput('');
  };

  const handleDeleteSignup = async (id: string, email: string) => {
    if (!secret) return;
    if (!window.confirm(`Remove ${email} from the waitlist? This can't be undone.`)) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/waitlist/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${secret}` },
      });
      if (!res.ok) throw new Error('Failed to delete signup.');
      setSignups((prev) => (prev ? prev.filter((s) => s._id !== id) : prev));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleRunSelection = async () => {
    if (!secret || selecting) return;
    if (
      !window.confirm(
        `Assign Early Tier to the first ${EARLY_SLOTS} signups and Referral Tier to the top ${REFERRAL_SLOTS} referrers among the rest? Safe to re-run any time as more people sign up.`
      )
    ) {
      return;
    }

    setSelecting(true);
    setSelectMessage('');
    try {
      const res = await fetch('/api/admin/select-winners', {
        method: 'POST',
        headers: { Authorization: `Bearer ${secret}` },
      });
      if (!res.ok) throw new Error('Failed to run selection.');
      const data: { earlySelected: number; referralSelected: number } = await res.json();
      const refreshed = await fetchWithAuth<Signup[]>('/api/admin/waitlist', secret, 'signups');
      setSignups(refreshed);
      setSelectMessage(
        `Done: ${data.earlySelected} early tier, ${data.referralSelected} referral tier.`
      );
    } catch (err) {
      setSelectMessage(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSelecting(false);
    }
  };

  if (!secret) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-lg border border-black/10 bg-white p-8"
        >
          <Image
            src="/brand/zneako-logo-lockup.png"
            alt="Zneako"
            width={719}
            height={163}
            className="h-8 w-auto"
          />
          <p className="mt-4 font-display text-xl font-bold text-zneako-black">Admin</p>
          <p className="mt-1 text-sm text-black/55">Enter the admin password to continue.</p>

          <input
            type="password"
            required
            autoFocus
            placeholder="Password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="mt-6 w-full rounded-md border border-black/15 px-3 py-2 text-base md:text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zneako-orange"
          />

          <button
            type="submit"
            disabled={!passwordInput || authLoading}
            className="mt-4 w-full rounded-sm bg-zneako-black px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-zneako-orange hover:text-zneako-black disabled:opacity-40"
          >
            {authLoading ? 'Checking…' : 'Enter'}
          </button>

          {authError && <p className="mt-3 text-xs text-red-600">{authError}</p>}
        </form>
      </main>
    );
  }

  const earlyCount = signups?.filter((s) => s.selectionTier === 'early').length ?? 0;
  const referralTierCount = signups?.filter((s) => s.selectionTier === 'referral').length ?? 0;

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 sm:py-10 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-4">
          <Image
            src="/brand/zneako-logo-lockup.png"
            alt="Zneako"
            width={719}
            height={163}
            className="h-7 sm:h-8 w-auto shrink-0"
          />
          <button
            onClick={handleLogout}
            className="shrink-0 text-xs uppercase tracking-wide text-black/50 hover:text-zneako-black"
          >
            Log out
          </button>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <button
            onClick={() => setTab('waitlist')}
            className={`rounded-full px-4 py-1.5 text-xs uppercase tracking-wide transition-colors ${
              tab === 'waitlist' ? 'bg-zneako-black text-white' : 'bg-white text-black/50 border border-black/10'
            }`}
          >
            Waitlist{signups ? ` (${signups.length})` : ''}
          </button>
          <button
            onClick={() => setTab('partners')}
            className={`rounded-full px-4 py-1.5 text-xs uppercase tracking-wide transition-colors ${
              tab === 'partners' ? 'bg-zneako-black text-white' : 'bg-white text-black/50 border border-black/10'
            }`}
          >
            Partner Inquiries{inquiries ? ` (${inquiries.length})` : ''}
          </button>
        </div>

        {loadError && <p className="mt-4 text-sm text-red-600">{loadError}</p>}

        {tab === 'waitlist' && signups && (
          <>
            <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-4">
              <div className="rounded-lg border border-black/10 bg-white p-3 sm:p-5">
                <p className="font-display text-lg sm:text-3xl font-bold text-zneako-black">{signups.length}</p>
                <p className="mt-1 text-[10px] sm:text-xs uppercase tracking-wide text-black/50">Total signups</p>
              </div>
              <div className="rounded-lg border border-black/10 bg-white p-3 sm:p-5">
                <p className="font-display text-lg sm:text-3xl font-bold text-zneako-orange-deep">
                  {earlyCount}/{EARLY_SLOTS}
                </p>
                <p className="mt-1 text-[10px] sm:text-xs uppercase tracking-wide text-black/50">Early tier</p>
              </div>
              <div className="rounded-lg border border-black/10 bg-white p-3 sm:p-5">
                <p className="font-display text-lg sm:text-3xl font-bold text-zneako-green-deep">
                  {referralTierCount}/{REFERRAL_SLOTS}
                </p>
                <p className="mt-1 text-[10px] sm:text-xs uppercase tracking-wide text-black/50">Referral tier</p>
              </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <button
                onClick={handleRunSelection}
                disabled={selecting}
                className="self-start rounded-full bg-zneako-black px-4 py-2 text-xs uppercase tracking-wide text-white transition-colors hover:bg-zneako-orange hover:text-zneako-black disabled:opacity-40"
              >
                {selecting ? 'Running…' : 'Run Tier Selection'}
              </button>
              {selectMessage && <p className="text-xs text-black/55">{selectMessage}</p>}
            </div>
            <p className="mt-2 text-[11px] text-black/40 leading-relaxed">
              Early/Referral tier only update when you run this. It&apos;s the first {EARLY_SLOTS} signups for
              Early Tier, and the top {REFERRAL_SLOTS} referrers among everyone else for Referral Tier. Safe
              to re-run any time.
            </p>

            {/* Table on sm+; a stacked card list on mobile instead of a
                horizontally-scrolling table whose extra columns would be
                hidden off-screen with no obvious way to reach them. */}
            <div className="mt-6 sm:mt-8 hidden sm:block overflow-x-auto rounded-lg border border-black/10 bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-black/10 text-left text-xs uppercase tracking-wide text-black/45">
                    <th className="px-4 py-3 font-medium">#</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Age Range</th>
                    <th className="px-4 py-3 font-medium">Signed Up</th>
                    <th className="px-4 py-3 font-medium">Referrals</th>
                    <th className="px-4 py-3 font-medium">Tier</th>
                    <th className="px-4 py-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {signups.map((s, i) => (
                    <tr key={s._id} className="border-b border-black/5 last:border-0">
                      <td className="px-4 py-3 text-black/50">{i + 1}</td>
                      <td className="px-4 py-3 text-zneako-black">{s.email}</td>
                      <td className="px-4 py-3 text-black/65">{s.ageRange}</td>
                      <td className="px-4 py-3 text-black/65">{formatDate(s._createdAt)}</td>
                      <td className="px-4 py-3 text-black/65">{s.referralCount}</td>
                      <td className="px-4 py-3">
                        {s.selectionTier ? (
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs ${
                              s.selectionTier === 'early'
                                ? 'bg-zneako-orange/15 text-zneako-orange-deep'
                                : 'bg-zneako-green/15 text-zneako-green-deep'
                            }`}
                          >
                            {s.selectionTier}
                          </span>
                        ) : (
                          <span className="text-black/30">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleDeleteSignup(s._id, s.email)}
                          disabled={deletingId === s._id}
                          className="text-xs uppercase tracking-wide text-red-600 hover:text-red-800 disabled:opacity-40"
                        >
                          {deletingId === s._id ? 'Removing…' : 'Remove'}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {signups.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-black/40">
                        No signups yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:hidden">
              {signups.map((s, i) => (
                <div key={s._id} className="rounded-lg border border-black/10 bg-white p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-zneako-black break-all">
                      <span className="text-black/40">#{i + 1}</span> {s.email}
                    </p>
                    {s.selectionTier && (
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] uppercase ${
                          s.selectionTier === 'early'
                            ? 'bg-zneako-orange/15 text-zneako-orange-deep'
                            : 'bg-zneako-green/15 text-zneako-green-deep'
                        }`}
                      >
                        {s.selectionTier}
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-black/55">
                    <span>Age {s.ageRange}</span>
                    <span>{formatDate(s._createdAt)}</span>
                    <span>{s.referralCount} referral{s.referralCount === 1 ? '' : 's'}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteSignup(s._id, s.email)}
                    disabled={deletingId === s._id}
                    className="mt-3 text-xs uppercase tracking-wide text-red-600 disabled:opacity-40"
                  >
                    {deletingId === s._id ? 'Removing…' : 'Remove'}
                  </button>
                </div>
              ))}
              {signups.length === 0 && (
                <p className="rounded-lg border border-black/10 bg-white px-4 py-8 text-center text-black/40 text-sm">
                  No signups yet.
                </p>
              )}
            </div>
          </>
        )}

        {tab === 'partners' && inquiries && (
          <>
            <div className="mt-6 sm:mt-8 hidden sm:block overflow-x-auto rounded-lg border border-black/10 bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-black/10 text-left text-xs uppercase tracking-wide text-black/45">
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Company / Organization</th>
                    <th className="px-4 py-3 font-medium">Message</th>
                    <th className="px-4 py-3 font-medium">Received</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map((inq) => (
                    <tr key={inq._id} className="border-b border-black/5 last:border-0 align-top">
                      <td className="px-4 py-3 text-zneako-black whitespace-nowrap">{inq.name}</td>
                      <td className="px-4 py-3 text-black/65 whitespace-nowrap">{inq.email}</td>
                      <td className="px-4 py-3 text-black/65 whitespace-nowrap">{inq.organization || '—'}</td>
                      <td className="px-4 py-3 text-black/65 max-w-sm">{inq.message}</td>
                      <td className="px-4 py-3 text-black/65 whitespace-nowrap">{formatDate(inq._createdAt)}</td>
                    </tr>
                  ))}
                  {inquiries.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-black/40">
                        No partner inquiries yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:hidden">
              {inquiries.map((inq) => (
                <div key={inq._id} className="rounded-lg border border-black/10 bg-white p-4">
                  <p className="text-sm font-semibold text-zneako-black">{inq.name}</p>
                  <p className="mt-0.5 text-xs text-black/55 break-all">{inq.email}</p>
                  {inq.organization && (
                    <p className="mt-0.5 text-xs text-black/55">{inq.organization}</p>
                  )}
                  <p className="mt-2 text-sm text-black/65">{inq.message}</p>
                  <p className="mt-2 text-xs text-black/40">{formatDate(inq._createdAt)}</p>
                </div>
              ))}
              {inquiries.length === 0 && (
                <p className="rounded-lg border border-black/10 bg-white px-4 py-8 text-center text-black/40 text-sm">
                  No partner inquiries yet.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
