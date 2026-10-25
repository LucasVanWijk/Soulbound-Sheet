import { useState } from 'react';
import { Chooser, type ChoiceItem } from '../components/Chooser';
import { Icon } from '../components/Icon';
import { ItemPop, MiraclePop, SpellPop, itemMeta, miracleMeta, spellMeta } from '../components/Details';
import { PopRow, Section, Sheet, rule } from '../components/common';
import { ARMOUR, GODS, LORE_NAMES, MELEE, MIRACLES, RANGED, SPELLS, findMiracle, findSpell } from '../data/kb';
import { newId, type Character, type Item, type ItemKind } from '../domain/model';
import { useStore } from '../state/store';

type Base = { kind: ItemKind; name: string } | null;

function baseOptions(): { value: string; label: string; base: Base }[] {
  return [
    ...MELEE.map((w) => ({ value: `melee|${w.name}`, label: `${w.name} (melee)`, base: { kind: 'melee', name: w.name } as Base })),
    ...RANGED.map((w) => ({ value: `ranged|${w.name}`, label: `${w.name} (ranged)`, base: { kind: 'ranged', name: w.name } as Base })),
    ...ARMOUR.map((a) => (a.name === 'Shield'
      ? { value: 'shield|Shield', label: 'Shield', base: { kind: 'shield', name: 'Shield' } as Base }
      : { value: `armour|${a.name}`, label: `${a.name} armour`, base: { kind: 'armour', name: a.name } as Base })),
  ];
}

