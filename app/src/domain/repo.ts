// Characters in localStorage: one key per character, plus an index for the Start screen.
import { availableXp, type Character } from './model';
import { normalise } from './migrate';

export interface IndexEntry {
  id: string; name: string; archetype: string; species: string; xpAvailable: number; xpEarned: number; updatedAt: string;
}

export type KV = Pick<Storage, 'getItem' | 'setItem' | 'removeItem' | 'key' | 'length'>;

const INDEX = 'soulbound:index';
const PREFIX = 'soulbound:char:';

const entryOf = (c: Character): IndexEntry => ({
  id: c.id, name: c.identity.name, archetype: c.identity.archetype, species: c.identity.species,
  xpAvailable: availableXp(c), xpEarned: c.xp.earned, updatedAt: c.updatedAt,
});

export function createRepo(kv: KV) {
  const readIndex = (): IndexEntry[] | null => {
    try {
      const v = JSON.parse(kv.getItem(INDEX) ?? 'null');
      return Array.isArray(v) ? v : null;
    } catch { return null; }
  };
  const writeIndex = (e: IndexEntry[]) => kv.setItem(INDEX, JSON.stringify(e));

  const load = (id: string): Character | null => {
    try {
      const raw = kv.getItem(PREFIX + id);
      if (!raw) return null;
      const c = normalise(JSON.parse(raw));
      return typeof c === 'string' ? null : c;
    } catch { return null; }
  };

  return {
    load,
    /** Saves a character and refreshes its row in the index. Throws if storage is full. */
    save(c: Character) {
      kv.setItem(PREFIX + c.id, JSON.stringify(c));
      const rest = (readIndex() ?? []).filter((e) => e.id !== c.id);
      writeIndex([entryOf(c), ...rest]);
    },
    remove(id: string) {
      kv.removeItem(PREFIX + id);
      writeIndex((readIndex() ?? []).filter((e) => e.id !== id));
    },
    /** The index, rebuilt from the character keys if it is missing or damaged. */
    list(): IndexEntry[] {
      const idx = readIndex();
      const ids: string[] = [];
      for (let i = 0; i < kv.length; i++) { const k = kv.key(i); if (k?.startsWith(PREFIX)) ids.push(k.slice(PREFIX.length)); }
      if (idx && idx.length === ids.length && idx.every((e) => ids.includes(e.id))) {
        return [...idx].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
      }
      const rebuilt = ids.flatMap((id) => { const c = load(id); return c ? [entryOf(c)] : []; }).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
      writeIndex(rebuilt);
      return rebuilt;
    },
    exists: (id: string) => kv.getItem(PREFIX + id) !== null,
  };
}

export type Repo = ReturnType<typeof createRepo>;
