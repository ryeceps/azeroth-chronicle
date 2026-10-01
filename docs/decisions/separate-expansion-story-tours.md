# Separate expansion story tours from era chronology

Status: accepted for the Classic-to-Wrath story atlas. This decision supersedes the storyline-placement portion of [the integrated tour library](integrated-tour-library.md); the text-first storyline library and standalone story playback remain in effect.

## Context

The flat full-history itinerary currently inserts each playable storyline immediately after a selected era-guide node. This couples two distinct ways of exploring history: a broad era chronology and long-form quest stories. A multi-expansion story collection needs its own map, editorial order, placards, and “Play all” sequence without changing the era guides.

## Decision

- Keep an era tour and the full-history tour composed only of era-guide nodes. A Storyline may still link to a StoryGuide for its standalone playback, but it does not declare placement inside an era tour.
- Add a validated, data-authored `StoryTour` collection. It explicitly orders Storyline entries, assigns each entry to a named map region, and records the game-era label and research status. UI code must not infer chronology or geography from filenames, titles, or era IDs.
- Keep existing StoryGuides as the only narration/playback unit. “Play all” flattens the selected StoryTour’s explicitly ordered playable entries into one itinerary of their existing nodes; it never copies guide data or inserts StoryNodes into era playback. Research previews remain browsable placards and are omitted from playback.
- Give each StoryTour a dedicated route and selection screen. A placard opens the existing text-first storyline page; its Play control opens the same immersive guide. The StoryTour player carries an explicit collection and storyline in its URL and advances across guide boundaries while preserving pause and voice preferences.
- Keep world regions as authored selection areas at continent/world scale. Azeroth and Outland are separate worldspaces; Outland is displayed as a distinct selectable inset, never as a geographic attachment or route from Azeroth. Placards do not imply exact coordinates unless their record provides reviewed geographic evidence.
- The initial Classic-to-Wrath map is an original interpretive overview for navigation. It must be reviewed against the Wrath-era world presentation and must not reuse a Cataclysm map as if it were the Wrath map. Its placards, source boundary, and review status remain research until a human approves them.

## Consequences

This adds `StoryTour` records to the validated lore dataset and repository contract, with cross-record checks for storylines, guides, map regions, unique ordering, and playable status. Full-tour selectors, URLs, tests, and authoring guidance no longer require `fullTourPlacement`. Expansion-story order is editorial and must be documented; it is not evidence of causation.

## Acceptance

- Era tours and the full-history itinerary contain era-guide nodes only.
- `/tours/classic-to-wrath` presents a Wrath-era Azeroth overview and a separately clickable Outland inset, with map regions and their placards operable by mouse and keyboard.
- Each playable placard can start its story. “Play all” traverses the ordered playable entries exactly once, across guide boundaries, and has a direct-linkable current chapter. Research-only entries open their text-first preview and never appear in “Play all.”
- Refresh, Previous/Next, audio completion, pause/resume, finish, and return preserve StoryTour context and do not disturb standalone storyline or era playback.
- The map uses broad authored regions, not invented point geography; original-client and visual-review boundaries are visible in the tour documentation.
