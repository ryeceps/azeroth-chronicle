import { useEraStore } from '../app/state/eraStore';
import { MapViewport3D } from '../components/map/MapViewport3D';
import { StoryGuidePanel } from '../components/story/StoryGuidePanel';
import { staticLoreRepository } from '../domain/repositories/StaticLoreRepository';
import { adaptGeometry } from '../lib/map/geometryAdapter';
import { useAtlasUrlState } from '../lib/map/useAtlasUrlState';
import { useMapViewStore } from '../app/state/mapViewStore';
import { resolveEraMapState } from '../lib/map/resolveEraMapState';
import { useStoryStore } from '../app/state/storyStore';
import { fullTourItinerary, fullTourUrl } from '../lib/story/fullTour';
import { storyTourItinerary } from '../lib/story/storyTour';
import { endStoryGuide } from '../lib/story/storyRuntime';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';

export function MapPage() {
  const [params] = useSearchParams();
  if (params.get('tour') === 'storyline') {
    const storyline = staticLoreRepository.findStorylineBySlug(params.get('storyline') ?? '');
    const era = staticLoreRepository.findEraBySlug(params.get('era') ?? '');
    const guide = staticLoreRepository.findStoryGuide(storyline?.storyGuideId ?? '');
    if (!storyline || era?.id !== storyline.primaryEraId || guide?.eraId !== storyline.primaryEraId) {
      return <Navigate to="/storylines" replace />;
    }
  }
  if (params.get('tour') === 'full') {
    const itinerary = fullTourItinerary(staticLoreRepository.getDataset());
    const requested = params.get('node');
    const stop = itinerary.find(item => item.nodeId === requested && item.eraSlug === params.get('era') && (item.storylineSlug ?? null) === params.get('storyline'));
    if (requested && !stop) {
      const fallback = itinerary.find(item => item.eraSlug === params.get('era') && (item.storylineSlug ?? null) === params.get('storyline')) ?? itinerary[0];
      if (fallback) return <Navigate to={fullTourUrl(fallback)} replace />;
    }
  }
  if (params.get('tour') === 'story-tour') {
    const dataset = staticLoreRepository.getDataset();
    const tour = staticLoreRepository.findStoryTourBySlug(params.get('collection') ?? '');
    const storyline = staticLoreRepository.findStorylineBySlug(params.get('storyline') ?? '');
    const era = staticLoreRepository.findEraBySlug(params.get('era') ?? '');
    const stop = tour && storyTourItinerary(dataset, tour).find((item) =>
      item.storylineSlug === storyline?.slug && item.nodeId === params.get('node'));
    if (!tour || !storyline || !stop || era?.id !== stop.eraId || !['story', 'all'].includes(params.get('play') ?? '')) {
      return <Navigate to={tour ? `/tours/${tour.slug}` : '/tours'} replace />;
    }
  }
  return <AtlasMapPage />;
}

