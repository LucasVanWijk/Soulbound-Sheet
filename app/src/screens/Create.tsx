import { useMemo, useState, type ReactNode } from 'react';
import { Chooser, type ChoiceItem } from '../components/Chooser';
import { DetailsForm } from '../components/DetailsForm';
import { Icon } from '../components/Icon';
import { Initial, RichText, Section, rule } from '../components/common';
import {
  FIXED_SPELLS, SPELLS_AT_CREATION, allowedSkills, baseLevel, budget, buildCharacter, coreSkillOf, coreTalentOpenChoices,
  coreTalentRefs, emptyDraft, gearComplete, gearKey, godOf, grantsMiracle, grantsSpells, levelOf, parseGearOption, setAelfSkill, setLevel,
  skillSpend, speciesOf, spellLore, spellOptions, startingAttributes, step1Done, step2Done, step3Done, step4Done, talentChoiceNeeded,
  talentPicksUsed, weaponChoices, type Draft,
} from '../domain/creation';
import { derive, ladderName } from '../domain/rules';
import {
  ARCHETYPES, ATTRS, ATTR_LABEL, MIRACLES, SKILL_NAMES, SPECIES, TALENTS, findArchetype, findTalent, splitTalentName, talentChoiceOptions,
  type ArchetypeInfo,
} from '../data/kb';
import { paths } from '../router';
import { useStore } from '../state/store';

type Patch = (fn: (d: Draft) => Draft) => void;

function Shell({ step, title, archetype, onBack, children, footer, go }: { step: 1 | 2 | 3 | 4; title: string; archetype?: string; onBack: () => void; children: ReactNode; footer: ReactNode; go: (h: string) => void }) {
  return (
    <>
      <div className="app-scroll fill" style={{ padding: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px 0 8px', minHeight: 52 }}>
          <button className="btn btn-icon btn-ghost inked" aria-label={step === 1 ? 'Back to start' : 'Back'} onClick={onBack} style={{ width: 44, height: 44 }}><Icon n="chevron-left" size={20} /></button>
          <span className="heading" style={{ fontSize: 17 }}>New character</span>
          <button className="btn btn-ghost inked" style={{ minHeight: 44 }} onClick={() => go(paths.start)}>Cancel</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '10px 22px 16px' }}>
          <span className="kicker tnum">Step {step} of 4{archetype ? ` · ${archetype}` : ''}</span>
          <h1 className="screen-title" style={{ margin: 0 }}>{title}</h1>
          <div className="bar" style={{ height: 6 }}><div style={{ width: `${step * 25}%`, background: 'var(--color-accent-500)' }} /></div>
        </div>
        {children}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '14px 22px calc(26px + env(safe-area-inset-bottom, 0px))', borderTop: '1px solid var(--q-rule)', background: 'var(--q-parch)' }}>{footer}</div>
    </>
  );
}

function Footer({ back, next, nextLabel, ok, hint }: { back: () => void; next: () => void; nextLabel: string; ok: boolean; hint?: string }) {
  return (
    <>
      {!ok && hint && <span className="meta" style={{ justifyContent: 'center' }}>{hint}</span>}
      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn btn-secondary" style={{ flex: 1, minHeight: 48 }} onClick={back}>Back</button>
        <button className="btn btn-primary inked" style={{ flex: 2, minHeight: 48 }} disabled={!ok} onClick={next}>{nextLabel}</button>
      </div>
    </>
  );
}

// ── Step 1 ───────────────────────────────────────────────────────────────────

const speciesChips = ['All', ...SPECIES, 'Any'];

