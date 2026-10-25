import { useEffect, useState } from 'react';
import { Toast } from './components/common';
import { emptyDraft, type Draft } from './domain/creation';
import { paths, useMedia, useRoute } from './router';
import { Create } from './screens/Create';
import { CharacterShell } from './screens/CharacterShell';
import { EditDetails } from './screens/EditDetails';
import { NoteEditor } from './screens/Notes';
import { Start } from './screens/Start';
import { useStore } from './state/store';

const DRAFT_KEY = 'soulbound:draft';
const loadDraft = (): Draft => {
  try { const v = sessionStorage.getItem(DRAFT_KEY); if (v) return { ...emptyDraft(), ...JSON.parse(v) }; } catch { /* fresh draft */ }
  return emptyDraft();
};

export function App() {
  const [route, go] = useRoute();
  const store = useStore();
  const desk = useMedia('(min-width: 900px)');
  const [draft, setDraft] = useState<Draft>(loadDraft);

  const id = route.name === 'sheet' || route.name === 'note' || route.name === 'details' ? route.id : null;
  useEffect(() => { store.open(id); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft)); } catch { /* too big or blocked */ } }, [draft]);
  useEffect(() => { if (route.name === 'start') setDraft(emptyDraft()); }, [route.name]);

  const c = store.current && store.current.id === id ? store.current : null;
  let body;
  if (route.name === 'start') body = <Start go={go} />;
  else if (route.name === 'create') body = <Create step={route.step} draft={draft} setDraft={(fn) => setDraft(fn)} go={go} />;
  else if (!c) {
    body = (
      <div className="app-scroll" style={{ gap: 14, padding: 28 }}>
        <h1 className="screen-title">Character not found</h1>
        <p>This character is not saved on this device. Load a backup file from the start screen.</p>
        <a className="btn btn-primary inked" href={paths.start} style={{ textDecoration: 'none', minHeight: 48 }}>Back to start</a>
      </div>
    );
  } else if (route.name === 'sheet') body = <CharacterShell c={c} tab={route.tab} go={go} />;
  else if (route.name === 'note') body = <NoteEditor c={c} noteId={route.noteId} go={go} />;
  else body = <EditDetails c={c} go={go} />;

  return (
    <div className={'app' + (desk ? ' desk' : '')}>
      <main className="app-main">
        {store.saveError && <div role="alert" className="error-banner">{store.saveError}</div>}
        {body}
        <Toast message={store.toast} />
      </main>
    </div>
  );
}
