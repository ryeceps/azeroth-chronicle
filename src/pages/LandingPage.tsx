import { Link, useSearchParams } from 'react-router-dom';
import { staticLoreRepository } from '../domain/repositories/StaticLoreRepository';
import { FullTourButton } from '../components/story/TourNavigation';
import { fullTourDurationMs, fullTourItinerary } from '../lib/story/fullTour';
import { formatDurationEstimate } from '../lib/story/storyDuration';

export function LandingPage() {
  const [params] = useSearchParams();
  const dataset = staticLoreRepository.getDataset();
  const itinerary = fullTourItinerary(dataset);
  const first = itinerary[0];
  const duration = formatDurationEstimate(fullTourDurationMs(dataset, itinerary));
  return <main className="landing-page">
    <div className="landing-quiet-sky" aria-hidden="true" style={{ backgroundImage: "radial-gradient(ellipse at 50% 28%, #1a303941, transparent 65%), linear-gradient(#070d13cc, #05070af5), url(" + import.meta.env.BASE_URL + "textures/cosmos/cosmic-origins-map-research/cosmic-field.research.webp)", backgroundPosition: "center", backgroundSize: "cover" }} />
    <section className="landing-hero" aria-labelledby="landing-title">
      <p className="eyebrow">Azerothium · An unofficial fan atlas</p>
      <h1 id="landing-title">Start with the ages.<br />Stay for the stories.</h1>
      <p className="landing-lede">Travel through every era, then continue into the playable storylines that unfold within them.</p>
      {params.get("tour") === "complete" && <p role="status" className="landing-tour-complete">You have reached the end of the Mega Tour.</p>}
      {params.get("tour") === "era-complete" && <p role="status" className="landing-tour-complete">That era’s story is complete.</p>}
      <div className="landing-actions">
        <article className="landing-choice landing-choice-featured">
          <p className="eyebrow">The complete journey</p>
          <FullTourButton className="tour-primary landing-choice-button" />
          <p className="landing-time-estimate">Estimated {duration} · era tours, then storylines</p>
        </article>
        <article className="landing-choice">
          <p className="eyebrow">Choose your route</p>
          <Link className="tour-secondary landing-choice-button" to="/tours"><span>Explore maps &amp; era tours</span><span aria-hidden="true">→</span></Link>
          <p className="landing-choice-copy">Open the Classic to Wrath story map or choose an individual era tour.</p>
        </article>
      </div>
      {!first && <p className="landing-tour-complete" role="status">Guided tours are being prepared.</p>}
    </section>
  </main>;
}
