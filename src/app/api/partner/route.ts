import { NextRequest, NextResponse } from 'next/server';
import { sanityServerClient } from '@/lib/sanityServer';
import { resend, WAITLIST_FROM_EMAIL } from '@/lib/resend';
import { partnerInquiryEmail } from '@/lib/partnerEmail';

export async function POST(req: NextRequest) {
  let body: { name?: string; email?: string; organization?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const name = body.name?.trim();
  const email = body.email?.trim().toLowerCase();
  const organization = body.organization?.trim() ?? '';
  const message = body.message?.trim();

  if (!name) {
    return NextResponse.json({ error: 'A name is required' }, { status: 400 });
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'A valid email is required' }, { status: 400 });
  }
  if (!message) {
    return NextResponse.json({ error: 'A message is required' }, { status: 400 });
  }

  try {
    await sanityServerClient.create({
      _type: 'partnerInquiry',
      name,
      email,
      organization,
      message,
    });
  } catch (err) {
    console.error('Failed to save partner inquiry', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }

  const destination = process.env.PARTNER_INQUIRY_EMAIL;
  if (resend && destination) {
    const { subject, html, text } = partnerInquiryEmail({ name, email, organization, message });
    try {
      await resend.emails.send({
        from: WAITLIST_FROM_EMAIL,
        to: destination,
        replyTo: email,
        subject,
        html,
        text,
      });
    } catch (err) {
      // Non-fatal: the inquiry is already saved and visible in /admin even if the
      // notification email fails or PARTNER_INQUIRY_EMAIL isn't set yet.
      console.error('Failed to send partner inquiry email', err);
    }
  }

  return NextResponse.json({ ok: true });
}
