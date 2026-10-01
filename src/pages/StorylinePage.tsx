import { Link, useParams, useSearchParams } from 'react-router-dom';
import { staticLoreRepository } from '../domain/repositories/StaticLoreRepository';
import { storyTourItinerary, storyTourStoryUrl } from '../lib/story/storyTour';
import { NotFound } from './EraPage';

export function StorylinePage() {
  const { slug = '' } = useParams();
  const [params] = useSearchParams();
  const storyline = staticLoreRepository.findStorylineBySlug(slug);
  if (!storyline) return <NotFound />;
  const dataset = staticLoreRepository.getDataset();
  const eras = staticLoreRepository.listEras();
  const primaryEra = eras.find((era) => era.id === storyline.primaryEraId);
  const storyTour = staticLoreRepository.findStoryTourBySlug(params.get('fromTour') ?? '');
  const tourStart = storyTour && storyline.storyGuideId
    ? storyTourItinerary(dataset, storyTour).find((stop) => stop.storylineSlug === storyline.slug)
    : undefined;
  const sources = storyline.sourceIds.flatMap((id) => {
    const source = dataset.sources.find((item) => item.id === id);
    return source ? [source] : [];
  });
  const mapState = dataset.mapStates.find((item) => item.id === primaryEra?.mapStateId);
  const cover = mapState?.terrainTextureAsset ? `${import.meta.env.BASE_URL}${mapState.terrainTextureAsset}` : undefined;

  return (
    <main className="storyline-page">
      <div className="storyline-page-atmosphere" aria-hidden="true" style={cover ? { backgroundImage: `linear-gradient(180deg, rgba(6,8,12,.36), #080b10 92%), url("${cover}")` } : undefined} />
      <div className="storyline-page-content">
        <nav className="storyline-breadcrumbs" aria-label="Breadcrumb">
          <Link to={storyTour ? `/tours/${storyTour.slug}` : '/tours?view=storylines'}>{storyTour ? storyTour.title : 'Storylines'}</Link><span aria-hidden="true">/</span><span>{storyline.title}</span>
        </nav>
        <header className="storyline-page-header">
          <p className="eyebrow">Long-form storyline · {storyline.contentStatus} {storyline.storyGuideId ? 'story' : 'preview'}</p>
          <h1>{storyline.title}</h1>
          <p className="storyline-opening">{storyline.opening}</p>
          <p className="storyline-summary">{storyline.summary}</p>
          {storyline.storyGuideId && primaryEra && <Link className="primary-link" to={storyTour && tourStart ? storyTourStoryUrl(storyTour, tourStart) : `/map?era=${primaryEra.slug}&tour=storyline&storyline=${storyline.slug}`}>Experience this storyline</Link>}
          <div className="storyline-era-links" aria-label="Related eras">
            {storyline.eraIds.map((id) => {
              const era = eras.find((item) => item.id === id);
              return era ? <Link key={id} to={`/eras/${era.slug}`}><small>Era {era.order}</small>{era.name}{id === storyline.primaryEraId && <span>Primary</span>}</Link> : null;
            })}
          </div>
        </header>

        <div className="storyline-reading-layout">
          <aside className="storyline-chapter-nav">
            <p className="eyebrow">In this story</p>
            <ol>{storyline.chapters.map((chapter, index) => <li key={chapter.id}><a href={`#${chapter.id}`}><small>{String(index + 1).padStart(2, '0')}</small>{chapter.title}</a></li>)}</ol>
          </aside>
          <div className="storyline-chapters">
            {storyline.chapters.map((chapter, index) => {
              const era = eras.find((item) => item.id === chapter.eraId);
              return (
                <section id={chapter.id} className="storyline-chapter" key={chapter.id} aria-labelledby={`${chapter.id}-title`}>
                  <p className="eyebrow">Chapter {String(index + 1).padStart(2, '0')} · {era ? `Era ${era.order}` : 'Era under review'}</p>
                  <h2 id={`${chapter.id}-title`}>{chapter.title}</h2>
                  {chapter.body.split('\n\n').map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}
                  {era && <Link className="storyline-chapter-era" to={`/eras/${era.slug}`}>Explore {era.name} <span aria-hidden="true">↗</span></Link>}
                </section>
              );
            })}
            <section className="storyline-source-section" aria-labelledby="storyline-source-title">
              <p className="eyebrow">Evidence and review</p>
              <h2 id="storyline-source-title">Where this account stands</h2>
              <p>{storyline.reviewNote}</p>
              <h3>Source leads</h3>
              {sources.length > 0 ? <ul>{sources.map((source) => <li key={source.id}>{source.url ? <a href={source.url} target="_blank" rel="noreferrer">{source.title} <span aria-hidden="true">↗</span></a> : source.title}</li>)}</ul> : <p>Original quest text is still being gathered for this candidate.</p>}
            </section>
            <div className="storyline-end-links">
              {storyTour && <Link className="primary-link" to={`/tours/${storyTour.slug}`}>Return to the {storyTour.title} map</Link>}
              <Link className="primary-link" to={`/tours?view=storylines&era=${primaryEra?.slug ?? ''}`}>More stories from this era</Link>
              {primaryEra && <Link to={`/tours/eras/${primaryEra.slug}`}>Choose the era tour</Link>}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
