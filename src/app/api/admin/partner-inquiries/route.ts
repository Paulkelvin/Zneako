import { NextRequest, NextResponse } from 'next/server';
import { sanityServerClient } from '@/lib/sanityServer';
import { isAuthorizedAdmin } from '@/lib/adminAuth';

type PartnerInquiry = {
  _id: string;
  name: string;
  email: string;
  organization: string | null;
  message: string;
  _createdAt: string;
};

export async function GET(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const inquiries = await sanityServerClient.fetch<PartnerInquiry[]>(
    `*[_type == "partnerInquiry"] | order(_createdAt desc) {
      _id,
      name,
      email,
      organization,
      message,
      _createdAt
    }`
  );

  return NextResponse.json({ inquiries });
}
