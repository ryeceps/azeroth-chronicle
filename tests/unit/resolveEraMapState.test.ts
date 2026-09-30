import { describe, expect, it } from 'vitest';
import { loadDataset } from '../../src/lib/lore/loadDataset';
import { mapStateIdsForEra, resolveEraMapState } from '../../src/lib/map/resolveEraMapState';

describe('era map-state resolution', () => {
  it('allows only the selected same-era storyline guide to introduce its theater', () => {
    const dataset = loadDataset();
    const era = dataset.eras.find((item) => item.id === 'age-of-adventurers')!;
    expect(resolveEraMapState(dataset, era, 'scepter-forest-scene')?.id).toBe(era.mapStateId);
    expect(resolveEraMapState(dataset, era, 'scepter-forest-scene', 'scepter-of-the-shifting-sands-guide')?.worldspaceId)
      .toBe('scepter-story-theater');
    const earlierEra = dataset.eras.find((item) => item.id === 'long-vigil-new-kingdoms')!;
    expect(mapStateIdsForEra(dataset, earlierEra, 'scepter-of-the-shifting-sands-guide')).toEqual(new Set([earlierEra.mapStateId]));
  });
  it('permits guided states across worldspaces and derives the requested worldspace', () => {
    const dataset = loadDataset();
    const era = dataset.eras.find((item) => item.id === 'rise-of-the-horde')!;
    const firstWar = resolveEraMapState(dataset, era, 'rise-of-the-horde-first-war-map-research');

    expect(firstWar?.id).toBe('rise-of-the-horde-first-war-map-research');
    expect(firstWar?.worldspaceId).toBe('azeroth');
    expect(mapStateIdsForEra(dataset, era)).toEqual(new Set([
      'rise-of-the-horde-second-war-map-research',
      'rise-of-the-horde-draenor-before-map-research',
      'rise-of-the-horde-draenor-corrupted-map-research',
      'rise-of-the-horde-first-war-map-research',
    ]));
  });

  it('falls back to the era default for a state not used by its guide', () => {
    const dataset = loadDataset();
    const era = dataset.eras.find((item) => item.id === 'rise-of-the-horde')!;

    expect(resolveEraMapState(dataset, era, 'cosmic-origins-map-research')?.id)
      .toBe('rise-of-the-horde-second-war-map-research');
  });
});
