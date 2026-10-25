import { useMemo, useState } from 'react';
import { Icon } from '../components/Icon';
import { CloseBtn, Confirm, Initial, RichText, Sheet, rule } from '../components/common';
import { downloadCharacter } from '../backup';
import { ATTRS, ATTR_LABEL, GODS, MIRACLES, SKILL_NAMES, TALENTS, findTalent, splitTalentName, talentChoiceOptions, type Attr } from '../data/kb';
import { availableXp, type Character, type Purchase } from '../domain/model';
import { addXp, attributeStep, canTakeTalent, costOf, describePurchase, skillStep, spend, undoLastPurchase } from '../domain/xp';
import { paths } from '../router';
import { useStore } from '../state/store';

// ── Add XP ───────────────────────────────────────────────────────────────────

export function AddXpSheet({ c, onClose }: { c: Character; onClose: () => void }) {
  const { update, say } = useStore();
  const [amount, setAmount] = useState(3);
  const [reason, setReason] = useState('');
  const avail = availableXp(c);
  const add = () => { update((x) => addXp(x, amount, reason, new Date().toISOString())); say(`Added ${amount} XP`); onClose(); };
  return (
    <Sheet label="Add XP" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}><span className="kicker">Add XP</span><span className="title-sheet heading">Award experience</span></div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, padding: '6px 0' }}>
        <button className="btn btn-icon btn-secondary" aria-label="Less" disabled={amount <= 1} onClick={() => setAmount(Math.max(1, amount - 1))} style={{ width: 52, height: 52 }}><Icon n="minus" size={20} /></button>
        <span className="heading tnum" style={{ fontSize: 56, lineHeight: 1, minWidth: 80, textAlign: 'center' }} aria-live="polite">{amount}</span>
        <button className="btn btn-icon btn-secondary" aria-label="More" onClick={() => setAmount(amount + 1)} style={{ width: 52, height: 52 }}><Icon n="plus" size={20} /></button>
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        {[1, 2, 3, 5].map((n) => <button key={n} className="chip tnum" aria-pressed={n === amount} onClick={() => setAmount(n)} style={{ minHeight: 44, padding: '0 16px', fontSize: 16 }}>+{n}</button>)}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <label htmlFor="why" className="label">Reason (optional)</label>
        <input id="why" className="input" placeholder="e.g. Session 4, goal completed" value={reason} onChange={(e) => setReason(e.target.value)} style={{ minHeight: 46 }} />
      </div>
      <div className="panel tnum" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', padding: '10px 14px' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}><span className="label">To spend</span><span className="heading" style={{ fontSize: 19 }}>{avail} → {avail + amount}</span></div>
        <div style={{ display: 'flex', flexDirection: 'column' }}><span className="label">Earned</span><span className="heading" style={{ fontSize: 19 }}>{c.xp.earned} → {c.xp.earned + amount}</span></div>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn btn-secondary" style={{ flex: 1, minHeight: 50 }} onClick={onClose}>Cancel</button>
        <button className="btn btn-primary inked tnum" style={{ flex: 2, minHeight: 50 }} onClick={add}>Add {amount} XP</button>
      </div>
    </Sheet>
  );
}

// ── Spend XP ─────────────────────────────────────────────────────────────────

type Tab = 'Skills' | 'Talents' | 'Attributes';
interface Opt { id: string; label: string; cost: string; off?: string; purchase?: Purchase }
interface Row { key: string; name: string; now: string; opts: Opt[]; talent?: string; choiceFor?: string }

