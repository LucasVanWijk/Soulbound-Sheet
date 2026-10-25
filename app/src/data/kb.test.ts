import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { parseArchetypes } from '../../scripts/parse-archetypes.mjs';
import { ARCHETYPES, SKILL_NAMES, SKILLS, findTalent, splitTalentName, findWeapon, findArmour } from './kb';
import { parseGearOption } from '../domain/creation';

describe('knowledge base', () => {
  it('has 24 skills and 23 archetypes', () => {
    expect(SKILLS).toHaveLength(24);
    expect(ARCHETYPES).toHaveLength(23);
  });
  it('generated archetypes match the markdown', () => {
    const skills = JSON.parse(readFileSync('../knowledge-base/05-skills/skills.json', 'utf8'));
    const fresh = parseArchetypes('../knowledge-base', skills);
    expect(JSON.parse(JSON.stringify(fresh))).toEqual(ARCHETYPES);
  });
  it('every archetype Talent and Skill resolves to the rules data', () => {
    for (const a of ARCHETYPES) {
      for (const s of a.skills) expect(SKILL_NAMES, `${a.name}: skill ${s}`).toContain(s);
      for (const t of [...a.coreTalents, ...a.coreTalentChoices, ...a.talentOptions.map((o) => o.name)]) {
        const known = findTalent(t) ?? findTalent(splitTalentName(t).base);
        if (!known) throw new Error(`${a.name}: unknown Talent "${t}"`);
      }
      expect(a.attributes.body + a.attributes.mind + a.attributes.soul).toBeGreaterThan(0);
      expect(a.skillXp).toBeGreaterThan(0);
      expect(a.talentPicks).toBeGreaterThan(0);
      if (!a.coreSkill) expect(a.coreSkillChoices.length).toBeGreaterThan(0);
    }
  });
  it('parses starting gear into sheet items', () => {
    const g = parseGearOption('Sigmarite warplate (Heavy Armour)');
    expect(g).toMatchObject({ type: 'items', items: [{ name: 'Sigmarite warplate', base: { kind: 'armour', name: 'Heavy' }, worn: true }] });
    const two = parseGearOption('a helsabre (Sword) and shield');
    expect(two.type === 'items' && two.items.map((i) => i.base?.kind)).toEqual(['melee', 'shield']);
    expect(parseGearOption('any Common melee weapon')).toMatchObject({ type: 'weapon', count: 1, ranged: false });
    expect(findWeapon('Sword')).toBeTruthy();
    expect(findArmour('Light')?.armour).toBe(1);
  });
});
