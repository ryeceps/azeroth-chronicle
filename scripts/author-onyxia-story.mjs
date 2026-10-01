import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import process from 'node:process';

const root = process.cwd();
const eraId = 'age-of-adventurers';
const storyId = 'stormwind-onyxia-conspiracy';
const guideId = storyId + '-guide';
const worldspaceId = 'onyxia-story-theater';
const write = async (file, value) => {
  const full = path.join(root, file);
  await mkdir(path.dirname(full), { recursive: true });
  await writeFile(full, typeof value === 'string' ? value : JSON.stringify(value, null, 2) + '\n');
};
const environmentRefs = [
  ['burning-steppes','exec-7da92d9f-49c2-419c-b523-cc15613855d2.png','Burning Steppes','Scorched ochre highlands beneath Blackrock Mountain, cinder haze, cracked dark rock and volcanic glow.'],
  ['stormwind-keep','exec-1c1a0d3d-2b99-480f-aabd-49df6c88f4a5.png','Stormwind Keep','Pale limestone and white masonry, blue cloth, restrained gold trim, high square towers and bright Alliance heraldry; no red-brown palette.'],
  ['blackrock-prison','exec-7e9112c7-8e6e-468c-ad83-e5782d79266c.png','Blackrock Depths','Basalt halls, dwarven ironwork and prison bars, heavy angular masonry, distant lava light.'],
  ['blackrock-forge','exec-096e2c8a-48c4-4803-af4a-1c716be9b0c0.png','Blackrock Depths','Deep Forge: black stone, furnace mouths, iron chains, dwarven industrial scale and molten orange light.'],
  ['blackrock-spire','exec-bd8082e8-b2c3-4e0c-8bcc-0f5441ef8735.png','Blackrock Spire','Jagged volcanic citadel, black and rust-red stone, iron battlements and firelit upper passages.'],
  ['orgrimmar','exec-704135af-237b-42f1-abdd-22d38b1c2913.png','Orgrimmar','Red sandstone cliffs, timber platforms, iron spikes and hide-and-metal Horde construction.'],
  ['western-plaguelands','exec-6c319c58-1207-4078-a0e1-d2b838d44557.png','Western Plaguelands','Dead farmland, bare trees, ruined stone and a pallid green-grey blight haze.'],
  ['dustwallow','exec-fc682224-3b9c-4a38-9a91-fcc7bda008f2.png','Dustwallow Marsh','Warm wetland air, dark water, cypress roots, hanging vines, reeds and muddy banks.'],
  ['winterspring','exec-7c7379c6-cb4e-49c3-b901-eb2930d7350c.png','Winterspring','Blue-white snow, alpine ridges, frosted conifers and crisp blue mountain shadow.'],
  ['onyxia-lair','exec-976667cb-55b0-466a-bfa9-6fb491b2be04.png','Onyxia’s Lair','Cavernous black volcanic den, basalt shelves, deep ember glow and a broad dragon-scale chamber.'],
  ['tanaris','exec-8cc61451-6e25-4a78-9e30-f8c64dde1b6b.png','Tanaris','Open ochre dunes, sun-bleached cliffs, eroded mesas and hard high-desert light.'],
  ['wetlands','exec-c19f5b91-6984-4164-99ad-0902f280f505.png','Wetlands','Broad damp lowland, grey-green water, reeds, mist and a distant rocky coast.'],
  ['badlands','exec-de1ea288-ed52-444d-8cb1-a7a8c2329762.png','Badlands','Rust-red gullies, dusty mesas, exposed sediment and dry open sky.'],
  ['swamp-of-sorrows','exec-5f2df857-4fc9-4373-b2ff-ba909094f74c.png','Swamp of Sorrows','Sour green marshwater, mossy cypress, tangled vegetation and humid haze.'],
  ['desolace','exec-bd3daed2-9985-4c7b-aa50-27922429638b.png','Desolace','Pale grey-violet dust, sparse scrub, bone-dry ridges and a vast muted horizon.'],
  ['skull-trials','exec-a55640e8-efea-417a-9246-d8acf53a971b.png','Tanaris · Winterspring · Swamp of Sorrows','Three distinct panels: Tanaris ochre dunes, Winterspring blue-white alpine snow and Swamp of Sorrows green marsh; comparison, not a connected map.'],
];
const actorRefs = [
  ['onyxia','exec-c80b50cf-86e0-4cf3-bf86-b893feed5a2f.png','Onyxia','character','dragon'],
  ['katrana-prestor','exec-5c133bbd-3eb1-4b27-b62e-f9bb563e39fc.png','Katrana Prestor','character','woman'],
  ['marshal-windsor','exec-1d20b057-ca39-4e50-8dd7-3b45db4faad3.png','Marshal Windsor','character','man'],
  ['bolvar-fordragon','exec-1562e703-0fa2-4072-aace-2e2a87d29594.png','Bolvar Fordragon','character','man'],
  ['rexxar','exec-20630329-7209-494f-94cc-bc4ec9a896da.png','Rexxar','character','half-ogre'],
  ['myranda-the-hag','exec-773d4e9f-41bd-4a08-a521-ddaebf17ea57.png','Myranda the Hag','character','woman'],
  ['emberstrife','exec-edc1166f-574c-4978-b91c-074c5c1c584b.png','Emberstrife','character','dragon'],
  ['horde-adventurers','exec-2e1ab137-c082-4692-b1c7-a108023faefb.png','Horde party','faction','orc-troll-tauren ensemble'],
  ['alliance-adventurers','exec-6d7ab497-0adb-4b70-b457-ebc259ec7039.png','Alliance party','faction','human-dwarf-night-elf ensemble'],
  ['test-skull-dragons','exec-87768d27-a86e-47e0-bf24-cea5fe56f803.png','Dragon trials','faction','three dragon ensemble'],
  ['general-drakkisath','exec-f7581387-7803-4e02-b1d6-cd38d0bfb0e2.png','General Drakkisath','character','dragon'],
  ['drakefire-amulet','exec-7d86f74a-439b-4985-8b63-356239555280.png','Drakefire Amulet','artifact','red-gold pendant'],
  ['amulet-of-draconic-subversion','exec-5231143e-53fe-4867-9960-9dafe524f62f.png','Amulet of Draconic Subversion','artifact','purple enchantment pendant'],
  ['haleh','exec-4525ff14-46e0-4246-b29e-cec27d5dc45f.png','Haleh','character','woman'],
  ['warchief-rend-blackhand','exec-fa0b90e7-5e10-4196-bd8c-d36bd95a3180.png','Warchief Rend Blackhand','character','orc'],
  ['axtroz','exec-83ab2c90-1cfc-45a1-8ea2-e986894b93b1.png','Axtroz','character','red dragon'],
  ['dragon-eye-fragment','exec-07d11a3c-3cad-4efc-ba85-bcdc7da99209.png','The Dragon’s Eye','artifact','translucent pale-blue crystal shard with an eye-like motif'],
  ['eitrigg','exec-ced03b55-8f75-4534-a77d-3315949f9bf3.png','Eitrigg','character','elder orc statesman'],
];
const pixelSizes = {
  'burning-steppes':[1536,1024], 'stormwind-keep':[1536,1024], 'blackrock-prison':[1536,1024],
  'blackrock-forge':[1536,1024], 'blackrock-spire':[1536,1024], orgrimmar:[1536,1024],
  'western-plaguelands':[1536,1024], dustwallow:[1536,1024], winterspring:[1536,1024],
  'onyxia-lair':[1536,1024], tanaris:[1536,1024], wetlands:[1536,1024], badlands:[1536,1024],
  'swamp-of-sorrows':[1536,1024], desolace:[1536,1024], 'skull-trials':[1536,1024],
  onyxia:[1254,1254], 'katrana-prestor':[1024,1536], 'marshal-windsor':[1024,1536],
  'bolvar-fordragon':[1024,1536], rexxar:[1024,1536], 'myranda-the-hag':[1024,1536],
  emberstrife:[1536,1024], 'horde-adventurers':[1145,1374], 'alliance-adventurers':[1145,1374],
  'test-skull-dragons':[1536,1024], 'general-drakkisath':[1024,1536], 'drakefire-amulet':[1024,1536],
  'amulet-of-draconic-subversion':[1024,1536], haleh:[1024,1536], 'warchief-rend-blackhand':[1024,1536],
  axtroz:[1536,1024], 'dragon-eye-fragment':[1360,1156], eitrigg:[1145,1374],
};
const sources = [
  { id:'onyxia-classic-attunement', title:'Onyxia’s Lair Attunement and Drakefire Amulet Guide', url:'https://www.wowhead.com/classic/guide/onyxia-onyxias-lair-attunement-drakefire-amulet-wow-classic', sourceType:'website', notes:'Accessed 2026-09-30. WoW Classic Patch 1.15.8 secondary guide reproducing and ordering both faction quest chains. Locator only; compare each quest and dialogue with original game capture before human review.' },
  { id:'onyxia-attunement-wiki', title:'Onyxia’s Lair attunement', url:'https://warcraft.wiki.gg/wiki/Onyxia%27s_Lair_attunement', sourceType:'website', notes:'Accessed 2026-09-30. Secondary quest-chain locator for Alliance and Horde paths; not a substitute for original quest capture.' },
  { id:'onyxia-classic-raid', title:'Onyxia’s Lair Raid Overview', url:'https://www.wowhead.com/classic/guide/onyxia-onyxias-lair-raid-overview-wow-classic', sourceType:'website', notes:'Accessed 2026-09-30. Secondary reference for the original Classic lair encounter and Drakefire Amulet attunement requirement.' },
];
for (const source of sources) await write('data/sources/' + source.id + '.research.json', source);

