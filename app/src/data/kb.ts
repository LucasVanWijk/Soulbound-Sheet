// Data-access layer over knowledge-base/. The rest of the app reads rules data only through here.
import skillsJson from '../../../knowledge-base/05-skills/skills.json';
import talentsJson from '../../../knowledge-base/06-talents/talents.json';
import spellsJson from '../../../knowledge-base/07-spells/spells.json';
import miraclesJson from '../../../knowledge-base/08-miracles/miracles.json';
import equipmentJson from '../../../knowledge-base/09-equipment/equipment-data.json';
import subfactionsJson from '../../../knowledge-base/10-subfactions/subfactions.json';
import costsJson from '../../../knowledge-base/11-advancement/advancement-costs.json';
import archetypesJson from './archetypes.generated.json';

export type Attr = 'body' | 'mind' | 'soul';
export const ATTRS: Attr[] = ['body', 'mind', 'soul'];
export const ATTR_LABEL: Record<Attr, string> = { body: 'Body', mind: 'Mind', soul: 'Soul' };

export interface SkillInfo { name: string; attribute: string; page: number }
export const SKILLS: SkillInfo[] = skillsJson.skills;
export const SKILL_NAMES: string[] = SKILLS.map((s) => s.name);

export interface TalentInfo {
  name: string; page: number; requirement: string | null; repeatable: boolean; effect: string;
  choice?: string; lores?: string[]; companions?: string[]; book: string; downtimeNote?: string | null;
}
export const TALENTS = talentsJson.talents as TalentInfo[];
export const LORES = talentsJson.lores as { name: string; page: number; requirement: string | null; effect: string }[];

export interface SpellInfo {
  name: string; lore: string; dn: string; target: string; range: string; duration: string;
  test?: string | null; overcast?: string | null; effect: string; book: string;
}
export const SPELLS = spellsJson as SpellInfo[];

export interface MiracleInfo {
  god: string; name: string; target: string; range: string; duration: string; effect: string;
  mettleCost: number; blessedGod: string | null; page: number; book: string;
}
export const MIRACLES = miraclesJson.miracles as MiracleInfo[];

export interface WeaponInfo { name: string; cost: number | null; availability: string; damage: string; traits: string[]; kind?: 'melee' | 'ranged' }
export interface ArmourInfo { name: string; cost: number; availability: string; armour?: number; defenceStepBonus?: number; handsRequired?: number; requirement?: { attribute: string; value: number } | null; traits: string[] }
export const MELEE = equipmentJson.melee.map((w) => ({ ...w, kind: 'melee' as const })) as WeaponInfo[];
export const RANGED = equipmentJson.ranged.map((w) => ({ ...w, kind: 'ranged' as const })) as WeaponInfo[];
export const ARMOUR = equipmentJson.armour as ArmourInfo[];
export const TRAITS = equipmentJson.traits as Record<string, string>;
export const SAMPLE_RIGS = equipmentJson.sampleRigs as Record<string, { items: string[]; choose?: string[][] }>;
export const AVAILABILITY = equipmentJson.availabilityLevels as string[];

export interface SubfactionInfo { id: string; name: string; faction: string; page: number; bonusName: string; bonus: string }
export const SUBFACTIONS = subfactionsJson.subfactions as SubfactionInfo[];

export const COSTS = costsJson;

export interface ArchetypeInfo {
  id: string; name: string; faction: string; page: number | null; summary: string;
  species: string; subfaction: string | null;
  attributes: { body: number; mind: number; soul: number };
  skillXp: number; anySkill: boolean; skills: string[];
  coreSkill: string | null; coreSkillChoices: string[];
  coreTalents: string[]; coreTalentChoices: string[];
  talentPicks: number; talentOptions: { name: string; requirement: boolean }[]; miracleGod: string | null;
  equipment: { options: string[] }[]; drops: number;
}
export const ARCHETYPES = archetypesJson as ArchetypeInfo[];

export const SPECIES = ['Human', 'Aelf', 'Duardin', 'Sylvaneth', 'Stormcast Eternal'] as const;
export type Species = (typeof SPECIES)[number];

const byName = <T extends { name: string }>(xs: T[]) => new Map(xs.map((x) => [x.name.toLowerCase(), x]));
const TALENT_MAP = byName(TALENTS);
const MELEE_MAP = byName(MELEE);
const RANGED_MAP = byName(RANGED);
const ARMOUR_MAP = byName(ARMOUR);

/** Archetype sheets spell a few Talents differently from the Talent list. */
const TALENT_ALIASES: Record<string, string> = { 'silver tongued': 'Silver Tongue' };

/** Splits "Blessed (Sigmar)" into the Talent and its choice. "(choose)" and "(Choose)" mean the choice is open. */
export function splitTalentName(full: string): { base: string; choice: string | null } {
  const m = full.match(/^(.*?)\s*\((.*)\)\s*$/);
  if (!m) return { base: full.trim(), choice: null };
  const choice = m[2].trim();
  return { base: m[1].trim(), choice: /^choose$/i.test(choice) ? null : choice };
}

/** Finds a Talent by the name an archetype or a player uses ("Blessed (Sigmar)" finds "Blessed (Choose)"). */
export function findTalent(name: string): TalentInfo | undefined {
  const clean = TALENT_ALIASES[name.toLowerCase()] ?? name;
  const direct = TALENT_MAP.get(clean.toLowerCase());
  if (direct) return direct;
  const { base } = splitTalentName(clean);
  return TALENT_MAP.get(base.toLowerCase()) ?? TALENT_MAP.get((base + ' (Choose)').toLowerCase())
    ?? TALENTS.find((t) => splitTalentName(t.name).base.toLowerCase() === base.toLowerCase());
}

export const findWeapon = (name: string) => MELEE_MAP.get(name.toLowerCase()) ?? RANGED_MAP.get(name.toLowerCase());
export const findArmour = (name: string) => ARMOUR_MAP.get(name.toLowerCase());
export const findSpell = (lore: string, name: string) => SPELLS.find((s) => s.lore === lore && s.name === name);
export const findMiracle = (god: string, name: string) => MIRACLES.find((m) => m.god === god && m.name === name);
export const findArchetype = (id: string) => ARCHETYPES.find((a) => a.id === id);

export const GODS = [...new Set(MIRACLES.map((m) => m.god))];
export const LORE_NAMES = LORES.map((l) => l.name);

/** The options for a Talent's open choice, or null when it is free text. */
export function talentChoiceOptions(t: TalentInfo): { label: string; options: string[] | null } | null {
  if (!t.choice) return null;
  if (t.choice === 'god') return { label: 'God', options: GODS.filter((g) => g !== 'Universal') };
  if (t.choice === 'companion') return { label: 'Companion', options: t.companions ?? null };
  const m = t.choice.match(/^([^:]+):\s*(.+)$/);
  if (m) return { label: m[1][0].toUpperCase() + m[1].slice(1), options: m[2].split(',').map((x) => x.trim()) };
  return { label: t.choice[0].toUpperCase() + t.choice.slice(1), options: null };
}
