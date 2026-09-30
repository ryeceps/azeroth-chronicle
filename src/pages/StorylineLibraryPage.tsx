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
    Number(b.id === 'scepter-of-the-shifting-sands') - Number(a.id === 'scepter-of-the-shifting-sands')
    || (eras.find((era) => era.id === a.primaryEraId)?.order ?? 99)
      - (eras.find((era) => era.id === b.primaryEraId)?.order ?? 99)
    || a.title.localeCompare(b.title));

  return (
    <main className="storyline-library">
      <section className="storyline-library-hero">
        <p className="eyebrow">Azerothium · Stories within the ages</p>
        <h1>Follow the histories within history.</h1>
        <p>Wars, quests, and lives stretch across the era timeline. Choose an era to find the longer stories connected to it, then open a chapter outline and the sources guiding its review.</p>
        <p className="storyline-research-label">These are source-led research previews. Finished guided tours will follow editorial review.</p>
      </section>

      <nav className="storyline-era-nav" aria-label="Filter storylines by era">
        <Link className={!selectedEra ? 'active' : ''} to="/storylines" aria-current={!selectedEra ? 'page' : undefined}>All eras</Link>
        {eras.map((era) => {
          const active = selectedEra?.id === era.id;
          const count = staticLoreRepository.listStorylinesForEra(era.id).length;
          return <Link key={era.id} className={active ? 'active' : ''} to={`/storylines?era=${era.slug}`} aria-current={active ? 'page' : undefined}>Era {era.order}<small>{count}</small></Link>;
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
          <div className="storyline-empty"><h3>Stories are being researched for this era.</h3><p>The era tour is available while its long-form storylines are gathered.</p><Link to={`/?era=${selectedEra?.slug ?? ''}`}>Choose this era’s tour</Link></div>
        )}
      </section>
    </main>
  );
}
