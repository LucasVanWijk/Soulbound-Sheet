// XP costs, caps and the ledger. Costs come from knowledge-base/11-advancement/advancement-costs.json.
import { COSTS, findTalent, splitTalentName, type Attr } from '../data/kb';
import { availableXp, newId, type Character, type LedgerEntry, type Purchase, type TalentRef } from './model';

export const ATTR_MAX = COSTS.attributes.max;
export const SKILL_MAX = COSTS.skills.training.max;
export const MIRACLE_COST = COSTS.miracles.additionalMiracleCost;

export interface Step { from: number; to: number; cost: number }

/** The next Attribute step, or null at the cap. */
export function attributeStep(value: number): Step | null {
  if (value >= ATTR_MAX) return null;
  const row = COSTS.attributes.costs.find((r) => r.from === value);
  return row ? { from: value, to: row.to, cost: row.incremental } : null;
}

/** The next Training or Focus step, or null at the cap. */
export function skillStep(kind: 'training' | 'focus', value: number): Step | null {
  if (value >= SKILL_MAX) return null;
  const row = COSTS.skills[kind].costs.find((r) => r.level === value + 1);
  return row ? { from: value, to: value + 1, cost: row.incremental } : null;
}

/** XP to take a Skill's Training or Focus from one level to another (creation uses this for its budget). */
export function skillCostBetween(kind: 'training' | 'focus', from: number, to: number): number {
  let n = 0;
  for (let v = from; v < to; v++) n += skillStep(kind, v)?.cost ?? 0;
  return n;
}

const isSpellcasting = (name: string) => splitTalentName(name).base.toLowerCase() === 'spellcasting';
export const spellcastingCount = (c: Character) => c.talents.filter((t) => isSpellcasting(t.name)).reduce((n, t) => n + t.times, 0);

/** 2 XP per Talent, plus the extra Lore cost for a second or later Spellcasting. */
export function talentCost(c: Character, talentName: string): number {
  let cost = COSTS.talents.baseCost;
  if (isSpellcasting(talentName)) {
    const n = spellcastingCount(c) + 1;
    cost += COSTS.lores.additionalLoreExtra.find((l) => l.lore === n)?.extra ?? 0;
  }
  return cost;
}

export function owns(c: Character, talentName: string, choice: string | null) {
  return c.talents.some((t) => t.name === talentName && (t.choice ?? null) === (choice ?? null));
}

/** Whether another copy can be taken: repeatable Talents always; others once per choice. */
export function canTakeTalent(c: Character, talentName: string, choice: string | null): boolean {
  const info = findTalent(talentName);
  if (!info) return false;
  return info.repeatable || !c.talents.some((t) => t.name === info.name && (!info.choice || t.choice === choice));
}

const ledger = (c: Character, kind: 'add' | 'spend', delta: number, reason: string, at: string, purchase?: Purchase): LedgerEntry => {
  const before = availableXp(c);
  return { id: newId(), at, kind, delta, reason, purchase, before, after: before + delta };
};

export function addXp(c: Character, amount: number, reason: string, at: string): Character {
  if (!Number.isInteger(amount) || amount <= 0) return c;
  return { ...c, xp: { earned: c.xp.earned + amount }, xpLedger: [...c.xpLedger, ledger(c, 'add', amount, reason.trim(), at)], updatedAt: at };
}

export type SpendResult = { ok: true; character: Character } | { ok: false; reason: 'not-enough' | 'at-cap' | 'invalid' };

export function costOf(c: Character, p: Purchase): number | null {
  switch (p.type) {
    case 'attribute': return attributeStep(c.attributes[p.target])?.cost ?? null;
    case 'skill-training': return skillStep('training', c.skills[p.target]?.training ?? 0)?.cost ?? null;
    case 'skill-focus': return skillStep('focus', c.skills[p.target]?.focus ?? 0)?.cost ?? null;
    case 'talent': return talentCost(c, p.target);
    case 'miracle': return MIRACLE_COST;
  }
}

export function describePurchase(p: Purchase): string {
  switch (p.type) {
    case 'attribute': return `${p.target[0].toUpperCase() + p.target.slice(1)} ${p.from} → ${p.to}`;
    case 'skill-training': return `${p.target} training ${p.from} → ${p.to}`;
    case 'skill-focus': return `${p.target} focus ${p.from} → ${p.to}`;
    case 'talent': return `${p.target}${p.choice ? ` (${p.choice})` : ''} learned`;
    case 'miracle': return `${p.target} (${p.god}) learned`;
  }
}

/** Buys one thing: checks the cap and the balance, applies it, and writes the ledger entry. */
export function spend(c: Character, p: Purchase, at: string): SpendResult {
  const cost = costOf(c, p);
  if (cost === null) return { ok: false, reason: 'at-cap' };
  if (cost > availableXp(c)) return { ok: false, reason: 'not-enough' };
  let next: Character = c;
  switch (p.type) {
    case 'attribute': next = { ...c, attributes: { ...c.attributes, [p.target]: p.to } }; break;
    case 'skill-training':
    case 'skill-focus': {
      const key = p.type === 'skill-training' ? 'training' : 'focus';
      next = { ...c, skills: { ...c.skills, [p.target]: { ...c.skills[p.target], [key]: p.to } } };
      break;
    }
    case 'talent': {
      const existing = c.talents.find((t) => t.name === p.target && (t.choice ?? null) === (p.choice ?? null));
      const talents: TalentRef[] = existing && findTalent(p.target)?.repeatable
        ? c.talents.map((t) => (t === existing ? { ...t, times: t.times + 1 } : t))
        : [...c.talents, { name: p.target, choice: p.choice, times: 1, source: 'advancement' }];
      next = { ...c, talents };
      break;
    }
    case 'miracle': {
      if (c.miracles.some((m) => m.god === p.god && m.name === p.target)) return { ok: false, reason: 'invalid' };
      next = { ...c, miracles: [...c.miracles, { god: p.god, name: p.target }] };
      break;
    }
  }
  return { ok: true, character: { ...next, xpLedger: [...c.xpLedger, ledger(c, 'spend', -cost, describePurchase(p), at, p)], updatedAt: at } };
}

/** Undoes the most recent entry when it is a purchase, refunding its cost. */
export function undoLastPurchase(c: Character, at: string): Character | null {
  const last = c.xpLedger[c.xpLedger.length - 1];
  const p = last?.purchase;
  if (!last || last.kind !== 'spend' || !p) return null;
  let next: Character = c;
  switch (p.type) {
    case 'attribute': next = { ...c, attributes: { ...c.attributes, [p.target]: p.from } }; break;
    case 'skill-training':
    case 'skill-focus': next = { ...c, skills: { ...c.skills, [p.target]: { ...c.skills[p.target], [p.type === 'skill-training' ? 'training' : 'focus']: p.from } } }; break;
    case 'talent': {
      const i = [...c.talents].reverse().findIndex((t) => t.name === p.target && (t.choice ?? null) === (p.choice ?? null));
      if (i < 0) return null;
      const idx = c.talents.length - 1 - i;
      const t = c.talents[idx];
      next = { ...c, talents: t.times > 1 ? c.talents.map((x, k) => (k === idx ? { ...x, times: x.times - 1 } : x)) : c.talents.filter((_, k) => k !== idx) };
      break;
    }
    case 'miracle': next = { ...c, miracles: c.miracles.filter((m) => !(m.god === p.god && m.name === p.target)) }; break;
  }
  return { ...next, xpLedger: c.xpLedger.slice(0, -1), updatedAt: at };
}

export type { Attr };
