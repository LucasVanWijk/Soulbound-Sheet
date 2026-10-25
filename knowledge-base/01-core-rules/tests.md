# Tests

## Notation

`DN X:Y Attribute (Skill)` — X = **Difficulty**, Y = **Complexity**.
Example: `DN 4:2 Body (Dexterity)`, `DN 3:4 Mind (Channelling)`.
Attack Tests list no Complexity; their successes are used for Damage instead (see `combat.md`).

## Dice pool

`Dice pool = Attribute score + level of Training in the Skill`.

- Each **Training** level adds **1 die** (Training 1 = +1d6, Training 2 = +2d6 …; the book reads "one die per level").
- Each **Focus** level lets you add **+1 to a die after it has been rolled** (Focus 2 = up to +2 total, which you may split across dice or put on one die).
- Attributes and Skills are not fixed pairs. GM and players may mix them as the situation requires. Common pairs: Body (Might) and Mind (Awareness).
- Other bonuses from spells, Talents or Equipment may modify the pool.

## Successes

- Each die that **equals or exceeds the Difficulty** counts as a **success**.
- Total successes **≥ Complexity** → Test passed.
- Fewer than Complexity (including zero) → failed.

## Degrees of success (p. 128–129)

| Successes vs DN | Result | Benefit |
|---|---|---|
| Equal to Complexity | **Pass** | Task completed, no more, no less |
| 1–2 more than Complexity | **Minor Benefit** | Completed with flair, extra information, or a bonus die on a future related Test |
| 3+ more than Complexity | **Major Benefit** | Much quicker, uncovers secret information, or a bonus die on related Tests for 24 hours |

GM decides the benefit.

## Difficulty reference (p. 125)

| DN | Difficulty | Example |
|---|---|---|
| 2:1 | Very Easy | Climbing onto a wall |
| 3:1 | Easy | — |
| 4:1 | Average | Climbing a rocky outcropping |
| 5:1 | Hard | Climbing a rocky outcropping in a storm |
| 6:1 | Very Hard | Scaling smooth glass; climbing a tree |

- Complexity reflects the number of successes needed; use it for multi-part or time-consuming tasks.
- A Test can have high Complexity and low Difficulty (searching a cluttered room).
- Advice for setting Difficulty against dice pools is on p. 290.

## Common Tests

Immediate tasks not directly opposed. GM states the Attribute, Skill, Difficulty and Complexity. Roll dice pool, count successes, compare with Complexity.

## Opposed Tests

- Both sides roll against a DN set by the GM. **Default DN is 4:1**.
- Most successes wins. **Tie: the defender wins**, or the Test is rolled again.
- Opponent's Difficulty can be modified by Advantage or Disadvantage (below).

## Advantage and Disadvantage (p. 126)

| Situation | Effect |
|---|---|
| Advantage | Difficulty **−1** (e.g. 4 → 3) |
| Disadvantage | Difficulty **+1** (e.g. 4 → 5) |
| Greater Advantage | Difficulty **−2** |
| Greater Disadvantage | Difficulty **+2** |

- Extreme opposed Tests may start at **DN 6:1**. If a participant has Disadvantage, Difficulty cannot go above 6; instead Complexity increases (6:2).
- Advantage and Disadvantage often come together but may also apply to only one party (slippery ground, partial blindness, high ground, right equipment).
- Cover gives Advantage to hide (see `combat.md`).

## Automatic success (p. 127)

- If there is no time pressure and no penalty for failure, you may allow an automatic success.
- Or: compute **Difficulty × Complexity**. If the character's dice pool is greater than that total, they automatically succeed.

## Natural Awareness (p. 127)

Used when characters are in opposition without realising it (sneaking past an unaware creature, lying).

- Natural Awareness = **total dice of the opponent's Opposed Test, divided by 2, rounded up**.
- That value becomes the **Complexity**. Difficulty is set by circumstances (Advantage/Disadvantage applied as usual).
- Creatures in the bestiary list their Natural Awareness.
- Example: Magmadroth with Mind (1) and Training (2) in Awareness: pool 3, ÷2 round up = 2. Sneak test: `DN 4:2 Body (Stealth)`.
- Passive knowledge Skills (Arcana, Lore, Nature, Theology) and natural Intuition can also be used this way.

## Extended Tests (p. 128–129)

Used for tasks that take days, weeks or months (crafting a device, research, training, intrigue).

Setup (GM decides):
1. **Time required.**
2. **Total successes needed** (usually 10–20) and **number of attempts** allowed. Failure after all attempts.
3. **Frequency** of attempts (hourly, daily, weekly, monthly).
4. **Skills** involved; more than one may be used across attempts.
5. **Other factors** (resources consumed, population, favours needed).
6. **Difficulty and Complexity.** Rule of thumb: successes required ÷ attempts allowed = average successes needed per attempt.

Successes accumulate across attempts. On failure, resources consumed are lost and penalties may apply.

Extended Tests are used by many Endeavours (`../11-advancement/endeavours.md`). Each Endeavour states its own DN and attempt count, which is usually 3 Tests per week.

## Group Tests

Optional rules on p. 297 (not included here).

## Rolling guidance

Consider not calling for a roll when there is no memorable outcome either way. Avoid "Gotcha!" rolls for competent characters (p. 124).
