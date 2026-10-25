# Soulbound — Character Sheet Knowledge Base

Knowledge base for an app that holds a Soulbound character sheet and handles leveling (skill levels and Talents bought with XP).

Sources: Soulbound Corebook, Champions of Order (subfaction bonuses only). Steam and Steel is not included.

## Scope

The app:
- stores the character sheet (identity, Attributes, Skills, Talents, Spells and Miracles, equipment, Wounds, Mettle, Soulfire, Doom, XP);
- charges XP for level-ups and records each purchase in an XP ledger;
- applies the mechanical effect of each Talent, subfaction bonus, spell and Miracle to the sheet.

The app does **not** check Talent prerequisites, max Talents, or Lore requirements. It does not run combat rolls or downtime. The DM handles those. The player adds downtime results to the sheet by hand (items, spells, Talents).

## Folders

| Folder | Purpose | Data file |
|---|---|---|
| `01-core-rules/` | Derived stats (used on the sheet), damage, Mettle, Soulfire, Doom. Tests and combat are reference only. | — |
| `02-character-creation/` | Creation steps and Attribute rules. | — |
| `03-species/` | Species, starting bonuses. | — |
| `04-archetypes/` | Archetypes: Core Skill, Core Talent, Skills, Talents, starting equipment. | — |
| `05-skills/` | 24 Skills and suggested Attributes. | `skills.json` |
| `06-talents/` | 188 Talents (77 Corebook, 111 Champions) with effects and costs. | `talents.json` |
| `07-spells/` | 165 spells (100 Corebook, 65 Champions) across 10 Lores, Common and the High Peaks. | `spells.json` |
| `08-miracles/` | 44 Miracles: Universal and 5 Corebook gods, plus Grungni and Teclis from Champions. | `miracles.json` |
| `09-equipment/` | Weapons, armour, gear, aetheric devices, rigs. | `equipment-data.json` |
| `10-subfactions/` | 55 subfaction bonuses (Champions). | `subfactions.json` |
| `11-advancement/` | XP costs and caps. | `advancement-costs.json` |
| `12-character-sheet-schema/` | Sheet layout and JSON Schemas. | `character-sheet.schema.json`, `party-sheet.schema.json` |
| `13-validation-rules/` | Rule checks; the app enforces only XP cost and caps. | — |
| `art/` | Reference renders of the printed sheets. | — |
| `_excluded/` | Not for the app: downtime (Endeavours), superseded prose files. | — |

## Start here

1. `12-character-sheet-schema/character-sheet.schema.json`: the sheet.
2. `11-advancement/advancement-costs.json`: the XP costs.
3. The data files in the folders above, for the choices a player can make.

## Open items

- Champions Talents are transcribed in `talents.json` (111). Champions items named by subfaction bonuses (Glimmering, Kuraith, Venom of Nagendra) are not.
- Lumineth Great Nations Oultrai, Aurathrai, Helon and Alumnia are not transcribed.
- The Reforging Flaw table numbering (`10-subfactions/stormcast-and-sylvaneth.md`) is assumed row-major and should be checked against p. 57.
