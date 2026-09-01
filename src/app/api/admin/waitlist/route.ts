import { NextRequest, NextResponse } from 'next/server';
import { sanityServerClient } from '@/lib/sanityServer';
import { isAuthorizedAdmin } from '@/lib/adminAuth';

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

export async function GET(req: NextRequest) {
  if (!(await isAuthorizedAdmin(req))) {
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
