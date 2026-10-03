import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const storyId = 'champion-of-the-naaru-outland-trials';
const guideId = `${storyId}-guide`;
const worldspaceId = `${storyId}-theater`;
const eraId = 'age-of-adventurers';
const artRoot = 'images/storylines/champion-of-the-naaru';
const storyPath = `data/stories/${storyId}.research.json`;
const priorVoiceovers = new Map();
try {
  const previous = JSON.parse(await readFile(path.join(root, storyPath), 'utf8'));
  for (const node of previous.nodes ?? []) if (node.voiceover) priorVoiceovers.set(node.id, node.voiceover);
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

const write = async (file, value) => {
  const target = path.join(root, file);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, `${JSON.stringify(value, null, 2)}\n`);
};
const readJson = async (file) => JSON.parse(await readFile(path.join(root, file), 'utf8'));
const sha256 = (buffer) => createHash('sha256').update(buffer).digest('hex');
const distinct = (values) => [...new Set(values)];

const sources = [
  {
    id: 'champion-naaru-blizzard-attunement-overview',
    title: 'Get Attuned and Face the Overlords of Outland',
    url: 'https://worldofwarcraft.blizzard.com/en-us/news/23716331/get-attuned-and-face-the-overlords-of-outland',
    sourceType: 'website',
    notes: 'Accessed 2026-10-02. First-party Blizzard overview for the Cipher handoff to Khadgar and A’dal, all four trial destinations, The Tempest Key and Eye access, and the separate Serpentshrine Cavern condition described for the Champion of the Naaru title. Retrospective Burning Crusade Classic guide, not an original 2007 client capture or a guarantee that every historical patch used the same title rules.',
  },
  {
    id: 'champion-naaru-tempest-key-quest-10883',
    title: 'The Tempest Key (quest 10883)',
    url: 'https://www.wowhead.com/tbc/quest=10883/the-tempest-key',
    sourceType: 'quest',
    notes: 'Accessed 2026-10-02. Secondary transcription of the original Burning Crusade quest description and completion text. It preserves A’dal’s stated reason Kael’thas must be stopped, the naaru origin of Tempest Keep, and the purpose of the trials. Compare exact wording and client state against the original TBC build before lore promotion.',
  },
  {
    id: 'champion-naaru-mercy-quest-10884',
    title: 'Trial of the Naaru: Mercy (quest 10884)',
    url: 'https://www.wowhead.com/tbc/quest=10884/trial-of-the-naaru-mercy',
    sourceType: 'quest',
    notes: 'Accessed 2026-10-02. Secondary transcription of the original Burning Crusade quest description and completion text. It names three prisoners held by Kargath, the requested rescue, the unused executioner’s axe and the passed-trial result. It does not supply a named survivor roll; player comments are not used as event evidence.',
  },
  {
    id: 'champion-naaru-strength-quest-10885',
    title: 'Trial of the Naaru: Strength (quest 10885)',
    url: 'https://www.wowhead.com/tbc/quest=10885/trial-of-the-naaru-strength',
    sourceType: 'quest',
    notes: 'Accessed 2026-10-02. Secondary transcription of the original Burning Crusade quest description and completion text. It explicitly divides Strength into Kalithresh’s trident in the Steamvault and Murmur’s essence in the Shadow Labyrinth. The story preserves them as halves of one trial.',
  },
  {
    id: 'champion-naaru-tenacity-quest-10886',
    title: 'Trial of the Naaru: Tenacity (quest 10886)',
    url: 'https://www.wowhead.com/tbc/quest=10886/trial-of-the-naaru-tenacity',
    sourceType: 'quest',
    notes: 'Accessed 2026-10-02. Secondary transcription of the original Burning Crusade quest description and completion text. It names Millhouse Manastorm as a stowaway caught by circumstance, requests his rescue from the Arcatraz, and requires that he survive. The capture explanation remains attributed to A’dal.',
  },
  {
    id: 'champion-naaru-magtheridon-quest-10888',
    title: 'Trial of the Naaru: Magtheridon (quest 10888)',
    url: 'https://www.wowhead.com/quest=10888/trial-of-the-naaru-magtheridon',
    sourceType: 'quest',
    notes: 'Accessed 2026-10-02. Secondary transcription of the original Burning Crusade quest ID 10888, including A’dal’s final trial description and completion text. Later replacement quest ID 13430 and later eligibility outcomes are excluded from the story.',
  },
  {
    id: 'champion-naaru-tbc-classic-attunement-hotfix',
    title: 'Hotfixes: February 15, 2022',
    url: 'https://worldofwarcraft.blizzard.com/en-us/news/23739169/hotfixes-february-15-2022',
    sourceType: 'website',
    notes: 'Accessed 2026-10-02. First-party Blizzard hotfix entry used only to distinguish the later Burning Crusade Classic raid-entry state from original quest-era attunement. Not used to revise original TBC story events or prove patch-independent Champion of the Naaru title eligibility.',
  },
];
const sourceById = new Map(sources.map((source) => [source.id, source]));

