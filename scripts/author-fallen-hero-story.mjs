import { createHash } from 'node:crypto';
import { access, mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const storyId = 'fallen-hero-and-rakhlikh';
const guideId = `${storyId}-guide`;
const eraId = 'age-of-adventurers';
const worldspaceId = 'fallen-hero-story-theater';
const artDirectory = 'public/images/storylines/fallen-hero';

async function write(file, value) {
  const fullPath = path.join(root, file);
  await mkdir(path.dirname(fullPath), { recursive: true });
  await writeFile(fullPath, typeof value === 'string' ? value : `${JSON.stringify(value, null, 2)}\n`);
}

const sources = [
  {
    id: 'fallen-hero-petty-squabbles-locator',
    title: 'Petty Squabbles quest text locator',
    url: 'https://www.wowhead.com/classic/quest=2783/petty-squabbles',
    sourceType: 'quest',
    notes: 'Accessed 2026-10-01. Secondary WoW Classic reproduction used to locate the Alliance introduction to the Fallen Hero. The original Classic client/build and complete faction variant remain to be captured and compared.',
  },
  {
    id: 'fallen-hero-horde-opening-locators',
    title: 'Horde Fallen Hero quest text locators',
    url: 'https://www.wowhead.com/classic/quest=2623/the-swamp-talker',
    sourceType: 'quest',
    notes: 'Accessed 2026-10-01. Secondary WoW Classic reproductions locate Fall From Grace (2784), The Disgraced One, The Missing Orders (2622), and The Swamp Talker (2623). They are not an original-client capture. Keep this introduction distinct from the Alliance path.',
  },
  {
    id: 'fallen-hero-tale-of-sorrow-locator',
    title: 'A Tale of Sorrow quest text locator',
    url: 'https://www.wowhead.com/classic/quest=2801/a-tale-of-sorrow',
    sourceType: 'quest',
    notes: 'Accessed 2026-10-01. Secondary WoW Classic reproduction used to locate Trebor’s shared quest account. Exact gossip, troop count and context require comparison with the original Classic build.',
  },
  {
    id: 'fallen-hero-binding-stones-locator',
    title: 'The Stones That Bind Us quest text locator',
    url: 'https://www.wowhead.com/classic/quest=2681/the-stones-that-bind-us',
    sourceType: 'quest',
    notes: 'Accessed 2026-10-01. Secondary WoW Classic reproduction used for the objective naming eighteen bound servants across Razelikh, Sevine, Allistarj, and Grol, and its completion text. The separate nineteen-soldier dialogue is left unresolved.',
  },
  {
    id: 'fallen-hero-kirith-cover-locators',
    title: 'Kirith and The Cover of Darkness quest text locators',
    url: 'https://www.wowhead.com/classic/quest=2743/the-cover-of-darkness',
    sourceType: 'quest',
    notes: 'Accessed 2026-10-01. Secondary WoW Classic reproductions for Kirith (2721) and The Cover of Darkness (2743). They locate Kirith’s spirit and his account of the three-part amulet. Do not infer Kirith’s ultimate fate from this evidence.',
  },
  {
    id: 'fallen-hero-loramus-name-locators',
    title: 'The Demon Hunter, Loramus, and The Name of the Beast locators',
    url: 'https://www.wowhead.com/classic/quest=3511/the-name-of-the-beast',
    sourceType: 'quest',
    notes: 'Accessed 2026-10-01. Secondary WoW Classic reproductions for The Demon Hunter (2744), Loramus (3141), and The Name of the Beast (3511). Used to locate the Classic-era account and Rakh’likh name; exclude the later Cataclysm retelling.',
  },
  {
    id: 'fallen-hero-felbane-weapon-locators',
    title: 'Azsharite and Felbane quest locators',
    url: 'https://www.wowhead.com/classic/quest=3625/enchanted-azsharite-fel-weaponry',
    sourceType: 'quest',
    notes: 'Accessed 2026-10-01. Secondary WoW Classic reproductions locate Azsharite (3602), The Formation of Felbane (3621), Enchanted Azsharite Fel Weaponry (3625), and Return to the Blasted Lands (3626). Collection conditions are not independent historical events; the original client route and text remain to be reviewed.',
  },
  {
    id: 'fallen-hero-amulet-locators',
    title: 'Uniting the Shattered Amulet and final quest locators',
    url: 'https://www.wowhead.com/classic/quest=3627/uniting-the-shattered-amulet',
    sourceType: 'quest',
    notes: 'Accessed 2026-10-01. Secondary WoW Classic reproductions locate quests 3627–3628, the lieutenant shards, the summoning and final return request. Quest dependency does not prove one continuous geographic route.',
  },
  {
    id: 'fallen-hero-final-quest-locator',
    title: 'You Are Rakh’likh, Demon quest text locator',
    url: 'https://www.wowhead.com/classic/quest=3628/you-are-rakhlikh-demon',
    sourceType: 'quest',
    notes: 'Accessed 2026-10-01. Secondary WoW Classic reproduction used for the final objective, Razelikh’s defeat, and the request to return the horn and ward. The requested ward destruction is not presented as a directly shown event.',
  },
];
for (const source of sources) await write(`data/sources/${source.id}.research.json`, source);

const environments = [
  {
    id: 'swamp-border', name: 'Swamp of Sorrows and the Stonard approaches', width: 744, height: 492,
    sourceArtifact: 'exec-1192c02d-840f-4931-89d4-30331d962a50.png', sourceTile: 'top-left',
    traits: 'Classic pre-Cataclysm Swamp of Sorrows: humid green-brown marsh, shallow water and mud, tangled trees, reeds and low mist. The Horde camp is rough timber, hides, rope and practical spiked defenses, never pale kaldorei ruins or the burnt palette of the Blasted Lands.',
  },
  {
    id: 'blasted-binding-field', name: 'The Blasted Lands, Trebor’s field', width: 744, height: 492,
    sourceArtifact: 'exec-1192c02d-840f-4931-89d4-30331d962a50.png', sourceTile: 'top-right',
    traits: 'Classic pre-Cataclysm Blasted Lands: scorched red-brown earth, dusty ochre sky, sparse dead trees, exposed broken ridges and volcanic stone. Keep this dry, open and hostile, sharply distinct from the swamp.',
  },
  {
    id: 'serpents-coil-cave', name: 'Serpent’s Coil on the Blasted Lands coast', width: 744, height: 492,
    sourceArtifact: 'exec-1192c02d-840f-4931-89d4-30331d962a50.png', sourceTile: 'bottom-left',
    traits: 'A low rocky cave mouth and dark damp interior set into the Blasted Lands coast, with rough stone, narrow tidal water and restrained fel light. Preserve the dry red-brown land outside the cave; this is not an invented dungeon plan.',
  },
  {
    id: 'rise-of-defiler', name: 'The Rise of the Defiler', width: 744, height: 492,
    sourceArtifact: 'exec-1192c02d-840f-4931-89d4-30331d962a50.png', sourceTile: 'bottom-right',
    traits: 'The Blasted Lands’ exposed ochre flats, dark volcanic escarpment and stark broken silhouette. Use sparse dead scrub and a distant, oppressive rise; keep landmarks broad because the art is interpretive, not a surveyed view.',
  },
  {
    id: 'azshara-coast', name: 'Azshara’s eastern coast', width: 870, height: 430,
    sourceArtifact: 'exec-71f66276-4a42-455e-b635-2dfbfed623cf.png', sourceTile: 'top-left',
    traits: 'Classic pre-Cataclysm Azshara: cold blue sea, high weathered coastal cliffs, pale stone, small islands, a broad eastern shore and cool marine haze. Do not use the lush jungle language of Stranglethorn or the scorched Blasted Lands palette.',
  },
  {
    id: 'temple-of-arkkoran', name: 'The Temple of Arkkoran', width: 870, height: 430,
    sourceArtifact: 'exec-71f66276-4a42-455e-b635-2dfbfed623cf.png', sourceTile: 'top-right',
    traits: 'The ruined coastal temple in Classic Azshara: pale weathered night-elf stone, slender broken arches, carved but eroded surfaces, blue sea and cliff edges. Keep its architecture ancient and kaldorei without copying an in-game screenshot.',
  },
  {
    id: 'azsharite-peninsula', name: 'Azshara’s azsharite shore', width: 870, height: 430,
    sourceArtifact: 'exec-71f66276-4a42-455e-b635-2dfbfed623cf.png', sourceTile: 'bottom-left',
    traits: 'A distinct Azshara coast vista with cold blue water, exposed pale cliffs and narrow stony beaches. Preserve the region’s sea-facing, wind-cut terrain and restrained blue-grey light; the composition is not an exact resource node or route.',
  },
  {
    id: 'stranglethorn-forge-camp', name: 'Galvan’s inland Stranglethorn camp', width: 870, height: 430,
    sourceArtifact: 'exec-71f66276-4a42-455e-b635-2dfbfed623cf.png', sourceTile: 'bottom-right',
    traits: 'Classic pre-Cataclysm inland Stranglethorn: dense humid green canopy, layered tropical growth, vines and warm haze, with a modest timber-and-stone camp and a working forge. This is Galvan’s inland camp, not the coastal stilt-harbor of Booty Bay.',
  },
];

const entities = [
  { id: 'trebor-fallen-hero', name: 'Trebor the Fallen Hero', type: 'character', asset: 'trebor-fallen-hero', tile: 'top-left character sheet tile', sourceArtifact: 'exec-59217d89-deec-451b-b8c4-babfc7c71f34.png', description: 'A spectral human warrior, the Fallen Hero of the Horde. The art emphasizes age, grief and the outline of a soldier; its exact armor and body details remain interpretive.' },
  { id: 'bengor', name: 'Bengor', type: 'character', asset: 'bengor', tile: 'top-middle character sheet tile', sourceArtifact: 'exec-59217d89-deec-451b-b8c4-babfc7c71f34.png', description: 'A wounded courier and witness to the Horde ambush, shown as an exhausted traveler in practical road-worn gear; no exact armor model is asserted.' },
  { id: 'kirith-damned', name: 'Kirith the Damned', type: 'character', asset: 'kirith-damned', tile: 'top-right character sheet tile', sourceArtifact: 'exec-59217d89-deec-451b-b8c4-babfc7c71f34.png', description: 'Kirith in demonic form, represented as a large felhound-like creature with a readable horned silhouette; interpretive rather than a claim about a precise Classic model.' },
  { id: 'kirith-spirit', name: 'The spirit of Kirith', type: 'character', asset: 'kirith-spirit', tile: 'bottom-left character sheet tile', sourceArtifact: 'exec-59217d89-deec-451b-b8c4-babfc7c71f34.png', description: 'A separate spectral portrayal for Kirith’s later quest-spirit appearance. This is not shown together with his demonic form and does not determine his ultimate fate.' },
  { id: 'loramus-thalipedes', name: 'Loramus Thalipedes', type: 'character', asset: 'loramus-thalipedes', tile: 'bottom-middle character sheet tile', sourceArtifact: 'exec-59217d89-deec-451b-b8c4-babfc7c71f34.png', description: 'A night-elf demon hunter whose Classic-era counsel guides the search. His clothing and weapons are interpretive and are not treated as evidence for a costume.' },
  { id: 'lord-arkkoroc', name: 'Lord Arkkoroc', type: 'character', asset: 'lord-arkkoroc', tile: 'bottom-right character sheet tile', sourceArtifact: 'exec-59217d89-deec-451b-b8c4-babfc7c71f34.png', description: 'A colossal sea giant associated with the name-gathering quest in Azshara, shown with a broad sea-worn silhouette and original details.' },
  { id: 'hetaera', name: 'Hetaera', type: 'character', asset: 'hetaera', tile: 'top-left character sheet tile', sourceArtifact: 'exec-1484c7e1-0b0b-4c28-847f-bebeda8bb310.png', description: 'A distinct creature portrait for the Hetaera quest step in Azshara. The image is an original interpretation, not a verified client model.' },
  { id: 'galvan-ancient', name: 'Galvan the Ancient', type: 'character', asset: 'galvan-ancient', tile: 'top-middle character sheet tile', sourceArtifact: 'exec-1484c7e1-0b0b-4c28-847f-bebeda8bb310.png', description: 'The craftsman at the inland Stranglethorn camp, represented as an aged forge worker. His species, costume and precise workshop arrangement remain human-review items.' },
  { id: 'archmage-allistarj', name: 'Archmage Allistarj', type: 'character', asset: 'archmage-allistarj', tile: 'top-right character sheet tile', sourceArtifact: 'exec-1484c7e1-0b0b-4c28-847f-bebeda8bb310.png', description: 'One of Razelikh’s lieutenants, represented as a fel-touched spellcaster; generated clothing and magical implements are interpretive.' },
  { id: 'lady-sevine', name: 'Lady Sevine', type: 'character', asset: 'lady-sevine', tile: 'bottom-left character sheet tile', sourceArtifact: 'exec-1484c7e1-0b0b-4c28-847f-bebeda8bb310.png', description: 'One of Razelikh’s lieutenants, given a distinct female demon silhouette with restrained fel color; exact species and costume details await Classic model review.' },
  { id: 'grol-destroyer', name: 'Grol the Destroyer', type: 'character', asset: 'grol-destroyer', tile: 'bottom-middle character sheet tile', sourceArtifact: 'exec-1484c7e1-0b0b-4c28-847f-bebeda8bb310.png', description: 'One of Razelikh’s lieutenants, represented with an ogre-like broad frame in keeping with the quest history. Armor and facial details are interpretive.' },
  { id: 'razelikh-defiler', name: 'Razelikh the Defiler', type: 'character', asset: 'razelikh-defiler', tile: 'bottom-right character sheet tile', sourceArtifact: 'exec-1484c7e1-0b0b-4c8e847f-bebeda8bb310.png', description: 'The demon summoned at the Rise of the Defiler, shown as a large, distinct horned antagonist; the art does not claim an exact in-game model.' },
  { id: 'bound-soldiers', name: 'The bound soldiers', type: 'faction', asset: 'bound-soldiers', tile: 'top-left object sheet ensemble', sourceArtifact: 'exec-1603518d-f80c-4e13-aea8-2deed1163381.png', description: 'An interpretive group representing the bound spirits released by the binding-stone quest. The artwork does not assert an exact count or roster.' },
  { id: 'binding-stone', name: 'A binding stone', type: 'artifact', asset: 'binding-stone', tile: 'top-center object sheet tile', sourceArtifact: 'exec-1603518d-f80c-4e13-aea8-2deed1163381.png', description: 'An original interpretation of a binding stone. It does not represent a surveyed stone location or exact Classic object model.' },
  { id: 'warchief-orders', name: 'The missing Warchief’s orders', type: 'artifact', asset: 'warchief-orders', tile: 'top-right object sheet tile', sourceArtifact: 'exec-1603518d-f80c-4e13-aea8-2deed1163381.png', description: 'An original paper-and-seal interpretation of the recovered orders. No legible game text is reproduced.' },
  { id: 'shattered-amulet', name: 'The shattered amulet', type: 'artifact', asset: 'shattered-amulet', tile: 'top far-right object sheet tile', sourceArtifact: 'exec-1603518d-f80c-4e13-aea8-2deed1163381.png', description: 'Three visible fragments of an original dark amulet illustration; no canonical appearance is asserted.' },
  { id: 'completed-amulet', name: 'The united amulet', type: 'artifact', asset: 'completed-amulet', tile: 'bottom-left object sheet tile', sourceArtifact: 'exec-1603518d-f80c-4e13-aea8-2deed1163381.png', description: 'An assembled version of the interpretive three-part amulet, used to distinguish the final stage from the scattered fragments.' },
  { id: 'felbane-weaponry', name: 'Felbane weaponry', type: 'artifact', asset: 'felbane-weaponry', tile: 'bottom-middle object sheet tile', sourceArtifact: 'exec-1603518d-f80c-4e13-aea8-2deed1163381.png', description: 'Interpretive fel-slaying arms prepared from azsharite. The exact selectable weapon and model are not asserted.' },
  { id: 'severed-horn', name: 'Razelikh’s horn', type: 'artifact', asset: 'severed-horn', tile: 'bottom-center object sheet tile', sourceArtifact: 'exec-1603518d-f80c-4e13-aea8-2deed1163381.png', description: 'An interpretive horn representing the requested proof of Razelikh’s defeat; it does not assert exact anatomy or object appearance.' },
  { id: 'ward-of-defiler', name: 'The Ward of the Defiler', type: 'artifact', asset: 'ward-of-defiler', tile: 'bottom far-right object sheet tile', sourceArtifact: 'exec-1603518d-f80c-4e13-aea8-2deed1163381.png', description: 'An original ward illustration returned to Trebor. The image does not assert that its requested destruction was directly shown.' },
];

const locations = [
  { id: 'swamp-of-sorrows-stonard', name: 'Swamp of Sorrows near Stonard', summary: 'Broad marshland setting for the Horde introduction; no exact path is asserted.' },
  { id: 'blasted-lands', name: 'The Blasted Lands', summary: 'Broad Classic-era region for Trebor’s account, the bound souls and the demon’s final challenge.' },
  { id: 'serpents-coil', name: 'Serpent’s Coil', summary: 'Broad coastal cave setting in the Blasted Lands for Kirith’s quest.' },
  { id: 'rise-of-defiler', name: 'The Rise of the Defiler', summary: 'The broad landmark setting for the final Razelikh encounter.' },
  { id: 'azshara-coast', name: 'Azshara', summary: 'Broad pre-Cataclysm eastern shore for Loramus’s research and the name and material quests.' },
  { id: 'temple-of-arkkoran', name: 'The Temple of Arkkoran', summary: 'Coastal Azshara site associated with Lord Arkkoroc’s quest step.' },
  { id: 'stranglethorn-vale-camp', name: 'Galvan’s camp in Stranglethorn Vale', summary: 'Inland jungle camp for Felbane’s formation; distinct from Booty Bay and no exact travel route is claimed.' },
];

const beats = [
  {
    id: 'two-roads-to-the-fallen-hero', title: 'Two roads to the Fallen Hero', env: 'blasted-binding-field', location: 'blasted-lands',
    cast: ['trebor-fallen-hero'], objects: [], sources: ['fallen-hero-petty-squabbles-locator', 'fallen-hero-horde-opening-locators'],
    quests: ['2783 · Petty Squabbles (Alliance)', '2784 · Fall From Grace; 2622 · The Missing Orders; 2623 · The Swamp Talker (Horde)'],
    text: 'The Blasted Lands are a country of exposed earth and old ruin, where Trebor’s defeat still has living consequences. Classic gives his story two introductions. The Alliance quest approaches him through a plea for common action against the Legion; the Horde chain follows lost orders and a courier’s report. These are separate faction paths, not one traveler’s shared itinerary. They meet at Trebor, whose concern has outlasted his own life: the soldiers he could not save.',
    editorNote: 'Alliance and Horde source variants are presented in one explicitly editorial opening; their characters and quests are not co-present or a single avatar route.',
  },
  {
    id: 'bengor-and-the-orders', title: 'Bengor brings the lost orders', env: 'swamp-border', location: 'swamp-of-sorrows-stonard',
    cast: ['bengor'], objects: ['warchief-orders'], sources: ['fallen-hero-horde-opening-locators'],
    quests: ['2622 · The Missing Orders; 2623 · The Swamp Talker'],
    text: 'In the Horde telling, Bengor is found wounded in the Swamp of Sorrows. He reports that the dispatch was ambushed and the Warchief’s orders lost. His testimony brings the seeker to Trebor and gives the campaign a practical beginning: before the old soldier can speak of his shame, the missing command must be recovered. The chain does not turn the Alliance introduction into the same journey; it offers another way to reach the shared wound.',
    editorNote: 'This is a Horde-only quest branch. The visual scene is a broad Swamp of Sorrows setting, not a claimed exact roadside location.',
  },
  {
    id: 'trebors-testimony', title: 'Trebor’s tale of sorrow', env: 'blasted-binding-field', location: 'blasted-lands',
    cast: ['trebor-fallen-hero'], objects: [], sources: ['fallen-hero-tale-of-sorrow-locator'],
    quests: ['2801 · A Tale of Sorrow'],
    text: 'Trebor recounts failure in battle, then a return to the Blasted Lands to rescue the men left behind. The account is one of defeat and obligation: he could not leave the captured soldiers to their torment. The reproduced Horde dialogue speaks of nineteen of his men, while the binding-stone objective counts eighteen bound servants. These are kept as two source details in tension. The surviving evidence does not resolve the difference.',
    editorNote: 'The nineteen-men versus eighteen-stones discrepancy is preserved explicitly; do not merge the populations or infer an unstated fate.',
  },
  {
    id: 'stones-that-bind', title: 'The stones that bind them', env: 'blasted-binding-field', location: 'blasted-lands',
    cast: ['trebor-fallen-hero', 'bound-soldiers'], objects: ['binding-stone'], sources: ['fallen-hero-binding-stones-locator'],
    quests: ['2681 · The Stones That Bind Us'],
    text: 'The quest objective names eighteen bound servants: nine held by Razelikh and three each by Sevine, Allistarj and Grol. Their binding is represented by stones spread across the region, with no exact placement claimed here. The quest asks the seeker to break the hold upon them. In the exposed red earth, Trebor’s old loss becomes more than a memory: it becomes a task that can still release those who suffered under his command.',
  },
  {
    id: 'the-souls-rest', title: 'The spirits may rest', env: 'blasted-binding-field', location: 'blasted-lands',
    cast: ['bound-soldiers', 'trebor-fallen-hero'], objects: ['binding-stone'], sources: ['fallen-hero-binding-stones-locator'],
    quests: ['2681 · The Stones That Bind Us · completion'],
    text: 'When the binding stones are broken, the completion text says the tortured souls can rest. It gives Trebor the mercy he had sought for his soldiers, though the count remains unsettled by the separate nineteen-men line. The story pauses over that release without supplying names for the dead or turning each stone into a separate battle. A long burden has eased; the power behind the chains still stands.',
    editorNote: 'The release is sourced. The ensemble art is interpretive and does not claim a named roster or the exact number of depicted spirits.',
  },
  {
    id: 'kirith-at-serpents-coil', title: 'Kirith at Serpent’s Coil', env: 'serpents-coil-cave', location: 'serpents-coil',
    cast: ['kirith-damned'], objects: [], sources: ['fallen-hero-kirith-cover-locators'],
    quests: ['2721 · Kirith'],
    text: 'The quest turns toward Serpent’s Coil, where Kirith the Damned bars the way. The setting changes from open badlands to a low cave mouth on the coast. There the adventurer defeats the demon and the chain yields a new account through Kirith’s spirit. The art presents the beast in a broad, readable silhouette; it is not a reconstruction of the cave’s exact layout or proof of details absent from the quest record.',
  },
  {
    id: 'kiriths-amulet-clue', title: 'The amulet has three pieces', env: 'serpents-coil-cave', location: 'serpents-coil',
    cast: ['kirith-spirit'], objects: ['shattered-amulet'], sources: ['fallen-hero-kirith-cover-locators'],
    quests: ['2721 · Kirith; 2743 · The Cover of Darkness'],
    text: 'Kirith’s spirit explains the next obstacle: Razelikh cannot be reached until the shattered amulet is made whole. Its three pieces are held by the demon’s lieutenants. The quest dialogue supplies the clue, not a new claim about Kirith’s final fate. The fragments now give the scattered work a shape. Trebor’s grievance can be answered only by confronting the power behind the bindings, and the seeker needs both knowledge and a weapon for that meeting.',
    editorNote: 'Kirith’s spirit appears after his demon quest, but the story asserts no later fate or metaphysical explanation beyond the source text.',
  },
  {
    id: 'loramus-in-azshara', title: 'Loramus and the demon hunter’s counsel', env: 'azshara-coast', location: 'azshara-coast',
    cast: ['loramus-thalipedes'], objects: [], sources: ['fallen-hero-loramus-name-locators'],
    quests: ['2744 · The Demon Hunter; 3141 · Loramus'],
    text: 'The chain reaches Loramus Thalipedes on Azshara’s cold eastern shore. In the Classic quest account, the demon hunter helps direct the work that lies ahead: learn the demon’s true name and prepare a means to challenge him. The coast is broad and wind-cut, a different world from the Blasted Lands’ dry scar. This telling uses Loramus’s Classic-era counsel only; later retellings of his story do not replace what this quest chain records.',
    editorNote: 'Use Classic quest evidence for Loramus. Later Cataclysm retelling and outcomes are excluded from this story.',
  },
  {
    id: 'name-of-the-beast', title: 'The name behind the title', env: 'temple-of-arkkoran', location: 'temple-of-arkkoran',
    cast: ['hetaera', 'lord-arkkoroc'], objects: [], sources: ['fallen-hero-loramus-name-locators'],
    quests: ['3511 · The Name of the Beast and its preceding steps'],
    text: 'The search crosses Azshara’s pale coastal ruins, where the quest steps call for Hetaera’s blood and seek Lord Arkkoroc’s knowledge. The demon known as Razelikh the Defiler bears a truer name: Rakh’likh. That distinction is the chain’s discovery. Here, the old temple stone and blue water frame a hunt for usable knowledge, not a claim that every step took place in one room or followed an exact route along the coast.',
    editorNote: 'The multi-step chain is grouped as a knowledge-gathering episode; characters are not asserted to be co-present at a single site.',
  },
  {
    id: 'azsharite-for-felbane', title: 'Azsharite for the weapon', env: 'azsharite-peninsula', location: 'azshara-coast',
    cast: ['loramus-thalipedes'], objects: ['felbane-weaponry'], sources: ['fallen-hero-felbane-weapon-locators'],
    quests: ['3602 · Azsharite'],
    text: 'A name alone cannot break Razelikh’s hold. The chain next calls for azsharite, a material gathered in Azshara and brought into the weapon-making task. The quest’s collection condition is not retold as a count or a single dramatic excavation. What changes is the preparation: the hunt has found its target, and the seeker now carries material chosen for the Felbane armament that will make the final confrontation possible.',
  },
  {
    id: 'galvans-felbane-forge', title: 'Felbane takes shape', env: 'stranglethorn-forge-camp', location: 'stranglethorn-vale-camp',
    cast: ['galvan-ancient'], objects: ['felbane-weaponry'], sources: ['fallen-hero-felbane-weapon-locators'],
    quests: ['3621 · The Formation of Felbane; 3625 · Enchanted Azsharite Fel Weaponry'],
    text: 'At Galvan’s camp in inland Stranglethorn, the material becomes Felbane weaponry. The green canopy, hanging vines and warm air make the setting recognizably different from Azshara’s coast; this is no harbor scene at Booty Bay. Galvan’s part is the transformation of gathered material into a prepared weapon. The records support the chain’s order and purpose, while the exact craft process and selectable weapon form remain matters for comparison with the Classic client.',
    editorNote: 'The target is Galvan’s inland camp between the named Stranglethorn landmarks, not Booty Bay. Composition is an original area impression.',
  },
  {
    id: 'return-to-blasted-lands', title: 'Return with the forged weapons', env: 'blasted-binding-field', location: 'blasted-lands',
    cast: ['trebor-fallen-hero'], objects: ['felbane-weaponry', 'shattered-amulet'], sources: ['fallen-hero-felbane-weapon-locators', 'fallen-hero-amulet-locators'],
    quests: ['3626 · Return to the Blasted Lands; 3627 · Uniting the Shattered Amulet'],
    text: 'The quest line turns back to Trebor with the weapon prepared and the amulet’s scattered fragments to unite. This is an editorial journey through quest destinations, not a drawn route: its tasks name the regions but do not document each road taken. The exposed Blasted Lands return as the place where old bonds and new preparations converge. The demon’s title, the weapon and the amulet are now part of one effort to reach the Rise.',
  },
  {
    id: 'the-three-lieutenants', title: 'Three lieutenants, three fragments', env: 'blasted-binding-field', location: 'blasted-lands',
    cast: ['archmage-allistarj', 'lady-sevine', 'grol-destroyer'], objects: ['completed-amulet'], sources: ['fallen-hero-binding-stones-locator', 'fallen-hero-kirith-cover-locators', 'fallen-hero-amulet-locators'],
    quests: ['2743 · The Cover of Darkness; 3627 · Uniting the Shattered Amulet'],
    text: 'The remaining amulet pieces come from Razelikh’s lieutenants: Allistarj, Sevine and Grol. Their encounters are separate, not one gathering in a field. In the tour they form a deliberate triptych, a memorial arrangement of three independent confrontations. When the fragments are brought together, the amulet is whole. Its completion opens the way that Kirith described, though the precise order of lieutenant encounters is not treated as a historical sequence beyond the quest dependency.',
    editorNote: 'Three separate lieutenant encounters are displayed as an editorial triptych; the figures are not co-present and no canonical order is claimed.',
  },
  {
    id: 'summoning-rakhlikh', title: 'At the Rise of the Defiler', env: 'rise-of-defiler', location: 'rise-of-defiler',
    cast: ['trebor-fallen-hero', 'razelikh-defiler'], objects: ['completed-amulet', 'felbane-weaponry'], sources: ['fallen-hero-amulet-locators'],
    quests: ['3628 · You Are Rakh’likh, Demon'],
    text: 'At the Rise of the Defiler, the united amulet lets the seeker bring the demon into the final contest. The known title falls away before the true name: Razelikh is Rakh’likh. Trebor’s old appeal has led here, from the souls once bound by the demon’s servants to a challenge against their master. The quests frame the meeting as a dangerous group confrontation but give no fixed battle formation. At the Rise, every preparation finds its purpose against the master whose servants once held Trebor’s soldiers.',
    editorNote: 'Generated figures are an editorial arrangement. The source does not establish an exact battle formation or the simultaneous presence of every represented person.',
  },
  {
    id: 'horn-and-ward', title: 'A sign of hope, and an unfinished charge', env: 'rise-of-defiler', location: 'rise-of-defiler',
    cast: ['trebor-fallen-hero', 'razelikh-defiler'], objects: ['severed-horn', 'ward-of-defiler'], sources: ['fallen-hero-final-quest-locator'],
    quests: ['3628 · You Are Rakh’likh, Demon · objective, completion and return request'],
    text: 'The final quest records Razelikh’s defeat and asks that his horn be returned to Trebor as a sign of hope. It also asks for the Ward of the Defiler so Trebor can destroy it. The request is clear; the destruction itself is not shown as a completed event in the evidence used here. Trebor’s story reaches a hard-won answer for the bound souls and the demon who held them. It does not record the fall of the Burning Legion, or every fate within its reach.',
    editorNote: 'Keep the outcome limited to Razelikh’s defeat and the return requested by the quest. Do not claim that Trebor is shown destroying the ward or that the Burning Legion is defeated.',
  },
];

const allSourceIds = [...new Set(beats.flatMap((beat) => beat.sources))];
const usedEntityIds = [...new Set(beats.flatMap((beat) => [...beat.cast, ...beat.objects]))];
const entityById = new Map(entities.map((item) => [item.id, item]));
const environmentById = new Map(environments.map((item) => [item.id, item]));
const objectDimensions = new Map([
  ['galvan-ancient', [470, 512]],
  ['bound-soldiers', [590, 430]],
  ['binding-stone', [300, 430]],
  ['warchief-orders', [460, 430]],
  ['shattered-amulet', [430, 430]],
  ['completed-amulet', [480, 447]],
  ['felbane-weaponry', [430, 447]],
  ['severed-horn', [440, 447]],
  ['ward-of-defiler', [434, 447]],
]);

for (const environment of environments) {
  const assetPath = `${artDirectory}/${environment.id}.research.webp`;
  await access(path.join(root, assetPath));
  await write(`data/map-states/${storyId}-${environment.id}.research.json`, {
    id: `${storyId}-${environment.id}-scene`,
    name: `The Fallen Hero: ${environment.name} illustrated scene`,
    worldspaceId,
    presentation: 'relational',
    terrainTextureAsset: `images/storylines/fallen-hero/${environment.id}.research.webp`,
    geometryIds: [],
    cartographyLabel: 'ILLUSTRATED QUESTLINE THEATER',
    interpretationNote: `Original AI-generated landscape for ${environment.name}. Target edition: pre-Cataclysm World of Warcraft Classic area identity. Preserve these recognizable traits: ${environment.traits} This is an original interpretive scene, not a screenshot, surveyed geography, exact dungeon layout, fixed route or evidence of character co-presence. See docs/research/fallen-hero-and-rakhlikh-visual-assets.json for the matching-build review gate.`,
  });
}

for (const entityId of usedEntityIds) {
  const item = entityById.get(entityId);
  if (!item) throw new Error(`Missing entity declaration: ${entityId}`);
  const assetPath = `images/storylines/fallen-hero/${item.asset}.research.webp`;
  await access(path.join(root, 'public', assetPath));
  await write(`data/entities/${item.id}.research.json`, {
    id: item.id,
    type: item.type,
    name: item.name,
    slug: item.id,
    shortDescription: `${item.name}, represented in the Classic research story.`,
    body: `${item.description} This is original interpretive art, not canonical game art or evidence for exact appearance, location, or event. See the story's visual asset ledger for the matching-build review gate.`,
    firstEraId: eraId,
    featuredEraIds: [eraId],
    sourceIds: [...new Set(beats.filter((beat) => beat.cast.includes(item.id) || beat.objects.includes(item.id)).flatMap((beat) => beat.sources))],
    tags: ['fallen-hero-story', 'interpretive-art'],
    ...(item.type === 'character'
      ? { mapFigure: { asset: assetPath, scale: ['razelikh-defiler', 'lord-arkkoroc'].includes(item.id) ? 1 : 0.82 } }
      : { mapVisual: { asset: assetPath, scale: item.type === 'artifact' ? 0.68 : 0.86 } }),
    contentStatus: 'research',
  });
}

const slots = new Map();
for (const id of usedEntityIds) {
  const neighbors = new Set(beats.filter((beat) => beat.cast.includes(id) || beat.objects.includes(id)).flatMap((beat) => [...beat.cast, ...beat.objects]));
  const occupied = new Set([...neighbors].map((neighbor) => slots.get(neighbor)).filter((slot) => slot !== undefined));
  let slot = 0;
  while (occupied.has(slot)) slot++;
  slots.set(id, slot);
}
const columnCount = Math.max(...slots.values()) + 1;
const features = [];
for (const id of usedEntityIds) {
  const x = 3000 + (slots.get(id) * 4000) / Math.max(1, columnCount - 1);
  const geometryId = `${storyId}-${id}-focus`;
  features.push({
    type: 'Feature',
    id: geometryId,
    properties: { name: `${entityById.get(id).name} editorial focus`, contentStatus: 'research', styleRole: 'site', geographicCertainty: 'unknown' },
    geometry: { type: 'Point', coordinates: [x, 5400] },
  });
  const relevantSources = [...new Set(beats.filter((beat) => beat.cast.includes(id) || beat.objects.includes(id)).flatMap((beat) => beat.sources))];
  await write(`data/spatial-states/${storyId}-${id}.research.json`, {
    id: `${storyId}-${id}-theater`, entityId: id, eraId, worldspaceId, geometryId,
    placementKind: 'relational', geographicCertainty: 'unknown', sourceIds: relevantSources,
    editorNote: 'Editorial figure/object placement in an illustrated story theater. It asserts no map position, travel route, exact formation, or unsupported co-presence.',
    visualPresence: 'contextual', labelPriority: 240,
  });
}
await write(`data/geometry/${storyId}-theater.research.geojson`, { type: 'FeatureCollection', features });
await write(`data/worldspaces/${worldspaceId}.research.json`, {
  id: worldspaceId,
  name: 'The Fallen Hero — relational story theater',
  slug: worldspaceId,
  coordinateSystem: { width: 10000, height: 10000, origin: 'bottom-left', units: 'atlas-units' },
});

for (const location of locations) {
  const supportingSources = [...new Set(beats.filter((beat) => beat.location === location.id).flatMap((beat) => beat.sources))];
  await write(`data/entities/${location.id}.research.json`, {
    id: location.id, type: 'location', name: location.name, slug: location.id,
    shortDescription: location.summary,
    body: `${location.summary} Geography is broad and interpretive; the story does not assert a route or exact marker.`,
    firstEraId: eraId, featuredEraIds: [eraId], sourceIds: supportingSources,
    tags: ['fallen-hero-story', 'classic-era-location'], contentStatus: 'research',
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
    const questRef = beat.quests[Math.min(sourceIndex, beat.quests.length - 1)];
    await write(`data/citations/${citationId}.research.json`, {
      id: citationId,
      sourceId,
      section: `${questRef ? `${questRef} · ` : ''}${beat.title}; directly relevant quest description, objective, completion, gossip or chain entry`,
      ...(questRef ? { questId: questRef } : {}),
      note: 'Narration is an original paraphrase of an accessible Classic quest reproduction. This secondary locator is not an original-client capture; compare the intended pre-Cataclysm Classic build and released text before human lore approval.',
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
    editorNote: beat.editorNote ?? 'Research status: accessible Classic quest pages are secondary reproductions, not captures from a running original client. Keep the stated evidence limits visible until build comparison and human approval.',
  });
  const participantEntityIds = [...new Set(beat.cast)];
  await write(`data/events/${eventId}.research.json`, {
    id: eventId,
    kind: 'event',
    name: beat.title,
    slug: `${storyId}-${beat.id}`,
    eraId,
    worldspaceId,
    date: { precision: 'relative', label: 'Original World of Warcraft Classic · Fallen Hero quest chain; exact dating unknown' },
    summary: beat.text,
    locationIds: [beat.location],
    participantEntityIds,
    sourceIds: beat.sources,
    claimIds: [claimId],
    contentStatus: 'research',
  });
  const entityIds = [...new Set([...beat.cast, ...beat.objects])];
  nodes.push({
    id: nodeId,
    guideId,
    title: beat.title,
    narration: beat.text,
    durationMs: Math.round(((beat.text.split(/\s+/).length / 82) * 60_000) / 500) * 500 + 5_000,
    eventIds: [eventId],
    entityIds,
    locationIds: [beat.location],
    camera: { position: [0, 6.15, 5.4], target: [0, 0, 0], durationMs: 1150 },
    visualActions: [{ type: 'set_map_state', mapStateId: `${storyId}-${beat.env}-scene` }],
    ...(index > 0 ? { previousNodeId: nodes[index - 1].id } : {}),
    ...(index < beats.length - 1 ? { nextNodeIds: [`${storyId}-story-${beats[index + 1].id}`] } : {}),
  });
}

const chapters = [
  { id: 'two-roads-and-the-old-wound', title: 'Two Roads and the Old Wound', start: 0, end: 3, body: 'Separate Alliance and Horde introductions reach Trebor. His testimony turns an old defeat into a present concern for bound soldiers, preserving the unresolved eighteen-stone and nineteen-men discrepancy.' },
  { id: 'release-and-the-amulet', title: 'Release and the Amulet', start: 4, end: 6, body: 'The soldiers’ spirits may rest, but the demon’s power remains. Kirith’s spirit explains that three amulet fragments are needed to call Razelikh.' },
  { id: 'a-name-and-a-weapon', title: 'A Name and a Weapon', start: 7, end: 11, body: 'In Classic-era Azshara, Loramus’s counsel leads toward the name Rakh’likh and azsharite. At Galvan’s inland Stranglethorn camp, that preparation becomes Felbane weaponry before the quest chain returns to the Blasted Lands.' },
  { id: 'the-defiler-unbound', title: 'The Defiler Unbound', start: 12, end: 14, body: 'The three lieutenant fragments restore the amulet. At the Rise of the Defiler, Razelikh is defeated; his horn is requested as a sign of hope and the ward is returned for Trebor to destroy, an outcome the cited quest does not directly show.' },
].map(({ id, title, start, end, body }) => ({
  id, eraId, title,
  body: `${body} Scenes ${start + 1}–${end + 1}.`,
}));

const existingStoryPath = path.join(root, 'data/stories/fallen-hero-and-rakhlikh.research.json');
let existingStory;
try {
  existingStory = JSON.parse(await readFile(existingStoryPath, 'utf8'));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
for (const node of nodes) {
  const previousNode = existingStory?.nodes?.find((item) => item.id === node.id && item.narration === node.narration);
  if (previousNode?.voiceover) node.voiceover = previousNode.voiceover;
}
const voiceTrackCount = nodes.filter((node) => node.voiceover).length;
const voiceDurationMs = nodes.reduce((sum, node) => sum + (node.voiceover?.durationMs ?? 0), 0);

const guide = {
  id: guideId,
  eraId,
  title: 'The Fallen Hero and Rakh’likh',
  description: 'A 15-scene Classic research chronicle follows two faction introductions to Trebor’s testimony, the release of his bound soldiers, the hunt for a demon’s true name and the forged weapon used to confront Razelikh.',
  nodeIds: nodes.map((node) => node.id),
  contentStatus: 'research',
};
await write(`data/stories/${storyId}.research.json`, { guide, nodes });

const storyline = {
  id: storyId,
  slug: storyId,
  title: 'The Fallen Hero and Rakh’likh',
  summary: 'Two faction paths lead to Trebor, whose return to the Blasted Lands is bound to his captured soldiers. Their spirits are freed, and the search for a demon’s true name and a Felbane weapon leads to Razelikh.',
  opening: 'An old soldier’s defeat has not ended his duty. Across separate Alliance and Horde introductions, the trail reaches Trebor and the soldiers still held by the powers of the Blasted Lands.',
  primaryEraId: eraId,
  eraIds: [eraId],
  chapters,
  sourceIds: allSourceIds,
  storyGuideId: guideId,
  reviewNote: 'Complete 15-scene illustrated research story with linked source/citation/claim/event records, distinct faction openings, a separate Horde courier scene, Classic area-specific art, principal cast and pivotal objects. '
    + voiceTrackCount + ' transcript-matched AI narration tracks are generated (' + Math.round(voiceDurationMs / 1000) + ' seconds total) and still require human listening and pronunciation review. '
    + 'Quest and dialogue details are currently traced through secondary Classic database reproductions; capture the original 1.12-era client/build before human lore approval. The eighteen-stone/nineteen-soldier conflict stays unresolved; the lieutenant scenes are independent encounters; Loramus’s later Cataclysm retelling is excluded; the ward is returned for Trebor to destroy but its destruction is not asserted as shown; and Razelikh’s defeat is not the defeat of the Burning Legion. The art is original and interpretive; compare each place and character to the matching Classic build before approval.',
  contentStatus: 'research',
};
await write(`data/storylines/${storyId}.research.json`, storyline);

const eraPath = `data/eras/${eraId}.research.json`;
const era = JSON.parse(await readFile(path.join(root, eraPath), 'utf8'));
era.sourceIds = [...new Set([...era.sourceIds, ...allSourceIds])];
await write(eraPath, era);

const sourceById = new Map(sources.map((source) => [source.id, source]));
const allAssets = [];
for (const environment of environments) {
  const file = `${artDirectory}/${environment.id}.research.webp`;
  const [bytes, info] = await Promise.all([readFile(path.join(root, file)), stat(path.join(root, file))]);
  const references = [...new Set(beats.filter((beat) => beat.env === environment.id).flatMap((beat) => beat.sources))];
  allAssets.push({
    id: environment.id, kind: 'environment', file, area: environment.name,
    pixelWidth: environment.width, pixelHeight: environment.height,
    sourceArtifact: environment.sourceArtifact, sourceTile: environment.sourceTile,
    targetEditionBuild: 'Original World of Warcraft Classic, pre-Cataclysm zone identity; target original 1.12-era quest build, exact in-client comparison remains open.',
    recognizableTraits: environment.traits,
    visualReference: {
      editionBuild: 'Original World of Warcraft Classic, pre-Cataclysm zone identity.',
      sourceReferences: references.map((id) => ({ sourceId: id, url: sourceById.get(id)?.url })),
      comparisonCapture: 'No in-client comparison screenshot is claimed. Human side-by-side review against the matching Classic zone/build remains open.',
    },
    generationPrompt: `Original painterly landscape for ${environment.name}. Match the recognizable Classic-era place with these traits: ${environment.traits} Composition must remain original and interpretive, with no UI, text, copied screenshot, exact coordinate, or unsupported event. This selected landscape tile was cropped from an OpenAI ImageGen contact sheet.`,
    generator: 'OpenAI ImageGen; generated contact-sheet landscape tile, cropped and converted to WebP by scripts/crop-fallen-hero-art.mjs.',
    transparency: false,
    visualReview: 'The scene has been compared to its authored trait list and its zone palette remains distinct from other story locations. Human comparison to the matching in-game Classic area/build remains open.',
    sourceReferences: references.map((id) => ({ sourceId: id, url: sourceById.get(id)?.url })),
    byteLength: bytes.length,
    modifiedAt: info.mtime.toISOString(),
    sha256: createHash('sha256').update(bytes).digest('hex'),
  });
}
for (const subject of entities.filter((item) => usedEntityIds.includes(item.id))) {
  const file = `${artDirectory}/${subject.asset}.research.webp`;
  const [bytes, info] = await Promise.all([readFile(path.join(root, file)), stat(path.join(root, file))]);
  const references = [...new Set(beats.filter((beat) => beat.cast.includes(subject.id) || beat.objects.includes(subject.id)).flatMap((beat) => beat.sources))];
  const [pixelWidth, pixelHeight] = objectDimensions.get(subject.id) ?? [512, 512];
  allAssets.push({
    id: subject.id, kind: subject.type, file, representedBy: subject.name,
    pixelWidth, pixelHeight,
    sourceArtifact: subject.sourceArtifact, sourceTile: subject.tile,
    targetEditionBuild: 'Original World of Warcraft Classic story identity; exact character or object model comparison remains open.',
    recognizableTraits: subject.description,
    generationPrompt: `Original isolated interpretation of ${subject.name}: ${subject.description} Preserve a distinctive readable silhouette and clear subject identity. No text, border or scene background; transparent cutout, original art, not canonical game art.`,
    generator: 'OpenAI ImageGen; generated transparent cutout contact-sheet tile, cropped and converted to alpha-capable WebP by scripts/crop-fallen-hero-art.mjs.',
    transparency: true,
    visualReference: {
      editionBuild: 'Original World of Warcraft Classic, pre-Cataclysm zone and character identity.',
      sourceReferences: references.map((id) => ({ sourceId: id, url: sourceById.get(id)?.url })),
      comparisonCapture: 'Generated art is not game art. Human comparison to the matching Classic model and presentation remains open.',
    },
    visualReview: 'Distinct subject identity is legible in the generated cutout. Costume/model, species, exact object shape and resemblance to the matching Classic build require human review.',
    sourceReferences: references.map((id) => ({ sourceId: id, url: sourceById.get(id)?.url })),
    byteLength: bytes.length,
    modifiedAt: info.mtime.toISOString(),
    sha256: createHash('sha256').update(bytes).digest('hex'),
  });
}

const sceneLedger = beats.map((beat, index) => {
  const environment = environmentById.get(beat.env);
  return {
    nodeId: nodes[index].id,
    title: beat.title,
    environmentPath: `${artDirectory}/${beat.env}.research.webp`,
    gameArea: environment.name,
    referenceEditionBuild: 'Original World of Warcraft Classic, pre-Cataclysm zone identity; target 1.12-era quest build.',
    recognizableTraits: environment.traits,
    resemblanceReview: 'Artistic trait check recorded; in-game side-by-side capture and human matching-build approval remain open.',
    cast: beat.cast.map((id) => ({ id, name: entityById.get(id).name, image: `${artDirectory}/${entityById.get(id).asset}.research.webp` })),
    objects: beat.objects.map((id) => ({ id, name: entityById.get(id).name, image: `${artDirectory}/${entityById.get(id).asset}.research.webp` })),
    visualActions: ['set_map_state', 'show contextual illustrated cast and objects'],
    geographyAndChronologyNote: beat.editorNote ?? 'Order follows Classic quest dependencies. The scene uses a relational theater and broad place records, not a route or surveyed location.',
    claimIds: [`${storyId}-${beat.id}-claim`],
  };
});
await write('docs/research/fallen-hero-and-rakhlikh-visual-assets.json', {
  storyId,
  status: 'research',
  targetEditionBuild: 'Original World of Warcraft Classic / pre-Cataclysm areas; target quest build 1.12-era. Current Classic recreations are locators only.',
  editorialRule: 'For every released game area, preserve recognizable version-specific palette, architecture, terrain, vegetation, skyline and landmark shapes using original compositions. Compare each generated scene with the matching Classic in-game area before approval.',
  sourceProvenance: 'All original environment, character, group and object illustrations were generated with OpenAI ImageGen. Contact sheets were cropped into independent WebP assets with scripts/crop-fallen-hero-art.mjs. No official or scraped game art is included.',
  assetRecords: allAssets,
  sceneLedger,
});

let production = `# The Fallen Hero and Rakh’likh — production and claim ledger\n\n`;
production += `Status: complete illustrated research story; not reviewed or published. ${nodes.length} scenes; ${nodes.reduce((sum, node) => sum + node.narration.split(/\s+/).length, 0)} narration words. Primary era: Era 8 / original World of Warcraft Classic, before Cataclysm.\n\n`;
production += '## Evidence boundary\n\nQuest descriptions, objectives and dialogue are paraphrased from accessible secondary Classic database reproductions. They are useful locators, not original-client captures. The original 1.12-era build and any Wrath-era differences must be reviewed before human lore approval. The eighteen binding stones and separate dialogue about nineteen soldiers remain unreconciled. The two faction openings are mutually exclusive; the lieutenant fights are independent; and the Classic Loramus account is kept separate from the Cataclysm retelling.\n\n';
production += `Sources: ${allSourceIds.map((id) => `[${id}](${sourceById.get(id).url})`).join('; ')}.\n\n`;
production += '## Quest dependencies and historical scenes\n\nAlliance: 2783 · Petty Squabbles. Horde: 2784 · Fall From Grace → The Disgraced One → 2622 · The Missing Orders → 2623 · The Swamp Talker. Shared chain: 2801 · A Tale of Sorrow → 2681 · The Stones That Bind Us → 2721 · Kirith → 2743 · The Cover of Darkness → 2744 · The Demon Hunter → 3141 · Loramus → 3508 · Breaking the Ward → 3511 · The Name of the Beast and its steps → 3602 · Azsharite → 3621 · The Formation of Felbane → 3625 · Enchanted Azsharite Fel Weaponry → 3626 · Return to the Blasted Lands → 3627 · Uniting the Shattered Amulet → 3628 · You Are Rakh’likh, Demon. Heroes of Old is treated as a prerequisite/side passage; its Shard of Afrasa handoff is not inflated into a historical event. Repeatable collection steps are not narrated as unique history.\n\n';
production += '## Scene and claim ledger\n\n| Scene | Quest evidence | Cast / objects | Classic area traits | Geography, branch and uncertainty |\n| --- | --- | --- | --- | --- |\n';
for (const [index, beat] of beats.entries()) {
  const environment = environmentById.get(beat.env);
  production += `| ${nodes[index].title} | ${beat.quests.join('; ')} · ${beat.sources.join(', ')} | ${[...beat.cast, ...beat.objects].join(', ')} | ${environment.name}: ${environment.traits} | ${beat.editorNote ?? 'Quest order is editorially presented; no exact route or location is asserted.'} |\n`;
}
production += '\n## Visual, audio and review notes\n\nEvery scene has an environment illustration, and every named principal, embodied group and pivotal object has a dedicated repository-backed visual. Exact prompts, source sheets, pixel sizes, asset hashes, game-area traits and review status are in [fallen-hero-and-rakhlikh-visual-assets.json](fallen-hero-and-rakhlikh-visual-assets.json). The map theater is relational; it does not assert exact coordinates, a route or unsupported co-presence. The inland Stranglethorn forge camp is depicted as a humid jungle worksite, distinct from Booty Bay’s coastal timber harbor.\n\nThe Storyline uses the existing StoryGuide and Classic-to-Wrath StoryTour. It is not inserted into EraTour. The guide’s transcript is the accessible source of truth if WebGL or audio is unavailable. All transcript-matched narration tracks are included with measured durations and transcript/audio hashes in the shared voice manifest; pronunciation and listening approval remain open.\n\nHuman gates: capture and compare original Classic quest text/build; review faction variants and the eighteen/nineteen count; confirm Trebor, Kirith, Loramus and lieutenant identities; compare every illustration against the matching pre-Cataclysm game area and character model; audit voice pronunciation; and approve all source/claim records. The requested ward destruction and a Legion-wide defeat are not claimed.\n';
await write('docs/research/fallen-hero-and-rakhlikh-production.md', production);

const tourPath = 'data/story-tours/classic-to-wrath.research.json';
const tour = JSON.parse(await readFile(path.join(root, tourPath), 'utf8'));
const tourEntry = {
  storylineId: storyId,
  regionIds: ['eastern-kingdoms', 'kalimdor'],
  mapPositionPercent: [63, 58],
  order: 4,
  periodLabel: 'Original World of Warcraft · Classic',
  locationLabel: 'Blasted Lands · the Fallen Hero',
};
tour.entries = [...tour.entries.filter((entry) => entry.storylineId !== storyId), tourEntry];
const authoredOrder = new Map([
  ['stormwind-onyxia-conspiracy', 1],
  ['scepter-of-the-shifting-sands', 2],
  ['dungeon-set-two-veiled-blade', 3],
  [storyId, 4],
  ['karazhan-masters-key-and-nightbane', 5],
  ['cipher-of-damnation-oronok', 6],
  ['wrathgate-and-undercity', 7],
]);
for (const entry of tour.entries) entry.order = authoredOrder.get(entry.storylineId) ?? entry.order;
tour.entries.sort((a, b) => a.order - b.order);
tour.chronologyNote = 'Play-all order is an editorial expansion-era sequence: original Classic (Onyxia, the Scepter campaign, Dungeon Set 2, then the Fallen Hero chain), The Burning Crusade (Karazhan before the Outland Cipher of Damnation preview), and Wrath of the Lich King (Wrathgate preview). It organizes access and does not claim the selected storylines caused one another. Scepter’s ancient prologue is an explicitly earlier flashback; Dungeon Set 2’s companion fates are alternative accounts; and the Fallen Hero’s Alliance and Horde openings are mutually exclusive routes into the shared chain.';
tour.reviewNote = 'Playable guide entries: Classic Onyxia, Scepter, Dungeon Set 2 and the Fallen Hero; plus the complete TBC Karazhan research guide. The Outland Cipher of Damnation and Northrend Wrathgate remain previews outside Play All. Original-client quest/build, faction variant, chronology, map-art and matching in-game area/model reviews remain open for human approval.';
await write(tourPath, tour);

const candidatesPath = 'docs/research/questline-story-candidates.md';
let candidates = await readFile(path.join(root, candidatesPath), 'utf8');
candidates = candidates.replace(
  /^(### 04\. The Fallen Hero and Rakh'likh\r?\n)[\s\S]*?(?=^### 05\.)/m,
  '$1\n\n**Implementation:** Complete 15-scene illustrated research story with two explicitly separate faction openings, source/claim ledger, Classic area-specific environment and cast art, and a Classic-to-Wrath StoryTour map marker. The eighteen-stone/nineteen-soldier discrepancy remains open. See the [production ledger](fallen-hero-and-rakhlikh-production.md) and [visual asset ledger](fallen-hero-and-rakhlikh-visual-assets.json). Original-client comparison, source review, matching-build area/model comparison, and voice audition remain human gates.\n\n',
);
await write(candidatesPath, candidates);

process.stdout.write(`Authored ${nodes.length} illustrated story nodes, ${usedEntityIds.length} represented subjects, ${environments.length} Classic-area environments, and ${sources.length} sources.\n`);
