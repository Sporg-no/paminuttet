import Landing from '@/components/Landing';
import { supabaseServer } from '@/lib/supabase/server';

export default async function Home() {
  let loggedIn = false;
  try {
    const sb = await supabaseServer();
    const { data } = await sb.auth.getUser();
    loggedIn = !!data.user;
  } catch { /* uten Supabase-oppsett vises forsiden likevel */ }
  return <Landing loggedIn={loggedIn} />;
}