const environment = [
  {
    id: 'shattrath-lower-city',
    title: 'Shattrath, Lower City',
    asset: 'images/storylines/cipher-of-damnation/shattrath-lower-city.research.webp',
    reuse: 'Cipher of Damnation / Oronok story environment',
    traits: 'Pale draenei stone, stepped Outland city walls and the layered, inhabited silhouette of Lower City; warm dust beyond the pale masonry.',
    sourceIds: ['champion-naaru-blizzard-attunement-overview', 'champion-naaru-tempest-key-quest-10883'],
    review: 'Existing original environment illustration. Compare against the original TBC Lower City in-client; no exact meeting position is asserted.',
  },
  {
    id: 'shattrath-terrace-of-light',
    title: 'Shattrath, Terrace of Light',
    asset: 'images/storylines/karazhan/shattrath-terrace-of-light.research.webp',
    reuse: 'Karazhan / Master’s Key and Nightbane story environment',
    traits: 'Pale cream draenei arches and open terrace, with a luminous naaru crystal and the dusty, broken world beyond the city.',
    sourceIds: ['champion-naaru-blizzard-attunement-overview', 'champion-naaru-tempest-key-quest-10883'],
    review: 'Existing original environment illustration. Compare against the original TBC Terrace of Light in-client; the scene is relational, not an exact NPC coordinate.',
  },
  {
    id: 'shattered-halls',
    title: 'Shattered Halls, Hellfire Citadel',
    asset: 'images/storylines/karazhan/shattered-halls.research.webp',
    reuse: 'Karazhan / Master’s Key and Nightbane story environment',
    traits: 'Blackened iron gates, brutal rust-red fortress masonry, forge glow and a restrained fel-orc palette.',
    sourceIds: ['champion-naaru-mercy-quest-10884'],
    review: 'Existing original environment illustration. The route, gauntlet timer and dungeon layout are not asserted; compare the area against the matching TBC build.',
  },
  {
    id: 'steamvault',
    title: 'The Steamvault, Coilfang Reservoir',
    asset: 'images/storylines/karazhan/steamvault.research.webp',
    reuse: 'Karazhan / Master’s Key and Nightbane story environment',
    traits: 'Water-filled cavern works, enormous dark pipes, naga-built pumps, turquoise channels and wet industrial stone.',
    sourceIds: ['champion-naaru-strength-quest-10885'],
    review: 'Existing original environment illustration. It is not a surveyed dungeon plan; compare the named area against the matching TBC build.',
  },
  {
    id: 'shadow-labyrinth',
    title: 'Shadow Labyrinth, Auchindoun',
    asset: 'images/storylines/karazhan/shadow-labyrinth.research.webp',
    reuse: 'Karazhan / Master’s Key and Nightbane story environment',
    traits: 'Auchenai monumental stonework, dark violet-blue interior light and a deep, enclosed chamber distinct from the Coilfang works.',
    sourceIds: ['champion-naaru-strength-quest-10885'],
    review: 'Existing original environment illustration. It is not a surveyed dungeon plan; compare the named area against the matching TBC build.',
  },
  {
    id: 'arcatraz',
    title: 'The Arcatraz, Tempest Keep',
    asset: 'images/storylines/akama-black-temple/arcatraz.research.webp',
    reuse: 'Akama and the Black Temple story environment',
    traits: 'A floating crystalline prison with sharp draenei geometry, ivory and red structures, and Netherstorm’s violet void and broken rocks.',
    sourceIds: ['champion-naaru-tenacity-quest-10886'],
    review: 'Existing original environment illustration. It is not an exact ship plan or prison-cell location; compare against the matching TBC area and build.',
  },
  {
    id: 'magtheridons-lair',
    title: 'Magtheridon’s lair, Hellfire Citadel',
    asset: 'images/storylines/champion-of-the-naaru/magtheridons-lair.research.webp',
    reuse: null,
    traits: 'A vast black-iron prison chamber under Hellfire Citadel, heavy chains and a deep central pit; furnace red and ash frame restrained fel-green light. Small, anonymous silhouettes communicate A’dal’s instruction to gather an army, without claiming a specific roster.',
    sourceIds: ['champion-naaru-magtheridon-quest-10888'],
    review: 'New original AI illustration, refined to include a small anonymous force as part of the environment. No dungeon layout, exact party, co-presence beyond the quest, or canonical staging is asserted. Compare the area against the matching TBC build.',
  },
];
const environmentById = new Map(environment.map((item) => [item.id, item]));

