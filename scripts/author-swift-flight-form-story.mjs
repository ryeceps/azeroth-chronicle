import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import process from 'node:process';

const root = process.cwd();
const id = 'swift-flight-form-raven-legacy';
const eraId = 'age-of-adventurers';
const guideId = id + '-guide';
const theaterId = id + '-theater';
const imageDir = 'images/storylines/swift-flight-form';
const storyPath = join(root, 'data', 'stories', id + '.research.json');
const previousNodes = new Map();
try {
  const previous = JSON.parse(await readFile(storyPath, 'utf8'));
  for (const node of previous.nodes ?? []) previousNodes.set(node.id, node);
} catch (error) {
  if (error?.code !== 'ENOENT') throw error;
}

const sourceDefs = [
  ['chain', 'Swift Flight Form quest chain', 'https://warcraft.wiki.gg/wiki/Swift_Flight_Form_quest_chain', 'quest', 'Secondary sequence locator for the 17-quest TBC Druid chain. It does not replace primary-client capture.'],
  ['morthis-start', 'Morthis Whisperwing (quest)', 'https://warcraft.wiki.gg/wiki/Morthis_Whisperwing_(quest)', 'quest', 'Secondary quest-text locator for Morthis’s offer and opening handoff.'],
  ['ward', 'The Ward of Wakening', 'https://warcraft.wiki.gg/wiki/The_Ward_of_Wakening', 'quest', 'Secondary quest-text locator for Morthis’s preparation task and ward. Repeated ingredient gathering is not narrated as history.'],
  ['waking', 'Waking the Sleeper', 'https://warcraft.wiki.gg/wiki/Waking_the_Sleeper', 'quest', 'Secondary quest-text locator for Clintar, the southern Stormrage Barrow Den, and the waking potion.'],
  ['dream', 'No Mere Dream', 'https://warcraft.wiki.gg/wiki/No_Mere_Dream', 'quest', 'Secondary locator for Clintar’s divided spirit, Relics of Aviana, Dreamwarden Lurosa, and the Aspect of the Raven. Exact chamber for the apparition remains unknown.'],
  ['return-morthis', 'Return to Morthis Whisperwing', 'https://warcraft.wiki.gg/wiki/Return_to_Morthis_Whisperwing', 'quest', 'Secondary quest-text locator for the relic report and unresolved concern.'],
  ['evergrove', 'To the Evergrove', 'https://warcraft.wiki.gg/wiki/To_the_Evergrove', 'quest', 'Secondary quest-text locator for Morthis’s lead to Arthorn Windsong and the raven-cult inquiry.'],
  ['book', 'The Book of the Raven (quest)', 'https://warcraft.wiki.gg/wiki/The_Book_of_the_Raven_(quest)', 'quest', 'Secondary locator for Arthorn, Timeon, the Seer’s Stone, an aether ray eye, and Sai’kkal’s account.'],
  ['eyes', 'Eyes in the Sky', 'https://warcraft.wiki.gg/wiki/Eyes_in_the_Sky', 'quest', 'Secondary quest-text locator for the handoff to Watcher Elaira at Twilight Ridge.'],
  ['sparrowhawk', 'To Catch A Sparrowhawk', 'https://warcraft.wiki.gg/wiki/To_Catch_A_Sparrowhawk', 'quest', 'Secondary quest-text locator for Elaira’s sparrowhawk search and intended release after training.'],
  ['stones', 'The Raven Stones', 'https://warcraft.wiki.gg/wiki/The_Raven_Stones', 'quest', 'Secondary locator for the Skettis fragments, reconstructed book, Anzu identification, and account of the captive bird spirits.'],
  ['eagle', "The Eagle's Essence", 'https://warcraft.wiki.gg/wiki/The_Eagle%27s_Essence', 'quest', 'Secondary quest-text locator for the Eagle shrine trial and essence. Combat mechanics are excluded.'],
  ['falcon', "The Falcon's Essence", 'https://warcraft.wiki.gg/wiki/The_Falcon%27s_Essence', 'quest', 'Secondary quest-text locator for the distinct Falcon shrine by Lake Ere’Noru. Combat mechanics are excluded.'],
  ['hawk', "The Hawk's Essence", 'https://warcraft.wiki.gg/wiki/The_Hawk%27s_Essence', 'quest', 'Secondary quest-text locator for the Hawk shrine at Sorrow Wing Point. Combat mechanics are excluded.'],
  ['return-essences', 'Return to Cenarion Refuge', 'https://warcraft.wiki.gg/wiki/Return_to_Cenarion_Refuge', 'quest', 'Secondary quest-text locator for returning the essences and Morthis’s assessment of Anzu.'],
  ['moonstone', 'Chasing the Moonstone', 'https://warcraft.wiki.gg/wiki/Chasing_the_Moonstone', 'quest', 'Secondary quest-text locator for the Southfury Moonstone and the chase after Rizzle. Repeated pursuit mechanics are compressed.'],
  ['anzu', 'Vanquish the Raven God', 'https://warcraft.wiki.gg/wiki/Vanquish_the_Raven_God', 'quest', 'Secondary quest-text locator for the Heroic Sethekk Halls confrontation and Swift Flight Form reward. Encounter tactics are excluded.'],
  ['vigilance', 'Eternal Vigilance', 'https://warcraft.wiki.gg/wiki/Eternal_Vigilance', 'quest', 'Secondary quest-text locator for Morthis’s concern that Anzu might rise again and the Moonstone’s later use.'],
  ['sethekk', 'Sethekk Halls', 'https://warcraft.wiki.gg/wiki/Sethekk_Halls', 'website', 'Secondary instance locator. The illustrated interior does not claim an exact floor plan.'],
  ['blizzard-bcc-anniversary', 'BCC Anniversary Edition: Overlords of Outland Now Live!', 'https://worldofwarcraft.blizzard.com/en-us/news/24276751/bcc-anniversary-edition-overlords-of-outland-now-live', 'website', 'First-party confirmation that the current Anniversary Edition presents a Druid questline culminating with Anzu in Heroic Sethekk Halls. Not evidence for original 2007 wording or prerequisites.'],
  ['swift-timeline', 'Swift Flight Form', 'https://warcraft.wiki.gg/wiki/Swift_Flight_Form', 'website', 'Secondary timeline locator for the patch 2.1 chain, patch 3.0.3 trainer change, and patch 4.0.1 removal. Later changes are outside this story.'],
  ['visual-zangarmarsh', 'TBC Classic Zangarmarsh area reference', 'https://www.wowhead.com/tbc/zone=3521/zangarmarsh#screenshots', 'website', 'Area-image reference for the flooded teal marsh, giant mushrooms, and Cenarion Refuge setting. Secondary visual locator; human comparison against the intended 2.0.3–2.4.3 build remains open.'],
  ['visual-moonglade', 'TBC Classic Moonglade area reference', 'https://www.wowhead.com/tbc/zone=493/moonglade#screenshots', 'website', 'Area-image reference for the moonlit conifer refuge and Stormrage Barrow Dens. Secondary visual locator; human comparison remains open.'],
  ['visual-blades-edge', "TBC Classic Blade's Edge Mountains area reference", 'https://www.wowhead.com/tbc/zone=3522/blades-edge-mountains#screenshots', 'website', 'Area-image reference for Evergrove and the jagged highlands, floating crags, and Vortex Pinnacle. Secondary visual locator; human comparison remains open.'],
  ['visual-nagrand', 'TBC Classic Nagrand area reference', 'https://www.wowhead.com/tbc/zone=3518/nagrand#screenshots', 'website', 'Area-image reference for open green pasture, mesas, waterways, and floating islands around Twilight Ridge. Secondary visual locator; human comparison remains open.'],
  ['visual-terokkar', 'TBC Classic Terokkar Forest area reference', 'https://www.wowhead.com/tbc/zone=3519/terokkar-forest#screenshots', 'website', 'Area-image reference for the pale Bone Wastes, arakkoa skyline at Skettis, and Auchindoun. Secondary visual locator; human comparison remains open.'],
  ['visual-sethekk', 'TBC Classic Sethekk Halls area reference', 'https://www.wowhead.com/tbc/zone=3791/sethekk-halls#screenshots', 'website', 'Area-image reference for the darker avian interior in Heroic Sethekk Halls. Secondary visual locator; human comparison remains open.'],
  ['visual-azshara', 'TBC Classic Azshara area reference', 'https://www.wowhead.com/tbc/zone=16/azshara#screenshots', 'website', 'Area-image reference for pre-Cataclysm forest, river, and eastern cliffs. Secondary visual locator; human comparison remains open.'],
];
const sourceIds = sourceDefs.map(([sourceId]) => 'swift-flight-' + sourceId);
const sourceByKey = Object.fromEntries(sourceDefs.map(([sourceId, title, url, sourceType, notes]) => [sourceId, {
  id: 'swift-flight-' + sourceId, title, url, sourceType, notes: 'Accessed 2026-10-03. ' + notes,
}]));
const cit = (key, questId, section) => ({ sourceId: 'swift-flight-' + key, questId, section });
const unique = (values) => [...new Set(values)];
const writeRecord = async (folder, record, recordId = record.id) => {
  const path = join(root, 'data', folder, recordId + '.research.json');
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(record, null, 2) + '\n', 'utf8');
};

