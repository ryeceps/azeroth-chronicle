import { createHash } from 'node:crypto';
import { access, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const storyId = 'defias-original-conspiracy';
const guideId = `${storyId}-guide`;
const eraId = 'age-of-adventurers';
const worldspaceId = 'defias-story-theater';
const imageDir = 'images/storylines/defias';
const output = async (file, data) => {
  const fullPath = path.join(root, file);
  await mkdir(path.dirname(fullPath), { recursive: true });
  await writeFile(fullPath, typeof data === 'string' ? data : `${JSON.stringify(data, null, 2)}\n`);
};

const quests = [
  ['defias-quest-65', 65, 'The Defias Brotherhood', 'Gryan sends the adventurer to Wiley in Lakeshire; Westfall residents are being driven from their land.'],
  ['defias-quest-132', 132, 'The Defias Brotherhood', 'Wiley’s written intelligence reports cooperation between the Defias and other groups.'],
  ['defias-quest-135', 135, 'The Defias Brotherhood', 'Gryan asks Mathias Shaw to examine a possible Stonemasons connection.'],
  ['defias-quest-141', 141, 'The Defias Brotherhood', 'Shaw’s report links VanCleef to the rebuilding guild and describes its grievance.'],
  ['defias-quest-142', 142, 'The Defias Brotherhood', 'Gryan seeks a messenger’s message and reports a captured thief’s offer.'],
  ['defias-quest-155', 155, 'The Defias Brotherhood', 'The player escorts the traitor to the Brotherhood’s hideout.'],
  ['defias-quest-166', 166, 'The Defias Brotherhood', 'The objective sends the player against VanCleef; Gryan calls the result a beginning.'],
  ['defias-quest-373', 373, 'The Unsent Letter', 'A letter found on VanCleef begins a separate report trail to Baros Alexston.'],
  ['defias-quest-389', 389, 'Bazil Thredd', 'Bazil recounts the Stonemasons’ grievance and the riot from his viewpoint.'],
  ['defias-quest-391', 391, 'The Stockades Riots', 'Warden Thelwater directs the player into the riot and orders Bazil killed.'],
  ['defias-quest-392', 392, 'The Curious Visitor', 'Thelwater recalls a visitor registered under the name Maelik.'],
  ['defias-quest-393', 393, 'Shadow of the Past', 'Shaw identifies Marzon and names Lord Gregor Lescovar as his employer.'],
  ['defias-quest-350', 350, 'Look to an Old Friend', 'Shaw explains his concern about bringing a connected noble to justice and directs the player to Trias.'],
  ['defias-quest-2745', 2745, 'Infiltrating the Castle', 'Trias introduces Tyrion, who has watched Lescovar.'],
  ['defias-quest-2746', 2746, 'Items of Some Consequence', 'Tyrion prepares a Spybot, silk, and apples for the planned observation.'],
  ['defias-quest-434', 434, 'The Attack!', 'The player is sent to overhear the meeting and kill Lescovar and Marzon.'],
  ['defias-quest-394', 394, 'The Head of the Beast', 'The player reports Lescovar’s death to Shaw.'],
  ['defias-quest-395', 395, 'Brotherhood’s End', 'Shaw advises secrecy and sends the player to Baros.'],
  ['defias-quest-396', 396, 'An Audience with the King', 'Baros’s report reaches Katrana Prestor because Varian is away.'],
].map(([id, questNumber, title, coverage]) => ({
  id,
  questNumber: String(questNumber),
  title,
  url: `https://classicdb.ch/?quest=${questNumber}`,
  coverage,
}));
const sourceById = new Map(quests.map((source) => [source.id, source]));
const chainSourceId = 'defias-chain-locator';
for (const source of quests) {
  await output(`data/sources/${source.id}.research.json`, {
    id: source.id,
    title: `${source.title} · Classic quest ${source.questNumber}`,
    url: source.url,
    sourceType: 'quest',
    notes: `Accessed 2026-10-02. ClassicDB quest-text transcription used as a locator for this narrow claim: ${source.coverage} This is not an original-client capture; verify the matching pre-Cataclysm client before human review.`,
  });
}
await output(`data/sources/${chainSourceId}.research.json`, {
  id: chainSourceId,
  title: 'Defias Brotherhood quest-chain index',
  url: 'https://warcraft.wiki.gg/wiki/Defias_Brotherhood_quest_chain',
  sourceType: 'website',
  notes: 'Accessed 2026-10-02. Secondary discovery locator for the chain and its branches. Individual Classic quest transcriptions carry the claims; this index is not treated as proof that every branch is a prerequisite or a historical causal link.',
});

const places = [
  { id: 'defias-westfall', name: 'Westfall', env: 'westfall-plains', traits: 'Original World of Warcraft Classic: dry, wind-scoured golden fields, sparse farms, pale dirt roads, and the Sentinel Hill watchtower. No exact farm or battle position is asserted.' },
  { id: 'defias-lakeshire', name: 'Lakeshire, Redridge Mountains', env: 'redridge-lakeshire', traits: 'Original World of Warcraft Classic: red-orange wooded slopes, a blue lake, and Lakeshire’s timber waterfront. No exact travel path from Westfall is asserted.' },
  { id: 'defias-stormwind-old-town', name: 'Stormwind Old Town and SI:7', env: 'stormwind-oldtown', traits: 'Original World of Warcraft Classic: compact Old Town streets, pale limestone, blue roof tile, restrained gold accents, and a discreet intelligence hall.' },
  { id: 'defias-moonbrook', name: 'Moonbrook', env: 'moonbrook', traits: 'Original World of Warcraft Classic: a poor, weathered Westfall village near the mine entrance, among dry farmland. No particular house or hideout entrance is located precisely.' },
  { id: 'defias-deadmines', name: 'The Deadmines', env: 'deadmines-mine', traits: 'Original World of Warcraft Classic: timber bracing, rough worked shafts, red ore, stone walls, and torchlit mine passages. The illustration is not a surveyed dungeon layout.' },
  { id: 'defias-deadmines-ship', name: 'VanCleef’s ship in the Deadmines', env: 'deadmines-ship', traits: 'Original World of Warcraft Classic: dark timber, rigging, warm torchlight, and rock enclosing an underground ship. Exact placement and deck layout remain interpretive.' },
  { id: 'defias-stormwind-stockades', name: 'Stormwind Stockades', env: 'stormwind-stockades', traits: 'Original World of Warcraft Classic: close gray stone blocks, iron bars, low arches, damp shadow, and torch pools. The scene does not reconstruct a precise cell block.' },
  { id: 'defias-stormwind-cathedral-square', name: 'Stormwind Cathedral Square and city hall', env: 'stormwind-cathedral-square', traits: 'Original World of Warcraft Classic: open civic square, luminous pale limestone, white cathedral spires, blue rooflines, and gold trim. The composition is original, not a map capture.' },
  { id: 'defias-stormwind-keep-garden', name: 'Stormwind Keep gardens', env: 'stormwind-keep-garden', traits: 'Original World of Warcraft Classic: cultivated keep gardens beside pale or white stone, blue roofs, and restrained gold details. Keep architecture is not rendered in red-brown stone.' },
  { id: 'defias-stormwind-keep-hall', name: 'Stormwind Keep throne hall', env: 'stormwind-keep-throne-hall', traits: 'Original World of Warcraft Classic: pale limestone, blue standards, and gold accents. Reuses the matching-era Stormwind Keep interpretation made for the Onyxia story.' },
];
const placeById = new Map(places.map((place) => [place.id, place]));

const people = [
  ['gryan-stoutmantle', 'Gryan Stoutmantle', 'The Westfall militia leader who directs the opening investigations and reports their outcomes.', 'gryan-stoutmantle', 'character'],
  ['wiley-the-black', 'Wiley the Black', 'A Lakeshire informant whose written report describes Defias cooperation with other groups.', 'wiley-the-black', 'character'],
  ['mathias-shaw', 'Mathias Shaw', 'Stormwind’s SI:7 head, who reports on the Stonemasons and later directs the noble investigation.', 'mathias-shaw', 'character'],
  ['edwin-vancleef', 'Edwin VanCleef', 'The former Stonemasons leader named in Shaw’s report and the leader pursued in the Deadmines.', 'edwin-vancleef', 'character'],
  ['baros-alexston', 'Baros Alexston', 'The former architect who receives the Unsent Letter and prepares a report for the absent king.', 'baros-alexston', 'character'],
  ['bazil-thredd', 'Bazil Thredd', 'A Stockades prisoner whose account describes the Stonemasons’ grievance from his viewpoint.', 'bazil-thredd', 'character'],
  ['warden-thelwater', 'Warden Thelwater', 'The Stockades warden who gives the riot order and recalls a visitor registered as Maelik.', 'warden-thelwater', 'character'],
  ['marzon', 'Marzon', 'The covert agent Shaw identifies as Lescovar’s employee.', 'marzon', 'character'],
  ['lord-gregor-lescovar', 'Lord Gregor Lescovar', 'The Stormwind noble named in Shaw’s report and encountered in the garden investigation.', 'lord-gregor-lescovar', 'character'],
  ['elling-trias', 'Elling Trias', 'The contact Shaw directs the player to when he doubts a noble can be brought to trial.', 'elling-trias', 'character'],
  ['defias-tyrion', 'Tyrion', 'The observer Trias introduces, who prepares the Spybot operation against Lescovar.', 'tyrion', 'character'],
  ['defias-brotherhood', 'The Defias Brotherhood', 'The organization opposing Gryan’s militia in Westfall and named in the later Stormwind investigation.', 'defias-brotherhood-group', 'faction'],
  ['westfall-peoples-militia', 'The People’s Militia of Westfall', 'The local militia whose leader investigates the Brotherhood’s pressure on Westfall residents.', 'westfall-people-militia', 'faction'],
  ['stormwind-stonemasons', 'The Stonemasons', 'The rebuilding guild described in Shaw’s report and Bazil’s later recollection.', 'stormwind-stonemasons-group', 'faction'],
].map(([id, name, description, assetName, type]) => ({ id, name, description, assetName, type }));

const objects = [
  ['unsent-letter', 'The Unsent Letter', 'A letter recovered from VanCleef that starts a separate investigation. Its full contents are not supplied by the quest locator.', 'unsent-letter', 'artifact'],
].map(([id, name, description, assetName, type]) => ({ id, name, description, assetName, type }));
const subjectById = new Map([...people, ...objects].map((subject) => [subject.id, subject]));
subjectById.set('katrana-prestor', {
  id: 'katrana-prestor', name: 'Katrana Prestor',
  description: 'The court official who receives Baros’s report while King Varian is away.',
  assetName: null, type: 'character', reused: true,
});

const beats = [
  {
    id: 'westfall-unrest', title: 'Farmers driven from Westfall', env: 'westfall-plains', locations: ['defias-westfall'],
    sources: ['defias-quest-65'], figures: ['gryan-stoutmantle', 'westfall-peoples-militia', 'defias-brotherhood'], participants: ['gryan-stoutmantle', 'westfall-peoples-militia'],
    text: 'Gryan Stoutmantle describes people driven from Westfall and asks for a lead on the Defias Brotherhood. The quest gives no calendar date and names no single attack that explains every departure. We begin among thin farms and dry roads, beside the militia post at Sentinel Hill, with Gryan’s report kept distinct from the unseen lives it summarizes.',
    note: 'Quest 65 reports residents driven from the land; it does not locate a specific farm or establish one dated attack.',
  },
  {
    id: 'wiley-summons', title: 'The question moves to Lakeshire', env: 'redridge-lakeshire', locations: ['defias-westfall', 'defias-lakeshire'],
    sources: ['defias-quest-65'], figures: ['gryan-stoutmantle', 'wiley-the-black'], participants: ['gryan-stoutmantle', 'wiley-the-black'],
    text: 'Instead of sending the militia after every rumor, Gryan directs the adventurer to Wiley the Black in Lakeshire. The quest names the destination but leaves the route unstated. The shift from Westfall’s open gold to Redridge’s wooded shore marks an inquiry crossing into another community, where a written answer awaits.',
    note: 'The destination is supported; the route and travel duration are not.',
  },
  {
    id: 'wiley-note', title: 'Wiley’s written warning', env: 'redridge-lakeshire', locations: ['defias-lakeshire'],
    sources: ['defias-quest-132'], figures: ['wiley-the-black', 'defias-brotherhood'], objects: [], participants: ['wiley-the-black'],
    text: 'Wiley’s note reports that the Defias work with gnolls, kobolds, and goblins. That is intelligence supplied by an informant, not independent confirmation of every alliance he names. Even with that limit, the report widens the problem: Gryan is facing an organized force described as joining people and creatures across Westfall.',
    note: 'Wiley’s claims are attributed to the note; this story does not confirm each group’s participation independently.',
  },
  {
    id: 'shaws-question', title: 'Gryan asks SI:7', env: 'stormwind-oldtown', locations: ['defias-stormwind-old-town'],
    sources: ['defias-quest-135'], figures: ['gryan-stoutmantle', 'mathias-shaw'], participants: ['gryan-stoutmantle', 'mathias-shaw'],
    text: 'A clue points Gryan toward Stormwind’s rebuilding guild, but his first link is framed as a question. He asks Mathias Shaw, head of SI:7, to examine the Stonemasons’ history. The inquiry moves from a troubled farming district to the city that the guild once helped rebuild; suspicion has not yet become proof.',
    note: 'Quest 135 establishes Gryan’s question and request for Shaw’s help, not a confirmed identity for every Defias member.',
  },
  {
    id: 'stonemasons-report', title: 'What the Stonemasons were owed', env: 'stormwind-oldtown', locations: ['defias-stormwind-old-town'],
    sources: ['defias-quest-141'], figures: ['mathias-shaw', 'gryan-stoutmantle', 'stormwind-stonemasons', 'edwin-vancleef'], participants: ['mathias-shaw', 'gryan-stoutmantle'],
    text: 'Shaw’s report names Edwin VanCleef as leader of the Stonemasons, the guild that rebuilt Stormwind after the First War. Shaw says the builders were treated poorly after their work. This is his account of the grievance, carried back to Gryan as intelligence. The story shows VanCleef as the subject of that report, not as a participant in the conversation.',
    note: 'The labor dispute is attributed to Shaw. Exact contract terms and the full political history remain open to original-client and primary-source review.',
  },
  {
    id: 'messenger-hunted', title: 'A messenger carries the trail', env: 'westfall-plains', locations: ['defias-westfall'],
    sources: ['defias-quest-142'], figures: ['gryan-stoutmantle', 'defias-brotherhood'], participants: ['gryan-stoutmantle', 'defias-brotherhood'],
    text: 'Gryan seeks a message from a Defias courier. The quest asks the adventurer to find that messenger, while leaving the meeting place on Westfall’s roads unspecified. The inquiry widens from scattered unrest to written evidence.',
    note: 'The quest objective supports the messenger and message; an exact road or meeting point is unknown.',
  },
  {
    id: 'traitor-bargain', title: 'A captive offers the hideout', env: 'westfall-plains', locations: ['defias-westfall'],
    sources: ['defias-quest-142'], figures: ['gryan-stoutmantle', 'westfall-peoples-militia', 'defias-brotherhood'], participants: ['gryan-stoutmantle', 'westfall-peoples-militia'],
    text: 'Gryan reports that a captured thief offers to reveal the Brotherhood’s hideout in exchange for his life. The offer changes the investigation from scattered evidence to a possible entrance. The captive remains unnamed in the account, and the story does not invent private terms or a scene the quest text does not establish.',
    note: 'The bargaining condition is reported by Gryan; the captive’s identity and private circumstances are not given.',
  },
  {
    id: 'moonbrook-escort', title: 'Through Moonbrook', env: 'moonbrook', locations: ['defias-moonbrook'],
    sources: ['defias-quest-155'], figures: ['westfall-peoples-militia', 'defias-brotherhood'], participants: ['westfall-peoples-militia', 'defias-brotherhood'],
    text: 'The next assignment is an escort through Moonbrook with the traitor leading the way to the hideout. The militia enters familiar Westfall ground now shadowed by the enemy’s presence. No individual adventurer is made the hero of a history they were never named in; the scene follows the objective and leaves the exact path open.',
    note: 'Quest 155 supports the escort objective and hideout destination, not the exact path or a canonical player avatar.',
  },
  {
    id: 'deadmines-descent', title: 'Below the mine', env: 'deadmines-mine', locations: ['defias-deadmines'],
    sources: ['defias-quest-155', 'defias-quest-166'], figures: ['westfall-peoples-militia', 'defias-brotherhood'], participants: ['westfall-peoples-militia', 'defias-brotherhood'],
    text: 'Moonbrook opens toward the Deadmines, where conflict passes from exposed farmland into worked passages. Timber braces, ore, and torchlit stone give the underground settlement a character distinct from the fields above. The refuge lies beneath the farmland, though the precise chambers are unknown.',
    note: 'The Deadmines are the quest destination; the generated mine arrangement is not surveyed geography or an exact dungeon map.',
  },
  {
    id: 'pirate-ship', title: 'The ship beneath the Deadmines', env: 'deadmines-ship', locations: ['defias-deadmines-ship'],
    sources: ['defias-quest-166'], figures: ['edwin-vancleef', 'defias-brotherhood'], participants: ['edwin-vancleef', 'defias-brotherhood'],
    text: 'The quest brings the search to VanCleef’s ship, hidden within the mine. Dark timber and rigging stand against the enclosing rock; the Brotherhood’s stronghold has become a vessel held far from open water. The composition follows the dungeon’s recognizable setting while leaving its exact scale, position, and deck arrangement to the game rather than the illustration.',
    note: 'The ship and Deadmines setting are supported; the illustration’s interior placement and dimensions are interpretive.',
  },
  {
    id: 'vancleef-falls', title: 'VanCleef falls', env: 'deadmines-ship', locations: ['defias-deadmines-ship'],
    sources: ['defias-quest-166'], figures: ['edwin-vancleef', 'gryan-stoutmantle', 'defias-brotherhood'], participants: ['edwin-vancleef', 'defias-brotherhood'],
    text: 'VanCleef is killed in the Deadmines, and Gryan sends word that the blow may mark the beginning of the Brotherhood’s end. His hope is not a claim that every Defias cell has vanished. The ship, mine, and leadership have been struck; what remains beyond the quest’s reported outcome is left unresolved.',
    note: 'Gryan describes a hoped-for beginning of the end, not total eradication of the Defias Brotherhood.',
  },
  {
    id: 'unsent-letter', title: 'An unsent letter opens a second trail', env: 'stormwind-cathedral-square', locations: ['defias-stormwind-cathedral-square'],
    sources: ['defias-quest-373'], figures: ['edwin-vancleef', 'baros-alexston'], objects: ['unsent-letter'], participants: ['baros-alexston', 'unsent-letter'],
    text: 'An item found on VanCleef begins a separate investigation: the Unsent Letter is carried to Baros Alexston. The recovered page is a hinge between the Deadmines and Stormwind, but the quest locator does not provide its full contents. We show a sealed, unreadable object and follow only the next step the record establishes.',
    note: 'The letter’s existence and recipient are supported; its complete contents and physical appearance are unknown.',
  },
  {
    id: 'bazil-account', title: 'Bazil tells his version', env: 'stormwind-stockades', locations: ['defias-stormwind-stockades'],
    sources: ['defias-quest-389'], figures: ['bazil-thredd', 'warden-thelwater', 'stormwind-stonemasons'], participants: ['bazil-thredd', 'warden-thelwater'],
    text: 'In the Stockades, Bazil Thredd describes the Stonemasons’ work as unpaid and cheated, then recounts the riot and VanCleef’s leadership. His account is evidence of what Bazil says, not a neutral verdict on every detail. The prison’s close stone and iron make the testimony feel contained, while the grievance reaches back to the rebuilt city.',
    note: 'Attribute the grievance and riot narrative to Bazil. The quest transcription is secondary and awaits original-client comparison.',
  },
  {
    id: 'stockades-riot', title: 'Riot inside the Stockades', env: 'stormwind-stockades', locations: ['defias-stormwind-stockades'],
    sources: ['defias-quest-391'], figures: ['warden-thelwater', 'bazil-thredd'], participants: ['warden-thelwater', 'bazil-thredd'],
    text: 'Warden Thelwater sends the adventurer into the prison riot and orders Bazil killed. The order is what this quest records; it is not a trial, and the story does not invent a speech from Bazil or a count of unnamed prisoners. The investigation has moved from a letter to testimony, then to violence carried out inside the state’s own prison.',
    note: 'Represent the order and quest objective only; no unsupported prisoner dialogue or broader riot outcome is added.',
  },
  {
    id: 'maeliks-visits', title: 'The visitor named Maelik', env: 'stormwind-stockades', locations: ['defias-stormwind-stockades'],
    sources: ['defias-quest-392'], figures: ['warden-thelwater'], participants: ['warden-thelwater'],
    text: 'After the riot, Thelwater recalls a recent visitor who signed in as Maelik. At this point the name is a mark in a warden’s account, not a solved identity. The story lets uncertainty remain for one scene: a visitor came, a name was recorded, and the next question belongs to Shaw’s investigation.',
    note: 'The visitor’s name is recorded as Maelik here; identity is not assigned until Shaw’s later report.',
  },
  {
    id: 'marzon-unmasked', title: 'Shaw identifies Marzon', env: 'stormwind-oldtown', locations: ['defias-stormwind-old-town'],
    sources: ['defias-quest-393'], figures: ['mathias-shaw', 'marzon', 'lord-gregor-lescovar'], participants: ['mathias-shaw'],
    text: 'Shaw recognizes Marzon as the name behind the alias and says the agent works for Lord Gregor Lescovar. The report turns a vague visitor into a path toward a powerful household. These are Shaw’s conclusions as recorded by the quest, and the Defias inquiry remains bounded by that evidence; no link to Onyxia is introduced.',
    note: 'Attribute Marzon’s identity and employment to Shaw. The quest chain does not establish a causal link to Onyxia.',
  },
  {
    id: 'justice-outside-law', title: 'When evidence meets rank', env: 'stormwind-oldtown', locations: ['defias-stormwind-old-town'],
    sources: ['defias-quest-350'], figures: ['mathias-shaw', 'elling-trias'], participants: ['mathias-shaw', 'elling-trias'],
    text: 'Shaw doubts that evidence against a connected noble will readily bring justice through ordinary channels. He sends the investigator to Elling Trias, placing the next step outside the formal report he has just described. This is Shaw’s judgment, not a universal statement about Stormwind law, and the story does not conceal the cost of taking the extralegal path.',
    note: 'The limits on prosecution are Shaw’s stated concern; no wider legal rule is inferred.',
  },
  {
    id: 'tyrion-and-spybot', title: 'Tyrion prepares the watch', env: 'stormwind-keep-garden', locations: ['defias-stormwind-keep-garden'],
    sources: ['defias-quest-2745', 'defias-quest-2746'], figures: ['elling-trias', 'defias-tyrion', 'lord-gregor-lescovar'], participants: ['elling-trias', 'defias-tyrion'],
    text: 'Trias introduces Tyrion, who has watched Lescovar. The next preparations are a Spybot, silk, and apples for the observation. The record names Tyrion’s task but leaves his private motives unspoken.',
    note: 'Quest objectives support Tyrion’s observation and the listed preparations; the Spybot’s generated design is interpretive, not a canonical model claim.',
  },
  {
    id: 'garden-meeting', title: 'The meeting in the garden', env: 'stormwind-keep-garden', locations: ['defias-stormwind-keep-garden'],
    sources: ['defias-quest-434'], figures: ['lord-gregor-lescovar', 'marzon', 'defias-tyrion'], participants: ['lord-gregor-lescovar', 'marzon'],
    text: 'The quest sends the adventurer to overhear a meeting about the Defias, then kill Lescovar and Marzon. Its transcription leaves the precise exchange unknown. Pale stone, blue roofs, and gold trim frame the garden beside Stormwind Keep, where the city’s formal face surrounds a secret meeting.',
    note: 'The meeting objective and deaths are represented without fabricated dialogue or an inferred broader conspiracy.',
  },
  {
    id: 'report-and-secrecy', title: 'Secrecy and Baros’s report', env: 'stormwind-oldtown', locations: ['defias-stormwind-old-town', 'defias-stormwind-cathedral-square'],
    sources: ['defias-quest-394', 'defias-quest-395'], figures: ['mathias-shaw', 'baros-alexston'], participants: ['mathias-shaw', 'baros-alexston'],
    text: 'The player reports Lescovar’s death to Shaw. Shaw then advises secrecy about who carried out the killing and sends the investigator back to Baros, who prepares a report for the king. The chain records both the violence and the attempt to move its evidence upward; it does not describe a public trial or settle the noble plot.',
    note: 'Secrecy is Shaw’s instruction. No public trial, royal decision, or later political consequence is asserted.',
  },
  {
    id: 'audience-unanswered', title: 'An audience without Varian', env: 'stormwind-keep-throne-hall', locations: ['defias-stormwind-keep-hall'],
    sources: ['defias-quest-396'], figures: ['baros-alexston', 'katrana-prestor'], participants: ['baros-alexston', 'katrana-prestor'], objects: [],
    text: 'Baros’s report is delivered to Katrana Prestor because King Varian is away on diplomacy. The quest closes at this handoff and records a token of royal appreciation, but it does not answer what the report will change. The Keep’s pale stone, blue standards, and gold accents frame an unfinished political question; the story ends here without joining it to another conspiracy.',
    note: 'Varian is absent and Prestor receives the report. This endpoint does not establish that she caused the Defias events or connect them to the Onyxia story.',
  },
];

const unique = (values) => [...new Set(values)];
const allSourceIds = unique([...beats.flatMap((beat) => beat.sources), chainSourceId]);
const allEntityIds = unique(beats.flatMap((beat) => beat.figures.concat(beat.objects ?? [])));
const usedPlaces = unique(beats.flatMap((beat) => beat.locations));
const environmentKeys = unique(beats.map((beat) => beat.env));
for (const beat of beats) {
  for (const sourceId of beat.sources) if (!sourceById.has(sourceId)) throw new Error(`Unknown source ${sourceId}`);
  for (const entityId of beat.figures.concat(beat.objects ?? [])) if (!subjectById.has(entityId)) throw new Error(`Unknown subject ${entityId}`);
  for (const locationId of beat.locations) if (!placeById.has(locationId)) throw new Error(`Unknown location ${locationId}`);
}

for (const place of places.filter((item) => usedPlaces.includes(item.id))) {
  const refs = unique(beats.filter((beat) => beat.locations.includes(place.id)).flatMap((beat) => beat.sources));
  await output(`data/entities/${place.id}.research.json`, {
    id: place.id, type: 'location', name: place.name, slug: place.id,
    shortDescription: place.traits,
    body: `${place.traits} The story uses a relational theater and source-aware scene art. Exact coordinates, routes, room layouts, and item positions are not asserted.`,
    firstEraId: eraId, featuredEraIds: [eraId], sourceIds: refs,
    tags: ['defias-story', 'classic-area-reference', 'interpretive-art'], contentStatus: 'research',
  });
}

for (const entityId of allEntityIds) {
  const subject = subjectById.get(entityId);
  if (subject.reused) continue;
  const related = beats.filter((beat) => beat.figures.includes(entityId) || (beat.objects ?? []).includes(entityId));
  const refs = unique(related.flatMap((beat) => beat.sources));
  const asset = `${imageDir}/${subject.assetName}.research.webp`;
  await access(path.join(root, 'public', asset));
  const description = `${subject.description} Visual details are original interpretive research art, not evidence of canonical appearance, costume, or exact game model.`;
  await output(`data/entities/${entityId}.research.json`, {
    id: entityId, type: subject.type, name: subject.name, slug: entityId,
    shortDescription: subject.description, body: description,
    firstEraId: eraId, featuredEraIds: [eraId], sourceIds: refs,
    tags: ['defias-story', 'interpretive-art'],
    ...(subject.type === 'character' || subject.type === 'faction'
      ? { mapFigure: { asset, scale: subject.type === 'faction' ? 0.95 : 0.86 } }
      : { mapVisual: { asset, scale: 0.62 } }),
    contentStatus: 'research',
  });
}

const slotColumns = [3900, 5000, 6100];
const slotRows = [4100, 5000, 5900, 6800, 7700, 8600];
const slots = new Map();
const featureByEntity = new Map();
const features = [];
for (const entityId of allEntityIds) {
  const slot = slots.size;
  const row = Math.floor(slot / slotColumns.length);
  if (row >= slotRows.length) throw new Error(`Defias theater has no authored slot for ${entityId}`);
  const geometryId = `${storyId}-${entityId}-focus`;
  slots.set(entityId, slot);
  featureByEntity.set(entityId, geometryId);
  features.push({
    type: 'Feature', id: geometryId,
    properties: { name: `${subjectById.get(entityId).name} editorial focus`, contentStatus: 'research', styleRole: 'site', geographicCertainty: 'unknown' },
    geometry: { type: 'Point', coordinates: [slotColumns[slot % slotColumns.length], slotRows[row]] },
  });
  const refs = unique(beats.filter((beat) => beat.figures.includes(entityId) || (beat.objects ?? []).includes(entityId)).flatMap((beat) => beat.sources));
  await output(`data/spatial-states/${storyId}-${entityId}.research.json`, {
    id: `${storyId}-${entityId}-theater`, entityId, eraId, worldspaceId,
    geometryId, placementKind: 'relational', geographicCertainty: 'unknown', sourceIds: refs,
    editorNote: 'Editorial placement inside a relational story theater. This is not a world coordinate, historic formation, route, or claim that every depicted subject shared one physical scene.',
    visualPresence: 'contextual', labelPriority: 240,
  });
}
await output(`data/geometry/${storyId}-theater.research.geojson`, { type: 'FeatureCollection', features });
await output(`data/worldspaces/${worldspaceId}.research.json`, {
  id: worldspaceId, name: 'The Defias — relational story theater', slug: worldspaceId,
  coordinateSystem: { width: 10000, height: 10000, origin: 'bottom-left', units: 'atlas-units' },
});

const envInfo = {
  'westfall-plains': { title: 'Westfall plains', assetName: 'westfall-plains', traits: placeById.get('defias-westfall').traits, sourceArtifactId: 'exec-2dac921b-e427-4395-b5bf-ba49c8b0edd0', brief: 'Original Classic-era Westfall landscape: dry gold open plains, sparse farms, pale dirt, and Sentinel Hill watchtower.', promptStatus: 'Concise brief retained from the image-generation record; the original prompt text was not committed.' },
  'redridge-lakeshire': { title: 'Lakeshire on the Redridge lake', assetName: 'redridge-lakeshire', traits: placeById.get('defias-lakeshire').traits, sourceArtifactId: 'exec-7286ea73-0e8f-40f2-bf8f-618a6b3a8545', brief: 'Original Classic-era Redridge: red-orange woodland, blue water, and a timber waterfront town.', promptStatus: 'Concise brief retained from the image-generation record; the original prompt text was not committed.' },
  'stormwind-oldtown': { title: 'Stormwind Old Town and SI:7', assetName: 'stormwind-oldtown', traits: placeById.get('defias-stormwind-old-town').traits, sourceArtifactId: 'exec-d17f3663-fabf-443e-a644-bfa970881347', brief: 'Original Classic Stormwind Old Town with white limestone streets, blue roofs, gold details, and a restrained intelligence hall.', promptStatus: 'Concise brief retained from the image-generation record; the original prompt text was not committed.' },
  moonbrook: { title: 'Moonbrook', assetName: 'moonbrook', traits: placeById.get('defias-moonbrook').traits, sourceArtifactId: 'exec-d4249d9c-ca9f-4175-987e-45acd1f5c81f', brief: 'Original Classic Westfall village: poor, weathered timber homes near dry farms and a mine entrance.', promptStatus: 'Concise brief retained from the image-generation record; the original prompt text was not committed.' },
  'deadmines-mine': { title: 'The Deadmines passages', assetName: 'deadmines-mine', traits: placeById.get('defias-deadmines').traits, sourceArtifactId: 'exec-8fe9bee8-9f8c-4834-af3a-0914900cb1da', brief: 'Original interpretive Deadmines environment: timber bracing, ore seams, torchlit shafts, and rough worked stone.', promptStatus: 'Concise brief retained from the image-generation record; the original prompt text was not committed.' },
  'deadmines-ship': { title: 'The underground ship', assetName: 'deadmines-ship', traits: placeById.get('defias-deadmines-ship').traits, sourceArtifactId: 'exec-b4aca632-70d5-49fd-b496-5a83a58c4438', brief: 'Original interpretive cavern ship scene: dark timber, rigging, torch pools, and surrounding mine rock.', promptStatus: 'Concise brief retained from the image-generation record; the original prompt text was not committed.' },
  'stormwind-stockades': { title: 'The Stormwind Stockades', assetName: 'stormwind-stockades', traits: placeById.get('defias-stormwind-stockades').traits, sourceArtifactId: 'exec-8c3111f8-51fd-4b2d-989b-7b0e630d3451', brief: 'Original Classic Stockades interior: gray stone, iron bars, close arches, and warm torchlight.', promptStatus: 'Concise brief retained from the image-generation record; the original prompt text was not committed.' },
  'stormwind-cathedral-square': { title: 'Stormwind Cathedral Square', assetName: 'stormwind-cathedral-square', traits: placeById.get('defias-stormwind-cathedral-square').traits, sourceArtifactId: 'exec-9b680aff-4038-4100-8530-f3516afea8b9', brief: 'Original Classic Stormwind civic square: pale limestone, white cathedral, blue rooflines, and gold trim. The scene was generated with a no-red-stone/no-red-banner constraint.', promptStatus: 'Prompt brief retained in the authoring session.' },
  'stormwind-keep-garden': { title: 'Stormwind Keep gardens', assetName: 'stormwind-keep-garden', traits: placeById.get('defias-stormwind-keep-garden').traits, sourceArtifactId: 'exec-d54ecb3c-f237-4356-b325-7f3791c85121', brief: 'Original Classic Stormwind Keep garden with pale white stone, blue roofs, gold details, and cultivated green.', promptStatus: 'Concise brief retained from the image-generation record; the original prompt text was not committed.' },
  'stormwind-keep-throne-hall': { title: 'Stormwind Keep throne hall', assetName: 'stormwind-keep', assetPath: 'images/storylines/onyxia/stormwind-keep.research.webp', reusedFrom: 'Onyxia storyline', traits: placeById.get('defias-stormwind-keep-hall').traits, brief: 'Reused Stormwind Keep throne hall art already reviewed in the Onyxia story; the pale-stone and blue-and-gold palette fits the Classic report handoff.', promptStatus: 'Reused repository art; see its original asset ledger.' },
};

for (const key of environmentKeys) {
  const info = envInfo[key];
  if (!info) throw new Error(`Missing environment declaration: ${key}`);
  const assetPath = info.assetPath ?? `${imageDir}/${info.assetName}.research.webp`;
  await access(path.join(root, 'public', assetPath));
  await output(`data/map-states/${storyId}-${key}.research.json`, {
    id: `${storyId}-${key}-scene`, name: `The Defias — ${info.title}`, worldspaceId,
    presentation: 'relational', terrainTextureAsset: assetPath, geometryIds: [],
    cartographyLabel: 'THE DEFIAS · STORY SCENE',
    interpretationNote: `Original or reused interpretive scene art for original World of Warcraft Classic. Recognizable traits: ${info.traits} No exact position, surveyed layout, route, item placement, canonical model, or unseen action is asserted. Matching original-client area review remains open; see docs/research/${storyId}-visual-assets.json.`,
  });
}

const storyFile = `data/stories/${storyId}.research.json`;
const priorStory = await readFile(path.join(root, storyFile), 'utf8').then(JSON.parse).catch(() => undefined);
const priorNodes = new Map((priorStory?.nodes ?? []).map((node) => [node.id, node]));
const nodes = [];
for (const [index, beat] of beats.entries()) {
  const eventId = `${storyId}-${beat.id}-event`;
  const claimId = `${storyId}-${beat.id}-claim`;
  const citationIds = [];
  for (const [sourceIndex, sourceId] of beat.sources.entries()) {
    const source = sourceById.get(sourceId);
    const citationId = `${storyId}-${beat.id}-citation-${sourceIndex + 1}`;
    citationIds.push(citationId);
    await output(`data/citations/${citationId}.research.json`, {
      id: citationId, sourceId, questId: `Classic quest ${source.questNumber}`,
      section: `${source.title} · ${beat.title} · ${source.coverage}`,
      note: 'Original paraphrase of a secondary Classic quest transcription. No original-client capture is claimed; compare matching-build text and objectives before human review.',
    });
  }
  await output(`data/claims/${claimId}.research.json`, {
    id: claimId, subjectId: eventId, predicate: 'defias_story_scene', value: beat.text,
    citationIds, confidence: 'strongly_supported', status: 'active', editorNote: beat.note,
  });
  const participants = beat.participants ?? beat.figures;
  await output(`data/events/${eventId}.research.json`, {
    id: eventId, kind: 'event', name: beat.title, slug: `${storyId}-${beat.id}`,
    eraId, worldspaceId, date: { precision: 'unknown', label: 'Original World of Warcraft Classic Alliance quest chain; exact in-world date unknown' },
    summary: beat.text, locationIds: beat.locations, participantEntityIds: participants,
    sourceIds: beat.sources, claimIds: [claimId], contentStatus: 'research',
  });
  const nodeId = `${storyId}-story-${beat.id}`;
  const priorNode = priorNodes.get(nodeId);
  const voiceover = priorNode?.narration === beat.text ? priorNode.voiceover : undefined;
  nodes.push({
    id: nodeId, guideId, title: beat.title, narration: beat.text,
    durationMs: voiceover?.durationMs ?? Math.round(((beat.text.split(/\s+/).length / 82) * 60000) / 500) * 500 + 5000,
    ...(voiceover ? { voiceover } : {}), eventIds: [eventId],
    entityIds: unique([...beat.figures, ...(beat.objects ?? [])]), locationIds: beat.locations,
    camera: { position: [0, 6.2, 5.4], target: [0, 0, 0], durationMs: 1100 },
    visualActions: [{ type: 'set_map_state', mapStateId: `${storyId}-${beat.env}-scene` }],
    ...(index ? { previousNodeId: nodes[index - 1].id } : {}),
    ...(index < beats.length - 1 ? { nextNodeIds: [`${storyId}-story-${beats[index + 1].id}`] } : {}),
  });
}

const guide = {
  id: guideId, eraId, title: 'The Defias and the Unsent Letter',
  description: 'Twenty-one illustrated Classic-era scenes follow Gryan’s Westfall investigation from a local report to the Deadmines, then trace the Unsent Letter through the Stockades and an unresolved Stormwind court handoff.',
  nodeIds: nodes.map((node) => node.id), contentStatus: 'research',
};
await output(storyFile, { guide, nodes });

const chapters = [
  { id: 'westfall-and-the-stonemasons', eraId, title: 'Westfall and the Stonemasons', body: 'Gryan’s investigation crosses into Lakeshire and Stormwind. Wiley’s note remains intelligence; Shaw and Bazil give separate, attributed accounts of the Stonemasons’ grievance.' },
  { id: 'the-deadmines-campaign', eraId, title: 'From bargain to hideout', body: 'A messenger, an unnamed captive, Moonbrook, the Deadmines, and VanCleef’s ship move the investigation toward the Brotherhood’s leader. Quest order is not treated as a dated route.' },
  { id: 'the-unsent-letter', eraId, title: 'A letter and a prison account', body: 'The item found on VanCleef opens a second trail. Bazil’s account is attributed to him; the visitor registered as Maelik remains unidentified until Shaw’s later report.' },
  { id: 'the-unquiet-court', eraId, title: 'A report without an answer', body: 'Shaw’s view of the noble case leads outside ordinary justice. The story ends when Katrana Prestor receives Baros’s report while Varian is away; it does not join the Defias to Onyxia.' },
];

const allStorySourceIds = unique([...allSourceIds]);
const wordCount = nodes.reduce((sum, node) => sum + node.narration.split(/\s+/).length, 0);
const storyline = {
  id: storyId, slug: storyId, title: 'The Defias and the Unsent Letter',
  summary: 'Gryan Stoutmantle’s Westfall inquiry exposes the grievance Shaw attributes to the Stonemasons, leads into VanCleef’s Deadmines stronghold, and follows a separate letter into a Stormwind investigation that ends without resolving the court’s future.',
  opening: 'The road from Westfall’s farms descends beneath a mine, then returns to Stormwind carrying a letter the quest never fully opens. Gryan’s militia can strike at the Brotherhood’s leader; the evidence that follows reaches the edge of the law and stops at an unanswered report.',
  primaryEraId: eraId, eraIds: [eraId], chapters, sourceIds: allStorySourceIds,
  reviewNote: 'Complete illustrated research story with 21 linked scenes, one cited event and claim per scene, Classic-specific area art, distinct cast and group portraits, and a visible letter prop. Audio assets are generated from transcript-stable nodes and must be regenerated if narration changes. ClassicDB quest transcriptions are secondary locators, not original-client captures. Exact dates, quest dependencies, the Stonemasons’ grievance, the visitor’s identity, court continuity, and original-client art resemblance remain human-review gates. The tale excludes Vanessa and the Cataclysm-era Deadmines, preserves speaker attribution, and makes no causal link to Onyxia. `showInEraTourOffshoots: false` keeps this storyline in the Classic-to-Wrath StoryTour and standalone library without listing it among era-tour offshoots.',
  storyGuideId: guideId, showInEraTourOffshoots: false, contentStatus: 'research',
};
await output(`data/storylines/${storyId}.research.json`, storyline);

const tourFile = 'data/story-tours/classic-to-wrath.research.json';
const tour = JSON.parse(await readFile(path.join(root, tourFile), 'utf8'));
const existing = tour.entries.find((entry) => entry.storylineId === storyId);
if (!existing) {
  const afterDarrowshire = tour.entries.find((entry) => entry.storylineId === 'darrowshire-lost-and-remembered')?.order;
  if (afterDarrowshire === undefined) throw new Error('Cannot place Defias without its authored Classic sequence boundary.');
  for (const entry of tour.entries) if (entry.order > afterDarrowshire) entry.order += 1;
  tour.entries.push({
    storylineId: storyId, regionIds: ['eastern-kingdoms'], mapPositionPercent: [55, 73],
    order: afterDarrowshire + 1, periodLabel: 'Original World of Warcraft · Classic', locationLabel: 'Westfall and Stormwind',
  });
} else existing.mapPositionPercent = [55, 73];
tour.entries.sort((a, b) => a.order - b.order);
tour.chronologyNote = 'Play-all order is an editorial expansion-era sequence: Classic (Onyxia, Scepter, Dungeon Set 2, the Fallen Hero, Tirion and Taelan, Darrowshire, then the Defias and the Unsent Letter), The Burning Crusade (Karazhan, Akama and the Black Temple, then the Outland Cipher preview), and Wrath (Wrathgate preview followed by Quel’Delar). The Classic ordering is a navigational sequence and does not claim canonical relative dates, quest-dependency order across separate stories, or causal links. Darrowshire’s Third War fall is a labeled flashback; its Classic investigation and constrained battle replay remain distinct. The Annals’ Second War date is disputed. The Defias visitor “Maelik” remains unresolved until Shaw’s report, and the Stormwind report handoff is not connected to Onyxia. Other branch, faction and flashback caveats remain as recorded in each story.';
tour.reviewNote = 'Playable research guides include the Defias story as an Eastern Kingdoms Classic placard after Darrowshire in editorial tour order. Defias is explicitly hidden from the Era Tour offshoot list and remains available through its placard and the text-first storyline library. Cipher of Damnation and Wrathgate remain previews outside Play All. Original-client quest text/build, chronology, court continuity, generated area/model resemblance and narration audition remain human-review gates. Markers are interface anchors, not exact locations or travel routes.';
await output(tourFile, tour);

const assetLedger = [];
const assetDefinitions = [
  ...environmentKeys.map((key) => {
    const info = envInfo[key];
    const location = places.find((place) => place.env === key);
    const assetPath = info.assetPath ?? `${imageDir}/${info.assetName}.research.webp`;
    return {
      id: `environment-${key}`, kind: 'environment', file: assetPath,
      locationEntityId: location.id,
      nodeIds: beats.filter((beat) => beat.env === key).map((beat) => `${storyId}-story-${beat.id}`),
      sourceArtifactId: info.sourceArtifactId ?? null, reusedFrom: info.reusedFrom ?? null,
      generationBrief: info.brief, promptStatus: info.promptStatus,
      targetEditionBuild: 'Original World of Warcraft Classic, pre-Cataclysm area identity; matching-build comparison remains open.',
      recognizableTraits: info.traits, transparency: false,
      interpretiveLimitations: 'Original composition is not an in-game capture, exact model reconstruction, surveyed layout, or evidence for a historical route.',
    };
  }),
  ...people.map((subject) => ({
    id: `portrait-${subject.id}`, kind: subject.type === 'faction' ? 'group-portrait' : 'character-portrait',
    file: `${imageDir}/${subject.assetName}.research.webp`, entityId: subject.id,
    nodeIds: beats.filter((beat) => beat.figures.includes(subject.id)).map((beat) => `${storyId}-story-${beat.id}`),
    sourceArtifactId: ({
      'gryan-stoutmantle': 'exec-1104a15c-7ecd-4dac-b8a8-2cfbd7f55c0d',
      'wiley-the-black': 'exec-52ae266b-8b22-4847-87e1-417674794959',
      'mathias-shaw': 'exec-ef82c4dc-f354-4b01-9921-9abadaf81250',
      'edwin-vancleef': 'exec-dfd72066-6ff2-4e05-a660-72a4692dfbb6',
      'baros-alexston': 'exec-8484aead-c183-4eaa-aa08-9b6d56938423',
      'bazil-thredd': 'exec-25b2ff0d-0c72-4210-a8de-7a643d43e240',
      'warden-thelwater': 'exec-7c6571e2-3d1e-408c-8276-f00919381158',
      marzon: 'exec-1cf2f722-a7f7-4643-9c17-b90721faffae',
      'lord-gregor-lescovar': 'exec-c26c0f6a-7a65-441b-a867-d2e0e577fbeb',
      'elling-trias': 'exec-df95d463-e2c0-473a-af1a-8143d7bdd8b7',
      'defias-tyrion': 'exec-e5fd5575-5356-43dc-9ba0-7d070109ef8e',
      'defias-brotherhood': 'exec-b5991295-7580-45b9-a6fc-82490262bbc6',
      'westfall-peoples-militia': 'exec-3a6223f2-b8a9-48e6-b90c-82268ceb2298',
      'stormwind-stonemasons': 'exec-b1a39ce2-6942-4264-b526-d05c7e3b0a7f',
    })[subject.id],
    generationBrief: `Original interpretive research ${subject.type === 'faction' ? 'ensemble' : 'full-body'} portrait of ${subject.name}; character and costume details are not asserted as canonical.`,
    promptStatus: 'Prompt brief retained in the authoring record.',
    targetEditionBuild: 'Original World of Warcraft Classic visual context; exact in-game model comparison remains open.',
    transparency: true,
    interpretiveLimitations: 'AI-generated character art is not canonical model evidence. Transparent cutout was retained through WebP conversion.',
  })),
  ...objects.map((subject) => ({
    id: `prop-${subject.id}`, kind: 'artifact-illustration', file: `${imageDir}/${subject.assetName}.research.webp`,
    entityId: subject.id, nodeIds: beats.filter((beat) => (beat.objects ?? []).includes(subject.id)).map((beat) => `${storyId}-story-${beat.id}`),
    sourceArtifactId: 'exec-96913a02-76c5-48bd-a7c8-ddf3e142a6d1',
    generationBrief: 'Unsent parchment letter with broken seal and deliberately unreadable marks; the quest does not expose its complete contents or exact appearance.',
    promptStatus: 'Prompt brief retained in the authoring record.',
    targetEditionBuild: 'Original World of Warcraft Classic quest item context; item art comparison remains open.',
    transparency: true,
    interpretiveLimitations: 'This is a generic interpretive paper prop, not the canonical quest-item icon or a depiction of the letter’s words.',
  })),
  {
    id: 'portrait-katrana-prestor', kind: 'reused-character-portrait',
    file: 'images/storylines/onyxia/katrana-prestor.research.webp', entityId: 'katrana-prestor',
    nodeIds: [`${storyId}-story-audience-unanswered`], reusedFrom: 'Existing Katrana Prestor entity art from the Onyxia storyline',
    generationBrief: 'Reuse the existing research portrait for the same named character; the source note and image remain unchanged.',
    promptStatus: 'Reused repository art; see the Onyxia asset ledger.', targetEditionBuild: 'Original World of Warcraft Classic context; model comparison remains open.',
    transparency: true, interpretiveLimitations: 'Original interpretive art, not canonical model evidence.',
  },
];
for (const definition of assetDefinitions) {
  const fullPath = path.join(root, 'public', definition.file);
  const bytes = await readFile(fullPath);
  const info = await stat(fullPath);
  assetLedger.push({ ...definition, generator: definition.reusedFrom ? 'Existing repository asset' : 'OpenAI ImageGen; converted from generated PNG with ffmpeg-static 5.3.0', byteLength: bytes.length, modifiedAt: info.mtime.toISOString(), sha256: createHash('sha256').update(bytes).digest('hex'), visualReview: 'Research visual; written area-trait check complete, matching original-client comparison and human approval still open.' });
}
await output(`docs/research/${storyId}-visual-assets.json`, {
  storyId, status: 'research', artDirection: 'Original World of Warcraft Classic area identities, with Stormwind Keep shown in pale/white stone, blue roofs and restrained gold details.',
  scopeNote: 'All images are original AI-generated interpretive research art except the documented reused throne-hall environment and Katrana portrait. No generated image is evidence for lore, canonical appearance, exact geography, or item placement.',
  assets: assetLedger,
});

let production = `# The Defias and the Unsent Letter — production and claim ledger\n\n`;
production += `Status: complete illustrated research story; not reviewed or published. ${nodes.length} scenes; ${wordCount} transcript words. Era 8 / original World of Warcraft Classic Alliance quest chains. Exact in-world dates are unknown.\n\n`;
production += '## Scope and evidence boundary\n\nThe story follows Gryan Stoutmantle’s investigation from Westfall to VanCleef’s Deadmines stronghold, then treats The Unsent Letter as an editorial branch into the Stockades and Stormwind court quests. Quest dependency establishes play order, not exact chronology or an unsupported route. The Stonemasons’ grievance stays attributed to Shaw and Bazil. Wiley’s report stays intelligence; “Maelik” remains unresolved until Shaw identifies Marzon. The report ends with Katrana Prestor because Varian is away. There is no causal link to Onyxia, and the Cataclysm-era Vanessa and Deadmines material is excluded.\n\n';
production += 'ClassicDB quest pages are secondary transcriptions and locators, not original-client captures. No dialogue is copied. All published narration is original paraphrase; dates, identities, routes, and unseen outcomes remain bounded by each cited quest. Human review of original build text, claims, area resemblance, performance, and voice remains open.\n\n## Beat ledger\n\n| Scene | Quest locator | Cast and objects | Place | Claim boundary |\n| --- | --- | --- | --- | --- |\n';
for (const beat of beats) {
  const placeNames = beat.locations.map((id) => placeById.get(id).name).join('; ');
  production += `| \`${beat.id}\` · ${beat.title} | ${beat.sources.map((id) => sourceById.get(id).questNumber ? `quest ${sourceById.get(id).questNumber}` : id).join('; ')} | ${unique([...beat.figures, ...(beat.objects ?? [])]).map((id) => subjectById.get(id).name).join(', ') || 'environment only'} | ${placeNames} | ${beat.note} |\n`;
}
production += `\n## Voice-over\n\n${nodes.filter((node) => node.voiceover).length} of ${nodes.length} scenes have repository-backed MP3 narration generated with Kokoro bm_lewis. Audio paths and durations are stored on each StoryNode and in the voice-over provenance manifest. The tracks remain AI-generated research narration until pronunciation, pacing, and mix are human-auditioned.\n\n`;
for (const node of nodes) if (node.voiceover) production += `- \`${node.id}\` — ${node.voiceover.durationMs} ms · \`${node.voiceover.assetPath}\`\n`;
production += '\n## StoryTour placement\n\nThe Classic-to-Wrath map lists this Classic story after Darrowshire as an editorial access order. The marker at `[55, 73]` is a UI anchor on the Eastern Kingdoms illustration, not an Azeroth coordinate. `showInEraTourOffshoots: false` keeps the story out of the Age of Adventurers tour offshoot list while leaving its standalone text page and StoryTour placard available.\n\n## Human review gates\n\nCompare each quest’s original-client dependency and text; review the Stonemasons dispute and speaker attribution; verify the Deadmines and Stormwind scene traits against original Classic areas; review generated costumes, group art, props and character resemblance; audition all names and narrator pacing. The full transcript remains available without audio and WebGL.\n';
await output(`docs/research/${storyId}-production.md`, production);

const researchPacket = `docs/research/${storyId}-research.md`;
const packetPath = path.join(root, researchPacket);
let packet = await readFile(packetPath, 'utf8').catch(() => '');
if (packet) {
  packet = packet.replace('Status: research packet prepared; original-client comparison and human review remain open.', 'Status: complete illustrated research story authored; original-client comparison and human review remain open.');
  await output(researchPacket, packet);
}

await rm(path.join(root, 'data/storylines/defias-two-generations.research.json'), { force: true });
await rm(path.join(root, 'data/sources/story-defias-deadmines.research.json'), { force: true });
process.stdout.write(`Authored ${nodes.length} Defias scenes (${wordCount} words), ${assetLedger.length} visual assets, ${quests.length} quest sources, and StoryTour order ${tour.entries.find((entry) => entry.storylineId === storyId).order}.\n`);
