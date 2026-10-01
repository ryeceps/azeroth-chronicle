import type { Battle, Era, LoreDataset, LoreEntity, LoreEvent, StoryGuide, StoryNode, Storyline, StoryTour } from '../types/lore';
import type { GeoJsonFeatureCollection } from '../../lib/map/geometryAdapter';
import type { SearchEntry, SearchOptions } from '../../lib/search/searchIndex';
import type { ArchiveEntry } from '../types/archive';

export interface LoreRepository {
  getDataset(): LoreDataset;
  listEras(): Era[];
  findEraBySlug(slug: string): Era | undefined;
  findBattleBySlug(slug: string): Battle | undefined;
  findEntityBySlug(slug: string): LoreEntity | undefined;
  findEventBySlug(slug: string): LoreEvent | undefined;
  findStoryGuide(id: string): StoryGuide | undefined;
  findStoryNode(id: string): StoryNode | undefined;
  listStorylinesForEra(eraId: string): Storyline[];
  listStorylines(): Storyline[];
  findStorylineBySlug(slug: string): Storyline | undefined;
  listStoryTours(): StoryTour[];
  findStoryTourBySlug(slug: string): StoryTour | undefined;
  getGeometry(id: string): GeoJsonFeatureCollection | undefined;
  listEntitiesForEra(eraId: string, sourceIds?: string[]): LoreEntity[];
  listBattlesForEra(eraId: string, sourceIds?: string[]): Battle[];
  listArchiveEntries(): ArchiveEntry[];
  search(query: string, options?: SearchOptions): SearchEntry[];
}
