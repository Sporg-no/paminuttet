import { Brand } from './Brand';
import { DarkFooter } from './Footer';

export function DocPage({ eyebrow, title, updated, children }: { eyebrow: string; title: string; updated: string; children: React.ReactNode }) {
  return (
    <div className="page">
      <nav className="nav wrap"><Brand /><div className="nav-right"><a href="/logg-inn" className="btn btn-line btn-sm">Logg inn</a></div></nav>
      <article className="wrap doc">
        <div className="eyebrow">{eyebrow}</div>
        <h1 style={{ marginTop: 12 }}>{title}</h1>
        <p style={{ fontSize: 14, color: '#6E695F' }}>Sist oppdatert {updated}</p>
        {children}
      </article>
      <DarkFooter />
    </div>
  );
}