export function SpendXpSheet({ c, onClose, onLog }: { c: Character; onClose: () => void; onLog: () => void }) {
  const { update, say } = useStore();
  const [tab, setTab] = useState<Tab>('Skills');
  const [pick, setPick] = useState<string | null>(null);
  const [choice, setChoice] = useState('');
  const [q, setQ] = useState('');
  const [about, setAbout] = useState<string | null>(null);
  const avail = availableXp(c);
  const now = new Date().toISOString();

  const opt = (id: string, label: string, p: Purchase, doneText?: string): Opt => {
    const cost = costOf(c, p);
    if (doneText) return { id, label, cost: '', off: doneText };
    if (cost === null) return { id, label, cost: '', off: 'At cap' };
    if (cost > avail) return { id, label, cost: '', off: 'Not enough XP' };
    return { id, label, cost: `${cost} XP`, purchase: p };
  };

  const rows = useMemo<Row[]>(() => {
    if (tab === 'Skills') {
      return SKILL_NAMES.map((s) => {
        const l = c.skills[s] ?? { training: 0, focus: 0 };
        const t = skillStep('training', l.training), f = skillStep('focus', l.focus);
        return {
          key: s, name: s, now: `Training ${l.training} · Focus ${l.focus}`,
          opts: [
            t ? opt(`${s}|t`, 'Training', { type: 'skill-training', target: s, from: t.from, to: t.to }) : { id: `${s}|t`, label: 'Training', cost: '', off: 'At cap' },
            f ? opt(`${s}|f`, 'Focus', { type: 'skill-focus', target: s, from: f.from, to: f.to }) : { id: `${s}|f`, label: 'Focus', cost: '', off: 'At cap' },
          ],
        };
      });
    }
    if (tab === 'Attributes') {
      return ATTRS.map((k: Attr) => {
        const step = attributeStep(c.attributes[k]);
        return {
          key: k, name: ATTR_LABEL[k], now: `Now ${c.attributes[k]}`,
          opts: [step ? opt(`${k}|a`, `Raise to ${step.to}`, { type: 'attribute', target: k, from: step.from, to: step.to }) : { id: `${k}|a`, label: 'Max', cost: '', off: 'At cap' }],
        };
      });
    }
    const needle = q.trim().toLowerCase();
    const talents = TALENTS.filter((t) => !needle || t.name.toLowerCase().includes(needle)).map((t): Row => {
      const owned = !canTakeTalent(c, t.name, null) && !t.choice;
      return {
        key: t.name, name: t.name.replace(' (Choose)', ''), now: t.requirement ? `Requires: ${t.requirement}` : t.book, talent: t.name, choiceFor: t.choice ? t.name : undefined,
        opts: [opt(`${t.name}|l`, t.repeatable && c.talents.some((x) => x.name === t.name) ? 'Learn again' : 'Learn', { type: 'talent', target: t.name, choice: null }, owned ? 'Learned' : undefined)],
      };
    });
    const gods = new Set<string>(['Universal']);
    for (const t of c.talents) if (splitTalentName(t.name).base === 'Blessed' && t.choice) gods.add(t.choice);
    const miracles = gods.size > 1 ? MIRACLES.filter((m) => gods.has(m.god) && GODS.includes(m.god) && !c.miracles.some((x) => x.god === m.god && x.name === m.name)
      && (!needle || m.name.toLowerCase().includes(needle))).map((m): Row => ({
      key: `m|${m.god}|${m.name}`, name: m.name, now: `Miracle · ${m.god}`,
      opts: [opt(`m|${m.god}|${m.name}|l`, 'Learn', { type: 'miracle', target: m.name, god: m.god })],
    })) : [];
    return [...talents, ...miracles];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, c, q, avail]);

  const picked = rows.flatMap((r) => r.opts.map((o) => ({ r, o }))).find(({ o }) => o.id === pick);
  const needsChoice = !!picked?.r.choiceFor;
  const choiceInfo = picked?.r.choiceFor ? findTalent(picked.r.choiceFor) : undefined;
  const choiceDef = choiceInfo ? talentChoiceOptions(choiceInfo) : null;
  const ready = !!picked?.o.purchase && (!needsChoice || choice.trim().length > 0);

  const confirm = () => {
    if (!picked?.o.purchase) return;
    let p = picked.o.purchase;
    if (p.type === 'talent' && needsChoice) p = { ...p, choice: choice.trim() };
    const r = spend(c, p, now);
    if (!r.ok) { say(r.reason === 'not-enough' ? 'Not enough XP' : 'That is at its cap'); return; }
    update(() => r.character);
    say(`${describePurchase(p)} · −${costOf(c, p)} XP`);
    onClose();
  };

  return (
    <Sheet label="Spend XP" onClose={onClose} flush>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '10px 22px 12px' }}>
        <span className="grabber" style={{ alignSelf: 'center' }} />
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 10 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}><span className="kicker">Spend XP</span><span className="heading tnum" style={{ fontSize: 26 }}>{avail} XP to spend</span></div>
          <button className="btn btn-ghost inked" onClick={onLog} style={{ minHeight: 44, gap: 6 }}><Icon n="history" size={16} />XP log</button>
        </div>
        <div className="seg" role="radiogroup" aria-label="What to raise" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
          {(['Skills', 'Talents', 'Attributes'] as Tab[]).map((t) => (
            <label key={t} className="seg-opt" style={{ minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 15 }}>
              <input type="radio" name="tab" checked={tab === t} onChange={() => { setTab(t); setPick(null); setChoice(''); setAbout(null); }} />{t}
            </label>
          ))}
        </div>
        {tab === 'Talents' && (
          <div style={{ position: 'relative' }}>
            <label htmlFor="spend-q" className="sr-only">Search Talents</label>
            <span style={{ position: 'absolute', left: 12, top: 13, color: 'var(--color-accent-800)' }}><Icon n="search" size={17} /></span>
            <input id="spend-q" className="input" placeholder="Search Talents and Miracles" value={q} onChange={(e) => setQ(e.target.value)} style={{ minHeight: 44, paddingLeft: 38 }} />
          </div>
        )}
      </div>
      <div style={{ flex: 1, overflowY: 'auto', borderTop: '1px solid var(--q-rule)' }}>
        {rows.length === 0 && <p className="muted" style={{ margin: 0, padding: 22, fontStyle: 'italic' }}>Nothing matches.</p>}
        {rows.map((r) => {
          const sel = r.opts.some((o) => o.id === pick);
          const info = r.talent ? findTalent(r.talent) : undefined;
          return (
            <div key={r.key} style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 22px', borderBottom: '1px solid var(--q-rule)', background: sel ? 'var(--q-tint)' : 'transparent' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="heading" style={{ flex: 1, fontSize: 18 }}>{r.name}</span>
                <span className="meta tnum" style={{ textAlign: 'right' }}>{r.now}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${r.talent ? 2 : r.opts.length}, minmax(0, 1fr))`, gap: 8 }}>
                {r.opts.map((o) => (
                  <button key={o.id} className={'btn ' + (pick === o.id ? 'btn-primary inked' : 'btn-secondary')} disabled={!!o.off} aria-pressed={pick === o.id}
                    onClick={() => { setPick(pick === o.id ? null : o.id); setChoice(''); }} style={{ minHeight: 44, flexDirection: 'column', gap: 0, padding: '4px 6px', lineHeight: 1.15 }}>
                    <span>{o.off ? o.label : '+ ' + o.label}</span>
                    <span className="tnum" style={{ fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: 11 }}>{o.off ?? o.cost}</span>
                  </button>
                ))}
                {r.talent && <button className="btn btn-secondary" aria-expanded={about === r.key} onClick={() => setAbout(about === r.key ? null : r.key)} style={{ minHeight: 44, flexDirection: 'column', gap: 0, padding: '4px 6px', lineHeight: 1.15 }}><span>Details</span><span style={{ fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: 11 }}>{about === r.key ? 'Hide' : 'Show'}</span></button>}
              </div>
              {about === r.key && info && <RichText text={info.effect} exclude={[splitTalentName(info.name).base]} />}
              {sel && r.choiceFor && choiceDef && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <label className="label" htmlFor="spend-choice">{choiceDef.label}</label>
                  {choiceDef.options
                    ? <select id="spend-choice" className="input" value={choice} onChange={(e) => setChoice(e.target.value)} style={{ minHeight: 44 }}><option value="">Choose…</option>{choiceDef.options.map((o) => <option key={o}>{o}</option>)}</select>
                    : <input id="spend-choice" className="input" value={choice} onChange={(e) => setChoice(e.target.value)} style={{ minHeight: 44 }} />}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 22px calc(26px + env(safe-area-inset-bottom, 0px))', borderTop: '1px solid var(--q-rule)', background: 'var(--q-parch)' }}>
        {picked && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <span style={{ display: 'flex', flexDirection: 'column' }}><span className="label">Buying</span><span className="heading" style={{ fontSize: 17 }}>{picked.r.name} · {picked.o.label}</span></span>
            <span className="pill tnum">{picked.o.cost}</span>
          </div>
        )}
        <button className="btn btn-primary inked" style={{ minHeight: 50 }} disabled={!ready} onClick={confirm}>Confirm purchase</button>
      </div>
    </Sheet>
  );
}

// ── Character menu ───────────────────────────────────────────────────────────

export function MenuSheet({ c, onClose, go, logOpen: initialLog }: { c: Character; onClose: () => void; go: (h: string) => void; logOpen: boolean }) {
  const { update, remove, say } = useStore();
  const [log, setLog] = useState(initialLog);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const entries = [...c.xpLedger].reverse();
  const canUndo = c.xpLedger.length > 0 && c.xpLedger[c.xpLedger.length - 1].kind === 'spend' && !!c.xpLedger[c.xpLedger.length - 1].purchase;
  const row = { gap: 14, minHeight: 54, padding: '0 14px' } as const;
  const ico = (n: Parameters<typeof Icon>[0]['n']) => <Icon n={n} size={20} />;

  return (
    <Sheet label="Character menu" onClose={onClose}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Initial name={c.identity.name} />
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
          <span className="heading ellipsis" style={{ fontSize: 20 }}>{c.identity.name}</span>
          <span className="meta tnum">Saved {new Date(c.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} · {availableXp(c)} / {c.xp.earned} XP</span>
        </div>
        <CloseBtn onClick={onClose} />
      </div>
      <div className="panel" style={{ overflow: 'hidden' }}>
        <button className="row-btn" style={{ ...row, borderTop: 0 }} onClick={() => { const name = downloadCharacter(c); say(`Backup saved · ${name}`); }}>
          {ico('download')}
          <span style={{ flex: 1, display: 'flex', flexDirection: 'column', textAlign: 'left' }}><span className="heading" style={{ fontSize: 17 }}>Download character</span><span className="meta">Save a .json file you keep yourself</span></span>
        </button>
        <a href={paths.details(c.id)} className="row-btn" style={{ ...row, textDecoration: 'none', borderTop: '1px solid var(--q-rule)' }} onClick={onClose}>{ico('pencil')}<span className="heading" style={{ flex: 1, fontSize: 17 }}>Edit details</span></a>
        <button className="row-btn" style={{ ...row, borderTop: '1px solid var(--q-rule)' }} aria-expanded={log} onClick={() => setLog(!log)}>
          {ico('history')}<span className="heading" style={{ flex: 1, fontSize: 17, textAlign: 'left' }}>XP log</span><Icon n={log ? 'chevron-up' : 'chevron-down'} size={16} />
        </button>
        {log && (
          <div style={{ padding: '0 14px 8px 48px', display: 'flex', flexDirection: 'column' }}>
            {entries.length === 0 && <p className="muted" style={{ margin: 0, padding: '8px 0', fontStyle: 'italic', fontSize: 13 }}>No XP yet.</p>}
            {entries.map((e, i) => (
              <div key={e.id} className="tnum" style={{ display: 'flex', alignItems: 'center', gap: 10, minHeight: 36, borderTop: rule(i === 0 ? 0 : 1), fontSize: 13 }}>
                <span style={{ flex: 1 }}>{e.reason || (e.kind === 'add' ? 'XP added' : 'Spent')}<span className="meta"> · {e.before} → {e.after} left</span></span>
                <span className="heading" style={{ fontSize: 15, color: e.delta < 0 ? 'var(--q-wax)' : 'var(--q-moss)' }}>{e.delta > 0 ? '+' : '−'}{Math.abs(e.delta)}</span>
              </div>
            ))}
            {canUndo && <button className="btn btn-ghost inked" style={{ minHeight: 44, alignSelf: 'flex-start', gap: 6 }} onClick={() => { const u = undoLastPurchase(c, new Date().toISOString()); if (u) { update(() => u); say('Last purchase undone'); } }}><Icon n="undo" size={16} />Undo last purchase</button>}
          </div>
        )}
        <a href={paths.start} className="row-btn" style={{ ...row, textDecoration: 'none', borderTop: '1px solid var(--q-rule)' }} onClick={onClose}>{ico('users')}<span className="heading" style={{ flex: 1, fontSize: 17 }}>Switch character</span></a>
      </div>
      <button className="danger-btn" style={{ minHeight: 48, gap: 8 }} onClick={() => setConfirmDelete(true)}><Icon n="trash" size={17} />Delete character</button>
      {confirmDelete && (
        <Confirm title="Delete character?" confirm="Delete" danger
          body={<>This removes <b>{c.identity.name}</b> from this device. Download a backup first if you might want them back.</>}
          onCancel={() => setConfirmDelete(false)}
          onConfirm={() => { remove(c.id); onClose(); go(paths.start); say(`${c.identity.name} deleted`); }} />
      )}
    </Sheet>
  );
}
