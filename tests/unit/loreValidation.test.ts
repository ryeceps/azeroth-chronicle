import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { loadDataset } from '../../src/lib/lore/loadDataset';
import { validateDatasetReferences } from '../../src/lib/lore/validateDataset';
import { geometryIds, loadGeometry } from '../../src/lib/lore/loadGeometry';
import { entityVisibleInEra } from '../../src/lib/lore/eraVisibility';
import { mapStateSchema, spatialStateSchema, storylineSchema } from '../../src/domain/schemas/loreSchemas';

describe('lore dataset', () => {
  it('keeps Era 5 sites on the intended sides of the sea and in source-backed north-south order', () => {
    const point = (id: string): [number, number] => {
      const feature = loadGeometry(id)?.features.find((item) => item.id === id);
      expect(feature?.geometry.type, id).toBe('Point');
      if (feature?.geometry.type !== 'Point') throw new Error(`Missing point: ${id}`);
      return feature.geometry.coordinates as [number, number];
    };
    const hyjal = point('hyjal-era-five-focus-research');
    const secondWell = point('hyjal-second-well-focus-research');
    const nordrassil = point('nordrassil-focus-research');
    const quelthalas = point('quelthalas-focus-research');
    const sunwell = point('sunwell-focus-research');
    const amani = point('amani-focus-research');
    const strom = point('strom-focus-research');
    const ironforge = point('ironforge-focus-research');
    const grimBatol = point('grim-batol-focus-research');
    const thaurissan = point('thaurissan-city-focus-research');

    expect([hyjal, secondWell, nordrassil].every(([x]) => x < 4000)).toBe(true);
    expect(Math.abs(hyjal[0] - secondWell[0])).toBeLessThan(500);
    expect(Math.abs(hyjal[1] - secondWell[1])).toBeLessThan(500);
    expect([quelthalas, sunwell, amani, strom, ironforge, grimBatol, thaurissan]
      .every(([x]) => x >= 7000)).toBe(true);
    expect(sunwell[1]).toBeGreaterThan(quelthalas[1]);
    expect(quelthalas[1]).toBeGreaterThan(strom[1]);
    expect(amani[1]).toBeGreaterThan(strom[1]);
    expect(strom[1]).toBeGreaterThan(grimBatol[1]);
    expect(grimBatol[1]).toBeGreaterThan(ironforge[1]);
    expect(ironforge[1]).toBeGreaterThan(thaurissan[1]);
  });

  it('keeps source-book naming out of guided narration and chapter titles', () => {
    const data = loadDataset();
    for (const node of data.storyNodes) {
      expect(`${node.title} ${node.narration}`, node.id).not.toMatch(/\bchronicle\b/i);
    }
  });

  it('keeps cartographic and production commentary out of the spoken history', () => {
    const data = loadDataset();
    for (const node of data.storyNodes) {
      expect(`${node.title} ${node.narration}`, node.id).not.toMatch(
        /\b(?:atlas|worldspace|interpretive|surveyed|diagram|map|maps)\b|\bworld state\b|\b(?:surviving account|recorded motive|narrative anchor|figure shown|field before you)\b/i,
      );
    }
  });

  it('parses and has no broken cross-record references', () => {
    expect(validateDatasetReferences(loadDataset(), { geometryIds: geometryIds() })).toEqual([]);
  });

  it('keeps all pre-publication records explicitly labeled', () => {
    const data = loadDataset();
    const records = [
      ...data.eras,
      ...data.entities,
      ...data.events,
      ...data.battles,
      ...data.campaigns,
      ...data.routes,
      ...data.storyGuides,
      ...data.storylines,
    ];
    expect(records.every((record) => record.contentStatus === 'research')).toBe(true);
    expect(data.eras).toHaveLength(10);
    expect(data.eras.every((era) => era.contentStatus === 'research')).toBe(true);
  });

  it('contains the complete source-linked Era 1 research baseline', () => {
    const data = loadDataset();
    const era = data.eras.find((item) => item.id === 'black-empire')!;
    const entities = data.entities.filter((item) => entityVisibleInEra(item, era.id, data.eras));
    const events = data.events.filter((item) => item.eraId === era.id);
    const battles = data.battles.filter((item) => item.eraId === era.id);
    const guide = data.storyGuides.find((item) => item.id === era.storyGuideId)!;
    const subjects = [...entities, ...events, ...battles];

    expect(entities).toHaveLength(13);
    expect(events).toHaveLength(4);
    expect(battles).toHaveLength(2);
    expect(guide.nodeIds).toHaveLength(10);
    expect(entities.filter((entity) => entity.type === 'character').every((entity) => Boolean(entity.mapFigure?.asset))).toBe(true);
    expect(['alakir', 'ragnaros', 'therazane', 'neptulon'].every((entityId) =>
      data.spatialStates.some((state) => state.entityId === entityId
        && state.eraId === era.id
        && state.geographicCertainty === 'inferred'
        && Boolean(state.geometryId)),
    )).toBe(true);
    expect(era.featuredEventIds).toEqual([
      'spirit-imbalance',
      'old-gods-arrive',
      'black-empire-rises',
      'black-empire-dominion',
    ]);
    expect(era.featuredBattleIds).toEqual([
      'elemental-wars',
      'elemental-assault-on-black-empire',
    ]);
    expect(subjects.every((subject) =>
      data.claims.some((claim) => claim.subjectId === subject.id && claim.citationIds.length > 0),
    )).toBe(true);
    expect(data.claims.every((claim) => claim.citationIds.every((citationId) =>
      data.citations.some((citation) => citation.id === citationId),
    ))).toBe(true);
  });

  it('contains a complete source-linked Cosmic Origins research slice', () => {
    const data = loadDataset();
    const era = data.eras.find((item) => item.id === 'cosmic-origins')!;
    const mapState = data.mapStates.find((item) => item.id === era.mapStateId)!;
    const entities = data.entities.filter((item) => entityVisibleInEra(item, era.id, data.eras));
    const events = data.events.filter((item) => item.eraId === era.id);
    const guide = data.storyGuides.find((item) => item.id === era.storyGuideId)!;
    const spatialStates = data.spatialStates.filter((item) => item.eraId === era.id);

    expect(era.order).toBe(0);
    expect(era.nextEraId).toBe('black-empire');
    expect(mapState.presentation).toBe('relational');
    expect(mapState.terrainTextureAsset).toBeTruthy();
    expect(mapState.terrainHeightAsset).toBeUndefined();
    expect(mapState.interpretationNote).toMatch(/not canonical cosmic geography/i);
    expect(entities).toHaveLength(10);
    expect(events).toHaveLength(4);
    expect(era.featuredBattleIds).toEqual([]);
    expect(guide.nodeIds).toHaveLength(9);
    expect(entities.filter((entity) => entity.type === 'character').every((entity) => Boolean(entity.mapFigure?.asset))).toBe(true);
    const keyActorIds = ['amanthul', 'pantheon-of-order', 'void-lords', 'old-gods'];
    expect(keyActorIds.every((entityId) => {
      const entity = entities.find((item) => item.id === entityId);
      return Boolean(entity?.mapFigure?.asset ?? entity?.mapVisual?.asset);
    })).toBe(true);
    expect(keyActorIds.every((entityId) => {
      const entity = entities.find((item) => item.id === entityId);
      const asset = entity?.mapFigure?.asset ?? entity?.mapVisual?.asset;
      return Boolean(asset && existsSync(resolve('public', asset)));
    })).toBe(true);
    expect(spatialStates).toHaveLength(10);
    expect(spatialStates.every((state) => state.placementKind === 'relational'
      && state.geographicCertainty === 'unknown'
      && Boolean(state.geometryId)
      && Boolean(state.editorNote))).toBe(true);
    expect([...entities, ...events].every((subject) =>
      data.claims.some((claim) => claim.subjectId === subject.id && claim.citationIds.length > 0),
    )).toBe(true);
    expect(data.eras.find((item) => item.id === 'black-empire')?.previousEraId).toBe(era.id);
    expect(data.relationships).toContainEqual(expect.objectContaining({
      id: 'old-gods-scattered-precedes-azeroth-arrival',
      type: 'precedes',
    }));
  });

  it('contains a complete source-linked Ordering of Azeroth research slice', () => {
    const data = loadDataset();
    const era = data.eras.find((item) => item.id === 'ordering-of-azeroth')!;
    const mapState = data.mapStates.find((item) => item.id === era.mapStateId)!;
    const blackEmpireMapState = data.mapStates.find((item) => item.id === 'black-empire-map-research')!;
    const entities = data.entities.filter((item) => entityVisibleInEra(item, era.id, data.eras));
    const events = data.events.filter((item) => item.eraId === era.id);
    const battles = data.battles.filter((item) => item.eraId === era.id);
    const guide = data.storyGuides.find((item) => item.id === era.storyGuideId)!;
    const nodes = guide.nodeIds.map((nodeId) => data.storyNodes.find((item) => item.id === nodeId)!);
    const spatialStates = data.spatialStates.filter((item) => item.eraId === era.id);

    expect(era.order).toBe(2);
    expect(era.previousEraId).toBe('black-empire');
    expect(era.nextEraId).toBe('ancient-civilizations');
    expect(entities).toHaveLength(20);
    expect(events).toHaveLength(8);
    expect(battles).toHaveLength(1);
    expect(guide.nodeIds).toHaveLength(11);
    expect(spatialStates).toHaveLength(12);
    expect(mapState.presentation).toBe('terrain');
    expect(mapState.terrainTextureAsset).toBeTruthy();
    expect(mapState.terrainHeightAsset).toBeTruthy();
    expect(mapState.terrainTextureAsset).not.toBe(blackEmpireMapState.terrainTextureAsset);
    expect(mapState.interpretationNote).toMatch(/preserves the Era 1 research coastline/i);
    expect(battles[0]).toMatchObject({
      geographicCertainty: 'unknown',
      campaignId: 'titan-forged-ordering-campaign',
    });
    expect(battles[0]?.geometryId).toBeUndefined();
    expect(data.routes.filter((route) => data.campaigns.some((campaign) =>
      campaign.eraId === era.id && campaign.routeIds?.includes(route.id),
    ))).toEqual([]);

    const keyActorIds = [
      'aggramar', 'amanthul', 'pantheon-of-order', 'titan-forged', 'keepers',
      'old-gods', 'yshaarj', 'alakir', 'ragnaros', 'therazane', 'neptulon',
    ];
    expect(keyActorIds.every((entityId) => {
      const entity = entities.find((item) => item.id === entityId);
      const asset = entity?.mapFigure?.asset ?? entity?.mapVisual?.asset;
      return Boolean(asset && existsSync(resolve('public', asset)));
    })).toBe(true);
    expect(['aggramar', 'amanthul', 'yshaarj-central-bastion'].every((entityId) =>
      spatialStates.some((state) => state.entityId === entityId && state.visualPresence === 'contextual'),
    )).toBe(true);
    expect(spatialStates.filter((state) => state.placementKind === 'relational').every((state) =>
      state.geographicCertainty === 'unknown' && Boolean(state.editorNote),
    )).toBe(true);
    expect([...entities, ...events, ...battles].every((subject) =>
      data.claims.some((claim) => claim.subjectId === subject.id && claim.citationIds.length > 0),
    )).toBe(true);
    expect(nodes.slice(0, 6).every((node) => node.visualActions?.some((action) =>
      action.type === 'set_map_state' && action.mapStateId === 'black-empire-map-research'))).toBe(true);
    expect(nodes.slice(6).every((node) => node.visualActions?.some((action) =>
      action.type === 'set_map_state' && action.mapStateId === 'ordering-of-azeroth-map-research'))).toBe(true);
    expect(data.relationships).toContainEqual(expect.objectContaining({
      id: 'ordering-precedes-ancient-civilizations',
      type: 'precedes',
    }));
  });

  it('contains a time-sliced source-linked Ancient Civilizations research preview', () => {
    const data = loadDataset();
    const era = data.eras.find((item) => item.id === 'ancient-civilizations')!;
    const entities = data.entities.filter((item) => entityVisibleInEra(item, era.id, data.eras));
    const events = data.events.filter((item) => item.eraId === era.id);
    const battles = data.battles.filter((item) => item.eraId === era.id);
    const spatialStates = data.spatialStates.filter((item) => item.eraId === era.id);
    const guide = data.storyGuides.find((item) => item.id === era.storyGuideId)!;
    const nodes = guide.nodeIds.map((nodeId) => data.storyNodes.find((item) => item.id === nodeId)!);
    const mapStateIds = [
      'ancient-civilizations-early-map-research',
      'ancient-civilizations-southern-map-research',
      'ancient-civilizations-map-research',
    ];
    const mapStates = mapStateIds.map((id) => data.mapStates.find((item) => item.id === id)!);

    expect(era.order).toBe(3);
    expect(era.previousEraId).toBe('ordering-of-azeroth');
    expect(era.nextEraId).toBe('war-of-the-ancients');
    expect(entities).toHaveLength(19);
    expect(events).toHaveLength(9);
    expect(battles).toHaveLength(1);
    expect(spatialStates).toHaveLength(11);
    expect(guide.nodeIds).toHaveLength(12);
    expect(mapStates.every((state) => state.presentation === 'terrain'
      && Boolean(state.terrainTextureAsset)
      && Boolean(state.terrainHeightAsset)
      && /time slice/i.test(state.cartographyLabel ?? '')
      && Boolean(state.interpretationNote))).toBe(true);
    expect(new Set(mapStates.map((state) => state.terrainTextureAsset))).toEqual(new Set([
      'textures/azeroth/ancient-civilizations-map-research/terrain-atlas.research.webp',
    ]));
    expect(nodes.slice(0, 5).every((node) => node.visualActions?.some((action) =>
      action.type === 'set_map_state' && action.mapStateId === mapStateIds[0]))).toBe(true);
    expect(nodes.slice(5, 9).every((node) => node.visualActions?.some((action) =>
      action.type === 'set_map_state' && action.mapStateId === mapStateIds[1]))).toBe(true);
    expect(nodes.slice(9).every((node) => node.visualActions?.some((action) =>
      action.type === 'set_map_state' && action.mapStateId === mapStateIds[2]))).toBe(true);

    const keyActorIds = [
      'empire-of-zul', 'aqir', 'lei-shen', 'pandaren-ancient', 'kang',
      'dark-trolls', 'kaldorei-empire', 'azshara',
    ];
    expect(keyActorIds.every((entityId) => {
      const entity = entities.find((item) => item.id === entityId);
      const asset = entity?.mapFigure?.asset ?? entity?.mapVisual?.asset;
      return Boolean(asset && existsSync(resolve('public', asset)));
    })).toBe(true);
    expect(keyActorIds.every((entityId) => spatialStates.some((state) =>
      state.entityId === entityId && Boolean(state.editorNote),
    ))).toBe(true);
    expect(battles[0]).toMatchObject({
      id: 'troll-aqir-war',
      geographicCertainty: 'unknown',
      campaignId: 'ancient-kalimdor-conflicts',
    });
    expect(battles[0]?.geometryId).toBeUndefined();
    expect([...events, ...battles].every((subject) =>
      data.claims.some((claim) => claim.subjectId === subject.id && claim.citationIds.length > 0),
    )).toBe(true);
    expect(data.relationships).toContainEqual(expect.objectContaining({
      id: 'azshara-precedes-war-ancients',
      type: 'precedes',
    }));
  });

  it('contains a source-linked War of the Ancients slice with an irreversible world-state transition', () => {
    const data = loadDataset();
    const era = data.eras.find((item) => item.id === 'war-of-the-ancients')!;
    const events = data.events.filter((item) => item.eraId === era.id);
    const battles = data.battles.filter((item) => item.eraId === era.id);
    const spatialStates = data.spatialStates.filter((item) => item.eraId === era.id);
    const guide = data.storyGuides.find((item) => item.id === era.storyGuideId)!;
    const nodes = guide.nodeIds.map((nodeId) => data.storyNodes.find((item) => item.id === nodeId)!);
    const mapStateIds = [
      'war-of-the-ancients-prewar-map-research',
      'war-of-the-ancients-invasion-map-research',
      'war-of-the-ancients-map-research',
    ];
    const mapStates = mapStateIds.map((id) => data.mapStates.find((item) => item.id === id)!);

    expect(era.order).toBe(4);
    expect(era.previousEraId).toBe('ancient-civilizations');
    expect(era.nextEraId).toBe('long-vigil-new-kingdoms');
    expect(events).toHaveLength(8);
    expect(battles).toHaveLength(1);
    expect(spatialStates).toHaveLength(15);
    expect(guide.nodeIds).toHaveLength(12);
    expect(mapStates.every((state) => state.presentation === 'terrain'
      && Boolean(state.terrainTextureAsset)
      && Boolean(state.terrainHeightAsset)
      && Boolean(state.interpretationNote))).toBe(true);
    expect(new Set(mapStates.map((state) => state.terrainTextureAsset))).toEqual(new Set([
      'textures/azeroth/ancient-civilizations-map-research/terrain-atlas.research.webp',
      'textures/azeroth/war-of-the-ancients-invasion-map-research/terrain-atlas.research.webp',
      'textures/azeroth/war-of-the-ancients-sundered-map-research/terrain-atlas.research.webp',
    ]));
    expect(mapStates.every((state) => {
      const texture = state.terrainTextureAsset;
      const height = state.terrainHeightAsset;
      return Boolean(texture && height
        && existsSync(resolve('public', texture))
        && existsSync(resolve('public', height)));
    })).toBe(true);
    expect(nodes.slice(0, 3).every((node) => node.visualActions?.some((action) =>
      action.type === 'set_map_state' && action.mapStateId === mapStateIds[0]))).toBe(true);
    expect(nodes.slice(3, 9).every((node) => node.visualActions?.some((action) =>
      action.type === 'set_map_state' && action.mapStateId === mapStateIds[1]))).toBe(true);
    expect(nodes.slice(9).every((node) => node.visualActions?.some((action) =>
      action.type === 'set_map_state' && action.mapStateId === mapStateIds[2]))).toBe(true);

    const keyActorIds = [
      'azshara', 'highborne', 'sargeras', 'burning-legion', 'night-elf-resistance',
      'malfurion-stormrage', 'tyrande-whisperwind', 'illidan-stormrage', 'cenarius', 'neltharion',
    ];
    expect(keyActorIds.every((entityId) => {
      const entity = data.entities.find((item) => item.id === entityId);
      const asset = entity?.mapFigure?.asset ?? entity?.mapVisual?.asset;
      return Boolean(asset && existsSync(resolve('public', asset)));
    })).toBe(true);
    expect(keyActorIds.every((entityId) => spatialStates.some((state) =>
      state.entityId === entityId && Boolean(state.editorNote),
    ))).toBe(true);
    expect(battles[0]).toMatchObject({
      id: 'war-of-the-ancients-conflict',
      geographicCertainty: 'unknown',
      campaignId: 'war-of-the-ancients-campaign',
    });
    expect(battles[0]?.geometryId).toBeUndefined();
    expect([...events, ...battles].every((subject) =>
      data.claims.some((claim) => claim.subjectId === subject.id && claim.citationIds.length > 0),
    )).toBe(true);
    expect(data.relationships).toContainEqual(expect.objectContaining({
      id: 'portal-collapse-causes-sundering',
      type: 'causes',
    }));
    expect(data.relationships).toContainEqual(expect.objectContaining({
      id: 'survivors-precede-long-vigil',
      type: 'precedes',
    }));
  });

  it('contains a time-sliced Long Vigil and New Kingdoms research preview', () => {
    const data = loadDataset();
    const era = data.eras.find((item) => item.id === 'long-vigil-new-kingdoms')!;
    const events = data.events.filter((item) => item.eraId === era.id);
    const battles = data.battles.filter((item) => item.eraId === era.id);
    const spatialStates = data.spatialStates.filter((item) => item.eraId === era.id);
    const featuredEntities = data.entities.filter((item) => item.featuredEraIds?.includes(era.id));
    const guide = data.storyGuides.find((item) => item.id === era.storyGuideId)!;
    const nodes = guide.nodeIds.map((nodeId) => data.storyNodes.find((item) => item.id === nodeId)!);
    const mapStateIds = [
      'long-vigil-new-kingdoms-early-map-research',
      'long-vigil-new-kingdoms-founding-map-research',
      'long-vigil-new-kingdoms-map-research',
    ];
    const mapStates = mapStateIds.map((id) => data.mapStates.find((item) => item.id === id)!);

    expect(era.order).toBe(5);
    expect(era.previousEraId).toBe('war-of-the-ancients');
    expect(era.nextEraId).toBe('rise-of-the-horde');
    expect(featuredEntities).toHaveLength(21);
    expect(events).toHaveLength(14);
    expect(battles).toHaveLength(2);
    expect(spatialStates).toHaveLength(22);
    expect(guide.nodeIds).toHaveLength(14);
    expect(mapStates.every((state) => state.presentation === 'terrain'
      && Boolean(state.terrainTextureAsset)
      && Boolean(state.terrainHeightAsset)
      && Boolean(state.cartographyLabel)
      && Boolean(state.interpretationNote))).toBe(true);
    expect(new Set(mapStates.map((state) => state.terrainTextureAsset))).toEqual(new Set([
      'textures/azeroth/rise-of-the-horde-post-sundering-map-research/terrain-atlas.research.webp',
    ]));
    expect(mapStates.every((state) => {
      const texture = state.terrainTextureAsset;
      const height = state.terrainHeightAsset;
      return Boolean(texture && height
        && existsSync(resolve('public', texture))
        && existsSync(resolve('public', height)));
    })).toBe(true);
    expect(nodes.slice(0, 4).every((node) => node.visualActions?.some((action) =>
      action.type === 'set_map_state' && action.mapStateId === mapStateIds[0]))).toBe(true);
    expect(nodes.slice(4, 10).every((node) => node.visualActions?.some((action) =>
      action.type === 'set_map_state' && action.mapStateId === mapStateIds[1]))).toBe(true);
    expect(nodes.slice(10).every((node) => node.visualActions?.some((action) =>
      action.type === 'set_map_state' && action.mapStateId === mapStateIds[2]))).toBe(true);

    const keyActorIds = [
      'long-vigil-kaldorei', 'highborne-exiles', 'dathremar-sunstrider',
      'quelthalas-ancient', 'amani-empire', 'arathor', 'thoradin',
      'seven-human-kingdoms', 'dwarven-clans', 'ragnaros',
    ];
    expect(keyActorIds.every((entityId) => {
      const entity = data.entities.find((item) => item.id === entityId);
      const asset = entity?.mapFigure?.asset ?? entity?.mapVisual?.asset;
      return Boolean(asset && existsSync(resolve('public', asset)));
    })).toBe(true);
    expect(keyActorIds.every((entityId) => spatialStates.some((state) =>
      state.entityId === entityId
      && state.placementKind === 'relational'
      && state.geographicCertainty === 'unknown'
      && Boolean(state.editorNote),
    ))).toBe(true);
    expect(battles.every((battle) => battle.geographicCertainty === 'unknown'
      && battle.geometryId === undefined
      && battle.campaignId === 'post-sundering-kingdom-conflicts')).toBe(true);
    expect(data.routes.filter((route) => ['highborne-eastward-migration', 'dwarven-clan-dispersal'].includes(route.id))
      .every((route) => route.geographicCertainty === 'inferred' && Boolean(route.editorNote))).toBe(true);
    expect([...events, ...battles].every((subject) =>
      data.claims.some((claim) => claim.subjectId === subject.id && claim.citationIds.length > 0),
    )).toBe(true);
    expect(data.relationships).toContainEqual(expect.objectContaining({
      id: 'era-five-precedes-horde-rise',
      type: 'precedes',
    }));
  });

  it('contains a cross-world Rise of the Horde and First Two Wars research preview', () => {
    const data = loadDataset();
    const era = data.eras.find((item) => item.id === 'rise-of-the-horde')!;
    const events = data.events.filter((item) => item.eraId === era.id);
    const battles = data.battles.filter((item) => item.eraId === era.id);
    const spatialStates = data.spatialStates.filter((item) => item.eraId === era.id);
    const featuredEntities = data.entities.filter((item) => item.featuredEraIds?.includes(era.id));
    const guide = data.storyGuides.find((item) => item.id === era.storyGuideId)!;
    const nodes = guide.nodeIds.map((nodeId) => data.storyNodes.find((item) => item.id === nodeId)!);
    const mapStateIds = [
      'rise-of-the-horde-draenor-before-map-research',
      'rise-of-the-horde-draenor-corrupted-map-research',
      'rise-of-the-horde-first-war-map-research',
      'rise-of-the-horde-second-war-map-research',
    ];
    const mapStates = mapStateIds.map((id) => data.mapStates.find((item) => item.id === id)!);

    expect(era.order).toBe(6);
    expect(era.previousEraId).toBe('long-vigil-new-kingdoms');
    expect(era.nextEraId).toBe('third-war-frozen-throne');
    expect(featuredEntities).toHaveLength(23);
    expect(events).toHaveLength(15);
    expect(battles).toHaveLength(2);
    expect(spatialStates).toHaveLength(23);
    expect(guide.nodeIds).toHaveLength(15);
    expect(mapStates.map((state) => state.worldspaceId)).toEqual(['draenor', 'draenor', 'azeroth', 'azeroth']);
    expect(mapStates.every((state) => state.presentation === 'terrain'
      && Boolean(state.terrainTextureAsset)
      && Boolean(state.terrainHeightAsset)
      && Boolean(state.cartographyLabel)
      && Boolean(state.interpretationNote))).toBe(true);
    expect(mapStates.every((state) => {
      const texture = state.terrainTextureAsset;
      const height = state.terrainHeightAsset;
      return Boolean(texture && height
        && existsSync(resolve('public', texture))
        && existsSync(resolve('public', height)));
    })).toBe(true);
    const azerothMapStates = mapStates.filter((state) => state.worldspaceId === 'azeroth');
    expect(new Set(azerothMapStates.map((state) => state.terrainTextureAsset))).toEqual(new Set([
      'textures/azeroth/rise-of-the-horde-post-sundering-map-research/terrain-atlas.research.webp',
    ]));
    expect(new Set(azerothMapStates.map((state) => state.terrainHeightAsset))).toEqual(new Set([
      'textures/azeroth/rise-of-the-horde-post-sundering-map-research/terrain-height.research.webp',
    ]));
    expect(nodes.slice(0, 2).every((node) => node.visualActions?.some((action) =>
      action.type === 'set_map_state' && action.mapStateId === mapStateIds[0]))).toBe(true);
    expect(nodes.slice(2, 6).every((node) => node.visualActions?.some((action) =>
      action.type === 'set_map_state' && action.mapStateId === mapStateIds[1]))).toBe(true);
    expect(nodes.slice(6, 10).every((node) => node.visualActions?.some((action) =>
      action.type === 'set_map_state' && action.mapStateId === mapStateIds[2]))).toBe(true);
    expect(nodes.slice(10).every((node) => node.visualActions?.some((action) =>
      action.type === 'set_map_state' && action.mapStateId === mapStateIds[3]))).toBe(true);

    const keyActorIds = [
      'orc-clans-draenor', 'draenei-draenor', 'kiljaeden', 'nerzhul', 'guldan',
      'durotan', 'mannoroth', 'shadow-council', 'old-horde', 'blackhand',
      'orgrim-doomhammer', 'medivh', 'anduin-lothar', 'alliance-of-lordaeron', 'turalyon',
    ];
    expect(keyActorIds.every((entityId) => {
      const entity = data.entities.find((item) => item.id === entityId);
      const asset = entity?.mapFigure?.asset ?? entity?.mapVisual?.asset;
      return Boolean(asset && existsSync(resolve('public', asset)));
    })).toBe(true);
    expect(keyActorIds.every((entityId) => spatialStates.some((state) =>
      state.entityId === entityId
      && state.placementKind === 'relational'
      && state.geographicCertainty === 'unknown'
      && Boolean(state.editorNote),
    ))).toBe(true);
    expect(battles.every((battle) => battle.geographicCertainty === 'unknown'
      && battle.geometryId === undefined
      && battle.campaignId === 'rise-of-the-horde-and-first-two-wars')).toBe(true);
    expect(data.routes.filter((route) => [
      'horde-draenor-campaign', 'first-war-advance',
      'second-war-horde-offensive', 'second-war-alliance-counteroffensive',
    ].includes(route.id)).every((route) => route.geographicCertainty === 'inferred'
      && Boolean(route.editorNote))).toBe(true);
    expect(data.relationships).toContainEqual(expect.objectContaining({
      id: 'second-war-aftermath-precedes-third-war',
      type: 'precedes',
    }));
    expect([...events, ...battles].every((subject) =>
      data.claims.some((claim) => claim.subjectId === subject.id && claim.citationIds.length > 0),
    )).toBe(true);
  });

  it('contains an intertwined Third War and Frozen Throne research preview', () => {
    const data = loadDataset();
    const era = data.eras.find((item) => item.id === 'third-war-frozen-throne')!;
    const events = data.events.filter((item) => item.eraId === era.id);
    const battles = data.battles.filter((item) => item.eraId === era.id);
    const spatialStates = data.spatialStates.filter((item) => item.eraId === era.id);
    const featuredEntities = data.entities.filter((item) => item.featuredEraIds?.includes(era.id));
    const guide = data.storyGuides.find((item) => item.id === era.storyGuideId)!;
    const nodes = guide.nodeIds.map((nodeId) => data.storyNodes.find((item) => item.id === nodeId)!);
    const mapStateIds = [
      'third-war-northern-crisis-map-research',
      'third-war-hyjal-map-research',
      'third-war-outland-map-research',
      'third-war-frozen-throne-map-research',
    ];
    const mapStates = mapStateIds.map((id) => data.mapStates.find((item) => item.id === id)!);

    expect(era.order).toBe(7);
    expect(era.previousEraId).toBe('rise-of-the-horde');
    expect(era.nextEraId).toBe('age-of-adventurers');
    expect(featuredEntities).toHaveLength(26);
    expect(events).toHaveLength(23);
    expect(battles).toHaveLength(2);
    expect(spatialStates).toHaveLength(25);
    expect(guide.nodeIds).toHaveLength(15);
    expect(mapStates.map((state) => state.worldspaceId)).toEqual(['azeroth', 'azeroth', 'outland', 'azeroth']);
    expect(mapStates.every((state) => state.presentation === 'terrain'
      && Boolean(state.terrainTextureAsset)
      && Boolean(state.terrainHeightAsset)
      && Boolean(state.cartographyLabel)
      && Boolean(state.interpretationNote))).toBe(true);
    expect(mapStates.every((state) => {
      const texture = state.terrainTextureAsset;
      const height = state.terrainHeightAsset;
      return Boolean(texture && height
        && existsSync(resolve('public', texture))
        && existsSync(resolve('public', height)));
    })).toBe(true);

    const requiredTransitions = new Map([
      ['third-war-story-after-the-camps', mapStateIds[0]],
      ['third-war-story-westward-crossing', mapStateIds[1]],
      ['third-war-story-wills-break-free', mapStateIds[0]],
      ['third-war-story-outland-refuge', mapStateIds[2]],
      ['third-war-story-race-to-icecrown', mapStateIds[3]],
    ]);
    expect([...requiredTransitions].every(([nodeId, mapStateId]) => nodes
      .find((node) => node.id === nodeId)?.visualActions?.some((action) =>
        action.type === 'set_map_state' && action.mapStateId === mapStateId))).toBe(true);
    expect(nodes.every((node) => !node.visualActions?.some((action) => action.type === 'show_battle'))).toBe(true);

    const keyActorIds = [
      'arthas-menethil', 'scourge', 'kelthuzad', 'jaina-proudmoore',
      'sylvanas-windrunner', 'thrall', 'new-horde', 'grom-hellscream',
      'mannoroth', 'archimonde', 'burning-legion', 'hyjal-defenders',
      'illidan-stormrage', 'illidan-outland-coalition',
    ];
    expect(keyActorIds.every((entityId) => {
      const entity = data.entities.find((item) => item.id === entityId);
      const asset = entity?.mapFigure?.asset ?? entity?.mapVisual?.asset;
      return Boolean(asset && existsSync(resolve('public', asset)));
    })).toBe(true);
    expect(keyActorIds.every((entityId) => spatialStates.some((state) =>
      state.entityId === entityId
      && state.placementKind === 'relational'
      && state.geographicCertainty === 'unknown'
      && Boolean(state.editorNote),
    ))).toBe(true);
    expect(battles.every((battle) => battle.geographicCertainty === 'unknown'
      && battle.geometryId === undefined
      && battle.campaignId === 'third-war-and-frozen-throne')).toBe(true);
    expect(data.routes.filter((route) => [
      'arthas-northrend-expedition', 'scourge-advance', 'horde-westward-passage',
      'legion-kalimdor-advance', 'hyjal-convergence', 'outland-portal-campaign', 'icecrown-race',
    ].includes(route.id)).every((route) => route.geographicCertainty === 'inferred'
      && Boolean(route.editorNote))).toBe(true);
    expect([...events, ...battles].every((subject) =>
      data.claims.some((claim) => claim.subjectId === subject.id && claim.citationIds.length > 0),
    )).toBe(true);
    expect(data.relationships).toContainEqual(expect.objectContaining({
      id: 'arthas-ascent-precedes-adventurers',
      type: 'precedes',
    }));
  });

  it('contains a multi-worldspace Age of Adventurers research preview', () => {
    const data = loadDataset();
    const era = data.eras.find((item) => item.id === 'age-of-adventurers')!;
    const events = data.events.filter((item) => item.eraId === era.id);
    const battles = data.battles.filter((item) => item.eraId === era.id);
    const guide = data.storyGuides.find((item) => item.id === era.storyGuideId)!;
    const nodes = guide.nodeIds.map((nodeId) => data.storyNodes.find((item) => item.id === nodeId)!);
    const mapStateIds = [
      'age-of-adventurers-map-research',
      'age-of-adventurers-outland-map-research',
      'age-of-adventurers-northrend-map-research',
      'age-of-adventurers-cataclysm-map-research',
      'age-of-adventurers-pandaria-map-research',
      'age-of-adventurers-alternate-draenor-map-research',
      'age-of-adventurers-broken-isles-map-research',
      'age-of-adventurers-argus-map-research',
    ];
    const mapStates = mapStateIds.map((id) => data.mapStates.find((item) => item.id === id)!);

    expect(era.order).toBe(8);
    expect(era.previousEraId).toBe('third-war-frozen-throne');
    expect(era.nextEraId).toBe('modern-cosmic-age');
    expect(events).toHaveLength(380);
    expect(events.filter((event) => event.id.startsWith('onyxia-'))).toHaveLength(21);
    expect(events.filter((event) => event.id.startsWith('dungeon-set-two-'))).toHaveLength(22);
    expect(events.filter((event) => event.id.startsWith('fallen-hero-and-rakhlikh-'))).toHaveLength(15);
    expect(events.filter((event) => event.id.startsWith('tirion-taelan-of-love-and-family-'))).toHaveLength(14);
    expect(events.filter((event) => event.id.startsWith('darrowshire-lost-and-remembered-'))).toHaveLength(16);
    expect(events.filter((event) => event.id.startsWith('karazhan-masters-key-and-nightbane-'))).toHaveLength(18);
    expect(events.filter((event) => event.id.startsWith('akama-and-black-temple-'))).toHaveLength(20);
    expect(events.filter((event) => event.id.startsWith('cipher-of-damnation-oronok-'))).toHaveLength(26);
    expect(battles).toHaveLength(2);
    expect(guide.nodeIds).toHaveLength(10);
    expect(mapStates.map((state) => state.worldspaceId)).toEqual([
      'azeroth', 'outland', 'azeroth', 'azeroth', 'azeroth', 'alternate-draenor', 'azeroth', 'argus',
    ]);
    expect(mapStates.every((state) => state.presentation === 'terrain'
      && Boolean(state.terrainTextureAsset)
      && Boolean(state.terrainHeightAsset)
      && Boolean(state.interpretationNote))).toBe(true);
    expect(mapStates.every((state) => Boolean(state.terrainTextureAsset
      && state.terrainHeightAsset
      && existsSync(resolve('public', state.terrainTextureAsset))
      && existsSync(resolve('public', state.terrainHeightAsset))))).toBe(true);
    expect(nodes.every((node) => !node.visualActions?.some((action) => action.type === 'show_battle'))).toBe(true);
    const keyActorIds = [
      'adventurers-of-azeroth', 'old-gods', 'illidan-stormrage', 'arthas-menethil', 'scourge',
      'neltharion', 'new-horde', 'thrall', 'jaina-proudmoore', 'iron-horde', 'class-orders',
      'burning-legion', 'turalyon',
    ];
    expect(keyActorIds.every((entityId) => {
      const entity = data.entities.find((item) => item.id === entityId);
      const asset = entity?.mapFigure?.asset ?? entity?.mapVisual?.asset;
      return Boolean(asset && existsSync(resolve('public', asset)));
    })).toBe(true);
    expect(keyActorIds.every((entityId) => data.spatialStates.some((state) =>
      state.entityId === entityId
      && state.eraId === era.id
      && state.placementKind === 'relational'
      && state.geographicCertainty === 'unknown'
      && Boolean(state.editorNote),
    ))).toBe(true);
    expect([...events, ...battles].every((subject) =>
      data.claims.some((claim) => claim.subjectId === subject.id && claim.citationIds.length > 0),
    )).toBe(true);
    expect(battles.every((battle) => battle.phases?.length === 5
      && battle.campaignId === 'age-of-adventurers-campaigns')).toBe(true);
  });

  it('contains a released, evidence-bounded Modern Cosmic Age research preview', () => {
    const data = loadDataset();
    const era = data.eras.find((item) => item.id === 'modern-cosmic-age')!;
    const events = data.events.filter((item) => item.eraId === era.id);
    const battles = data.battles.filter((item) => item.eraId === era.id);
    const guide = data.storyGuides.find((item) => item.id === era.storyGuideId)!;
    const nodes = guide.nodeIds.map((nodeId) => data.storyNodes.find((item) => item.id === nodeId)!);
    const mapStateIds = [
      'modern-cosmic-age-map-research',
      'modern-cosmic-nzoth-map-research',
      'modern-cosmic-shadowlands-map-research',
      'modern-cosmic-dragon-isles-map-research',
      'modern-cosmic-khaz-algar-map-research',
      'modern-cosmic-karesh-map-research',
      'modern-cosmic-midnight-map-research',
    ];
    const mapStates = mapStateIds.map((id) => data.mapStates.find((item) => item.id === id)!);
    const shadowlands = mapStates[2]!;
    const midnight = data.events.find((item) => item.id === 'midnight-invasion-quelthalas')!;
    const darkwell = data.events.find((item) => item.id === 'sunwell-becomes-darkwell')!;
    const dawnwell = data.events.find((item) => item.id === 'dawnwell-restored')!;
    const coiledIsle = data.events.find((item) => item.id === 'coiled-isle-ulatek-crisis')!;

    expect(era.order).toBe(9);
    expect(era.previousEraId).toBe('age-of-adventurers');
    expect(era.nextEraId).toBeUndefined();
    expect(era.endDate).toEqual(expect.objectContaining({ precision: 'unknown' }));
    expect(events).toHaveLength(13);
    expect(battles).toHaveLength(2);
    expect(guide.nodeIds).toHaveLength(13);
    expect(shadowlands.presentation).toBe('relational');
    expect(shadowlands.worldspaceId).toBe('shadowlands');
    expect(shadowlands.terrainTextureAsset).toBeTruthy();
    expect(shadowlands.terrainHeightAsset).toBeUndefined();
    expect(shadowlands.interpretationNote).toMatch(/not.*geography|not.*geographic|symbolic/i);
    expect(mapStates.every((state) => Boolean(state.terrainTextureAsset
      && existsSync(resolve('public', state.terrainTextureAsset))))).toBe(true);
    expect(nodes.every((node) => !node.visualActions?.some((action) => action.type === 'show_battle'))).toBe(true);
    const keyActorIds = [
      'sylvanas-windrunner', 'jaina-proudmoore', 'thrall', 'new-horde', 'old-gods',
      'adventurers-of-azeroth', 'shadowlands-covenants', 'dragonflights', 'xalatath', 'earthen-khaz-algar',
    ];
    expect(keyActorIds.every((entityId) => {
      const entity = data.entities.find((item) => item.id === entityId);
      const asset = entity?.mapFigure?.asset ?? entity?.mapVisual?.asset;
      return Boolean(asset && existsSync(resolve('public', asset)));
    })).toBe(true);
    expect(keyActorIds.every((entityId) => data.spatialStates.some((state) =>
      state.entityId === entityId
      && state.eraId === era.id
      && state.placementKind === 'relational'
      && state.geographicCertainty === 'unknown'
      && Boolean(state.editorNote),
    ))).toBe(true);
    expect(midnight.summary).toMatch(/survives the first incursion/i);
    expect(darkwell.summary).toMatch(/Darkwell/);
    expect(dawnwell.summary).toMatch(/Dawnwell/);
    expect(dawnwell.description).toMatch(/not her final defeat/i);
    expect(coiledIsle.description).toMatch(/does not infer later campaign outcomes/i);
    expect(data.events.some((item) => item.id === 'midnight-announced')).toBe(false);
    expect(mapStates[5]?.worldspaceId).toBe('karesh');
    expect(mapStates[5]?.presentation).toBe('relational');
    expect(mapStates[6]?.interpretationNote).toMatch(/not battle fronts/i);
    expect(mapStates[6]?.geometryIds).not.toContain('midnight-unknown-horizon-research');
    expect([...events, ...battles].every((subject) =>
      data.claims.some((claim) => claim.subjectId === subject.id && claim.citationIds.length > 0),
    )).toBe(true);
    expect(battles.every((battle) => battle.phases?.length === 5
      && battle.campaignId === 'modern-cosmic-campaigns')).toBe(true);
  });

  it('enforces the non-geographic relational visualization contract', () => {
    expect(mapStateSchema.safeParse({
      id: 'relational-test',
      name: 'Relational test',
      worldspaceId: 'cosmos',
      presentation: 'relational',
      terrainTextureAsset: 'field.png',
      terrainHeightAsset: 'height.png',
      interpretationNote: 'Diagram only.',
      geometryIds: [],
    }).success).toBe(false);
    expect(spatialStateSchema.safeParse({
      id: 'relational-placement-test',
      entityId: 'subject',
      eraId: 'cosmic-origins',
      worldspaceId: 'cosmos',
      geometryId: 'subject-point',
      placementKind: 'relational',
      geographicCertainty: 'unknown',
      sourceIds: [],
    }).success).toBe(false);
    expect(spatialStateSchema.safeParse({
      id: 'relational-geography-test',
      entityId: 'subject',
      eraId: 'cosmic-origins',
      worldspaceId: 'cosmos',
      geometryId: 'subject-point',
      placementKind: 'relational',
      geographicCertainty: 'exact',
      sourceIds: [],
      editorNote: 'Diagram only.',
    }).success).toBe(false);
  });

  it('paces each guided-history pane for slow narration', () => {
    const data = loadDataset();
    for (const guideId of [
      'black-empire-guided-history',
      'cosmic-origins-guided-history',
      'ordering-of-azeroth-guided-history',
      'ancient-civilizations-guided-history',
      'war-of-the-ancients-guided-history',
      'long-vigil-new-kingdoms-guided-history',
      'rise-of-the-horde-guided-history',
      'third-war-frozen-throne-guided-history',
      'age-of-adventurers-guided-history',
      'karazhan-masters-key-and-nightbane-guide',
      'modern-cosmic-age-guided-history',
    ]) {
      const guide = data.storyGuides.find((item) => item.id === guideId)!;
      for (const nodeId of guide.nodeIds) {
        const node = data.storyNodes.find((item) => item.id === nodeId)!;
        const words = node.narration.trim().split(/\s+/).length;
        const narrationMs = Math.round(((words / 82) * 60_000) / 500) * 500 + 5_000;
        expect(node.durationMs).toBeGreaterThanOrEqual(narrationMs);
      }
    }
  });

  it('provides one repository-backed AI voice-over for every guided-history pane', () => {
    const data = loadDataset();
    const guidedNodeIds = new Set(data.storyGuides.flatMap((guide) => guide.nodeIds));
    const guidedNodes = data.storyNodes.filter((node) => guidedNodeIds.has(node.id));

    expect(guidedNodes.length).toBeGreaterThan(0);
    for (const node of guidedNodes) {
      expect(node.voiceover).toMatchObject({
        voiceId: 'kokoro-bm-lewis',
        aiGenerated: true,
      });
      expect(node.voiceover?.assetPath).toMatch(/^audio\/guided\/.+\.mp3$/);
      expect(node.voiceover?.durationMs).toBeGreaterThan(10_000);
    }
  });

  it('keeps the Scythe of Elune a complete, source-linked Classic-to-Wrath research story', () => {
    const data = loadDataset();
    const story = data.storylines.find((item) => item.id === 'scythe-of-elune-original-mystery')!;
    const guide = data.storyGuides.find((item) => item.id === story.storyGuideId)!;
    const nodes = guide.nodeIds.map((id) => data.storyNodes.find((node) => node.id === id)!);
    const tour = data.storyTours.find((item) => item.slug === 'classic-to-wrath')!;
    const entry = tour.entries.find((item) => item.storylineId === story.id)!;
    const ledger = JSON.parse(readFileSync(resolve('docs/research/scythe-of-elune-visual-assets.json'), 'utf8')) as {
      nodeVisuals: { storyNodeId: string; environmentPath: string; visualEntities: { id: string; image: string | null }[] }[];
      assets: { filePath: string; sha256: string; bytes: number }[];
    };

    expect(story.contentStatus).toBe('research');
    expect(story.showInEraTourOffshoots).toBe(false);
    expect(guide.nodeIds).toHaveLength(15);
    expect(nodes.every((node) => node.eventIds?.length === 1 && node.entityIds?.length
      && node.voiceover?.assetPath && node.visualActions?.some((action) => action.type === 'set_map_state'))).toBe(true);
    expect(nodes.at(-1)?.id).toMatch(/jitters-book-from-svens-farm$/);
    expect(nodes.at(-1)?.narration).toMatch(/witness’s account from another chain|separate testimony/i);
    expect(story.reviewNote).toMatch(/not proven to be the same/i);
    expect(entry.order).toBe(8);
    expect(entry.regionIds).toEqual(['kalimdor', 'eastern-kingdoms']);
    expect(tour.entries).toHaveLength(22);
    expect(tour.entries.find((item) => item.storylineId === 'karazhan-masters-key-and-nightbane')?.order).toBe(11);
    expect(data.eras.find((item) => item.id === 'age-of-adventurers')?.storyGuideId).not.toBe(guide.id);
    expect(ledger.nodeVisuals).toHaveLength(nodes.length);
    expect(ledger.assets).toHaveLength(24);

    for (const [index, node] of nodes.entries()) {
      const scene = ledger.nodeVisuals[index]!;
      expect(scene.storyNodeId).toBe(node.id);
      expect(existsSync(resolve('public', scene.environmentPath))).toBe(true);
      expect(scene.visualEntities.map((entity) => entity.id)).toEqual(node.entityIds);
      expect(scene.visualEntities.every((entity) => !entity.image || existsSync(resolve('public', entity.image)))).toBe(true);
      const event = data.events.find((item) => item.id === node.eventIds?.[0])!;
      const claim = data.claims.find((item) => item.id === event.claimIds?.[0])!;
      expect(claim.citationIds.length).toBeGreaterThan(0);
      expect(claim.citationIds.every((id) => data.citations.some((citation) => citation.id === id))).toBe(true);
      expect(claim.citationIds.every((id) => data.sources.some((source) => source.id === data.citations.find((citation) => citation.id === id)?.sourceId))).toBe(true);
    }
    for (const asset of ledger.assets) {
      const file = resolve('public', asset.filePath);
      expect(existsSync(file)).toBe(true);
      expect(readFileSync(file).length).toBe(asset.bytes);
      expect(createHash('sha256').update(readFileSync(file)).digest('hex')).toBe(asset.sha256);
    }
  });

  it('keeps the Scepter storyline connected to its actual eras and source leads', () => {
    const data = loadDataset();
    const scepter = data.storylines.find((item) => item.id === 'scepter-of-the-shifting-sands')!;
    expect(data.storylines).toHaveLength(38);
    expect(data.storylines.find((item) => item.id === 'fallen-hero-and-rakhlikh')?.contentStatus).toBe('research');
    expect(data.storylines.find((item) => item.id === 'akama-and-black-temple')?.contentStatus).toBe('research');
    expect(data.storylines.find((item) => item.id === 'suramar-nightwell-rebellion')?.eraIds)
      .toEqual(['war-of-the-ancients', 'age-of-adventurers']);
    expect(data.storylines.find((item) => item.id === 'beyond-the-dark-portal')?.eraIds)
      .toEqual(['rise-of-the-horde', 'third-war-frozen-throne']);
    expect(scepter.eraIds).toEqual(['long-vigil-new-kingdoms', 'age-of-adventurers']);
    expect(scepter.chapters).toHaveLength(22);
    expect(scepter.chapters.slice(0, 2).map((chapter) => chapter.eraId)).toEqual(['long-vigil-new-kingdoms', 'long-vigil-new-kingdoms']);
    expect(scepter.chapters.slice(2).every((chapter) => chapter.eraId === 'age-of-adventurers')).toBe(true);
    expect(scepter.sourceIds).toHaveLength(19);
    expect(scepter.storyGuideId).toBe('scepter-of-the-shifting-sands-guide');
    expect(scepter.contentStatus).toBe('research');
    expect(storylineSchema.safeParse({ ...scepter, primaryEraId: 'war-of-the-ancients' }).success).toBe(false);
    expect(storylineSchema.safeParse({ ...scepter, chapters: [{ ...scepter.chapters[0], eraId: 'war-of-the-ancients' }, ...scepter.chapters.slice(1)] }).success).toBe(false);
  });

  it('keeps Champion of the Naaru source-linked and after the Cipher in the Classic-to-Wrath StoryTour', () => {
    const data = loadDataset();
    const story = data.storylines.find((item) => item.id === 'champion-of-the-naaru-outland-trials')!;
    const guide = data.storyGuides.find((item) => item.id === story.storyGuideId)!;
    const nodes = guide.nodeIds.map((id) => data.storyNodes.find((node) => node.id === id)!);
    const tour = data.storyTours.find((item) => item.slug === 'classic-to-wrath')!;
    const entry = tour.entries.find((item) => item.storylineId === story.id)!;
    const visualLedger = JSON.parse(readFileSync(resolve('docs/research/champion-of-the-naaru-visual-assets.json'), 'utf8')) as {
      scenes: { nodeId: string; environmentAsset: string; entityIds: string[] }[];
      environments: { assetPath: string; sha256: string }[];
      figures: { assetPath: string; sha256: string }[];
    };
    const audioManifest = JSON.parse(readFileSync(resolve('public/audio/guided/manifest.json'), 'utf8')) as {
      tracks: { nodeId: string; assetPath: string; sha256: string; transcriptSha256: string }[];
    };

    expect(story.contentStatus).toBe('research');
    expect(story.eraIds).toEqual(['age-of-adventurers']);
    expect(story.showInEraTourOffshoots).toBe(false);
    expect(guide.contentStatus).toBe('research');
    expect(guide.nodeIds).toHaveLength(9);
    expect(entry.order).toBe(16);
    expect(tour.entries).toHaveLength(22);
    expect(tour.entries.find((item) => item.storylineId === 'cipher-of-damnation-oronok')?.order).toBe(15);
    expect(tour.entries.find((item) => item.storylineId === 'swift-flight-form-raven-legacy')?.order).toBe(18);
    expect(tour.entries.find((item) => item.storylineId === 'missing-diplomat-original-investigation')?.order).toBe(19);
    expect(tour.chronologyNote).toMatch(/Champion of the Naaru stop follows the Cipher/);
    expect(nodes.every((node) => node.eventIds?.length === 1 && node.entityIds?.length
      && node.voiceover?.assetPath && node.visualActions?.some((action) => action.type === 'set_map_state'))).toBe(true);
    expect(nodes[2]?.narration).toMatch(/three prisoners/);
    expect(nodes[3]?.narration).toMatch(/one half of a single test/);
    expect(story.reviewNote).toMatch(/Mercy, Strength and Tenacity are parallel requirements/);
    expect(story.reviewNote).toMatch(/title condition is kept separate.*patch-sensitive/);
    expect(nodes.at(-1)?.narration).toMatch(/foe within had yet to be faced/);
    expect(visualLedger.scenes).toHaveLength(nodes.length);

    for (const [index, node] of nodes.entries()) {
      const scene = visualLedger.scenes[index]!;
      expect(scene.nodeId).toBe(node.id);
      expect(scene.entityIds).toEqual(node.entityIds);
      expect(existsSync(resolve('public', scene.environmentAsset))).toBe(true);
      const mapStateAction = node.visualActions?.find((action) => action.type === 'set_map_state');
      if (mapStateAction?.type !== 'set_map_state') throw new Error(`Missing MapState action in ${node.id}`);
      const mapState = data.mapStates.find((item) => item.id === mapStateAction.mapStateId)!;
      expect(mapState.terrainTextureAsset).toBe(scene.environmentAsset);
      const event = data.events.find((item) => item.id === node.eventIds?.[0])!;
      const claim = data.claims.find((item) => item.id === event.claimIds?.[0])!;
      expect(claim.citationIds.length).toBeGreaterThan(0);
      expect(claim.citationIds.every((id) => data.citations.some((citation) => citation.id === id))).toBe(true);
      expect(claim.citationIds.every((id) => data.sources.some((source) => source.id === data.citations.find((citation) => citation.id === id)?.sourceId))).toBe(true);
      const track = audioManifest.tracks.find((item) => item.nodeId === node.id)!;
      expect(node.voiceover?.assetPath).toBe(track.assetPath);
      expect(createHash('sha256').update(node.narration).digest('hex')).toBe(track.transcriptSha256);
      expect(createHash('sha256').update(readFileSync(resolve('public', track.assetPath))).digest('hex')).toBe(track.sha256);
    }
    for (const asset of [...visualLedger.environments, ...visualLedger.figures]) {
      const bytes = readFileSync(resolve('public', asset.assetPath));
      expect(createHash('sha256').update(bytes).digest('hex')).toBe(asset.sha256);
    }
  });

  it('keeps Tirion and Taelan complete, source-linked, illustrated and separate from EraTour', () => {
    const data = loadDataset();
    const story = data.storylines.find((item) => item.id === 'tirion-taelan-of-love-and-family')!;
    const guide = data.storyGuides.find((item) => item.id === story.storyGuideId)!;
    const nodes = guide.nodeIds.map((id) => data.storyNodes.find((node) => node.id === id)!);
    const tour = data.storyTours.find((item) => item.slug === 'classic-to-wrath')!;
    const entry = tour.entries.find((item) => item.storylineId === story.id)!;
    const portraitIntroduction = data.sources.find((item) => item.id === 'tirion-taelan-portrait-introduction-locator')!;
    const portraitRecovery = data.sources.find((item) => item.id === 'tirion-taelan-portrait-recovery-locator')!;
    const medivh = data.entities.find((item) => item.id === 'medivh')!;
    const karazhanLedger = JSON.parse(readFileSync(resolve('docs/research/karazhan-visual-assets.json'), 'utf8')) as {
      assetRecords: { id: string; generationPrompt: string; visualReview: string }[];
    };
    const medivhAsset = karazhanLedger.assetRecords.find((asset) => asset.id === 'medivh')!;
    const storyTemplate = readFileSync(resolve('docs/research/storyline-build-template.md'), 'utf8');

    expect(story.contentStatus).toBe('research');
    expect(guide.nodeIds).toHaveLength(14);
    expect(nodes.every((node) => node.eventIds?.length === 1 && Boolean(node.entityIds?.length))).toBe(true);
    expect(nodes.every((node) => Boolean(node.voiceover) && Boolean(node.visualActions?.some((action) => action.type === 'set_map_state')))).toBe(true);
    expect(data.citations.some((citation) => citation.sourceId === portraitIntroduction.id && citation.questId?.includes('5846'))).toBe(true);
    expect(data.citations.some((citation) => citation.sourceId === portraitRecovery.id && citation.questId?.includes('5848'))).toBe(true);
    expect(portraitIntroduction.id).not.toBe(portraitRecovery.id);
    expect(data.entities.find((item) => item.id === 'tirion-fordring')?.mapFigure?.asset)
      .toBe('images/storylines/tirion-taelan/tirion-fordring.research.webp');
    expect(data.entities.find((item) => item.id === 'taelans-miniature-warhammer')?.mapVisual?.asset)
      .toBe('images/storylines/tirion-taelan/taelans-miniature-warhammer.research.webp');
    expect(entry.order).toBe(5);
    expect(tour.entries.find((item) => item.storylineId === 'karazhan-masters-key-and-nightbane')?.order).toBe(11);
    expect(data.eras.find((item) => item.id === 'age-of-adventurers')?.storyGuideId)
      .not.toBe(guide.id);
    expect(medivh.mapFigure?.asset).toBe('images/characters/rise-of-the-horde/medivh-atiesh.research.webp');
    expect(existsSync(resolve('public', medivh.mapFigure!.asset))).toBe(true);
    expect(medivh.mapFigure?.scale).toBeGreaterThanOrEqual(1.3);
    expect(medivh.body).toMatch(/Atiesh.*seated raven.*red streamer/);
    expect(medivhAsset.generationPrompt).toMatch(/Atiesh.*seated raven.*red streamer/);
    expect(medivhAsset.visualReview).toMatch(/seated raven.*hooked beak.*folded wings.*red streamer/);
    expect(storyTemplate).toMatch(/Signature equipment.*Medivh should visibly wield Atiesh.*seated raven.*red streamer/);
  });

  it('keeps Darrowshire’s disputed history and Classic replay as a complete standalone research story', () => {
    const data = loadDataset();
    const story = data.storylines.find((item) => item.id === 'darrowshire-lost-and-remembered')!;
    const guide = data.storyGuides.find((item) => item.id === story.storyGuideId)!;
    const nodes = guide.nodeIds.map((id) => data.storyNodes.find((node) => node.id === id)!);
    const tour = data.storyTours.find((item) => item.slug === 'classic-to-wrath')!;
    const entry = tour.entries.find((item) => item.storylineId === story.id)!;
    const visualLedger = JSON.parse(readFileSync(resolve('docs/research/darrowshire-lost-and-remembered-visual-assets.json'), 'utf8')) as {
      assetRecords: { id: string; file: string; sha256: string }[];
      sceneLedger: { nodeId: string; environmentPath: string; cast: { id: string; image: string }[]; objects: { id: string; image: string }[] }[];
    };
    const annalsClaim = data.claims.find((claim) => claim.id === 'darrowshire-lost-and-remembered-annals-date-conflict-claim')!;
    const pamelaClaim = data.claims.find((claim) => claim.id === 'darrowshire-lost-and-remembered-pamela-hidden-claim')!;

    expect(story.contentStatus).toBe('research');
    expect(story.eraIds).toEqual(['third-war-frozen-throne', 'age-of-adventurers']);
    expect(guide.nodeIds).toHaveLength(21);
    expect(nodes.every((node) => node.eventIds?.length === 1 && node.entityIds?.length
      && node.voiceover?.assetPath && node.visualActions?.some((action) => action.type === 'set_map_state'))).toBe(true);
    expect(nodes.filter((node) => data.events.find((event) => event.id === node.eventIds?.[0])?.eraId === 'third-war-frozen-throne')).toHaveLength(5);
    expect(nodes.filter((node) => data.events.find((event) => event.id === node.eventIds?.[0])?.eraId === 'age-of-adventurers')).toHaveLength(16);
    expect(annalsClaim.status).toBe('disputed');
    expect(pamelaClaim.status).toBe('disputed');
    expect(data.claims.find((claim) => claim.id === 'darrowshire-lost-and-remembered-annals-read-claim')?.status).toBe('disputed');
    expect(data.sources.find((source) => source.id === 'darrowshire-annals-book')?.notes).toMatch(/Second War/);
    expect(story.reviewNote).toMatch(/Crokford\/Lightfire.*Black\/Blackpool/);
    expect(story.reviewNote).toMatch(/permanent timeline consequences remain uncertain/i);
    expect(entry.order).toBe(6);
    expect(entry.regionIds).toEqual(['eastern-kingdoms']);
    expect(tour.entries.find((item) => item.storylineId === 'karazhan-masters-key-and-nightbane')?.order).toBe(11);
    expect(data.eras.find((item) => item.id === 'age-of-adventurers')?.storyGuideId).not.toBe(guide.id);
    expect(visualLedger.sceneLedger).toHaveLength(nodes.length);
    for (const scene of visualLedger.sceneLedger) {
      expect(nodes.some((node) => node.id === scene.nodeId)).toBe(true);
      expect(existsSync(resolve(scene.environmentPath))).toBe(true);
      for (const asset of [...scene.cast, ...scene.objects]) expect(existsSync(resolve(asset.image))).toBe(true);
      const event = data.events.find((item) => item.id === nodes.find((node) => node.id === scene.nodeId)?.eventIds?.[0])!;
      const claim = data.claims.find((item) => item.id === event.claimIds?.[0])!;
      expect(claim.citationIds.length).toBeGreaterThan(0);
      expect(claim.citationIds.every((id) => data.citations.some((citation) => citation.id === id))).toBe(true);
      expect(claim.citationIds.every((id) => data.sources.some((source) => source.id === data.citations.find((citation) => citation.id === id)?.sourceId))).toBe(true);
    }
    for (const asset of visualLedger.assetRecords) {
      expect(existsSync(resolve(asset.file))).toBe(true);
      expect(asset.sha256).toMatch(/^[a-f0-9]{64}$/);
    }
  });

  it('keeps the Consortium and Arcatraz as a complete, sourced StoryTour after Karazhan', () => {
    const data = loadDataset();
    const story = data.storylines.find((item) => item.id === 'consortium-and-arcatraz')!;
    const guide = data.storyGuides.find((item) => item.id === story.storyGuideId)!;
    const nodes = guide.nodeIds.map((id) => data.storyNodes.find((node) => node.id === id)!);
    const tour = data.storyTours.find((item) => item.slug === 'classic-to-wrath')!;
    const entry = tour.entries.find((item) => item.storylineId === story.id)!;
    const visualLedger = JSON.parse(readFileSync(resolve('docs/research/consortium-and-arcatraz-visual-assets.json'), 'utf8')) as {
      assets: { assetPath: string; sha256: string; byteLength: number; kind: string }[];
    };
    const audioManifest = JSON.parse(readFileSync(resolve('public/audio/guided/manifest.json'), 'utf8')) as {
      tracks: { nodeId: string; assetPath: string; sha256: string; transcriptSha256: string }[];
    };

    expect(story.contentStatus).toBe('research');
    expect(story.showInEraTourOffshoots).toBe(false);
    expect(guide.nodeIds).toHaveLength(15);
    expect(nodes.every((node) => node.eventIds?.length === 1 && node.entityIds?.length
      && node.voiceover?.assetPath && node.visualActions?.some((action) => action.type === 'set_map_state'))).toBe(true);
    expect(entry.order).toBe(12);
    expect(entry.regionIds).toEqual(['outland']);
    expect(tour.entries).toHaveLength(22);
    expect(tour.entries.find((item) => item.storylineId === 'karazhan-masters-key-and-nightbane')?.order).toBe(11);
    expect(tour.entries.find((item) => item.storylineId === 'hero-of-the-maghar')?.order).toBe(13);
    expect(tour.chronologyNote).toMatch(/editorial Burning Crusade placement.*neither a precise date nor a dependency/i);
    expect(nodes[0]?.narration).toMatch(/nothing remarkable.*crystal remained beyond their grasp/);
    expect(nodes[7]?.title).toBe('The crystal at Farahlon');
    expect(nodes.at(-1)?.narration).toMatch(/other captives.*wider purpose.*unanswered/);
    expect(visualLedger.assets).toHaveLength(21);
    expect(audioManifest.tracks.filter((track) => track.nodeId.startsWith('consortium-and-arcatraz-story-'))).toHaveLength(15);

    for (const asset of visualLedger.assets) {
      const bytes = readFileSync(resolve('public', asset.assetPath));
      expect(bytes.length).toBe(asset.byteLength);
      expect(createHash('sha256').update(bytes).digest('hex')).toBe(asset.sha256);
    }
    for (const node of nodes) {
      const event = data.events.find((item) => item.id === node.eventIds?.[0])!;
      const claim = data.claims.find((item) => item.id === event.claimIds?.[0])!;
      expect(event.contentStatus).toBe('research');
      expect(claim.citationIds.length).toBeGreaterThan(0);
      expect(claim.citationIds.every((id) => data.citations.some((citation) => citation.id === id))).toBe(true);
      expect(claim.citationIds.every((id) => data.sources.some((source) => source.id === data.citations.find((citation) => citation.id === id)?.sourceId))).toBe(true);
      const audio = audioManifest.tracks.find((track) => track.nodeId === node.id)!;
      const audioBytes = readFileSync(resolve('public', audio.assetPath));
      expect(node.voiceover?.assetPath).toBe(audio.assetPath);
      expect(createHash('sha256').update(audioBytes).digest('hex')).toBe(audio.sha256);
      expect(createHash('sha256').update(node.narration).digest('hex')).toBe(audio.transcriptSha256);
    }
  });

  it('keeps Quel’Delar as a complete, source-linked Classic-to-Wrath story outside EraTour', () => {
    const data = loadDataset();
    const story = data.storylines.find((item) => item.id === 'quel-delar-restored')!;
    const guide = data.storyGuides.find((item) => item.id === story.storyGuideId)!;
    const nodes = guide.nodeIds.map((id) => data.storyNodes.find((node) => node.id === id)!);
    const tour = data.storyTours.find((item) => item.slug === 'classic-to-wrath')!;
    const entry = tour.entries.find((item) => item.storylineId === story.id)!;
    const sceneIndex = JSON.parse(readFileSync(resolve('docs/research/quel-delar-restored-scene-index.json'), 'utf8')) as {
      nodes: { id: string; environmentAsset: string; actorIds: string[] }[];
    };
    const visualLedger = JSON.parse(readFileSync(resolve('docs/research/quel-delar-restored-visual-assets.json'), 'utf8')) as {
      assets: { assetPath: string; outputSha256: string; nodeIds: string[] }[];
    };

    expect(story.contentStatus).toBe('research');
    expect(guide.contentStatus).toBe('research');
    expect(guide.nodeIds).toHaveLength(19);
    expect(nodes.every((node) => node.eventIds?.length === 1 && node.entityIds?.length
      && node.voiceover?.assetPath && node.visualActions?.some((action) => action.type === 'set_map_state'))).toBe(true);
    expect(entry.order).toBe(22);
    expect(entry.regionIds).toEqual(['northrend', 'eastern-kingdoms']);
    expect(tour.entries).toHaveLength(22);
    expect(data.eras.find((item) => item.id === 'age-of-adventurers')?.storyGuideId).not.toBe(guide.id);
    expect(nodes.find((node) => node.id.endsWith('story-thalorien-last-stand'))?.eventIds?.map(id =>
      data.events.find((event) => event.id === id)?.eraId)).toEqual(['third-war-frozen-throne']);
    expect(nodes.find((node) => node.id.endsWith('story-thalorien-test'))?.eventIds?.map(id =>
      data.events.find((event) => event.id === id)?.eraId)).toEqual(['age-of-adventurers']);
    expect(story.reviewNote).toMatch(/Randomized loot is a gameplay trigger/);
    expect(story.reviewNote).toMatch(/no named adventurer is canonical/);
    expect(nodes.at(-1)?.narration).toMatch(/no single name settled the sword’s future/);

    for (const [index, node] of nodes.entries()) {
      const nodeLedger = sceneIndex.nodes[index]!;
      expect(nodeLedger.id).toBe(node.id);
      expect(nodeLedger.actorIds).toEqual(node.entityIds);
      expect(existsSync(resolve('public', nodeLedger.environmentAsset))).toBe(true);
      const event = data.events.find((item) => item.id === node.eventIds?.[0])!;
      const claim = data.claims.find((item) => item.id === event.claimIds?.[0])!;
      expect(event.contentStatus).toBe('research');
      expect(claim.citationIds.every(id => data.citations.some(citation => citation.id === id))).toBe(true);
      expect(claim.citationIds.every(id => data.sources.some(source => source.id === data.citations.find(citation => citation.id === id)?.sourceId))).toBe(true);
    }
    for (const asset of visualLedger.assets) {
      expect(existsSync(resolve('public', asset.assetPath))).toBe(true);
      expect(asset.outputSha256).toMatch(/^[a-f0-9]{64}$/);
      expect(asset.nodeIds.length).toBeGreaterThan(0);
    }
  });

  it('keeps The Missing Diplomat a complete, source-linked Classic-to-Wrath story', () => {
    const data = loadDataset();
    const story = data.storylines.find((item) => item.id === 'missing-diplomat-original-investigation')!;
    const guide = data.storyGuides.find((item) => item.id === story.storyGuideId)!;
    const tour = data.storyTours.find((item) => item.slug === 'classic-to-wrath')!;
    const entry = tour.entries.find((item) => item.storylineId === story.id)!;
    const nodes = guide.nodeIds.map((id) => data.storyNodes.find((node) => node.id === id)!);
    const assetLedger = JSON.parse(readFileSync(resolve('docs/research/missing-diplomat-original-investigation-visual-assets.json'), 'utf8')) as {
      scenes: { nodeId: string; environmentAsset: string; recognizableTraits: string; resemblanceReviewStatus: string }[];
    };

    expect(story.contentStatus).toBe('research');
    expect(story.showInEraTourOffshoots).toBe(false);
    expect(guide.nodeIds).toHaveLength(24);
    expect(nodes.every((node) => node.eventIds?.length === 1 && node.entityIds?.length
      && node.voiceover?.assetPath && node.visualActions?.some((action) => action.type === 'set_map_state'))).toBe(true);
    expect(entry.order).toBe(19);
    expect(entry.regionIds).toEqual(['eastern-kingdoms', 'kalimdor']);
    expect(tour.entries.find((item) => item.storylineId === 'shattered-sun-and-sunwell')?.order).toBe(20);
    expect(tour.entries.find((item) => item.storylineId === 'wrathgate-and-undercity')?.order).toBe(21);
    expect(tour.entries.find((item) => item.storylineId === 'quel-delar-restored')?.order).toBe(22);
    expect(tour.chronologyNote).toMatch(/patch 2\.3 continuation.*cross-story quest dependency/i);
    expect(story.reviewNote).toMatch(/Varian.*missing.*patron.*unnamed/i);
    expect(story.reviewNote).toMatch(/original-client comparison.*open/i);
    expect(nodes[12]?.narration).toMatch(/central disappearance remained unresolved/);
    expect(nodes.at(-1)?.narration).toMatch(/patron remained unnamed/);
    expect(assetLedger.scenes).toHaveLength(nodes.length);

    for (const [index, node] of nodes.entries()) {
      const scene = assetLedger.scenes[index]!;
      expect(scene.nodeId).toBe(node.id);
      expect(scene.recognizableTraits).toBeTruthy();
      expect(scene.resemblanceReviewStatus).toBe('awaiting-original-client-comparison');
      expect(existsSync(resolve('public', scene.environmentAsset))).toBe(true);
      const stateId = node.visualActions?.find((action) => action.type === 'set_map_state');
      expect(stateId?.type).toBe('set_map_state');
      const mapState = data.mapStates.find((item) => item.id === stateId?.mapStateId)!;
      expect(mapState.presentation).toBe('relational');
      expect(mapState.terrainTextureAsset).toBe(scene.environmentAsset);
      const event = data.events.find((item) => item.id === node.eventIds?.[0])!;
      const claim = data.claims.find((item) => item.id === event.claimIds?.[0])!;
      expect(claim.citationIds.length).toBeGreaterThan(0);
      expect(claim.citationIds.every((id) => data.citations.some((citation) => citation.id === id))).toBe(true);
      expect(claim.citationIds.every((id) => data.sources.some((source) => source.id === data.citations.find((citation) => citation.id === id)?.sourceId))).toBe(true);
    }
  });

  it('keeps the Shattered Sun and Sunwell fully illustrated, attributed and before the Wrath stories', () => {
    const data = loadDataset();
    const story = data.storylines.find((item) => item.id === 'shattered-sun-and-sunwell')!;
    const guide = data.storyGuides.find((item) => item.id === story.storyGuideId)!;
    const nodes = guide.nodeIds.map((id) => data.storyNodes.find((node) => node.id === id)!);
    const tour = data.storyTours.find((item) => item.slug === 'classic-to-wrath')!;
    const orderedEntries = [...tour.entries].sort((a, b) => a.order - b.order);
    const entry = orderedEntries.find((item) => item.storylineId === story.id)!;
    const manifest = JSON.parse(readFileSync(resolve('public/audio/guided/manifest.json'), 'utf8')) as {
      tracks: { nodeId: string; assetPath: string; durationMs: number; sha256: string; transcriptSha256: string }[];
    };
    const visualLedger = JSON.parse(readFileSync(resolve('docs/research/shattered-sun-sunwell-visual-assets.json'), 'utf8')) as {
      generatedAssets: { asset: string; inGameComparison: string }[];
    };

    expect(story.contentStatus).toBe('research');
    expect(story.eraIds).toEqual(['long-vigil-new-kingdoms', 'third-war-frozen-throne', 'age-of-adventurers']);
    expect(story.showInEraTourOffshoots).toBe(false);
    expect(guide.contentStatus).toBe('research');
    expect(nodes).toHaveLength(21);
    expect(guide.eraId).toBe('age-of-adventurers');
    expect(nodes.slice(0, 2).flatMap((node) => node.eventIds ?? []).map((id) => data.events.find((event) => event.id === id)?.eraId))
      .toEqual(['long-vigil-new-kingdoms', 'third-war-frozen-throne']);
    expect(story.chapters.map((chapter) => chapter.eraId)).toEqual([
      'long-vigil-new-kingdoms', 'third-war-frozen-throne', 'age-of-adventurers', 'age-of-adventurers', 'age-of-adventurers',
    ]);
    expect(nodes.every((node) => node.eventIds?.length === 1
      && node.voiceover?.assetPath && node.visualActions?.some((action) => action.type === 'set_map_state'))).toBe(true);
    expect(entry.order).toBe(20);
    expect(entry.regionIds).toEqual(['eastern-kingdoms', 'outland']);
    expect(orderedEntries[orderedEntries.indexOf(entry) - 1]?.storylineId).toBe('missing-diplomat-original-investigation');
    expect(orderedEntries[orderedEntries.indexOf(entry) + 1]?.storylineId).toBe('wrathgate-and-undercity');
    expect(tour.entries).toHaveLength(22);
    expect(data.eras.find((item) => item.id === 'age-of-adventurers')?.storyGuideId).not.toBe(guide.id);
    expect(visualLedger.generatedAssets.length).toBeGreaterThan(20);
    expect(visualLedger.generatedAssets.every((asset) => asset.inGameComparison.includes('Open'))).toBe(true);
    expect(visualLedger.generatedAssets.every((asset) => existsSync(resolve(asset.asset)))).toBe(true);

    for (const node of nodes) {
      const action = node.visualActions?.find((item) => item.type === 'set_map_state');
      expect(action?.type).toBe('set_map_state');
      if (action?.type !== 'set_map_state') throw new Error(`Missing Sunwell MapState action in ${node.id}`);
      const mapState = data.mapStates.find((item) => item.id === action.mapStateId)!;
      expect(mapState.presentation).toBe('relational');
      expect(existsSync(resolve('public', mapState.terrainTextureAsset!))).toBe(true);
      const event = data.events.find((item) => item.id === node.eventIds?.[0])!;
      const claim = data.claims.find((item) => item.id === event.claimIds?.[0])!;
      expect(event.contentStatus).toBe('research');
      expect(claim.citationIds.length).toBeGreaterThan(0);
      expect(claim.citationIds.every((id) => data.citations.some((citation) => citation.id === id))).toBe(true);
      expect(claim.citationIds.every((id) => data.sources.some((source) => source.id === data.citations.find((citation) => citation.id === id)?.sourceId))).toBe(true);
      for (const entityId of node.entityIds ?? []) {
        const entity = data.entities.find((item) => item.id === entityId)!;
        const image = entity.mapFigure?.asset ?? entity.mapVisual?.asset;
        expect(image && existsSync(resolve('public', image))).toBe(true);
      }
      const track = manifest.tracks.find((item) => item.nodeId === node.id)!;
      const audioBytes = readFileSync(resolve('public', track.assetPath));
      expect(node.voiceover?.assetPath).toBe(track.assetPath);
      expect(node.voiceover?.durationMs).toBe(track.durationMs);
      expect(createHash('sha256').update(audioBytes).digest('hex')).toBe(track.sha256);
      expect(createHash('sha256').update(node.narration).digest('hex')).toBe(track.transcriptSha256);
    }

    const lorThemarNode = nodes.find((node) => node.id.endsWith('the-tainted-fount-remains'))!;
    const lorThemar = data.entities.find((entity) => entity.id === 'lor-themar-theron')!;
    expect(lorThemarNode.entityIds).toContain(lorThemar.id);
    expect(lorThemar.mapFigure?.asset).toContain('lor-themar-theron.webp');
  });

  it('keeps Ras Frostwhisper illustrated, attributed, voice-ready and separate from EraTour', () => {
    const data = loadDataset();
    const story = data.storylines.find((item) => item.id === 'ras-frostwhisper-and-the-soulbound-keepsake')!;
    const guide = data.storyGuides.find((item) => item.id === story.storyGuideId)!;
    const nodes = guide.nodeIds.map((id) => data.storyNodes.find((node) => node.id === id)!);
    const tour = data.storyTours.find((item) => item.slug === 'classic-to-wrath')!;
    const entry = tour.entries.find((item) => item.storylineId === story.id)!;
    const ledger = JSON.parse(readFileSync(resolve('docs/research/ras-frostwhisper-visual-assets.json'), 'utf8')) as {
      sceneLedger: { nodeId: string; environmentPath: string; recognizableTraits: string; cast: { id: string; image: string }[]; objects: { id: string; image: string }[]; claimIds: string[]; citationIds: string[] }[];
      assetRecords: { file: string; byteLength: number; sha256: string }[];
    };

    expect(story.contentStatus).toBe('research');
    expect(story.showInEraTourOffshoots).toBe(false);
    expect(guide.contentStatus).toBe('research');
    expect(guide.nodeIds).toHaveLength(13);
    expect(nodes.every((node) => node.eventIds?.length === 1
      && node.voiceover?.assetPath && node.visualActions?.some((action) => action.type === 'set_map_state'))).toBe(true);
    expect(entry.order).toBe(10);
    expect(entry.regionIds).toEqual(['eastern-kingdoms']);
    expect(tour.entries).toHaveLength(22);
    expect(tour.entries.find((item) => item.storylineId === 'yehkinya-and-hakkars-return')?.order).toBe(9);
    expect(tour.entries.find((item) => item.storylineId === 'karazhan-masters-key-and-nightbane')?.order).toBe(11);
    expect(data.eras.find((item) => item.id === 'age-of-adventurers')?.storyGuideId).not.toBe(guide.id);
    expect(ledger.sceneLedger).toHaveLength(nodes.length);

    for (const [index, node] of nodes.entries()) {
      const scene = ledger.sceneLedger[index]!;
      expect(scene.nodeId).toBe(node.id);
      expect(scene.recognizableTraits.length).toBeGreaterThan(20);
      expect(existsSync(resolve(scene.environmentPath))).toBe(true);
      const visualIds = [...scene.cast, ...scene.objects].map((visual) => visual.id);
      expect(visualIds).toEqual(node.entityIds);
      for (const visual of [...scene.cast, ...scene.objects]) expect(existsSync(resolve(visual.image))).toBe(true);
      const mapStateId = node.visualActions?.find((action) => action.type === 'set_map_state');
      expect(mapStateId?.type).toBe('set_map_state');
      const mapState = data.mapStates.find((item) => item.id === mapStateId?.mapStateId)!;
      expect(mapState.terrainTextureAsset).toBe(scene.environmentPath.replace(/^public\//, ''));
      const event = data.events.find((item) => item.id === node.eventIds?.[0])!;
      const claim = data.claims.find((item) => item.id === event.claimIds?.[0])!;
      expect(event.contentStatus).toBe('research');
      expect(claim.citationIds.length).toBeGreaterThan(0);
      expect(claim.citationIds).toEqual(scene.citationIds);
      expect(claim.citationIds.every((id) => data.citations.some((citation) => citation.id === id))).toBe(true);
      expect(claim.citationIds.every((id) => data.sources.some((source) => source.id === data.citations.find((citation) => citation.id === id)?.sourceId))).toBe(true);
    }
    for (const asset of ledger.assetRecords) {
      const bytes = readFileSync(resolve(asset.file));
      expect(bytes.length).toBe(asset.byteLength);
      expect(createHash('sha256').update(bytes).digest('hex')).toBe(asset.sha256);
    }
  });

  it('keeps Yeh’kinya’s Classic storyline illustrated, attributed and separate from EraTour', () => {
    const data = loadDataset();
    const story = data.storylines.find((item) => item.id === 'yehkinya-and-hakkars-return')!;
    const guide = data.storyGuides.find((item) => item.id === story.storyGuideId)!;
    const nodes = guide.nodeIds.map((id) => data.storyNodes.find((node) => node.id === id)!);
    const tour = data.storyTours.find((item) => item.slug === 'classic-to-wrath')!;
    const entry = tour.entries.find((item) => item.storylineId === story.id)!;
    const assets = JSON.parse(readFileSync(resolve('docs/research/yehkinya-hakkar-visual-assets.json'), 'utf8')) as { assets: { promptId: string; visualIntent: string; assetPath: string; bytes: number; sha256: string }[] };
    expect(story.contentStatus).toBe('research');
    expect(story.showInEraTourOffshoots).toBe(false);
    expect(guide.contentStatus).toBe('research');
    expect(guide.nodeIds).toHaveLength(15);
    expect(nodes.every((node) => node.eventIds?.length === 1 && node.entityIds?.length && node.voiceover?.assetPath && node.visualActions?.some((action) => action.type === 'set_map_state'))).toBe(true);
    expect(entry.order).toBe(9);
    expect(entry.regionIds).toEqual(['kalimdor', 'eastern-kingdoms']);
    expect(tour.entries).toHaveLength(22);
    expect(tour.entries.find((item) => item.storylineId === 'karazhan-masters-key-and-nightbane')?.order).toBe(11);
    expect(data.eras.find((item) => item.id === 'age-of-adventurers')?.storyGuideId).not.toBe(guide.id);
    expect(nodes[7]?.narration).toMatch(/avatar of Hakkar/i);
    expect(nodes[7]?.narration).toMatch(/later physical manifestation/);
    expect(story.reviewNote).toMatch(/Sunken Temple summons an avatar.*later physical summoning/);
    expect(nodes[7]?.narration).toMatch(/victory had reached an avatar/);
    expect(assets.assets).toHaveLength(19);
    expect(assets.assets.every((asset) => asset.promptId && asset.visualIntent)).toBe(true);
    for (const asset of assets.assets) {
      const bytes = readFileSync(resolve('public', asset.assetPath));
      expect(bytes.length).toBe(asset.bytes);
      expect(createHash('sha256').update(bytes).digest('hex')).toBe(asset.sha256);
    }
    for (const node of nodes) {
      const action = node.visualActions?.find((item) => item.type === 'set_map_state');
      expect(action?.type).toBe('set_map_state');
      const state = data.mapStates.find((item) => item.id === action?.mapStateId)!;
      expect(state.presentation).toBe('relational');
      expect(existsSync(resolve('public', state.terrainTextureAsset!))).toBe(true);
      const event = data.events.find((item) => item.id === node.eventIds?.[0])!;
      expect(event.eraId).toBe('age-of-adventurers');
      expect(event.sourceIds.length).toBeGreaterThan(0);
      const claim = data.claims.find((item) => item.id === event.claimIds?.[0])!;
      expect(claim.citationIds.length).toBeGreaterThan(0);
      expect(claim.citationIds.every((id) => data.citations.some((citation) => citation.id === id))).toBe(true);
      expect(claim.citationIds.every((id) => data.sources.some((source) => source.id === data.citations.find((citation) => citation.id === id)?.sourceId))).toBe(true);
      for (const entityId of node.entityIds ?? []) {
        const entity = data.entities.find((item) => item.id === entityId)!;
        const image = entity.mapFigure?.asset ?? entity.mapVisual?.asset;
        if (image) expect(existsSync(resolve('public', image))).toBe(true);
      }
    }
    expect(nodes.at(-1)?.narration).toMatch(/Yojamba Isle/);
  });

  it('keeps Onyxia in the separate Classic-to-Wrath story atlas', () => {
    const data = loadDataset();
    const story = data.storylines.find((item) => item.id === 'stormwind-onyxia-conspiracy')!;
    const storyTour = data.storyTours.find((item) => item.slug === 'classic-to-wrath')!;
    const guide = data.storyGuides.find((item) => item.id === story.storyGuideId)!;
    const nodes = guide.nodeIds.map((id) => data.storyNodes.find((node) => node.id === id)!);
    const visualLedger = JSON.parse(readFileSync(resolve('docs/research/onyxia-visual-assets.json'), 'utf8')) as {
      assetRecords: { id: string; file: string; pixelWidth: number; pixelHeight: number; recognizableTraits: string }[];
      sceneLedger: { nodeId: string; environmentPath: string; recognizableTraits: string }[];
    };
    const audioManifest = JSON.parse(readFileSync(resolve('public/audio/guided/manifest.json'), 'utf8')) as {
      tracks: { nodeId: string; assetPath: string; durationMs: number; sha256: string; transcriptSha256: string }[];
    };
    const stormwind = visualLedger.assetRecords.find((asset) => asset.id === 'stormwind-keep')!;

    expect(story.title).toBe('The Dragon in Stormwind');
    expect(story.contentStatus).toBe('research');
    expect(story.chapters).toHaveLength(3);
    expect(story.storyGuideId).toBe('stormwind-onyxia-conspiracy-guide');
    expect(storyTour.entries.map((entry) => entry.storylineId).slice(0, 2)).toEqual([
      'stormwind-onyxia-conspiracy',
      'scepter-of-the-shifting-sands',
    ]);
    expect(guide.nodeIds).toHaveLength(21);
    expect(nodes.every((node) => node.eventIds?.length === 1 && node.entityIds?.length)).toBe(true);
    expect(nodes.slice(0, 9).every((node) => node.entityIds?.includes('alliance-adventurers')
      && !node.entityIds?.includes('horde-adventurers'))).toBe(true);
    expect(nodes.slice(9, 20).every((node) => node.entityIds?.includes('horde-adventurers')
      && !node.entityIds?.includes('alliance-adventurers'))).toBe(true);
    expect(nodes.every((node) => !data.events.find((event) => event.id === node.eventIds?.[0])?.causedByEventIds?.length)).toBe(true);
    for (const node of nodes) {
      const mapStateId = node.visualActions?.find((action) => action.type === 'set_map_state');
      expect(mapStateId?.type).toBe('set_map_state');
      if (mapStateId?.type !== 'set_map_state') throw new Error('Missing illustrated scene transition');
      const mapState = data.mapStates.find((state) => state.id === mapStateId.mapStateId)!;
      expect(mapState.presentation).toBe('relational');
      expect(existsSync(resolve('public', mapState.terrainTextureAsset!))).toBe(true);
      const event = data.events.find((item) => item.id === node.eventIds?.[0])!;
      expect(event.claimIds?.every((id) => data.claims.find((claim) => claim.id === id)?.citationIds.length)).toBe(true);
      const track = audioManifest.tracks.find((item) => item.nodeId === node.id)!;
      expect(node.voiceover?.assetPath).toBe(track.assetPath);
      expect(createHash('sha256').update(node.narration).digest('hex')).toBe(track.transcriptSha256);
      expect(createHash('sha256').update(readFileSync(resolve('public', track.assetPath))).digest('hex')).toBe(track.sha256);
      for (const id of node.entityIds ?? []) {
        const entity = data.entities.find((item) => item.id === id)!;
        const asset = entity.mapFigure?.asset ?? entity.mapVisual?.asset;
        expect(asset && existsSync(resolve('public', asset))).toBe(true);
        expect(data.spatialStates.some((state) => state.entityId === id && state.placementKind === 'relational')).toBe(true);
      }
    }
    expect(stormwind.recognizableTraits).toContain('Pale limestone and white masonry, blue cloth, restrained gold trim');
    expect(stormwind.pixelWidth).toBeGreaterThanOrEqual(512);
    expect(stormwind.pixelHeight).toBeGreaterThanOrEqual(512);
    expect(visualLedger.sceneLedger).toHaveLength(21);
    expect(visualLedger.sceneLedger.every((scene) => existsSync(resolve(scene.environmentPath)))).toBe(true);
  });

  it('keeps the refreshed Era 9 narration in the audio hash manifest', () => {
    const data = loadDataset();
    const guide = data.storyGuides.find((item) => item.id === 'modern-cosmic-age-guided-history')!;
    const manifest = JSON.parse(readFileSync(resolve('public/audio/guided/manifest.json'), 'utf8')) as {
      trackCount: number;
      tracks: { nodeId: string; assetPath: string; durationMs: number; bytes: number; sha256: string }[];
    };
    expect(manifest.trackCount).toBe(manifest.tracks.length);
    expect(new Set(manifest.tracks.map((track) => track.nodeId)).size).toBe(manifest.trackCount);
    for (const nodeId of guide.nodeIds) {
      const node = data.storyNodes.find((item) => item.id === nodeId)!;
      const track = manifest.tracks.find((item) => item.nodeId === nodeId)!;
      expect(track.assetPath).toBe(node.voiceover?.assetPath);
      expect(track.durationMs).toBe(node.voiceover?.durationMs);
      const bytes = readFileSync(resolve('public', track.assetPath));
      expect(bytes.length).toBe(track.bytes);
      expect(createHash('sha256').update(bytes).digest('hex')).toBe(track.sha256);
    }
  });

  it('keeps every Scepter scene sourced, represented, and matched to its recording', () => {
    const data = loadDataset();
    const guide = data.storyGuides.find(item => item.id === 'scepter-of-the-shifting-sands-guide')!;
    const story = data.storylines.find(item => item.storyGuideId === guide.id)!;
    const manifest = JSON.parse(readFileSync('public/audio/guided/manifest.json', 'utf8')) as {
      tracks: { nodeId: string; assetPath: string; sha256: string; transcriptSha256: string; durationMs: number }[];
    };
    expect(guide.contentStatus).toBe('research');
    expect(guide.nodeIds).toHaveLength(22);
    for (const [index, nodeId] of guide.nodeIds.entries()) {
      const node = data.storyNodes.find(item => item.id === nodeId)!;
      const track = manifest.tracks.find(item => item.nodeId === nodeId)!;
      expect(story.chapters[index]?.body).toBe(node.narration);
      expect(createHash('sha256').update(node.narration).digest('hex')).toBe(track.transcriptSha256);
      expect(createHash('sha256').update(readFileSync(resolve('public', track.assetPath))).digest('hex')).toBe(track.sha256);
      expect(track.durationMs).toBeGreaterThan(0);
      expect(node.voiceover?.durationMs).toBe(track.durationMs);
      const event = data.events.find(item => item.id === node.eventIds?.[0])!;
      expect(event.contentStatus).toBe('research');
      expect(event.claimIds?.every(id => data.claims.find(claim => claim.id === id)?.citationIds.length)).toBe(true);
      for (const id of node.entityIds ?? []) {
        const entity = data.entities.find(item => item.id === id)!;
        expect(entityVisibleInEra(entity, guide.eraId, data.eras)).toBe(true);
        const asset = entity.mapFigure?.asset ?? entity.mapVisual?.asset;
        expect(asset && existsSync(resolve('public', asset))).toBeTruthy();
      }
    }
  });

  it('can exclude placeholder and research records from a publication build', () => {
    const data = loadDataset({ publishedOnly: true });
    expect(data.eras).toEqual([]);
    expect(data.entities).toEqual([]);
    expect(data.battles).toEqual([]);
    expect(data.sources).toEqual([]);
  });

  it('keeps Swift Flight Form fully sourced and in the Burning Crusade story order', () => {
    const data = loadDataset();
    const story = data.storylines.find((item) => item.id === 'swift-flight-form-raven-legacy')!;
    const guide = data.storyGuides.find((item) => item.id === story.storyGuideId)!;
    const nodes = guide.nodeIds.map((id) => data.storyNodes.find((node) => node.id === id)!);
    const tour = data.storyTours.find((item) => item.slug === 'classic-to-wrath')!;
    const entry = tour.entries.find((item) => item.storylineId === story.id)!;
    const ledger = JSON.parse(readFileSync(resolve('docs/research/swift-flight-form-raven-legacy-visual-assets.json'), 'utf8')) as {
      assets: { imagePath: string; byteLength: number; sha256: string; alphaExpected: boolean }[];
      scenes: { nodeId: string; environmentAsset: string; cast: { entityId: string; imagePath: string | null }[] }[];
      audio: { tracks: { nodeId: string; assetPath: string; byteLength: number; sha256: string; transcriptSha256: string }[] };
    };
    const audio = JSON.parse(readFileSync(resolve('public/audio/guided/manifest.json'), 'utf8')) as {
      tracks: { nodeId: string; assetPath: string; durationMs: number; sha256: string; transcriptSha256: string }[];
    };

    expect(story.contentStatus).toBe('research');
    expect(story.eraIds).toEqual(['age-of-adventurers']);
    expect(story.showInEraTourOffshoots).toBe(false);
    expect(guide.contentStatus).toBe('research');
    expect(guide.nodeIds).toHaveLength(17);
    expect(entry.order).toBe(18);
    expect(entry.regionIds).toEqual(['outland', 'kalimdor']);
    expect(tour.entries).toHaveLength(22);
    expect(tour.entries.find((item) => item.storylineId === 'netherwing-liberation')?.order).toBe(17);
    expect(tour.entries.find((item) => item.storylineId === 'missing-diplomat-original-investigation')?.order).toBe(19);
    expect(data.eras.find((item) => item.id === 'age-of-adventurers')?.storyGuideId).not.toBe(guide.id);
    expect(nodes.map((node) => node.id)).toEqual(ledger.scenes.map((scene) => scene.nodeId));
    expect(ledger.audio.tracks).toHaveLength(nodes.length);
    expect(nodes.every((node) => node.eventIds?.length === 1 && node.entityIds?.length
      && node.voiceover?.assetPath && node.visualActions?.some((action) => action.type === 'set_map_state'))).toBe(true);
    expect(nodes[3]?.narration).toMatch(/witness’s suspicion/i);
    expect(nodes[9]?.narration).toMatch(/Anzu/);
    expect(nodes.slice(10, 13).map((node) => node.title)).toEqual([
      'The first shrine: Eagle', 'The second shrine: Falcon', 'The third shrine: Hawk',
    ]);
    expect(nodes.at(-1)?.narration).toMatch(/followers might help him rise again/);

    for (const [index, node] of nodes.entries()) {
      const scene = ledger.scenes[index]!;
      expect(scene.cast.map((visual) => visual.entityId)).toEqual(node.entityIds);
      expect(existsSync(resolve('public', scene.environmentAsset))).toBe(true);
      expect(scene.cast.every((visual) => visual.imagePath && existsSync(resolve('public', visual.imagePath)))).toBe(true);
      const stateId = node.visualActions?.find((action) => action.type === 'set_map_state');
      expect(stateId?.type).toBe('set_map_state');
      const mapState = data.mapStates.find((item) => item.id === stateId?.mapStateId)!;
      expect(mapState.presentation).toBe('relational');
      expect(mapState.terrainTextureAsset).toBe(scene.environmentAsset);
      const event = data.events.find((item) => item.id === node.eventIds?.[0])!;
      const claim = data.claims.find((item) => item.id === event.claimIds?.[0])!;
      expect(claim.citationIds.length).toBeGreaterThan(0);
      expect(claim.citationIds.every((citationId) => data.citations.some((citation) => citation.id === citationId))).toBe(true);
      expect(claim.citationIds.every((citationId) => data.sources.some((source) => source.id === data.citations.find((citation) => citation.id === citationId)?.sourceId))).toBe(true);
      const track = audio.tracks.find((item) => item.nodeId === node.id)!;
      expect(track.assetPath).toBe(node.voiceover?.assetPath);
      expect(track.transcriptSha256).toBe(createHash('sha256').update(node.narration).digest('hex'));
      expect(track.sha256).toBe(createHash('sha256').update(readFileSync(resolve('public', track.assetPath))).digest('hex'));
      expect(track.durationMs).toBeGreaterThan(0);
    }
    const environmentAssets = new Set(ledger.scenes.map((scene) => scene.environmentAsset));
    for (const asset of ledger.assets) {
      const bytes = readFileSync(resolve('public', asset.imagePath));
      expect(bytes.length).toBe(asset.byteLength);
      expect(createHash('sha256').update(bytes).digest('hex')).toBe(asset.sha256);
      expect(asset.alphaExpected).toBe(!environmentAssets.has(asset.imagePath));
    }
  });

  it('detects missing published citations and unintended causal cycles', () => {
    const data = structuredClone(loadDataset());
    const battle = data.battles[0]!;
    const claim = data.claims.find((item) => item.subjectId === battle.id)!;
    battle.contentStatus = 'published';
    claim.citationIds = [];
    data.relationships.push({
      id: 'reverse-cycle-research',
      fromId: 'black-empire-dominion',
      toId: 'black-empire-rises',
      type: 'causes',
      citationIds: ['warcraft-wiki-black-empire-ancient-times'],
      confidence: 'explicit',
    });
    const codes = validateDatasetReferences(data, { geometryIds: geometryIds() }).map((issue) => issue.code);
    expect(codes).toContain('missing-citation');
    expect(codes).toContain('causal-cycle');
  });

  it('rejects cross-record references to the wrong collection', () => {
    const data = structuredClone(loadDataset());
    data.entities[0]!.sourceIds = ['regions'];
    const issues = validateDatasetReferences(data, { geometryIds: geometryIds() });
    expect(issues).toContainEqual(expect.objectContaining({
      code: 'broken-reference',
      message: 'Unknown source ID: regions',
    }));
  });
});
