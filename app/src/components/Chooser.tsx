import { useMemo, useState, type ReactNode } from 'react';
import { Icon } from './Icon';
import { CloseBtn, RichText, Sheet } from './common';

export interface ChoiceItem { key: string; title: string; meta?: string; detail?: string; disabled?: string }

/** A searchable list in a bottom sheet. With `max`, rows toggle; without, a tap picks the row and closes. */
export function Chooser({ label, items, selected, max, onToggle, onClose, extra, groups }: {
  label: string; items: ChoiceItem[]; selected: string[]; max?: number;
  onToggle: (key: string) => void; onClose: () => void; extra?: ReactNode; groups?: { name: string; match: (k: string) => boolean }[];
}) {
  const [q, setQ] = useState('');
  const [group, setGroup] = useState<string>('All');
  const [open, setOpen] = useState<string | null>(null);
  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const g = groups?.find((x) => x.name === group);
    return items.filter((i) => (!needle || i.title.toLowerCase().includes(needle) || (i.meta ?? '').toLowerCase().includes(needle)) && (!g || g.match(i.key)));
  }, [items, q, group, groups]);
  const multi = max !== undefined;
  return (
    <Sheet label={label} onClose={onClose} flush>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '10px 22px 10px' }}>
        <span className="grabber" style={{ alignSelf: 'center' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ flex: 1 }}>
            <span className="kicker">{multi ? (max === Infinity ? `${selected.length} on your sheet` : `${selected.length} of ${max} chosen`) : 'Choose one'}</span>
            <div className="heading" style={{ fontSize: 24 }}>{label}</div>
          </div>
          {multi ? <button className="btn btn-primary inked" style={{ minHeight: 44 }} onClick={onClose}>Done</button> : <CloseBtn onClick={onClose} />}
        </div>
        <div style={{ position: 'relative' }}>
          <label htmlFor="chooser-q" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>Search</label>
          <span style={{ position: 'absolute', left: 12, top: 13, color: 'var(--color-accent-800)' }}><Icon n="search" size={17} /></span>
          <input id="chooser-q" className="input" placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} style={{ minHeight: 44, paddingLeft: 38 }} />
        </div>
        {groups && (
          <div className="hscroll" style={{ gap: 6 }}>
            {[{ name: 'All' }, ...groups].map((g) => <button key={g.name} className="chip" aria-pressed={group === g.name} onClick={() => setGroup(g.name)} style={{ minHeight: 40, padding: '8px 14px' }}>{g.name}</button>)}
          </div>
        )}
        {extra}
      </div>
      <div style={{ flex: 1, overflowY: 'auto', borderTop: '1px solid var(--q-rule)', paddingBottom: 26 }}>
        {shown.length === 0 && <p className="muted" style={{ margin: 0, padding: 22, fontStyle: 'italic' }}>Nothing matches.</p>}
        {shown.map((i) => {
          const on = selected.includes(i.key);
          const blocked = !!i.disabled || (multi && !on && selected.length >= max!);
          return (
            <div key={i.key} style={{ borderBottom: '1px solid var(--q-rule)', background: on ? 'var(--q-tint)' : 'transparent' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <button onClick={() => !blocked && onToggle(i.key)} aria-pressed={multi ? on : undefined} aria-disabled={blocked}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12, padding: '8px 14px 8px 22px', minHeight: 54, border: 0, background: 'transparent', color: blocked ? 'var(--color-accent-800)' : 'var(--q-ink)', opacity: blocked && !on ? 0.6 : 1, textAlign: 'left', cursor: blocked ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)' }}>
                  {multi && <span className={'checkbox' + (on ? ' on' : '')} style={{ width: 22, height: 22, flex: 'none' }}>{on && <Icon n="check" size={14} stroke={2.6} />}</span>}
                  <span style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <span className="heading" style={{ fontSize: 17 }}>{i.title}</span>
                    {(i.meta || i.disabled) && <span className="meta">{i.disabled ?? i.meta}</span>}
                  </span>
                </button>
                {i.detail && <button className="btn btn-icon btn-ghost inked" aria-label={`About ${i.title}`} aria-expanded={open === i.key} onClick={() => setOpen(open === i.key ? null : i.key)} style={{ width: 44, height: 44, marginRight: 8 }}><Icon n="info" size={18} /></button>}
              </div>
              {open === i.key && i.detail && <div style={{ padding: '0 22px 14px' }}><RichText text={i.detail} exclude={[i.title]} /></div>}
            </div>
          );
        })}
      </div>
    </Sheet>
  );
}
