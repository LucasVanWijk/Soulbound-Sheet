import { useEffect, useRef, useState } from 'react';
import { Icon } from '../components/Icon';
import { Confirm } from '../components/common';
import { newId, type Character, type Note } from '../domain/model';
import { paths } from '../router';
import { useStore } from '../state/store';

const date = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
const clamp: React.CSSProperties = { fontSize: 14, lineHeight: 1.45, color: 'var(--color-accent-800)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' };

export function NotesTab({ c, go }: { c: Character; go: (h: string) => void }) {
  const { update } = useStore();
  const [q, setQ] = useState('');
  const needle = q.trim().toLowerCase();
  const match = (n: Note) => !needle || n.title.toLowerCase().includes(needle) || n.body.toLowerCase().includes(needle);
  const bg = c.notes.find((n) => n.background);
  const rest = c.notes.filter((n) => !n.background && match(n)).sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.updatedAt.localeCompare(a.updatedAt));

  const create = () => {
    const n: Note = { id: newId(), title: '', body: '', pinned: false, updatedAt: new Date().toISOString() };
    update((x) => ({ ...x, notes: [n, ...x.notes] }));
    go(paths.note(c.id, n.id));
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '18px 22px 4px' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}><span className="kicker">{c.identity.name}</span><h1 className="screen-title" style={{ margin: 0 }}>Notes</h1></div>
      </div>
      <div style={{ padding: '12px 22px 14px', position: 'relative' }}>
        <label htmlFor="q" className="sr-only">Search notes</label>
        <span style={{ position: 'absolute', left: 34, top: 25, color: 'var(--color-accent-800)' }}><Icon n="search" size={17} /></span>
        <input id="q" className="input" placeholder="Search notes" value={q} onChange={(e) => setQ(e.target.value)} style={{ minHeight: 44, paddingLeft: 38 }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '0 22px 90px' }}>
        {bg && match(bg) && (
          <a href={paths.note(c.id, bg.id)} className="panel-framed" style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '14px 16px', textDecoration: 'none', color: 'var(--q-ink)' }}>
            <span className="kicker" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span className="pin" style={{ position: 'static', margin: 0, width: 10, height: 10 }} />Pinned</span>
            <span className="heading" style={{ fontSize: 19 }}>Background</span>
            <span style={clamp}>{bg.body || 'Tap to write your character\'s background.'}</span>
          </a>
        )}
        {rest.length > 0 && (
          <div className="panel" style={{ overflow: 'hidden' }}>
            {rest.map((n, i) => (
              <a key={n.id} href={paths.note(c.id, n.id)} className="row-btn" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 3, padding: '12px 14px', textDecoration: 'none', borderTop: i === 0 ? '0' : '1px solid var(--q-rule)' }}>
                <span style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                  <span className="heading" style={{ flex: 1, fontSize: 17 }}>{n.pinned && <span className="pin" style={{ position: 'static', display: 'inline-block', margin: '0 6px 0 0', width: 8, height: 8 }} />}{n.title || 'Untitled'}</span>
                  <span className="meta tnum">{date(n.updatedAt)}</span>
                </span>
                <span style={clamp}>{n.body || 'Empty note'}</span>
              </a>
            ))}
          </div>
        )}
        {rest.length === 0 && !(bg && match(bg)) && <p className="muted" style={{ margin: 0, fontStyle: 'italic', fontSize: 14 }}>{needle ? 'No notes match.' : 'No notes yet.'}</p>}
        {rest.length === 0 && !needle && <p className="muted" style={{ margin: 0, fontStyle: 'italic', fontSize: 14 }}>Session recaps, names, leads, debts owed. Tap New note.</p>}
      </div>
      <button className="fab" onClick={create} style={{ bottom: 'calc(84px + env(safe-area-inset-bottom, 0px))' }}><Icon n="plus" size={20} stroke={2} />New note</button>
    </>
  );
}

export function NoteEditor({ c, noteId, go }: { c: Character; noteId: string; go: (h: string) => void }) {
  const { update } = useStore();
  const note = c.notes.find((n) => n.id === noteId);
  const [confirm, setConfirm] = useState(false);
  const title = useRef<HTMLInputElement>(null);
  useEffect(() => { if (note && !note.title && !note.body && !note.background) title.current?.focus(); }, [note?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!note) return <div className="app-scroll"><p>That note is gone.</p><a href={paths.notes(c.id)}>Back to notes</a></div>;
  const edit = (patch: Partial<Note>) => update((x) => ({ ...x, notes: x.notes.map((n) => (n.id === noteId ? { ...n, ...patch, updatedAt: new Date().toISOString() } : n)) }));
  const done = () => {
    if (!note.background && !note.title.trim() && !note.body.trim()) update((x) => ({ ...x, notes: x.notes.filter((n) => n.id !== noteId) }));
    go(paths.notes(c.id));
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '14px 12px 10px 8px', borderBottom: '1px solid var(--q-rule)' }}>
        <button className="btn btn-ghost inked" style={{ minHeight: 44, gap: 2, paddingRight: 8 }} onClick={done}><Icon n="chevron-left" size={18} />Notes</button>
        <span style={{ flex: 1 }} />
        {!note.background && <button className="btn btn-icon btn-ghost inked" aria-label={note.pinned ? 'Unpin note' : 'Pin note'} aria-pressed={note.pinned} onClick={() => edit({ pinned: !note.pinned })} style={{ width: 44, height: 44, background: note.pinned ? 'var(--q-tint)' : undefined }}><Icon n="pin" size={19} /></button>}
        {!note.background && <button className="btn btn-icon btn-ghost inked" aria-label="Delete note" onClick={() => setConfirm(true)} style={{ width: 44, height: 44 }}><Icon n="trash" size={19} /></button>}
        <button className="btn btn-primary inked" style={{ minHeight: 40, marginLeft: 4 }} onClick={done}>Done</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '18px 22px 0', flex: 1, minHeight: 0 }}>
        <label htmlFor="ntitle" className="sr-only">Title</label>
        <input id="ntitle" ref={title} className="title-input" placeholder="Title" value={note.title} readOnly={note.background} onChange={(e) => edit({ title: e.target.value })} />
        <span className="meta tnum">Edited {date(note.updatedAt)} · saved on this device</span>
        <label htmlFor="nbody" className="sr-only">Note</label>
        <textarea id="nbody" placeholder="Write anything: session recaps, names, leads, debts owed…" value={note.body} onChange={(e) => edit({ body: e.target.value })}
          style={{ flex: 1, margin: '6px 0 26px', border: 0, background: 'transparent', resize: 'none', fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.6, color: 'var(--q-ink)', outline: 'none' }} />
      </div>
      {confirm && <Confirm title="Delete note?" confirm="Delete" danger body="This note will be removed from the character." onCancel={() => setConfirm(false)} onConfirm={() => { update((x) => ({ ...x, notes: x.notes.filter((n) => n.id !== noteId) })); go(paths.notes(c.id)); }} />}
    </div>
  );
}