const placeDefs = [
  ['cenarion-refuge-zangarmarsh', 'Cenarion Refuge, Zangarmarsh', 'location', 'Cenarion refuge in the marsh where Morthis receives the Druid and the quest chain begins and ends.', ['ward', 'morthis-start', 'return-morthis', 'return-essences', 'vigilance', 'visual-zangarmarsh']],
  ['stormrage-barrow-dens', 'Stormrage Barrow Dens, Moonglade', 'site', 'The named Moonglade barrows where Clintar is awakened and the divided-spirit account begins.', ['waking', 'dream', 'visual-moonglade']],
  ['emerald-dream-echo', 'Emerald Dream · barrow echo', 'site', 'An interpretive dream echo associated with the barrow sequence. The exact plane layout and apparition chamber are not claimed.', ['dream', 'visual-moonglade']],
  ['evergrove-blades-edge', 'Evergrove, Blade’s Edge Mountains', 'location', 'The forested refuge in Blade’s Edge where Arthorn investigates the raven cult.', ['evergrove', 'book', 'visual-blades-edge']],
  ['vortex-pinnacle-blades-edge', 'Vortex Pinnacle, Blade’s Edge Mountains', 'site', 'A highland destination in the Blade’s Edge raven investigation. The painting is a broad area view, not a surveyed summit.', ['book', 'visual-blades-edge']],
  ['twilight-ridge-nagrand', 'Twilight Ridge, Nagrand', 'site', 'A named ridge where Watcher Elaira helps the seeker search for raven-book fragments.', ['eyes', 'sparrowhawk', 'visual-nagrand']],
  ['skettis-terokkar', 'Skettis, Terokkar Forest', 'location', 'The arakkoa settlement in the Bone Wastes where the Raven Stones are recovered.', ['stones', 'visual-terokkar']],
  ['eagles-shrine-terokkar', 'Eagle shrine, Terokkar Forest', 'site', 'The named shrine where the Eagle guardian’s essence is tested and recovered.', ['eagle', 'visual-terokkar']],
  ['falcons-shrine-terokkar', 'Falcon shrine, Lake Ere’Noru', 'site', 'The separate shrine associated with the Falcon essence trial.', ['falcon', 'visual-terokkar']],
  ['hawks-shrine-sorrow-wing', 'Hawk shrine, Sorrow Wing Point', 'site', 'The separate Hawk shrine on the island at Sorrow Wing Point.', ['hawk', 'visual-terokkar']],
  ['southfury-river-azshara', 'Southfury River, Azshara', 'site', 'The broad river area associated with the Moonstone chase. Exact coordinates and the pursuit route remain unknown.', ['moonstone', 'visual-azshara']],
  ['sethekk-halls-heroic', 'Heroic Sethekk Halls, Auchindoun', 'site', 'The heroic Sethekk Halls setting for the Raven’s Claw and Anzu confrontation; no dungeon floor plan is asserted.', ['anzu', 'sethekk', 'visual-sethekk']],
];
const actorDefs = [
  ['morthis-whisperwing', 'character', 'Morthis Whisperwing', 'A Cenarion Druid who guides the seeker through the Stormcrow trial and warns that Anzu may rise again.', 'morthis-whisperwing', 0.82, ['morthis-start', 'ward', 'return-morthis', 'evergrove', 'return-essences', 'moonstone', 'anzu', 'vigilance']],
  ['clintar-dreamwalker', 'character', 'Clintar Dreamwalker', 'The Dream-bound witness awakened in the Stormrage Barrow Den; his physical and divided-spirit depictions are separate interpretive research art.', 'clintar-dream-witness', 0.82, ['waking', 'dream', 'return-morthis']],
  ['clintar-divided-spirit', 'other', 'Clintar’s divided spirit', 'A separate visual representation of Clintar’s spirit in the dream sequence, not a second character or exact apparition model.', 'clintar-spirit', 0.80, ['dream']],
  ['dreamwarden-lurosa', 'character', 'Dreamwarden Lurosa', 'The Dreamwarden encountered during Clintar’s escort through the dream sequence.', 'dreamwarden-lurosa', 0.80, ['dream']],
  ['arthorn-windsong', 'character', 'Arthorn Windsong', 'A Druid researcher whose work connects the Outland raven-cult inquiry to the recovered book.', 'arthorn-windsong', 0.82, ['evergrove', 'book', 'stones', 'return-essences']],
  ['timeon', 'character', 'Timeon', 'The Druid whose clue helps direct the inquiry toward the book’s account.', 'timeon', 0.78, ['book']],
  ['watcher-elaira', 'character', 'Watcher Elaira', 'A Druid on Twilight Ridge who directs the sparrowhawk search for the Raven Stones.', 'watcher-elaira', 0.78, ['eyes', 'sparrowhawk']],
  ['saikkal', 'other', 'Sai’kkal', 'An arakkoa shade whose account is reached through the Druid investigation’s aided sight.', 'saikkal', 0.80, ['book']],
  ['aspect-of-raven', 'other', 'Aspect of the Raven', 'A raven aspect that threatens the escort in the dream sequence; its exact appearance and chamber remain interpretive.', 'aspect-of-raven', 0.86, ['dream']],
  ['anzu-raven-god', 'other', 'Anzu, the Raven God', 'The being named in the recovered raven-book account and confronted in Heroic Sethekk Halls.', 'anzu', 1.04, ['stones', 'return-essences', 'anzu', 'vigilance']],
  ['guardian-of-eagle', 'other', 'Guardian of the Eagle', 'The distinct guardian named by the Eagle essence trial. Its generated design is interpretive, not a canonical model claim.', 'guardian-of-eagle', 0.78, ['eagle']],
  ['guardian-of-falcon', 'other', 'Guardian of the Falcon', 'The distinct guardian named by the Falcon essence trial. Its generated design is interpretive, not a canonical model claim.', 'guardian-of-falcon', 0.78, ['falcon']],
  ['guardian-of-hawk', 'other', 'Guardian of the Hawk', 'The distinct guardian named by the Hawk essence trial. Its generated design is interpretive, not a canonical model claim.', 'guardian-of-hawk', 0.78, ['hawk']],
  ['rizzle-sprysprocket', 'character', 'Rizzle Sprysprocket', 'The goblin involved in the Southfury Moonstone chase; the illustrated design is interpretive research art.', 'rizzle-sprysprocket', 0.72, ['moonstone']],
  ['swift-flight-seeker', 'other', 'Druid seeker · representative viewpoint', 'An interpretive Night Elf Druid viewpoint for the class quest. It is not a named or canonical player character; the original chain also allowed a Tauren Druid viewpoint.', 'druid-adventurer-viewpoint', 0.80, ['chain']],
  ['wild-sparrowhawk', 'other', 'Wild sparrowhawk', 'A small wild hawk used in Elaira’s search; the image does not assert a unique named bird.', 'wild-sparrowhawk', 0.48, ['sparrowhawk']],
  ['raven-book-artifact', 'artifact', 'The Raven’s Book', 'A damaged account reconstructed from stone fragments at Skettis; the illustration is interpretive and contains no invented readable text.', 'book-of-raven', 0.66, ['book', 'stones']],
  ['southfury-moonstone', 'artifact', 'Southfury Moonstone', 'The stone used in the attempt to call Anzu at the Raven’s Claw; the illustration is interpretive research art.', 'southfury-moonstone', 0.52, ['moonstone', 'anzu', 'vigilance']],
  ['swift-flight-stormcrow', 'other', 'Swift Flight Form · stormcrow interpretation', 'An interpretive bird-form representation of the rewarded Druid flight form; compare its model with the original TBC client before approval.', 'swift-flight-stormcrow', 0.96, ['morthis-start', 'anzu', 'swift-timeline']],
];
const visualAssetDefs = [
  ['moonglade-stormrage-barrows', 'exec-f49ed7f7-a029-4953-812a-77b6f0a7de19.png', 'Generated moonlit conifer grove and druidic barrow approach; compare with TBC Moonglade.'],
  ['cenarion-refuge-zangarmarsh', 'exec-fbcc452a-9b4d-4861-8f0f-a556cc35c515.png', 'Generated flooded teal marsh and oversized fungal silhouettes for the refuge region; compare with TBC Zangarmarsh.'],
  ['emerald-dream-barrows', 'exec-eda93673-9ce6-41f3-9b81-9d2087354ab5.png', 'Generated luminous dream echo of the barrows; intentionally interpretive, not a surveyed plane.'],
  ['evergrove', 'exec-6cdde2d6-64d1-463e-9471-85c552c1ecb5.png', 'Generated sheltered green grove amid Blade’s Edge highlands; compare with TBC Evergrove.'],
  ['vortex-pinnacle', 'exec-1c6d925c-a42f-4ec3-aea7-c4b494d0bf11.png', 'Generated crystal-spired highland scene; compare with TBC Blade’s Edge and Vortex Pinnacle; not an exact summit plan.'],
  ['skettis', 'exec-d84f35a9-dde2-4c10-a377-65760ac44cbf.png', 'Generated arakkoa skyline in pale Terokkar Bone Wastes; compare with TBC Skettis.'],
  ['eagle-shrine', 'exec-934509ef-a7c2-409b-8f16-c7d2ee44a02c.png', 'Generated separate Eagle shrine environment; compare with TBC Terokkar.'],
  ['falcon-shrine', 'exec-2840831b-e7db-4dbf-8e60-07959c7206f1.png', 'Generated separate Falcon shrine by Lake Ere’Noru; compare with TBC Terokkar.'],
  ['hawk-shrine', 'exec-dea92cdf-0739-4602-a6f5-8d77e3f7e6fc.png', 'Generated separate Hawk shrine at Sorrow Wing Point; compare with TBC Terokkar.'],
  ['southfury-river', 'exec-fbf10271-1fa5-48f0-8eb8-58abaac2f94d.png', 'Generated pre-Cataclysm forested river and eastern cliff scene for Azshara; compare with TBC Azshara.'],
  ['morthis-whisperwing', 'exec-4d9353da-8dc2-4910-a462-f2c542e97c6d.png', 'Generated Night Elf Druid portrait; appearance remains subject to original-client comparison.'],
  ['clintar-dream-witness', 'exec-06c37025-47ed-4548-86a5-be277f207189.png', 'Generated physical Clintar portrait; appearance remains subject to original-client comparison.'],
  ['clintar-spirit', 'exec-f3784379-4c3b-4a21-ac81-342625d4de9f.png', 'Generated spectral treatment of Clintar using the physical portrait as a reference; interpretive.'],
  ['dreamwarden-lurosa', 'exec-a0002a68-2c8d-4977-90e2-d85502e808fe.png', 'Generated Dreamwarden portrait; appearance remains subject to original-client comparison.'],
  ['arthorn-windsong', 'exec-b2831351-4603-4348-af61-f8a2dd897864.png', 'Generated Druid researcher portrait; appearance remains subject to original-client comparison.'],
  ['timeon', 'exec-55604864-61cf-4145-9d43-15490617cacc.png', 'Generated Druid portrait; appearance remains subject to original-client comparison.'],
  ['watcher-elaira', 'exec-4f839b16-3f01-40ec-878b-7b1ece52e219.png', 'Generated Tauren Druid portrait; appearance remains subject to original-client comparison.'],
  ['saikkal', 'exec-8cd10280-4f45-48cd-9d3f-67e60f936f5f.png', 'Generated arakkoa shade; interpretive design, not an in-game model capture.'],
  ['anzu', 'exec-bc78b185-432e-4568-b422-bec52b69053b.png', 'Generated Raven God creature portrait; interpretive design, not an in-game model capture.'],
  ['aspect-of-raven', 'exec-f2e3b19d-846c-4580-8e7a-0cc7850d4ffe.png', 'Generated golden dream-spirit bird; interpretive design, not an in-game model capture.'],
  ['guardian-of-eagle', 'exec-5c2db6b0-c1cf-4fec-9c0c-15730321e557.png', 'Generated Eagle guardian creature cutout; interpretive design.'],
  ['guardian-of-falcon', 'exec-7d820824-5977-403c-a766-636c83f419a1.png', 'Generated Falcon guardian creature cutout; interpretive design.'],
  ['guardian-of-hawk', 'exec-26a6f825-2c6d-441c-92e0-170871323bdc.png', 'Generated Hawk guardian creature cutout; interpretive design.'],
  ['rizzle-sprysprocket', 'exec-a8855ddb-d552-4859-a599-dc6d8bda9671.png', 'Generated goblin tinkerer portrait; appearance remains subject to original-client comparison.'],
  ['druid-adventurer-viewpoint', 'exec-95f0aab8-a043-453e-bdc7-b1c35cdd5620.png', 'Generated non-canonical Night Elf Druid viewpoint; not a named player character.'],
  ['wild-sparrowhawk', 'exec-0e8c8355-4b64-4fb9-a44f-e2dade08c0e2.png', 'Generated natural sparrowhawk cutout; no unique bird identity is asserted.'],
  ['book-of-raven', 'exec-0639fbb7-ea63-4145-a1f2-454a050632f1.png', 'Generated damaged stone book artifact; any carved marks are visual interpretation, not translated text.'],
  ['southfury-moonstone', 'exec-0b22508f-496e-429f-87a9-caf6fcd33782.png', 'Generated luminous moonstone artifact; ornament is interpretive.'],
  ['swift-flight-stormcrow', 'exec-f4d22cec-6bd6-455b-96ad-069661bc37ed.png', 'Generated Swift Flight Form bird silhouette; original model comparison remains open.'],
];

