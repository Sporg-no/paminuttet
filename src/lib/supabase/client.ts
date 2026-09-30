'use client';
import { createBrowserClient } from '@supabase/ssr';
import { SUPABASE_URL, SUPABASE_PUBLIC_KEY } from '@/lib/supabase/keys';

export function supabaseBrowser() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
}
