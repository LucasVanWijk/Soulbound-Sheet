// Writes src/data/archetypes.generated.json from the knowledge-base markdown.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { parseArchetypes } from './parse-archetypes.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const kb = join(here, '..', '..', 'knowledge-base');
const skills = JSON.parse(readFileSync(join(kb, '05-skills', 'skills.json'), 'utf8'));
const out = parseArchetypes(kb, skills);
writeFileSync(join(here, '..', 'src', 'data', 'archetypes.generated.json'), JSON.stringify(out, null, 2) + '\n');
console.log('wrote', out.length, 'archetypes');
