import { NextResponse, type NextRequest } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  const track = b.track === 'gym' ? 'gym' : 'hjemme';
  await supabaseAdmin().from('subscriptions').update({ track }).eq('user_id', user.id);
  return NextResponse.json({ ok: true });
}
