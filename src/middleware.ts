import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { SUPABASE_URL, SUPABASE_PUBLIC_KEY } from '@/lib/supabase/keys';

// Holder Supabase-økta fersk og sender uinnloggede bort fra medlemssider.
const CANONICAL = 'paminuttet.no';
const OLD_HOSTS = new Set(['paminuttet.vercel.app', 'www.paminuttet.no']);
const AUTH_PATHS = ['/program', '/min-side', '/betaling', '/logg-inn'];

export async function middleware(req: NextRequest) {
  // Én adresse: gamle Vercel-adressen sendes til paminuttet.no (forhåndsvisninger berøres ikke).
  const host = (req.headers.get('host') || '').toLowerCase();
  if (OLD_HOSTS.has(host)) {
    const url = new URL(req.nextUrl.pathname + req.nextUrl.search, `https://${CANONICAL}`);
    return NextResponse.redirect(url, 308);
  }
  // «Ta med en venn»: husk vervekoden fra lenken til kassen
  const venn = req.nextUrl.searchParams.get('venn');
  if (venn && /^[a-f0-9]{8}$/.test(venn)) {
    const url = req.nextUrl.clone();
    url.searchParams.delete('venn');
    const r = NextResponse.redirect(url, 307);
    r.cookies.set('venn', venn, { maxAge: 60 * 864e2, path: '/', sameSite: 'lax', secure: true, httpOnly: true });
    return r;
  }
  if (!AUTH_PATHS.some(a => req.nextUrl.pathname.startsWith(a))) return NextResponse.next();

  let res = NextResponse.next({ request: req });
  const sb = createServerClient(
    SUPABASE_URL,
    SUPABASE_PUBLIC_KEY,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (list) => {
          list.forEach(({ name, value }) => req.cookies.set(name, value));
          res = NextResponse.next({ request: req });
          list.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
        },
      },
    },
  );
  const { data: { user } } = await sb.auth.getUser();
  const p = req.nextUrl.pathname;
  const protectedPath = p.startsWith('/program') || p.startsWith('/min-side') || p.startsWith('/betaling');
  if (!user && protectedPath) {
    const url = req.nextUrl.clone();
    url.pathname = '/logg-inn';
    url.search = `?neste=${encodeURIComponent(p)}`;
    return NextResponse.redirect(url);
  }
  return res;
}

export const config = {
  // Alle sider, men ikke API-ruter (webhook og cron), Next-filer eller statiske filer.
  matcher: ['/((?!api/|_next/|.*\\..*).*)'],
};
