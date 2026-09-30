import { describe, expect, it } from 'vitest';
import { searchLore } from '../../src/lib/search/searchIndex';

describe('search index', () => {
  it('weights exact name matches and supports era/source publication filters', () => {
    expect(searchLore('arrival of the old gods')[0]?.id).toBe('old-gods-arrive');
    expect(searchLore('alakir', { eraId: 'missing-era' })).toEqual([]);
    expect(searchLore('alakir', { sourceIds: ['missing-source'] })).toEqual([]);
    expect(searchLore('alakir', { includeUnpublished: false })).toEqual([]);
  });

  it('finds a cross-era storyline through either related era', () => {
    const scepter = searchLore('scepter of the shifting sands');
    expect(scepter[0]).toMatchObject({
      type: 'storyline',
      path: '/storylines/scepter-of-the-shifting-sands',
    });
    expect(searchLore('scepter', { eraId: 'long-vigil-new-kingdoms' })[0]?.id).toBe('scepter-of-the-shifting-sands');
    expect(searchLore('scepter', { eraId: 'age-of-adventurers' })[0]?.id).toBe('scepter-of-the-shifting-sands');
    expect(searchLore('scepter', { eraId: 'war-of-the-ancients' })).toEqual([]);
  });
});
