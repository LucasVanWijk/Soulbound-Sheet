# Character Creation

Source: Corebook Chapter 2 (pp. 19–44). Read this file first when building a character.

## Overview (8 Steps)

| Step | Name | Corebook page | Summary |
|---|---|---|---|
| 1 | Choose your Archetype | p. 20 | Pick an Archetype (23 total). It sets Species (or a choice), starting Attributes, Core Skill, Core Talent, Skill and Talent options, starting XP and starting equipment. |
| 2 | Attributes | p. 26 | Starting Attributes come from the Archetype. Optionally swap the values of **two** Attributes. |
| 3 | Skills and Talents | p. 27 | Spend the Archetype's XP on Training/Focus and Talents. Core Skill starts at Training 1 + Focus 1. |
| 4 | Equipment | p. 28 | Start with the Archetype's essential equipment and its listed drops of Aqua Ghyranis. |
| 5 | Adding Detail | p. 28 | Name, Physical Appearance, Goals (Short- and Long-term). |
| 6 | The Party | p. 34 | Short-term and Long-term Party Goals, Connections, and Party Soulfire/Doom. |
| 7 | Bringing Your Character to Life | p. 35 | Backstory: the "Ten Questions" (p. 36). Optional; no mechanical effects unless they change Attributes/Skills/Talents (GM agreement). |
| 8 | Finishing Touches | p. 38 | Calculate Melee, Accuracy, Defence, Armour, Toughness, Wounds, Natural Awareness, Initiative, Mettle. |

## Freeform Character Creation (alternative, p. 19 and p. 295)

Use only if the GM agrees, or for a character not listed as an Archetype.

- Body, Mind and Soul all begin at **1**.
- Choose **any Species**.
- You have **35 XP** to spend on Attributes, Skills and Talents.
  - **Stormcast Eternal:** instead begin with **40 XP**.
  - **Aelf:** the Species Bonus (+2 XP for Skills, same Skill) still applies.
- You can choose **two Common weapons**, or **a Common weapon and a shield**, and you can choose **Common Light or Medium Armour**.
- **Starting Aqua Ghyranis:** **200 drops** (default). **Stormcast Eternal: 100 drops** (their equipment also has the **Sigmarite** Trait).
- **Kharadron:** instead of choosing equipment, choose one of the sample rigs on p. 116.
- **Fyreslayer:** instead choose a number of **ur-gold runes equal to your Soul** (p. 117).
- Points-based character building is also described on p. 295.

## Archetype Stats Block (what each Archetype gives)

Each Archetype (see `04-archetypes/`) lists:
1. **Attributes**: Body / Mind / Soul starting values.
2. **Species**: a fixed Species or a choice.
3. **Core Skill**: starts at Training 1 + Focus 1.
4. **Core Talent**: starts with it.
5. **Skills** to choose from, with XP to spend on them.
6. **Talents** to choose from, with XP to spend on them.
7. **Equipment**: essential starting equipment.
8. **Aqua Ghyranis**: drops of currency.
9. **Experience Points (XP)** to spend at creation.

Standard creation rules:
- You **begin play with Training (1) and Focus (1) in your Archetype's Core Skill** (p. 45).
- **Humans** gain one extra Talent (Species Bonus, see `03-species/`).
- **Aelves** gain **2 extra XP** that must be spent on the same Skill.

## Choosing Attributes (Step 2)

- Start values come from the Archetype.
- You may **swap the values of two Attributes** before moving on. Example from p. 27: Isharann Soulscryer (B1 M2 S4) swapped Body and Soul to become B4 M2 S1.

## Skills and Talents (Step 3)

- Spend the Archetype's XP using the **Advancement costs** (see `11-advancement/README.md`).
- Each Skill is at **Untrained**, **Training 1–3**, and/or **Focus 1–3**. A Skill has a Training level and a Focus level independently.
- Talents have **prerequisites** (Attribute ratings, Skill levels, Species, Archetype or faction, equipment). Check the Talent list (`06-talents/`).
- Example (p. 28): to take *Spellcasting* you need Training and Focus in *Channelling*.

## Equipment (Step 4)

- Start with the Archetype's essential equipment. Additional gear is bought with **Aqua Ghyranis** (drops, spheres, phials).
- Currency and trade rules: `09-equipment/README.md`.

