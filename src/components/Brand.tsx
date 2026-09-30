import Link from 'next/link';
import { Dial } from './Dial';

export function Brand({ size = 38, dark = false, href = '/' }: { size?: number; dark?: boolean; href?: string }) {
  const c = dark ? '#F3F0E8' : '#121212';
  return (
    <Link href={href} className="brand" aria-label="PÅ MINUTTET, til forsiden" style={{ color: c }}>
      <Dial size={size} lit={59} hand={0} on={c} off={c} />
      <span className="cond">PÅ MINUTTET</span>
    </Link>
  );
}
