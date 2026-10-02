import { NextResponse, type NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { ACTIVE } from '@/lib/access';
import { WEEKS, schedule } from '@/lib/program';
import { sendMail } from '@/lib/mail';
import { newWeekEmail } from '@/lib/emails';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

// Kjøres av Vercel Cron hver kveld (vercel.json). Sender «ny uke er klar» én gang per uke,
// første kveld uka er både sluppet i kalenderen og godkjent i src/content/release.json.
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const sch = schedule();
  if (sch.beforeStart) return NextResponse.json({ skipped: 'før start' });

  const admin = supabaseAdmin();
  const { data: state, error: stateErr } = await admin.from('app_state').select('value').eq('key', 'announced_week').maybeSingle();
  if (stateErr) {
    // Tabellen mangler (0002 ikke kjørt): send bare søndager, idempotens hindrer dobbel utsending samme døgn
    if (new Date().getUTCDay() !== 0) return NextResponse.json({ skipped: 'app_state mangler, ikke søndag' });
  } else if (Number((state?.value as { abs?: number } | null)?.abs ?? 0) >= sch.abs) {
    return NextResponse.json({ skipped: `uke ${sch.abs} er allerede varslet` });
  }

  const week = WEEKS[sch.weekIdx];
  const { data: subs, error } = await admin.from('subscriptions').select('user_id, track').in('status', ACTIVE);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const ids = (subs ?? []).map(s => s.user_id);
  const { data: profs } = ids.length ? await admin.from('profiles').select('id, email').in('id', ids) : { data: [] };
  const emailOf = new Map((profs ?? []).map(p => [p.id as string, p.email as string]));

  let sent = 0;
  for (const s of subs ?? []) {
    const to = emailOf.get(s.user_id);
    if (!to) continue;
    const days = (s.track === 'gym' ? week.gym : week.home).map(d => `${d.day}: ${d.name}${d.optional ? ' (valgfri)' : ''}`);
    const m = newWeekEmail({ weekN: week.n, title: week.title, intro: week.intro, days });
    const ok = await sendMail(to, m.subject, m.text, { html: m.html, idempotencyKey: `ny-uke-${sch.abs}-${s.user_id}` });
    if (ok) sent++;
    await new Promise(r => setTimeout(r, 550)); // Resend tillater ca. 2 e-poster i sekundet
  }
  if (!stateErr) await admin.from('app_state').upsert({ key: 'announced_week', value: { abs: sch.abs, sent }, updated_at: new Date().toISOString() });
  return NextResponse.json({ sent, week: week.n, abs: sch.abs });
}