## Adding Detail (Step 5)

- **Name:** free choice. Name tables by Species (Human, Stormcast, Aelf, Duardin, Kharadron, Fyreslayer, Sylvaneth) are on pp. 29–30 and are optional.
- **Fyreslayers** choose only a forename and a **lodge name** (not a surname).
- **Sylvaneth** usually have a single name.
- **Physical Appearance:** age, height, eyes, hair, distinguishing features (optional random tables, pp. 30–32).
  - Ages: Human 3d6+15; Aelf 6d6×5; Duardin 4d6×5; Sylvaneth 1d6×1d6×1d6. Stormcast use the Human column for apparent age.
  - Heights (base + roll): Human 4'10" + 3d6"; Stormcast Eternal 6'8" + 3d6"; Aelf 5'10" + 2d6"; Duardin 4'1" + 2d6"; Branchwych / Tree-Revenant 5'4" + 2d6"; Kurnoth Hunter (3 + 2d6)' + 1d6". (Note: the book's text says Stormcast average 7'6" and Humans 5–6 ft; the table is authoritative for the rolled value.) Full tables: `appearance-tables.md`.
- **Goals:**
  - **Short-term Goal**: achievable in 1–3 sessions. Achieving it: **+1 XP**, then pick a new one at session end.
  - **Long-term Goal**: spans campaigns. Achieving it: **+10 XP**, then pick a new one at session end. Can **retire** the character (becomes NPC) and gain **half the total XP** of the current character for a new character.

## The Party (Step 6)

- **Party** = all characters incl. Stormcast Eternals. **Binding** = the Soulbound characters only (used for Soulfire).
- **Short-term Party Goal:** achieving it: each party member **+1 XP** and **recover 1 Soulfire**.
- **Long-term Party Goal:** achieving it: each party member **+10 XP** and **Total Soulfire refills to its maximum**.
- **Connections:** shared history with other party members. Random table on p. 36 (roll 1d6 × 1d6).
- **Soulfire** = number of members in the Binding (see `01-core-rules/soulfire-doom.md`).
- **Doom** begins at **1** (GM resource).
- A Soulbound may be retired from the Binding; see the advancement and retirement notes.

## Finishing Touches (Step 8): Derived Stats

See `01-core-rules/derived-stats.md` for the formulas and The Ladder table. Summary:

| Stat | Formula |
|---|---|
| Melee | Body + Training (Weapon Skill) → Ladder |
| Accuracy | Mind + Training (Ballistic Skill) → Ladder |
| Defence | Body + Training (Reflexes Skill) → Ladder; shields modify (one step) |
| Armour | from worn armour (Sylvaneth: natural Armour 2) |
| Toughness | Body + Mind + Soul |
| Wounds (max) | (Body + Mind + Soul) ÷ 2, rounded up; Duardin +2 |
| Natural Awareness | (Mind + Training Awareness) ÷ 2, rounded up |
| Initiative | Mind + Training Awareness + Training Reflexes |
| Mettle | Soul ÷ 2, rounded up |

## Worked Example (from the book, Vel Arturious, Knight-Questor)

- Attributes: Body 4, Mind 2, Soul 3. (The book's Toughness example uses Mind 1; the Wounds, Natural Awareness and Initiative examples use Mind 2. Treat Mind 2 as correct.)
- Weapon Skill Training 1 → Melee 5 (Good).
- Mind 2, no Ballistic → Accuracy 2 (Poor).
- Body 4, no Reflexes → Defence 4 (Average); sigmarite shield steps Defence up to Good.
- Questor Warplate → Armour 3.
- Toughness = 4 + 1 + 3 = 8.
- Wounds = (4 + 2 + 3) ÷ 2 = 4.5 → **5** spaces.
- Natural Awareness = (2 + 0) ÷ 2 = **1**.
- Initiative = 2 + 0 + 0 = **2**.
- Mettle = 3 ÷ 2 = 1.5 → **2**.

> Note: the worked examples in the book are not fully consistent with each other (e.g., Vel's Mind is quoted as 2 in some examples and 1 in the Toughness example). The formulas above are authoritative; the examples are illustrative.
