# Separate expansion story tours from era chronology

Status: accepted for the Classic-to-Wrath story atlas. The era-only rule for full-history playback was superseded by [the Mega Tour composition decision](mega-tour-composition.md) on 2026-10-02. Era tours remain era-only; the text-first storyline library and standalone story playback remain in effect.

## Context

The flat full-history itinerary currently inserts each playable storyline immediately after a selected era-guide node. This couples two distinct ways of exploring history: a broad era chronology and long-form quest stories. A multi-expansion story collection needs its own map, editorial order, placards, and “Play all” sequence without changing the era guides.

## Decision

- Keep each era tour composed only of its era-guide nodes. A Storyline may still link to a StoryGuide for standalone playback; its placement in a StoryTour remains authored explicitly.
- A Storyline may retain its era links for chronology and the text-first library while setting `showInEraTourOffshoots: false` when it belongs only to an authored StoryTour. That keeps it out of the era tour's connected-story list without removing its standalone page or its dedicated StoryTour placard.
- Add a validated, data-authored `StoryTour` collection. It explicitly orders Storyline entries, assigns each entry to a named map region, and records the game-era label and research status. UI code must not infer chronology or geography from filenames, titles, or era IDs.
- Keep existing StoryGuides as the only narration/playback unit. “Play all” flattens the selected StoryTour’s explicitly ordered playable entries into one itinerary of their existing nodes; it never copies guide data or inserts StoryNodes into era playback. Research previews remain browsable placards and are omitted from playback.
- Give each StoryTour a dedicated route and selection screen. A placard opens the existing text-first storyline page; its Play control opens the same immersive guide. The StoryTour player carries an explicit collection and storyline in its URL and advances across guide boundaries while preserving pause and voice preferences.
- Keep world regions as authored selection areas at continent/world scale. Azeroth and Outland are separate worldspaces; Outland is displayed as a distinct selectable inset, never as a geographic attachment or route from Azeroth. Placards do not imply exact coordinates unless their record provides reviewed geographic evidence.
- The initial Classic-to-Wrath map is an original interpretive overview for navigation. It must be reviewed against the Wrath-era world presentation and must not reuse a Cataclysm map as if it were the Wrath map. Its placards, source boundary, and review status remain research until a human approves them.

## Consequences

This adds `StoryTour` records to the validated lore dataset and repository contract, with cross-record checks for storylines, guides, map regions, unique ordering, and playable status. Full-tour selectors, URLs, tests, and authoring guidance no longer require `fullTourPlacement`. Expansion-story order is editorial and must be documented; it is not evidence of causation.

## Acceptance

- Era tours contain era-guide nodes only. The full-history Mega Tour composes all era guides followed by playable StoryTour entries as specified in [the Mega Tour composition decision](mega-tour-composition.md).
- An explicitly StoryTour-only storyline appears on its authored StoryTour and stays out of the era tour's connected-story list.
- `/tours/classic-to-wrath` presents a Wrath-era Azeroth overview and a separately clickable Outland inset, with map regions and their placards operable by mouse and keyboard.
- Each playable placard can start its story. “Play all” traverses the ordered playable entries exactly once, across guide boundaries, and has a direct-linkable current chapter. Research-only entries open their text-first preview and never appear in “Play all.”
- Refresh, Previous/Next, audio completion, pause/resume, finish, and return preserve StoryTour context and do not disturb standalone storyline or era playback.
- The map uses broad authored regions, not invented point geography; original-client and visual-review boundaries are visible in the tour documentation.