const chain = ['onyxia-classic-attunement', 'onyxia-attunement-wiki'];
const beats = [
  { id:'dragonkin-menace', title:'A shadow over the Burning Steppes', env:'burning-steppes', cast:['alliance-adventurers'], src:chain, chapter:0, text:'In the Burning Steppes, black dragonkin gather beneath a sky troubled by ash. Their attacks turn a frontier alarm into a question about the reach of the black dragonflight. The Alliance investigation begins with scattered signs and grows toward the mountain that shelters them. The evidence points to a danger with a foothold beyond the wilds; it does not yet reveal the hand guiding Stormwind’s court.' },
  { id:'true-masters', title:'The court’s new voice', env:'stormwind-keep', cast:['alliance-adventurers','bolvar-fordragon','katrana-prestor'], src:chain, chapter:0, text:'Reports from Redridge and the Burning Steppes carry the search into Stormwind. In the Keep, Bolvar Fordragon bears the kingdom’s regency while Countess Katrana Prestor speaks with unusual influence. To the investigators, the mystery is no longer only a nest of dragonkin: a trusted figure sits within the very hall they are trying to protect. The resemblance between rumor and conspiracy remains a question still to be proved.' },
  { id:'windsor-in-the-depths', title:'The marshal in Blackrock Depths', env:'blackrock-prison', cast:['alliance-adventurers','marshal-windsor'], src:chain, chapter:0, text:'Deep in Blackrock Depths, Marshal Windsor has been held away from the court whose danger he understands. His account is not enough by itself to undo the power that silenced him. The adventurers find a soldier who has carried the truth through imprisonment, and a trail of evidence scattered through the fortress. The mountain’s iron rooms have become the place where a political mystery waits for its missing proof.' },
  { id:'shred-of-hope', title:'A shred of evidence', env:'blackrock-forge', cast:['alliance-adventurers','marshal-windsor'], src:chain, chapter:0, text:'A crumpled note points toward the fragments Windsor needs. The search passes through the forge and deeper chambers of Blackrock Mountain, where small pieces of a document matter more than the strength of the gates. Recovered evidence gives Windsor grounds to leave his cell and face the city again. This is the work of a rescue and an investigation together: one carries the other back into the light.' },
  { id:'jail-break', title:'The way out of the mountain', env:'blackrock-prison', cast:['alliance-adventurers','marshal-windsor'], src:chain, chapter:0, text:'The escape from Blackrock Depths is hard won. Windsor leads the way through hostile halls while his rescuers hold open each turn in the passage. Stormwind cannot hear its witness while he remains beneath the mountain. When the group emerges, the marshal can return to the city and place what he knows before the people who must judge it.' },
  { id:'stormwind-rendezvous', title:'The marshal returns', env:'stormwind-keep', cast:['alliance-adventurers','marshal-windsor','bolvar-fordragon'], src:chain, chapter:0, text:'Windsor comes back to Stormwind with the evidence gathered in Blackrock. The capital that once seemed distant from the frontier danger now becomes the stage for its reckoning. Bolvar receives the marshal’s return, and the city’s uneasy court gathers around the claim. The journey has changed the question: instead of asking whether the marshal can escape, the Alliance must decide whether it can hear him.' },
  { id:'great-masquerade', title:'The Great Masquerade', env:'stormwind-keep', cast:['alliance-adventurers','bolvar-fordragon','katrana-prestor','onyxia'], src:chain.concat(['story-onyxia-overview']), chapter:0, text:'Before the assembled court, Katrana Prestor’s disguise falls away. The woman who had stood near Stormwind’s seat of power is revealed as Onyxia, the black dragon whose agents troubled the frontier. Dragonkin answer her presence, and Bolvar stands against the assault as the adventurers fight to defend the Keep. The conspiracy is exposed, yet Onyxia escapes the city. Stormwind has found its hidden enemy, not ended the danger.' },
  { id:'dragons-eye', title:'A path to Haleh', env:'winterspring', cast:['alliance-adventurers','haleh','dragon-eye-fragment'], src:chain, chapter:0, text:'From the capital, the road winds into blue-white winter and brings the adventurers to Haleh. The Dragon’s Eye is the token that opens her counsel, turning Stormwind’s revelation into preparation. She names the test that lies ahead: the blood of a mighty black dragon, taken high within Blackrock Spire. Frost will soon give way to furnace heat.' },
  { id:'alliance-drakefire-amulet', title:'Blood and the Drakefire Amulet', env:'blackrock-spire', cast:['alliance-adventurers','general-drakkisath','drakefire-amulet'], src:chain, chapter:0, text:'In Upper Blackrock Spire, the adventurers face General Drakkisath and bring his blood to Haleh. From that trial comes the Drakefire Amulet, a ward that allows its bearer to withstand Onyxia’s lair. The Alliance has gone from suspicion to exposure and now to preparation. The key is won; the descent into the dragon’s den waits ahead.' },
  { id:'warlords-command', title:'Orders from the Badlands', env:'badlands', cast:['horde-adventurers'], src:chain, chapter:1, text:'Far from Stormwind’s court, the Horde receives a separate summons in the Badlands. Orders point toward the stronghold of Blackrock Spire and the power held there. This path does not begin as an answer to Windsor’s investigation; it grows from Horde intelligence, leaders and obligations of its own. The same mountain appears on another horizon, where a different people must decide what its threat means.' },
  { id:'eitriggs-wisdom', title:'The elder’s counsel', env:'orgrimmar', cast:['horde-adventurers','eitrigg'], src:chain, chapter:1, text:'At Orgrimmar, Eitrigg’s counsel turns the reports into a charge for the Horde. The old veteran understands the danger gathering around Blackrock and sends the adventurers back toward the stronghold with a clearer purpose. The city’s red stone and timber frame a different kind of authority from Stormwind’s court: experience offered in service to the Horde. Its path leads next to a contest for Blackrock Spire.' },
  { id:'for-the-horde', title:'A challenge in Blackrock Spire', env:'blackrock-spire', cast:['horde-adventurers','warchief-rend-blackhand'], src:chain, chapter:1, text:'The Horde’s orders bring the adventurers against Warchief Rend Blackhand in Blackrock Spire. His defeat and the proof carried away from it fulfill the charge entrusted to them. The mountain holds more than one danger, and the struggle with Rend belongs to the Horde’s own contest of power. It is a separate road from Windsor’s rescue, even as both paths approach the black dragon’s shadow.' },
  { id:'what-the-wind-carries', title:'Thrall’s account', env:'orgrimmar', cast:['horde-adventurers','thrall'], src:chain, chapter:1, text:'At Orgrimmar, Thrall speaks of the danger and sends the search outward toward Rexxar. The Warchief’s words widen the matter into a concern for the Horde itself. The tale now leaves the city’s red stone and timber for the open country. Ahead lies a champion whose life at the edge of society has made him known across Kalimdor.' },
  { id:'champion-of-horde', title:'Finding Rexxar', env:'desolace', cast:['horde-adventurers','rexxar'], src:chain, chapter:1, text:'Across Desolace, the adventurers seek Rexxar, a wandering champion of the Horde. His place between the wilds and settled life makes him the guide to a difficult next task. Here the great campaign narrows to a search for one champion moving through an immense, sparse land. Rexxar sets the terms for learning how an adventurer might pass the protections around Onyxia’s lair.' },
  { id:'testament-to-rexxar', title:'Myranda’s borrowed shape', env:'western-plaguelands', cast:['horde-adventurers','myranda-the-hag','amulet-of-draconic-subversion'], src:chain, chapter:1, text:'Rexxar’s instruction leads to Myranda the Hag in the blighted Western Plaguelands. Her magic prepares a means of taking a dragon’s shape, a disguise needed for the work to come. It does not make the adventurers dragons or erase their purpose; it is a temporary tool for passing the watchers of the mountain. In the scarred land, the Horde’s road turns from finding an ally to testing a dangerous deception.' },
  { id:'emberstrife', title:'The dragon who tests the mask', env:'dustwallow', cast:['horde-adventurers','emberstrife','amulet-of-draconic-subversion'], src:chain, chapter:1, text:'In the heat and dark water of Dustwallow Marsh, Emberstrife tests the forged appearance and sends the adventurers to claim dragon skulls from distant guardians. Three trials await beneath different skies, where the black dragonflight and its rivals still shape the wilds. Emberstrife will accept each skull as part of his demand; Myranda’s borrowed shape must hold until the passage is won.' },
  { id:'three-skull-trials', title:'Three trials, three horizons', env:'skull-trials', cast:['horde-adventurers','test-skull-dragons'], src:chain, chapter:1, text:'Three guardians stand in lands far apart: Chronalis beneath the Tanaris sun, Scryer amid Winterspring snow, and Somnus beneath the Swamp of Sorrows’ green canopy. Each place holds its own weather and color, and each dragon bears one part of the trial Emberstrife set. With the three skulls gathered, the Horde can complete his charge and carry Myranda’s borrowed shape toward the black dragon’s mountain.' },
  { id:'axtroz', title:'A final skull over the Wetlands', env:'wetlands', cast:['horde-adventurers','axtroz'], src:chain, chapter:1, text:'Axtroz waits amid the windswept Wetlands, where rain and low cloud soften the coast. This final dragon trial completes the tribute demanded by Emberstrife. Across Kalimdor’s distant shores and the Eastern Kingdoms, each challenge has brought the adventurers nearer to the mountain. Now their road turns back to Blackrock, where Drakkisath waits.' },
  { id:'horde-drakkisath', title:'The blood of Drakkisath', env:'blackrock-spire', cast:['horde-adventurers','general-drakkisath'], src:chain, chapter:1, text:'The Horde returns to Upper Blackrock Spire to confront General Drakkisath. The blood taken from this powerful black dragon completes the trial Rexxar laid before them. The Alliance has passed through its own hands to reach Haleh; the Horde has followed its leaders and its own road. Their stories share a threshold, but each company bears a separate history.' },
  { id:'rexxars-amulet', title:'Rexxar’s Drakefire Amulet', env:'desolace', cast:['horde-adventurers','rexxar','drakefire-amulet'], src:chain, chapter:1, text:'Back with Rexxar, the adventurers receive the Drakefire Amulet. The token bears the protection gathered from every trial and opens the way before them. The Horde has come to this gate by a road all its own: through intelligence, Eitrigg’s counsel, Thrall’s word, Rexxar’s charge and a dragon’s blood. At the mountain’s foot, that labor gives way to a final descent.' },
  { id:'onyxias-lair', title:'Into the dragon’s lair', env:'onyxia-lair', cast:['horde-adventurers','onyxia','drakefire-amulet'], src:['onyxia-classic-raid','story-onyxia-overview'], chapter:2, text:'The Drakefire Amulet opens the way to Onyxia’s Lair, where a band of champions at last faces the black dragon herself. The road began differently for those who came from Stormwind and those who answered the Horde’s call; each company enters beneath its own banners. Fire shivers across the stone as Onyxia takes wing. The struggle reaches its summit in this original Classic account, though its nameless adventurers are remembered as a company, not a single chosen champion.' },
];
const castIds = [...new Set(beats.flatMap((beat) => beat.cast))];
const actorById = new Map(actorRefs.map((actor) => [actor[0], actor]));
for (const id of castIds) if (id !== 'thrall' && !actorById.has(id)) throw new Error('Missing art for cast member ' + id);
for (const scene of environmentRefs) await access(path.join(root, 'public/images/storylines/onyxia', scene[0] + '.research.webp'));
for (const actor of actorRefs) await access(path.join(root, 'public/images/storylines/onyxia', actor[0] + '.research.webp'));

