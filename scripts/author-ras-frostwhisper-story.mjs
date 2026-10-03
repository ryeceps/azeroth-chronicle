import { createHash } from 'node:crypto';
import { access, mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const eraId = 'age-of-adventurers';
const storyId = 'ras-frostwhisper-and-the-soulbound-keepsake';
const guideId = `${storyId}-guide`;
const worldspaceId = `${storyId}-theater`;
const artRoot = 'images/storylines/ras-frostwhisper';

const write = async (file, value) => {
  const full = path.join(root, file);
  await mkdir(path.dirname(full), { recursive: true });
  await writeFile(full, `${JSON.stringify(value, null, 2)}\n`);
};

const questSources = [
  ['5461', 'The Human, Ras Frostwhisper', 'https://www.wowhead.com/classic/quest=5461/the-human-ras-frostwhisper', 'Stromgarde is identified as Ras’s home; a keepsake from his human life is sought.'],
  ['5462', 'The Dying, Ras Frostwhisper', 'https://www.wowhead.com/classic/quest=5462/the-dying-ras-frostwhisper', 'The objective directs the seeker to Leonid at Light’s Hope; the quest text describes the Stratholme report as a rumor.'],
  ['5463', 'Menethil’s Gift · quest 5463', 'https://www.wowhead.com/classic/quest=5463/menethils-gift', 'Leonid’s first-person recollection names the ground and describes Ras’s self-offering and transformation. Secondary comments on this quest page place the sigil in Baron Rivendare’s room; compare that locator against the original client.'],
  ['5464', 'Menethil’s Gift · quest 5464', 'https://www.wowhead.com/classic/quest=5464/menethils-gift', 'The keepsake is transformed into a Soulbound Keepsake; Leonid predicts a link to Ras’s physical form.'],
  ['5465', 'Soulbound Keepsake', 'https://www.wowhead.com/classic/quest=5465/soulbound-keepsake', 'The objective returns the Soulbound Keepsake to Marduke, who will instruct the seeker in its use.'],
  ['5466', 'The Lich, Ras Frostwhisper', 'https://www.wowhead.com/classic/quest=5466/the-lich-ras-frostwhisper', 'The objective and completion text direct the seeker to use the keepsake, kill Ras after he becomes mortal, return his head, and receive Marduke’s claim about ten thousand souls.'],
].map(([questId, title, url, evidence]) => ({
  id: `${storyId}-quest-${questId}`,
  title: `Classic quest ${questId} · ${title}`,
  url,
  sourceType: 'quest',
  notes: `Accessed 2026-10-02. Secondary mirror of original World of Warcraft Classic quest text, not an original-client capture. ${evidence} Compare against the target Classic-era client/build before human review.`,
}));

const referenceSources = [
  {
    id: `${storyId}-quest-chain-locator`,
    title: 'Ras Frostwhisper Classic quest-chain locator',
    url: 'https://www.wowhead.com/classic/guide/ras-frostwhisper-questchain-classic-wow',
    sourceType: 'website',
    notes: 'Accessed 2026-10-02. Secondary chain and prerequisite locator. The Eva Sarkhoff/Spectral Essence quests are treated as gameplay access dependencies, not as additional historical events in this story.',
  },
  {
    id: `${storyId}-marduke-npc-locator`,
    title: 'Magistrate Marduke · Classic NPC locator',
    url: 'https://www.wowhead.com/classic/npc=11286/magistrate-marduke',
    sourceType: 'website',
    notes: 'Accessed 2026-10-02. Secondary Classic NPC locator for Marduke at Caer Darrow / the Scholomance approach. Historical comments report placement differences around patch 1.11; the research story uses the post-1.11 Classic quest context and avoids asserting an exact NPC coordinate.',
  },
  {
    id: `${storyId}-leonid-npc-locator`,
    title: 'Leonid Barthalomew the Revered · Classic NPC locator',
    url: 'https://www.wowhead.com/classic/npc=11036/leonid-barthalomew-the-revered',
    sourceType: 'website',
    notes: 'Accessed 2026-10-02. Secondary Classic NPC locator for Leonid in the Eastern Plaguelands. The named quest text, not the modern NPC summary, anchors the story’s claims.',
  },
  {
    id: `${storyId}-ras-npc-locator`,
    title: 'Ras Frostwhisper · Classic NPC locator',
    url: 'https://www.wowhead.com/classic/npc=10508/ras-frostwhisper',
    sourceType: 'website',
    notes: 'Accessed 2026-10-02. Secondary Classic locator and model reference for Ras in Scholomance. His quest portrayal as a lich and his temporary mortal state are anchored separately to quests 5463 and 5466.',
  },
  {
    id: `${storyId}-stromgarde-area-reference`,
    title: 'Stromgarde Keep · Classic in-game reference locator',
    url: 'https://www.wowhead.com/classic/de/quest=682/abzeichen-von-stromgarde',
    sourceType: 'website',
    notes: 'Accessed 2026-10-02. A Classic quest screenshot/gallery locator used only to check the ruined grey-stone keep and Arathi Highlands landscape language; no screenshot is bundled or copied.',
  },
  {
    id: `${storyId}-lights-hope-area-reference`,
    title: 'Light’s Hope Chapel · WoW Classic reference',
    url: 'https://news.blizzard.com/en-us/article/24171906/season-of-discovery-phase-7-naxxramas-now-live',
    sourceType: 'website',
    notes: 'Accessed 2026-10-02. Blizzard-published World of Warcraft Classic visual reference for the pre-Cataclysm timber chapel. Season of Discovery additions are outside this story; the image is used only to distinguish the old wooden structure from the later fortified stone site.',
  },
  {
    id: `${storyId}-stratholme-area-reference`,
    title: 'Stratholme · Classic Undead-side area locator',
    url: 'https://www.buffed.de/World-of-Warcraft-Spiel-42971/Guides/WoW-Classic-Stratholme-Rivendare-Guide-1334436/',
    sourceType: 'website',
    notes: 'Accessed 2026-10-02. Secondary Classic guide and in-game screenshot locator for Baron Rivendare’s Undead-side. The floor sigil’s association with Menethil’s Gift is treated as an area locator and remains subject to original-client capture.',
  },
  {
    id: `${storyId}-menethils-gift-area-reference`,
    title: 'Menethil’s Gift · Classic quest-page location comments',
    url: 'https://www.wowhead.com/classic/quest=5463/menethils-gift#comments',
    sourceType: 'website',
    notes: 'Accessed 2026-10-02. Secondary community comments on the Classic quest page identify the floor mark in Baron Rivendare’s room. This is only a location lead, not an original-client or build-verified placement.',
  },
  {
    id: `${storyId}-scholomance-area-reference`,
    title: 'Scholomance · Classic dungeon area locator',
    url: 'https://www.wowhead.com/classic/guide/scholomance-dungeon-strategy-wow-classic',
    sourceType: 'website',
    notes: 'Accessed 2026-10-02. Secondary Classic dungeon locator. The research story reuses the original Scholomance chamber environment illustration already reviewed for the Dungeon Set 2 story; exact-room and target-build comparison remain open.',
  },
];
const sources = [...questSources, ...referenceSources];
for (const source of sources) await write(`data/sources/${source.id}.research.json`, source);
const sourceUrlById = new Map(sources.map((source) => [source.id, source.url]));
const questSource = (questId) => `${storyId}-quest-${questId}`;

const environments = [
  {
    id: 'caer-darrow',
    name: 'Caer Darrow and the Scholomance approach',
    path: `${artRoot}/caer-darrow.research.webp`,
    gameTraits: 'The pre-Cataclysm Western Plaguelands island approach, low ruined cottages, grey water, bare trees and the Scholomance manor silhouette. The exact NPC spawn and island layout are not reconstructed.',
    sourceArtifact: 'exec-1ca59077-9d11-461a-ba1c-3f1411e9c4fd.png',
    referenceSourceIds: [`${storyId}-marduke-npc-locator`, `${storyId}-scholomance-area-reference`],
    prompt: 'Original painterly wide environment: the crooked lakeshore causeway and island estate at Caer Darrow, Scholomance as a weathered grey stone manor, dead trees, old gravestones, marsh grass and green-grey Plaguelands mist; no characters, exact route or NPC coordinate.',
  },
  {
    id: 'stromgarde-keep',
    name: 'Stromgarde Keep, Arathi Highlands',
    path: `${artRoot}/stromgarde-keep.research.webp`,
    gameTraits: 'Original Classic-era Arathi Highlands ruin language: weathered grey human masonry, broken keeps and arches, abandoned courtyards, dry grass and rocky hills. The Keepsake of Remembrance has a variable search location and is not pinned to one building.',
    sourceArtifact: 'exec-bf0dd335-baae-474c-8dbb-60edc7704a2f.png',
    referenceSourceIds: [`${storyId}-stromgarde-area-reference`],
    prompt: 'Original painterly wide environment: ruined Stromgarde Keep in Arathi Highlands, broken square human-stone fortification, modest tower, collapsed roofs, old bridge and arches, sparse dry grass and rocky green-brown highland; no snow, no desert, no fixed Keepsake spawn.',
  },
  {
    id: 'lights-hope-chapel',
    name: 'Light’s Hope Chapel, Eastern Plaguelands',
    path: `${artRoot}/lights-hope-chapel.research.webp`,
    gameTraits: 'The Classic-to-Wrath chapel is a small, weathered timber building with a steep dark reddish-brown roof on the Eastern Plaguelands slope; it is not the later expanded stone fortress. Sparse bare trees, muted Plaguelands earth and a modest encampment frame the chapel.',
    sourceArtifact: 'exec-4ef27c36-9f36-42ee-90a0-52da4a042684.png',
    referenceSourceIds: [`${storyId}-lights-hope-area-reference`, `${storyId}-leonid-npc-locator`],
    prompt: 'Original painterly wide environment for pre-Cataclysm Classic: Light’s Hope is a humble, weathered brown-timber chapel with a steep dark reddish-brown roof and slender simple wooden steeple, on a sparse Eastern Plaguelands hillside, bare trees, muted earth, grey-green haze and a few tents. Deliberately not the later stone fortress.',
  },
  {
    id: 'stratholme-menethils-gift',
    name: 'Stratholme Undead-side · Menethil’s Gift',
    path: `${artRoot}/stratholme-menethils-gift.research.webp`,
    gameTraits: 'Cold grey Lordaeron stone, low old-city Gothic arches and worn flagstones in Stratholme’s Undead-side. A restrained ground sigil marks Menethil’s Gift. The sigil’s reported placement in Baron Rivendare’s quarters is secondary and remains an in-client verification gate.',
    sourceArtifact: 'exec-808f5029-3b4b-45a3-980f-762f78dff9cb.png',
    referenceSourceIds: [`${storyId}-stratholme-area-reference`, questSource('5463')],
    prompt: 'Original painterly wide environment for pre-Cataclysm Classic Stratholme: an old Lordaeron stone hall, modest pointed arches, cold grey flagstone floor, one restrained reddish-violet summoning sigil, faint sickly-green shadow at the edges and a few aged amber sconces; no characters, bright neon magic or Scarlet Crusade decor.',
  },
  {
    id: 'scholomance-ras-chamber',
    name: 'Scholomance, Ras Frostwhisper’s chamber',
    path: 'images/storylines/dungeon-set-two/scholomance.research.webp',
    gameTraits: 'The existing Classic Scholomance illustration uses cold slate-blue necromantic stone, tombs, shelves and restrained green alchemical light. Its room composition is interpretive, not a dungeon map.',
    sourceArtifact: 'dungeon-set-two-visual-assets.json · scholomance asset record',
    referenceSourceIds: [`${storyId}-scholomance-area-reference`],
    prompt: 'Reused and provenance-linked to the Dungeon Set 2 Classic Scholomance environment illustration; no new image generation for this destination.',
  },
];

const casts = [
  { id: 'magistrate-marduke', name: 'Magistrate Marduke', type: 'character', path: `${artRoot}/magistrate-marduke.research.webp`, scale: 0.84, description: 'A ghostly magistrate of Caer Darrow who opens the quest inquiry and receives the outcome.' },
  { id: 'leonid-barthalomew-revered', name: 'Leonid Barthalomew the Revered', type: 'character', path: `${artRoot}/leonid-barthalomew.research.webp`, scale: 0.84, description: 'A Forsaken human and Argent Dawn ally whose quest account supplies the proposed history of Ras’s transformation.' },
  { id: 'ras-frostwhisper', name: 'Ras Frostwhisper', type: 'character', path: `${artRoot}/ras-frostwhisper-lich.research.webp`, scale: 0.9, description: 'The lich encountered in Scholomance.' },
  { id: 'ras-frostwhisper-human-memory', name: 'Ras Frostwhisper in Leonid’s memory', type: 'character', path: `${artRoot}/ras-frostwhisper-human.research.webp`, scale: 0.86, description: 'An appearance-specific depiction of the same Ras Frostwhisper before his death, shown only in Leonid’s recalled scene. It is not a second character record.' },
  { id: 'keepsake-of-remembrance', name: 'Keepsake of Remembrance', type: 'artifact', path: `${artRoot}/keepsake-of-remembrance.research.webp`, scale: 0.65, description: 'A visually unspecified token from Ras’s human life, represented symbolically as a small worn book. This is not a claim about its Classic item icon.' },
  { id: 'human-head-of-ras-frostwhisper', name: 'Human Head of Ras Frostwhisper', type: 'artifact', path: `${artRoot}/human-head-of-ras-frostwhisper.research.webp`, scale: 0.66, description: 'The quest objective returned to Marduke after Ras is made mortal and killed. The respectful wrapped image is symbolic and non-graphic.' },
];
const castById = new Map(casts.map((subject) => [subject.id, subject]));
const loc = (name) => `${storyId}-${name}`;
const locations = [
  { id: loc('caer-darrow'), name: 'Caer Darrow', envId: 'caer-darrow', sourceIds: [questSource('5461'), `${storyId}-marduke-npc-locator`] },
  { id: loc('stromgarde-keep'), name: 'Stromgarde Keep', envId: 'stromgarde-keep', sourceIds: [questSource('5461'), `${storyId}-stromgarde-area-reference`] },
  { id: loc('lights-hope-chapel'), name: 'Light’s Hope Chapel', envId: 'lights-hope-chapel', sourceIds: [questSource('5462'), `${storyId}-leonid-npc-locator`, `${storyId}-lights-hope-area-reference`] },
  { id: loc('stratholme-menethils-gift'), name: 'Menethil’s Gift', envId: 'stratholme-menethils-gift', sourceIds: [questSource('5463'), questSource('5464'), `${storyId}-stratholme-area-reference`, `${storyId}-menethils-gift-area-reference`] },
  { id: loc('scholomance'), name: 'Scholomance', envId: 'scholomance-ras-chamber', sourceIds: [questSource('5466'), `${storyId}-ras-npc-locator`, `${storyId}-scholomance-area-reference`] },
];
const locationById = new Map(locations.map((location) => [location.id, location]));

const beats = [
  {
    id: 'an-unseen-magistrate', title: 'An unseen magistrate', env: 'caer-darrow', location: 'caer-darrow', questIds: ['5461'], extraSources: [`${storyId}-quest-chain-locator`, `${storyId}-marduke-npc-locator`], cast: ['magistrate-marduke'], objects: [],
    narration: 'At Caer Darrow, a magistrate appears only to those who can see the dead. Marduke opens an inquiry into Ras Frostwhisper’s mortal years. A keepsake from Stromgarde, the ruined city he identifies as Ras’s home, may give that history a hold upon the present. The chain’s ghostly access rites are its threshold, not another chapter in Ras’s life. What such a token might restore is not yet known.',
    claim: 'Magistrate Marduke asks the seeker to recover a keepsake from Stromgarde, which he identifies as Ras Frostwhisper’s home, to support an attempt to return Ras to mortal form.',
  },
  {
    id: 'the-ruined-home', title: 'The ruined home', env: 'stromgarde-keep', location: 'stromgarde-keep', questIds: ['5461'], cast: [], objects: [],
    narration: 'Stromgarde’s broken stone holds the search. The quest names the keep as Ras’s home and asks for something that belonged to his human life. It does not identify a single room or hearth as the fixed find-site: the item is searched for among the ruins. The journey is an investigation through a fallen city, not a claim that Ras’s mortal story ended here.',
    claim: 'Quest 5461 identifies ruined Stromgarde as Ras Frostwhisper’s home and directs the seeker to search it for a keepsake from his mortal life; the exact find-location is not fixed by the quest text.',
  },
  {
    id: 'a-token-from-life', title: 'A token from life', env: 'stromgarde-keep', location: 'stromgarde-keep', questIds: ['5461'], cast: [], objects: ['keepsake-of-remembrance'],
    narration: 'A small possession survives where Ras’s human life once stood. Marduke calls it an opening: the keepsake may let the living make an artifact capable of reaching the lich. The object’s in-game appearance is not specified in the quest account, so the picture here is a symbolic token rather than a recovered item model. The seeker carries it from the ruins toward Light’s Hope.',
    claim: 'Quest 5461 makes a keepsake from Ras’s human years the required basis for attempting to create an artifact that can revert him to mortal form; it does not specify the keepsake’s physical appearance.',
  },
  {
    id: 'a-rumor-at-lights-hope', title: 'A rumor at Light’s Hope', env: 'lights-hope-chapel', location: 'lights-hope-chapel', questIds: ['5462'], extraSources: [`${storyId}-leonid-npc-locator`], cast: ['leonid-barthalomew-revered'], objects: ['keepsake-of-remembrance'],
    narration: 'The keepsake is brought to Leonid Barthalomew at Light’s Hope Chapel. Marduke’s next quest calls Stratholme the rumored place of Ras’s surrender, then directs the seeker to the old undead who may know more. A rumor has opened a path, but it has not yet become an established account. At this small timber refuge, the witness is asked to look upon the object and remember.',
    claim: 'Quest 5462 directs the seeker to bring the keepsake to Leonid at Light’s Hope and presents Stratholme as the rumored location of Ras’s fall to the Lich King.',
  },
  {
    id: 'leonids-memory', title: 'Leonid’s memory', env: 'stratholme-menethils-gift', location: 'stratholme-menethils-gift', questIds: ['5463'], cast: ['leonid-barthalomew-revered', 'ras-frostwhisper-human-memory'], objects: [],
    narration: 'Leonid now speaks as an eyewitness. In his account, Ras chose to pledge his soul to the Lich King and cut his own throat; his body fell within the marked ground. Leonid says the Lich King stood over the fallen mage, and Ras rose as a lich. The quest gives this scene to Leonid’s memory, not an independent narrator. His testimony turns the earlier rumor into a named witness account.',
    claim: 'In quest 5463, Leonid says he witnessed Ras pledge his soul to the Lich King, cut his throat, and become a lich as the Lich King stood over him at Menethil’s Gift.',
  },
  {
    id: 'a-name-for-the-ground', title: 'A name for the ground', env: 'lights-hope-chapel', location: 'lights-hope-chapel', questIds: ['5463'], extraSources: [`${storyId}-menethils-gift-area-reference`], cast: ['leonid-barthalomew-revered'], objects: ['keepsake-of-remembrance'],
    narration: 'Leonid names the place Menethil’s Gift. His explanation gives it a bitter meaning: ground the Lich King blessed, and the Scourge regards as holy. He sends the seeker back to Stratholme with the keepsake. Secondary quest-page comments place the floor sigil in Baron Rivendare’s quarters; that room locator remains unverified against the original client. The quest has turned a rumor into Leonid’s stated memory and a destination.',
    claim: 'Quest 5463 identifies Menethil’s Gift as ground blessed by the Lich King and regarded as holy by the Scourge, then directs the seeker to place the keepsake there; secondary quest-page comments locate its sigil in Baron Rivendare’s room.',
  },
  {
    id: 'the-soulbound-keepsake', title: 'The soulbound keepsake', env: 'stratholme-menethils-gift', location: 'stratholme-menethils-gift', questIds: ['5464'], extraSources: [`${storyId}-stratholme-area-reference`, `${storyId}-menethils-gift-area-reference`], cast: [], objects: ['keepsake-of-remembrance'],
    narration: 'At Menethil’s Gift, the keepsake is set upon the tainted ground. The quest records the change: a soul clings to what recalls its former life, and the object becomes a Soulbound Keepsake. No character is placed beside it in this scene; the transformation is an objective the seeker completes. The quest says what the object becomes, while its lasting effect on Ras remains untested.',
    claim: 'Quest 5464 says the soul of the fallen clings to an object representing its former life, transforming the keepsake into a Soulbound Keepsake; it does not establish that the binding lasts beyond the quest attempt.',
  },
  {
    id: 'leonid-explains-the-bond', title: 'Leonid explains the bond', env: 'lights-hope-chapel', location: 'lights-hope-chapel', questIds: ['5464'], extraSources: [`${storyId}-leonid-npc-locator`], cast: ['leonid-barthalomew-revered'], objects: ['keepsake-of-remembrance'],
    narration: 'The Soulbound Keepsake returns to Light’s Hope. Leonid says its bond to the fallen soul should also hold to Ras’s physical form. That is his explanation of how the attempt may work, delivered after the item changes. The next task sends the seeker back to Marduke; the chain provides no proof yet that Ras can be restored to life, or that the object can free him permanently.',
    claim: 'On quest 5464 completion, Leonid says the soul’s attachment to the keepsake should make it cling to Ras Frostwhisper’s physical form.',
  },
  {
    id: 'back-to-marduke', title: 'Back to Marduke', env: 'caer-darrow', location: 'caer-darrow', questIds: ['5465'], cast: ['magistrate-marduke'], objects: ['keepsake-of-remembrance'],
    narration: 'The transformed object returns to Caer Darrow. Marduke receives the Soulbound Keepsake and says he will instruct the seeker in its use. The surviving quest text does not preserve those instructions here, so the story takes its action from the next objective instead of supplying ritual details. The course is now set toward Scholomance and the lich whose mortal memory the object carries.',
    claim: 'Quest 5465 directs the seeker to return the Soulbound Keepsake to Magistrate Marduke, who is to instruct them in its use.',
  },
  {
    id: 'the-lich-in-scholomance', title: 'The lich in Scholomance', env: 'scholomance-ras-chamber', location: 'scholomance', questIds: ['5466'], extraSources: [`${storyId}-ras-npc-locator`], cast: ['ras-frostwhisper'], objects: ['keepsake-of-remembrance'],
    narration: 'The final quest sends the seeker into Scholomance to find Ras Frostwhisper. The old academy’s cold halls frame an encounter with the lich who once chose undeath. No traveling route is drawn across this scene: the dungeon is its own enclosed setting, and the illustration offers no measured floor plan. The keepsake is brought close enough to be used against Ras’s undead form.',
    claim: 'Quest 5466 directs the seeker to find Ras Frostwhisper in Scholomance and use the Soulbound Keepsake on his undead form.',
  },
  {
    id: 'mortal-again-for-a-moment', title: 'Mortal again for a moment', env: 'scholomance-ras-chamber', location: 'scholomance', questIds: ['5466'], cast: ['ras-frostwhisper-human-memory'], objects: ['keepsake-of-remembrance'],
    narration: 'The quest’s objective names the change it seeks: if the keepsake succeeds, Ras becomes mortal once more. The scene moves from the undead visage to a human one, enough for the quest’s next act to be carried out. This is a temporary state in an instance encounter, not evidence that Ras’s life is restored or that a lasting cure follows.',
    claim: 'Quest 5466 says use of the Soulbound Keepsake can revert Ras Frostwhisper to mortal form before he is slain; no permanent restoration is recorded.',
  },
  {
    id: 'the-head-returned', title: 'The head returned', env: 'scholomance-ras-chamber', location: 'scholomance', questIds: ['5466'], cast: [], objects: ['human-head-of-ras-frostwhisper'],
    narration: 'Marduke’s instruction is followed by a terrible condition: the mortal Ras must be struck down, and his head brought back. The returned object closes the quest objective; the narration leaves the violence restrained and the result bounded to what the game records. It gives no account of Ras’s spirit afterward, of a lasting freedom from the Scourge, or of other souls departing with him.',
    claim: 'Quest 5466 directs the seeker to kill Ras after the mortal transformation, recover his head, and return it to Marduke.',
  },
  {
    id: 'mardukes-accounting', title: 'Marduke’s accounting', env: 'caer-darrow', location: 'caer-darrow', questIds: ['5466'], cast: ['magistrate-marduke'], objects: ['human-head-of-ras-frostwhisper'],
    narration: 'At Caer Darrow, Marduke receives the head and declares that ten thousand restless souls have cried out with the blow dealt to the Scourge. His words measure the meaning he gives the deed; the number is not independently counted in the chain. The ending records a lich made mortal and killed, then a magistrate’s claim. It cannot tell us whether Ras’s own soul is free, or what history follows.',
    claim: 'On quest completion, Marduke attributes the deed to ten thousand restless souls and calls it a mortal blow to the Scourge; this is his claim, not an independently verified count or proof that the souls are freed.',
  },
];

const allSourceIds = [...new Set(beats.flatMap((beat) => [...beat.questIds.map(questSource), ...(beat.extraSources ?? [])]))];
const storySourceIds = [...new Set([...questSources.map((source) => source.id), ...referenceSources.map((source) => source.id)])];
const knownSourceIds = new Set(sources.map((source) => source.id));
if (allSourceIds.some((sourceId) => !knownSourceIds.has(sourceId))) throw new Error('A beat references a missing source record.');

for (const environment of environments) {
  await access(path.join(root, 'public', environment.path));
  const [bytes, info] = await Promise.all([readFile(path.join(root, 'public', environment.path)), stat(path.join(root, 'public', environment.path))]);
  await write(`data/map-states/${storyId}-${environment.id}-scene.research.json`, {
    id: `${storyId}-${environment.id}-scene`,
    name: `Ras Frostwhisper story: ${environment.name}`,
    worldspaceId,
    presentation: 'relational',
    terrainTextureAsset: environment.path,
    geometryIds: [],
    cartographyLabel: 'ILLUSTRATED QUESTLINE THEATER',
    interpretationNote: `Original or provenance-linked interpretive environment art for ${environment.name}. Recognizable Classic-through-Wrath traits: ${environment.gameTraits} It is not a surveyed map, exact dungeon plan, route, or proof of simultaneous character presence. Exact-build comparison remains open. See docs/research/ras-frostwhisper-visual-assets.json.`,
  });
  environment.byteLength = bytes.length;
  environment.modifiedAt = info.mtime.toISOString();
  environment.sha256 = createHash('sha256').update(bytes).digest('hex');
}

await write(`data/worldspaces/${worldspaceId}.research.json`, {
  id: worldspaceId,
  name: 'Ras Frostwhisper — relational story theater',
  slug: worldspaceId,
  coordinateSystem: { width: 10000, height: 10000, origin: 'bottom-left', units: 'atlas-units' },
});

for (const location of locations) {
  const environment = environments.find((item) => item.id === location.envId);
  await write(`data/entities/${location.id}.research.json`, {
    id: location.id,
    type: 'location',
    name: location.name,
    slug: location.id,
    shortDescription: `${location.name}, a Classic-era setting in the Ras Frostwhisper research story.`,
    body: `This location appears in the Classic quest sequence. ${environment.gameTraits} The scene is interpretive; the story-tour marker and theater staging assert no exact geographic coordinates.`,
    firstEraId: eraId,
    featuredEraIds: [eraId],
    sourceIds: [...new Set(location.sourceIds)],
    tags: ['ras-frostwhisper-story', 'classic-location'],
    contentStatus: 'research',
  });
}

const existingStoryPath = `data/stories/${storyId}.research.json`;
let existingVoiceByNode = new Map();
try {
  const existing = JSON.parse(await readFile(path.join(root, existingStoryPath), 'utf8'));
  existingVoiceByNode = new Map((existing.nodes ?? []).filter((node) => node.voiceover).map((node) => [node.id, { narration: node.narration, voiceover: node.voiceover }]));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

const nameByEntityId = new Map([...locations.map((item) => [item.id, item.name]), ...casts.map((item) => [item.id, item.name])]);
const relevantSources = (subjectId) => [...new Set(beats.filter((beat) => beat.cast.includes(subjectId) || beat.objects.includes(subjectId) || beat.location === subjectId).flatMap((beat) => [...beat.questIds.map(questSource), ...(beat.extraSources ?? [])]))];
const entityClaimIds = new Map(casts.map((subject) => [subject.id, []]));

for (const subject of casts) {
  await access(path.join(root, 'public', subject.path));
  await write(`data/entities/${subject.id}.research.json`, {
    id: subject.id,
    type: subject.type,
    name: subject.name,
    slug: subject.id,
    shortDescription: `${subject.name}, represented in the Ras Frostwhisper research story.`,
    body: `${subject.description} The image is an original interpretive illustration, not canonical game art or proof of exact costume, body, location, or simultaneous presence. ${subject.id === 'ras-frostwhisper-human-memory' ? 'This scene-specific appearance record refers to the same character as Ras Frostwhisper; it is not a separate person.' : ''} See docs/research/ras-frostwhisper-production.md and docs/research/ras-frostwhisper-visual-assets.json.`,
    firstEraId: eraId,
    featuredEraIds: [eraId],
    sourceIds: relevantSources(subject.id),
    claimIds: entityClaimIds.get(subject.id),
    tags: ['ras-frostwhisper-story', 'interpretive-art'],
    ...(subject.type === 'character'
      ? { mapFigure: { asset: subject.path, scale: subject.scale } }
      : { mapVisual: { asset: subject.path, scale: subject.scale } }),
    contentStatus: 'research',
  });
}

const adjacency = new Map([...nameByEntityId.keys()].map((id) => [id, new Set()]));
for (const beat of beats) {
  const subjects = [...beat.cast, ...beat.objects];
  for (const id of subjects) for (const other of subjects) if (id !== other) adjacency.get(id)?.add(other);
}
const slots = new Map();
for (const id of adjacency.keys()) {
  const occupied = new Set([...adjacency.get(id)].map((other) => slots.get(other)).filter((slot) => slot !== undefined));
  let slot = 0;
  while (occupied.has(slot)) slot++;
  slots.set(id, slot);
}
const maxSlot = Math.max(...slots.values());
const features = [];
for (const id of adjacency.keys()) {
  const x = 3300 + slots.get(id) * 3400 / Math.max(1, maxSlot);
  const geometryId = `${storyId}-${id}-focus`;
  const subjectSources = relevantSources(id);
  features.push({
    type: 'Feature',
    id: geometryId,
    properties: { name: `${nameByEntityId.get(id)} editorial focus`, contentStatus: 'research', styleRole: 'site', geographicCertainty: 'unknown' },
    geometry: { type: 'Point', coordinates: [x, 5500] },
  });
  await write(`data/spatial-states/${storyId}-${id}.research.json`, {
    id: `${storyId}-${id}-theater`, entityId: id, eraId, worldspaceId, geometryId,
    placementKind: 'relational', geographicCertainty: 'unknown', sourceIds: subjectSources,
    editorNote: 'Editorial figure/object placement inside an illustrated story theater. It conveys no real map coordinate, route, literal formation or unsupported simultaneous presence.',
    visualPresence: 'contextual', labelPriority: 240,
  });
}
await write(`data/geometry/${storyId}-theater.research.geojson`, { type: 'FeatureCollection', features });

const nodes = [];
for (const [index, beat] of beats.entries()) {
  const nodeId = `${storyId}-story-${beat.id}`;
  const eventId = `${storyId}-${beat.id}-event`;
  const claimId = `${storyId}-${beat.id}-claim`;
  const citationIds = [];
  const citationSourceIds = [...new Set([...beat.questIds.map(questSource), ...(beat.extraSources ?? [])])];
  for (const [sourceIndex, sourceId] of citationSourceIds.entries()) {
    const questMatch = sourceId.match(/quest-(\d{4})$/);
    const citationId = `${storyId}-${beat.id}-citation-${sourceIndex + 1}`;
    citationIds.push(citationId);
    await write(`data/citations/${citationId}.research.json`, {
      id: citationId,
      sourceId,
      ...(questMatch ? { questId: questMatch[1] } : {}),
      section: questMatch ? `Classic quest ${questMatch[1]} · relevant objective, description, completion or chain entry` : 'Classic NPC, chain or area locator · relevant section',
      note: 'Original paraphrase anchored to a secondary Classic transcript/locator. Verify against the intended original client and patch/build before human approval.',
    });
  }
  await write(`data/claims/${claimId}.research.json`, {
    id: claimId,
    subjectId: eventId,
    predicate: 'classic_quest_story_scene',
    value: beat.claim,
    citationIds,
    confidence: 'strongly_supported',
    status: 'active',
    editorNote: 'Source text is a secondary reproduction of original in-game quest content. The account, rumor, exact location, or Marduke’s closing claim is attributed to the named speaker where applicable; no exact date or unsupported causal link is inferred.',
  });
  for (const subjectId of [...beat.cast, ...beat.objects]) entityClaimIds.get(subjectId)?.push(claimId);
  const location = locationById.get(loc(beat.location));
  const participantIds = [...beat.cast, ...beat.objects];
  await write(`data/events/${eventId}.research.json`, {
    id: eventId,
    kind: 'event',
    name: beat.title,
    slug: eventId,
    eraId,
    worldspaceId: 'azeroth',
    date: { precision: 'unknown', label: 'Classic quest sequence; in-world date unknown' },
    summary: beat.claim,
    description: beat.narration,
    locationIds: [location.id],
    participantEntityIds: participantIds,
    sourceIds: citationSourceIds,
    claimIds: [claimId],
    contentStatus: 'research',
  });
  nodes.push({
    id: nodeId,
    guideId,
    title: beat.title,
    narration: beat.narration,
    durationMs: Math.round((beat.narration.split(/\s+/).length / 82) * 60000 + 5000),
    eventIds: [eventId],
    entityIds: participantIds,
    locationIds: [location.id],
    camera: { position: [0, 6.1, 5.2], target: [0, 0, 0], durationMs: 1100 },
    visualActions: [{ type: 'set_map_state', mapStateId: `${storyId}-${beat.env}-scene` }],
    ...(index > 0 ? { previousNodeId: `${storyId}-story-${beats[index - 1].id}` } : {}),
    ...(index < beats.length - 1 ? { nextNodeIds: [`${storyId}-story-${beats[index + 1].id}`] } : {}),
    ...(existingVoiceByNode.get(nodeId)?.narration === beat.narration ? { voiceover: existingVoiceByNode.get(nodeId).voiceover } : {}),
  });
}

for (const [subjectId, claimIds] of entityClaimIds) {
  const entityPath = `data/entities/${subjectId}.research.json`;
  const entity = JSON.parse(await readFile(path.join(root, entityPath), 'utf8'));
  entity.claimIds = [...new Set(claimIds)];
  await write(entityPath, entity);
}

const storyPath = `data/stories/${storyId}.research.json`;
const story = {
  guide: {
    id: guideId,
    eraId,
    title: 'Ras Frostwhisper: a lich’s mortality',
    description: 'Thirteen illustrated Classic research scenes trace Marduke’s keepsake search, Leonid’s account of Ras’s death, and the bounded attempt to make the Scholomance lich mortal.',
    nodeIds: nodes.map((node) => node.id),
    contentStatus: 'research',
  },
  nodes,
};
await write(storyPath, story);

await write(`data/storylines/${storyId}.research.json`, {
  id: storyId,
  slug: storyId,
  title: 'Ras Frostwhisper: a lich’s mortality',
  summary: 'A magistrate seeks a relic of Ras Frostwhisper’s mortal life. Stromgarde, Light’s Hope, Stratholme and Scholomance lead to Leonid’s account and an attempt to bind the lich to his former self.',
  opening: 'The ruined city gives up a small remnant; an old witness gives it a history. Through the clasp of a keepsake, the story asks what mortality can still mean to a lich—and what the Classic quest actually records when it is tested.',
  primaryEraId: eraId,
  eraIds: [eraId],
  chapters: [
    { id: 'the-mortal-search', eraId, title: 'A remnant of mortal life', body: 'Marduke’s request leads from Caer Darrow into Stromgarde, then to Leonid at Light’s Hope. The Spectral Essence prerequisites are access mechanics rather than added history.' },
    { id: 'the-witness-and-the-ground', eraId, title: 'A witness and a tainted ground', body: 'Leonid recounts Ras’s death at Menethil’s Gift. His testimony is identified as a witness account; the quest’s claim about Ras’s transformation is not expanded into later lore.' },
    { id: 'a-mortal-moment', eraId, title: 'The lich and the keepsake', body: 'The keepsake is used against Ras in Scholomance. The chain records a return to mortal form, Ras’s death, and Marduke’s closing interpretation; it does not confirm that Ras’s soul is freed or that the transformation lasts.' },
  ],
  sourceIds: storySourceIds,
  storyGuideId: guideId,
  showInEraTourOffshoots: false,
  reviewNote: 'Complete illustrated research story with 13 original transcript scenes, a claim/citation record per beat, Classic-region environments, distinct representations for Marduke, Leonid, Ras’s lich and recalled human states, and the keepsake and final quest object. It belongs to the Classic-to-Wrath StoryTour and remains outside the EraTour. Quest text comes from secondary Classic mirrors; original-client/build comparison, the Stratholme sigil-room locator, lore/citation approval, all environment/figure resemblance comparisons, and voice audition remain open. Ras’s post-quest spirit and the fate of the “ten thousand” souls are not supplied.',
  contentStatus: 'research',
});

const tourPath = 'data/story-tours/classic-to-wrath.research.json';
const tour = JSON.parse(await readFile(path.join(root, tourPath), 'utf8'));
if (!tour.entries.some((entry) => entry.storylineId === storyId)) {
  for (const entry of tour.entries) if (entry.order >= 10) entry.order++;
  tour.entries.push({
    storylineId: storyId,
    regionIds: ['eastern-kingdoms'],
    mapPositionPercent: [74, 43],
    order: 10,
    periodLabel: 'Original World of Warcraft · Classic quest chain',
    locationLabel: 'Stromgarde · Light’s Hope · Stratholme · Scholomance',
  });
}
tour.entries.sort((a, b) => a.order - b.order);
tour.chronologyNote = tour.chronologyNote.replace(
  'then the Scythe of Elune investigations), The Burning Crusade',
  'then the Scythe of Elune investigations and Ras Frostwhisper’s Classic quest sequence), The Burning Crusade',
);
const chronologyAddition = 'Ras Frostwhisper is placed after Yeh’kinya and before the Burning Crusade stories as an editorial Classic-era playlist position; its exact in-world date and any causal link to those stories are unknown.';
tour.chronologyNote = tour.chronologyNote.replaceAll(chronologyAddition, '').trim();
tour.chronologyNote += ` ${chronologyAddition}`;
tour.reviewNote = 'Research StoryTour collection with 16 map placards, 15 playable research StoryGuides and one research preview. Play All follows the explicit editorial order and skips the preview. Story-tour map markers are navigational layout positions rather than exact locations; each storyline remains research until its human review gates are complete.';
await write(tourPath, tour);

const artSubjects = await Promise.all(casts.map(async (subject) => {
  const bytes = await readFile(path.join(root, 'public', subject.path));
  return {
    id: subject.id,
    kind: subject.type,
    file: `public/${subject.path}`,
    representedBy: subject.name,
    pixelWidth: 512,
    pixelHeight: 512,
    sourceArtifact: 'exec-715494f2-4afa-4b17-8171-149854d3ef41.png; cropped from its dedicated contact-sheet cell',
    targetEditionBuild: 'Original World of Warcraft Classic identity; exact 1.12/2.4.3/3.3.5 model comparison remains open.',
    generationPrompt: subject.description,
    generator: 'OpenAI ImageGen; transparent contact-sheet cutout cropped to lossless WebP.',
    transparency: true,
    visualReview: 'The subject is distinct and readable in its authored story scenes. Exact in-client model/costume review remains open.',
    sourceReferences: relevantSources(subject.id).map((sourceId) => ({ sourceId, url: sourceUrlById.get(sourceId) })),
    byteLength: bytes.length,
    sha256: createHash('sha256').update(bytes).digest('hex'),
  };
}));
const environmentAssets = [];
for (const environment of environments) {
  const bytes = await readFile(path.join(root, 'public', environment.path));
  environmentAssets.push({
    id: environment.id,
    kind: 'environment',
    file: `public/${environment.path}`,
    area: environment.name,
    pixelWidth: environment.id === 'scholomance-ras-chamber' ? 768 : 1536,
    pixelHeight: environment.id === 'scholomance-ras-chamber' ? 512 : 1024,
    sourceArtifact: environment.sourceArtifact,
    targetEditionBuild: environment.id === 'scholomance-ras-chamber' ? 'Original World of Warcraft Classic / Vanilla area identity; exact client comparison remains open.' : 'Original World of Warcraft Classic 1.12, Burning Crusade 2.4.3 and Wrath 3.3.5 pre-Cataclysm geography; exact build comparison remains open.',
    recognizableTraits: environment.gameTraits,
    generationPrompt: environment.prompt,
    generator: environment.id === 'scholomance-ras-chamber' ? 'Reused and provenance-linked Classic environment art from Dungeon Set 2.' : 'OpenAI ImageGen; original environment, encoded as high-quality WebP.',
    transparency: false,
    visualReview: 'Checked against the stated Classic-era area palette and available in-game area references. Human side-by-side comparison with the exact 1.12 / 2.4.3 / 3.3.5 area remains open.',
    referenceUrls: environment.referenceSourceIds.map((sourceId) => ({ sourceId, url: sourceUrlById.get(sourceId) })),
    byteLength: bytes.length,
    sha256: createHash('sha256').update(bytes).digest('hex'),
  });
}

const sceneLedger = beats.map((beat, index) => {
  const environment = environments.find((item) => item.id === beat.env);
  const location = locationById.get(loc(beat.location));
  return {
    nodeId: nodes[index].id,
    title: beat.title,
    environmentPath: `public/${environment.path}`,
    gameArea: location.name,
    referenceEditionBuild: 'Classic Era 1.12 and the pre-Cataclysm version shown through TBC 2.4.3 / Wrath 3.3.5. Patch/client comparison remains open.',
    recognizableTraits: environment.gameTraits,
    visualReview: 'Original or provenance-linked area art, wired to this StoryNode through its validated MapState. Human screenshot comparison against the exact game build remains open.',
    cast: beat.cast.map((id) => ({ id, name: castById.get(id).name, image: `public/${castById.get(id).path}` })),
    objects: beat.objects.map((id) => ({ id, name: castById.get(id).name, image: `public/${castById.get(id).path}` })),
    chronologyNote: beat.id === 'leonids-memory' ? 'Flashback to the earlier Stratholme scene, as recalled by Leonid; it is not an independently narrated eyewitness recording.' : 'The present-day investigation follows Classic quest dependency order. Order does not assert exact event dates or a causal link between separate historical acts.',
    claimIds: [`${storyId}-${beat.id}-claim`],
    citationIds: [...new Set([...beat.questIds.map(questSource), ...(beat.extraSources ?? [])])].map((_, citationIndex) => `${storyId}-${beat.id}-citation-${citationIndex + 1}`),
  };
});

await write('docs/research/ras-frostwhisper-visual-assets.json', {
  storyId,
  status: 'research',
  targetEditionBuild: 'Classic Era 1.12 / Burning Crusade 2.4.3 / Wrath 3.3.5 pre-Cataclysm old-world state. No exact original-client capture is claimed.',
  editorialRule: 'Use the old-world Classic-through-Wrath area palette and recognizable local architecture; keep story staging relational and separate from surveyed geography. Where versions change a site, identify the relevant build and avoid later Cataclysm redesigns.',
  sourceProvenance: 'Four new wide environments were generated for Caer Darrow, Stromgarde, Light’s Hope and Stratholme; five actor/object cutouts were generated as a transparent contact sheet and cropped to independent lossless WebP assets. The Classic Scholomance chamber environment is reused from the Dungeon Set 2 story and referenced in place.',
  assetRecords: [...environmentAssets, ...artSubjects],
  sceneLedger,
});

const totalWords = nodes.reduce((sum, node) => sum + node.narration.split(/\s+/).length, 0);
let ledger = '# Ras Frostwhisper: a lich’s mortality — production and claim ledger\n\n';
ledger += `Status: complete illustrated research story; not reviewed or published. ${nodes.length} scenes; ${totalWords} narration words. Primary era: Era 8 / Classic quest sequence. Exact in-world dates remain unknown.\n\n`;
ledger += '## Evidence boundary and chronology\n\n';
ledger += 'The six linked quest-text records are Classic quests 5461–5466. Accessible quest prose is preserved on secondary Classic database mirrors; original-client capture and exact patch/build comparison remain open. Quest 5462 introduces Stratholme as rumor; quest 5463 attributes the death account to Leonid’s memory. Quest 5464 records the keepsake transformation, quest 5465 returns it to Marduke, and quest 5466 records the mortal-form objective, killing, returned head and Marduke’s closing statement. The Eva Sarkhoff quest sequence and Spectral Essence are gameplay prerequisites to seeing Marduke; they are excluded from the historical scene order. No exact event date or unsupported between-story causal link is asserted.\n\n';
ledger += `Sources: ${sources.map((source) => `[${source.id}](${source.url})`).join('; ')}.\n\n`;
ledger += '## Beat and claim ledger\n\n| Scene | Quest evidence and citations | Claim boundary | Cast / objects | Area and resemblance traits | Story order / geography |\n| --- | --- | --- | --- | --- | --- |\n';
for (const [index, beat] of beats.entries()) {
  const ids = [...new Set([...beat.questIds.map(questSource), ...(beat.extraSources ?? [])])];
  const citationIds = ids.map((_, sourceIndex) => `${storyId}-${beat.id}-citation-${sourceIndex + 1}`);
  const environment = environments.find((item) => item.id === beat.env);
  const castNames = [...beat.cast, ...beat.objects].map((id) => castById.get(id).name).join(', ');
  const boundary = beat.id === 'leonids-memory' ? 'Leonid’s own eyewitness account; no omniscient corroboration.' : beat.id === 'mardukes-accounting' ? 'Marduke’s claim; no independent soul count or proof of liberation.' : beat.id === 'the-soulbound-keepsake' ? 'The transformation is separated from Leonid’s later explanation; permanence is unknown.' : beat.id === 'a-name-for-the-ground' ? 'Quest-stated holiness; exact Baron-room locator is secondary.' : 'Quest text paraphrase; exact date and any unsourced causal edge remain unknown.';
  ledger += `| ${nodes[index].title} | ${beat.questIds.map((id) => `Quest ${id}`).join('; ')} · ${ids.join(', ')} · ${citationIds.join(', ')} | ${boundary} | ${castNames} | ${environment.name} · ${environment.gameTraits} | Editorial quest order; relational illustration, no exact map coordinate. |\n`;
}
ledger += '\n## Playable dependency versus history\n\n';
ledger += 'Playable dependency: the Eva Sarkhoff / Spectral Essence prerequisite makes Marduke visible; The Human, Ras Frostwhisper (5461) → The Dying, Ras Frostwhisper (5462) → Menethil’s Gift (5463) → Menethil’s Gift (5464) → Soulbound Keepsake (5465) → The Lich, Ras Frostwhisper (5466). The predecessor chain is quest order. Leonid’s account is a memory of an earlier Stratholme event. The keepsake’s spell effect and the temporary mortal target are quest mechanics, not evidence that Ras lives again. Marduke’s completion message is attributed rather than treated as a verified soul count.\n\n';
ledger += '## Visual, audio and review notes\n\n';
ledger += 'Each node loads a recognizable environment image and the relevant actor/object art through its MapState and contextual figures. Stromgarde remains a broken Arathi stone keep with a non-fixed Keepsake search area. Light’s Hope is the small timber pre-Cataclysm chapel, not the later stone expansion. Stratholme uses the Undead-side Gothic stone vocabulary and a subdued sigil; the Baron-room placement remains secondary. Scholomance reuses the established Classic chamber illustration. Full paths, prompts, reference locators, hashes and scene-by-scene traits are in [ras-frostwhisper-visual-assets.json](ras-frostwhisper-visual-assets.json). Human comparison against exact client builds remains an open gate.\n\n';
ledger += 'This StoryGuide is added as a Classic-to-Wrath StoryTour placard after Yeh’kinya and before the Burning Crusade stories. It is excluded from EraTour; Play All reuses its standalone nodes. Transcript-matched AI narration is generated after transcript review and retains the existing repository voice-manifest provenance. Remaining human gates: original-client quest/dialogue/build capture; citation, viewpoint and chronology review; side-by-side environment and model resemblance review; and pronunciation/audio audition. Every record remains `contentStatus: research`.\n';
await write('docs/research/ras-frostwhisper-production.md', ledger);

const expectedStoryRecords = {
  events: new Set(beats.map((beat) => `${storyId}-${beat.id}-event`)),
  claims: new Set(beats.map((beat) => `${storyId}-${beat.id}-claim`)),
  citations: new Set(beats.flatMap((beat) => [...new Set([...beat.questIds.map(questSource), ...(beat.extraSources ?? [])])].map((_, index) => `${storyId}-${beat.id}-citation-${index + 1}`))),
};
for (const [folder, expectedIds] of Object.entries(expectedStoryRecords)) {
  for (const file of await readdir(path.join(root, 'data', folder))) {
    if (!file.startsWith(`${storyId}-`) || !file.endsWith('.research.json')) continue;
    if (!expectedIds.has(file.slice(0, -'.research.json'.length))) await rm(path.join(root, 'data', folder, file));
  }
}

const candidatePath = 'docs/research/questline-story-candidates.md';
let candidates = await readFile(path.join(root, candidatePath), 'utf8');
candidates = candidates.replace(/^\*\*Implementation \(2026-10-02\):\*\* Complete (?:twelve|thirteen)-scene.*\r?\n/gm, '');
candidates = candidates.replace(/\r?\n(?:[ \t]*\r?\n){2,}/g, '\n\n');
candidates = candidates.replace(
  /^(### 11\. Ras Frostwhisper: a lich's mortality)\r?\n([\s\S]*?)(?=^## The Burning Crusade|^### 12\.)/m,
  (_match, heading, body) => {
    let updated = body.replace('The Human, Ras Frostwhisper; The Dying; The Bound; The Lich, Ras Frostwhisper.', 'The Human, Ras Frostwhisper (5461); The Dying, Ras Frostwhisper (5462); Menethil’s Gift (5463–5464); Soulbound Keepsake (5465); The Lich, Ras Frostwhisper (5466).');
    updated = updated.replace(/^\*\*Story spine:\*\*.*$/m, '**Story spine:** Marduke’s keepsake investigation → Leonid’s witness account of Ras’s self-offering at Menethil’s Gift → the item becomes soulbound → Marduke’s instruction → the mortal-form objective in Scholomance → a bounded quest-completion claim. Separate the Eva Sarkhoff/Spectral Essence visibility dependency from historical events; keep Leonid’s account attributed; do not claim a lasting cure or liberated souls.');
    updated = updated.replace('[original quest-chain locator](https://warcraft.wiki.gg/wiki/Ras_Frostwhisper_quest_chain)', '[Classic quest-chain locator](https://www.wowhead.com/classic/guide/ras-frostwhisper-questchain-classic-wow)');
    updated = updated.replace(/^\*\*Source:\*\*.*$/m, '**Source:** [Classic quest-chain locator](https://www.wowhead.com/classic/guide/ras-frostwhisper-questchain-classic-wow). Secondary quest mirrors are locators, not primary citation authority.');
    updated = updated.replace(/^\*\*Gate:\*\*.*$/m, '**Gate:** Compare the six Classic quest texts and NPC/area states against the target client/build; verify the reported Baron-room sigil and keep every account at its named speaker’s confidence. Keep post-Cataclysm Scholomance and Light’s Hope redesigns outside the visual reference.');
    updated = updated.replace(/^\*\*Implementation.*$/gm, '');
    return `${heading}\n\n${updated.trim()}\n\n**Implementation (2026-10-02):** Complete thirteen-scene illustrated research StoryGuide, with source/claim/citation records, Classic-through-Wrath area scenes, distinct Marduke/Leonid/Ras art and the keepsake/final object illustrations. Added to the Classic-to-Wrath StoryTour after Yeh’kinya and before Karazhan; not inserted into EraTour. Original-client quest/build comparison, exact-room verification, human lore/art review and audio audition remain open. See the [production ledger](ras-frostwhisper-production.md) and [visual asset ledger](ras-frostwhisper-visual-assets.json).\n\n`;
  },
);
await writeFile(path.join(root, candidatePath), candidates);

process.stdout.write(`Authored ${nodes.length} illustrated nodes, ${casts.length} actor/object figures, ${locations.length} locations and ${environments.length} area states.\n`);
