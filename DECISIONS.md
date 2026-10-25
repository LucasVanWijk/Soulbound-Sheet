# Decisions and open items

Calls made while building, for the owner to review.

## Rules data
- **Archetypes** come from `knowledge-base/04-archetypes/*.md` through `app/scripts/parse-archetypes.mjs` (`npm run data:archetypes` writes `app/src/data/archetypes.generated.json`). A test fails if the committed JSON is stale or a Talent/Skill name does not resolve.
- The archetype file spells "Silver Tongued"; the Talent list has "Silver Tongue". An alias in `data/kb.ts` joins them.
- **Creation budget.** The designs show a few "tweaks" on prefilled Skills. The data has no prefilled Skills, only a Skill XP budget and a list of allowed Skills, so Step 2 spends that XP (1/2/4 per level) on the archetype's list. The Core Skill is locked at 1/1. Aelf get +2 XP that must go on one Skill (shown as a second counter). Next stays disabled until every point is spent. One optional Attribute swap.
- **Spellcasting at creation:** Arcane Bolt, Mystic Shield, plus 4 spells from Common or the chosen Lore (from `07-spells/README.md`). Blessed: one first Miracle from Universal or the god's list. "Any Miracles of X" on an archetype counts as one of its Talent picks.
- **Human Adaptable:** one free pick from any Talent. Not checked against prerequisites.
- **Spells/Miracles bought later:** buying Spellcasting or Blessed later with XP does not add spells; add them under Inventory (the GM decides). Extra Miracles cost 2 XP in Spend XP.
- **Derived effects applied:** Duardin +2 Wounds, Sylvaneth Armour 2, worn armour, worn shield (+1 Defence step), Combat Ready (+2 Initiative each), Guts / Iron Will (+Toughness per Training), Observant (+1 Natural Awareness), Soul-Scarred. Conditional Talents (Bulwark, Underdog and so on) are text only.
- **Not done:** Stormcast Reforged roll, subfaction picker and bonuses (the designs have no subfaction step), ur-gold rune and Kharadron rig contents (a rig is one gear item whose notes list its parts), Soulfire/Doom (left out on purpose).
- Starting gear is parsed from prose. "Choose one" uses the source's bold "or". "Any Common melee weapon" gives a weapon picker. Odd lines (runes, "one piece of Rare equipment") become plain gear items.

## App
- **Own character schema.** The sheet uses the model from `CLAUDE.md` (typed wounds, XP ledger, notes), not `character-sheet.schema.json`, which stores wounds as booleans and has no notes list. Export files carry `schemaVersion: 1`; an adapter to the KB schema can be added later.
- **Routing** is hash-based (`#/c/<id>/inventory`) so GitHub Pages needs no rewrites; `base` is `./`, which works under `/Soulbound-Sheet/`.
- Import never overwrites silently: a clash offers Replace or Keep both.
- Undo last purchase is in the XP log. Mettle and Toughness current values are stored; totals are derived.
- Figures use lining numerals (Cormorant's default old-style 0 reads as "o").
- The bundle is ~640 kB (173 kB gzip) because the rules JSON is bundled; code-splitting is a later option.
