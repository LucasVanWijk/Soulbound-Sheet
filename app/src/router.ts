import { useCallback, useEffect, useState } from 'react';

export type Route =
  | { name: 'start' }
  | { name: 'create'; step: 1 | 2 | 3 | 4 }
  | { name: 'sheet'; id: string; tab: 'sheet' | 'inventory' | 'notes' }
  | { name: 'note'; id: string; noteId: string }
  | { name: 'details'; id: string };

export function parse(hash: string): Route {
  const p = hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  if (p[0] === 'new') {
    const step = Number(p[1]);
    return { name: 'create', step: (step >= 1 && step <= 4 ? step : 1) as 1 | 2 | 3 | 4 };
  }
  if (p[0] === 'c' && p[1]) {
    const id = decodeURIComponent(p[1]);
    if (p[2] === 'inventory') return { name: 'sheet', id, tab: 'inventory' };
    if (p[2] === 'notes' && p[3]) return { name: 'note', id, noteId: decodeURIComponent(p[3]) };
    if (p[2] === 'notes') return { name: 'sheet', id, tab: 'notes' };
    if (p[2] === 'details') return { name: 'details', id };
    return { name: 'sheet', id, tab: 'sheet' };
  }
  return { name: 'start' };
}

export const paths = {
  start: '#/',
  create: (step: number) => `#/new/${step}`,
  sheet: (id: string) => `#/c/${encodeURIComponent(id)}`,
  inventory: (id: string) => `#/c/${encodeURIComponent(id)}/inventory`,
  notes: (id: string) => `#/c/${encodeURIComponent(id)}/notes`,
  note: (id: string, noteId: string) => `#/c/${encodeURIComponent(id)}/notes/${encodeURIComponent(noteId)}`,
  details: (id: string) => `#/c/${encodeURIComponent(id)}/details`,
};

export function useRoute(): [Route, (hash: string, opts?: { replace?: boolean }) => void] {
  const [route, setRoute] = useState<Route>(() => parse(location.hash));
  useEffect(() => {
    const on = () => setRoute(parse(location.hash));
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  const go = useCallback((hash: string, opts?: { replace?: boolean }) => {
    if (opts?.replace) history.replaceState(null, '', hash);
    else location.hash = hash;
    setRoute(parse(hash));
  }, []);
  return [route, go];
}

/** True from 900px up, where sheets slide in from the right like LifeRPG's desktop shell. */
export function useMedia(query: string): boolean {
  const [m, setM] = useState(() => matchMedia(query).matches);
  useEffect(() => {
    const mq = matchMedia(query);
    const on = () => setM(mq.matches);
    mq.addEventListener('change', on);
    on();
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return m;
}