const sourceLookup = new Map(sources.map((source) => [source.id, source]));
const officialOverview = JSON.parse(await readFile(path.join(root, 'data/sources/story-onyxia-overview.research.json'), 'utf8'));
sourceLookup.set(officialOverview.id, officialOverview);
const names = new Map(actorRefs.map((actor) => [actor[0], actor[2]]));
names.set('thrall', 'Thrall');
for (const id of castIds) {
  if (id === 'thrall') continue;
  const actor = actorById.get(id);
  const related = beats.filter((beat) => beat.cast.includes(id));
  const sourceIds = [...new Set(related.flatMap((beat) => beat.src))];
  const common = {
    id, name: actor[2], slug: id,
    shortDescription: actor[3] === 'faction'
      ? actor[2] + ', an interpretive group representing one viewpoint in a separate faction quest path.'
      : actor[3] === 'artifact'
        ? actor[2] + ', shown as an original interpretive object in the Onyxia research story.'
        : actor[2] + ', represented in the Onyxia research story.',
    body: 'Original interpretive AI-generated artwork, not canonical game art or evidence for a costume, location or event. See the storyline production and visual ledgers for the evidence boundary.',
    firstEraId: eraId, featuredEraIds: [eraId], sourceIds,
    tags: ['onyxia-story', 'interpretive-art'], contentStatus: 'research',
  };
  const image = 'images/storylines/onyxia/' + id + '.research.webp';
  const visual = actor[3] === 'character'
    ? { mapFigure: { asset: image, scale: 0.86 } }
    : { mapVisual: { asset: image, scale: actor[3] === 'artifact' ? 0.72 : 0.88 } };
  await write('data/entities/' + id + '.research.json', { ...common, type: actor[3], ...visual });
  names.set(id, actor[2]);
}
const thrallPath = 'data/entities/thrall.research.json';
const thrall = JSON.parse(await readFile(path.join(root, thrallPath), 'utf8'));
thrall.featuredEraIds = [...new Set([...(thrall.featuredEraIds || []), eraId])];
thrall.sourceIds = [...new Set([...thrall.sourceIds, ...beats.filter((beat) => beat.cast.includes('thrall')).flatMap((beat) => beat.src)])];
await write(thrallPath, thrall);

