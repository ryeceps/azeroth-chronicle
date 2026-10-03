import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const storyId = 'shattered-sun-and-sunwell';
const guideId = `${storyId}-guide`;
const worldspaceId = `${storyId}-story-theater`;
const eraId = 'age-of-adventurers';
const artRoot = 'images/storylines/shattered-sun-sunwell';
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
const distinct = (values) => [...new Set(values)];

const sources = [
  {
    id: 'sunwell-blizzard-fury-timeline', title: 'Fury of the Sunwell — WoW Timeline Chapter 14',
    url: 'https://worldofwarcraft.blizzard.com/en-us/story/timeline/chapter-14', sourceType: 'website',
    notes: 'Accessed 2026-10-03. Official Blizzard summary: after defeat in Outland Kael\'thas returns to Silvermoon and plots to use the Sunwell to summon Kil\'jaeden; the joint Shattered Sun Offensive and Horde/Alliance heroes stop them, and Velen helps purify the well. The page header incorrectly calls Fury of the Sunwell patch 2.3. Other 2.4 evidence is stronger; preserve, do not silently correct, the source discrepancy.',
  },
  {
    id: 'sunwell-blizzard-classic-release', title: 'Burning Crusade Classic: The Sunwell Plateau is Now Open!',
    url: 'https://worldofwarcraft.blizzard.com/en-us/news/23789253', sourceType: 'website',
    notes: 'Accessed 2026-10-03. First-party Blizzard overview of Fury of the Sunwell as the next TBC content update, the Shattered Sun campaign on Quel\'Danas, the small initial force and realm-wide staging, and the six raid bosses. Its Classic rollout differs from the 2008 original phase and gate release; do not use Classic server timing as historical chronology.',
  },
  {
    id: 'sunwell-shattered-sun-offensive', title: 'Shattered Sun Offensive',
    url: 'https://warcraft.wiki.gg/wiki/Shattered_Sun', sourceType: 'website',
    notes: 'Accessed 2026-10-03. Secondary index for original TBC campaign quests, the Scryers/Aldor introduction variants, Shattrath and Outland activity, and Isle objectives. Quest and patch mechanics are locators pending comparison with the original patch-2.4 client; server unlocks are gameplay.',
  },
  {
    id: 'sunwell-isle-phase-objectives', title: 'Isle of Quel\'Danas phases — Burning Crusade Classic guide',
    url: 'https://www.wowhead.com/tbc/guide/isle-of-queldanas-overview-burning-crusade-classic', sourceType: 'website',
    notes: 'Accessed 2026-10-03. Secondary gameplay guide to the island\'s phased objectives. Used only to identify the sequence of playable goals and to explicitly distinguish realm-wide progress from in-world chronology.',
  },
  {
    id: 'sunwell-patch-2-4', title: 'Patch 2.4.0',
    url: 'https://warcraft.wiki.gg/wiki/Patch_2.4.0', sourceType: 'website',
    notes: 'Accessed 2026-10-03. Secondary patch-history locator for the original release build/date and addition of Magisters\' Terrace and Sunwell Plateau in patch 2.4.0 (2008-03-25). Verify against archived Blizzard notes before editorial approval.',
  },
  {
    id: 'sunwell-magisters-terrace-quests', title: 'Magisters\' Terrace (Burning Crusade) quest sequence',
    url: 'https://warcraft.wiki.gg/wiki/Magisters%27_Terrace_%28Burning_Crusade%29', sourceType: 'quest',
    notes: 'Accessed 2026-10-03. Secondary locator for the Burning Crusade quest sequence that starts with Crisis at the Sunwell or Duty Calls, searches the Terrace for spy Tyrith, and continues through TBC dungeon quests. Treat this as a parallel island operation, not a universal prerequisite to the raid.',
  },
  {
    id: 'sunwell-magisters-terrace-area', title: 'Magisters\' Terrace (Burning Crusade Classic)',
    url: 'https://warcraft.wiki.gg/wiki/Magisters%27_Terrace_%28BC_Classic%29', sourceType: 'website',
    notes: 'Accessed 2026-10-03. Secondary TBC dungeon and encounter locator; used for the Kael\'thas encounter at the Terrace. Original patch-2.4 dungeon text/model comparison remains open.',
  },
  {
    id: 'sunwell-original-raid', title: 'Sunwell Plateau (original)',
    url: 'https://warcraft.wiki.gg/wiki/Sunwell_Plateau_%28original%29', sourceType: 'website',
    notes: 'Accessed 2026-10-03. Secondary section-scoped locator for the original TBC raid\'s named encounters and broad resolution. Later chronology and expansion material on the same page is excluded.',
  },
  {
    id: 'sunwell-epilogue-transcript', title: 'Sunwell Plateau epilogue',
    url: 'https://warcraft.wiki.gg/wiki/Sunwell_Plateau_epilogue', sourceType: 'website',
    notes: 'Accessed 2026-10-03. Secondary transcript locator for the original game epilogue with Prophet Velen and Lady Liadrin, the former naaru M\'uru\'s heart and the Sunwell\'s restoration. Original client capture is still required before human approval.',
  },
  {
    id: 'sunwell-kalecgos-encounter', title: 'Kalecgos raid encounter',
    url: 'https://warcraft.wiki.gg/wiki/Kalecgos_%28tactics%29', sourceType: 'quest',
    notes: 'Accessed 2026-10-03. Secondary encounter locator for the two forms/stages of the Kalecgos fight and Sathrovarr\'s control. Used to find the original fight and dialogue for TBC-client review, not as a replacement for it.',
  },
  {
    id: 'sunwell-brutallus-encounter', title: 'Brutallus',
    url: 'https://warcraft.wiki.gg/wiki/Brutallus', sourceType: 'website',
    notes: 'Accessed 2026-10-03. Secondary encounter locator for Brutallus\' fight with Madrigosa and death in the original Sunwell Plateau raid.',
  },
  {
    id: 'sunwell-madrigosa-felmyst', title: 'Madrigosa and Felmyst',
    url: 'https://warcraft.wiki.gg/wiki/Madrigosa', sourceType: 'website',
    notes: 'Accessed 2026-10-03. Secondary account of the encounter sequence in which Brutallus kills Madrigosa and his fel blood raises her body as Felmyst. Dialogue is not copied. Confirm the raid scene in the original client.',
  },
  {
    id: 'sunwell-eredar-twins', title: 'Eredar Twins encounter',
    url: 'https://warcraft.wiki.gg/wiki/Eredar_Twins', sourceType: 'website',
    notes: 'Accessed 2026-10-03. Secondary encounter index naming Lady Sacrolash and Grand Warlock Alythess as a paired Sunwell Plateau encounter. Their motives are not inferred.',
  },
  {
    id: 'sunwell-muru-encounter', title: 'M\'uru raid encounter',
    url: 'https://warcraft.wiki.gg/wiki/M%27uru_%28tactics%29', sourceType: 'website',
    notes: 'Accessed 2026-10-03. Secondary original-raid locator for Kael\'thas taking M\'uru from Silvermoon and the Sunwell Plateau M\'uru/Entropius encounter. The epilogue is the separate source for Velen\'s interpretation and the heart.',
  },
  {
    id: 'sunwell-kiljaeden-encounter', title: 'Kil\'jaeden raid encounter',
    url: 'https://warcraft.wiki.gg/wiki/Kil%27jaeden_%28tactics%29', sourceType: 'website',
    notes: 'Accessed 2026-10-03. Secondary transcript locator for the TBC encounter phases where Anveena, Kalecgos and the blue dragonflight act. It is not an original-client capture; avoid importing biography material from the comics or later expansions.',
  },
];
for (const source of sources) {
  await write(`data/sources/${source.id}.research.json`, { ...source, notes: `${source.notes}\n\nStory status: research; compare relevant content with the original Burning Crusade patch-2.4 client before human review.` });
}

