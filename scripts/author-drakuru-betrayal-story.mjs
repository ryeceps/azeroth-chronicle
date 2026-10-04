import { createHash } from 'node:crypto';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import ffmpegPath from 'ffmpeg-static';
import process from 'node:process';

const root = process.cwd();
const generatedRoot = 'C:/Users/leroy/.codex/generated_images/01a0f500-e320-79e0-a38a-90086c592677';
const storyId = 'drakuru-betrayal';
const guideId = `${storyId}-guide`;
const worldspaceId = `${storyId}-theater`;
const eraId = 'age-of-adventurers';
const artRoot = `images/storylines/${storyId}`;
const researchStatus = 'research';

const write = async (file, value) => {
  const target = path.join(root, file);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, `${JSON.stringify(value, null, 2)}\n`);
};

const sourceSpecs = [
  ['truce', 'Truce?', 'https://warcraft.wiki.gg/wiki/Truce%3F', 'Quest text and scene: Drakuru is held at Granite Springs, offers a temporary truce, and makes a blood pact.'],
  ['vial-of-visions', 'Vial of Visions', 'https://warcraft.wiki.gg/wiki/Vial_of_Visions', 'Quest text: the ingredients and potion establish communication with Drakuru’s image.'],
  ['subject-to-interpretation', 'Subject to Interpretation', 'https://warcraft.wiki.gg/wiki/Subject_to_Interpretation', 'Quest text: Drakuru claims ancient artifacts made Drak’Tharon Keep impervious and directs the seeker to the ruins of Drak’Zin.'],
  ['sacrifices-must-be-made', 'Sacrifices Must be Made', 'https://warcraft.wiki.gg/wiki/Sacrifices_Must_be_Made', 'Quest text: the Eye of the Prophets is taken from the Zeb’Halak idol; Drakuru describes Zim’bo’s oath and death.'],
  ['warlord-zimbo', 'Warlord Zim’bo · Wrath NPC locator', 'https://warcraft.wiki.gg/wiki/Warlord_Zim%27bo', 'Secondary Wrath NPC locator for Zim’bo as an ice troll warlord at Zim’bo’s Hideout in Zeb’Halak. The original 3.3.5a model remains to be compared.'],
  ['heart-of-the-ancients', 'Heart of the Ancients', 'https://warcraft.wiki.gg/wiki/Heart_of_the_Ancients_(quest)', 'Quest locator: the Heart of the Ancients is found at Blue Sky Logging Grounds.'],
  ['my-heart-is-in-your-hands', 'My Heart is in Your Hands', 'https://warcraft.wiki.gg/wiki/My_Heart_is_in_Your_Hands', 'Quest text: Drakuru says the Eye let him watch, asks for the Heart at Drak’atal Passage, and again promises to cleanse the Keep.'],
  ['voices-from-the-dust', 'Voices From the Dust', 'https://warcraft.wiki.gg/wiki/Voices_From_the_Dust', 'Quest text: Drakkari tablets lie in the crypt at Drakil’jin; Drakuru uses the Eye and Heart to read them.'],
  ['cleansing-draktharon', 'Cleansing Drak’Tharon', 'https://warcraft.wiki.gg/wiki/Cleansing_Drak%27Tharon', 'Quest objective and scripted scene: at the Keep, Drakuru reveals his service to the Lich King, receives a transformation and a new command.'],
  ['orders-from-drakuru', 'Orders From Drakuru', 'https://warcraft.wiki.gg/wiki/Orders_From_Drakuru_(quest)', 'The readable orders state the Lich King gave Drakuru control of Zul’Drak’s Scourge forces and describe corpse processing, blight and intended targets.'],
  ['the-ebon-watch', 'The Ebon Watch', 'https://warcraft.wiki.gg/wiki/The_Ebon_Watch', 'Quest text: Stefan Vadu says the Ebon Blade has tracked Drakuru since Grizzly Hills.'],
  ['reunited', 'Reunited', 'https://warcraft.wiki.gg/wiki/Reunited', 'Quest text: returning through Drakuru’s earlier chain uses Reunited; Gorebag’s tour takes the traveler through Zul’Drak.'],
  ['dark-horizon', 'Dark Horizon', 'https://warcraft.wiki.gg/wiki/Dark_Horizon', 'Alternate start for travelers who did not complete the earlier Grizzly Hills and Drak’Tharon sequence.'],
  ['infiltrating-voltarus', 'Infiltrating Voltarus', 'https://warcraft.wiki.gg/wiki/Infiltrating_Voltarus', 'Quest chain locator and text: an ensorcelled choker enables the Voltarus infiltration; alliance and horde follow-ups differ.'],
  ['so-far-so-bad', 'So Far, So Bad', 'https://warcraft.wiki.gg/wiki/So_Far,_So_Bad', 'Quest text and progression: the infiltrator advances within Voltarus while reporting to Stefan.'],
  ['hazardous-materials', 'Hazardous Materials', 'https://warcraft.wiki.gg/wiki/Hazardous_Materials_(quest)', 'Quest text: Stefan asks the infiltrator to continue Drakuru’s assignments and secretly take blight-crystal samples.'],
  ['sabotage', 'Sabotage', 'https://warcraft.wiki.gg/wiki/Sabotage_(quest)', 'Quest progression: an infiltration mission against Drakuru’s Voltarus operation.'],
  ['fuel-for-the-fire', 'Fuel for the Fire', 'https://warcraft.wiki.gg/wiki/Fuel_for_the_Fire_(quest)', 'Quest text and progression: the operation prepares access to Drakuru’s disclosure; gameplay control instructions are excluded from narration.'],
  ['disclosure', 'Disclosure', 'https://warcraft.wiki.gg/wiki/Disclosure', 'Quest text: Drakuru reveals his plan to seize Gundrak and gives the Scepter of Domination as a token of trust.'],
  ['betrayal', 'Betrayal', 'https://warcraft.wiki.gg/wiki/Betrayal', 'Scripted finale: Drakuru summons Blightblood Trolls, the disguise fails, the scepter turns the trolls against him, and the Lich King kills Drakuru while sparing the infiltrator.'],
  ['overlord-drakuru', 'Overlord Drakuru', 'https://warcraft.wiki.gg/wiki/Overlord_Drakuru', 'Secondary overview joining the two quest arcs and summarizing the captured chieftains, blight infusion, infiltration and ending.'],
  ['guru-of-drakuru', 'Guru of Drakuru quest-chain locator', 'https://warcraft.wiki.gg/wiki/Guru_of_Drakuru', 'Secondary ordered locator for the Grizzly Hills and Zul’Drak arcs, including alternate faction and prior-chain starts.'],
  ['blizzard-grizzly-hills', 'Wrath Classic Zone Guide: Dragonblight and Grizzly Hills', 'https://news.blizzard.com/en-us/article/23840668/wrath-classic-zone-guide-dragonblight-and-grizzly-hills', 'Blizzard’s official Wrath Classic area reference: the region’s chilly cedar forest, Blue Sky Logging Grounds and Drak’Tharon Keep.'],
  ['blizzard-zuldrak', 'Wrath Classic Zone Guide: Zul’Drak and Sholazar Basin', 'https://news.blizzard.com/en-us/article/23846691/wrath-classic-zone-guide-zuldrak-and-sholazar-basin', 'Blizzard’s official Wrath Classic area reference: the Drakkari, the Scourge-blighted south, northern ice, Ebon Watch and Drak’Tharon.'],
  ['draktharon-area', 'Drak’Tharon Keep · Wrath area and dungeon locator', 'https://warcraft.wiki.gg/wiki/Drak%27Tharon_Keep', 'Secondary area locator for the carved Drakkari stronghold and its 2008 Scourge state. Original-client screenshot comparison remains open.'],
  ['voltarus-area', 'Voltarus · Zul’Drak area locator', 'https://warcraft.wiki.gg/wiki/Voltarus', 'Secondary locator for Drakuru’s floating Scourge necropolis in Zul’Drak. Exact build comparison remains open.'],
];

