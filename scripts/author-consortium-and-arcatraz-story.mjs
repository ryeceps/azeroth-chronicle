import { createHash } from 'node:crypto';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const storyId = 'consortium-and-arcatraz';
const guideId = `${storyId}-guide`;
const worldspaceId = `${storyId}-story-theater`;
const eraId = 'age-of-adventurers';
const artRoot = 'images/storylines/consortium-arcatraz';
const storyPath = `data/stories/${storyId}.research.json`;
const previousVoiceovers = new Map();
try {
  const previous = JSON.parse(await readFile(path.join(root, storyPath), 'utf8'));
  for (const node of previous.nodes ?? []) if (node.voiceover) previousVoiceovers.set(node.id, node.voiceover);
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

const write = async (file, value) => {
  const target = path.join(root, file);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, `${JSON.stringify(value, null, 2)}\n`);
};
const writeText = async (file, value) => {
  const target = path.join(root, file);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, value);
};
const readJson = async (file) => JSON.parse(await readFile(path.join(root, file), 'utf8'));
const sha256 = (buffer) => createHash('sha256').update(buffer).digest('hex');
const distinct = (values) => [...new Set(values)];

const sources = [
  ['consortium-blizzard-arcatraz-chain', 'Get Attuned and Face the Overlords of Outland', 'https://worldofwarcraft.blizzard.com/en-us/news/23716331/get-attuned-and-face-the-overlords-of-outland', 'website', 'First-party Burning Crusade Classic overview listing the full Consortium-to-Arcatraz quest sequence and the Aldor/Scryers starting variants. It is a retrospective Classic guide, not an original 2007 client capture.'],
  ['consortium-crystal-collection', 'Consortium Crystal Collection (quest 10265)', 'https://www.wowhead.com/tbc/quest=10265/consortium-crystal-collection', 'quest', 'Secondary transcription locator for the Arklon artifact, Burning Legion excavation, Pentatharon, and Khay’ji’s conclusion that the recovered crystal is probably not the one sought. Original-client dialogue comparison remains open.'],
  ['consortium-heap-of-ethereals', 'A Heap of Ethereals (quest 10262)', 'https://www.wowhead.com/tbc/quest=10262/a-heap-of-ethereals', 'quest', 'Secondary transcription locator for the Zaxxis break with the Consortium, their dealings with Sunfury, Khay’ji’s account of taking out a leader and escaping, and the report that Nesaad survived. Original-client dialogue comparison remains open.'],
  ['consortium-warp-raider-nesaad', 'Warp-Raider Nesaad (quest 10205)', 'https://www.wowhead.com/tbc/quest=10205/warp-raider-nesaad', 'quest', 'Secondary transcription locator for Khay’ji’s failed attempt to stop Nesaad and the next assignment. Original-client dialogue comparison remains open.'],
  ['consortium-request-assistance', 'Request for Assistance (quest 10266)', 'https://www.wowhead.com/tbc/quest=10266/request-for-assistance', 'quest', 'Secondary transcription locator for the survey-equipment dispute and Gahruj’s introduction at Eco-Dome Midrealm. The contract account is attributed to the Consortium and is not independently adjudicated.'],
  ['consortium-rightful-repossession', 'Rightful Repossession (quest 10267)', 'https://www.wowhead.com/quest=10267/rightful-repossession', 'quest', 'Secondary transcription locator for Gahruj’s account of the unpaid shipment, the blood elves’ mana-creature troubles, and his explicitly transactional request. Original-client dialogue comparison remains open.'],
  ['consortium-audience-prince', 'An Audience with the Prince (quest 10268)', 'https://www.wowhead.com/tbc/quest=10268/an-audience-with-the-prince', 'quest', 'Secondary transcription locator for the surveying-equipment handoff to Haramad’s image at the Stormspire and the prince’s response. Original-client dialogue comparison remains open.'],
  ['consortium-triangulation-one', 'Triangulation Point One (quest 10269)', 'https://www.wowhead.com/tbc/quest=10269/triangulation-point-one', 'quest', 'Secondary transcription locator for Haramad’s ancient draenei-legend account, the attributed claim about great power, the Legion concern, and the first point. Original-client dialogue comparison remains open.'],
  ['consortium-triangulation-two', 'Triangulation Point Two (quest 10275)', 'https://www.wowhead.com/tbc/quest=10275/triangulation-point-two', 'quest', 'Secondary transcription locator for recalibration, the second point, Tuluman, and the general vicinity revealed by the second reading. Original-client dialogue comparison remains open.'],
  ['consortium-full-triangle', 'Full Triangle (quest 10276)', 'https://www.wowhead.com/tbc/quest=10276/full-triangle', 'quest', 'Secondary transcription locator for the Ruins of Farahlon, the moving crystal, the Burning Legion inference, Culuthas, and recovery of the Ata’mal Crystal. Original-client dialogue comparison remains open.'],
  ['consortium-special-delivery', 'Special Delivery to Shattrath City (quest 10280)', 'https://www.wowhead.com/tbc/quest=10280/special-delivery-to-shattrath-city', 'quest', 'Secondary transcription locator for Haramad’s delivery to A’dal, the name Spirit’s Song, the attribution to Prophet Velen, and A’dal’s explicitly speculative explanation. Original-client dialogue comparison remains open.'],
  ['consortium-arcatraz-key-quest', 'How to Break Into the Arcatraz (quest 10704)', 'https://www.wowhead.com/tbc/quest=10704/how-to-break-into-the-arcatraz', 'quest', 'Secondary transcription locator for the message embedded in the Ata’mal Crystal, Haramad’s information, the two key shards, and A’dal’s key-forging turn-in. Original-client dialogue comparison remains open.'],
  ['consortium-harbinger-quest', 'Harbinger of Doom (quest 10882)', 'https://www.wowhead.com/tbc/quest=10882/harbinger-of-doom', 'quest', 'Secondary transcription locator for A’dal’s account of the prison breach, Skyriss’s attributed allegiance and stated aim, the slaying task, and A’dal’s hypothetical aftermath. Original-client dialogue comparison remains open.'],
  ['consortium-netherstorm-visual-locator', 'Netherstorm and Tempest Keep area locators', 'https://www.wowhead.com/tbc/zone=3523/netherstorm', 'website', 'Used only as an area-name locator for original interpretive illustrations. It does not verify the art’s resemblance to a particular client build or establish exact positions.'],
];
for (const [id, title, url, sourceType, notes] of sources) {
  await write(`data/sources/${id}.research.json`, { id, title, url, sourceType, notes: `Accessed 2026-10-03. ${notes}` });
}
const environments = [
  { id: 'area-52', title: 'Area 52', asset: 'images/storylines/karazhan/area-52.research.webp', reuse: 'Karazhan research story', traits: 'A compact goblin settlement on a broken Netherstorm island: warm timber-and-metal structures, practical lamps and canvas, with the purple void beyond.', sources: ['consortium-crystal-collection'], review: 'Reused original project illustration; side-by-side comparison to the original TBC Area 52 remains open.' },
  { id: 'arklon-ruins', title: 'The Arklon Ruins', asset: `${artRoot}/arklon-ruins.research.webp`, reuse: null, traits: 'Old draenei stonework cut by a Burning Legion excavation, with pale angular ruins against Netherstorm’s violet sky and floating rock.', sources: ['consortium-crystal-collection'], review: 'New original AI environment art; original-client resemblance comparison remains open.' },
  { id: 'heap', title: 'The Heap', asset: `${artRoot}/heap-of-zaxxis.research.webp`, reuse: null, traits: 'A dangerous open-air ethereal scavenger camp on a broken Netherstorm shelf, with dark rock, salvage, sparse crystal lamps and distant manaforge light; distinct from an enclosed Eco-Dome.', sources: ['consortium-heap-of-ethereals', 'consortium-warp-raider-nesaad'], review: 'New original AI environment art; the staging is illustrative, not a camp plan or exact NPC placement.' },
  { id: 'eco-dome', title: 'Eco-Dome Midrealm', asset: `${artRoot}/eco-dome-midrealm.research.webp`, reuse: null, traits: 'A contained Netherstorm biodome with a luminous green canopy, cultivated alien plants, a pale Consortium outpost and violet fractured ground beyond.', sources: ['consortium-request-assistance', 'consortium-rightful-repossession'], review: 'New original AI environment art; original-client resemblance comparison remains open.' },
  { id: 'stormspire', title: 'The Stormspire', asset: `${artRoot}/stormspire.research.webp`, reuse: null, traits: 'A suspended Consortium tower with pale metal, layered decks and arcane mechanisms above Netherstorm’s broken violet islands.', sources: ['consortium-audience-prince', 'consortium-triangulation-one', 'consortium-full-triangle'], review: 'New original AI environment art; no exact building plan or location is claimed.' },
  { id: 'farahlon', title: 'The Ruins of Farahlon', asset: `${artRoot}/farahlon.research.webp`, reuse: null, traits: 'An ancient draenei ruin on a shattered Netherstorm island, with violet haze, weathered pale stone and a distinct site for the Ata’mal Crystal encounter.', sources: ['consortium-full-triangle'], review: 'New original AI environment art; exact geography, crystal placement and composition remain interpretive.' },
  { id: 'shattrath', title: 'Shattrath, Terrace of Light', asset: 'images/storylines/karazhan/shattrath-terrace-of-light.research.webp', reuse: 'Karazhan research story', traits: 'Pale cream draenei stone and open arches, a luminous naaru crystal, and dusty ground beyond the city.', sources: ['consortium-special-delivery', 'consortium-arcatraz-key-quest'], review: 'Reused original project illustration; original-client comparison remains open.' },
  { id: 'mechanar', title: 'Tempest Keep: The Mechanar', asset: `${artRoot}/mechanar.research.webp`, reuse: null, traits: 'A high, mechanical Tempest Keep wing: floating draenei-built architecture, pale metal and crystal, precise machinery, and Netherstorm’s violet void.', sources: ['consortium-arcatraz-key-quest'], review: 'New original AI environment art; it is not a dungeon layout or exact encounter screenshot.' },
  { id: 'botanica', title: 'Tempest Keep: The Botanica', asset: `${artRoot}/botanica.research.webp`, reuse: null, traits: 'A floating Tempest Keep conservatory with pale draenei geometry, green growth within crystal structures, and the purple void outside.', sources: ['consortium-arcatraz-key-quest'], review: 'New original AI environment art; it is not a dungeon layout or exact encounter screenshot.' },
  { id: 'arcatraz', title: 'The Arcatraz, Tempest Keep', asset: 'images/storylines/akama-black-temple/arcatraz.research.webp', reuse: 'Akama and the Black Temple research story', traits: 'A floating crystalline draenei prison, angular ivory-and-red structures, energy cells and Netherstorm’s violet void.', sources: ['consortium-arcatraz-key-quest', 'consortium-harbinger-quest'], review: 'Reused original project illustration; distinguish the Consortium key and prison-break narrative from Karazhan’s separate third-fragment visit.' },
];
const environmentById = new Map(environments.map((environment) => [environment.id, environment]));