function AtlasMapPage() {
  const [voiceControlsHost, setVoiceControlsHost] = useState<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const dataset = staticLoreRepository.getDataset();
  useAtlasUrlState(dataset);
  const eraId = useEraStore((state) => state.eraId);
  const era = staticLoreRepository.findEraBySlug(params.get('era') ?? '') ?? dataset.eras.find((item) => item.id === eraId) ?? dataset.eras[0];
  const storylineMode = params.get('tour') === 'storyline';
  const storyTourMode = params.get('tour') === 'story-tour';
  const storyTour = storyTourMode ? staticLoreRepository.findStoryTourBySlug(params.get('collection') ?? '') : undefined;
  const storyline = (storylineMode || params.get('tour') === 'full' || storyTourMode) ? staticLoreRepository.findStorylineBySlug(params.get('storyline') ?? '') : undefined;
  const requestedEra = staticLoreRepository.findEraBySlug(params.get('era') ?? '');
  const validStoryline = storyline && requestedEra?.id === storyline.primaryEraId
    && staticLoreRepository.findStoryGuide(storyline.storyGuideId ?? '')?.eraId === storyline.primaryEraId;
  const storyTourStop = storyTour && storyline
    ? storyTourItinerary(dataset, storyTour).find((item) => item.storylineSlug === storyline.slug && item.nodeId === params.get('node'))
    : undefined;
  const validStoryTour = storyTourMode && storyTourStop && requestedEra?.id === storyTourStop.eraId;
  const guideId = validStoryTour ? storyTourStop.guideId : validStoryline ? storyline.storyGuideId : era?.storyGuideId;
  const activeGuideId = useStoryStore((state) => state.guideId);
  const activeNodeId = useStoryStore((state) => state.nodeId);
  const immersive = Boolean(activeNodeId && activeGuideId === guideId);
  const requestedMapStateId = useMapViewStore((state) => state.mapStateId);
  const mapState = era ? resolveEraMapState(dataset, era, requestedMapStateId, guideId) : undefined;
  const worldspace = dataset.worldspaces.find((item) => item.id === mapState?.worldspaceId);
  const visibleBattles = staticLoreRepository.listBattlesForEra(era?.id ?? '')
    .filter((battle) => battle.worldspaceId === worldspace?.id);
  const visibleEntities = staticLoreRepository.listEntitiesForEra(era?.id ?? '');
  const visibleEntityIds = new Set(visibleEntities.map((item) => item.id));
  const visibleRouteIds = new Set(dataset.campaigns
    .filter((campaign) => campaign.eraId === era?.id)
    .flatMap((campaign) => campaign.routeIds ?? []));
  const visibleRoutes = dataset.routes.filter((route) => visibleRouteIds.has(route.id)
    && route.worldspaceId === worldspace?.id);
  const visibleSpatialStates = dataset.spatialStates.filter((state) => state.eraId === era?.id
    && visibleEntityIds.has(state.entityId)
    && state.worldspaceId === worldspace?.id);
  if (!era || !mapState || !worldspace) {
    return <main className="empty-state">No validated era fixture is available.</main>;
  }

  const permittedGeometryIds = new Set([
    ...visibleRoutes.map((route) => route.geometryId),
    ...visibleSpatialStates.flatMap((state) => state.geometryId ? [state.geometryId] : []),
    ...visibleBattles.flatMap((item) => item.geometryId ? [item.geometryId] : []),
  ]);
  const activeGeometryIds = new Set([...mapState.geometryIds, ...permittedGeometryIds]);
  const features = [...activeGeometryIds].flatMap((id) =>
    staticLoreRepository.getGeometry(id)?.features.filter((feature) => feature.id === id) ?? []);
  const allGeometry = adaptGeometry(
    { type: 'FeatureCollection', features },
    worldspace.coordinateSystem,
    10,
    mapState.terrainTextureAsset ? 6.67 : 10,
  );
  const geometry = allGeometry;
  if (storylineMode && !validStoryline) return <Navigate to="/storylines" replace />;
  if (storyTourMode && (!validStoryTour || !storyTour)) return <Navigate to={storyTour ? `/tours/${storyTour.slug}` : '/tours'} replace />;
  if (params.get('tour') !== 'full' && params.get('tour') !== 'era' && !storylineMode && !storyTourMode) {
    return <Navigate to={`/tours/eras/${era.slug}`} replace />;
  }

  return (
    <main className={`atlas-layout${immersive ? ' is-story-active' : ''}`}>
      <section className="map-stage" aria-label="Atlas map workspace">
        {immersive && (
          <header className="story-world-header">
            <div><p className="eyebrow">Azerothium · Unofficial fan atlas{storyline && ` · ${storyline.contentStatus} story`}</p><strong>{storyline?.title ?? era.name}</strong></div>
            <div className="story-world-actions">
            <div ref={setVoiceControlsHost} />
            <button type="button" onClick={() => {
              navigate(storyTourMode && storyTour ? `/tours/${storyTour.slug}` : storylineMode && storyline ? `/storylines/${storyline.slug}` : '/tours', { replace: true });
              endStoryGuide();
            }}>Leave tour</button>
            </div>
          </header>
        )}
        <MapViewport3D
          immersive={immersive}
          readOnly
          battles={visibleBattles}
          entities={visibleEntities}
          fallbackDossierPath="/archive"
          geometry={geometry}
          routeRecords={visibleRoutes}
          spatialStates={visibleSpatialStates}
          terrainAsset={mapState.terrainAsset}
          terrainTextureAsset={mapState.terrainTextureAsset}
          terrainHeightAsset={mapState.terrainHeightAsset}
          presentation={mapState.presentation}
          cartographyLabel={mapState.cartographyLabel}
        />
        {mapState.geometryIds.length === 0
          && visibleBattles.length === 0
          && visibleSpatialStates.length === 0 && (
          <section className="map-research-state" aria-live="polite">
            <p className="eyebrow">Cartography research queued</p>
            <h2>{era.name}</h2>
            <p>The era is selectable now. Its terrain, people, places, conflicts, and guided story will be added through the reviewed era build plan.</p>
          </section>
        )}
        {guideId && (
          <div className="story-overlay">
            <StoryGuidePanel guideId={guideId} showLauncher={false} voiceControlsHost={voiceControlsHost} />
          </div>
        )}
      </section>

      <div className="timeline" aria-label="Era timeline">
        <span className="timeline-dot" />
        <strong>{era.name}</strong>
        <span>{era.dateLabel}</span>
      </div>
    </main>
  );
}
