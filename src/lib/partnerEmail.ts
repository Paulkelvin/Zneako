export function partnerInquiryEmail(params: {
  name: string;
  email: string;
  organization: string;
  message: string;
}) {
  const { name, email, organization, message } = params;

  const html = `
  <div style="background:#0e0d0c;padding:40px 24px;font-family:Helvetica,Arial,sans-serif;">
    <div style="max-width:480px;margin:0 auto;background:#1a1816;border:1px solid rgba(200,184,145,0.15);border-radius:16px;padding:32px;">
      <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#d4af37;">Partner Inquiry</p>
      <h1 style="margin:0 0 20px;font-size:20px;line-height:1.3;color:#f5f1e8;">New investment interest via zneako.com</h1>
      <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
        <tr>
          <td style="padding:6px 0;font-size:12px;color:rgba(245,241,232,0.5);width:110px;">Name</td>
          <td style="padding:6px 0;font-size:14px;color:#f5f1e8;">${name}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:12px;color:rgba(245,241,232,0.5);">Email</td>
          <td style="padding:6px 0;font-size:14px;color:#f5f1e8;">${email}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:12px;color:rgba(245,241,232,0.5);">Organization</td>
          <td style="padding:6px 0;font-size:14px;color:#f5f1e8;">${organization || '—'}</td>
        </tr>
      </table>
      <div style="border:1px solid rgba(200,184,145,0.2);border-radius:8px;padding:14px 16px;">
        <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:rgba(245,241,232,0.5);">Message</p>
        <p style="margin:0;font-size:14px;line-height:1.6;color:#f5f1e8;white-space:pre-wrap;">${message}</p>
      </div>
    </div>
  </div>`;

  const text = `New partner inquiry via zneako.com

Name: ${name}
Email: ${email}
Organization: ${organization || '—'}

Message:
${message}`;

  return { subject: `Partner inquiry from ${name}`, html, text };
}
