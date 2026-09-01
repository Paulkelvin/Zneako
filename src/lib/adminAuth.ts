import { NextRequest } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { sanityServerClient } from '@/lib/sanityServer';
import { getClientIp } from '@/lib/rateLimit';

const LOCKOUT_WINDOW_MS = 15 * 60 * 1000;
const LOCKOUT_MAX_FAILURES = 10;

// Constant-time comparison so a mistyped/guessed Authorization header can't be
// distinguished from a correct one by response-timing differences.
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

// Without this, the password check itself has no limit on attempts - an
// attacker could script through guesses indefinitely. Locks out an IP for
// LOCKOUT_WINDOW_MS after LOCKOUT_MAX_FAILURES wrong passwords, tracked as
// one document per failure (mirrors the existing isRateLimited pattern used
// for the public forms) so it survives across serverless invocations.
export async function isAuthorizedAdmin(req: NextRequest): Promise<boolean> {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;

  const ip = getClientIp(req);
  if (ip) {
    const windowStart = new Date(Date.now() - LOCKOUT_WINDOW_MS).toISOString();
    const recentFailures = await sanityServerClient.fetch<number>(
      `count(*[_type == "adminAuthAttempt" && ip == $ip && _createdAt > $windowStart])`,
      { ip, windowStart }
    );
    if (recentFailures >= LOCKOUT_MAX_FAILURES) return false;
  }

  const auth = req.headers.get('authorization');
  const authorized = Boolean(auth) && safeEqual(auth as string, `Bearer ${secret}`);

  if (!authorized && ip) {
    try {
      await sanityServerClient.create({ _type: 'adminAuthAttempt', ip });
    } catch (err) {
      console.error('Failed to record admin auth attempt', err);
    }
  }

  return authorized;
}
