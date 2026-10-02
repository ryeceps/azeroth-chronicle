import { createHash } from 'node:crypto';
import { access, mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const storyId = 'tirion-taelan-of-love-and-family';
const guideId = `${storyId}-guide`;
const eraId = 'age-of-adventurers';
const worldspaceId = 'tirion-taelan-story-theater';
const artDirectory = 'public/images/storylines/tirion-taelan';
const imageDirectory = 'images/storylines/tirion-taelan';

async function write(file, value) {
  const fullPath = path.join(root, file);
  await mkdir(path.dirname(fullPath), { recursive: true });
  await writeFile(fullPath, typeof value === 'string' ? value : `${JSON.stringify(value, null, 2)}\n`);
}

const sources = [
  {
    id: 'tirion-taelan-classic-chain-guide',
    title: 'In Dreams — WoW Classic Tirion Fordring Questline Guide',
    url: 'https://www.wowhead.com/classic/guide/tirion-fordring-questline-in-dreams-classic-wow',
    sourceType: 'website',
    notes: 'Accessed 2026-10-01. Secondary quest-chain locator reports the Classic order and identifies the active recreation as patch 1.15.8. It is not original 1.12-era client capture or independent proof of exact historical dating.',
  },
  {
    id: 'tirion-taelan-redemption-locator',
    title: 'Redemption quest text locator (Classic quest 5742)',
    url: 'https://www.wowhead.com/classic/quest=5742/redemption',
    sourceType: 'quest',
    notes: 'Accessed 2026-10-01. Secondary reproduction includes the quest page and user-submitted historic text. It locates Tirion’s disclosure about exile and Taelan; compare quest text and any faction-specific wording to the original Classic client before human lore approval.',
  },
  {
    id: 'tirion-taelan-forgotten-memories-locator',
    title: 'Of Forgotten Memories quest text locator (Classic quest 5781)',
    url: 'https://www.wowhead.com/classic/quest=5781/of-forgotten-memories',
    sourceType: 'quest',
    notes: 'Accessed 2026-10-01. Secondary reproduction locates Tirion’s account of Taelan’s childhood miniature hammer and the Undercroft recovery objective. Collection and combat mechanics are not treated as unique historical events.',
  },
  {
    id: 'tirion-taelan-lost-honor-locator',
    title: 'Of Lost Honor quest text locator (Classic quest 5845)',
    url: 'https://www.wowhead.com/classic/quest=5845/of-lost-honor',
    sourceType: 'quest',
    notes: 'Accessed 2026-10-01. Secondary reproduction locates the Northdale memory and recovery of the Silver Hand symbol. It does not establish an exact battle formation or date.',
  },
  {
    id: 'tirion-taelan-portrait-introduction-locator',
    title: 'Of Love and Family quest text locator (Classic quest 5846)',
    url: 'https://www.wowhead.com/classic/quest=5846/of-love-and-family',
    sourceType: 'quest',
    notes: 'Accessed 2026-10-01. This is the first of two distinct Classic quests named Of Love and Family. It locates Tirion’s request to find Artist Renfray at Caer Darrow. Do not merge it with quest 5848 or the later Eligor quest.',
  },
  {
    id: 'tirion-taelan-portrait-recovery-locator',
    title: 'Of Love and Family quest text locator (Classic quest 5848)',
    url: 'https://www.wowhead.com/classic/quest=5848/of-love-and-family',
    sourceType: 'quest',
    notes: 'Accessed 2026-10-01. This separate follow-up is given by Renfray and locates recovery of the family painting in Stratholme’s Archivist room, behind a twin-moons painting. Exact instance layout and object appearance still require original-client comparison.',
  },
  {
    id: 'tirion-taelan-find-myranda-locator',
    title: 'Find Myranda quest text locator (Classic quest 5861)',
    url: 'https://www.wowhead.com/classic/quest=5861/find-myranda',
    sourceType: 'quest',
    notes: 'Accessed 2026-10-01. Secondary reproduction locates Myranda at Uther’s Tomb and Tirion’s request for her help. Myranda’s prior relationship to Tirion is described only to the extent recorded in this quest chain.',
  },
  {
    id: 'tirion-taelan-scarlet-subterfuge-locator',
    title: 'Scarlet Subterfuge quest text locator (Classic quest 5862)',
    url: 'https://www.wowhead.com/classic/quest=5862/scarlet-subterfuge',
    sourceType: 'quest',
    notes: 'Accessed 2026-10-01. Secondary reproduction locates the disguise and delivery of Tirion’s gift to Taelan in Hearthglen. The player character is not assigned a faction, name or canonical identity.',
  },
  {
    id: 'tirion-taelan-in-dreams-locator',
    title: 'In Dreams quest text locator (Classic quest 5944)',
    url: 'https://www.wowhead.com/classic/quest=5944/in-dreams',
    sourceType: 'quest',
    notes: 'Accessed 2026-10-01. Secondary reproduction locates Taelan’s departure, his death at the roadside tower, Tirion’s defeat of Isillien and the vow concerning the Silver Hand. The original Classic quest event, ending and later client variants need human capture and review.',
  },
];
for (const source of sources) await write(`data/sources/${source.id}.research.json`, source);

const environments = [
  {
    id: 'thondroril-river', name: 'Thondroril River and the Eastern Plaguelands', width: 1536, height: 860,
    sourceArtifact: 'exec-baa94e01-cdc7-44f5-a358-bffe40bad126.png',
    referenceUrl: 'https://warcraft.wiki.gg/wiki/Eastern_Plaguelands',
    traits: 'Classic Eastern Plaguelands: a broad cold river through diseased grassland, gray-green light, sparse dead trees and distant ruined human stonework. Keep it distinct from the thick forest of Caer Darrow and the warmer sunset memory scene.',
    prompt: 'Original painterly Classic-era fantasy environment for the Thondroril River, an exposed cold riverbank running through the plague-sick Eastern Plaguelands. Broad landscape view, gray-green and muted brown grasses, sparse leafless trees, low mist, an old timber refuge near the water, distant ruined stonework. No characters, no text or interface, no copied game screenshot; preserve the recognizable pre-Cataclysm Eastern Plaguelands palette and terrain.',
  },
  {
    id: 'undercroft-grave', name: 'The Undercroft', width: 1536, height: 1024,
    sourceArtifact: 'exec-1b901268-f4ce-4d83-b94d-3eb652833901.png',
    referenceUrl: 'https://warcraft.wiki.gg/wiki/Undercroft',
    traits: 'Classic Western Plaguelands graveyard: low earth mounds and worn stones among pallid grass, sickly green-gray mist and dead timber. The image is a broad cemetery impression, not the exact marked grave or a verified encounter layout.',
    prompt: 'Original painterly environmental art for a broad Classic Western Plaguelands graveyard near the Undercroft: low earth mounds, worn gray grave markers, pallid grass, diseased green-grey haze and bare trees. Make it unmistakably a quiet Plaguelands burial ground, not a gothic cathedral crypt. No characters, lettering, UI, or copied screenshot. Do not imply a surveyed position or exact quest-layout.',
  },
  {
    id: 'northdale-lake', name: 'The waters near Northdale', width: 1536, height: 1024,
    sourceArtifact: 'exec-62b843f4-851f-4898-bb64-4d85e1aa39d6.png',
    referenceUrl: 'https://warcraft.wiki.gg/wiki/Northdale',
    traits: 'Classic Eastern Plaguelands lake and ruined settlement: slate water, dead trees, ruined pale human masonry and low plague fog. A fallen emblem is visible beneath the water as interpretive symbolism, not a game-model reconstruction.',
    prompt: 'Original Classic-era Eastern Plaguelands landscape at the lake near the ruins of Northdale: slate still water, diseased yellow-green reeds, bare trees, broken pale human stonework and low plague fog. A small silver hand emblem is faintly visible under the water as an interpretive story clue. No characters or text, no exact coordinate or in-game screenshot.',
  },
  {
    id: 'caer-darrow', name: 'Caer Darrow', width: 1536, height: 1024,
    sourceArtifact: 'exec-bd2f9b13-ca0a-4c51-acd0-55fbede3ae52.png',
    referenceUrl: 'https://warcraft.wiki.gg/wiki/Caer_Darrow',
    traits: 'Classic Western Plaguelands island settlement: a ruin-worn stone village on a lake, a narrow bridge and the distant Scholomance silhouette. Use old pale masonry and sickly lake haze, not a healthy living city or dense modern town.',
    prompt: 'Original painterly Classic Western Plaguelands landscape of Caer Darrow, a lonely ruined island village in a cold plague lake. Pale worn stone homes, narrow bridge, sparse dead trees, green-gray lake mist and Scholomance on a distant ridge. No characters or text, no exact map reconstruction, no copied game image. Make the island, ruin and distant school clearly distinct from Stratholme.',
  },
  {
    id: 'fordring-family-memory', name: 'The family recalled in a portrait', width: 1536, height: 1024,
    sourceArtifact: 'exec-63b2c18f-c0e9-4961-93f8-466c11d0cafd.png',
    referenceUrl: 'https://www.wowhead.com/classic/quest=5846/of-love-and-family',
    traits: 'An interpretive painted family memory of Tirion, Karandra and their young son beside a lake. The outdoor view is an artistic reading of reported family excursions, not a verified beach, exact location or canonical appearance.',
    prompt: 'Original warm oil-painted memory of a father, mother and young son together beside a quiet lake near sunset. The father is a human knight at rest, not wearing a battle uniform; the mother and child are close beside him. This interpretive family tableau evokes the portrait described in the Classic quest, not a canonical image, exact shore, costume or game scene. No text, border, UI or copied art.',
  },
  {
    id: 'hearthglen', name: 'Hearthglen from the road', width: 1536, height: 1024,
    sourceArtifact: 'exec-46574977-85b5-4998-ac59-7a690795a7ae.png',
    referenceUrl: 'https://warcraft.wiki.gg/wiki/Hearthglen',
    traits: 'Classic pre-Cataclysm Hearthglen: a fortified human settlement with pale gray stone, timber and red-white Scarlet Crusade banners against plague-damaged land. Keep the human keep silhouette and orderly defenses readable; it must not resemble Stormwind Keep or a red-brown fortress.',
    prompt: 'Original Classic Western Plaguelands landscape of Hearthglen, a fortified human settlement: pale gray stone keep and clustered houses, red-white Scarlet Crusade banners, restrained timber defenses, diseased countryside and cold green-gray light. Recognizable as a northern human stronghold but original in composition. No text, UI or copied screenshot.',
  },
  {
    id: 'taelans-tower', name: 'The roadside tower near Hearthglen', width: 1536, height: 1024,
    sourceArtifact: 'exec-665ef37f-8be5-4219-8e45-21a9bc8438b2.png',
    referenceUrl: 'https://warcraft.wiki.gg/wiki/Taelan%27s_Tower',
    traits: 'Classic Western Plaguelands roadside watchtower: sturdy pale stone and timber beside an exposed road, distant bleak hills and damaged trees. This broad scene does not claim an exact sightline, road course or floor plan.',
    prompt: 'Original painterly Classic Western Plaguelands road scene with a modest pale-stone and timber roadside watchtower, bleak green-gray fields, broken trees, misty hills and an exposed travel path. Readable as a human guard tower outside Hearthglen, not a tall gothic citadel. No characters, words or UI; no exact surveyed route or copied screenshot.',
  },
  {
    id: 'uther-tomb', name: 'Uther’s Tomb at Sorrow Hill', width: 1536, height: 1024,
    sourceArtifact: 'exec-4986c6af-c6c2-451a-8d91-fb56863d04cd.png',
    referenceUrl: 'https://warcraft.wiki.gg/wiki/Uther%27s_Tomb',
    traits: 'Classic Western Plaguelands memorial: pale carved stone tomb and broad steps, restrained silver-and-blue accents, diseased grassland, bare trees and low gray-green sky. A solemn human memorial, not a ruined cathedral.',
    prompt: 'Original painterly Classic-era landscape near Uther’s Tomb at Sorrow Hill in the Western Plaguelands. Broad view of the pale stone tomb and weathered memorial rising from windswept diseased green-brown field, sparse dead trees, low gray-green sky, solemn cold light. No characters, labels, logo, border, UI or copied screenshot.',
  },
  {
    id: 'stratholme-archive', name: 'The Archivist’s room in Stratholme', width: 1536, height: 1024,
    sourceArtifact: 'exec-1b936f1f-916a-4828-8397-288558e951e0.png',
    referenceUrl: 'https://warcraft.wiki.gg/wiki/Stratholme',
    traits: 'Classic Stratholme interior: scarlet masonry, old stone, shelves, cloth banners, candlelight and visible plague-green light beyond a broken arch. Twin-moons painting and hidden portrait are story clues. Interior geometry is interpretive and not a dungeon-floor reconstruction.',
    prompt: 'Original painterly environmental art for the ruined Scarlet Bastion Archivist chamber in Classic Stratholme. Narrow old stone archive, shelves, parchment, candlelight, a family painting mostly concealed by an ornate twin-moons painting, restrained red and ivory cloth, plague-green light through a broken arch. No people, no legible writing, logos, UI, border or copied screenshot. This is not an exact dungeon layout.',
  },
  {
    id: 'mardenholde-hall', name: 'Mardenholde Keep at Hearthglen', width: 1536, height: 1024,
    sourceArtifact: 'exec-514a1af1-7fcf-45a4-9560-2589d3031a90.png',
    referenceUrl: 'https://warcraft.wiki.gg/wiki/Hearthglen',
    traits: 'Classic Hearthglen keep interior: sturdy pale gray human masonry, high arches, red-white Scarlet Crusade banners and a cold view toward the Plaguelands. It reads as a military hall within a human settlement, not a black fortress or cathedral.',
    prompt: 'Original painterly Classic Western Plaguelands interior of Mardenholde Keep: sturdy pale gray-white human masonry, practical arches, a view onto sickly green-gray fields, Scarlet Crusade red-white banners and lived-in military furniture. This is a grounded human keep, not a gothic cathedral or red-brown fortress. No characters, text, UI, frame or copied game screenshot.',
  },
];

const subjects = [
  { id: 'tirion-fordring', name: 'Highlord Tirion Fordring', type: 'character', asset: 'tirion-fordring', width: 1024, height: 1536, sourceArtifact: 'exec-4621d1f9-8649-436d-91bd-e1cccf48352f.png', scale: 0.9, prompt: 'Original full-body transparent cutout of an older exiled human paladin, Tirion Fordring: weathered face, gray cloak over worn practical plate, quiet strength rather than triumphant ornament. Do not assert exact Classic armor. Clear, readable silhouette; no scene, text, frame, or copied game art.', description: 'Older human paladin in worn armor and a travel cloak, interpreted as an exile; face and costume require original Classic model review.' },
  { id: 'taelan-fordring', name: 'Highlord Taelan Fordring', type: 'character', asset: 'taelan-fordring', width: 1024, height: 1536, sourceArtifact: 'exec-1d0c0374-06d9-46ba-89b4-89bfc9cfa3d1.png', scale: 0.9, prompt: 'Original full-body transparent cutout of Highlord Taelan Fordring, a young adult human paladin: earnest face, practical steel plate, restrained ivory and red cloth of a Scarlet Crusade commander. His armor should distinguish him from his father without claiming an exact model. Clear silhouette; no scenery, text, frame or copied game art.', description: 'Young adult human paladin in interpreted Scarlet Crusade colors; armor and likeness remain open for Classic model review.' },
  { id: 'artist-renfray', name: 'Artist Renfray', type: 'character', asset: 'artist-renfray', width: 1024, height: 1536, sourceArtifact: 'exec-fef61d95-6ab6-4046-a399-a33ce99b43cb.png', scale: 0.84, prompt: 'Original full-body transparent cutout of Artist Renfray, a human woman ghost and painter from Classic Caer Darrow. Wispy silver-white hair, pale-blue spectral cloak over weathered painter clothing, translucent but readable face, one hand with a paintbrush, rolled canvas at her side. No scenery or copied game art.', description: 'Human ghost and artist with painter’s tools; spectral appearance is informed by the Classic identity, while costume and exact visual model require review.' },
  { id: 'grand-inquisitor-isillien', name: 'Grand Inquisitor Isillien', type: 'character', asset: 'grand-inquisitor-isillien', width: 1024, height: 1536, sourceArtifact: 'exec-6703c8d3-6b68-4054-8a7d-a2d932e449f9.png', scale: 0.94, prompt: 'Original full-body transparent cutout of older male human Grand Inquisitor Isillien: severe face, disciplined ivory plate and red Scarlet Crusade robes, a mace held low. Readable original interpretation, no exact model claim, no scenery, words, UI or copied game art.', description: 'Older human Scarlet Crusade inquisitor, represented in interpretive pale plate and red cloth; specific armor and weapon model remain to be reviewed.' },
  { id: 'scarlet-crusade', name: 'Scarlet Crusade pursuers', type: 'faction', asset: 'scarlet-pursuers', width: 1536, height: 1024, sourceArtifact: 'exec-1f51a228-7d88-456b-8c31-336688e1f392.png', scale: 0.95, prompt: 'Original transparent ensemble cutout of three distinct human Scarlet Crusade pursuers in pale ivory armor and red-white tabards, with swords and shields at rest. No exact member count or uniform model is asserted. No scene, text, UI or copied game art.', description: 'Ensemble of human Scarlet Crusade soldiers illustrating the armed organization; the number and equipment are interpretive, not a canonical roster.' },
  { id: 'taelans-miniature-warhammer', name: 'Taelan’s miniature warhammer', type: 'artifact', asset: 'taelans-miniature-warhammer', width: 1298, height: 1210, sourceArtifact: 'exec-2889a722-c7db-4076-8887-e26d70f36ad3.png', scale: 0.78, prompt: 'Original isolated transparent fantasy prop for Taelan’s miniature warhammer: compact child-sized model in aged bronze and dark carved wood with a small silver inset, short handle, understated detail. Not a giant battle weapon and not a verified client model.', description: 'Small childhood gift that connects Tirion and Taelan; the design is interpretive and not an exact Classic item model.' },
  { id: 'silver-hand-insignia', name: 'Silver Hand insignia', type: 'artifact', asset: 'silver-hand-insignia', width: 1278, height: 1230, sourceArtifact: 'exec-90f6448a-3f23-4990-ab8c-05bab627a3a3.png', scale: 0.72, prompt: 'Original isolated transparent fantasy prop: a weathered silver badge with a simple upright hand over dark blue enamel, representing the recovered Silver Hand symbol. Interpretive shape and materials; not a verified Classic object model.', description: 'Interpretive badge representing the recovered Silver Hand symbol; its shape, material and color need in-game comparison.' },
  { id: 'portrait-of-love-and-family', name: 'Of Love and Family — recovered portrait', type: 'artifact', asset: 'family-portrait-of-love-and-family', width: 1536, height: 1024, sourceArtifact: 'exec-745e4bf4-3edb-4ff1-b331-226cc40e5383.png', scale: 0.78, prompt: 'An isolated transparent dark-wood framed family painting: father, mother and young son beside a calm lake at sunset. Original interpretation of the quest’s recovered painting, not canonical faces, attire or exact location.', description: 'The recovered family painting shows Tirion, Karandra and their young son in an original lakeside interpretation. Its detailed appearance is not evidence for canonical faces, clothing or exact geography.' },
];

const locations = [
  { id: 'thondroril-river', name: 'Thondroril River', summary: 'A broad riverbank in the Eastern Plaguelands where Tirion’s Classic quest chain begins; no exact camp coordinate is asserted.' },
  { id: 'undercroft', name: 'The Undercroft', summary: 'A broad Western Plaguelands cemetery setting for the miniature-hammer recovery; the scene does not place the exact grave.' },
  { id: 'northdale', name: 'Northdale', summary: 'A ruined settlement and lake in the Eastern Plaguelands, associated with Taelan’s account of lost honor.' },
  { id: 'caer-darrow', name: 'Caer Darrow', summary: 'A ruined island settlement in the Western Plaguelands where Artist Renfray is found.' },
  { id: 'uther-s-tomb', name: 'Uther’s Tomb at Sorrow Hill', summary: 'A human memorial in the Western Plaguelands, where the quest chain locates Myranda.' },
  { id: 'hearthglen', name: 'Hearthglen', summary: 'A fortified human settlement in the Western Plaguelands under the Scarlet Crusade during this quest chain.' },
  { id: 'mardenholde-keep', name: 'Mardenholde Keep', summary: 'The keep at Hearthglen associated with Taelan’s title and the Scarlet Crusade period.' },
  { id: 'hearthglen-roadside-tower', name: 'The roadside tower outside Hearthglen', summary: 'A broad watchtower setting along the Western Plaguelands road, where the Classic In Dreams quest resolves.' },
];

const beats = [
  {
    id: 'the-old-hermit', title: 'The old hermit by Thondroril', env: 'thondroril-river', location: 'thondroril-river',
    cast: ['tirion-fordring'], objects: [], sources: ['tirion-taelan-classic-chain-guide', 'tirion-taelan-redemption-locator'], quests: ['Preliminary Tirion tasks; quest-chain opening'],
    text: 'In the cold reaches of the Eastern Plaguelands, an old hermit accepts help before he offers his name. The early errands are practical work among the dangers of the plague-struck countryside; they prove only that a stranger can be trusted. The narration begins at the bank where the hermit waits, after those tasks have opened his story. They did not cause his exile, and they are not recast here as a single battle. Beyond the river, a family’s long absence is the wound still waiting to be named.',
    editorNote: 'Quest prerequisites are compressed as a threshold, not retold as unique historical events. The image is a broad Classic Eastern Plaguelands impression, not an exact camp reconstruction.',
  },
  {
    id: 'tirions-request', title: 'The father in exile', env: 'thondroril-river', location: 'thondroril-river',
    cast: ['tirion-fordring'], objects: [], sources: ['tirion-taelan-redemption-locator'], quests: ['5742 · Redemption'],
    text: 'The hermit names himself Tirion Fordring. The quest account says that he was convicted of treason and banished from the Alliance; it does not explain the charge’s full history. He chose to remain in exile near his son. Taelan became lord of Mardenholde and later a Highlord of the Scarlet Crusade, an order Tirion sees as fallen from the Silver Hand’s purpose. Tirion asks for help because he believes his son can still remember the honor they once shared.',
    editorNote: 'The cause and circumstances behind Tirion’s conviction are not expanded from the quest text. The exact edition and page of the novella Of Blood and Honor remain unverified.',
  },
  {
    id: 'the-miniature-hammer', title: 'A small hammer beneath a false grave', env: 'undercroft-grave', location: 'undercroft',
    cast: [], objects: ['taelans-miniature-warhammer'], sources: ['tirion-taelan-forgotten-memories-locator'], quests: ['5781 · Of Forgotten Memories'],
    text: 'A miniature warhammer, once given to Taelan by his father, lies in the Undercroft. The reproduced quest account connects it to a false grave and to the story Taelan had been told as a child: that Tirion was dead. The object is small enough for a young hand, but it carries the weight of an absence made permanent by a lie. Its recovery does not undo the years apart. It gives Tirion one remembered gift to place before his son.',
    editorNote: 'The hammer’s appearance is interpretive. The scene refers to a false grave in the quest account, without claiming the exact plot position or encounter layout.',
  },
  {
    id: 'the-silver-hand-symbol', title: 'The emblem in Northdale’s lake', env: 'northdale-lake', location: 'northdale',
    cast: [], objects: ['silver-hand-insignia'], sources: ['tirion-taelan-lost-honor-locator'], quests: ['5845 · Of Lost Honor'],
    text: 'Tirion next asks for a symbol Taelan left behind. The quest recalls his son’s stand at Northdale after Uther’s death and says Taelan laid down the Silver Hand standard; its emblem now lies beneath the lake. The record preserves a moment of disillusion, not a full account of the fighting. We do not invent an exact battlefield line or name the soldiers who stood with him. The small sign of the old order rises from dark water, ready to join the hammer as a piece of shared history.',
    editorNote: 'The lake retrieval is supported; the precise battle, companions, formation and emblem model remain open. The scene is not a surveyed Northdale view.',
  },
  {
    id: 'renfray-remembers', title: 'Renfray remembers Caer Darrow', env: 'caer-darrow', location: 'caer-darrow',
    cast: ['artist-renfray'], objects: [], sources: ['tirion-taelan-portrait-introduction-locator'], quests: ['5846 · Of Love and Family (Tirion’s request)'],
    text: 'Tirion’s memory turns from the marks of duty to family excursions and an artist’s work. He sends the seeker to Caer Darrow, where his old friend Artist Renfray remains among the ruins. She painted the Fordring family in happier days. The island is now a quiet ruin in the lake, and Renfray is a ghost; the quest asks for a portrait, not a return to the life it preserves. Across years of exile, the canvas is a rare piece of the family’s past that has not vanished.',
    editorNote: 'Renfray is identified as a human ghost in Classic-era references. Her clothing, face and exact house are interpretive and need matching-build review.',
  },
  {
    id: 'the-twin-moons', title: 'The portrait behind the twin moons', env: 'stratholme-archive', location: 'stratholme',
    cast: [], objects: ['portrait-of-love-and-family'], sources: ['tirion-taelan-portrait-recovery-locator'], quests: ['5848 · Of Love and Family (Renfray’s follow-up)'],
    text: 'Renfray’s follow-up bears the same title as the task that brought the seeker to her, yet it is a different Classic quest. Its objective leads into Stratholme, where the family painting is hidden behind a picture of twin moons in the Archivist’s room. The crimson city has become a storehouse of other people’s ruin; within it, a small work of family memory survives. This scene shows the concealment as an original interpretation, not an exact dungeon plan or verified painting model.',
    editorNote: 'Quest 5846 and quest 5848 are separate tasks with distinct givers. This entry covers only recovery from the Archivist’s room; the later Eligor quest with the same title is excluded.',
  },
  {
    id: 'a-family-restored-in-paint', title: 'A family restored in paint', env: 'fordring-family-memory', location: 'thondroril-river',
    cast: ['tirion-fordring'], objects: ['portrait-of-love-and-family'], sources: ['tirion-taelan-portrait-introduction-locator', 'tirion-taelan-portrait-recovery-locator'], quests: ['5846 and 5848 · Of Love and Family'],
    text: 'The returned painting brings Karandra and young Taelan into view beside Tirion. The Classic quest connects it to family outings and a portrait made by Renfray; the lakeside colors here interpret that recollection rather than claim an exact beach or the canvas’s original appearance. The painting restores a likeness, not a lost childhood. For Tirion, memory can now be given back in a form his son may recognize, if the son is still willing to receive it.',
    editorNote: 'The event returns to Tirion at Thondroril; the image is a labeled family-memory passage and does not place the family together there in present time.',
  },
  {
    id: 'myranda-at-uthers-tomb', title: 'Myranda at Uther’s Tomb', env: 'uther-tomb', location: 'uther-s-tomb',
    cast: ['myranda-the-hag'], objects: [], sources: ['tirion-taelan-find-myranda-locator'], quests: ['5861 · Find Myranda'],
    text: 'The keepsakes travel onward as a message to Myranda, whom the chain locates at Uther’s Tomb. Tirion asks his former ally to help the seeker pass into Hearthglen. Myranda’s brief place in this story reaches back to her work alongside him, though this quest does not retell every part of her life. Against pale memorial stone and plague-damaged grass, she becomes the last guide before the family’s past is carried directly to Taelan.',
    editorNote: 'Myranda’s character art is reused from the existing Classic Onyxia story. It remains interpretive, and no exact costume or human model comparison is claimed.',
  },
  {
    id: 'a-gift-in-hearthglen', title: 'A gift beneath Scarlet colors', env: 'hearthglen', location: 'hearthglen',
    cast: ['taelan-fordring', 'scarlet-crusade'], objects: [], sources: ['tirion-taelan-scarlet-subterfuge-locator'], quests: ['5862 · Scarlet Subterfuge'],
    text: 'A disguise opens the way into Hearthglen, where Tirion’s gift can reach Taelan. The Classic chain makes subterfuge the bridge between father and son: the seeker enters the Scarlet Crusade’s stronghold under borrowed colors and gives the package to its Highlord. The banners and pale stone of the settlement frame a tense reunion without placing Tirion there. The audience sees the old family tokens cross a guarded threshold; what Taelan will do with them remains his choice.',
    editorNote: 'The adventurer’s appearance and faction are not represented. The Scarlet figures are illustrative; the scene does not claim a uniform roster or exact patrol arrangement.',
  },
  {
    id: 'taelan-chooses-to-leave', title: 'Taelan ends the dream', env: 'mardenholde-hall', location: 'mardenholde-keep',
    cast: ['taelan-fordring'], objects: ['portrait-of-love-and-family', 'taelans-miniature-warhammer', 'silver-hand-insignia'], sources: ['tirion-taelan-in-dreams-locator'], quests: ['5944 · In Dreams'],
    text: 'The gift reaches the part of Taelan that his title could not silence. In the quest account, he recognizes how long he has been made a tool of the Grand Crusader, and his father’s memory has endured beneath that service. Taelan decides to leave Hearthglen. The portrait and keepsakes do not command him; they return a past from which he can make a choice of his own. The hall’s red-and-white standards still surround him, but their claim on his future has broken.',
    editorNote: 'The keepsakes are shown together as an editorial visual summary, not as a claim that all three objects appear in one in-game inventory or scene.',
  },
  {
    id: 'out-through-hearthglen', title: 'Out through Hearthglen', env: 'hearthglen', location: 'hearthglen',
    cast: ['taelan-fordring', 'scarlet-crusade'], objects: [], sources: ['tirion-taelan-in-dreams-locator'], quests: ['5944 · In Dreams'],
    text: 'Taelan leaves the keep and makes his way out through Hearthglen. The quest turns this departure into an ordeal as Scarlet Crusade forces oppose him. He is no longer the quiet child Tirion watched from exile: he has chosen to break with the order that shaped his adult life. The guards become a last barrier between the Highlord and the open road. The chain gives no private motive to each soldier, and Taelan’s struggle ends at the tower beyond the settlement.',
    editorNote: 'The opposition is represented as an ensemble, not an exact count or canonical formation. Quest order names the settlement and outcome but does not support a surveyed route.',
  },
  {
    id: 'isillien-at-the-tower', title: 'The road ends at the tower', env: 'taelans-tower', location: 'hearthglen-roadside-tower',
    cast: ['taelan-fordring', 'grand-inquisitor-isillien', 'scarlet-crusade'], objects: [], sources: ['tirion-taelan-in-dreams-locator'], quests: ['5944 · In Dreams'],
    text: 'Beyond Hearthglen, the quest brings Taelan to a roadside tower and Grand Inquisitor Isillien. It records Taelan’s death there at Isillien’s hands. The story does not soften this into a mere interruption: the son who chose to leave the Scarlet Crusade has no return to the father he hoped to meet. The tower stands at the edge of the road, a small human post amid a wounded land, and the long effort to restore memory reaches its cost.',
    editorNote: 'The scripted quest ending establishes Taelan’s death and Isillien’s role. Tower shape, combat staging and exact geography are interpretive; no alternate ending is asserted.',
  },
  {
    id: 'tirion-arrives', title: 'Tirion arrives', env: 'taelans-tower', location: 'hearthglen-roadside-tower',
    cast: ['tirion-fordring', 'grand-inquisitor-isillien'], objects: [], sources: ['tirion-taelan-in-dreams-locator'], quests: ['5944 · In Dreams'],
    text: 'Tirion reaches the tower too late to save his son. The quest account then has him defeat Isillien and grieve beside Taelan. The father’s return answers the appeal he made at Thondroril, but not in the way he sought: he has recovered the truth and lost the living voice that might have answered him. We hold the scene to those recorded actions. No dialogue is reconstructed, and the art does not invent a private final exchange.',
    editorNote: 'The scene depicts the quest-completion event only. It makes no claim about unrecorded dialogue or exact character positions.',
  },
  {
    id: 'a-new-order', title: 'A vow to rebuild the Silver Hand', env: 'taelans-tower', location: 'hearthglen-roadside-tower',
    cast: ['tirion-fordring'], objects: ['silver-hand-insignia'], sources: ['tirion-taelan-in-dreams-locator'], quests: ['5944 · In Dreams · conclusion'],
    text: 'At Taelan’s body, Tirion vows to gather a new Order of the Silver Hand and turn it again toward the defense of the world. The Classic chain ends with a purpose, not with the later history of that order already fulfilled. A small emblem rests beside the grieving father as a visual echo of the honor Taelan once laid down. The quest closes Tirion and Taelan’s story here; later campaigns, including the Wrath-era chapters, belong to their own records.',
    editorNote: 'The ending is Tirion’s immediate vow in the Classic quest chain. Do not substitute the later Argent Crusade or attribute later Wrath events to this resolution.',
  },
];

const sourceById = new Map(sources.map((source) => [source.id, source]));
const environmentById = new Map(environments.map((item) => [item.id, item]));
const entityById = new Map(subjects.map((item) => [item.id, item]));
const allSourceIds = [...new Set(beats.flatMap((beat) => beat.sources))];
const usedEntityIds = [...new Set(beats.flatMap((beat) => [...beat.cast, ...beat.objects]))];

for (const environment of environments) {
  const file = `${imageDirectory}/${environment.id}.research.webp`;
  await access(path.join(root, 'public', file));
  await write(`data/map-states/${storyId}-${environment.id}.research.json`, {
    id: `${storyId}-${environment.id}-scene`,
    name: `Tirion and Taelan: ${environment.name}`,
    worldspaceId,
    presentation: 'relational',
    terrainTextureAsset: file,
    geometryIds: [],
    cartographyLabel: environment.id === 'fordring-family-memory' ? 'FAMILY MEMORY · INTERPRETIVE PAINTING' : 'ILLUSTRATED QUESTLINE THEATER',
    interpretationNote: `Original AI-generated ${environment.id === 'fordring-family-memory' ? 'family-memory painting' : 'environment'} for ${environment.name}. Target edition: original World of Warcraft Classic, pre-Cataclysm identity. Recognizable traits: ${environment.traits} This scene is interpretive art, not an official screenshot, exact model, surveyed geography, route, dungeon plan or proof of character co-presence. See docs/research/${storyId}-visual-assets.json for the matching-build comparison gate.`,
  });
}

for (const entityId of usedEntityIds) {
  if (entityId === 'myranda-the-hag') continue;
  const item = entityById.get(entityId);
  if (!item) throw new Error(`Missing entity declaration: ${entityId}`);
  const assetPath = `${imageDirectory}/${item.asset}.research.webp`;
  await access(path.join(root, 'public', assetPath));
  const itemSources = [...new Set(beats.filter((beat) => beat.cast.includes(entityId) || beat.objects.includes(entityId)).flatMap((beat) => beat.sources))];
  await write(`data/entities/${entityId}.research.json`, {
    id: entityId,
    type: item.type,
    name: item.name,
    slug: entityId,
    shortDescription: `${item.name}, represented in the Classic Tirion and Taelan research story.`,
    body: `${item.description} This original interpretation is not canonical game art or evidence for an exact appearance, event or location. See the story’s visual asset ledger for the matching-build review gate.`,
    firstEraId: eraId,
    featuredEraIds: [eraId],
    sourceIds: itemSources,
    tags: ['tirion-taelan-story', 'interpretive-art'],
    ...(item.type === 'character'
      ? { mapFigure: { asset: assetPath, scale: item.scale } }
      : { mapVisual: { asset: assetPath, scale: item.scale } }),
    contentStatus: 'research',
  });
}

const myrandaPath = path.join(root, 'data/entities/myranda-the-hag.research.json');
const myranda = JSON.parse(await readFile(myrandaPath, 'utf8'));
myranda.featuredEraIds = [...new Set([...(myranda.featuredEraIds ?? []), eraId])];
myranda.sourceIds = [...new Set([...myranda.sourceIds, 'tirion-taelan-find-myranda-locator'])];
myranda.tags = [...new Set([...myranda.tags, 'tirion-taelan-story'])];
await write('data/entities/myranda-the-hag.research.json', myranda);

const stratholmePath = path.join(root, 'data/entities/stratholme.research.json');
const stratholme = JSON.parse(await readFile(stratholmePath, 'utf8'));
stratholme.featuredEraIds = [...new Set([...(stratholme.featuredEraIds ?? []), eraId])];
stratholme.sourceIds = [...new Set([...stratholme.sourceIds, 'tirion-taelan-portrait-recovery-locator'])];
stratholme.tags = [...new Set([...stratholme.tags, 'tirion-taelan-story'])];
await write('data/entities/stratholme.research.json', stratholme);

const visuals = usedEntityIds.filter((id) => id !== 'myranda-the-hag');
const slots = new Map();
for (const id of visuals) {
  const neighbors = new Set(beats.filter((beat) => beat.cast.includes(id) || beat.objects.includes(id)).flatMap((beat) => [...beat.cast, ...beat.objects]));
  const occupied = new Set([...neighbors].map((neighbor) => slots.get(neighbor)).filter((slot) => slot !== undefined));
  let slot = 0;
  while (occupied.has(slot)) slot++;
  slots.set(id, slot);
}
const columnCount = Math.max(...slots.values()) + 1;
const features = [];
for (const id of visuals) {
  const x = 2800 + (slots.get(id) * 4400) / Math.max(1, columnCount - 1);
  const geometryId = `${storyId}-${id}-focus`;
  features.push({
    type: 'Feature',
    id: geometryId,
    properties: { name: `${entityById.get(id).name} editorial focus`, contentStatus: 'research', styleRole: 'site', geographicCertainty: 'unknown' },
    geometry: { type: 'Point', coordinates: [x, 5300] },
  });
  const entitySources = [...new Set(beats.filter((beat) => beat.cast.includes(id) || beat.objects.includes(id)).flatMap((beat) => beat.sources))];
  await write(`data/spatial-states/${storyId}-${id}.research.json`, {
    id: `${storyId}-${id}-theater`, entityId: id, eraId, worldspaceId, geometryId,
    placementKind: 'relational', geographicCertainty: 'unknown', sourceIds: entitySources,
    editorNote: 'Editorial figure or artifact placement in a relational story theater. It does not claim a world position, route, exact formation, co-presence in a historical location, or canonical object model.',
    visualPresence: 'contextual', labelPriority: 240,
  });
}

const myrandaGeometryId = `${storyId}-myranda-the-hag-focus`;
features.push({
  type: 'Feature', id: myrandaGeometryId,
  properties: { name: 'Myranda the Hag editorial focus', contentStatus: 'research', styleRole: 'site', geographicCertainty: 'unknown' },
  geometry: { type: 'Point', coordinates: [7200, 5300] },
});
await write(`data/spatial-states/${storyId}-myranda-the-hag.research.json`, {
  id: `${storyId}-myranda-the-hag-theater`, entityId: 'myranda-the-hag', eraId, worldspaceId,
  geometryId: myrandaGeometryId, placementKind: 'relational', geographicCertainty: 'unknown',
  sourceIds: ['tirion-taelan-find-myranda-locator'],
  editorNote: 'Reuses Myranda’s existing character cutout in a new relational story theater; placement does not assert that her Onyxia-story locations overlap this scene.',
  visualPresence: 'contextual', labelPriority: 240,
});

await write(`data/geometry/${storyId}-theater.research.geojson`, { type: 'FeatureCollection', features });
await write(`data/worldspaces/${worldspaceId}.research.json`, {
  id: worldspaceId,
  name: 'Tirion and Taelan — relational story theater',
  slug: worldspaceId,
  coordinateSystem: { width: 10000, height: 10000, origin: 'bottom-left', units: 'atlas-units' },
});

for (const location of locations) {
  const supportingSources = [...new Set(beats.filter((beat) => beat.location === location.id).flatMap((beat) => beat.sources))];
  const file = `data/entities/${location.id}.research.json`;
  const prior = await readFile(path.join(root, file), 'utf8').then(JSON.parse).catch(() => undefined);
  await write(file, {
    ...(prior ?? {}),
    id: location.id, type: 'location', name: location.name, slug: location.id,
    shortDescription: location.summary,
    body: `${location.summary} Map placement is broad and interpretive. The story does not assert exact coordinates, a route or an exact instance layout.`,
    firstEraId: prior?.firstEraId ?? eraId,
    featuredEraIds: [...new Set([...(prior?.featuredEraIds ?? []), eraId])],
    sourceIds: [...new Set([...(prior?.sourceIds ?? []), ...supportingSources])],
    tags: [...new Set([...(prior?.tags ?? []), 'tirion-taelan-story', 'classic-era-location'])],
    contentStatus: prior?.contentStatus ?? 'research',
  });
}

const nodes = [];
for (const [index, beat] of beats.entries()) {
  const nodeId = `${storyId}-story-${beat.id}`;
  const eventId = `${storyId}-${beat.id}-event`;
  const citationIds = [];
  for (const [sourceIndex, sourceId] of beat.sources.entries()) {
    const citationId = `${storyId}-${beat.id}-citation-${sourceIndex + 1}`;
    citationIds.push(citationId);
    const source = sourceById.get(sourceId);
    const questRef = beat.quests[Math.min(sourceIndex, beat.quests.length - 1)];
    await write(`data/citations/${citationId}.research.json`, {
      id: citationId,
      sourceId,
      section: `${questRef} · ${beat.title}; directly relevant chain entry, description, objective or completion text`,
      ...(source?.id.includes('locator') && questRef.match(/^\d{4}/) ? { questId: questRef } : {}),
      note: 'Narration is an original paraphrase of an accessible secondary Classic quest reproduction. It is not an original-client capture; compare the intended pre-Cataclysm quest build and text before human lore approval.',
    });
  }
  const claimId = `${storyId}-${beat.id}-claim`;
  await write(`data/claims/${claimId}.research.json`, {
    id: claimId,
    subjectId: eventId,
    predicate: 'questline_scene_account',
    value: beat.text,
    citationIds,
    confidence: 'strongly_supported',
    status: 'active',
    editorNote: beat.editorNote ?? 'Chronology follows Classic quest dependency. Exact date and any unsupported causal link remain unknown; original client and build need human review.',
  });
  await write(`data/events/${eventId}.research.json`, {
    id: eventId,
    kind: 'event',
    name: beat.title,
    slug: `${storyId}-${beat.id}`,
    eraId,
    worldspaceId,
    date: { precision: 'relative', label: 'Original World of Warcraft Classic · Tirion and Taelan quest chain; exact dating unknown' },
    summary: beat.text,
    locationIds: [beat.location],
    participantEntityIds: [...new Set(beat.cast)],
    sourceIds: beat.sources,
    claimIds: [claimId],
    contentStatus: 'research',
  });

  const entityIds = [...new Set([...beat.cast, ...beat.objects])];
  const priorStory = await readFile(path.join(root, `data/stories/${storyId}.research.json`), 'utf8').then(JSON.parse).catch(() => undefined);
  const oldNode = priorStory?.nodes?.find((node) => node.id === nodeId);
  const voiceover = oldNode?.narration === beat.text ? oldNode.voiceover : undefined;
  nodes.push({
    id: nodeId,
    guideId,
    title: beat.title,
    narration: beat.text,
    durationMs: voiceover?.durationMs ?? Math.round(((beat.text.split(/\s+/).length / 82) * 60_000) / 500) * 500 + 5_000,
    ...(voiceover ? { voiceover } : {}),
    eventIds: [eventId],
    entityIds,
    locationIds: [beat.location],
    camera: { position: [0, 6.15, 5.4], target: [0, 0, 0], durationMs: 1150 },
    visualActions: [{ type: 'set_map_state', mapStateId: `${storyId}-${beat.env}-scene` }],
    ...(index > 0 ? { previousNodeId: nodes[index - 1].id } : {}),
    ...(index < beats.length - 1 ? { nextNodeIds: [`${storyId}-story-${beats[index + 1].id}`] } : {}),
  });
}

const guide = {
  id: guideId,
  eraId,
  title: 'Tirion and Taelan: Of Love and Family',
  description: 'A 14-scene illustrated Classic research story follows Tirion’s exile, the recovered memories of his family, Taelan’s decision to leave Hearthglen, and the loss that renews his father’s purpose.',
  nodeIds: nodes.map((node) => node.id),
  contentStatus: 'research',
};
await write(`data/stories/${storyId}.research.json`, { guide, nodes });

const chapters = [
  { id: 'an-exiles-request', title: 'An Exile’s Request', start: 0, end: 3, body: 'A hermit reveals himself as Tirion. His account of Taelan and the recovery of childhood and honor keepsakes opens a road back through memory. Scenes 1–4.' },
  { id: 'what-the-portrait-keeps', title: 'What the Portrait Keeps', start: 4, end: 7, body: 'Renfray and Myranda help turn a lost family portrait into a message that can reach Hearthglen. The two Classic quests named Of Love and Family remain separate. Scenes 5–8.' },
  { id: 'dreams-and-departure', title: 'Dreams and Departure', start: 8, end: 13, body: 'Taelan receives his father’s gift, chooses to leave the Scarlet Crusade, and dies at a roadside tower. Tirion’s grief ends the chain in a vow to rebuild the Silver Hand. Later history belongs to the Wrath packets. Scenes 9–14.' },
].map(({ id, title, body }) => ({ id, eraId, title, body }));

const storyline = {
  id: storyId,
  slug: storyId,
  title: 'Tirion and Taelan: Of Love and Family',
  summary: 'Tirion asks a stranger to help his son remember his family and honor. A childhood gift, a lost emblem and Renfray’s portrait reach Taelan in Hearthglen; his choice to leave ends in death and gives Tirion a renewed purpose.',
  opening: 'At the edge of the Plaguelands, an exile entrusts his son’s past to a stranger. The Classic quest chain moves from family keepsakes to a hard choice in Hearthglen, then ends with the loss Tirion must carry forward.',
  primaryEraId: eraId,
  eraIds: [eraId],
  chapters,
  sourceIds: allSourceIds,
  reviewNote: 'Complete 14-scene illustrated research story with transcript-matched AI narration, Classic quest locators, one claim and event per beat, separate 5846/5848 quests, original area-specific environments, principal cast and recovered objects. Quest data comes from secondary reproductions; original 1.12-era text and the ending need human capture. Compare each generated place, character and prop with the matching pre-Cataclysm Classic area/model before approval. Exact date, private emotion, routes and the Of Blood and Honor novella page references remain open; voice listening and pronunciation review also remain open. This story ends with the 5944 vow and does not narrate the later Argent Crusade or Wrath campaigns.',
  storyGuideId: guideId,
  contentStatus: 'research',
};
await write(`data/storylines/${storyId}.research.json`, storyline);

const eraPath = path.join(root, `data/eras/${eraId}.research.json`);
const era = JSON.parse(await readFile(eraPath, 'utf8'));
era.sourceIds = [...new Set([...era.sourceIds, ...allSourceIds])];
await write(`data/eras/${eraId}.research.json`, era);

const tourPath = 'data/story-tours/classic-to-wrath.research.json';
const tour = JSON.parse(await readFile(path.join(root, tourPath), 'utf8'));
const newEntry = {
  storylineId: storyId,
  regionIds: ['eastern-kingdoms'],
  mapPositionPercent: [67, 46],
  order: 5,
  periodLabel: 'Original World of Warcraft · Classic',
  locationLabel: 'The Plaguelands · Tirion and Taelan',
};
tour.entries = [...tour.entries.filter((entry) => entry.storylineId !== storyId), newEntry];
const authoredOrder = new Map([
  ['stormwind-onyxia-conspiracy', 1],
  ['scepter-of-the-shifting-sands', 2],
  ['dungeon-set-two-veiled-blade', 3],
  ['fallen-hero-and-rakhlikh', 4],
  [storyId, 5],
  ['karazhan-masters-key-and-nightbane', 6],
  ['cipher-of-damnation-oronok', 7],
  ['wrathgate-and-undercity', 8],
]);
for (const entry of tour.entries) entry.order = authoredOrder.get(entry.storylineId) ?? entry.order;
tour.entries.sort((a, b) => a.order - b.order);
tour.chronologyNote = 'Play-all order is an editorial expansion-era sequence: original Classic (Onyxia, the Scepter campaign, Dungeon Set 2, the Fallen Hero chain, then Tirion and Taelan), The Burning Crusade (Karazhan before the Outland Cipher of Damnation preview), and Wrath of the Lich King (Wrathgate preview). It organizes access and does not claim the selected stories caused one another or have canonical relative dates within Classic. Scepter’s ancient prologue is an earlier flashback; Dungeon Set 2’s companion fates are alternatives; the Fallen Hero’s faction openings are mutually exclusive; and Tirion and Taelan ends at its Classic quest resolution.';
tour.reviewNote = 'Playable guide entries: Classic Onyxia, Scepter, Dungeon Set 2, the Fallen Hero and Tirion and Taelan; plus the complete TBC Karazhan research guide. The Outland Cipher of Damnation and Northrend Wrathgate remain previews outside Play All. Original-client quest/build, faction variant, relative Classic ordering, map-art and matching in-game area/model reviews remain open for human approval.';
await write(tourPath, tour);

const candidatePath = path.join(root, 'docs/research/questline-story-candidates.md');
let candidates = await readFile(candidatePath, 'utf8');
const candidateGate = '**Gate:** use original quests, not the later Eligor quest sharing the title. Source the novella prologue independently; end the main story at this chain\'s resolution, with links to Wrath packets.';
const candidateStart = candidates.indexOf('### 05. Tirion and Taelan: Of Love and Family');
const candidateEnd = candidates.indexOf('\n### 06.', candidateStart);
if (candidateStart < 0 || candidateEnd < 0) throw new Error('Could not locate the Tirion/Taelan candidate section.');
const candidateSection = candidates.slice(candidateStart, candidateEnd);
const candidateGateEnd = candidateSection.indexOf(candidateGate) + candidateGate.length;
if (candidateGateEnd < candidateGate.length) throw new Error('Could not locate the Tirion/Taelan candidate gate.');
const candidateImplementation = `**Implementation:** Complete 14-scene illustrated Classic research story with 14 transcript-matched AI voice tracks, event/claim/citation records, two separately cited quests titled Of Love and Family, recognizable Eastern and Western Plaguelands environments, principal cast and recovered keepsakes, and a fifth Classic marker in the Classic-to-Wrath StoryTour. The chain ends at the In Dreams vow; exact novella pages, original-client comparison, relative Classic placement, matching-build area/model/art review, and voice audition remain open. See the [production ledger](${storyId}-production.md) and [visual asset ledger](${storyId}-visual-assets.json).`;
candidates = `${candidates.slice(0, candidateStart)}${candidateSection.slice(0, candidateGateEnd)}\n\n${candidateImplementation}\n\n${candidates.slice(candidateEnd)}`;
await write('docs/research/questline-story-candidates.md', candidates);

const planPath = path.join(root, 'docs/IMPLEMENTATION_PLAN.md');
let plan = await readFile(planPath, 'utf8');
const oldPlan = 'The Dragon in Stormwind, Scepter of the Shifting Sands, Dungeon Set 2: The Veiled Blade and Lord Valthalak, and Karazhan: The Master’s Key and Nightbane are its four playable stories; the Outland Cipher of Damnation and Northrend Wrathgate remain research previews.';
const newPlan = 'The Dragon in Stormwind, Scepter of the Shifting Sands, Dungeon Set 2: The Veiled Blade and Lord Valthalak, The Fallen Hero and Rakh’likh, Tirion and Taelan: Of Love and Family, and Karazhan: The Master’s Key and Nightbane are its six playable stories; the Outland Cipher of Damnation and Northrend Wrathgate remain research previews.';
if (plan.includes(oldPlan)) plan = plan.replace(oldPlan, newPlan);
else if (!plan.includes(newPlan)) throw new Error('Could not locate the Classic-to-Wrath implementation status sentence.');
await write('docs/IMPLEMENTATION_PLAN.md', plan);

const eraReadme = await readFile(path.join(root, 'docs/eras/README.md'), 'utf8');
const eraMarker = 'These research packets do not replace the era guides or constitute finished tours.';
const eraStoryNote = 'The separate Classic-to-Wrath StoryTour now includes the complete illustrated Tirion and Taelan questline';
if (!eraReadme.includes(eraStoryNote)) {
  if (!eraReadme.includes(eraMarker)) throw new Error('Could not locate the Era 8 research packet note.');
  await write('docs/eras/README.md', eraReadme.replace(eraMarker, `${eraMarker} The separate Classic-to-Wrath StoryTour now includes the complete illustrated Tirion and Taelan questline after the earlier Classic stories; it reuses its own StoryGuide and does not enter EraTour or full-history playback.`));
}

const visualLedgerAssets = [];
for (const environment of environments) {
  const file = `${artDirectory}/${environment.id}.research.webp`;
  const [bytes, info] = await Promise.all([readFile(path.join(root, file)), stat(path.join(root, file))]);
  const refs = [...new Set(beats.filter((beat) => beat.env === environment.id).flatMap((beat) => beat.sources))];
  visualLedgerAssets.push({
    id: environment.id, kind: 'environment', file,
    pixelWidth: environment.width, pixelHeight: environment.height,
    area: environment.name, sourceArtifact: environment.sourceArtifact,
    targetEditionBuild: 'Original World of Warcraft Classic, pre-Cataclysm zone identity; Classic Era 1.15.8 is the accessible secondary quest locator. Compare the original 1.12-era area where available.',
    recognizableTraits: environment.traits,
    visualReference: { editionBuild: 'Original World of Warcraft Classic, pre-Cataclysm area presentation', locator: environment.referenceUrl, comparisonCapture: 'No in-client capture claimed. Human side-by-side area/build review remains open.' },
    generationPrompt: environment.prompt,
    generator: 'OpenAI ImageGen; original landscape illustration, converted to optimized WebP for repository playback.',
    transparency: false,
    visualReview: 'Checked against its written palette and area traits. Human in-client resemblance comparison for the intended Classic build remains open.',
    sourceReferences: refs.map((sourceId) => ({ sourceId, url: sourceById.get(sourceId)?.url })),
    byteLength: bytes.length,
    modifiedAt: info.mtime.toISOString(),
    sha256: createHash('sha256').update(bytes).digest('hex'),
  });
}
for (const subject of subjects) {
  const file = `${artDirectory}/${subject.asset}.research.webp`;
  const [bytes, info] = await Promise.all([readFile(path.join(root, file)), stat(path.join(root, file))]);
  const refs = [...new Set(beats.filter((beat) => beat.cast.includes(subject.id) || beat.objects.includes(subject.id)).flatMap((beat) => beat.sources))];
  visualLedgerAssets.push({
    id: subject.id,
    kind: subject.type,
    file,
    representedBy: subject.name,
    pixelWidth: subject.width,
    pixelHeight: subject.height,
    sourceArtifact: subject.sourceArtifact,
    targetEditionBuild: 'Original World of Warcraft Classic character or object identity; exact 1.12-era model match remains unreviewed.',
    recognizableTraits: subject.description,
    generationPrompt: subject.prompt,
    generator: 'OpenAI ImageGen; original illustrated portrait or object cutout, optimized as alpha-capable WebP.',
    transparency: true,
    visualReference: { editionBuild: 'Original World of Warcraft Classic, pre-Cataclysm quest identity', sourceReferences: refs.map((sourceId) => ({ sourceId, url: sourceById.get(sourceId)?.url })), comparisonCapture: 'Generated art is not canonical. Human comparison with the intended Classic character/item presentation remains open.' },
    visualReview: 'Subject is readable at its authored scale and the delivered cutout retains transparent pixels. Exact costume, species, object shape and matching-build resemblance require human review.',
    sourceReferences: refs.map((sourceId) => ({ sourceId, url: sourceById.get(sourceId)?.url })),
    byteLength: bytes.length,
    modifiedAt: info.mtime.toISOString(),
    sha256: createHash('sha256').update(bytes).digest('hex'),
  });
}
const myrandaFile = 'public/images/storylines/onyxia/myranda-the-hag.research.webp';
const [myrandaBytes, myrandaInfo] = await Promise.all([readFile(path.join(root, myrandaFile)), stat(path.join(root, myrandaFile))]);
visualLedgerAssets.push({
  id: 'myranda-the-hag', kind: 'character', file: myrandaFile, representedBy: 'Myranda the Hag',
  pixelWidth: 1024, pixelHeight: 1536,
  reuseFrom: 'docs/research/onyxia-visual-assets.json',
  targetEditionBuild: 'Classic Era 1.15.8 quest locator; original Classic character identity; exact 1.12-era model comparison remains open.',
  generationPrompt: 'Reuses the existing transparent Myranda cutout from the Classic Onyxia storyline; no new character image was generated.',
  generator: 'Existing repository asset from the Onyxia story; reused in this relational StoryGuide and StoryTour.',
  transparency: true,
  visualReview: 'Reused repository character image loads in the new story theater; human matching-build model review remains open.',
  sourceReferences: [{ sourceId: 'tirion-taelan-find-myranda-locator', url: sourceById.get('tirion-taelan-find-myranda-locator').url }],
  byteLength: myrandaBytes.length,
  modifiedAt: myrandaInfo.mtime.toISOString(),
  sha256: createHash('sha256').update(myrandaBytes).digest('hex'),
});

const sceneLedger = beats.map((beat, index) => {
  const environment = environmentById.get(beat.env);
  return {
    nodeId: nodes[index].id,
    title: beat.title,
    environmentPath: `${artDirectory}/${beat.env}.research.webp`,
    gameArea: environment.name,
    referenceEditionBuild: 'Original World of Warcraft Classic, pre-Cataclysm area identity; Classic Era 1.15.8 quest reproduction used as a locator, original 1.12-era comparison remains open.',
    recognizableTraits: environment.traits,
    resemblanceReview: 'Written trait check recorded; no in-client screenshot or human matching-build approval is claimed.',
    cast: beat.cast.map((id) => ({ id, name: id === 'myranda-the-hag' ? 'Myranda the Hag' : entityById.get(id).name, image: id === 'myranda-the-hag' ? 'public/images/storylines/onyxia/myranda-the-hag.research.webp' : `${artDirectory}/${entityById.get(id).asset}.research.webp` })),
    objects: beat.objects.map((id) => ({ id, name: entityById.get(id).name, image: `${artDirectory}/${entityById.get(id).asset}.research.webp` })),
    visualActions: ['set_map_state', 'show contextual illustrated cast and recovered objects'],
    geographyAndChronologyNote: beat.editorNote ?? 'Order follows the Classic quest dependency. Scene stages are relational and make no exact-coordinate or route claim.',
    claimIds: [`${storyId}-${beat.id}-claim`],
  };
});
await write(`docs/research/${storyId}-visual-assets.json`, {
  storyId,
  status: 'research',
  targetEditionBuild: 'Original World of Warcraft Classic, pre-Cataclysm areas and quest identity. Classic Era 1.15.8 pages are secondary locators; exact original 1.12-era client comparison remains open.',
  editorialRule: 'For every released game area, preserve its recognizable version-specific palette, architecture, terrain, vegetation, skyline and landmarks with an original composition. Compare each scene and cast cutout against the matching in-game area/model before approval.',
  sourceProvenance: 'All new environment and cutout illustrations were generated with OpenAI ImageGen, then converted to repository WebP assets. No official game art or source-page screenshots are included. Myranda’s existing Classic Onyxia portrait is reused.',
  humanReview: 'Review every scene and principal model in the matching Classic game client/build. Verify the original 1.12-era quest text and event, especially the 5846/5848 title distinction and In Dreams ending. The written trait list is not an in-game visual comparison.',
  assetRecords: visualLedgerAssets,
  sceneLedger,
});

let production = `# Tirion and Taelan: Of Love and Family — production and claim ledger\n\n`;
production += `Status: complete illustrated research story; not reviewed or published. ${nodes.length} scenes; ${nodes.reduce((sum, node) => sum + node.narration.split(/\s+/).length, 0)} narration words. Primary era: Era 8 / original World of Warcraft Classic. Exact event dating is unknown.\n\n`;
production += '## Historical boundary and playable chain\n\nThe main story begins with Tirion’s Redemption disclosure and ends with the immediate vow in In Dreams. The three preliminary errands are compressed as a prerequisite; repeatable creature clearing is not narrated as historical action. The throughline is: Redemption (5742) → Of Forgotten Memories (5781) → Of Lost Honor (5845) → Of Love and Family (5846, Tirion sends the seeker to Renfray) → Of Love and Family (5848, Renfray’s distinct painting-recovery quest) → Find Myranda (5861) → Scarlet Subterfuge (5862) → In Dreams (5944). The two identically titled quests remain separate. The later Eligor quest, the unresolved novella prologue, Tirion’s later order, and all Wrath-era outcomes are outside this playable ending.\n\n';
production += 'The chain’s Classic quest dependency is the editorial play order, not proof of exact dates or that one quest caused a later historical event. The Alliance conviction behind Tirion’s exile is not explained beyond the quest’s brief account. The exact edition and page references for *Of Blood and Honor* were not available, so its detailed prologue is not narrated. The player character remains unnamed and faction-neutral.\n\n';
production += '## Claim and scene ledger\n\n| Scene | Quest evidence | Principal figures and objects | Place and recognizable Classic traits | Geography, chronology and uncertainty |\n| --- | --- | --- | --- | --- |\n';
for (const beat of beats) {
  const environment = environmentById.get(beat.env);
  production += `| ${beat.title} | ${beat.quests.join('; ')} · ${beat.sources.join(', ')} | ${[...beat.cast, ...beat.objects].join(', ') || 'environment only'} | ${environment.name}: ${environment.traits} | ${beat.editorNote ?? 'Quest order is editorially presented; exact date, route and location remain unknown.'} |\n`;
}
production += '\n## Visual, audio and human-review notes\n\nEvery scene has a repository-backed environment and every principal actor, represented group and pivotal recovery item is shown during its relevant beat. The research visual ledger records each prompt, ImageGen artifact, file, dimensions, SHA-256 hash, zone traits, reference edition and open side-by-side review. The map states form a relational story theater; they do not mark fictional world coordinates, assert a street route, or imply unsupported co-presence. The family-memory scene is explicitly illustrative.\n\n';
production += `${nodes.filter((node) => node.voiceover).length} transcript-matched AI narration tracks are included as repository MP3 assets; measured durations, audio hashes, transcript hashes, voice provenance and model disclosure are recorded by the shared voice workflow. Listening and pronunciation approval remain open. The transcript remains authoritative when audio or WebGL is unavailable.\n\n`;
production += 'Human gates: capture original Classic quest text/build; confirm the events, variants and completion order against the intended 1.12-era client; compare each generated environment and character/item model with the matching pre-Cataclysm Classic area/model; review all citations and paraphrases; audit the family memory as an interpretation; audition pronunciation; and approve claim status.\n\n';
production += `Related through-Wrath work remains in the [candidate slate](questline-story-candidates.md#21-the-wrathgate-and-the-battle-for-undercity). The later history is not used to expand the conclusion of this chain.\n`;
await write(`docs/research/${storyId}-production.md`, production);

process.stdout.write(`Authored ${nodes.length} illustrated Classic story nodes, ${usedEntityIds.length} represented subjects, ${environments.length} relational scenes and ${sources.length} source records.\n`);
