import { escapeHtml } from './htmlEscape';

export function waitlistSignupNotificationEmail(params: {
  email: string;
  ageRange: string;
  totalSignups: number;
  referredBy?: string;
}) {
  const { email, ageRange, totalSignups, referredBy } = params;
  const safeEmail = escapeHtml(email);
  const safeAgeRange = escapeHtml(ageRange);
  const safeReferredBy = referredBy ? escapeHtml(referredBy) : undefined;

  const html = `
  <div style="background:#0e0d0c;padding:40px 24px;font-family:Helvetica,Arial,sans-serif;">
    <div style="max-width:480px;margin:0 auto;background:#1a1816;border:1px solid rgba(200,184,145,0.15);border-radius:16px;padding:32px;">
      <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#d4af37;">Waitlist Signup</p>
      <h1 style="margin:0 0 20px;font-size:20px;line-height:1.3;color:#f5f1e8;">New waitlist signup on zneako.com</h1>
      <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
        <tr>
          <td style="padding:6px 0;font-size:12px;color:rgba(245,241,232,0.5);width:110px;">Email</td>
          <td style="padding:6px 0;font-size:14px;color:#f5f1e8;">${safeEmail}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:12px;color:rgba(245,241,232,0.5);">Age range</td>
          <td style="padding:6px 0;font-size:14px;color:#f5f1e8;">${safeAgeRange}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:12px;color:rgba(245,241,232,0.5);">Total signups</td>
          <td style="padding:6px 0;font-size:14px;color:#f5f1e8;">${totalSignups}</td>
        </tr>
        ${
          safeReferredBy
            ? `<tr>
          <td style="padding:6px 0;font-size:12px;color:rgba(245,241,232,0.5);">Referred by</td>
          <td style="padding:6px 0;font-size:14px;color:#f5f1e8;">${safeReferredBy}</td>
        </tr>`
            : ''
        }
      </table>
    </div>
  </div>`;

  const text = `New waitlist signup on zneako.com

Email: ${email}
Age range: ${ageRange}
Total signups: ${totalSignups}${referredBy ? `\nReferred by: ${referredBy}` : ''}`;

  return { subject: `Waitlist signup: ${email}`, html, text };
}
