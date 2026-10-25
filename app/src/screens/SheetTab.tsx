import { useRef, useState } from 'react';
import { Icon, type IconName } from '../components/Icon';
import { ItemPop, TalentPop } from '../components/Details';
import { IconBtn, PortraitFrame, PopRow, Section, rule } from '../components/common';
import { ATTRS, ATTR_LABEL, SKILL_NAMES, findWeapon } from '../data/kb';
import { availableXp, newId, talentLabel, type Character, type WoundType } from '../domain/model';
import { DN_TABLE, LADDER, attacks, derive } from '../domain/rules';
import { portraitFromFile } from '../image';
import { useStore } from '../state/store';
import { useMedia } from '../router';

const woundLabel: Record<WoundType, string> = { minor: 'Minor wound', serious: 'Serious wound', deadly: 'Deadly wound' };
const COMBAT: { key: 'melee' | 'accuracy' | 'defence'; name: string; icon: IconName }[] = [
  { key: 'melee', name: 'Melee', icon: 'sword' }, { key: 'accuracy', name: 'Accuracy', icon: 'crosshair' }, { key: 'defence', name: 'Defence', icon: 'shield' },
];

export function SheetTab({ c, onAddXp, onSpendXp, onMenu }: { c: Character; onAddXp: () => void; onSpendXp: () => void; onMenu: () => void }) {
  const { update, say } = useStore();
  const wide = useMedia('(min-width: 768px)');
  const d = derive(c);
  const file = useRef<HTMLInputElement>(null);
  const [openTalent, setOpenTalent] = useState<number | null>(null);
  const [openAttack, setOpenAttack] = useState<string | null>(null);
  const [addingConn, setAddingConn] = useState(false);
  const [cn, setCn] = useState('');
  const [cr, setCr] = useState('');

  const avail = availableXp(c);
  const mettle = Math.min(c.mettle.current, d.mettle);
  const tough = Math.min(c.toughness.current, d.toughness);
  const pct = c.xp.earned > 0 ? Math.round((avail / c.xp.earned) * 100) : 0;
  const rows = attacks(c, findWeapon);
  const full = c.wounds.length >= d.woundSpaces;

  const setPortrait = async (f: File | undefined) => {
    if (!f) return;
    try { const p = await portraitFromFile(f); update((x) => ({ ...x, identity: { ...x.identity, portrait: p }, updatedAt: new Date().toISOString() })); }
    catch (e) { say((e as Error).message); }
  };
  const touch = (fn: (x: Character) => Character) => update((x) => ({ ...fn(x), updatedAt: new Date().toISOString() }));

  const xpBlock = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span className="label">Experience</span>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span className="heading tnum" style={{ fontSize: wide ? 44 : 40, lineHeight: 1 }} aria-label={`${avail} XP available`}>{avail}</span>
        <span className="heading tnum muted" style={{ fontSize: wide ? 24 : 22 }} aria-label={`of ${c.xp.earned} earned`}>/ {c.xp.earned}</span>
      </div>
      <div className="bar" style={{ height: 7 }}><div style={{ width: `${pct}%`, background: 'linear-gradient(90deg, var(--color-accent-500), var(--color-accent-400))' }} /></div>
      <span className="meta tnum">{avail} to spend · {c.xp.earned} earned</span>
    </div>
  );
  const xpButtons = (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8 }}>
      <button className="btn btn-secondary" onClick={onAddXp} style={{ minHeight: 46, gap: 4, padding: '0 6px' }}><Icon n="plus" size={15} stroke={1.8} />Add XP</button>
      <button className="btn btn-primary inked" onClick={onSpendXp} style={{ minHeight: 46, padding: '0 6px' }}>Spend XP</button>
    </div>
  );

  const attributes = (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8, padding: wide ? 0 : '0 22px 22px' }}>
      {ATTRS.map((k) => (
        <div key={k} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <span className="portrait tnum" style={{ width: wide ? 76 : 68, height: wide ? 76 : 68, fontSize: wide ? 38 : 34, fontWeight: 600 }} aria-label={`${ATTR_LABEL[k]} ${c.attributes[k]}`}>{c.attributes[k]}</span>
          <span className="heading" style={{ fontSize: 19 }}>{ATTR_LABEL[k]}</span>
        </div>
      ))}
    </div>
  );

  const skills = (
    <Section kicker="Skills" meta="Training / Focus" pad={wide ? '0' : '0 22px 22px'}>
      <div className="panel" style={{ overflow: 'hidden', display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
        {SKILL_NAMES.map((s, i) => {
          const l = c.skills[s] ?? { training: 0, focus: 0 };
          const ink = l.training || l.focus ? 'var(--q-ink)' : 'var(--color-accent-800)';
          return (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, minHeight: wide ? 46 : 44, padding: '0 12px', borderTop: i < 2 ? '0' : '1px solid var(--q-rule)', borderLeft: i % 2 ? '1px solid var(--q-rule)' : '0' }}>
              <span style={{ flex: 1, minWidth: 0, fontSize: wide ? 15 : 14, color: ink }}>{s}{c.coreSkill === s && <span className="sr-only"> (Core Skill)</span>}</span>
              <span className="heading tnum" aria-label={`Training ${l.training}, Focus ${l.focus}`} style={{ fontSize: wide ? 19 : 18, color: ink }}>{l.training}/{l.focus}</span>
            </div>
          );
        })}
      </div>
    </Section>
  );

  const combat = (
    <Section kicker="Combat abilities" pad={wide ? '0' : '0 22px 22px'}>
      <div className="panel" style={{ overflow: 'hidden' }}>
        {COMBAT.map((x, i) => {
          const idx = d[`${x.key}Index` as 'meleeIndex'];
          return (
            <div key={x.key} style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 56, padding: '0 14px', borderTop: rule(i) }}>
              <span style={{ width: 22, display: 'grid', placeItems: 'center', color: 'var(--color-accent-800)' }}><Icon n={x.icon} size={20} /></span>
              <span style={{ width: 74, fontSize: 15 }}>{x.name}</span>
              <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span className="heading" style={{ fontSize: 18 }}>{LADDER[idx]} <span className="tnum" style={{ fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: 12, color: 'var(--color-accent-800)' }}>({d[x.key]})</span></span>
                <span style={{ display: 'flex', gap: 5 }} aria-hidden="true">
                  {LADDER.map((_, k) => <span key={k} style={{ width: 9, height: 9, borderRadius: '50%', boxSizing: 'border-box', border: '1.5px solid var(--color-accent-700)', background: k <= idx ? 'var(--color-accent-700)' : 'transparent' }} />)}
                </span>
              </span>
            </div>
          );
        })}
        <details style={{ borderTop: '1px solid var(--q-rule)' }}>
          <summary className="heading" style={{ minHeight: 44, display: 'flex', alignItems: 'center', padding: '0 14px', cursor: 'pointer', fontSize: 15, color: 'var(--color-accent-700)' }}>Attack DN table</summary>
          <div style={{ padding: '0 14px 12px', fontSize: 13 }}>
            <div className="label" style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}><span>Melee or Accuracy vs Defence</span><span>DN</span></div>
            {DN_TABLE.map((r) => <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderTop: '1px solid var(--q-rule)' }}><span>{r.label}</span><span className="tnum heading" style={{ fontSize: 16 }}>{r.dn}</span></div>)}
          </div>
        </details>
      </div>
    </Section>
  );

  const stat3 = (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8, padding: wide ? 0 : '0 22px 10px' }}>
      {[['Initiative', d.initiative], ['Nat. Awareness', d.naturalAwareness], ['Armour', d.armour]].map(([l, v]) => (
        <div key={l} className="panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '12px 4px' }}>
          <span className="label" style={{ textAlign: 'center' }}>{l}</span><span className="heading tnum" style={{ fontSize: 30 }}>{v}</span>
        </div>
      ))}
    </div>
  );

  const pool = (name: 'Mettle' | 'Toughness', cur: number, max: number, set: (v: number) => void) => (
    <div key={name} className="panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '12px 8px' }}>
      <span className="label">{name}</span>
      <span style={{ display: 'flex', alignItems: 'baseline', gap: 4 }} aria-label={`${name} ${cur} of ${max}`}><span className="heading tnum" style={{ fontSize: 34, lineHeight: 1 }}>{cur}</span><span className="heading tnum muted" style={{ fontSize: 18 }}>/ {max}</span></span>
      <span className="meta">Current / Total</span>
      <div style={{ display: 'flex', gap: 6 }}>
        <IconBtn n="minus" label={`Lower ${name}`} secondary disabled={cur <= 0} onClick={() => set(Math.max(0, cur - 1))} />
        <IconBtn n="plus" label={`Raise ${name}`} secondary disabled={cur >= max} onClick={() => set(Math.min(max, cur + 1))} />
      </div>
    </div>
  );
  const pools = (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8, padding: wide ? 0 : '0 22px 22px' }}>
      {pool('Mettle', mettle, d.mettle, (v) => touch((x) => ({ ...x, mettle: { current: v } })))}
      {pool('Toughness', tough, d.toughness, (v) => touch((x) => ({ ...x, toughness: { current: v } })))}
    </div>
  );

  const wounds = (
    <Section kicker="Wounds" meta={`${c.wounds.length} of ${d.woundSpaces} slots`} pad={wide ? '0' : '0 22px 22px'}>
      <div className="panel" style={{ overflow: 'hidden' }}>
        {c.wounds.map((w, i) => (
          <div key={w.id} style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 48, padding: '0 4px 0 14px', borderTop: rule(i) }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--q-wax)' }} />
            <span style={{ flex: 1, fontSize: 15 }}>{woundLabel[w.type]}</span>
            <IconBtn n="x" label={`Heal ${woundLabel[w.type]}`} onClick={() => touch((x) => ({ ...x, wounds: x.wounds.filter((y) => y.id !== w.id) }))} />
          </div>
        ))}
        {c.wounds.length === 0 && <p className="muted" style={{ margin: 0, padding: '12px 14px', fontStyle: 'italic', fontSize: 14 }}>No wounds.</p>}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 6, padding: 10, borderTop: '1px solid var(--q-rule)' }}>
          {(['minor', 'serious', 'deadly'] as WoundType[]).map((t) => (
            <button key={t} className="dashed-btn" disabled={full} onClick={() => touch((x) => ({ ...x, wounds: [...x.wounds, { id: newId(), type: t }] }))} style={{ minHeight: 44, fontSize: 14, opacity: full ? 0.5 : 1 }}>+ {t[0].toUpperCase() + t.slice(1)}</button>
          ))}
        </div>
        <button onClick={() => touch((x) => ({ ...x, mortallyWounded: !x.mortallyWounded }))} aria-pressed={c.mortallyWounded}
          style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', minHeight: 56, padding: '0 14px', border: 0, borderTop: '1px solid var(--q-rule)', background: c.mortallyWounded ? 'color-mix(in srgb, var(--q-wax) 14%, transparent)' : 'transparent', color: c.mortallyWounded ? 'var(--q-wax)' : 'var(--q-ink)', cursor: 'pointer', fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 18, textAlign: 'left' }}>
          <span className="seal" style={{ width: 30, height: 30, opacity: c.mortallyWounded ? 1 : 0.35 }}><Icon n="skull" size={16} stroke={1.8} /></span>
          <span style={{ flex: 1 }}>Mortally Wounded</span>
          <span className="meta" style={{ fontFamily: 'var(--font-body)', fontWeight: 400 }}>{c.mortallyWounded ? 'Yes' : 'No'}</span>
        </button>
      </div>
    </Section>
  );

  const attacksSec = (
    <Section kicker="Attacks" pad={wide ? '0' : '0 22px 22px'}>
      <div className="panel" style={{ overflow: 'visible' }}>
        {rows.length === 0 && <p className="muted" style={{ margin: 0, padding: '12px 14px', fontStyle: 'italic', fontSize: 14 }}>No weapons. Add one in Inventory.</p>}
        {rows.map((a, i) => {
          const item = c.items.find((x) => x.id === a.id)!;
          return (
            <div key={a.id} style={{ borderTop: rule(i) }}>
              <PopRow chevron={false} open={openAttack === a.id} onToggle={() => setOpenAttack(openAttack === a.id ? null : a.id)} rowStyle={{ flexDirection: 'column', alignItems: 'stretch', gap: 6, padding: '12px 14px', minHeight: 0, position: 'relative' }}
                row={
                  <>
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><span className="heading" style={{ fontSize: 18 }}>{a.name}</span></span>
                    <span style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 6 }}>
                      {[['Pool', a.pool], ['Focus', a.focus], ['Damage', a.damage]].map(([l, v]) => <span key={l} style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}><span className="label">{l}</span><span className="tnum heading" style={{ fontSize: 17 }}>{v}</span></span>)}
                    </span>
                    <span className="meta" style={{ textAlign: 'left' }}>Traits: {a.traits.join(', ') || 'none'}</span>
                  </>
                }>
                <ItemPop item={item} onClose={() => setOpenAttack(null)} />
              </PopRow>
            </div>
          );
        })}
      </div>
    </Section>
  );

  const talents = (
    <Section kicker="Talents" pad={wide ? '0' : '0 22px 22px'}>
      <div className="panel" style={{ overflow: 'visible' }}>
        {c.talents.length === 0 && <p className="muted" style={{ margin: 0, padding: '12px 14px', fontStyle: 'italic', fontSize: 14 }}>No Talents yet.</p>}
        {c.talents.map((t, i) => (
          <div key={`${t.name}-${t.choice}-${i}`} style={{ borderTop: rule(i) }}>
            <PopRow open={openTalent === i} onToggle={() => setOpenTalent(openTalent === i ? null : i)}
              row={<><span className="heading" style={{ flex: 1, fontSize: 17, textAlign: 'left' }}>{talentLabel(t)}{t.times > 1 ? ` ×${t.times}` : ''}</span>{t.source === 'core' && <span className="tag tag-accent" style={{ fontSize: 11, padding: '1px 7px', borderRadius: 3 }}>Core</span>}</>}>
              <TalentPop t={t} onClose={() => setOpenTalent(null)} />
            </PopRow>
          </div>
        ))}
      </div>
    </Section>
  );

  const goals = (
    <Section kicker="Goals" pad={wide ? '0' : '0 22px 22px'}>
      <div className="panel" style={{ overflow: 'hidden' }}>
        {[['Short-term', c.goals.short, 'short'], ['Long-term', c.goals.long, 'long']].map(([l, v, k], i) => (
          <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '12px 14px', borderTop: rule(i) }}>
            <label className="label" htmlFor={`goal-${k}`}>{l}</label>
            <input id={`goal-${k}`} className="bare-input" value={v} placeholder={`Add a ${(l as string).toLowerCase()} goal`} onChange={(e) => touch((x) => ({ ...x, goals: { ...x.goals, [k]: e.target.value } }))}
              style={{ border: 0, background: 'transparent', font: 'inherit', fontSize: 15, color: 'var(--q-ink)', padding: 0, minHeight: 28, width: '100%' }} />
          </div>
        ))}
      </div>
    </Section>
  );

  const connections = (
    <Section kicker="Connections" pad={wide ? '0' : '0 22px 22px'}>
      {c.connections.length > 0 && (
        <div className="panel" style={{ overflow: 'hidden' }}>
          {c.connections.map((x, i) => (
            <div key={x.id} style={{ display: 'flex', alignItems: 'center', padding: '6px 4px 6px 14px', borderTop: rule(i) }}>
              <span style={{ flex: 1, display: 'flex', flexDirection: 'column' }}><span className="heading" style={{ fontSize: 17 }}>{x.name}</span>{x.relation && <span className="meta">{x.relation}</span>}</span>
              <IconBtn n="x" label={`Remove ${x.name}`} onClick={() => touch((y) => ({ ...y, connections: y.connections.filter((z) => z.id !== x.id) }))} />
            </div>
          ))}
        </div>
      )}
      {addingConn ? (
        <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}><label className="label" htmlFor="conn-name">Name</label><input id="conn-name" className="input" value={cn} onChange={(e) => setCn(e.target.value)} style={{ minHeight: 44 }} /></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}><label className="label" htmlFor="conn-rel">Who they are to you</label><input id="conn-rel" className="input" value={cr} onChange={(e) => setCr(e.target.value)} style={{ minHeight: 44 }} /></div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button className="btn btn-secondary" style={{ minHeight: 44 }} onClick={() => { setAddingConn(false); setCn(''); setCr(''); }}>Cancel</button>
            <button className="btn btn-primary inked" style={{ minHeight: 44 }} disabled={!cn.trim()} onClick={() => { touch((x) => ({ ...x, connections: [...x.connections, { id: newId(), name: cn.trim(), relation: cr.trim() }] })); setAddingConn(false); setCn(''); setCr(''); }}>Add</button>
          </div>
        </div>
      ) : <button className="dashed-btn" style={{ minHeight: 46, fontSize: 16 }} onClick={() => setAddingConn(true)}><Icon n="plus" size={17} />Add connection</button>}
    </Section>
  );

  const head = (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, ...(wide ? {} : { padding: '18px 10px 4px 22px' }) }}>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span className="kicker">{c.identity.archetype} · {c.identity.species}</span>
        <h1 className={wide ? 'h1' : 'screen-title'} style={{ margin: 0 }}>{c.identity.name}</h1>
      </div>
      <IconBtn n="more" label="Character menu" onClick={onMenu} />
    </div>
  );

  const portrait = <PortraitFrame src={c.identity.portrait} label="Change portrait" w={wide ? 168 : 132} h={wide ? 216 : 170} onClick={() => file.current?.click()} />;
  const fileInput = <input ref={file} type="file" accept="image/*" hidden aria-label="Portrait file" onChange={(e) => { void setPortrait(e.target.files?.[0]); e.target.value = ''; }} />;

  if (wide) {
    return (
      <div className="screen-wide" style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', gap: 22, padding: '28px 32px 24px', alignItems: 'stretch' }}>
          {portrait}{fileInput}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {head}
            <div style={{ display: 'flex', gap: 22, alignItems: 'flex-end' }}><div style={{ flex: 1 }}>{xpBlock}</div><div style={{ minWidth: 220 }}>{xpButtons}</div></div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 24, padding: '0 32px 24px', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>{attributes}{skills}{goals}{connections}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>{combat}{stat3}{pools}{wounds}{attacksSec}{talents}</div>
        </div>
      </div>
    );
  }
  return (
    <>
      {head}
      <div style={{ display: 'flex', gap: 14, padding: '14px 22px 20px' }}>
        {portrait}{fileInput}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 12, justifyContent: 'center' }}>{xpButtons}{xpBlock}</div>
      </div>
      {attributes}{skills}{combat}{stat3}{pools}{wounds}{attacksSec}{talents}{goals}{connections}
    </>
  );
}