const figures = [
  { id: 'khadgar', name: 'Khadgar', type: 'character', description: 'Human archmage and former apprentice to Medivh, shown in the existing interpretive Karazhan figure.', asset: 'images/storylines/karazhan/khadgar.research.webp', scale: 0.84, sourceIds: ['champion-naaru-blizzard-attunement-overview', 'champion-naaru-tempest-key-quest-10883'], reuse: 'Karazhan story figure; original interpretive portrait.' },
  { id: 'adal', name: 'A’dal', type: 'other', description: 'Naaru leader in Shattrath; abstract luminous form in the existing interpretive story illustration.', asset: 'images/storylines/akama-black-temple/adal.research.webp', scale: 0.95, sourceIds: ['champion-naaru-blizzard-attunement-overview', 'champion-naaru-tempest-key-quest-10883', 'champion-naaru-mercy-quest-10884', 'champion-naaru-strength-quest-10885', 'champion-naaru-tenacity-quest-10886', 'champion-naaru-magtheridon-quest-10888'], reuse: 'Akama story figure; existing original abstract naaru art.' },
  { id: 'kargath-bladefist', name: 'Kargath Bladefist', type: 'character', description: 'Orc leader of the Shattered Hand, illustrated with one curved blade integrated into a forearm. Armor and exact model details remain interpretive.', asset: `${artRoot}/kargath-bladefist.research.webp`, scale: 0.9, sourceIds: ['champion-naaru-mercy-quest-10884'], reuse: null, prompt: 'Single original full-body Kargath illustration with a curved blade integrated into one forearm; scarred rust-red and iron armor, green orc, no blood, isolated transparent cutout.' },
  { id: 'prisoners-of-the-shattered-halls', name: 'The prisoners in the Shattered Halls', type: 'other', description: 'An illustrative group of three captives. Their race, faction and identity are intentionally unspecified because the quest text does not name them.', asset: `${artRoot}/prisoners-of-the-shattered-halls.research.webp`, scale: 0.84, sourceIds: ['champion-naaru-mercy-quest-10884'], reuse: null, prompt: 'Top-right cell of the four-subject transparent character contact sheet: exactly three adult captives in unmarked travel clothing; no faction heraldry, weapons or identified race.' },
  { id: 'warlord-kalithresh', name: 'Warlord Kalithresh', type: 'character', description: 'Naga warlord in an original interpretive figure; exact armor and model details await client comparison.', asset: `${artRoot}/warlord-kalithresh.research.webp`, scale: 0.94, sourceIds: ['champion-naaru-strength-quest-10885'], reuse: null, prompt: 'Bottom-left cell of the four-subject transparent character contact sheet: armored blue-green naga commander with serpentine tail and trident.' },
  { id: 'murmur', name: 'Murmur', type: 'character', description: 'An original abstract interpretation of the extra-planar being named in A’dal’s quest. Its form is not treated as canonical model evidence.', asset: `${artRoot}/murmur.research.webp`, scale: 0.96, sourceIds: ['champion-naaru-strength-quest-10885'], reuse: null, prompt: 'Bottom-right cell of the four-subject transparent character contact sheet: deep-violet and blue-black sound vortex with a luminous core, no face or humanoid anatomy.' },
  { id: 'millhouse-manastorm', name: 'Millhouse Manastorm', type: 'character', description: 'The rescued gnome mage; robe and facial details are an original interpretation, not canonical model art.', asset: `${artRoot}/millhouse-manastorm.research.webp`, scale: 0.76, sourceIds: ['champion-naaru-tenacity-quest-10886'], reuse: null, prompt: 'Original full-body gnome mage cutout in violet and slate-blue travel robes; pale skin, light tousled hair, alert expression, empty hands.' },
  { id: 'magtheridon', name: 'Magtheridon', type: 'character', description: 'Pit lord targeted by the final trial; reused from the Akama story interpretation, whose earlier displacement remains outside this story.', asset: 'images/storylines/akama-black-temple/magtheridon.research.webp', scale: 0.96, sourceIds: ['champion-naaru-magtheridon-quest-10888'], reuse: 'Akama and the Black Temple story figure; original interpretive art, not canonical model evidence.' },
  { id: 'unused-executioners-axe', name: 'Unused Axe of the Executioner', type: 'artifact', description: 'Original interpretive rendering of the quest proof item. It is shown clean; its exact item model is not asserted.', asset: `${artRoot}/unused-executioners-axe.research.webp`, scale: 0.64, sourceIds: ['champion-naaru-mercy-quest-10884'], reuse: null, prompt: 'Top-left cell of the four-object transparent contact sheet: full dark iron executioner axe and worn haft, clean blade, no blood.' },
  { id: 'kalithresh-trident', name: 'Kalithresh’s Trident', type: 'artifact', description: 'Original interpretive object art for the trident named by A’dal; no exact item model or magical property is asserted.', asset: `${artRoot}/kalithresh-trident.research.webp`, scale: 0.62, sourceIds: ['champion-naaru-strength-quest-10885'], reuse: null, prompt: 'Top-right cell of the four-object transparent contact sheet: full naga trident with three barbed points, dark bronze and blue-green corrosion.' },
  { id: 'murmurs-essence', name: 'Murmur’s Essence', type: 'artifact', description: 'A small interpretive violet-blue crystalline sphere for the quest objective; its shape does not claim a canonical item model.', asset: `${artRoot}/murmurs-essence.research.webp`, scale: 0.58, sourceIds: ['champion-naaru-strength-quest-10885'], reuse: null, prompt: 'Bottom-left cell of the four-object transparent contact sheet: violet-blue sound essence as a luminous crystal sphere with concentric ripple rings.' },
  { id: 'tempest-key', name: 'The Tempest Key', type: 'artifact', description: 'Original interpretive key-shaped illustration. The quest awards a key; its exact shape is not treated as canonical item art.', asset: `${artRoot}/tempest-key.research.webp`, scale: 0.62, sourceIds: ['champion-naaru-blizzard-attunement-overview', 'champion-naaru-tempest-key-quest-10883', 'champion-naaru-magtheridon-quest-10888'], reuse: null, prompt: 'Bottom-right cell of the four-object transparent contact sheet: pale ivory-and-blue crystalline key with simple teeth, gold ring and star-like crystal head; interpretive, not a copied icon.' },
];
const figureById = new Map(figures.map((figure) => [figure.id, figure]));

