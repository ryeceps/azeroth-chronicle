import type { LoreEntity } from '../../domain/types/lore';

/** Resolve time-specific character art while keeping the entity identity stable. */
export function resolveMapFigure(entity: Pick<LoreEntity, 'mapFigure'>, eraId?: string) {
  const base = entity.mapFigure;
  if (!base || !eraId) return base;
  const variant = base.eraVariants?.find((candidate) => candidate.eraId === eraId);
  if (!variant) return base;
  return { ...base, asset: variant.asset, scale: variant.scale ?? base.scale };
}
