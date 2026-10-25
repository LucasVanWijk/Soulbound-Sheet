// Turns knowledge-base/04-archetypes/*.md into structured archetype records.
// The markdown is the source of truth; run `npm run data:archetypes` after it changes.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const FILES = {
  'free-peoples.md': 'Free Peoples',
  'daughters-of-khaine.md': 'Daughters of Khaine',
  'fyreslayers.md': 'Fyreslayers',
  'idoneth-deepkin.md': 'Idoneth Deepkin',
  'kharadron-overlords.md': 'Kharadron Overlords',
  'stormcast-eternals.md': 'Stormcast Eternals',
  'sylvaneth.md': 'Sylvaneth',
};

const slug = (s) => s.toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const strip = (s) => s.replace(/\*\*/g, '').replace(/\\\*/g, '*').trim();

/** Splits on a separator, ignoring any inside parentheses. */
function splitOutside(s, sep) {
  const out = [];
  let depth = 0, cur = '';
  for (const ch of s) {
    if (ch === '(') depth++;
    if (ch === ')') depth = Math.max(0, depth - 1);
    if (ch === sep && depth === 0) { out.push(cur); cur = ''; } else cur += ch;
  }
  out.push(cur);
  return out.map((x) => x.trim()).filter(Boolean);
}

function field(block, label) {
  const m = block.match(new RegExp('^- \\*\\*' + label + '[^:]*:\\*\\*\\s*(.*)$', 'm'));
  return m ? m[1].trim() : null;
}
function fieldLine(block, re) {
  const m = block.match(re);
  return m ? m[0] : null;
}

