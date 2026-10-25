# Soulbound Sheet: build brief

A phone- and tablet-first web app for a **Soulbound** (Warhammer Age of Sigmar Roleplay) character sheet. A player creates a character from an archetype, tracks it during play, spends XP to level up, and keeps an inventory and notes. All data stays on the device. The only backup is a JSON file the player downloads.

This repo has the designs and the rules knowledge base. There's no app code yet. Your job is to build it.

## Sources of truth, in order

1. **`reference/printed-sheet-page1.png` and `page2.png`**: the official printed sheet. Where the designs and the sheet disagree on *what* the main screen shows, the sheet wins.
2. **`design/screens/*.dc.html`**: the screen designs (layout, copy, states). The live canvas, which you can tap through, is at https://claude.ai/artifact/LwDMJ8CVy3Ja6CfcwRHX3v. The files are Design Component HTML: read them as markup plus a small `renderVals()` script. Don't try to run them. `canvas.json` lists every screen with its title.
3. **`knowledge-base/`**: the rules data (Talents, spells, Miracles, equipment, archetypes, XP costs, JSON Schemas). **Only its README is in the repo so far.** See "Data you don't have yet".
4. **`design/ds/`**: the Questlog design system (tokens, component CSS, guidelines). The look is copied from the owner's other app, LifeRPG.

## Stack (mirror LifeRPG)

Copy the setup of https://github.com/LucasVanWijk/LifeRPG (folder `app/`). Clone it and read it before you start.

- Vite + React 19 + TypeScript, Vitest for tests. App lives in `app/`.
- Fonts from `@fontsource/cormorant-garamond` and `@fontsource/lora`.
- Styles: start from LifeRPG's `app/src/styles/classical.css` + `app.css`. The same classes are in `design/ds/bundle.css`: `.panel`, `.panel-framed`, `.btn .btn-primary .inked`, `.btn-secondary`, `.btn-ghost`, `.dashed-btn`, `.danger-btn`, `.chip`, `.seg`, `.pill`, `.portrait`, `.seal`, `.bar`, `.tabbar`, `.sheet`, `.scrim`, `.toast`, `.kicker`, `.label`, `.meta`, `.tnum`, `.heading`. Drop the Questlog-only parts (quest board, calendar, expeditions).
- Persistence like LifeRPG: `localStorage` plus `navigator.storage.persist()`, a PWA manifest and service worker, and the iOS home-screen warning (`storage.ts`, `pwa.ts`).
- JSON download/upload like LifeRPG's `backup.ts`.
- Deploy to GitHub Pages with LifeRPG's `.github/workflows/deploy.yml`. Leave out the Google Drive client-ID line.
- No server, no accounts, no analytics.

## Screens (see `design/screens/`)

| Design file | Screen |
|---|---|
| `Main` | Start: Create character, Load from file (.json), list of characters saved on this device |
| `Create1` | Step 1: pick an archetype, with species filter chips. The selected card expands to show what it grants |
| `Create2` | Step 2: confirm or tweak Attributes and Skills against a **creation budget** (sticky counters). Archetype marks are locked; Next is disabled until every tweak is spent |
| `Create3` | Step 3: Core Talent (locked), choose N Talents, starting gear with "choose one" options, spells/Miracles only if the archetype grants them |
| `Create4` | Step 4: portrait, name, age/eyes/hair/height/weight, distinguishing features, short- and long-term goal, connections, background. "Create character" opens the sheet |
| `Sheet` / `SheetTablet` | Main tab, matching page 1 of the printed sheet: name, archetype · species, portrait, **Add XP** / **Spend XP**, XP shown as *available / total earned*; Body/Mind/Soul; 24 Skills in **two columns as `Training/Focus` numbers** (e.g. `Athletics 2/1`); Combat Abilities (Melee, Accuracy, Defence on Poor→Extraordinary) with a fold-out Attack DN table; Initiative, Natural Awareness, Armour; Mettle and Toughness (current/total with −/+); Wounds (Minor/Serious/Deadly, heal) and Mortally Wounded; Attacks; Talents; Goals; Connections |
| `SheetTalent` | Tapping a Talent opens a popover under its row. Keywords inside open a **nested** popover. Spells, Miracles and items use the same pattern |
| `AddXP` | Bottom sheet: stepper, quick +1/+2/+3/+5, optional reason, before→after preview |
| `SpendXP` | Bottom sheet: Skills / Talents / Attributes tabs; each option shows its cost; "At cap" and "Not enough XP" disabled states; confirm. Each purchase writes an XP-log entry |
| `Menu` | Character menu: Download character (.json) with a "Backup saved" toast, Edit details, XP log (expandable), Switch character, Delete character |
| `Inventory` / `InventoryItem` | Tab 2: currency (Drops, Phials, Spheres), a simple item list, Spells & Miracles. Tapping an item opens a popover with stats and traits, and a trait opens a nested popover |
| `Notes` / `NoteEdit` | Tab 3: search, pinned Background note (from creation), note list, "New note" button, full-screen editor |

