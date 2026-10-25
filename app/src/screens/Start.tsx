import { useRef, useState } from 'react';
import { Icon } from '../components/Icon';
import { Confirm, Initial, Modal, Section, rule } from '../components/common';
import { readExport } from '../domain/migrate';
import { newId, type Character } from '../domain/model';
import { paths } from '../router';
import { dismissIosWarning, iosAtRisk } from '../storage';
import { useStore } from '../state/store';

export function Start({ go }: { go: (h: string) => void }) {
  const store = useStore();
  const file = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [clash, setClash] = useState<Character | null>(null);
  const [ios, setIos] = useState(iosAtRisk);

  const finish = (c: Character) => { store.add(c); store.say(`Loaded ${c.identity.name}`); go(paths.sheet(c.id)); };

  const pick = async (f: File | undefined) => {
    if (!f) return;
    const r = readExport(await f.text());
    if (!r.ok) { setError(r.error); return; }
    if (store.exists(r.character.id)) setClash(r.character);
    else finish(r.character);
  };

  return (
    <div className="app-scroll" style={{ padding: '28px 22px 26px', gap: 26 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span className="seal heading" style={{ width: 34, height: 34, fontSize: 18 }}>S</span>
        <span className="heading" style={{ fontSize: 25 }}>Soulbound Sheets</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span className="kicker">{store.index.length ? 'Welcome back' : 'Welcome'}</span>
        <h1 className="screen-title" style={{ margin: 0 }}>Your characters</h1>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <a href={paths.create(1)} className="btn btn-primary inked" style={{ minHeight: 50, fontSize: 17, textDecoration: 'none', gap: 8 }}>
          <Icon n="plus" size={18} />Create character
        </a>
        <button className="btn btn-secondary" style={{ minHeight: 50, fontSize: 17, gap: 8 }} onClick={() => file.current?.click()}>
          <Icon n="upload" size={18} />Load from file (.json)
        </button>
        <input ref={file} type="file" accept=".json,application/json" hidden aria-label="Character file" onChange={(e) => { void pick(e.target.files?.[0]); e.target.value = ''; }} />
      </div>
      <Section kicker="On this device" pad="0">
        {store.index.length === 0
          ? <p className="muted" style={{ margin: 0, fontStyle: 'italic', fontSize: 14 }}>No characters yet. Create one or load a file.</p>
          : (
            <div className="panel" style={{ overflow: 'hidden' }}>
              {store.index.map((c, i) => (
                <a key={c.id} href={paths.sheet(c.id)} className="row-btn" style={{ gap: 14, padding: '12px 14px', minHeight: 68, textDecoration: 'none', borderTop: rule(i) }}>
                  <Initial name={c.name} />
                  <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span className="heading ellipsis" style={{ fontSize: 18 }}>{c.name}</span>
                    <span className="meta tnum">{c.archetype} · {c.species}</span>
                  </span>
                  <span className="pill tnum">{c.xpAvailable} / {c.xpEarned} XP</span>
                  <Icon n="chevron-right" size={16} />
                </a>
              ))}
            </div>
          )}
      </Section>
      {ios && (
        <div className="panel" role="note" style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="heading" style={{ fontSize: 17 }}>Add this app to your Home Screen</span>
          <span style={{ fontSize: 14 }}>Safari on iPhone clears website data after 7 days without a visit, unless the app is on the Home Screen. Tap Share, then Add to Home Screen, and keep a downloaded backup.</span>
          <button className="btn btn-secondary" style={{ minHeight: 44, alignSelf: 'flex-start' }} onClick={() => { dismissIosWarning(); setIos(false); }}>Got it</button>
        </div>
      )}
      <div style={{ flex: 1 }} />
      <p className="muted" style={{ margin: 0, fontSize: 13, lineHeight: 1.5, fontStyle: 'italic' }}>
        Characters are saved in this browser only. Download a .json backup from the character menu to keep one safe.
      </p>
      {error && (
        <Modal label="Could not load" onClose={() => setError(null)}>
          <h2 style={{ fontSize: 24, margin: 0 }}>Could not load that file</h2>
          <p style={{ margin: 0 }}>{error}</p>
          <button className="btn btn-primary inked" style={{ minHeight: 46 }} onClick={() => setError(null)}>OK</button>
        </Modal>
      )}
      {clash && (
        <Confirm title="Already on this device" confirm="Replace it"
          body={<>A character named <b>{clash.identity.name}</b> with this id is already saved here. Replacing it loses the version on this device. <button className="btn btn-ghost inked" style={{ minHeight: 44, padding: '0 6px' }} onClick={() => { finish({ ...clash, id: newId(), identity: { ...clash.identity, name: `${clash.identity.name} (copy)` } }); setClash(null); }}>Keep both instead</button></>}
          onConfirm={() => { finish(clash); setClash(null); }} onCancel={() => setClash(null)} />
      )}
    </div>
  );
}