const beats = [
  {
    id: 'khadgars-missive',
    title: 'A letter after the Cipher',
    environment: 'shattrath-lower-city',
    locationIds: ['shattrath-city'],
    entityIds: ['khadgar', 'adal'],
    sources: ['champion-naaru-blizzard-attunement-overview', 'champion-naaru-tempest-key-quest-10883'],
    questIds: ['The Cipher of Damnation', 'The Tempest Key'],
    narration: 'At Shadowmoon’s end, the Cipher’s final answer names the danger A’dal now sees in Kael’thas. A letter from Khadgar calls the seeker to Shattrath. This passage begins where Oronok’s story ends; it does not fold his long work into a second mission. The road now turns toward Tempest Keep, and the naaru who once had no need to reopen their vessel ask for help against a threat within it.',
  },
  {
    id: 'adal-names-the-danger',
    title: 'The danger named by A’dal',
    environment: 'shattrath-terrace-of-light',
    locationIds: ['shattrath-city'],
    entityIds: ['adal'],
    sources: ['champion-naaru-tempest-key-quest-10883'],
    questIds: ['The Tempest Key'],
    narration: 'Tempest Keep was made by the naaru, and A’dal says they had once judged a return unnecessary. Now Kael’thas must be stopped before he can use the Cipher of Damnation. A’dal asks adventurers to prove themselves in four trials before entering the vessel. The quests describe readiness for a dangerous undertaking; this story does not turn the achievement title into an office bestowed by the naaru.',
  },
  {
    id: 'trial-of-mercy',
    title: 'Mercy in the Shattered Halls',
    environment: 'shattered-halls',
    locationIds: ['shattered-halls'],
    entityIds: ['kargath-bladefist', 'prisoners-of-the-shattered-halls', 'unused-executioners-axe'],
    sources: ['champion-naaru-mercy-quest-10884'],
    questIds: ['Trial of the Naaru: Mercy'],
    narration: 'A’dal places the word Mercy beside a threatened life. In the Shattered Halls, Kargath holds three prisoners and intends to execute them. A’dal calls them the seeker’s people but does not name their allegiance. The task asks that they be saved; its named proof is an unused executioner’s axe with no blood on the blade. The quest records the trial passed when the axe is returned, but gives no named count of survivors. We leave that uncertainty where the record leaves it.',
  },
  {
    id: 'strength-in-the-steamvault',
    title: 'Strength, divided: the Steamvault',
    environment: 'steamvault',
    locationIds: ['steamvault'],
    entityIds: ['warlord-kalithresh', 'kalithresh-trident'],
    sources: ['champion-naaru-strength-quest-10885'],
    questIds: ['Trial of the Naaru: Strength'],
    narration: 'Strength is the trial A’dal explicitly divides. In the Steamvault, its first named feat is to defeat Warlord Kalithresh and bring back his trident. The flooded Coilfang works become one half of a single test. The trident is the proof the quest asks for; its description adds no new campaign against Coilfang and no further use for the weapon. The trial’s moral meaning beyond its name is not supplied, so the telling does not invent one.',
  },
  {
    id: 'strength-in-shadow-labyrinth',
    title: 'Strength, divided: Murmur',
    environment: 'shadow-labyrinth',
    locationIds: ['shadow-labyrinth'],
    entityIds: ['murmur', 'murmurs-essence'],
    sources: ['champion-naaru-strength-quest-10885'],
    questIds: ['Trial of the Naaru: Strength'],
    narration: 'A’dal’s second named task lies in Auchindoun’s Shadow Labyrinth. Murmur is described as an extra-planar being; the adventurer is sent to defeat it and return its essence. This scene follows the Steamvault because the quest text names those two halves in that order, not because the source establishes a fixed historical sequence between separate runs. The essence serves as proof of the assigned trial; the quest gives it no further use.',
  },
  {
    id: 'trial-of-tenacity',
    title: 'Tenacity in the Arcatraz',
    environment: 'arcatraz',
    locationIds: ['arcatraz'],
    entityIds: ['millhouse-manastorm'],
    sources: ['champion-naaru-tenacity-quest-10886'],
    questIds: ['Trial of the Naaru: Tenacity'],
    narration: 'At the Arcatraz, A’dal’s account turns the trial toward persistence. The naaru have imprisoned dangerous beings aboard Tempest Keep, but A’dal distinguishes Millhouse: a gnome stowaway caught on the wrong vessel at the wrong moment. The adventurer must rescue him and ensure he survives. That account of how Millhouse came to be imprisoned belongs to A’dal’s quest text; the story does not turn it into an independent capture report.',
  },
  {
    id: 'trial-of-magtheridon',
    title: 'Only Magtheridon remains',
    environment: 'magtheridons-lair',
    locationIds: ['hellfire-citadel'],
    entityIds: ['magtheridon'],
    sources: ['champion-naaru-blizzard-attunement-overview', 'champion-naaru-magtheridon-quest-10888'],
    questIds: ['Trial of the Naaru: Magtheridon'],
    narration: 'Only Magtheridon remains. A’dal calls for an army and sends it deep beneath Hellfire Citadel, to the pit lord’s lair. The final task is to fight through the chamber and destroy the corrupter. The quest marks a change of scale from dungeon trials to a raid and says the naaru approve when the foe is defeated. It does not claim that Kael’thas has already been reached or that the battle inside Tempest Keep has been won.',
  },
  {
    id: 'the-tempest-key',
    title: 'The way into Tempest Keep',
    environment: 'shattrath-terrace-of-light',
    locationIds: ['shattrath-city'],
    entityIds: ['adal', 'tempest-key'],
    sources: ['champion-naaru-blizzard-attunement-overview', 'champion-naaru-magtheridon-quest-10888'],
    questIds: ['Trial of the Naaru: Magtheridon'],
    narration: 'With the final trial returned to A’dal, the Tempest Key is granted. Blizzard’s attunement overview identifies it as the means of entry to the Eye, the central wing of Tempest Keep in Netherstorm. The key is an access threshold, not the battle with Kael’thas. This telling ends at the gate the trials were meant to open; the fight within belongs to another story.',
  },
  {
    id: 'the-title-and-the-separate-gate',
    title: 'A title beyond one key',
    environment: 'shattrath-terrace-of-light',
    locationIds: ['shattrath-city'],
    entityIds: ['adal', 'tempest-key'],
    sources: ['champion-naaru-blizzard-attunement-overview', 'champion-naaru-tbc-classic-attunement-hotfix'],
    questIds: ['The Cudgel of Kar’desh', 'Trial of the Naaru: Magtheridon'],
    narration: 'Champion of the Naaru is a title with a version history, not a rank granted by this chain alone. Blizzard’s attunement guide ties it to access to both the Eye and Serpentshrine Cavern; the Cudgel of Kar’desh belongs to that separate path. A later Classic ruleset removed raid-entry attunements, so its door rules cannot be read back into the original quest. The story closes with the Tempest Key, before the second gate and before either raid’s final reckoning.',
  },
];

