// Terms that have their own entry in the rules data, so a popover can open a nested popover for them.
import { TALENTS, TRAITS, splitTalentName } from './kb';

export interface Term { kind: 'Trait' | 'Talent'; title: string; text: string }

const terms = new Map<string, Term>();
for (const [name, text] of Object.entries(TRAITS)) {
  const base = name.replace(/\s*\(.*\)$/, '');
  if (!terms.has(base)) terms.set(base, { kind: 'Trait', title: name, text });
}
for (const t of TALENTS) {
  const base = splitTalentName(t.name).base;
  if (!terms.has(base)) terms.set(base, { kind: 'Talent', title: base, text: t.effect });
}

const usable = [...terms.keys()].filter((k) => k.length >= 4).sort((a, b) => b.length - a.length);
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const pattern = usable.length ? new RegExp(`\\b(${usable.map(escape).join('|')})\\b`, 'g') : null;

export const findTerm = (base: string): Term | undefined => terms.get(base);

export type Piece = string | { term: string };

/** Splits text into plain runs and known terms (case-sensitive), leaving out `exclude`. */
export function splitTerms(text: string, exclude: string[] = []): Piece[] {
  if (!pattern) return [text];
  const out: Piece[] = [];
  let last = 0;
  for (const m of text.matchAll(pattern)) {
    if (exclude.includes(m[1])) continue;
    if (m.index! > last) out.push(text.slice(last, m.index));
    out.push({ term: m[1] });
    last = m.index! + m[1].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}
