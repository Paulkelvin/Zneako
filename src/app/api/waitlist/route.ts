import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { sanityServerClient } from '@/lib/sanityServer';

const AGE_RANGES = ['2-4', '5-7', '8-10', '11-13'];

function generateReferralCode(): string {
  return randomBytes(4).toString('hex');
}

export async function POST(req: NextRequest) {
  let body: { email?: string; ageRange?: string; ref?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const ageRange = body.ageRange;
  const ref = body.ref?.trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'A valid email is required' }, { status: 400 });
  }
  if (!ageRange || !AGE_RANGES.includes(ageRange)) {
    return NextResponse.json({ error: 'A valid age range is required' }, { status: 400 });
  }

  const existing = await sanityServerClient.fetch<
    { _id: string; referralCode: string; referralCount: number } | null
  >(
    `*[_type == "waitlistSignup" && email == $email][0]{ _id, referralCode, referralCount }`,
    { email }
  );

  if (existing) {
    return NextResponse.json({
      referralCode: existing.referralCode,
      referralCount: existing.referralCount ?? 0,
      alreadyJoined: true,
    });
  }

  let referrer: { _id: string } | null = null;
  if (ref) {
    referrer = await sanityServerClient.fetch<{ _id: string } | null>(
      `*[_type == "waitlistSignup" && referralCode == $ref][0]{ _id }`,
      { ref }
    );
  }

  const referralCode = generateReferralCode();

  const created = await sanityServerClient.create({
    _type: 'waitlistSignup',
    email,
    ageRange,
    referralCode,
    referralCount: 0,
    ...(referrer ? { referredBy: { _type: 'reference', _ref: referrer._id } } : {}),
  });

  if (referrer) {
    await sanityServerClient.patch(referrer._id).inc({ referralCount: 1 }).commit();
  }

  return NextResponse.json({
    referralCode: created.referralCode,
    referralCount: 0,
    alreadyJoined: false,
  });
}