const locations = [
  { id: 'consortium-area-52', name: 'Area 52', description: 'Goblin outpost in Netherstorm where Khay’ji directs early Consortium work.', sources: ['consortium-crystal-collection', 'consortium-heap-of-ethereals', 'consortium-warp-raider-nesaad'] },
  { id: 'consortium-arklon-ruins', name: 'The Arklon Ruins', description: 'Old draenei ruins and a Burning Legion excavation named in the crystal-recovery assignment.', sources: ['consortium-crystal-collection'] },
  { id: 'consortium-zaxxis-heap', name: 'The Heap', description: 'A named Zaxxis ethereal camp south of Area 52 in the quest transcription.', sources: ['consortium-heap-of-ethereals', 'consortium-warp-raider-nesaad'] },
  { id: 'eco-dome-midrealm', name: 'Eco-Dome Midrealm', description: 'The Midrealm Post inside Eco-Dome Midrealm, where Gahruj handles the disputed Consortium surveying-equipment contract.', sources: ['consortium-request-assistance', 'consortium-rightful-repossession'] },
  { id: 'manaforge-duro', name: 'Manaforge Duro', description: 'Site of the delivered surveying equipment and the blood elves’ reported mana-creature infestation.', sources: ['consortium-rightful-repossession'] },
  { id: 'consortium-stormspire', name: 'The Stormspire', description: 'Netherstorm Consortium tower where the image of Nexus-Prince Haramad receives the equipment and the triangulation reports.', sources: ['consortium-audience-prince', 'consortium-triangulation-one', 'consortium-full-triangle'] },
  { id: 'netherstorm-survey-points', name: 'Netherstorm triangulation sites', description: 'A relational description of the survey search; point coordinates and exact placement are not encoded in the story atlas.', sources: ['consortium-triangulation-one', 'consortium-triangulation-two'] },
  { id: 'consortium-ruins-of-farahlon', name: 'The Ruins of Farahlon', description: 'The quest’s named target area for the moving Ata’mal Crystal and Culuthas encounter.', sources: ['consortium-full-triangle'] },
  { id: 'shattrath-city', name: 'Shattrath City', description: 'The Terrace of Light, where Haramad sends the recovered crystal to A’dal.', sources: ['consortium-special-delivery', 'consortium-arcatraz-key-quest'] },
  { id: 'the-mechanar', name: 'The Mechanar', description: 'Tempest Keep dungeon where Pathaleon the Calculator holds one Arcatraz key shard.', sources: ['consortium-arcatraz-key-quest'] },
  { id: 'the-botanica', name: 'The Botanica', description: 'Tempest Keep dungeon where Warp Splinter holds the other Arcatraz key shard.', sources: ['consortium-arcatraz-key-quest'] },
  { id: 'arcatraz', name: 'The Arcatraz', description: 'Tempest Keep’s prison satellite, reached after A’dal combines the two key shards.', sources: ['consortium-arcatraz-key-quest', 'consortium-harbinger-quest'] },
];

