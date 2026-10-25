# Derived Stats & The Ladder

Source: Corebook pp. 38–42 (character creation Step 8), pp. 145–151 (combat, referenced).

## The Ladder

Many derived values (Melee, Accuracy, Defence) are converted to a **word rating** using The Ladder.

| Total | Rating | Meaning |
|---|---|---|
| 1–2 | Poor | Inexperienced or particularly inept |
| 3–4 | Average | Some training or natural affinity |
| 5–6 | Good | Well trained, natural gift |
| 7–8 | Great | Excel at the task |
| 9–10 | Superb | Few can match |
| 11–12 | Extraordinary | Almost supernatural talent |

Ladder steps (used for modifiers): a shield "increases Defence by one step" (Average → Good in the example).
Ladder above Extraordinary: not defined in the core book; treat as "Extraordinary" for display and use the numeric total for DN comparisons.

## Derived Stat Formulas

| Stat | Formula | Ladder? | Notes |
|---|---|---|---|
| **Melee** | Body + Training (Weapon Skill) | Yes | Compared to target's Defence to set attack DN. Evenly matched = DN 4. |
| **Accuracy** | Mind + Training (Ballistic Skill) | Yes | Ranged attacks. Compared to Defence. Evenly matched = DN 4. |
| **Defence** | Body + Training (Reflexes Skill) | Yes | Used by GM as the DN basis for attacks made against you. Shields and some equipment modify Defence (in Ladder steps). |
| **Armour** | From worn armour (see `09-equipment`) | No | Reduces Damage taken each time you are hit. Sylvaneth: base 2 (natural). Some Talents/spells change it; certain weapons ignore or break armour. |
| **Toughness** | Body + Mind + Soul | No | Damage absorbed before Wounds are suffered. Not divided by 2 (unlike Wounds). |
| **Wounds (max)** | (Body + Mind + Soul) ÷ 2, **rounded up** | No | Number of spaces on the Wound Track. Duardin +2 (Species Bonus). Most starting characters have ~4. |
| **Natural Awareness** | (Mind + Training Awareness) ÷ 2, **rounded up** | No | "Assumed successes" on a typical Mind (Awareness) Test. Also sets Complexity for those sneaking past. |
| **Initiative** | Mind + Training (Awareness) + Training (Reflexes) | No | Highest acts first in combat. Variant rules p. 298. |
| **Mettle** | Soul ÷ 2, **rounded up** | No | Finite resource: fuels Miracles and extra actions in combat. |

## Character Sheet Tracking Conventions

- The book suggests marking the starting ability with a tick and any temporary change with a cross.
- Wound Track: leave `max Wounds` spaces free and shade the rest. As Wounds are taken, fill spaces. When all spaces are filled and another Wound is taken, the character becomes **Mortally Wounded** (see `01-core-rules/damage-and-healing.md`).

## Worked Example (Vel Arturious, Knight-Questor)

Body 4, Mind 2, Soul 3, Weapon Training 1, no Ballistic/Reflexes/Awareness Training, wearing Questor Warplate (Armour 3), carrying a sigmarite shield.

- Melee = 4 + 1 = **5 → Good**
- Accuracy = 2 + 0 = **2 → Poor**
- Defence = 4 + 0 = **4 → Average**; shield +1 step → **Good**
- Armour = **3**
- Toughness = 4 + 2 + 3 = **9**. *(Book's Toughness example uses Mind 1 = 8; the Mind 2 figure is used here because all other examples use Mind 2.)*
- Wounds = (4 + 2 + 3) ÷ 2 = 4.5 → **5**
- Natural Awareness = (2 + 0) ÷ 2 = **1**
- Initiative = 2 + 0 + 0 = **2**
- Mettle = 3 ÷ 2 = 1.5 → **2**
