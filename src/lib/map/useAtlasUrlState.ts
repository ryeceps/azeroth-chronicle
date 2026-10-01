import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useEraStore } from '../../app/state/eraStore';
import { useSelectionStore } from '../../app/state/selectionStore';
import type { LoreDataset } from '../../domain/types/lore';
import { layerIds, parseAtlasUrl, serializeAtlasUrl } from './atlasUrlState';

const curatedLayers = Object.fromEntries(layerIds.map((id) => [id, true])) as Record<(typeof layerIds)[number], boolean>;

export function useAtlasUrlState(dataset: LoreDataset) {
  const [params, setParams] = useSearchParams();
  const eraId = useEraStore((state) => state.eraId);
  const setEra = useEraStore((state) => state.setEra);
  const selection = useSelectionStore((state) => state.selection);
  const selectionOrigin = useSelectionStore((state) => state.selectionOrigin);
  const select = useSelectionStore((state) => state.select);
  const applyingUrl = useRef(false);
  const query = params.toString();
  const tourMode = params.get('tour');
  const storylineSlug = params.get('storyline');
  const collectionSlug = params.get('collection');
  const playMode = params.get('play');
  const nodeId = params.get('node');

  useEffect(() => {
    const parsed = parseAtlasUrl(new URLSearchParams(query), dataset);
    applyingUrl.current = true;
    if (parsed.eraId) setEra(parsed.eraId);
    select(parsed.selection);
  }, [dataset, query, select, setEra]);

  useEffect(() => {
    if (applyingUrl.current) {
      applyingUrl.current = false;
      return;
    }
    const next = serializeAtlasUrl({
      eraId,
      selection: selectionOrigin === 'story' ? null : selection,
      layers: curatedLayers,
    }, dataset);
    if (tourMode === 'full' || tourMode === 'era' || tourMode === 'story-tour') next.set('tour', tourMode);
    if ((tourMode === 'full' || tourMode === 'story-tour') && nodeId) next.set('node', nodeId);
    if (tourMode === 'storyline' || tourMode === 'full') {
      next.set('tour', tourMode);
      if (storylineSlug) next.set('storyline', storylineSlug);
    }
    if (tourMode === 'story-tour') {
      if (storylineSlug) next.set('storyline', storylineSlug);
      if (collectionSlug) next.set('collection', collectionSlug);
      if (playMode) next.set('play', playMode);
    }
    if (next.toString() !== query) setParams(next, { replace: true });
  }, [dataset, eraId, tourMode, storylineSlug, collectionSlug, playMode, nodeId, query, selection, selectionOrigin, setParams]);
}