const scenes = [
  { key: 'apprenticeship', title: 'A calling at Cenarion Refuge', state: 'refuge', places: ['cenarion-refuge-zangarmarsh'], quest: 'Morthis Whisperwing', citations: [cit('morthis-start', 'Morthis Whisperwing', 'Offer and opening dialogue'), cit('chain', 'Swift Flight Form quest chain', 'Opening class-quest sequence')], actors: ['morthis-whisperwing', 'swift-flight-seeker'], summary: 'Morthis offers the Stormcrow’s secrets through a Druid trial, opening the quest chain at Cenarion Refuge.', narration: 'In the drowned green reaches of Zangarmarsh, Cenarion Refuge stands among spore towers and shallow water. Morthis Whisperwing offers a Druid a way toward the Stormcrow’s secrets, but his teaching begins with a trial. The chain names its destination more clearly than its calendar: it belongs to the Burning Crusade, while the day and the adventurer’s private history remain unknown. This seeker is a representative viewpoint, not a fixed hero whom every player must share. What matters first is the promise Morthis makes, and the work he sets before any new form can be learned.', note: 'Quest offer paraphrased from a secondary transcription. Druid viewpoint is intentionally non-canonical; no exact in-world date is known.' },
  { key: 'ward', title: 'Preparing the ward', state: 'refuge', places: ['cenarion-refuge-zangarmarsh'], quest: 'The Ward of Wakening', citations: [cit('ward', 'The Ward of Wakening', 'Material handoff and Morthis’s stated purpose')], actors: ['morthis-whisperwing', 'swift-flight-seeker'], summary: 'After the requested preparation, Morthis makes a ward intended to wake the sleeping witness safely.', narration: 'The first task is preparation. Morthis asks for materials, then fashions a ward meant to help wake a sleeper without leaving him undefended. The gathering itself is a game objective, not a record of every plant or path across Outland; here its repeated errands fall away, leaving the reason for them in view. A witness lies dormant in the barrows of Moonglade, and the Druid’s next step is to approach him with care. The trial has moved from promise to responsibility: even a search for knowledge can harm the one who keeps it, unless the seeker first considers how to wake him.', note: 'The ward’s intended use is taken from the quest text locator. Ingredients and objective counts are compressed; no additional magical effect is inferred.' },
  { key: 'waking-clintar', title: 'The sleeper in the barrow', state: 'barrow', places: ['stormrage-barrow-dens'], quest: 'Waking the Sleeper', citations: [cit('waking', 'Waking the Sleeper', 'Clintar’s named den and waking scene')], actors: ['clintar-dreamwalker', 'swift-flight-seeker'], summary: 'Clintar Dreamwalker wakes in the southern Stormrage Barrow Den, carrying knowledge of a disturbance within the Dream.', narration: 'The journey returns from Outland to Moonglade, where the Stormrage Barrow Dens keep their old silence beneath the pines. In the southern den, Clintar Dreamwalker stirs under Morthis’s ward. He is not a guide who arrives with a clear explanation; he wakes confused, and the quest turns on the danger of what he has witnessed. The sleeper’s spirit must be followed beyond the waking world, where his divided soul can speak more freely than the body left behind.', note: 'Named setting and awakening follow the quest locator; no exact chamber geometry or canonical adventurer identity is asserted.' },
  { key: 'dream-escort', title: 'A witness divided', state: 'dream', places: ['stormrage-barrow-dens', 'emerald-dream-echo'], quest: 'No Mere Dream', citations: [cit('dream', 'No Mere Dream', 'Relics of Aviana, escort, Dreamwarden Lurosa, and Aspect appearance')], actors: ['clintar-divided-spirit', 'dreamwarden-lurosa', 'aspect-of-raven', 'swift-flight-seeker'], summary: 'Clintar’s divided spirit leads the seeker to three relics while a Raven aspect threatens the escort.', narration: 'Clintar’s spirit leads beyond the barrow’s ordinary walls. In this dream echo, he guides the seeker toward three Relics of Aviana while the Dreamwarden Lurosa helps keep the passage open. The danger comes from an Aspect of the Raven, which appears during the escort and threatens the work. Clintar’s fear points toward an outside presence, but here it remains the witness’s suspicion, not the voice of an all-seeing narrator. The relics are recovered; the mystery is not.', note: 'Quest events are paraphrased. Clintar’s claim remains attributed to him; the apparition’s exact location and design are unknown.' },
  { key: 'return-report', title: 'The warning returns with the relics', state: 'refuge', places: ['cenarion-refuge-zangarmarsh'], quest: 'Return to Morthis Whisperwing', citations: [cit('return-morthis', 'Return to Morthis Whisperwing', 'Relic return and report'), cit('dream', 'No Mere Dream', 'Clintar’s account, kept distinct from established fact')], actors: ['morthis-whisperwing', 'clintar-dreamwalker', 'swift-flight-seeker'], summary: 'The relics and witness return to Morthis, but the cause of the Dream disturbance remains unresolved.', narration: 'Back in Zangarmarsh, Morthis receives the relics and the report. Their recovery matters, yet neither the witness nor the objects settle what entered the Dream or when it began. Clintar’s concern remains part of the evidence, and Morthis does not turn suspicion into certainty. The first passage of the trial closes with a question still alive: if the danger is tied to an older raven tradition, can its history be found in Outland? Morthis sends the seeker toward the Evergrove and Arthorn Windsong. The search now changes from tending a sleeping guardian to tracing a memory that has outlasted its keepers.', note: 'Quest handoff paraphrased. The source leaves the disturbance unexplained at this stage.' },
  { key: 'evergrove-lead', title: 'A lead among Blade’s Edge trees', state: 'evergrove', places: ['evergrove-blades-edge'], quest: 'To the Evergrove', citations: [cit('evergrove', 'To the Evergrove', 'Morthis’s lead and Arthorn handoff')], actors: ['morthis-whisperwing', 'arthorn-windsong', 'swift-flight-seeker'], summary: 'Morthis directs the seeker to Arthorn, whose raven-cult research offers a new line of inquiry.', narration: 'Blade’s Edge rises in broken ridges around the Evergrove, a green sanctuary sheltered among the harsher heights. Morthis points the seeker to Arthorn Windsong, whose research concerns an old raven cult. This is a promising connection, not yet proof that the cult caused Clintar’s dream. The story’s evidence must carry the claim forward one witness at a time. Arthorn’s work brings other Druids into the inquiry, and the next question is not how to fight a god but how to recover a history that was scattered and buried. The quiet grove becomes a place of study before it becomes a place of warning.', note: 'Arthorn’s research is linked by the quest handoff; no causal link between the cult and the Dream is asserted yet.' },
  { key: 'book-of-raven', title: 'What Sai’kkal remembers', state: 'vortex', places: ['evergrove-blades-edge', 'vortex-pinnacle-blades-edge'], quest: 'The Book of the Raven', citations: [cit('book', 'The Book of the Raven', 'Timeon’s clue, aided sight, and Sai’kkal’s account')], actors: ['arthorn-windsong', 'timeon', 'saikkal', 'swift-flight-seeker'], summary: 'With the aid of a Seer’s Stone and an aether ray eye, the seeker reaches Sai’kkal’s account of the ravens’ book.', narration: 'The inquiry climbs toward the Vortex Pinnacle, where Arthorn’s notes and Timeon’s clue lead to Sai’kkal. A Seer’s Stone and the eye of an aether ray help the seeker perceive the arakkoa shade. In that account, a book of the ravens was stolen, broken apart, and buried. The testimony offers history in fragments and through a witness encountered by magical means; it does not yet give Arthorn a complete record. The book’s pieces are said to lie at Skettis. There, scattered stone may restore the name behind Clintar’s fear, but the tale must first be made whole enough to read.', note: 'The chain’s item and dialogue sequence is paraphrased. Sai’kkal’s account remains attributed testimony; no extra motive or exact pinnacle room is supplied.' },
  { key: 'eyes-in-the-sky', title: 'A watcher above Nagrand', state: 'nagrand', places: ['twilight-ridge-nagrand'], quest: 'Eyes in the Sky', citations: [cit('eyes', 'Eyes in the Sky', 'Arthorn’s referral to Watcher Elaira')], actors: ['arthorn-windsong', 'watcher-elaira', 'swift-flight-seeker'], summary: 'Arthorn sends the seeker to Watcher Elaira at Twilight Ridge to prepare the search for the buried fragments.', narration: 'From the splintered heights of Blade’s Edge, the search turns to Nagrand’s broad grasslands. Arthorn sends the seeker to Watcher Elaira on Twilight Ridge, where the open sky and far mesas offer another way to seek what is hidden. Nagrand’s floating islands and waterways belong to the landscape around the ridge, not to a travel route drawn between the quests. Elaira knows how to enlist a bird’s keen sight. The evidence has led the Druid from a spirit’s account to a ruined book; now the search asks for help from a living creature whose flight can reach ground the seeker cannot easily read.', note: 'The handoff names Twilight Ridge and Elaira. No exact travel path or surveyed lookout is claimed.' },
  { key: 'sparrowhawk', title: 'The sparrowhawk’s search', state: 'nagrand', places: ['twilight-ridge-nagrand'], quest: 'To Catch A Sparrowhawk', citations: [cit('sparrowhawk', 'To Catch A Sparrowhawk', 'Sparrowhawk training and intended release')], actors: ['watcher-elaira', 'wild-sparrowhawk', 'swift-flight-seeker'], summary: 'Elaira prepares a wild sparrowhawk to help locate fragments and intends that the bird be released afterward.', narration: 'Elaira’s plan depends on a small hunter of the open air. The chain asks the seeker to train a wild sparrowhawk for the search, then let it go when its part is done. That intention matters: the bird is an ally for a task, not a prize to be kept. From Twilight Ridge, the story looks outward across Nagrand’s open reaches, but it does not claim a precise flight path. The sparrowhawk helps the Druids seek the buried stones at Skettis. A living eye can find what human memory and broken testimony could not, and the next scene will show what the fragments have preserved.', note: 'The intended release is stated in the quest locator. No named bird, exact route, or ownership after the task is asserted.' },
  { key: 'raven-stones', title: 'Anzu named in the broken book', state: 'skettis', places: ['skettis-terokkar', 'evergrove-blades-edge'], quest: 'The Raven Stones', citations: [cit('stones', 'The Raven Stones', 'Fragment recovery, Arthorn’s reconstruction, and Anzu identification'), cit('book', 'The Book of the Raven', 'Sai’kkal’s account as prior testimony')], actors: ['arthorn-windsong', 'raven-book-artifact', 'swift-flight-seeker'], summary: 'The Skettis fragments restore the book’s account; Arthorn identifies Anzu and learns of three captive bird spirits.', narration: 'At Skettis, in the pale wastes of Terokkar, the scattered Raven Stones are brought together. Arthorn reconstructs the book and reads its account: Anzu is named as the Raven God, and three bird spirits are described as bound to shrines. Now the druids have more than an early suspicion. The identity comes from the recovered text, whose broken state still asks for care; its prophecy belongs to that source, not to an all-seeing narrator. Arthorn points to three distinct trials in Terokkar. What began as a dream disturbance has become a search for knowledge strong enough to call a dangerous power into reach.', note: 'Anzu’s identification and the shrine sequence follow the reconstructed-book quest locator. Prophecy is explicitly attributed to a fragmentary source.' },
  { key: 'eagle-essence', title: 'The first shrine: Eagle', state: 'eagle', places: ['eagles-shrine-terokkar'], quest: "The Eagle's Essence", citations: [cit('eagle', "The Eagle's Essence", 'Shrine and recovered essence')], actors: ['guardian-of-eagle', 'swift-flight-seeker'], summary: 'The Eagle guardian is defeated at its named shrine and its essence is recovered.', narration: 'The first shrine holds the Eagle guardian. The seeker confronts it and recovers the Eagle’s essence, a trial the quest names distinctly from those that follow. The story does not enlarge the encounter into a history the source never gives, nor does it turn combat technique into narration. What changes is the seeker’s preparation: one spirit’s power has been gathered, and two separate shrines remain. The Bone Wastes are not empty ground; old places still hold their own guarded meanings. Each essence will mark a passage in the trial, but none alone explains the origin of the birds or the Raven God.', note: 'Named guardian and essence are quest-supported; creature design, exact shrine composition, and spirit origin remain interpretive or unknown.' },
  { key: 'falcon-essence', title: 'The second shrine: Falcon', state: 'falcon', places: ['falcons-shrine-terokkar'], quest: "The Falcon's Essence", citations: [cit('falcon', "The Falcon's Essence", 'Lake Ere’Noru shrine and recovered essence')], actors: ['guardian-of-falcon', 'swift-flight-seeker'], summary: 'The Falcon guardian is defeated at a different Terokkar shrine beside Lake Ere’Noru.', narration: 'The second trial lies by Lake Ere’Noru, at another shrine with its own guardian. The Falcon falls, and its essence joins the first. The landscape changes from the Eagle’s place, but the story keeps the same discipline: no invented route connects the sites, and no single composite guardian stands in for all three. Each shrine has a name in the quest chain, and that naming gives the journey its order. The Falcon’s essence does not close the path. One more spirit remains at Sorrow Wing Point, farther from the safety of the refuge, and the seeker must carry the unfinished work onward.', note: 'Quest locator supports the distinct Lake Ere’Noru shrine. No route, relative travel time, or guardian backstory is inferred.' },
  { key: 'hawk-essence', title: 'The third shrine: Hawk', state: 'hawk', places: ['hawks-shrine-sorrow-wing'], quest: "The Hawk's Essence", citations: [cit('hawk', "The Hawk's Essence", 'Sorrow Wing Point shrine and recovered essence')], actors: ['guardian-of-hawk', 'swift-flight-seeker'], summary: 'At Sorrow Wing Point, the Hawk guardian is defeated and the third essence completes the set.', narration: 'At Sorrow Wing Point, the last named shrine keeps the Hawk guardian. The seeker prevails and brings back the third essence. Eagle, Falcon, and Hawk have each had a separate place and challenge; together they complete a set that Morthis and Arthorn believe can prepare a confrontation. Their collection is not a claim that the raven cult created the spirits, and the quest gives no broader history for them. The trial has gathered what it needs without resolving every old question. Now the Druid must return to Cenarion Refuge and learn whether the essences are enough for the danger Arthorn has uncovered.', note: 'The shrine and essence follow the quest locator. Guardian origins and any geographic route remain unstated.' },
  { key: 'return-essences', title: 'A dangerous name, a greater foe', state: 'refuge', places: ['cenarion-refuge-zangarmarsh'], quest: 'Return to Cenarion Refuge', citations: [cit('return-essences', 'Return to Cenarion Refuge', 'Essence report and Morthis’s assessment'), cit('stones', 'The Raven Stones', 'Anzu’s name and the three shrines')], actors: ['arthorn-windsong', 'morthis-whisperwing', 'swift-flight-seeker'], summary: 'The three essences return to Morthis; he recognizes Anzu as powerful and says the seeker is not yet ready.', narration: 'The three essences return with the seeker to Cenarion Refuge, where Arthorn’s report and Morthis’s judgment meet. The name is no longer hidden: Anzu is the Raven God named in the book. But knowledge and readiness are not the same. Morthis tells the Druid that the adversary is powerful, and the trials have not yet made a direct summons possible. The next task is not another shrine. It is the recovery of an object that can call the Raven God into reach. Only then can the seeker learn whether the recovered history is enough to change the present danger.', note: 'Morthis’s assessment and Moonstone handoff follow the quest chain. The essences’ efficacy is described only as the characters’ preparation.' },
  { key: 'moonstone', title: 'The Moonstone chase', state: 'southfury', places: ['southfury-river-azshara'], quest: 'Chasing the Moonstone', citations: [cit('moonstone', 'Chasing the Moonstone', 'Southfury Moonstone and Rizzle chase'), cit('chain', 'Swift Flight Form quest chain', 'Quest sequence locator')], actors: ['rizzle-sprysprocket', 'southfury-moonstone', 'swift-flight-seeker'], summary: 'A chase through the Southfury River area recovers the Moonstone needed for the Raven God’s summons.', narration: 'Morthis sends the seeker toward the Southfury Moonstone in Azshara. The quest’s chase brings Rizzle Sprysprocket into the story, and the stone passes through a pursuit before it is recovered. The repeated movement is compressed; no exact route, distance, or private motive is invented for the goblin. What matters is the object’s purpose. The Moonstone is the remaining means by which the druids hope to summon Anzu, and its cool light gives the final trial a focus. The search now leaves open country behind. The next threshold is not a shrine but the darkened halls of Auchindoun.', note: 'The chain reports the chase and item handoff. The scene uses broad Southfury River geography; exact path and Rizzle’s motive remain unknown.' },
  { key: 'anzu-confrontation', title: 'The Raven God is called', state: 'sethekk', places: ['sethekk-halls-heroic'], quest: 'Vanquish the Raven God', citations: [cit('anzu', 'Vanquish the Raven God', 'Heroic Sethekk Halls, Raven’s Claw, encounter, and reward'), cit('sethekk', 'Sethekk Halls', 'Instance placement and interior locator')], actors: ['anzu-raven-god', 'southfury-moonstone', 'swift-flight-seeker', 'swift-flight-stormcrow'], summary: 'The Moonstone set at the Raven’s Claw calls Anzu in Heroic Sethekk Halls; the seeker defeats him and earns Swift Flight Form.', narration: 'In Heroic Sethekk Halls, beneath the broken arches of Auchindoun, the Moonstone is set in the Raven’s Claw. Anzu answers the summons. The trial reaches its purpose: the seeker confronts the Raven God and defeats him. The quest grants the knowledge of Swift Flight Form, the swift stormcrow shape Morthis promised at the start. This victory does not prove that every threat to the Emerald Dream began with Anzu, nor that the Raven God can never return. It marks a hard-won answer to one chain of evidence, and the Druid leaves with a new form as well as a warning still to be heard.', note: 'The encounter and reward follow the secondary quest locator. Generated stormcrow art is an interpretation, not a canonical model claim; no permanent eradication is inferred.' },
  { key: 'eternal-vigilance', title: 'A victory without certainty', state: 'refuge', places: ['cenarion-refuge-zangarmarsh'], quest: 'Eternal Vigilance', citations: [cit('vigilance', 'Eternal Vigilance', 'Morthis’s warning and reusable Moonstone'), cit('swift-timeline', 'Swift Flight Form', 'TBC chain cutoff before later class and training changes')], actors: ['morthis-whisperwing', 'southfury-moonstone', 'swift-flight-seeker', 'swift-flight-stormcrow'], summary: 'Morthis warns Anzu may rise again and leaves the Moonstone available for future use.', narration: 'At Cenarion Refuge, the new stormcrow form is no ending to the history beneath it. Morthis warns that Anzu’s followers might help him rise again, and the Moonstone is kept for another day. The chain closes with earned knowledge and continued watchfulness: the Raven God has been defeated, but the old account leaves room for a return. Beyond this point lie later changes to how Druids learn the form and later campaigns in the Dream; they are outside this TBC story. Here the seeker’s task is complete, while the unanswered future remains in the care of those who remember what the broken book said.', note: 'The continuing threat is sourced to Morthis’s closing quest. Later Wrath and post-Cataclysm material remains excluded.' },
];