const figures = [
  { id: 'nether-stalker-khayji', type: 'character', name: 'Nether-Stalker Khay’ji', description: 'Consortium agent at Area 52 who assigns the Arklon artifact, reports the Zaxxis break and refers the seeker to Gahruj.', asset: `${artRoot}/khayji.research.webp`, scale: 0.92, sources: ['consortium-crystal-collection', 'consortium-heap-of-ethereals', 'consortium-warp-raider-nesaad', 'consortium-request-assistance'] },
  { id: 'warp-raider-nesaad', type: 'character', name: 'Warp-Raider Nesaad', description: 'Named Zaxxis warp-raider Khay’ji says survived his failed attack.', asset: `${artRoot}/nesaad.research.webp`, scale: 0.88, sources: ['consortium-heap-of-ethereals', 'consortium-warp-raider-nesaad'] },
  { id: 'consortium-agent-gahruj', type: 'character', name: 'Gahruj', description: 'Consortium representative at Eco-Dome Midrealm who describes the equipment dispute and requests its recovery.', asset: `${artRoot}/gahruj.research.webp`, scale: 0.92, sources: ['consortium-request-assistance', 'consortium-rightful-repossession', 'consortium-audience-prince'] },
  { id: 'nexus-prince-haramad', type: 'character', name: 'Nexus-Prince Haramad', description: 'Consortium leader encountered through an image at the Stormspire; names the crystal search and receives the recovered Ata’mal Crystal.', asset: `${artRoot}/haramad.research.webp`, scale: 0.95, sources: ['consortium-audience-prince', 'consortium-triangulation-one', 'consortium-full-triangle', 'consortium-special-delivery', 'consortium-arcatraz-key-quest'] },
  { id: 'culuthas', type: 'character', name: 'Culuthas', description: 'Demon named in the Full Triangle quest as the bearer of the Ata’mal Crystal.', asset: `${artRoot}/culuthas.research.webp`, scale: 0.92, sources: ['consortium-full-triangle'] },
  { id: 'adal', type: 'other', name: 'A’dal', description: 'Naaru leader at Shattrath’s Terrace of Light; existing original abstract story figure.', asset: 'images/storylines/akama-black-temple/adal.research.webp', scale: 0.95, sources: ['consortium-special-delivery', 'consortium-arcatraz-key-quest', 'consortium-harbinger-quest'], reuse: 'Akama and the Black Temple research story' },
  { id: 'pathaleon-the-calculator', type: 'character', name: 'Pathaleon the Calculator', description: 'Named as holder of the Bottom Shard of the Arcatraz Key in the Mechanar.', asset: `${artRoot}/pathaleon.research.webp`, scale: 0.92, sources: ['consortium-arcatraz-key-quest'] },
  { id: 'warp-splinter', type: 'character', name: 'Warp Splinter', description: 'Named as holder of the Top Shard of the Arcatraz Key in the Botanica.', asset: `${artRoot}/warp-splinter.research.webp`, scale: 0.92, sources: ['consortium-arcatraz-key-quest'] },
  { id: 'harbinger-skyriss', type: 'character', name: 'Harbinger Skyriss', description: 'Prisoner A’dal identifies as a servant of the Old Gods and a threat if he escapes; original interpretive art, not model evidence.', asset: `${artRoot}/skyriss.research.webp`, scale: 0.98, sources: ['consortium-harbinger-quest'] },
  { id: 'ata-mal-crystal', type: 'artifact', name: 'Ata’mal Crystal — Spirit’s Song', description: 'The crystal recovered from Culuthas, later named Spirit’s Song by A’dal. Shape and glow are interpretive, not canonical item-model evidence.', asset: `${artRoot}/ata-mal-crystal.research.webp`, scale: 0.64, sources: ['consortium-full-triangle', 'consortium-special-delivery', 'consortium-arcatraz-key-quest'] },
  { id: 'key-to-the-arcatraz', type: 'artifact', name: 'Key to the Arcatraz', description: 'A’dal’s combined key made from the two recovered shards; exact item appearance remains interpretive.', asset: `${artRoot}/key-of-the-arcatraz.research.webp`, scale: 0.7, sources: ['consortium-arcatraz-key-quest'] },
];
const figureById = new Map(figures.map((figure) => [figure.id, figure]));

