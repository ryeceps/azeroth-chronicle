import { Link, useNavigate, useParams } from 'react-router-dom';
import { staticLoreRepository } from '../domain/repositories/StaticLoreRepository';
import { StorylineCard } from '../components/story/StorylineCard';
import { beginStoryGuide, endStoryGuide } from '../lib/story/storyRuntime';
import { useEraStore } from '../app/state/eraStore';
import { NotFound } from './EraPage';
import { eraTourOffshoots } from '../lib/story/eraTour';

export function EraTourPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const era = staticLoreRepository.findEraBySlug(slug ?? '');
  if (!era) return <NotFound />;
  const stories = eraTourOffshoots(staticLoreRepository.listStorylinesForEra(era.id)).sort((a, b) => Number(Boolean(b.storyGuideId)) - Number(Boolean(a.storyGuideId)) || a.title.localeCompare(b.title));
  return <main className="tour-library era-tour-entry">
    <Link to="/tours">← Era tours</Link>
    <header className="tour-library-header"><p className="eyebrow">Era {era.order} · {era.dateLabel}</p><h1>{era.name}</h1><p>{era.summary}</p>
      <div className="tour-entry-actions"><button className="tour-primary" disabled={!era.storyGuideId} onClick={() => {
        if (!era.storyGuideId) return;
        endStoryGuide(); useEraStore.getState().setEra(era.id); beginStoryGuide(era.storyGuideId);
        navigate(`/map?era=${era.slug}&tour=era`);
      }}>Tour this era</button><Link to={`/eras/${era.slug}`}>Read the era history</Link></div>
    </header>
    <section aria-labelledby="offshoot-title"><p className="eyebrow">Offshoots of this age</p><h2 id="offshoot-title">Connected storylines</h2><p className="tour-note">These stories reach into this era. Playable journeys and source-led previews are marked below.</p>
      {stories.length ? <div className="storyline-grid">{stories.map((storyline) => <StorylineCard key={storyline.id} storyline={storyline} eras={staticLoreRepository.listEras()} />)}</div> : <p>Storylines for this age are still being gathered.</p>}
    </section>
  </main>;
}
