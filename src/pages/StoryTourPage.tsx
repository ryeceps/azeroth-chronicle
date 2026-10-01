import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useEraStore } from '../app/state/eraStore';
import { staticLoreRepository } from '../domain/repositories/StaticLoreRepository';
import type { StoryTour, StoryTourRegion } from '../domain/types/lore';
import { beginStoryGuide } from '../lib/story/storyRuntime';
import { storyTourItinerary, storyTourPlayAllUrl, storyTourStoryUrl } from '../lib/story/storyTour';
import { NotFound } from './EraPage';

function playTour(tour: StoryTour, navigate: ReturnType<typeof useNavigate>) {
  const first = storyTourItinerary(staticLoreRepository.getDataset(), tour)[0];
  if (!first) return;
  useEraStore.getState().setEra(first.eraId);
  beginStoryGuide(first.guideId, first.nodeId, 'playing');
  navigate(storyTourPlayAllUrl(tour, first));
}

export function StoryTourPage() {
  const { slug = '' } = useParams();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const tour = staticLoreRepository.findStoryTourBySlug(slug);
  if (!tour) return <NotFound />;

  const dataset = staticLoreRepository.getDataset();
  const eras = staticLoreRepository.listEras();
  const entries = [...tour.entries].sort((a, b) => a.order - b.order);
  const storylines = entries.map((entry) => ({
    entry,
    storyline: dataset.storylines.find((item) => item.id === entry.storylineId)!,
  }));
  const playableCount = storylines.filter(({ storyline }) => Boolean(storyline.storyGuideId)).length;
  const stops = storyTourItinerary(dataset, tour);
  const regionId = params.get('region');
  const selectedRegion = tour.regions.find((region) => region.id === regionId);
  const visibleStories = storylines.filter(({ entry }) => !selectedRegion || entry.regionIds.includes(selectedRegion.id));
  const complete = params.get('complete') === '1';
  const mapImage = `${import.meta.env.BASE_URL}${tour.mapAsset}`;

  const selectRegion = (nextRegionId?: string) => setParams((previous) => {
    const next = new URLSearchParams(previous);
    if (nextRegionId) next.set('region', nextRegionId);
    else next.delete('region');
    next.delete('complete');
    return next;
  }, { replace: true });

  const startStory = (storylineId: string) => {
    const first = stops.find((stop) => stop.storylineSlug === dataset.storylines.find((item) => item.id === storylineId)?.slug);
    if (!first) return;
    useEraStore.getState().setEra(first.eraId);
    beginStoryGuide(first.guideId, first.nodeId, 'playing');
    navigate(storyTourStoryUrl(tour, first));
  };

  const regionCount = (region: StoryTourRegion) => storylines.filter(({ entry }) => entry.regionIds.includes(region.id)).length;

  return (
    <main className="story-tour-page">
      <nav className="story-tour-breadcrumbs" aria-label="Breadcrumb"><Link to="/tours">Tours</Link><span aria-hidden="true">/</span><span>{tour.title}</span></nav>
      <header className="story-tour-header">
        <div>
          <p className="eyebrow">Chronicle atlas · {tour.contentStatus}</p>
          <h1>{tour.title}</h1>
          <p className="story-tour-edition">{tour.editionLabel}</p>
          <p className="story-tour-summary">{tour.summary}</p>
        </div>
        <aside className="story-tour-play-all">
          <p className="eyebrow">One chronological passage</p>
          <button type="button" className="tour-primary" disabled={!stops.length} onClick={() => playTour(tour, navigate)}>
            Play all chronologically <span aria-hidden="true">→</span>
          </button>
          <p>{playableCount} playable {playableCount === 1 ? 'story' : 'stories'} · {storylines.length - playableCount} research {storylines.length - playableCount === 1 ? 'preview' : 'previews'}</p>
        </aside>
      </header>

      {complete && <p className="story-tour-complete" role="status">The chronicle is complete. Choose another land or begin the full sequence again.</p>}

      <section className="story-tour-map-section" aria-labelledby="story-tour-map-title">
        <div className="story-tour-section-heading">
          <div><p className="eyebrow">Choose a land</p><h2 id="story-tour-map-title">The world in Wrath</h2></div>
          <button type="button" className="story-tour-filter" aria-pressed={!selectedRegion} onClick={() => selectRegion()}>All stories</button>
        </div>
        <div className="story-tour-map-frame">
          <img src={mapImage} alt={tour.mapAlt} />
          {tour.regions.map((region) => {
            const count = regionCount(region);
            const active = selectedRegion?.id === region.id;
            return <button
              key={region.id}
              type="button"
              className={`story-tour-region${active ? ' is-active' : ''}`}
              data-kind={region.kind}
              style={{ left: `${region.layoutPercent[0]}%`, top: `${region.layoutPercent[1]}%` }}
              aria-label={`${region.accessibleDescription} ${count} ${count === 1 ? 'story' : 'stories'}.`}
              aria-pressed={active}
              onClick={() => selectRegion(region.id)}
            >
              <span>{region.title}</span><small>{count ? `${count} ${count === 1 ? 'story' : 'stories'}` : 'Explore'}</small>
            </button>;
          })}
          <span className="story-tour-map-caption">{selectedRegion ? `${selectedRegion.title} · ${selectedRegion.worldspaceId === 'outland' ? 'separate worldspace' : 'Azeroth'}` : 'Wrath-era Azeroth · Outland inset'}</span>
        </div>
        <p className="story-tour-map-note">{tour.mapInterpretationNote}</p>
      </section>

      <section className="story-tour-stories" aria-labelledby="story-tour-stories-title" aria-live="polite">
        <div className="story-tour-section-heading">
          <div><p className="eyebrow">Chronological placards</p><h2 id="story-tour-stories-title">{selectedRegion ? `Stories from ${selectedRegion.title}` : 'Stories across the expansions'}</h2></div>
          <span>{visibleStories.length} {visibleStories.length === 1 ? 'story' : 'stories'}</span>
        </div>
        {visibleStories.length ? <ol className="story-tour-placards">
          {visibleStories.map(({ entry, storyline }, index) => {
            const primaryEra = eras.find((era) => era.id === storyline.primaryEraId);
            const playable = Boolean(storyline.storyGuideId);
            const first = stops.find((stop) => stop.storylineSlug === storyline.slug);
            return <li key={storyline.id}>
              <article className="story-tour-placard">
                <span className="story-tour-number">{String(index + 1).padStart(2, '0')}</span>
                <div className="story-tour-placard-copy">
                  <p className="eyebrow">{entry.periodLabel} · {playable ? 'Playable story' : 'Research preview'}</p>
                  <h3>{storyline.title}</h3>
                  <p className="story-tour-location">{entry.locationLabel}</p>
                  <p>{storyline.summary}</p>
                  <p className="story-tour-status">{storyline.contentStatus} · {primaryEra?.name ?? 'Era under review'}</p>
                </div>
                <div className="story-tour-placard-actions">
                  {playable && first && <button type="button" className="tour-primary" onClick={() => startStory(storyline.id)}>Play story</button>}
                  <Link to={`/storylines/${storyline.slug}?fromTour=${tour.slug}`}>{playable ? 'Read account and sources' : 'Read story preview'}</Link>
                </div>
              </article>
            </li>;
          })}
        </ol> : <div className="storyline-empty"><h3>No story placards yet</h3><p>New stories for this region will appear here after their source-led previews are authored.</p></div>}
      </section>

      <details className="story-tour-order-note">
        <summary>About the route and review status</summary>
        <p>{tour.chronologyNote}</p>
        <p>{tour.reviewNote}</p>
      </details>
    </main>
  );
}