const fullScenes = scenes.map((scene) => ({
  ...scene,
  id: id + '-story-' + scene.key,
  eventId: id + '-' + scene.key + '-event',
  claimId: id + '-' + scene.key + '-claim',
  citations: scene.citations.map((item, index) => ({ ...item, id: id + '-' + scene.key + '-citation-' + (index + 1) })),
}));

for (const source of Object.values(sourceByKey)) await writeRecord('sources', source);
await writeRecord('worldspaces', {
  id: theaterId,
  name: 'Swift Flight Form · relational story theater',
  slug: theaterId,
  coordinateSystem: { width: 10000, height: 10000, origin: 'bottom-left', units: 'atlas-units' },
});
for (const [placeId, name, type, description, sourceKeys] of placeDefs) {
  await writeRecord('entities', {
    id: placeId, type, name, slug: placeId, shortDescription: description,
    body: description + ' Scene placement is relational. Exact coordinates, floor plans, and travel routes are not asserted.',
    firstEraId: eraId, featuredEraIds: [eraId], sourceIds: unique(sourceKeys.map((key) => 'swift-flight-' + key)),
    tags: [id, 'tbc-area-reference'], contentStatus: 'research',
  });
}
for (const [entityId, type, name, description, assetName, scale, actorSources] of actorDefs) {
  await writeRecord('entities', {
    id: entityId, type, name, slug: entityId, shortDescription: description,
    body: description + ' The original research illustration is interpretive, not canonical model evidence; compare it with the relevant TBC client before approval.',
    firstEraId: eraId, featuredEraIds: [eraId], sourceIds: unique(actorSources.map((key) => 'swift-flight-' + key)),
    tags: [id, 'interpretive-art'],
    mapFigure: { asset: imageDir + '/' + assetName + '.research.webp', scale }, contentStatus: 'research',
  });
}