const beats = [
  {
    id: 'the-arklon-crystal', title: 'The crystal that is not the answer', environment: 'arklon-ruins', location: 'consortium-arklon-ruins', characters: ['nether-stalker-khayji'], objects: [], quests: ['Consortium Crystal Collection (10265)'],
    refs: [{ sourceId: 'consortium-crystal-collection', questId: 'Consortium Crystal Collection' }],
    narration: 'At Area 52, Khay’ji says Nexus-Prince Haramad wants a crystal artifact from old draenei ruins. The Burning Legion has begun digging there, and the quest points to Pentatharon, a dreadlord holding one candidate. When Khay’ji examines what returns, he finds nothing special and doubts it is the crystal the prince seeks. Yet the Legion’s work seems directed toward something particular. The first prize is a false lead; the search itself has gained urgency.',
    note: 'Pentatharon is named in the quest but is not elevated to a principal cast member. Khay’ji’s reading of the Legion excavation remains his account.',
  },
  {
    id: 'the-zaxxis-break', title: 'A break with the Consortium', environment: 'heap', location: 'consortium-zaxxis-heap', characters: ['nether-stalker-khayji'], objects: [], quests: ['A Heap of Ethereals (10262)'],
    refs: [{ sourceId: 'consortium-heap-of-ethereals', questId: 'A Heap of Ethereals' }],
    narration: 'Khay’ji describes the Zaxxis as ethereals who left the Consortium and made dealings with the Sunfury. He says he infiltrated their camp at the Heap and took out their leader, but had to escape to Area 52. The quest sends the seeker back for Zaxxis insignias. Their collection records evidence of the break, not a new treaty or a full account of why the group left. Khay’ji’s report is the story’s only account of his failed operation.',
    note: 'Khay’ji’s infiltration and the reported Zaxxis dealings are attributed to his quest dialogue. Repeated collection and combat objectives are compressed, not narrated as separate events.',
  },
  {
    id: 'nesaad-still-lives', title: 'Nesaad still lives', environment: 'heap', location: 'consortium-zaxxis-heap', characters: ['nether-stalker-khayji', 'warp-raider-nesaad'], objects: [], quests: ['Warp-Raider Nesaad (10205)'],
    refs: [{ sourceId: 'consortium-warp-raider-nesaad', questId: 'Warp-Raider Nesaad' }],
    narration: 'After the insignias are returned, Khay’ji receives word from another agent: Warp-Raider Nesaad survived. The assignment is now personal in a narrower sense: Khay’ji admits that his own attack failed and asks the seeker not to fail as he did. Nesaad is found in a small camp near the Heap. His death closes this immediate operation, but the quest’s next handoff is more revealing than a victory report: Khay’ji has another job, one that leads to Gahruj and the surveying equipment.',
    note: 'The survival report and admission of failure are attributed to Khay’ji. The scene compresses the combat objective and does not invent a motive for Nesaad.',
  },
  {
    id: 'a-contract-in-default', title: 'The survey equipment in dispute', environment: 'eco-dome', location: 'eco-dome-midrealm', characters: ['nether-stalker-khayji', 'consortium-agent-gahruj'], objects: [], quests: ['Request for Assistance (10266)', 'Rightful Repossession (10267)'],
    refs: [{ sourceId: 'consortium-request-assistance', questId: 'Request for Assistance' }, { sourceId: 'consortium-rightful-repossession', questId: 'Rightful Repossession' }],
    narration: 'Khay’ji’s introduction carries the seeker to Gahruj at Eco-Dome Midrealm. The Consortium says surveying gear was delivered to blood-elf buyers and left unpaid. Gahruj asks for the equipment back from Manaforge Duro, where he says mana creatures have occupied the area. He instructs the seeker to use that distraction. His next explanation is blunt: the Consortium wants its property; what happens to the blood elves is of little concern to him. This is Gahruj’s stated commercial motive, not an independent verdict on the dispute.',
    note: 'The unpaid shipment, infestation and Gahruj’s motive are presented as the Consortium’s and Gahruj’s claims. The story does not adjudicate the contract or imply the blood elves caused the mana-creature problem.',
  },
  {
    id: 'the-princes-image', title: 'An audience at the Stormspire', environment: 'stormspire', location: 'consortium-stormspire', characters: ['consortium-agent-gahruj', 'nexus-prince-haramad'], objects: [], quests: ['An Audience with the Prince (10268)'],
    refs: [{ sourceId: 'consortium-audience-prince', questId: 'An Audience with the Prince' }],
    narration: 'Once the boxes of surveying equipment are returned, Gahruj asks for one more delivery: the gear must go to the Stormspire. Haramad is often present there as an image, and the quest calls that meeting an audience. The prince welcomes the traveler, then says the equipment may be set anywhere and suspects it will soon be picked up again. The exchange is almost casual. Beneath it, the surveying tools become the means by which Haramad hopes to locate the crystal missed at Arklon.',
    note: 'The image is Haramad’s holographic presence in the quest, not an in-person meeting. The causal link to triangulation follows the quest sequence, not an added motive.',
  },
  {
    id: 'first-triangulation', title: 'The first point', environment: 'stormspire', location: 'netherstorm-survey-points', characters: ['nexus-prince-haramad'], objects: [], quests: ['Triangulation Point One (10269)'],
    refs: [{ sourceId: 'consortium-triangulation-one', questId: 'Triangulation Point One' }],
    narration: 'Haramad explains that an ancient draenei legend speaks of a crystal with power great enough to be called godlike. He fears the Burning Legion may uncover it first, and gives the surveying equipment a purpose at last: find the first triangulation point. The quest sends the seeker to report to Dealer Hazzin, one of the prince’s agents. The power is the legend as Haramad relays it; the urgency is his stated concern. Neither makes the crystal’s full history certain.',
    note: 'The crystal’s legendary power and the Legion risk stay attributed to Haramad. The stage does not use exact coordinates or assert a surveyed map position.',
  },
  {
    id: 'second-triangulation', title: 'A second bearing', environment: 'farahlon', location: 'netherstorm-survey-points', characters: ['nexus-prince-haramad'], objects: [], quests: ['Triangulation Point Two (10275)'],
    refs: [{ sourceId: 'consortium-triangulation-two', questId: 'Triangulation Point Two' }],
    narration: 'The first reading returns to Hazzin, who recalibrates the device. A second point lies far to the west, and the seeker carries the new reading to Wind Trader Tuluman near Manaforge Ara. The two points do not yet name a single object or settle its origin; they narrow the search. Tuluman’s report gives the prince a general vicinity for the crystal, enough to replace legend with a destination but not yet with possession.',
    note: 'The second-point turn-in says it gives the general vicinity. This narration does not claim precise map coordinates or a complete historical triangulation model.',
  },
  {
    id: 'the-moving-crystal', title: 'Full Triangle', environment: 'farahlon', location: 'consortium-ruins-of-farahlon', characters: ['nexus-prince-haramad', 'culuthas'], objects: ['ata-mal-crystal'], quests: ['Full Triangle (10276)'],
    refs: [{ sourceId: 'consortium-full-triangle', questId: 'Full Triangle' }],
    narration: 'With both readings, Haramad places the crystal atop the Ruins of Farahlon. The quest data says it is moving and supposes the Burning Legion has already found it. Culuthas carries the Ata’mal Crystal; the seeker is sent to defeat the demon and bring it back. The collection that began with an unremarkable Arklon artifact now yields the object the prince sought. Haramad calls the recovery beyond his expectations and praises the traveler’s selflessness, but the quest does not explain the crystal’s whole past.',
    note: 'The crystal’s movement and Legion discovery are framed as the quest’s inference. Haramad’s praise is his response; it does not establish the Consortium’s earlier work as altruistic.',
  },
  {
    id: 'spirits-song', title: 'Spirit’s Song', environment: 'shattrath', location: 'shattrath-city', characters: ['nexus-prince-haramad', 'adal'], objects: ['ata-mal-crystal'], quests: ['Special Delivery to Shattrath City (10280)'],
    refs: [{ sourceId: 'consortium-special-delivery', questId: 'Special Delivery to Shattrath City' }],
    narration: 'Haramad gives the crystal to the seeker and sends it to A’dal at the Terrace of Light, with his personal teleporter as the road. A’dal recognizes it as Spirit’s Song. He says Prophet Velen left it with his people before departing on the mission to the Exodar, then wonders whether Velen foresaw that it would pass briefly into the Legion’s hands and be returned. That explanation belongs to A’dal’s reflection. The quest invites wonder, but does not turn his speculation into a proven prophecy.',
    note: 'A’dal’s identification and conjecture are attributed to his quest turn-in. The art uses an existing abstract A’dal figure and does not show a canonical crystal model.',
  },
  {
    id: 'the-message-in-the-crystal', title: 'A message embedded within', environment: 'shattrath', location: 'shattrath-city', characters: ['adal', 'nexus-prince-haramad'], objects: ['ata-mal-crystal'], quests: ['How to Break Into the Arcatraz (10704)'],
    refs: [{ sourceId: 'consortium-arcatraz-key-quest', questId: 'How to Break Into the Arcatraz' }, { sourceId: 'consortium-blizzard-arcatraz-chain', questId: 'How to Break Into the Arcatraz' }],
    narration: 'The next instruction reveals what the crystal carried beyond its power and history: a message was embedded within it. Haramad has supplied information A’dal calls vital to the campaign against Tempest Keep. The Arcatraz is a prison satellite there, and two shards will make its key. A’dal asks for both. This is the turn from Consortium investigation to prison campaign. The crystal does not open the way by itself; it has delivered the intelligence that makes the next journey legible.',
    note: 'The quest describes a message embedded in the crystal but does not disclose its full contents. This story does not invent or reconstruct the message.',
  },
  {
    id: 'mechanar-shard', title: 'The Bottom Shard', environment: 'mechanar', location: 'the-mechanar', characters: ['pathaleon-the-calculator'], objects: ['key-to-the-arcatraz'], quests: ['How to Break Into the Arcatraz (10704)'],
    refs: [{ sourceId: 'consortium-arcatraz-key-quest', questId: 'How to Break Into the Arcatraz' }],
    narration: 'One shard is held by Pathaleon the Calculator in the Mechanar. The destination is one of Tempest Keep’s floating wings, a machine-world of precise metal and crystal. The quest asks for the Bottom Shard as one part of a pair; it does not say that Pathaleon alone controls the prison. The search remains divided across two dungeons, and the first fragment is only useful when reunited with its counterpart.',
    note: 'The shard’s position and the boss association follow the quest description. The environmental illustration is not a dungeon plan or exact boss-room layout.',
  },
  {
    id: 'botanica-shard', title: 'The Top Shard', environment: 'botanica', location: 'the-botanica', characters: ['warp-splinter'], objects: ['key-to-the-arcatraz'], quests: ['How to Break Into the Arcatraz (10704)'],
    refs: [{ sourceId: 'consortium-arcatraz-key-quest', questId: 'How to Break Into the Arcatraz' }],
    narration: 'The other shard lies in the Botanica, held by the ancient being Warp Splinter. Here Tempest Keep’s exacting architecture meets living growth. The Top Shard and the Mechanar’s Bottom Shard complete the pair named by A’dal. Their collection is an access task, and the quest does not claim the two encounters happen on a shared expedition or in a fixed historical interval. Only after both have been recovered can the key take its final form.',
    note: 'The shard and holder are named in A’dal’s quest text. The order of the two dungeon scenes is editorial for readability; no ordering between separate dungeon runs is asserted.',
  },
  {
    id: 'the-key-reunited', title: 'Two shards become one key', environment: 'shattrath', location: 'shattrath-city', characters: ['adal'], objects: ['key-to-the-arcatraz'], quests: ['How to Break Into the Arcatraz (10704)'],
    refs: [{ sourceId: 'consortium-arcatraz-key-quest', questId: 'How to Break Into the Arcatraz' }, { sourceId: 'consortium-blizzard-arcatraz-chain', questId: 'How to Break Into the Arcatraz' }],
    narration: 'Back at the Terrace of Light, A’dal receives both fragments and combines them into the Key to the Arcatraz. The step ends the access chain’s central labor: Haramad’s clues carried the search from survey equipment to a crystal, and the crystal’s message gave the prison its key. The lock can now be opened. The place beyond it is not a reward chamber, however, but a satellite prison whose containment is already in danger.',
    note: 'The combining and access outcome are in the quest and Blizzard’s chain listing. Karazhan’s separate Arcatraz key-fragment encounter is not retold here.',
  },
  {
    id: 'the-prison-breaks', title: 'Containment begins to fail', environment: 'arcatraz', location: 'arcatraz', characters: ['adal'], objects: ['key-to-the-arcatraz'], quests: ['Harbinger of Doom (10882)'],
    refs: [{ sourceId: 'consortium-harbinger-quest', questId: 'Harbinger of Doom' }],
    narration: 'When A’dal calls the traveler back, the prison’s danger is immediate. He says Kael’thas chose his warden poorly and that entities once locked inside the Arcatraz are breaking free. The quest does not name every prisoner or explain how each containment failed. Its next warning narrows the threat to one escapee. The key has opened a route into Tempest Keep; it has not made the prison safe, and the first account of the breach comes from A’dal.',
    note: 'The breach and warden judgment are attributed to A’dal. Unnamed prisoners remain an environmental threat, not a fabricated roster.',
  },
  {
    id: 'skyriss-contained', title: 'The Harbinger is stopped', environment: 'arcatraz', location: 'arcatraz', characters: ['adal', 'harbinger-skyriss'], objects: [], quests: ['Harbinger of Doom (10882)'],
    refs: [{ sourceId: 'consortium-harbinger-quest', questId: 'Harbinger of Doom' }],
    narration: 'A’dal identifies Harbinger Skyriss as a servant of the Old Gods and says he seeks to bring his masters’ vision of universal conquest to pass. The warning is A’dal’s account of the prisoner, not an omniscient report of every Old God’s plan. The quest sends the seeker to kill Skyriss before he can escape. On the return, A’dal says that countless thousands would have perished if the Harbinger had broken free, comparing the danger to Skeram. That spared future is his claim; the confirmed ending is narrower: Skyriss is slain, and the immediate breach is checked. The prison’s other captives and the wider purpose behind them remain unresolved.',
    note: 'Skyriss’s allegiance, goal and hypothetical casualty count are all attributed to A’dal. The quest resolves the immediate assignment, not the origin of every prisoner or the Old Gods’ wider plan.',
  },
];

