import { createHash } from 'node:crypto';
import { access, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const storyId = 'cipher-of-damnation-oronok';
const guideId = `${storyId}-guide`;
const eraId = 'age-of-adventurers';
const worldspaceId = 'cipher-story-theater';
const imageDir = 'images/storylines/cipher-of-damnation';
const out = async (file, value) => {
  const full = path.join(root, file);
  await mkdir(path.dirname(full), { recursive: true });
  await writeFile(full, `${JSON.stringify(value, null, 2)}\n`);
};
const unique = (values) => [...new Set(values)];

const sourceRows = [
  ['cipher-blizzard-chain-guide', 'Get Attuned and Face the Overlords of Outland', 'https://news.blizzard.com/en-us/article/23716331/get-attuned-and-face-the-overlords-of-outland', 'website', 'Blizzard’s TBC Classic article lists the Cipher quest chain in order and distinguishes the subsequent level-70 Trial of the Naaru path. Primary sequence locator; compare quest wording to the original TBC build before human review.'],
  ['cipher-chain-secondary-index', 'The Cipher of Damnation quest chain', 'https://warcraft.wiki.gg/wiki/The_Cipher_of_Damnation_quest_chain', 'website', 'Secondary discovery index for separate Grom’tor, Ar’tor, and Borak fragment branches. Used as a locator only; never treated as primary evidence for an unquoted detail or historical causal link.'],
  ['cipher-hand-quest', 'The Hand of Gul’dan · TBC quest text locator', 'https://www.wowhead.com/tbc/quest=10680/the-hand-of-guldan', 'quest', 'TBC Classic quest-text locator. The order variant has faction-specific starting quest records; this story describes the shared Earth Ring request without claiming one faction’s NPC as universal. Original-client comparison remains open.'],
  ['cipher-fire-earth-spirits-quest', 'Enraged Spirits of Fire and Earth', 'https://www.wowhead.com/tbc/quest=10458/enraged-spirits-of-fire-and-earth', 'quest', 'TBC Classic quest-text locator for capturing fire and earth souls near the Hand of Gul’dan. The task is paraphrased; original-client comparison remains open.'],
  ['cipher-water-spirits-quest', 'Enraged Spirits of Water', 'https://www.wowhead.com/tbc/quest=10480/enraged-spirits-of-water', 'quest', 'TBC Classic quest-text locator places the water spirits around Coilskar and identifies Illidari naga control of Shadowmoon’s clean water. The task is paraphrased; original-client comparison remains open.'],
  ['cipher-air-spirits-quest', 'Enraged Spirits of Air', 'https://www.wowhead.com/tbc/quest=10481/enraged-spirits-of-air', 'quest', 'TBC Classic quest-text locator places the air spirits at the Netherwing Fields. The task is paraphrased; original-client comparison remains open.'],
  ['cipher-oronok-intro-quest', 'Oronok Torn-heart', 'https://www.wowhead.com/tbc/quest=10513/oronok-torn-heart', 'quest', 'TBC Classic quest-text locator for meeting Oronok and his test before he tells the Cipher story. Original-client comparison remains open.'],
  ['cipher-oronok-tubers-quest', 'I Was A Lot Of Things…', 'https://www.wowhead.com/tbc/quest=10514/i-was-a-lot-of-things', 'quest', 'TBC Classic quest-text locator for Oronok, the Shadowmoon tubers, and his trained felboars. Original-client comparison remains open.'],
  ['cipher-lesson-learned-quest', 'A Lesson Learned', 'https://www.wowhead.com/tbc/quest=10515/a-lesson-learned', 'quest', 'TBC Classic quest-text locator for destroying Ravenous Flayer eggs after flayers attack Oronok’s boars. Original-client comparison remains open.'],
  ['cipher-oronok-truth-quest', 'The Cipher of Damnation — Truth and History', 'https://www.wowhead.com/tbc/quest=10519/the-cipher-of-damnation-truth-and-history', 'quest', 'TBC Classic quest-text locator for Oronok’s account. His explanation of Gul’dan and the severing of orcs from elemental ties is presented as his attributed testimony. Original-client comparison remains open.'],
  ['cipher-gromtor-quest', 'Grom’tor, Son of Oronok', 'https://warcraft.wiki.gg/wiki/Grom%27tor%2C_Son_of_Oronok_(quest)', 'quest', 'Secondary quest-text locator for meeting Grom’tor and learning the first-fragment lead. Original-client comparison remains open.'],
  ['cipher-gromtor-fragment-quest', 'The First Fragment Recovered', 'https://warcraft.wiki.gg/wiki/The_Cipher_of_Damnation_-_The_First_Fragment_Recovered', 'quest', 'Secondary quest-text locator for Grom’tor returning the first fragment to Oronok. Original-client comparison remains open.'],
  ['cipher-gromtor-charge-quest', 'The Cipher of Damnation — Grom’tor’s Charge', 'https://www.wowhead.com/tbc/quest=10522/the-cipher-of-damnation-gromtors-charge', 'quest', 'TBC Classic quest-text locator for Grom’tor’s interrogation and first-fragment search. Original-client comparison remains open.'],
  ['cipher-artor-quest', 'Ar’tor, Son of Oronok', 'https://warcraft.wiki.gg/wiki/Ar%27tor,_Son_of_Oronok_(quest)', 'quest', 'Secondary quest-text locator identifies Ar’tor’s body at Illidari Point but supplies no time of death. That uncertainty is preserved. Original-client comparison remains open.'],
  ['cipher-artor-crystal-prisons-quest', 'Demonic Crystal Prisons', 'https://warcraft.wiki.gg/wiki/Demonic_Crystal_Prisons', 'quest', 'Secondary quest-text locator for the demonic crystals suspending Ar’tor and Painmistress Gabrissa’s key. Original-client comparison remains open.'],
  ['cipher-artor-charge-quest', 'The Cipher of Damnation — Ar’tor’s Charge', 'https://warcraft.wiki.gg/wiki/The_Cipher_of_Damnation_-_Ar%27tor%27s_Charge', 'quest', 'Secondary quest-text locator for Ar’tor’s spirit guiding the fragment recovery and passing a piece of his spirit before fading. Original-client comparison remains open.'],
  ['cipher-artor-bow-quest', 'Lohn’goron, Bow of the Torn-heart', 'https://www.wowhead.com/tbc/quest=10537/lohngoron-bow-of-the-torn-heart', 'quest', 'TBC Classic quest-text locator identifies Lohn’goron as an heirloom Ar’tor asks the adventurer to recover from demons. Original-client comparison remains open.'],
  ['cipher-artor-fragment-quest', 'The Second Fragment Recovered', 'https://www.wowhead.com/tbc/quest=10541/the-cipher-of-damnation-the-second-fragment-recovered', 'quest', 'TBC Classic quest-text locator for the second fragment’s recovery and Ar’tor’s fading. Original-client comparison remains open.'],
  ['cipher-borak-quest', 'Borak, Son of Oronok', 'https://warcraft.wiki.gg/wiki/Borak,_Son_of_Oronok_(quest)', 'quest', 'Secondary quest-text locator for Borak’s history as a scholar and later assassin, his surveillance, and the envoy lead. Original-client comparison remains open.'],
  ['cipher-thistleheads-quest', 'Of Thistleheads and Eggs…', 'https://warcraft.wiki.gg/wiki/Of_Thistleheads_and_Eggs...', 'quest', 'Secondary quest-text locator for the bloodthistle distraction involving the Thistleheads. Original-client comparison remains open.'],
  ['cipher-tobias-egg-trade-quest', 'The Bundle of Bloodthistle', 'https://www.wowhead.com/tbc/quest=10550/the-bundle-of-bloodthistle', 'quest', 'TBC Classic quest-text locator for trading an Arakkoa egg through Tobias for a bundle of bloodthistle and taking it back to Borak. Original-client comparison remains open.'],
  ['cipher-thistlehead-trap-quest', 'To Catch a Thistlehead', 'https://www.wowhead.com/tbc/quest=10570/to-catch-a-thistlehead', 'quest', 'TBC Classic quest-text locator for placing bloodthistle as a trap, separating Icarius from his bodyguard, killing the envoy, and recovering the missive. Original-client comparison remains open.'],
  ['cipher-icarius-locator', 'Envoy Icarius', 'https://warcraft.wiki.gg/wiki/Envoy_Icarius', 'website', 'Secondary locator for Envoy Icarius’s identity and role in the Borak branch. The story does not invent a later fate for him.'],
  ['cipher-zarath-locator', 'Blood Lord Zarath', 'https://warcraft.wiki.gg/wiki/Blood_Lord_Zarath', 'website', 'Secondary locator for Blood Lord Zarath’s role as Icarius’s bodyguard. The story does not invent a later fate for him.'],
  ['cipher-stormrage-missive-quest', 'Stormrage Missive', 'https://warcraft.wiki.gg/wiki/Stormrage_Missive', 'quest', 'Secondary quest-item locator and To Catch a Thistlehead quest text report that Illidan’s directive specifies where the Cipher is to be hidden next, without disclosing its current location. The text is paraphrased and original-client wording remains open for review.'],
  ['cipher-borak-charge-quest', 'The Cipher of Damnation — Borak’s Charge', 'https://warcraft.wiki.gg/wiki/The_Cipher_of_Damnation_-_Borak%27s_Charge', 'quest', 'Secondary quest-text locator for the interception and third fragment. Original-client comparison remains open.'],
  ['cipher-shadowmoon-shuffle-quest', 'The Shadowmoon Shuffle', 'https://www.wowhead.com/tbc/quest=10576/the-shadowmoon-shuffle', 'quest', 'TBC Classic quest-text locator for collecting clean Eclipsion armor pieces for a disguise. Original-client comparison remains open.'],
  ['cipher-illidan-wants-quest', 'What Illidan Wants, Illidan Gets…', 'https://www.wowhead.com/tbc/quest=10577/what-illidan-wants-illidan-gets', 'quest', 'TBC Classic quest-text locator for the disguise and delivery of Illidan’s message to Grand Commander Ruusk. Original-client comparison remains open.'],
  ['cipher-borak-third-fragment-quest', 'The Third Fragment Recovered', 'https://www.wowhead.com/tbc/quest=10579/the-cipher-of-damnation-the-third-fragment-recovered', 'quest', 'TBC Classic quest-text locator for the third fragment’s recovery by Borak. Original-client comparison remains open.'],
  ['cipher-final-quest', 'The Cipher of Damnation', 'https://warcraft.wiki.gg/wiki/The_Cipher_of_Damnation_(quest)', 'quest', 'Secondary quest-text locator for reading the restored Cipher at the Altar, summoning Cyrukh, Oronok and his two living sons’ arrival, the elemental spirits’ appearance, and the final mark. All details are paraphrased. Original-client comparison remains open.'],
];
const sources = new Map(sourceRows.map(([id, title, url, sourceType, notes]) => [id, { id, title, url, sourceType, notes: `Accessed 2026-10-02. ${notes}` }]));
for (const source of sources.values()) await out(`data/sources/${source.id}.research.json`, source);

for (const collection of ['events', 'claims', 'citations']) {
  const directory = path.join(root, 'data', collection);
  for (const name of await readdir(directory)) {
    if (name.startsWith(`${storyId}-`) && name.endsWith('.research.json')) await rm(path.join(directory, name));
  }
}

const locations = [
  { id: 'cipher-hand-of-guldan', name: 'The Hand of Gul’dan, Shadowmoon Valley', env: 'hand-of-guldan', traits: 'The Burning Crusade Outland setting: ash-dark broken ground, volcanic rock, dim green fel light, and a distant volcanic presence. Original scene composition, not an exact surveyed landmark.' },
  { id: 'cipher-oronok-farm', name: 'Oronok’s farm, Shadowmoon Valley', env: 'oronok-farm', traits: 'The Burning Crusade Shadowmoon Valley: blackened earth and fractured volcanic ridges surrounding a sparse, weathered farm among fel-scarred fields. The illustration is an original interpretation.' },
  { id: 'cipher-coilskar-point', name: 'Coilskar Point, Shadowmoon Valley', env: 'coilskar-point', traits: 'The Burning Crusade Shadowmoon Valley: dark rock, cold water, naga-built structures, and green fel haze. No individual prison, chest, or route is located precisely.' },
  { id: 'cipher-illidari-point', name: 'Illidari Point, Shadowmoon Valley', env: 'illidari-point', traits: 'The Burning Crusade Shadowmoon Valley: black basalt, jagged ridgelines, green fel illumination, and the dark stone encampment associated with Illidari forces. No exact body position is asserted.' },
  { id: 'cipher-eclipse-point', name: 'Eclipse Point, Shadowmoon Valley', env: 'eclipse-point-bridge', traits: 'The Burning Crusade Shadowmoon Valley: a fortress approach of dark stone over fractured, fel-lit ground beneath the region’s muted green and ash-red atmosphere. Composition and route remain interpretive.' },
  { id: 'cipher-netherwing-fields', name: 'Netherwing fields, Shadowmoon Valley', env: 'netherwing-fields', traits: 'The Burning Crusade Shadowmoon Valley: barren black volcanic ground, green fel light and distant floating shards, recalling Outland’s broken horizon. No exact position for the interception is asserted.' },
  { id: 'cipher-altar-of-damnation', name: 'Altar of Damnation, Shadowmoon Valley', env: 'altar-of-damnation', traits: 'The Burning Crusade Shadowmoon Valley: a dark ritual platform among ash-black cliffs, burning fel-green fissures and a red, smoke-laden sky. The scene is original and not a dungeon plan.' },
  { id: 'cipher-shattrath-lower-city', name: 'Lower City, Shattrath', env: 'shattrath-lower-city', traits: 'The Burning Crusade Shattrath: weathered tan stone, layered arches, fabric awnings and dense Lower City alleys. Original composition, not an exact street reconstruction.' },
  { id: 'cipher-shattered-plains', name: 'The Shattered Plains, Shadowmoon Valley', env: 'shattered-plains', traits: 'The Burning Crusade Shadowmoon Valley: hardened dark soil, sparse fel-scarred ground, and scattered burrows among the open Shattered Plains. The original regional illustration does not claim the exact mound or nest position.' },
];
const locationById = new Map(locations.map((item) => [item.id, item]));

const entities = [
  ['oronok-torn-heart', 'Oronok Torn-heart', 'The farmer who recounts his past and guides the search for the Cipher’s fragments.', 'character', 'mapFigure', 0.88],
  ['earthmender-torlok', 'Earthmender Torlok', 'An Earthen Ring earthmender involved in the request to aid the Shadowmoon spirits.', 'character', 'mapFigure', 0.8],
  ['tormented-elemental-spirits', 'The tormented elemental spirits', 'Fire, earth, water, and air spirits captured for Torlok’s communion. The ensemble is an interpretive group, not four identified individuals.', 'other', 'mapVisual', 0.84],
  ['totem-of-spirits', 'Totem of Spirits', 'The Earthen Ring totem used to capture the souls of Shadowmoon’s enraged elementals.', 'artifact', 'mapVisual', 0.48],
  ['domesticated-felboars', 'Oronok’s trained felboars', 'The trained felboars used to dig Shadowmoon tubers at Oronok’s farm.', 'other', 'mapVisual', 0.78],
  ['ravenous-flayer-eggs', 'Ravenous Flayer eggs', 'Eggs destroyed during Oronok’s lesson after flayers attack his boars.', 'artifact', 'mapVisual', 0.56],
  ['gromtor-torn-heart', 'Grom’tor Torn-heart', 'Oronok’s living son, who pursues the first Cipher fragment at Coilskar Point.', 'character', 'mapFigure', 0.84],
  ['lohngoron-bow', 'Lohn’goron, Bow of the Torn-heart', 'An ancestral Torn-heart bow that Ar’tor asks the adventurer to recover before his fragment charge.', 'artifact', 'mapVisual', 0.58],
  ['artor-torn-heart', 'Ar’tor Torn-heart', 'Oronok’s son, found dead at Illidari Point and encountered later as a spirit.', 'character', 'mapFigure', 0.82],
  ['artor-spirit', 'The spirit of Ar’tor', 'Ar’tor’s spirit helps recover the second fragment before fading.', 'character', 'mapFigure', 0.82],
  ['borak-torn-heart', 'Borak Torn-heart', 'Oronok’s living son, who surveils an Illidari envoy and pursues the third fragment.', 'character', 'mapFigure', 0.84],
  ['coilskar-commander', 'Coilskar naga commander', 'An unnamed naga commander involved in the first-fragment lead. The generated face is not a canonical individual.', 'other', 'mapVisual', 0.68],
  ['painmistress-gabrissa', 'Painmistress Gabrissa', 'The Illidari jailer whose key opens the demonic crystals holding Ar’tor’s body.', 'character', 'mapFigure', 0.78],
  ['veneratus-the-many', 'Veneratus the Many', 'The target of Ar’tor’s charge and keeper of the second Cipher fragment.', 'character', 'mapFigure', 0.76],
  ['envoy-icarius', 'Envoy Icarius', 'Illidan’s envoy in Borak’s investigation; the recovered missive concerns where the Cipher will be hidden next.', 'character', 'mapFigure', 0.8],
  ['tobias-filth-gorger', 'Tobias the Filth Gorger', 'A Broken trader in Shattrath who trades bloodthistle to blood elves for rotten Arakkoa eggs.', 'character', 'mapFigure', 0.76],
  ['rotten-arakkoa-egg', 'Rotten Arakkoa egg', 'The egg Borak sends the adventurer to trade for bloodthistle in Shattrath.', 'artifact', 'mapVisual', 0.5],
  ['blood-lord-zarath', 'Blood Lord Zarath', 'The envoy’s bodyguard in the Borak branch.', 'character', 'mapFigure', 0.8],
  ['ruul-the-darkener', 'Ruul the Darkener', 'The target of Borak’s charge during the pursuit of the third fragment.', 'character', 'mapFigure', 0.78],
  ['guldan-memory', 'Gul’dan’s remembered image', 'A memory-like image at the Altar of Damnation. The illustration does not claim canonical appearance or independent agency.', 'character', 'mapFigure', 0.78],
  ['cyrukh-the-firelord', 'Cyrukh the Firelord', 'The firelord summoned by reading the completed Cipher at the Altar of Damnation.', 'character', 'mapFigure', 0.9],
  ['redeemed-elemental-spirits', 'The four redeemed elemental spirits', 'An interpretive ensemble representing the four elemental spirits whose presence is reported after Cyrukh’s defeat.', 'other', 'mapVisual', 0.84],
  ['cipher-fragment', 'A fragment of the Cipher of Damnation', 'An individual recovered piece. Its writing and exact physical design are an original visual interpretation.', 'artifact', 'mapVisual', 0.57],
  ['cipher-reassembled', 'The reassembled Cipher of Damnation', 'The three recovered pieces restored as one object; exact canonical markings are not asserted.', 'artifact', 'mapVisual', 0.64],
  ['bloodthistle-bundle', 'Bloodthistle bundle', 'An interpretive visual for the bloodthistle used in the envoy distraction.', 'artifact', 'mapVisual', 0.5],
  ['stormrage-missive', 'Stormrage missive', 'A sealed interpretive image of the directive linking Illidan’s order to the Cipher and Zuluhed.', 'artifact', 'mapVisual', 0.48],
  ['eclipsion-disguise', 'Eclipsion blood elf disguise', 'The disguise assembled from clean Eclipsion armor for the message delivery to Grand Commander Ruusk.', 'artifact', 'mapVisual', 0.64],
  ['grand-commander-ruusk', 'Grand Commander Ruusk', 'An Eclipsion commander who receives Illidan’s message delivered under cover of the disguise.', 'character', 'mapFigure', 0.82],
].map(([id, name, description, type, field, scale]) => ({ id, name, description, type, field, scale, asset: `${imageDir}/${id}.research.webp` }));
const entityById = new Map(entities.map((item) => [item.id, item]));

const beats = [
  { id: 'hand-of-guldan', title: 'The Hand of Gul’dan', env: 'hand-of-guldan', places: ['cipher-hand-of-guldan'], sources: ['cipher-hand-quest', 'cipher-blizzard-chain-guide'], figures: ['earthmender-torlok'], participants: ['earthmender-torlok'], text: 'An Earthen Ring request brings the adventurer to Shadowmoon Valley’s damaged ground. The Alliance and Horde have different starting earthmenders, so this account keeps its first step with the shared task: help the troubled spirits. Torlok’s work asks more than force. The story begins among black rock and green-lit fissures with a question about repair—whether those who harmed the land can still answer the elements that remain within it.', note: 'The quest supports the request and opening position in the chain. Faction-specific starting NPC variants are named in the record but not collapsed into one universal account.' },
  { id: 'fire-and-earth', title: 'Fire and earth', env: 'hand-of-guldan', places: ['cipher-hand-of-guldan'], sources: ['cipher-fire-earth-spirits-quest'], figures: ['earthmender-torlok', 'tormented-elemental-spirits'], objects: ['totem-of-spirits'], participants: ['earthmender-torlok'], text: 'Torlok provides a Totem of Spirits and asks the seeker to capture the souls of enraged fire and earth elementals near the Hand. Their fury is not made into a speech, and the quest does not claim that the totem heals them at once. It gives a first measure of the wound: beneath Shadowmoon’s crust, both heat and stone have become hostile, waiting for the Earthen Ring to hear what they carry.', note: 'The quest requires capturing fire and earth souls near the Hand of Gul’dan. The image shows an interpretive elemental group, not named individuals.' },
  { id: 'water-at-coilskar', title: 'Water held in anguish', env: 'coilskar-point', places: ['cipher-coilskar-point'], sources: ['cipher-water-spirits-quest'], figures: ['earthmender-torlok', 'tormented-elemental-spirits'], objects: ['totem-of-spirits'], participants: ['earthmender-torlok'], text: 'The next souls are water spirits around Coilskar, where the quest says Illidari naga control the valley’s only clean water. This branch of the task ties elemental pain to a present pressure on the land: a living supply has been taken and its spirits cry out. The water’s exact source and course are not drawn here. The story keeps its attention on the named place and the souls Torlok asks the adventurer to gather.', note: 'The water quest names Coilskar and the naga control of the clean-water supply. No exact water route is mapped.' },
  { id: 'air-at-netherwing-fields', title: 'The air spirits of the fields', env: 'netherwing-fields', places: ['cipher-netherwing-fields'], sources: ['cipher-air-spirits-quest'], figures: ['earthmender-torlok', 'tormented-elemental-spirits'], objects: ['totem-of-spirits'], participants: ['earthmender-torlok'], text: 'At the Netherwing Fields, the last of Torlok’s errands gathers air spirits wandering the cliffs and mountain bases. The region opens into enormous blue crystal formations and a broken horizon, while the unseen wind carries its own unrest. Fire, earth, water, and air have now each entered the work—not as abstract emblems, but as spirits the Earthen Ring hopes to commune with after their souls are gathered.', note: 'The air-spirit quest places the task at the Netherwing Fields. The generated horizon is interpretive and is not a surveyed view.' },
  { id: 'torklok-communes', title: 'The Earthen Ring listens', env: 'altar-of-damnation', places: ['cipher-altar-of-damnation'], sources: ['cipher-blizzard-chain-guide'], figures: ['earthmender-torlok', 'tormented-elemental-spirits'], objects: ['totem-of-spirits'], participants: ['earthmender-torlok'], text: 'At the Altar, Torlok places the filled totem and releases the captured souls so the Ring can speak with them. The quest chain treats this labor as the threshold to the story of Oronok: first the spirits, then the words that broke their bond with the orcs. No claim is made that the valley is restored in a moment. The scene holds only to what the task records—the attempt to listen, and a path opening onward.', note: 'Blizzard’s chain order and the component soul-capture quests support this handoff. The release is not presented as a complete cure for the region.' },
  { id: 'oronok-introduced', title: 'Oronok Torn-heart', env: 'oronok-farm', places: ['cipher-oronok-farm'], sources: ['cipher-oronok-intro-quest'], figures: ['oronok-torn-heart'], participants: ['oronok-torn-heart'], text: 'The elemental work leads to Oronok Torn-heart and his farm in Shadowmoon Valley. He does not offer the Cipher’s history at once. In the later telling, he admits that he had tested the seeker and worn the farmer’s role like a cover. His first account begins in ordinary labor; beneath it stands a son and a father whose past reaches back through a shattered world.', note: 'The quest records Oronok’s test and disclosure. This retelling paraphrases that exchange and does not invent his hidden identity or exact motive.' },
  { id: 'farmer-with-a-past', title: 'The farmer’s work', env: 'shattered-plains', places: ['cipher-shattered-plains'], sources: ['cipher-oronok-tubers-quest'], figures: ['oronok-torn-heart', 'domesticated-felboars'], participants: ['oronok-torn-heart'], text: 'Oronok asks for Shadowmoon tubers, which his trained felboars dig from the hardened earth of the Shattered Plains. Ravenous flayers have been attacking the animals and interrupting his work. A whistle calls the boars to the mounds; the story shows that small task as a test of attention to the damaged lives around the farm. The land resists even the simplest harvest, and Oronok’s test has more than one layer.', note: 'The quest supports the felboars, tubers, flayers, and Shattered Plains. The art does not place a specific mound.' },
  { id: 'lesson-learned', title: 'A lesson learned', env: 'shattered-plains', places: ['cipher-shattered-plains'], sources: ['cipher-lesson-learned-quest'], figures: ['oronok-torn-heart'], objects: ['ravenous-flayer-eggs'], participants: ['oronok-torn-heart'], text: 'Oronok sends the seeker back into flayer territory to destroy their eggs after his boars were attacked. The lesson is practical and severe: the threats around the farm will not leave by themselves. No nest is given an exact position, and no individual flayer is named. When the work is done, the story can leave the farmer’s errands behind. Oronok has decided that the visitor has earned the account he withheld.', note: 'The egg-destruction objective and its context are supported by the quest text. No route or precise nest is asserted.' },
  { id: 'oronoks-account', title: 'Oronok’s account of Gul’dan', env: 'oronok-farm', places: ['cipher-oronok-farm'], sources: ['cipher-oronok-truth-quest'], figures: ['oronok-torn-heart'], objects: ['cipher-fragment'], participants: ['oronok-torn-heart'], text: 'Oronok tells how Gul’dan spoke the Cipher’s words, shattered Draenor, and severed the orcs from their elemental ties. This is a memory carried by Oronok’s quest account, not an omniscient transcript of every event on the old world. Its consequence is present around him: spirits strain against the valley’s corruption, and three fragments must be found before the words can be confronted whole.', note: 'Gul’dan’s actions and the breaking of elemental ties are attributed to Oronok. No exact wording, date, or additional motive is supplied.' },
  { id: 'gromtor-and-the-first-lead', title: 'Grom’tor at Coilskar', env: 'coilskar-point', places: ['cipher-coilskar-point'], sources: ['cipher-gromtor-quest', 'cipher-gromtor-charge-quest'], figures: ['gromtor-torn-heart', 'coilskar-commander'], participants: ['gromtor-torn-heart', 'coilskar-commander'], objects: ['cipher-fragment'], text: 'Grom’tor’s branch opens at Coilskar. The charge uses an imprisoned naga commander as the source of a lead, then sends the seeker after the first fragment. The commander is unnamed in our scene art and gains no invented words. This is one of three distinct lines Oronok sets in motion; the guide presents Grom’tor first as an editorial itinerary, while the quests allow the sons’ searches to be completed in any order.', note: 'The quest locators support Grom’tor’s Coilskar lead and first-fragment search. Editorial presentation order does not claim required chronology among the three branches.' },
  { id: 'first-fragment-returned', title: 'The first fragment recovered', env: 'oronok-farm', places: ['cipher-oronok-farm'], sources: ['cipher-gromtor-fragment-quest'], figures: ['gromtor-torn-heart', 'oronok-torn-heart'], objects: ['cipher-fragment'], participants: ['gromtor-torn-heart', 'oronok-torn-heart'], text: 'Grom’tor brings the first fragment back to Oronok. The piece is now accounted for, but it is only one part of the whole and the task passes to the next son’s trail. The story pauses on the object that survived Gul’dan’s words across a broken world. Its physical markings remain an original illustration; no invented script is treated as readable canon.', note: 'The quest supports the fragment’s recovery. The depicted writing is interpretive texture, not a transcription.' },
  { id: 'artors-crystal-prison', title: 'Ar’tor’s prison at Illidari Point', env: 'illidari-point', places: ['cipher-illidari-point'], sources: ['cipher-artor-quest', 'cipher-artor-crystal-prisons-quest'], figures: ['artor-torn-heart', 'painmistress-gabrissa'], participants: ['artor-torn-heart', 'painmistress-gabrissa'], text: 'Ar’tor’s branch turns to Illidari Point, where his body is found suspended in demonic crystals. Painmistress Gabrissa has the key that allows the prison to be opened. The quest gives no time of death, so the story leaves that absence untouched. The recovered body is a central fact, and the scene does not soften it by implying that Ar’tor has returned to the living.', note: 'The quest locators support the body, its crystal prison, and Gabrissa’s key. The date and circumstances of death are unknown.' },
  { id: 'lohngoron-recovered', title: 'Lohn’goron, a family bow', env: 'illidari-point', places: ['cipher-illidari-point'], sources: ['cipher-artor-bow-quest'], figures: ['artor-spirit'], objects: ['lohngoron-bow'], participants: ['artor-spirit'], text: 'Ar’tor appears as a spirit and asks that his ancestral bow, Lohn’goron, be recovered from the demons of Illidari Point. The weapon was handed down through the Torn-heart family; recovering it precedes the charge for the second fragment. In the story, this object carries a more intimate inheritance than the Cipher’s scattered words: a family’s memory can be held in a thing even when one of its keepers is gone.', note: 'The quest identifies Lohn’goron as an heirloom and its recovery from demons. The bow’s visual design is interpretive, not an exact item model.' },
  { id: 'artors-charge', title: 'Ar’tor’s final charge', env: 'illidari-point', places: ['cipher-illidari-point'], sources: ['cipher-artor-charge-quest', 'cipher-artor-fragment-quest'], figures: ['artor-spirit', 'veneratus-the-many'], objects: ['cipher-fragment'], participants: ['artor-spirit', 'veneratus-the-many'], text: 'Ar’tor directs the seeker toward Veneratus and the second fragment, lending a part of his spirit to the task. When the fragment is recovered, his spirit fades. The quest gives no reunion beyond that moment. The piece passes to the living, but Ar’tor’s own path ends there, preserving the cost at the heart of this branch rather than turning his help into a resurrection.', note: 'The two quest texts support Ar’tor’s charge, the fragment recovery, and his fading afterward. He is not restored to life.' },
  { id: 'borak-and-the-envoy', title: 'Borak watches Eclipse Point', env: 'eclipse-point-bridge', places: ['cipher-eclipse-point'], sources: ['cipher-borak-quest', 'cipher-icarius-locator', 'cipher-zarath-locator'], figures: ['borak-torn-heart', 'envoy-icarius', 'blood-lord-zarath'], participants: ['borak-torn-heart', 'envoy-icarius', 'blood-lord-zarath'], text: 'Borak studied before he became an assassin, and the quest account says he has watched an envoy from the Black Temple for weeks. Icarius travels with Blood Lord Zarath as his bodyguard. Borak is trying to learn where the third fragment has been hidden, but the guard never leaves the envoy’s side. The obstacle is clear; his private thoughts are not. We follow what the account says and let the long watch speak for itself.', note: 'Borak’s history, target, and surveillance are attributed to the quest. Neither private motives nor a later fate for Icarius or Zarath is asserted.' },
  { id: 'egg-for-tobias', title: 'An egg for Tobias', env: 'shattrath-lower-city', places: ['cipher-shattrath-lower-city'], sources: ['cipher-thistleheads-quest', 'cipher-tobias-egg-trade-quest'], figures: ['borak-torn-heart', 'tobias-filth-gorger'], objects: ['rotten-arakkoa-egg'], participants: ['borak-torn-heart', 'tobias-filth-gorger'], text: 'Borak recognizes signs that the envoy is a Thistlehead and points toward a trade in Shattrath’s Lower City. The seeker brings Tobias a rotten Arakkoa egg; Tobias is known to exchange bloodthistle for such eggs. This is a lead, not a private friendship between Borak and the Broken trader. In the narrow streets of Shattrath, an unlikely commodity becomes the means to break an escort that had seemed unbreakable.', note: 'The quests describe the egg trade and name Tobias. The illustration is interpretive; no unrecorded conversation or alliance is added.' },
  { id: 'bloodthistle-delivered', title: 'A bundle becomes a trap', env: 'eclipse-point-bridge', places: ['cipher-eclipse-point'], sources: ['cipher-tobias-egg-trade-quest', 'cipher-thistlehead-trap-quest'], figures: ['borak-torn-heart', 'envoy-icarius', 'blood-lord-zarath'], objects: ['bloodthistle-bundle'], participants: ['borak-torn-heart', 'envoy-icarius', 'blood-lord-zarath'], text: 'Tobias provides a bundle of bloodthistle for Borak. The plan is to leave it at the far end of the bridge and wait for the envoy to collect it apart from his bodyguard. Borak says blood elves despise Thistleheads; that prejudice is the lever he chooses. The story records a deception and a calculated risk, without claiming every detail of the encounter beyond the quest’s objective.', note: 'The trap, bloodthistle, and intended separation from the bodyguard are sourced to the quest. No additional reaction is invented.' },
  { id: 'stormrage-missive', title: 'The Stormrage missive', env: 'eclipse-point-bridge', places: ['cipher-eclipse-point'], sources: ['cipher-thistlehead-trap-quest', 'cipher-stormrage-missive-quest'], figures: ['borak-torn-heart', 'envoy-icarius'], objects: ['stormrage-missive'], participants: ['borak-torn-heart', 'envoy-icarius', 'stormrage-missive'], text: 'The quest directs the adventurer to kill Icarius once he is alone and recover the Stormrage missive. Borak reads it and learns that Illidan’s directive concerns where the Cipher is to be hidden next; the letter does not reveal where it currently rests. The envoy’s fate is not extended beyond this objective. What Borak gains is a glimpse of the wider contest over the fragments.', note: 'The killing objective and missive’s stated information are paraphrased from quest locators. The item does not give this account a current fragment location.' },
  { id: 'shadowmoon-disguise', title: 'The Shadowmoon Shuffle', env: 'eclipse-point-bridge', places: ['cipher-eclipse-point'], sources: ['cipher-shadowmoon-shuffle-quest'], figures: ['borak-torn-heart'], objects: ['eclipsion-disguise'], participants: ['borak-torn-heart'], text: 'To carry a message through Eclipse Point, Borak asks for clean pieces of Eclipsion armor. The disguise must pass for Illidari blood elf equipment, and blood stains would spoil it. The collection turns the plan from watching an envoy to entering the fortress under another appearance. Our armor cutout is an original interpretation, not a canonical costume capture; its purpose in the scene is the deception the quest names.', note: 'The armor collection and disguise are supported by the quest. The generated outfit is not asserted as an exact in-game model.' },
  { id: 'illidans-message', title: 'What Illidan wants', env: 'eclipse-point-bridge', places: ['cipher-eclipse-point'], sources: ['cipher-illidan-wants-quest'], figures: ['borak-torn-heart', 'grand-commander-ruusk'], objects: ['eclipsion-disguise'], participants: ['grand-commander-ruusk'], text: 'Wearing the disguise, the adventurer enters Eclipse Point and delivers Illidan’s message to Grand Commander Ruusk. The quest has the seeker tell Ruusk where the Cipher should move next, speaking under the authority of Illidan’s order. The tactic turns the defenders’ chain of command against itself. No dialogue beyond the task is supplied, and the scene does not pretend to reveal the Cipher’s present location.', note: 'The disguise, recipient, and instruction to tell Ruusk where to move the Cipher come from the quest. No message wording is invented.' },
  { id: 'ruuls-interception', title: 'Borak’s charge', env: 'netherwing-fields', places: ['cipher-netherwing-fields'], sources: ['cipher-borak-charge-quest'], figures: ['borak-torn-heart', 'ruul-the-darkener'], objects: ['cipher-fragment'], participants: ['borak-torn-heart', 'ruul-the-darkener'], text: 'Borak names Ruul the Darkener and the transport carrying the third part. The quest directs the adventurer to intercept it somewhere between Dragonmaw Fortress and the Sanctum of the Stars, across the Netherwing Fields. We keep that broad description broad rather than drawing a false route or pinpoint. Ruul is a dangerous target, and the instruction warns the seeker to gather help before the fragment can be claimed.', note: 'The objective and described regional interval come from the quest. No exact interception point or transport path is drawn.' },
  { id: 'third-fragment-home', title: 'The third fragment recovered', env: 'eclipse-point-bridge', places: ['cipher-eclipse-point'], sources: ['cipher-borak-third-fragment-quest'], figures: ['borak-torn-heart'], objects: ['cipher-fragment'], participants: ['borak-torn-heart'], text: 'The third fragment is returned to Borak, who places it in a box. The sons’ separate lines have now each yielded one part, though their order here is only a way through the story. The object has been moved through several hands, with a larger conflict trying to direct where it goes. At last, the three pieces can be considered together rather than as unrelated recoveries.', note: 'The quest confirms Borak’s recovery and boxing of the fragment. The branch order shown in this guide is editorial; the fragment paths can be completed in any order.' },
  { id: 'cipher-reassembled', title: 'Three pieces made whole', env: 'oronok-farm', places: ['cipher-oronok-farm'], sources: ['cipher-blizzard-chain-guide', 'cipher-final-quest'], figures: ['oronok-torn-heart', 'gromtor-torn-heart', 'borak-torn-heart'], objects: ['cipher-reassembled'], participants: ['oronok-torn-heart', 'gromtor-torn-heart', 'borak-torn-heart'], text: 'Once each branch is complete, Oronok holds the three fragments together as the Cipher. Grom’tor and Borak are the sons who can stand with him in the final quest; Ar’tor cannot return from death, even though his spirit helped bring the second piece home. The distinction remains visible in the family’s account. The restored object is not an answer by itself. Its words must be read where Gul’dan’s memory stands.', note: 'The final quest and branch outcomes support the completed Cipher. The story does not imply that Ar’tor is resurrected or physically present.' },
  { id: 'read-at-altar', title: 'The words at the Altar', env: 'altar-of-damnation', places: ['cipher-altar-of-damnation'], sources: ['cipher-final-quest'], figures: ['oronok-torn-heart', 'gromtor-torn-heart', 'borak-torn-heart', 'guldan-memory'], objects: ['cipher-reassembled'], participants: ['oronok-torn-heart', 'gromtor-torn-heart', 'borak-torn-heart'], text: 'At the Altar of Damnation, Oronok is told to read the whole Cipher where the memory of Gul’dan stands. The quest presents the apparition as memory left imprinted on the land, not an independent witness returning to explain himself. Once the words are spoken, Cyrukh is to come. A history gathered piece by piece has crossed into the present, and the final contest begins at the place the quest names.', note: 'The location, restored Cipher, Gul’dan memory, and summoning are supported by the final quest. The memory’s portrait is interpretive.' },
  { id: 'cyrukh-and-the-elements', title: 'Cyrukh the Firelord', env: 'altar-of-damnation', places: ['cipher-altar-of-damnation'], sources: ['cipher-final-quest'], figures: ['oronok-torn-heart', 'gromtor-torn-heart', 'borak-torn-heart', 'cyrukh-the-firelord', 'redeemed-elemental-spirits'], objects: ['cipher-reassembled'], participants: ['oronok-torn-heart', 'gromtor-torn-heart', 'borak-torn-heart', 'cyrukh-the-firelord'], text: 'Cyrukh the Firelord is defeated at the Altar with Oronok and his two living sons in the quest’s account. Four redeemed elemental spirits appear, answering the work that began with Torlok and the totem. The ending does not say every wound in Shadowmoon has closed. It records an immediate victory and an elemental response, while leaving the broader state of the valley open to the evidence.', note: 'The final quest supports Cyrukh’s defeat and the four spirits’ appearance. Ar’tor is not among the living participants.' },
  { id: 'the-mark-of-kaelthas', title: 'The mark of Kael’thas', env: 'altar-of-damnation', places: ['cipher-altar-of-damnation'], sources: ['cipher-final-quest', 'cipher-blizzard-chain-guide'], figures: ['earthmender-torlok', 'oronok-torn-heart', 'gromtor-torn-heart', 'borak-torn-heart', 'redeemed-elemental-spirits'], objects: ['cipher-reassembled'], participants: ['earthmender-torlok'], text: 'Torlok carries an unfinished warning from the spirits: another knows the Cipher. A symbol associated with Kael’thas appears, but this chain does not resolve what it means. Blizzard’s sequence separates the level-70 Trial of the Naaru path from the Cipher quest itself. The story therefore closes at the mark—after the spirits have been heard, Cyrukh has fallen, and the recovered words have become a question again.', note: 'The warning and mark are reported by the final quest. The level-70 Trial of the Naaru follows later and is not narrated as part of this story.' },
];

for (const beat of beats) {
  for (const id of beat.sources) if (!sources.has(id)) throw new Error(`Unknown source ${id}`);
  for (const id of beat.places) if (!locationById.has(id)) throw new Error(`Unknown place ${id}`);
  for (const id of [...beat.figures, ...(beat.objects ?? [])]) if (!entityById.has(id)) throw new Error(`Unknown entity ${id}`);
}
const sourceIds = unique(beats.flatMap((beat) => beat.sources));
const usedEntities = unique(beats.flatMap((beat) => [...beat.figures, ...(beat.objects ?? [])]));
const usedLocations = unique(beats.flatMap((beat) => beat.places));
const envKeys = unique(beats.map((beat) => beat.env));

for (const place of locations.filter((item) => usedLocations.includes(item.id))) {
  const refs = unique(beats.filter((beat) => beat.places.includes(place.id)).flatMap((beat) => beat.sources));
  await out(`data/entities/${place.id}.research.json`, {
    id: place.id, type: 'location', name: place.name, slug: place.id,
    shortDescription: place.traits,
    body: `${place.traits} The story uses dedicated original area illustrations in a relational stage. This art does not assert exact coordinates, travel routes, surveyed layouts, or precise item positions.`,
    firstEraId: eraId, featuredEraIds: [eraId], sourceIds: refs,
    tags: ['cipher-story', 'burning-crusade-area-reference', 'interpretive-art'], contentStatus: 'research',
  });
}
for (const id of usedEntities) {
  const entity = entityById.get(id);
  const relevant = beats.filter((beat) => beat.figures.includes(id) || (beat.objects ?? []).includes(id));
  const refs = unique(relevant.flatMap((beat) => beat.sources));
  await access(path.join(root, 'public', entity.asset));
  const visualNote = 'Visual details are original generated research art, not canonical model evidence. Composition, markings, costume and exact game resemblance await human comparison with the target Burning Crusade client.';
  await out(`data/entities/${id}.research.json`, {
    id, type: entity.type, name: entity.name, slug: id,
    shortDescription: entity.description, body: `${entity.description} ${visualNote}`,
    firstEraId: eraId, featuredEraIds: [eraId], sourceIds: refs,
    tags: ['cipher-story', 'interpretive-art'],
    [entity.field]: { asset: entity.asset, scale: entity.scale },
    contentStatus: 'research',
  });
}

const features = [];
const featureByEntity = new Map();
const columns = [3900, 5000, 6100];
const rows = [3200, 3800, 4400, 5000, 5600, 6200, 6800, 7400, 8000, 8600];
for (const id of usedEntities) {
  const slot = featureByEntity.size;
  const row = Math.floor(slot / columns.length);
  if (row >= rows.length) throw new Error(`Cipher stage has no placement slot for ${id}`);
  const geometryId = `${storyId}-${id}-focus`;
  featureByEntity.set(id, geometryId);
  features.push({
    type: 'Feature', id: geometryId,
    properties: { name: `${entityById.get(id).name} editorial focus`, contentStatus: 'research', styleRole: 'site', geographicCertainty: 'unknown' },
    geometry: { type: 'Point', coordinates: [columns[slot % columns.length], rows[row]] },
  });
  const refs = unique(beats.filter((beat) => beat.figures.includes(id) || (beat.objects ?? []).includes(id)).flatMap((beat) => beat.sources));
  await out(`data/spatial-states/${storyId}-${id}.research.json`, {
    id: `${storyId}-${id}-theater`, entityId: id, eraId, worldspaceId,
    geometryId, placementKind: 'relational', geographicCertainty: 'unknown', sourceIds: refs,
    editorNote: 'Editorial placement inside a relational story theater. It is not a world coordinate, historic formation, route, or claim that every subject shared one physical scene.',
    visualPresence: 'contextual', labelPriority: 240,
  });
}
await out(`data/geometry/${storyId}-theater.research.geojson`, { type: 'FeatureCollection', features });
await out(`data/worldspaces/${worldspaceId}.research.json`, {
  id: worldspaceId, name: 'The Cipher of Damnation · relational story theater', slug: worldspaceId,
  coordinateSystem: { width: 10000, height: 10000, origin: 'bottom-left', units: 'atlas-units' },
});

const envInfo = {
  'hand-of-guldan': ['The Hand of Gul’dan', 'hand-of-guldan', 'exec-2e8c2423-6db4-4d3a-beb9-36d16d064e49', 'Volcanic and ash-dark Shadowmoon Valley landscape with fel light; environment quadrant A.'],
  'oronok-farm': ['Oronok’s farm', 'oronok-farm', 'exec-2e8c2423-6db4-4d3a-beb9-36d16d064e49', 'Shadowmoon farm amid fractured basalt and fel-scarred fields; environment quadrant B.'],
  'coilskar-point': ['Coilskar Point', 'coilskar-point', 'exec-2e8c2423-6db4-4d3a-beb9-36d16d064e49', 'Naga site over cold water, volcanic rock, and green fel haze; environment quadrant C.'],
  'illidari-point': ['Illidari Point', 'illidari-point', 'exec-2e8c2423-6db4-4d3a-beb9-36d16d064e49', 'Dark Illidari outpost among broken Shadowmoon ridges; environment quadrant D.'],
  'eclipse-point-bridge': ['Eclipse Point approaches', 'eclipse-point-bridge', 'exec-77a320c0-09cf-4168-8133-ef7f08e2e1dc', 'Dark stone span and fel-lit fortress approaches in Shadowmoon Valley; environment quadrant A.'],
  'netherwing-fields': ['The Netherwing fields', 'netherwing-fields', 'exec-77a320c0-09cf-4168-8133-ef7f08e2e1dc', 'Broken volcanic fields under a fel-green sky; environment quadrant B.'],
  'altar-of-damnation': ['The Altar of Damnation', 'altar-of-damnation', 'exec-77a320c0-09cf-4168-8133-ef7f08e2e1dc', 'Dark ritual altar amid basalt cliffs, fel fissures, and an ash-red sky; environment quadrant C.'],
  'shattrath-lower-city': ['Shattrath’s Lower City', 'shattrath-lower-city', 'exec-77a320c0-09cf-4168-8133-ef7f08e2e1dc', 'Weathered stone arches and dense Lower City alleys; environment quadrant D.'],
  'shattered-plains': ['The Shattered Plains', 'shattered-plains', 'exec-80f43ff2-32a4-4a2f-a7d1-00447194f206', 'Broad exposed Shadowmoon plateau with hardened ash-dark soil, sparse scrub, burrows, fractured ridges, and a smoke-red sky.'],
};
for (const key of envKeys) {
  const [title, assetName] = envInfo[key];
  const place = locations.find((item) => item.env === key);
  const asset = `${imageDir}/${assetName}.research.webp`;
  await access(path.join(root, 'public', asset));
  await out(`data/map-states/${storyId}-${key}.research.json`, {
    id: `${storyId}-${key}-scene`, name: `The Cipher · ${title}`, worldspaceId,
    presentation: 'relational', terrainTextureAsset: asset, geometryIds: [],
    cartographyLabel: 'THE BURNING CRUSADE · SHADOWMOON VALLEY',
    interpretationNote: `Original research illustration for a Burning Crusade story scene. Recognizable traits: ${place.traits} This image is not an in-game capture, exact location, route, or surveyed layout. Matching-build game comparison remains open; see docs/research/${storyId}-visual-assets.json.`,
  });
}

const priorStoryPath = `data/stories/${storyId}.research.json`;
const prior = await readFile(path.join(root, priorStoryPath), 'utf8').then(JSON.parse).catch(() => undefined);
const priorNodes = new Map((prior?.nodes ?? []).map((node) => [node.id, node]));
const nodes = [];
for (const [index, beat] of beats.entries()) {
  const eventId = `${storyId}-${beat.id}-event`;
  const claimId = `${storyId}-${beat.id}-claim`;
  const citationIds = [];
  for (const sourceId of beat.sources) {
    const citationId = `${storyId}-${beat.id}-${sourceId}-citation`;
    citationIds.push(citationId);
    await out(`data/citations/${citationId}.research.json`, {
      id: citationId, sourceId,
      ...(sources.get(sourceId).sourceType === 'quest' ? { questId: sources.get(sourceId).title } : {}),
      section: `${beat.title} · quest sequence or objective`,
      note: 'Original paraphrase of a quest-sequence or quest-text locator. Exact wording, client edition, and any details not present in the locator remain subject to human verification.',
    });
  }
  await out(`data/claims/${claimId}.research.json`, {
    id: claimId, subjectId: eventId, predicate: 'cipher_story_scene', value: beat.text,
    citationIds, confidence: 'strongly_supported', status: 'active', editorNote: beat.note,
  });
  await out(`data/events/${eventId}.research.json`, {
    id: eventId, kind: 'event', name: beat.title, slug: `${storyId}-${beat.id}`,
    eraId, worldspaceId, date: { precision: 'unknown', label: 'Burning Crusade Shadowmoon quest chain; exact in-world date unknown' },
    summary: beat.text, locationIds: beat.places,
    participantEntityIds: beat.participants ?? beat.figures,
    sourceIds: beat.sources, claimIds: [claimId], contentStatus: 'research',
  });
  const nodeId = `${storyId}-story-${beat.id}`;
  const old = priorNodes.get(nodeId);
  const voiceover = old?.narration === beat.text ? old.voiceover : undefined;
  nodes.push({
    id: nodeId, guideId, title: beat.title, narration: beat.text,
    durationMs: voiceover?.durationMs ?? Math.round(((beat.text.split(/\s+/).length / 82) * 60000) / 500) * 500 + 5000,
    ...(voiceover ? { voiceover } : {}), eventIds: [eventId],
    entityIds: unique([...beat.figures, ...(beat.objects ?? [])]), locationIds: beat.places,
    camera: { position: [0, 6.2, 5.4], target: [0, 0, 0], durationMs: 1100 },
    visualActions: [{ type: 'set_map_state', mapStateId: `${storyId}-${beat.env}-scene` }],
    ...(index ? { previousNodeId: nodes[index - 1].id } : {}),
    ...(index < beats.length - 1 ? { nextNodeIds: [`${storyId}-story-${beats[index + 1].id}`] } : {}),
  });
}
const guide = {
  id: guideId, eraId, title: 'The Cipher of Damnation · Oronok Torn-heart',
  description: 'Twenty-six illustrated Burning Crusade scenes follow the full elemental prelude, Oronok’s tests, and three separate fragment branches to the Altar of Damnation. Ar’tor’s death, Oronok’s attributed testimony, and the later level-70 attunement branch remain distinct.',
  nodeIds: nodes.map((node) => node.id), contentStatus: 'research',
};
await out(priorStoryPath, { guide, nodes });

const chapters = [
  { id: 'oronok-and-the-cipher', eraId, title: 'Oronok and the Cipher', body: 'The Earthen Ring request leads to Oronok, whose attributed account names Gul’dan and the severing of the orcs from the elements.' },
  { id: 'the-three-fragments', eraId, title: 'Three sons and three fragments', body: 'Grom’tor and Borak complete living searches; Ar’tor’s branch turns through death, a family heirloom, a spirit, and a fading charge. The branches can be completed in any order; this is an editorial itinerary.' },
  { id: 'the-altar-and-the-mark', eraId, title: 'The Altar and the unfinished mark', body: 'Oronok reads the reunited Cipher, Cyrukh is defeated, and a warning plus Kael’thas mark point beyond this chain. The level-70 Trial of the Naaru chain remains outside the story.' },
];
const allWordCount = nodes.reduce((sum, node) => sum + node.narration.split(/\s+/).length, 0);
await out(`data/storylines/${storyId}.research.json`, {
  id: storyId, slug: storyId, title: 'The Cipher of Damnation: Oronok and the Three Fragments',
  summary: 'Oronok’s account leads into three separate searches for the Cipher’s fragments. His living sons Grom’tor and Borak return; Ar’tor’s spirit completes its charge before the chain converges at the Altar of Damnation.',
  opening: 'Shadowmoon Valley still bears the marks of a world broken by words. The Earthen Ring first gathers the suffering elements, then sends the seeker to a farmer who has been something more. Three branches recover what the Cipher lost; at the Altar, Oronok reads it whole and a warning leaves the final mark unresolved.',
  primaryEraId: eraId, eraIds: [eraId], chapters, sourceIds,
  reviewNote: `Complete illustrated research story with ${nodes.length} scenes (${allWordCount} narration words), separate Grom’tor, Ar’tor, and Borak branches, one source-linked claim and event per scene, dedicated Burning Crusade area illustrations, deliberate principal cast and elemental group art, pivotal fragment, completed Cipher, bloodthistle, and missive visuals. StoryTour order is an editorial sequence across stories. Blizzard’s TBC Classic guide provides the official chain order; other available quest text pages are secondary locators. Compare against the original 2.0.3–2.4.3 client before human review. Oronok’s account stays attributed; Ar’tor’s time of death is unknown and he is not resurrected; no routes or exact positions are asserted. The later level-70 Trial of the Naaru chain is excluded. Original-client area resemblance, precise visual model review, all claims, and narration audition remain open. This story is available in the standalone Classic-to-Wrath StoryTour and library only, with showInEraTourOffshoots false.`,
  storyGuideId: guideId, showInEraTourOffshoots: false, contentStatus: 'research',
});

const tourFile = 'data/story-tours/classic-to-wrath.research.json';
const tour = JSON.parse(await readFile(path.join(root, tourFile), 'utf8'));
const entry = tour.entries.find((item) => item.storylineId === storyId);
if (!entry) throw new Error('Cipher’s existing preview placard is missing from the Classic-to-Wrath tour.');
entry.regionIds = ['outland'];
entry.mapPositionPercent = [82, 79];
entry.order = 10;
entry.periodLabel = 'The Burning Crusade · Shadowmoon Valley';
entry.locationLabel = 'Shadowmoon Valley · Outland';
tour.entries.sort((a, b) => a.order - b.order);
tour.reviewNote = 'Playable research guides include Oronok and the Cipher as the tenth placard in an editorial Classic-to-Wrath sequence. Its Outland map anchor and all story-stage art are interpretive, not exact geography. Wrathgate remains a preview outside Play All. Original-client quest and area comparison, chronology, claim review, generated asset review, and narration audition remain human gates.';
await out(tourFile, tour);

const eraPath = 'data/eras/age-of-adventurers.research.json';
const era = JSON.parse(await readFile(path.join(root, eraPath), 'utf8'));
era.sourceIds = unique([...era.sourceIds, ...sourceIds]);
await out(eraPath, era);

const definitions = [
  ...envKeys.map((key) => {
    const [, name, sourceArtifactId, brief] = envInfo[key];
    const place = locations.find((item) => item.env === key);
    return { id: `environment-${key}`, kind: 'environment', file: `${imageDir}/${name}.research.webp`, locationEntityId: place.id, nodeIds: beats.filter((beat) => beat.env === key).map((beat) => `${storyId}-story-${beat.id}`), sourceArtifactId, generationBrief: brief, targetEditionBuild: 'World of Warcraft: The Burning Crusade original client era (2.0.3–2.4.3); matching-build comparison remains open.', recognizableTraits: place.traits, transparency: false, interpretiveLimitations: 'Original generated scene, not an in-game capture, exact model reconstruction, surveyed layout, or evidence for a route.' };
  }),
  ...entities.filter((entity) => usedEntities.includes(entity.id)).map((entity) => ({
    id: `${entity.field === 'mapVisual' ? 'object' : 'portrait'}-${entity.id}`, kind: entity.field === 'mapVisual' ? 'object-or-group-portrait' : 'character-portrait', file: entity.asset,
    entityId: entity.id, nodeIds: beats.filter((beat) => beat.figures.includes(entity.id) || (beat.objects ?? []).includes(entity.id)).map((beat) => `${storyId}-story-${beat.id}`),
    sourceArtifactId: ({ 'oronok-torn-heart': 'exec-f14f50a4-2d2b-4050-8e40-dac066575c55', 'gromtor-torn-heart': 'exec-f14f50a4-2d2b-4050-8e40-dac066575c55', 'artor-torn-heart': 'exec-f14f50a4-2d2b-4050-8e40-dac066575c55', 'artor-spirit': 'exec-f14f50a4-2d2b-4050-8e40-dac066575c55', 'borak-torn-heart': 'exec-f14f50a4-2d2b-4050-8e40-dac066575c55', 'earthmender-torlok': 'exec-f14f50a4-2d2b-4050-8e40-dac066575c55', 'coilskar-commander': 'exec-f14f50a4-2d2b-4050-8e40-dac066575c55', 'painmistress-gabrissa': 'exec-f14f50a4-2d2b-4050-8e40-dac066575c55', 'veneratus-the-many': 'exec-7f190769-6743-4c7b-8907-e74f8a6ea0a3', 'ruul-the-darkener': 'exec-7f190769-6743-4c7b-8907-e74f8a6ea0a3', 'cyrukh-the-firelord': 'exec-7f190769-6743-4c7b-8907-e74f8a6ea0a3', 'redeemed-elemental-spirits': 'exec-7f190769-6743-4c7b-8907-e74f8a6ea0a3', 'envoy-icarius': 'exec-7f190769-6743-4c7b-8907-e74f8a6ea0a3', 'blood-lord-zarath': 'exec-7f190769-6743-4c7b-8907-e74f8a6ea0a3', 'cipher-reassembled': 'exec-cd303156-8a95-4cda-857b-43de362d0b53', 'bloodthistle-bundle': 'exec-cd303156-8a95-4cda-857b-43de362d0b53', 'stormrage-missive': 'exec-cd303156-8a95-4cda-857b-43de362d0b53', 'cipher-fragment': 'exec-4f4d9fa8-8078-47e5-85ec-db9023f0f8ee', 'guldan-memory': 'exec-86712863-63c3-4057-bbbd-eb3568f3fa33', 'tormented-elemental-spirits': 'exec-68a73854-d5f3-4449-a6ce-5733cbe33c7f', 'totem-of-spirits': 'exec-68a73854-d5f3-4449-a6ce-5733cbe33c7f', 'domesticated-felboars': 'exec-68a73854-d5f3-4449-a6ce-5733cbe33c7f', 'ravenous-flayer-eggs': 'exec-68a73854-d5f3-4449-a6ce-5733cbe33c7f', 'lohngoron-bow': 'exec-68a73854-d5f3-4449-a6ce-5733cbe33c7f', 'rotten-arakkoa-egg': 'exec-68a73854-d5f3-4449-a6ce-5733cbe33c7f', 'tobias-filth-gorger': 'exec-68a73854-d5f3-4449-a6ce-5733cbe33c7f', 'eclipsion-disguise': 'exec-68a73854-d5f3-4449-a6ce-5733cbe33c7f', 'grand-commander-ruusk': 'exec-66c33825-4e54-4004-a23e-037dd6b3e622' })[entity.id],
    generationBrief: entity.description, promptStatus: 'Concise visual-generation brief retained; complete prompt text is not reconstructed after generation.',
    transparency: entity.field === 'mapFigure' || entity.field === 'mapVisual',
    interpretiveLimitations: 'Generated research illustration; exact model, clothing, object markings, identity of unnamed figures, and in-client resemblance require human review.',
  })),
];
const assetLedger = [];
for (const definition of definitions) {
  const full = path.join(root, 'public', definition.file);
  const bytes = await readFile(full);
  const info = await stat(full);
  assetLedger.push({ ...definition, generator: 'OpenAI ImageGen; cropped and encoded from generated PNG using ffmpeg-static 5.3.0', byteLength: bytes.length, modifiedAt: info.mtime.toISOString(), sha256: createHash('sha256').update(bytes).digest('hex'), visualReview: 'Local file, genuine alpha where specified, and intended scene assignment checked. Matching original-client area/model comparison and human approval remain open.' });
}
await out(`docs/research/${storyId}-visual-assets.json`, {
  storyId, createdAt: '2026-10-02', targetClient: 'World of Warcraft: The Burning Crusade original client era 2.0.3–2.4.3',
  reviewStatus: 'research; original-client side-by-side review open', assets: assetLedger,
});
const production = `# Cipher of Damnation visual production\n\nAll illustrations are original generated research assets, converted from PNG sheets to WebP. Character and object cutouts use alpha. Full file hashes, node usage, source image artifact IDs, target build, briefs, and review status are recorded in [the asset ledger](./${storyId}-visual-assets.json).\n\nThe Shadowmoon scenes use ash-dark ground, fractured basalt, fel-green illumination, volcanic ridges, and the muted red sky associated with the Burning Crusade zone. The Shattered Plains scene gives the tuber and flayer-egg tasks their own open plateau setting. Shattrath uses weathered stone arches and dense Lower City fabric. These are intended area traits, not claims of exact structures. Every scene is an original composition and its human side-by-side comparison with the matching Burning Crusade client remains open.\n\nImportant named figures and the four-spirit group have deliberate illustrated representations. The unnamed Coilskar commander remains explicitly unnamed. The Cipher fragment’s marks are invented visual texture and are not presented as legible canonical writing. Ar’tor’s body and spirit are distinct cutouts.\n`;
await writeFile(path.join(root, `docs/research/${storyId}-production.md`), production);

const packet = `# Research packet: ${guide.title}\n\n## Status\n\nPlayable illustrated research story. All records remain \`research\`; this is not human review or canon promotion. The ${nodes.length} scenes carry ${allWordCount} narration words, one event and claim each, and use the independent Classic-to-Wrath StoryTour.\n\n## Scene sequence\n\n${beats.map((beat, index) => `${index + 1}. **${beat.title}** — ${beat.note}`).join('\n')}\n\n## Claim and source boundaries\n\n- Oronok’s account is attributed to him.\n- Ar’tor’s death time is unknown; he appears as a spirit and is not restored to life.\n- The three son branches are separate quest branches in editorial sequence, not a single exact chronology.\n- The final Fire-spirit warning and Kael’thas mark remain open questions.\n- The level-70 Trial of the Naaru path is outside this story.\n- No exact geographic coordinates, scene routes, or surveyed layouts are asserted.\n- Blizzard’s TBC Classic guide is the sequence backbone; secondary quest text pages are locators pending original-client checking.\n\n## Visual and playback review\n\nAll ${nodes.length} scenes use locally bundled TBC-area illustrations and deliberately represented principal actors, groups, and objects. Original-client side-by-side resemblance and human lore review remain open. Audio must be generated from the finalized narration, its transcript hashes checked, and the story traversed at desktop and phone sizes before this is labeled a complete research story.\n`;
await writeFile(path.join(root, `docs/research/${storyId}-research.md`), packet);

const planPath = 'docs/IMPLEMENTATION_PLAN.md';
let plan = await readFile(path.join(root, planPath), 'utf8');
plan = plan.replace('The Dragon in Stormwind, Scepter of the Shifting Sands, Dungeon Set 2: The Veiled Blade and Lord Valthalak, The Fallen Hero and Rakh’likh, Tirion and Taelan: Of Love and Family, Darrowshire: Lost and Remembered, Karazhan: The Master’s Key and Nightbane, and Akama and the Black Temple are its eight playable stories;', 'The Dragon in Stormwind, Scepter of the Shifting Sands, Dungeon Set 2: The Veiled Blade and Lord Valthalak, The Fallen Hero and Rakh’likh, Tirion and Taelan: Of Love and Family, Darrowshire: Lost and Remembered, The Defias and the Unsent Letter, Karazhan: The Master’s Key and Nightbane, Akama and the Black Temple, Oronok and the Cipher of Damnation, and Quel’Delar: The Broken Blade Restored are its eleven playable stories;');
plan = plan.replace('The Dragon in Stormwind, Scepter of the Shifting Sands, Dungeon Set 2: The Veiled Blade and Lord Valthalak, The Fallen Hero and Rakh’likh, Tirion and Taelan: Of Love and Family, Darrowshire: Lost and Remembered, Karazhan: The Master’s Key and Nightbane, and Akama and the Black Temple are its nine playable stories;', 'The Dragon in Stormwind, Scepter of the Shifting Sands, Dungeon Set 2: The Veiled Blade and Lord Valthalak, The Fallen Hero and Rakh’likh, Tirion and Taelan: Of Love and Family, Darrowshire: Lost and Remembered, The Defias and the Unsent Letter, Karazhan: The Master’s Key and Nightbane, Akama and the Black Temple, Oronok and the Cipher of Damnation, and Quel’Delar: The Broken Blade Restored are its eleven playable stories;');
plan = plan.replace('the Outland Cipher of Damnation and Northrend Wrathgate remain research previews.', 'the Northrend Wrathgate remains a research preview.');
plan = plan.replace('the Outland Cipher of Damnation is a playable illustrated research story, while the Northrend Wrathgate remains a research preview.', 'the Northrend Wrathgate remains a research preview.');
await writeFile(path.join(root, planPath), plan);

process.stdout.write(`Authored ${nodes.length} Cipher scenes (${allWordCount} narration words), ${assetLedger.length} visual assets, ${sourceIds.length} source records, and preserved its StoryTour order ${entry.order}.\n`);
