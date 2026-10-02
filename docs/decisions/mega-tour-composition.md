# Decision: the Mega Tour combines eras and story collections

Status: accepted at the user's direction on 2026-10-02. This supersedes the era-only full-history rule in [separate expansion story tours](separate-expansion-story-tours.md) and updates the public landing flow in [tour-led public experience](tour-led-public-experience.md).

## Context

The public full tour previously stopped after the era guides, leaving the Classic-to-Wrath StoryTour as a separate journey. The requested landing page now presents the complete experience as one Mega Tour while keeping each era tour and curated StoryTour available on its own.

## Decision

- The Mega Tour traverses every available era-guide node in era order, then continues through playable entries from the validated StoryTour collections in their authored collection and entry order.
- StoryTour entries without a playable StoryGuide remain previews and are omitted. A storyline placed in multiple collections appears once in the Mega Tour, at its first authored collection position.
- The itinerary reuses existing StoryGuide nodes and audio. Era tours and each StoryTour's own Play All sequence remain independent playback modes.
- Full-tour URLs continue to use tour=full and identify the current era, chapter, storyline, and collection when the stop belongs to a StoryTour.
- The landing page shows a duration estimate calculated from the same chapter playback durations used by the guided player. Its second action opens the Tours hub, where visitors can choose an era tour or open the Classic-to-Wrath story map.

## Consequences

The reusable full-tour itinerary must compose era and StoryTour stops without changing lore records or copying StoryNodes. Advancing, going back, refreshing, and completing the tour must preserve or restore the correct guide context across era/storyline boundaries. The existing separation between EraTour and StoryTour remains intact; only the full Mega Tour combines their playback sequences.