const nodeIds = beats.map((beat) => `${storyId}-story-${beat.id}`);
const sceneFigureIds = distinct(beats.flatMap((beat) => [...beat.characters, ...beat.objects]));
const allSourceIds = distinct(beats.flatMap((beat) => beat.refs.map((ref) => ref.sourceId)).concat(environments.flatMap((environment) => environment.sources), ['consortium-blizzard-arcatraz-chain', 'consortium-netherstorm-visual-locator']));

for (const figure of figures.filter((figure) => sceneFigureIds.includes(figure.id))) {
  await stat(path.join(root, 'public', figure.asset));
  if (figure.id === 'adal') {
    const existing = await readJson('data/entities/adal.research.json');
    existing.sourceIds = distinct([...existing.sourceIds, ...figure.sources]);
    existing.featuredEraIds = distinct([...(existing.featuredEraIds ?? []), eraId]);
    existing.tags = distinct([...(existing.tags ?? []), 'consortium-arcatraz-story']);
    await write('data/entities/adal.research.json', existing);
    continue;
  }
  const sharedSources = distinct(beats.filter((beat) => beat.characters.includes(figure.id) || beat.objects.includes(figure.id)).flatMap((beat) => beat.refs.map((ref) => ref.sourceId)));
  const interpretive = figure.type === 'artifact'
    ? 'This is original interpretive art, not a canonical item model or source of undocumented physical properties.'
    : 'This is original interpretive art, not canonical game art or proof of exact appearance, costume, formation, or simultaneous presence.';
  await write(`data/entities/${figure.id}.research.json`, {
    id: figure.id,
    type: figure.type,
    name: figure.name,
    slug: figure.id,
    shortDescription: `${figure.name}, represented in the Consortium and Arcatraz research story.`,
    body: `${figure.description} ${interpretive} Compare it with the original Burning Crusade client/model before human review. See docs/research/consortium-and-arcatraz-visual-assets.json.`,
    firstEraId: eraId,
    featuredEraIds: [eraId],
    sourceIds: distinct([...figure.sources, ...sharedSources]),
    tags: ['consortium-arcatraz-story', 'interpretive-art'],
    ...(figure.type === 'artifact' ? { mapVisual: { asset: figure.asset, scale: figure.scale } } : figure.type === 'character' ? { mapFigure: { asset: figure.asset, scale: figure.scale } } : { mapVisual: { asset: figure.asset, scale: figure.scale } }),
    contentStatus: 'research',
  });
}

