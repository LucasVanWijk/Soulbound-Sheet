# Soulbound Sheet

A phone- and tablet-first character sheet for **Soulbound** (Warhammer Age of Sigmar Roleplay). Create a character from an archetype, track it at the table, spend XP to level up, and keep an inventory and notes. Everything stays on your device, and you back it up by downloading a JSON file.

Status: app built in `app/` (create, sheet, XP, inventory, notes, backup). See `CLAUDE.md` for the brief and `DECISIONS.md` for choices to review.

```
cd app && npm ci && npm run dev    # also: npm test, npm run typecheck, npm run build
```

- `design/screens/`: screen designs ([live canvas](https://claude.ai/artifact/LwDMJ8CVy3Ja6CfcwRHX3v))
- `design/ds/`: Questlog design system (shared with [LifeRPG](https://github.com/LucasVanWijk/LifeRPG))
- `knowledge-base/`: rules data (rules data)
- `reference/`: the printed character sheet

Fan-made tool, not affiliated with Games Workshop or Cubicle 7.
