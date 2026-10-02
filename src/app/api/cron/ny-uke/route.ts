import { NextResponse, type NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { ACTIVE } from '@/lib/access';
import { WEEKS, schedule } from '@/lib/program';
import { sendMail } from '@/lib/mail';
import { newWeekEmail } from '@/lib/emails';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

// Kjøres av Vercel Cron søndag kveld (se vercel.json). Varsler aktive medlemmer om ny uke.
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const sch = schedule();
  if (sch.beforeStart) return NextResponse.json({ skipped: 'før start' });
  const week = WEEKS[sch.weekIdx];

  const admin = supabaseAdmin();
  const { data: subs, error } = await admin.from('subscriptions').select('user_id, status, track').in('status', ACTIVE);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const ids = (subs ?? []).map(s => s.user_id);
  if (!ids.length) return NextResponse.json({ sent: 0 });
  const { data: profs } = await admin.from('profiles').select('id, email').in('id', ids);
  const emailOf = new Map((profs ?? []).map(p => [p.id as string, p.email as string]));

  let sent = 0;
  for (const s of subs ?? []) {
    const to = emailOf.get(s.user_id);
    if (!to) continue;
    const days = (s.track === 'gym' ? week.gym : week.home).map(d => `${d.day}: ${d.name}${d.optional ? ' (valgfri)' : ''}`);
    const m = newWeekEmail({ weekN: week.n, title: week.title, intro: week.intro, days });
    const ok = await sendMail(to, m.subject, m.text, { html: m.html, idempotencyKey: `ny-uke-${sch.cycle}-${week.n}-${s.user_id}` });
    if (ok) sent++;
    await new Promise(r => setTimeout(r, 550)); // Resend tillater ca. 2 e-poster i sekundet
  }
  return NextResponse.json({ sent, week: week.n, cycle: sch.cycle });
}
