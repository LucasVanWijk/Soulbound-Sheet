// Backup files carry a schemaVersion. Older files are migrated forward; newer ones are refused.
import { ATTRS, SKILL_NAMES } from '../data/kb';
import { SCHEMA_VERSION, emptySkills, newId, type Character } from './model';

type Json = Record<string, unknown>;
const isObj = (x: unknown): x is Json => typeof x === 'object' && x !== null && !Array.isArray(x);
const str = (x: unknown, d = '') => (typeof x === 'string' ? x : d);
const int = (x: unknown, d = 0, min = -Infinity, max = Infinity) => (typeof x === 'number' && Number.isFinite(x) ? Math.max(min, Math.min(max, Math.trunc(x))) : d);
const arr = (x: unknown): unknown[] => (Array.isArray(x) ? x : []);

/** Migrations from version N to N+1, in order. Version 1 is the first, so there are none yet. */
const MIGRATIONS: ((c: Json) => Json)[] = [];

export type ImportResult = { ok: true; character: Character; migrated: boolean } | { ok: false; error: string };

/** Checks an exported file, migrates it if it is old, and returns a clean Character. */
export function readExport(text: string): ImportResult {
  let raw: unknown;
  try { raw = JSON.parse(text); } catch { return { ok: false, error: 'This file is not valid JSON.' }; }
  if (!isObj(raw) || !isObj(raw.character)) return { ok: false, error: 'This is not a Soulbound Sheet character file.' };
  const version = typeof raw.schemaVersion === 'number' ? raw.schemaVersion : NaN;
  if (!Number.isInteger(version) || version < 1) return { ok: false, error: 'This file has no schema version.' };
  if (version > SCHEMA_VERSION) return { ok: false, error: 'This file was made by a newer version of the app. Update the app and try again.' };
  let c: Json = raw.character;
  for (let v = version; v < SCHEMA_VERSION; v++) c = MIGRATIONS[v - 1](c);
  const character = normalise(c);
  if (typeof character === 'string') return { ok: false, error: character };
  return { ok: true, character, migrated: version < SCHEMA_VERSION };
}

/** Validates the shape and fills small gaps. Returns an error string when the file cannot be a character. */
export function normalise(c: Json): Character | string {
  const id = c.id;
  if (typeof id !== 'string' || !id) return 'The character has no id.';
  if (!isObj(c.identity) || !str(c.identity.name).trim()) return 'The character has no name.';
  if (!isObj(c.attributes)) return 'The character has no Attributes.';
  const now = new Date().toISOString();
  const attributes = Object.fromEntries(ATTRS.map((a) => [a, int((c.attributes as Json)[a], 1, 1, 8)])) as Character['attributes'];
  const skills = emptySkills();
  if (isObj(c.skills)) {
    for (const n of SKILL_NAMES) {
      const s = c.skills[n];
      if (isObj(s)) skills[n] = { training: int(s.training, 0, 0, 3), focus: int(s.focus, 0, 0, 3) };
    }
  }
  const idn = c.identity as Json;
  const goals = isObj(c.goals) ? c.goals : {};
  const xp = isObj(c.xp) ? c.xp : {};
  const cur = isObj(c.currency) ? c.currency : {};
  const fix = <T,>(xs: unknown, f: (o: Json) => T | null): T[] => arr(xs).flatMap((o) => (isObj(o) ? [f(o)].filter((x): x is T => x !== null) : []));
  return {
    id, createdAt: str(c.createdAt, now), updatedAt: str(c.updatedAt, now),
    identity: {
      name: str(idn.name).trim(), archetypeId: str(idn.archetypeId), archetype: str(idn.archetype), species: str(idn.species),
      subfaction: typeof idn.subfaction === 'string' ? idn.subfaction : null,
      age: str(idn.age), eyes: str(idn.eyes), hair: str(idn.hair), height: str(idn.height), weight: str(idn.weight), features: str(idn.features),
      portrait: typeof idn.portrait === 'string' && idn.portrait.startsWith('data:image/') ? idn.portrait : null,
    },
    attributes, skills, coreSkill: typeof c.coreSkill === 'string' && SKILL_NAMES.includes(c.coreSkill) ? c.coreSkill : null,
    talents: fix(c.talents, (t) => (typeof t.name === 'string' ? { name: t.name, choice: typeof t.choice === 'string' ? t.choice : null, times: int(t.times, 1, 1), source: (['core', 'archetype', 'species', 'advancement'].includes(str(t.source)) ? t.source : 'advancement') as 'core' } : null)),
    spells: fix(c.spells, (s) => (typeof s.name === 'string' && typeof s.lore === 'string' ? { name: s.name, lore: s.lore } : null)),
    miracles: fix(c.miracles, (m) => (typeof m.name === 'string' && typeof m.god === 'string' ? { name: m.name, god: m.god } : null)),
    items: fix(c.items, (i) => (typeof i.name === 'string' ? {
      id: str(i.id) || newId(), name: i.name, qty: int(i.qty, 1, 1), notes: str(i.notes),
      base: isObj(i.base) && typeof i.base.name === 'string' && ['melee', 'ranged', 'armour', 'shield', 'gear'].includes(str(i.base.kind)) ? { kind: i.base.kind as 'melee', name: i.base.name } : null,
      worn: i.worn === true,
    } : null)),
    currency: { drops: int(cur.drops, 0, 0), phials: int(cur.phials, 0, 0), spheres: int(cur.spheres, 0, 0) },
    mettle: { current: int(isObj(c.mettle) ? c.mettle.current : 0, 0, 0) },
    toughness: { current: int(isObj(c.toughness) ? c.toughness.current : 0, 0, 0) },
    wounds: fix(c.wounds, (w) => (['minor', 'serious', 'deadly'].includes(str(w.type)) ? { id: str(w.id) || newId(), type: w.type as 'minor' } : null)),
    mortallyWounded: c.mortallyWounded === true,
    goals: { short: str(goals.short), long: str(goals.long) },
    connections: fix(c.connections, (x) => (typeof x.name === 'string' ? { id: str(x.id) || newId(), name: x.name, relation: str(x.relation) } : null)),
    notes: fix(c.notes, (n) => ({ id: str(n.id) || newId(), title: str(n.title), body: str(n.body), pinned: n.pinned === true, updatedAt: str(n.updatedAt, now), ...(n.background === true ? { background: true } : {}) })),
    xp: { earned: int(xp.earned, 0, 0) },
    xpLedger: fix(c.xpLedger, (e) => (typeof e.delta === 'number' && (e.kind === 'add' || e.kind === 'spend') ? {
      id: str(e.id) || newId(), at: str(e.at, now), kind: e.kind, delta: Math.trunc(e.delta), reason: str(e.reason),
      ...(isObj(e.purchase) ? { purchase: e.purchase as never } : {}), before: int(e.before), after: int(e.after),
    } : null)),
  };
}
