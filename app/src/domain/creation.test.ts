import { describe, expect, it } from 'vitest';
import { budget, buildCharacter, emptyDraft, setLevel, step2Done, step3Done, startingAttributes, setAelfSkill, gearComplete } from './creation';
import { findArchetype } from '../data/kb';
import { NOW, fullDraft } from '../test-helpers';
import { availableXp } from './model';

const arch = (id: string) => findArchetype(id)!;

describe('creation budget', () => {
  it('starts with the full Skill XP and the Core Skill at 1/1', () => {
    const a = arch('knight-questor');
    const d = fullDraft('knight-questor');
    expect(budget(a, d)).toMatchObject({ total: 7, left: 7, complete: false });
    const c = buildCharacter(d, NOW);
    expect(c.skills['Weapon Skill']).toEqual({ training: 1, focus: 1 });
  });

  it('charges 1/2/4 per level and refuses to overspend', () => {
    const a = arch('knight-questor');
    let d = fullDraft('knight-questor');
    d = setLevel(a, d, 'Athletics', 'training', 3)!; // 1 + 2 + 4 = 7
    expect(budget(a, d)).toMatchObject({ left: 0, complete: true });
    expect(setLevel(a, d, 'Might', 'training', 1)).toBeNull();
    expect(setLevel(a, d, 'Weapon Skill', 'training', 0)).toBeNull(); // locked Core mark
    expect(step2Done(d)).toBe(true);
  });

  it('only allows the archetype\'s own skill list', () => {
    const a = arch('knight-questor');
    expect(setLevel(a, fullDraft('knight-questor'), 'Arcana', 'training', 1)).toBeNull();
  });

  it('gives Aelf +2 XP that must go on one Skill', () => {
    const a = arch('hag-priestess');
    let d = fullDraft('hag-priestess');
    expect(budget(a, d)).toMatchObject({ total: 7, bonusTotal: 2, bonusLeft: 2 });
    d = setLevel(a, d, 'Lore', 'training', 2)!; // 3 XP: 2 from the bonus, 1 from the pool
    expect(d.aelfSkill).toBe('Lore');
    expect(budget(a, d)).toMatchObject({ left: 6, bonusLeft: 0 });
    d = setAelfSkill(a, d, 'Medicine');
    expect(d.aelfSkill).toBe('Medicine'); // moving the bonus: Lore then costs 3 from the pool, still affordable
    expect(budget(a, d).left).toBe(4);
  });

  it('swaps two Attributes', () => {
    const a = arch('isharann-soulscryer');
    const d = { ...fullDraft('isharann-soulscryer'), swap: ['body', 'soul'] as ['body', 'soul'] };
    expect(startingAttributes(a, d)).toEqual({ body: 4, mind: 2, soul: 1 });
  });
});

describe('finishing a character', () => {
  it('needs the right number of Talents and the gear choices', () => {
    const a = arch('knight-questor');
    const d = fullDraft('knight-questor');
    expect(step3Done(d)).toBe(false);
    expect(gearComplete(a, d)).toBe(false);
    const done = { ...d, talents: [{ name: 'Bulwark', choice: '' }, { name: 'Combat Ready', choice: '' }, { name: 'Diplomat', choice: '' }], gear: { '1:0': '0' } };
    expect(step3Done(done)).toBe(true);
    const c = buildCharacter(done, NOW);
    expect(c.talents.map((t) => t.name)).toEqual(['Heroic Challenge', 'Bulwark', 'Combat Ready', 'Diplomat']);
    expect(c.items.map((i) => i.name)).toContain('Sigmarite warplate');
    expect(c.currency.drops).toBe(65);
    expect(availableXp(c)).toBe(0);
    expect(c.notes[0]).toMatchObject({ title: 'Background', pinned: true });
  });

  it('grants Arcane Bolt, Mystic Shield and chosen spells to a Spellcasting archetype', () => {
    const d = fullDraft('branchwych');
    const c = buildCharacter({ ...d, spells: [{ lore: 'Jade', name: 'x' }], gear: {} }, NOW);
    expect(c.spells.slice(0, 2).map((s) => s.name)).toEqual(['Arcane Bolt', 'Mystic Shield']);
    expect(c.talents[0]).toMatchObject({ name: 'Spellcasting (Choose)', choice: 'Jade' });
  });

  it('a blank draft is not finished', () => {
    expect(step2Done(emptyDraft())).toBe(false);
  });
});
