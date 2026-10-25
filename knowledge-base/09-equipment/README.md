# Equipment, Currency & Trade

Source: Corebook Chapter 5, Equipment (pp. 99–122). Prices are in **D** (drops of Aqua Ghyranis). Machine-readable weapons, armour, devices, rigs and runes are in `equipment-data.json` in this folder.

---

## Currency: Aqua Ghyranis (p. 100)

| Unit | Value |
|---|---|
| Drop (1D) | One drop, usually measured with a pipette |
| Phial (1P) | About 10 drops (an inch-tall glass phial) |
| Sphere | 10 phials = **100 drops** (palm-sized orb) |

- Item costs are the average across the Cities of Sigmar and may fluctuate with location and who you deal with.
- Other currencies exist. Example: Glimmerings in Excelsis. Realmstone is traded by mages and nobles, and an ounce of pure realmstone is worth a handful of spheres to the right buyer.

### Consuming Aqua Ghyranis (healing, p. 100)

- **Drop:** restores **1 Toughness**.
- **Phial:** restores **10 Toughness** and removes **one Condition**.
- **Sphere:** restores **all Toughness**, removes **all Conditions**, and lets you clear **one space** on the Wound Track.

Spheres can also purify a Zone of Chaos taint or other unnatural force, or accelerate growth in a Zone as the *Lifebloom* spell (p. 278).

## Availability (p. 101)

| Rating | Meaning |
|---|---|
| **Common** | Readily available in all major cities; often found in minor settlements and outposts. |
| **Rare** | Found in a city if you know where to look or have a contact. Wait may be needed. Slim chance outside the Cities of Sigmar. |
| **Exotic** | Very hard to find. Usually needs a contact who has it shipped in. May be restricted or banned. |
| **Special** | Unique: one-of-a-kind, lost artefact, or divine gift. Almost impossible to buy. |

Availability can shift with location. The GM can raise an item's rarity one step (Common→Rare, Rare→Exotic) when it does not fit a character, such as Stormcast Eternals or Kurnoth Hunters (p. 104).

## Trade & Bartering (p. 101)

- Barter is usually roleplayed, with items of roughly equal value.
- An item in high demand may be worth **double or triple** its usual value.
- An unwanted or abundant item has its perceived value **halved**.

## Starting Equipment (p. 99)

- Starting weapons and armour come from the Archetype (`04-archetypes/`). Archetype descriptions such as "Sacrificial Dagger" have **no mechanical bearing**; they are just flavour for the listed item.
- During character creation, wealth from the Archetype can buy **Common and Rare** items at the listed price.
- Stormcast Eternals: add the **Sigmarite** Trait to their weapons and armour rather than listing duplicates. **All Sigmarite equipment has availability Special** (p. 102).

---

## Melee Weapons (p. 103)

`+S` = additional Damage equal to the successes on the attack. `1+S` = 1 Damage plus successes.

| Name | Cost | Avail. | Damage | Traits |
|---|---|---|---|---|
| Unarmed | — | N/A | +S | Ineffective |
| Improvised Weapon | — | N/A | +S | Ineffective, Crushing/Piercing/Slashing |
| Battleaxe | 135D | Common | 1+S | Slashing |
| Club | 8D | Common | +S | Crushing, Subtle |
| Dagger | 20D | Common | +S | Piercing, Subtle, Thrown (Short) |
| Finger Claws | 35D | Rare | +S | Piercing, Slashing, Subtle |
| Greataxe | 250D | Common | 2+S | Slashing, Two-handed |
| Greathammer | 260D | Common | 2+S | Crushing, Two-handed |
| Greatscythe | 280D | Rare | 1+S | Cleave, Slashing, Two-handed |
| Greatsword | 265D | Common | 2+S | Slashing, Two-handed |
| Halberd | 290D | Rare | 1+S | Piercing, Rend, Two-handed |
| Handaxe | 25D | Common | +S | Slashing, Subtle, Thrown (Short) |
| Hand Hammer | 22D | Common | +S | Crushing, Subtle, Thrown (Short) |
| Javelin | 45D | Common | +S | Piercing, Thrown (Medium) |
| Pick | 130D | Common | 1+S | Piercing |
| Pike | 190D | Common | 2+S | Piercing, Reach, Two-handed |
| Quarterstaff | 18D | Common | 1+S | Crushing, Two-handed |
| Runic Iron | 320D | Exotic | 1+S | Piercing, Rend |
| Spear | 180D | Common | 1+S | Piercing, Thrown (Short) |
| Sword | 150D | Common | 1+S | Slashing |
| Warhammer | 140D | Common | 1+S | Crushing |
| Whip | 120D | Rare | +S | Reach, Restraining, Slashing |