const nodeIds = beats.map((beat) => `${storyId}-story-${beat.id}`);
const sceneEntityIds = distinct(beats.flatMap((beat) => beat.entityIds));
const positionByEntity = new Map([
  ['khadgar', [4700, 4750]], ['adal', [5300, 4750]],
  ['kargath-bladefist', [4300, 4830]], ['prisoners-of-the-shattered-halls', [5000, 4830]], ['unused-executioners-axe', [5700, 4830]],
  ['warlord-kalithresh', [4550, 4830]], ['kalithresh-trident', [5450, 4830]],
  ['murmur', [4550, 4830]], ['murmurs-essence', [5450, 4830]],
  ['millhouse-manastorm', [5000, 4830]], ['magtheridon', [5000, 4830]], ['tempest-key', [5450, 4830]],
]);
const priorities = new Map(figures.map((figure, index) => [figure.id, 250 - index]));

const location = {
  id: 'hellfire-citadel',
  type: 'location',
  name: 'Hellfire Citadel',
  slug: 'hellfire-citadel',
  shortDescription: 'Hellfire Citadel, where A’dal places Magtheridon’s final trial.',
  body: 'A named Burning Crusade location in the final Trial of the Naaru. Its Magtheridon lair illustration is an original interpretation, not a surveyed dungeon plan or exact chamber layout.',
  firstEraId: eraId,
  featuredEraIds: [eraId],
  sourceIds: ['champion-naaru-magtheridon-quest-10888'],
  tags: ['champion-naaru-story', 'burning-crusade-location'],
  contentStatus: 'research',
};

const locationsByBeat = beats.map((beat) => beat.locationIds);
const featureList = sceneEntityIds.map((entityId) => ({
  type: 'Feature',
  id: `${storyId}-${entityId}-focus`,
  properties: {
    name: `${figureById.get(entityId).name} editorial story focus`,
    contentStatus: 'research',
    styleRole: 'site',
    geographicCertainty: 'unknown',
  },
  geometry: { type: 'Point', coordinates: positionByEntity.get(entityId) },
}));

await write('data/sources/champion-naaru-blizzard-attunement-overview.research.json', sources[0]);
for (const source of sources.slice(1)) await write(`data/sources/${source.id}.research.json`, source);
await write(`data/entities/${location.id}.research.json`, location);

for (const figure of figures) {
  if (['adal', 'khadgar', 'magtheridon'].includes(figure.id)) {
    const file = `data/entities/${figure.id}.research.json`;
    const entity = await readJson(file);
    entity.sourceIds = distinct([...entity.sourceIds, ...figure.sourceIds]);
    entity.featuredEraIds = distinct([...(entity.featuredEraIds ?? []), eraId]);
    entity.tags = distinct([...(entity.tags ?? []), 'champion-naaru-story']);
    if (figure.id === 'adal') {
      const visual = entity.mapFigure ?? entity.mapVisual;
      entity.mapFigure = { asset: visual.asset, scale: visual.scale ?? figure.scale };
      delete entity.mapVisual;
      entity.body = 'A’dal as a naaru in Shattrath. The story-stage portrait is an original abstract interpretation, not canonical model evidence. It is contextually staged and visible only during the relevant story beats.';
    }
    if (figure.id === 'magtheridon') {
      const storyNote = 'The Champion of the Naaru story reuses this interpretive figure only for A’dal’s later quest target; it does not retell Magtheridon’s earlier defeat by Illidan.';
      const baseBody = (entity.body ?? '').replace(` ${storyNote}`, '').trim();
      entity.body = `${baseBody} ${storyNote}`.trim();
    }
    await write(file, entity);
    continue;
  }
  await write(`data/entities/${figure.id}.research.json`, {
    id: figure.id,
    type: figure.type,
    name: figure.name,
    slug: figure.id,
    shortDescription: figure.description,
    body: `${figure.description} This is original AI-generated art for the research story theater, not canonical game art, exact model evidence or proof of co-presence. See the production and visual asset ledgers.`,
    firstEraId: eraId,
    featuredEraIds: [eraId],
    sourceIds: figure.sourceIds,
    tags: ['champion-naaru-story', 'interpretive-art'],
    mapFigure: { asset: figure.asset, scale: figure.scale },
    contentStatus: 'research',
  });
}

await write(`data/worldspaces/${worldspaceId}.research.json`, {
  id: worldspaceId,
  name: 'Champion of the Naaru — relational story theater',
  slug: worldspaceId,
  coordinateSystem: { width: 10000, height: 10000, origin: 'bottom-left', units: 'atlas-units' },
});
await write(`data/geometry/${worldspaceId}-theater.research.geojson`, {
  type: 'FeatureCollection',
  features: featureList,
});

for (const figure of figures.filter((item) => sceneEntityIds.includes(item.id))) {
  const focusId = `${storyId}-${figure.id}-focus`;
  await write(`data/spatial-states/${storyId}-${figure.id}-theater.research.json`, {
    id: `${storyId}-${figure.id}-theater`,
    entityId: figure.id,
    eraId,
    worldspaceId,
    geometryId: focusId,
    placementKind: 'relational',
    geographicCertainty: 'unknown',
    sourceIds: figure.sourceIds,
    editorNote: `Editorial ${figure.name} placement in the ${storyId} illustrated theater. This focus is a stage anchor, not a geographic position, journey route, exact encounter layout or roster claim. Visual comparison for the original TBC 2.0.3–2.4.3 build remains open.`,
    visualPresence: 'contextual',
    labelPriority: priorities.get(figure.id) ?? 200,
  });
}

for (const env of environment) {
  for (const beat of beats.filter((item) => item.environment === env.id)) {
    const mapStateId = `${storyId}-${beat.id}-scene`;
    await write(`data/map-states/${mapStateId}.research.json`, {
      id: mapStateId,
      name: `${storyId} story: ${env.title}`,
      worldspaceId,
      presentation: 'relational',
      terrainTextureAsset: env.asset,
      geometryIds: [],
      cartographyLabel: 'ILLUSTRATED QUESTLINE THEATER',
      interpretationNote: `${env.review} Recognizable original TBC area traits: ${env.traits} The illustration is a scene backdrop, not source evidence, a surveyed location, dungeon plan, exact formation or proof that every staged figure was present simultaneously. See docs/research/champion-of-the-naaru-visual-assets.json.`,
    });
  }
}

