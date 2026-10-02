import type { Storyline } from '../../domain/types/lore';

export function eraTourOffshoots(storylines: Storyline[]): Storyline[] {
  return storylines.filter((storyline) => storyline.showInEraTourOffshoots !== false);
}