const environments = [
  { id: 'silvermoon-return', title: 'Kael\'thas returns to Silvermoon', location: 'silvermoon-city', asset: `${artRoot}/silvermoon-return.webp`, sources: ['sunwell-blizzard-fury-timeline'], traits: 'Burning Crusade-era high-elven city view: pale ivory masonry, graceful red-gold towers and bridges, restrained red banners, distant arcane fel glow. This is Silvermoon, separate from the island and dungeon scenes.', promptBrief: 'Original 2007 TBC-style Silvermoon: ivory high-elven city, restrained red/gold, small distant fel corruption; no later redesign.' },
  { id: 'sunwell-founding-memory', title: 'The Sunwell founded', location: 'sunwell-ancient', asset: `${artRoot}/sunwell-founding-memory.webp`, sources: ['warcraft-chronicle-volume-1', 'blizzard-burning-crusade-story-so-far'], traits: 'Interpretive earlier-state high-elven sanctuary: pale carved stone, quiet gold ornament, old forest and clear arcane water. It is a memory, not the TBC patch-2.4 map or a surveyed reconstruction.', promptBrief: 'Interpretive ancient Sunwell sanctuary: pale stone, antique gold, forest and quiet water before the Scourge; no people.' },
  { id: 'sunwell-scourge-fall', title: 'The Sunwell after the Scourge', location: 'sunwell-ancient', asset: `${artRoot}/sunwell-scourge-fall.webp`, sources: ['warcraft-chronicle-volume-3', 'blizzard-warcraft-iii-reforged-overview'], traits: 'Brief pre-TBC flashback to a defiled high-elven fount: pale gold arches and broken paving under ash, with a contained sickly green corruption. No later Void design or present-day rebuild.', promptBrief: 'Interpretive Scourge-era Sunwell aftermath: white stone and gold tainted by dark water and faint fel-green contamination.' },
  { id: 'shattrath-offensive-briefing', title: 'Shattrath and the joint offensive', location: 'shattrath-terrace-of-light', asset: `${artRoot}/shattrath-offensive-briefing.webp`, sources: ['sunwell-blizzard-fury-timeline', 'sunwell-blizzard-classic-release', 'sunwell-shattered-sun-offensive'], traits: 'Terrace of Light view with pale angular draenei stone, a luminous naaru presence, blood-elf red/gold and draenei blue-gray accents. Environmental figures deliberately communicate cooperation; not an exact historic formation or a named roster.', promptBrief: 'Burning Crusade Shattrath Terrace of Light: pale draenei stone, floating naaru, distinct blood-elf and draenei troops cooperating.' },
  { id: 'quel-danas-offensive', title: 'The Quel\'Danas foothold', location: 'isle-of-quel-danas', asset: `${artRoot}/quel-danas-offensive.webp`, sources: ['sunwell-blizzard-classic-release', 'sunwell-shattered-sun-offensive', 'sunwell-isle-phase-objectives'], traits: 'TBC Quel\'Danas coastal pale limestone, restrained red-gold blood-elf architecture and nearby Shattered Sun staging tents, with the besieged plateau in the distance. It does not name an exact route or battle position.', promptBrief: 'TBC Quel\'Danas coast and temporary Offensive staging area: pale limestone, red-gold elven towers, sea and a fel-threatened plateau.' },
  { id: 'outland-support-front', title: 'Outland support fronts', location: null, asset: `${artRoot}/outland-support-front.webp`, sources: ['sunwell-shattered-sun-offensive', 'sunwell-isle-phase-objectives'], traits: 'Relational panorama of Outland\'s broken red ground, floating rock, violet sky, isolated towers and scattered outposts. This is a campaign montage, not a geographic map, supply route, or claimed sequence between zones.', promptBrief: 'TBC Outland support missions as a relational panorama of shattered terrain and separated outposts; no routes or map pins.' },
  { id: 'magisters-terrace', title: 'The Magisters\' Terrace', location: 'magisters-terrace-sunwell', asset: `${artRoot}/magisters-terrace.webp`, sources: ['sunwell-magisters-terrace-quests', 'sunwell-magisters-terrace-area'], traits: 'Original-TBC Magisters\' Terrace cues: polished pale stone, red banners, antique gold, angular blue arcane panels and an open inner hall. It is not the raid\'s darker Sunwell chamber or a later rebuilding.', promptBrief: 'Original TBC Magisters\' Terrace: pale polished elven hall, red banners, gold edging and modest blue arcane glass.' },
  { id: 'sunwell-raid-corrupted', title: 'Sunwell Plateau raid chamber', location: 'sunwell-plateau-quel-danas', asset: `${artRoot}/sunwell-plateau-corrupted-chamber.webp`, sources: ['sunwell-blizzard-classic-release', 'sunwell-original-raid'], traits: 'A circular pre-restoration Sunwell room with curved pale elven columns, gold inlays and a fount under constrained fel corruption. This original environmental illustration is a relational theater, not an exact raid floor plan.', promptBrief: 'Original-TBC Sunwell raid chamber before purification: curved pale elven columns, antique gold, bright fount and a narrow fel breach.' },
  { id: 'sunwell-raid-renewed', title: 'The Sunwell restored', location: 'sunwell-plateau-quel-danas', asset: `${artRoot}/sunwell-renewed-epilogue.webp`, sources: ['sunwell-epilogue-transcript', 'sunwell-blizzard-fury-timeline'], traits: 'Same campaign setting after the original TBC epilogue: clear gold-white fount, pale stone and quiet water, with no fel. The separate M\'uru-heart figure remains a story actor/object, not a pixel in the background.', promptBrief: 'TBC Sunwell Plateau epilogue: same restrained pale-stone/gold chamber, clean clear fount and a renewed warm holy-arcane light.' },
];

