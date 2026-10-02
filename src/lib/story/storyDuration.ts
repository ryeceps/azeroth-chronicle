import type { StoryNode } from '../../domain/types/lore';

export function narrationDurationMs(narration: string): number {
  const words = narration.trim().split(/\s+/).filter(Boolean).length;
  const spokenMs = (words / 82) * 60_000;
  return Math.min(90_000, Math.max(18_000, Math.round(spokenMs / 500) * 500 + 5_000));
}

export function storyNodeDurationMs(node: StoryNode): number {
  return node.durationMs ?? narrationDurationMs(node.narration);
}

export function formatDurationEstimate(durationMs: number): string {
  const totalMinutes = Math.max(0, Math.round(durationMs / 60_000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0 ? hours + " hr " + minutes + " min" : minutes + " min";
}
