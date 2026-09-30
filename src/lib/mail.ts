import 'server-only';

/** Sender e-post via Resend hvis RESEND_API_KEY er satt. Returnerer false ellers. */
export async function sendMail(to: string, subject: string, text: string, html?: string) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM;
  if (!key || !from) { console.warn('[mail] RESEND_API_KEY/MAIL_FROM mangler – hopper over', subject); return false; }
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify({ from, to, subject, text, html }),
  });
  if (!r.ok) console.error('[mail] feil', r.status, await r.text());
  return r.ok;
}
