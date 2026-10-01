import type { LoreDataset, StoryTour } from '../../domain/types/lore';
import type { TourStop } from './fullTour';

export interface StoryTourStop extends TourStop {
  storyTourSlug: string;
  storylineSlug: string;
}

/** Flatten the authored story order without including research-only previews. */
export function storyTourItinerary(dataset: LoreDataset, tour: StoryTour): StoryTourStop[] {
  return [...tour.entries]
    .sort((a, b) => a.order - b.order)
    .flatMap((entry) => {
      const storyline = dataset.storylines.find((item) => item.id === entry.storylineId);
      const guide = dataset.storyGuides.find((item) => item.id === storyline?.storyGuideId);
      const era = dataset.eras.find((item) => item.id === guide?.eraId);
      if (!storyline || !guide || !era) return [];
      return guide.nodeIds.map((nodeId): StoryTourStop => ({
        eraId: era.id,
        eraSlug: era.slug,
        guideId: guide.id,
        nodeId,
        storyTourSlug: tour.slug,
        storylineSlug: storyline.slug,
      }));
    });
}

export function storyTourStoryUrl(tour: StoryTour, stop: StoryTourStop): string {
  const params = new URLSearchParams({
    era: stop.eraSlug,
    tour: 'story-tour',
    collection: tour.slug,
    storyline: stop.storylineSlug,
    node: stop.nodeId,
    play: 'story',
  });
  return `/map?${params}`;
}

export function storyTourPlayAllUrl(tour: StoryTour, stop: StoryTourStop): string {
  const params = new URLSearchParams({
    era: stop.eraSlug,
    tour: 'story-tour',
    collection: tour.slug,
    storyline: stop.storylineSlug,
    node: stop.nodeId,
    play: 'all',
  });
  return `/map?${params}`;
}