const slots = new Map();
for (const id of castIds) {
  const neighbors = new Set(beats.filter((beat) => beat.cast.includes(id)).flatMap((beat) => beat.cast));
  const occupied = new Set([...neighbors].map((neighbor) => slots.get(neighbor)).filter((slot) => slot !== undefined));
  let slot = 0;
  while (occupied.has(slot)) slot++;
  slots.set(id, slot);
}
const columnCount = Math.max(...slots.values()) + 1;
const features = [];
for (const id of castIds) {
  const x = 3600 + slots.get(id) * 2800 / Math.max(1, columnCount - 1);
  const geometryId = 'onyxia-' + id + '-focus';
  features.push({ type:'Feature', id:geometryId, properties:{ name:id + ' editorial focus', contentStatus:'research', styleRole:'site', geographicCertainty:'unknown' }, geometry:{ type:'Point', coordinates:[x,5500] } });
  const sourceIds = [...new Set(beats.filter((beat) => beat.cast.includes(id)).flatMap((beat) => beat.src))];
  await write('data/spatial-states/onyxia-' + id + '.research.json', {
    id:'onyxia-' + id + '-theater', entityId:id, eraId, worldspaceId, geometryId,
    placementKind:'relational', geographicCertainty:'unknown', sourceIds,
    editorNote:'Editorial cast arrangement in an illustrated theater. This position conveys no game geography, travel route, formation or claim that these actors were simultaneously present.',
    visualPresence:'contextual', labelPriority:240,
  });
}
await write('data/geometry/onyxia-theater.research.geojson', { type:'FeatureCollection', features });
await write('data/worldspaces/' + worldspaceId + '.research.json', {
  id:worldspaceId, name:'Onyxia storyline — relational theater', slug:worldspaceId,
  coordinateSystem:{ width:10000, height:10000, origin:'bottom-left', units:'atlas-units' },
});
for (const scene of environmentRefs) await write('data/map-states/onyxia-' + scene[0] + '.research.json', {
  id:'onyxia-' + scene[0] + '-scene', name:'Onyxia: ' + scene[2] + ' illustrated scene',
  worldspaceId, presentation:'relational',
  terrainTextureAsset:'images/storylines/onyxia/' + scene[0] + '.research.webp',
  geometryIds:[], cartographyLabel:'ILLUSTRATED QUESTLINE THEATER',
  interpretationNote:'Original interpretive ' + scene[2] + ' scene with editorial cast placement, not a surveyed game map, dungeon layout, travel route or evidence of precise location. See the story visual ledger for area traits.',
});