const figureIds = unique(fullScenes.flatMap((scene) => scene.actors));
const figureEntities = new Map();
for (const entityId of figureIds) {
  const entity = JSON.parse(await readFile(join(root, 'data', 'entities', entityId + '.research.json'), 'utf8'));
  if (entity.mapFigure) figureEntities.set(entityId, entity);
}
const geometryFeatures = [...figureEntities.keys()].map((entityId, index, list) => {
  const angle = (Math.PI * 2 * index) / list.length;
  const radius = 1200 + (index % 4) * 190;
  return {
    type: 'Feature', id: id + '-' + entityId + '-focus',
    properties: { name: figureEntities.get(entityId).name + ' relational story focus', contentStatus: 'research', styleRole: 'site', geographicCertainty: 'unknown' },
    geometry: { type: 'Point', coordinates: [Math.round(5000 + Math.cos(angle) * radius), Math.round(5000 + Math.sin(angle) * radius * 0.7)] },
  };
});
await mkdir(join(root, 'data', 'geometry'), { recursive: true });
await writeFile(join(root, 'data', 'geometry', theaterId + '.research.geojson'), JSON.stringify({
  type: 'FeatureCollection', name: 'Swift Flight Form relational story theater', features: geometryFeatures,
}, null, 2) + '\n', 'utf8');
for (const [index, [entityId, entity]] of [...figureEntities.entries()].entries()) {
  await writeRecord('spatial-states', {
    id: id + '-' + entityId + '-theater', entityId, eraId, worldspaceId: theaterId,
    geometryId: id + '-' + entityId + '-focus', placementKind: 'relational',
    geographicCertainty: 'unknown', sourceIds: entity.sourceIds,
    editorNote: 'Editorial figure anchor in the illustrated TBC story theater; no exact coordinates, route, or permanent presence is asserted. The seeker is representative and non-canonical. See docs/research/swift-flight-form-raven-legacy-visual-assets.json.',
    visualPresence: 'contextual', labelPriority: 250 - index,
  });
}

