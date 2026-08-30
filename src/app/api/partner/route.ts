import { NextRequest, NextResponse } from 'next/server';
import { sanityServerClient } from '@/lib/sanityServer';
import { resend, WAITLIST_FROM_EMAIL } from '@/lib/resend';
import { partnerInquiryEmail } from '@/lib/partnerEmail';
import { getClientIp, isRateLimited } from '@/lib/rateLimit';

const MAX_NAME_LENGTH = 200;
const MAX_EMAIL_LENGTH = 254; // RFC 5321
const MAX_ORGANIZATION_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 5000;

const RATE_LIMIT_WINDOW_HOURS = 24;
const RATE_LIMIT_MAX_PER_IP = 5;

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

  const { name: rawName, email: rawEmail, organization: rawOrganization, message: rawMessage } =
    body as { name?: unknown; email?: unknown; organization?: unknown; message?: unknown };

  const name = typeof rawName === 'string' ? rawName.trim() : undefined;
  const email = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : undefined;
  const organization = typeof rawOrganization === 'string' ? rawOrganization.trim() : '';
  const message = typeof rawMessage === 'string' ? rawMessage.trim() : undefined;
  const ip = getClientIp(req);

  if (!name || name.length > MAX_NAME_LENGTH) {
    return NextResponse.json({ error: 'A valid name is required' }, { status: 400 });
  }
  if (!email || email.length > MAX_EMAIL_LENGTH || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'A valid email is required' }, { status: 400 });
  }
  if (organization.length > MAX_ORGANIZATION_LENGTH) {
    return NextResponse.json({ error: 'Company / organization is too long' }, { status: 400 });
  }
  if (!message || message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json({ error: 'A valid message is required' }, { status: 400 });
  }

  if (ip) {
    const limited = await isRateLimited({
      type: 'partnerInquiry',
      ip,
      windowHours: RATE_LIMIT_WINDOW_HOURS,
      max: RATE_LIMIT_MAX_PER_IP,
    });
    if (limited) {
      return NextResponse.json(
        { error: 'Too many inquiries from this network. Please try again later.' },
        { status: 429 }
      );
    }
  }

  try {
    await sanityServerClient.create({
      _type: 'partnerInquiry',
      name,
      email,
      organization,
      message,
      ...(ip ? { signupIp: ip } : {}),
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