const nodes = beats.map((beat, index) => {
  const id = nodeIds[index];
  const camera = beat.entityIds.length >= 3
    ? { position: [0, 6.1, 5.3], target: [0, 0, 0], durationMs: 1000 }
    : { position: [0, 6.1, 5.8], target: [0, 0, 0], durationMs: 1000 };
  const words = beat.narration.trim().split(/\s+/).length;
  const node = {
    id,
    guideId,
    title: beat.title,
    narration: beat.narration,
    durationMs: Math.min(90000, Math.max(18000, Math.round(((words / 82) * 60000) / 500) * 500 + 5000)),
    eventIds: [`${id}-event`],
    entityIds: beat.entityIds,
    locationIds: beat.locationIds,
    camera,
    visualActions: [
      { type: 'set_map_state', mapStateId: `${storyId}-${beat.id}-scene` },
      ...beat.entityIds.map((entityId) => ({ type: 'highlight_entity', entityId })),
    ],
    ...(index ? { previousNodeId: nodeIds[index - 1] } : {}),
    ...(index < nodeIds.length - 1 ? { nextNodeIds: [nodeIds[index + 1]] } : {}),
  };
  if (priorVoiceovers.has(id)) node.voiceover = priorVoiceovers.get(id);
  return node;
});

for (let index = 0; index < beats.length; index += 1) {
  const beat = beats[index];
  const nodeId = nodeIds[index];
  const eventId = `${nodeId}-event`;
  const claimId = `${nodeId}-claim`;
  const citationIds = beat.sources.map((sourceId, sourceIndex) => `${nodeId}-citation-${sourceIndex + 1}`);
  for (let sourceIndex = 0; sourceIndex < beat.sources.length; sourceIndex += 1) {
    const sourceId = beat.sources[sourceIndex];
    await write(`data/citations/${citationIds[sourceIndex]}.research.json`, {
      id: citationIds[sourceIndex],
      sourceId,
      questId: beat.questIds.join('; '),
      section: sourceId === 'champion-naaru-blizzard-attunement-overview'
        ? 'TBC Classic attunement overview; only the listed quest sequence, destinations, raid access or title condition relevant to this paraphrase.'
        : sourceId === 'champion-naaru-tbc-classic-attunement-hotfix'
          ? 'February 15, 2022 hotfix entry; later Classic access state only.'
          : 'Secondary transcription of original Burning Crusade quest description, objective and completion text; exact build comparison remains open.',
      note: sourceById.get(sourceId).notes,
    });
  }
  await write(`data/claims/${claimId}.research.json`, {
    id: claimId,
    subjectId: eventId,
    predicate: 'questline_scene_account',
    value: beat.narration,
    citationIds,
    confidence: 'strongly_supported',
    status: 'active',
    editorNote: 'Original paraphrase for research status. Quest dialogue is transcribed from a secondary mirror of primary in-game text. No source dialogue is copied into public narration; compare to the original TBC client before review.',
  });
  const env = environmentById.get(beat.environment);
  const sourceIds = distinct([...beat.sources, ...env.sourceIds]);
  await write(`data/events/${eventId}.research.json`, {
    id: eventId,
    kind: 'event',
    name: beat.title,
    slug: eventId,
    eraId,
    worldspaceId,
    date: { precision: 'relative', label: 'Original Burning Crusade attunement quest era; exact date unknown' },
    summary: beat.narration,
    locationIds: locationsByBeat[index],
    participantEntityIds: beat.entityIds,
    sourceIds,
    claimIds: [claimId],
    contentStatus: 'research',
  });
}

await write(storyPath, {
  guide: {
    id: guideId,
    eraId,
    title: 'Champion of the Naaru: Trials across Outland',
    description: 'Nine illustrated scenes follow A’dal’s four trials, the divided test of Strength, Magtheridon’s defeat, and the distinct access condition behind the title.',
    nodeIds,
    contentStatus: 'research',
  },
  nodes,
});

const allSourceIds = sources.map((source) => source.id);
const storyline = {
  id: storyId,
  slug: storyId,
  title: 'Champion of the Naaru: Trials across Outland',
  summary: 'After the Cipher of Damnation, A’dal sets four trials before the way to Tempest Keep can open. The story separates dungeon tests, Magtheridon’s raid, and the patch-sensitive title condition.',
  opening: 'A letter from Khadgar carries the Shadowmoon finding to Shattrath. A’dal names the danger, then measures the road to Tempest Keep through four trials whose purpose is readiness for the fight ahead.',
  primaryEraId: eraId,
  eraIds: [eraId],
  chapters: [
    { id: 'the-warning-at-shattrath', eraId, title: 'The warning at Shattrath', body: 'Khadgar’s letter after the Cipher and A’dal’s stated reason to reopen Tempest Keep. Scenes 1–2.' },
    { id: 'four-trials-across-outland', eraId, title: 'Four trials across Outland', body: 'Mercy, the two halves of Strength, Tenacity, and Magtheridon. The first three are parallel requirements; this presentation order is editorial. Scenes 3–7.' },
    { id: 'key-and-title-boundary', eraId, title: 'The key and its boundary', body: 'The Tempest Key opens the Eye in the original attunement story; Serpentshrine Cavern and the Champion title condition remain separate and patch-sensitive. Scenes 8–9.' },
  ],
  sourceIds: allSourceIds,
  storyGuideId: guideId,
  showInEraTourOffshoots: false,
  reviewNote: 'Complete nine-scene illustrated research story with original paraphrase, transcript-matched AI narration, source/claim/citation records per node, TBC-matched reused dungeon art, new named-figure/object art, and a dedicated Magtheridon environment. The story begins after Oronok’s Cipher of Damnation and does not retell his chain. Mercy, Strength and Tenacity are parallel requirements; Strength is one trial with two named targets. The title condition is kept separate from The Tempest Key and is patch-sensitive. Original-client quest/build capture, area/model resemblance review, human lore approval, exact title eligibility by original patch and narration audition remain open. No record is reviewed or published.',
  contentStatus: 'research',
};
await write(`data/storylines/${storyId}.research.json`, storyline);

