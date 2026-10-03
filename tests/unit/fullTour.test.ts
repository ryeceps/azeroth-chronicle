import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
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
      'hero-of-the-maghar',
      'akama-and-black-temple',
      'cipher-of-damnation-oronok',
      'champion-of-the-naaru-outland-trials',
      'netherwing-liberation',
      'missing-diplomat-original-investigation',
      'quel-delar-restored',
    ]);
    expect(stops.length).toBe(21 + 22 + 22 + 15 + 14 + 21 + 21 + 15 + 15 + 13 + 18 + 15 + 20 + 26 + 9 + 17 + 24 + 19);
    const akamaStart = stops.findIndex((stop) => stop.storylineSlug === 'akama-and-black-temple');
    expect(stops[akamaStart - 1]?.storylineSlug).toBe('hero-of-the-maghar');
    const magharStart = stops.findIndex((stop) => stop.storylineSlug === 'hero-of-the-maghar');
    expect(stops[magharStart - 1]?.storylineSlug).toBe('karazhan-masters-key-and-nightbane');
    expect(stops.filter((stop) => stop.storylineSlug === 'hero-of-the-maghar')).toHaveLength(15);
    expect(stops.filter((stop) => stop.storylineSlug === 'cipher-of-damnation-oronok')).toHaveLength(26);
    const championStart = stops.findIndex((stop) => stop.storylineSlug === 'champion-of-the-naaru-outland-trials');
    expect(stops[championStart - 1]?.storylineSlug).toBe('cipher-of-damnation-oronok');
    expect(stops.filter((stop) => stop.storylineSlug === 'champion-of-the-naaru-outland-trials')).toHaveLength(9);
    const netherwingStart = stops.findIndex((stop) => stop.storylineSlug === 'netherwing-liberation');
    expect(stops[netherwingStart - 1]?.storylineSlug).toBe('champion-of-the-naaru-outland-trials');
    expect(stops.filter((stop) => stop.storylineSlug === 'netherwing-liberation')).toHaveLength(17);
    const diplomatStart = stops.findIndex((stop) => stop.storylineSlug === 'missing-diplomat-original-investigation');
    expect(stops[diplomatStart - 1]?.storylineSlug).toBe('netherwing-liberation');
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

  it('keeps Netherwing as an illustrated TBC story after Champion of the Naaru', () => {
    const dataset = loadDataset();
    const story = dataset.storylines.find((item) => item.id === 'netherwing-liberation')!;
    const guide = dataset.storyGuides.find((item) => item.id === story.storyGuideId)!;
    const nodes = guide.nodeIds.map((id) => dataset.storyNodes.find((node) => node.id === id)!);
    const tour = dataset.storyTours.find((item) => item.slug === 'classic-to-wrath')!;
    const orderedEntries = [...tour.entries].sort((a, b) => a.order - b.order);
    const entry = orderedEntries.find((item) => item.storylineId === story.id)!;
    const audio = JSON.parse(readFileSync(resolve('public/audio/guided/manifest.json'), 'utf8')) as {
      tracks: Array<{ nodeId: string; assetPath: string; durationMs: number; bytes: number; sha256: string; transcriptSha256: string }>;
    };
    const ledger = JSON.parse(readFileSync(resolve('docs/research/netherwing-liberation-visual-assets.json'), 'utf8')) as {
      environments: Array<{ assetPath: string; sha256: string; bytes: number }>;
      figures: Array<{ assetPath: string; sha256: string; bytes: number }>;
      scenes: Array<{ nodeId: string; mapStateId: string; environmentAssetPath: string; visualAssetPaths: string[]; citationIds: string[] }>;
    };

    expect(story.contentStatus).toBe('research');
    expect(story.showInEraTourOffshoots).toBe(false);
    expect(guide.contentStatus).toBe('research');
    expect(nodes).toHaveLength(17);
    expect(nodes.every((node) => node.eventIds?.length === 1 && node.entityIds?.length
      && node.voiceover?.assetPath && node.visualActions?.some((action) => action.type === 'set_map_state'))).toBe(true);
    expect(entry.order).toBe(16);
    expect(entry.regionIds).toEqual(['outland']);
    expect(orderedEntries[orderedEntries.indexOf(entry) - 1]?.storylineId).toBe('champion-of-the-naaru-outland-trials');
    expect(tour.entries).toHaveLength(19);
    expect(nodes.map((node) => node.id)).toEqual(ledger.scenes.map((scene) => scene.nodeId));
    expect(audio.tracks.filter((track) => track.nodeId.startsWith('netherwing-liberation-story-'))).toHaveLength(17);

    for (const asset of [...ledger.environments, ...ledger.figures]) {
      const bytes = readFileSync(`public/${asset.assetPath}`);
      expect(bytes.length).toBe(asset.bytes);
      expect(createHash('sha256').update(bytes).digest('hex')).toBe(asset.sha256);
    }
    for (const [index, node] of nodes.entries()) {
      const scene = ledger.scenes[index]!;
      const mapStateId = node.visualActions?.find((action) => action.type === 'set_map_state');
      expect(mapStateId?.type).toBe('set_map_state');
      if (mapStateId?.type !== 'set_map_state') throw new Error('Netherwing scene is missing its map state.');
      const mapState = dataset.mapStates.find((state) => state.id === mapStateId.mapStateId)!;
      expect(scene.mapStateId).toBe(mapState.id);
      expect(scene.environmentAssetPath).toBe(mapState.terrainTextureAsset);
      expect(scene.citationIds.length).toBeGreaterThan(0);
      expect(existsSync(`public/${scene.environmentAssetPath}`)).toBe(true);
      expect(scene.visualAssetPaths.every((asset) => existsSync(`public/${asset}`))).toBe(true);
      const track = audio.tracks.find((item) => item.nodeId === node.id)!;
      const audioBytes = readFileSync(resolve('public', track.assetPath));
      expect(node.voiceover?.assetPath).toBe(track.assetPath);
      expect(node.voiceover?.durationMs).toBe(track.durationMs);
      expect(createHash('sha256').update(audioBytes).digest('hex')).toBe(track.sha256);
      expect(createHash('sha256').update(node.narration).digest('hex')).toBe(track.transcriptSha256);
      const state = dataset.spatialStates.filter((item) => node.entityIds?.includes(item.entityId)
        && item.worldspaceId === 'netherwing-story-theater');
      expect(state.length).toBe(node.entityIds?.length);
      expect(state.every((item) => item.placementKind === 'relational'
        && item.geographicCertainty === 'unknown' && item.visualPresence === 'contextual')).toBe(true);
    }
  });

  it('keeps Hero of the Mag’har as a fully sourced StoryTour after Karazhan', () => {
    const dataset = loadDataset();
    const story = dataset.storylines.find((item) => item.id === 'hero-of-the-maghar')!;
    const guide = dataset.storyGuides.find((item) => item.id === story.storyGuideId)!;
    const nodes = guide.nodeIds.map((id) => dataset.storyNodes.find((node) => node.id === id)!);
    const tour = dataset.storyTours.find((item) => item.slug === 'classic-to-wrath')!;
    const orderedEntries = [...tour.entries].sort((a, b) => a.order - b.order);
    const entry = orderedEntries.find((item) => item.storylineId === story.id)!;
    const audio = JSON.parse(readFileSync(resolve('public/audio/guided/manifest.json'), 'utf8')) as {
      tracks: Array<{ nodeId: string; assetPath: string; durationMs: number; bytes: number; sha256: string; transcriptSha256: string }>;
    };
    const ledger = JSON.parse(readFileSync(resolve('docs/research/hero-of-the-maghar-visual-assets.json'), 'utf8')) as {
      environments: Array<{ assetPath: string; sha256: string; bytes: number }>;
      figures: Array<{ assetPath: string; sha256: string; bytes: number }>;
      scenes: Array<{ nodeId: string; mapStateId: string; environmentAssetPath: string; visualAssetPaths: string[]; citationIds: string[] }>;
    };

    expect(story.contentStatus).toBe('research');
    expect(story.showInEraTourOffshoots).toBe(false);
    expect(guide.contentStatus).toBe('research');
    expect(nodes).toHaveLength(15);
    expect(nodes.every((node) => node.eventIds?.length && node.entityIds?.length
      && node.voiceover?.assetPath && node.visualActions?.some((action) => action.type === 'set_map_state'))).toBe(true);
    expect(entry.order).toBe(12);
    expect(entry.regionIds).toEqual(['outland']);
    expect(orderedEntries[orderedEntries.indexOf(entry) - 1]?.storylineId).toBe('karazhan-masters-key-and-nightbane');
    expect(orderedEntries[orderedEntries.indexOf(entry) + 1]?.storylineId).toBe('akama-and-black-temple');
    expect(tour.entries).toHaveLength(19);
    expect(nodes.map((node) => node.id)).toEqual(ledger.scenes.map((scene) => scene.nodeId));
    expect(audio.tracks.filter((track) => track.nodeId.startsWith('hero-of-the-maghar-story-'))).toHaveLength(15);

    for (const asset of [...ledger.environments, ...ledger.figures]) {
      const bytes = readFileSync(`public/${asset.assetPath}`);
      expect(bytes.length).toBe(asset.bytes);
      expect(createHash('sha256').update(bytes).digest('hex')).toBe(asset.sha256);
    }
    for (const [index, node] of nodes.entries()) {
      const scene = ledger.scenes[index]!;
      const action = node.visualActions?.find((item) => item.type === 'set_map_state');
      expect(action?.type).toBe('set_map_state');
      if (action?.type !== 'set_map_state') throw new Error('Mag’har scene is missing its map state.');
      const mapState = dataset.mapStates.find((state) => state.id === action.mapStateId)!;
      expect(scene.mapStateId).toBe(mapState.id);
      expect(scene.environmentAssetPath).toBe(mapState.terrainTextureAsset);
      expect(scene.citationIds.length).toBeGreaterThan(0);
      expect(existsSync(`public/${scene.environmentAssetPath}`)).toBe(true);
      expect(scene.visualAssetPaths.every((asset) => existsSync(`public/${asset}`))).toBe(true);
      const track = audio.tracks.find((item) => item.nodeId === node.id)!;
      const audioBytes = readFileSync(resolve('public', track.assetPath));
      expect(node.voiceover?.assetPath).toBe(track.assetPath);
      expect(node.voiceover?.durationMs).toBe(track.durationMs);
      expect(createHash('sha256').update(audioBytes).digest('hex')).toBe(track.sha256);
      expect(createHash('sha256').update(node.narration).digest('hex')).toBe(track.transcriptSha256);
    }
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
