export function waitlistConfirmationEmail(params: { referralCode: string; origin: string }) {
  const referralLink = `${params.origin.replace(/^https?:\/\//, '')}/?ref=${params.referralCode}`;
  const referralUrl = `${params.origin}/?ref=${params.referralCode}`;

  const html = `
  <div style="background:#0e0d0c;padding:40px 24px;font-family:Helvetica,Arial,sans-serif;">
    <div style="max-width:480px;margin:0 auto;background:#1a1816;border:1px solid rgba(200,184,145,0.15);border-radius:16px;padding:32px;">
      <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#d4af37;">Limited Access</p>
      <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;color:#f5f1e8;">You&rsquo;re on the Zneako waitlist.</h1>
      <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:rgba(245,241,232,0.7);">
        The first 35 signups get a free pair, guaranteed. The next 15 pairs go to our top
        referrers &mdash; share your link below to boost your chances.
      </p>
      <div style="border:1px solid rgba(200,184,145,0.2);border-radius:8px;padding:14px 16px;margin-bottom:8px;">
        <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:rgba(245,241,232,0.5);">Your referral link</p>
        <a href="${referralUrl}" style="font-size:14px;color:#d4af37;text-decoration:none;word-break:break-all;">${referralLink}</a>
      </div>
      <p style="margin:24px 0 0;font-size:12px;line-height:1.6;color:rgba(245,241,232,0.35);">
        Save this email &mdash; it&rsquo;s the only place your referral link lives if you close the tab.
      </p>
    </div>
  </div>`;

  const text = `You're on the Zneako waitlist.

The first 35 signups get a free pair, guaranteed. The next 15 pairs go to our top referrers — share your link below to boost your chances.

Your referral link: ${referralUrl}

Save this email — it's the only place your referral link lives if you close the tab.`;

  return { subject: "You're on the Zneako waitlist", html, text };
}