const tourPath = 'data/story-tours/classic-to-wrath.research.json';
const tour = await readJson(tourPath);
tour.chronologyNote = tour.chronologyNote.replace(
  'then The Missing Diplomat’s patch 2.3 continuation',
  'then Champion of the Naaru’s Outland trials after the Cipher prerequisite, then The Missing Diplomat’s patch 2.3 continuation',
);
const existingIndex = tour.entries.findIndex((entry) => entry.storylineId === storyId);
const [storyEntry] = existingIndex >= 0 ? tour.entries.splice(existingIndex, 1) : [];
const index = tour.entries.findIndex((entry) => entry.storylineId === 'missing-diplomat-original-investigation');
if (index < 0) throw new Error('Could not find the tour placement anchor for Missing Diplomat.');
tour.entries.splice(index, 0, storyEntry ?? {
  storylineId: storyId,
  regionIds: ['outland'],
  mapPositionPercent: [93, 87],
  order: index + 1,
  periodLabel: 'The Burning Crusade · A’dal’s trials and Tempest Key',
  locationLabel: 'Shattrath · heroic trials across Outland',
});
tour.entries.forEach((entry, index) => { entry.order = index + 1; });
if (!tour.chronologyNote.includes('The Champion of the Naaru stop follows the Cipher')) {
  tour.chronologyNote += ' The Champion of the Naaru stop follows the Cipher because Blizzard’s attunement guide places Khadgar’s letter and A’dal’s trials after that chain. Mercy, Strength and Tenacity are parallel requirements rather than a claimed historical sequence; the Strength scenes follow the quest description order for readability. The Champion title is distinguished from The Tempest Key and from the separate Serpentshrine Cavern path, with exact eligibility left patch-sensitive.';
}
tour.reviewNote = 'Research StoryTour collection with 17 map placards, 16 playable research StoryGuides and one research preview. Play All follows the explicit editorial order and skips the preview. Story-tour map markers are navigational layout positions rather than exact locations; each storyline remains research until its human review gates are complete.';
await write(tourPath, tour);

const candidatesPath = 'docs/research/questline-story-candidates.md';
let candidates = await readFile(path.join(root, candidatesPath), 'utf8');
const sectionPattern = /### 14\. Champion of the Naaru: trials across Outland[\s\S]*?(?=\n### 15\.)/;
const section = candidates.match(sectionPattern)?.[0];
if (!section) throw new Error('Could not locate candidate 14 in the questline guide.');
const cleanSection = section.replace(/\n\*\*Implementation:\*\*[\s\S]*$/, '');
const implementation = '\n\n**Implementation:** Complete nine-scene illustrated research StoryGuide with per-node source/claim/citation records, transcript-matched AI narration, original cast and pivotal-object art, reused matched TBC dungeon backdrops, and an original Magtheridon lair scene. Added to the Classic-to-Wrath StoryTour after the Cipher of Damnation because its completion is a prerequisite; the three dungeon trials remain parallel. The title and Tempest Key are distinguished from the separate Serpentshrine path. Original-client dialogue/build comparison, title eligibility audit by patch, human lore review, area/model resemblance review and narration audition remain open. See the [research packet](champion-of-the-naaru-outland-trials-research.md), [production ledger](champion-of-the-naaru-outland-trials-production.md), and [visual asset ledger](champion-of-the-naaru-visual-assets.json).';
candidates = candidates.replace(sectionPattern, `${cleanSection.trimEnd()}${implementation}\n`);
await writeFile(path.join(root, candidatesPath), candidates);

const productionRows = beats.map((beat, index) => {
  const names = beat.entityIds.map((id) => figureById.get(id)?.name ?? id).join('; ');
  const env = environmentById.get(beat.environment);
  return `| ${index + 1} | ${beat.title} | ${beat.questIds.join('; ')} | ${env.title} | ${names || 'environment scene'} | ${beat.sources.join('; ')} |`;
}).join('\n');
const production = `# Champion of the Naaru: Trials across Outland — production ledger\n\nStatus: research. All text, sources, art and voice remain unreviewed. Target: original Burning Crusade quest state, 2.0.3–2.4.3; current evidence is bounded to the material listed below.\n\n## Source handling\n\nThe quest descriptions/objectives/completion text for 10883, 10884, 10885, 10886 and 10888 was reviewed in full through the cited Wowhead transcriptions of primary in-game quest text. These are secondary reproductions, not screenshots or direct captures from the original 2007 client. Blizzard’s attunement overview supplies the post-Cipher sequence, the four destinations, Tempest Key access and the separate Serpentshrine/title boundary. The February 2022 hotfix is used only to distinguish a later TBC Classic entrance state. Narration is an original paraphrase; no game dialogue is quoted.\n\n## Story beats\n\n| # | Node | Quest anchor | Environment | Cast / object figures | Claim sources |\n|---:|---|---|---|---|---|\n${productionRows}\n\nMercy, Strength and Tenacity are parallel trial requirements. The player-facing sequence follows Blizzard’s overview for the three tasks, with Strength’s two scene locations following the quest description order. Neither order is stated as a required historical timeline. The story begins after the separately completed Cipher chain, uses Magtheridon only as A’dal’s raid target, and ends at The Tempest Key before Kael’thas or the Cudgel of Kar’desh chain.\n\n## Audio\n\nVoice tracks use the project’s Kokoro TTS generator and manifest after transcript stabilization. Track hashes, transcript hashes, durations and provenance are in [the guided voice manifest](../../public/audio/guided/manifest.json) and provenance file. Human pronunciation and listening review remain open.\n\n## Merge and chronology\n\nThe new StoryTour dot is placed after cipher-of-damnation-oronok and before The Missing Diplomat, because Blizzard’s guide makes completion of the Cipher the start of the Khadgar/A’dal access chain. This is a supported quest dependency; the tour’s broader placement is still editorial and makes no precise date claim. The story is not added to EraTour.\n\n## Review gates\n\n- Capture the complete original-client quest dialogue, title conditions, and behavior from the chosen 2.4.3 build; compare with the secondary transcriptions.\n- Audit the Champion of the Naaru title prerequisite and 2.0.3–2.4.3 eligibility by original patch, including the separate Cudgel/Serpentshrine path.\n- Compare every reused and new setting, actor and key item against the corresponding original TBC client/model. Generated art is interpretive, not game evidence.\n- Listen to every narration track, check pronunciation and scene durations, and obtain human lore/source review before promoting any record.\n`;
await writeFile(path.join(root, 'docs/research/champion-of-the-naaru-outland-trials-production.md'), production);

