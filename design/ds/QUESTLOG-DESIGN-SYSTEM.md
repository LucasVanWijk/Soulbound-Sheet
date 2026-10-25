Questlog is a parchment quest log for everyday life: quests on an Eisenhower board, campaigns, a Glossary of people and things worth remembering, and Expeditions to spend the gold you earn. The look is the **Classical** system (Cormorant Garamond over Lora, one OKLCH-tuned amber ramp) warmed to parchment, with two added inks: **wax red** and **forest green**. Keep it calm and dense. Hairline rules and small uppercase kickers do the organising. The fantasy comes from the materials (paper, wax, wood, ink), never from ornament.

## Principles

- **Paper, not glass.** Every surface is `q-parch` or a translucent wash of the amber ramp over it. Separate things with a `q-rule` hairline, not a shadow. Shadows (`shadow-md`, `shadow-lg`) are kept for things that physically lift off the page: notes pinned to the board, toasts, sheets.
- **Three inks with fixed jobs.** Amber-brown (`color-accent-700`/`800`/`900`) for reading and navigating. `q-wax` for reward, urgency and danger. `q-moss` for done. Don't add more hues to the interface. The quadrant and calendar colours are data colours, used only for their category.
- **Dense and tabular.** The body is 15px, meta lines 12px, kickers 11px. Numbers (XP, gold, counts, dates, the battle log) use `font-variant-numeric: tabular-nums` (`.tnum`). Rows are 44–52px tap targets divided by hairlines, not cards with gaps.
- **Two typefaces, two jobs.** Cormorant Garamond (`--font-heading`) at 600 for anything you click or scan: titles, buttons, nav, numbers in the week strip. Lora (`--font-body`) for reading, meta and labels. 600 is the ceiling: bold was retired.

## Content fundamentals

- **The world's nouns, plain verbs.** Tasks are *Quests*, projects are *Campaigns*, people are *Companions*. Notes live in *Tomes* and the *Codex*, inside the *Glossary*. The idle game is *Expeditions*. Rewards are *XP* and *gold*. Buttons stay ordinary: “Add”, “Cancel”, “Reopen”, “Check in”, “Export backup”.
- **Title Case for names, sentence case for everything else.** “Main Quests”, “Side Quests”, “Today's Quests”, “Up next”. Messages are short and past tense: “Quest complete”, “Backup saved”, “Completed today”.
- **Second person, implied.** Speak to the player without saying “you” where you can (“Back up your log.” is fine). Ranks rise with level: Wanderer, Squire, Adventurer, Ranger, Knight, Champion, Hero, Legend.
- **No emoji.** Use Lucide icons and the drawn marks (dot, diamond, seal) instead. Empty states are one italic `muted` line: *No quests here yet.*
- **Kickers** are uppercase, 11px, letter-spaced (`kicker-text` style, `color-accent-700`), sitting above a Cormorant title: `TODAY'S QUESTS` / **Quests**.

## Color

- Ground: `q-parch` on the page, sheets and notes, with two very soft radial highlights on the app shell. Washes are `color-accent-100` at 45–60% for panels and inputs, and `color-accent-200` at 22–25% for the sidebar and board columns.
- Text: `q-ink` for body and titles. `color-accent-800` for muted and meta text. `color-accent-700` for kickers, labels, links and nav. Never set text in `color-accent-600` or lighter, or in `color-accent`: they fail on parchment. Classical's `.btn-primary` uses `color-accent`, so on parchment always add `.inked` (it switches to `color-accent-700`).
- Wax: `q-wax` for the seal, the FAB, the active tab marker, today's date, Crisis, overdue dates and destructive actions. Paint wax as a radial gradient `q-wax-hi` → `q-wax` with an inner `q-wax` ring and a faint cream ring. Light text on it is `color-accent-100`.
- Moss: `q-moss` means done: checked boxes, the Complete button, done banners, habit dots, size S.
- Selection: `q-tint` fill plus a `color-accent-700` border for a pressed chip, the current nav item, or a selected day or option.
- Quadrants: Crisis `zone-crisis`, Main Quests `zone-main`, Errands `zone-errand`, Side Quests `zone-side`. On the dark wood board use the `-light` variant for the zone head and its 3px top border.
- Calendar kinds always pair a colour with a shape: event ● `cal-event`, quest deadline ■ `cal-deadline`, birthday ▲ `cal-birthday`, Glossary date ◆ `cal-glossary`. Birthday and Glossary colours are for markers only, never text.
- Focus: Classical's `:focus-visible` ring is 2px `color-accent` with a 2px offset (3.0:1 on parchment: just enough for a ring).

