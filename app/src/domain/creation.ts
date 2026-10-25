// Character creation: the draft, its budgets, and building the finished Character.
import {
  MELEE, RANGED, SAMPLE_RIGS, SKILL_NAMES, SPELLS,
  findArchetype, findTalent, findWeapon, splitTalentName, type ArchetypeInfo, type Attr,
} from '../data/kb';
import { emptySkills, newId, type Character, type Item, type ItemKind, type MiracleRef, type SpellRef, type TalentRef } from './model';
import { derive } from './rules';
import { skillCostBetween } from './xp';

export interface TalentPick { name: string; choice: string }

export interface Draft {
  archetypeId: string | null;
  species: string;
  swap: [Attr, Attr] | null;
  coreSkill: string | null;
  training: Record<string, number>;
  focus: Record<string, number>;
  aelfSkill: string | null;
  coreTalent: string | null;
  /** Answers to the open choices on core Talents, keyed by Talent name ("Spellcasting (choose)" → "Amber"). */
  coreChoices: Record<string, string>;
  talents: TalentPick[];
  adaptable: TalentPick | null;
  firstMiracle: MiracleRef | null;
  miracles: MiracleRef[];
  spells: SpellRef[];
  gear: Record<string, string>;
  details: {
    name: string; age: string; eyes: string; hair: string; height: string; weight: string; features: string;
    short: string; long: string; background: string; portrait: string | null;
    connections: { id: string; name: string; relation: string }[];
  };
}

export const emptyDraft = (): Draft => ({
  archetypeId: null, species: '', swap: null, coreSkill: null, training: {}, focus: {}, aelfSkill: null,
  coreTalent: null, coreChoices: {}, talents: [], adaptable: null, firstMiracle: null, miracles: [], spells: [], gear: {},
  details: { name: '', age: '', eyes: '', hair: '', height: '', weight: '', features: '', short: '', long: '', background: '', portrait: null, connections: [] },
});

export const AELF_BONUS_XP = 2;
export const SPELLS_AT_CREATION = 4;
export const FIXED_SPELLS = ['Arcane Bolt', 'Mystic Shield'];

export function speciesOf(a: ArchetypeInfo, draft: Draft): string {
  return a.species === 'Any' ? draft.species : a.species;
}

export function coreSkillOf(a: ArchetypeInfo, d: Draft): string | null {
  return a.coreSkill ?? d.coreSkill;
}

export function startingAttributes(a: ArchetypeInfo, d: Draft): Record<Attr, number> {
  const v: Record<Attr, number> = { ...a.attributes };
  if (d.swap) { const [x, y] = d.swap; [v[x], v[y]] = [v[y], v[x]]; }
  return v;
}

/** Skills the player may spend creation XP on. */
export function allowedSkills(a: ArchetypeInfo): string[] {
  return a.anySkill ? SKILL_NAMES : a.skills;
}

/** Levels the archetype locks in: the Core Skill at 1/1. */
export function baseLevel(a: ArchetypeInfo, d: Draft, skill: string): { training: number; focus: number } {
  return coreSkillOf(a, d) === skill ? { training: 1, focus: 1 } : { training: 0, focus: 0 };
}

export const levelOf = (a: ArchetypeInfo, d: Draft, skill: string) => {
  const b = baseLevel(a, d, skill);
  return { training: Math.max(b.training, d.training[skill] ?? 0), focus: Math.max(b.focus, d.focus[skill] ?? 0) };
};

export function skillSpend(a: ArchetypeInfo, d: Draft, skill: string): number {
  const b = baseLevel(a, d, skill), l = levelOf(a, d, skill);
  return skillCostBetween('training', b.training, l.training) + skillCostBetween('focus', b.focus, l.focus);
}

export interface Budget { total: number; left: number; bonusTotal: number; bonusLeft: number; complete: boolean; over: boolean }

export function budget(a: ArchetypeInfo, d: Draft): Budget {
  const aelf = speciesOf(a, d) === 'Aelf';
  const spent = SKILL_NAMES.reduce((n, s) => n + skillSpend(a, d, s), 0);
  const bonusUsed = aelf && d.aelfSkill ? Math.min(AELF_BONUS_XP, skillSpend(a, d, d.aelfSkill)) : 0;
  const left = a.skillXp - (spent - bonusUsed);
  const bonusLeft = aelf ? AELF_BONUS_XP - bonusUsed : 0;
  return { total: a.skillXp, left, bonusTotal: aelf ? AELF_BONUS_XP : 0, bonusLeft, over: left < 0, complete: left === 0 && bonusLeft === 0 };
}

