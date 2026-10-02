import { createHash } from 'node:crypto';
import { access, mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const storyId = 'karazhan-masters-key-and-nightbane';
const guideId = `${storyId}-guide`;
const eraId = 'age-of-adventurers';
const worldspaceId = 'karazhan-story-theater';
const artDirectory = 'public/images/storylines/karazhan';
const existingStoryPath = path.join(root, `data/stories/${storyId}.research.json`);
const existingAssetLedgerPath = path.join(root, 'docs/research/karazhan-visual-assets.json');
const existingAssetRecords = new Map();
try {
  const existingLedger = JSON.parse(await readFile(existingAssetLedgerPath, 'utf8'));
  for (const asset of existingLedger.assetRecords ?? []) existingAssetRecords.set(asset.id, asset);
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
const existingVoiceovers = new Map();
try {
  const existingStory = JSON.parse(await readFile(existingStoryPath, 'utf8'));
  for (const node of existingStory.nodes ?? []) {
    if (node.voiceover) existingVoiceovers.set(node.id, node.voiceover);
  }
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

async function write(file, value) {
  const fullPath = path.join(root, file);
  await mkdir(path.dirname(fullPath), { recursive: true });
  await writeFile(fullPath, typeof value === 'string' ? value : `${JSON.stringify(value, null, 2)}\n`);
}

function assetFileMetadata(id, bytes, info) {
  const sha256 = createHash('sha256').update(bytes).digest('hex');
  const existing = existingAssetRecords.get(id);
  return {
    byteLength: bytes.length,
    modifiedAt: existing?.sha256 === sha256 ? existing.modifiedAt : info.mtime.toISOString(),
    sha256,
  };
}

const sources = [
  {
    id: 'karazhan-official-attunement-overview',
    title: 'Get Attuned and Face the Overlords of Outland',
    url: 'https://worldofwarcraft.blizzard.com/en-us/news/23716331/get-attuned-and-face-the-overlords-of-outland',
    sourceType: 'website',
    notes: 'Accessed 2026-10-01. Official Blizzard TBC Classic overview for the Master’s Key chain. It verifies the named quest sequence as presented for TBC Classic, not the complete dialogue or original 2007 client build. Treat as a locator, not primary quest capture.',
  },
  {
    id: 'karazhan-key-quest-locators',
    title: 'Karazhan attunement and Master’s Key quest locators',
    url: 'https://warcraft.wiki.gg/wiki/Karazhan_attunement',
    sourceType: 'website',
    notes: 'Accessed 2026-10-01. Secondary compilation used to locate the original Burning Crusade quest steps, parallel cellar quests, fragment destinations and return to Khadgar. Dialogue and chronology require capture against the original TBC client/build.',
  },
  {
    id: 'karazhan-entry-quest-text',
    title: 'Entry Into Karazhan quest text locator',
    url: 'https://warcraft.wiki.gg/wiki/Entry_Into_Karazhan',
    sourceType: 'quest',
    notes: 'Accessed 2026-10-01. Secondary reproduction of the Burning Crusade quest: Khadgar explains the key was split into three and locates the first fragment in the Shadow Labyrinth. This is not an original-client capture.',
  },
  {
    id: 'karazhan-fragment-quest-text',
    title: 'The Second and Third Fragments quest text locator',
    url: 'https://warcraft.wiki.gg/wiki/The_Second_and_Third_Fragments',
    sourceType: 'quest',
    notes: 'Accessed 2026-10-01. Secondary reproduction of the Burning Crusade quest. It records the second fragment in Coilfang Reservoir/Steamvault and the third in Tempest Keep/Arcatraz; the explanation for the second fragment’s changed location is attributed to Khadgar’s account.',
  },
  {
    id: 'karazhan-masters-touch-quest-text',
    title: 'The Master’s Touch quest text locator',
    url: 'https://warcraft.wiki.gg/wiki/The_Master%27s_Touch',
    sourceType: 'quest',
    notes: 'Accessed 2026-10-01. Secondary reproduction of the Burning Crusade quest text and sequence. The player enters the past in the Black Morass to have Medivh enable Khadgar’s key. The recognized key belongs to a time-memory, not an ordinary contemporary meeting.',
  },
  {
    id: 'karazhan-journal-and-nightbane-quest-chain',
    title: 'Nightbane quest chain and Medivh’s Journal locators',
    url: 'https://warcraft.wiki.gg/wiki/Nightbane_quest_chain',
    sourceType: 'website',
    notes: 'Accessed 2026-10-01. Secondary compilation of the original Burning Crusade Violet Eye journal and Nightbane chain. It preserves the journal-memory account, the dragon’s identity as Arcanagos, the source’s hypothesis about Medivh’s essence, and the final research goal. Exact released dialogue and pre-Wrath client comparison remain open.',
  },
  {
    id: 'karazhan-kalynnas-request-quest-text',
    title: 'Kalynna’s Request quest text locator',
    url: 'https://warcraft.wiki.gg/wiki/Kalynna%27s_Request',
    sourceType: 'quest',
    notes: 'Accessed 2026-10-01. Secondary reproduction: Kalynna asks for the Tome of Dusk from Shattered Halls and the Book of Forgotten Names from Sethekk Halls, both on Heroic difficulty. Treat the dungeon errands as a quest condition, not independent historical events.',
  },
  {
    id: 'karazhan-atiesh-visual-reference',
    title: 'Atiesh, Greatstaff of the Guardian item reference',
    url: 'https://www.wowhead.com/classic/item=22589/atiesh-greatstaff-of-the-guardian',
    sourceType: 'website',
    notes: 'Accessed 2026-10-02. Secondary visual locator for the mage version of the Classic/TBC item. Its recognizable raven carving and red mage streamer inform the focused Medivh staff edit. The art is not canonical game art; compare against the intended client model before human approval.',
  },
];
for (const source of sources) await write(`data/sources/${source.id}.research.json`, source);

const sourceUrlById = new Map(sources.map((source) => [source.id, source.url]));

const environments = [
  { id: 'deadwind-pass-tower', name: 'Karazhan above Deadwind Pass', traits: 'TBC-version Deadwind Pass: slate ravines, dead black trees, cold fog, a narrow road and the tall dark gothic tower with restrained violet magic.', artifact: 'exec-6c417bf4-8454-4aba-9dec-9c00c239c9d2.png', tile: 'top-left' },
  { id: 'karazhan-cellar', name: 'The Master’s Cellar', traits: 'Dark undercroft with worn masonry, underground water, small violet-blue arcane highlights and cellar-like vaults beneath the tower.', artifact: 'exec-6c417bf4-8454-4aba-9dec-9c00c239c9d2.png', tile: 'top-right' },
  { id: 'dalaran-crater', name: 'Dalaran Crater', traits: 'The abandoned crater-era city: a broad circular escarpment, broken pale stone, the incomplete violet protective dome and Lake Lordamere; not Northrend-era Dalaran.', artifact: 'exec-6c417bf4-8454-4aba-9dec-9c00c239c9d2.png', tile: 'bottom-left' },
  { id: 'shattrath-terrace-of-light', name: 'Shattrath, Terrace of Light', traits: 'Outland’s pale draenei stone arches, open round terrace and luminous naaru crystal, with dusty ochre and broken terrain beyond the city.', artifact: 'exec-6c417bf4-8454-4aba-9dec-9c00c239c9d2.png', tile: 'bottom-right' },
  { id: 'shadow-labyrinth', name: 'Shadow Labyrinth, Auchindoun', traits: 'Sunken draenei mausoleum: monumental pale carved stone, circular tiers and tall arches, violet shadows and restrained demonic light.', artifact: 'exec-5df9f48c-e954-472b-9821-1d891b2895e0.png', tile: 'top-left' },
  { id: 'steamvault', name: 'The Steamvault, Coilfang Reservoir', traits: 'Water-filled cavern works with enormous dark iron pipes, naga-built pumps, turquoise channels and wet industrial stone.', artifact: 'exec-5df9f48c-e954-472b-9821-1d891b2895e0.png', tile: 'top-right' },
  { id: 'arcatraz', name: 'The Arcatraz, Tempest Keep', traits: 'A crystalline Tempest Keep prison in Netherstorm: angular draenei craft, red-violet energy cells and a star-torn void beyond.', artifact: 'exec-5df9f48c-e954-472b-9821-1d891b2895e0.png', tile: 'bottom-left' },
  { id: 'black-morass-memory', name: 'Black Morass memory, Caverns of Time', traits: 'Historical memory of the swamp at the Opening of the Dark Portal: drowned trees, mud flats, green-brown haze and the dark portal. Clearly label this as a past scene, not a current route.', artifact: 'exec-5df9f48c-e954-472b-9821-1d891b2895e0.png', tile: 'bottom-right' },
  { id: 'karazhan-guardian-library', name: 'Guardian’s Library, Karazhan', traits: 'Dark multi-level tower library with tall gothic columns, densely stacked books and galleries, brass lamps, wine-red cloth and cool arcane accents.', artifact: 'exec-f9274e77-f8e4-4387-b508-3114caa19646.png', tile: 'top-left' },
  { id: 'karazhan-masters-terrace', name: 'The Master’s Terrace, Karazhan', traits: 'Exposed upper tower terrace with black stone parapets, rain-dark flagstones, stormy violet night and broad height over fogbound Deadwind Pass.', artifact: 'exec-f9274e77-f8e4-4387-b508-3114caa19646.png', tile: 'top-right' },
  { id: 'area-52', name: 'Area 52, Netherstorm', traits: 'Goblins’ expedition hub of riveted metal, patched canvas, pipes and raised walkways under Netherstorm’s violet sky and floating rock fragments.', artifact: 'exec-f9274e77-f8e4-4387-b508-3114caa19646.png', tile: 'bottom-left' },
  { id: 'deadwind-charred-bone-site', name: 'Mountains south of Karazhan', traits: 'Empty ashen slate crags, sparse cold grass and twisted branches in Deadwind Pass; a charred bone suggests the quest object without asserting an exact surveyed site.', artifact: 'exec-f9274e77-f8e4-4387-b508-3114caa19646.png', tile: 'bottom-right' },
  { id: 'shattered-halls', name: 'Shattered Halls, Hellfire Citadel', traits: 'Blackened iron gates and brutal rust-red fortress stone in Hellfire Citadel, forge glow and restrained fel-orc palette.', artifact: 'exec-c3f92db5-467d-45b9-ba2f-ec4a543f356b.png', tile: 'top-left' },
  { id: 'sethekk-halls', name: 'Sethekk Halls, Auchindoun', traits: 'Pale carved draenei mausoleum stone, high arches and broken mosaics under cool violet light, distinct from the dark industrial Shattered Halls.', artifact: 'exec-c3f92db5-467d-45b9-ba2f-ec4a543f356b.png', tile: 'top-right' },
  { id: 'violet-eye-field-camp', name: 'Violet Eye camp in Deadwind Pass', traits: 'Ordered field tents and arcane survey instruments beneath the Karazhan tower, surrounded by slate cliffs, dead trees and violet-grey mist.', artifact: 'exec-c3f92db5-467d-45b9-ba2f-ec4a543f356b.png', tile: 'bottom-left' },
  { id: 'karazhan-great-hall', name: 'The great hall, Karazhan', traits: 'Abandoned tall gothic interior with near-black stone, tarnished brass lamps, tattered dark wine-red cloth and violet shadow.', artifact: 'exec-c3f92db5-467d-45b9-ba2f-ec4a543f356b.png', tile: 'bottom-right' },
];

const cast = [
  { id: 'archmage-alturus', name: 'Archmage Alturus', type: 'character', description: 'Human field leader of the Violet Eye outside Karazhan; rendered as an experienced silvering mage in practical blue-violet robes.', asset: 'archmage-alturus', artifact: 'exec-8d723970-ba85-4e50-874f-bde09345d8e0.png', tile: 'top-left', scale: 0.82 },
  { id: 'khadgar', name: 'Khadgar', type: 'character', description: 'Human archmage and former apprentice to Medivh, shown with long white hair and beard in restrained ivory, slate-blue and silver robes.', asset: 'khadgar', artifact: 'exec-8d723970-ba85-4e50-874f-bde09345d8e0.png', tile: 'top-middle', scale: 0.84 },
  { id: 'medivh', name: 'Medivh', type: 'character', description: 'The Guardian in his journal memory, carrying Atiesh, Greatstaff of the Guardian: a dark gnarled wooden staff with an integrated carved seated raven, folded wings and hooked beak, a small violet eye or stone, and the mage version’s hanging red streamer.', asset: 'medivh', artifact: 'exec-4ebac0e7-67f0-4897-b32b-ce58ae9d9185.png', tile: 'single transparent portrait with seated-raven and red-ribbon Atiesh edit', scale: 1.3 },
  { id: 'archmage-cedric', name: 'Archmage Cedric', type: 'character', description: 'Senior human mage of Dalaran and the Violet Eye, represented in formal, dark-violet robes.', asset: 'archmage-cedric', artifact: 'exec-8d723970-ba85-4e50-874f-bde09345d8e0.png', tile: 'top-right', scale: 0.82 },
  { id: 'wravien', name: 'Wravien', type: 'character', description: 'Human Violet Eye mage found among the books in Karazhan’s Guardian’s Library; tired and distracted by the tower.', asset: 'wravien', artifact: 'exec-8d723970-ba85-4e50-874f-bde09345d8e0.png', tile: 'bottom-left', scale: 0.82 },
  { id: 'gradav', name: 'Gradav', type: 'character', description: 'Human Violet Eye warlock in Karazhan’s library, absorbed in his own task and unable to direct the seeker beyond Kamsis.', asset: 'gradav', artifact: 'exec-8d723970-ba85-4e50-874f-bde09345d8e0.png', tile: 'bottom-middle', scale: 0.82 },
  { id: 'kamsis', name: 'Kamsis', type: 'character', description: 'Undead human Violet Eye conjurer whose shade helps direct the investigation toward the Shade of Aran and Medivh’s Journal.', asset: 'kamsis', artifact: 'exec-8d723970-ba85-4e50-874f-bde09345d8e0.png', tile: 'bottom-right', scale: 0.82 },
  { id: 'kalynna-lathred', name: 'Kalynna Lathred', type: 'character', description: 'Human former Kirin Tor mage living in Area 52, who now studies arts she describes as forbidden to her old order.', asset: 'kalynna-lathred', artifact: 'exec-18101bd6-943a-42b9-b005-5f5e65401dc6.png', tile: 'top-left', scale: 0.82 },
  { id: 'shade-of-aran', name: 'Shade of Aran', type: 'character', description: 'The spectral remains of Nielas Aran, Medivh’s father, encountered in Karazhan.', asset: 'shade-of-aran', artifact: 'exec-18101bd6-943a-42b9-b005-5f5e65401dc6.png', tile: 'top-middle', scale: 0.82 },
  { id: 'violet-eye-agents', name: 'Violet Eye journal investigators', type: 'faction', description: 'An interpretive ensemble representing the agents the Violet Eye sent into Karazhan to seek Medivh’s Journal; it does not identify an exact roster beyond the named agents.', asset: 'violet-eye-agents', artifact: 'exec-18101bd6-943a-42b9-b005-5f5e65401dc6.png', tile: 'bottom-right', scale: 0.86 },
  { id: 'arcanagos', name: 'Arcanagos', type: 'character', description: 'A living blue dragon in Medivh’s journal memory; the Nightbane quest identifies the revived dragon’s remains as Arcanagos.', asset: 'arcanagos', artifact: 'exec-20678ad6-3327-4ca4-8ef8-45aed2d0c527.png', tile: 'single transparent portrait', scale: 1.04 },
  { id: 'nightbane', name: 'Nightbane', type: 'character', description: 'The undead form raised from Arcanagos’s charred remains in the TBC quest account; visual continuity with the living blue dragon is interpretive.', asset: 'nightbane', artifact: 'exec-a2cc4a47-124d-4b2f-9005-fe5de56d1d7d.png', tile: 'single transparent portrait', scale: 1.05 },
];

const artifacts = [
  { id: 'masters-key', name: 'The Master’s Key', description: 'The key Khadgar restores and Medivh enables. Its precise shape is not treated as a sourced historical claim.', tile: 0 },
  { id: 'masters-key-fragments', name: 'The Master’s Key fragments', description: 'Three editorially illustrated fragments representing the divided key; no fragment appearance is asserted as canonical.', tile: 1 },
  { id: 'medivhs-journal', name: 'Medivh’s Journal', description: 'The journal whose pages let the seeker experience a memory of Medivh and Arcanagos.', tile: 2 },
  { id: 'charred-bone-fragment', name: 'Charred Bone Fragment', description: 'The dragon-bone quest object from the mountains south of Karazhan; the illustration is not a precise find-site map.', tile: 3 },
  { id: 'blackened-urn', name: 'Blackened Urn', description: 'The urn used in the original Burning Crusade Nightbane summoning quest; appearance is an original interpretation.', tile: 4 },
  { id: 'violet-scrying-crystal', name: 'Violet Scrying Crystal', description: 'Alturus’s instrument for measuring arcane traces beneath Karazhan, illustrated as a research object.', tile: 5 },
];

const locations = [
  { id: 'deadwind-pass-karazhan', name: 'Deadwind Pass and Karazhan', environment: 'deadwind-pass-tower' },
  { id: 'karazhan-masters-cellar', name: 'The Master’s Cellar', environment: 'karazhan-cellar' },
  { id: 'dalaran-crater', name: 'Dalaran Crater', environment: 'dalaran-crater' },
  { id: 'shattrath-city', name: 'Shattrath City', environment: 'shattrath-terrace-of-light' },
  { id: 'shadow-labyrinth', name: 'Shadow Labyrinth', environment: 'shadow-labyrinth' },
  { id: 'steamvault', name: 'The Steamvault', environment: 'steamvault' },
  { id: 'arcatraz', name: 'The Arcatraz', environment: 'arcatraz' },
  { id: 'black-morass', name: 'The Black Morass, a historical memory', environment: 'black-morass-memory' },
  { id: 'karazhan-guardian-library', name: 'Karazhan’s Guardian’s Library', environment: 'karazhan-guardian-library' },
  { id: 'karazhan-masters-terrace', name: 'Karazhan’s Master’s Terrace', environment: 'karazhan-masters-terrace' },
  { id: 'area-52-netherstorm', name: 'Area 52, Netherstorm', environment: 'area-52' },
  { id: 'deadwind-charred-bone-site', name: 'Mountains south of Karazhan', environment: 'deadwind-charred-bone-site' },
  { id: 'shattered-halls', name: 'Shattered Halls', environment: 'shattered-halls' },
  { id: 'sethekk-halls', name: 'Sethekk Halls', environment: 'sethekk-halls' },
  { id: 'violet-eye-field-camp', name: 'Violet Eye field camp', environment: 'violet-eye-field-camp' },
  { id: 'karazhan-great-hall', name: 'Karazhan’s great hall', environment: 'karazhan-great-hall' },
];

const beats = [
  {
    id: 'reports-from-deadwind', title: 'Reports from Deadwind Pass', environment: 'deadwind-pass-tower', location: 'deadwind-pass-karazhan',
    cast: ['archmage-alturus', 'violet-eye-agents'], objects: [],
    quests: ['9824 · Arcane Disturbances', '9825 · Restless Activity'],
    sources: ['karazhan-official-attunement-overview', 'karazhan-key-quest-locators'],
    text: 'Archmage Alturus watches the road below Karazhan while the Violet Eye studies a tower that has kept its doors closed. His first assignments open along two parallel paths: Arcane Disturbances and Restless Activity. One sends the seeker beneath the tower; the other concerns the restless dead around it. The quests establish a troubled place and an order to investigate. They do not establish that either task caused the tower’s condition, or that the source of every disturbance is already known.',
  },
  {
    id: 'beneath-the-tower', title: 'Beneath the sealed tower', environment: 'karazhan-cellar', location: 'karazhan-masters-cellar',
    cast: ['archmage-alturus'], objects: ['violet-scrying-crystal'],
    quests: ['9824 · Arcane Disturbances'], sources: ['karazhan-key-quest-locators'],
    text: 'Alturus gives the seeker a Violet Scrying Crystal and asks for readings from underground water in the Master’s Cellar. In the quest’s report, the expected arcane currents are absent: the tower registers as a vast energy vacuum, with only a faint demonic echo. That phrase is Alturus’s reading of the crystal, not a confirmed identity for the presence. The cellar returns a warning, but not yet an answer.',
  },
  {
    id: 'contact-from-dalaran', title: 'A report reaches Dalaran', environment: 'dalaran-crater', location: 'dalaran-crater',
    cast: ['archmage-alturus', 'archmage-cedric'], objects: [],
    quests: ['9826 · Contact from Dalaran'], sources: ['karazhan-official-attunement-overview', 'karazhan-key-quest-locators'],
    text: 'Alturus sends his report to Archmage Cedric in Dalaran’s old crater. Cedric has learned that the tower sealed itself off and that the Violet Eye lost contact with agents within it. The new reading gives the old silence another urgency. Cedric points toward one person who might reopen the way: Khadgar, Medivh’s former apprentice, now living in Shattrath. The ruined crater is Dalaran’s original site, not the city’s later home in Northrend.',
  },
  {
    id: 'khadgar-in-shattrath', title: 'Khadgar in Shattrath', environment: 'shattrath-terrace-of-light', location: 'shattrath-city',
    cast: ['khadgar'], objects: ['masters-key-fragments'],
    quests: ['9829 · Khadgar'], sources: ['karazhan-official-attunement-overview', 'karazhan-key-quest-locators'],
    text: 'In Shattrath, Khadgar receives Alturus’s account and sees a familiar problem in it. Karazhan cannot simply be forced open; the Master’s Key once held that power, and he knows the key’s history. He will help restore it, though the next stages will cross Outland’s changed strongholds. The meeting begins the fragment quest line. It is a new undertaking prompted by Alturus’s report, not proof that the Violet Eye has already learned what happened inside the tower.',
  },
  {
    id: 'a-key-in-three-pieces', title: 'A key in three pieces', environment: 'shattrath-terrace-of-light', location: 'shattrath-city',
    cast: ['khadgar'], objects: ['masters-key-fragments'],
    quests: ['9831 · Entry Into Karazhan'], sources: ['karazhan-entry-quest-text'],
    text: 'Khadgar explains that, while stranded in Outland, he split his key into three and hid the pieces inside enchanted containers. The places seemed safe when he chose them; Outland has changed since then. His explanation gives the search its shape, but not a single road: each fragment lies in a separate dungeon, and each location reflects a world now fought over by new powers.',
  },
  {
    id: 'first-key-fragment', title: 'The first fragment in Auchindoun', environment: 'shadow-labyrinth', location: 'shadow-labyrinth',
    cast: ['khadgar'], objects: ['masters-key-fragments'],
    quests: ['9831 · Entry Into Karazhan'], sources: ['karazhan-entry-quest-text', 'karazhan-official-attunement-overview'],
    text: 'The first fragment rests in the Shadow Labyrinth, among passages occupied by the Shadow Council. Khadgar’s account places the container there because the labyrinth once seemed a safe hiding place. The return of the fragment changes the key from a distant memory into a recoverable object. It does not yet open the tower; two pieces remain beyond reach.',
  },
  {
    id: 'second-key-fragment', title: 'A fragment under the Steamvault', environment: 'steamvault', location: 'steamvault',
    cast: ['khadgar'], objects: ['masters-key-fragments'],
    quests: ['The Second and Third Fragments · second fragment'], sources: ['karazhan-fragment-quest-text'],
    confidence: 'inferred',
    text: 'The second container is found in the Steamvault beneath Coilfang Reservoir. Khadgar recalls hiding it under Serpent Lake before the place was known by that name; he suspects the naga’s great drain carried it into the reservoir. That explanation is his best account of a changed landscape, not a witnessed transfer. The fragment is recovered, while the precise course of its movement remains uncertain.',
  },
  {
    id: 'third-key-fragment', title: 'The prison above Netherstorm', environment: 'arcatraz', location: 'arcatraz',
    cast: ['khadgar'], objects: ['masters-key-fragments'],
    quests: ['The Second and Third Fragments · third fragment'], sources: ['karazhan-fragment-quest-text', 'karazhan-official-attunement-overview'],
    text: 'The third fragment lies within the Arcatraz, a prison in the Tempest Keep complex. Khadgar had hidden it while the naaru held the fortress; by the time the seeker arrives, Kael’thas’s forces have turned the vessel into a place of confinement. The key’s last piece is retrieved from a refuge that has become dangerous. The three fragments can now be taken back to their maker.',
  },
  {
    id: 'the-masters-touch', title: 'The Master’s Touch', environment: 'black-morass-memory', location: 'black-morass',
    cast: ['khadgar', 'medivh'], objects: ['masters-key'],
    quests: ['9830 · The Master’s Touch'], sources: ['karazhan-masters-touch-quest-text', 'karazhan-official-attunement-overview'],
    temporal: true,
    text: 'Khadgar restores the key but says it will remain useless without Medivh’s consent. In the Black Morass, the seeker travels to a remembered past at the Opening of the Dark Portal. There, Medivh recognizes the key as Khadgar’s and acknowledges that he has not yet given it to his apprentice. The meeting belongs to a time-travel quest scene, not to a present-day journey through the swamp. The key receives the permission Khadgar could not grant for himself.',
  },
  {
    id: 'return-to-khadgar', title: 'The key returns to Shattrath', environment: 'shattrath-terrace-of-light', location: 'shattrath-city',
    cast: ['khadgar'], objects: ['masters-key'],
    quests: ['Return to Khadgar'], sources: ['karazhan-official-attunement-overview', 'karazhan-key-quest-locators'],
    text: 'The restored key returns to Khadgar in Shattrath, and the attunement chain reaches its stated end. A way into Karazhan now exists. The tower’s condition and the fate of its trapped investigators remain matters for the Violet Eye to examine. That distinction closes one quest and leaves another question standing at the gate.',
  },
  {
    id: 'the-journal-search', title: 'A separate search for the journal', environment: 'violet-eye-field-camp', location: 'violet-eye-field-camp',
    cast: ['archmage-alturus', 'violet-eye-agents'], objects: ['medivhs-journal'],
    quests: ['Medivh’s Journal'], sources: ['karazhan-journal-and-nightbane-quest-chain'],
    editorialJoin: true,
    text: 'The Violet Eye’s next inquiry is related by the tower, not by a shared quest dependency: after establishing a foothold inside Karazhan and earning the required standing, Alturus asks the adventurer to find Medivh’s Journal. Agents sent before have not returned; Wravien was the last named seeker. This is a distinct research chain joined here for its evidence about the tower’s history. It does not follow automatically from handing Khadgar the key.',
  },
  {
    id: 'the-lost-investigators', title: 'The investigators among the books', environment: 'karazhan-guardian-library', location: 'karazhan-guardian-library',
    cast: ['wravien', 'gradav', 'kamsis', 'violet-eye-agents'], objects: ['medivhs-journal'],
    quests: ['Medivh’s Journal', 'In Good Hands', 'Kamsis'], sources: ['karazhan-journal-and-nightbane-quest-chain'],
    text: 'Inside the Guardian’s Library, Wravien struggles to remember his commission and sends the seeker to Gradav. Gradav also cannot leave his own work, then points toward Kamsis. The three exchanges make the library’s abundance part of the obstacle: each agent offers a fragment of direction, while none can simply lead the search to its end. Their quest dialogue records confusion and fixation; it does not fully explain what the tower has done to them.',
  },
  {
    id: 'the-shade-and-journal', title: 'The Shade of Aran and the journal', environment: 'karazhan-great-hall', location: 'karazhan-great-hall',
    cast: ['kamsis', 'shade-of-aran'], objects: ['medivhs-journal'],
    quests: ['The Shade of Aran'], sources: ['karazhan-journal-and-nightbane-quest-chain'],
    text: 'Kamsis directs the search toward the Shade of Aran, Medivh’s father. When the shade is overcome, Medivh’s Journal is recovered from the encounter and returned to the Violet Eye’s inquiry. The discovery changes the work from searching for a lost book to reading what the book can reveal. Its pages are not a neutral report from an observer: the next quest treats them as a way to witness one of Medivh’s own memories.',
  },
  {
    id: 'memory-of-arcanagos', title: 'A memory of Arcanagos', environment: 'karazhan-masters-terrace', location: 'karazhan-masters-terrace',
    cast: ['medivh', 'arcanagos'], objects: ['medivhs-journal'],
    quests: ['The Master’s Terrace'], sources: ['karazhan-journal-and-nightbane-quest-chain', 'karazhan-atiesh-visual-reference'],
    temporal: true,
    text: 'On the Master’s Terrace, the journal opens onto an older meeting. The blue dragon Arcanagos warns Medivh that a dark power seeks to use him, and urges him to leave the tower. Medivh refuses. Magic burns through the dragon from within; Arcanagos flies away aflame. The scene is a memory carried by the journal, not a new event occurring during the Violet Eye’s present investigation.',
  },
  {
    id: 'charred-evidence', title: 'A question among the ashes', environment: 'deadwind-charred-bone-site', location: 'deadwind-charred-bone-site',
    cast: ['archmage-alturus'], objects: ['charred-bone-fragment'],
    quests: ['Digging Up the Past'], sources: ['karazhan-journal-and-nightbane-quest-chain'],
    confidence: 'inferred',
    text: 'After studying the journal, Alturus proposes that Medivh may have woven some of his essence into the magic that defeated Arcanagos. If so, he reasons, a trace might remain in the dragon’s bones. The quest sends the seeker to find a Charred Bone Fragment in the mountains south of Karazhan. This is Alturus’s hypothesis and a search for evidence, not a confirmation that the essence can be recovered.',
  },
  {
    id: 'kalynnas-aid', title: 'Kalynna’s offer', environment: 'area-52', location: 'area-52-netherstorm',
    cast: ['archmage-alturus', 'kalynna-lathred'], objects: ['charred-bone-fragment'],
    quests: ['A Colleague’s Aid'], sources: ['karazhan-journal-and-nightbane-quest-chain'],
    text: 'Alturus sends the bone to Kalynna Lathred in Area 52. She once belonged to the Kirin Tor, but now follows studies her old order forbade. The fragment’s essence, Alturus says, is lifeless—like Arcanagos. Kalynna believes she can help, but her own research has a cost. Her answer turns the Violet Eye’s question into a bargain between scholars with different boundaries.',
  },
  {
    id: 'kalynnas-request', title: 'Two books, two halls', environment: 'shattered-halls', location: 'shattered-halls',
    cast: ['kalynna-lathred'], objects: ['charred-bone-fragment'],
    quests: ['Kalynna’s Request'], sources: ['karazhan-kalynnas-request-quest-text'],
    text: 'Kalynna asks for two books before she will complete the favor. The Tome of Dusk belongs to the orc warlock Nethekurse in the Shattered Halls; the Book of Forgotten Names is held by Darkweaver Syth in Sethekk Halls. The quest requires heroic versions of both dungeons. These are the terms of a research exchange, not separate historical turning points, and the two halls retain their distinct landscapes in this paired itinerary.',
  },
  {
    id: 'nightbane-raised', title: 'Nightbane on the terrace', environment: 'karazhan-masters-terrace', location: 'karazhan-masters-terrace',
    cast: ['kalynna-lathred', 'archmage-alturus', 'nightbane'], objects: ['blackened-urn', 'charred-bone-fragment'],
    quests: ['Nightbane'], sources: ['karazhan-journal-and-nightbane-quest-chain'],
    text: 'With Kalynna’s materials placed in a Blackened Urn, the seeker returns to the Master’s Terrace and sets it alight. The quest says the released energy raises Arcanagos’s charred remains as Nightbane. The adventurer defeats the dragon and carries its essence back to Alturus, whose hope is to study what the fragment may reveal about Medivh. The chain ends with a sample and a research question—not a complete explanation of the Guardian’s magic, nor a later chapter in Arcanagos’s history.',
  },
];

const allSourceIds = [...new Set(beats.flatMap((beat) => beat.sources))];
const allCastIds = [...new Set(beats.flatMap((beat) => beat.cast))];
const allArtifactIds = [...new Set(beats.flatMap((beat) => beat.objects))];

for (const environment of environments) {
  const imagePath = `${artDirectory}/${environment.id}.research.webp`;
  await access(path.join(root, imagePath));
  await write(`data/map-states/${storyId}-${environment.id}.research.json`, {
    id: `${storyId}-${environment.id}-scene`,
    name: `Karazhan story: ${environment.name}`,
    worldspaceId,
    presentation: 'relational',
    terrainTextureAsset: `images/storylines/karazhan/${environment.id}.research.webp`,
    geometryIds: [],
    cartographyLabel: 'ILLUSTRATED QUESTLINE THEATER',
    interpretationNote: `Original AI-generated environment inspired by ${environment.name}. Recognizable Burning Crusade-era traits: ${environment.traits} This is an illustrated scene, not a surveyed map, dungeon floor plan, proof of exact character co-presence, or physical travel route. Side-by-side comparison against the matching in-game area and build remains a human review gate. See docs/research/karazhan-visual-assets.json.`,
  });
}

const nameByEntityId = new Map();
for (const person of cast) {
  const imagePath = `images/storylines/karazhan/${person.asset}.research.webp`;
  await access(path.join(root, 'public', imagePath));
  nameByEntityId.set(person.id, person.name);
  if (person.id === 'medivh') continue; // Preserve the existing entity record; the block below updates only its story figure.
  const relevantSources = [...new Set(beats.filter((beat) => beat.cast.includes(person.id)).flatMap((beat) => beat.sources))];
  await write(`data/entities/${person.id}.research.json`, {
    id: person.id,
    type: person.type,
    name: person.name,
    slug: person.id,
    shortDescription: `${person.name}, represented in the Karazhan research story.`,
    body: `${person.description} The art is an original AI-generated interpretation, not canonical game art or proof of exact appearance, costume, formation, or simultaneous presence. The Violet Eye figure ensemble is editorial and does not establish an exact membership list. See the production and visual asset ledgers.`,
    firstEraId: eraId,
    featuredEraIds: [eraId],
    sourceIds: relevantSources,
    tags: ['karazhan-story', 'interpretive-art'],
    ...(person.type === 'character'
      ? { mapFigure: { asset: imagePath, scale: person.scale } }
      : { mapVisual: { asset: imagePath, scale: person.scale } }),
    contentStatus: 'research',
  });
}

// Medivh is an existing entity. Keep that stable record and update its figure to the user-requested Atiesh depiction.
const medivhPath = path.join(root, 'data/entities/medivh.research.json');
const medivh = JSON.parse(await readFile(medivhPath, 'utf8'));
medivh.mapFigure = {
  asset: 'images/storylines/karazhan/medivh.research.webp',
  scale: 1.3,
  eraVariants: [{ eraId, asset: 'images/storylines/karazhan/medivh.research.webp', scale: 2.0 }],
};
medivh.sourceIds = [...new Set([...medivh.sourceIds, ...beats.filter((beat) => beat.cast.includes('medivh')).flatMap((beat) => beat.sources)])];
medivh.featuredEraIds = [...new Set([...(medivh.featuredEraIds ?? []), eraId])];
medivh.tags = [...new Set([...(medivh.tags ?? []), 'atiesh', 'karazhan-story'])];
const atieshNotes = [
  'The Karazhan-story figure is a separate original interpretation and depicts the user-requested raven-crowned Atiesh. Its appearance and use in the journal memory remain subject to human comparison with the appropriate TBC client/model.',
  'The Karazhan-story figure is a separate original interpretation and shows Atiesh, Greatstaff of the Guardian, as a gnarled wooden staff with an integrated carved raven-head finial, violet crystal accents, and a hanging violet streamer. Its appearance and use in the journal memory remain subject to human comparison with the appropriate TBC client/model.',
  'The Karazhan-story figure is a separate original interpretation and shows Atiesh as a dark gnarled wooden staff with an integrated carved seated raven, folded wings and hooked beak, a small violet eye or stone, and a hanging violet streamer. Its appearance and use in the journal memory remain subject to human comparison with the appropriate TBC client/model.',
  'The Karazhan-story figure is a separate original interpretation and shows Atiesh as a dark gnarled wooden staff with an integrated carved seated raven, folded wings and hooked beak, a small violet eye or stone, and the mage version’s hanging red streamer. Its appearance and use in the journal memory remain subject to human comparison with the appropriate TBC client/model.',
];
const medivhBodyWithoutAtieshNote = atieshNotes.reduce((body, note) => body.replaceAll(note, ' '), medivh.body ?? '').replace(/\s+/g, ' ').trim();
const atieshNote = atieshNotes[3];
medivh.body = [medivhBodyWithoutAtieshNote, atieshNote].filter(Boolean).join(' ');
await write('data/entities/medivh.research.json', medivh);

for (const artifact of artifacts) {
  const imagePath = `images/storylines/karazhan/${artifact.id}.research.webp`;
  await access(path.join(root, 'public', imagePath));
  const relevantSources = [...new Set(beats.filter((beat) => beat.objects.includes(artifact.id)).flatMap((beat) => beat.sources))];
  await write(`data/entities/${artifact.id}.research.json`, {
    id: artifact.id,
    type: 'artifact',
    name: artifact.name,
    slug: artifact.id,
    shortDescription: `${artifact.name}, represented in the Karazhan research story.`,
    body: `${artifact.description} This image is an original interpretation and does not establish an unsourced physical design.`,
    firstEraId: eraId,
    featuredEraIds: [eraId],
    sourceIds: relevantSources,
    tags: ['karazhan-story', 'interpretive-art'],
    mapVisual: { asset: imagePath, scale: artifact.id === 'masters-key' ? 0.72 : 0.66 },
    contentStatus: 'research',
  });
  nameByEntityId.set(artifact.id, artifact.name);
}

for (const location of locations) {
  const imageRecord = environments.find((scene) => scene.id === location.environment);
  const relevantSources = [...new Set(beats.filter((beat) => beat.location === location.id).flatMap((beat) => beat.sources))];
  const entityPath = `data/entities/${location.id}.research.json`;
  let entity = {
    id: location.id,
    type: 'location',
    name: location.name,
    slug: location.id,
    shortDescription: `${location.name}, a named setting in the Karazhan research story.`,
    body: `The associated original environment art preserves these ${imageRecord.traits} It remains an interpretive scene; no exact route, dungeon layout or surveyed coordinate is asserted.`,
    firstEraId: eraId,
    featuredEraIds: [eraId],
    sourceIds: relevantSources,
    tags: ['karazhan-story', 'burning-crusade-location'],
    contentStatus: 'research',
  };
  try {
    const existingEntity = JSON.parse(await readFile(path.join(root, entityPath), 'utf8'));
    const hasForeignSources = existingEntity.sourceIds?.some((sourceId) => !allSourceIds.includes(sourceId));
    if (!existingEntity.tags?.includes('karazhan-story') || hasForeignSources) {
      entity = existingEntity;
    }
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  await write(entityPath, entity);
  nameByEntityId.set(location.id, location.name);
}

const relevantEntityIds = [...new Set([...allCastIds, ...allArtifactIds])];
const adjacentCast = new Map(relevantEntityIds.map((id) => [id, new Set()]));
for (const beat of beats) {
  const together = [...beat.cast, ...beat.objects];
  for (const id of together) for (const neighbor of together) if (id !== neighbor) adjacentCast.get(id)?.add(neighbor);
}
const slots = new Map();
for (const id of relevantEntityIds) {
  const occupied = new Set([...adjacentCast.get(id)].map((neighbor) => slots.get(neighbor)).filter((slot) => slot !== undefined));
  let slot = 0;
  while (occupied.has(slot)) slot++;
  slots.set(id, slot);
}
const maxSlot = Math.max(...slots.values());
const features = [];
for (const id of relevantEntityIds) {
  const x = 3300 + slots.get(id) * 3400 / Math.max(1, maxSlot);
  const geometryId = `${storyId}-${id}-focus`;
  const relevantSources = [...new Set(beats.filter((beat) => beat.cast.includes(id) || beat.objects.includes(id)).flatMap((beat) => beat.sources))];
  features.push({
    type: 'Feature',
    id: geometryId,
    properties: { name: `${nameByEntityId.get(id)} editorial focus`, contentStatus: 'research', styleRole: 'site', geographicCertainty: 'unknown' },
    geometry: { type: 'Point', coordinates: [x, 5500] },
  });
  await write(`data/spatial-states/${storyId}-${id}.research.json`, {
    id: `${storyId}-${id}-theater`, entityId: id, eraId, worldspaceId, geometryId,
    placementKind: 'relational', geographicCertainty: 'unknown', sourceIds: relevantSources,
    editorNote: 'Editorial cast/object placement in an illustrated story theater. It asserts no map position, route, literal formation or unsupported co-presence.',
    visualPresence: 'contextual', labelPriority: 240,
  });
}
await write(`data/geometry/${storyId}-theater.research.geojson`, { type: 'FeatureCollection', features });
await write(`data/worldspaces/${worldspaceId}.research.json`, {
  id: worldspaceId,
  name: 'Karazhan — relational story theater',
  slug: worldspaceId,
  coordinateSystem: { width: 10000, height: 10000, origin: 'bottom-left', units: 'atlas-units' },
});

const nodes = [];
for (const [index, beat] of beats.entries()) {
  const nodeId = `${storyId}-story-${beat.id}`;
  const eventId = `${storyId}-${beat.id}-event`;
  const citationIds = [];
  for (const [sourceIndex, sourceId] of beat.sources.entries()) {
    const citationId = `${storyId}-${beat.id}-citation-${sourceIndex + 1}`;
    citationIds.push(citationId);
    const questId = beat.quests[Math.min(sourceIndex, beat.quests.length - 1)];
    await write(`data/citations/${citationId}.research.json`, {
      id: citationId,
      sourceId,
      section: `${questId ? `${questId} · ` : ''}${beat.title}; directly relevant quest description, objective, completion or series entry`,
      ...(questId ? { questId } : {}),
      note: 'Original paraphrase from an accessible official overview or secondary database/wiki locator. The locator is not an original-client capture; compare the stated TBC edition/build and released quest text before human approval.',
    });
  }
  const claimId = `${storyId}-${beat.id}-claim`;
  const eventName = beat.title;
  await write(`data/claims/${claimId}.research.json`, {
    id: claimId,
    subjectId: eventId,
    predicate: beat.temporal ? 'remembered_quest_scene_account' : beat.editorialJoin ? 'editorial_story_link' : 'questline_scene_account',
    value: beat.text,
    citationIds,
    confidence: beat.confidence ?? 'strongly_supported',
    status: 'active',
    editorNote: beat.editorialJoin
      ? 'Explicit editorial join: the Master’s Key attunement and Violet Eye/Nightbane chain are separate quest chains. This beat establishes no prerequisite or causal edge between them.'
      : beat.temporal
        ? 'Historical scene is explicitly presented as a memory or time-travel quest scene. It must not be drawn as contemporary geography or a current travel route.'
        : beat.confidence === 'inferred'
          ? 'Keep this attribution and uncertainty visible: the quest source presents an investigator’s hypothesis, not an independently verified chronology or movement.'
          : 'Research status: accessible sources reproduce quest material but are not original-client captures. Do not promote without source and edition review.',
  });
  await write(`data/events/${eventId}.research.json`, {
    id: eventId,
    kind: 'event',
    name: eventName,
    slug: `${storyId}-${beat.id}`,
    eraId,
    worldspaceId,
    date: { precision: 'relative', label: 'The Burning Crusade · original quest chronology; exact dating unknown' },
    summary: beat.text,
    locationIds: [beat.location],
    participantEntityIds: beat.cast,
    sourceIds: beat.sources,
    claimIds: [claimId],
    contentStatus: 'research',
  });
  const entities = [...beat.cast, ...beat.objects];
  nodes.push({
    id: nodeId,
    guideId,
    title: beat.title,
    narration: beat.text,
    durationMs: Math.round(((beat.text.split(/\s+/).length / 82) * 60_000) / 500) * 500 + 5_000,
    eventIds: [eventId],
    entityIds: entities,
    locationIds: [beat.location],
    camera: { position: [0, 6.1, 5.2], target: [0, 0, 0], durationMs: 1100 },
    visualActions: [{ type: 'set_map_state', mapStateId: `${storyId}-${beat.environment}-scene` }],
    ...(existingVoiceovers.has(nodeId) ? { voiceover: existingVoiceovers.get(nodeId) } : {}),
    ...(index > 0 ? { previousNodeId: nodes[index - 1].id } : {}),
    ...(index < beats.length - 1 ? { nextNodeIds: [`${storyId}-story-${beats[index + 1].id}`] } : {}),
  });
}

const chapters = [
  { id: 'restore-the-key', title: 'Restore the Master’s Key', body: 'Alturus’s reports lead to Khadgar. Three fragments must be recovered from Outland before Medivh can enable the restored key in a historical memory. The key chain ends when it is returned to Khadgar. Scenes 1–10.' },
  { id: 'the-journal-memory', title: 'The Journal and its Memory', body: 'The Violet Eye begins a separate investigation for Medivh’s Journal. Wravien, Gradav and Kamsis direct the search to the Shade of Aran; the book then reveals a memory of Medivh and Arcanagos on the Master’s Terrace. Scenes 11–14.' },
  { id: 'nightbane-research', title: 'From Charred Bone to Nightbane', body: 'Alturus’s hypothesis sends the seeker to Kalynna. Her heroic-dungeon request supplies materials for the urn, Nightbane is raised from Arcanagos’s remains, and the chain ends with an essence sample for further study. Scenes 15–18.' },
].map((chapter) => ({ ...chapter, eraId }));

const guide = {
  id: guideId,
  eraId,
  title: 'Karazhan: The Master’s Key and Nightbane',
  description: 'An 18-scene illustrated Burning Crusade research chronicle follows two distinct quest chains linked by Karazhan: Khadgar’s divided key, then the Violet Eye’s journal investigation and Nightbane.',
  nodeIds: nodes.map((node) => node.id),
  contentStatus: 'research',
};
await write(`data/stories/${storyId}.research.json`, { guide, nodes });

const storyline = {
  id: storyId,
  slug: storyId,
  title: 'Karazhan: The Master’s Key and Nightbane',
  summary: 'Alturus’s investigation leads Khadgar to restore a key divided across Outland. A separate Violet Eye search for Medivh’s Journal uncovers a memory of Arcanagos and a ritual that raises Nightbane.',
  opening: 'A tower in Deadwind Pass has sealed itself away, and the Violet Eye’s reading finds a faint demonic echo. The road to reopen Karazhan crosses Outland; the later search for Medivh’s Journal begins a separate inquiry into what the tower remembers.',
  primaryEraId: eraId,
  eraIds: [eraId],
  chapters,
  sourceIds: allSourceIds,
  storyGuideId: guideId,
  reviewNote: 'Complete 18-scene illustrated research story with transcript-matched AI narration, source and claim records, dedicated TBC-area art, distinct principal cast, and pivotal key, journal, bone and urn illustrations. The Master’s Key and Nightbane quest chains are separate and joined editorially at Karazhan; historical travel through the Black Morass and journal memories are explicitly labeled. Target evidence: The Burning Crusade original 2.0.3–2.4.3 quest era, before Wrath-era changes; current accessible references include Blizzard’s TBC Classic overview and secondary reproductions. Original-client/build and exact quest-dialogue capture, chronology, Atiesh scene/model comparison, area-resemblance review, source approval, and narration audition remain open. No Legion Return to Karazhan or later character outcomes are included.',
  contentStatus: 'research',
};
await write(`data/storylines/${storyId}.research.json`, storyline);

const eraPath = path.join(root, `data/eras/${eraId}.research.json`);
const era = JSON.parse(await readFile(eraPath, 'utf8'));
era.sourceIds = [...new Set([...era.sourceIds, ...allSourceIds])];
await write(`data/eras/${eraId}.research.json`, era);

const sourceReferenceUrl = 'https://www.wowhead.com/tbc/zone=3457/karazhan';
const allAssets = [];
for (const environment of environments) {
  const file = `${artDirectory}/${environment.id}.research.webp`;
  const [bytes, info] = await Promise.all([readFile(path.join(root, file)), stat(path.join(root, file))]);
  allAssets.push({
    id: environment.id,
    kind: 'environment',
    file,
    area: environment.name,
    pixelWidth: 768,
    pixelHeight: 512,
    sourceArtifact: environment.artifact,
    sourceTile: environment.tile,
    targetEditionBuild: 'World of Warcraft: The Burning Crusade original quest era, patches 2.0.3–2.4.3; exact reference-client build comparison remains open.',
    recognizableTraits: environment.traits,
    visualReference: { editionBuild: 'The Burning Crusade 2.0.3–2.4.3 in-game zone and instance presentation', locator: sourceReferenceUrl, comparisonCapture: 'Not captured; human side-by-side in-game resemblance review remains open.' },
    generationPrompt: `Original painterly environment illustration for ${environment.name}. Preserve these Burning Crusade-era traits: ${environment.traits} No UI, text or copied screenshot. This tile was cropped from an OpenAI ImageGen contact sheet.`,
    generator: 'OpenAI ImageGen; original 2x2 landscape contact sheet tile cropped and converted to WebP with alpha-safe FFmpeg workflow.',
    transparency: false,
    visualReview: 'Prompt and generated image checked for its recorded area palette and skyline; no exact in-client resemblance capture is claimed. Human comparison to the intended Burning Crusade area/build remains open.',
    ...assetFileMetadata(environment.id, bytes, info),
  });
}
for (const person of cast) {
  const file = `${artDirectory}/${person.asset}.research.webp`;
  const [bytes, info] = await Promise.all([readFile(path.join(root, file)), stat(path.join(root, file))]);
  allAssets.push({
    id: person.id,
    kind: person.type,
    file,
    representedBy: person.name,
    sourceArtifact: person.artifact,
    sourceTile: person.tile,
    targetEditionBuild: 'Burning Crusade quest-era identity; exact client appearance/build comparison remains open.',
    generationPrompt: person.id === 'medivh'
      ? 'Focused edit of the original transparent Medivh portrait. Preserve the character, face, hair, robes, pose, lighting, framing and transparent background. Replace only the staff with Atiesh: show its entire dark gnarled wooden shaft from the raven carving to the iron-shod base; integrate a clear seated raven carving at the top with rounded head, hooked beak, folded wings and body; add a small violet eye or stone and the mage version’s narrow hanging crimson-red streamer. Keep the staff held naturally in Medivh’s existing hand. No oversized crystals, floating orbs, elaborate filigree, text or scenery; original interpretation, not canonical game art.'
      : `Original isolated interpretation of ${person.name}: ${person.description} Preserve a distinctive readable silhouette, no text, no frame; not canonical game art.`,
    generator: person.id === 'medivh'
      ? 'OpenAI ImageGen; focused staff edit of a transparent portrait cutout, converted to alpha-capable WebP.'
      : 'OpenAI ImageGen; transparent figure contact-sheet cell cropped and converted to alpha-capable WebP.',
    transparency: true,
    visualReview: person.id === 'medivh'
      ? 'Atiesh reads at portrait scale as a complete staff held in Medivh’s hand: a dark gnarled wooden shaft with iron-shod base and an integrated seated raven carving whose head, hooked beak, folded wings and body form one clear silhouette, with a small violet eye or stone and the mage version’s red streamer. The Karazhan story uses an era-specific 2.0 figure scale so the staff remains legible on phone and desktop. User-directed interpretation; compare to the intended TBC client item/model before approval.'
      : 'Distinct silhouette checked in the authored scene. Exact in-client model and costume comparison remains a human review gate.',
    sourceReferences: [...new Set(beats.filter((beat) => beat.cast.includes(person.id)).flatMap((beat) => beat.sources))].map((sourceId) => ({ sourceId, url: sourceUrlById.get(sourceId) })),
    ...assetFileMetadata(person.id, bytes, info),
  });
}
for (const artifact of artifacts) {
  const file = `${artDirectory}/${artifact.id}.research.webp`;
  const [bytes, info] = await Promise.all([readFile(path.join(root, file)), stat(path.join(root, file))]);
  allAssets.push({
    id: artifact.id,
    kind: 'artifact',
    file,
    representedBy: artifact.name,
    sourceArtifact: artifact.id === 'masters-key' ? 'exec-f29b841c-7e2f-4c84-9fb6-6147a9bd294c.png' : 'exec-ffd02175-ed23-47dd-a101-750d061bfc4a.png',
    sourceTile: ['masters-key'].includes(artifact.id) ? 'edited, isolated tile based on top-left object' : `contact-sheet tile ${artifact.tile}`,
    targetEditionBuild: 'Burning Crusade quest-era object; exact appearance/build comparison remains open.',
    generationPrompt: `Original isolated object illustration: ${artifact.description} No readable writing or text; interpretive, not canonical game art.`,
    generator: artifact.id === 'masters-key'
      ? 'OpenAI ImageGen edit to remove isolated color artifacts, then alpha-capable WebP conversion.'
      : 'OpenAI ImageGen; transparent object contact-sheet tile cropped and converted to alpha-capable WebP.',
    transparency: true,
    visualReview: 'Object role and silhouette checked against the authored scene. Exact in-client model comparison remains a human review gate.',
    sourceReferences: [...new Set(beats.filter((beat) => beat.objects.includes(artifact.id)).flatMap((beat) => beat.sources))].map((sourceId) => ({ sourceId, url: sourceUrlById.get(sourceId) })),
    ...assetFileMetadata(artifact.id, bytes, info),
  });
}

const sceneLedger = beats.map((beat, index) => {
  const environment = environments.find((scene) => scene.id === beat.environment);
  return {
    nodeId: nodes[index].id,
    title: beat.title,
    environmentPath: `${artDirectory}/${beat.environment}.research.webp`,
    gameArea: environment.name,
    recognizableTraits: environment.traits,
    referenceEditionBuild: 'The Burning Crusade original quest era, patch 2.0.3–2.4.3; no in-client capture claimed.',
    cast: beat.cast.map((id) => ({ id, name: nameByEntityId.get(id), image: `images/storylines/karazhan/${cast.find((item) => item.id === id)?.asset ?? id}.research.webp` })),
    artifacts: beat.objects.map((id) => ({ id, image: `images/storylines/karazhan/${id}.research.webp` })),
    visualActions: ['set_map_state', 'show contextual illustrated cast and objects'],
    chronologyNote: beat.temporal
      ? 'Explicit time-travel or journal memory. It is not a present-day route or contemporary event.'
      : beat.editorialJoin
        ? 'Explicit editorial join: the key and Nightbane chains are distinct quest paths; no causal or prerequisite edge is asserted.'
        : 'Quest order is retained where the source states a chain. Separate destination scenes do not imply an unsourced travel route.',
    visualReview: 'Generated image and area-specific palette checked. In-game side-by-side comparison with the matching TBC build remains open.',
    claimIds: [`${storyId}-${beat.id}-claim`],
  };
});

await write('docs/research/karazhan-visual-assets.json', {
  storyId,
  status: 'research',
  targetEditionBuild: 'World of Warcraft: The Burning Crusade, original quest era patch 2.0.3 through 2.4.3, before Wrath of the Lich King changes. Exact reference build capture remains open.',
  editorialRule: 'Match the named TBC game areas by their recognizable architecture, material palette, terrain, skyline and landmark forms while using original compositions. Record the reference and keep the in-game resemblance review explicitly open until a human compares each image with the matching client/build.',
  assetProvenance: 'Original illustrations created with built-in OpenAI ImageGen. Four 2x2 environment contact sheets were cropped into distinct landscape assets. Character and object assets are transparent cutouts; Arcanagos and Nightbane have separate single-subject dragon art. Medivh’s portrait received a focused staff edit so Atiesh has an integrated seated-raven carving, dark gnarled shaft, violet eye detail and the mage version’s red hanging streamer. All art is interpretive, not canonical game art or source evidence.',
  assetRecords: allAssets,
  sceneLedger,
});

const allWords = nodes.reduce((sum, node) => sum + node.narration.split(/\s+/).length, 0);
let production = '# Karazhan: The Master’s Key and Nightbane — production and claim ledger\n\n';
production += `Status: complete illustrated research story; not reviewed or published. ${nodes.length} scenes; ${allWords} narration words. Primary era: Era 8 / The Burning Crusade. The story ends at the Nightbane quest’s return of an essence sample to Alturus.\n\n`;
production += '## Evidence and source boundary\n\nThe Master’s Key path is supported by Blizzard’s TBC Classic chain overview and secondary reproductions of the TBC quest records. The Nightbane path is supported by secondary reproductions of the removed original TBC quests and their dialogue. These are locators and mirrors, not captures from a running original 2007 client. Every consequential narration beat has a Source, Citation and Claim record. No claim is promoted beyond research.\n\n';
production += `Sources: ${allSourceIds.map((id) => `[${id}](${sourceUrlById.get(id)})`).join('; ')}. The Atiesh depiction also uses [the item’s Classic visual locator](${sourceUrlById.get('karazhan-atiesh-visual-reference')}).\n\n`;
production += '## Distinct quest chains and editorial join\n\n**Master’s Key:** Arcane Disturbances and Restless Activity are parallel first inquiries → Contact from Dalaran → Khadgar → Entry Into Karazhan and the Shadow Labyrinth fragment → Second and Third Fragments in the Steamvault and Arcatraz → The Master’s Touch in a Black Morass time-memory → Return to Khadgar. The Second/Third quest gives an investigator’s explanation for the fragment now found in Coilfang Reservoir; the narration preserves that uncertainty.\n\n**Journal and Nightbane:** After a separate Violet Eye progression/standing gate, Alturus asks for Medivh’s Journal → the seeker finds Wravien, Gradav and Kamsis in the library → the Shade of Aran yields the Journal → the Master’s Terrace memory reveals Medivh and Arcanagos → Alturus proposes testing the dragon’s remains → Kalynna asks for two Heroic-dungeon tomes → Nightbane is raised from Arcanagos’s remains and defeated → the seeker returns an essence sample. The Karazhan link between these chains is editorial; this packet does not claim the journal chain is a quest prerequisite for restoring the key.\n\nThe Black Morass and journal sequence are historical scenes, not a physical route through present-day geography. Shattered Halls and Sethekk Halls are retained as named quest destinations, not narrated as independent historical episodes. No Keanna’s Log, Legion Return to Karazhan, later-nightmare content, or post-Wrath outcomes are added.\n\n';
production += '## Scene and claim ledger\n\n| Scene | Quest locator | Cast and objects | Area reference and visual traits | Time/geography note | Claim |\n| --- | --- | --- | --- | --- | --- |\n';
for (const beat of beats) {
  const env = environments.find((scene) => scene.id === beat.environment);
  const castNames = [...beat.cast, ...beat.objects].map((id) => nameByEntityId.get(id) ?? artifacts.find((item) => item.id === id)?.name ?? id).join(', ');
  const timeNote = beat.temporal ? 'Historical memory; no present-day route' : beat.editorialJoin ? 'Editorial link only' : 'TBC quest order; no inferred travel path';
  production += `| ${beat.title} | ${beat.quests.join('; ')} | ${castNames} | ${env.name}: ${env.traits} | ${timeNote} | ${storyId}-${beat.id}-claim |\n`;
}
production += '\n## Visual, audio and review notes\n\nEvery node loads a dedicated environment illustration and each named principal, group and pivotal object has a repository-backed representation. Environment, cast, object and scene paths, generated prompts, hashes, TBC build target, recognizable traits and review gates are in [karazhan-visual-assets.json](karazhan-visual-assets.json). Medivh’s story portrait now shows Atiesh as a gnarled staff with an integrated carved raven-head finial, violet crystal accents and a hanging streamer. Art resemblance is not human-approved until compared with in-game screenshots from the chosen TBC build.\n\nThe story uses the existing Storyline → StoryGuide → StoryTour path; it is not inserted into EraTour. The Karazhan placard is anchored editorially at Deadwind Pass and linked to the Eastern Kingdoms and Outland regions; the marker is not exact geography. Play All places this guide after the three completed Classic stories and before the Outland research preview.\n\nRemaining human gates: original-client quest/build capture and dialogue comparison; source and claim review; exact TBC chronology; in-game area and model resemblance review (including Atiesh); and voice pronunciation/audition.\n';
await write('docs/research/karazhan-production.md', production);

let researchPacket = `# Karazhan: The Master’s Key and Nightbane\n\nStatus: research.\n\n## Candidate and scope\n\n- Candidate ID / slug: \`${storyId}\`\n- Primary era / subperiod: Era 8, The Age of Adventurers / original The Burning Crusade quest era.\n- Linked prologue eras: none. The Black Morass scene is a historical time-memory within a TBC quest, not a linked prologue itinerary.\n- Historical ending and excluded later material: return Nightbane’s essence sample to Alturus. Excludes Keanna’s Log, Legion’s Return to Karazhan (7.1), and outcomes after Wrath.\n- Edition, patch/build and faction/class variants: target original TBC quest state, patch 2.0.3 through 2.4.3; both factions may take the key line. The present guide documents original-client capture as an open gate.\n- Existing records and overlap: reuses Era 8, existing Medivh, StoryGuide/StoryTour engine, story theater renderer, voice manifest and the Classic-to-Wrath tour. Does not retell the separate Karazhan access quest in another candidate or add content to EraTour.\n- Visual reference edition/build: TBC era 2.0.3–2.4.3 area identity. Deadwind Pass/Karazhan, the original Dalaran crater, Shattrath, three Outland dungeons, Black Morass memory, Karazhan library/terrace, Area 52, Shattered Halls and Sethekk Halls each have recorded traits in the [visual asset ledger](karazhan-visual-assets.json). In-game comparison remains open.\n\n## Historical question and evidence\n\n**Question:** Can the Violet Eye reopen Karazhan and learn what the tower’s remembered past—and the remains of Arcanagos—may reveal about Medivh’s power?\n\nThe two quest paths are distinct. The Master’s Key attunement solves an access problem. The Nightbane chain is a later Violet Eye research operation that uses Medivh’s Journal, Kalynna’s expertise and Arcanagos’s remains. The story explicitly marks their connection as editorial. Alturus’s reading of a faint demonic echo, Khadgar’s account of moved fragments and Alturus’s theory about Medivh’s essence remain attributed rather than presented as omniscient fact.\n\nPrimary sources presently available: Blizzard’s official TBC Classic attunement overview. The detailed quest dialogue and chain order come from secondary quest/wiki mirrors listed in the [production ledger](karazhan-production.md). Original TBC client capture, the complete released journal interaction and direct source review are still required for promotion.\n\n## Inciting problem, turning points and resolution\n\nAlturus’s paired investigations produce a troubling report → Cedric locates Khadgar → Khadgar explains and recovers his three-part key → Medivh enables it in the Black Morass past → Khadgar receives it back. In a separate path, Alturus seeks the journal → three Violet Eye agents point the seeker toward the Shade of Aran → the Master’s Terrace memory shows Arcanagos’s burning flight → Alturus’s hypothesis leads to a bone fragment and Kalynna → two books satisfy her request → Nightbane is raised and defeated → Alturus receives an essence sample. The TBC quest ends on research, not a final explanation.\n\n## Proposed chapters and runtime\n\n${chapters.map((chapter) => `- **${chapter.title}:** ${chapter.body}`).join('\n')}\n\n${nodes.length} nodes; ${allWords} transcript words before voice timing. The modestly expanded node count reflects two independently gated quest paths, three geographically distinct fragment dungeons, a time-memory, a journal memory and the heroic-dungeon request; it does not narrate farming or collection quotas as history.\n\n## Engine, assets and review\n\nContent work only. Existing static Vite/React, LoreRepository, Zod, Storyline, StoryGuide and StoryTour contracts cover the experience. No architectural decision or reusable engine prerequisite was needed.\n\nHuman review needed: TBC client/build and quest text; journal/Nightbane original release evidence; precise chronology and the editorial join; Atiesh’s appearance and time-state; area resemblance for each illustration; source and claim approval; narration pronunciation; and audio audition. No record is marked reviewed or published.\n`;
await write('docs/research/karazhan-masters-key-and-nightbane-research.md', researchPacket);

const tourPath = path.join(root, 'data/story-tours/classic-to-wrath.research.json');
const tour = JSON.parse(await readFile(tourPath, 'utf8'));
const previousEntry = tour.entries.find((item) => item.storylineId === storyId);
const entry = {
  ...(previousEntry ?? {}),
  storylineId: storyId,
  regionIds: ['eastern-kingdoms', 'outland'],
  mapPositionPercent: previousEntry?.mapPositionPercent ?? [77, 66],
  order: previousEntry?.order ?? 6,
  periodLabel: 'The Burning Crusade · Karazhan',
  locationLabel: 'Deadwind Pass · key fragments across Outland',
};
if (previousEntry) {
  tour.entries = tour.entries.map((item) => item.storylineId === storyId ? entry : item);
} else {
  tour.entries = [...tour.entries, entry].sort((a, b) => a.order - b.order);
}
tour.chronologyNote ??= 'Play-all order is an editorial expansion-era sequence; order organizes access and does not claim that the selected storylines caused one another.';
tour.reviewNote ??= 'Original-client quest/build, chronology, map art and matching in-game location/model resemblance review remain open for human approval.';
await write('data/story-tours/classic-to-wrath.research.json', tour);

const candidatesPath = path.join(root, 'docs/research/questline-story-candidates.md');
let candidates = await readFile(candidatesPath, 'utf8');
const sectionMatch = candidates.match(/### 12\. Karazhan: the Master's Key and Nightbane[\s\S]*?(?=\n### 13\. Akama and the Black Temple)/);
if (!sectionMatch) throw new Error('Could not locate Karazhan candidate section #12.');
const cleanSection = sectionMatch[0].replace(/\n*\*\*Implementation:\*\*[\s\S]*$/, '');
const implementationNote = '\n\n**Implementation:** Complete 18-scene illustrated research story with transcript-matched AI narration, claim/source ledger, named cast and object art (including Medivh with Atiesh), and the Karazhan marker in the Classic-to-Wrath StoryTour. The Master’s Key and Nightbane quest chains remain distinct with an explicit editorial join. Original-client evidence, human lore review, TBC area/model resemblance review and audio audition remain open. See the [production ledger](karazhan-production.md), [research packet](karazhan-masters-key-and-nightbane-research.md), and [visual asset ledger](karazhan-visual-assets.json).';
candidates = candidates.replace(sectionMatch[0], `${cleanSection.trimEnd()}${implementationNote}`);
await write('docs/research/questline-story-candidates.md', candidates);

const implementationPlanPath = path.join(root, 'docs/IMPLEMENTATION_PLAN.md');
let implementationPlan = await readFile(implementationPlanPath, 'utf8');
const priorTourStatement = 'The Dragon in Stormwind, Scepter of the Shifting Sands, and Dungeon Set 2: The Veiled Blade and Lord Valthalak are its three playable Classic stories; the Outland Cipher of Damnation and Northrend Wrathgate remain research previews.';
const updatedTourStatement = 'The Dragon in Stormwind, Scepter of the Shifting Sands, Dungeon Set 2: The Veiled Blade and Lord Valthalak, and Karazhan: The Master’s Key and Nightbane are its four playable stories; the Outland Cipher of Damnation and Northrend Wrathgate remain research previews.';
if (implementationPlan.includes(priorTourStatement)) {
  implementationPlan = implementationPlan.replace(priorTourStatement, updatedTourStatement);
}
await write('docs/IMPLEMENTATION_PLAN.md', implementationPlan);

process.stdout.write(`Authored ${nodes.length} Karazhan story nodes, ${allCastIds.length} cast/group figures, ${allArtifactIds.length} pivotal objects, ${environments.length} environments, and ${allSourceIds.length} evidence sources.\n`);
