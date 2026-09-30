import type { CSSProperties, ReactNode } from 'react';

const SIG = '#FF5A1F';

/** 60 streker. lit = siste tente strek (-1 = ingen), hand = oransje viser (null = ingen). */
export function Dial({ size, lit, hand, on, off, children, className, label }: {
  size: number; lit: number; hand: number | null; on: string; off: string;
  children?: ReactNode; className?: string; label?: string;
}) {
  const pad = size * 0.02;
  const r = size / 2 - pad;
  const ticks = [];
  for (let i = 0; i < 60; i++) {
    const lng = i % 5 === 0;
    const isHand = hand !== null && i === hand;
    const len = isHand ? size * 0.2 : lng ? size * 0.11 : size * 0.055;
    const w = isHand ? Math.max(3, size * 0.024) : lng ? Math.max(2, size * 0.016) : Math.max(1, size * 0.009);
    const style: CSSProperties = {
      position: 'absolute', left: size / 2 - w / 2, top: pad, width: w, height: len,
      background: isHand ? SIG : i <= lit ? on : off,
      transformOrigin: `${w / 2}px ${r}px`, transform: `rotate(${i * 6}deg)`,
      transition: 'background .25s ease',
    };
    ticks.push(<div key={i} style={style} />);
  }
  return (
    <div className={`dialbox ${className ?? ''}`} style={{ width: size, height: size }} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      {ticks}
      {children ? <div className="dialnum">{children}</div> : null}
    </div>
  );
}
