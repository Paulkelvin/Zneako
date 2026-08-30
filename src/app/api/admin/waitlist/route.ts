import { NextRequest, NextResponse } from 'next/server';
import { sanityServerClient } from '@/lib/sanityServer';

type Signup = {
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
};

function isAuthorized(req: NextRequest): boolean {
  const auth = req.headers.get('authorization');
  return Boolean(process.env.ADMIN_SECRET) && auth === `Bearer ${process.env.ADMIN_SECRET}`;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const signups = await sanityServerClient.fetch<Signup[]>(
    `*[_type == "waitlistSignup"] | order(_createdAt asc) {
      _id,
      email,
      ageRange,
      referralCode,
      "referralCount": coalesce(referralCount, 0),
      signupIp,
      "referredByEmail": referredBy->email,
      selectionTier,
      selectedAt,
      _createdAt
    }`
  );

  return NextResponse.json({ signups });
}
