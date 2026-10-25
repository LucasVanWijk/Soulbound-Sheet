# 11 — Advancement (XP Costs and Leveling)

Source: Corebook p. 41 (cost tables), pp. 89–93 (Talent and Lore costs, Miracles), Talents p. 82 (2 XP each).
Machine-readable costs: `advancement-costs.json`. Worked-example check: Marie's 14 XP spend on p. 41 (banks 1) reproduces with these costs.

## What the app does

The app records XP and charges it when the player buys a level. It does **not** check prerequisites or max levels for Talents, Lores or Miracles. The DM checks those. The app enforces:

- **XP cost** of each purchase, from `advancement-costs.json`.
- **Caps:** Attributes 1–8; Training and Focus each 0–3.
- **Balance:** XP spent cannot exceed XP total. Unspent XP is `total − spent`.

Every purchase is written to `xp.ledger` in the character sheet, so the player (or DM) can see history and undo the latest purchase.

## Costs

| Purchase | Cost |
|---|---|
| Attribute 1→2 / 2→3 / 3→4 / 4→5 / 5→6 / 6→7 / 7→8 | 2 / 5 / 7 / 9 / 11 / 13 / 15 XP (incremental) |
| Skill Training 0→1 / 1→2 / 2→3 | 1 / 2 / 4 XP (incremental) |
| Skill Focus 0→1 / 1→2 / 2→3 | 1 / 2 / 4 XP (incremental) |
| Talent (any) | 2 XP |
| Additional Lore (on top of the Spellcasting Talent) | +2 (2nd), +3 (3rd), +4 (4th), +5 (5th), +6 (6th, Mind 6), +7 (7th, Mind 7), +8 (8th, Mind 8) |
| Miracle (after the first, which comes with Blessed) | 2 XP |
| Spells | No XP cost. The Spellcasting Talent gives the first spell of its Lore. Other spells come through Endeavours (DM-run). |

Training and Focus are bought separately. A Focus can be bought without Training in that Skill (book p. 41).

## Cost calculation

- Attribute: the cost to go from M to N is the sum of the incremental steps from M+1 to N (the table's Total column gives the cumulative cost from 1).
- Skill: the same, using the Training or Focus column for that Skill.
- Talent: 2 XP, plus the extra Lore cost if it is a second, third, … Spellcasting.

## XP sources

The GM awards XP for Goals (personal Short-term +1, Long-term +10; party Short-term +1 each, Long-term +10 each). The app records the total the GM gives. The app does not calculate Goals.

## Not in the app

- Retirement and bonus starting XP (Experienced Heroes): the DM handles these.
- Downtime (Endeavours and Between Adventures): the DM runs these. The player adds the result to the sheet (items to inventory, a spell to the spell list, a Talent to the Talent list).
- Attribute swap at creation: the player just enters the final values.

## After any change

Recalculate derived stats from `01-core-rules/derived-stats.md` (Toughness, Wound spaces, Mettle, Initiative, Natural Awareness, Melee, Accuracy, Defence).

## Files

- `advancement-costs.json`: all costs and caps.
- `_excluded/endeavours.md` (outside the app handoff): downtime rules, kept for the DM.