## Ranged Weapons (p. 103)

| Name | Cost | Avail. | Damage | Traits |
|---|---|---|---|---|
| Blunderbuss | 180D | Common | 2+S | Loud, Range (Medium), Piercing, Spread, Two-handed |
| Bow | 50D | Common | 1+S | Range (Long), Subtle, Piercing, Two-handed |
| Great Crossbow | 250D | Rare | 1+S | Penetrating, Piercing, Range (Long), Reload, Two-handed |
| Hand Cannon | 340D | Exotic | 2+S | Close, Loud, Piercing, Range (Short) |
| Hand Crossbow | 35D | Common | +S | Close, Piercing, Range (Medium) |
| Net | 45D | Common | — | Range (Short), Restraining |
| Pistol | 65D | Common | 1+S | Close, Loud, Piercing, Range (Medium) |
| Repeater Handbow | 60D | Common | +S | Close, Piercing, Range (Medium), Spread |
| Repeater Pistol | 95D | Rare | 1+S | Close, Loud, Piercing, Range (Medium), Spread |
| Rifle | 210D | Common | 2+S | Loud, Piercing, Range (Long), Two-handed |

Ammunition is **not tracked** by default. Optional costs: quiver of 20 arrows or case of 20 bolts 10D; 10 bullets 15D; horn of fingerbite gunpowder 40D.

---

## Armour & Shields (p. 104)

| Type | Cost | Avail. | Requirement | Benefit | Traits |
|---|---|---|---|---|---|
| Light | 120D | Common | — | 1 Armour | Subtle |
| Medium | 200D | Common | Body (2) | 2 Armour | — |
| Heavy | 350D | Rare | Body (4) | 3 Armour | Loud |
| Shield | 180D | Common | — | Defence increases one step | — |

- A shield needs **one free hand**.
- Wearing armour without its Requirement: your **Speed and Defence are each reduced one step**.
- Sylvaneth cannot wear armour; their natural Armour is covered in `03-species/`.
- Fyreslayers eschew armour (see Runes below).

---

## Weapon & Armour Traits (pp. 104–107)

