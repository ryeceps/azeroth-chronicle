import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const storyId = 'akama-and-black-temple';
const guideId = `${storyId}-guide`;
const eraId = 'age-of-adventurers';
const worldspaceId = 'akama-black-temple-theater';
const artDir = 'public/images/storylines/akama-black-temple';
const existingPath = path.join(root, `data/stories/${storyId}.research.json`);
const existingVoiceovers = new Map();
try {
  const previous = JSON.parse(await readFile(existingPath, 'utf8'));
  for (const node of previous.nodes ?? []) if (node.voiceover) existingVoiceovers.set(node.id, node.voiceover);
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

async function write(file, value) {
  const target = path.join(root, file);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, typeof value === 'string' ? value : `${JSON.stringify(value, null, 2)}\n`);
}

const sources = [
  {
    id: 'akama-bcc-phase3-black-temple', title: 'Burning Crusade Classic: Phase 3 is Now Live',
    url: 'https://news.blizzard.com/en-us/article/23764312/burning-crusade-classic-phase-3-is-now-live', sourceType: 'website',
    notes: 'Accessed 2026-10-01. First-party Blizzard Burning Crusade Classic guide listing the Black Temple attunement sequence and the raid access gates. It verifies the recreated chain as presented in Classic; it is not an original 2007 client capture or complete quest-text record.',
  },
  {
    id: 'akama-bcc-story-so-far', title: 'Burning Crusade Classic: The Story So Far',
    url: 'https://worldofwarcraft.blizzard.com/en-us/news/23679744/burning-crusade-classic-the-story-so-far', sourceType: 'website',
    notes: 'Accessed 2026-10-01. First-party Blizzard historical overview for Illidan taking the Black Temple, the defeat of Magtheridon, and the Broken led by Akama joining Illidan. A retrospective summary, not original quest dialogue.',
  },
  {
    id: 'akama-blizzard-black-temple-history', title: 'The Black Temple – A Journey Through Time(walking)',
    url: 'https://worldofwarcraft.blizzard.com/en-us/news/20855984/the-black-temple-a-journey-through-time-walking', sourceType: 'website',
    notes: 'Accessed 2026-10-01. First-party Blizzard retrospective: Karabor as a draenei place of worship, its renaming as the Black Temple, and the raid arrival in patch 2.1 in May 2007. The later Timewalking discussion is not treated as original 2007 mechanics.',
  },
  {
    id: 'akama-blizzard-black-temple-raid-guide', title: 'Black Temple Beat Down',
    url: 'https://worldofwarcraft.blizzard.com/en-us/news/14231999/black-temple-beat-down', sourceType: 'website',
    notes: 'Accessed 2026-10-01. First-party Blizzard raid guide used narrowly for the Shade of Akama encounter, the Ashtongue revolt after Akama reclaims his soul, and the seers opening Illidan’s sanctum. It is a later-era walkthrough, not original TBC client evidence.',
  },
  {
    id: 'akama-black-temple-chain-locator', title: 'Black Temple attunement quest-chain locator',
    url: 'https://warcraft.wiki.gg/wiki/Black_Temple_Attunement', sourceType: 'website',
    notes: 'Accessed 2026-10-01. Secondary quest-index used to audit the attunement order and distinguish the Aldor and Scryer starting variants. Consult Blizzard’s Phase 3 article for the Classic recreation; original 2007 client text and patch-by-patch comparison remain open.',
  },
  {
    id: 'akama-tablets-baari-quest', title: 'Tablets of Baa’ri quest locator',
    url: 'https://warcraft.wiki.gg/wiki/Tablets_of_Baa%27ri_(Scryers)', sourceType: 'quest',
    notes: 'Accessed 2026-10-01. Secondary locator for the Scryers version of the opening task. The Aldor begin from a different quest giver; the two starts are alternatives, not a single adventurer’s combined route.',
  },
  {
    id: 'akama-oronu-quest', title: 'Oronu the Elder quest locator',
    url: 'https://warcraft.wiki.gg/wiki/Oronu_the_Elder_(Aldor)', sourceType: 'quest',
    notes: 'Accessed 2026-10-01. Secondary locator for Oronu’s orders and the medallion search. This is an Aldor quest page; use it to locate the shared chain, not to assert that every faction variant has identical dialogue.',
  },
  {
    id: 'akama-corruptors-quest', title: 'The Ashtongue Corruptors quest locator',
    url: 'https://warcraft.wiki.gg/wiki/The_Ashtongue_Corruptors_(Aldor)', sourceType: 'quest',
    notes: 'Accessed 2026-10-01. Secondary locator for the shamans and medallion fragments. Their kill and collection counts are player objectives, not a census of the Ashtongue or separate historical milestones.',
  },
  {
    id: 'akama-proof-allegiance-quest', title: 'Proof of Allegiance quest locator',
    url: 'https://warcraft.wiki.gg/wiki/Proof_of_Allegiance', sourceType: 'quest',
    notes: 'Accessed 2026-10-01. Secondary reproduction of the task Akama sets to preserve his cover. The selected target list is a quest objective; it is not evidence of a tribe-wide massacre.',
  },
  {
    id: 'akama-reveal-quest', title: 'Akama quest locator',
    url: 'https://warcraft.wiki.gg/wiki/Akama_(quest)', sourceType: 'quest',
    notes: 'Accessed 2026-10-01. Secondary reproduction used for the hidden pool chamber, Akama’s concealed position, his meeting with Maiev, and the staged display before Illidan’s watcher. Original-client comparison remains open.',
  },
  {
    id: 'akama-seer-udalo-quest', title: 'Seer Udalo quest locator',
    url: 'https://warcraft.wiki.gg/wiki/Seer_Udalo', sourceType: 'quest',
    notes: 'Accessed 2026-10-01. Secondary locator describing Udalo’s discovery in the Arcatraz after the Deathsworn sent the seeker to find him.',
  },
  {
    id: 'akama-mysterious-portent-quest', title: 'A Mysterious Portent quest locator',
    url: 'https://warcraft.wiki.gg/wiki/A_Mysterious_Portent', sourceType: 'quest',
    notes: 'Accessed 2026-10-01. Secondary quest-text locator for the single word Ata’mal left by Udalo. No fuller prophecy is inferred from this fragment.',
  },
  {
    id: 'akama-atamal-terrace-quest', title: 'The Ata’mal Terrace quest locator',
    url: 'https://warcraft.wiki.gg/wiki/The_Ata%27mal_Terrace', sourceType: 'quest',
    notes: 'Accessed 2026-10-01. Secondary quest-text locator for the Heart of Fury, Akama’s recognition of the relic, his consideration of replacing Illidan, and his rejection of rule-by-replacement as freedom for his people.',
  },
  {
    id: 'akama-promise-quest', title: 'Akama’s Promise quest locator',
    url: 'https://warcraft.wiki.gg/wiki/Akama%27s_Promise', sourceType: 'quest',
    notes: 'Accessed 2026-10-01. Secondary quest-text locator for the medallion given to A’dal and the end of the first Akama quest chain. It does not mean the raid entrance is already open.',
  },
  {
    id: 'akama-secret-compromised-quest', title: 'The Secret Compromised quest locator',
    url: 'https://warcraft.wiki.gg/wiki/The_Secret_Compromised', sourceType: 'quest',
    notes: 'Accessed 2026-10-01. Secondary locator for Olum’s warning, his capture by Vashj’s followers, the choice to enter the spirit world, and Akama’s account to Illidan. Dialogue is paraphrased; no copied quest text is shipped.',
  },
  {
    id: 'akama-ruse-quest', title: 'Ruse of the Ashtongue quest locator',
    url: 'https://warcraft.wiki.gg/wiki/Ruse_of_the_Ashtongue', sourceType: 'quest',
    notes: 'Accessed 2026-10-01. Secondary quest-text locator for the Ashtongue Cowl and Al’ar task in Tempest Keep. The disguise objective is a ruse to maintain Akama’s cover.',
  },
  {
    id: 'akama-hyjal-artifact-quest', title: 'An Artifact From the Past quest locator',
    url: 'https://warcraft.wiki.gg/wiki/An_Artifact_From_the_Past', sourceType: 'quest',
    notes: 'Accessed 2026-10-01. Secondary locator for the time-instance trip into the Battle of Mount Hyjal and recovery of Rage Winterchill’s phylactery. The instance is a past memory, not present-day Outland geography.',
  },
  {
    id: 'akama-hostage-soul-quest', title: 'The Hostage Soul quest locator',
    url: 'https://warcraft.wiki.gg/wiki/The_Hostage_Soul', sourceType: 'quest',
    notes: 'Accessed 2026-10-01. Secondary quest-text locator for Akama’s imprisoned soul and his plan for the phylactery. It establishes intended action, not certain success.',
  },
  {
    id: 'akama-distraction-quest', title: 'A Distraction for Akama quest locator',
    url: 'https://warcraft.wiki.gg/wiki/A_Distraction_for_Akama', sourceType: 'quest',
    notes: 'Accessed 2026-10-01. Secondary reproduction of the Xi’ri diversion, Maiev’s independent attack, Akama’s movement with the Deathsworn, and the southern wall opening. The event is an encounter script, not a surveyed breach.',
  },
  {
    id: 'akama-seek-ashtongue-quest', title: 'Seek Out the Ashtongue quest locator',
    url: 'https://warcraft.wiki.gg/wiki/Seek_Out_the_Ashtongue', sourceType: 'quest',
    notes: 'Accessed 2026-10-01. Secondary locator for the Deathsworn rendezvous inside the Black Temple.',
  },
  {
    id: 'akama-redemption-quest', title: 'Redemption of the Ashtongue quest locator',
    url: 'https://warcraft.wiki.gg/wiki/Redemption_of_the_Ashtongue', sourceType: 'quest',
    notes: 'Accessed 2026-10-01. Secondary quest-text locator for the Shade of Akama, the risk of open revolt, and access to Illidan’s sanctum after Akama recovers his soul.',
  },
  {
    id: 'akama-fall-betrayer-quest', title: 'The Fall of the Betrayer quest locator',
    url: 'https://warcraft.wiki.gg/wiki/The_Fall_of_the_Betrayer', sourceType: 'quest',
    notes: 'Accessed 2026-10-01. Secondary locator for the final Black Temple quest and its immediate TBC-era consequence. Later expansion outcomes are outside this story’s cutoff.',
  },
];

