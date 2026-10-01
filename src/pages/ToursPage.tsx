import { FullTourButton, TourSections } from '../components/story/TourNavigation';
import { Link, useSearchParams } from 'react-router-dom';
import { staticLoreRepository } from '../domain/repositories/StaticLoreRepository';
import { StorylineLibraryPage } from './StorylineLibraryPage';

export function ToursPage() {
  const [params] = useSearchParams();
  if (params.get('view') === 'storylines') return <StorylineLibraryPage />;
  const eras = staticLoreRepository.listEras();
  return <main className="tour-library">
    <header className="tour-library-header"><p className="eyebrow">Choose your journey</p><h1>Tours</h1><p>Explore history by era, follow an independent story atlas, or travel the era chronology.</p><FullTourButton /></header>
    <TourSections />
    <section className="story-tour-feature" aria-labelledby="story-tour-feature-title">
      <div><p className="eyebrow">Independent story atlas</p><h2 id="story-tour-feature-title">Classic to Wrath</h2><p>Choose Kalimdor, the Eastern Kingdoms, Northrend, or the separate Outland fragment. Open a story placard or play the completed tales in chronological order.</p></div>
      <Link className="tour-primary" to="/tours/classic-to-wrath">Explore the Classic to Wrath story map <span aria-hidden="true">→</span></Link>
    </section>
    <section className="era-tour-list" aria-label="Era tours">{eras.map((era) => <Link className="era-tour-card" key={era.id} to={`/tours/eras/${era.slug}`}>
      <span className="eyebrow">Era {era.order}</span><div><h2>{era.name}</h2><p>{era.summary}</p><small>{staticLoreRepository.listStorylinesForEra(era.id).length} connected stories</small></div><span aria-hidden="true">→</span>
    </Link>)}</section>
  </main>;
}
