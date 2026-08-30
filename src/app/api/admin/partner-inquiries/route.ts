import { NextRequest, NextResponse } from 'next/server';
import { sanityServerClient } from '@/lib/sanityServer';

type PartnerInquiry = {
  _id: string;
  name: string;
  email: string;
  organization: string | null;
  message: string;
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