const figures = [
  { id: 'kael-thas-sunwell-appearance', name: 'Kael\'thas Sunstrider', type: 'character', canonicalId: 'kael-thas-sunstrider', description: 'The same prince recorded as kael-thas-sunstrider, represented in his Burning Crusade Sunwell campaign guise. This appearance record is not a second person.', file: 'kael-thas-sunstrider.webp', scale: 1.05, promptBrief: 'TBC fallen blood-elf prince: pale hair, crimson and violet mage robes, antique gold, contained fel-green magic; single figure.' },
  { id: 'kalecgos-dragon-form', name: 'Kalecgos in dragon form', type: 'character', canonicalId: 'kalecgos', description: 'A TBC Sunwell appearance of the existing Kalecgos character in his true blue-dragon form; it does not replace the elven guise used in later story scenes.', file: 'kalecgos-dragon.webp', scale: 1.25, promptBrief: 'Azure-blue adult dragon Kalecgos, silver under-scales and restrained arcane blue; full coiled creature, separate from the elf guise.' },
  { id: 'sathrovarr-the-corruptor', name: 'Sathrovarr the Corruptor', type: 'character', description: 'Dreadlord controlling Kalecgos in the first TBC Sunwell encounter; original-raid visual comparison remains open.', file: 'sathrovarr.webp', scale: 0.95, promptBrief: 'TBC dreadlord in indigo and violet shadow armor with bat wings and a binding tether; solitary full-body cutout.' },
  { id: 'brutallus', name: 'Brutallus', type: 'character', description: 'Pit lord confronted at Sunwell Plateau; interpretive early-TBC raid-creature art, with model comparison still open.', file: 'brutallus.webp', scale: 1.15, promptBrief: 'Huge rust-red pit lord with horns, broad leathery wings, dark plate and cleaver; compact transparent raid cutout.' },
  { id: 'madrigosa', name: 'Madrigosa', type: 'character', description: 'Blue dragon who fights Brutallus in the original TBC raid account; this cutout is not a canonical model.', file: 'madrigosa.webp', scale: 1.25, promptBrief: 'Noble cobalt blue dragon with silver-blue under-scales and icy light, full coiled three-quarter silhouette.' },
  { id: 'felmyst', name: 'Felmyst', type: 'character', description: 'The fel dragon raised from Madrigosa\'s remains in the original raid account; the transformation is attributed to its secondary quest locator pending game review.', file: 'felmyst.webp', scale: 0.85, promptBrief: 'Felmyst as a desaturated skeletal blue dragon with green fel fire and a wide but readable wing silhouette.' },
  { id: 'eredar-twins', name: 'The Eredar Twins: Lady Sacrolash and Alythess', type: 'faction', description: 'One paired representation for the single named raid encounter; not two separate event claims or a claim of co-presence outside that encounter.', file: 'eredar-twins.webp', scale: 1.02, promptBrief: 'Paired TBC demon encounter, one violet and one crimson, both in fully covering robes and armor, two clear silhouettes.' },
  { id: 'muru-entropius', name: 'M\'uru / Entropius', type: 'character', description: 'The encounter\'s darkened, diminished naaru form, shown as the transformation named by Velen in the original raid epilogue; later M\'uru material is excluded.', file: 'muru-entropius.webp', scale: 0.98, promptBrief: 'Single floating faceted naaru with dim blue-gold light and violet-black corruption, the TBC M\'uru/Entropius encounter state.' },
  { id: 'kiljaeden-sunwell-appearance', name: 'Kil\'jaeden at the Sunwell', type: 'character', canonicalId: 'kiljaeden', description: 'The same demon recorded in the existing kiljaeden entity, represented at the TBC Sunwell threshold; this is not a second character.', file: 'kiljaeden.webp', scale: 1.06, promptBrief: 'TBC Kil\'jaeden: imposing red-skinned eredar, dark ember armor, controlled fel power; solitary full-body transparent cutout.' },
  { id: 'anveena-teague', name: 'Anveena Teague', type: 'character', description: 'TBC raid participant whose sacrifice weakens Kil\'jaeden in the encounter record. Her broader comic biography is outside this story.', file: 'anveena-teague.webp', scale: 0.92, promptBrief: 'Solemn young woman in modest pale cream and sky-blue robes with restrained light, interpretive TBC raid figure.' },
  { id: 'prophet-velen', name: 'Prophet Velen', type: 'character', description: 'Draenei prophet who appears in the raid epilogue and uses M\'uru\'s recovered heart at the Sunwell.', file: 'prophet-velen.webp', scale: 1.02, promptBrief: 'Elder blue draenei prophet with pale facial tendrils, ivory robes and silver crystal staff; TBC-era epilogue cutout.' },
  { id: 'lady-liadrin', name: 'Lady Liadrin', type: 'character', description: 'Blood Knight leader who appears with Velen in the original TBC epilogue; the art is an original, unreviewed interpretation.', file: 'lady-liadrin.webp', scale: 0.92, promptBrief: 'Blood-elf paladin leader in fully covering red-and-gold plate over pale cloth, battle-worn and helmetless.' },
  { id: 'lor-themar-theron', name: 'Lor’themar Theron', type: 'character', sources: ['sunwell-original-raid', 'sunwell-epilogue-transcript'], description: 'Blood-elf regent whose consideration of the still-tainted fount is reported after the Sunwell raid; the figure is an original, unreviewed early-TBC interpretation.', file: 'lor-themar-theron.webp', scale: 0.94, promptBrief: 'Early TBC blood-elf regent: pale blond hair, red cloth blindfold, crimson and antique-gold armor, dark red cloak, sword down at his side.' },
  { id: 'muru-heart', name: 'The recovered heart of M\'uru', type: 'artifact', description: 'The crystalline remnant Velen presents in the original raid epilogue; it is not the earlier whole M\'uru/Entropius form.', file: 'muru-heart.webp', scale: 0.62, promptBrief: 'Small, separate floating silver-white crystal heart with a pale blue-gold spark and clean silhouette.' },
];

