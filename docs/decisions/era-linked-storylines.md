# Decision: Era-Linked Storyline Library

Status: accepted for the 2026-09-29 storyline navigation request.

## Context

The tour-led public experience has one continuous StoryGuide per era. The research backlog now includes long-form arcs that cross era boundaries, such as the War of the Shifting Sands and the later Scepter questline. An era-only guide cannot express both a story's primary placement and its earlier causes without duplicating or misdating them. Visitors need to find these arcs from the relevant era and read a shareable storyline page in the same archival visual language.

## Decision

- Add validated `Storyline` records behind `LoreRepository`, with one primary era, ordered related eras, an ordered chapter outline, primary source leads, and `contentStatus`.
- Add `/storylines` and `/storylines/:slug` as text-first routes. The library filters by era; each era dossier links to its related storylines. Links to the existing era tours and archive remain available.
- Present research outlines as research previews. A `Storyline` may later point to a separately reviewed and authored StoryGuide; this change does not turn outlines into guided narration or synthesize voice-over.
- Cross-era chapters name their own era. The Scepter storyline places the ancient sealing in Era 5 and the opening questline in Era 8. It is not placed in Era 4's War of the Ancients.
- Reuse the site's archival typography, terrain art, responsive layout, reduced-motion behavior, permanent routes, and provenance labels. Avoid rendering inferred geography as surveyed map positions.

## Consequences

The generated manifest, Zod schema, cross-reference validator, and repository selector gain a storyline collection. Existing StoryGuide playback and its one-guide-per-era rule stay intact. Research previews remain outside published-only builds until human source and editorial review promotes them.