const environmentRecords = await Promise.all(environment.map(async (env) => ({
  id: env.id,
  title: env.title,
  assetPath: env.asset,
  sha256: sha256(await readFile(path.join(root, 'public', env.asset))),
  provenance: env.reuse ? 'reused original project illustration' : 'original AI-generated illustration; one focused edit added an anonymous force for quest scale',
  reuseSource: env.reuse,
  recognizableTraits: env.traits,
  sourceIds: env.sourceIds,
  targetEditionBuild: 'Original World of Warcraft: The Burning Crusade, patches 2.0.3–2.4.3',
  resemblanceReview: env.review,
})));
const figureRecords = await Promise.all(figures.map(async (figure) => ({
  id: figure.id,
  name: figure.name,
  kind: figure.type,
  assetPath: figure.asset,
  sha256: sha256(await readFile(path.join(root, 'public', figure.asset))),
  provenance: figure.reuse ? `reused ${figure.reuse}` : 'original AI-generated interpretive cutout; contact-sheet crops optimized as transparent WebP',
  reuseSource: figure.reuse,
  generationNote: figure.prompt,
  sourceIds: figure.sourceIds,
  reviewStatus: 'Open: original TBC client/model comparison and human visual approval.',
})));
const visualLedger = {
  schemaVersion: 1,
  storyId,
  targetEditionBuild: 'Original World of Warcraft: The Burning Crusade, patches 2.0.3–2.4.3; exact patch comparison remains open.',
  note: 'Story theater placement is relational and illustrative, not exact geographic evidence. All AI-generated art is unofficial interpretive fan art, not canonical model/area proof. Contact-sheet crops are transparent WebP cutouts optimized for the static site. Every node maps to one illustrated environment and active entities; the Magtheridon environment itself carries the anonymous-force ensemble.',
  generationArtifacts: [
    { id: 'exec-44a76401-3f4e-444b-bb99-a4e2f4f44d2f', role: 'four-subject transparent character contact sheet' },
    { id: 'exec-17238a1f-5187-4681-99bf-bbd8d4fbdd1b', role: 'four-object transparent contact sheet' },
    { id: 'exec-c7303735-6f20-4f79-a5c1-72cc5226bb3e', role: 'single-subject Kargath figure' },
    { id: 'exec-ea838831-d7c9-4d5f-8e46-9dadd1ef8aba', role: 'single-subject Millhouse figure' },
    { id: 'exec-1ca4b443-abc6-4a32-b22d-d6e5c3d4157b', role: 'original empty Magtheridon lair environment before edit' },
    { id: 'exec-6b508329-aeae-4501-a5ad-d6783b858c2c', role: 'Magtheridon lair environment edited to include a small anonymous adventurer company' },
  ],
  environments: environmentRecords,
  figures: figureRecords,
  scenes: beats.map((beat, index) => ({
    order: index + 1,
    nodeId: nodeIds[index],
    environmentId: beat.environment,
    environmentAsset: environmentById.get(beat.environment).asset,
    entityIds: beat.entityIds,
    sourceIds: beat.sources,
    placement: 'Relational theater focus only; no exact coordinate, route, dungeon floor plan or unverified co-presence claim.',
  })),
  remainingHumanReview: ['Original-client area resemblance', 'Original-client character/item model resemblance', 'TBC patch/build and title-eligibility audit', 'Human source/lore approval'],
};
await write('docs/research/champion-of-the-naaru-visual-assets.json', visualLedger);

const researchPath = path.join(root, 'docs/research/champion-of-the-naaru-outland-trials-research.md');
let research = await readFile(researchPath, 'utf8');
research = research.replace('Nine nodes, with one node per required trial and a paired two-scene treatment for Strength. Target spoken runtime is approximately 5–7 minutes after transcript stabilization; no farming, group composition, dungeon timer, reputation, loot, or key-purchasing steps are padded into the narrative.', `Nine nodes, with one node per required trial and a paired two-scene treatment for Strength. The first three trials are parallel requirements; their display order is editorial. Target spoken runtime is approximately 5–7 minutes after transcript stabilization. No farming, group composition, dungeon timer, reputation, loot or key-purchasing steps are padded into the narrative. Final authored nodes: ${beats.map((beat, index) => `${index + 1}. ${beat.title}`).join('; ')}.`);
await writeFile(researchPath, research);

process.stdout.write(`Authored ${beats.length} nodes, ${sources.length} sources, ${figures.length} staged entities, ${environment.length} environment records.\n`);
