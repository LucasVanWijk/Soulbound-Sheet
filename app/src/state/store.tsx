import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { Character } from '../domain/model';
import { createRepo, type IndexEntry } from '../domain/repo';

const repo = createRepo(typeof localStorage !== 'undefined' ? localStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {}, key: () => null, length: 0 });

interface Store {
  index: IndexEntry[];
  /** The character the route points at, or null while on the Start screen or when the id is unknown. */
  current: Character | null;
  open(id: string | null): void;
  /** Applies a change to the open character and saves it. */
  update(fn: (c: Character) => Character): void;
  /** Saves a new character (created or imported) and opens it. */
  add(c: Character): void;
  remove(id: string): void;
  exists(id: string): boolean;
  /** Set when saving failed, e.g. storage is full or blocked. */
  saveError: string | null;
  toast: string | null;
  say(msg: string): void;
}

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [index, setIndex] = useState<IndexEntry[]>(() => repo.list());
  const [current, setCurrent] = useState<Character | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const cur = useRef<Character | null>(null);
  cur.current = current;

  const persist = useCallback((c: Character) => {
    try { repo.save(c); setSaveError(null); setIndex(repo.list()); }
    catch { setSaveError('This browser would not save the change. Download a backup from the menu so nothing is lost.'); }
  }, []);

  const store = useMemo<Store>(() => ({
    index, current, saveError, toast,
    open: (id) => setCurrent((prev) => (id === null ? null : prev?.id === id ? prev : repo.load(id))),
    update: (fn) => {
      const prev = cur.current;
      if (!prev) return;
      const next = fn(prev);
      if (next === prev) return;
      cur.current = next;
      setCurrent(next);
      persist(next);
    },
    add: (c) => { cur.current = c; setCurrent(c); persist(c); },
    remove: (id) => { try { repo.remove(id); } catch { /* ignore */ } setIndex(repo.list()); setCurrent((p) => (p?.id === id ? null : p)); },
    exists: (id) => repo.exists(id),
    say: (msg) => { setToast(msg); window.clearTimeout(timer.current); timer.current = window.setTimeout(() => setToast(null), 3200); },
  }), [index, current, saveError, toast, persist]);

  useEffect(() => () => window.clearTimeout(timer.current), []);
  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useStore(): Store {
  const s = useContext(Ctx);
  if (!s) throw new Error('StoreProvider missing');
  return s;
}

/** The open character. Only call under a route that has one. */
export function useCharacter(): Character {
  const { current } = useStore();
  if (!current) throw new Error('No open character');
  return current;
}
