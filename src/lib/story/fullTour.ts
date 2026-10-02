import type { LoreDataset } from '../../domain/types/lore';
import { storyTourItinerary } from './storyTour';
import { storyNodeDurationMs } from './storyDuration';

export interface TourStop {
  eraId: string;
  eraSlug: string;
  guideId: string;
  nodeId: string;
  storylineSlug?: string;
  storyTourSlug?: string;
}

/** Order all era guides first, then each playable StoryTour entry in authored order. */
export function fullTourItinerary(dataset: LoreDataset): TourStop[] {
  const eraStops = [...dataset.eras].sort((a, b) => a.order - b.order).flatMap((era) => {
    const guide = dataset.storyGuides.find((item) => item.id === era.storyGuideId);
    return (guide?.nodeIds ?? []).map((nodeId) => ({ eraId: era.id, eraSlug: era.slug, guideId: guide!.id, nodeId }));
  });
  const includedStorylines = new Set<string>();
  const storyStops: TourStop[] = [];
  for (const tour of dataset.storyTours) {
    const tourStops = storyTourItinerary(dataset, tour);
    for (const stop of tourStops) {
      if (includedStorylines.has(stop.storylineSlug)) continue;
      includedStorylines.add(stop.storylineSlug);
      storyStops.push(...tourStops.filter((candidate) => candidate.storylineSlug === stop.storylineSlug));
    }
  }
  return [...eraStops, ...storyStops];
}

export function fullTourDurationMs(dataset: LoreDataset, itinerary = fullTourItinerary(dataset)): number {
  const nodesById = new Map(dataset.storyNodes.map((node) => [node.id, node]));
  return itinerary.reduce((total, stop) => {
    const node = nodesById.get(stop.nodeId);
    return total + (node ? storyNodeDurationMs(node) : 0);
  }, 0);
}

export function fullTourUrl(stop: TourStop): string {
  const params = new URLSearchParams({ era: stop.eraSlug, tour: "full", node: stop.nodeId });
  if (stop.storylineSlug) params.set("storyline", stop.storylineSlug);
  if (stop.storyTourSlug) params.set("collection", stop.storyTourSlug);
  return "/map?" + params.toString();
}