const nodes = [];
for (let index = 0; index < beats.length; index++) {
  const beat = beats[index];
  const nodeId = 'onyxia-story-' + beat.id;
  const eventId = 'onyxia-' + beat.id + '-event';
  const citationIds = [];
  for (let sourceIndex = 0; sourceIndex < beat.src.length; sourceIndex++) {
    const citationId = 'onyxia-' + beat.id + '-citation-' + (sourceIndex + 1);
    citationIds.push(citationId);
    await write('data/citations/' + citationId + '.research.json', {
      id:citationId, sourceId:beat.src[sourceIndex],
      section:beat.chapter === 2 ? 'Onyxia’s Lair raid encounter and Drakefire Amulet attunement context' : beat.id === 'great-masquerade' ? 'Alliance chain: The Great Masquerade; Blizzard overview used only for raid context' : (beat.chapter === 1 ? 'Horde chain: ' : 'Alliance chain: ') + beat.title + ' and adjacent prerequisites',
      note:'Original paraphrase from a secondary Classic quest locator. Original quest capture and target-client/build comparison remain pending; Blizzard is cited only within its stated scope.',
    });
  }
  const claimId = 'onyxia-' + beat.id + '-claim';
  await write('data/claims/' + claimId + '.research.json', {
    id:claimId, subjectId:eventId, predicate:'questline_scene_account', value:beat.text,
    citationIds, confidence:'strongly_supported', status:'active',
    editorNote:'Research status: secondary quest locators supply the chain; compare named Classic quests, text, dialogue and faction path with original game capture before human promotion. Access order does not assert historical causation.',
  });
  await write('data/events/' + eventId + '.research.json', {
    id:eventId, kind:'event', name:beat.title, slug:'onyxia-' + beat.id,
    eraId, worldspaceId,
    date:{ precision:'relative', label:'Original World of Warcraft Onyxia story before the Wrath raid rerelease' },
    summary:beat.text, participantEntityIds:beat.cast, sourceIds:beat.src,
    claimIds:[claimId], contentStatus:'research',
  });
  nodes.push({
    id:nodeId, guideId, title:beat.title, narration:beat.text,
    durationMs:Math.round(beat.text.split(/\s+/).length / 82 * 60000) + 5000,
    eventIds:[eventId], entityIds:beat.cast,
    camera:{ position:[0,6.2,5.5], target:[0,0,0], durationMs:1150 },
    visualActions:[{ type:'set_map_state', mapStateId:'onyxia-' + beat.env + '-scene' }],
    ...(index ? { previousNodeId:'onyxia-story-' + beats[index - 1].id } : {}),
    ...(index < beats.length - 1 ? { nextNodeIds:['onyxia-story-' + beats[index + 1].id] } : {}),
  });
}
const nodeIds = nodes.map((node) => node.id);
const guide = { id:guideId, eraId, title:'The Dragon in Stormwind', description:'Two faction-specific paths expose Onyxia and prepare separate adventurers for the original raid.', nodeIds, contentStatus:'research' };
const storyPath = 'data/stories/' + storyId + '.research.json';
const previousStory = JSON.parse(await readFile(path.join(root, storyPath), 'utf8').catch(() => '{"nodes":[]}'));
for (const node of nodes) {
  const previousNode = previousStory.nodes.find((item) => item.id === node.id && item.narration === node.narration);
  if (previousNode?.voiceover) node.voiceover = previousNode.voiceover;
}
await write(storyPath, { guide, nodes });
const chapters = [
  { id:'the-queen-behind-the-court', eraId, title:'The Queen Behind the Court', body:'The Alliance follows the black dragonkin threat from the Burning Steppes into Stormwind, rescues Marshal Windsor from Blackrock Depths, and brings evidence before the court. The Great Masquerade exposes Onyxia, but her escape leaves the danger unresolved. The Drakefire Amulet is a later access key, not the climax of the political conspiracy.' },
  { id:'the-horde-path', eraId, title:'A Separate Road Through the Horde', body:'The Horde’s own chain runs from the Badlands through Eitrigg and Blackrock Spire, then Orgrimmar, Rexxar, Myranda, Emberstrife and the dragon trials. These prerequisites form a second viewpoint, not the continuation of Windsor’s Alliance journey.' },
  { id:'the-lair', eraId, title:'Past the Mountain', body:'Both factions independently prepare Drakefire Amulets and may then confront Onyxia in their own raid groups. The original raid encounter closes this telling; later Wrath changes and outcomes remain outside its historical cutoff.' },
];
const storySourceIds = [...new Set(beats.flatMap((beat) => beat.src))];
const storyline = {
  id:storyId, slug:storyId, title:'The Dragon in Stormwind',
  summary:'A conspiracy reaches from the Burning Steppes into Stormwind’s court while a separate Horde intelligence path follows Rexxar toward Onyxia’s lair.',
  opening:'The city seemed to rest behind pale stone and blue banners. Yet the black dragon’s influence had entered its court, and far away the Horde began a different search beneath the same mountain.',
  primaryEraId:eraId, eraIds:[eraId], chapters, sourceIds:storySourceIds, storyGuideId:guideId,
  fullTourPlacement:{ afterNodeId:'adventurers-story-gates', order:1 },
  reviewNote:'Complete illustrated research telling with 21 scenes, distinct Alliance and Horde chains, separate Drakefire Amulet attunement, and the original Classic lair encounter. The quest spine was mapped from accessible secondary Classic locators; original quest text/build comparison, in-client visual comparison and human lore/art review are still required before promotion. The chains are not an Alliance–Horde causal link or one canonical player. Later Wrath raid changes are excluded.',
  contentStatus:'research',
};
await write('data/storylines/' + storyId + '.research.json', storyline);
const eraPath = 'data/eras/age-of-adventurers.research.json';
const era = JSON.parse(await readFile(path.join(root, eraPath), 'utf8'));
era.sourceIds = [...new Set([...era.sourceIds, ...storySourceIds])];
await write(eraPath, era);

