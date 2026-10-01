import { describe, expect, it } from 'vitest';
import { loadDataset } from '../../src/lib/lore/loadDataset';
import { fullTourItinerary, fullTourUrl } from '../../src/lib/story/fullTour';
import { validateDatasetReferences } from '../../src/lib/lore/validateDataset';
import { storylineSchema } from '../../src/domain/schemas/loreSchemas';

describe('integrated full tour', () => {
  it('includes every era and playable story chapter exactly once, with Onyxia after Scepter and before Outland', () => {
    const dataset = loadDataset();
    const stops = fullTourItinerary(dataset);
    const expected = dataset.storyGuides.filter(guide => dataset.eras.some(era => era.storyGuideId === guide.id) || dataset.storylines.some(story => story.storyGuideId === guide.id)).flatMap(guide => guide.nodeIds);
    expect(stops.map(stop => stop.nodeId).sort()).toEqual(expected.sort());
    expect(new Set(stops.map(stop => stop.nodeId)).size).toBe(stops.length);
    const start = stops.findIndex(stop => stop.storylineSlug === 'scepter-of-the-shifting-sands');
    const storyGuide = dataset.storyGuides.find(guide => guide.id === stops[start]!.guideId)!;
    const onyxiaStart = stops.findIndex(stop => stop.storylineSlug === 'stormwind-onyxia-conspiracy');
    const onyxiaGuide = dataset.storyGuides.find(guide => guide.id === stops[onyxiaStart]!.guideId)!;
    expect(stops[start - 1]!.nodeId).toBe('adventurers-story-gates');
    expect(onyxiaStart).toBe(start + storyGuide.nodeIds.length);
    expect(stops[onyxiaStart + onyxiaGuide.nodeIds.length]!.nodeId).toBe('adventurers-story-outland');
    expect(fullTourUrl(stops[start]!)).toContain('storyline=scepter-of-the-shifting-sands');
    expect(fullTourUrl(stops[onyxiaStart]!)).toContain('storyline=stormwind-onyxia-conspiracy');
    expect(stops.every(stop => dataset.storyNodes.some(node => node.id === stop.nodeId))).toBe(true);
  });
  it('rejects missing placement, wrong era anchors, and ambiguous ordering', () => {
    const dataset = loadDataset();
    const story = dataset.storylines.find(item => item.storyGuideId)!;
    expect(storylineSchema.safeParse({ ...story, fullTourPlacement: undefined }).success).toBe(false);
    story.fullTourPlacement = { afterNodeId: 'cosmic-origins-story-light-shadow', order: 0 };
    expect(validateDatasetReferences(dataset).some(issue => issue.path.includes('fullTourPlacement'))).toBe(true);
    story.fullTourPlacement = { afterNodeId: 'adventurers-story-gates', order: 0 };
    dataset.storylines.push({ ...story, id: 'duplicate-story', slug: 'duplicate-story' });
    expect(validateDatasetReferences(dataset).some(issue => issue.message.includes('unique at this chapter'))).toBe(true);
  });
});
