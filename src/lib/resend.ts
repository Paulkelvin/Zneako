import { Resend } from 'resend';

export const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const WAITLIST_FROM_EMAIL = process.env.WAITLIST_FROM_EMAIL ?? 'waitlist@zneako.com';
