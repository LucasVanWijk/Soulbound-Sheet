# 06 — Talents

Sources: Corebook pp. 82–92 (77 Talents) and Champions of Order pp. 69–82 (111 Talents). Data: `talents.json` (188 Talents, each tagged `book`).

## For the app

- Each entry has `name`, `requirement` (text, DM-checked), `repeatable`, `effect` (what to apply), and optional `choice`, `lores`, `companions`, `terrain`, `tools` where the player chooses an option.
- Cost: 2 XP each (`advancement-costs.json`). The Spellcasting Talent also has the extra Lore costs.
- Repeatable: Combat Ready, Forbidden Knowledge, Spellcasting (Choose). Store `timesTaken` on the character sheet.
- `downtimeNote`: the talent has a part the DM runs (Endeavours, companion replacement). The app only applies the mechanical effect.
- Archetype-only talents (e.g. Ancestral Memories, Heroic Challenge) are listed here with their archetype requirement. The archetype choice is DM-checked.

## Champions talents

The Champions Talents (`book: "Champions of Order"`) include the ones that Champions archetypes use as Core Talents (Lurelight, Nav-League Member, Shadow Leap, Lightning-fast Strikes, Mountain Stance, Shining Company) and the ones that subfaction bonuses rely on (A Good Plan, Stirring Voice, Thoughtful, Old Enemy, Industrious, Ur-gold Mastery). Loyal Companion's Champions additions (Rakerdart, Scryhawk) are in its `companions` list.

Not included: the Lore of the High Peaks (Champions p. 103) and its spells, which Spellcasting (High Peaks) refers to. Champions Miracles (Grungni, Teclis) are not transcribed either.

## Files

- `talents.json`: machine-readable list.
- `_excluded/talents-list-superseded.md`: the earlier prose version, kept for reference only.
