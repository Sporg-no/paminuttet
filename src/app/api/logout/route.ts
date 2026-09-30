import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { siteUrl } from '@/lib/env';

export async function POST() {
  const sb = await supabaseServer();
  await sb.auth.signOut();
  return NextResponse.redirect(`${siteUrl()}/`, 303);
}
