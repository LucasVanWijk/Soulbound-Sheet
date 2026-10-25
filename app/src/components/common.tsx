import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { findTerm, splitTerms } from '../data/glossary';
import { Icon } from './Icon';

export function Kicker({ children }: { children: ReactNode }) { return <span className="kicker">{children}</span>; }

/** A titled block on a screen: kicker above, optional meta on the right. */
export function Section({ kicker, meta, children, pad = '0 22px 22px' }: { kicker: string; meta?: ReactNode; children: ReactNode; pad?: string }) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: pad }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <span className="kicker">{kicker}</span>
        {meta && <span className="meta tnum">{meta}</span>}
      </div>
      {children}
    </section>
  );
}

export const rule = (i: number) => (i === 0 ? '0' : '1px solid var(--q-rule)');

export function CloseBtn({ onClick, label = 'Close', size = 40 }: { onClick: () => void; label?: string; size?: number }) {
  return (
    <button className="btn btn-icon btn-ghost inked" onClick={onClick} aria-label={label} style={{ width: size, height: size }}>
      <Icon n="x" size={size > 38 ? 19 : 17} />
    </button>
  );
}

export function IconBtn({ n, label, onClick, size = 44, disabled, secondary }: { n: Parameters<typeof Icon>[0]['n']; label: string; onClick?: () => void; size?: number; disabled?: boolean; secondary?: boolean }) {
  return (
    <button className={'btn btn-icon ' + (secondary ? 'btn-secondary' : 'btn-ghost inked')} aria-label={label} onClick={onClick} disabled={disabled} style={{ width: size, height: size }}>
      <Icon n={n} size={size > 40 ? 18 : 16} />
    </button>
  );
}

/** A bottom sheet (a right-hand panel on desktop) with a scrim. Escape closes it. */
export function Sheet({ label, onClose, children, flush }: { label: string; onClose: () => void; children: ReactNode; flush?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', key);
    return () => { window.removeEventListener('keydown', key); prev?.focus?.(); };
  }, [onClose]);
  return (
    <>
      <div className="scrim" onClick={onClose} />
      <div className="sheet" role="dialog" aria-modal="true" aria-label={label} ref={ref} tabIndex={-1}
        style={flush ? { top: 64, maxHeight: 'none', display: 'flex', flexDirection: 'column', overflow: 'hidden' } : undefined}>
        {flush ? children : <div className="sheet-body" style={{ paddingTop: 10 }}><span className="grabber" />{children}</div>}
      </div>
    </>
  );
}

