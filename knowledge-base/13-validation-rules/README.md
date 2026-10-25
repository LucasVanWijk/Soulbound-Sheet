# Validation Rules

> **Scope for the app:** the app enforces only XP costs and caps (Attribute 1–8, Training and Focus 0–3). The other rules below are for the DM. The app records what the player enters, so these checks can be shown as warnings at most. See `11-advancement/README.md`.


Constraints a character sheet app should enforce. Each rule cites the source page. Rules from the Champions of Order and Steam and Steel supplements are marked **[supp]** and are added in `10-subfactions/` and the matching folders.

## Character creation

| ID | Rule | Source |
|---|---|---|
| V-CC-01 | Attribute ratings for player characters are **1–8**. | attributes.md; Advancement table (p. 41) |
| V-CC-02 | Before Step 3 you may swap the values of **two** Attributes, once. | 02-character-creation/attributes.md; p. 27 |
| V-CC-03 | Archetype-based creation: Attributes, Core Skill, Core Talent, Skills, Talents and equipment come from the Archetype. Freeform uses XP (35 XP default; Stormcast Eternal 40 XP). | 02-character-creation/README.md; p. 19–28 |
| V-CC-04 | Starting drops: 200 by default; Stormcast Eternal 100 drops. | p. 19 |
| V-CC-05 | Each Archetype's Core Skill starts at **Training 1 and Focus 1**. | Champions p. 19 [supp]; p. 28 |
| V-CC-06 | Each Species gets its Species Bonus (see below). | 03-species/README.md |
| V-CC-07 | Wealth from an Archetype may buy only **Common or Rare** items during creation. | p. 99 |

## Species

| ID | Rule | Source |
|---|---|---|
| V-SP-01 | **Human:** one extra Talent (Adaptable), any Talent the character qualifies for. Cannot take *Spellcasting* a second time with this bonus. | Species chapter |
| V-SP-02 | **Aelf:** +2 XP for Skills during creation (Long-Lived). That XP **must be spent on the same Skill**. | Species chapter |
| V-SP-03 | **Stormcast Eternal:** not one of the Binding for Soulfire purposes, so cannot spend Soulfire. Excluded from the Soulfire maximum. Can make a Last Stand, which refills the Binding's Soulfire. | pp. 131–134, 154 |
| V-SP-04 | **Stormcast Eternal:** Sigmarite Trait applies to all weapons and armour. Sigmarite items are availability **Special**. | p. 102 |
| V-SP-05 | **Duardin:** +2 Wound spaces (Species Bonus *Too Stubborn to Die*). | 03-species/README.md; p. 151 |
| V-SP-06 | **Sylvaneth:** cannot wear armour. Natural Armour 2. Ironbark Oil adds +1 for one day. | 03-species/README.md; p. 109 |
| V-SP-07 | **Kurnoth Hunter** and Stormcast Eternal sizes may make gear harder to find (GM may raise rarity one step). | p. 104 |

## Attributes, Skills and Talents

| ID | Rule | Source |
|---|---|---|
| V-AS-01 | Skill Training is **0–3**. Each level adds one die to the pool. | p. 123 |
| V-AS-02 | Skill Focus is **0–3**. Each level adds +1 to a die after rolling. | p. 123 |
| V-AS-03 | Training and Focus are bought separately, each up to 3. | p. 41 |
| V-AS-04 | Spellcasting requires **Training 1 and Focus 1 in Channelling**. | p. 28 |
| V-AS-05 | Talents marked with an asterisk have requirements that must be met. Talent requirements are in `06-talents/talents-list.md`. | Champions p. 19 [supp]; p. 83 |
| V-AS-06 | *Iron Will* requires Training 1 in Determination. *Guts* requires Training 1 in Fortitude. Other prerequisites are listed per Talent in the talent file. | 06-talents/talents-list.md |
| V-AS-07 | *Heroic Challenge* requires the Knight-Questor archetype. | 06-talents/talents-list.md |
| V-AS-08 | *Blessed* and *Spellcasting* are "Choose" Talents. The choice is stored with the Talent. | 06-talents/README.md |
| V-AS-09 | Skill and Talent XP costs: see the advancement table (Talent 2 XP). | 11-advancement/README.md |

## Derived values

| ID | Rule | Source |
|---|---|---|
| V-DV-01 | Melee = Body + Weapon Skill Training. Accuracy = Mind + Ballistic Skill Training. Defence = Body + Reflexes Training. | derived-stats.md |
| V-DV-02 | Toughness = Body + Mind + Soul. | p. 151 |
| V-DV-03 | Wound spaces = ceil((Body + Mind + Soul) ÷ 2), **+2 for Duardin**. | p. 151 |
| V-DV-04 | Initiative = Mind + Awareness Training + Reflexes Training. | derived-stats.md |
| V-DV-05 | Mettle maximum = ceil(Soul ÷ 2). Mettle regenerates 1 per turn up to the maximum. | p. 129 |
| V-DV-06 | Natural Awareness = ceil((Mind + Awareness Training) ÷ 2). | derived-stats.md |
| V-DV-07 | The Ladder ratings run Poor (1–2), Average, Good, Great, Superb, Extraordinary (11–12). | derived-stats.md |

## Combat and damage

