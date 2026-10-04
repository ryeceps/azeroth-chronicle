import { FullTourButton, TourSections } from '../components/story/TourNavigation';
import { Link, useSearchParams } from 'react-router-dom';
import { StorylineCard } from '../components/story/StorylineCard';
import { staticLoreRepository } from '../domain/repositories/StaticLoreRepository';

export function StorylineLibraryPage() {
  const [params] = useSearchParams();
  const eras = staticLoreRepository.listEras();
  const selectedEra = eras.find((era) => era.slug === params.get('era'));
  const storylines = selectedEra
    ? staticLoreRepository.listStorylinesForEra(selectedEra.id)
    : staticLoreRepository.listStorylines();
  const ordered = [...storylines].sort((a, b) =>
    Number(Boolean(b.storyGuideId)) - Number(Boolean(a.storyGuideId))
    || (eras.find((era) => era.id === a.primaryEraId)?.order ?? 99)
      - (eras.find((era) => era.id === b.primaryEraId)?.order ?? 99)
    || a.title.localeCompare(b.title));

  return (
    <main className="storyline-library">
      <header className="tour-library-header"><p className="eyebrow">Choose your journey</p><h1>Tours</h1><p>Journeys, wars, and lives woven through the eras.</p><FullTourButton /></header>
      <TourSections storylines />
      <p className="tour-note">The storyline archive covers ancient history through Wrath of the Lich King. Playable journeys are marked below. Research previews contain chapter outlines and sources.</p>

      <nav className="storyline-era-nav" aria-label="Filter storylines by era">
        <Link className={!selectedEra ? 'active' : ''} to="/tours?view=storylines" aria-current={!selectedEra ? 'page' : undefined}>All eras</Link>
        {eras.map((era) => {
          const active = selectedEra?.id === era.id;
          const count = staticLoreRepository.listStorylinesForEra(era.id).length;
          return <Link key={era.id} className={active ? 'active' : ''} to={`/tours?view=storylines&era=${era.slug}`} aria-current={active ? 'page' : undefined}>Era {era.order}<small>{count}</small></Link>;
        })}
      </nav>

      <section className="storyline-library-results" aria-live="polite">
        <div className="storyline-results-heading">
          <div>
            <p className="eyebrow">{selectedEra ? `Era ${selectedEra.order} · ${selectedEra.name}` : 'The storyline library'}</p>
            <h2>{selectedEra ? `Stories connected to ${selectedEra.name}` : 'All storylines'}</h2>
          </div>
          <span>{ordered.length} {ordered.length === 1 ? 'story' : 'stories'}</span>
        </div>
        {ordered.length > 0 ? (
          <div className="storyline-grid">{ordered.map((storyline) => <StorylineCard key={storyline.id} storyline={storyline} eras={eras} />)}</div>
        ) : (
          <div className="storyline-empty"><h3>Stories are being researched for this era.</h3><p>The era tour is available while its long-form storylines are gathered.</p><Link to={`/tours/eras/${selectedEra?.slug ?? ''}`}>Choose this era’s tour</Link></div>
        )}
      </section>
    </main>
  );
}