/** Sets a Training or Focus level for a skill, or returns null when the budget or locks forbid it. */
export function setLevel(a: ArchetypeInfo, d: Draft, skill: string, kind: 'training' | 'focus', level: number): Draft | null {
  if (!allowedSkills(a).includes(skill) && !(coreSkillOf(a, d) === skill)) return null;
  const base = baseLevel(a, d, skill)[kind];
  if (level < base || level > 3) return null;
  let next: Draft = { ...d, [kind]: { ...d[kind], [skill]: level } };
  if (speciesOf(a, d) === 'Aelf' && !d.aelfSkill && level > base) next = { ...next, aelfSkill: skill };
  const b = budget(a, next);
  return b.over ? null : next;
}

export function setAelfSkill(a: ArchetypeInfo, d: Draft, skill: string | null): Draft {
  const next = { ...d, aelfSkill: skill };
  return budget(a, next).over ? d : next;
}

export const grantsSpells = (a: ArchetypeInfo, d: Draft) => allCoreTalents(a, d).some((t) => splitTalentName(t).base === 'Spellcasting');
export const grantsMiracle = (a: ArchetypeInfo, d: Draft) => allCoreTalents(a, d).some((t) => splitTalentName(t).base === 'Blessed');

/** The core Talents the character will have, as written on the archetype (with the player's pick when it offers one). */
export function allCoreTalents(a: ArchetypeInfo, d: Draft): string[] {
  const list = [...a.coreTalents];
  if (a.coreTalentChoices.length && d.coreTalent) list.push(d.coreTalent);
  return list;
}

/** Fills "(choose)" with the player's answer, e.g. Spellcasting (choose) + Amber. */
export function coreTalentRefs(a: ArchetypeInfo, d: Draft): TalentRef[] {
  return allCoreTalents(a, d).map((full) => {
    const info = findTalent(full);
    const { choice } = splitTalentName(full);
    const open = !choice && info?.choice;
    return { name: info?.name ?? full, choice: choice ?? (open ? d.coreChoices[full] ?? null : null), times: 1, source: 'core' as const };
  });
}

export function coreTalentOpenChoices(a: ArchetypeInfo, d: Draft): string[] {
  return allCoreTalents(a, d).filter((full) => !splitTalentName(full).choice && findTalent(full)?.choice);
}

export function spellLore(a: ArchetypeInfo, d: Draft): string | null {
  const t = coreTalentRefs(a, d).find((r) => splitTalentName(r.name).base === 'Spellcasting');
  return t?.choice ?? null;
}

export function godOf(a: ArchetypeInfo, d: Draft): string | null {
  const t = coreTalentRefs(a, d).find((r) => splitTalentName(r.name).base === 'Blessed');
  return t?.choice ?? a.miracleGod;
}

/** Talent picks used so far: each chosen Talent and each extra Miracle counts as one. */
export const talentPicksUsed = (d: Draft) => d.talents.length + d.miracles.length;

export function spellOptions(a: ArchetypeInfo, d: Draft) {
  const lore = spellLore(a, d);
  return SPELLS.filter((s) => (s.lore === 'Common' || s.lore === lore) && !FIXED_SPELLS.includes(s.name));
}

// ── Starting gear ────────────────────────────────────────────────────────────

export type GearOption =
  | { type: 'items'; items: GearItem[] }
  | { type: 'weapon'; count: number; ranged: boolean; twoHanded: boolean | null }
  | { type: 'text'; item: GearItem };

export interface GearItem { name: string; qty: number; base: { kind: ItemKind; name: string } | null; notes: string; worn: boolean }

