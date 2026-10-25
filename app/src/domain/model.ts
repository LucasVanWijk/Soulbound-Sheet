import { SKILL_NAMES, type Attr } from '../data/kb';

export const SCHEMA_VERSION = 1;

export interface SkillLevel { training: number; focus: number }

/** A Talent on the sheet. `name` is the Talent-list name ("Blessed (Choose)"); `choice` fills the choice ("Sigmar"). */
export interface TalentRef { name: string; choice: string | null; times: number; source: 'core' | 'archetype' | 'species' | 'advancement' }

export interface SpellRef { lore: string; name: string }
export interface MiracleRef { god: string; name: string }

export type ItemKind = 'melee' | 'ranged' | 'armour' | 'shield' | 'gear';
export interface Item {
  id: string;
  name: string;
  qty: number;
  notes: string;
  /** Base entry in the equipment list ("Sword", "Light"), when the item is one. */
  base: { kind: ItemKind; name: string } | null;
  /** Armour and shields count toward Armour and Defence only while worn. */
  worn: boolean;
}

export type WoundType = 'minor' | 'serious' | 'deadly';
export interface Wound { id: string; type: WoundType }
export interface Connection { id: string; name: string; relation: string }
export interface Note { id: string; title: string; body: string; pinned: boolean; updatedAt: string; /** Written during creation; cannot be deleted. */ background?: boolean }

export type Purchase =
  | { type: 'attribute'; target: Attr; from: number; to: number }
  | { type: 'skill-training' | 'skill-focus'; target: string; from: number; to: number }
  | { type: 'talent'; target: string; choice: string | null }
  | { type: 'miracle'; target: string; god: string };

export interface LedgerEntry {
  id: string;
  at: string;
  kind: 'add' | 'spend';
  /** Signed: positive for XP added, negative for XP spent. */
  delta: number;
  reason: string;
  purchase?: Purchase;
  /** Available XP just before and after. */
  before: number;
  after: number;
}

export interface Identity {
  name: string;
  archetypeId: string;
  archetype: string;
  species: string;
  subfaction: string | null;
  age: string; eyes: string; hair: string; height: string; weight: string;
  features: string;
  portrait: string | null;
}

export interface Character {
  id: string;
  createdAt: string;
  updatedAt: string;
  identity: Identity;
  attributes: Record<Attr, number>;
  skills: Record<string, SkillLevel>;
  coreSkill: string | null;
  talents: TalentRef[];
  spells: SpellRef[];
  miracles: MiracleRef[];
  items: Item[];
  currency: { drops: number; phials: number; spheres: number };
  mettle: { current: number };
  toughness: { current: number };
  wounds: Wound[];
  mortallyWounded: boolean;
  goals: { short: string; long: string };
  connections: Connection[];
  notes: Note[];
  xp: { earned: number };
  xpLedger: LedgerEntry[];
}

export const emptySkills = (): Record<string, SkillLevel> =>
  Object.fromEntries(SKILL_NAMES.map((n) => [n, { training: 0, focus: 0 }]));

let counter = 0;
export const newId = () => Date.now().toString(36) + (counter++).toString(36) + Math.random().toString(36).slice(2, 7);

/** Available XP is always earned minus spent; it is never stored. */
export const spentXp = (c: Character) => c.xpLedger.filter((e) => e.kind === 'spend').reduce((n, e) => n - e.delta, 0);
export const availableXp = (c: Character) => c.xp.earned - spentXp(c);

export function talentLabel(t: Pick<TalentRef, 'name' | 'choice'>): string {
  const base = t.name.replace(/\s*\((Choose)\)\s*$/i, '');
  return t.choice ? `${base} (${t.choice})` : base;
}