const beats = [
  {
    id: 'a-fount-for-a-new-home', title: 'A fount for a new home', environment: 'sunwell-founding-memory', location: 'sunwell-ancient', characters: [], objects: [], participants: [],
    eventEraId: 'long-vigil-new-kingdoms', period: 'Era 5 prologue · before the Burning Crusade', refs: [{ sourceId: 'warcraft-chronicle-volume-1' }, { sourceId: 'blizzard-burning-crusade-story-so-far' }],
    narration: 'Long before this campaign, exiles from Kalimdor crossed to the northern Eastern Kingdoms and made Quel’Thalas their home. There, at a convergence of arcane power, they raised the Sunwell. Its waters became a center of their new nation and a source the blood elves would later struggle to live without. The people built their home around the fount, and all that followed would be measured against its loss.',
    note: 'A short Era 5 prologue, sourced separately from the Era 8 campaign. Do not import later Sunwell states or add unsourced foundation details.',
  },
  {
    id: 'a-sacred-water-defiled', title: 'A sacred water defiled', environment: 'sunwell-scourge-fall', location: 'sunwell-ancient', characters: [], objects: [], participants: [],
    eventEraId: 'third-war-frozen-throne', period: 'Era 7 prologue · the Third War', refs: [{ sourceId: 'warcraft-chronicle-volume-3' }, { sourceId: 'blizzard-warcraft-iii-reforged-overview' }],
    narration: 'When the Scourge reached Quel’Thalas, its advance ended in ruin for the kingdom. Arthas Menethil corrupted the Sunwell in the course of that invasion. The fount that had sustained the high elves was lost, leaving the surviving blood elves to seek other ways through their hunger for magic. Its loss cast a long shadow across the years ahead.',
    note: 'Use the existing Era 7 fall event as the authority. Keep this beat limited to the corruption and its consequence; exclude comic and later-expansion additions.',
  },
  {
    id: 'the-prince-returns', title: 'The prince returns', environment: 'silvermoon-return', location: 'silvermoon-city', characters: ['kael-thas-sunwell-appearance'], objects: [], participants: ['kael-thas-sunstrider'],
    period: 'The Burning Crusade · exact in-world date unknown', refs: [{ sourceId: 'sunwell-blizzard-fury-timeline' }, { sourceId: 'sunwell-blizzard-classic-release' }],
    narration: 'After his defeat in Outland, Kael’thas returned to Silvermoon. He betrayed the people he had promised to lead and turned toward a new design: using the Sunwell to summon Kil’jaeden. Thus the fount became an immediate danger once more, and an inheritance the blood elves could not reclaim.',
    note: 'Kael’thas’s return and plan are directly summarized by Blizzard. Preserve the patch-label conflict in the source record and do not infer an exact date.',
  },
  {
    id: 'shattrath-stands-together', title: 'Shattrath stands together', environment: 'shattrath-offensive-briefing', location: 'shattrath-terrace-of-light', characters: [], objects: [], participants: ['shattered-sun-offensive'],
    period: 'The Burning Crusade · Shattered Sun Offensive', refs: [{ sourceId: 'sunwell-blizzard-fury-timeline' }, { sourceId: 'sunwell-blizzard-classic-release' }],
    narration: 'In Shattrath, blood elves and draenei joined the Shattered Sun Offensive against Kael’thas and the Legion. The coalition crossed old divisions to confront a threat aimed at Quel’Thalas. Heroes of the Horde and Alliance also took part; together, they turned toward the endangered fount.',
    note: 'Blizzard supports the joint blood-elf/draenei task force and heroes from both factions. Crowd composition is interpretive environmental art, not a sourced formation or exact NPC roster.',
  },
  {
    id: 'two-calls-to-the-isle', title: 'Two calls to the Isle', environment: 'shattrath-offensive-briefing', location: 'shattrath-terrace-of-light', characters: [], objects: [], participants: ['shattered-sun-offensive'],
    period: 'The Burning Crusade · patch 2.4 quest entry', refs: [{ sourceId: 'sunwell-shattered-sun-offensive' }, { sourceId: 'sunwell-isle-phase-objectives' }],
    narration: 'From Shattrath came two calls to the isle’s work. Aldor agents sent the seeker north with “Crisis at the Sunwell,” while the Scryers offered “Duty Calls.” The choice began on opposite sides of the Terrace of Light, yet both led across the sea toward Quel’Danas and the staging ground near the fount.',
    note: 'The Aldor and Scryer leads are alternate quest openings. Their distinction is gameplay and faction choice; do not combine them as one required chain.',
  },
  {
    id: 'shorehead-on-quel-danas', title: 'A shorehead on Quel’Danas', environment: 'quel-danas-offensive', location: 'isle-of-quel-danas', characters: [], objects: [], participants: ['shattered-sun-offensive'],
    period: 'The Burning Crusade · patch 2.4 campaign', refs: [{ sourceId: 'sunwell-blizzard-classic-release' }, { sourceId: 'sunwell-shattered-sun-offensive' }, { sourceId: 'sunwell-isle-phase-objectives' }],
    narration: 'The first position on the island is small and exposed. The Offensive arrives with limited forces near the Sunwell Plateau, where blood elves aligned with Kael’thas and demons hold the way inward. From that shorehead, the scattered coalition begins to press the island and its guarded approach.',
    note: 'The small initial force and realm-wide gameplay progress are supported by the official retrospective. Do not use the generated view as an exact staging-area plan.',
  },
  {
    id: 'the-island-front-opens', title: 'The island front opens', environment: 'quel-danas-offensive', location: 'isle-of-quel-danas', characters: [], objects: [], participants: ['shattered-sun-offensive'],
    period: 'The Burning Crusade · patch 2.4 gameplay phases', refs: [{ sourceId: 'sunwell-shattered-sun-offensive' }, { sourceId: 'sunwell-isle-phase-objectives' }],
    narration: 'Across the sanctum, armory and harbor, the coalition presses against Kael’thas’s banners. Farther off, a portal opens toward Shattrath, widening the reach of the island front. Each gain brings the defenders nearer to the plateau and the fount they guard.',
    note: 'Names and gameplay phasing are a research locator. The sequence is explicitly described as server-wide unlock progression, not asserted as historical chronology.',
  },
  {
    id: 'outland-support-fronts', title: 'Outland supports the campaign', environment: 'outland-support-front', location: null, characters: [], objects: [], participants: ['shattered-sun-offensive'],
    period: 'The Burning Crusade · parallel offensive activity', refs: [{ sourceId: 'sunwell-shattered-sun-offensive' }, { sourceId: 'sunwell-isle-phase-objectives' }],
    narration: 'The Offensive’s work reached back into Outland as well. Bands struck Sunfury holdings and gathered what the campaign needed, while other soldiers held the island front. Each force bore its own burden beneath the broken sky, far from the shore of Quel’Danas.',
    note: 'Outland quests are parallel gameplay branches. Art is a non-geographic montage; no route or exact supply corridor is claimed.',
  },
  {
    id: 'the-missing-contact', title: 'The missing contact', environment: 'magisters-terrace', location: 'magisters-terrace-sunwell', characters: [], objects: [], participants: ['shattered-sun-offensive'],
    period: 'The Burning Crusade · Magisters’ Terrace quest path', refs: [{ sourceId: 'sunwell-magisters-terrace-quests' }],
    narration: 'An intelligence contact inside Magisters’ Terrace stops reporting. The Shattered Sun sends a search party into the blood-elf complex to find the missing spy and recover what they learned. Within those polished halls, the campaign meets another face of Kael’thas’s rule.',
    note: 'Tyrith and the spy assignment come from a secondary quest sequence locator. Original quest text and dungeon state need TBC-client comparison.',
  },
  {
    id: 'kael-at-the-terrace', title: 'Kael’thas at the Terrace', environment: 'magisters-terrace', location: 'magisters-terrace-sunwell', characters: ['kael-thas-sunwell-appearance'], objects: [], participants: ['kael-thas-sunstrider'],
    period: 'The Burning Crusade · parallel island operation', refs: [{ sourceId: 'sunwell-magisters-terrace-area' }, { sourceId: 'sunwell-magisters-terrace-quests' }, { sourceId: 'sunwell-blizzard-fury-timeline' }],
    narration: 'Elsewhere on the isle, the Shattered Sun confronts Kael’thas within Magisters’ Terrace. His stand ends there; at the plateau, the Sunwell remains beneath his design. The prince is stopped, yet the fount itself is still in danger.',
    note: 'The Terrace encounter and its quest order are secondary locators, while Blizzard supports the broad defeat of Kael’thas. Do not assert an exact date or that this dungeon is a universal raid prerequisite.',
  },
  {
    id: 'the-plateau-breach', title: 'The plateau breach', environment: 'sunwell-raid-corrupted', location: 'sunwell-plateau-quel-danas', characters: [], objects: [], participants: ['shattered-sun-offensive'],
    period: 'The Burning Crusade · Sunwell Plateau raid', refs: [{ sourceId: 'sunwell-blizzard-classic-release' }, { sourceId: 'sunwell-original-raid' }],
    narration: 'Beyond the island’s outer battles lies Sunwell Plateau, where Kael’thas has turned the fount toward his summoning. Demons and corrupted light gather around the heart of Quel’Thalas. The defenders must cross the high sanctum and reach the well itself.',
    note: 'Separate original patch progression from Burning Crusade Classic release behavior. This scene art is not a dungeon map.',
  },
  {
    id: 'kalecgos-under-control', title: 'Kalecgos under control', environment: 'sunwell-raid-corrupted', location: 'sunwell-plateau-quel-danas', characters: ['kalecgos-dragon-form', 'sathrovarr-the-corruptor'], objects: [], participants: ['kalecgos', 'sathrovarr-the-corruptor'],
    period: 'The Burning Crusade · first raid encounter', refs: [{ sourceId: 'sunwell-kalecgos-encounter' }, { sourceId: 'sunwell-original-raid' }],
    narration: 'At the edge of the inner sanctum, Sathrovarr holds Kalecgos in thrall. The blue dragon fights from within a shadowed realm even as allies face the dreadlord outside. When his captor’s hold breaks, Kalecgos is free to lend his strength to the defense.',
    note: 'Two forms/realms and Sathrovarr’s control are sourced to encounter locators; validate the original 2.4 presentation and dialogue.',
  },
  {
    id: 'brutallus-and-madrigosa', title: 'Brutallus and Madrigosa', environment: 'sunwell-raid-corrupted', location: 'sunwell-plateau-quel-danas', characters: ['brutallus', 'madrigosa'], objects: [], participants: ['brutallus', 'madrigosa'],
    period: 'The Burning Crusade · second raid encounter', refs: [{ sourceId: 'sunwell-brutallus-encounter' }, { sourceId: 'sunwell-madrigosa-felmyst' }],
    narration: 'Above the Dead Scar, Madrigosa challenges Brutallus. The pit lord strikes the blue dragon down, and her fall dims the defenders’ hopes. Yet the fel blood spilled from Brutallus will not leave her body in peace.',
    note: 'Brutallus’s kill and Madrigosa’s role are secondary transcript/article locators pending original-client review.',
  },
  {
    id: 'felmyst-rises', title: 'Felmyst rises', environment: 'sunwell-raid-corrupted', location: 'sunwell-plateau-quel-danas', characters: ['felmyst'], objects: [], participants: ['felmyst', 'madrigosa', 'brutallus'],
    period: 'The Burning Crusade · third raid encounter', refs: [{ sourceId: 'sunwell-madrigosa-felmyst' }],
    narration: 'From Brutallus’s wound, fel blood spreads beneath Madrigosa and stirs the fallen dragon once more. She rises as Felmyst, her blue form emptied of its old grace and wreathed in green fire. The cost of the battle follows the attackers deeper into the plateau.',
    note: 'The transformation is documented by a secondary raid account. Do not add unrecorded motives or later dragon history.',
  },
  {
    id: 'the-eredar-twins', title: 'The paired warlocks', environment: 'sunwell-raid-corrupted', location: 'sunwell-plateau-quel-danas', characters: ['eredar-twins'], objects: [], participants: ['eredar-twins'],
    period: 'The Burning Crusade · fourth raid encounter', refs: [{ sourceId: 'sunwell-eredar-twins' }, { sourceId: 'sunwell-original-raid' }],
    narration: 'Lady Sacrolash and Grand Warlock Alythess stand together before the deeper halls. Their crimson and violet powers guard the way toward M’uru. Together, the Eredar Twins form one last wall between the Offensive and the fount.',
    note: 'Names and paired encounter are direct from the raid index; motives are omitted. Composite figure art is limited to this paired scene.',
  },
  {
    id: 'muru-becomes-entropius', title: 'M’uru and Entropius', environment: 'sunwell-raid-corrupted', location: 'sunwell-plateau-quel-danas', characters: ['muru-entropius'], objects: [], participants: ['muru-entropius'],
    period: 'The Burning Crusade · fifth raid encounter', refs: [{ sourceId: 'sunwell-muru-encounter' }, { sourceId: 'sunwell-epilogue-transcript' }],
    narration: 'Within the Shrine of the Eclipse, the Offensive reaches M’uru, the naaru taken from Silvermoon. Its light has darkened into Entropius, and the defenders are forced to destroy the captive they had hoped to save. A spark endures within the heart that remains.',
    note: 'Kael’s capture of M’uru is located by a secondary TBC encounter article. Velen’s original raid epilogue is the separate source for the identity and heart.',
  },
  {
    id: 'kiljaeden-crosses-the-well', title: 'Kil’jaeden crosses the well', environment: 'sunwell-raid-corrupted', location: 'sunwell-plateau-quel-danas', characters: ['kiljaeden-sunwell-appearance', 'kalecgos-dragon-form'], objects: [], participants: ['kiljaeden', 'kalecgos'],
    period: 'The Burning Crusade · final raid encounter', refs: [{ sourceId: 'sunwell-blizzard-fury-timeline' }, { sourceId: 'sunwell-blizzard-classic-release' }, { sourceId: 'sunwell-kiljaeden-encounter' }],
    narration: 'At the last chamber, Kil’jaeden rises from the Sunwell, and the portal he sought begins to take shape. Kalecgos and the blue dragonflight join the defense around the threatened fount. Only Anveena’s act can break the demon’s advance.',
    note: 'The broad summoning plan is official. Specific encounter staging is secondary and requires original patch-2.4 capture.',
  },
  {
    id: 'anveena-acts', title: 'Anveena’s choice', environment: 'sunwell-raid-corrupted', location: 'sunwell-plateau-quel-danas', characters: ['anveena-teague', 'kiljaeden-sunwell-appearance', 'kalecgos-dragon-form'], objects: [], participants: ['anveena-teague', 'kiljaeden', 'kalecgos'],
    period: 'The Burning Crusade · final raid encounter', refs: [{ sourceId: 'sunwell-kiljaeden-encounter' }, { sourceId: 'sunwell-blizzard-fury-timeline' }],
    narration: 'As Kil’jaeden threatens to break through, Anveena turns her power against him. Her sacrifice weakens the demon, and the attackers drive him from the well. The light she gives is spent; still, taint remains in the waters below.',
    note: 'Anveena’s sacrifice and its encounter effect are supported by the TBC raid encounter and Blizzard summary. Her comic origin story is intentionally outside scope.',
  },
  {
    id: 'the-deceiver-driven-back', title: 'The Deceiver is driven back', environment: 'sunwell-raid-corrupted', location: 'sunwell-plateau-quel-danas', characters: ['kiljaeden-sunwell-appearance'], objects: [], participants: ['kiljaeden'],
    period: 'The Burning Crusade · raid victory', refs: [{ sourceId: 'sunwell-blizzard-fury-timeline' }, { sourceId: 'sunwell-blizzard-classic-release' }, { sourceId: 'sunwell-kiljaeden-encounter' }],
    narration: 'The heroes banish Kil’jaeden from the fount and stop the summoning before the Legion can pour through. The immediate invasion is ended. Yet the Sunwell’s waters remain polluted, and the blood elves face a second peril: the loss of the fount around which their kingdom gathered.',
    note: 'Blizzard supports the defeat and interruption of the summoning; the remaining contamination is the bridge to the original epilogue, not a later expansion event.',
  },
  {
    id: 'the-tainted-fount-remains', title: 'A victory with a danger left', environment: 'sunwell-raid-corrupted', location: 'sunwell-plateau-quel-danas', characters: ['lor-themar-theron'], objects: [], participants: ['lor-themar-theron'],
    period: 'The Burning Crusade · after the raid battle', refs: [{ sourceId: 'sunwell-original-raid' }, { sourceId: 'sunwell-epilogue-transcript' }],
    narration: 'Kil’jaeden is gone, yet corruption still clouds the Sunwell. Regent Lord Lor’themar considers destroying it lest the sickness spread beyond the fount. A victory has spared Quel’Thalas from one catastrophe, but the price may yet be the heart of the kingdom. Then Velen comes to honor M’uru.',
    note: 'Lor’themar’s consideration is taken from the TBC episode account and needs direct game-text review. Do not frame the well as already purified at this point.',
  },
  {
    id: 'murus-heart-renews-the-sunwell', title: 'The heart renews the Sunwell', environment: 'sunwell-raid-renewed', location: 'sunwell-plateau-quel-danas', characters: ['prophet-velen', 'lady-liadrin'], objects: ['muru-heart'], participants: ['prophet-velen', 'lady-liadrin', 'muru-entropius', 'muru-heart'],
    period: 'The Burning Crusade · original raid epilogue', refs: [{ sourceId: 'sunwell-epilogue-transcript' }, { sourceId: 'sunwell-blizzard-fury-timeline' }],
    narration: 'Velen arrives with Lady Liadrin and recovers the spark that remains in M’uru’s heart. He turns it upon the tainted water, and the Sunwell shines again, bearing both arcane light and the naaru’s gift. Liadrin grieves for what the Blood Knights did to M’uru; Velen answers with hope for what may grow from the loss. The old danger is ended, while the future of the nation is left open.',
    note: 'Velen, Liadrin, M’uru’s heart and the restoration are all in the original epilogue locator. Narration is an original paraphrase and stops before later expansions.',
  },
];