const sources = sourceSpecs.map(([key, title, url, evidence]) => ({
  id: `${storyId}-${key}`,
  title,
  url,
  sourceType: key.startsWith('blizzard-') || key.endsWith('-area') || ['guru-of-drakuru', 'overlord-drakuru', 'warlord-zimbo'].includes(key) ? 'website' : 'quest',
  notes: key.startsWith('blizzard-')
    ? `Accessed 2026-10-03. Official Blizzard visual and area reference, not a source for Drakuru quest dialogue. ${evidence}`
    : `Accessed 2026-10-03. Secondary quest/wiki locator or text mirror, not original-client capture. ${evidence} Compare the quest text, variant and appearance to the intended Wrath 3.3.5a build before human review.`,
}));
for (const source of sources) await write(`data/sources/${source.id}.research.json`, source);
const sourceId = (key) => `${storyId}-${key}`;

const environments = [
  { id: 'granite-springs', name: 'Granite Springs', area: 'Granite Springs, Grizzly Hills', sourceArtifact: 'exec-cccedd05-6725-4855-b5a8-64d00648203b.png', traits: 'Wrath Grizzly Hills: giant rust-red and copper cedar trunks, dark conifers, moss, brown forest floor, spring water and a rough lumber-camp palisade; no snow-covered high-alpine scenery.', ref: ['blizzard-grizzly-hills', 'truce'], prompt: 'Wide 3:2 original painterly environment for the 2008 Wrath of the Lich King version of Granite Springs in Grizzly Hills. Preserve its red-brown cedar forest, dark conifers, moss, small spring and stream, and rough wooden camp. No characters, no snow, no lettering, no UI, no copied screenshot.' },
  { id: 'drakzin-ruins', name: 'Ruins of Drak’Zin', area: 'Ruins of Drak’Zin, Grizzly Hills', sourceArtifact: 'exec-99444060-9613-4012-8490-6f13630764d3.png', traits: 'Overgrown Drakkari stone terraces and carved tusked faces beside cold water, enclosed by red cedar and dark conifers; Grizzly Hills forest palette rather than Zul’Drak’s open frozen plateau.', ref: ['subject-to-interpretation', 'blizzard-grizzly-hills'], prompt: 'Original painterly Drak’Zin troll ruins landscape with carved Drakkari faces, water and Grizzly Hills cedar forest; no text, no copied screenshot.' },
  { id: 'zebhalak-ziggurat', name: 'Zeb’Halak', area: 'Zeb’Halak, Grizzly Hills', sourceArtifact: 'exec-9d0afffa-520c-4590-afa9-2ce556a62789.png', traits: 'A single stepped grey-green Drakkari ziggurat on a forested rocky rise, with tusked guardian carvings and an idol whose ruby eye is missing; surrounded by rust-red cedar and dark spruce, not a snowfield.', ref: ['sacrifices-must-be-made', 'blizzard-grizzly-hills'], prompt: 'Original painterly Zeb’Halak landscape with a stepped troll ziggurat, guardian faces, brazier and idol socket among Grizzly Hills cedar; no characters or copied screenshot.' },
  { id: 'blue-sky-logging-grounds', name: 'Blue Sky Logging Grounds', area: 'Blue Sky Logging Grounds, Grizzly Hills', sourceArtifact: 'exec-d9980580-426a-4080-9452-3eaf34ad9e50.png', traits: 'Grizzly Hills redwood forest, fast clear water, stacked timber, hand-built lumber platforms and the region’s log ride; autumn forest, no frost.', ref: ['heart-of-the-ancients', 'blizzard-grizzly-hills'], prompt: 'Original painterly Blue Sky Logging Grounds with cedar trunks, a logging station, stacked logs and river flume amid Grizzly Hills forest; no characters or copied screenshot.' },
  { id: 'drakiljin-crypt', name: 'Ruins of Drakil’jin', area: 'Ruins of Drakil’jin, Grizzly Hills', sourceArtifact: 'exec-daa63d36-8cce-4b5b-8db9-2606daea0555.png', traits: 'Low, sprawling Drakkari burial crypts of weathered grey stone with carved tusked faces, roots and moss, enclosed by tall rust-red cedars; distinct from the high Zeb’Halak ziggurat.', ref: ['voices-from-the-dust', 'blizzard-grizzly-hills'], prompt: 'Original painterly Drakil’jin burial complex in redwood Grizzly Hills, low crypt chambers, dark doorway, tusked carvings and a broken tablet; no characters or copied screenshot.' },
  { id: 'draktharon-keep', name: 'Drak’Tharon Keep', area: 'Drak’Tharon Keep, border of Grizzly Hills and Zul’Drak', sourceArtifact: 'exec-d4c8955a-7799-4d04-bd01-d4c970fb5fc2.png', traits: 'The Wrath-era carved Drakkari stronghold at the border: monumental dark stone, tusked troll faces, ascending ceremonial stairs, cold blue snow-light and restrained violet ritual fire. This is a broad interior impression, not the dungeon’s floor plan.', ref: ['cleansing-draktharon', 'draktharon-area', 'blizzard-zuldrak'], prompt: 'Original painterly Drak’Tharon Keep ritual chamber, heavy dark Drakkari stone, carved faces, steps, cold blue snow-light and violet brazier glow; no text or copied screenshot.' },
  { id: 'zuldrak-dead-fields', name: 'The Dead Fields', area: 'Dead Fields, Zul’Drak', sourceArtifact: 'exec-5f931554-7846-4b54-8225-c78fce48e8fd.png', traits: 'Zul’Drak’s harsh, Scourge-struck southern plain: exposed snow and ice, desaturated ground, ruined Drakkari stone markers, dead vegetation and distant stepped trolls structures. Keep the green blight subtle and localized.', ref: ['orders-from-drakuru', 'reunited', 'blizzard-zuldrak'], prompt: 'Original painterly Dead Fields on Zul’Drak plateau, snow, ice, ruined Drakkari markers and distant necropolis, cold grey-blue light; no text or copied screenshot.' },
  { id: 'ebon-watch', name: 'Ebon Watch', area: 'Ebon Watch, Zul’Drak', sourceArtifact: 'exec-89a39f78-3f4b-416d-94c8-de6284a152dc.png', traits: 'Small Knights of the Ebon Blade encampment in western Zul’Drak: dark stone defenses, black armor, muted red-black standards, campfires against the icy Drakkari plateau; keep any distant Argent color contextual, not a shared command.', ref: ['the-ebon-watch', 'blizzard-zuldrak'], prompt: 'Original painterly Ebon Watch encampment, black stone and black-red Ebon Blade standards in snowy Zul’Drak; no text or copied screenshot.' },
  { id: 'voltarus', name: 'Voltarus', area: 'Voltarus necropolis, Zul’Drak', sourceArtifact: 'exec-d2393020-2eab-4917-8911-e75cef7a1988.png', traits: 'A floating Scourge necropolis over Zul’Drak’s frozen ravines and toxic green pools, with dark iron buttresses, green blight light and snowbound Drakkari stone below.', ref: ['infiltrating-voltarus', 'voltarus-area', 'blizzard-zuldrak'], prompt: 'Original painterly floating Scourge necropolis over icy Zul’Drak, dark stone and iron, green blight, ravines; no text or copied screenshot.' },
  { id: 'voltarus-summit', name: 'The summit of Voltarus', area: 'Upper platform of Voltarus, Zul’Drak', sourceArtifact: 'exec-d04e0294-ef3c-48ee-be84-e09f1f381686.png', traits: 'An interpretive view of an elevated, round ritual platform with radial stairs and green-lit pylons above snowy ravines; the quest dialogue confirms the circular summit staging, but this is not an exact architectural reconstruction.', ref: ['betrayal', 'voltarus-area', 'blizzard-zuldrak'], prompt: 'Original painterly circular Voltarus summit platform with radial stairs and green blight above Zul’Drak; interpretive, no text or copied screenshot.' },
];
const actors = [
  { id: 'drakuru', name: 'Drakuru', kind: 'character', file: 'drakuru-captive.research.webp', sourceArtifact: 'exec-55d2d90a-b028-47ce-b21a-d8491a317500.png', ref: ['truce', 'overlord-drakuru'], prompt: 'Original transparent full-body ice troll captive, chain cuffs, dark braided hair, pale blue-grey skin, fur and leather, no weapon; original interpretive portrait.' },
  { id: 'warlord-zimbo', name: 'Warlord Zim’bo', kind: 'character', file: 'warlord-zimbo.research.webp', sourceArtifact: 'exec-c4d31b53-c9cf-4f40-82ae-1ebbadaf7a0e.png', ref: ['sacrifices-must-be-made', 'warlord-zimbo'], prompt: 'Original transparent full-body Drakkari ice troll defender and warlord, slate-blue skin, long tusks, dark braids, fur and carved-stone armor. Do not copy a canonical model.' },
  { id: 'overlord-drakuru', name: 'Drakuru after the Lich King’s gift', kind: 'character', file: 'drakuru-empowered.research.webp', sourceArtifact: 'exec-3605ec20-df39-45b7-b19a-908a520cb8a5.png', ref: ['cleansing-draktharon', 'overlord-drakuru'], prompt: 'Original transparent full-body portrait of the same Drakkari troll after the Lich King transforms him: larger, darker-blue skin, ice-blue eyes, heavy Scourge armor. The appearance-state record is not a second individual.' },
  { id: 'stefan-vadu', name: 'Stefan Vadu', kind: 'character', file: 'stefan-vadu.research.webp', sourceArtifact: 'exec-16b1e261-43b5-4783-9208-cda5d59ed9ee.png', ref: ['the-ebon-watch', 'infiltrating-voltarus'], prompt: 'Original transparent portrait of an adult male Ebon Blade death knight in dark iron armor, black scarf and muted deep-red cloak, no pose copied from game art.' },
  { id: 'blightblood-trolls', name: 'Blightblood Trolls', kind: 'faction', file: 'blightblood-trolls.research.webp', sourceArtifact: 'exec-a5a70c2b-18a4-45b9-9fca-aa801221d883.png', ref: ['betrayal', 'overlord-drakuru'], prompt: 'Original transparent ensemble of three distinct undead Drakkari dire trolls, tusks, fur and blight-infused green details; not individual canonical NPC likenesses.' },
  { id: 'eye-of-the-prophets', name: 'Eye of the Prophets', kind: 'artifact', file: 'eye-of-the-prophets.research.webp', sourceArtifact: 'exec-3718c378-6aee-4fc0-909b-bd09abd91296.png', ref: ['sacrifices-must-be-made', 'subject-to-interpretation'], prompt: 'Original transparent ruby-red faceted idol eye in a fragment of carved grey Drakkari stone; source text says ruby eyes, so it must not appear blue.' },
  { id: 'heart-of-the-ancients', name: 'Heart of the Ancients', kind: 'artifact', file: 'heart-of-the-ancients.research.webp', sourceArtifact: 'exec-7637cd5d-ef04-433d-8f18-4151727c9ed3.png', ref: ['heart-of-the-ancients', 'my-heart-is-in-your-hands'], prompt: 'Original transparent luminous angular blue-green ancient crystal, no extra setting or text.' },
  { id: 'scepter-of-domination', name: 'Scepter of Domination', kind: 'artifact', file: 'scepter-of-domination.research.webp', sourceArtifact: 'exec-1205d914-550a-4049-91e5-1005758d286b.png', ref: ['disclosure', 'betrayal'], prompt: 'Original interpretive long dark scepter with cold violet crystals and metal, no raven carving, no Atiesh silhouette, no red streamer. This is distinct from Atiesh and from the Scepter of the Shifting Sands.' },
];