export function Modal({ label, onClose, children }: { label: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [onClose]);
  return (
    <div className="modal" onClick={onClose}>
      <div role="alertdialog" aria-modal="true" aria-label={label} onClick={(e) => e.stopPropagation()}
        style={{ width: '100%', maxWidth: 380, background: 'var(--q-parch)', border: '1px solid var(--q-rule)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {children}
      </div>
    </div>
  );
}

export function Confirm({ title, body, confirm, danger, onConfirm, onCancel }: { title: string; body: ReactNode; confirm: string; danger?: boolean; onConfirm: () => void; onCancel: () => void }) {
  return (
    <Modal label={title} onClose={onCancel}>
      <h2 style={{ fontSize: 24, margin: 0 }}>{title}</h2>
      <div style={{ fontSize: 15 }}>{body}</div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn btn-secondary" style={{ flex: 1, minHeight: 46 }} onClick={onCancel}>Cancel</button>
        {danger
          ? <button className="danger-btn" style={{ flex: 1, minHeight: 46 }} onClick={onConfirm}>{confirm}</button>
          : <button className="btn btn-primary inked" style={{ flex: 1, minHeight: 46 }} onClick={onConfirm}>{confirm}</button>}
      </div>
    </Modal>
  );
}

export function Toast({ message }: { message: string | null }) {
  return (
    <div className={'toast' + (message ? ' show' : '')} role="status" aria-live="polite" style={{ bottom: 'calc(110px + env(safe-area-inset-bottom, 0px))' }}>
      {message && <><span className="seal" style={{ width: 24, height: 24 }}><Icon n="check" size={13} stroke={2.4} /></span><span className="tnum">{message}</span></>}
    </div>
  );
}

const popBorder = '1px solid color-mix(in srgb, var(--color-accent-800) 35%, transparent)';

/** A tappable row with a popover opening underneath it. */
export function PopRow({ open, onToggle, row, children, rowStyle, chevron = true }: { chevron?: boolean; open: boolean; onToggle: () => void; row: ReactNode; children: ReactNode; rowStyle?: CSSProperties }) {
  return (
    <div style={{ position: 'relative' }}>
      <button className="row-btn" aria-expanded={open} onClick={onToggle} style={{ gap: 10, minHeight: 50, padding: '0 12px 0 14px', background: open ? 'var(--q-tint)' : 'transparent', ...rowStyle }}>
        {row}
        {chevron && <Icon n={open ? 'chevron-up' : 'chevron-right'} size={16} />}
      </button>
      {open && <Popover>{children}</Popover>}
    </div>
  );
}

export function Popover({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { ref.current?.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' }); }, []);
  return (
    <div ref={ref} role="dialog" style={{ position: 'absolute', left: -8, right: -8, top: 'calc(100% + 4px)', zIndex: 10, background: 'var(--q-parch)', border: popBorder, borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: '14px 14px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <span aria-hidden="true" style={{ position: 'absolute', top: -7, left: 40, width: 12, height: 12, transform: 'rotate(45deg)', background: 'var(--q-parch)', borderLeft: popBorder, borderTop: popBorder }} />
      {children}
    </div>
  );
}

export function PopHead({ kicker, title, onClose }: { kicker: string; title: string; onClose: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span className="kicker">{kicker}</span>
        <span className="heading" style={{ fontSize: 21 }}>{title}</span>
      </div>
      <button className="btn btn-icon btn-ghost inked" aria-label="Close" onClick={onClose} style={{ width: 40, height: 40, margin: '-6px -8px 0 0' }}><Icon n="x" size={18} /></button>
    </div>
  );
}

/** The nested popover inside another popover, for a keyword or a trait. */
export function Nested({ kicker, title, text, onClose }: { kicker: string; title: string; text: string; onClose: () => void }) {
  return (
    <div role="dialog" aria-label={title} style={{ position: 'relative', margin: '2px 0 0 18px', background: 'color-mix(in srgb, var(--color-accent-100) 80%, var(--q-parch))', border: '1px solid var(--color-accent-600)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: '10px 12px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span className="label" style={{ flex: 1 }}>{kicker} · {title}</span>
        <button className="btn btn-icon btn-ghost inked" aria-label={`Close ${title}`} onClick={onClose} style={{ width: 36, height: 36, margin: '-6px -6px -6px 0' }}><Icon n="x" size={16} /></button>
      </div>
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>{text}</p>
    </div>
  );
}

/** Effect text where known terms are underlined and open a nested popover. */
export function RichText({ text, exclude }: { text: string; exclude?: string[] }) {
  const [term, setTerm] = useState<string | null>(null);
  const pieces = splitTerms(text, exclude);
  const t = term ? findTerm(term) : undefined;
  return (
    <>
      <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55 }}>
        {pieces.map((p, i) => typeof p === 'string' ? p : (
          <button key={i} aria-expanded={term === p.term} onClick={() => setTerm(term === p.term ? null : p.term)}
            style={{ display: 'inline', padding: 0, border: 0, background: 'transparent', font: 'inherit', color: 'var(--color-accent-700)', textDecoration: 'underline dotted', textUnderlineOffset: 3, cursor: 'pointer' }}>{p.term}</button>
        ))}
      </p>
      {t && <Nested kicker={t.kind} title={t.title} text={t.text} onClose={() => setTerm(null)} />}
    </>
  );
}

/** Label over value, used for stat strips inside popovers. */
export function Stat({ label, value }: { label: string; value: ReactNode }) {
  return <span style={{ display: 'flex', flexDirection: 'column' }}><span className="label">{label}</span><span className="heading tnum" style={{ fontSize: 18 }}>{value}</span></span>;
}

export function StatStrip({ children, cols = 3 }: { children: ReactNode; cols?: number }) {
  return <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: 8, padding: '8px 0', borderTop: '1px solid var(--q-rule)', borderBottom: '1px solid var(--q-rule)' }}>{children}</div>;
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="muted" style={{ margin: 0, padding: '14px', fontStyle: 'italic', fontSize: 14 }}>{children}</p>;
}

export function Initial({ name, size = 44 }: { name: string; size?: number }) {
  return <span className="portrait" style={{ width: size, height: size, fontSize: size / 2 }}>{(name.trim()[0] ?? '?').toUpperCase()}</span>;
}

/** A square portrait button with the picture or a placeholder. */
export function PortraitFrame({ src, onClick, w, h, label }: { src: string | null; onClick?: () => void; w: number; h: number; label: string }) {
  return (
    <button className="panel-framed" aria-label={label} onClick={onClick}
      style={{ width: w, height: h, flex: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'var(--color-accent-800)', cursor: onClick ? 'pointer' : 'default', fontFamily: 'var(--font-body)', fontSize: 12, padding: 0, overflow: 'hidden' }}>
      {src ? <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <><Icon n="image" size={30} stroke={1.4} />Portrait</>}
    </button>
  );
}

export const money = (n: number) => n.toLocaleString('en');