const environment = [
  { id: 'karabor-black-temple', place: 'Karabor / the Black Temple, Shadowmoon Valley', map: 'karabor-black-temple', traits: 'The ancient draenei temple’s monumental angular stone is overbuilt with severe near-black masonry; fel-green light is restrained against Shadowmoon’s broken charcoal ground and toxic sky.', visualSourceIds: ['akama-blizzard-black-temple-history', 'akama-blizzard-black-temple-raid-guide'] },
  { id: 'baari-ruins', place: 'Ruins of Baa’ri, Shadowmoon Valley', map: 'baari-ruins', traits: 'Collapsed draenei masonry amid Shadowmoon’s dark volcanic rock, ash-red dust, sparse dead growth, and broad exposed valley. Keep the tablet site ancient and ruined, not a red-bannered human keep.', visualSourceIds: ['akama-tablets-baari-quest', 'akama-oronu-quest'] },
  { id: 'wardens-cage', place: 'The Warden’s Cage, Shadowmoon Valley', map: 'wardens-cage', traits: 'A small, isolated dark-stone prison outpost in a barren, broken Shadowmoon basin; compressed walls and rough ground, with fel-green haze at a distance.', visualSourceIds: ['akama-reveal-quest', 'akama-proof-allegiance-quest'] },
  { id: 'secret-chamber', place: 'Hidden chamber beneath the Warden’s Cage pool', map: 'secret-chamber', traits: 'Close subterranean draenei stonework, a flooded pool passage, cold blue-black water and dim reflected stone; intimate, enclosed, not a generic crypt.', visualSourceIds: ['akama-reveal-quest'] },
  { id: 'arcatraz', place: 'The Arcatraz, Tempest Keep, Netherstorm', map: 'arcatraz', traits: 'Floating draenei-built crystalline prison, sharp angular ivory and red structures against Netherstorm’s violet void and fractured floating rocks.', visualSourceIds: ['akama-seer-udalo-quest', 'akama-mysterious-portent-quest'] },
  { id: 'atamal-terrace', place: 'Ata’mal Terrace, Black Temple, Shadowmoon Valley', map: 'atamal-terrace', traits: 'Vast dark temple battlements, stacked sharp draenei lines and fel-green storm glow over Shadowmoon; the terrace is open and high, not an ordinary castle roof.', visualSourceIds: ['akama-atamal-terrace-quest'] },
  { id: 'shattrath-terrace', place: 'Terrace of Light, Shattrath', map: 'shattrath-terrace', traits: 'Pale cream draenei arches and circular terrace, open walkways, a towering luminous naaru crystal, warm gold-white light, dust and broken Outland beyond.', visualSourceIds: ['akama-promise-quest'] },
  { id: 'serpentshrine', place: 'Serpentshrine Cavern, Coilfang Reservoir, Zangarmarsh', map: 'serpentshrine-cavern', traits: 'A submerged naga industrial cavern: deep teal water, colossal metal pipes, constructed platforms and saturated blue-green light, enclosed by wet stone.', visualSourceIds: ['akama-secret-compromised-quest', 'akama-bcc-phase3-black-temple'] },
  { id: 'tempest-eye', place: 'The Eye, Tempest Keep, Netherstorm', map: 'tempest-keep-eye', traits: 'An angular floating draenei crystal citadel in Netherstorm’s purple-red void; Al’ar reads as a phoenix-shaped fire against the empty cosmic backdrop.', visualSourceIds: ['akama-ruse-quest'] },
  { id: 'hyjal-memory', place: 'Battle of Mount Hyjal, Caverns of Time memory', map: 'hyjal-memory', traits: 'A clearly historical instance: a night-elf forest of deep green boughs and moonlight under siege, with distant controlled golden-orange fires. Do not depict it as a present-day route.', visualSourceIds: ['akama-hyjal-artifact-quest'] },
  { id: 'southern-entry', place: 'Southern wall of the Black Temple, Shadowmoon Valley', map: 'southern-entry', traits: 'Monumental near-black draenei temple masonry, scorched broken ground, green fel haze and a narrow opening at the southern wall.', visualSourceIds: ['akama-distraction-quest', 'akama-blizzard-black-temple-raid-guide'] },
  { id: 'bt-refectory', place: 'Refectory, Black Temple', map: 'bt-refectory', traits: 'A vast severe dark-stone hall inside the Black Temple: high shadowed arches, heavy columns, green fel pools and hanging chains; not a generic human castle hall.', visualSourceIds: ['akama-blizzard-black-temple-raid-guide'] },
  { id: 'bt-inner-sanctuary', place: 'Sanctuary of Shadows, Black Temple', map: 'bt-inner-sanctuary', traits: 'An interior of angular draenei vaults and black stone, broken masonry and restrained green soul-light, leading toward the temple’s raid wings.', visualSourceIds: ['akama-redemption-quest', 'akama-blizzard-black-temple-raid-guide'] },
  { id: 'illidari-council', place: 'Illidari Council chamber, Black Temple', map: 'illidari-council', traits: 'High, shadowed Black Temple architecture with a raised dais and green-lit floor; a chamber at the upper end of the fortress, not a human throne room.', visualSourceIds: ['akama-blizzard-black-temple-raid-guide'] },
  { id: 'temple-summit', place: 'Temple Summit, Black Temple', map: 'temple-summit', traits: 'The Black Temple’s severe stepped roofline above a shattered horizon, under a storm-dark green sky; preserve its massive draenei silhouette.', visualSourceIds: ['akama-blizzard-black-temple-raid-guide'] },
  { id: 'illidan-sanctum', place: 'Illidan’s sanctum, Black Temple', map: 'illidan-sanctum', traits: 'A cavernous black-stone temple chamber with obsidian pillars and raised dais, emerald fel fire and restrained crimson; dark, high and unmistakably part of the Black Temple.', visualSourceIds: ['akama-blizzard-black-temple-raid-guide', 'akama-blizzard-black-temple-history'] },
];