const assetRefs = new Map(sources.map((source) => [source.id, source]));
const allVisuals = [...environments, ...actors];
const pixelSizes = {};
const assetRecords = [];
const convertImage = async (visual) => {
  const source = path.join(generatedRoot, visual.sourceArtifact);
  const target = path.join(root, 'public', artRoot, visual.id ? `${visual.id}.research.webp` : visual.file);
  const artName = visual.file ?? `${visual.id}.research.webp`;
  const finalTarget = visual.file ? path.join(root, 'public', artRoot, visual.file) : target;
  await mkdir(path.dirname(finalTarget), { recursive: true });
  const png = await readFile(source);
  if (png.toString('ascii', 1, 4) !== 'PNG') throw new Error(`Not a PNG: ${source}`);
  const width = png.readUInt32BE(16);
  const height = png.readUInt32BE(20);
  const alpha = png[25] === 4 || png[25] === 6;
  pixelSizes[visual.id] = [width, height];
  const maxDimension = width > height ? 1280 : 960;
  const scale = `scale='min(iw,${maxDimension})':'min(ih,${maxDimension})':force_original_aspect_ratio=decrease:force_divisible_by=2`;
  const args = ['-hide_banner', '-loglevel', 'error', '-y', '-i', source, '-vf', scale, '-frames:v', '1', '-c:v', 'libwebp', '-quality', '84', '-compression_level', '6', '-preset', 'picture', '-pix_fmt', alpha ? 'yuva420p' : 'yuv420p', finalTarget];
  await new Promise((resolve, reject) => {
    const child = spawn(ffmpegPath, args, { stdio: ['ignore', 'inherit', 'inherit'] });
    child.once('error', reject);
    child.once('exit', (code) => code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code} for ${artName}`)));
  });
  const bytes = await readFile(finalTarget);
  assetRecords.push({
    id: visual.id,
    kind: visual.kind ?? 'environment',
    file: `public/${artRoot}/${artName}`,
    area: visual.area ?? 'Interpretive character, group, or object portrait for the Drakuru research story',
    pixelWidth: width,
    pixelHeight: height,
    sourceArtifact: visual.sourceArtifact,
    targetEditionBuild: 'World of Warcraft: Wrath of the Lich King quest era, target reference 3.3.5a; exact client capture and comparison remain open.',
    recognizableTraits: visual.traits ?? visual.name,
    visualReference: {
      editionBuild: 'Wrath of the Lich King 3.3.5a area, character, or object identity',
      locator: (visual.ref ?? []).map((key) => assetRefs.get(sourceId(key))?.url).filter(Boolean),
      comparisonCapture: 'No original-client screenshot bundled; human side-by-side comparison against the matching 3.3.5a client remains open.',
    },
    generationPrompt: visual.prompt,
    generator: 'OpenAI ImageGen; original generated illustration converted to optimized WebP with FFmpeg. No game screenshot or source art is included.',
    transparency: alpha,
    visualReview: 'Inspected for the named area palette, landmark/material traits, prop color, silhouette and separation. This is interpretive art, not canonical game evidence; matching-client comparison remains a human review gate.',
    byteLength: bytes.length,
    sha256: createHash('sha256').update(bytes).digest('hex'),
  });
};
for (const visual of allVisuals) await convertImage(visual);

const environmentsById = new Map(environments.map((item) => [item.id, item]));
const sourceRef = (...keys) => [...new Set(keys.map(sourceId))];

const actorsData = [
  { id: 'drakuru', type: 'character', name: 'Drakuru', description: 'A Drakkari ice troll first encountered in chains at Granite Springs; his appeal for cooperation conceals service to the Lich King.', image: 'drakuru-captive.research.webp', sources: sourceRef('truce', 'overlord-drakuru', 'guru-of-drakuru'), scale: 0.88 },
  { id: 'warlord-zimbo', type: 'character', name: 'Warlord Zim’bo', description: 'An ice troll warlord at Zeb’Halak who defends Drak’Tharon and is killed for the mojo Drakuru demands.', image: 'warlord-zimbo.research.webp', sources: sourceRef('sacrifices-must-be-made', 'warlord-zimbo'), scale: 0.9 },
  { id: 'overlord-drakuru', type: 'character', name: 'Drakuru after the Lich King’s gift', description: 'The same individual as Drakuru, staged with the larger, darker appearance he receives when the Lich King empowers him at Drak’Tharon Keep. This presentation identity exists only to show a source-backed change in appearance, not to assert a second character.', image: 'drakuru-empowered.research.webp', sources: sourceRef('cleansing-draktharon', 'overlord-drakuru'), scale: 0.94 },
  { id: 'stefan-vadu', type: 'character', name: 'Stefan Vadu', description: 'An Ebon Blade death knight who commands the Ebon Watch and directs the counter-operation against Drakuru.', image: 'stefan-vadu.research.webp', sources: sourceRef('the-ebon-watch', 'infiltrating-voltarus'), scale: 0.9 },
  { id: 'blightblood-trolls', type: 'faction', name: 'Blightblood Trolls', description: 'Drakkari chieftains captured and infused with blight to form part of Drakuru’s Scourge army; shown as an interpretive ensemble.', image: 'blightblood-trolls.research.webp', sources: sourceRef('betrayal', 'overlord-drakuru'), scale: 0.96 },
  { id: 'eye-of-the-prophets', type: 'artifact', name: 'Eye of the Prophets', description: 'A ruby eye removed from an ancient idol at Zeb’Halak; depicted in the dialogue as a means by which Drakuru watches and reads.', image: 'eye-of-the-prophets.research.webp', sources: sourceRef('sacrifices-must-be-made', 'subject-to-interpretation', 'my-heart-is-in-your-hands', 'voices-from-the-dust'), scale: 0.62 },
  { id: 'heart-of-the-ancients', type: 'artifact', name: 'Heart of the Ancients', description: 'A pulsating gem found in an upper room of Blue Sky Logging Grounds and used with the Eye of the Prophets in Drakuru’s reading of the tablets.', image: 'heart-of-the-ancients.research.webp', sources: sourceRef('heart-of-the-ancients', 'my-heart-is-in-your-hands', 'voices-from-the-dust'), scale: 0.6 },
  { id: 'scepter-of-domination', type: 'artifact', name: 'Scepter of Domination', description: 'The scepter Drakuru gives the infiltrator as a token of trust; it turns the Blightblood Trolls against him during the final confrontation. It is a different artifact from Atiesh and the Scepter of the Shifting Sands.', image: 'scepter-of-domination.research.webp', sources: sourceRef('disclosure', 'betrayal'), scale: 0.74 },
];
const locations = [
  { id: 'granite-springs', name: 'Granite Springs', description: 'A Grizzly Hills settlement in the red cedar forest. Drakuru is held here when the story begins.', sources: sourceRef('truce', 'blizzard-grizzly-hills') },
  { id: 'drakzin-ruins', name: 'Ruins of Drak’Zin', description: 'A Drakkari ruin in Grizzly Hills where Drakuru directs the search for an artifact and interprets its carvings.', sources: sourceRef('subject-to-interpretation', 'blizzard-grizzly-hills') },
  { id: 'zebhalak', name: 'Zeb’Halak', description: 'A Drakkari ziggurat in Grizzly Hills where the Eye of the Prophets is removed from an idol.', sources: sourceRef('sacrifices-must-be-made', 'blizzard-grizzly-hills') },
  { id: 'blue-sky-logging-grounds', name: 'Blue Sky Logging Grounds', description: 'A lumber camp and river ride in Grizzly Hills, where the Heart of the Ancients is found.', sources: sourceRef('heart-of-the-ancients', 'blizzard-grizzly-hills') },
  { id: 'drakiljin-ruins', name: 'Ruins of Drakil’jin', description: 'An ancient Drakkari crypt in Grizzly Hills where the tablets used in Drakuru’s ritual are found.', sources: sourceRef('voices-from-the-dust', 'blizzard-grizzly-hills') },
  { id: 'drak-atal-passage', name: 'Drak’atal Passage', description: 'A passage through Drak’Tharon Keep where Drakuru asks the traveler to bring the Heart of the Ancients.', sources: sourceRef('my-heart-is-in-your-hands', 'blizzard-zuldrak') },
  { id: 'drak-tharon-keep', name: 'Drak’Tharon Keep', description: 'A carved Drakkari outpost on the border of Grizzly Hills and Zul’Drak, whose fall gives the Scourge a fortress within reach of the troll kingdom.', sources: sourceRef('cleansing-draktharon', 'draktharon-area', 'blizzard-grizzly-hills', 'blizzard-zuldrak') },
  { id: 'zul-drak-dead-fields', name: 'The Dead Fields', description: 'A Scourge-struck tract of southern Zul’Drak named in Drakuru’s orders as a source of corpses for his army.', sources: sourceRef('orders-from-drakuru', 'blizzard-zuldrak') },
  { id: 'ebon-watch', name: 'Ebon Watch', description: 'A small Knights of the Ebon Blade encampment in western Zul’Drak, commanded by Stefan Vadu.', sources: sourceRef('the-ebon-watch', 'blizzard-zuldrak') },
  { id: 'voltarus', name: 'Voltarus', description: 'A floating Scourge necropolis above Zul’Drak and Drakuru’s base of operations.', sources: sourceRef('reunited', 'infiltrating-voltarus', 'voltarus-area') },
];
for (const actor of actorsData) {
  await write(`data/entities/${actor.id}.research.json`, {
    id: actor.id,
    type: actor.type,
    name: actor.name,
    slug: actor.id,
    shortDescription: actor.description,
    body: `Original interpretive illustration, not canonical game art. See docs/research/drakuru-visual-assets.json for its scene use, source locator, appearance boundary, and open visual review.`,
    firstEraId: eraId,
    featuredEraIds: [eraId],
    sourceIds: actor.sources,
    tags: ['drakuru-story', 'interpretive-art'],
    ...(actor.type === 'character' ? { mapFigure: { asset: `${artRoot}/${actor.image}`, scale: actor.scale } } : { mapVisual: { asset: `${artRoot}/${actor.image}`, scale: actor.scale } }),
    contentStatus: researchStatus,
  });
}
for (const location of locations) await write(`data/entities/${location.id}.research.json`, {
  id: location.id,
  type: 'location',
  name: location.name,
  slug: location.id,
  shortDescription: location.description,
  body: `${location.description} The associated theater scenes are original interpretive paintings, not surveyed maps or exact instance layouts. See docs/research/drakuru-visual-assets.json for area traits and resemblance gates.`,
  firstEraId: eraId,
  featuredEraIds: [eraId],
  sourceIds: location.sources,
  tags: ['drakuru-story', 'wrath-location'],
  contentStatus: researchStatus,
});

// Add the already-defined Lich King figure to this story’s source grouping.
const lichKingPath = 'data/entities/arthas-as-the-lich-king.research.json';
const lichKing = JSON.parse(await readFile(path.join(root, lichKingPath), 'utf8'));
lichKing.sourceIds = [...new Set([...lichKing.sourceIds, ...sourceRef('cleansing-draktharon', 'betrayal', 'overlord-drakuru')])];
await write(lichKingPath, lichKing);

const storyActors = [...actorsData.map(({ id }) => id), 'arthas-as-the-lich-king'];
const features = storyActors.map((id, index) => ({
  type: 'Feature',
  id: `${storyId}-${id}-focus`,
  properties: { name: `${id} editorial cast focus`, contentStatus: researchStatus, styleRole: 'site', geographicCertainty: 'unknown' },
  geometry: { type: 'Point', coordinates: [3200 + (index % 4) * 1200, 5200 + Math.floor(index / 4) * 1000] },
}));
await write(`data/geometry/${storyId}-theater.research.geojson`, { type: 'FeatureCollection', features });
await write(`data/worldspaces/${worldspaceId}.research.json`, {
  id: worldspaceId,
  name: 'Drakuru — relational story theater',
  slug: worldspaceId,
  coordinateSystem: { width: 10000, height: 10000, origin: 'bottom-left', units: 'atlas-units' },
});
for (const [index, id] of storyActors.entries()) await write(`data/spatial-states/${storyId}-${id}.research.json`, {
  id: `${storyId}-${id}-theater`,
  entityId: id,
  eraId,
  worldspaceId,
  geometryId: `${storyId}-${id}-focus`,
  placementKind: 'relational',
  geographicCertainty: 'unknown',
  sourceIds: id === 'arthas-as-the-lich-king' ? sourceRef('cleansing-draktharon', 'betrayal') : actorsData.find((actor) => actor.id === id).sources,
  editorNote: `Position ${index + 1} is an editorial cast/object anchor in an illustrated story theater. It conveys no Azeroth geography, route, battle formation, or simultaneous presence.`,
  visualPresence: 'contextual',
  labelPriority: 240,
});

for (const env of environments) await write(`data/map-states/${storyId}-${env.id}-scene.research.json`, {
  id: `${storyId}-${env.id}-scene`,
  name: `Drakuru story: ${env.name}`,
  worldspaceId,
  presentation: 'relational',
  terrainTextureAsset: `${artRoot}/${env.id}.research.webp`,
  geometryIds: [],
  cartographyLabel: 'ILLUSTRATED STORY THEATER',
  interpretationNote: `Original interpretive environment illustration of ${env.area}. Preserve these Wrath-era traits: ${env.traits} This is not a surveyed map, exact dungeon floor plan, or evidence of precise actor placement. Compare with the matching 3.3.5a client before human visual approval.`,
});

const beats = [
  { id: 'captive-at-granite-springs', title: 'A captive among the cedars', env: 'granite-springs', sources: ['truce', 'guru-of-drakuru', 'blizzard-grizzly-hills'], places: ['granite-springs'], cast: ['drakuru'], text: 'In the cedar country of Grizzly Hills, Drakuru waits behind the bars of a cage at Granite Springs. He is a Drakkari troll, held after the forest’s struggles have brought him into human custody. His warning is plain: he remembers many heads he has taken, yet proposes that old enemies set their quarrel aside for a time. The offered truce is uneasy, but the prisoner says he knows things that could help against the dangers gathering here.' },
  { id: 'blood-pact', title: 'The bargain sealed in blood', env: 'granite-springs', sources: ['truce'], places: ['granite-springs'], cast: ['drakuru'], text: 'Drakuru cuts his palm and reaches through the cage. The meeting becomes a blood pact, binding the two sides to a temporary alliance. He promises knowledge of Drak’Tharon Keep, whose fall has left the borderlands under threat. At Granite Springs, the promise appears to serve a common need: the captive will guide the seeker, and the living may learn what has overtaken the old fortress. The pact gives trust a shape, though not yet a reason to doubt it.' },
  { id: 'vial-of-visions', title: 'A voice carried through the vial', env: 'granite-springs', sources: ['vial-of-visions'], places: ['granite-springs'], cast: ['drakuru'], text: 'A vial of visions becomes the means by which Drakuru’s image can speak beyond the cage. The potion is an alchemical bridge, not freedom: he remains imprisoned while his counsel reaches distant places. His words carry the search toward old Drakkari monuments, where he claims signs of a power that could shield Drak’Tharon. The first step of the bargain is therefore not a key or a gate, but a voice learning how to travel.' },
  { id: 'hieroglyphs-of-drakzin', title: 'The stones of Drak’Zin', env: 'drakzin-ruins', sources: ['subject-to-interpretation'], places: ['drakzin-ruins'], cast: ['drakuru'], text: 'Among the weathered faces and broken terraces of Drak’Zin, Drakuru’s image studies the carved walls. He says a legendary set of artifacts was made to render Drak’Tharon Keep impervious, and that hieroglyphs may reveal where one lies. Drakuru alone offers this claim, and its truth remains unverified. He had been captured while interpreting the old stones. Now the ruins become the first test of whether his knowledge is a path toward safety or another kind of trap.' },
  { id: 'eye-of-the-prophets', title: 'The eye in the idol', env: 'zebhalak-ziggurat', sources: ['sacrifices-must-be-made', 'warlord-zimbo'], places: ['zebhalak'], cast: ['drakuru', 'warlord-zimbo', 'eye-of-the-prophets'], text: 'At Zeb’Halak, an ancient idol watches the forest from its stepped stone height. One eye is a ruby, and Drakuru names it the Eye of the Prophets. He directs that it be brought to his brazier and says it will show the next relic. To gain the old warlord Zim’bo’s mojo, Drakuru speaks of the blood oath that binds him to defend Drak’Tharon. The eye is recovered; the cost is a life that Drakuru describes as sacrifice for a greater hope.' },
  { id: 'heart-at-blue-sky', title: 'The heart beneath the logging ground', env: 'blue-sky-logging-grounds', sources: ['heart-of-the-ancients', 'blizzard-grizzly-hills'], places: ['blue-sky-logging-grounds'], cast: ['heart-of-the-ancients'], text: 'Blue Sky Logging Grounds cuts a human worksite into the cedar forest, where water and timber run through the hills. In an upper room, the Heart of the Ancients lies beside a dead Venture Company goblin. The tale locates the gem there, but gives no fuller history for the goblin. The story’s second relic is found amid evidence of ordinary labor displaced by older ruins and a darker search.' },
  { id: 'drakatal-watching', title: 'The heart watched from afar', env: 'draktharon-keep', sources: ['my-heart-is-in-your-hands'], places: ['drak-atal-passage', 'drak-tharon-keep'], cast: ['drakuru', 'eye-of-the-prophets', 'heart-of-the-ancients'], text: 'Through the Eye, Drakuru says he has watched the search and knows the Heart has been found. He asks for it at Drak’atal Passage, where a brazier will summon his image once more. His promise remains the same: the Keep will be cleansed, his brothers avenged, and its greatest treasure given in return. The words join the two artifacts to the threatened fortress. They also sharpen the question that began in the cage: whose purpose is being served by every promised cleansing?' },
  { id: 'tablets-of-drakiljin', title: 'The voices in the crypt', env: 'drakiljin-crypt', sources: ['voices-from-the-dust'], places: ['drakiljin-ruins'], cast: ['drakuru', 'eye-of-the-prophets', 'heart-of-the-ancients'], text: 'At the buried chambers of Drakil’jin, the Drakkari tablets are the last records Drakuru seeks. He places the Eye at his brow and the Heart upon his chest, saying the relics together let him read what no one now understands. The stones are old; their meaning is not independently established by the chain. Drakuru declares that all the components for a cleansing ritual are now gathered. The route bends at last toward Drak’Tharon Keep.' },
  { id: 'the-keep-is-cleansed', title: 'The fortress opened', env: 'draktharon-keep', sources: ['cleansing-draktharon', 'draktharon-area', 'blizzard-zuldrak'], places: ['drak-tharon-keep'], cast: ['drakuru'], text: 'Drak’Tharon Keep stands where the cold forest gives way to the harsher land of Zul’Drak: carved stone rising above a border already touched by the Scourge. The relics and Drakuru’s elixir bring the living into its upper reaches. There he is summoned before the fortress’s remaining resistance is overcome. He has promised a peaceful return to the Keep’s purpose. At the summit, the ritual does not end in restoration; a portal opens, and the master behind Drakuru’s promises steps through.' },
  { id: 'the-lich-kings-gift', title: 'The gift beneath the Keep', env: 'draktharon-keep', sources: ['cleansing-draktharon', 'overlord-drakuru'], places: ['drak-tharon-keep'], cast: ['overlord-drakuru', 'arthas-as-the-lich-king'], text: 'The Lich King appears, and Drakuru kneels. He names his mission complete: with the mortals’ help, those who opposed the Scourge in the region have been removed. The Lich King reveals the truth plainly—Drakuru’s betrayal of the Drakkari Empire has given him a new army. He changes the troll’s form, making him larger and darker, then charges him with the “cleansing” of Zul’Drak. Drakuru accepts. The bargain in the cedar forest has delivered a fortress into the Scourge’s hands.' },
  { id: 'orders-in-the-dead-fields', title: 'Orders from the Dead Fields', env: 'zuldrak-dead-fields', sources: ['orders-from-drakuru', 'blizzard-zuldrak'], places: ['zul-drak-dead-fields'], cast: ['overlord-drakuru'], text: 'A written order gives shape to the campaign spreading through Zul’Drak. Drakuru commands the Scourge armies, has corpses processed in the Dead Fields, and sends them to Zeramas to be raised. He speaks of blood from the prophets as a means to strengthen his forces, and names both Zul’Drak and Gundrak as targets. The scroll leaves little room for the earlier tale of rescue: the work of the relics has helped make conquest possible.' },
  { id: 'stefan-reads-the-orders', title: 'The Ebon Watch has followed', env: 'ebon-watch', sources: ['orders-from-drakuru', 'the-ebon-watch', 'blizzard-zuldrak'], places: ['ebon-watch'], cast: ['stefan-vadu'], text: 'At Ebon Watch, the orders reach Stefan Vadu, the death knight who commands the camp. He reads the message, calls it old news, and says the Ebon Blade has tracked Drakuru since Grizzly Hills. The Argent Crusade and Ebon Blade divide their work against threats in Zul’Drak; Stefan’s concern is the Scourge lord who now directs the land’s dead. The apparent ally of Drak’Tharon has become an enemy both orders already know.' },
  { id: 'a-return-to-voltarus', title: 'A welcome beneath the necropolis', env: 'voltarus', sources: ['reunited', 'dark-horizon', 'voltarus-area'], places: ['voltarus'], cast: ['overlord-drakuru'], text: 'Voltarus hangs above the blighted ravines of Zul’Drak, its towers and chains suspended over a landscape of ice and ruined stone. The greeting depends on the path by which the traveler arrives: those who aided Drakuru before are welcomed as familiar servants, while others receive a different introduction. Both versions lead into his account of the land. With Gorebag as guide, a broad tour reveals the scale of Zul’Drak and the reach Drakuru hopes to claim.' },
  { id: 'the-land-he-means-to-take', title: 'Gundrak in his sight', env: 'voltarus', sources: ['reunited', 'dark-horizon', 'overlord-drakuru'], places: ['voltarus'], cast: ['overlord-drakuru'], text: 'Across the tour, Drakuru names the lands and powers he means to overcome. His ambition reaches beyond the Dead Fields to Gundrak, the heart of the Drakkari realm. The old promise of a rescued people has given way to the language of possession: the trolls are now obstacles, and their capital the prize. The flight returns to the floating citadel, where the infiltrator is told to prepare, observe, and continue earning the trust of a master who has mistaken obedience for loyalty.' },
  { id: 'the-choker-and-the-mask', title: 'A disguise within Voltarus', env: 'voltarus', sources: ['infiltrating-voltarus', 'the-ebon-watch', 'guru-of-drakuru'], places: ['ebon-watch', 'voltarus'], cast: ['stefan-vadu', 'overlord-drakuru'], text: 'Stefan’s counter-operation sends a disguised agent into the necropolis. An ensorcelled choker lets the infiltrator pass among the undead long enough to stand within Drakuru’s reach. Faction-specific versions preserve their own approach, and the earlier Grizzly Hills chain changes how Drakuru greets the visitor. The common purpose is to learn what the Overlord is building and weaken it from within. Each task brings the disguise closer to exposure even as Drakuru’s confidence grows.' },
  { id: 'crystals-of-blight', title: 'The crystals harvested', env: 'voltarus', sources: ['hazardous-materials', 'so-far-so-bad', 'overlord-drakuru'], places: ['voltarus'], cast: ['overlord-drakuru', 'stefan-vadu'], text: 'Within Voltarus, blight crystals are gathered for a work whose full design is not yet disclosed. Stefan asks for samples while the infiltrator continues to serve Drakuru’s demands. Handling the crystals can break the disguise, a danger that makes proximity itself part of the counter-operation. The later account identifies the purpose: captured Drakkari chieftains are infused with blight and reshaped into weapons for the Scourge. That is the army Drakuru has been preparing beneath the floating fortress.' },
  { id: 'the-scepter-of-domination', title: 'The scepter and the secret', env: 'voltarus', sources: ['fuel-for-the-fire', 'disclosure', 'overlord-drakuru'], places: ['voltarus'], cast: ['overlord-drakuru', 'scepter-of-domination'], text: 'Believing the infiltrator loyal, Drakuru grants a scepter as a token of trust and reveals his design: the Drakkari will be swept aside so he can claim Gundrak. The Scepter of Domination offers access to the upper chamber and to weapons still hidden from view. It is no legacy of a mage or ancient sand empire, but a tool in this betrayal, bound to the blight-born force Drakuru commands. Trust has given the conspirator the means to turn his own weapon back upon him.' },
  { id: 'the-blightblood-army', title: 'An army remade from captives', env: 'voltarus', sources: ['disclosure', 'betrayal', 'overlord-drakuru'], places: ['voltarus'], cast: ['overlord-drakuru', 'blightblood-trolls'], text: 'At the summit, Drakuru displays the next work of his reign: Blightblood Trolls, made from captured Drakkari chieftains and infused with blight. He calls them the first of a greater army, meant to sweep across Zul’Drak. The captives who once stood among their own people have been turned into instruments against them. Before the display can become a campaign, the infiltrator’s disguise fails. Drakuru recognizes the deceit, and the necropolis becomes a place of open reckoning.' },
  { id: 'the-scepter-turns', title: 'The master is undone', env: 'voltarus-summit', sources: ['betrayal', 'overlord-drakuru'], places: ['voltarus'], cast: ['overlord-drakuru', 'blightblood-trolls', 'scepter-of-domination'], text: 'The Scepter of Domination shines, and the Blightblood Trolls turn upon the master who made them. The chain records a reversal at the heart of Voltarus: Drakuru’s own instrument and army become the means by which his power is broken. His defeat is not yet the end. At the edge of his fall, he calls upon the Lich King, the authority he served when he betrayed his people and seized the Keep.' },
  { id: 'the-lich-kings-judgment', title: 'The last judgment', env: 'voltarus-summit', sources: ['betrayal', 'overlord-drakuru'], places: ['voltarus'], cast: ['overlord-drakuru', 'arthas-as-the-lich-king', 'stefan-vadu'], text: 'The Lich King comes through a portal and strikes Drakuru down. He spares the infiltrator, amused by the deception that has undone his servant. Stefan’s operation has ended the Overlord’s command, but no account here restores the chieftains who were made into Blightblood Trolls or measures what the Scourge had already taken from Zul’Drak. Drakuru’s bargain began with a hand through a cage; it ends above a conquered land, beneath the judgment of the master he chose.' },
];

const locationsById = new Map(locations.map((item) => [item.id, item]));
const actorIds = new Set(storyActors);
const nodes = [];
for (let index = 0; index < beats.length; index++) {
  const beat = beats[index];
  const usedSources = [...new Set(beat.sources.map(sourceId))];
  const validEntities = [...new Set([...beat.cast, ...beat.places])];
  for (const id of validEntities) if (!actorIds.has(id) && !locationsById.has(id)) throw new Error(`Missing entity for ${beat.id}: ${id}`);
  const eventId = `${storyId}-${beat.id}-event`;
  const citationIds = [];
  for (let sourceIndex = 0; sourceIndex < usedSources.length; sourceIndex++) {
    const citationId = `${storyId}-${beat.id}-citation-${sourceIndex + 1}`;
    citationIds.push(citationId);
    const key = beat.sources[sourceIndex];
    await write(`data/citations/${citationId}.research.json`, {
      id: citationId,
      sourceId: usedSources[sourceIndex],
      section: beat.title,
      note: key.startsWith('blizzard-')
        ? 'Official Blizzard area description supports visual reference traits only; story events remain anchored to their separate quest citations.'
        : 'Original paraphrase from a secondary WotLK quest-text or chain locator. Original client dialogue/build capture and human source review remain open; do not treat item-use mechanics as independent history.',
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
    editorNote: 'Research status: quest mirrors support the paraphrase, but original Wrath client/build capture and human lore review are still required. The prisoner bargain, claimed artifact history, faction/follow-up variants, invasion chronology and motives are not expanded beyond their cited scope.',
  });
  await write(`data/events/${eventId}.research.json`, {
    id: eventId,
    kind: 'event',
    name: beat.title,
    slug: `${storyId}-${beat.id}`,
    eraId,
    worldspaceId,
    summary: beat.text,
    locationIds: beat.places,
    participantEntityIds: beat.cast,
    sourceIds: usedSources,
    claimIds: [claimId],
    contentStatus: researchStatus,
  });
  nodes.push({
    id: `${storyId}-story-${beat.id}`,
    guideId,
    title: beat.title,
    narration: beat.text,
    durationMs: Math.round((beat.text.split(/\s+/).length / 82) * 60000) + 4500,
    eventIds: [eventId],
    entityIds: beat.cast,
    locationIds: beat.places,
    camera: { position: [0, 6.1, 5.4], target: [0, 0, 0], durationMs: 1250 },
    visualActions: [{ type: 'set_map_state', mapStateId: `${storyId}-${beat.env}-scene` }],
    ...(index ? { previousNodeId: nodes[index - 1].id } : {}),
    ...(index < beats.length - 1 ? { nextNodeIds: [`${storyId}-story-${beats[index + 1].id}`] } : {}),
  });
}

const nodeIds = nodes.map((node) => node.id);
const guide = {
  id: guideId,
  eraId,
  title: 'Drakuru: Trust, Betrayal, and Infiltration',
  description: 'A prisoner’s blood pact leads through Drak’Tharon Keep to a Scourge necropolis where an infiltrator turns Drakuru’s own scepter against him.',
  nodeIds,
  contentStatus: researchStatus,
};
const storyPath = `data/stories/${storyId}.research.json`;
const previousStory = JSON.parse(await readFile(path.join(root, storyPath), 'utf8').catch(() => '{"nodes":[]}'));
for (const node of nodes) {
  const prior = previousStory.nodes.find((candidate) => candidate.id === node.id && candidate.narration === node.narration);
  if (prior?.voiceover) node.voiceover = prior.voiceover;
}
await write(storyPath, { guide, nodes });

const chapterRanges = [
  { id: 'the-prisoner-and-the-relics', title: 'The prisoner and the relics', start: 0, end: 7 },
  { id: 'the-fall-of-draktharon', title: 'The fall of Drak’Tharon', start: 8, end: 9 },
  { id: 'orders-and-the-ebon-watch', title: 'Orders and the Ebon Watch', start: 10, end: 11 },
  { id: 'the-necropolis-and-the-mask', title: 'The necropolis and the mask', start: 12, end: 15 },
  { id: 'betrayal-above-zuldrak', title: 'Betrayal above Zul’Drak', start: 16, end: beats.length - 1 },
];
const storyline = {
  id: storyId,
  slug: storyId,
  title: 'Drakuru: Trust, Betrayal, and Infiltration',
  summary: 'A captive ice troll offers help in the cedar forests of Grizzly Hills. His trail of relics opens Drak’Tharon Keep to the Scourge, and an Ebon Blade infiltrator follows the false trust to Voltarus, where Drakuru’s own scepter turns his new army against him.',
  opening: 'Among the red cedars of Grizzly Hills, Drakuru offers a truce from behind a cage. His guide leads through carved ruins and old relics toward a fortress at the edge of Zul’Drak. The promise will not survive the summit of Drak’Tharon Keep.',
  primaryEraId: eraId,
  eraIds: [eraId],
  chapters: chapterRanges.map((chapter) => ({
    id: chapter.id,
    eraId,
    title: chapter.title,
    body: beats.slice(chapter.start, chapter.end + 1).map((beat) => beat.text).join(' '),
  })),
  sourceIds: sources.map((source) => source.id),
  storyGuideId: guideId,
  showInEraTourOffshoots: false,
  reviewNote: 'Complete illustrated research story: 20 scenes across Granite Springs, five Grizzly Hills sites, Drak’Tharon Keep and four Zul’Drak theaters, with separate Drakuru appearance states, Stefan Vadu, the Lich King, Blightblood Trolls and three pivotal relics. The Drakkari tablet history and Drakuru’s artifact claims stay attributed; the Reunited/Dark Horizon and faction approach variants remain explicit. Quest mirrors are secondary, and original-client quest/dialogue capture, exact 3.3.5a area/model comparison, cross-campaign chronology, human lore review and audio audition remain open. No content is marked reviewed or published.',
  contentStatus: researchStatus,
};
await write(`data/storylines/${storyId}.research.json`, storyline);

// Add this source group to Era 8 without inserting the storyline into EraTour.
const eraPath = 'data/eras/age-of-adventurers.research.json';
const era = JSON.parse(await readFile(path.join(root, eraPath), 'utf8'));
era.sourceIds = [...new Set([...era.sourceIds, ...storyline.sourceIds])];
await write(eraPath, era);

for (const env of environments) {
  const asset = await readFile(path.join(root, 'public', artRoot, `${env.id}.research.webp`));
  const stats = await stat(path.join(root, 'public', artRoot, `${env.id}.research.webp`));
  const record = assetRecords.find((item) => item.id === env.id);
  record.byteLength = asset.length;
  record.modifiedAt = stats.mtime.toISOString();
  record.sha256 = createHash('sha256').update(asset).digest('hex');
}
for (const actor of actors) {
  const asset = await readFile(path.join(root, 'public', artRoot, actor.file));
  const stats = await stat(path.join(root, 'public', artRoot, actor.file));
  const record = assetRecords.find((item) => item.id === actor.id);
  record.byteLength = asset.length;
  record.modifiedAt = stats.mtime.toISOString();
  record.sha256 = createHash('sha256').update(asset).digest('hex');
}
const sceneLedger = beats.map((beat, index) => {
  const env = environmentsById.get(beat.env);
  return {
    nodeId: nodes[index].id,
    title: beat.title,
    environmentPath: `public/${artRoot}/${beat.env}.research.webp`,
    gameArea: env.area,
    referenceEditionBuild: 'World of Warcraft: Wrath of the Lich King, target 3.3.5a; compare against original client before promotion.',
    recognizableTraits: env.traits,
    cast: beat.cast.map((id) => {
      const actor = actorsData.find((entry) => entry.id === id);
      if (actor) return { id, name: actor.name, image: `public/${artRoot}/${actor.image}` };
      return { id, name: 'The Lich King', image: 'public/images/characters/third-war-frozen-throne/arthas-as-the-lich-king.research.webp' };
    }),
    locations: beat.places,
    visualActions: ['set relational story MapState', 'show only the node’s contextual cast and object figures'],
    citations: beat.sources.map(sourceId),
    visualReview: 'Scene checked against the recorded area traits and generated illustration. Original-client 3.3.5a comparison remains open; no exact in-game resemblance is claimed.',
  };
});
await write('docs/research/drakuru-visual-assets.json', {
  storyId,
  status: researchStatus,
  targetEditionBuild: 'World of Warcraft: Wrath of the Lich King quest era; reference target 3.3.5a. Exact client capture remains open.',
  editorialRule: 'Match Grizzly Hills’ red cedar forest and temperate water to Grizzly scenes; distinguish its mossy ruins from the high Zeb’Halak ziggurat and low Drakil’jin crypt. Drak’Tharon is the cold carved border fortress; Zul’Drak and Voltarus use the harsher snowbound plateau and Scourge palette. Artifacts use their quest-text colors and remain distinct by name, form and story function.',
  assetProvenance: 'Original environment, character, group and prop art generated with built-in OpenAI ImageGen and converted to optimized WebP with FFmpeg. Generated assets are interpretive; they are not canonical client art or proof of a lore claim. Source PNG names are retained for provenance. Transparent RGBA source images remain transparent in WebP.',
  assetRecords,
  sceneLedger,
});

const words = nodes.reduce((sum, node) => sum + node.narration.split(/\s+/).length, 0);
let ledger = `# Drakuru: Trust, Betrayal, and Infiltration — research and production ledger\n\n`;
ledger += `Status: complete illustrated research story; not reviewed or published. ${nodes.length} scenes; ${words} narration words. Era 8 / Wrath of the Lich King. The guide begins with Drakuru already caged at Granite Springs and ends with the Lich King killing him at Voltarus. It does not claim an exact date or order relative to Wrathgate.\n\n`;
ledger += '## Source and edition boundary\n\nQuest order and dialogue leads come from secondary Warcraft Wiki pages reproducing original quest text and event scripts. They are not original 3.3.5a client captures. Blizzard’s Wrath Classic zone guides support area identity and visual traits only. Original quest text, faction/return branches, versioned area art, named models, and final-script capture must be checked before promotion. Narration is an original paraphrase; game instructions, item-use mechanics, drop counts, and combat rotations are not narrated as history.\n\n';
ledger += `## Story spine\n\n1. Drakuru proposes a blood pact while held at Granite Springs.\n2. The Vial of Visions carries his image through a search for artifacts, whose supposed protective history remains his claim.\n3. The ruby Eye, Heart and Drakkari tablets lead to the summit of Drak’Tharon.\n4. The Lich King exposes Drakuru’s betrayal, empowers him and assigns Zul’Drak.\n5. Orders reveal the Scourge plan; Stefan Vadu and the Ebon Blade begin a separate counter-operation.\n6. The returning chain and faction introduction vary; the infiltration then exposes the blight army.\n7. Drakuru’s own Scepter of Domination turns the Blightblood Trolls against him. The Lich King kills him and spares the infiltrator.\n\nThe Grizzly Hills and Zul’Drak sections are linked by the quest chain, but the story does not assert exact relative timing against the separate Wrathgate campaign. “Reunited” and “Dark Horizon” preserve prior-chain differences. Alliance and Horde infiltration approaches remain variant rather than one canonical traveler.\n\n`;
ledger += '## Scene and evidence ledger\n\n| Scene | Sources | Named location | Visual reference traits | Status and limitation |\n| --- | --- | --- | --- | --- |\n';
for (const [index, beat] of beats.entries()) {
  const env = environmentsById.get(beat.env);
  ledger += `| ${nodes[index].title} | ${beat.sources.map(sourceId).join(', ')} | ${beat.places.join(', ')} | ${env.traits} | Research; client comparison open |\n`;
}
ledger += '\n## Visual, audio and review notes\n\nEvery node uses a dedicated area-matched environment and its own supported contextual cast/object art. The Eye of the Prophets is ruby in response to the quest description of the idol’s ruby eye. Drakuru’s initial and empowered portraits are documented as two appearances of the same person, not separate characters. The Scepter of Domination is not Atiesh and is not the Scepter of the Shifting Sands. Asset hashes, prompts, named area traits and open matching-client comparisons are in [drakuru-visual-assets.json](drakuru-visual-assets.json). The reusable [storyline template](storyline-build-template.md) records the project-wide resemblance and signature-equipment standards.\n\n';
ledger += `All ${nodes.length} transcripts are stable original paraphrases paired with repository-backed, transcript-matched audio. Human gates remain: 3.3.5a quest/dialogue and model review, place resemblance, variant/chronology/citation review, pronunciation and audio audition. Every record remains contentStatus: research.\n`;
await writeFile(path.join(root, 'docs/research/drakuru-production.md'), ledger);

// Append the story placard in the independent Classic-to-Wrath StoryTour.
const tourPath = 'data/story-tours/classic-to-wrath.research.json';
const tour = JSON.parse(await readFile(path.join(root, tourPath), 'utf8'));
const previousPlacement = tour.entries.find((entry) => entry.storylineId === storyId);
if (previousPlacement) {
  tour.entries = tour.entries
    .filter((entry) => entry.storylineId !== storyId)
    .map((entry) => entry.order > previousPlacement.order ? { ...entry, order: entry.order - 1 } : entry);
}
tour.entries = tour.entries.map((entry) => entry.order >= 22 ? { ...entry, order: entry.order + 1 } : entry);
tour.entries.push({
  storylineId: storyId,
  regionIds: ['northrend'],
  mapPositionPercent: [55, 25],
  order: 22,
  periodLabel: 'Wrath of the Lich King · Grizzly Hills and Zul’Drak',
  locationLabel: 'Grizzly Hills and Zul’Drak',
});
tour.entries.sort((a, b) => a.order - b.order);
tour.opening = 'Choose a story from the map, or play the completed stories in editorial chronology across Azeroth, Outland, and Northrend, including the deception that opened Drak’Tharon Keep to the Scourge.';
const drakuruChronology = 'Drakuru’s Grizzly Hills and Zul’Drak chain is placed after Wrathgate and before Quel’Delar as an editorial Northrend stop. Its exact in-world timing relative to Wrathgate is unknown, and no causal link is claimed; Quel’Delar remains the later patch 3.3.5 story. “Reunited”/“Dark Horizon” and faction approaches remain variants within the guide, not separate chronological events.';
const drakuruChronologyMarker = 'Drakuru’s Grizzly Hills and Zul’Drak chain is placed after Wrathgate';
tour.chronologyNote = `${tour.chronologyNote.split(drakuruChronologyMarker)[0].trimEnd()} ${drakuruChronology}`;
tour.reviewNote = 'Research StoryTour collection with 23 map placards and complete StoryGuides for the playable research entries; Play All follows the explicit editorial order and skips research previews. Story-tour map markers are navigational layout positions, not exact locations. Drakuru’s placement relative to Wrathgate is editorial because the stories lack a precise cross-story date. Human source, edition, chronology, and visual review remains open.';
await write(tourPath, tour);

process.stdout.write(`Authored ${nodes.length} scenes (${words} narration words), ${actorsData.length} illustrated cast and object records, ${locations.length} cited locations, ${environments.length} environments; added Classic-to-Wrath placard 22.\n`);