const assetRecords = [];
for (const scene of environmentRefs) {
  const file = 'public/images/storylines/onyxia/' + scene[0] + '.research.webp';
  const bytes = await readFile(path.join(root, file));
  assetRecords.push({
    id:scene[0], kind:'environment', file, area:scene[2],
    pixelWidth:pixelSizes[scene[0]][0], pixelHeight:pixelSizes[scene[0]][1],
    targetEditionBuild:'WoW Classic 1.15.8 quest locator; original WoW area identity and visual language',
    recognizableTraits:scene[3],
    generationBrief:'Reconstructed image prompt: original interpretive fantasy atlas landscape for ' + scene[2] + '; preserve these visible traits: ' + scene[3] + ' Wide environmental painting with no text or copied game screenshot.',
    promptStatus:'reconstructed from the generation brief retained in the session', transparency:false,
    visualReview:'Reviewed for the listed palette, terrain and landmark language. No direct original-client screenshot comparison is claimed; human in-client comparison remains a promotion gate.',
    byteLength:bytes.length, sha256:createHash('sha256').update(bytes).digest('hex'),
  });
}
for (const actor of actorRefs) {
  const file = 'public/images/storylines/onyxia/' + actor[0] + '.research.webp';
  const bytes = await readFile(path.join(root, file));
  assetRecords.push({
    id:actor[0], kind:actor[3], file, representedBy:actor[2],
    pixelWidth:pixelSizes[actor[0]][0], pixelHeight:pixelSizes[actor[0]][1],
    area:'Character, party or artifact cutout for the original Classic Onyxia story',
    targetEditionBuild:'WoW Classic 1.15.8 quest locator; original WoW character/artifact identity',
    generationBrief:actor[0] === 'dragon-eye-fragment'
      ? 'Exact prompt: Create a single original, polished fantasy game concept art asset: an ancient blue dragon eye fragment, a small irregular shard of translucent pale azure crystal with a faint dragon-eye slit motif suspended inside, beveled glass edges and restrained silver-blue highlights. Isolated object centered, front three-quarter view, genuinely transparent background, no extra shadow, no text, no frame, no extra props. It must clearly read as a distinct magical shard artifact, not a person or medallion. Original fantasy interpretation, not copied from any existing game asset.'
      : actor[0] === 'eitrigg'
        ? 'Exact prompt: Original painterly fantasy character cutout for a Warcraft-inspired historical atlas: Eitrigg, an elderly veteran orc statesman and Horde advisor. Weathered green-grey face, strong tusks, long silver-grey beard and hair, calm direct gaze, modest worn plate and leather armor with muted Horde-red leather accents, dignified and practical, no weapon raised. Full torso/three-quarter portrait, centered, detailed painterly lighting consistent with grounded high fantasy game concept art, genuinely transparent background, no ground plane, no text, no frame, no banner. This is an original interpretation, not a copy of existing game art.'
        : 'Reconstructed image prompt: distinct original painterly transparent cutout of ' + actor[2] + ', represented as ' + actor[4] + ' for the Onyxia storyline; no text, no frame, interpretive and not canonical game art.',
    promptStatus:actor[0] === 'dragon-eye-fragment' || actor[0] === 'eitrigg' ? 'exact prompt retained in production source' : 'reconstructed from the generation brief retained in the session', transparency:true,
    visualReview:'Distinct original painterly representation, visually checked for separation and readability in its authored scene; not canonical game art or a likeness source.',
    byteLength:bytes.length, sha256:createHash('sha256').update(bytes).digest('hex'),
  });
}
const sceneLedger = beats.map((beat, index) => ({
  nodeId:nodes[index].id, title:beat.title,
  environmentPath:'public/images/storylines/onyxia/' + beat.env + '.research.webp',
  gameArea:environmentRefs.find((scene) => scene[0] === beat.env)[2],
  recognizableTraits:environmentRefs.find((scene) => scene[0] === beat.env)[3],
  referenceEditionBuild:'WoW Classic 1.15.8 locator; original WoW area identity',
  cast:beat.cast.map((id) => ({ id, name:names.get(id), image:id === 'thrall' ? 'public/images/characters/third-war-frozen-throne/thrall.research.webp' : 'public/images/storylines/onyxia/' + id + '.research.webp' })),
  visualActions:['set_map_state', 'highlight story cast'],
  visualReview:'Scene checked against its listed area traits and story composition. Exact in-client resemblance check remains a human review gate.',
}));
await write('docs/research/onyxia-visual-assets.json', {
  storyId, status:'research',
  targetEditionBuild:'WoW Classic 1.15.8 for accessible quest locators; visual reference is the original WoW area identity and style.',
  editorialRule:'Preserve each zone’s recognizable materials, palette, terrain, skyline and landmarks. Stormwind Keep uses pale/white stone with blue and gold; red-brown stone or red-banner language would be incorrect.',
  assetRecords, sceneLedger,
});