const locations = [
  ['black-temple', 'The Black Temple / Karabor', ['akama-blizzard-black-temple-history', 'akama-bcc-story-so-far']],
  ['baa-ri-ruins', 'Ruins of Baa’ri', ['akama-tablets-baari-quest', 'akama-oronu-quest']],
  ['wardens-cage', 'The Warden’s Cage', ['akama-reveal-quest', 'akama-proof-allegiance-quest']],
  ['warden-hidden-pool', 'Hidden pool chamber beneath the Warden’s Cage', ['akama-reveal-quest']],
  ['arcatraz', 'The Arcatraz', ['akama-seer-udalo-quest']],
  ['ata-mal-terrace', 'Ata’mal Terrace', ['akama-atamal-terrace-quest']],
  ['shattrath-terrace-of-light', 'Shattrath, Terrace of Light', ['akama-promise-quest']],
  ['serpentshrine-cavern', 'Serpentshrine Cavern', ['akama-secret-compromised-quest', 'akama-bcc-phase3-black-temple']],
  ['tempest-keep-eye', 'The Eye, Tempest Keep', ['akama-ruse-quest']],
  ['hyjal-summit-memory', 'Battle of Mount Hyjal, a historical instance', ['akama-hyjal-artifact-quest']],
  ['black-temple-southern-entry', 'Southern wall of the Black Temple', ['akama-distraction-quest']],
  ['black-temple-refectory', 'The Black Temple Refectory', ['akama-seek-ashtongue-quest', 'akama-blizzard-black-temple-raid-guide']],
  ['black-temple-sanctuary', 'Sanctuary of Shadows, Black Temple', ['akama-redemption-quest']],
  ['illidari-council', 'Illidari Council chamber', ['akama-blizzard-black-temple-raid-guide']],
  ['temple-summit', 'Temple Summit, Black Temple', ['akama-blizzard-black-temple-raid-guide']],
  ['illidan-sanctum', 'Illidan’s sanctum, Black Temple', ['akama-fall-betrayer-quest', 'akama-blizzard-black-temple-raid-guide']],
];

const visualAssets = [
  ['akama', 'character', 'Akama', 'An elder Broken draenei sage with ash-gray blue skin, white hair and tusks. Original illustration; not canonical model art.', ['akama-bcc-story-so-far', 'akama-reveal-quest', 'akama-atamal-terrace-quest'], 'akama', 'akama.research.webp', 0.9],
  ['maiev-shadowsong', 'character', 'Maiev Shadowsong', 'Night elf warden shown with a pale crescent mask and dark blue armor. The interpretation does not establish exact costume or precise co-presence.', ['akama-reveal-quest', 'akama-distraction-quest'], 'maiev-shadowsong', 'maiev-shadowsong.research.webp', 0.84],
  ['ashtongue-deathsworn', 'faction', 'Ashtongue Deathsworn', 'Interpretive Broken ensemble for Akama’s trusted inner circle; not an exact membership roll or claim that all Ashtongue shared their secret.', ['akama-bcc-story-so-far', 'akama-black-temple-chain-locator', 'akama-secret-compromised-quest'], 'ashtongue-deathsworn', 'ashtongue-deathsworn.research.webp', 0.9],
  ['ashtongue-corruptors', 'faction', 'Ashtongue Corruptors', 'Interpretive ensemble of Broken shamans tied to the medallion quest. The quest’s target count does not establish exact historical composition.', ['akama-corruptors-quest'], 'ashtongue-corruptors', 'ashtongue-corruptors.research.webp', 0.9],
  ['coilfang-naga', 'faction', 'Vashj’s Coilfang followers', 'Interpretive naga group for the captors described in Olum’s quest account; not a roster or proof of Vashj’s presence in the scene.', ['akama-secret-compromised-quest'], 'coilfang-naga-group', 'coilfang-naga-group.research.webp', 0.9],
  ['seer-udalo', 'character', 'Seer Udalo', 'Broken seer represented in his Arcatraz discovery and later spirit appearance; the art is original interpretation.', ['akama-seer-udalo-quest', 'akama-mysterious-portent-quest', 'akama-blizzard-black-temple-raid-guide'], 'seer-udalo', 'seer-udalo.research.webp', 0.84],
  ['seer-olum', 'character', 'Seer Olum', 'Broken seer and trusted Deathsworn represented in Serpentshrine and his later spirit appearance; not canonical model art.', ['akama-secret-compromised-quest', 'akama-blizzard-black-temple-raid-guide'], 'seer-olum', 'seer-olum.research.webp', 0.84],
  ['seer-kanai', 'character', 'Seer Kanai', 'Broken seer who directs the Black Temple steps; original interpretive portrait.', ['akama-seek-ashtongue-quest', 'akama-redemption-quest'], 'seer-kanai', 'seer-kanai.research.webp', 0.84],
  ['xi-ri', 'other', 'Xi’ri', 'Original abstract naaru illustration for the Sha’tar diversion; not a canonical model or spatially precise staging.', ['akama-distraction-quest'], 'xi-ri', 'xi-ri.research.webp', 0.95],
  ['adal', 'other', 'A’dal', 'Original abstract naaru illustration for Akama’s promise in Shattrath; the form is interpretive.', ['akama-promise-quest'], 'adal', 'adal.research.webp', 0.95],
  ['magtheridon', 'character', 'Magtheridon', 'Original interpretation of the pit lord displaced at the Black Temple in the preceding campaign.', ['akama-bcc-story-so-far'], 'magtheridon', 'magtheridon.research.webp', 0.96],
  ['oronu-the-elder', 'character', 'Oronu the Elder', 'Original interpretation of Oronu in the medallion search; it does not assert exact armor or location.', ['akama-oronu-quest'], 'oronu-the-elder', 'oronu-the-elder.research.webp', 0.84],
  ['kael-thas-sunstrider', 'character', 'Kael’thas Sunstrider', 'Original Burning Crusade-era interpretation shown only as a story portrait in the deception sequence; it does not assert his presence beside Akama.', ['akama-secret-compromised-quest', 'akama-ruse-quest', 'akama-bcc-story-so-far'], 'kael-thas-sunstrider', 'kael-thas-sunstrider.research.webp', 0.84],
  ['alar', 'character', 'Al’ar', 'Phoenix cutout representing the raid target in the Tempest Keep quest; original model-inspired art, not canonical game art.', ['akama-ruse-quest'], 'alar', 'alar.research.webp', 0.9],
  ['rage-winterchill', 'character', 'Rage Winterchill', 'Original interpretation of the frost lich targeted in the historical Hyjal instance.', ['akama-hyjal-artifact-quest'], 'rage-winterchill', 'rage-winterchill.research.webp', 0.9],
  ['shade-of-akama', 'character', 'Shade of Akama', 'Distinct spectral image of the soul-bound Shade defeated in the Black Temple; an aspect of Akama’s soul, not another biography.', ['akama-redemption-quest', 'akama-blizzard-black-temple-raid-guide'], 'shade-of-akama', 'shade-of-akama.research.webp', 0.9],
  ['heart-of-fury', 'artifact', 'Heart of Fury', 'Original interpretation of the recovered artifact; its illustrated shape is not asserted as canonical.', ['akama-atamal-terrace-quest'], 'heart-of-fury', 'heart-of-fury.research.webp', 0.86],
  ['medallion-of-karabor', 'artifact', 'Medallion of Karabor', 'Original interpretation of the medallion; it marks the quest and access chain, not a verified item model.', ['akama-promise-quest', 'akama-distraction-quest'], 'medallion-of-karabor', 'medallion-of-karabor.research.webp', 0.86],
  ['medallion-fragments', 'artifact', 'Medallion fragments', 'Original illustrative fragments for the quest objective. Their shapes are not canonical item art.', ['akama-oronu-quest', 'akama-corruptors-quest'], 'medallion-shards', 'medallion-shards.research.webp', 0.8],
  ['time-phased-phylactery', 'artifact', 'Time-Phased Phylactery', 'Original interpretation of the soul artifact recovered in the Hyjal memory; no canonical model is claimed.', ['akama-hyjal-artifact-quest', 'akama-hostage-soul-quest'], 'time-phased-phylactery', 'time-phased-phylactery.research.webp', 0.86],
  ['ashtongue-cowl', 'artifact', 'Ashtongue Cowl', 'Original interpretation of the disguise item required for the Al’ar raid task.', ['akama-ruse-quest'], 'ashtongue-cowl', 'ashtongue-cowl.research.webp', 0.84],
  ['tablets-of-baari', 'artifact', 'Tablets of Baa’ri', 'Original interpretive stone tablet art; no inscription or exact in-game tablet appearance is asserted.', ['akama-tablets-baari-quest'], 'tablets-of-baari', 'tablets-of-baari.research.webp', 0.84],
];

