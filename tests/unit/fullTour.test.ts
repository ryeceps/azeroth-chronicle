import { describe, expect, it } from 'vitest';
import { loadDataset } from '../../src/lib/lore/loadDataset';
import { fullTourDurationMs, fullTourItinerary, fullTourUrl } from '../../src/lib/story/fullTour';
import { storyTourItinerary, storyTourPlayAllUrl, storyTourStoryUrl } from '../../src/lib/story/storyTour';
import { storyNodeDurationMs } from '../../src/lib/story/storyDuration';
import { validateDatasetReferences } from '../../src/lib/lore/validateDataset';
import { storylineSchema, storyTourSchema } from '../../src/domain/schemas/loreSchemas';
import { eraTourOffshoots } from '../../src/lib/story/eraTour';

describe('Mega Tour and separate era and story tours', () => {
  it('plays all era guides before each playable StoryTour in authored order', () => {
    const dataset = loadDataset();
    const stops = fullTourItinerary(dataset);
    const expectedEraStops = [...dataset.eras]
      .sort((a, b) => a.order - b.order)
      .flatMap((era) => {
        const guide = dataset.storyGuides.find((item) => item.id === era.storyGuideId);
        return guide?.nodeIds.map((nodeId) => ({ eraId: era.id, eraSlug: era.slug, guideId: guide.id, nodeId })) ?? [];
      });
    const expectedStoryStops = [];
    const includedStorylines = new Set<string>();
    for (const tour of dataset.storyTours) {
      for (const stop of storyTourItinerary(dataset, tour)) {
        if (includedStorylines.has(stop.storylineSlug)) continue;
        includedStorylines.add(stop.storylineSlug);
        expectedStoryStops.push(...storyTourItinerary(dataset, tour).filter((candidate) => candidate.storylineSlug === stop.storylineSlug));
      }
    }
    const expected = [...expectedEraStops, ...expectedStoryStops];

    expect(stops).toEqual(expected);
    expect(new Set(stops.map((stop) => stop.nodeId)).size).toBe(stops.length);
    expect(stops.slice(0, expectedEraStops.length).every((stop) => stop.storylineSlug === undefined)).toBe(true);
    expect(stops.slice(expectedEraStops.length).every((stop) => stop.storylineSlug && stop.storyTourSlug)).toBe(true);
    expect(stops.at(expectedEraStops.length - 1)?.eraId).toBe(expectedEraStops.at(-1)?.eraId);

    const firstStoryStop = stops[expectedEraStops.length]!;
    expect(fullTourUrl(firstStoryStop)).toContain(`storyline=${firstStoryStop.storylineSlug}`);
    expect(fullTourUrl(firstStoryStop)).toContain(`collection=${firstStoryStop.storyTourSlug}`);
    expect(fullTourUrl(stops[0]!)).not.toContain('storyline=');
    expect(fullTourDurationMs(dataset, stops)).toBe(stops.reduce((total, stop) => {
      const node = dataset.storyNodes.find((item) => item.id === stop.nodeId);
      return total + (node ? storyNodeDurationMs(node) : 0);
    }, 0));
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
      'tirion-taelan-of-love-and-family',
      'darrowshire-lost-and-remembered',
      'defias-original-conspiracy',
      'scythe-of-elune-original-mystery',
      'yehkinya-and-hakkars-return',
      'ras-frostwhisper-and-the-soulbound-keepsake',
      'karazhan-masters-key-and-nightbane',
      'akama-and-black-temple',
      'cipher-of-damnation-oronok',
      'champion-of-the-naaru-outland-trials',
      'missing-diplomat-original-investigation',
      'quel-delar-restored',
    ]);
    expect(stops.length).toBe(21 + 22 + 22 + 15 + 14 + 21 + 21 + 15 + 15 + 13 + 18 + 20 + 26 + 9 + 24 + 19);
    const akamaStart = stops.findIndex((stop) => stop.storylineSlug === 'akama-and-black-temple');
    expect(stops[akamaStart - 1]?.storylineSlug).toBe('karazhan-masters-key-and-nightbane');
    expect(stops.filter((stop) => stop.storylineSlug === 'cipher-of-damnation-oronok')).toHaveLength(26);
    const championStart = stops.findIndex((stop) => stop.storylineSlug === 'champion-of-the-naaru-outland-trials');
    expect(stops[championStart - 1]?.storylineSlug).toBe('cipher-of-damnation-oronok');
    expect(stops.filter((stop) => stop.storylineSlug === 'champion-of-the-naaru-outland-trials')).toHaveLength(9);
    const diplomatStart = stops.findIndex((stop) => stop.storylineSlug === 'missing-diplomat-original-investigation');
    expect(stops[diplomatStart - 1]?.storylineSlug).toBe('champion-of-the-naaru-outland-trials');
    expect(stops[diplomatStart + 24]?.storylineSlug).toBe('quel-delar-restored');
    expect(stops.some((stop) => stop.storylineSlug === 'wrathgate-and-undercity')).toBe(false);
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

  it('keeps a Classic-to-Wrath-only storyline out of the era-tour offshoot list', () => {
    const dataset = loadDataset();
    const classicStories = dataset.storylines.filter((storyline) => storyline.eraIds.includes('age-of-adventurers'));
    const visible = eraTourOffshoots(classicStories);

    expect(visible.some((storyline) => storyline.id === 'defias-original-conspiracy')).toBe(false);
    expect(visible.some((storyline) => storyline.id === 'cipher-of-damnation-oronok')).toBe(false);
    expect(visible.some((storyline) => storyline.id === 'champion-of-the-naaru-outland-trials')).toBe(false);
    expect(visible.some((storyline) => storyline.id === 'darrowshire-lost-and-remembered')).toBe(true);
  });
});