function parseSkills(line, allSkills) {
  const body = line.replace(/^\*\*Any\*\*.*$/, 'ANY');
  if (body === 'ANY') return { skills: [...allSkills], core: null, any: true };
  const text = line.replace(/\*\(Book.*$/, '').replace(/\.\s*$/, '');
  let core = null;
  const skills = [];
  for (const raw of splitOutside(text, ',')) {
    const t = strip(raw);
    const m = t.match(/^(.*?)\s*\(Core\)$/);
    if (m) { core = m[1]; skills.push(m[1]); continue; }
    if (/ OR /i.test(t) && /choose one/i.test(t)) {
      for (const name of t.split(/\s+OR\s+/i)) skills.push(name.replace(/\(.*$/, '').trim());
      continue;
    }
    skills.push(t);
  }
  return { skills: [...new Set(skills)], core, any: false };
}

function parseTalentList(line) {
  const out = [];
  let anyMiracleOf = null;
  for (const raw of splitOutside(line.replace(/\.$/, ''), ',')) {
    const t = strip(raw);
    const mm = t.match(/^any Miracles of (.+)$/i);
    if (mm) { anyMiracleOf = mm[1]; continue; }
    const star = t.endsWith('*');
    out.push({ name: t.replace(/\*$/, '').trim(), requirement: star });
  }
  return { options: out, miracleGod: anyMiracleOf };
}

function parseEquipment(line) {
  let drops = 0;
  const items = [];
  const cleaned = line.replace(/\(book prints[^)]*\)/g, '');
  for (const rawSeg of splitOutside(cleaned, ';')) {
    const seg = strip(rawSeg).replace(/\.$/, '');
    const dm = seg.match(/(\d+)\s+drops\s+Aqua Ghyranis/i);
    if (dm) { drops = Number(dm[1]); continue; }
    // Alternatives are written with a bold "or" in the source ("A **or** B"), or "choose a X or Y".
    const rawOptions = rawSeg.includes('**or**') ? rawSeg.split('**or**') : /^choose /i.test(seg) ? seg.replace(/^choose (a )?/i, '').split(/\s+or\s+/) : [seg];
    const options = rawOptions
      .flatMap((o) => strip(o).split(/,\s+or\s+/))
      .map((o) => o.replace(/\s*\(p\. \d+\)/g, '').replace(/^,\s*/, '').replace(/,\s*$/, '').replace(/^and\s+/, '').trim())
      .filter(Boolean);
    items.push({ options });
  }
  return { items, drops };
}

export function parseArchetypes(kbDir, { skills: allSkills }) {
  const dir = join(kbDir, '04-archetypes');
  const pages = {};
  const readme = readFileSync(join(dir, 'README.md'), 'utf8');
  for (const m of readme.matchAll(/^\|\s*\d+\s*\|\s*([^|]+?)\s*\|[^|]*\|[^|]*\|[^|]*\|[^|]*\|\s*(\d+)\s*\|/gm)) pages[m[1]] = Number(m[2]);

  const result = [];
  for (const file of readdirSync(dir).filter((f) => FILES[f])) {
    const faction = FILES[file];
    const text = readFileSync(join(dir, file), 'utf8');
    const blocks = text.split(/^## /m).slice(1);
    for (const b of blocks) {
      const name = b.split('\n')[0].replace(/^\d+\.\s*/, '').trim();
      if (/rules-relevant|notes for the app/i.test(name)) continue;
      const block = '## ' + b;
      const speciesRaw = strip(field(block, 'Species') ?? '');
      const sm = speciesRaw.match(/^(.*?)(?:\s*\((.*)\))?$/);
      const anySpecies = /^any/i.test(speciesRaw);
      const species = anySpecies ? 'Any' : sm[1].trim();
      const subfaction = !anySpecies && sm[2] ? sm[2].trim() : null;
      const attrs = strip(field(block, 'Attributes')).match(/Body (\d+) · Mind (\d+) · Soul (\d+)/);
      const skillsLine = field(block, 'Skills');
      const xp = Number(skillsLine && fieldLine(block, /^- \*\*Skills \((\d+) XP\)/m) ? block.match(/^- \*\*Skills \((\d+) XP\)/m)[1] : 0);
      const sk = parseSkills(skillsLine, allSkills.map((s) => s.name));
      let coreSkill = sk.core;
      let coreSkillChoices = [];
      const coreLine = field(block, 'Core Skill');
      if (coreLine) {
        const t = strip(coreLine);
        if (/ OR /i.test(t)) coreSkillChoices = t.replace(/\(.*$/, '').split(/\s+OR\s+/i).map((x) => x.trim());
        else coreSkill = t;
      }
      if (!coreSkill && !coreSkillChoices.length && /choose one as Core/i.test(skillsLine)) coreSkillChoices = ['Ballistic Skill', 'Weapon Skill'];
      let skillList = sk.skills;
      if (coreSkillChoices.length) skillList = [...new Set([...skillList.filter((s) => !/ OR |choose/i.test(s)), ...coreSkillChoices])];

      const ctRaw = field(block, 'Core Talents?');
      const ctLine = strip(ctRaw ?? '');
      let coreTalents = [];
      let coreTalentChoices = [];
      if (/ OR /i.test(ctLine)) coreTalentChoices = ctLine.split(/\s+OR\s+/i).map((x) => x.replace(/\s*\(player chooses one\)/i, '').trim());
      else {
      // "Barazakdum, the Doom-oath" is one Talent: a lowercase continuation belongs to the previous name.
      for (const part of splitOutside(ctLine, ',')) {
        if (coreTalents.length && /^[a-z]/.test(part)) coreTalents[coreTalents.length - 1] += ', ' + part;
        else coreTalents.push(part);
      }
    }
      const tl = block.match(/^- \*\*Talents \(Choose (\d+)\):\*\*\s*(.*)$/m);
      const talents = parseTalentList(tl ? tl[2] : '');
      const eq = parseEquipment(field(block, 'Equipment') ?? '');

      result.push({
        id: slug(name),
        name,
        faction,
        page: pages[name] ?? null,
        summary: strip(field(block, 'Summary') ?? ''),
        species,
        subfaction,
        attributes: { body: Number(attrs[1]), mind: Number(attrs[2]), soul: Number(attrs[3]) },
        skillXp: xp,
        anySkill: sk.any,
        skills: skillList,
        coreSkill,
        coreSkillChoices,
        coreTalents,
        coreTalentChoices,
        talentPicks: tl ? Number(tl[1]) : 0,
        talentOptions: talents.options,
        miracleGod: talents.miracleGod,
        equipment: eq.items,
        drops: eq.drops,
      });
    }
  }
  return result.sort((a, b) => a.faction.localeCompare(b.faction) || (a.page ?? 0) - (b.page ?? 0));
}
