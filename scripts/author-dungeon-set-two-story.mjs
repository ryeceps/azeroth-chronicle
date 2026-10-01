import { createHash } from 'node:crypto';
import { access, mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const eraId = 'age-of-adventurers';
const storyId = 'dungeon-set-two-veiled-blade';
const guideId = storyId + '-guide';
const worldspaceId = 'dungeon-set-two-story-theater';

const write = async (file, value) => {
  const full = path.join(root, file);
  await mkdir(path.dirname(full), { recursive: true });
  await writeFile(full, typeof value === 'string' ? value : `${JSON.stringify(value, null, 2)}\n`);
};

const sources = [
  {
    id: 'dungeon-set-two-quest-locators',
    title: 'Dungeon Sets 1 and 2 quest chain locator',
    url: 'https://www.wowhead.com/classic/guide/dungeon-sets-1-2-quests-wow-classic',
    sourceType: 'website',
    notes: 'Accessed 2026-10-01. Secondary WoW Classic guide used to locate and order the class/faction quest variants. It is not an original-client capture. Primary quest IDs in scope include 8945 Dead Man\'s Plea, 8946 Proof of Life, 8947 Anthion\'s Strange Request, 8948 Anthion\'s Old Friend, 8949 Falrin\'s Vendetta, 8950 The Instigator\'s Enchantment, 9015 The Challenge, 9020 Anthion\'s Parting Words, 8960/9032 Bodley\'s Unfortunate Fate, 8995 Mea Culpa, Lord Valthalak, and related Left/Right Piece variants.',
  },
  {
    id: 'dungeon-set-two-anthion-quest-text',
    title: 'Anthion Harmon quest text locators',
    url: 'https://classicdb.ch/?quest=8945',
    sourceType: 'quest',
    notes: 'Accessed 2026-10-01. ClassicDB reproductions of original quest text are secondary mirrors. This source locator begins at quest 8945; nearby Classic quest pages cover Proof of Life, Anthion\'s Strange Request, Anthion\'s Old Friend, Falrin\'s Vendetta and The Challenge. Compare each against the intended original client/build before human approval.',
  },
  {
    id: 'dungeon-set-two-brazier-manual',
    title: 'Brazier of Invocation: User\'s Manual',
    url: 'https://warcraft.wiki.gg/wiki/Brazier_of_Invocation:_User%27s_Manual',
    sourceType: 'manual',
    notes: 'Accessed 2026-10-01. Secondary page reproducing the in-game manual awarded by Return to Bodley. The manual is Bodley\'s account, not an omniscient neutral chronicle; preserve his explicit uncertainty, especially about Gremnik\'s motive.',
  },
  {
    id: 'dungeon-set-two-veiled-blade-locator',
    title: 'Veiled Blade company history locator',
    url: 'https://warcraft.wiki.gg/wiki/Veiled_Blade',
    sourceType: 'website',
    notes: 'Accessed 2026-10-01. Secondary compilation that links the mercenaries and their member histories. Use the in-game manual and named Classic quest text as the claim anchors; later continuity is out of scope.',
  },
  {
    id: 'dungeon-set-two-valtalak-quest-text',
    title: 'Mea Culpa, Lord Valthalak quest locator',
    url: 'https://www.wowhead.com/classic/quest=8995/mea-culpa-lord-valthalak',
    sourceType: 'quest',
    notes: 'Accessed 2026-10-01. WoWhead Classic mirror of quest 8995 and its associated objective/dialogue. Secondary reproduction; original-client dialogue and edition comparison remain open.',
  },
];
for (const source of sources) await write(`data/sources/${source.id}.research.json`, source);

const questSources = ['dungeon-set-two-quest-locators', 'dungeon-set-two-anthion-quest-text'];
const manualSource = 'dungeon-set-two-brazier-manual';
const veiledBladeSource = 'dungeon-set-two-veiled-blade-locator';
const finalQuestSource = 'dungeon-set-two-valtalak-quest-text';

const artDirectory = 'public/images/storylines/dungeon-set-two';
const environments = [
  ['ironforge-orgrimmar-halls', 'Ironforge High Seat and Orgrimmar Grommash Hold', 'A deliberate split composition: Ironforge uses massive grey granite, warm golden forge light and modest blue/gold cloth; Orgrimmar uses red sandstone, timber and iron construction, and restrained Horde-red cloth. This is a comparison of alternate faction entry points, not a claim that the cities or characters share a place.'],
  ['plaguelands-road', 'Eastern Plaguelands outside Stratholme', 'Grey-green plague fog, leafless trees, broken walls and a distant Gothic Stratholme silhouette. The ghost on the road is Anthion; surrounding details are an original interpretation, not a surveyed route.'],
  ['stratholme-slaughterhouse', 'Stratholme Slaughter House', 'Gothic stone crypt, iron cages and necromantic green-grey haze within Stratholme. The composition is original; no exact room dimensions or timer are asserted.'],
  ['dire-maul-athenaeum', 'Dire Maul Athenaeum', 'Ancient kaldorei library arches, pale green weathered stone, vines, moss and cool moonlight. This evokes the Athenaeum without claiming an exact in-game floor plan.'],
  ['brd-ring-of-law', 'Blackrock Depths Ring of Law', 'A circular basalt arena, heavy iron gates, stepped stone and distant lava light. The gladiator lineup is not reconstructed or treated as fixed.'],
  ['scholomance', 'Scholomance, Ras Frostwhisper’s chamber', 'Cold blue-grey necromantic academy, stone tombs, shelves and restrained sickly-green lamps. Interior layout is interpretive.'],
  ['stratholme-scarlet-bastion', 'Stratholme Scarlet Bastion', 'Pale grey Gothic crusader stone, faded crimson cloth, ruined hall and plague mist. Crimson is used only for the Scarlet Crusade location.'],
  ['lower-blackrock-spire', 'Lower Blackrock Spire, Tazz’Alaor', 'Rough black basalt, crude ironwork, narrow ledges, troll warlord textures and orange furnace glow in a volcanic cavern. Exact room layout is interpretive.'],
  ['upper-blackrock-balcony', 'Upper Blackrock Spire entrance balcony', 'A jagged volcanic ledge, black masonry braces, distant iron structures and red-orange cavern glow. Bodley’s scene is placed near the instance entrance as described by the quest.'],
  ['beasts-chamber', 'Upper Blackrock Spire, The Beast’s chamber', 'A vast black basalt hall, iron-banded gate, central floor and restrained spectral-green light amid furnace glow. The art recalls the chamber later used for Valthalak, not a raid map.'],
  ['booty-bay', 'Booty Bay, Stranglethorn Vale', 'Tropical water, a green-brown jungle shore, stacked wooden platforms, stilted walkways, moored ships and weathered cranes. The artwork shows an original harbor impression rather than a screenshot.'],
];

const actors = [
  ['deliana', 'Deliana', 'character', 'Deliana, the Alliance contact and surviving Veiled Blade member, shown in original practical blue-grey field clothing with restrained gold trim.', 'exec-816ad90e-7ec3-4528-a20b-f4337900f2d7.png; left tile'],
  ['mokvar', 'Mokvar', 'character', 'Mokvar, the Horde contact and surviving Veiled Blade member, shown as an original green-skinned orc advisor in worn mail and red-brown leather.', 'exec-816ad90e-7ec3-4528-a20b-f4337900f2d7.png; right tile'],
  ['anthion-harmon', 'Anthion Harmon', 'character', 'Anthion Harmon, a human mercenary ghost in faded mail, rendered with spectral blue edges.', 'exec-f069d7e7-0ddd-46be-83e7-7b1c508e8330.png; upper-left tile'],
  ['ysida-harmon', 'Ysida Harmon', 'character', 'Ysida Harmon, a living human priest of the Argent Dawn in modest cream robes and a small holy symbol.', 'exec-f069d7e7-0ddd-46be-83e7-7b1c508e8330.png; upper-middle tile'],
  ['falrin-treeshaper', 'Falrin Treeshaper', 'character', 'Falrin Treeshaper, an older night elf druid with silver hair and leaf-woven robes.', 'exec-f069d7e7-0ddd-46be-83e7-7b1c508e8330.png; upper-right tile'],
  ['bodley', 'Bodley', 'character', 'Bodley, a small male gnome mage ghost in faded scholar robes.', 'exec-f069d7e7-0ddd-46be-83e7-7b1c508e8330.png; middle-left tile'],
  ['theldren', 'Theldren', 'character', 'Theldren, a stout male dwarf gladiator in dark iron armor with a worn arena shield.', 'exec-f069d7e7-0ddd-46be-83e7-7b1c508e8330.png; middle-middle tile'],
  ['lord-valthalak', 'Lord Valthalak', 'character', 'Lord Valthalak, a drakonid noble and warlock, former general of Blackrock Spire, rendered as a scaled spectral humanoid in dark bronze armor.', 'exec-dd73abe2-4416-4b9b-be44-2d3a8a034e90.png'],
  ['mor-grayhoof', 'Mor Grayhoof', 'character', 'Mor Grayhoof, a broad male tauren druid ghost with muted natural adornments.', 'exec-f069d7e7-0ddd-46be-83e7-7b1c508e8330.png; lower-left tile'],
  ['kormok', 'Kormok', 'character', 'Kormok, the two-headed ogre necromancer; his two heads have different expressions, as the in-game manual describes.', 'exec-7c5d4ed3-3c02-44d9-9349-035a113616e3.png'],
  ['isalien', 'Isalien', 'character', 'Isalien, a night elf Priestess of the Moon and spirit, shown in original teal and silver robes with crescent motifs.', 'exec-ffe403ca-ffea-4655-9e6c-f0bc0e4ad7ce.png'],
  ['jarien-sothos', 'Jarien and Sothos', 'faction', 'The undead sibling pair in an original, shared representation; the art does not imply a specific order of their deaths.', 'exec-f069d7e7-0ddd-46be-83e7-7b1c508e8330.png; lower-right tile'],
  ['gremnik-rizzlesprang', 'Gremnik Rizzlesprang', 'character', 'Gremnik Rizzlesprang, a male goblin smuggler-wizard in weathered dark leather, shown as an original interpretation.', 'exec-60277fb0-2341-4d19-98ee-72a59aee55b5.png; upper-left tile'],
  ['spectral-assassins', 'Spectral Assassins', 'faction', 'A small ensemble of translucent undead human assassins in dark armor and pale green spirit light.', 'exec-60277fb0-2341-4d19-98ee-72a59aee55b5.png; upper-right tile'],
  ['veiled-blade', 'The Veiled Blade', 'faction', 'An editorial mercenary-company ensemble of varied silhouettes; its exact member composition is not asserted.', 'exec-60277fb0-2341-4d19-98ee-72a59aee55b5.png; lower-left tile'],
  ['valthalak-amulet', 'Lord Valthalak’s Amulet', 'artifact', 'A dark bronze medallion broken into three interlocking pieces with a restrained spectral-green pulse; an original artifact interpretation.', 'exec-60277fb0-2341-4d19-98ee-72a59aee55b5.png; lower-right tile'],
];

const beats = [
  { id:'two-faction-doors', title:'Two doors into the same story', env:'ironforge-orgrimmar-halls', cast:['deliana','mokvar'], questIds:['In Search of Anthion (Alliance and Horde variants)'], src:questSources, text:'Deliana speaks from Ironforge; Mokvar speaks from Orgrimmar. Their faction quests are separate doors into the same old wound, not a shared meeting or a single adventurer’s simultaneous allegiance. Each directs a seeker toward Anthion Harmon, whose ghost waits beyond Stratholme. The armor work that frames the journey is only its threshold. Ahead lie a rescue, a company’s last contract, and a medallion whose pieces carried more than any of its owners understood.' },
  { id:'the-ghost-at-stratholme', title:'The ghost at Stratholme’s gate', env:'plaguelands-road', cast:['anthion-harmon'], questIds:['In Search of Anthion'], src:questSources, text:'At the Eastern Plaguelands road, a goblin device lets the living hear Anthion Harmon. Death has not quieted his concern: Ysida, his wife, was captured by Baron Rivendare inside Stratholme. Anthion says he tried to reach her and failed. He asks the seeker to finish the rescue. The city rises behind him through bare branches and grey-green haze; within it, the question is simple and terrible—whether Ysida still lives.' },
  { id:'a-plea-from-the-dead', title:'A plea that cannot wait', env:'plaguelands-road', cast:['anthion-harmon','ysida-harmon'], questIds:['8945 · Dead Man’s Plea'], src:questSources, text:'Anthion’s request carries two losses at once. He has already died in the attempt, yet the thought of losing Ysida still binds him to the road. The quest asks for a living woman held by the Baron, not for a heroic last stand by her husband. No timer is needed in the telling: the source gives the plea and the danger, while the hourglass belongs to the dungeon challenge rather than to a new historical event.' },
  { id:'inside-the-slaughter-house', title:'Ysida in the Slaughter House', env:'stratholme-slaughterhouse', cast:['ysida-harmon'], questIds:['8945 · Dead Man’s Plea'], src:questSources, text:'The way leads through Stratholme to its Slaughter House, where Rivendare holds Ysida. The walls are steeped in the Scourge’s greenish corruption, but the quest’s purpose is rescue: reach her alive and bring her beyond the Baron’s reach. The art marks the room as an interpretation of the Classic dungeon, not a measured reconstruction. Ysida has endured the city’s horror; the next journey carries a message toward the husband she believes is lost.' },
  { id:'proof-of-life', title:'Proof of life', env:'plaguelands-road', cast:['ysida-harmon','anthion-harmon'], questIds:['8946 · Proof of Life'], src:questSources, text:'Ysida gives the rescuer her locket to carry back to Anthion. She believes he perished while trying to save her, and the token is her proof that she remains alive. When the message reaches the roadside ghost, Anthion learns that the rescue succeeded. Their reunion is brief and divided by death, yet Ysida’s survival releases him from the fear that held him there. He can now offer help in the work that remains.' },
  { id:'the-first-fragment', title:'A fragment taken by Theldren', env:'plaguelands-road', cast:['anthion-harmon','valthalak-amulet'], questIds:['8947 · Anthion’s Strange Request'], src:questSources, text:'Anthion’s next account turns from rescue to the Veiled Blade’s spoils. The company did not understand the medallion’s importance, so it was divided with their other plunder. A dwarf named Theldren took the first piece. Anthion tried to win it back and was beaten badly; the fragment would have to be claimed through another challenge. The amulet is already more than an ornament, though its danger has not yet been named.' },
  { id:'falrins-old-friend', title:'Falrin remembers an old friend', env:'dire-maul-athenaeum', cast:['falrin-treeshaper'], questIds:['8948 · Anthion’s Old Friend', '8949 · Falrin’s Vendetta'], src:questSources, text:'In Dire Maul’s Athenaeum, Anthion’s old friend Falrin Treeshaper listens to the request. He had thought Anthion dead. Falrin agrees to help prepare an enchantment that can draw Theldren into a fight; his anger at the ogres is personal, rooted in the death of his brother. The required collection is a task in play, not a separate historical episode. What matters to the story is that an old bond supplies the means for a dangerous meeting.' },
  { id:'the-ring-of-law', title:'The Challenge in Blackrock Depths', env:'brd-ring-of-law', cast:['theldren'], questIds:['8950 · The Instigator’s Enchantment', '9015 · The Challenge'], src:questSources, text:'Beneath Blackrock Mountain, the Ring of Law becomes the stage for the challenge. As High Justice Grimstone sentences the intruders, they plant Falrin’s banner. Theldren cannot resist the provocation; he enters the arena with his gladiators. The team composition can vary, so this scene gives no fixed roster or race to the company. The battle retrieves the top piece and changes the next question: now the remaining fragments must be traced to Anthion’s other companions.' },
  { id:'parting-words', title:'Anthion’s parting words', env:'plaguelands-road', cast:['anthion-harmon','valthalak-amulet'], questIds:['9020 · Anthion’s Parting Words'], src:questSources, text:'With the top piece returned, Anthion explains the danger that he could not see before. The Veiled Blade split Valthalak’s amulet into three parts out of greed, not knowing that it held much of the warlock’s soul. The curse followed. Anthion asks the seeker to find Bodley, who can guide the search for the other pieces. At last, Anthion believes he may rest; his part in the company’s wrong has become a plea to set it right.' },
  { id:'bodleys-fate', title:'Bodley, unseen on the balcony', env:'upper-blackrock-balcony', cast:['bodley'], questIds:['8960 / 9032 · Bodley’s Unfortunate Fate'], src:questSources, text:'Near the entrance balcony of Blackrock Spire, Bodley appears only to one who can see ghosts. He had gone back toward the fortress and never returned. The quest giver fears he is dead; Bodley confirms it without ceremony and asks for help undoing the company’s wrong. If the top piece is already found, he can point toward the other two. His greeting is warm, even here, where the old danger began.' },
  { id:'a-client-from-booty-bay', title:'A commission from Booty Bay', env:'booty-bay', cast:['gremnik-rizzlesprang'], questIds:['Brazier of Invocation: User’s Manual · Lord Valthalak section'], src:[manualSource, veiledBladeSource], text:'Bodley remembers a commission from Gremnik Rizzlesprang, a goblin smuggler-wizard out of Booty Bay. The job was to take Lord Valthalak’s spellbook from Blackrock Spire. Bodley does not know whether Gremnik meant to study it or sell it, and the manual leaves that motive unresolved. The distinction matters: the company’s contract is documented, but its patron’s private purpose is not.' },
  { id:'the-former-general', title:'The former general of the Spire', env:'beasts-chamber', cast:['veiled-blade','lord-valthalak'], questIds:['Brazier of Invocation: User’s Manual · Lord Valthalak section'], src:[manualSource, veiledBladeSource], text:'Before Drakkisath, Lord Valthalak was a drakonid noble and warlock who had served as Blackrock Spire’s general. The Veiled Blade entered the upper fortress, slew him, and took the spellbook. Bodley recalls that the company knew too little of Valthalak’s power over souls to understand what they had disturbed. The lair is now called the Beast’s chamber. The manual’s account makes clear that the company’s successful contract was the beginning of its ruin.' },
  { id:'the-medallion-dispute', title:'The medallion in Kormok’s hands', env:'beasts-chamber', cast:['kormok','valthalak-amulet','veiled-blade'], questIds:['Brazier of Invocation: User’s Manual · Lord Valthalak section'], src:[manualSource, veiledBladeSource], text:'When the company prepared to leave with the book, Kormok claimed Valthalak’s amulet as his share. His insistence turned the group against itself. They argued, nearly came to blows, and finally broke the medallion into three pieces. Only later did they learn that it housed much of Valthalak’s spirit. The distribution followed a lot; Theldren’s top fragment had already returned through Anthion’s challenge, while the other pieces scattered among former companions.' },
  { id:'the-company-flees', title:'The company flees the risen spirit', env:'upper-blackrock-balcony', cast:['veiled-blade','spectral-assassins','mor-grayhoof'], questIds:['Brazier of Invocation: User’s Manual · Lord Valthalak section'], src:[manualSource, veiledBladeSource], text:'Valthalak rose as a spirit and called spectral assassins against the mercenaries. Their struggle also roused defenders in the Spire. Most of the Veiled Blade escaped, but safety proved brief: the assassins pursued them wherever they hid. The company soon broke apart, its quarrel made worse by a curse that followed each shard. In the confusion Mor Grayhoof fell toward the lower reaches of the fortress, where his own path would end.' },
  { id:'alternate-fate-mor', title:'Alternative fate · Mor Grayhoof', env:'lower-blackrock-spire', cast:['mor-grayhoof','spectral-assassins'], questIds:['Brazier of Invocation: User’s Manual · Mor Grayhoof section'], src:[manualSource, veiledBladeSource], text:'One remembered branch leads to Mor Grayhoof. He survived the fall into Lower Blackrock Spire, but trolls captured him and War Master Voone tortured him. The spectral assassins finished what the fall had not. Mor’s story is one of the manual’s haunted loci; it is an alternative account of a former companion’s fate, not an assertion that every adventurer fought every spirit in this order.' },
  { id:'alternate-fate-kormok', title:'Alternative fate · Kormok', env:'scholomance', cast:['kormok','spectral-assassins'], questIds:['Brazier of Invocation: User’s Manual · Kormok section'], src:[manualSource, veiledBladeSource], text:'Another branch follows Kormok to Scholomance. Once a member of the Veiled Blade, the two-headed ogre became drawn to necromancy; the manual describes one head as clever and cold, the other more foolish. After the company broke apart, he sought further study at Scholomance. Valthalak’s spectral assassins reached him there and killed him before Ras Frostwhisper. The record remembers a comrade turned toward dangerous art, then found by the curse.' },
  { id:'alternate-fate-isalien', title:'Alternative fate · Isalien', env:'dire-maul-athenaeum', cast:['isalien'], questIds:['Brazier of Invocation: User’s Manual · Isalien section'], src:[manualSource, veiledBladeSource], text:'Isalien left the company for a pilgrimage to Dire Maul, seeking answers about her night elf heritage and perhaps the magic within her amulet piece. Bodley remembers her as a friend of Falrin. In the city’s old kaldorei halls, she was ambushed by Alzzin the Wildshaper and his forces. The manual leaves her at another haunted place: a former companion drawn toward knowledge, then overtaken by the same scattered curse.' },
  { id:'alternate-fate-jarien-sothos', title:'Alternative fate · Jarien and Sothos', env:'stratholme-scarlet-bastion', cast:['jarien-sothos'], questIds:['Brazier of Invocation: User’s Manual · Jarien and Sothos section'], src:[manualSource, veiledBladeSource], text:'Jarien and Sothos, siblings of the Veiled Blade, turned toward the Scarlet Crusade after the company dissolved. They sought knighthood at Stratholme. Bodley’s account says Sothos failed the final trial; Jarien defended her brother and demanded that they be admitted together. Grand Crusader Dathrohan killed them both. The amulet piece they carried further twisted their spirits. Their chapter, too, is one possible haunted locus in the family of routes.' },
  { id:'the-other-pieces', title:'Finding the other two pieces', env:'upper-blackrock-balcony', cast:['bodley','valthalak-amulet'], questIds:['Left/Right Piece of Lord Valthalak’s Amulet variants'], src:[questSources[0], manualSource], text:'Bodley guides the search to two further pieces. The quest versions can direct a class or faction branch toward one of several haunted companions; they are alternate targets from the same company history. The four accounts just heard are arranged here as memorials, not as four mandatory kills by one canonical traveler. When the missing pieces are brought together with Theldren’s top fragment, the medallion can be made whole again.' },
  { id:'the-brazier-attuned', title:'The brazier is prepared', env:'upper-blackrock-balcony', cast:['bodley','valthalak-amulet'], questIds:['Final Preparations · Blackrock Spire quest chain'], src:[questSources[0], manualSource], text:'Bodley prepares a brazier able to call the spirit from its old lair. The chain asks for specific components, but their collection is not another history of the company. Its purpose is to attune the brazier and make the final encounter possible. The manual names haunted places to give the wider meaning: Valthalak’s power has marked the places where his former companions fell, and the Beast’s chamber remains the last of those sites.' },
  { id:'mea-culpa', title:'Mea Culpa, Lord Valthalak', env:'beasts-chamber', cast:['lord-valthalak','valthalak-amulet'], questIds:['8995 · Mea Culpa, Lord Valthalak'], src:[finalQuestSource, manualSource], text:'In the Beast’s chamber, the brazier calls Valthalak back into a body that can be confronted. After the battle, the restored amulet is used on his corpse and his spirit appears, whole again. He recognizes that the seeker was not among the original thieves and demands his property back. The quest does not give the mortal a new claim to the medallion; it asks the traveler to return it to its owner and carry his answer back to Bodley.' },
  { id:'safe-for-now', title:'Safe for now', env:'upper-blackrock-balcony', cast:['bodley'], questIds:['Return to Bodley · post-8995 quest chain', 'Brazier of Invocation: User’s Manual'], src:[questSources[0], manualSource], text:'Valthalak tells the traveler to return to the Veiled Blade and say they are safe—for now. Bodley is astonished that the spirit will call off his assassins, though the promise carries a warning of future harm. The manual still speaks of echoes at the haunted loci, and the company itself has not been restored. Its members remain scattered among separate lives and deaths. What is repaired is the amulet, and for this moment, the pursuit it unleashed.' },
];

const allSourceIds = [...new Set(beats.flatMap((beat) => beat.src))];
const allCast = [...new Set(beats.flatMap((beat) => beat.cast))];
const names = new Map(actors.map((actor) => [actor[0], actor[1]]));

for (const [id, area, recognizableTraits] of environments) {
  await access(path.join(root, artDirectory, `${id}.research.webp`));
  await write(`data/map-states/dungeon-set-two-${id}.research.json`, {
    id: `dungeon-set-two-${id}-scene`,
    name: `Dungeon Set 2: ${area} illustrated scene`,
    worldspaceId,
    presentation: 'relational',
    terrainTextureAsset: `images/storylines/dungeon-set-two/${id}.research.webp`,
    geometryIds: [],
    cartographyLabel: 'ILLUSTRATED QUESTLINE THEATER',
    interpretationNote: `Original AI-generated landscape inspired by ${area}. Recognizable traits to preserve: ${recognizableTraits} This is a story illustration, not a surveyed map, dungeon floor plan, fixed formation or proof of exact character co-presence. See docs/research/dungeon-set-two-visual-assets.json.`,
  });
}

for (const [id, name, type, description] of actors) {
  const image = `images/storylines/dungeon-set-two/${id}.research.webp`;
  const common = {
    id, type, name, slug: id,
    shortDescription: `${name}, represented in the Dungeon Set 2 research story.`,
    body: `${description} Original AI-generated interpretive artwork, not canonical game art or evidence for a costume, exact appearance, location or event. See the production and visual asset ledgers for the source boundary.`,
    firstEraId: eraId,
    featuredEraIds: [eraId],
    sourceIds: [...new Set(beats.filter((beat) => beat.cast.includes(id)).flatMap((beat) => beat.src))],
    tags: ['dungeon-set-two-story', 'interpretive-art'],
    contentStatus: 'research',
  };
  await access(path.join(root, 'public', image));
  const visual = type === 'character'
    ? { mapFigure: { asset: image, scale: ['deliana', 'mokvar', 'isalien'].includes(id) ? 0.84 : 0.82 } }
    : { mapVisual: { asset: image, scale: type === 'artifact' ? 0.7 : 0.86 } };
  await write(`data/entities/${id}.research.json`, { ...common, ...visual });
}

const slots = new Map();
for (const id of allCast) {
  const neighbors = new Set(beats.filter((beat) => beat.cast.includes(id)).flatMap((beat) => beat.cast));
  const occupied = new Set([...neighbors].map((neighbor) => slots.get(neighbor)).filter((slot) => slot !== undefined));
  let slot = 0;
  while (occupied.has(slot)) slot++;
  slots.set(id, slot);
}
const columnCount = Math.max(...slots.values()) + 1;
const features = [];
for (const id of allCast) {
  const x = 3300 + slots.get(id) * 3400 / Math.max(1, columnCount - 1);
  const geometryId = `dungeon-set-two-${id}-focus`;
  features.push({
    type: 'Feature', id: geometryId,
    properties: { name: `${names.get(id)} editorial focus`, contentStatus: 'research', styleRole: 'site', geographicCertainty: 'unknown' },
    geometry: { type: 'Point', coordinates: [x, 5500] },
  });
  const sourceIds = [...new Set(beats.filter((beat) => beat.cast.includes(id)).flatMap((beat) => beat.src))];
  await write(`data/spatial-states/dungeon-set-two-${id}.research.json`, {
    id: `dungeon-set-two-${id}-theater`, entityId: id, eraId, worldspaceId, geometryId,
    placementKind: 'relational', geographicCertainty: 'unknown', sourceIds,
    editorNote: 'Editorial cast arrangement in an illustrated theater. This position conveys no geographic location, travel route, literal formation or claim that these actors were simultaneously present.',
    visualPresence: 'contextual', labelPriority: 240,
  });
}
await write('data/geometry/dungeon-set-two-theater.research.geojson', { type: 'FeatureCollection', features });
await write(`data/worldspaces/${worldspaceId}.research.json`, {
  id: worldspaceId, name: 'Dungeon Set 2 — relational story theater', slug: worldspaceId,
  coordinateSystem: { width: 10000, height: 10000, origin: 'bottom-left', units: 'atlas-units' },
});

const nodes = [];
for (const [index, beat] of beats.entries()) {
  const nodeId = `dungeon-set-two-story-${beat.id}`;
  const eventId = `dungeon-set-two-${beat.id}-event`;
  const citationIds = [];
  for (const [sourceIndex, sourceId] of beat.src.entries()) {
    const citationId = `dungeon-set-two-${beat.id}-citation-${sourceIndex + 1}`;
    citationIds.push(citationId);
    const questId = beat.questIds?.[sourceIndex] ?? beat.questIds?.[0];
    await write(`data/citations/${citationId}.research.json`, {
      id: citationId, sourceId,
      section: `${questId ? `${questId} · ` : ''}${beat.title} and the directly relevant description, account, objective or completion text`,
      ...(questId ? { questId } : {}),
      note: 'Original paraphrase from an accessible secondary Classic quest/manual locator. The claim stays in research; capture the original client text and compare the intended edition/build before human lore review.',
    });
  }
  const claimId = `dungeon-set-two-${beat.id}-claim`;
  await write(`data/claims/${claimId}.research.json`, {
    id: claimId, subjectId: eventId, predicate: 'questline_scene_account', value: beat.text,
    citationIds, confidence: 'strongly_supported', status: 'active',
    editorNote: 'Research status: the accessible quest and manual pages reproduce in-game evidence but are secondary mirrors. The manual is Bodley’s perspective. Alternate class/faction targets are editorially ordered and are not one canonical adventurer’s route.',
  });
  await write(`data/events/${eventId}.research.json`, {
    id: eventId, kind: 'event', name: beat.title, slug: `dungeon-set-two-${beat.id}`,
    eraId, worldspaceId,
    date: { precision: 'relative', label: 'Original World of Warcraft Classic · Dungeon Set 2 questline' },
    summary: beat.text, participantEntityIds: beat.cast, sourceIds: beat.src,
    claimIds: [claimId], contentStatus: 'research',
  });
  nodes.push({
    id: nodeId, guideId, title: beat.title, narration: beat.text,
    durationMs: Math.round(beat.text.split(/\s+/).length / 82 * 60000) + 5000,
    eventIds: [eventId], entityIds: beat.cast,
    camera: { position: [0, 6.2, 5.5], target: [0, 0, 0], durationMs: 1150 },
    visualActions: [{ type: 'set_map_state', mapStateId: `dungeon-set-two-${beat.env}-scene` }],
    ...(index ? { previousNodeId: `dungeon-set-two-story-${beats[index - 1].id}` } : {}),
    ...(index < beats.length - 1 ? { nextNodeIds: [`dungeon-set-two-story-${beats[index + 1].id}`] } : {}),
  });
}

const chapters = [
  { id: 'a-rescue-beyond-death', title: 'A Rescue Beyond Death', nodeStart: 0, nodeEnd: 4, body: 'Deliana and Mokvar open distinct faction paths toward Anthion Harmon. Ysida is rescued from Stratholme; her locket carries proof of life back to her husband and lets his ghost turn toward the Veiled Blade’s unresolved wrong.' },
  { id: 'anthion-and-theldren', title: 'Anthion and Theldren', nodeStart: 5, nodeEnd: 8, body: 'The first fragment belongs to Theldren. Falrin Treeshaper helps arrange a challenge in Blackrock Depths, and its conclusion retrieves the top piece while revealing why the medallion cannot simply be forgotten.' },
  { id: 'the-company-of-fragments', title: 'The Company of Fragments', nodeStart: 9, nodeEnd: 18, body: 'Bodley recounts the Veiled Blade’s last contract and the amulet dispute that divided the company. Four alternative haunted-locus accounts trace Mor Grayhoof, Kormok, Isalien, and Jarien and Sothos without implying they are mandatory consecutive targets for one adventurer.' },
  { id: 'return-the-spirit', title: 'Return the Spirit', nodeStart: 19, nodeEnd: 21, body: 'Bodley attunes the brazier, the restored amulet calls Valthalak into the Beast’s chamber, and the traveler returns his property. The spirit promises safety only for now; the company and the echoes of its past remain scattered.' },
].map(({ id, title, nodeStart, nodeEnd, body }) => ({
  id, eraId, title, body: `${body} Scenes ${nodeStart + 1}–${nodeEnd + 1}.`,
}));

const storyPath = `data/stories/${storyId}.research.json`;
const previousStory = JSON.parse(await readFile(path.join(root, storyPath), 'utf8').catch(() => '{"nodes":[]}'));
for (const node of nodes) {
  const previousNode = previousStory.nodes.find((item) => item.id === node.id && item.narration === node.narration);
  if (previousNode?.voiceover) node.voiceover = previousNode.voiceover;
}
const guide = {
  id: guideId, eraId, title: 'The Veiled Blade and Lord Valthalak',
  description: 'A 22-scene Classic research chronicle follows Anthion and Ysida’s rescue into the Veiled Blade’s last contract, the scattered fates of its companions, and the return of Valthalak’s soul.',
  nodeIds: nodes.map((node) => node.id), contentStatus: 'research',
};
await write(storyPath, { guide, nodes });

const storyline = {
  id: storyId, slug: storyId, title: 'The Veiled Blade and Lord Valthalak',
  summary: 'Anthion seeks the rescue of Ysida from Stratholme; afterward, the Veiled Blade’s divided amulet draws an adventurer through its scattered companions to Valthalak’s old lair.',
  opening: 'Two faction paths lead to one ghost outside Stratholme. His request begins with a rescue; the road beyond it uncovers an old mercenary company, a broken medallion, and the danger its members left behind.',
  primaryEraId: eraId, eraIds: [eraId], chapters, sourceIds: allSourceIds, storyGuideId: guideId,
  reviewNote: 'Complete 22-scene illustrated research telling with 22 transcript-matched AI narration tracks, separate faction introductions, the Anthion/Ysida rescue, Theldren’s challenge, Bodley’s manual account, four explicitly alternative companion-fate scenes and the Valthalak finale. Main journey: original World of Warcraft Classic / Era 8. Quest text, manual lore, faction variants, and order are drawn from accessible secondary mirrors; capture and compare the original client/build before promotion. Bodley’s account stays attributed and Gremnik’s motive remains unknown. The four haunted-locus variants are an editorial memorial sequence, not four mandatory kills by one canonical character. Art is interpretive and its matching in-game area comparison remains a human review gate. No TBC, Wrath, or later character outcomes are added.',
  contentStatus: 'research',
};
await write(`data/storylines/${storyId}.research.json`, storyline);

const eraPath = `data/eras/${eraId}.research.json`;
const era = JSON.parse(await readFile(path.join(root, eraPath), 'utf8'));
era.sourceIds = [...new Set([...era.sourceIds, ...allSourceIds])];
await write(eraPath, era);

const sourceUrlById = new Map(sources.map((source) => [source.id, source.url]));
const allAssets = [];
for (const [id, area, traits] of environments) {
  const file = `${artDirectory}/${id}.research.webp`;
  const [bytes, info] = await Promise.all([readFile(path.join(root, file)), stat(path.join(root, file))]);
  const exactPrompt = id === 'ironforge-orgrimmar-halls'
    ? 'Create two separate Classic faction-city impressions divided at center: left Ironforge High Seat in carved grey granite, warm golden forge braziers and restrained blue/gold cloth; right Orgrimmar Grommash Hold in red sandstone, timber and iron construction and restrained Horde-red cloth. Original wide 3:2 painting, no people or text, not a screenshot.'
    : id === 'booty-bay'
      ? 'Original wide 3:2 painterly Booty Bay in Stranglethorn Vale: warm tropical water, green-brown jungle shore, dense stacked timber platforms and stilted walkways, moored ships, rope bridges, cranes and sunset humidity; Classic area silhouette, no characters or text, not a screenshot.'
      : `Original painterly World of Warcraft Classic environment contact sheet; 2 by 2 grid with equal 3:2 landscape tiles. Selected tile depicts ${area}, preserving ${traits} No text or UI; original composition, not a screenshot.`;
  allAssets.push({
    id, kind: 'environment', file, area, pixelWidth: id === 'ironforge-orgrimmar-halls' || id === 'booty-bay' || id === 'plaguelands-road' ? 1536 : 768,
    pixelHeight: id === 'ironforge-orgrimmar-halls' || id === 'booty-bay' || id === 'plaguelands-road' ? 1024 : 512,
    sourceArtifact: id === 'ironforge-orgrimmar-halls' ? 'exec-94fe4490-7378-411c-a6d7-2744cef44974.png'
      : id === 'booty-bay' ? 'exec-918caee5-86a7-439a-8194-7a295de139f0.png'
        : id === 'plaguelands-road' ? 'exec-39352193-0042-416d-a8fe-82344381df50.png'
          : ['dire-maul-athenaeum', 'stratholme-slaughterhouse', 'brd-ring-of-law', 'scholomance'].includes(id)
            ? 'exec-7a3a88fe-f100-4d95-b900-cf3ba9b671eb.png' : 'exec-8af04627-dc48-4e29-ad1d-afc265f7ce4f.png',
    targetEditionBuild: 'Original World of Warcraft Classic / Vanilla area identity; exact client build comparison is open.',
    recognizableTraits: traits,
    generationPrompt: exactPrompt,
    generator: 'OpenAI ImageGen; selected output cropped/exported as WebP for the static repository asset tree.',
    transparency: false,
    visualReview: 'Area palette and broad landmarks were checked against known Classic area traits while generating. No in-client comparison screenshot is claimed; human game-build resemblance review remains open.',
    byteLength: bytes.length, modifiedAt: info.mtime.toISOString(), sha256: createHash('sha256').update(bytes).digest('hex'),
  });
}
for (const [id, name, type, representation, sourceArtifact] of actors) {
  const file = `${artDirectory}/${id}.research.webp`;
  const [bytes, info] = await Promise.all([readFile(path.join(root, file)), stat(path.join(root, file))]);
  allAssets.push({
    id, kind: type, file, representedBy: name,
    pixelWidth: ['lord-valthalak', 'isalien'].includes(id) ? 1024 : ['kormok'].includes(id) ? 1145 : ['deliana', 'mokvar'].includes(id) ? 768 : id === 'valthalak-amulet' || id === 'gremnik-rizzlesprang' || id === 'spectral-assassins' || id === 'veiled-blade' ? 768 : 410,
    pixelHeight: ['lord-valthalak', 'isalien'].includes(id) ? 1536 : ['kormok'].includes(id) ? 1374 : ['deliana', 'mokvar'].includes(id) ? 1024 : id === 'valthalak-amulet' || id === 'gremnik-rizzlesprang' || id === 'spectral-assassins' || id === 'veiled-blade' ? 512 : 426,
    sourceArtifact,
    targetEditionBuild: 'Original World of Warcraft Classic story identity; exact character model/build comparison is open.',
    generationPrompt: `Original painterly transparent-background representation: ${representation} No text or frame; interpretive, not canonical game art.`,
    generator: 'OpenAI ImageGen; transparent character/artifact cutout or ensemble tile cropped/exported as WebP.',
    transparency: true,
    visualReview: 'Distinct silhouette and thematic identity checked in the authored story scene. Exact in-client model and costume comparison remains a human review gate.',
    sourceReferences: [...new Set(beats.filter((beat) => beat.cast.includes(id)).flatMap((beat) => beat.src))].map((sourceId) => ({ sourceId, url: sourceUrlById.get(sourceId) })),
    byteLength: bytes.length, modifiedAt: info.mtime.toISOString(), sha256: createHash('sha256').update(bytes).digest('hex'),
  });
}
const sceneLedger = beats.map((beat, index) => ({
  nodeId: nodes[index].id, title: beat.title,
  environmentPath: `${artDirectory}/${beat.env}.research.webp`,
  gameArea: environments.find((scene) => scene[0] === beat.env)[1],
  recognizableTraits: environments.find((scene) => scene[0] === beat.env)[2],
  referenceEditionBuild: 'Original World of Warcraft Classic / Vanilla; no exact in-client capture is claimed.',
  cast: beat.cast.map((id) => ({ id, name: names.get(id), image: `${artDirectory}/${id}.research.webp` })),
  visualActions: ['set_map_state', 'show contextual illustrated cast'],
  chronologyNote: beat.id.startsWith('alternate-fate-') || beat.id === 'the-other-pieces'
    ? 'Alternative class/faction target history. Ordered editorially as companion memorials; not a required consecutive target sequence for a canonical avatar.'
    : beat.id === 'two-faction-doors' ? 'Faction entry paths compared in a split scene; Deliana and Mokvar are not shown as co-present.'
      : 'Story order follows the Classic quest dependencies; scene arrangement is relational, not a travel route.',
  visualReview: 'Original generated art checked against its recorded palette and broad area traits. Human side-by-side comparison to the matching in-game build remains open.',
  claimIds: [`dungeon-set-two-${beat.id}-claim`],
}));
await write('docs/research/dungeon-set-two-visual-assets.json', {
  storyId, status: 'research', targetEditionBuild: 'Original World of Warcraft Classic / Vanilla. No later expansion outcomes enter the narrative.',
  editorialRule: 'Keep each named place recognizably close to its Classic game-area palette and architecture while using original composition. Set descriptions and human in-game resemblance review are mandatory before promotion.',
  sourceProvenance: 'Original image prompts were generated with OpenAI ImageGen. Contact sheets were cropped into independent landscape/character assets; the selected individual Lord Valthalak and Kormok images preserve their sourced drakonid and two-headed-ogre identities.',
  assetRecords: allAssets, sceneLedger,
});

let ledger = '# The Veiled Blade and Lord Valthalak — production and claim ledger\n\n';
ledger += `Status: complete illustrated research story; not reviewed or published. ${nodes.length} scenes; ${nodes.reduce((total, node) => total + node.narration.split(/\s+/).length, 0)} narration words. Primary era: Era 8 / original World of Warcraft Classic. The story closes at Return to Bodley; no TBC, Wrath or later outcomes are included.\n\n`;
ledger += '## Evidence and source boundary\n\nQuest text and the Brazier of Invocation: User’s Manual were checked through Classic database/wiki reproductions. These are secondary mirrors of primary in-game material, not captures from a running original client. Quest IDs and locators are recorded per citation. The manual is Bodley’s own account, so its perspective and uncertainty are preserved: Gremnik’s motive is unknown; the four fragment-target branches are alternatives; and the Veiled Blade’s exact cast and the narrated timeline remain subject to client/build comparison. No claim has been promoted.\n\n';
ledger += `Sources: ${allSourceIds.map((id) => `[${id}](${sourceUrlById.get(id)})`).join('; ')}.\n\n`;
ledger += '## Quest dependency and alternate histories\n\nDeliana (Alliance) and Mokvar (Horde) independently direct their faction paths to Anthion. Dead Man’s Plea → Proof of Life → Anthion’s Strange Request → Anthion’s Old Friend → Falrin’s Vendetta → The Instigator’s Enchantment → The Challenge → Anthion’s Parting Words → Bodley’s Unfortunate Fate. Bodley’s account then explains the Veiled Blade’s contract, Valthalak’s spellbook, Kormok’s claim to the amulet, the division into three pieces, and the curse. Theldren yields the top piece; class/faction variants direct the two remaining searches to one of several haunted companions. The four written companion-fate scenes are a memorial sequence, not one avatar’s mandatory target list. Reunite the amulet → prepare the brazier → Mea Culpa → Return to Bodley. Material collection and timed-dungeon mechanics are not narrated as historical events.\n\n';
ledger += '## Scene and claim ledger\n\n| Scene | Quest / manual evidence | Cast | Environment and area traits | Sequence and geography note |\n| --- | --- | --- | --- | --- |\n';
for (const [index, beat] of beats.entries()) {
  const citations = beat.src.map((sourceId, sourceIndex) => `dungeon-set-two-${beat.id}-citation-${sourceIndex + 1}`);
  const scene = environments.find((item) => item[0] === beat.env);
  ledger += `| ${nodes[index].title} | ${beat.questIds.join('; ')} · ${beat.src.join(', ')} · ${citations.join(', ')} | ${beat.cast.join(', ')} | ${scene[1]} · ${scene[2]} | ${sceneLedger[index].chronologyNote} |\n`;
}
ledger += '\n## Visual, audio and review notes\n\nEach node loads an environment image and each principal named actor, group or pivotal amulet has a distinct repository-backed representation. Paths, generation prompts, image dimensions, hashes, area traits and review gates are in [dungeon-set-two-visual-assets.json](dungeon-set-two-visual-assets.json). The scene theater is relational: it conveys no surveyed geography, exact formation or unsupported co-presence. User-visible transcript and map captions identify the subject when WebGL or optional audio is unavailable.\n\n';
ledger += 'The story reuses the existing standalone Storyline → StoryGuide engine and the Classic-to-Wrath StoryTour; it is not inserted in EraTour. Play All uses the tour’s validated editorial chronology and advances only through complete guides. The 22 transcript-matched AI voice tracks use the repository generator and retain provenance/hashes in its manifest. Audio has not been auditioned for names or pronunciation. Remaining human gates: original-client quest/build capture and dialogue comparison; source and claim approval; side-by-side in-game area resemblance and figure/model review; and listening/pronunciation review.\n';
await write('docs/research/dungeon-set-two-production.md', ledger);

const tourPath = 'data/story-tours/classic-to-wrath.research.json';
const tour = JSON.parse(await readFile(path.join(root, tourPath), 'utf8'));
const entry = {
  storylineId: storyId,
  regionIds: ['eastern-kingdoms'],
  mapPositionPercent: [72, 51],
  order: 3,
  periodLabel: 'Original World of Warcraft · Classic 1.10 era',
  locationLabel: 'Eastern Plaguelands, Stratholme and Blackrock Mountain',
};
tour.entries = tour.entries.filter((item) => item.storylineId !== storyId && item.storylineId !== 'cipher-of-damnation-oronok' && item.storylineId !== 'wrathgate-and-undercity');
tour.entries.push(entry,
  { storylineId: 'cipher-of-damnation-oronok', regionIds: ['outland'], mapPositionPercent: [82, 79], order: 4, periodLabel: 'The Burning Crusade', locationLabel: 'Shadowmoon Valley · Outland' },
  { storylineId: 'wrathgate-and-undercity', regionIds: ['northrend'], mapPositionPercent: [54, 18], order: 5, periodLabel: 'Wrath of the Lich King', locationLabel: 'Dragonblight · Northrend' },
);
tour.entries.sort((a, b) => a.order - b.order);
tour.chronologyNote = 'Play-all order is an editorial expansion-era sequence: original Classic (Onyxia, then the Ahn\'Qiraj campaign, then the 1.10-era Dungeon Set 2 story), The Burning Crusade, and Wrath of the Lich King. It organizes access and does not claim the selected storylines caused one another. The Scepter guide’s ancient prologue remains an explicitly earlier flashback; the Dungeon Set 2 companion routes are an editorial memorial sequence rather than a single canonical character’s complete path.';
tour.reviewNote = 'The playable entries are the Classic Onyxia, Scepter and Dungeon Set 2 stories. Outland\'s Cipher of Damnation and Northrend\'s Wrathgate remain research previews and stay outside Play All. Original-client quest/build, chronology, map-art and in-game location resemblance reviews remain open for human approval.';
await write(tourPath, tour);

const candidatesPath = 'docs/research/questline-story-candidates.md';
let candidates = await readFile(path.join(root, candidatesPath), 'utf8');
candidates = candidates.replace(
  /^(### 03\. Dungeon Set 2: Bodley and Lord Valthalak)\r?$/m,
  '$1\n\n**Implementation:** Complete 22-scene illustrated research story with transcript-matched AI narration, a source/claim ledger, distinct Classic area scenes, four explicitly alternative companion-fate accounts, and a Classic-to-Wrath StoryTour map marker. See the [production ledger](dungeon-set-two-production.md) and [visual asset ledger](dungeon-set-two-visual-assets.json). Original-client comparison, human lore/art review and narration audition remain open.',
);
await write(candidatesPath, candidates);

process.stdout.write(`Authored ${nodes.length} illustrated story nodes, ${allCast.length} represented subjects, ${environments.length} environments, and ${allSourceIds.length} source records.\n`);
