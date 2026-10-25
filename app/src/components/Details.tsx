import { useState } from 'react';
import { TRAITS, findArmour, findMiracle, findSpell, findTalent, findWeapon, type MiracleInfo, type SpellInfo } from '../data/kb';
import { talentLabel, type Item, type MiracleRef, type SpellRef, type TalentRef } from '../domain/model';
import { Nested, PopHead, RichText, Stat, StatStrip } from './common';

/** The body of a Talent popover. */
export function TalentPop({ t, onClose }: { t: TalentRef; onClose: () => void }) {
  const info = findTalent(t.name);
  return (
    <>
      <PopHead kicker={t.source === 'core' ? 'Core Talent' : 'Talent'} title={talentLabel(t) + (t.times > 1 ? ` ×${t.times}` : '')} onClose={onClose} />
      {info ? <RichText text={info.effect} exclude={[info.name.replace(/\s*\(.*\)$/, '')]} /> : <p className="muted" style={{ margin: 0 }}>This Talent is not in the rules data.</p>}
      {info && (
        <div className="meta tnum" style={{ gap: '4px 14px' }}>
          {info.requirement && <span>Requires: {info.requirement}</span>}
          <span>Source: {info.book}, p. {info.page}</span>
        </div>
      )}
    </>
  );
}

const traitName = (t: string) => t.replace(/\s*\(.*\)$/, '');
const traitText = (t: string): string | undefined => TRAITS[t] ?? TRAITS[traitName(t)] ?? Object.entries(TRAITS).find(([k]) => traitName(k) === traitName(t))?.[1];

/** Trait chips; tapping one opens a nested popover. */
export function Traits({ traits }: { traits: string[] }) {
  const [open, setOpen] = useState<string | null>(null);
  if (!traits.length) return null;
  const text = open ? traitText(open) : undefined;
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span className="label">Traits</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {traits.map((t) => <button key={t} className="chip" aria-pressed={open === t} aria-expanded={open === t} onClick={() => setOpen(open === t ? null : t)} style={{ minHeight: 40, padding: '0 12px' }}>{t}</button>)}
        </div>
      </div>
      {open && <Nested kicker="Trait" title={open} text={text ?? 'No description in the rules data.'} onClose={() => setOpen(null)} />}
    </>
  );
}

export function itemKindLabel(i: Item): string {
  if (!i.base) return 'Gear';
  return { melee: 'Weapon', ranged: 'Weapon', armour: 'Armour', shield: 'Shield', gear: 'Gear' }[i.base.kind];
}

export function itemMeta(i: Item): string {
  const k = itemKindLabel(i);
  return i.base && i.base.kind !== 'gear' ? `${k} · ${i.base.name}` : k;
}

/** The body of an item popover. `actions` is the Edit / Remove row. */
export function ItemPop({ item, onClose, actions }: { item: Item; onClose: () => void; actions?: React.ReactNode }) {
  const w = item.base && (item.base.kind === 'melee' || item.base.kind === 'ranged') ? findWeapon(item.base.name) : undefined;
  const a = item.base && (item.base.kind === 'armour' || item.base.kind === 'shield') ? findArmour(item.base.name) : undefined;
  return (
    <>
      <PopHead kicker={itemMeta(item)} title={item.name} onClose={onClose} />
      {w && <StatStrip><Stat label="Damage" value={w.damage} /><Stat label="Cost" value={w.cost ?? '—'} /><Stat label="Availability" value={w.availability} /></StatStrip>}
      {a && (
        <StatStrip>
          <Stat label={a.armour !== undefined ? 'Armour' : 'Defence'} value={a.armour !== undefined ? a.armour : `+${a.defenceStepBonus ?? 1} step`} />
          <Stat label="Cost" value={a.cost} /><Stat label="Availability" value={a.availability} />
        </StatStrip>
      )}
      <Traits traits={w?.traits ?? a?.traits ?? []} />
      {a?.requirement && <p className="muted" style={{ margin: 0, fontSize: 14 }}>Requires {a.requirement.attribute} {a.requirement.value}.</p>}
      {item.notes && <p className="muted" style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>{item.notes}</p>}
      {actions}
    </>
  );
}

export function spellMeta(s: SpellInfo | undefined, ref: SpellRef) { return `Spell · ${ref.lore}${s ? ` · DN ${s.dn}` : ''}`; }
export function miracleMeta(m: MiracleInfo | undefined, ref: MiracleRef) { return `Miracle · ${ref.god}${m && m.mettleCost ? ` · ${m.mettleCost} Mettle` : ''}`; }

export function SpellPop({ s, onClose, actions }: { s: SpellRef; onClose: () => void; actions?: React.ReactNode }) {
  const info = findSpell(s.lore, s.name);
  return (
    <>
      <PopHead kicker={`Spell · ${s.lore}`} title={s.name} onClose={onClose} />
      {info ? (
        <>
          <StatStrip cols={2}><Stat label="DN" value={info.dn} /><Stat label="Range" value={info.range} /><Stat label="Target" value={info.target} /><Stat label="Duration" value={info.duration} /></StatStrip>
          <RichText text={info.effect} exclude={[info.name]} />
          {info.overcast && <p className="muted" style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}><b>Overcast:</b> {info.overcast}</p>}
        </>
      ) : <p className="muted" style={{ margin: 0 }}>This spell is not in the rules data.</p>}
      {actions}
    </>
  );
}

export function MiraclePop({ m, onClose, actions }: { m: MiracleRef; onClose: () => void; actions?: React.ReactNode }) {
  const info = findMiracle(m.god, m.name);
  return (
    <>
      <PopHead kicker={`Miracle · ${m.god}`} title={m.name} onClose={onClose} />
      {info ? (
        <>
          <StatStrip cols={2}><Stat label="Mettle" value={info.mettleCost || '—'} /><Stat label="Range" value={info.range} /><Stat label="Target" value={info.target} /><Stat label="Duration" value={info.duration} /></StatStrip>
          <RichText text={info.effect} exclude={[info.name]} />
        </>
      ) : <p className="muted" style={{ margin: 0 }}>This Miracle is not in the rules data.</p>}
      {actions}
    </>
  );
}
