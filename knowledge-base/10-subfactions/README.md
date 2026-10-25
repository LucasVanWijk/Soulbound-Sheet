# 10 — Subfactions

Sources: Champions of Order pp. 19, 20–67 (subfaction bonuses). Data: `subfactions.json` (55 bonuses).

## For the app

- The player picks one subfaction after the Archetype. The bonus is added to the Talents list as a feat (Champions p. 19).
- Each entry has `faction`, `name`, `bonusName`, `bonus` (the mechanical text), and flags:
  - `referencesDowntime`: the bonus uses an Endeavour (DM-run). The app applies the mechanic but the DM handles the Endeavour.
  - `referencesActions`: the bonus uses a Corebook Action (Seize the Initiative, p. 144).
  - `referencesChampionsItems`: the bonus names a Champions item (Glimmering, Kuraith, Venom of Nagendra). These items are not transcribed yet.
  - Talents the bonus relies on (A Good Plan, Stirring Voice, Thoughtful, Old Enemy, Industrious, Ur-gold Mastery) are in `talents.json`.
- If a subfaction is not in the book, or the GM allows another, the player takes a suitable Talent or the GM grants 2 XP.

## Coverage

Included: Lumineth Realm-lords (Iliatha, Syar, Ymetrica, Zaitrec), Free Peoples (10 cities), Daughters of Khaine (6), Fyreslayer lodges (8), Idoneth Deepkin (6), Kharadron Overlords (6 sky-ports), Stormcast Eternals (8 Stormhosts), Sylvaneth (7 glades).

Not yet included: Lumineth Oultrai, Aurathrai, Helon and Alumnia (Champions pp. 20–23), and the Champions items above.

## Files

- `subfactions.json`: machine-readable list.
- `kharadron-sky-ports.md`, `stormcast-and-sylvaneth.md`: readable source text with the Reforging Flaw table and the Knight-Zephyros archetype.

## Rules for subfactions (Champions p. 19)

- After choosing an Archetype (and so the faction), choose a **subfaction**. Each faction has **4–8** subfactions.
- Mark the subfaction bonus in the Talents section of the sheet.
- If the GM allows a subfaction not in the book, take a suitable Talent instead, or the GM grants **2 XP** during creation.

## Factions (Corebook pp. 186–200)

| Faction | Core Species | Corebook page | Summary |
|---|---|---|---|
| Collegiate Arcane | Human | 187 | Loose alliance of mages in floating towers. Ruled by a council of senior mages. |
| Darkling Covens | Aelf | 188 | Matriarchal cults under Sorceresses. Warriors: Black Guard and Executioners. |
| Daughters of Khaine | Aelf | 189 | Blood-cult of Khaine under Morathi. Male Aelves are leathanam slaves. |
| Devoted of Sigmar | Human | 190 | Azyrite church and the Order of Azyr. |
| Free Peoples | Human, Duardin, Aelf | 191 | Cities of Sigmar and their cultures. Conclaves govern the free cities. |
| Fyreslayers | Duardin | 192 | Lodges pursuing ur-gold. Patrilineal. Mercenaries who keep oaths. |
| Idoneth Deepkin | Aelf | 193 | Undersea enclaves. Isharann (mages), Akhelian (warriors), Namarti (labourers). |
| Kharadron Overlords | Duardin | 194 | Sky-faring merchants. Admiral councils, guilds, the Kharadron Code. |
| Scourge Privateers | Aelf | 195 | Corsairs of port cities. Black Arks. Mercenary. |
| Stormcast Eternals | Stormcast | 196 | Reforged warriors of Sigmar. Stormhosts, Chambers, Conclaves, Retinues. |
| Sylvaneth | Sylvaneth | 197 | Children of Alarielle. Glades. Spirit-Song. |
| The Great Parch (region) | — | 198–200 | Aqshy. Folk of Flame. |

Other factions (p. 186): Dispossessed, Freeguild, Ironweld Arsenal, Seraphon, Wanderers.

Species to faction (Corebook):
- Human: Collegiate Arcane, Devoted of Sigmar, Free Peoples.
- Aelf: Darkling Covens, Daughters of Khaine, Idoneth Deepkin, Scourge Privateers, Free Peoples.
- Duardin: Fyreslayers, Kharadron Overlords, Free Peoples, Dispossessed.
- Stormcast Eternal: Stormcast Eternals.
- Sylvaneth: Sylvaneth.