const beats = [
  {
    id: 'karabor-under-illidan', title: 'Karabor under Illidan', environment: 'karabor-black-temple', location: 'black-temple',
    cast: ['akama', 'illidan-stormrage', 'magtheridon', 'ashtongue-deathsworn'],
    sources: ['akama-blizzard-black-temple-history', 'akama-bcc-story-so-far'], quest: 'Burning Crusade historical overview',
    text: 'Before a black name crowned the height, Karabor was the draenei’s sacred temple in Shadowmoon Valley. War and occupation stripped that name from its halls; the fortress became the Black Temple. Illidan seized it from Magtheridon, and the Broken under Akama joined his ranks. Their public allegiance did not reveal Akama’s private purpose. The quests that begin among Baa’ri’s tablets enter this inherited history, then ask what it has cost his people.',
  },
  {
    id: 'tablets-at-baari', title: 'Tablets at Baa’ri', environment: 'baari-ruins', location: 'baa-ri-ruins',
    cast: ['tablets-of-baari'], objects: ['tablets-of-baari'],
    sources: ['akama-bcc-phase3-black-temple', 'akama-black-temple-chain-locator', 'akama-tablets-baari-quest'], quest: 'Tablets of Baa’ri',
    text: 'The attunement begins at Baa’ri: a trail of tablets, orders and medallion fragments leads from Shadowmoon toward Akama. Aldor and Scryers receive different opening quests from their own camps; those alternatives later converge. They are not one adventurer’s combined route. The tablets and collection objectives open a path through the valley, but they do not establish that every fragment records a separate historical act.',
  },
  {
    id: 'orders-and-fragments', title: 'Orders and fragments', environment: 'baari-ruins', location: 'baa-ri-ruins',
    cast: ['oronu-the-elder', 'ashtongue-corruptors', 'medallion-fragments'], objects: ['medallion-fragments'],
    sources: ['akama-oronu-quest', 'akama-corruptors-quest', 'akama-black-temple-chain-locator'], quest: 'Oronu the Elder; The Ashtongue Corruptors',
    text: 'From the ruins, Oronu’s written orders and the Ashtongue shamans redirect the seeker through the valley. Their quest steps recover pieces of the Medallion of Karabor and lead deeper toward Akama. The targets and collection count are player progress, not a census of the tribe or a chain of distinct battles. The trail is valuable because it reveals that an apparent servant of Illidan has left instructions in trusted hands.',
  },
  {
    id: 'beneath-the-wardens-cage', title: 'Beneath the Warden’s Cage', environment: 'wardens-cage', location: 'wardens-cage',
    cast: ['akama'],
    sources: ['akama-bcc-phase3-black-temple', 'akama-reveal-quest'], quest: 'The Warden’s Cage',
    text: 'At the Warden’s Cage, a submerged pool hides a chamber beyond the outpost. There the seeker finds Akama, no longer merely a name in another commander’s orders. At this meeting the question changes: the search has found the leader, but his place beside Illidan still conceals what he means to do.',
  },
  {
    id: 'proof-of-allegiance', title: 'Proof of Allegiance', environment: 'wardens-cage', location: 'wardens-cage',
    cast: ['akama', 'ashtongue-deathsworn'],
    sources: ['akama-proof-allegiance-quest', 'akama-reveal-quest'], quest: 'Proof of Allegiance',
    text: 'Access to Akama is followed by a test of loyalty. The quest directs the seeker against Ashtongue whom Akama marks as a threat to his cover. This violence belongs to a controlled performance within the chain: his Deathsworn remain the trusted circle while his public service to Illidan is maintained. The objective is not evidence of a massacre of the tribe or that Akama has abandoned his people.',
  },
  {
    id: 'akama-and-maiev', title: 'Akama and Maiev', environment: 'secret-chamber', location: 'warden-hidden-pool',
    cast: ['akama', 'maiev-shadowsong'],
    sources: ['akama-reveal-quest'], quest: 'Akama',
    text: 'Akama explains the bargain behind the display. Illidan’s rule has made open revolt a danger to the Broken, so the plan must grow in secret. Maiev Shadowsong is imprisoned in Akama’s hidden quarters. She is no obedient instrument in his designs: her anger at Illidan and her own choices remain hers. Their uneasy meeting turns the chamber into a question of agency as well as escape.',
  },
  {
    id: 'seer-udalo-in-arcatraz', title: 'Seer Udalo in the Arcatraz', environment: 'arcatraz', location: 'arcatraz',
    cast: ['seer-udalo'],
    sources: ['akama-bcc-phase3-black-temple', 'akama-seer-udalo-quest'], quest: 'Seer Udalo',
    text: 'The next search leads to the Arcatraz, a crystalline prison suspended above Netherstorm. The seeker is sent to find Seer Udalo and discovers that the seer is already dead. The quest offers no return from death here; Akama receives a report and sends the seeker onward. A keeper of the Ashtongue secret has fallen far from Shadowmoon, leaving the living to interpret what he managed to leave behind.',
  },
  {
    id: 'the-word-atamal', title: 'The word Ata’mal', environment: 'arcatraz', location: 'arcatraz',
    cast: ['seer-udalo'],
    sources: ['akama-mysterious-portent-quest', 'akama-seer-udalo-quest'], quest: 'A Mysterious Portent',
    text: 'Udalo left only a single word, Ata’mal, on the floor. Akama reads it as the next place to seek. No fuller prophecy survives in the available quest record, and this fragment cannot bear more certainty than it contains. A name passes from the prison into the valley’s old temple terraces; the slender clue is enough to move the story, but not enough to reveal what waits there.',
  },
  {
    id: 'heart-of-fury', title: 'The Heart of Fury', environment: 'atamal-terrace', location: 'ata-mal-terrace',
    cast: ['akama', 'heart-of-fury'], objects: ['heart-of-fury'],
    sources: ['akama-atamal-terrace-quest'], quest: 'The Ata’mal Terrace',
    text: 'At Ata’mal Terrace, the seeker recovers the Heart of Fury. Akama recognizes it from Velen’s past and weighs the power it might give him against his people’s freedom. The quest account makes his choice clear: he will not free the Broken only to take Illidan’s place as their master. He sends the artifact onward to A’dal. This refusal gives the hidden plan its clearest purpose.',
  },
  {
    id: 'akama-promise-to-adal', title: 'Akama’s promise to A’dal', environment: 'shattrath-terrace', location: 'shattrath-terrace-of-light',
    cast: ['akama', 'adal', 'medallion-of-karabor'], objects: ['medallion-of-karabor'],
    sources: ['akama-promise-quest', 'akama-bcc-phase3-black-temple'], quest: 'Akama’s Promise',
    text: 'In Shattrath, Akama places the Heart within the Medallion of Karabor and sends it to A’dal. His promise is to stand with the seeker against Illidan; this closes the first Akama chain. The medallion links Karabor’s sacred name to a dangerous plan, but its delivery does not open the raid or free Akama’s soul. The harder struggle still waits inside the Black Temple.',
  },
  {
    id: 'olum-found', title: 'The secret is found', environment: 'serpentshrine', location: 'serpentshrine-cavern',
    cast: ['seer-olum', 'coilfang-naga'],
    sources: ['akama-bcc-phase3-black-temple', 'akama-secret-compromised-quest'], quest: 'The Secret Compromised',
    text: 'After the first chain and a separate raid gate, Seer Olum appears in Serpentshrine Cavern. He tells the seeker that Vashj’s followers uncovered the Deathsworn’s secret and tortured him for it. This is an access-dependent encounter in the Burning Crusade quest order, not proof that the raid gate caused Akama’s conspiracy. Olum has kept silent; now the plan is endangered, and Akama must choose what one friend can bear.',
  },
  {
    id: 'olums-last-choice', title: 'Olum’s last choice', environment: 'wardens-cage', location: 'wardens-cage',
    cast: ['akama', 'seer-olum', 'kael-thas-sunstrider'],
    sources: ['akama-secret-compromised-quest'], quest: 'The Secret Compromised',
    text: 'At the Warden’s Cage, Olum chooses the spirit world rather than risk giving his captors the secret. Akama helps him die among his brothers. Illidan’s suspicion then demands another act: Akama reports a genuine betrayal by Kael’thas, diverting attention from the Ashtongue plot. Olum’s sacrifice leaves no triumph in its wake. It preserves the cover at the cost of one of the plan’s oldest companions.',
  },
  {
    id: 'ruse-of-the-ashtongue', title: 'Ruse of the Ashtongue', environment: 'tempest-eye', location: 'tempest-keep-eye',
    cast: ['alar', 'kael-thas-sunstrider', 'ashtongue-cowl'], objects: ['ashtongue-cowl'],
    sources: ['akama-ruse-quest', 'akama-secret-compromised-quest'], quest: 'Ruse of the Ashtongue',
    text: 'The ruse is tested in Tempest Keep. Wearing an Ashtongue Cowl, the seeker kills Al’ar, Kael’thas’s phoenix, under the appearance of obeying Illidan. The chain calls for this deed after Olum’s death because Akama needs Illidan to trust the outward story again. It is a raid task used to preserve a disguise, not evidence that the Ashtongue have openly begun their assault.',
  },
  {
    id: 'hyjal-memory', title: 'A memory at Mount Hyjal', environment: 'hyjal-memory', location: 'hyjal-summit-memory',
    cast: ['rage-winterchill', 'time-phased-phylactery'], objects: ['time-phased-phylactery'], temporal: true,
    sources: ['akama-hyjal-artifact-quest', 'akama-bcc-phase3-black-temple'], quest: 'An Artifact From the Past',
    text: 'Akama seeks the Time-Phased Phylactery once held by Rage Winterchill. The path sends the adventurer into the Caverns of Time and a memory of the Battle of Mount Hyjal, where the artifact is recovered. This is not present-day travel from Outland into the Third War. A separate raid attunement is required to enter Hyjal; that gate is a game condition, not the cause of Akama’s plan.',
  },
  {
    id: 'hostage-soul', title: 'The hostage soul', environment: 'karabor-black-temple', location: 'black-temple',
    cast: ['akama', 'time-phased-phylactery'], objects: ['time-phased-phylactery'],
    sources: ['akama-hostage-soul-quest', 'akama-hyjal-artifact-quest'], quest: 'The Hostage Soul',
    text: 'When the phylactery returns to Akama, its power over souls makes his design plain: his own soul is imprisoned in the Black Temple, apart from the leader his people see. He intends to reclaim control of it before facing Illidan. The discovery makes this long deception personal without erasing its wider stakes. The quest records a plan and an intended use, not certainty that the artifact will succeed.',
  },
  {
    id: 'diversion-at-the-southern-wall', title: 'A diversion at the southern wall', environment: 'southern-entry', location: 'black-temple-southern-entry',
    cast: ['akama', 'maiev-shadowsong', 'ashtongue-deathsworn', 'xi-ri'],
    sources: ['akama-distraction-quest', 'akama-bcc-phase3-black-temple'], quest: 'A Distraction for Akama',
    text: 'Entry comes by a raid-scale diversion. Xi’ri and the Sha’tar draw Illidan’s defenders outward while Akama, Maiev and the Deathsworn move on the fortress. Maiev pursues her own vengeance, and Akama continues with his people when she breaks from the plan. At the southern wall they pass through an opening; the account leaves the rest of the temple’s defences untold.',
  },
  {
    id: 'seek-the-ashtongue', title: 'Find the Ashtongue', environment: 'bt-refectory', location: 'black-temple-refectory',
    cast: ['akama', 'seer-kanai', 'ashtongue-deathsworn'],
    sources: ['akama-seek-ashtongue-quest', 'akama-distraction-quest'], quest: 'Seek Out the Ashtongue',
    text: 'Inside the Black Temple, the seeker finds Akama’s Deathsworn and Seer Kanai. Their message is simple: Akama needs help. The campaign has crossed from a concealed valley plan to a confrontation within Illidan’s fortress. The Ashtongue have not yet escaped his influence; their leader’s soul remains bound, and the next task is to break that hold before the people can turn together.',
  },
  {
    id: 'shade-of-akama', title: 'The Shade of Akama', environment: 'bt-inner-sanctuary', location: 'black-temple-sanctuary',
    cast: ['akama', 'shade-of-akama', 'ashtongue-deathsworn'],
    sources: ['akama-redemption-quest', 'akama-blizzard-black-temple-raid-guide'], quest: 'Redemption of the Ashtongue',
    text: 'With help from the adventurers, Akama defeats his Shade and reclaims the soul held apart from him. The Ashtongue turn from Illidan’s sway; the blow against the Betrayer begins within the tribe before it reaches the summit. Open resistance had seemed too dangerous for a people already brought close to ruin. The story marks a change in agency, not a claim that every Broken in Outland has joined the same revolt.',
  },
  {
    id: 'the-seers-open-the-way', title: 'The seers open the way', environment: 'temple-summit', location: 'temple-summit',
    cast: ['akama', 'seer-udalo', 'seer-olum'],
    sources: ['akama-blizzard-black-temple-raid-guide', 'akama-redemption-quest'], quest: 'Black Temple raid sequence after the Illidari Council',
    text: 'After the Council, the spirits of Udalo and Olum open the way to Illidan’s sanctum. Their work has not been forgotten: one left the word that led Akama toward Ata’mal; the other gave his life to guard the hidden plan. Now both seers act beyond death. The other trials fade from view as their purpose brings the company to Illidan’s door.',
  },
  {
    id: 'fall-of-the-betrayer', title: 'The fall of the Betrayer', environment: 'illidan-sanctum', location: 'illidan-sanctum',
    cast: ['akama', 'illidan-stormrage', 'ashtongue-deathsworn'],
    sources: ['akama-fall-betrayer-quest', 'akama-blizzard-black-temple-raid-guide'], quest: 'The Fall of the Betrayer',
    text: 'At last, Akama and the adventurers face Illidan atop the Black Temple. The Betrayer’s fall ends the Burning Crusade quest that carried the seeker from Baa’ri through the raids and into the fortress. Akama has reclaimed his soul, and the Ashtongue have risen from Illidan’s control. The tale leaves Karabor’s later fate and Akama’s rule unspoken.',
  },
];