const article = /^(a|an|the|any|one|your)\s+/i;
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Parses one written option ("a helsabre (Sword) and shield") into sheet items. */
export function parseGearOption(raw: string): GearOption {
  const text = raw.trim();
  const weaponPick = text.match(/^any (?:(one|two) )?(?:Common )?(one-handed |two-handed )?(melee|ranged) weapons?$/i);
  if (weaponPick) {
    const n = weaponPick[1]?.toLowerCase() === 'two' ? 2 : 1;
    const hands = weaponPick[2]?.trim().toLowerCase();
    return { type: 'weapon', count: n, ranged: weaponPick[3].toLowerCase() === 'ranged', twoHanded: hands ? hands === 'two-handed' : null };
  }
  const rig = Object.keys(SAMPLE_RIGS).find((k) => text.toLowerCase().startsWith(k.toLowerCase()));
  if (rig) {
    return { type: 'items', items: [{ name: rig, qty: 1, base: null, notes: SAMPLE_RIGS[rig].items.join(', '), worn: false }] };
  }
  const parts = text.split(/\s+and\s+(?=shield\b)/i);
  const items: GearItem[] = parts.map((p) => parseGearItem(p));
  return { type: 'items', items };
}

function parseGearItem(raw: string): GearItem {
  let text = raw.trim().replace(/\.$/, '');
  let qty = 1;
  const times = text.match(/^\((\d+) × (.*)\)$/) ?? text.match(/^(\d+) × (.*)$/);
  if (times) { qty = Number(times[1]); text = times[2]; }
  const m = text.match(/^(.*?)\s*\(([^)]*)\)$/);
  let name = (m ? m[1] : text).replace(article, '').trim();
  const baseText = m ? m[2].trim() : '';
  let base: GearItem['base'] = null;
  let notes = '';
  const armourBase = baseText.match(/^(Light|Medium|Heavy) Armour$/i);
  if (armourBase) base = { kind: 'armour', name: cap(armourBase[1].toLowerCase()) };
  else if (baseText && findWeapon(baseText)) base = { kind: findWeapon(baseText)!.kind ?? 'melee', name: findWeapon(baseText)!.name };
  else if (baseText) notes = baseText;
  if (!base && !baseText) {
    if (/^shield$/i.test(name)) base = { kind: 'shield', name: 'Shield' };
    else if (findWeapon(name)) base = { kind: findWeapon(name)!.kind ?? 'melee', name: findWeapon(name)!.name };
  }
  const nm = name.match(/^(two|three|four) (.*)$/i);
  if (nm) { qty = { two: 2, three: 3, four: 4 }[nm[1].toLowerCase() as 'two']; name = nm[2]; }
  return { name: cap(name), qty, base, notes, worn: base?.kind === 'armour' || base?.kind === 'shield' };
}

export const gearKey = (idx: number, sub = 0) => `${idx}:${sub}`;

/** Every choice the player still owes in the gear step. */
export function gearComplete(a: ArchetypeInfo, d: Draft): boolean {
  return a.equipment.every((e, i) => {
    if (e.options.length > 1 && d.gear[gearKey(i)] === undefined) return false;
    const opt = parseGearOption(e.options[Number(d.gear[gearKey(i)] ?? 0)] ?? e.options[0]);
    if (opt.type === 'weapon') for (let k = 0; k < opt.count; k++) if (!d.gear[gearKey(i, k + 1)]) return false;
    return true;
  });
}

export function weaponChoices(opt: Extract<GearOption, { type: 'weapon' }>) {
  const list = opt.ranged ? RANGED : MELEE;
  return list.filter((w) => w.availability === 'Common' && w.name !== 'Unarmed' && w.name !== 'Improvised Weapon'
    && (opt.twoHanded === null || w.traits.includes('Two-handed') === opt.twoHanded));
}

function buildItems(a: ArchetypeInfo, d: Draft): Item[] {
  const items: Item[] = [];
  const push = (g: GearItem) => items.push({ id: newId(), name: g.name, qty: g.qty, notes: g.notes, base: g.base, worn: g.worn });
  a.equipment.forEach((e, i) => {
    const opt = parseGearOption(e.options[Number(d.gear[gearKey(i)] ?? 0)] ?? e.options[0]);
    if (opt.type === 'items') opt.items.forEach(push);
    else if (opt.type === 'weapon') {
      for (let k = 0; k < opt.count; k++) {
        const w = findWeapon(d.gear[gearKey(i, k + 1)] ?? '');
        if (w) push({ name: w.name, qty: 1, base: { kind: w.kind ?? 'melee', name: w.name }, notes: '', worn: false });
      }
    } else push(opt.item);
  });
  // Keep Armour defaults tidy: wear at most the first body armour.
  let wornArmour = false;
  for (const it of items) if (it.base?.kind === 'armour') { it.worn = !wornArmour; wornArmour = true; }
  return items;
}

