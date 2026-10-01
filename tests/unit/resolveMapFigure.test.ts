import { describe, expect, it } from 'vitest';
import { resolveMapFigure } from '../../src/lib/map/resolveMapFigure';

describe('resolveMapFigure', () => {
  const entity = {
    mapFigure: {
      asset: 'images/characters/ancient-illidan.webp',
      scale: 0.82,
      eraVariants: [{ eraId: 'age-of-adventurers', asset: 'images/storylines/akama-black-temple/illidan.webp', scale: 1.1 }],
    },
  };

  it('uses a matching era portrait without changing the default', () => {
    expect(resolveMapFigure(entity, 'age-of-adventurers')).toMatchObject({
      asset: 'images/storylines/akama-black-temple/illidan.webp',
      scale: 1.1,
    });
    expect(resolveMapFigure(entity)).toBe(entity.mapFigure);
  });

  it('falls back to the base portrait when the era has no variant', () => {
    expect(resolveMapFigure(entity, 'war-of-the-ancients')).toBe(entity.mapFigure);
  });
});
