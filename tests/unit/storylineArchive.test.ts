import { describe, expect, it } from 'vitest';
import { staticLoreRepository } from '../../src/domain/repositories/StaticLoreRepository';
import searchIndex from '../../src/generated/search-index.json';

const laterExpansionStories = [
  'dragonwrath-blue-flight-succession',
  'fangs-of-the-father',
  'gilneas-exile-and-return',
  'thunder-king-returns',
  'wrathion-legendary-cloak',
  'khadgar-garona-legendary-ring',
  'suramar-nightwell-rebellion',
  'drustvar-heartsbane',
  'nazmir-loa-and-ghuun',
  'saurfang-rebellion',
  'voldun-sethraliss',
  'arator-relics-of-light',
  'midnight-sunwell-to-dawnwell',
];

describe('storyline archive historical cutoff', () => {
  it.each(laterExpansionStories)('removes %s from browsing, direct lookup, and search', (id) => {
    expect(staticLoreRepository.listStorylines().some(story => story.id === id)).toBe(false);
    expect(staticLoreRepository.findStorylineBySlug(id)).toBeUndefined();
    for (const era of staticLoreRepository.listEras()) {
      expect(staticLoreRepository.listStorylinesForEra(era.id).some(story => story.id === id)).toBe(false);
    }
    expect(searchIndex.some(record => record.type === 'storyline' && record.id === id)).toBe(false);
  });

  it('preserves ancient history and every Classic-to-Wrath tour entry', () => {
    for (const id of ['galakrond-and-five-proto-dragons', 'war-of-the-shifting-sands', 'beyond-the-dark-portal']) {
      expect(staticLoreRepository.findStorylineBySlug(id)).toBeDefined();
    }
    const tour = staticLoreRepository.findStoryTourBySlug('classic-to-wrath')!;
    expect(tour.entries).toHaveLength(23);
    const dataset = staticLoreRepository.getDataset();
    for (const entry of tour.entries) {
      expect(dataset.storylines.some(story => story.id === entry.storylineId), entry.storylineId).toBe(true);
    }
  });
});
