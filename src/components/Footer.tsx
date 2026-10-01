import Link from 'next/link';
import { Dial } from './Dial';

export function Footer() {
  return (
    <div className="footer">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Dial size={28} lit={59} hand={0} on="#F3F0E8" off="#F3F0E8" />
        <span className="cond" style={{ fontSize: 22, color: '#F3F0E8' }}>PÅ MINUTTET</span>
      </div>
      <nav aria-label="Bunnmeny">
        <Link href="/vilkar">Vilkår</Link>
        <Link href="/personvern">Personvern</Link>
        <a href="https://instagram.com/paminuttet" rel="noopener">Instagram @paminuttet</a>
      </nav>
      <div>© {new Date().getFullYear()} PÅ MINUTTET · Erlend Namsvatn ENK · Org.nr 914 829 216</div>
    </div>
  );
}

export function DarkFooter() {
  return <footer className="dark wrap" style={{ paddingBottom: 40, paddingTop: 1 }}><Footer /></footer>;
}
