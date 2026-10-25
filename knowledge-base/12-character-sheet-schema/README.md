# Character Sheet Schema

Source: Corebook character sheet (pp. 343–344, front and back) and Party Sheet (p. 345). Machine-readable versions:

- `character-sheet.schema.json`: one Soulbound character (JSON Schema 2020-12)
- `party-sheet.schema.json`: the Binding's shared sheet (Soulfire, Doom, goals, members)

## Front of character sheet (p. 343)

| Section on sheet | Field(s) | Schema path |
|---|---|---|
| Header | Character name, Archetype, Species, Age, Eyes, Hair, Height, Weight, Distinguishing Features, XP | `identity.*`, `xp` |
| Attributes (left column) | Body, Mind, Soul, each as a value (circle) | `attributes.body|mind|soul` |
| Skills (three columns of 8) | 24 Skills, each with Training (3 boxes) and Focus (3 diamonds) | `skills[]` |
| Goals | Free text lines | `goals[]` |
| Connections | Free text lines | `connections[]` |
| Talents (two columns) | Talent list. Subfaction bonus and Species bonus are also marked here | `talents[]` |
| Natural Awareness | Circle, calculated | `derived.naturalAwareness` (see `../01-core-rules/derived-stats.md`) |
| Combat Abilities | The Ladder grid for **Melee**, **Accuracy** and **Defence** (columns with icons), ratings from Poor to Extraordinary | `combat.melee`, `combat.accuracy`, `combat.defence` |
| Attack DN table | Printed reference: DN by step difference (see below) | — (reference only) |
| Initiative | Circle, calculated | `derived.initiative` |
| Armour | Circle, calculated | `derived.armour` |
| Mettle | Current and Total | `derived.mettle.current`, `derived.mettle.total` |
| Toughness | Current and Total | `derived.toughness.current`, `derived.toughness.total` |
| Wounds | Track of spaces, plus a Mortally Wounded box | `wounds.spaces[]`, `wounds.mortallyWounded` |
| Attacks table | 5 rows: Weapon, Pool, Focus, Damage, Traits | `attacks[]` |

### Attack DN table (printed on sheet)

| Attacker Melee/Accuracy vs Defence | DN |
|---|---|
| Two or more steps higher | 2 |
| One step higher | 3 |
| Equal | 4 |
| One step lower | 5 |
| Two or more steps lower | 6 |

### The Ladder (printed on sheet)

Poor, Average, Good, Great, Superb, Extraordinary. Each rating is one step.

## Back of character sheet (p. 344)

| Section | Field(s) | Schema path |
|---|---|---|
| Portrait | Image | `portrait` |
| Background | Free text | `background` |
| Notes | Free text | `notes` |
| Equipment (body slots) | Head, Cloak, Armour, R. hand, L. hand, Arms, Boots, Jewelry, Other, Other | `equipment.slots.*` |
| Other Gear | Free text lines | `otherGear[]` |
| Currency | Drops, Phials, Spheres (Aqua Ghyranis) | `currency.drops|phials|spheres` |
| Spells & Miracles table | Name, DN/Cost, Target, Range, Duration, Effect (≈14 rows) | `spellsAndMiracles[]` |

## Party sheet (p. 345)

| Section | Schema path |
|---|---|
| Party name | `partyName` |
| Members | `members[]` (references to character IDs) |
| Soulfire pool, total and current | `soulfire.current`, `soulfire.max` |
| Short-term goals; Long-term goals | `shortTermGoals[]`, `longTermGoals[]` |
| Allies; Enemies; Resources | `allies[]`, `enemies[]`, `resources[]` |
| Rumours; Fears; Threats | `rumours[]`, `fears[]`, `threats[]` |
| Doom track | `doom` (integer, minimum 1). The printed track shows 10 spaces |

## Tracking notes

- Printed Ladder rating for each combat column comes from the character's Attribute and Skill (see `../01-core-rules/derived-stats.md`).
- Track derived values on the sheet, or recalculate them from Attributes, Skills and Species. The schema stores derived values as optional, so the app can compute them.
- Skills: Training 0–3 (boxes), Focus 0–3 (diamonds). Training and Focus are capped at 3 each (see `../13-validation-rules/`).

## Advancement fields (added)

- `xp.total`, `xp.spent`: XP totals. Unspent is `total − spent`.
- `xp.ledger`: each purchase as `{type, target, from, to, cost, note}`. Types: `attribute`, `skill-training`, `skill-focus`, `talent`, `lore`, `miracle`, `adjustment`.
- `talents[].cost` (default 2) and `talents[].timesTaken` (for repeatable Talents).
- `spellsAndMiracles[].lore` (spells) and `.god` (miracles), with `source`: `lore-talent`, `miracle-talent`, `endeavour`, `gm-grant`.
- `subfaction`: store the subfaction `name` from `10-subfactions/subfactions.json`.

Enforced by the app: XP cost, Attribute 1–8, Training and Focus 0–3. Everything else is recorded as entered (see `11-advancement/README.md`).