// ── Completeness per step ────────────────────────────────────────────────────

export function step1Done(d: Draft): boolean {
  const a = d.archetypeId ? findArchetype(d.archetypeId) : null;
  return !!a && (a.species !== 'Any' || !!d.species);
}

export function step2Done(d: Draft): boolean {
  const a = d.archetypeId ? findArchetype(d.archetypeId) : null;
  if (!a) return false;
  if (a.coreSkillChoices.length && !d.coreSkill) return false;
  return budget(a, d).complete;
}

export function talentChoiceNeeded(name: string) {
  const info = findTalent(name);
  return !!info?.choice && !splitTalentName(name).choice;
}

export function step3Done(d: Draft): boolean {
  const a = d.archetypeId ? findArchetype(d.archetypeId) : null;
  if (!a) return false;
  if (a.coreTalentChoices.length && !d.coreTalent) return false;
  if (coreTalentOpenChoices(a, d).some((n) => !d.coreChoices[n])) return false;
  if (talentPicksUsed(d) !== a.talentPicks) return false;
  if (d.talents.some((t) => talentChoiceNeeded(t.name) && !t.choice)) return false;
  if (speciesOf(a, d) === 'Human' && !d.adaptable) return false;
  if (grantsMiracle(a, d) && !d.firstMiracle) return false;
  if (grantsSpells(a, d) && d.spells.length !== SPELLS_AT_CREATION) return false;
  return gearComplete(a, d);
}

export const step4Done = (d: Draft) => d.details.name.trim().length > 0;

// ── Build ────────────────────────────────────────────────────────────────────

export function buildCharacter(d: Draft, now: string): Character {
  const a = findArchetype(d.archetypeId ?? '');
  if (!a) throw new Error('No archetype chosen');
  const species = speciesOf(a, d);
  const skills = emptySkills();
  for (const s of SKILL_NAMES) skills[s] = levelOf(a, d, s);
  const attributes = startingAttributes(a, d);
  const talents: TalentRef[] = [
    ...coreTalentRefs(a, d),
    ...d.talents.map((t): TalentRef => ({ name: findTalent(t.name)?.name ?? t.name, choice: t.choice || null, times: 1, source: 'archetype' })),
  ];
  if (d.adaptable) talents.push({ name: findTalent(d.adaptable.name)?.name ?? d.adaptable.name, choice: d.adaptable.choice || null, times: 1, source: 'species' });

  const spells: SpellRef[] = grantsSpells(a, d)
    ? [...FIXED_SPELLS.map((name) => ({ lore: 'Common', name })), ...d.spells]
    : [];
  const miracles: MiracleRef[] = [...(d.firstMiracle ? [d.firstMiracle] : []), ...d.miracles];

  const t = d.details;
  const notes = t.background.trim()
    ? [{ id: newId(), title: 'Background', body: t.background.trim(), pinned: true, updatedAt: now, background: true }]
    : [{ id: newId(), title: 'Background', body: '', pinned: true, updatedAt: now, background: true }];

  const c: Character = {
    id: newId(), createdAt: now, updatedAt: now,
    identity: {
      name: t.name.trim(), archetypeId: a.id, archetype: a.name, species, subfaction: a.subfaction,
      age: t.age, eyes: t.eyes, hair: t.hair, height: t.height, weight: t.weight, features: t.features, portrait: t.portrait,
    },
    attributes, skills, coreSkill: coreSkillOf(a, d),
    talents, spells, miracles,
    items: buildItems(a, d),
    currency: { drops: a.drops, phials: 0, spheres: 0 },
    mettle: { current: 0 }, toughness: { current: 0 },
    wounds: [], mortallyWounded: false,
    goals: { short: t.short.trim(), long: t.long.trim() },
    connections: t.connections.filter((x) => x.name.trim()),
    notes, xp: { earned: 0 }, xpLedger: [],
  };
  const derived = derive(c);
  c.mettle.current = derived.mettle;
  c.toughness.current = derived.toughness;
  return c;
}