for (const source of sources) await write(`data/sources/${source.id}.research.json`, source);

const sourceIds = sources.map((source) => source.id);
const sourceMap = new Map(sources.map((source) => [source.id, source]));
const placeMap = new Map(locations.map(([id, name, ids]) => [id, { id, name, sourceIds: ids }]));
const entityInfo = new Map();

for (const [id, type, name, interpretation, entitySources, , filename, scale] of visualAssets) {
  const asset = `images/storylines/akama-black-temple/${filename}`;
  const record = {
    id,
    type,
    name,
    slug: id,
    shortDescription: `${name}, represented in the Akama and Black Temple research story.`,
    body: `${interpretation} This is original AI-generated artwork for the story theater, not licensed game art, canonical model evidence, an exact costume claim or proof of co-presence. See the research and visual asset ledgers.`,
    firstEraId: eraId,
    featuredEraIds: [eraId],
    sourceIds: entitySources,
    tags: ['akama-story', 'interpretive-art'],
    contentStatus: 'research',
  };
  if (type === 'character') record.mapFigure = { asset, scale };
  else record.mapVisual = { asset, scale };
  entityInfo.set(id, record);
  await write(`data/entities/${id}.research.json`, record);
}

for (const [id, name, refs] of locations) {
  const body = `A named place used in the Akama and Black Temple quest account. Its environmental image is an original interpretive scene, not an exact surveyed location, terrain reconstruction, dungeon floor plan or proof of travel route. Matching TBC area traits and the original-client comparison status are in the visual asset ledger.`;
  const record = {
    id, type: 'location', name, slug: id,
    shortDescription: `${name}, a named setting in the Akama and Black Temple research story.`,
    body, firstEraId: eraId, featuredEraIds: [eraId], sourceIds: refs,
    tags: ['akama-story', 'story-setting'], contentStatus: 'research',
  };
  entityInfo.set(id, record);
  await write(`data/entities/${id}.research.json`, record);
}

