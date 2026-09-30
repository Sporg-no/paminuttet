import Link from 'next/link';
import { Brand } from './Brand';

export function MemberNav({ email, active }: { email: string; active: 'program' | 'min-side' | 'betaling' }) {
  const initials = email.split('@')[0].replace(/[^a-zA-ZæøåÆØÅ]/g, ' ').trim().split(/\s+/).map(s => s[0]).join('').slice(0, 2).toUpperCase() || 'PM';
  return (
    <nav className="nav wrap" aria-label="Medlemsmeny">
      <Brand size={34} />
      <div className="nav-links">
        <Link href="/program" className={active === 'program' ? 'active' : ''}>Ukens program</Link>
        <Link href="/min-side" className={active === 'min-side' ? 'active' : ''}>Min side</Link>
      </div>
      <div className="nav-right">
        <Link href="/min-side" className="avatar" aria-label="Min side" style={{ color: '#F3F0E8', textDecoration: 'none' }}>{initials}</Link>
        <form action="/api/logout" method="post"><button className="linkbtn" type="submit">Logg ut</button></form>
      </div>
    </nav>
  );
}
