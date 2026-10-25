// Derived stats. Formulas are from knowledge-base/01-core-rules/derived-stats.md.
import { findArmour, splitTalentName, type Attr } from '../data/kb';
import type { Character, Item } from './model';

export const LADDER = ['Poor', 'Average', 'Good', 'Great', 'Superb', 'Extraordinary'] as const;
export const ladderIndex = (total: number) => Math.max(0, Math.min(5, Math.ceil(total / 2) - 1));
export const ladderName = (total: number) => LADDER[ladderIndex(total)];

/** Attack DN from the attacker's Melee/Accuracy against the target's Defence, in Ladder steps. */
export const DN_TABLE: { label: string; dn: number }[] = [
  { label: 'Two or more steps higher', dn: 2 },
  { label: 'One step higher', dn: 3 },
  { label: 'Equal', dn: 4 },
  { label: 'One step lower', dn: 5 },
  { label: 'Two or more steps lower', dn: 6 },
];

export const training = (c: Character, skill: string) => c.skills[skill]?.training ?? 0;
export const focus = (c: Character, skill: string) => c.skills[skill]?.focus ?? 0;

const talentTimes = (c: Character, name: string) =>
  c.talents.filter((t) => splitTalentName(t.name).base.toLowerCase() === name.toLowerCase()).reduce((n, t) => n + t.times, 0);
export const hasTalent = (c: Character, name: string) => talentTimes(c, name) > 0;

/**
 * Talents whose effect is a plain number on a derived stat. Conditional effects (Bulwark, Underdog, …)
 * are text only: they change mid-fight, and the GM runs the fight.
 */
const bonuses = (c: Character) => ({
  initiative: 2 * talentTimes(c, 'Combat Ready'),
  naturalAwareness: talentTimes(c, 'Observant') > 0 ? 1 : 0,
  toughness: (hasTalent(c, 'Guts') ? training(c, 'Fortitude') : 0) + (hasTalent(c, 'Iron Will') ? training(c, 'Determination') : 0),
  mettle: hasTalent(c, 'Soul-Scarred') ? 1 : 0,
  wounds: hasTalent(c, 'Soul-Scarred') ? -1 : 0,
});

const isSpecies = (c: Character, s: string) => c.identity.species === s;

export interface Derived {
  melee: number; accuracy: number; defence: number;
  meleeRating: string; accuracyRating: string; defenceRating: string;
  meleeIndex: number; accuracyIndex: number; defenceIndex: number;
  initiative: number; naturalAwareness: number; armour: number;
  toughness: number; mettle: number; woundSpaces: number;
}

/** Armour value from worn armour; a worn shield steps Defence up. Sylvaneth have natural Armour 2 and cannot wear armour. */
export function wornArmour(items: Item[]) {
  let armour = 0, shieldSteps = 0;
  for (const i of items) {
    if (!i.worn || !i.base) continue;
    const a = findArmour(i.base.name);
    if (i.base.kind === 'armour' && a?.armour) armour += a.armour * i.qty;
    if (i.base.kind === 'shield') shieldSteps += a?.defenceStepBonus ?? 1;
  }
  return { armour, shieldSteps };
}

export function derive(c: Character): Derived {
  const a = c.attributes as Record<Attr, number>;
  const b = bonuses(c);
  const { armour, shieldSteps } = wornArmour(c.items);
  const melee = a.body + training(c, 'Weapon Skill');
  const accuracy = a.mind + training(c, 'Ballistic Skill');
  const defence = a.body + training(c, 'Reflexes');
  const sum = a.body + a.mind + a.soul;
  const defenceIndex = Math.min(5, ladderIndex(defence) + shieldSteps);
  return {
    melee, accuracy, defence,
    meleeRating: ladderName(melee), accuracyRating: ladderName(accuracy), defenceRating: LADDER[defenceIndex],
    meleeIndex: ladderIndex(melee), accuracyIndex: ladderIndex(accuracy), defenceIndex,
    initiative: a.mind + training(c, 'Awareness') + training(c, 'Reflexes') + b.initiative,
    naturalAwareness: Math.ceil((a.mind + training(c, 'Awareness')) / 2) + b.naturalAwareness,
    armour: isSpecies(c, 'Sylvaneth') ? 2 : armour,
    toughness: sum + b.toughness,
    mettle: Math.ceil(a.soul / 2) + b.mettle,
    woundSpaces: Math.max(1, Math.ceil(sum / 2) + (isSpecies(c, 'Duardin') ? 2 : 0) + b.wounds),
  };
}

export interface AttackRow { id: string; name: string; pool: number; focus: number; damage: string; traits: string[]; ranged: boolean }

/** One row per weapon: Body (Weapon Skill) for melee, Mind (Ballistic Skill) for ranged. */
export function attacks(c: Character, weapon: (n: string) => { damage: string; traits: string[]; kind?: 'melee' | 'ranged' } | undefined): AttackRow[] {
  const d = derive(c);
  const rows: AttackRow[] = [];
  for (const i of c.items) {
    if (!i.base || (i.base.kind !== 'melee' && i.base.kind !== 'ranged')) continue;
    const w = weapon(i.base.name);
    if (!w) continue;
    const ranged = i.base.kind === 'ranged';
    rows.push({ id: i.id, name: i.name, pool: ranged ? d.accuracy : d.melee, focus: focus(c, ranged ? 'Ballistic Skill' : 'Weapon Skill'), damage: w.damage, traits: w.traits, ranged });
  }
  return rows;
}
