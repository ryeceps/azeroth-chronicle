import type { LoreDataset } from '../../domain/types/lore';

export interface TourStop { eraId: string; eraSlug: string; guideId: string; nodeId: string; storylineSlug?: string }

/** The full-history itinerary follows era guides only; storyline guides have their own tours. */
export function fullTourItinerary(dataset: LoreDataset): TourStop[] {
  return [...dataset.eras].sort((a, b) => a.order - b.order).flatMap((era) => {
    const guide = dataset.storyGuides.find((item) => item.id === era.storyGuideId);
    return (guide?.nodeIds ?? []).map((nodeId) => ({ eraId: era.id, eraSlug: era.slug, guideId: guide!.id, nodeId }));
  });
}

export function fullTourUrl(stop: TourStop): string {
  return `/map?${new URLSearchParams({ era: stop.eraSlug, tour: 'full', node: stop.nodeId })}`;
}