## Type

- Set screen titles in `screen-title` (34px), card and note titles in `title-card` (17px) and buttons in `button-text` (14px), all Cormorant 600.
- Set reading text in `body` (Lora 15/1.55), meta in `meta-text` (12px, `color-accent-800`, tabular) and kickers and labels in `kicker-text`/`label-text` (11px uppercase, `color-accent-700`).
- Headings use −0.015em tracking. Uppercase labels open up to 0.14–0.16em.

## Space, radius, elevation

- Spacing is a 4.6px step (`space-1`…`space-8`): keep the odd value, it's deliberate. Component internals use exact pixel values from the source (rows 44–58px tall, 36px icon buttons).
- `radius-md` (4px) is the default for buttons, inputs, panels and chips. `radius-sm` (2px) is for paper: quest notes, tile notes and calendar chips. `radius-lg` (7px) is for dialogs. Exceptions: the bottom sheet's 16px top corners, the 28px pill FAB, and circles for seals, portraits and size dots.
- `shadow-sm` is for campaign cards, `shadow-md` for toasts, menus and the wood board, and `shadow-lg` for sheets and dialogs only.

## Materials

- **Seal.** A wax disc (`.seal`) for the brand mark, Complete and today. One glyph inside, in `color-accent-100`.
- **Pin.** A 10–12px wax bead (`.pin`) holding a note to the board.
- **Framed panel.** `.panel-framed`: a hairline border plus an inner 4px parchment gap and a second hairline, for hero cards and portraits.
- **Wood.** `.wood`: `color-accent-800` with the `--q-wood` grain gradient and a `color-accent-900` inset frame. It's the quest board's background, and parchment notes sit on it.
- **Dashed.** Dashed `color-accent-800` borders mean “add something here” (`.dashed-btn`) or locked (`.locked`, with faint diagonal hatching).

## Layout

The mobile layout has a bottom tab bar (5 tabs, a 2px wax marker on the current one), bottom sheets and a FAB. Above 900px it switches to a desktop layout: a 232px sidebar, a 420px side panel in place of sheets, and screens up to 1180px wide. Motion is brief: a 0.2–0.25s fade, rise or slide, and none under `prefers-reduced-motion`.

## Iconography

[Lucide](https://lucide.dev) outline icons (ISC licence), drawn at 1.6 stroke on a 24 grid with round caps and joins, usually 17–19px, inheriting `currentColor` in code. The 60 the app uses are in **Icons**. They're stored with a `q-ink` (#3a270d) stroke because an `<img>` can't inherit colour. Each one stands for something specific: `crown` for Main Quests, `alert` for Crisis, `clock` for Errands, `feather` for Side Quests, `scroll` for Quests, `book-open` for the Glossary, `compass` for Adventure, `coins` for gold, `sparkles` for XP. The only logo is the wax seal with a Cormorant “Q” (**Logos**). Next to it, the name “Questlog” is set as text in Cormorant 600, 25px.

## Using this system

Load `tokens.css`, the fonts and `components/bundle.css`, then use the class names on plain HTML. The components are CSS classes, not a JavaScript library: their previews are static renditions of the app's markup. Put content on `q-parch`, set the root `font-family: var(--font-body); color: var(--q-ink)`, and build from the classes each component card names.

## Not synced

- **Components** are static renditions: the app's React parts (Sheet, Seg, CompleteButton, Portrait, StepChecklist and more in `app/src/components/`) are tied to its store, so no bundle was built.
- **Values kept in `bundle.css` rather than tokens:** `--q-wood` (a gradient), `--font-heading-weight` (600), and the many `color-mix()` washes inside component rules.
- **The four `color-mix()` colour variables** (`q-parch`, `q-parch-2`, `q-rule`, `q-tint`) and Classical's divider and shadows are stored as their resolved hex values.
- **No dark theme**: the app has none.
- **Fonts**: only the Latin subset files are included.