| ID | Rule | Source |
|---|---|---|
| V-CB-01 | Attack DN: attacker's Melee or Accuracy compared with target's Defence. 2+ steps higher → DN 2; 1 higher → 3; equal → 4; 1 lower → 5; 2+ lower → 6. | p. 146 |
| V-CB-02 | Armour reduces each instance of Damage. Remaining Damage reduces Toughness. Damage beyond 0 Toughness becomes Wounds. | p. 150 |
| V-CB-03 | A Wound fills 1 (Minor, 1 Dmg), 2 (Serious, 2–4 Dmg) or 3 (Deadly, 5+ Dmg) spaces. | p. 151 |
| V-CB-04 | A Mortally Wounded character cannot recover Toughness. Death Test DN is 4, Complexity 1/2/3 by Wound severity. | p. 152 |
| V-CB-05 | Death Test failures raise DN by 1, max 6. A DN above 6 is death. | p. 153 |
| V-CB-06 | Damage taken while Mortally Wounded raises Death Test Complexity by 1. Complexity above dice pool is death. | p. 153 |
| V-CB-07 | Extra Actions cost 1 Mettle each. Surprise round: one Action only; no Double Training or Double Focus. | pp. 130, 135 |
| V-CB-08 | Double Training and Double Focus with Mettle are combat-only. | p. 130 |
| V-CB-09 | Flee: spend all Mettle, removes the character from Initiative, Doom +1. | p. 143 |
| V-CB-10 | Ranged attacks at Close Range without the Close trait: Accuracy −1 step. Beyond range: −1 per range beyond. | p. 147 |
| V-CB-11 | Ineffective weapons only deal Minor Wounds; the target's Armour is doubled. | p. 106 |
| V-CB-12 | Penetrating ignores 1 Armour. Rend removes 1 Armour per 6 rolled, permanently. | pp. 105–106 |
| V-CB-13 | Sigmarite armour cannot be damaged by Rend unless the weapon is Magical. | p. 106 |
| V-CB-14 | Movement: Speed reduced by one step in difficult terrain or while climbing, swimming, crawling, squeezing. Minimum Slow. | pp. 137–140 |

## Soulfire and Doom

| ID | Rule | Source |
|---|---|---|
| V-SF-01 | Maximum Soulfire = number of party members minus Stormcast Eternal members. | p. 133 |
| V-SF-02 | Soulfire can only be spent by Binding members (not Stormcast Eternals). | p. 131 |
| V-SF-03 | Spending Soulfire without the Binding's consent: Doom +1. | p. 131 |
| V-SF-04 | Maximum Soulfire increase refills Soulfire to the new maximum. | p. 133 |
| V-SF-05 | Doom starts at 1 and cannot go below 1. | p. 134 |

## Spells and Miracles

| ID | Rule | Source |
|---|---|---|
| V-SM-01 | Spell Complexity is 1–4 in the spell list. | 07-spells/spell-list.md |
| V-SM-02 | A caster may cast only **Common** spells and spells from **their chosen Lore(s)**. Each Spellcasting Talent grants one Lore. | 07-spells/README.md |
| V-SM-03 | Miracle god restriction: a character Blessed by one god may cast only that god's Miracles and the Universal Miracles. | 08-miracles/README.md |
| V-SM-04 | Overcast effects are optional extras, applied only when the caster Overcasts. | 07-spells/README.md |
| V-SM-05 | Spellcasting Talent: extra Lore XP follows the table (2nd Lore +2 XP … 8th Lore +8 XP). | 06-talents/README.md |
| V-SM-06 | Spell "Create Spell" Endeavour: Complexity equals the total cost of its Aspects. | p. 157 |

## Equipment

| ID | Rule | Source |
|---|---|---|
| V-EQ-01 | Armour Requirement: Medium needs Body 2, Heavy needs Body 4. Failing reduces Speed and Defence one step. | p. 104 |
| V-EQ-02 | Shield requires one free hand. Two-handed weapons occupy both hands. | pp. 103–104 |
| V-EQ-03 | Kharadron devices: total Power Consumption cannot exceed the rig's Power Capacity. | p. 110 |
| V-EQ-04 | Aether-rig Power Capacity max 2 Expanded Power Supplies (each +1). | p. 115 |
| V-EQ-05 | Kharadron equipment may only be bought by Kharadron characters. Non-Kharadron buyers pay 3–4× the price. | p. 110 |
| V-EQ-06 | Fyreslayer active ur-gold runes ≤ Soul. | p. 117 |
| V-EQ-08 | Aqua Ghyranis: 1 phial = 10 drops; 1 sphere = 10 phials = 100 drops. | p. 100 |

## Advancement

| ID | Rule | Source |
|---|---|---|
| V-AD-01 | Attribute raise costs: 1→2: 2 XP; 2→3: 5; 3→4: 7; 4→5: 9; 5→6: 11; 6→7: 13; 7→8: 15 (incremental). | 11-advancement/README.md |
| V-AD-02 | Skill Training and Focus costs: level 1: 1 XP; level 2: 2 XP; level 3: 4 XP (incremental). | 11-advancement/README.md |
| V-AD-03 | Each week of downtime allows one Endeavour, up to three per downtime. | p. 155 |
| V-AD-04 | Stormcast Eternal must spend their first Endeavour returning to their Stormhost. | p. 155 |
| V-AD-05 | Endeavour Tests cannot use Soulfire or Mettle to alter the dice or the result. | p. 156 |
| V-AD-06 | A Failed Endeavour Test: Keep Trying (extend up to 3 weeks), Abandon (sell at half value), or Finish It Later. | p. 156 |

## Sheet and data integrity

| ID | Rule |
|---|---|
| V-DT-01 | Each character sheet lists exactly the 24 Skills. |
| V-DT-02 | Every Talent, Miracle or Spell stored must exist in the knowledge base lists (`06-talents`, `08-miracles`, `07-spells`). Choice Talents must store the choice. |
| V-DT-03 | Derived values may be cached, but must be recalculated when Attributes, Skills, Species or Talents change. |
| V-DT-04 | Party sheet Doom is an integer ≥ 1. |
| V-DT-05 | Wounds are stored as a track of filled and empty spaces, and the Mortally Wounded flag is set when a Wound exceeds free spaces. |
