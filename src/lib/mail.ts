import 'server-only';

type Opts = { html?: string; idempotencyKey?: string };

/** Sender e-post via Resend hvis RESEND_API_KEY og MAIL_FROM er satt. Returnerer false ellers. */
export async function sendMail(to: string, subject: string, text: string, opts: Opts = {}) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM;
  if (!key || !from) { console.warn('[mail] RESEND_API_KEY/MAIL_FROM mangler – hopper over', subject); return false; }
  const headers: Record<string, string> = { Authorization: `Bearer ${key}`, 'content-type': 'application/json' };
  // Hindrer dobbel utsending hvis samme hendelse behandles to ganger (gjelder i 24 t)
  if (opts.idempotencyKey) headers['Idempotency-Key'] = opts.idempotencyKey.slice(0, 256);
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers,
    body: JSON.stringify({ from, to, subject, text, html: opts.html, reply_to: process.env.NEXT_PUBLIC_CONTACT_EMAIL || undefined }),
  });
  if (!r.ok) console.error('[mail] feil', r.status, await r.text());
  return r.ok;
}
