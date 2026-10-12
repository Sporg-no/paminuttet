import { NextResponse, type NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function unsubscribe(t: string | null) {
  if (!t || !UUID.test(t)) return false;
  const { error } = await supabaseAdmin().from('leads').update({ unsubscribed_at: new Date().toISOString() }).eq('unsub_token', t).is('unsubscribed_at', null);
  return !error;
}

const page = (ok: boolean) => `<!doctype html><html lang="nb"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Avmelding · PÅ MINUTTET</title></head>
<body style="margin:0;background:#F3F0E8;font:17px/1.5 Arial,Helvetica,sans-serif;color:#121212"><div style="max-width:520px;margin:12vh auto;padding:0 20px">
<div style="font:800 22px Arial Narrow,Arial,sans-serif;letter-spacing:.04em">PÅ <span style="color:#FF5A1F">MINUTTET</span></div>
<h1 style="font:800 34px/1.05 Arial Narrow,Arial,sans-serif;text-transform:uppercase;margin:28px 0 12px">${ok ? 'Du er meldt av.' : 'Lenken virker ikke.'}</h1>
<p>${ok ? 'Du får ingen flere e-poster fra oss om gratis-PDF-en.' : 'Send en e-post til post@paminuttet.no, så melder vi deg av.'}</p>
<p><a href="/" style="color:#C2410C">Til forsiden</a></p></div></body></html>`;

export async function GET(req: NextRequest) {
  const ok = await unsubscribe(req.nextUrl.searchParams.get('t'));
  return new NextResponse(page(ok), { headers: { 'content-type': 'text/html; charset=utf-8' } });
}

// Ett-klikks avmelding fra e-postprogrammet (List-Unsubscribe-Post)
export async function POST(req: NextRequest) {
  const ok = await unsubscribe(req.nextUrl.searchParams.get('t'));
  return NextResponse.json({ ok }, { status: ok ? 200 : 400 });
}
