import { useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useEraStore } from '../app/state/eraStore';
import { staticLoreRepository } from '../domain/repositories/StaticLoreRepository';
import type { StoryTour } from '../domain/types/lore';
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
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [touchStoryId, setTouchStoryId] = useState<string>();
  const touchPointer = useRef(false);
  const tour = staticLoreRepository.findStoryTourBySlug(slug);
  if (!tour) return <NotFound />;

  const dataset = staticLoreRepository.getDataset();
  const entries = [...tour.entries].sort((a, b) => a.order - b.order);
  const storylines = entries.map((entry) => ({
    entry,
    storyline: dataset.storylines.find((item) => item.id === entry.storylineId)!,
  }));
  const touchStory = storylines.find(({ storyline }) => storyline.id === touchStoryId);
  const stops = storyTourItinerary(dataset, tour);
  const complete = params.get('complete') === '1';
  const mapImage = `${import.meta.env.BASE_URL}${tour.mapAsset}`;

  const startStory = (storylineId: string) => {
    const first = stops.find((stop) => stop.storylineSlug === dataset.storylines.find((item) => item.id === storylineId)?.slug);
    if (!first) return;
    useEraStore.getState().setEra(first.eraId);
    beginStoryGuide(first.guideId, first.nodeId, 'playing');
    navigate(storyTourStoryUrl(tour, first));
  };

  return (
    <main className="story-tour-page">
      <header className="story-tour-controls">
        <div className="story-tour-title">
          <p className="eyebrow">{storylines.length} story locations · {tour.contentStatus}</p>
          <h1>{tour.title}</h1>
        </div>
        <button type="button" className="tour-primary" disabled={!stops.length} onClick={() => playTour(tour, navigate)}>
          Play all stories <span aria-hidden="true">→</span>
        </button>
        {complete && <p className="story-tour-complete" role="status">The chronicle is complete. Choose a marker to begin another story.</p>}
      </header>

      <p id="story-tour-map-context" className="story-tour-sr-only">{tour.mapAlt} {tour.mapInterpretationNote}</p>
      <section className="story-tour-map-section" aria-label={`${tour.title} story map`} aria-describedby="story-tour-map-context">
        <div className="story-tour-map-frame">
          <div className="story-tour-map-art">
            <img className="story-tour-map-image" src={mapImage} alt={tour.mapAlt} />
            <div className="story-tour-markers" aria-label="Stories in chronological order">
            {storylines.map(({ entry, storyline }, index) => {
              const playable = Boolean(storyline.storyGuideId);
              const first = stops.find((stop) => stop.storylineSlug === storyline.slug);
              const touchExpanded = touchStoryId === storyline.id;
              const cardAlign = entry.mapPositionPercent[0] < 30 ? 'start' : entry.mapPositionPercent[0] > 72 ? 'end' : 'center';
              const cardPlacement = entry.mapPositionPercent[1] < 28 ? 'below' : 'above';
              const readLabel = playable ? 'Read account and sources' : 'Read story preview';
              const openStory = () => {
                if (!playable) {
                  navigate(`/storylines/${storyline.slug}?fromTour=${tour.slug}`);
                  return;
                }
                if (first) startStory(storyline.id);
              };
              return <div
                key={storyline.id}
                className={`story-tour-marker${touchExpanded ? ' is-touch-expanded' : ''}`}
                style={{ left: `${entry.mapPositionPercent[0]}%`, top: `${entry.mapPositionPercent[1]}%` }}
                data-card-align={cardAlign}
                data-card-placement={cardPlacement}
                onPointerDown={(event) => { touchPointer.current = event.pointerType === 'touch'; }}
                onPointerLeave={() => { touchPointer.current = false; }}
              >
                <button
                  type="button"
                  className={`story-tour-dot${playable ? '' : ' is-preview'}`}
                  aria-label={`${String(index + 1).padStart(2, '0')}. ${entry.periodLabel}: ${storyline.title}. ${entry.locationLabel}. ${playable ? 'Playable story.' : 'Research preview.'} ${storyline.summary}`}
                  aria-describedby={`story-tour-tip-${storyline.id}`}
                  onClick={() => {
                    if (touchPointer.current || window.matchMedia('(pointer: coarse)').matches) {
                      if (!touchExpanded) {
                        setTouchStoryId(storyline.id);
                        return;
                      }
                    }
                    openStory();
                  }}
                >
                  <span className="story-tour-dot-number">{String(index + 1).padStart(2, '0')}</span>
                  <span className="story-tour-sr-only">{storyline.title}</span>
                </button>
                <article className="story-tour-tooltip" id={`story-tour-tip-${storyline.id}`}>
                  <p className="eyebrow">{entry.periodLabel} · {playable ? 'Playable story' : 'Research preview'}</p>
                  <h3>{storyline.title}</h3>
                  <p className="story-tour-location">{entry.locationLabel}</p>
                  <p className="story-tour-tooltip-summary">{storyline.summary}</p>
                  {playable && first
                    ? <button type="button" className="tour-primary" onClick={() => startStory(storyline.id)}>Play story</button>
                    : <Link to={`/storylines/${storyline.slug}?fromTour=${tour.slug}`}>{readLabel}</Link>}
                </article>
              </div>;
            })}
            </div>
          </div>
        </div>
        {touchStory && <article className="story-tour-touch-card" aria-live="polite">
          <button type="button" className="story-tour-touch-card-close" aria-label="Close story preview" onClick={() => setTouchStoryId(undefined)}>×</button>
          <div>
            <p className="eyebrow">{touchStory.entry.periodLabel} · {touchStory.storyline.storyGuideId ? 'Playable story' : 'Research preview'}</p>
            <h3>{touchStory.storyline.title}</h3>
            <p className="story-tour-location">{touchStory.entry.locationLabel}</p>
            <p>{touchStory.storyline.summary}</p>
          </div>
          {touchStory.storyline.storyGuideId
            ? <button type="button" className="tour-primary" onClick={() => startStory(touchStory.storyline.id)}>Play story</button>
            : <Link to={'/storylines/' + touchStory.storyline.slug + '?fromTour=' + tour.slug}>Read story preview</Link>}
        </article>}
      </section>
    </main>
  );
}