for (const location of locations) {
  const existingPath = `data/entities/${location.id}.research.json`;
  let entity;
  try { entity = await readJson(existingPath); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  if (entity) {
    entity.sourceIds = distinct([...(entity.sourceIds ?? []), ...location.sources]);
    entity.featuredEraIds = distinct([...(entity.featuredEraIds ?? []), eraId]);
    entity.tags = distinct([...(entity.tags ?? []), 'consortium-arcatraz-story']);
    if (!entity.body?.includes(location.description)) entity.body = `${entity.body ?? ''} ${location.description} The story’s position is relational; no exact map coordinate is asserted.`.trim();
  } else {
    entity = {
      id: location.id,
      type: 'location',
      name: location.name,
      slug: location.id,
      shortDescription: `${location.name}, a named setting in the Consortium and Arcatraz research story.`,
      body: `${location.description} Its story art is interpretive; no exact map coordinate, dungeon floor plan or travel route is asserted. See docs/research/consortium-and-arcatraz-visual-assets.json.`,
      firstEraId: eraId,
      featuredEraIds: [eraId],
      sourceIds: location.sources,
      tags: ['consortium-arcatraz-story', 'burning-crusade-location'],
      contentStatus: 'research',
    };
  }
  await write(existingPath, entity);
}

const adjacency = new Map(sceneFigureIds.map((id) => [id, new Set()]));
for (const beat of beats) {
  const together = [...beat.characters, ...beat.objects];
  for (const id of together) for (const other of together) if (id !== other) adjacency.get(id).add(other);
}
const slots = new Map();
for (const id of sceneFigureIds) {
  const occupied = new Set([...adjacency.get(id)].map((neighbor) => slots.get(neighbor)).filter((slot) => slot !== undefined));
  let slot = 0;
  while (occupied.has(slot)) slot++;
  slots.set(id, slot);
}
const maxSlot = Math.max(...slots.values());
const features = [];
for (const id of sceneFigureIds) {
  const figure = figureById.get(id);
  const geometryId = `${storyId}-${id}-focus`;
  const sourceIds = distinct(beats.filter((beat) => beat.characters.includes(id) || beat.objects.includes(id)).flatMap((beat) => beat.refs.map((ref) => ref.sourceId)));
  features.push({ type: 'Feature', id: geometryId, properties: { name: `${figure.name} editorial focus`, contentStatus: 'research', styleRole: 'site', geographicCertainty: 'unknown' }, geometry: { type: 'Point', coordinates: [2800 + (slots.get(id) * 4400 / Math.max(1, maxSlot)), 5400] } });
  await write(`data/spatial-states/${storyId}-${id}.research.json`, {
    id: `${storyId}-${id}-theater`, entityId: id, eraId, worldspaceId, geometryId,
    placementKind: 'relational', geographicCertainty: 'unknown', sourceIds,
    editorNote: `Editorial placement for ${figure.name} in an illustrated story theater. It is not a geographic position, literal formation, dungeon map or unsupported co-presence claim. Original TBC client/model comparison remains open.`,
    visualPresence: 'contextual', labelPriority: 230,
  });
}
await write(`data/geometry/${worldspaceId}.research.geojson`, { type: 'FeatureCollection', features });
await write(`data/worldspaces/${worldspaceId}.research.json`, {
  id: worldspaceId,
  name: 'The Consortium and the Arcatraz — relational story theater',
  slug: worldspaceId,
  coordinateSystem: { width: 10000, height: 10000, origin: 'bottom-left', units: 'atlas-units' },
});

const nodes = [];
for (let index = 0; index < beats.length; index++) {
  const beat = beats[index];
  const nodeId = nodeIds[index];
  const eventId = `${nodeId}-event`;
  const claimId = `${nodeId}-claim`;
  const citationIds = [];
  for (let sourceIndex = 0; sourceIndex < beat.refs.length; sourceIndex++) {
    const ref = beat.refs[sourceIndex];
    const citationId = `${nodeId}-citation-${sourceIndex + 1}`;
    citationIds.push(citationId);
    await write(`data/citations/${citationId}.research.json`, {
      id: citationId,
      sourceId: ref.sourceId,
      questId: ref.questId,
      section: `${beat.title}; directly relevant quest description, objective, completion or official quest-chain entry`,
      note: 'Original paraphrase from an official retrospective chain list or secondary transcription of in-game quest material. It is not an original-client capture; compare the quest and edition/build before human approval.',
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
    editorNote: `${beat.note} Research status: accessible sources reproduce quest material but are not original-client captures. Do not promote before source and edition review.`,
  });
  const environment = environmentById.get(beat.environment);
  const eventSourceIds = distinct([...beat.refs.map((ref) => ref.sourceId), ...environment.sources]);
  await write(`data/events/${eventId}.research.json`, {
    id: eventId,
    kind: 'event',
    name: beat.title,
    slug: eventId,
    eraId,
    worldspaceId,
    date: { precision: 'relative', label: 'The Burning Crusade · quest sequence; exact date unknown' },
    summary: beat.narration,
    locationIds: [beat.location],
    participantEntityIds: beat.characters,
    sourceIds: eventSourceIds,
    claimIds: [claimId],
    contentStatus: 'research',
  });
  const mapStateId = `${storyId}-${beat.id}-scene`;
  await write(`data/map-states/${mapStateId}.research.json`, {
    id: mapStateId,
    name: `${storyId} story: ${environment.title}`,
    worldspaceId,
    presentation: 'relational',
    terrainTextureAsset: environment.asset,
    geometryIds: [],
    cartographyLabel: 'ILLUSTRATED QUESTLINE THEATER',
    interpretationNote: `${environment.review} Recognizable Burning Crusade area traits: ${environment.traits} Figures and objects are editorial story placements, not a literal event composition, surveyed location, dungeon floor plan or proof of simultaneous co-presence. See docs/research/consortium-and-arcatraz-visual-assets.json.`,
  });
  const entities = [...beat.characters, ...beat.objects];
  const words = beat.narration.trim().split(/\s+/).length;
  nodes.push({
    id: nodeId,
    guideId,
    title: beat.title,
    narration: beat.narration,
    durationMs: Math.min(90000, Math.max(18000, Math.round(((words / 82) * 60000) / 500) * 500 + 5000)),
    eventIds: [eventId],
    entityIds: entities,
    locationIds: [beat.location],
    camera: { position: [0, 6.1, 5.4], target: [0, 0, 0], durationMs: 1050 },
    visualActions: [
      { type: 'set_map_state', mapStateId },
      ...entities.map((entityId) => ({ type: 'highlight_entity', entityId })),
    ],
    ...(previousVoiceovers.has(nodeId) ? { voiceover: previousVoiceovers.get(nodeId) } : {}),
    ...(index ? { previousNodeId: nodeIds[index - 1] } : {}),
    ...(index < beats.length - 1 ? { nextNodeIds: [nodeIds[index + 1]] } : {}),
  });
}

const chapters = [
  { id: 'false-leads-and-field-work', title: 'False leads and field work', body: 'Khay’ji’s first crystal proves unremarkable; the Zaxxis break and Nesaad report expose the Consortium’s unsettled work. Gahruj then makes a disputed equipment contract the price of access to the prince. Scenes 1–5.' },
  { id: 'the-ata-mal-search', title: 'The search for the Ata’mal Crystal', body: 'Haramad’s legend and the two triangulation readings lead to Culuthas at the Ruins of Farahlon. The returned crystal is named Spirit’s Song by A’dal, whose account of Velen remains speculative. Scenes 6–9.' },
  { id: 'two-shards-and-a-prison', title: 'Two shards and a prison', body: 'A message in the crystal sends the seeker to the Mechanar and Botanica for two key shards. A’dal combines them, then calls for Skyriss to be stopped as the prison’s containment fails. The immediate threat is answered; the wider prisoner story remains unresolved. Scenes 10–15.' },
];
await write(storyPath, {
  guide: {
    id: guideId,
    eraId,
    title: 'The Consortium and the Arcatraz prison',
    description: 'Fifteen illustrated scenes follow Khay’ji’s false leads, Haramad’s triangulation search, A’dal’s Arcatraz key, and the immediate threat posed by Harbinger Skyriss.',
    nodeIds,
    contentStatus: 'research',
  },
  nodes,
});

await write(`data/storylines/${storyId}.research.json`, {
  id: storyId,
  slug: storyId,
  title: 'The Consortium and the Arcatraz prison',
  summary: 'Khay’ji’s false lead and the Consortium’s unsettled contracts give way to Haramad’s crystal search. When a message in the Ata’mal Crystal reveals how to forge the Arcatraz key, A’dal turns the campaign toward a prison breach and Harbinger Skyriss.',
  opening: 'In Netherstorm, one recovered crystal is probably the wrong one, a Consortium spy admits failure, and the surveying job carries its own dispute. Beyond those first leads, Nexus-Prince Haramad is looking for an object whose power is only half its story.',
  primaryEraId: eraId,
  eraIds: [eraId],
  chapters: chapters.map((chapter) => ({ ...chapter, eraId })),
  sourceIds: allSourceIds,
  storyGuideId: guideId,
  showInEraTourOffshoots: false,
  reviewNote: 'Complete 15-scene illustrated research StoryGuide with per-node source, citation and claim records, transcript-matched voice tracks after generation, dedicated Netherstorm / Tempest Keep art, and original interpretive figures for its named cast and pivotal objects. Aldor/Scryer start variants remain separate; Gahruj’s contract motives and A’dal’s prisoner revelations are attributed. The first Arklon crystal is a false lead. The Harbinger ending resolves Skyriss’s immediate threat but does not explain the wider prison or Old God plan. This StoryTour placement is editorial, adjacent to Karazhan, with no date or cross-story dependency implied; Karazhan’s third key fragment is a separate Arcatraz visit and is not retold. Original 2007 client/build comparison, exact dialogue capture, area/model resemblance review, source review and voice audition remain open. No record is reviewed or published.',
  contentStatus: 'research',
});

const eraPath = `data/eras/${eraId}.research.json`;
const era = await readJson(eraPath);
era.sourceIds = distinct([...era.sourceIds, ...allSourceIds]);
await write(eraPath, era);

const tourPath = 'data/story-tours/classic-to-wrath.research.json';
const tour = await readJson(tourPath);
tour.entries = tour.entries.filter((entry) => entry.storylineId !== storyId);
const karazhanIndex = tour.entries.findIndex((entry) => entry.storylineId === 'karazhan-masters-key-and-nightbane');
if (karazhanIndex < 0) throw new Error('Could not locate Karazhan for the editorial StoryTour placement.');
tour.entries.splice(karazhanIndex + 1, 0, {
  storylineId: storyId,
  regionIds: ['outland'],
  mapPositionPercent: [88, 74],
  order: karazhanIndex + 2,
  periodLabel: 'The Burning Crusade · Consortium and Arcatraz quest chain',
  locationLabel: 'Netherstorm · Shattrath · Tempest Keep',
});
tour.entries.forEach((entry, index) => { entry.order = index + 1; });
const chronologyMarker = 'The Consortium and Arcatraz stop follows Karazhan as an editorial Burning Crusade placement; it claims neither a precise date nor a dependency between stories. Karazhan’s Arcatraz visit is a separate key-fragment quest and is not retold here.';
if (!tour.chronologyNote.includes(chronologyMarker)) tour.chronologyNote += ` ${chronologyMarker}`;
tour.reviewNote = 'Research StoryTour collection with 21 map placards, 20 playable research StoryGuides and one research preview. Play All follows the authored editorial sequence and skips the preview. Story-tour map markers are navigational layout positions, not exact geography; each storyline remains research until its human review gates are complete.';
await write(tourPath, tour);

const candidatesPath = 'docs/research/questline-story-candidates.md';
let candidates = await readFile(path.join(root, candidatesPath), 'utf8');
const candidatePattern = /### 19\. The Consortium and the Arcatraz prison[\s\S]*?(?=\n### 20\.)/;
const candidate = candidates.match(candidatePattern)?.[0];
if (!candidate) throw new Error('Could not find candidate 19 in the storyline guide.');
const cleanCandidate = candidate.replace(/\n\*\*Implementation:\*\*[\s\S]*$/, '');
const implementation = '\n\n**Implementation:** Complete 15-scene illustrated research StoryGuide with quest-by-quest citation and claim records, transcript-matched narration, dedicated Netherstorm and Tempest Keep scene art, and original cast and artifact figures. Added as a separate Classic-to-Wrath StoryTour placard immediately after Karazhan; this editorial placement claims no relative date or dependency. Karazhan’s third key fragment is a separate Arcatraz visit and is not retold. The initial faction quest can begin through either the Aldor or Scryers contact. Gahruj’s motives, Haramad’s search account, A’dal’s speculation and Skyriss’s alleged purpose remain attributed; the ending contains the immediate threat while leaving the wider prisoner story open. Original-client dialogue/build evidence, human lore/source review, TBC area/model resemblance review and audio audition remain open. See the [research packet](consortium-and-arcatraz-research.md), [production ledger](consortium-and-arcatraz-production.md), and [visual asset ledger](consortium-and-arcatraz-visual-assets.json).';
candidates = candidates.replace(candidatePattern, `${cleanCandidate.trimEnd()}${implementation}\n`);
await writeText(candidatesPath, candidates);

const productionRows = beats.map((beat, index) => {
  const names = [...beat.characters, ...beat.objects].map((id) => figureById.get(id)?.name ?? id).join('; ');
  const environment = environmentById.get(beat.environment);
  return `| ${index + 1} | ${beat.title} | ${beat.quests.join('; ')} | ${environment.title} | ${names || 'environment scene'} | ${distinct(beat.refs.map((ref) => ref.sourceId)).join('; ')} |`;
}).join('\n');
const researchBeatRows = beats.map((beat, index) => {
  const sourcesForBeat = distinct(beat.refs.map((ref) => ref.sourceId));
  const locators = sourcesForBeat.map((id) => {
    const source = sources.find(([sourceId]) => sourceId === id);
    return source ? `[${source[1]}](${source[2]})` : id;
  }).join('; ');
  return `| ${index + 1} | ${beat.title} | ${beat.quests.join('; ')} | ${locators} | ${beat.note.replaceAll('|', '\\|')} |`;
}).join('\n');
const sourceRows = sources.map(([, title, url, sourceType, notes]) => `- [${title}](${url}) — ${sourceType}; ${notes}`).join('\n');
await writeText('docs/research/consortium-and-arcatraz-research.md', `# The Consortium and the Arcatraz — research packet

Status: research; no automatic lore approval. This packet records the accessible evidence used to author the story and the questions still requiring original-client and human review.

## Candidate and scope

- Candidate: **The Consortium and the Arcatraz prison** (${storyId}), Candidate 19 in the storyline guide.
- Target: original *The Burning Crusade* quest era, before Wrath-era changes. Exact original client patch/build is not yet fixed or compared.
- Story question: how does a Consortium crystal search lead to the Arcatraz key, and what danger does A’dal say the prison must contain?
- Editorial spine: Khay’ji’s early work and the disputed equipment contract; Haramad’s triangulation; the Ata’mal Crystal / Spirit’s Song; the two Arcatraz key shards; A’dal’s assignment concerning Harbinger Skyriss.
- Explicit boundary: the story is a separate Classic-to-Wrath StoryTour placard. Its placement after Karazhan is editorial and establishes neither a date nor a quest dependency. Karazhan’s third-key-fragment visit to the Arcatraz is separate and is not retold. No entry is added to EraTour.
- Narrative omissions: repeatable collection and combat objectives are compressed; they are not asserted to be unique events. The Mechanar and Botanica shard chapters follow the published quest exposition order, not a claimed fixed order of dungeon visits. We do not explain the origins or full purpose of every Arcatraz prisoner.

## Evidence method and confidence

Blizzard’s retrospective Burning Crusade Classic overview supplies the listed chain and the Aldor/Scryers starting alternatives. Its list is first-party, but it is not a capture of the original 2007 client. Individual dialogue and task details currently rely on secondary quest transcriptions linked below. Each character’s motive, recollection, interpretation, or prediction stays attributed to that speaker. Quest-log sequence is treated as an editorial chain; it is not proof of exact elapsed time, travel route, historical co-presence, or a canonical ordering between parallel faction starts.

All public narration is original paraphrase. The art is original interpretive illustration and is not evidence for lore, exact map coordinates, dungeon layouts, canonical models, or co-presence. The map placard is a navigational layout position rather than an exact geographic point. Data remains contentStatus: research pending human review.

## Quest path and variants

The opening Consortium chapters use the Area 52 crystal / Zaxxis / Nesaad work and the Gahruj contract line as context for Haramad’s surveying assignment. The documented branches converge on **An Audience with the Prince** and the triangulation chain. Blizzard lists the initial shard chain through either **Allegiance to the Aldor** or **Allegiance to the Scryers**; these are alternate contacts, not two consecutive tasks assigned to one adventurer. **How to Break Into the Arcatraz** then calls for the Bottom Shard from Pathaleon in the Mechanar and the Top Shard from Warp Splinter in the Botanica. A’dal combines them into the key. The story orders the two shard scenes for exposition only. **Harbinger of Doom** is the concluding cited assignment.

## Beat and claim ledger

| Beat | Story scene | Quest anchor | Supporting locator | Attribution / limitation |
|---:|---|---|---|---|
${researchBeatRows}

## Source register

${sourceRows}

The Wowhead pages are used as accessible secondary locators for quest titles, text and objectives; none replaces a lawful capture from the original TBC client. The Netherstorm page is used only as a place-name locator for area resemblance work, not as validation of the generated art.

## Open questions and review gates

- Capture the relevant quests, dialogue, objective behavior, turn-ins, and faction alternatives from the intended original TBC client build; compare each transcription and the Blizzard retrospective listing.
- Verify prerequisites and the exact Aldor/Scryers convergence against that build. Confirm that the introductory Consortium work is editorial context and does not imply a prerequisite edge absent from the game.
- Review Gahruj’s contract account; Haramad’s account of the crystal and Legion; A’dal’s identification, recollection and speculation; and Skyriss’s allegiance and stated purpose. Preserve the speaker attribution unless corroborated.
- Confirm the crystal’s identification as Ata’mal / Spirit’s Song and the key-fragment holders in the target build. Do not infer a complete history for the crystal or prisoners.
- Compare Area 52, the Heap, Eco-Dome Midrealm, Stormspire, Farahlon, Shattrath, the Mechanar, Botanica, Arcatraz and all figures/artifacts against the corresponding TBC areas and models. The visual ledger records reference locators and asset provenance; human side-by-side review remains open.
- Audition all 15 generated narration tracks for pronunciation, transcript agreement, pacing, and scene transitions. No audio track has been human-approved.
- Keep content at research; promote no source, claim, event, entity, or story to reviewed/published without human review under repository policy.
`);
await writeText('docs/research/consortium-and-arcatraz-production.md', `# The Consortium and the Arcatraz — production ledger\n\nStatus: research. Every claim, generated image and voice track remains unreviewed. Target: original Burning Crusade quest era, before Wrath-era changes; current evidence uses Blizzard’s retrospective chain listing and secondary reproductions of quest text.\n\n## Story and evidence handling\n\nThe editorial spine follows the Arcatraz access and Harbinger quest sequence listed by Blizzard. The Consortium work includes two faction-dependent starting contacts, so no single adventurer is shown accepting both. Repeated collection and combat objectives are compressed into the decisions and revelations they support. The unremarkable Arklon crystal remains a false lead; the Ata’mal Crystal and A’dal’s later name Spirit’s Song remain the quest chain’s stated identification.\n\nThe quest texts for 10265, 10262, 10205, 10266, 10267, 10268, 10269, 10275, 10276, 10280, 10704 and 10882 were reviewed through the cited Wowhead TBC transcriptions. Blizzard’s guide is used for its published quest sequence and starting variants. These accessible sources are not original 2007 client captures. Narration is original paraphrase; no game dialogue is copied into the story. All character claims and the hypothetical escaped-prisoner outcome stay attributed.\n\n## Story beats\n\n| # | Node | Quest anchor | Environment | Cast / object figures | Claim sources |\n|---:|---|---|---|---|---|\n${productionRows}\n\nThe Mechanar and Botanica shard scenes follow the exposition order of A’dal’s quest; the two dungeon runs are not claimed to have a fixed historical order. Harbinger of Doom follows the key chain in Blizzard’s published list. The story ends after Skyriss is slain: A’dal’s escaped-prisoner outcome is a counterfactual claim, while the immediate assignment’s completion is the quest-recorded event. The origins of the other prisoners and the Old Gods’ wider purpose remain unanswered.\n\n## StoryTour placement\n\nThe story is a separate Classic-to-Wrath StoryTour entry placed after Karazhan as an editorial Burning Crusade stop. This implies no relative date or dependency between the stories. The Arcatraz portion of the Karazhan story concerns its own third-key-fragment task and is not repeated here. This work is not placed in EraTour.\n\n## Review gates\n\n- Compare every new and reused environment, figure and artifact with the corresponding original Burning Crusade area/model. Images are original interpretations, not in-client evidence.\n- Capture the complete quest dialogue and behavior from the intended 2007 build and compare it with each secondary transcription.\n- Review the two faction-dependent starting paths, the Crystal / Spirit’s Song identification, each attributed motive, the prison breach account and A’dal’s hypothetical counterfactual.\n- Audition every narration track for pronunciation, duration, transcript match and scene transitions before promoting records.\n`);

const visualRows = [];
for (const environment of environments) {
  const bytes = await readFile(path.join(root, 'public', environment.asset));
  const info = await stat(path.join(root, 'public', environment.asset));
  visualRows.push({ id: environment.id, kind: 'environment', title: environment.title, assetPath: environment.asset, sha256: sha256(bytes), byteLength: info.size, provenance: environment.reuse ? `Reused original project illustration from ${environment.reuse}.` : 'Original AI-generated environment illustration.', recognizableTbcTraits: environment.traits, visualReference: { locator: environment.sources.map((sourceId) => sources.find(([id]) => id === sourceId)?.[2]).filter(Boolean), comparisonCapture: 'Not captured; human side-by-side review against the original TBC area/build remains open.' }, compositionPrompt: environment.reuse ? 'Existing project art reused because the named place and historical presentation fit this scene.' : `Original painterly illustration for ${environment.title}. Preserve these Burning Crusade-era traits: ${environment.traits} No copied game screenshot, logos, text or UI.`, transparency: false, sourceIds: environment.sources, visualReview: `${environment.review} The image is interpretive and does not establish exact coordinates, layout or character co-presence.` });
}
for (const figure of figures.filter((figure) => sceneFigureIds.includes(figure.id))) {
  const bytes = await readFile(path.join(root, 'public', figure.asset));
  const info = await stat(path.join(root, 'public', figure.asset));
  visualRows.push({ id: figure.id, kind: figure.type === 'artifact' ? 'artifact' : 'figure', title: figure.name, assetPath: figure.asset, sha256: sha256(bytes), byteLength: info.size, provenance: figure.reuse ? `Reused original project figure from ${figure.reuse}.` : 'Original AI-generated interpretive cutout.', recognizableTraits: figure.description, sourceIds: figure.sources, transparency: true, visualReview: 'Compare against the original TBC client/item model. The art is not canonical model evidence, does not establish exact appearance, and is shown only in the relevant story beats.' });
}
await write('docs/research/consortium-and-arcatraz-visual-assets.json', {
  storyId,
  targetEditionBuild: 'World of Warcraft: The Burning Crusade original quest era, before Wrath-era changes; exact 2.0.3–2.4.3 client/build comparison remains open.',
  status: 'research',
  note: 'All new art is original interpretive illustration. Recognizable zone materials, silhouettes and palettes guide resemblance; none of these files is an in-client screenshot or a source for lore claims.',
  assets: visualRows,
});

process.stdout.write(`Authored ${nodes.length} nodes, ${allSourceIds.length} linked sources, ${locations.length} locations, and ${visualRows.length} visual assets for ${storyId}.\n`);
