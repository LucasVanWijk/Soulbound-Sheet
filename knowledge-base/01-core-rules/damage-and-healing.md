# Damage, Wounds, Mortal Wounds & Healing

Source: corebook pp. 150–154 (Damage, Wounds, Mortally Wounded, Death Test, Last Stand, Suffocation) and pp. 154–155 (Healing, Rest).

## Damage pipeline (p. 150)

1. The successful attack or effect deals Damage (weapon Damage + successes, or a spell/Talent/monster value).
2. Target reduces **Toughness** by `Damage − Armour`.
3. If Toughness is reduced to 0, any remaining Damage becomes **Wounds**.
4. If there is no space left on the Wound Track, the target is **Mortally Wounded**.
5. If Toughness is recovered, it must be reduced to 0 again before Wounds are suffered.

Armour reduces Damage. Attacks with **Ineffective** weapons: target's Armour is doubled and only Minor Wounds can be dealt (see `../09-equipment/`).

## Toughness (p. 151)

- Player characters: **Toughness = Body + Mind + Soul** (see `derived-stats.md`).
- Damage is subtracted from current Toughness.
- Most enemies have Toughness only, with no Wound Track. At 0 Toughness they die.
- Talents *Iron Will* and *Guts* can increase Toughness.

## Wounds (p. 151)

Only dealt once Toughness is at 0 (Damage that reaches 0 Toughness is dealt as Wounds).

| Wound | Triggered by (at 0 Toughness, from one source) | Spaces filled on Wound Track |
|---|---|---|
| **Minor** | 1 Damage | 1 |
| **Serious** | 2–4 Damage | 2 |
| **Deadly** | 5+ Damage | 3 |

### Wound Track size

- Total spaces = **(Body + Mind + Soul) ÷ 2, rounded up** (see `derived-stats.md`).
- **Duardin** gain **+2** spaces (Species bonus *Too Stubborn to Die*).
- Spaces are marked on the character sheet.

### Example (p. 151)
Troggoth deals 8 Damage to Darach (Natural Armour 2). He takes 6, Toughness goes 8 → 2. Next hit deals 6 → 4 after Armour; 2 reduces Toughness to 0; the remaining 2 becomes a **Serious Wound** (2 spaces).

Healing *Iron Will / Guts* talents are described in `../06-talents/`.

## Mortally Wounded (p. 152)

When a Wound will not fit on the track:

- Fill any remaining Wound spaces, and mark the **Mortally Wounded** box.
- Gain the **Stunned** Condition.
- **Cannot recover Toughness** while Mortally Wounded.
- At the start of your next turn, make a **Death Test**.

## Death Test (p. 152–153)

- Uses your **highest Attribute** (no Skill applies unless a Talent says so). Death Test is always **DN 4**.
- Complexity depends on the **severity of the Wound** that caused Mortal Wounding (the spaces left do not matter):

| Killing Wound | Death Test |
|---|---|
| Minor | DN 4:1 |
| Serious | DN 4:2 |
| Deadly | DN 4:3 |

### Results

- **Pass:** no longer Mortally Wounded; remove Stunned. Toughness stays at 0 and the Wound Track stays full, so any further Damage causes Mortal Wounding again.
- **Fail:** DN increases by 1 (never above 6). If the DN would go above 6, you **die**. Usually 3 failures = death.

### Damage while Mortally Wounded (p. 153)

- Each instance of Damage increases the **Complexity** of the Death Test by 1.
- If Complexity exceeds the dice pool, you **die immediately**.

### Getting help (p. 153)

Any of these ends Mortal Wounding (you are no longer Stunned):

- **Ally Mind (Medicine) Test**: ally within Close Range, uses an Action. DN = the Death Test's DN. Success: no longer Mortally Wounded, recover 1 Toughness.
- **Soulfire cheat death** (Binding member, Close Range, 1 Soulfire): no longer Mortally Wounded, recover **half** total Toughness. See `mettle-soulfire-doom.md`.
- **Aqua Ghyranis sphere** (Free Action, 100 drops): no longer Mortally Wounded, recover all Toughness, clear one Wound space. An ally within Close Range can administer it as an Action instead. See `../09-equipment/`.

## Last Stand (p. 154)

- Declared at the **start of your turn, before any Action**. Only when Mortally Wounded, before the Death Test.
- Effects:
  - Stop being Stunned and remove other Conditions.
  - Mettle refills to maximum.
  - Immune to all Damage, including environmental effects and Hazards.
  - Melee and Accuracy increase one step.
  - Your Damage (including spells and Miracles) ignores Armour.
- When your turn ends, you **die**. Instead of increasing Doom, the Binding's **Soulfire refills** to its new maximum.
- Stormcast Eternals can make a Last Stand too, and this refills the Binding's Soulfire.
- A character who fails the final Death Test cannot make a Last Stand (it is too late).

## Death (p. 154)

- Death happens when a Test's Difficulty would exceed 6, or when successes required exceed dice in the pool.
- Player character death: **Doom +1**. Roll a new character (see `../02-character-creation/`).

## Suffocation and Drowning (p. 152)

- Hold breath for **1 + Body minutes**.
- Once out of breath, choking, or denied air, survive **Body rounds**.
- At the start of your next turn after that, fill **all** Wound spaces and become **Mortally Wounded**.

## Healing and Rest (p. 154–155)

| Method | Time | Effect |
|---|---|---|
| **Take a Breather** | 10 minutes | Toughness returns to **maximum** |
| **Rest** | 8 hours (2 hours usable for a meal, study, hunting) | Toughness returns to **maximum**, and clear **one** Wound space |
| **Infirmary** (100D per night) | Rest | Clear **two** Wound spaces instead of one (see `../09-equipment/`) |
| **Between adventures** | End of downtime | Recover **all** Wounds |
| **Aqua Ghyranis** | Consumed | Drop: 1 Toughness. Phial: 10 Toughness and remove one Condition. Sphere: all Toughness, all Conditions, clear one Wound space (see `../09-equipment/`) |
| **Miracles and spells** | Varies | e.g. *Healing Spirit* restores Toughness. Check the spell or Miracle |
| **Soulfire (Recover Toughness)** | Action | Recover all Toughness. See `mettle-soulfire-doom.md` |

"Toughness returns to its maximum" (Rest) is the rule regardless of Wounds. Wounds only heal by Rest (one space), Infirmary, Aqua Ghyranis, or between adventures.