| Trait | Rule |
|---|---|
| **Aetheric** | Powered by aether-gold. Almost exclusively Kharadron design (p. 110). |
| **Blast (X)** | Deals X Damage to every creature in the Zone when it detonates. |
| **Cleave** | Each **6** on the attack roll deals 1 Damage to all other enemies within Close Range. |
| **Close** | Ranged weapon can attack at Close Range **without** an Accuracy penalty. |
| **Crushing** | No effect alone; used by Talents such as *Crushing Blow*. |
| **Defensive** | Your **Defence increases one step** when using this weapon. |
| **Ineffective** | Improvised or unarmed. **Target's Armour is doubled**. You can only deal **Minor Wounds** with it. |
| **Loud** | Alerts everyone within Long Range when used to Attack. Armour with Loud gives **Disadvantage on Body (Stealth)**. |
| **Magical** | Unaffected by spells that transmute it (e.g. *Fool's Gold*). Useful against creatures resistant to mundane weapons. |
| **Penetrating** | Ignores **1 point of Armour**. |
| **Piercing** | No effect alone; used by Talents such as *Pierce Armour*. |
| **Range (X)** | Ranged attack using Body (Ballistic Skill). Range in brackets: Close, Short, Medium, Long. |
| **Reach** | Attacks any target in your Zone without moving. Works with *Opportunist*. |
| **Reload** | Requires an **Action** to reload. Ignored by *Quick Reload*. |
| **Rend** | Each **6** on the attack roll **permanently removes 1 Armour** from the target after the attack. The target still uses its full Armour when determining Damage from that attack. Armour damaged this way must be repaired. |
| **Restraining** | When Damage is dealt to a Large or smaller creature, it is **Restrained** until it uses an Action to free itself (unless stated otherwise). |
| **Sigmarite** | Unaffected by transmutation (*Fool's Gold*, *Searing Heat*). Sigmarite **armour cannot be Damaged by a Rend weapon** unless that weapon is also Magical. |
| **Slashing** | No effect alone; used by Talents such as *Sever*. |
| **Spread** | When attacking, every creature within Close Range of the target takes **half Damage**. A creature there with higher Defence than the target may make a **DN 4:1 Body (Reflexes)** Test, opposed by your attack roll, to avoid it. |
| **Subtle** | Easily concealed. Used with *Backstab*. Subtle armour can pass for everyday clothing. |
| **Thrown (X)** | Melee weapon can also be thrown as a ranged attack with range in brackets. |
| **Two-handed** | Requires both hands. |

---

## Adventuring Gear (pp. 106–109)

Items with special rules:

- **Acid (bottle), 55D, Rare:** Ranged attack at Medium Range. **3 Damage** to target, **1 Damage** to anyone within Close Range of it.
- **Apothecary's Satchel, 90D, Common:** 3 uses. Used with *Medic* (p. 87).
- **Aqshian Coal, 160D, Exotic:** lights one Zone. Heavily Obscured becomes Lightly Obscured; Lightly Obscured becomes well-lit.
- **Arcane Focus, 150D, Exotic:** lets a Human channel sorcerous powers into spells (orreries, lenses, masks, orbs, hourglasses, wands).
- **Bandolier, 12D, Common:** belt with about a dozen loops or compartments.
- **Celestial Wings, Special:** fitted to Sigmarite armour, granting a **Fly (Normal)** Speed. Gifted to Stormcast Eternals.
- **Climbing Gear, 185D, Rare:** **+2d6** to Tests to climb.
- **Crowbar, 4D, Common:** **+1d6** where the leverage applies.
- **Divination Plate, 210D, Rare:** runes glow brightly when genuine Aqua Ghyranis is placed on it, faintly or not at all if diluted or water.
- **Ethersea Cloak, Special:** land creatures breathe and move underwater as if on land; sea creatures "swim" through air. Works on a mount.
- **Grappling Hook, 20D, Common:** **+1d6** to climbing when secured.
- **Grimoire, 42D, Rare:** a spellcaster's notebook of arcane notes and formulae.
- **Holy Symbol, 25D, Common:** iconography used as a weapon by priests and holy-warriors.
- **Icon of Grimnir, Special:** Fyreslayer standard, carried by the Battlesmith. Only falls when no life is left in the Battlesmith.
- **Ironbark Oil (5 uses), 90D, Exotic:** Sylvaneth-only. Increases natural Armour by **1** for one day. One pot gives 5 applications.
- **Lock, 10D:** **DN 6:1 Body (Dexterity)** with lockpicks to unlock, or **DN 6:1 Body (Might)** to break.
- **Lockpicks, 25D:** Body (Dexterity) Test to unlock doors and locks.
- **Manacles, 80D:** creature is **Restrained** until freed. Break: **DN 6:2 Body (Might)**. Unlock: **DN 6:1 Body (Dexterity)** with lockpicks.
- **Poison (Basic, one dose), 55D:** Action to apply to a Piercing or Slashing weapon, or hide in food or drink. Target makes **DN 5:1 Body (Fortitude)** or is **Poisoned** for one day.
- **Sea-dragon Cloak, 260D, Exotic:** Defence **one step higher** against ranged attacks.
- **Sparker, 65D, Rare:** lights fires.
- **Spyglass, 110D, Rare:** **+1d6** to Awareness Tests to see faraway objects and creatures.
- **Waypipes, Special:** Sylvaneth instrument. Action: **Soul (Entertain)** Test:
  - **Walk the Spirit Paths (DN 4:1):** instantly appear at any point within Long Range, on solid ground.
  - **Stalk the Realmroots (DN 5:1):** disappear into the earth and become imperceptible. At the start of your next turn, appear anywhere within Medium Range. **Melee +1 step** on your next attack.
- **Rations (5 days), 15D:** dried meat, dried fruit, or saolbread.

### Full Adventuring Gear Price List (p. 108)

| Item | Cost | Avail. | Item | Cost | Avail. |
|---|---|---|---|---|---|
| Acid (bottle) | 55D | Rare | Ink (pot) | 18D | Common |
| Apothecary's Satchel (3 uses) | 90D | Common | Ironbark Oil (5 uses) | 90D | Exotic |
| Aqshian Coal | 160D | Exotic | Lantern | 25D | Common |
| Arcane Focus | 150D | Exotic | Lantern (storm) | 40D | Common |
| Backpack | 20D | Common | Lock | 10D | Common |
| Bandage | 2D | Common | Lockpicks | 25D | Common |
| Bandolier | 12D | Common | Magnifying Glass | 30D | Common |
| Barrel (empty) | 30D | Common | Manacles | 80D | Common |
| Bedroll | 10D | Common | Oil (1 litre) | 15D | Common |
| Bell | 3D | Common | Paper (10 sheets) | 2D | Common |
| Blanket | 4D | Common | Perfume | 30D | Rare |
| Book | 6D | Common | Pestle and Mortar | 22D | Common |
| Bottle (empty) | 2D | Common | Phial (empty) | 1D | Common |
| Candle | 1D | Common | Pipette | 5D | Common |
| Celestial Wings | N/A | Special | Poison (Basic, one dose) | 55D | Common |
| Chain (8-foot) | 50D | Common | Pouch (empty) | 2D | Common |
| Chalk | 1D | Common | Quill | 3D | Common |
| Chest (empty) | 80D | Common | Rations (5 days) | 15D | Common |
| Climbing Gear | 185D | Rare | Rope (50-foot) | 10D | Common |
| Cloak | 6D | Common | Saddlebags | 45D | Common |
| Cloak (heavy) | 14D | Common | Saw | 12D | Common |
| Clothes (common) | 9D | Common | Scroll Case (empty) | 8D | Common |
| Clothes (fine) | 30D | Rare | Sea-dragon Cloak | 260D | Exotic |
| Crowbar | 4D | Common | Shovel | 9D | Common |
| Cup | 1D | Common | Sling Bag (empty) | 15D | Common |
| Deck of Cards | 3D | Common | Smoking Pipe | 2D | Common |
| Dice | 2D | Common | Soap (bar) | 10D | Rare |
| Divination Plate | 210D | Rare | Sparker | 65D | Rare |
| Ethersea Cloak | N/A | Special | Spices | 40D | Rare |
| Flask (empty) | 7D | Common | Spike | 5D | Common |
| Glass Sphere (empty) | 2D | Common | Spyglass | 110D | Rare |
| Grappling Hook | 20D | Common | Tarp | 18D | Common |
| Grimoire | 42D | Rare | Tent | 85D | Common |
| Hammer | 3D | Common | Tongs | 10D | Common |
| Hip Flask (empty) | 4D | Common | Torch | 1D | Common |
| Holy Symbol | 25D | Common | Waterskin (full) | 25D | Common |
| Hourglass | 85D | Common | Waypipes | N/A | Special |
| Icon of Grimnir | N/A | Special | Whetstone | 60D | Common |

---

## Kharadron Equipment (pp. 110–116)

**Restriction (p. 110):** Only Kharadron characters can buy Kharadron equipment, and only if they find a supplier. A non-Kharadron buyer usually pays **three or four times** the listed price. The item is often "salvaged" with identifying marks removed, and the buyer will face awkward questions from other Kharadron.

### Aether-rigs (pp. 110–111)

- An Aether-rig's **Power Capacity** is the total Power Consumption its installed devices may not exceed.
- **Basic Aether-rig (350D, Exotic):** Power Capacity **6** (six power ingots). Provides **1 Armour**. Enough power for **one adventure** (about 3–5 sessions). After that, take the **Regular Maintenance Endeavour** (p. 158). If you do not, **Power Capacity decreases by 1**, and this continues between adventures until maintained.
- **Expanded Power Supply (250D, Exotic):** +1 Power Capacity. Maximum **two** per rig. Crafted with Aethercraft DN 5:6, 125D of materials.
- **Arkanaut Armour (220D, Exotic):** each piece grants **+1 Armour** when fitted to a rig and adds **+1 Power Consumption**.

### Aetheric Devices (pp. 112–116)

Power Consumption is what the device draws from the rig. "—" means it does not use rig power.

| Device | Cost | Power | Craft (Endeavour, DN, materials) | Damage | Traits / Notes |
|---|---|---|---|---|---|
| Aether-endrin | 600D | 1 | Endrineering DN 5:6, 300D | — | Grants **Fly (Normal)** Speed |
| Aetheric Grenade | 85D | — | Aethercraft DN 4:7, 45D | — | Aetheric, Blast (2), Loud, Range (Medium). Thrown; explodes after a few seconds |
| Aetheric Lenses | 250D | 1 | Aethercraft DN 5:5, 125D | — | Grants Witch-Sight (Talent); +1d6 to Mind (Awareness); see through solid surfaces up to 5 ft thick |
| Aethermatic Saw | 350D | 1 | Endrineering DN 4:6, 175D | 1+S | Aetheric, Loud, Rend, Slashing |
| Aethermatic Volley Gun | 800D | 2 | Endrineering DN 4:8, 400D | 2+S | Aetheric, Loud, Piercing, Range (Long), Spread, Two-handed |
| Aethermight Hammer | 680D | 1 | Endrineering DN 4:8, 340D | 3+S | **Requires Endrinharness**. Aetheric, Crushing, Loud, Two-handed |
| Arkanaut Armour | 220D | 1 per piece | Endrineering DN 4:6, 110D | — | +1 Armour per piece on a rig |
| Atmospheric Anatomiser | 340D | 1 | Aethercraft DN 4:7, 340D | — | **Aetheric Augmentation** (Action): golden vapour gives **+1 Damage** to all Aetheric weapons in your Zone for **3 rounds** |
| Atmospheric Isolation | 160D | 2 | Aethercraft DN 4:8, 80D | — | **Requires Anatomiser**. Action: Zone within Medium Range; each creature makes **Opposed Body (Fortitude)** vs your **Mind (Crafting)**. Failure = Damage equal to the difference, **ignores Armour** |
| Roar of Grungni | 180D | 2 | Aethercraft DN 4:9, 90D | — | **Requires Anatomiser**. As above, but failure also means **Prone** and **Poisoned** until the start of your next turn |
| Drill Launcher | 650D | 2 | Endrineering DN 4:13, 325D | 2+S | Ranged: Aetheric, Blast (2), Loud, Piercing, Range (Long), Reload, Two-handed. Bores in for 2+S, then explodes for **2 Damage** to everyone in the Zone (including the target). Melee: 2+S, Aetheric, Piercing, Two-handed. Without a drill head, it is an Improvised Weapon with Crushing |
| Replacement Drill Head | 110D | — | Endrineering DN 4:7, 55D | — | Must be replaced after every use of the Drill Launcher |
| Endrinharness | 500D | 2 | Endrineering DN 4:10, 250D | — | **+1 Body** when worn; required for the Aethermight Hammer |
| God's Eye | 410D | 2 | Endrineering DN 5:7, 205D | 1+S | Aetheric, Penetrating, Range (Medium). Helmet-mounted lens-array |
| Grapnel Launcher | 180D | 1 | Endrineering DN 4:6, 90D | +S | Aetheric, Loud, Range (Long), Restraining, Slashing, Two-handed. Automatic success on Climb when attached. Hit target is **Restrained**; you cannot attack with it while they are restrained |
| Heavy Instruments | 220D | 1 | Aethercraft DN 4:5, 110D | 1+S | Aetheric, Crushing. Detects harmful gases (used with the Anatomiser) |
| Quadbreather | 180D | 1 | Aethercraft DN 5:6, 90D | — | Immune to airborne poisons, toxins and illnesses. **DN 4:1 Mind (Awareness)** to detect aether-gold within 1,000 ft (direction; location within Medium or Short Range) |
| Rapid-fire Rivet Gun | 160D | 1 | Endrineering DN 4:6, 80D | 1+S | Aetheric, Loud, Piercing, Range (Medium), Spread |
| Skyhook | 210D | 1 | Endrineering DN 4:7, 105D | +S | Aetheric, Loud, Penetrating, Piercing, Range (Long), Two-handed. After it deals Damage, a **Free Action** recoils the cable: either pull yourself to Close Range of the target, or try to pull the target (**Opposed Body (Might)**). Success: target pulled to Close Range and **Prone**. Failure: you are pulled to Close Range of the target and **Prone** |
| Skymines | 160D | — | Aethercraft DN 4:8, 80D | — | Aetheric, Blast (4), Loud, Range (Short). Action to place or release. Explodes when a creature comes within Close Range, or at the start of a chosen round (1, 2 or 3 rounds) |
| Vulcaniser Pistol | 240D | 1 | Aethercraft DN 5:6, 120D | 1+S | Aetheric, Loud, Piercing, Range (Medium), Rend |

### Sample Aether-rigs (p. 116)

Typical loadouts for the Kharadron Archetypes in Chapter 3.

| Rig | Contents |
|---|---|
| **Aether-Khemist's Rig** | Basic Aether-rig; Aetheric Lenses; Atmospheric Anatomiser; Heavy Instruments; Quadbreather; choose *Atmospheric Isolation* **or** *Roar of Grungni*. |
| **Endrinmaster's Rig** | Basic Aether-rig; Aethermight Hammer; Arkanaut Armour; Endrinharness; God's Eye. |
| **Endrinrigger's Rig** | Basic Aether-rig; Aether-endrin; Aethermatic Saw; Arkanaut Armour; Rapid-fire Rivet Gun; choose *Aethermatic Volley Gun* **or** *Drill Launcher* (includes one replacement head). |
| **Skywarden's Rig** | Basic Aether-rig; Aether-endrin; Arkanaut Armour; Vulcaniser Pistol; choose *Grapnel Launcher* **or** *Skyhook*; choose *Aethermatic Volley Gun* **or** *Drill Launcher* (includes one replacement head). |

---

## Fyreslayer Ur-Gold Runes (pp. 117–118)

- Ur-gold runes are Grimnir's scattered power, forged by the Zharrgrim.
- **Active runes:** you may have a number of active runes equal to your **Soul**.
- Runes of the **same type are cumulative**.
- Runes are **awakened in battle** and activate when determining **Initiative**. You do not gain their benefit if **Surprised** (p. 135).
- Each rune remains active for **one adventure** (about 3–5 sessions), then becomes **inert** and its bonus is lost.
- Fyreslayers begin with a number of runes set by their Archetype. More can be added with the **Grundtogg** Endeavour (requires Smith's Tools).
- Fyreslayers eschew armour; wearing it would be unusual among their kind.

| Rune | Effect while active |
|---|---|
| **Rune of Awakened Steel** | Any weapon you wield has the **Rend** Trait. |
| **Rune of Farsight** | **Accuracy increases one step**. |
| **Rune of Fiery Determination** | **+1 space** on the Wound Track. |
| **Rune of Fury** | **Melee increases one step**. |
| **Rune of Iron Skin** | **Armour is 1**. Each active Rune of Iron Skin increases Armour by 1 (cumulative). No effect while wearing armour. |
| **Rune of Relentless Zeal** | **Initiative bonus equal to your Soul**. |
| **Rune of Searing Heat** | All your attacks deal **+1 Damage**. |

---

## Animals, Vehicles & Boats (p. 118)

| Name | Cost | Avail. |
|---|---|---|
| Aurochs | 800D | Rare |
| Barding (Armour 2) | 2,000D | Exotic |
| Bit and Bridle | 20D | Common |
| Cart | 140D | Common |
| Coach | 1,200D | Common |
| Coach, armoured | 3,500D | Exotic |
| Feed (per day) | 1D | Common |
| Horse, draught | 550D | Common |
| Horse, riding | 750D | Common |
| Horse, war | 3,000D | Rare |
| Mule | 200D | Common |
| Pony | 250D | Common |
| Row Boat | 450D | Common |
| Sailing Ship | 90,000D | Rare |
| Saddle | 200D | Common |
| Saddlebags | 45D | Common |
| Stabling (per day) | 6D | Common |
| Wagon | 380D | Common |

## Food, Drink & Lodging (p. 119)

| Item | Cost | Avail. |
|---|---|---|
| Ale: Barak-Thryng Dark Ale (Kharadron), pint | 10D | Rare |
| Ale: Bugman's XXXXXX (Kharadron), pint | 14D | Exotic |
| Ale: Grumgar Brothers Pale Ale (Kharadron), pint | 6D | Rare |
| Ale: Kezraak Stout (Kharadron), pint | 8D | Rare |
| Ale: Magmalt (Fyreslayers), pint | 8D | Exotic |
| Ale: Twin-tailed Ale, pint | 3D | Common |
| Bread, loaf | 2D | Common |
| Cheese hunk | 5D | Common |
| Meal, inn | 15D | Common |
| Meal, high-end | 40D | Rare |
| Soup | 3D | Common |
| Lodging: Cot in a bunkhouse (per night) | 10D | Common |
| Lodging: Inn, common room (per night) | 20D | Common |
| Lodging: Inn, private room, sleeps two (per night) | 80D | Common |
| Lodging: High-end private room, sleeps two (per night) | 200D | Rare |
| Spirits: Glass | 6D | Common |
| Spirits: Bottle | 55D | Common |
| Spirits: Duardin Amberwhisky, dram | 18D | Exotic |
| Wine: Glass | 5D | Rare |
| Wine: Bottle | 18D | Rare |

## Services (p. 120)

| Service | Cost | Avail. |
|---|---|---|
| Passage on a boat (per week): Hammock | 100D | Common |
| Passage on a boat (per week): Shared Cabin (sleeps four) | 250D | Common |
| Passage on a boat (per week): Private Room (sleeps two) | 500D | Rare |
| Coach: within a city | 10D | Common |
| Coach: to a nearby settlement | 500D | Rare |
| Coach: Armoured Coach (surcharge) | +500D | Exotic |
| Infirmary (per night) | 100D | Common |
| Passage on a Kharadron skyship (per week): Hammock | 500D | Common |
| Passage on a Kharadron skyship (per week): Shared Cabin (sleeps four) | 800D | Common |
| Passage on a Kharadron skyship (per week): Shared Cabin (sleeps two) | 2,000D | Exotic |

**Infirmary:** on finishing your Rest here, you recover **two Wound spaces** instead of one (p. 154).

## Hirelings (p. 120)

GM-controlled NPCs. They follow your direction unless it conflicts with their beliefs or the terms of agreement. Cost is per day. Skill notation: **(+Training dice, +Focus)**. Each Training adds 1d6; each Focus adds +1.

| Hireling | Cost/day | Avail. | Attributes (Body/Mind/Soul) | Skills | Talents | Notes |
|---|---|---|---|---|---|---|
| Cook | 140D | Common | 1 / 1 / 1 | Crafting (+1d6, +1), Nature (+1d6, +1) | A Warm Meal | Carries a week's ingredients |
| Hunter | 200D | Rare | 2 / 1 / 1 | Awareness, Ballistic Skill, Stealth, Survival (each +1d6, +1) | Hunter (choose terrain) | Fresh meat for up to 5 people a day |
| Medic | 180D | Common | 1 / 2 / 1 | Medicine (+2d6, +2) | Medic | Max two consecutive nights tending wounds before demanding rest |
| Mercenary Veteran | 180D | Rare | 2 / 1 / 1 | Weapon Skill (+2d6, +2) | Bulwark or Underdog | Carries a Common weapon and shield, or a Common two-handed weapon. Fyreslayer mercenaries demand equivalent gold |
| Scout | 240D | Rare | 1 / 2 / 1 | Awareness (+2d6, +2), Stealth (+2d6, +2) | Orientation | Inspects an area thoroughly before reporting back |

---

## Tools and Kits (p. 121)

| Name | Cost | Avail. | Required for |
|---|---|---|---|
| Cooking Utensils | 30D | Common | *A Warm Meal* Talent |
| Disguise Kit | 85D | Common | *Master of Disguise* Talent |
| Endrineer's Tools | 400D | Exotic | *Endrineering* Endeavour |
| Khemist's Kit | 550D | Exotic | *Aethercraft* Endeavour |
| Smith's Tools | 180D | Common | *Forge Ur-Gold Rune*, *Grundtogg*, *Repair Equipment* Endeavours |
| Surgical Instruments | 220D | Rare | Using with *Medic* reduces the Test's Complexity by 1 (p. 87) |

---

## Validation Rules (Equipment)

- Starting equipment comes from the Archetype's list (or freeform allowance).
- Stormcast Eternal weapons and armour carry the **Sigmarite** Trait; Sigmarite items are availability **Special**.
- Armour Requirements: Medium needs Body 2; Heavy needs Body 4. Failing one reduces Speed and Defence by one step.
- Shield: one free hand. Two-handed weapons occupy both hands.
- Kharadron devices: total installed **Power Consumption ≤ Power Capacity** of the rig.
- Fyreslayer active ur-gold runes ≤ Soul.
- Aqua Ghyranis: 1 phial = 10 drops; 1 sphere = 10 phials = 100 drops.
