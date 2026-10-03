import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadDataset } from '../../src/lib/lore/loadDataset';

const gameplayFraming = /\b(?:quests?|questlines?|quest[- ]chains?|players?|gameplay|loot|attunements?|reputation[- ]gates?|raid[- ](?:gates?|entry|unlocks?)|dungeon[- ]runs?|game[- ](?:versions?|systems?)|version history|collection objectives?|repeatable mechanics?)\b/i;
const editorialFraming = /\b(?:the (?:quest|game|source|manual) (?:says|records|requires|establishes)|this (?:telling|scene|story) (?:shows|keeps|does not)|editorial itinerary|source[- ]supported|canonical (?:player|adventurer|heir))\b/i;
const normalize = (text: string) => text.replace(/\s+/g, ' ').trim();

describe('historical story prose', () => {
  it('keeps gameplay and editorial framing outside all public storyline prose', () => {
    const data = loadDataset();
    const fields = [
      ...data.storyNodes.map(node => ({ id: node.id, text: `${node.title} ${node.narration}` })),
      ...data.storyGuides.map(guide => ({ id: guide.id, text: `${guide.title} ${guide.description}` })),
      ...data.mapStates.map(state => ({ id: state.id, text: state.cartographyLabel ?? '' })),
      ...data.storylines.map(story => ({
        id: story.id,
        text: [story.title, story.summary, story.opening, ...story.chapters.map(chapter => `${chapter.title} ${chapter.body}`)].join(' '),
      })),
    ];
    for (const field of fields) {
      expect(field.text, field.id).not.toMatch(gameplayFraming);
      expect(field.text, field.id).not.toMatch(editorialFraming);
    }
  });

  it('gives text-first readers the same ordered story as playable narration', () => {
    const data = loadDataset();
    for (const story of data.storylines.filter(story => story.storyGuideId)) {
      const guide = data.storyGuides.find(guide => guide.id === story.storyGuideId)!;
      const transcript = guide.nodeIds.map(id => data.storyNodes.find(node => node.id === id)!.narration).join(' ');
      expect(normalize(story.chapters.map(chapter => chapter.body).join(' ')), story.id).toBe(normalize(transcript));
    }
  });

  it('matches every spoken transcript to its actual recording and manifest metadata', () => {
    const data = loadDataset();
    const manifest = JSON.parse(readFileSync(resolve('public/audio/guided/manifest.json'), 'utf8')) as {
      tracks: { nodeId: string; assetPath: string; bytes: number; sha256: string; transcriptSha256: string; durationMs: number }[];
    };
    expect(manifest.tracks).toHaveLength(data.storyNodes.length);
    for (const node of data.storyNodes) {
      const track = manifest.tracks.find(track => track.nodeId === node.id)!;
      expect(track, node.id).toBeDefined();
      expect(track.transcriptSha256, node.id).toBe(createHash('sha256').update(node.narration).digest('hex'));
      expect(track.assetPath, node.id).toBe(node.voiceover?.assetPath);
      expect(track.durationMs, node.id).toBe(node.voiceover?.durationMs);
      const bytes = readFileSync(resolve('public', track.assetPath));
      expect(bytes.length, node.id).toBe(track.bytes);
      expect(createHash('sha256').update(bytes).digest('hex'), node.id).toBe(track.sha256);
    }
  });
});
