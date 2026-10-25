import { describe, expect, it } from 'vitest';
import { createRepo } from './repo';
import { readExport } from './migrate';
import { exportJson } from '../backup';
import { MemoryStorage, makeCharacter, NOW } from '../test-helpers';
import { SCHEMA_VERSION } from './model';

describe('repo', () => {
  it('saves, lists, loads and removes', () => {
    const repo = createRepo(new MemoryStorage());
    const a = makeCharacter();
    repo.save(a);
    expect(repo.list().map((e) => e.name)).toEqual(['Test Hero']);
    expect(repo.load(a.id)).toEqual(a);
    repo.remove(a.id);
    expect(repo.list()).toEqual([]);
    expect(repo.load(a.id)).toBeNull();
  });
  it('rebuilds a damaged index', () => {
    const kv = new MemoryStorage();
    const repo = createRepo(kv);
    repo.save(makeCharacter());
    kv.setItem('soulbound:index', '{nope');
    expect(repo.list()).toHaveLength(1);
  });
});

describe('import', () => {
  const c = makeCharacter();
  it('round-trips an export', () => {
    const r = readExport(exportJson(c, NOW));
    expect(r).toMatchObject({ ok: true, migrated: false });
    if (r.ok) expect(r.character).toEqual(c);
  });
  it('rejects junk, a missing version and a newer version', () => {
    expect(readExport('nope')).toMatchObject({ ok: false });
    expect(readExport('{"character":{}}')).toMatchObject({ ok: false });
    expect(readExport(JSON.stringify({ schemaVersion: SCHEMA_VERSION + 1, character: c }))).toMatchObject({ ok: false, error: expect.stringContaining('newer') });
  });
  it('clamps out-of-range numbers from a hand-edited file', () => {
    const bad = { ...c, attributes: { body: 99, mind: 0, soul: 3 }, skills: { Might: { training: 9, focus: -2 } } };
    const r = readExport(JSON.stringify({ schemaVersion: 1, character: bad }));
    expect(r.ok && r.character.attributes).toEqual({ body: 8, mind: 1, soul: 3 });
    expect(r.ok && r.character.skills.Might).toEqual({ training: 3, focus: 0 });
  });
});
