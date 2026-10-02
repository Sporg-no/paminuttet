import { NextResponse, type NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { sendMail } from '@/lib/mail';
import { leadEmail } from '@/lib/emails';

export const runtime = 'nodejs';
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: NextRequest) {
  let b: { email?: string; source?: string };
  try { b = await req.json(); } catch { return NextResponse.json({ ok: false }, { status: 400 }); }
  const email = (b.email ?? '').trim().toLowerCase();
  if (!EMAIL.test(email) || email.length > 200) return NextResponse.json({ ok: false }, { status: 400 });
  const { error } = await supabaseAdmin().from('leads').insert({ email, source: (b.source ?? 'ukjent').slice(0, 40) });
  if (error && error.code !== '23505') { console.error('[lead]', error); return NextResponse.json({ ok: false }, { status: 500 }); }
  if (!error) {
    const m = leadEmail();
    await sendMail(email, m.subject, m.text, { html: m.html, idempotencyKey: `lead-${email}` }).catch(() => false);
  }
  return NextResponse.json({ ok: true });
}