function Step1({ draft, patch, go }: { draft: Draft; patch: Patch; go: (h: string) => void }) {
  const [filter, setFilter] = useState('All');
  const list = ARCHETYPES.filter((a) => filter === 'All' || a.species === filter);
  const ok = step1Done(draft);
  const pick = (a: ArchetypeInfo) => patch((d) => (d.archetypeId === a.id ? d : { ...emptyDraft(), details: d.details, archetypeId: a.id, species: a.species === 'Any' ? d.species : '' }));
  return (
    <Shell step={1} title="Choose an archetype" onBack={() => go(paths.start)} go={go}
      footer={<Footer back={() => go(paths.start)} next={() => go(paths.create(2))} nextLabel="Next: Attributes" ok={ok} hint={draft.archetypeId ? 'Choose a species to continue.' : 'Choose an archetype to continue.'} />}>
      <p className="muted" style={{ margin: '0 22px 12px', fontSize: 14, lineHeight: 1.5 }}>Your archetype sets your species, Attributes, Skills, Core Talent and starting gear. You can tweak a little in the next step.</p>
      <div className="hscroll" style={{ gap: 6, padding: '0 22px 14px' }}>
        {speciesChips.filter((s) => s === 'All' || ARCHETYPES.some((a) => a.species === s)).map((s) => (
          <button key={s} className="chip" aria-pressed={filter === s} onClick={() => setFilter(s)} style={{ padding: '8px 14px', minHeight: 40, whiteSpace: 'nowrap' }}>{s === 'Any' ? 'Any species' : s}</button>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '0 22px 20px' }}>
        {list.map((a) => {
          const sel = draft.archetypeId === a.id;
          const core = a.coreSkill ?? a.coreSkillChoices.join(' or ');
          const gear = a.equipment.map((e) => e.options[0].replace(/\s*\(.*\)/, ''));
          return (
            <div key={a.id} style={{ border: `1px solid ${sel ? 'var(--color-accent-700)' : 'var(--q-rule)'}`, background: sel ? 'var(--q-tint)' : 'transparent', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <button onClick={() => pick(a)} aria-pressed={sel} style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%', padding: '12px 14px', minHeight: 68, border: 0, background: 'transparent', color: 'var(--q-ink)', textAlign: 'left', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                <Initial name={a.name} />
                <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span className="heading" style={{ fontSize: 18 }}>{a.name}</span>
                  <span className="meta">{a.species === 'Any' ? 'Any species' : a.species}{a.subfaction ? ` (${a.subfaction})` : ''} · Core Skill: {core}</span>
                </span>
                <span style={{ width: 22, height: 22, borderRadius: '50%', border: '1.5px solid var(--color-accent-800)', display: 'grid', placeItems: 'center', flex: 'none' }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: sel ? 'var(--color-accent-800)' : 'transparent' }} />
                </span>
              </button>
              {sel && (
                <div style={{ borderTop: '1px solid var(--q-rule)', padding: '12px 14px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {a.summary && <p style={{ margin: 0, fontSize: 14, fontStyle: 'italic' }} className="muted">{a.summary}</p>}
                  <span className="kicker">What it gives you</span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8 }}>
                    {ATTRS.map((k) => (
                      <div key={k} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '8px 0', border: '1px solid var(--q-rule)', borderRadius: 'var(--radius-md)' }}>
                        <span className="label">{ATTR_LABEL[k]}</span><span className="heading tnum" style={{ fontSize: 24 }}>{a.attributes[k]}</span>
                      </div>
                    ))}
                  </div>
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14 }}>
                    <Bullet>Core Talent: {[...a.coreTalents, ...(a.coreTalentChoices.length ? [a.coreTalentChoices.join(' or ')] : [])].join(', ')}</Bullet>
                    <Bullet>Skills: {a.anySkill ? 'any' : `${a.skills.slice(0, 3).join(', ')}${a.skills.length > 3 ? ` +${a.skills.length - 3} more` : ''}`} · {a.skillXp} XP to spend</Bullet>
                    <Bullet>Choose {a.talentPicks} Talents from {a.talentOptions.length}{a.miracleGod ? ` or Miracles of ${a.miracleGod}` : ''}</Bullet>
                    <Bullet>Starting gear: {gear.slice(0, 2).join(', ')}{gear.length > 2 ? ` +${gear.length - 2} more` : ''} · {a.drops} drops</Bullet>
                  </ul>
                  {a.species === 'Any' && (
                    <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
                      <legend className="label" style={{ marginBottom: 6 }}>Species</legend>
                      <div className="hscroll" style={{ gap: 6 }}>
                        {SPECIES.map((s) => <button key={s} className="chip" aria-pressed={draft.species === s} onClick={() => patch((d) => ({ ...d, species: s }))} style={{ minHeight: 40, padding: '8px 14px', whiteSpace: 'nowrap' }}>{s}</button>)}
                      </div>
                    </fieldset>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Shell>
  );
}

const Bullet = ({ children }: { children: ReactNode }) => <li style={{ display: 'flex', gap: 10 }}><span className="bullet" style={{ marginTop: 7 }} /><span>{children}</span></li>;

// ── Step 2 ───────────────────────────────────────────────────────────────────

function Step2({ draft, patch, go, a }: { draft: Draft; patch: Patch; go: (h: string) => void; a: ArchetypeInfo }) {
  const [sel, setSel] = useState<string | null>(null);
  const [msg, setMsg] = useState('');
  const b = budget(a, draft);
  const base = startingAttributes(a, { ...draft, swap: null });
  const cur = startingAttributes(a, draft);
  const allowed = allowedSkills(a);
  const core = coreSkillOf(a, draft);
  const species = speciesOf(a, draft);
  const tmp = useMemo(() => { try { return derive(buildCharacter(draft, '')); } catch { return null; } }, [draft]);
  const ok = step2Done(draft);

  const tapAttr = (k: (typeof ATTRS)[number]) => {
    if (draft.swap) return;
    if (!sel) { setSel(k); return; }
    if (sel === k) { setSel(null); return; }
    patch((d) => ({ ...d, swap: [sel as 'body', k] }));
    setSel(null);
  };
  const tap = (skill: string, kind: 'training' | 'focus', n: number) => {
    const l = levelOf(a, draft, skill)[kind];
    const next = setLevel(a, draft, skill, kind, l === n && n > baseLevel(a, draft, skill)[kind] ? n - 1 : n);
    if (!next) { setMsg(!allowed.includes(skill) && core !== skill ? `${skill} is not on this archetype's list.` : n <= baseLevel(a, draft, skill)[kind] ? 'That mark comes from the archetype.' : 'Not enough XP left for that.'); return; }
    setMsg('');
    patch(() => next);
  };
  const col = (n: number) => (n > 0 ? 'var(--q-wax)' : 'var(--q-moss)');

  return (
    <Shell step={2} title="Attributes and Skills" archetype={a.name} onBack={() => go(paths.create(1))} go={go}
      footer={<Footer back={() => go(paths.create(1))} next={() => go(paths.create(3))} nextLabel="Next: Talents" ok={ok} hint={!core ? 'Choose a Core Skill first.' : 'Spend every point to continue.'} />}>
      <p className="muted" style={{ margin: '0 22px 12px', fontSize: 14, lineHeight: 1.5 }}>Your archetype set your Attributes and its Core Skill. Tap a mark to buy a level with your Skill XP, or tap it again to take it back. Marks from your archetype are locked.</p>
      <div style={{ position: 'sticky', top: 0, zIndex: 5, background: 'var(--q-parch)', borderTop: '1px solid var(--q-rule)', borderBottom: '1px solid var(--q-rule)', padding: '10px 22px', display: 'grid', gridTemplateColumns: `repeat(${b.bonusTotal ? 2 : 1}, minmax(0, 1fr))`, gap: 8 }}>
        <div role="status" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}><span className="label">Skill XP</span><span className="heading tnum" style={{ fontSize: 20, color: col(b.left) }}>{b.left} left</span></div>
        {b.bonusTotal > 0 && <div role="status" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}><span className="label">Aelf bonus (one Skill)</span><span className="heading tnum" style={{ fontSize: 20, color: col(b.bonusLeft) }}>{b.bonusLeft} left</span></div>}
      </div>
      <p aria-live="polite" className="meta" style={{ margin: 0, padding: msg ? '8px 22px 0' : 0, color: 'var(--q-wax)' }}>{msg}</p>

      {a.coreSkillChoices.length > 0 && (
        <div style={{ padding: '14px 22px 0' }}>
          <span className="kicker">Core Skill</span>
          <div className="seg" role="radiogroup" aria-label="Core Skill" style={{ display: 'grid', gridTemplateColumns: `repeat(${a.coreSkillChoices.length}, minmax(0, 1fr))`, marginTop: 8 }}>
            {a.coreSkillChoices.map((s) => (
              <label key={s} className="seg-opt" style={{ minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <input type="radio" name="coreskill" checked={draft.coreSkill === s} onChange={() => patch((d) => ({ ...d, coreSkill: s, training: {}, focus: {}, aelfSkill: null }))} />{s}
              </label>
            ))}
          </div>
        </div>
      )}

      <Section kicker="Attributes" meta={draft.swap ? undefined : 'Optional: swap two'} pad="18px 22px 8px">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8 }}>
          {ATTRS.map((k) => {
            const picked = sel === k;
            return (
              <button key={k} className="panel" onClick={() => tapAttr(k)} aria-pressed={picked} disabled={!!draft.swap}
                aria-label={`${ATTR_LABEL[k]} ${cur[k]}${draft.swap ? '' : ', tap to swap'}`}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '12px 6px 10px', cursor: draft.swap ? 'default' : 'pointer', background: picked ? 'var(--q-tint)' : 'transparent', borderColor: picked ? 'var(--color-accent-700)' : undefined, color: 'var(--q-ink)', fontFamily: 'var(--font-body)' }}>
                <span className="label">{ATTR_LABEL[k]}</span>
                <span className="portrait tnum" style={{ width: 56, height: 56, fontSize: 28, fontWeight: 600 }}>{cur[k]}</span>
                <span className="meta tnum" style={{ fontSize: 11 }}>{cur[k] !== base[k] ? `Archetype ${base[k]}` : 'From archetype'}</span>
              </button>
            );
          })}
        </div>
        {draft.swap ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon n="swap" size={16} /><span style={{ flex: 1, fontSize: 14 }}>Swapped {ATTR_LABEL[draft.swap[0]]} and {ATTR_LABEL[draft.swap[1]]}.</span>
            <button className="btn btn-ghost inked" style={{ minHeight: 44 }} onClick={() => patch((d) => ({ ...d, swap: null }))}>Undo swap</button>
          </div>
        ) : <span className="meta">{sel ? `Now tap the Attribute to swap with ${ATTR_LABEL[sel as 'body']}.` : 'Tap one Attribute, then another, to swap their values (once).'}</span>}
      </Section>

      {b.bonusTotal > 0 && (
        <div style={{ padding: '10px 22px 0', display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label htmlFor="aelf" className="label">Long-Lived: the +2 XP goes on</label>
          <select id="aelf" className="input" value={draft.aelfSkill ?? ''} onChange={(e) => patch((d) => setAelfSkill(a, d, e.target.value || null))} style={{ minHeight: 44 }}>
            <option value="">The first Skill you raise</option>
            {allowed.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      )}

      <Section kicker="Skills" meta={<span style={{ display: 'inline-flex', gap: 10 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><span style={{ width: 11, height: 11, background: 'var(--color-accent-800)', borderRadius: 2 }} />Archetype</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><span style={{ width: 11, height: 11, background: 'var(--color-accent-400)', border: '1.5px solid var(--color-accent-700)', borderRadius: 2, boxSizing: 'border-box' }} />Yours</span></span>} pad="14px 22px 8px">
        <div className="panel" style={{ overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '6px 10px 6px 14px' }}>
            <span style={{ flex: 1 }} /><span className="label" style={{ width: 84, textAlign: 'center' }}>Training</span><span className="label" style={{ width: 84, textAlign: 'center' }}>Focus</span>
          </div>
          {SKILL_NAMES.map((s) => {
            const lv = levelOf(a, draft, s), bs = baseLevel(a, draft, s);
            const can = allowed.includes(s) || core === s;
            const spent = skillSpend(a, draft, s);
            return (
              <div key={s} style={{ display: 'flex', alignItems: 'center', minHeight: 44, padding: '0 10px 0 14px', borderTop: '1px solid var(--q-rule)', opacity: can ? 1 : 0.5 }}>
                <span style={{ flex: 1, fontSize: 15 }}>{s}{core === s && <span className="meta"> · Core</span>}{spent > 0 && <span className="meta tnum"> · {spent} XP</span>}</span>
                {(['training', 'focus'] as const).map((kind) => (
                  <span key={kind} style={{ display: 'flex', width: 84, justifyContent: 'center' }}>
                    {[1, 2, 3].map((n) => {
                      const isBase = n <= bs[kind], isX = !isBase && n <= lv[kind];
                      return (
                        <button key={n} onClick={() => tap(s, kind, n)} disabled={!can} aria-pressed={isBase || isX} aria-label={`${s} ${kind} ${n}${isBase ? ', from archetype' : ''}`}
                          style={{ width: 28, height: 44, display: 'grid', placeItems: 'center', border: 0, background: 'transparent', padding: 0, cursor: can ? 'pointer' : 'not-allowed' }}>
                          <span style={{ width: kind === 'training' ? 14 : 11, height: kind === 'training' ? 14 : 11, boxSizing: 'border-box', borderRadius: kind === 'training' ? 2 : 0, transform: kind === 'focus' ? 'rotate(45deg)' : undefined, border: `1.5px solid ${isBase ? 'var(--color-accent-800)' : isX ? 'var(--color-accent-700)' : 'var(--color-accent-600)'}`, background: isBase ? 'var(--color-accent-800)' : isX ? 'var(--color-accent-400)' : 'transparent' }} />
                        </button>
                      );
                    })}
                  </span>
                ))}
              </div>
            );
          })}
        </div>
      </Section>

      <Section kicker="Worked out for you" pad="14px 22px 20px">
        {tmp && (
          <div className="panel" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
            {[['Initiative', tmp.initiative], ['Awareness', tmp.naturalAwareness], ['Mettle', tmp.mettle]].map(([l, v], i) => (
              <div key={l} style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 2, borderLeft: i ? '1px solid var(--q-rule)' : 0 }}><span className="label">{l}</span><span className="heading tnum" style={{ fontSize: 20 }}>{v}</span></div>
            ))}
            {[['Melee', tmp.melee], ['Accuracy', tmp.accuracy], ['Defence', tmp.defence]].map(([l, v], i) => (
              <div key={l} style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 2, borderTop: '1px solid var(--q-rule)', borderLeft: i ? '1px solid var(--q-rule)' : 0 }}><span className="label">{l}</span><span className="heading" style={{ fontSize: 18 }}>{ladderName(v as number)}</span></div>
            ))}
          </div>
        )}
        {species === 'Duardin' && <span className="meta">Duardin get 2 extra Wound spaces.</span>}
      </Section>
    </Shell>
  );
}

// ── Step 3 ───────────────────────────────────────────────────────────────────

function ChoicePicker({ name, value, onChange, id }: { name: string; value: string; onChange: (v: string) => void; id: string }) {
  const info = findTalent(name);
  const c = info ? talentChoiceOptions(info) : null;
  if (!c) return null;
  return (
    <div style={{ padding: '0 14px 12px 48px', display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label className="label" htmlFor={id}>{c.label}</label>
      {c.options
        ? <select id={id} className="input" value={value} onChange={(e) => onChange(e.target.value)} style={{ minHeight: 44 }}><option value="">Choose…</option>{c.options.map((o) => <option key={o}>{o}</option>)}</select>
        : <input id={id} className="input" value={value} onChange={(e) => onChange(e.target.value)} style={{ minHeight: 44 }} />}
    </div>
  );
}

function Step3({ draft, patch, go, a }: { draft: Draft; patch: Patch; go: (h: string) => void; a: ArchetypeInfo }) {
  const [info, setInfo] = useState<string | null>(null);
  const [chooser, setChooser] = useState<'spells' | 'first-miracle' | 'miracles' | 'adaptable' | null>(null);
  const ok = step3Done(draft);
  const species = speciesOf(a, draft);
  const used = talentPicksUsed(draft);
  const god = godOf(a, draft);
  const lore = spellLore(a, draft);
  const refs = coreTalentRefs(a, draft);
  const open = coreTalentOpenChoices(a, draft);
  const toggleTalent = (name: string) => patch((d) => {
    const has = d.talents.some((t) => t.name === name);
    if (has) return { ...d, talents: d.talents.filter((t) => t.name !== name) };
    if (talentPicksUsed(d) >= a.talentPicks) return d;
    return { ...d, talents: [...d.talents, { name, choice: splitTalentName(name).choice ?? '' }] };
  });
  const miracleItems: ChoiceItem[] = MIRACLES.filter((m) => m.god === 'Universal' || m.god === god).map((m) => ({ key: `${m.god}|${m.name}`, title: m.name, meta: `${m.god}${m.mettleCost ? ` · ${m.mettleCost} Mettle` : ''}`, detail: m.effect }));
  const spellItems: ChoiceItem[] = spellOptions(a, draft).map((s) => ({ key: `${s.lore}|${s.name}`, title: s.name, meta: `${s.lore} · DN ${s.dn} · ${s.range}`, detail: s.effect }));
  const talentItems: ChoiceItem[] = TALENTS.filter((t) => splitTalentName(t.name).base !== 'Spellcasting').map((t) => ({ key: t.name, title: t.name.replace(' (Choose)', ''), meta: t.requirement ? `Requires: ${t.requirement}` : t.book, detail: t.effect }));

  return (
    <Shell step={3} title="Talents and gear" archetype={a.name} onBack={() => go(paths.create(2))} go={go}
      footer={<Footer back={() => go(paths.create(2))} next={() => go(paths.create(4))} nextLabel="Next: Details" ok={ok} hint="Finish the choices above to continue." />}>
      <Section kicker="Core Talent" pad="4px 22px 12px">
        <div className="panel" style={{ overflow: 'hidden' }}>
          {a.coreTalents.map((n, i) => (
            <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', minHeight: 52, borderTop: rule(i) }}>
              <Icon n="lock" size={17} /><span className="heading" style={{ flex: 1, fontSize: 17 }}>{n.replace(/\s*\(choose\)/i, '')}</span><span className="meta">From archetype</span>
            </div>
          ))}
          {a.coreTalentChoices.length > 0 && (
            <div className="seg" role="radiogroup" aria-label="Core Talent" style={{ display: 'grid', gridTemplateColumns: `repeat(${a.coreTalentChoices.length}, minmax(0, 1fr))`, margin: 10 }}>
              {a.coreTalentChoices.map((n) => (
                <label key={n} className="seg-opt" style={{ minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                  <input type="radio" name="coretalent" checked={draft.coreTalent === n} onChange={() => patch((d) => ({ ...d, coreTalent: n }))} />{n}
                </label>
              ))}
            </div>
          )}
          {open.map((n) => (
            <div key={n} style={{ borderTop: '1px solid var(--q-rule)', paddingTop: 10 }}>
              <ChoicePicker id={`core-${n}`} name={n} value={draft.coreChoices[n] ?? ''} onChange={(v) => patch((d) => ({ ...d, coreChoices: { ...d.coreChoices, [n]: v } }))} />
            </div>
          ))}
        </div>
        {refs.some((r) => r.choice) && <span className="meta">{refs.filter((r) => r.choice).map((r) => `${splitTalentName(r.name).base}: ${r.choice}`).join(' · ')}</span>}
      </Section>

      <Section kicker="Choose Talents" meta={<span className="pill tnum">{used} of {a.talentPicks} chosen</span>} pad="8px 22px 12px">
        <div className="panel" style={{ overflow: 'hidden' }}>
          {a.talentOptions.map((o, i) => {
            const t = draft.talents.find((x) => x.name === o.name);
            const on = !!t;
            const full = !on && used >= a.talentPicks;
            const rec = findTalent(o.name);
            return (
              <div key={o.name} style={{ borderTop: rule(i), background: on ? 'var(--q-tint)' : 'transparent' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <button onClick={() => toggleTalent(o.name)} aria-pressed={on} aria-disabled={full} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12, padding: '0 14px', minHeight: 52, border: 0, background: 'transparent', color: full ? 'var(--color-accent-800)' : 'var(--q-ink)', opacity: full ? 0.6 : 1, textAlign: 'left', cursor: full ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)', fontSize: 15 }}>
                    <span className={'checkbox' + (on ? ' on' : '')} style={{ width: 22, height: 22 }}>{on && <Icon n="check" size={14} stroke={2.6} />}</span>
                    <span style={{ flex: 1 }}>{o.name.replace(' (Choose)', '')}{o.requirement && <span className="meta"> · has a requirement</span>}</span>
                  </button>
                  <button className="btn btn-icon btn-ghost inked" aria-label={`About ${o.name}`} aria-expanded={info === o.name} onClick={() => setInfo(info === o.name ? null : o.name)} style={{ width: 44, height: 44, marginRight: 4 }}><Icon n="info" size={18} /></button>
                </div>
                {info === o.name && rec && (
                  <div style={{ padding: '0 14px 12px 48px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <RichText text={rec.effect} exclude={[splitTalentName(rec.name).base]} />
                    <div className="meta tnum" style={{ gap: '4px 14px' }}>{rec.requirement && <span>Requires: {rec.requirement}</span>}<span>Source: {rec.book}, p. {rec.page}</span></div>
                  </div>
                )}
                {on && talentChoiceNeeded(o.name) && <ChoicePicker id={`t-${o.name}`} name={o.name} value={t!.choice} onChange={(v) => patch((d) => ({ ...d, talents: d.talents.map((x) => (x.name === o.name ? { ...x, choice: v } : x)) }))} />}
              </div>
            );
          })}
          {a.miracleGod && (
            <div style={{ borderTop: '1px solid var(--q-rule)' }}>
              {draft.miracles.map((m) => (
                <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 8px 0 14px', minHeight: 50, background: 'var(--q-tint)', borderBottom: '1px solid var(--q-rule)' }}>
                  <span className="checkbox on" style={{ width: 22, height: 22 }}><Icon n="check" size={14} stroke={2.6} /></span>
                  <span style={{ flex: 1, fontSize: 15 }}>Miracle: {m.name}</span>
                  <button className="btn btn-icon btn-ghost inked" aria-label={`Remove ${m.name}`} onClick={() => patch((d) => ({ ...d, miracles: d.miracles.filter((x) => x.name !== m.name) }))} style={{ width: 44, height: 44 }}><Icon n="x" size={17} /></button>
                </div>
              ))}
              <button className="row-btn" disabled={used >= a.talentPicks} onClick={() => setChooser('miracles')} style={{ gap: 12, padding: '0 14px', minHeight: 52, opacity: used >= a.talentPicks ? 0.5 : 1 }}>
                <Icon n="plus" size={17} /><span style={{ flex: 1, fontSize: 15 }}>A Miracle of {a.miracleGod}</span><Icon n="chevron-right" size={16} />
              </button>
            </div>
          )}
        </div>
      </Section>

      {species === 'Human' && (
        <Section kicker="Species bonus: Adaptable" pad="8px 22px 12px" meta={draft.adaptable ? '1 of 1' : '0 of 1'}>
          <button className="dashed-btn" style={{ minHeight: 48, fontSize: 16 }} onClick={() => setChooser('adaptable')}>
            <Icon n={draft.adaptable ? 'pencil' : 'plus'} size={17} />{draft.adaptable ? `${draft.adaptable.name.replace(' (Choose)', '')}${draft.adaptable.choice ? ` (${draft.adaptable.choice})` : ''}` : 'Choose any Talent you qualify for'}
          </button>
          {draft.adaptable && talentChoiceNeeded(draft.adaptable.name) && <ChoicePicker id="adaptable-choice" name={draft.adaptable.name} value={draft.adaptable.choice} onChange={(v) => patch((d) => ({ ...d, adaptable: d.adaptable && { ...d.adaptable, choice: v } }))} />}
        </Section>
      )}

      <Section kicker="Starting gear" pad="8px 22px 12px" meta={`${a.drops} drops`}>
        <div className="panel" style={{ padding: '4px 14px' }}>
          {a.equipment.map((e, i) => {
            const idx = Number(draft.gear[gearKey(i)] ?? 0);
            const opt = parseGearOption(e.options[idx] ?? e.options[0]);
            const multi = e.options.length > 1;
            return (
              <div key={i} style={{ borderTop: rule(i), padding: '6px 0' }}>
                {!multi ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, minHeight: 40 }}><span className="diamond" /><span style={{ flex: 1 }}>{cleanGear(e.options[0])}</span><span className="meta">From archetype</span></div>
                ) : (
                  <fieldset style={{ border: 0, margin: 0, padding: 0 }}>
                    <legend className="label" style={{ padding: '6px 0' }}>Choose one</legend>
                    <div className="seg" role="radiogroup" style={{ display: 'grid', gridTemplateColumns: 'repeat(1, minmax(0, 1fr))' }}>
                      {e.options.map((o, k) => (
                        <label key={k} className="seg-opt" style={{ minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '4px 8px' }}>
                          <input type="radio" name={`gear-${i}`} checked={draft.gear[gearKey(i)] === String(k)} onChange={() => patch((d) => ({ ...d, gear: { ...d.gear, [gearKey(i)]: String(k) } }))} />{cleanGear(o)}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                )}
                {opt.type === 'weapon' && Array.from({ length: opt.count }, (_, k) => (
                  <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: 5, padding: '6px 0' }}>
                    <label className="label" htmlFor={`w-${i}-${k}`}>{opt.count > 1 ? `Weapon ${k + 1}` : 'Weapon'}</label>
                    <select id={`w-${i}-${k}`} className="input" value={draft.gear[gearKey(i, k + 1)] ?? ''} onChange={(ev) => patch((d) => ({ ...d, gear: { ...d.gear, [gearKey(i, k + 1)]: ev.target.value } }))} style={{ minHeight: 44 }}>
                      <option value="">Choose…</option>
                      {weaponChoices(opt).map((w) => <option key={w.name}>{w.name}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
        {!gearComplete(a, draft) && <span className="meta">Make every gear choice to continue.</span>}
      </Section>

      {(grantsSpells(a, draft) || grantsMiracle(a, draft)) && (
        <Section kicker="Spells and Miracles" pad="8px 22px 20px">
          {grantsSpells(a, draft) && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="label">Spells{lore ? ` · ${lore}` : ''}</span><span className="pill tnum">{draft.spells.length} of {SPELLS_AT_CREATION}</span>
              </div>
              <p className="muted" style={{ margin: 0, fontSize: 13, fontStyle: 'italic' }}>You start with {FIXED_SPELLS.join(' and ')}, plus {SPELLS_AT_CREATION} spells from Common{lore ? ` or ${lore}` : ''}.</p>
              {draft.spells.length > 0 && <div className="panel">{draft.spells.map((s, i) => <div key={s.name} className="tnum" style={{ padding: '10px 14px', borderTop: rule(i) }}>{s.name} <span className="meta">· {s.lore}</span></div>)}</div>}
              <button className="dashed-btn" disabled={!lore} style={{ minHeight: 48, fontSize: 16 }} onClick={() => setChooser('spells')}><Icon n="plus" size={17} />{lore ? `Choose from Common and ${lore}` : 'Choose a Lore first'}</button>
            </>
          )}
          {grantsMiracle(a, draft) && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="label">First Miracle{god ? ` · ${god}` : ''}</span><span className="pill tnum">{draft.firstMiracle ? 1 : 0} of 1</span>
              </div>
              <button className="dashed-btn" disabled={!god} style={{ minHeight: 48, fontSize: 16 }} onClick={() => setChooser('first-miracle')}><Icon n={draft.firstMiracle ? 'pencil' : 'plus'} size={17} />{draft.firstMiracle ? draft.firstMiracle.name : `Choose from Universal and ${god ?? 'your god'}`}</button>
            </>
          )}
        </Section>
      )}

      {chooser === 'spells' && (
        <Chooser label="Choose spells" items={spellItems} selected={draft.spells.map((s) => `${s.lore}|${s.name}`)} max={SPELLS_AT_CREATION} onClose={() => setChooser(null)}
          groups={lore ? [{ name: 'Common', match: (k) => k.startsWith('Common|') }, { name: lore, match: (k) => k.startsWith(`${lore}|`) }] : undefined}
          onToggle={(k) => patch((d) => { const [l, n] = k.split('|'); return d.spells.some((s) => s.name === n && s.lore === l) ? { ...d, spells: d.spells.filter((s) => !(s.name === n && s.lore === l)) } : { ...d, spells: [...d.spells, { lore: l, name: n }] }; })} />
      )}
      {(chooser === 'first-miracle' || chooser === 'miracles') && (
        <Chooser label={chooser === 'first-miracle' ? 'First Miracle' : `Miracle of ${a.miracleGod}`} items={miracleItems.filter((i) => chooser === 'first-miracle' || i.key.startsWith(`${a.miracleGod}|`))}
          selected={chooser === 'first-miracle' ? (draft.firstMiracle ? [`${draft.firstMiracle.god}|${draft.firstMiracle.name}`] : []) : draft.miracles.map((m) => `${m.god}|${m.name}`)}
          onClose={() => setChooser(null)}
          onToggle={(k) => { const [g, n] = k.split('|'); patch((d) => (chooser === 'first-miracle' ? { ...d, firstMiracle: { god: g, name: n } } : d.miracles.some((m) => m.name === n) ? d : { ...d, miracles: [...d.miracles, { god: g, name: n }] })); setChooser(null); }} />
      )}
      {chooser === 'adaptable' && (
        <Chooser label="Adaptable: any Talent" items={talentItems} selected={draft.adaptable ? [draft.adaptable.name] : []} onClose={() => setChooser(null)}
          onToggle={(k) => { patch((d) => ({ ...d, adaptable: { name: k, choice: splitTalentName(k).choice ?? '' } })); setChooser(null); }} />
      )}
    </Shell>
  );
}

const cleanGear = (s: string) => { const g = parseGearOption(s); return g.type === 'items' ? g.items.map((i) => `${i.qty > 1 ? `${i.qty} × ` : ''}${i.name}`).join(' and ') : s.replace(/^any\b/, 'Any'); };

// ── Step 4 ───────────────────────────────────────────────────────────────────

function Step4({ draft, patch, go, a }: { draft: Draft; patch: Patch; go: (h: string) => void; a: ArchetypeInfo }) {
  const store = useStore();
  const d = draft.details;
  const finish = () => {
    const c = buildCharacter(draft, new Date().toISOString());
    store.add(c);
    store.say(`${c.identity.name} created`);
    go(paths.sheet(c.id));
  };
  return (
    <Shell step={4} title="Who are they?" archetype={a.name} onBack={() => go(paths.create(3))} go={go}
      footer={
        <>
          {!step4Done(draft) && <span className="meta" style={{ justifyContent: 'center' }}>Give your character a name to finish.</span>}
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-secondary" style={{ flex: 1, minHeight: 48 }} onClick={() => go(paths.create(3))}>Back</button>
            <button className="btn btn-primary inked" style={{ flex: 2, minHeight: 48, gap: 8 }} disabled={!step4Done(draft)} onClick={finish}><Icon n="check" size={18} />Create character</button>
          </div>
        </>
      }>
      <DetailsForm subtitle={`${a.name} · ${speciesOf(a, draft)}`} value={{ ...d, background: d.background }} onChange={(p) => patch((x) => ({ ...x, details: { ...x.details, ...p } as Draft['details'] }))} />
    </Shell>
  );
}

// ── Router for the four steps ────────────────────────────────────────────────

export function Create({ step, draft, setDraft, go }: { step: 1 | 2 | 3 | 4; draft: Draft; setDraft: Patch; go: (h: string) => void }) {
  const a = draft.archetypeId ? findArchetype(draft.archetypeId) : undefined;
  if (step === 1) return <Step1 draft={draft} patch={setDraft} go={go} />;
  if (!a || !step1Done(draft)) { queueMicrotask(() => go(paths.create(1))); return null; }
  if (step === 2) return <Step2 draft={draft} patch={setDraft} go={go} a={a} />;
  if (step === 3) return <Step3 draft={draft} patch={setDraft} go={go} a={a} />;
  return <Step4 draft={draft} patch={setDraft} go={go} a={a} />;
}
