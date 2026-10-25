# 07 — Spells

Sources: Corebook Chapter 11 (pp. 265–281: 10 Common and 9 Lores × 10 spells, 100 total). Champions of Order pp. 92–110 (5 spells for each Corebook Lore and Common, plus 15 for the Lore of the High Peaks, 65 total). Data: `spells.json` (165 spells, each tagged `book`).

## For the app

- A spell has `name`, `lore`, `dn` (Difficulty:Complexity), `target`, `range`, `duration`, optional `test`, `overcast` (extra successes), `effect`, and `book`.
- Lore names: Common, Amber, Amethyst, Bright, Celestial, Gold, Grey, Jade, Light, The Deeps, High Peaks.
- Spells cost no XP. The Spellcasting Talent (`06-talents/`) gives Arcane Bolt and Mystic Shield plus 4 chosen spells from Common or the chosen Lore. Each additional Lore gives one new spell of that Lore.
- Other spells are learned by Endeavour (DM-run). The player adds the spell to the sheet.
- Endless Spells (Corebook p. 282) are summoned by the GM and are **not** in `spells.json`.
- Spells with a `test` field have an extra Test in the effect (e.g. Flock of Doom).

## Files

- `spells.json`: machine-readable list.
- `_excluded/spell-list-superseded.md`: the earlier prose version, which had extraction errors. Do not use it.
