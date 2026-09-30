import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="dark" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, textAlign: 'center' }}>
      <div>
        <div className="eyebrow">404</div>
        <h1 className="cond" style={{ fontSize: 'clamp(56px, 10vw, 120px)', lineHeight: .9, margin: '12px 0 24px' }}>Dette minuttet<br />finnes ikke.</h1>
        <Link href="/" className="btn btn-sig">Til forsiden</Link>
      </div>
    </div>
  );
}
