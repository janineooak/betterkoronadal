// Transactional email via Resend's HTTP API (no SDK needed).
//   RESEND_API_KEY — API key from resend.com
//   EMAIL_FROM     — verified sender, e.g. "Bantay Opisyal <admin@yourdomain>"
// Outside production, when no key is set, emails are logged to the server
// console instead so sign-in codes can be tested locally.

const isProd = process.env.VERCEL_ENV === 'production';

export function emailConfigured(): boolean {
  return !!process.env.RESEND_API_KEY || !isProd;
}

export async function sendEmail(opts: {
  to: string;
  subject: string;
  text: string;
  html: string;
}): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    if (isProd) throw new Error('Email delivery is not configured.');
    console.log(
      `\n[mail:dev] to=${opts.to}\nsubject=${opts.subject}\n${opts.text}\n`
    );
    return;
  }
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${key}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || 'Bantay Opisyal <onboarding@resend.dev>',
      to: [opts.to],
      subject: opts.subject,
      text: opts.text,
      html: opts.html,
    }),
  });
  if (!r.ok) {
    const body = await r.text().catch(() => '');
    throw new Error(`Email send failed (${r.status}): ${body.slice(0, 200)}`);
  }
}

const esc = (s: string) => s.replace(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`);

/** A minimal, client-safe HTML email body. */
export function emailHtml(heading: string, lines: string[], code?: string) {
  return `<!doctype html><html><body style="margin:0;background:#f5f5f4;font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#1c1917">
<div style="max-width:480px;margin:32px auto;background:#fff;border:1px solid #e7e5e4;border-radius:12px;padding:28px">
<p style="margin:0 0 4px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#78716c">Bantay Opisyal · Admin</p>
<h1 style="margin:0 0 16px;font-size:20px">${esc(heading)}</h1>
${code ? `<p style="margin:0 0 16px;font-size:32px;font-weight:700;letter-spacing:.3em;font-family:ui-monospace,Menlo,monospace">${esc(code)}</p>` : ''}
${lines.map(l => `<p style="margin:0 0 12px;font-size:14px;line-height:1.5">${esc(l)}</p>`).join('')}
</div></body></html>`;
}
