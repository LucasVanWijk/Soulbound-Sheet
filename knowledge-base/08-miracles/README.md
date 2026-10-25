# 08 — Miracles

Sources: Corebook pp. 93–98 (30 Miracles: 5 Universal, 5 each for Alarielle, The Ethersea, Grimnir, Khaine and Sigmar). Champions of Order pp. 87 (4 Miracles of Grungni) and 91–92 (10 Miracles of Teclis). Data: `miracles.json` (44 Miracles). Each entry's `book` field gives its source.

## For the app

- The Blessed Talent (Training 1 and Focus 1 in Devotion, 2 XP) gives the first Miracle. Choose it from the Universal list or the chosen god's list. Grungni and Teclis are the Champions gods, and their Miracles need Blessed (Grungni) or Blessed (Teclis).
- Each further Miracle costs 2 XP.
- Each Miracle has `mettleCost` (Mettle spent to use it; 0 if none), `target`, `range`, `duration` and `effect`.
- `mettleCost` is 0 where the book gives no Cost line. Sustained Miracles also let you spend 1 Mettle on your turn to keep them going; the effect text lists this.
- Using a Miracle takes a Use a Talent Action (Corebook p. 145). The app records the action; it does not run the combat round.

## Files

- `miracles.json`: machine-readable list.
