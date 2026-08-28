import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { sanityServerClient } from '@/lib/sanityServer';
import { resend, WAITLIST_FROM_EMAIL } from '@/lib/resend';
import { waitlistConfirmationEmail } from '@/lib/waitlistEmail';

const AGE_RANGES = ['2-4', '5-7', '8-10', '11-13'];

const RATE_LIMIT_WINDOW_HOURS = 24;
const RATE_LIMIT_MAX_PER_IP = 5;

function generateReferralCode(): string {
  return randomBytes(4).toString('hex');
}

function getClientIp(req: NextRequest): string | null {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip');
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
  const ip = getClientIp(req);

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

  if (ip) {
    const windowStart = new Date(
      Date.now() - RATE_LIMIT_WINDOW_HOURS * 60 * 60 * 1000
    ).toISOString();
    const recentFromIp = await sanityServerClient.fetch<number>(
      `count(*[_type == "waitlistSignup" && signupIp == $ip && _createdAt > $windowStart])`,
      { ip, windowStart }
    );
    if (recentFromIp >= RATE_LIMIT_MAX_PER_IP) {
      return NextResponse.json(
        { error: 'Too many signups from this network. Please try again later.' },
        { status: 429 }
      );
    }
  }

  let referrer: { _id: string; email: string; signupIp: string | null } | null = null;
  if (ref) {
    referrer = await sanityServerClient.fetch<
      { _id: string; email: string; signupIp: string | null } | null
    >(`*[_type == "waitlistSignup" && referralCode == $ref][0]{ _id, email, signupIp }`, { ref });
  }

  // Same-device signups don't earn the referrer credit — deters someone padding
  // their own referral count with throwaway emails from the same network.
  const referralIsSelfReferral = Boolean(referrer && ip && referrer.signupIp === ip);
  const effectiveReferrer = referralIsSelfReferral ? null : referrer;

  const referralCode = generateReferralCode();

  const created = await sanityServerClient.create({
    _type: 'waitlistSignup',
    email,
    ageRange,
    referralCode,
    referralCount: 0,
    ...(ip ? { signupIp: ip } : {}),
    ...(effectiveReferrer ? { referredBy: { _type: 'reference', _ref: effectiveReferrer._id } } : {}),
  });

  if (effectiveReferrer) {
    await sanityServerClient.patch(effectiveReferrer._id).inc({ referralCount: 1 }).commit();
  }

  if (resend) {
    const { subject, html, text } = waitlistConfirmationEmail({
      referralCode: created.referralCode,
      origin: req.nextUrl.origin,
    });
    try {
      await resend.emails.send({ from: WAITLIST_FROM_EMAIL, to: email, subject, html, text });
    } catch (err) {
      console.error('Failed to send waitlist confirmation email', err);
    }
  }

  return NextResponse.json({
    referralCode: created.referralCode,
    referralCount: 0,
    alreadyJoined: false,
  });
}