const nodeIds = beats.map((beat) => `${storyId}-story-${beat.id}`);
const sceneFigureIds = distinct(beats.flatMap((beat) => [...beat.characters, ...beat.objects]));
const figureById = new Map(figures.map((figure) => [figure.id, figure]));
const environmentById = new Map(environments.map((environment) => [environment.id, environment]));
for (const id of sceneFigureIds) if (!figureById.has(id)) throw new Error(`No art record for figure ${id}.`);
for (const beat of beats) if (!environmentById.has(beat.environment)) throw new Error(`No environment ${beat.environment} for scene ${beat.id}.`);
const allSourceIds = distinct([
  ...beats.flatMap((beat) => beat.refs.map((ref) => ref.sourceId)),
  ...environments.flatMap((environment) => environment.sources),
  ...figures.filter((figure) => sceneFigureIds.includes(figure.id)).flatMap((figure) => figure.sources ?? []),
]);

for (const figure of figures.filter((figure) => sceneFigureIds.includes(figure.id))) {
  const asset = `${artRoot}/${figure.file}`;
  await stat(path.join(root, 'public', asset));
  const sharedSources = distinct(beats.filter((beat) => beat.characters.includes(figure.id) || beat.objects.includes(figure.id)).flatMap((beat) => beat.refs.map((ref) => ref.sourceId)));
  const sourceIds = distinct([...(figure.sources ?? []), ...sharedSources]);
  const isArtifact = figure.type === 'artifact';
  const aliasNote = figure.canonicalId ? ` This is a theater-specific visual alias of the existing ${figure.canonicalId} record, not a separate character.` : '';
  await write(`data/entities/${figure.id}.research.json`, {
    id: figure.id,
    type: figure.type,
    name: figure.name,
    slug: figure.id,
    shortDescription: `${figure.name}, represented in the Shattered Sun and Sunwell research story.`,
    body: `${figure.description}${aliasNote} Original image-generation art; not canonical game art or proof of exact appearance, costume, size or simultaneous presence. Compare it with the Burning Crusade patch-2.4 client/model before human review. See docs/research/shattered-sun-sunwell-visual-assets.json.`,
    firstEraId: eraId,
    featuredEraIds: [eraId],
    sourceIds,
    tags: ['shattered-sun-sunwell-story', 'interpretive-art', ...(figure.canonicalId ? ['theater-appearance'] : [])],
    ...(isArtifact ? { mapVisual: { asset, scale: figure.scale } } : { mapFigure: { asset, scale: figure.scale } }),
    contentStatus: 'research',
  });
}

