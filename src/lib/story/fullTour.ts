import type { LoreDataset } from '../../domain/types/lore';

export interface TourStop { eraId: string; eraSlug: string; guideId: string; nodeId: string; storylineSlug?: string }

/** Editorial reading order. Storyline flashbacks remain inside their own guide. */
export function fullTourItinerary(dataset: LoreDataset): TourStop[] {
  return [...dataset.eras].sort((a, b) => a.order - b.order).flatMap((era) => {
    const guide = dataset.storyGuides.find((item) => item.id === era.storyGuideId);
    return (guide?.nodeIds ?? []).flatMap((nodeId): TourStop[] => {
      const stories = dataset.storylines.filter((story) => story.primaryEraId === era.id && story.storyGuideId && story.fullTourPlacement?.afterNodeId === nodeId)
        .sort((a, b) => a.fullTourPlacement!.order - b.fullTourPlacement!.order);
      return [{ eraId: era.id, eraSlug: era.slug, guideId: guide!.id, nodeId }, ...stories.flatMap((story) => {
        const storyGuide = dataset.storyGuides.find((item) => item.id === story.storyGuideId);
        return (storyGuide?.nodeIds ?? []).map((id) => ({ eraId: era.id, eraSlug: era.slug, guideId: storyGuide!.id, nodeId: id, storylineSlug: story.slug }));
      })];
    });
  });
}

export function fullTourUrl(stop: TourStop): string {
  const params = new URLSearchParams({ era: stop.eraSlug, tour: 'full', node: stop.nodeId });
  if (stop.storylineSlug) params.set('storyline', stop.storylineSlug);
  return `/map?${params}`;
}
