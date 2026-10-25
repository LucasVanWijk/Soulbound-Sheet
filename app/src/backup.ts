// JSON download of one character. The file is the only backup there is.
import { SCHEMA_VERSION, type Character } from './domain/model';

const EXPORT_KEY = 'soulbound:lastExport:';

export const exportJson = (c: Character, at: string) =>
  JSON.stringify({ app: 'soulbound-sheet', schemaVersion: SCHEMA_VERSION, exportedAt: at, character: c }, null, 2);

export const fileName = (c: Character) =>
  (c.identity.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'character') + '.json';

export const lastExport = (id: string): string | null => { try { return localStorage.getItem(EXPORT_KEY + id); } catch { return null; } };

/** Downloads the character as a .json file and returns the file name. */
export function downloadCharacter(c: Character): string {
  const now = new Date().toISOString();
  const blob = new Blob([exportJson(c, now)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = fileName(c);
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  try { localStorage.setItem(EXPORT_KEY + c.id, now); } catch { /* private mode */ }
  return a.download;
}