const illidanPath = path.join(root, 'data/entities/illidan-stormrage.research.json');
const illidan = JSON.parse(await readFile(illidanPath, 'utf8'));
illidan.featuredEraIds = [...new Set([...(illidan.featuredEraIds ?? []), eraId])];
illidan.sourceIds = [...new Set([...illidan.sourceIds, 'akama-bcc-story-so-far', 'akama-blizzard-black-temple-history', 'akama-blizzard-black-temple-raid-guide', 'akama-fall-betrayer-quest'])];
illidan.tags = [...new Set([...(illidan.tags ?? []), 'akama-story'])];
illidan.body = `${illidan.body.replace(/\s*For the Age of Adventurers,.*$/s, '')} For the Age of Adventurers, the map renderer uses a separate era-specific figure of Illidan in Outland while preserving this ancient portrait as the default.`;
illidan.mapFigure = {
  ...illidan.mapFigure,
  eraVariants: [
    ...(illidan.mapFigure.eraVariants ?? []).filter((variant) => variant.eraId !== eraId),
    { eraId, asset: 'images/storylines/akama-black-temple/illidan-outland.research.webp', scale: 0.9 },
  ],
};
entityInfo.set('illidan-stormrage', illidan);
await write('data/entities/illidan-stormrage.research.json', illidan);

await write(`data/worldspaces/${worldspaceId}.research.json`, {
  id: worldspaceId,
  name: 'Akama and the Black Temple — relational story theater',
  slug: worldspaceId,
  coordinateSystem: { width: 10000, height: 10000, origin: 'bottom-left', units: 'atlas-units' },
});

const allCastIds = [...new Set([...visualAssets.map((record) => record[0]), 'illidan-stormrage'])];
const placementFeatures = allCastIds.map((entityId, index) => {
  const column = index % 5;
  const row = Math.floor(index / 5);
  const featureId = `${storyId}-${entityId}-focus`;
  return {
    type: 'Feature',
    id: featureId,
    properties: {
      name: `${entityInfo.get(entityId).name} editorial story focus`,
      contentStatus: 'research',
      styleRole: 'site',
      geographicCertainty: 'unknown',
    },
    geometry: { type: 'Point', coordinates: [2500 + column * 1250, 4750 + row * 80] },
  };
});
await write(`data/geometry/${worldspaceId}-theater.research.geojson`, {
  type: 'FeatureCollection', features: placementFeatures,
});

const featureByEntity = new Map(placementFeatures.map((feature) => [feature.id.split(`${storyId}-`).at(-1).replace(/-focus$/, ''), feature.id]));
const spatialStates = allCastIds.map((entityId) => {
  const entity = entityInfo.get(entityId);
  return {
    id: `${storyId}-${entityId}-theater`,
    entityId,
    eraId,
    worldspaceId,
    geometryId: featureByEntity.get(entityId),
    placementKind: 'relational',
    geographicCertainty: 'unknown',
    sourceIds: entity.sourceIds,
    editorNote: `Editorial ${entity.name} placement in an illustrated story theater; it asserts no atlas coordinate, travel route, exact formation or unsupported co-presence. Era-specific art and area comparison status are recorded in docs/research/akama-black-temple-visual-assets.json.`,
    visualPresence: 'contextual',
    labelPriority: 240 - allCastIds.indexOf(entityId),
  };
});
for (const state of spatialStates) await write(`data/spatial-states/${state.id}.research.json`, state);

const mapStateByEnvironment = new Map();
for (const env of environment) {
  const id = `${storyId}-${env.id}-scene`;
  const assetPath = `images/storylines/akama-black-temple/${env.map}.research.webp`;
  mapStateByEnvironment.set(env.id, id);
  await write(`data/map-states/${id}.research.json`, {
    id,
    name: `Akama story: ${env.place}`,
    worldspaceId,
    presentation: 'relational',
    terrainTextureAsset: assetPath,
    geometryIds: [],
    cartographyLabel: 'ILLUSTRATED QUESTLINE THEATER',
    interpretationNote: `Original AI-generated scene inspired by ${env.place}. Recognizable TBC-era area traits to preserve: ${env.traits} Figures and objects are editorial story placements, not a literal event composition or geographic map; no surveyed point, dungeon floor plan or travel route is asserted. Reference edition: original World of Warcraft: The Burning Crusade, patches 2.0.3–2.4.3; Black Temple content begins with patch 2.1.0. Resemblance review against the matching in-client build remains an explicit human gate. See docs/research/akama-black-temple-visual-assets.json.`,
  });
}

