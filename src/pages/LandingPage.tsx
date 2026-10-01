import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useEraStore } from '../app/state/eraStore';
import { staticLoreRepository } from '../domain/repositories/StaticLoreRepository';
import { beginStoryGuide, endStoryGuide } from '../lib/story/storyRuntime';
import { fullTourItinerary, fullTourUrl } from '../lib/story/fullTour';

export function LandingPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const first = fullTourItinerary(staticLoreRepository.getDataset())[0];
  return <main className="landing-page">
    <div className="landing-quiet-sky" aria-hidden="true" style={{ backgroundImage: `radial-gradient(ellipse at 50% 28%, #1a303941, transparent 65%), linear-gradient(#070d13cc, #05070af5), url(${import.meta.env.BASE_URL}textures/cosmos/cosmic-origins-map-research/cosmic-field.research.webp)`, backgroundPosition: 'center', backgroundSize: 'cover' }} />
    <section className="landing-hero" aria-labelledby="landing-title">
      <p className="eyebrow">Azerothium</p>
      <h1 id="landing-title">Every age leaves a story.</h1>
      <p className="landing-lede">Journey through the eras of Azeroth, and follow the stories woven through them.</p>
      {params.get('tour') === 'complete' && <p role="status" className="landing-tour-complete">You have reached the end of the full tour.</p>}
      {params.get('tour') === 'era-complete' && <p role="status" className="landing-tour-complete">That era’s story is complete.</p>}
      <div className="landing-actions">
        <Link className="tour-primary" to="/tours">Explore tours <span aria-hidden="true">→</span></Link>
        <button className="tour-secondary" type="button" disabled={!first} onClick={() => {
          if (!first) return;
          endStoryGuide(); useEraStore.getState().setEra(first.eraId); beginStoryGuide(first.guideId);
          navigate(fullTourUrl(first));
        }}>Full tour of the history</button>
      </div>
      <p className="landing-caption">One continuous journey · eras and playable storylines</p>
    </section>
  </main>;
}
