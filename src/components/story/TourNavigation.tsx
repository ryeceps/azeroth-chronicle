import { Link, useNavigate } from 'react-router-dom';
import { staticLoreRepository } from '../../domain/repositories/StaticLoreRepository';
import { useEraStore } from '../../app/state/eraStore';
import { beginStoryGuide, endStoryGuide } from '../../lib/story/storyRuntime';
import { fullTourItinerary, fullTourUrl } from '../../lib/story/fullTour';
export function TourSections({ storylines = false }: { storylines?: boolean }) {
  return <nav className="tour-sections" aria-label="Tour sections">
    <Link to="/tours" aria-current={!storylines ? 'page' : undefined}>Eras</Link>
    <Link to="/tours?view=storylines" aria-current={storylines ? 'page' : undefined}>Storylines</Link>
  </nav>;
}

export function FullTourButton() {
  const navigate = useNavigate();
  const first = fullTourItinerary(staticLoreRepository.getDataset())[0];
  return <button className="tour-secondary" disabled={!first} onClick={() => {
    if (!first) return;
    endStoryGuide(); useEraStore.getState().setEra(first.eraId); beginStoryGuide(first.guideId);
    navigate(fullTourUrl(first));
  }}>Begin the full tour →</button>;
}

