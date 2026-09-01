import { NextRequest } from 'next/server';
import { sanityServerClient } from '@/lib/sanityServer';

export function getClientIp(req: NextRequest): string | null {
  // x-vercel-forwarded-for is set by Vercel's edge network itself and can't
  // be overridden by the client, unlike x-forwarded-for/x-real-ip which a
  // request could in principle set directly. Prefer it where available.
  const vercelForwarded = req.headers.get('x-vercel-forwarded-for');
  if (vercelForwarded) return vercelForwarded.split(',')[0].trim();
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip');
}

// Counts existing documents of `type` created from `ip` within the last
// `windowHours` and reports whether that count has already reached `max`.
export async function isRateLimited(params: {
  type: string;
  ip: string;
  windowHours: number;
  max: number;
}): Promise<boolean> {
  const windowStart = new Date(Date.now() - params.windowHours * 60 * 60 * 1000).toISOString();
  const count = await sanityServerClient.fetch<number>(
    `count(*[_type == $type && signupIp == $ip && _createdAt > $windowStart])`,
    { type: params.type, ip: params.ip, windowStart }
  );
  return count >= params.max;
}
