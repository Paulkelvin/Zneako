import { NextRequest, NextResponse } from 'next/server';
import { randomBytes, createHash } from 'crypto';
import { sanityServerClient } from '@/lib/sanityServer';
import { resend, WAITLIST_FROM_EMAIL } from '@/lib/resend';
import { waitlistConfirmationEmail } from '@/lib/waitlistEmail';
import { waitlistSignupNotificationEmail } from '@/lib/waitlistNotificationEmail';
import { getClientIp, isRateLimited } from '@/lib/rateLimit';

const AGE_RANGES = ['2-4', '5-7', '8-10', '11-13'];
const MAX_EMAIL_LENGTH = 254; // RFC 5321
const RATE_LIMIT_WINDOW_HOURS = 24;
const RATE_LIMIT_MAX_PER_IP = 5;

function generateReferralCode(): string {
  return randomBytes(4).toString('hex');
}

// Deterministic per-email document id, so createIfNotExists below is the
// single source of truth for "does this email already have a signup" —
// closes the race where two concurrent requests for the same email could
// both pass a separate existence check and both create a document.
function waitlistDocId(email: string): string {
  return `waitlistSignup-${createHash('sha256').update(email).digest('hex').slice(0, 40)}`;
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { email: rawEmail, ageRange, ref: rawRef } = body as {
    email?: unknown;
    ageRange?: unknown;
    ref?: unknown;
  };

  const email = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : undefined;
  const ref = typeof rawRef === 'string' ? rawRef.trim() : undefined;
  const ip = getClientIp(req);

  if (
    !email ||
    email.length > MAX_EMAIL_LENGTH ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return NextResponse.json({ error: 'A valid email is required' }, { status: 400 });
  }
  if (typeof ageRange !== 'string' || !AGE_RANGES.includes(ageRange)) {
    return NextResponse.json({ error: 'A valid age range is required' }, { status: 400 });
  }

  const docId = waitlistDocId(email);

  try {
    const existing = await sanityServerClient.fetch<
      { referralCode: string; referralCount: number } | null
    >(`*[_id == $docId][0]{ referralCode, referralCount }`, { docId });

    if (existing) {
      const totalSignups = await sanityServerClient.fetch<number>(
        `count(*[_type == "waitlistSignup"])`
      );
      return NextResponse.json({
        referralCode: existing.referralCode,
        referralCount: existing.referralCount ?? 0,
        totalSignups,
        alreadyJoined: true,
      });
    }

    if (ip) {
      const limited = await isRateLimited({
        type: 'waitlistSignup',
        ip,
        windowHours: RATE_LIMIT_WINDOW_HOURS,
        max: RATE_LIMIT_MAX_PER_IP,
      });
      if (limited) {
        return NextResponse.json(
          { error: 'Too many signups from this network. Please try again later.' },
          { status: 429 }
        );
      }
    }

    let referrer: { _id: string; signupIp: string | null } | null = null;
    if (ref) {
      referrer = await sanityServerClient.fetch<{ _id: string; signupIp: string | null } | null>(
        `*[_type == "waitlistSignup" && referralCode == $ref][0]{ _id, signupIp }`,
        { ref }
      );
    }

    // Same-device signups don't earn the referrer credit — deters someone padding
    // their own referral count with throwaway emails from the same network.
    const referralIsSelfReferral = Boolean(referrer && ip && referrer.signupIp === ip);
    const effectiveReferrer = referralIsSelfReferral ? null : referrer;

    const referralCode = generateReferralCode();
    const newDoc = {
      _id: docId,
      _type: 'waitlistSignup' as const,
      email,
      ageRange,
      referralCode,
      referralCount: 0,
      ...(ip ? { signupIp: ip } : {}),
      ...(effectiveReferrer ? { referredBy: { _type: 'reference', _ref: effectiveReferrer._id } } : {}),
    };

    // createIfNotExists + the referrer patch commit atomically together —
    // if two concurrent requests race for the same email, only one create
    // wins; the other is a harmless no-op against the same document id.
    const tx = sanityServerClient.transaction().createIfNotExists(newDoc);
    if (effectiveReferrer) {
      tx.patch(effectiveReferrer._id, { inc: { referralCount: 1 } });
    }
    await tx.commit();

    const created = await sanityServerClient.fetch<{ referralCode: string }>(
      `*[_id == $docId][0]{ referralCode }`,
      { docId }
    );

    const totalSignups = await sanityServerClient.fetch<number>(
      `count(*[_type == "waitlistSignup"])`
    );

    if (resend) {
      const { subject, html, text } = waitlistConfirmationEmail({
        referralCode: created.referralCode,
        origin: req.nextUrl.origin,
        totalSignups,
      });
      try {
        await resend.emails.send({ from: WAITLIST_FROM_EMAIL, to: email, subject, html, text });
      } catch (err) {
        console.error('Failed to send waitlist confirmation email', err);
      }

      const notifyDestination = process.env.ADMIN_NOTIFICATION_EMAIL;
      if (notifyDestination) {
        const notification = waitlistSignupNotificationEmail({ email, ageRange, totalSignups });
        try {
          await resend.emails.send({
            from: WAITLIST_FROM_EMAIL,
            to: notifyDestination,
            subject: notification.subject,
            html: notification.html,
            text: notification.text,
          });
        } catch (err) {
          // Non-fatal: the signup already succeeded and is visible in /admin
          // even if this notification fails or ADMIN_NOTIFICATION_EMAIL isn't set.
          console.error('Failed to send waitlist admin notification email', err);
        }
      }
    }

    return NextResponse.json({
      referralCode: created.referralCode,
      referralCount: 0,
      totalSignups,
      alreadyJoined: false,
    });
  } catch (err) {
    console.error('Failed to process waitlist signup', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