let ledger = '# The Dragon in Stormwind — research and production ledger\n\n';
ledger += 'Status: complete illustrated research story; not reviewed or published. ' + nodes.length + ' scenes; ' + nodes.reduce((total, node) => total + node.narration.split(/\s+/).length, 0) + ' narration words. Primary era: Era 8 / original World of Warcraft. Historical cutoff: before Wrath of the Lich King rerelease. Quest prerequisites provide the story order, not proof that one event caused another.\n\n';
ledger += '## Source and edition boundary\n\nQuest order and text leads were mapped from WoW Classic Patch 1.15.8 secondary pages and the Warcraft Wiki locator. No original-client quest capture, full dialogue audit or exact edition comparison is claimed. The Blizzard overview supports raid context only; it does not establish Windsor-chain details. Original Classic game-text capture and human claim review are required before promotion. All prose is paraphrased; generated art is interpretive, not canon evidence.\n\n';
ledger += 'Sources: ' + storySourceIds.map((id) => '[' + id + '](' + ((sourceLookup.get(id) || officialOverview).url) + ')').join('; ') + '.\n\n';
ledger += '## Separate quest dependency paths\n\n';
ledger += '**Alliance:** Dragonkin Menace and True Masters → Windsor held in Blackrock Depths → note and two fragments of evidence → Jail Break! → Windsor returns to Stormwind → The Great Masquerade exposes Onyxia → Dragon’s Eye leads to Haleh → Drakkisath’s blood → Drakefire Amulet → Onyxia’s Lair.\n\n';
ledger += '**Horde:** Warlord’s Command → Eitrigg’s Wisdom → For the Horde! and Rend’s head → What the Wind Carries / Thrall → Champion of the Horde / Rexxar → Testament to Myranda → Emberstrife and the Amulet of Draconic Subversion → three skull trials (Chronalis, Scryer and Somnus are independent and may be done in any order) → Axtroz → Drakkisath’s blood → Rexxar and Drakefire Amulet → Onyxia’s Lair.\n\n';
ledger += 'These are separate faction access chains. The presentation does not merge the parties, assert a shared player, draw a geographic path through the theater or infer that an access step caused the political conspiracy. Attunement and raid outcome are distinct. The lair scene represents one faction raid party at a time. Later Wrath and expansion material is excluded.\n\n';
ledger += '## Scene and evidence ledger\n\n| Scene | Evidence and citations | Cast | Environment and game area | Geography and status |\n| --- | --- | --- | --- | --- |\n';
for (const beat of beats) {
  const citationIds = beat.src.map((sourceId, sourceIndex) => 'onyxia-' + beat.id + '-citation-' + (sourceIndex + 1));
  const scene = environmentRefs.find((item) => item[0] === beat.env);
  ledger += '| ' + beat.title + ' | ' + beat.src.join(', ') + '; ' + citationIds.join(', ') + ' | ' + beat.cast.join(', ') + ' | ' + scene[0] + ': ' + scene[2] + ' | Editorial relational stage; research, relative time |\n';
}
ledger += '\n## Visual and review notes\n\nEvery node maps to its environmental image, and each principal actor, group, shard or amulet has a distinct representation. Asset paths, pixel dimensions, SHA-256, area traits, target build and review boundary are in [onyxia-visual-assets.json](onyxia-visual-assets.json). Stormwind Keep deliberately uses pale stone, blue cloth and gold trim. The story template now carries this place-resemblance requirement into future projects. No original-client screenshot comparison is claimed; it remains a human approval gate. The three skull destinations are different landscape panels, not a connected route.\n\n';
ledger += 'Engine: existing standalone validated Storyline → StoryGuide selector and era playback; no era-guide replacement or story-specific engine condition. The story follows Scepter in full-tour order. Figures use existing mapFigure/mapVisual rendering and relational SpatialStates; environments use relational MapStates. Each node has a cited Event and Claim. All ' + nodes.length + ' transcripts have repository-backed Kokoro voice tracks; listening and pronunciation approval remain part of human review. The transcript remains authoritative and accessible. Remaining human gates: original-client quest/build capture; chronology and dialogue review; in-client zone art review; listening review; and claim approval.\n';
await write('docs/research/onyxia-story-production.md', ledger);
process.stdout.write('Authored ' + nodes.length + ' illustrated nodes, ' + actorRefs.length + ' new cast records, and ' + environmentRefs.length + ' area scenes.\n');