const stateDefs = [
  ['refuge', 'Cenarion Refuge · Zangarmarsh', imageDir + '/cenarion-refuge-zangarmarsh.research.webp', 'Flooded teal marsh, broad waters, spore mounds, and oversized mushroom forms; refuge scene is broad and interpretive.'],
  ['barrow', 'Stormrage Barrow Dens · Moonglade', imageDir + '/moonglade-stormrage-barrows.research.webp', 'Moonlit conifers and a low druidic barrow approach; the southern den interior and exact architecture are not reconstructed.'],
  ['dream', 'The Emerald Dream · barrow echo', imageDir + '/emerald-dream-barrows.research.webp', 'Luminous dream echo tied to the barrow sequence; deliberately interpretive, with no claimed plane layout.'],
  ['evergrove', 'Evergrove · Blade’s Edge Mountains', imageDir + '/evergrove.research.webp', 'Sheltered green grove set against Blade’s Edge ochre ridges and jagged silhouettes.'],
  ['vortex', 'Vortex Pinnacle · Blade’s Edge Mountains', imageDir + '/vortex-pinnacle.research.webp', 'Broad highland view with crystal spires; not an exact summit or room plan.'],
  ['nagrand', 'Twilight Ridge · Nagrand', 'images/storylines/hero-of-the-maghar/nagrand-valley.research.webp', 'Reused TBC Nagrand research painting with open green pasture, mesas, watercourses, and floating islands; Twilight Ridge placement is interpretive.'],
  ['skettis', 'Skettis · Terokkar Forest', imageDir + '/skettis.research.webp', 'Arakkoa skyline and bone-pale terrain; broad view, not an exact site reconstruction.'],
  ['eagle', 'Eagle shrine · Terokkar Forest', imageDir + '/eagle-shrine.research.webp', 'Separate named Eagle shrine scene; compare against TBC Terokkar client.'],
  ['falcon', 'Falcon shrine · Lake Ere’Noru', imageDir + '/falcon-shrine.research.webp', 'Separate named Falcon shrine scene near the lake; compare against TBC Terokkar client.'],
  ['hawk', 'Hawk shrine · Sorrow Wing Point', imageDir + '/hawk-shrine.research.webp', 'Separate named Hawk shrine scene at the island landmark; compare against TBC Terokkar client.'],
  ['southfury', 'Southfury River · Azshara', imageDir + '/southfury-river.research.webp', 'Pre-Cataclysm forested river with blue-green water and eastern cliffs; the chase route and exact bank are unknown.'],
  ['sethekk', 'Heroic Sethekk Halls · Terokkar Forest', 'images/storylines/karazhan/sethekk-halls.research.webp', 'Reused purple-lit avian interior reference; composition is atmospheric and not an exact dungeon floor plan.'],
];
for (const [key, name, assetPath, traits] of stateDefs) {
  await writeRecord('map-states', {
    id: id + '-' + key + '-scene', name: 'Swift Flight Form: ' + name, worldspaceId: theaterId,
    presentation: 'relational', terrainTextureAsset: assetPath, geometryIds: [],
    cartographyLabel: 'THE BURNING CRUSADE · ' + name.toUpperCase(),
    interpretationNote: 'Interpretive story scene. ' + traits + ' Theater background only; it asserts no exact geography, dungeon plan, or travel route. Human side-by-side review against the target TBC client remains open.',
  });
}