Bottom tab bar: **Sheet · Inventory · Notes**. Tablet (≥ 768px) uses the two-column `SheetTablet` layout. Above 900px you can follow LifeRPG's desktop shell, but phone and tablet come first.

## Rules the app enforces (and doesn't)

From `knowledge-base/README.md`:

- **Enforces:** XP costs and caps (from `11-advancement/advancement-costs.json`), plus the creation budget during the creation steps. Every XP change is written to an **XP ledger** (add with reason, spend with what was bought, before/after).
- **Applies:** the mechanical effect of Talents, subfaction bonuses, spells and Miracles on derived stats.
- **Doesn't check:** Talent prerequisites, max Talents, or Lore requirements. Those are the GM's job. Don't run combat rolls or downtime.
- **Left out on purpose:** Soulfire and Doom. They're party/table resources, not character fields.
- Derived stats (Initiative, Natural Awareness, Mettle, Toughness, Melee/Accuracy/Defence) are calculated, not typed. The formulas are in `01-core-rules/`.

## Data model

Use `12-character-sheet-schema/character-sheet.schema.json` once it's in the repo. Until then, sketch the TypeScript types and keep them easy to align later:

- `Character`: id, identity (name, archetypeId, speciesId, age, eyes, hair, height, weight, features, portrait as a data URL), attributes {body, mind, soul}, skills (record of 24 → {training 0–3, focus 0–3}), talents (ids), spells/miracles (ids), items ({itemId or custom name, qty, notes}), currency {drops, phials, spheres}, mettle {current}, toughness {current}, wounds [{type: minor|serious|deadly}], mortallyWounded, goals {short, long}, connections [{name, relation}], notes [{id, title, body, pinned, updatedAt}], xp {earned}, xpLedger [{at, delta, kind: add|spend, reason, purchase?}].
- Available XP = earned − sum of spend entries. Never store it separately.
- Storage: one key per character plus an index of characters. The export file holds one character with a `schemaVersion` field. Import validates it, migrates it if needed, and never overwrites an existing character without asking.

## Data you don't have yet

Only `knowledge-base/README.md` is in the repo. Build against **placeholders** (`[Archetype name]`, `[n] XP`, and so on, as in the designs) behind a small data-access layer, so the real JSON files drop in later. When a missing file actually blocks you, **stop and ask the owner to add that specific file** to `knowledge-base/`. Likely order: `11-advancement/advancement-costs.json`, `04-archetypes/`, `12-character-sheet-schema/`, `05-skills/skills.json`, then talents, equipment, spells, miracles, subfactions. Don't write rules text from memory. The books are copyrighted, and the owner supplies the data.

## Design rules (from the Questlog system)

- Parchment ground (`--q-parch`), hairline rules rather than shadows, Cormorant Garamond 600 for titles/buttons/numbers, Lora for reading. Tabular numerals for all figures.
- Three inks with fixed jobs: amber-brown for reading and navigating, wax red (`--q-wax`) for danger, urgency and the active tab marker, moss (`--q-moss`) for done/selected checkboxes.
- Touch targets ≥ 44px. Real `<button>`/`<a>`/`<input>` with labels. Text contrast ≥ 4.5:1: never set text in `--color-accent-600` or lighter.
- No emoji. Lucide outline icons at 1.6 stroke.

## Suggested first milestones

1. Scaffold `app/` from LifeRPG's setup and styles. Character store with localStorage, JSON export/import, and tests.
2. Start screen + the three-tab shell + main Sheet (static placeholder data).
3. Add XP / Spend XP with the ledger, using placeholder costs behind the data layer.
4. Creation flow with budget checks.
5. Inventory + Notes + nested popovers.
6. PWA + GitHub Pages deploy.

Commit in small steps and keep `npm test` and `npm run typecheck` green.
