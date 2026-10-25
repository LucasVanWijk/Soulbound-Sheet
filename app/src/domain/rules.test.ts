import { describe, expect, it } from 'vitest';
import { derive, ladderName } from './rules';
import { makeCharacter } from '../test-helpers';
import { findWeapon } from '../data/kb';
import { attacks } from './rules';

describe('Ladder', () => {
  it('maps totals to ratings', () => {
    expect([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15].map(ladderName)).toEqual([
      'Poor', 'Poor', 'Average', 'Average', 'Good', 'Good', 'Great', 'Great', 'Superb', 'Superb', 'Extraordinary', 'Extraordinary', 'Extraordinary',
    ]);
  });
});

describe('derived stats', () => {
  it('matches the book worked example (Knight-Questor, Vel)', () => {
    const c = makeCharacter('knight-questor', { coreSkill: null });
    // Body 4 Mind 2 Soul 3, Weapon Skill 1/1 from the Core Skill; warplate Armour 3
    const d = derive(c);
    expect(c.attributes).toEqual({ body: 4, mind: 2, soul: 3 });
    expect(d.melee).toBe(5);
    expect(d.meleeRating).toBe('Good');
    expect(d.accuracy).toBe(2);
    expect(d.defence).toBe(4);
    expect(d.armour).toBe(3);
    expect(d.toughness).toBe(9);
    expect(d.woundSpaces).toBe(5);
    expect(d.naturalAwareness).toBe(1);
    expect(d.initiative).toBe(2);
    expect(d.mettle).toBe(2);
  });

  it('adds 2 wound spaces for Duardin and fixed Armour 2 for Sylvaneth', () => {
    const duardin = makeCharacter('doomseeker');
    expect(derive(duardin).woundSpaces).toBe(Math.ceil((4 + 1 + 2) / 2) + 2);
    const syl = makeCharacter('tree-revenant-waypiper');
    expect(derive(syl).armour).toBe(2);
  });

  it('applies Combat Ready, Iron Will and Guts as numbers', () => {
    const c = makeCharacter('knight-questor');
    c.talents.push({ name: 'Combat Ready', choice: null, times: 2, source: 'advancement' });
    c.talents.push({ name: 'Guts', choice: null, times: 1, source: 'advancement' });
    c.skills.Fortitude.training = 2;
    const base = derive(makeCharacter('knight-questor'));
    const d = derive(c);
    expect(d.initiative).toBe(base.initiative + 4);
    expect(d.toughness).toBe(base.toughness + 2);
  });

  it('steps Defence up for a worn shield', () => {
    const c = makeCharacter('knight-questor', { gear: { '1:0': '0' } });
    const base = derive(c);
    c.items.push({ id: 'sh', name: 'Shield', qty: 1, notes: '', base: { kind: 'shield', name: 'Shield' }, worn: true });
    expect(derive(c).defenceIndex).toBe(Math.min(5, base.defenceIndex + 1));
  });

  it('builds attack rows from weapons', () => {
    const c = makeCharacter('knight-questor');
    c.items.push({ id: 'w', name: 'Old sword', qty: 1, notes: '', base: { kind: 'melee', name: 'Sword' }, worn: false });
    const rows = attacks(c, findWeapon);
    expect(rows.map((r) => r.name)).toEqual(['Questor warblade', 'Old sword']);
    expect(rows[1].pool).toBe(derive(c).melee);
  });
});