const citations = [];
const events = [];
const claims = [];
const nodes = fullScenes.map((scene, index) => {
  const citationIds = scene.citations.map((item) => item.id);
  citations.push(...scene.citations.map((item) => ({
    id: item.id, sourceId: item.sourceId, questId: item.questId, section: item.section,
    note: item.sourceId === 'swift-flight-blizzard-bcc-anniversary'
      ? 'First-party contemporary Anniversary context only; original TBC quest wording and requirements require separate review.'
      : item.sourceId.startsWith('swift-flight-visual-')
        ? 'TBC area image locator only. It does not support the quest claim; human resemblance review against the original target build remains open.'
        : 'Original paraphrase from a secondary quest-text, item, or sequence locator. Original TBC wording, dependency edges, build variants, and omitted dialogue remain subject to human verification.',
  })));
  events.push({
    id: scene.eventId, kind: 'event', name: scene.title, slug: id + '-' + scene.key,
    eraId, worldspaceId: theaterId,
    date: { precision: 'unknown', label: 'The Burning Crusade Druid quest arc; exact in-world date unknown' },
    summary: scene.summary, locationIds: scene.places, participantEntityIds: scene.actors,
    sourceIds: unique(scene.citations.map((item) => item.sourceId)), claimIds: [scene.claimId], contentStatus: 'research',
  });
  claims.push({
    id: scene.claimId, subjectId: scene.eventId, predicate: 'swift_flight_story_beat',
    value: scene.summary, citationIds, confidence: 'strongly_supported', status: 'active',
    editorNote: scene.note + ' Keep content in research status until human claim, original-client, and visual comparison review.',
  });
  return {
    id: scene.id, guideId, title: scene.title, narration: scene.narration,
    eventIds: [scene.eventId], entityIds: scene.actors, locationIds: scene.places,
    camera: { position: [0, 6.2, 5.4], target: [0, 0, 0], durationMs: 1100 },
    visualActions: [{ type: 'set_map_state', mapStateId: id + '-' + scene.state + '-scene' }],
    ...(index > 0 ? { previousNodeId: fullScenes[index - 1].id } : {}),
    ...(index < fullScenes.length - 1 ? { nextNodeIds: [fullScenes[index + 1].id] } : {}),
    ...(previousNodes.get(scene.id)?.narration === scene.narration && previousNodes.get(scene.id)?.voiceover ? { voiceover: previousNodes.get(scene.id).voiceover } : {}),
  };
});

await writeRecord('stories', {
  guide: {
    id: guideId, eraId, title: 'Swift Flight Form · the raven’s legacy',
    description: 'Seventeen illustrated Burning Crusade scenes follow a Druid from Morthis’s trial through Clintar’s dream warning, the recovery of the Raven’s Book, three distinct Terokkar shrines, the Moonstone chase, and Anzu’s defeat. The story ends with Eternal Vigilance; later Druid campaigns and form-training changes are excluded.',
    nodeIds: nodes.map((node) => node.id), contentStatus: 'research',
  },
  nodes,
}, id);
for (const record of citations) await writeRecord('citations', record);
for (const record of events) await writeRecord('events', record);
for (const record of claims) await writeRecord('claims', record);

await writeRecord('storylines', {
  id, slug: id, title: 'Swift Flight Form: the raven’s legacy',
  summary: 'A Druid follows Morthis Whisperwing from Moonglade’s sleeping barrows to Outland’s raven cult. The recovered book names Anzu; three separate shrine trials and the Southfury Moonstone prepare the confrontation, while Morthis’s final warning leaves the future open.',
  opening: 'The marsh refuge offers a promise: Morthis can teach the Stormcrow’s secrets, if a Druid is willing to follow the evidence. What begins as a troubling dream leads through an old book, three guarded essences, and a stone that can call the Raven God into reach.',
  primaryEraId: eraId, eraIds: [eraId],
  chapters: [
    { id: id + '-chapter-dream', eraId, title: 'A warning within the Dream', body: 'Morthis’s trial awakens Clintar and follows his divided spirit, but the first account leaves the cause uncertain.' },
    { id: id + '-chapter-book', eraId, title: 'The raven’s broken history', body: 'The Druids pursue Sai’kkal’s account and reconstruct the book that names Anzu and three captive bird spirits.' },
    { id: id + '-chapter-shrines', eraId, title: 'Three essences of Terokkar', body: 'Eagle, Falcon, and Hawk are kept at separate named shrines; each trial contributes one essence.' },
    { id: id + '-chapter-vigilance', eraId, title: 'A summons and an open threat', body: 'The Moonstone enables the Heroic Sethekk Halls confrontation; Swift Flight Form is earned, but Anzu may rise again.' },
  ],
  sourceIds, storyGuideId: guideId, showInEraTourOffshoots: false,
  reviewNote: 'Complete illustrated research StoryGuide draft with 17 nodes, one for each named quest-chain beat; repetitive collection and combat mechanics are compressed. This is a class quest, not a canonical player biography. Primary gates remain original-client quest text and prerequisite comparison; TBC area and character-model comparison; narration/audio audition; scene-by-scene desktop and phone visual review; and human claim review. Includes the complete TBC endpoint Eternal Vigilance and excludes later form-training changes and Druid campaigns. Added to the independent Classic-to-Wrath StoryTour, not an EraTour. See docs/research/swift-flight-form-raven-legacy-research.md and docs/research/swift-flight-form-raven-legacy-visual-assets.json.',
  contentStatus: 'research',
});

