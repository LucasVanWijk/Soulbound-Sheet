import { useRef, useState } from 'react';
import { portraitFromFile } from '../image';
import { newId } from '../domain/model';
import { Icon } from './Icon';

export interface Details {
  name: string; age: string; eyes: string; hair: string; height: string; weight: string; features: string;
  short: string; long: string; portrait: string | null;
  connections: { id: string; name: string; relation: string }[];
  background?: string;
}

const grid: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12, padding: '0 22px 16px' };

function Field({ id, label, value, onChange, placeholder = '—' }: { id: string; label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label htmlFor={id} className="label">{label}</label>
      <input id={id} className="input" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} style={{ minHeight: 44 }} />
    </div>
  );
}

/** Step 4 of creation, and "Edit details" on a finished character. */
export function DetailsForm({ value, onChange, subtitle }: { value: Details; onChange: (patch: Partial<Details>) => void; subtitle: string }) {
  const file = useRef<HTMLInputElement>(null);
  const [err, setErr] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [cn, setCn] = useState('');
  const [cr, setCr] = useState('');

  const pick = async (f: File | undefined) => {
    if (!f) return;
    try { onChange({ portrait: await portraitFromFile(f) }); setErr(null); } catch (e) { setErr((e as Error).message); }
  };
  const addConn = () => {
    if (!cn.trim()) return;
    onChange({ connections: [...value.connections, { id: newId(), name: cn.trim(), relation: cr.trim() }] });
    setCn(''); setCr(''); setAdding(false);
  };

  return (
    <>
      <div style={{ display: 'flex', gap: 14, padding: '4px 22px 16px', alignItems: 'stretch' }}>
        <button className={value.portrait ? 'panel-framed' : 'dashed-btn'} onClick={() => file.current?.click()} aria-label={value.portrait ? 'Change portrait' : 'Add portrait'}
          style={{ width: 120, height: 150, flex: 'none', flexDirection: 'column', gap: 8, fontSize: 14, whiteSpace: 'normal', textAlign: 'center', padding: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          {value.portrait ? <img src={value.portrait} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <><Icon n="image" size={26} />Add portrait</>}
        </button>
        <input ref={file} type="file" accept="image/*" hidden aria-label="Portrait file" onChange={(e) => { void pick(e.target.files?.[0]); e.target.value = ''; }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, justifyContent: 'center' }}>
          <label htmlFor="cname" className="label">Character name</label>
          <input id="cname" className="input" placeholder="Name" value={value.name} onChange={(e) => onChange({ name: e.target.value })} style={{ minHeight: 46, fontSize: 18, fontFamily: 'var(--font-heading)', fontWeight: 600 }} />
          <span className="meta">{subtitle}</span>
          {value.portrait && <button className="btn btn-ghost inked" style={{ minHeight: 44, justifyContent: 'flex-start' }} onClick={() => onChange({ portrait: null })}>Remove portrait</button>}
        </div>
      </div>
      {err && <p role="alert" style={{ margin: '0 22px 12px', color: 'var(--q-wax)', fontSize: 14 }}>{err}</p>}
      <div style={grid}>
        <Field id="age" label="Age" value={value.age} onChange={(v) => onChange({ age: v })} />
        <Field id="eyes" label="Eyes" value={value.eyes} onChange={(v) => onChange({ eyes: v })} />
        <Field id="hair" label="Hair" value={value.hair} onChange={(v) => onChange({ hair: v })} />
        <Field id="height" label="Height" value={value.height} onChange={(v) => onChange({ height: v })} />
        <Field id="weight" label="Weight" value={value.weight} onChange={(v) => onChange({ weight: v })} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, padding: '0 22px 18px' }}>
        <label htmlFor="feat" className="label">Distinguishing features</label>
        <textarea id="feat" className="input" placeholder="Scars, marks, how they carry themselves" value={value.features} onChange={(e) => onChange({ features: e.target.value })} style={{ minHeight: 72 }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '6px 22px 18px', borderTop: '1px solid var(--q-rule)' }}>
        <span className="kicker" style={{ marginTop: 12 }}>Goals</span>
        <Field id="g1" label="Short-term goal" placeholder="What do they want soon?" value={value.short} onChange={(v) => onChange({ short: v })} />
        <Field id="g2" label="Long-term goal" placeholder="What drives them?" value={value.long} onChange={(v) => onChange({ long: v })} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '6px 22px 18px', borderTop: '1px solid var(--q-rule)' }}>
        <span className="kicker" style={{ marginTop: 12 }}>Connections</span>
        {value.connections.map((c) => (
          <div key={c.id} className="panel" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 8px 10px 14px', minHeight: 52 }}>
            <span style={{ flex: 1, display: 'flex', flexDirection: 'column' }}><span className="heading" style={{ fontSize: 17 }}>{c.name}</span>{c.relation && <span className="meta">{c.relation}</span>}</span>
            <button className="btn btn-icon btn-ghost inked" aria-label={`Remove ${c.name}`} onClick={() => onChange({ connections: value.connections.filter((x) => x.id !== c.id) })} style={{ width: 44, height: 44 }}><Icon n="x" size={18} /></button>
          </div>
        ))}
        {adding ? (
          <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 14 }}>
            <Field id="cn" label="Name" placeholder="Who?" value={cn} onChange={setCn} />
            <Field id="cr" label="Who they are to you" placeholder="Rival, mentor, old friend…" value={cr} onChange={setCr} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button className="btn btn-secondary" style={{ minHeight: 44 }} onClick={() => { setAdding(false); setCn(''); setCr(''); }}>Cancel</button>
              <button className="btn btn-primary inked" style={{ minHeight: 44 }} disabled={!cn.trim()} onClick={addConn}>Add</button>
            </div>
          </div>
        ) : <button className="dashed-btn" style={{ minHeight: 48, fontSize: 16 }} onClick={() => setAdding(true)}><Icon n="plus" size={17} />Add connection</button>}
      </div>
      {value.background !== undefined && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, padding: '6px 22px 18px', borderTop: '1px solid var(--q-rule)' }}>
          <label htmlFor="bg" className="kicker" style={{ marginTop: 12 }}>Background</label>
          <textarea id="bg" className="input" placeholder="Where they come from. Saved as a pinned note." value={value.background} onChange={(e) => onChange({ background: e.target.value })} style={{ minHeight: 110 }} />
        </div>
      )}
    </>
  );
}
