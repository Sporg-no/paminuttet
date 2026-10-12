import { NextResponse, type NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { siteUrl } from '@/lib/env';
import { sendMail } from '@/lib/mail';
import { leadNurtureEmail } from '@/lib/emails';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

const DAY = 864e5;
const DONE = 9; // ferdig: fikk begge e-postene, eller ble medlem
// Rabattkoden nevnes bare mens den gjelder (ut søndag 18. okt norsk tid)
const PROMO_END = Date.parse('2026-10-18T21:59:59Z');
const promoText = () => (Date.now() < PROMO_END ? 'Koden FORSTE20 gir halv pris de første 3 månedene. Den gjelder til og med søndag 18. oktober.' : null);

// Vercel Cron hver morgen (vercel.json): steg 1 to dager etter PDF-nedlasting, steg 2 tre dager etter steg 1.
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const admin = supabaseAdmin();
  const now = Date.now();
  const { data: leads, error } = await admin.from('leads')
    .select('id, email, created_at, nurture_step, nurture_at, unsub_token')
    .is('unsubscribed_at', null).lt('nurture_step', 2).order('created_at').limit(100);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const due = (leads ?? []).filter(l =>
    (l.nurture_step === 0 && Date.parse(l.created_at) <= now - 2 * DAY) ||
    (l.nurture_step === 1 && l.nurture_at && Date.parse(l.nurture_at) <= now - 3 * DAY));
  if (!due.length) return NextResponse.json({ sent: 0 });

  // Den som allerede har konto (prøve eller medlem) skal ikke ha salgs-e-post
  const { data: profs } = await admin.from('profiles').select('email').in('email', due.map(l => l.email));
  const members = new Set((profs ?? []).map(p => String(p.email).toLowerCase()));

  let sent = 0, skipped = 0;
  for (const l of due) {
    if (members.has(l.email.toLowerCase())) {
      await admin.from('leads').update({ nurture_step: DONE }).eq('id', l.id);
      skipped++; continue;
    }
    const step = (l.nurture_step + 1) as 1 | 2;
    const unsubUrl = `${siteUrl()}/api/avmeld?t=${l.unsub_token}`;
    const m = leadNurtureEmail(step, { unsubUrl, promo: promoText() });
    const ok = await sendMail(l.email, m.subject, m.text, {
      html: m.html, idempotencyKey: `lead-nurture-${step}-${l.id}`,
      headers: { 'List-Unsubscribe': `<${unsubUrl}>`, 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' },
    });
    if (ok) {
      await admin.from('leads').update({ nurture_step: step, nurture_at: new Date().toISOString() }).eq('id', l.id);
      sent++;
    }
    await new Promise(r => setTimeout(r, 550));
  }
  return NextResponse.json({ sent, skipped });
}
