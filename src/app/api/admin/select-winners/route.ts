import { NextRequest, NextResponse } from 'next/server';
import { sanityServerClient } from '@/lib/sanityServer';

const EARLY_SLOTS = 35;
const REFERRAL_SLOTS = 15;

type Signup = {
  _id: string;
  _createdAt: string;
  referralCount: number;
};

// Recomputes selection from scratch every run, so it's safe to re-run as more
// signups come in before the cutoff — it never just appends to a prior result.
export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const all = await sanityServerClient.fetch<Signup[]>(
    `*[_type == "waitlistSignup"] | order(_createdAt asc) { _id, _createdAt, "referralCount": coalesce(referralCount, 0) }`
  );

  const earlyTier = all.slice(0, EARLY_SLOTS);
  const earlyIds = new Set(earlyTier.map((s) => s._id));

  const referralPool = all
    .filter((s) => !earlyIds.has(s._id) && s.referralCount > 0)
    .sort((a, b) => {
      if (b.referralCount !== a.referralCount) return b.referralCount - a.referralCount;
      return new Date(a._createdAt).getTime() - new Date(b._createdAt).getTime();
    });
  const referralTier = referralPool.slice(0, REFERRAL_SLOTS);
  const referralIds = new Set(referralTier.map((s) => s._id));

  const selectedAt = new Date().toISOString();
  const tx = sanityServerClient.transaction();

  for (const s of all) {
    if (earlyIds.has(s._id)) {
      tx.patch(s._id, { set: { selectionTier: 'early', selectedAt } });
    } else if (referralIds.has(s._id)) {
      tx.patch(s._id, { set: { selectionTier: 'referral', selectedAt } });
    } else {
      tx.patch(s._id, { unset: ['selectionTier', 'selectedAt'] });
    }
  }

  await tx.commit();

  return NextResponse.json({
    totalSignups: all.length,
    earlySelected: earlyTier.length,
    referralSelected: referralTier.length,
    totalSelected: earlyTier.length + referralTier.length,
  });
}
