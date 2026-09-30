import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// Holder Supabase-økta fersk og sender uinnloggede bort fra medlemssider.
export async function middleware(req: NextRequest) {
  let res = NextResponse.next({ request: req });
  const sb = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
  matcher: ['/program/:path*', '/min-side/:path*', '/betaling/:path*', '/logg-inn'],
};
