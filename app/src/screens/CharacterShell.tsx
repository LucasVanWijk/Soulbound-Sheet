import { useState } from 'react';
import { Icon, type IconName } from '../components/Icon';
import type { Character } from '../domain/model';
import { paths } from '../router';
import { AddXpSheet, MenuSheet, SpendXpSheet } from './Overlays';
import { InventoryTab } from './Inventory';
import { NotesTab } from './Notes';
import { SheetTab } from './SheetTab';

type Tab = 'sheet' | 'inventory' | 'notes';
const TABS: { key: Tab; label: string; icon: IconName; href: (id: string) => string }[] = [
  { key: 'sheet', label: 'Sheet', icon: 'scroll', href: paths.sheet },
  { key: 'inventory', label: 'Inventory', icon: 'backpack', href: paths.inventory },
  { key: 'notes', label: 'Notes', icon: 'feather', href: paths.notes },
];

/** The three-tab shell for an open character, with the XP and menu sheets above it. */
export function CharacterShell({ c, tab, go }: { c: Character; tab: Tab; go: (h: string) => void }) {
  const [overlay, setOverlay] = useState<null | 'menu' | 'add' | 'spend' | 'log'>(null);
  const close = () => setOverlay(null);
  return (
    <>
      <div className="app-scroll fill" style={{ padding: 0 }} key={tab}>
        {tab === 'sheet' && <SheetTab c={c} onAddXp={() => setOverlay('add')} onSpendXp={() => setOverlay('spend')} onMenu={() => setOverlay('menu')} />}
        {tab === 'inventory' && <div style={{ position: 'relative' }}><InventoryMenu onMenu={() => setOverlay('menu')} /><InventoryTab c={c} /></div>}
        {tab === 'notes' && <div style={{ position: 'relative' }}><InventoryMenu onMenu={() => setOverlay('menu')} /><NotesTab c={c} go={go} /></div>}
        <div style={{ height: 24, flex: 'none' }} />
      </div>
      <nav className="tabbar" aria-label="Sheet sections" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', paddingTop: 0 }}>
        {TABS.map((t) => (
          <a key={t.key} href={t.href(c.id)} aria-current={tab === t.key ? 'page' : undefined}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, minHeight: 58, textDecoration: 'none', color: tab === t.key ? 'var(--q-ink)' : 'var(--color-accent-700)', fontWeight: tab === t.key ? 600 : 400, fontSize: 11, letterSpacing: '.03em' }}>
            <span style={{ width: 22, height: 2, marginBottom: 6, background: tab === t.key ? 'var(--q-wax)' : 'transparent' }} />
            <Icon n={t.icon} size={20} />{t.label}
          </a>
        ))}
      </nav>
      {overlay === 'add' && <AddXpSheet c={c} onClose={close} />}
      {overlay === 'spend' && <SpendXpSheet c={c} onClose={close} onLog={() => setOverlay('log')} />}
      {(overlay === 'menu' || overlay === 'log') && <MenuSheet c={c} onClose={close} go={go} logOpen={overlay === 'log'} />}
    </>
  );
}

/** The character menu button, floated at the top right of Inventory and Notes. */
function InventoryMenu({ onMenu }: { onMenu: () => void }) {
  return (
    <button className="btn btn-icon btn-ghost inked" aria-label="Character menu" onClick={onMenu} style={{ position: 'absolute', right: 10, top: 14, width: 44, height: 44, zIndex: 2 }}><Icon n="more" size={20} /></button>
  );
}