function ItemSheet({ item, onSave, onClose }: { item: Item | null; onSave: (i: Item) => void; onClose: () => void }) {
  const [name, setName] = useState(item?.name ?? '');
  const [qty, setQty] = useState(item?.qty ?? 1);
  const [notes, setNotes] = useState(item?.notes ?? '');
  const [base, setBase] = useState(item?.base ? `${item.base.kind}|${item.base.name}` : '');
  const [worn, setWorn] = useState(item?.worn ?? false);
  const opts = baseOptions();
  const chosen = opts.find((o) => o.value === base)?.base ?? null;
  const wearable = chosen?.kind === 'armour' || chosen?.kind === 'shield';
  const save = () => onSave({ id: item?.id ?? newId(), name: name.trim(), qty: Math.max(1, qty), notes: notes.trim(), base: chosen, worn: wearable && worn });
  return (
    <Sheet label={item ? 'Edit item' : 'Add item'} onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}><span className="kicker">{item ? 'Edit item' : 'Add item'}</span><span className="title-sheet heading">{item ? item.name : 'New item'}</span></div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <label className="label" htmlFor="item-base">Based on (optional)</label>
        <select id="item-base" className="input" value={base} style={{ minHeight: 46 }}
          onChange={(e) => { setBase(e.target.value); const o = opts.find((x) => x.value === e.target.value); if (o?.base && !name.trim()) setName(o.base.name); setWorn(o?.base?.kind === 'armour' || o?.base?.kind === 'shield'); }}>
          <option value="">Just a name (gear)</option>
          <optgroup label="Melee weapons">{opts.filter((o) => o.base?.kind === 'melee').map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</optgroup>
          <optgroup label="Ranged weapons">{opts.filter((o) => o.base?.kind === 'ranged').map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</optgroup>
          <optgroup label="Armour and shields">{opts.filter((o) => o.base?.kind === 'armour' || o.base?.kind === 'shield').map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</optgroup>
        </select>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <label className="label" htmlFor="item-name">Name</label>
        <input id="item-name" className="input" value={name} onChange={(e) => setName(e.target.value)} style={{ minHeight: 46 }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span className="label" style={{ flex: 1 }}>Quantity</span>
        <button className="btn btn-icon btn-secondary" aria-label="Fewer" disabled={qty <= 1} onClick={() => setQty(qty - 1)} style={{ width: 44, height: 44 }}><Icon n="minus" size={16} /></button>
        <span className="heading tnum" style={{ fontSize: 22, minWidth: 32, textAlign: 'center' }}>{qty}</span>
        <button className="btn btn-icon btn-secondary" aria-label="More" onClick={() => setQty(qty + 1)} style={{ width: 44, height: 44 }}><Icon n="plus" size={16} /></button>
      </div>
      {wearable && (
        <label className="toggle-row" style={{ minHeight: 44 }}>
          <input type="checkbox" checked={worn} onChange={(e) => setWorn(e.target.checked)} style={{ width: 22, height: 22, accentColor: 'var(--color-accent-700)' }} />
          Worn (counts toward {chosen?.kind === 'shield' ? 'Defence' : 'Armour'})
        </label>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <label className="label" htmlFor="item-notes">Notes</label>
        <textarea id="item-notes" className="input" value={notes} onChange={(e) => setNotes(e.target.value)} style={{ minHeight: 70 }} />
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn btn-secondary" style={{ flex: 1, minHeight: 50 }} onClick={onClose}>Cancel</button>
        <button className="btn btn-primary inked" style={{ flex: 2, minHeight: 50 }} disabled={!name.trim()} onClick={save}>{item ? 'Save' : 'Add item'}</button>
      </div>
    </Sheet>
  );
}

export function InventoryTab({ c }: { c: Character }) {
  const { update } = useStore();
  const [open, setOpen] = useState<string | null>(null);
  const [editing, setEditing] = useState<Item | 'new' | null>(null);
  const [adding, setAdding] = useState(false);
  const touch = (fn: (x: Character) => Character) => update((x) => ({ ...fn(x), updatedAt: new Date().toISOString() }));
  const setMoney = (k: 'drops' | 'phials' | 'spheres', v: string) => touch((x) => ({ ...x, currency: { ...x.currency, [k]: Math.max(0, Math.min(999999, parseInt(v, 10) || 0)) } }));
  const owned = [...c.spells.map((s) => `spell|${s.lore}|${s.name}`), ...c.miracles.map((m) => `miracle|${m.god}|${m.name}`)];

  const addItems: ChoiceItem[] = [
    ...SPELLS.map((s) => ({ key: `spell|${s.lore}|${s.name}`, title: s.name, meta: `Spell · ${s.lore} · DN ${s.dn}`, detail: s.effect })),
    ...MIRACLES.map((m) => ({ key: `miracle|${m.god}|${m.name}`, title: m.name, meta: `Miracle · ${m.god}`, detail: m.effect })),
  ];
  const toggle = (k: string) => {
    const [kind, a, b] = k.split('|');
    touch((x) => kind === 'spell'
      ? { ...x, spells: x.spells.some((s) => s.lore === a && s.name === b) ? x.spells.filter((s) => !(s.lore === a && s.name === b)) : [...x.spells, { lore: a, name: b }] }
      : { ...x, miracles: x.miracles.some((m) => m.god === a && m.name === b) ? x.miracles.filter((m) => !(m.god === a && m.name === b)) : [...x.miracles, { god: a, name: b }] });
  };

  const actions = (edit: (() => void) | null, remove: () => void) => (
    <div style={{ display: 'flex', gap: 8 }}>
      {edit && <button className="btn btn-secondary" style={{ flex: 1, minHeight: 44 }} onClick={edit}>Edit</button>}
      <button className="danger-btn" style={{ flex: 1, minHeight: 44 }} onClick={remove}>Remove</button>
    </div>
  );

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '18px 22px 4px' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}><span className="kicker">{c.identity.name}</span><h1 className="screen-title" style={{ margin: 0 }}>Inventory</h1></div>
      </div>
      <Section kicker="Currency" pad="14px 22px 20px">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8 }}>
          {(['drops', 'phials', 'spheres'] as const).map((k) => (
            <div key={k} className="panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '10px 4px' }}>
              <label className="label" htmlFor={`cur-${k}`}>{k[0].toUpperCase() + k.slice(1)}</label>
              <input id={`cur-${k}`} inputMode="numeric" pattern="[0-9]*" value={c.currency[k]} onChange={(e) => setMoney(k, e.target.value)} onFocus={(e) => e.target.select()}
                className="heading tnum" style={{ width: '100%', textAlign: 'center', fontSize: 26, border: 0, background: 'transparent', color: 'var(--q-ink)', minHeight: 44, padding: 0 }} />
            </div>
          ))}
        </div>
      </Section>
      <Section kicker="Items" meta={`${c.items.length} item${c.items.length === 1 ? '' : 's'}`} pad="0 22px 20px">
        <div className="panel" style={{ overflow: 'visible' }}>
          {c.items.length === 0 && <p className="muted" style={{ margin: 0, padding: 14, fontStyle: 'italic', fontSize: 14 }}>Nothing carried yet.</p>}
          {c.items.map((i, k) => (
            <div key={i.id} style={{ borderTop: rule(k) }}>
              <PopRow open={open === i.id} onToggle={() => setOpen(open === i.id ? null : i.id)} rowStyle={{ minHeight: 54, gap: 12 }}
                row={<>
                  <span style={{ flex: 1, display: 'flex', flexDirection: 'column', textAlign: 'left' }}><span className="heading" style={{ fontSize: 17 }}>{i.name}</span><span className="meta">{itemMeta(i)}{i.worn ? ' · worn' : ''}</span></span>
                  {i.qty > 1 && <span className="pill tnum">×{i.qty}</span>}
                </>}>
                <ItemPop item={i} onClose={() => setOpen(null)} actions={actions(() => { setEditing(i); setOpen(null); }, () => { touch((x) => ({ ...x, items: x.items.filter((y) => y.id !== i.id) })); setOpen(null); })} />
              </PopRow>
            </div>
          ))}
        </div>
        <button className="dashed-btn" style={{ minHeight: 48, fontSize: 16 }} onClick={() => setEditing('new')}><Icon n="plus" size={17} />Add item</button>
      </Section>
      <Section kicker="Spells and Miracles" pad="0 22px 20px">
        <div className="panel" style={{ overflow: 'visible' }}>
          {c.spells.length + c.miracles.length === 0 && <p className="muted" style={{ margin: 0, padding: 14, fontStyle: 'italic', fontSize: 14 }}>None yet.</p>}
          {c.spells.map((s, k) => {
            const key = `spell|${s.lore}|${s.name}`;
            return (
              <div key={key} style={{ borderTop: rule(k) }}>
                <PopRow open={open === key} onToggle={() => setOpen(open === key ? null : key)} rowStyle={{ minHeight: 54, gap: 12 }}
                  row={<span style={{ flex: 1, display: 'flex', flexDirection: 'column', textAlign: 'left' }}><span className="heading" style={{ fontSize: 17 }}>{s.name}</span><span className="meta">{spellMeta(findSpell(s.lore, s.name), s)}</span></span>}>
                  <SpellPop s={s} onClose={() => setOpen(null)} actions={actions(null, () => { toggle(key); setOpen(null); })} />
                </PopRow>
              </div>
            );
          })}
          {c.miracles.map((m, k) => {
            const key = `miracle|${m.god}|${m.name}`;
            return (
              <div key={key} style={{ borderTop: rule(k + c.spells.length) }}>
                <PopRow open={open === key} onToggle={() => setOpen(open === key ? null : key)} rowStyle={{ minHeight: 54, gap: 12 }}
                  row={<span style={{ flex: 1, display: 'flex', flexDirection: 'column', textAlign: 'left' }}><span className="heading" style={{ fontSize: 17 }}>{m.name}</span><span className="meta">{miracleMeta(findMiracle(m.god, m.name), m)}</span></span>}>
                  <MiraclePop m={m} onClose={() => setOpen(null)} actions={actions(null, () => { toggle(key); setOpen(null); })} />
                </PopRow>
              </div>
            );
          })}
        </div>
        <button className="dashed-btn" style={{ minHeight: 48, fontSize: 16 }} onClick={() => setAdding(true)}><Icon n="plus" size={17} />Add spell or Miracle</button>
        <p className="muted" style={{ margin: 0, fontSize: 13, fontStyle: 'italic' }}>New spells and Miracles are learned in downtime. Add them here when your GM agrees.</p>
      </Section>
      {editing && <ItemSheet item={editing === 'new' ? null : editing} onClose={() => setEditing(null)}
        onSave={(it) => { touch((x) => ({ ...x, items: x.items.some((y) => y.id === it.id) ? x.items.map((y) => (y.id === it.id ? it : y)) : [...x.items, it] })); setEditing(null); }} />}
      {adding && (
        <Chooser label="Add spell or Miracle" items={addItems} selected={owned} max={Infinity} onClose={() => setAdding(false)} onToggle={toggle}
          groups={[{ name: 'Spells', match: (k) => k.startsWith('spell|') }, { name: 'Miracles', match: (k) => k.startsWith('miracle|') },
            ...[...LORE_NAMES.filter((l) => SPELLS.some((s) => s.lore === l)), 'Common'].map((l) => ({ name: l, match: (k: string) => k.startsWith(`spell|${l}|`) })),
            ...GODS.map((g) => ({ name: g, match: (k: string) => k.startsWith(`miracle|${g}|`) }))]} />
      )}
    </>
  );
}
