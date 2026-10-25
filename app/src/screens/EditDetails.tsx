import { DetailsForm } from '../components/DetailsForm';
import { Icon } from '../components/Icon';
import type { Character } from '../domain/model';
import { paths } from '../router';
import { useStore } from '../state/store';

/** "Edit details" from the menu: the same form as creation step 4, saved as you type. */
export function EditDetails({ c, go }: { c: Character; go: (h: string) => void }) {
  const { update } = useStore();
  const i = c.identity;
  return (
    <>
      <div className="app-scroll fill" style={{ padding: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px 0 8px', minHeight: 52 }}>
          <button className="btn btn-icon btn-ghost inked" aria-label="Back to sheet" onClick={() => go(paths.sheet(c.id))} style={{ width: 44, height: 44 }}><Icon n="chevron-left" size={20} /></button>
          <span className="heading" style={{ fontSize: 17 }}>Edit details</span>
        </div>
        <div style={{ padding: '10px 22px 16px' }}><h1 className="screen-title" style={{ margin: 0 }}>Who are they?</h1></div>
        <DetailsForm subtitle={`${i.archetype} · ${i.species}`}
          value={{ name: i.name, age: i.age, eyes: i.eyes, hair: i.hair, height: i.height, weight: i.weight, features: i.features, short: c.goals.short, long: c.goals.long, portrait: i.portrait, connections: c.connections }}
          onChange={(p) => update((x) => ({
            ...x, updatedAt: new Date().toISOString(),
            identity: { ...x.identity, ...(['name', 'age', 'eyes', 'hair', 'height', 'weight', 'features', 'portrait'] as const).reduce((o, k) => (k in p ? { ...o, [k]: p[k] } : o), {}) },
            goals: { short: p.short ?? x.goals.short, long: p.long ?? x.goals.long },
            connections: p.connections ?? x.connections,
          }))} />
      </div>
      <div style={{ padding: '14px 22px calc(26px + env(safe-area-inset-bottom, 0px))', borderTop: '1px solid var(--q-rule)', background: 'var(--q-parch)' }}>
        <button className="btn btn-primary inked" style={{ width: '100%', minHeight: 48 }} disabled={!i.name.trim()} onClick={() => go(paths.sheet(c.id))}>Done</button>
      </div>
    </>
  );
}