const eventIdByBeat = new Map(beats.map((beat) => [beat.id, `${storyId}-${beat.id}-event`]));
const claimIdByBeat = new Map(beats.map((beat) => [beat.id, `${storyId}-${beat.id}-claim`]));
const nodeIds = beats.map((beat) => `${storyId}-story-${beat.id}`);
const nodes = [];

for (const [index, beat] of beats.entries()) {
  const nodeId = nodeIds[index];
  const location = placeMap.get(beat.location);
  const visibleEntityIds = [...new Set([...(beat.cast ?? []), ...(beat.objects ?? [])])];
  const participants = visibleEntityIds.filter((id) => ['character', 'faction', 'other'].includes(entityInfo.get(id)?.type));
  const citationIds = beat.sources.map((sourceId, sourceIndex) => `${nodeId}-citation-${sourceIndex + 1}`);
  const claimId = claimIdByBeat.get(beat.id);
  const eventId = eventIdByBeat.get(beat.id);

  for (const [sourceIndex, sourceId] of beat.sources.entries()) {
    const source = sourceMap.get(sourceId);
    const citation = {
      id: citationIds[sourceIndex],
      sourceId,
      section: `${beat.quest}; quest objective, description, sequence or raid guide section relevant to this narrow paraphrase.`,
      note: source.sourceType === 'website'
        ? 'First-party retrospective / Classic locator used narrowly. It does not substitute for original 2007 quest capture.'
        : 'Secondary quest-text locator; paraphrased for research and awaiting comparison with the matching original TBC client build.',
      questId: beat.quest,
    };
    await write(`data/citations/${citation.id}.research.json`, citation);
  }

  const event = {
    id: eventId,
    kind: 'event',
    name: beat.title,
    slug: `${storyId}-${beat.id}`,
    eraId,
    worldspaceId,
    date: { precision: 'relative', label: beat.temporal ? 'Third War battle represented as a Caverns of Time memory; the quest instance is later, exact in-world dating unknown' : index === 0 ? 'Before the Burning Crusade; Illidan’s seizure of Karabor is described retrospectively, exact date unknown' : 'Burning Crusade quest chronology; exact in-world dating unknown' },
    summary: beat.text,
    locationIds: [location.id],
    participantEntityIds: participants,
    sourceIds: beat.sources,
    claimIds: [claimId],
    contentStatus: 'research',
  };
  if (beat.id === 'ruse-of-the-ashtongue') event.causedByEventIds = [eventIdByBeat.get('olums-last-choice')];
  if (beat.id === 'hostage-soul') event.causedByEventIds = [eventIdByBeat.get('hyjal-memory')];
  if (beat.id === 'shade-of-akama') event.causedByEventIds = [eventIdByBeat.get('seek-the-ashtongue')];
  await write(`data/events/${eventId}.research.json`, event);
  await write(`data/claims/${claimId}.research.json`, {
    id: claimId,
    subjectId: eventId,
    predicate: 'questline_scene_account',
    value: beat.text,
    citationIds,
    confidence: 'strongly_supported',
    status: 'active',
    editorNote: 'Original paraphrase for research status. All source text is reproduced through secondary quest locators or later official retrospectives; compare with the original TBC client before lore approval.',
  });

  const durationMs = Math.ceil(beat.text.trim().split(/\s+/u).length * 60000 / 82) + 5000;
  const actions = [{ type: 'set_map_state', mapStateId: mapStateByEnvironment.get(beat.environment) }];
  for (const entityId of visibleEntityIds) actions.push({ type: 'highlight_entity', entityId });
  nodes.push({
    id: nodeId,
    guideId,
    title: `${beat.temporal ? 'Memory · ' : ''}${beat.title}`,
    narration: beat.text,
    durationMs,
    eventIds: [eventId],
    entityIds: visibleEntityIds,
    locationIds: [location.id],
    camera: { position: [0, 6.1, 5.2], target: [0, 0, 0], durationMs: 1100 },
    visualActions: actions,
    ...(existingVoiceovers.has(nodeId) ? { voiceover: existingVoiceovers.get(nodeId) } : {}),
    ...(index > 0 ? { previousNodeId: nodeIds[index - 1] } : {}),
    ...(index < beats.length - 1 ? { nextNodeIds: [nodeIds[index + 1]] } : {}),
  });
}

const guide = {
  id: guideId,
  eraId,
  title: 'Akama and the Black Temple',
  description: 'A twenty-scene illustrated Burning Crusade chronicle follows Akama’s hidden purpose, Olum’s sacrifice, the campaign through raid gates, and the Ashtongue struggle inside the Black Temple.',
  nodeIds,
  contentStatus: 'research',
};
await write(`data/stories/${storyId}.research.json`, { guide, nodes });

const storyline = {
  id: storyId,
  slug: storyId,
  title: 'Akama and the Black Temple',
  summary: 'Akama hides a plan for the Broken beneath a show of service to Illidan. A trail from Baa’ri to the Black Temple follows his choices, the cost of secrecy, and the recovery of his soul.',
  opening: 'Karabor’s darkened temple rules the height above Shadowmoon. Beneath its walls, Akama’s people keep a secret the Betrayer must not discover.',
  primaryEraId: eraId,
  eraIds: [eraId],
  chapters: [
    { id: 'the-temple-and-the-hidden-plan', eraId, title: 'The temple and the hidden plan', body: 'Karabor’s history, the two faction-specific quest starts, Akama’s hidden chamber, and the guarded proof of allegiance. Scenes 1–6.' },
    { id: 'the-seers-warning', eraId, title: 'The seer’s warning', body: 'Udalo’s death and clue, the Heart of Fury, and Akama’s promise to A’dal. Scenes 7–10.' },
    { id: 'a-secret-under-pressure', eraId, title: 'A secret under pressure', body: 'Olum’s discovery, his sacrifice, the Al’ar ruse, the Hyjal memory, and Akama’s hostage soul. Scenes 11–15.' },
    { id: 'inside-the-black-temple', eraId, title: 'Inside the Black Temple', body: 'The southern-wall diversion, the Deathsworn, Akama’s Shade, the seers’ aid, and Illidan’s defeat. Scenes 16–20.' },
  ],
  sourceIds,
  storyGuideId: guideId,
  reviewNote: 'Complete illustrated twenty-scene research story with original environmental scenes and distinct story figures/objects, source and claim links for every node, accessible transcript playback, and generated voice-over. Original TBC quest/build capture and a human comparison against the matching 2.4.3 client/model remain open; all records stay at research status. The Aldor and Scryer openings and Hyjal raid access are explicit alternatives/mechanics, not events that every adventurer personally combined. The Hyjal scene is labeled a historical time instance. The story ends with Illidan’s TBC defeat and makes no claim that Karabor was immediately restored or imports later Legion/Cataclysm outcomes.',
  contentStatus: 'research',
};
await write(`data/storylines/${storyId}.research.json`, storyline);

