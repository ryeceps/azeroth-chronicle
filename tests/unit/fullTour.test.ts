import { describe, expect, it } from 'vitest';
import { loadDataset } from '../../src/lib/lore/loadDataset';
import { fullTourItinerary, fullTourUrl } from '../../src/lib/story/fullTour';
import { storyTourItinerary, storyTourPlayAllUrl, storyTourStoryUrl } from '../../src/lib/story/storyTour';
import { validateDatasetReferences } from '../../src/lib/lore/validateDataset';
import { storylineSchema, storyTourSchema } from '../../src/domain/schemas/loreSchemas';

describe('separate era and story tours', () => {
  it('keeps the full-history tour to era guides only', () => {
    const dataset = loadDataset();
    const stops = fullTourItinerary(dataset);
    const eraGuideIds = new Set(dataset.eras.flatMap((era) => era.storyGuideId ? [era.storyGuideId] : []));
    const expected = dataset.storyGuides.filter((guide) => eraGuideIds.has(guide.id)).flatMap((guide) => guide.nodeIds);
    expect(stops.map((stop) => stop.nodeId).sort()).toEqual(expected.sort());
    expect(new Set(stops.map((stop) => stop.nodeId)).size).toBe(stops.length);
    expect(stops.every((stop) => stop.storylineSlug === undefined)).toBe(true);
    const gates = stops.findIndex((stop) => stop.nodeId === 'adventurers-story-gates');
    expect(stops[gates + 1]?.nodeId).toBe('adventurers-story-outland');
    expect(fullTourUrl(stops[gates]!)).not.toContain('storyline=');
  });

  it('plays only authored playable placards in explicit story chronology', () => {
    const dataset = loadDataset();
    const tour = dataset.storyTours.find((item) => item.slug === 'classic-to-wrath')!;
    const stops = storyTourItinerary(dataset, tour);
    const playableStorylines = tour.entries
      .sort((a, b) => a.order - b.order)
      .flatMap((entry) => {
        const story = dataset.storylines.find((item) => item.id === entry.storylineId)!;
        return story.storyGuideId ? [story.slug] : [];
      });
    expect([...new Set(stops.map((stop) => stop.storylineSlug))]).toEqual(playableStorylines);
    expect(playableStorylines).toEqual([
      'stormwind-onyxia-conspiracy',
      'scepter-of-the-shifting-sands',
      'dungeon-set-two-veiled-blade',
      'fallen-hero-and-rakhlikh',
      'karazhan-masters-key-and-nightbane',
    ]);
    expect(stops.length).toBe(21 + 22 + 22 + 15 + 18);
    expect(storyTourPlayAllUrl(tour, stops[0]!)).toContain('play=all');
    expect(storyTourPlayAllUrl(tour, stops[0]!)).toContain('collection=classic-to-wrath');
    expect(storyTourStoryUrl(tour, stops[0]!)).toContain('play=story');
    expect(storyTourItinerary(dataset, tour).filter((stop) => stop.storylineSlug === playableStorylines[0]).at(-1)?.nodeId)
      .not.toBe(stops.find((stop) => stop.storylineSlug === playableStorylines[1])?.nodeId);
  });

  it('allows standalone story guides without era-tour insertion and validates collection entries', () => {
    const dataset = loadDataset();
    const storyline = dataset.storylines.find((item) => item.storyGuideId)!;
    expect(storylineSchema.safeParse(storyline).success).toBe(true);

    const tour = dataset.storyTours[0]!;
    expect(storyTourSchema.safeParse(tour).success).toBe(true);
    expect(tour.entries.every((entry) => (
      entry.mapPositionPercent.length === 2
      && entry.mapPositionPercent.every((coordinate) => coordinate >= 0 && coordinate <= 100)
    ))).toBe(true);
    const invalidMapPosition = structuredClone(tour);
    invalidMapPosition.entries[0]!.mapPositionPercent = [101, 50];
    expect(storyTourSchema.safeParse(invalidMapPosition).success).toBe(false);
    const duplicateOrder = structuredClone(tour);
    duplicateOrder.entries[1]!.order = duplicateOrder.entries[0]!.order;
    expect(storyTourSchema.safeParse(duplicateOrder).success).toBe(false);

    const missingRegion = structuredClone(dataset);
    missingRegion.storyTours[0]!.entries[0]!.regionIds = ['unknown-region'];
    expect(validateDatasetReferences(missingRegion).some((issue) => issue.path.includes('storyTours'))).toBe(true);

    const missingStoryline = structuredClone(dataset);
    missingStoryline.storyTours[0]!.entries[0]!.storylineId = 'unknown-story';
    expect(validateDatasetReferences(missingStoryline).some((issue) => issue.path.includes('storyTours') && issue.message.includes('Unknown storyline'))).toBe(true);
  });
});
