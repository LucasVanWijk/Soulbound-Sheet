import { describe, expect, it } from 'vitest';
import { addXp, attributeStep, skillStep, spend, talentCost, undoLastPurchase } from './xp';
import { availableXp } from './model';
import { makeCharacter, NOW } from '../test-helpers';

describe('XP costs', () => {
  it('uses the incremental Attribute costs and caps at 8', () => {
    expect([1, 2, 3, 4, 5, 6, 7].map((v) => attributeStep(v)!.cost)).toEqual([2, 5, 7, 9, 11, 13, 15]);
    expect(attributeStep(8)).toBeNull();
  });
  it('uses 1/2/4 for Training and Focus and caps at 3', () => {
    expect([0, 1, 2].map((v) => skillStep('training', v)!.cost)).toEqual([1, 2, 4]);
    expect(skillStep('focus', 3)).toBeNull();
  });
  it('charges extra for later Spellcasting Lores', () => {
    const c = makeCharacter('battlemage', { coreChoices: { 'Spellcasting (choose)': 'Amber' } });
    expect(talentCost(c, 'Spellcasting (Choose)')).toBe(2 + 2);
    expect(talentCost(c, 'Diplomat')).toBe(2);
  });
});

describe('ledger', () => {
  it('derives available XP from earned minus spent', () => {
    let c = makeCharacter();
    c = addXp(c, 5, 'Session 1', NOW);
    expect(availableXp(c)).toBe(5);
    const r = spend(c, { type: 'skill-training', target: 'Athletics', from: 0, to: 1 }, NOW);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(availableXp(r.character)).toBe(4);
    expect(r.character.skills.Athletics.training).toBe(1);
    const last = r.character.xpLedger.at(-1)!;
    expect(last).toMatchObject({ kind: 'spend', delta: -1, before: 5, after: 4 });
  });
  it('refuses a purchase that is too dear or past the cap', () => {
    const c = addXp(makeCharacter(), 1, '', NOW);
    expect(spend(c, { type: 'attribute', target: 'body', from: 4, to: 5 }, NOW)).toEqual({ ok: false, reason: 'not-enough' });
    const maxed = { ...c, skills: { ...c.skills, Might: { training: 3, focus: 0 } } };
    expect(spend(maxed, { type: 'skill-training', target: 'Might', from: 3, to: 4 }, NOW)).toEqual({ ok: false, reason: 'at-cap' });
  });
  it('learns a repeatable Talent twice as one entry, and undo refunds it', () => {
    let c = addXp(makeCharacter(), 10, '', NOW);
    for (let i = 0; i < 2; i++) {
      const r = spend(c, { type: 'talent', target: 'Combat Ready', choice: null }, NOW);
      if (!r.ok) throw new Error('should buy');
      c = r.character;
    }
    expect(c.talents.find((t) => t.name === 'Combat Ready')!.times).toBe(2);
    expect(availableXp(c)).toBe(6);
    const undone = undoLastPurchase(c, NOW)!;
    expect(undone.talents.find((t) => t.name === 'Combat Ready')!.times).toBe(1);
    expect(availableXp(undone)).toBe(8);
  });
  it('ignores non-positive XP', () => {
    const c = makeCharacter();
    expect(addXp(c, 0, '', NOW)).toBe(c);
  });
});