const tourPath = path.join(root, 'data/story-tours/classic-to-wrath.research.json');
const tour = JSON.parse(await readFile(tourPath, 'utf8'));
const tourEntries = new Map(tour.entries.map((entry) => [entry.storylineId, entry]));
tourEntries.set(storyId, {
  storylineId: storyId,
  regionIds: ['outland', 'kalimdor'],
  mapPositionPercent: [91, 66],
  order: 5,
  periodLabel: 'The Burning Crusade · Black Temple, patch 2.1',
  locationLabel: 'Shadowmoon Valley · raids across Outland · Hyjal memory',
});
const order = [
  'stormwind-onyxia-conspiracy', 'scepter-of-the-shifting-sands', 'dungeon-set-two-veiled-blade',
  'karazhan-masters-key-and-nightbane', storyId, 'cipher-of-damnation-oronok', 'wrathgate-and-undercity',
];
for (const [index, id] of order.entries()) {
  const entry = tourEntries.get(id);
  if (entry) entry.order = index + 1;
}
tour.entries = [...tourEntries.values()].sort((a, b) => a.order - b.order);
tour.chronologyNote = 'Play-all order is an editorial expansion-era sequence: original Classic (Onyxia, Scepter, then the 1.10-era Dungeon Set 2 story), followed by The Burning Crusade (Karazhan, then Akama and the Black Temple, then the Cipher of Damnation preview), and Wrath of the Lich King (Wrathgate preview). The TBC placements organize this map and do not claim that the stories caused one another; Akama’s raid gates are not all episodes of one historical campaign. The Scepter’s ancient prologue is a flashback; Dungeon Set 2 memorial accounts are alternatives; Karazhan’s key and Nightbane chains are linked editorially. Akama’s Hyjal passage is a historical time-instance. Off-world and map-marker layouts are editorial only.';
tour.reviewNote = 'Playable stories: Onyxia, Scepter, Dungeon Set 2, Karazhan and Akama / Black Temple. The Outland Cipher of Damnation and Northrend Wrathgate remain previews outside Play all. The Akama story is a complete research preview with a distinct guide and original illustrations; original TBC quest capture, 2.4.3 location/model comparison, human lore review, and audio audition remain open. The map markers are not exact locations or travel routes.';
await write('data/story-tours/classic-to-wrath.research.json', tour);

const sourceSheets = [
  { artifactId: 'exec-fe8657cd-4933-4624-9791-f2b9e5d999cc.png', role: 'Sixteen environment tiles', prompt: '4x4 contact sheet of separate original TBC-area environment paintings: Karabor/Black Temple, Baa’ri, Warden’s Cage, submerged chamber, Arcatraz, Ata’mal Terrace, Shattrath, Serpentshrine, Tempest Keep, Hyjal memory, Black Temple southern entry, Refectory, inner sanctuary, Council chamber, summit, and Illidan’s sanctum.' },
  { artifactId: 'exec-1dda610b-9054-4633-9af4-ef65be5b4e7f.png', role: 'Eight principal cast tiles', prompt: '4x2 transparent contact sheet of Akama, Maiev, the Ashtongue Deathsworn, Seer Udalo, Seer Olum, Xi’ri, Al’ar, and Seer Kanai.' },
  { artifactId: 'exec-51018dca-17d9-4ae3-a924-30ab23f26534.png', role: 'A’dal, Illidan and quest-object tiles', prompt: '4x2 transparent contact sheet of A’dal, Burning Crusade Illidan, the Medallion of Karabor, Heart of Fury, Time-Phased Phylactery, Ashtongue Cowl, medallion fragments, and a small crystal token.' },
  { artifactId: 'exec-505e495f-60da-44db-b065-1b2368564876.png', role: 'Secondary cast tiles', prompt: '4x2 transparent contact sheet of Kael’thas, Coilfang naga, Ashtongue Corruptors, Shade of Akama, Rage Winterchill, Magtheridon, Oronu the Elder, and Fathom-Lord Karathress.' },
  { artifactId: 'exec-5435913d-bbef-4cef-9b95-5be16bcb97af.png', role: 'Baa’ri quest-object tile', prompt: 'Transparent isolated cutout of interpretive ancient draenei stone Tablets of Baa’ri, with shallow abstract grooves and no readable writing.' },
];
const ledgerAssets = [];
for (const env of environment) {
  const beatsForAsset = beats.filter((beat) => beat.environment === env.id).map((beat) => `${storyId}-story-${beat.id}`);
  const bytes = await readFile(path.join(root, 'public', `images/storylines/akama-black-temple/${env.map}.research.webp`));
  ledgerAssets.push({
    assetId: env.map,
    role: 'environment',
    path: `images/storylines/akama-black-temple/${env.map}.research.webp`,
    sha256: createHash('sha256').update(bytes).digest('hex'),
    sourceArtifactId: sourceSheets[0].artifactId,
    prompt: `Original painted environment illustration cropped from the ${env.place} tile; ${env.traits}`,
    nodeIds: beatsForAsset,
    gameEdition: 'World of Warcraft: The Burning Crusade, original client build 2.0.3–2.4.3; Black Temple raid introduced in 2.1.0.',
    recognizableTraits: env.traits,
    comparisonSources: env.visualSourceIds.map((id) => ({ sourceId: id, url: sourceMap.get(id).url })),
    resemblanceReview: 'Locally rendered and inspected in story playback. Original 2.4.3 client screenshot/model comparison remains a human review gate; no canonical accuracy is claimed.',
  });
}
for (const [id, type, name, interpretation, , , filename] of visualAssets) {
  const bytes = await readFile(path.join(root, artDir, filename));
  const nodeIdsForAsset = beats.filter((beat) => [...(beat.cast ?? []), ...(beat.objects ?? [])].includes(id)).map((beat) => `${storyId}-story-${beat.id}`);
  const sheet = id === 'tablets-of-baari' ? sourceSheets[4]
    : ['akama', 'maiev-shadowsong', 'ashtongue-deathsworn', 'seer-udalo', 'seer-olum', 'xi-ri', 'seer-kanai', 'alar'].includes(id) ? sourceSheets[1]
      : ['adal', 'heart-of-fury', 'medallion-of-karabor', 'medallion-fragments', 'time-phased-phylactery', 'ashtongue-cowl'].includes(id) ? sourceSheets[2]
        : sourceSheets[3];
  ledgerAssets.push({
    assetId: id,
    role: type === 'artifact' ? 'pivotal-object' : type === 'faction' ? 'embodied-group' : 'character-or-narrative-actor',
    name,
    path: `images/storylines/akama-black-temple/${filename}`,
    sha256: createHash('sha256').update(bytes).digest('hex'),
    sourceArtifactId: sheet.artifactId,
    prompt: `${name}: ${interpretation}`,
    nodeIds: nodeIdsForAsset,
    resemblanceReview: 'Original interpretive art; inspect in playback. Game model, costume, and exact visual resemblance remain for human comparison with the matching TBC build.',
  });
}
const illidanBytes = await readFile(path.join(root, artDir, 'illidan-outland.research.webp'));
ledgerAssets.push({
  assetId: 'illidan-stormrage-outland', role: 'era-specific-character-figure', name: 'Illidan Stormrage',
  path: 'images/storylines/akama-black-temple/illidan-outland.research.webp',
  sha256: createHash('sha256').update(illidanBytes).digest('hex'),
  sourceArtifactId: sourceSheets[2].artifactId,
  prompt: 'Burning Crusade Illidan Stormrage: long pale hair, horns, blindfold, bat-like wings, paired curved warglaives, black armor and restrained fel-green light; original interpretation.',
  nodeIds: beats.filter((beat) => (beat.cast ?? []).includes('illidan-stormrage')).map((beat) => `${storyId}-story-${beat.id}`),
  resemblanceReview: 'The story renderer selects this image for Age of Adventurers while retaining Illidan’s ancient portrait as the default. Original TBC model comparison remains open.',
});
await write('docs/research/akama-black-temple-visual-assets.json', {
  storyId,
  status: 'complete research story; human source/build and resemblance review pending',
  referenceEdition: 'World of Warcraft: The Burning Crusade, original client 2.0.3–2.4.3; patch 2.1.0 adds the Black Temple and Hyjal raids; compare the final pre-Wrath 2.4.3 state.',
  sourceSheets,
  assets: ledgerAssets,
});

process.stdout.write(`Authored ${nodes.length} nodes, ${beats.length} events/claims, ${spatialStates.length} story-theater placements, ${ledgerAssets.length} documented images.\n`);