const offensiveId = 'shattered-sun-offensive';
await write(`data/entities/${offensiveId}.research.json`, {
  id: offensiveId,
  type: 'faction',
  name: 'The Shattered Sun Offensive',
  slug: offensiveId,
  shortDescription: 'A joint blood-elf and draenei task force formed to stop Kael\'thas and Kil\'jaeden at the Sunwell.',
  body: 'Original Blizzard summaries identify the coalition as a joint force of blood elves and draenei. In this story its soldiers appear as environmental art in Shattrath and on Quel\'Danas; the images do not claim an exact roster, formation or shared historic scene.',
  firstEraId: eraId,
  featuredEraIds: [eraId],
  sourceIds: ['sunwell-blizzard-fury-timeline', 'sunwell-blizzard-classic-release', 'sunwell-shattered-sun-offensive'],
  tags: ['burning-crusade', 'shattered-sun-sunwell-story', 'coalition'],
  contentStatus: 'research',
});

const locations = [
  { id: 'silvermoon-city', name: 'Silvermoon City', sources: ['sunwell-blizzard-fury-timeline'], body: 'The blood-elf capital where Kael\'thas returns before turning his design toward the Sunwell. This story uses original interpretive TBC-era city art; the scene is not a literal layout reconstruction.' },
  { id: 'magisters-terrace-sunwell', name: 'Magisters\' Terrace', sources: ['sunwell-magisters-terrace-quests', 'sunwell-magisters-terrace-area'], body: 'Blood-elf dungeon on the Isle of Quel\'Danas and setting of a TBC-side operation against Kael\'thas. Its illustrated hall is original interpretive art, not a surveyed dungeon floor plan.' },
  { id: 'sunwell-plateau-quel-danas', name: 'Sunwell Plateau', sources: ['sunwell-blizzard-classic-release', 'sunwell-original-raid', 'sunwell-epilogue-transcript'], body: 'The raid complex and fount at the heart of the patch-2.4 campaign. Story images are original relational illustrations and do not assert an exact room layout.' },
];
for (const location of locations) {
  const file = `data/entities/${location.id}.research.json`;
  let entity;
  try { entity = await readJson(file); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  entity ??= {
    id: location.id, type: 'location', name: location.name, slug: location.id,
    shortDescription: `${location.name}, a Burning Crusade setting in the Shattered Sun research story.`,
    firstEraId: eraId, featuredEraIds: [eraId], tags: ['shattered-sun-sunwell-story', 'burning-crusade-location'], contentStatus: 'research',
  };
  entity.sourceIds = distinct([...(entity.sourceIds ?? []), ...location.sources]);
  entity.featuredEraIds = distinct([...(entity.featuredEraIds ?? []), eraId]);
  entity.tags = distinct([...(entity.tags ?? []), 'shattered-sun-sunwell-story']);
  entity.body = [entity.body, location.body, 'Geography remains at region scale until original-client comparison.'].filter(Boolean).join(' ');
  await write(file, entity);
}

for (const [id, additions, shortDescription, body] of [
  ['isle-of-quel-danas', ['sunwell-blizzard-classic-release', 'sunwell-shattered-sun-offensive', 'sunwell-isle-phase-objectives'], 'The northern Eastern Kingdoms isle that hosts the TBC Shattered Sun Offensive and the approach to Sunwell Plateau; it also appears in the later Wrath Quel’Delar quest.', 'In The Burning Crusade, the isle is the objective of the Shattered Sun Offensive. This is separate from the 3.3.5 Quel’Delar restoration story.'],
  ['sunwell-ancient', ['sunwell-blizzard-classic-release', 'sunwell-epilogue-transcript'], null, 'The TBC campaign defends the fount and ends with Velen’s epilogue restoration. This story stops before every later expansion state already recorded for the site.'],
  ['shattrath-terrace-of-light', ['sunwell-blizzard-fury-timeline', 'sunwell-blizzard-classic-release'], null, 'The TBC coalition scene depicts separate blood-elf and draenei contingents in original environmental art, not a documented individual formation.'],
]) {
  const file = `data/entities/${id}.research.json`;
  const entity = await readJson(file);
  entity.sourceIds = distinct([...(entity.sourceIds ?? []), ...additions]);
  entity.featuredEraIds = distinct([...(entity.featuredEraIds ?? []), eraId]);
  entity.tags = distinct([...(entity.tags ?? []), 'shattered-sun-sunwell-story']);
  if (shortDescription) entity.shortDescription = shortDescription;
  if (body && !entity.body?.includes(body)) entity.body = `${entity.body ?? ''} ${body}`.trim();
  await write(file, entity);
}

const figureAdjacency = new Map(sceneFigureIds.map((id) => [id, new Set()]));
for (const beat of beats) {
  const together = [...beat.characters, ...beat.objects];
  for (const id of together) for (const other of together) if (id !== other) figureAdjacency.get(id).add(other);
}
const slots = new Map();
for (const id of sceneFigureIds) {
  const occupied = new Set([...figureAdjacency.get(id)].map((neighbor) => slots.get(neighbor)).filter((slot) => slot !== undefined));
  let slot = 0;
  while (occupied.has(slot)) slot++;
  slots.set(id, slot);
}
const maxSlot = Math.max(0, ...slots.values());
const features = [];
for (const id of sceneFigureIds) {
  const figure = figureById.get(id);
  const geometryId = `${storyId}-${id}-focus`;
  const sourceIds = distinct(beats.filter((beat) => beat.characters.includes(id) || beat.objects.includes(id)).flatMap((beat) => beat.refs.map((ref) => ref.sourceId)));
  features.push({ type: 'Feature', id: geometryId, properties: { name: `${figure.name} editorial focus`, contentStatus: 'research', styleRole: 'site', geographicCertainty: 'unknown' }, geometry: { type: 'Point', coordinates: [2800 + (slots.get(id) * 4400 / Math.max(1, maxSlot)), 5400] } });
  await write(`data/spatial-states/${storyId}-${id}.research.json`, {
    id: `${storyId}-${id}-theater`, entityId: id, eraId, worldspaceId, geometryId,
    placementKind: 'relational', geographicCertainty: 'unknown', sourceIds,
    editorNote: `Editorial placement of ${figure.name} in a story illustration. It is not a surveyed geographic coordinate, formation, dungeon floor plan, time-aware world position or claim of simultaneous presence. Compare with the original TBC patch-2.4 client before human review.`,
    visualPresence: 'contextual', labelPriority: 230,
  });
}
await write(`data/geometry/${worldspaceId}.research.geojson`, { type: 'FeatureCollection', features });
await write(`data/worldspaces/${worldspaceId}.research.json`, {
  id: worldspaceId,
  name: 'The Shattered Sun and the Sunwell — relational story theater',
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
    const source = sources.find((item) => item.id === ref.sourceId);
    const isBlizzard = ref.sourceId.startsWith('sunwell-blizzard-');
    await write(`data/citations/${citationId}.research.json`, {
      id: citationId,
      sourceId: ref.sourceId,
      ...(ref.questId ? { questId: ref.questId } : {}),
      section: `${beat.title}; the source passage, quest objective, original encounter or epilogue segment that directly supports this scene`,
      note: isBlizzard
        ? 'Original paraphrase of a first-party Blizzard summary. Compare against the target TBC patch and the page’s own patch label before human approval.'
        : `Original paraphrase. Secondary discovery/transcript locator${source?.notes?.includes('original client') ? '; confirm the exact wording and build in the original patch-2.4 client before human approval.' : '; compare the relevant encounter, quest and build in the original patch-2.4 client before human approval.'}`,
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
    editorNote: `${beat.note} Record remains research. Original-client and human source review are still required; no record is promoted to reviewed or published.`,
  });
  const environment = environmentById.get(beat.environment);
  const eventSourceIds = distinct([...beat.refs.map((ref) => ref.sourceId), ...environment.sources]);
  await write(`data/events/${eventId}.research.json`, {
    id: eventId,
    kind: 'event',
    name: beat.title,
    slug: eventId,
    eraId: beat.eventEraId ?? eraId,
    worldspaceId,
    date: { precision: 'relative', label: beat.period },
    summary: beat.narration,
    ...(beat.location ? { locationIds: [beat.location] } : {}),
    participantEntityIds: beat.participants,
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
      cartographyLabel: 'ILLUSTRATED STORY THEATER',
    interpretationNote: `Original image-generation environment art. Recognizable TBC-era traits: ${environment.traits} ${environment.promptBrief} Figures and objects are editorial placements, not a literal event composition, exact city or dungeon plan, surveyed coordinate, route, dated formation, or proof of simultaneous presence. In-game visual comparison remains open. See docs/research/shattered-sun-sunwell-visual-assets.json.`,
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
    ...(entities.length ? { entityIds: entities } : {}),
    ...(beat.location ? { locationIds: [beat.location] } : {}),
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
  { id: 'a-fount-raised', title: 'A fount raised for a new home', start: 0, end: 1, eraId: 'long-vigil-new-kingdoms' },
  { id: 'the-fount-falls', title: 'The fount falls', start: 1, end: 2, eraId: 'third-war-frozen-throne' },
  { id: 'the-returning-prince', title: 'The returning prince', start: 2, end: 5, eraId },
  { id: 'the-offensive-on-two-fronts', title: 'The offensive on two fronts', start: 5, end: 10, eraId },
  { id: 'the-plateau-campaign', title: 'The campaign through Sunwell Plateau', start: 10, end: 21, eraId },
].map(({ id, title, start, end, eraId: chapterEraId }) => ({
  id,
  title,
  eraId: chapterEraId,
  body: beats.slice(start, end).map((beat) => beat.narration).join(' '),
}));
await write(storyPath, {
  guide: {
    id: guideId,
    eraId,
    title: 'The Shattered Sun and the restored Sunwell',
    description: 'Twenty-one illustrated research scenes follow the Sunwell’s earlier history, Kael’thas’s patch-2.4 scheme, the joint Shattered Sun campaign, parallel island and Outland operations, the named raid encounters, Anveena’s sacrifice and the original epilogue.',
    nodeIds,
    contentStatus: 'research',
  },
  nodes,
});

await write(`data/storylines/${storyId}.research.json`, {
  id: storyId,
  slug: storyId,
  title: 'The Shattered Sun and the restored Sunwell',
  summary: 'Kael’thas turns toward the Sunwell to summon Kil’jaeden. Blood elves and draenei join the Shattered Sun Offensive across Quel’Danas and parallel Outland fronts; the Sunwell Plateau campaign ends in Anveena’s sacrifice and Velen’s renewal of the fount.',
  opening: 'The old fount remembers a lost home. Now Kael’thas has returned to Silvermoon, the Sunwell is threatened again, and blood elves and draenei gather together beneath Shattrath’s light.',
  primaryEraId: eraId,
  eraIds: ['long-vigil-new-kingdoms', 'third-war-frozen-throne', eraId],
  chapters,
  sourceIds: allSourceIds,
  storyGuideId: guideId,
  showInEraTourOffshoots: false,
  reviewNote: 'Complete 21-scene illustrated research StoryGuide with transcript, per-scene source/citation/claim records, named raid figures and objects, separate TBC-era environmental states, and generated narration after voice production. The foundation and Scourge fall are labeled prologues; the Magisters’ Terrace, staged island phases and Outland tasks are not made one personal prerequisite chain. Server-wide objectives and patch release schedules are gameplay, not in-world dates. Secondary quest and raid locators remain unverified against the original patch-2.4 client; the Blizzard Timeline Chapter 14 header has a patch-2.3 discrepancy. Human lore/source review, TBC area/model resemblance review and audio audition remain open. No record is reviewed or published.',
  contentStatus: 'research',
});

const eraPath = `data/eras/${eraId}.research.json`;
const era = await readJson(eraPath);
era.sourceIds = distinct([...era.sourceIds, ...allSourceIds]);
await write(eraPath, era);

const tourPath = 'data/story-tours/classic-to-wrath.research.json';
const tour = await readJson(tourPath);
tour.entries = tour.entries.filter((entry) => entry.storylineId !== storyId);
const wrathIndex = tour.entries.findIndex((entry) => entry.storylineId === 'wrathgate-and-undercity');
if (wrathIndex < 0) throw new Error('Could not locate Wrathgate for the patch-2.4 StoryTour position.');
tour.entries.splice(wrathIndex, 0, {
  storylineId: storyId,
  regionIds: ['eastern-kingdoms', 'outland'],
  mapPositionPercent: [70, 25],
  order: wrathIndex + 1,
  periodLabel: 'The Burning Crusade · patch 2.4 campaign',
  locationLabel: 'Quel’Danas · Shattrath · Outland support fronts',
});
tour.entries.forEach((entry, index) => { entry.order = index + 1; });
const chronologyMarker = 'The Shattered Sun and Sunwell story follows the Missing Diplomat’s patch 2.3 continuation and precedes Wrathgate as the Burning Crusade patch 2.4 campaign. The island’s unlock phases and original raid gate schedule are server-wide gameplay, not historical dates; Outland support missions and the Magisters’ Terrace operation are parallel campaign branches, not one adventurer’s universal prerequisite chain. The restoration scene is the original TBC epilogue and excludes later expansion reinterpretations.';
if (!tour.chronologyNote.includes(chronologyMarker)) tour.chronologyNote += ` ${chronologyMarker}`;
tour.reviewNote = 'Research StoryTour collection with 22 map placards, 21 playable research StoryGuides and one research preview. Play All follows the authored editorial sequence and skips the preview. Story-tour map markers are navigational layout positions, not exact geography; the Sunwell story uses Quel’Danas as a representative anchor despite its Shattrath and Outland campaign branches. Every storyline remains research until its human review gates are complete.';
await write(tourPath, tour);

const candidatesPath = 'docs/research/questline-story-candidates.md';
let candidates = await readFile(path.join(root, candidatesPath), 'utf8');
const candidatePattern = /### 20\. The Shattered Sun and the restored Sunwell[\s\S]*?(?=\n## Wrath of the Lich King)/;
const candidate = candidates.match(candidatePattern)?.[0];
if (!candidate) throw new Error('Could not find candidate 20 in the storyline guide.');
const cleanCandidate = candidate.replace(/\n\*\*Implementation:\*\*[\s\S]*$/, '');
const implementation = '\n\n**Implementation:** Complete 21-scene illustrated research StoryGuide with per-scene citation and claim records, transcript-matched narration, original Silvermoon, Quel’Danas, Shattrath, Outland, Magisters’ Terrace and Sunwell art, and deliberate figures for the named raid actors. Added as placard 20 in Classic to Wrath after the patch-2.3 Missing Diplomat continuation and before Wrathgate. The foundation and fall remain short prologues; Aldor/Scryer starts, phased Isle goals, Outland missions, Magisters’ Terrace and raid gates retain their gameplay and parallel-branch boundaries. The Blizzard timeline header’s patch-2.3 conflict, original-client quest/encounter comparison, area/model resemblance review, lore/source review and audio audition remain open. See the [research packet](shattered-sun-and-sunwell-research.md), [production ledger](shattered-sun-and-sunwell-production.md), and [visual asset ledger](shattered-sun-sunwell-visual-assets.json).';
candidates = candidates.replace(candidatePattern, `${cleanCandidate.trimEnd()}${implementation}\n`);
await writeText(candidatesPath, candidates);

const productionRows = beats.map((beat, index) => {
  const cast = [...beat.characters, ...beat.objects].map((id) => figureById.get(id)?.name ?? id);
  const environment = environmentById.get(beat.environment);
  return `| ${index + 1} | ${beat.title} | ${beat.period} | ${environment.title} | ${cast.length ? cast.join('; ') : 'coalition/environment scene'} | ${distinct(beat.refs.map((ref) => ref.sourceId)).join('; ')} |`;
}).join('\n');
const production = `# The Shattered Sun and the restored Sunwell — production ledger\n\n**Status:** complete research StoryGuide; human lore, source, audio and in-game visual review remain open.\n**Story:** \`${storyId}\` · ${beats.length} scenes · Era 8 play with labeled Era 5 and Era 7 prologues.\n**Tour:** placard 20 of the Classic-to-Wrath StoryTour, after the patch-2.3 Missing Diplomat continuation and before Wrathgate.\n\n## Scope and editorial boundaries\n\nThe campaign is a linked set of quest and raid operations, not one adventurer’s universal prerequisite chain. Aldor and Scryer introductions remain alternate starts. Island objectives and original raid gates are server/patch gameplay; they do not supply in-world dates. Outland missions and Magisters’ Terrace are parallel branches. The raid encounter path supplies a readable scene order, not a claim that each gate opened in one historical day. The restoration ends at the original TBC epilogue, before later expansions.\n\nBlizzard Timeline Chapter 14 labels Fury of the Sunwell patch 2.3. The page subject and other patch evidence place this story at 2.4; the discrepancy is preserved in the research packet and not silently “fixed.” Original-client quest, encounter and epilogue capture remains open, especially for Anveena, Kalecgos, M’uru and Velen.\n\n## Scene inventory\n\n| # | Scene | Period | Environment | Named visual cast / objects | Source IDs |\n|---:|---|---|---|---|---|\n${productionRows}\n\n## Verification gates still open\n\n- Compare every listed quest/raid locator to original Burning Crusade patch 2.4 client evidence and confirm the target build.\n- Review the alternate starts, Magisters’ Terrace sequence, raid gate presentation, named encounter details and original Velen/Liadrin epilogue.\n- Compare Silvermoon, Shattrath, Quel’Danas, Magisters’ Terrace, Outland and Sunwell art to the matching TBC zone/client visuals. Each image is original generated interpretation, not canonical game art or a surveyed map.\n- Audition all generated names, pacing and scene transitions. Check audio hashes and durations after generation.\n- Keep all records at \`research\` pending human source and lore approval.\n`;
await writeText('docs/research/shattered-sun-and-sunwell-production.md', production);

const assetRows = [];
for (const environment of environments) {
  await stat(path.join(root, 'public', environment.asset));
  assetRows.push({ kind: 'environment', id: environment.id, title: environment.title, asset: `public/${environment.asset}`, sourceIds: environment.sources, tbcVisualTraits: environment.traits, generationPromptBrief: environment.promptBrief, inGameComparison: 'Open; compare this original image-generation interpretation against the corresponding Burning Crusade-era zone/build before human approval.' });
}
for (const figure of figures.filter((figure) => sceneFigureIds.includes(figure.id))) {
  assetRows.push({ kind: figure.type === 'artifact' ? 'object' : 'figure', id: figure.id, title: figure.name, asset: `public/${artRoot}/${figure.file}`, sourceIds: distinct(beats.filter((beat) => beat.characters.includes(figure.id) || beat.objects.includes(figure.id)).flatMap((beat) => beat.refs.map((ref) => ref.sourceId))), generationPromptBrief: figure.promptBrief, representationNote: figure.description, inGameComparison: 'Open; verify silhouette, outfit/model and recognizable traits against the intended Burning Crusade-era game asset.' });
}
await write('docs/research/shattered-sun-sunwell-visual-assets.json', {
  storyId,
  status: 'research',
  generationMethod: 'Built-in image_gen; original images converted to WebP for the project while preserving transparent cutouts.',
  referencePeriod: 'Original World of Warcraft: The Burning Crusade patch 2.4.0; foundation and Scourge-fall prologues are labeled earlier states.',
  interpretationPolicy: 'AI-generated fan illustrations are not canonical game art, exact encounter screenshots, surveyed locations or dungeon floor plans. UI figure positions are relational story-theater anchors, never map coordinates.',
  areaComparison: 'Pending human comparison with matching client scenes. Silvermoon uses pale ivory towers, restrained red banners and antique gold; Shattrath uses angular pale draenei stone with distinct blood-elf/draenei environmental figures; Quel’Danas uses pale coastal limestone and red-gold high-elf ornament; Magisters’ Terrace is a separate polished elven interior; Outland keeps broken red terrain and a violet sky; Sunwell Plateau changes from constrained fel corruption to clear gold-white restoration.',
  generatedAssets: assetRows,
});

process.stdout.write(`Authored ${beats.length} research scenes, ${allSourceIds.length} source records referenced, and ${assetRows.length} original story art assets.\n`);
