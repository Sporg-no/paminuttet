import { NextResponse, type NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { sendMail } from '@/lib/mail';
import { personalEmail } from '@/lib/emails';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Vercel Cron hvert 10. minutt: sender usendte rader i public.outbox, én gang hver.
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const admin = supabaseAdmin();
  const { data: rows, error } = await admin.from('outbox').select('id, to_email, subject, body')
    .is('sent_at', null).is('error', null).order('id').limit(20);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  let sent = 0;
  for (const r of rows ?? []) {
    const ok = await sendMail(r.to_email, r.subject, r.body, { html: personalEmail(r.body), idempotencyKey: `outbox-${r.id}` });
    await admin.from('outbox').update(ok ? { sent_at: new Date().toISOString() } : { error: 'sending feilet, se logg' }).eq('id', r.id);
    if (ok) sent++;
    await new Promise(res => setTimeout(res, 550));
  }
  return NextResponse.json({ sent });
}
