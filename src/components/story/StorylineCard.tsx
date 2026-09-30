import { Link } from 'react-router-dom';
import type { Era, Storyline } from '../../domain/types/lore';

export function StorylineCard({ storyline, eras }: { storyline: Storyline; eras: Era[] }) {
  const relatedEras = storyline.eraIds.flatMap((id) => {
    const era = eras.find((item) => item.id === id);
    return era ? [era] : [];
  });

  return (
    <Link className="storyline-card" to={`/storylines/${storyline.slug}`}>
      <span className="storyline-card-kicker">Storyline · {storyline.contentStatus} preview</span>
      <strong>{storyline.title}</strong>
      <span className="storyline-card-summary">{storyline.summary}</span>
      <span className="storyline-card-bottom">
        <span>{relatedEras.map((era) => `Era ${era.order}`).join(' → ')}</span>
        <span>{storyline.chapters.length} chapters <span aria-hidden="true">↗</span></span>
      </span>
    </Link>
  );
}