const renderedAssetRecords = [];
for (const [assetName, sourceFile, note] of visualAssetDefs) {
  const imagePath = imageDir + '/' + assetName + '.research.webp';
  const bytes = await readFile(join(root, 'public', imagePath));
  renderedAssetRecords.push({
    id: assetName,
    sourcePromptFile: sourceFile,
    sourceFile: 'C:/Users/leroy/.codex/generated_images/01a0f500-e320-79e0-a38a-90086c592677/' + sourceFile,
    imagePath,
    byteLength: bytes.length,
    sha256: createHash('sha256').update(bytes).digest('hex'),
    alphaExpected: !['moonglade-stormrage-barrows', 'cenarion-refuge-zangarmarsh', 'emerald-dream-barrows', 'evergrove', 'vortex-pinnacle', 'skettis', 'eagle-shrine', 'falcon-shrine', 'hawk-shrine', 'southfury-river'].includes(assetName),
    provenance: 'Original image generated for this research story with the Codex image generator on 2026-10-03; converted to WebP with ffmpeg-static. ' + note,
    reviewStatus: 'open-human-review',
  });
}
const audioManifest = JSON.parse(await readFile(join(root, 'public', 'audio', 'guided', 'manifest.json'), 'utf8'));
const visualInventory = {
  storyId: id,
  contentStatus: 'research',
  targetEdition: 'Original World of Warcraft: The Burning Crusade, patches 2.1–2.4.3; imagery remains research illustration until a human compares it with the target client.',
  assetRoot: imageDir,
  generatedSourceRoot: 'C:/Users/leroy/.codex/generated_images/01a0f500-e320-79e0-a38a-90086c592677',
  imageFormat: 'lossy WebP; generated character and object cutouts preserve alpha using yuva420p',
  assets: renderedAssetRecords,
  reusedAssets: [
    { imagePath: 'images/storylines/hero-of-the-maghar/nagrand-valley.research.webp', usedFor: ['swift-flight-form-raven-legacy-story-eyes-in-the-sky', 'swift-flight-form-raven-legacy-story-sparrowhawk'], referenceSourceIds: ['swift-flight-visual-nagrand'], reviewStatus: 'open-human-review' },
    { imagePath: 'images/storylines/karazhan/sethekk-halls.research.webp', usedFor: ['swift-flight-form-raven-legacy-story-anzu-confrontation'], referenceSourceIds: ['swift-flight-visual-sethekk'], reviewStatus: 'open-human-review' },
  ],
  scenes: fullScenes.map((scene) => ({
    nodeId: scene.id,
    environmentAsset: stateDefs.find(([key]) => key === scene.state)?.[2],
    areaReferences: ({
      refuge: ['swift-flight-visual-zangarmarsh'], barrow: ['swift-flight-visual-moonglade'], dream: ['swift-flight-visual-moonglade'],
      evergrove: ['swift-flight-visual-blades-edge'], vortex: ['swift-flight-visual-blades-edge'], nagrand: ['swift-flight-visual-nagrand'],
      skettis: ['swift-flight-visual-terokkar'], eagle: ['swift-flight-visual-terokkar'], falcon: ['swift-flight-visual-terokkar'],
      hawk: ['swift-flight-visual-terokkar'], southfury: ['swift-flight-visual-azshara'], sethekk: ['swift-flight-visual-sethekk'],
    })[scene.state],
    cast: scene.actors.map((actorId) => ({ entityId: actorId, imagePath: figureEntities.get(actorId)?.mapFigure.asset })),
    reviewStatus: 'open-human-review; verify landscape and every visible cutout in the built playback scene on desktop and phone',
  })),
  audio: {
    voiceId: audioManifest.generator.voiceId,
    aiGenerated: true,
    tracks: audioManifest.tracks.filter((track) => track.guideId === guideId).map((track) => ({
      nodeId: track.nodeId,
      assetPath: track.assetPath,
      durationMs: track.durationMs,
      byteLength: track.bytes,
      sha256: track.sha256,
      transcriptSha256: track.transcriptSha256,
      reviewStatus: 'awaiting-listening-audition',
    })),
  },
};
await mkdir(join(root, 'docs', 'research'), { recursive: true });
await writeFile(join(root, 'docs', 'research', id + '-visual-assets.json'), JSON.stringify(visualInventory, null, 2) + '\n', 'utf8');

const tourPath = join(root, 'data', 'story-tours', 'classic-to-wrath.research.json');
const tour = JSON.parse(await readFile(tourPath, 'utf8'));
const existingEntry = tour.entries.find((entry) => entry.storylineId === id);
if (!existingEntry) {
  const diplomatIndex = tour.entries.findIndex((entry) => entry.storylineId === 'missing-diplomat-original-investigation');
  const entry = {
    storylineId: id, regionIds: ['outland', 'kalimdor'], mapPositionPercent: [82, 84], order: 17,
    periodLabel: 'The Burning Crusade · patch 2.1 Druid chain',
    locationLabel: 'Zangarmarsh · Moonglade · Terokkar · Azshara',
  };
  tour.entries.splice(diplomatIndex < 0 ? tour.entries.length : diplomatIndex, 0, entry);
}
tour.entries.sort((a, b) => a.order - b.order);
tour.entries.forEach((entry, index) => { entry.order = index + 1; });
const netherwingChronologyNote = ' Netherwing follows the Champion of the Naaru as an editorial Burning Crusade stop; exact relative date is unknown. Its repeatable reputation tasks and the optional Murkblood branch are separated from the one-time rescue and ending quests.';
const swiftFlightChronologyNote = ' Swift Flight Form’s Druid quest chain was added in patch 2.1 and is placed after the Netherwing editorial stop, before The Missing Diplomat’s patch 2.3 continuation; its exact relative in-world date is unknown, and no cross-story dependency is claimed. Its quest trail crosses Zangarmarsh, Moonglade, Outland, and Azshara, while its marker remains a tour-layout anchor.';
tour.chronologyNote = tour.chronologyNote.replaceAll(netherwingChronologyNote, '').replaceAll(swiftFlightChronologyNote, '') + netherwingChronologyNote + swiftFlightChronologyNote;
tour.reviewNote = 'Research StoryTour collection with 21 map placards, 20 playable research StoryGuides, and one research preview. Play All follows the authored expansion-era sequence and skips the preview. Story markers are navigational layout only, not exact coordinates. Stories remain research until human review gates are complete.';
await writeFile(tourPath, JSON.stringify(tour, null, 2) + '\n', 'utf8');

process.stdout.write(`Authored ${nodes.length} Swift Flight Form story nodes and ${tour.entries.length} StoryTour entries.\n`);
