import { NextRequest } from 'next/server';
import { timingSafeEqual } from 'crypto';

// Constant-time comparison so a mistyped/guessed Authorization header can't be
// distinguished from a correct one by response-timing differences.
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function isAuthorizedAdmin(req: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;

  const auth = req.headers.get('authorization');
  if (!auth) return false;

  return safeEqual(auth, `Bearer ${secret}`);
}
