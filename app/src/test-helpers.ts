import { ARCHETYPES } from './data/kb';
import { buildCharacter, emptyDraft, type Draft } from './domain/creation';
import type { Character } from './domain/model';

export const NOW = '2026-01-01T00:00:00.000Z';

/** A complete, valid draft for an archetype, with the first legal choice for everything. */
export function fullDraft(archetypeId: string, patch: Partial<Draft> = {}): Draft {
  const a = ARCHETYPES.find((x) => x.id === archetypeId)!;
  const d: Draft = { ...emptyDraft(), archetypeId, species: a.species === 'Any' ? 'Human' : '', ...patch };
  d.details = { ...d.details, name: 'Test Hero' };
  return d;
}

export const makeCharacter = (archetypeId = 'knight-questor', patch: Partial<Draft> = {}): Character => buildCharacter(fullDraft(archetypeId, patch), NOW);

export class MemoryStorage {
  private m = new Map<string, string>();
  get length() { return this.m.size; }
  key(i: number) { return [...this.m.keys()][i] ?? null; }
  getItem(k: string) { return this.m.get(k) ?? null; }
  setItem(k: string, v: string) { this.m.set(k, v); }
  removeItem(k: string) { this.m.delete(k); }
}
