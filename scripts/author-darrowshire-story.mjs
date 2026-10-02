import { createHash } from 'node:crypto';
import { access, mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const storyId = 'darrowshire-lost-and-remembered';
const guideId = `${storyId}-guide`;
const eraClassic = 'age-of-adventurers';
const eraThirdWar = 'third-war-frozen-throne';
const worldspaceId = 'darrowshire-story-theater';
const artDir = 'public/images/storylines/darrowshire';
const imageDir = 'images/storylines/darrowshire';
const output = async (file, data) => {
  const fullPath = path.join(root, file);
  await mkdir(path.dirname(fullPath), { recursive: true });
  await writeFile(fullPath, typeof data === 'string' ? data : `${JSON.stringify(data, null, 2)}\n`);
};

const sources = [
  ['darrowshire-annals-book', 'The Annals of Darrowshire (book transcription)', 'https://warcraft.wiki.gg/wiki/The_Annals_of_Darrowshire', 'other', 'Secondary reproduction of the in-game book. The text dates Scourge attacks to the middle of the Second War, a chronology conflict retained in this story. It is not an original-client capture.'],
  ['darrowshire-extended-annals', 'Extended Annals of Darrowshire (quest transcription)', 'https://warcraft.wiki.gg/wiki/Brother_Carlin', 'quest', 'Secondary quest-text reproduction and locator. It links Carlin, the extended account and Chromie’s proposed temporal intervention; compare with the intended Classic client.'],
  ['darrowshire-battle-history', 'Battle of Darrowshire (historical summary)', 'https://warcraft.wiki.gg/wiki/Battle_of_Darrowshire', 'website', 'Secondary summary frames the fall during the Third War and uses names including Davil Crokford and Marduk Blackpool. It is not an original-client source.'],
  ['darrowshire-classic-chain', 'Rewriting the Battle of Darrowshire quest chain (Classic)', 'https://warcraft.wiki.gg/wiki/Rewriting_the_Battle_of_Darrowshire_quest_chain_(Classic)', 'website', 'Secondary Classic chain guide. Used to locate dependency and branch order; quest dependencies establish play sequence, not exact chronology.'],
  ['darrowshire-little-pamela', 'Little Pamela (Classic quest locator)', 'https://warcraft.wiki.gg/wiki/Little_Pamela_(Classic)', 'quest', 'Secondary locator for Marlene’s request and Pamela’s search. Original client and build comparison remains open.'],
  ['darrowshire-pamelas-doll', 'Pamela’s Doll (Classic quest locator)', 'https://warcraft.wiki.gg/wiki/Pamela%27s_Doll_(quest)', 'quest', 'Secondary reproduction locates recovery of the doll in the ruins. Repeatable combat mechanics are not treated as historic events.'],
  ['darrowshire-auntie-marlene', 'Auntie Marlene (Classic quest locator)', 'https://warcraft.wiki.gg/wiki/Auntie_Marlene', 'quest', 'Secondary reproduction for Marlene’s account, Pamela’s death and Joseph’s reported fate. Exact wording needs in-client comparison.'],
  ['darrowshire-strange-historian', 'A Strange Historian (Classic quest locator)', 'https://warcraft.wiki.gg/wiki/A_Strange_Historian_(Classic)', 'quest', 'Secondary quest reproduction places a wedding ring in the chain and identifies Chromie at Andorhal; quest dependency is not a geographical travel route.'],
  ['darrowshire-annals-quest', 'The Annals of Darrowshire (Classic quest locator)', 'https://warcraft.wiki.gg/wiki/The_Annals_of_Darrowshire', 'quest', 'Secondary book and quest reproduction. Treat the book’s date as a disputed source claim, not a settled era label.'],
  ['darrowshire-defenders', 'Defenders of Darrowshire (Classic quest locator)', 'https://warcraft.wiki.gg/wiki/Defenders_of_Darrowshire_(Classic)', 'quest', 'Secondary objective reproduction describes release of bound Darrowshire spirits. The number is a quest objective, not a historical casualty count.'],
  ['darrowshire-villains', 'Villains of Darrowshire (Classic quest locator)', 'https://warcraft.wiki.gg/wiki/Villains_of_Darrowshire_(Classic)', 'quest', 'Secondary objective reproduction locates the skull attributed to Horgus and a broken sword attributed to Marduk. Item placement is not an exact reconstruction.'],
  ['darrowshire-heroes', 'Heroes of Darrowshire (Classic quest locator)', 'https://warcraft.wiki.gg/wiki/Heroes_of_Darrowshire_(Classic)', 'quest', 'Secondary quest reproduction locates a libram attributed to Davil Lightfire and a damaged Redpath shield.'],
  ['darrowshire-marauders', 'Marauders of Darrowshire (Classic quest locator)', 'https://warcraft.wiki.gg/wiki/Marauders_of_Darrowshire_(Classic)', 'quest', 'Secondary reproduction describes a crystal’s response to five skulls associated with Scourge participants. Collection requirements are gameplay, not a battle roster.'],
  ['darrowshire-return-chromie', 'Return to Chromie (Classic quest locator)', 'https://warcraft.wiki.gg/wiki/Return_to_Chromie', 'quest', 'Secondary quest reproduction for delivery of the relic bundle and temporal preparation.'],
  ['darrowshire-battle-quest', 'The Battle of Darrowshire (Classic quest locator)', 'https://warcraft.wiki.gg/wiki/The_Battle_of_Darrowshire_(quest)', 'quest', 'Secondary objective and completion-text reproduction. The battle is a quest replay. Its resolution is presented as the account the quest offers, not a verified permanent rewrite of every timeline.'],
  ['darrowshire-hidden-treasures', 'Hidden Treasures (Classic quest locator)', 'https://warcraft.wiki.gg/wiki/Eastern_Plaguelands_quests', 'website', 'Eastern Plaguelands quest index confirms the quest follows The Battle of Darrowshire and is given by Pamela in Darrowshire. The exact completion text still needs client capture.'],
];
const sourceRecords = sources.map(([id, title, url, sourceType, notes]) => ({ id, title, url, sourceType, notes: `Accessed 2026-10-02. ${notes}` }));
for (const source of sourceRecords) await output(`data/sources/${source.id}.research.json`, source);

const places = [
  ['darrowshire-village', 'Darrowshire before its fall', 'Open rural human village with timber cottages, modest pale stone bases, a central commons and low foothills. Keep the small-scale Classic Plaguelands settlement distinct from a royal city or gothic fortress.', 'Original Classic-era Western/Eastern Plaguelands village impression: modest human cottages, timber roofs, pale fieldstone footings, open commons, fenced garden strips, cold grassland and low hills. Rural and small, not a keep or city. No text, UI, banner, or copied game screenshot.'],
  ['darrowshire-ruins', 'Darrowshire in the Classic quest era', 'The pre-Cataclysm ruin is a small destroyed village of broken timber and pale masonry among diseased grass; no exact building plan or standing battle formation is asserted.', 'Original Classic-era ruined Plaguelands village: broken timber cottage frames, scattered pale masonry, diseased grass, sparse bare trees and muted gray-green sky. A village ruin rather than a cathedral or large gothic city. No people, text, UI, map labels or copied screenshot.'],
  ['sorrow-hill', 'Sorrow Hill', 'The Western Plaguelands rise and farm country use exposed, diseased grassland, bare timber and low plague haze; keep the memorial country quiet and broad.', 'Original Classic Western Plaguelands landscape at Sorrow Hill: windswept diseased field, sparse leafless trees, low gray-green plague haze, modest human farm remnants and an overcast sky. No Gothic citadel, characters, writing, UI or copied game screenshot.'],
  ['andorhal', 'Andorhal', 'Classic Andorhal reads as a ruined human town with broken pale civic masonry, low rooftops, farms and plague haze; avoid a towering cathedral or oversized fortress.', 'Original pre-Cataclysm Andorhal: compact ruined human town, broken low pale stone civic buildings, timber roofs, abandoned grain stores and cold green-gray plague light. Keep the town scale human and agricultural; no giant cathedral, faction heraldry, people, text or UI.'],
  ['lights-hope-chapel', 'Light’s Hope Chapel', 'A modest pale-stone chapel among open Eastern Plaguelands fields, with restrained blue and gold accents and a small graveyard; it should not resemble a palace.', 'Original Classic Eastern Plaguelands Light’s Hope Chapel: modest pale human stone chapel with restrained blue and gold trim, low grave markers, open diseased grassland and cold clear light. Small sanctuary, not a palace or fortress. No characters, text, UI or copied screenshot.'],
  ['corins-crossing', 'Corin’s Crossing and its nearby waters', 'Sparse road-crossing ruins, a cold lake, low hills and bare trees in the Eastern Plaguelands. Keep the search site as a landscape, not a pinpoint battlefield reconstruction.', 'Original Classic Eastern Plaguelands around Corin’s Crossing: quiet slate lake, sparse dead trees, broken low stone roadwork, pale diseased grass and distant low hills. No large city skyline, characters, exact item position, text, UI or copied game screenshot.'],
  ['hearthglen', 'Hearthglen', 'Classic Hearthglen is a fortified human settlement: pale stone and timber, practical defenses and red-white Scarlet Crusade banners against damaged fields. Do not confuse it with Stormwind Keep.', 'Original Classic pre-Cataclysm Hearthglen, fortified human town with pale gray-white stone, timber buildings, practical wall and watch defenses, restrained red-white Scarlet Crusade banners and cold green-gray plague country. No Stormwind Keep silhouette, no oversized cathedral, no characters, text or UI.'],
  ['gahrrons-withering', 'Gahrron’s Withering', 'Classic farm country with a leaning timber barn, broken fence, pale diseased fields and skeletal trees; the recovered shield is a clue, not a surveyed coordinates claim.', 'Original Classic Western Plaguelands farm at Gahrron’s Withering: leaning timber barn, broken fence rails, pallid diseased field and leafless trees beneath a gray-green sky. Rural and sparse; no characters, exact object placement, text, UI or copied screenshot.'],
];
const placeById = new Map(places.map(([id, name, traits, prompt]) => [id, { id, name, traits, prompt }]));
const environmentFiles = {
  'darrowshire-village': 'darrowshire-before-scourge',
  'darrowshire-ruins': 'darrowshire-ruins',
  'sorrow-hill': 'sorrow-hill',
  andorhal: 'andorhal',
  'lights-hope-chapel': 'lights-hope-chapel',
  'corins-crossing': 'corins-crossing',
  hearthglen: 'hearthglen',
  'gahrrons-withering': 'gahrrons-withering',
};
const environmentSourceArtifacts = {
  'darrowshire-village': ['exec-51720304-eda2-4d69-af4c-d519350ccdfb.png'],
  'darrowshire-ruins': ['exec-51720304-eda2-4d69-af4c-d519350ccdfb.png'],
  'sorrow-hill': ['exec-51720304-eda2-4d69-af4c-d519350ccdfb.png'],
  andorhal: ['exec-51720304-eda2-4d69-af4c-d519350ccdfb.png'],
  'lights-hope-chapel': ['exec-f3f56e45-0856-42cf-9dd2-f82bc959f2cf.png'],
  'corins-crossing': ['exec-f3f56e45-0856-42cf-9dd2-f82bc959f2cf.png'],
  hearthglen: ['exec-f3f56e45-0856-42cf-9dd2-f82bc959f2cf.png', 'exec-e43078c6-9206-41f9-a556-1b2e48453f2c.png'],
  'gahrrons-withering': ['exec-f3f56e45-0856-42cf-9dd2-f82bc959f2cf.png'],
};

const actors = [
  ['pamela', 'Pamela Redpath', 'character', 'pamela-redpath', 'A young human child shown as a spirit in the quest-era scenes; warm brown hair, simple practical dress and clear, gentle spectral light. Her identity is explicit; exact age, face and costume are interpretive.'],
  ['joseph', 'Captain Joseph Redpath', 'character', 'joseph-redpath', 'Human village captain in practical worn militia armor with a modest shield; represented before and during the battle and as a spectral father. Avoid royal insignia or embellished commander armor.'],
  ['marlene', 'Auntie Marlene Redpath', 'character', 'marlene-redpath', 'An older human woman represented as a translucent village spirit in modest rural clothes, with a steady and grieving expression. Costume and likeness are interpretive.'],
  ['carlin', 'Uncle Carlin Redpath', 'character', 'carlin-redpath', 'An older human man in practical travel-worn clothes, rendered as a present-day relative and witness, not a combat hero.'],
  ['davil', 'Davil Lightfire / Davil Crokford', 'character', 'davil-lightfire', 'A village defender carrying a simple sword and modest shield, depicted as an adult human militia fighter. The Annals and quest/history pages vary between Crokford and Lightfire; this is a source-name variant, not proof they are different people.'],
  ['horgus', 'Horgus the Ravager', 'character', 'horgus-the-ravager', 'An imposing Scourge-aligned undead warrior with rough dark armor and a heavy blade, distinct from the human militia. Exact creature model and battle dress remain open.'],
  ['marduk', 'Marduk the Black / Marduk Blackpool', 'character', 'marduk-the-black', 'A sinister Scourge commander in dark practical armor with green plague light. The Annals, quest and secondary history differ in name form; retain both until client review.'],
  ['corrupted-joseph', 'Redpath the Corrupted', 'character', 'redpath-the-corrupted', 'A spectral Captain Joseph under Scourge corruption: recognizable militia silhouette overtaken by cold green necromantic light. The generated transformation is interpretive, not an exact model.'],
  ['chromie', 'Chromie', 'character', 'chromie', 'A small bronze dragon in gnome form, attentive historian with subtle bronze scales and simple traveling clothes. Original interpretation of the Classic NPC, not canonical model art.'],
  ['defenders', 'The Defenders of Darrowshire', 'faction', 'darrowshire-defenders', 'A small ensemble of bound village spirits: human defenders in worn rural militia clothes, shown as a group with spectral chains/light. The image does not assert an exact roster or casualty count.'],
  ['scourge', 'Scourge attackers', 'faction', 'darrowshire-scourge', 'Original ensemble of four varied undead soldiers with rusted armor, ragged dark cloth and green plague eyes. Interpretive group art, not an exact count or canonical unit model.'],
];
const objects = [
  ['doll', 'Pamela’s Doll', 'artifact', 'pamelas-doll', 'A small cloth child’s doll with stitched features and worn fabric. Its simple, cherished role is source-supported; exact toy design is interpretive.'],
  ['ring', 'Joseph’s wedding ring', 'artifact', 'josephs-wedding-ring', 'A plain worn gold band, a family keepsake and clue in the chain. No inscription or exact model is asserted.'],
  ['annals', 'The Annals of Darrowshire', 'artifact', 'annals-of-darrowshire', 'A worn book of village history; no legible page text is reproduced.'],
  ['extended-annals', 'Extended Annals of Darrowshire', 'artifact', 'extended-annals-of-darrowshire', 'A second, larger historical volume associated with Carlin and the battle replay; no legible page text is reproduced.'],
  ['libram', 'Davil Lightfire’s Libram', 'artifact', 'davil-libram', 'A worn bound religious book attributed by the quest to Davil Lightfire; the attribution and spelling remain source-variant evidence.'],
  ['shield', 'Joseph Redpath’s broken shield', 'artifact', 'redpath-shield', 'A cracked human militia shield recovered as a historical relic; heraldry and exact item model remain open.'],
  ['horgus-skull', 'Skull attributed to Horgus', 'artifact', 'horgus-skull', 'An ancient undead skull used by the quest as a relic clue; its naming follows the quest locator and does not prove exact remains.'],
  ['marduk-sword', 'Shattered sword attributed to Marduk', 'artifact', 'shattered-sword-of-marduk', 'A broken dark blade used as a relic clue; its connection follows the quest account, not archaeological verification.'],
  ['relic-bundle', 'Bundle of relics and mystic crystal', 'artifact', 'bundle-of-relics', 'A bundled assembly of recovered relics and a crystal in original interpretive design. It signifies the spell’s ingredients, not an artifact inventory verified by independent sources.'],
];
const subjects = [...actors, ...objects].map(([short, name, type, asset, description]) => ({ id: `${storyId}-${short}`, short, name, type, asset, description }));
const subjectById = new Map(subjects.map((subject) => [subject.id, subject]));
const aid = (short) => `${storyId}-${short}`;
const subjectSourceArtifacts = (subject) => subject.short === 'scourge'
  ? ['exec-d6d28106-afad-4b50-9ea5-7d7c99484f19.png']
  : subject.type === 'artifact'
    ? ['exec-45ab109f-35d1-4e79-a86e-d94ae55b1edd.png']
    : ['exec-479de87b-7c2c-4dc7-8e11-58cd5489e55a.png'];

const beats = [
  { id: 'annals-date-conflict', title: 'Flashback · Era 7 — The date the Annals give', env: 'darrowshire-village', location: 'darrowshire-village', era: eraThirdWar, cast: ['scourge', 'joseph', 'davil'], objects: ['annals'], sources: ['darrowshire-annals-book', 'darrowshire-battle-history'], quests: ['The Annals of Darrowshire · opening account', 'Battle of Darrowshire · historical summary'], confidence: 'strongly_supported', status: 'disputed', text: 'The Annals begin in a village under threat, but their first date creates a problem this telling will not smooth away. The book says the Scourge was rampaging in the middle of the Second War; another historical account places Darrowshire’s fall in the Third War. The Third War frame is used here because the named Scourge war belongs to that later crisis, while the Annals’ wording remains visible as a contradiction in the record. The village is small and rural, its fate more certain than its date.', note: 'Annals chronology conflicts with the Third War context. Era 7 is the editorial historical frame, not an approval to silently correct the source. Original book edition and game text need review.' },
  { id: 'horgus-arrives', title: 'Horgus enters the battle', env: 'darrowshire-village', location: 'darrowshire-village', era: eraThirdWar, cast: ['horgus', 'scourge', 'joseph', 'davil'], objects: [], sources: ['darrowshire-annals-book', 'darrowshire-battle-history'], quests: ['The Annals · Horgus and the attack', 'Battle of Darrowshire · account'], text: 'The account names Horgus the Ravager among the Scourge force that reaches Darrowshire. Captain Joseph Redpath and Davil lead the village’s defense in the story remembered by the later questline. We can show a small settlement meeting an invading force; we cannot recover its exact formation, the number of attackers, or the moment each defender first fell. The landscape is rendered as the fragile home at stake, not as a measured battlefield plan.', note: 'The sources support an attack and named participants, but not exact force size, formation, or co-presence timing.' },
  { id: 'davil-falls', title: 'Davil’s last stand', env: 'darrowshire-ruins', location: 'darrowshire-village', era: eraThirdWar, cast: ['davil', 'horgus', 'joseph'], objects: ['libram'], sources: ['darrowshire-annals-book', 'darrowshire-battle-history', 'darrowshire-heroes'], quests: ['The Annals · Davil’s fight', 'Heroes of Darrowshire · Davil’s relic'], text: 'Davil fights Horgus and the Annals say he strikes the Scourge champion down, only to die of his own wounds. Later sources call this defender Davil Lightfire in the quest and Davil Crokford in the book and history summary. The story holds both names together as a textual variant pending client comparison. His later libram is treated as a memorial clue; the search quest does not establish where it rested during the original battle.', note: 'Davil’s surname varies by account: Crokford in the Annals/history summary and Lightfire in the quest. Preserve as a disputed source variant.' },
  { id: 'joseph-corrupted', title: 'Marduk turns Joseph', env: 'darrowshire-ruins', location: 'darrowshire-village', era: eraThirdWar, cast: ['marduk', 'joseph', 'corrupted-joseph', 'scourge'], objects: [], sources: ['darrowshire-annals-book', 'darrowshire-battle-history'], quests: ['The Annals · Joseph’s corruption', 'Battle of Darrowshire · account'], text: 'After Davil’s fall, the Annals say Marduk the Black corrupts Joseph Redpath. The village captain becomes a danger to the people he led, and the account ends in Darrowshire’s destruction. The secondary history calls Marduk Blackpool. The two forms may reflect a naming variation, but the evidence gathered here does not settle it. Nor can the broad massacre account tell us the position or final moment of every villager.', note: 'Marduk the Black and Marduk Blackpool are preserved as variants. The art depicts corruption symbolically and does not assert an exact transformation scene.' },
  { id: 'pamela-hidden', title: 'A child hidden from the battle', env: 'sorrow-hill', location: 'sorrow-hill', era: eraThirdWar, cast: ['marlene', 'pamela'], objects: ['doll'], sources: ['darrowshire-annals-book', 'darrowshire-auntie-marlene'], quests: ['The Annals · destruction account', 'Auntie Marlene · later witness account'], confidence: 'strongly_supported', status: 'disputed', text: 'The later quest gives a more intimate memory: Marlene says she hid Pamela when the fighting came. That account sits uneasily beside the Annals’ sweeping language that the village was destroyed and its inhabitants slain. The story keeps the difference open. Marlene’s report explains why Pamela is encountered as a child’s spirit, but neither source offers an independent account of how every resident met their end.', note: 'The Annals’ broad death account and Marlene’s statement that Pamela was hidden are not reconciled. Do not invent a survival mechanism or revise either account.' },
  { id: 'marlene-seeks', title: 'Era 8 — Marlene’s request', env: 'sorrow-hill', location: 'sorrow-hill', era: eraClassic, cast: ['marlene'], objects: [], sources: ['darrowshire-little-pamela'], quests: ['Little Pamela · opening request'], text: 'In the later Classic quest, a wandering spirit named Marlene asks for help finding Pamela. The road begins in the Plaguelands of another age, where the old village no longer stands whole. This is investigation, not the battle itself: every witness and object will be encountered through the quest’s present-day search. The adventurer remains unnamed, and the order of errands records how the game guides that search, not a known calendar.', note: 'Era 8 scene. Story order follows quest dependency; the player’s identity and exact date are unknown.' },
  { id: 'pamela-and-doll', title: 'The doll among the ruins', env: 'darrowshire-ruins', location: 'darrowshire-village', era: eraClassic, cast: ['pamela'], objects: ['doll'], sources: ['darrowshire-little-pamela', 'darrowshire-pamelas-doll'], quests: ['Little Pamela · village search', 'Pamela’s Doll · three pieces'], text: 'Pamela appears among the ruined homes, still waiting in the world her family lost. Her doll is missing, and the quest sends the visitor through the broken settlement to recover its scattered parts. The action belongs to the Classic investigation; it does not establish that the doll lay in these exact visible stones or that the child’s spirit understands the history around her. The small object makes a vast catastrophe personal.', note: 'The game quest supports Pamela and the doll search. The precise placement of the illustrated toy is interpretive.' },
  { id: 'pamela-asks', title: 'Pamela asks for her family', env: 'darrowshire-ruins', location: 'darrowshire-village', era: eraClassic, cast: ['pamela'], objects: ['doll'], sources: ['darrowshire-pamelas-doll'], quests: ['Pamela’s Doll · completion'], text: 'With the doll restored, Pamela’s questions turn toward her parents and the home she remembers. The quest lets the child’s request lead the investigation onward; it does not give the unnamed traveler a private biography or a new place in the Redpath family. We keep the scene quiet: a remembered child, a found keepsake, and an answer that only relatives and the old records can begin to provide.', note: 'Narration paraphrases the quest progression and does not reproduce game dialogue.' },
  { id: 'marlene-tells-truth', title: 'The truth Marlene cannot give Pamela', env: 'sorrow-hill', location: 'sorrow-hill', era: eraClassic, cast: ['marlene'], objects: [], sources: ['darrowshire-auntie-marlene'], quests: ['Auntie Marlene · family account'], text: 'Marlene’s account says Pamela died, while Joseph’s fate leads toward the battle’s corrupted captain. Yet she cannot bring herself to tell the child the whole truth. Her silence is a choice in the quest’s present, shaped by the family’s grief; no hidden motive beyond that account is supplied. The village story now has two witnesses at different distances from the event: a child asking, and an aunt carrying an answer she cannot speak.', note: 'Marlene’s dialogue is secondary quest reproduction. Do not expand her reluctance into unstated psychology.' },
  { id: 'wedding-ring', title: 'A ring and a historian', env: 'andorhal', location: 'andorhal', era: eraClassic, cast: ['chromie'], objects: ['ring'], sources: ['darrowshire-strange-historian'], quests: ['A Strange Historian · Joseph’s ring and Chromie'], text: 'A wedding ring becomes the clue that turns a family search toward history. The quest brings the object to Chromie, a bronze dragon who has taken the form of a gnome historian in Andorhal. This small ruined town supplies a believable Classic Plaguelands setting, though the quest does not chart the traveler’s road. The ring binds the family question to Chromie’s larger interest in a battle the living can no longer visit directly.', note: 'The location of Chromie changed across patches; Andorhal is the Classic locator. No exact NPC coordinates or travel path are asserted.' },
  { id: 'annals-read', title: 'The Annals keep a broken date', env: 'andorhal', location: 'andorhal', era: eraClassic, cast: ['chromie'], objects: ['annals'], sources: ['darrowshire-annals-quest', 'darrowshire-annals-book', 'darrowshire-battle-history'], quests: ['The Annals of Darrowshire · book account'], confidence: 'strongly_supported', status: 'disputed', text: 'The Annals give the visitor a written account of Darrowshire’s last battle, including the Second War date that cannot be reconciled here with a Scourge attack in the Third War. This telling cites the book as evidence and labels its chronology disputed rather than silently repairing it. The recollection of combat may preserve names and sequence while the date has been miscopied, retconned, or framed differently; the sources consulted do not let us choose among those explanations.', note: 'Possible error, retcon, or framing difference remains an open research question; none is promoted as fact.' },
  { id: 'carlin-witness', title: 'Carlin and the bound defenders', env: 'lights-hope-chapel', location: 'lights-hope-chapel', era: eraClassic, cast: ['carlin', 'defenders'], objects: [], sources: ['darrowshire-defenders', 'darrowshire-extended-annals'], quests: ['Uncle Carlin · family account', 'Defenders of Darrowshire · objective'], text: 'At Light’s Hope Chapel, Carlin remembers the people of the village and asks that the dead defenders be freed from Scourge service. The quest records a group of spirits bound in hostile forms; its objective count belongs to play mechanics, not a census of everyone who lived or died. The modest chapel in the open Plaguelands gives this act a place of witness, while the spirits’ exact appearance and number remain unknown.', note: 'Do not turn the quest objective count into a historical headcount or imply every defender is individually identified.' },
  { id: 'villains-relics', title: 'The skull and the shattered blade', env: 'corins-crossing', location: 'corins-crossing', era: eraClassic, cast: ['horgus', 'marduk'], objects: ['horgus-skull', 'marduk-sword'], sources: ['darrowshire-villains'], quests: ['Villains of Darrowshire · Horgus and Marduk relics'], text: 'The first relic trail turns toward the remembered villains. The quest associates a skull with Horgus and a broken sword with Marduk, leading the search to different places around the Plaguelands. These are clues chosen by a historical investigation, not excavated proof that the objects lay exactly where the illustration places them. The broken weapon gives Marduk a material trace even while the Annals’ version of his name remains unsettled.', note: 'Quest attributions guide the story. No exact relic coordinates, archaeological provenance or recovered battlefield inventory are asserted.' },
  { id: 'davil-libram', title: 'Davil’s libram at Hearthglen', env: 'hearthglen', location: 'hearthglen', era: eraClassic, cast: ['davil'], objects: ['libram'], sources: ['darrowshire-heroes'], quests: ['Heroes of Darrowshire · Davil’s libram'], text: 'The Heroes quest associates Davil Lightfire’s libram with Hearthglen, carrying a trace of the defender into the fortified human town. Its pale stone and red-white Scarlet banners identify Classic Hearthglen without turning it into Stormwind’s blue-and-gold keep. The book is a recovered clue attributed to Davil, not proof of its exact earlier route or of every hand through which it passed.', note: 'Hearthglen and the Lightfire name follow the quest locator. Exact building and item placement remain unverified.' },
  { id: 'heroes-relics', title: 'Joseph’s shield at the ruined farm', env: 'gahrrons-withering', location: 'gahrrons-withering', era: eraClassic, cast: ['joseph'], objects: ['shield'], sources: ['darrowshire-heroes'], quests: ['Heroes of Darrowshire · Redpath shield'], text: 'A separate relic leads to Gahrron’s Withering, where the quest locates Joseph Redpath’s broken shield near a ruined farm. Its damage speaks to the village captain’s remembered role, but the object alone cannot tell how or when it was lost. Here the Plaguelands narrow from the fortified town to a leaning barn, broken fence and pallid field: a rural clue, not a complete account of the battle.', note: 'The quest locates a shield near the farm. Exact coordinates and damage history are not stated.' },
  { id: 'marauders-crystal', title: 'The crystal answers the skulls', env: 'corins-crossing', location: 'corins-crossing', era: eraClassic, cast: ['chromie', 'scourge'], objects: ['relic-bundle'], sources: ['darrowshire-marauders'], quests: ['Marauders of Darrowshire · crystal and five skulls'], text: 'A mystic crystal responds to five skulls associated by the quest with Scourge that took part in the assault. Their collection is a gameplay task, so it cannot be read as a definitive list of every enemy or a complete battle roster. It adds another layer to Chromie’s reconstruction: selected remains, a remembered account, and relics tied to those who fought. The exact mechanism of the crystal is not explained beyond its use in the quest.', note: 'Five skulls is the quest requirement, not an independently verified number of Scourge participants.' },
  { id: 'extended-account', title: 'Carlin’s extended account', env: 'lights-hope-chapel', location: 'lights-hope-chapel', era: eraClassic, cast: ['carlin'], objects: ['extended-annals', 'relic-bundle'], sources: ['darrowshire-extended-annals', 'darrowshire-return-chromie'], quests: ['Brother Carlin · Extended Annals', 'Return to Chromie · relic bundle'], text: 'Carlin provides the extended account and the accumulated relics pass back to Chromie. The text describes a plan to revisit the battle and correct its consequences, but the quest delegates the historical decision to a time spell rather than explaining its larger metaphysics. This gathered bundle is a narrative device supported by quest order; the exact composition of every piece and the intervention’s limits are not independently established.', note: 'The extension supplies the quest rationale. Do not claim the player or Chromie can permanently rewrite all history.' },
  { id: 'replay-begins', title: 'The battle is called back', env: 'darrowshire-village', location: 'darrowshire-village', era: eraClassic, cast: ['chromie', 'defenders', 'scourge', 'davil', 'horgus'], objects: ['relic-bundle'], sources: ['darrowshire-return-chromie', 'darrowshire-battle-quest'], quests: ['Return to Chromie · preparation', 'The Battle of Darrowshire · replay begins'], text: 'Chromie’s spell returns the traveler to a reenactment of Darrowshire’s battle. The scene is explicitly a remembered, playable past, separated from the present-day investigation. Its instructions focus on outcomes: Davil must remain alive until Horgus falls, and Joseph must live long enough to be corrupted before the corrupted captain is defeated. The quest therefore offers a limited correction inside the replay; it does not erase the evidence that the original village was destroyed.', note: 'Historical flashback / quest replay in Era 8. Do not treat it as a new Era 7 event or claim a permanent timeline reset.' },
  { id: 'davil-and-horgus', title: 'Davil survives Horgus', env: 'darrowshire-ruins', location: 'darrowshire-village', era: eraClassic, cast: ['davil', 'horgus', 'defenders'], objects: [], sources: ['darrowshire-battle-quest'], quests: ['The Battle of Darrowshire · survival objective'], text: 'In the quest’s reenacted battle, Davil is to endure until Horgus is slain. The task reverses the fatal pattern recorded in the Annals without pretending that every part of the old account has been repaired. The defender and the Scourge champion meet in a staged scene, not a recovered battle plan. This moment marks the specific loss the quest allows its visitor to prevent in the remembered battle.', note: 'The objective is explicit in the quest locator. Combat choreography and exact scene composition are interpretive.' },
  { id: 'redpath-corrupted', title: 'The captain falls to corruption', env: 'darrowshire-ruins', location: 'darrowshire-village', era: eraClassic, cast: ['joseph', 'marduk', 'corrupted-joseph', 'pamela'], objects: [], sources: ['darrowshire-annals-book', 'darrowshire-battle-quest'], quests: ['The Annals · Joseph’s corruption', 'The Battle of Darrowshire · Redpath objective'], text: 'The second condition cannot be avoided: Joseph must live long enough to become corrupted, and then the visitor must defeat Redpath the Corrupted. Marduk’s role belongs to the Annals’ account; the quest objectives do not show every cause in the reenactment. The story keeps Joseph’s change distinct from Davil’s survival, so the battle’s altered course does not collapse into a claim that no one was lost or that the Scourge never reached Darrowshire.', note: 'The replay’s objectives constrain what can change. Do not invent a lasting post-spell state beyond the quest account.' },
  { id: 'family-homecoming', title: 'Pamela hears the battle end', env: 'darrowshire-ruins', location: 'darrowshire-village', era: eraClassic, cast: ['pamela', 'joseph'], objects: ['doll'], sources: ['darrowshire-battle-quest', 'darrowshire-hidden-treasures', 'darrowshire-classic-chain'], quests: ['The Battle of Darrowshire · completion', 'Hidden Treasures · Pamela’s key'], text: 'After the fighting, the quest brings Joseph’s spirit to Pamela, and the child speaks as if her father will come home. The account presents their reunion as the battle’s remembered resolution; the deeper effect of Chromie’s spell on a lasting timeline remains uncertain. Pamela then entrusts the traveler with a key to a chest behind the house. Her small act of welcome closes the chain with an image of homecoming, while the village’s original loss remains part of the record.', note: 'Reunion and key follow secondary quest-chain transcription. The persistence and scope of temporal change require original-client and lore review.' },
];

const usedSubjectIds = [...new Set(beats.flatMap((beat) => [...beat.cast, ...beat.objects].map(aid)))];
const allSourceIds = [...new Set(beats.flatMap((beat) => beat.sources))];
const envIds = [...new Set(beats.map((beat) => beat.env))];

for (const envId of envIds) {
  const place = placeById.get(envId);
  const asset = `${imageDir}/${environmentFiles[envId]}.research.webp`;
  await access(path.join(root, 'public', asset));
  await output(`data/map-states/${storyId}-${envId}.research.json`, {
    id: `${storyId}-${envId}-scene`, name: `Darrowshire: ${place.name}`, worldspaceId,
    presentation: 'relational', terrainTextureAsset: asset, geometryIds: [],
    cartographyLabel: envId === 'darrowshire-village' || envId === 'darrowshire-ruins' ? 'DARROWSHIRE · STORY SCENE' : 'CLASSIC PLAGUELANDS · STORY SCENE',
    interpretationNote: `Original generated Classic Plaguelands illustration for ${place.name}. Recognizable version traits: ${place.traits} The scene is interpretive art, not a screenshot, exact model, surveyed coordinate, quest object placement or route. Matching-game-build comparison remains open; see docs/research/${storyId}-visual-assets.json.`,
  });
}

for (const id of usedSubjectIds) {
  const subject = subjectById.get(id);
  if (!subject) throw new Error(`Missing subject declaration: ${id}`);
  const asset = `${imageDir}/${subject.asset}.research.webp`;
  await access(path.join(root, 'public', asset));
  const refs = [...new Set(beats.filter((beat) => [...beat.cast, ...beat.objects].map(aid).includes(id)).flatMap((beat) => beat.sources))];
  const type = subject.type;
  const description = `${subject.description} Original interpretive art, not official game art or evidence of canonical appearance. See the visual ledger for comparison limits.`;
  await output(`data/entities/${id}.research.json`, {
    id, type, name: subject.name, slug: id, shortDescription: subject.description, body: description,
    firstEraId: eraClassic, featuredEraIds: [eraClassic], sourceIds: refs,
    tags: ['darrowshire-story', 'interpretive-art'],
    ...(type === 'character' || type === 'faction' ? { mapFigure: { asset, scale: type === 'faction' ? (subject.short === 'scourge' ? 1.55 : 1.25) : 0.86 } } : { mapVisual: { asset, scale: 0.68 } }),
    contentStatus: 'research',
  });
}

const subjectSlot = new Map();
for (const id of usedSubjectIds) {
  const neighbors = new Set(beats.filter((beat) => [...beat.cast, ...beat.objects].map(aid).includes(id)).flatMap((beat) => [...beat.cast, ...beat.objects].map(aid)));
  const used = new Set([...neighbors].map((neighbor) => subjectSlot.get(neighbor)).filter((slot) => slot !== undefined));
  let slot = 0;
  while (used.has(slot)) slot++;
  subjectSlot.set(id, slot);
}
const totalSlots = Math.max(...subjectSlot.values()) + 1;
const features = [];
const stageColumns = [4500, 5500];
const stageRows = [4700, 5500, 6300, 7100, 7900, 8700];
for (const id of usedSubjectIds) {
  const slot = subjectSlot.get(id);
  const row = Math.floor(slot / stageColumns.length);
  if (row >= stageRows.length) throw new Error(`Darrowshire needs more compact stage positions (${totalSlots} slots) than the authored theater supports.`);
  const x = stageColumns[slot % stageColumns.length];
  const geometryId = `${storyId}-${id}-focus`;
  features.push({ type: 'Feature', id: geometryId, properties: { name: `${subjectById.get(id).name} editorial focus`, contentStatus: 'research', styleRole: 'site', geographicCertainty: 'unknown' }, geometry: { type: 'Point', coordinates: [x, stageRows[row]] } });
  const refs = [...new Set(beats.filter((beat) => [...beat.cast, ...beat.objects].map(aid).includes(id)).flatMap((beat) => beat.sources))];
  await output(`data/spatial-states/${storyId}-${id}.research.json`, {
    id: `${storyId}-${id}-theater`, entityId: id, eraId: eraClassic, worldspaceId, geometryId,
    placementKind: 'relational', geographicCertainty: 'unknown', sourceIds: refs,
    editorNote: 'Editorial placement in a relational Darrowshire theater. This position is not a world coordinate, formation, route, historic co-presence claim or canonical model placement.',
    visualPresence: 'contextual', labelPriority: 240,
  });
}
await output(`data/geometry/${storyId}-theater.research.geojson`, { type: 'FeatureCollection', features });
await output(`data/worldspaces/${worldspaceId}.research.json`, { id: worldspaceId, name: 'Darrowshire — relational story theater', slug: worldspaceId, coordinateSystem: { width: 10000, height: 10000, origin: 'bottom-left', units: 'atlas-units' } });

for (const envId of envIds) {
  const prior = await readFile(path.join(root, `data/entities/${envId}.research.json`), 'utf8').then(JSON.parse).catch(() => undefined);
  const refs = [...new Set(beats.filter((beat) => beat.location === envId || beat.env === envId).flatMap((beat) => beat.sources))];
  await output(`data/entities/${envId}.research.json`, {
    ...(prior ?? {}), id: envId, type: 'location', name: placeById.get(envId).name, slug: envId,
    shortDescription: placeById.get(envId).traits,
    body: `${placeById.get(envId).traits} Map presentation is relational and interpretive. No exact coordinate, historical route, item position, or client-matched layout is asserted.`,
    firstEraId: prior?.firstEraId ?? eraClassic, featuredEraIds: [...new Set([...(prior?.featuredEraIds ?? []), eraClassic])],
    sourceIds: [...new Set([...(prior?.sourceIds ?? []), ...refs])], tags: [...new Set([...(prior?.tags ?? []), 'darrowshire-story', 'classic-plaguelands'])], contentStatus: prior?.contentStatus ?? 'research',
  });
}

const storyFile = `data/stories/${storyId}.research.json`;
const priorStory = await readFile(path.join(root, storyFile), 'utf8').then(JSON.parse).catch(() => undefined);
const priorNodes = new Map((priorStory?.nodes ?? []).map((node) => [node.id, node]));
const nodes = [];
for (const [index, beat] of beats.entries()) {
  const nodeId = `${storyId}-story-${beat.id}`;
  const eventId = `${storyId}-${beat.id}-event`;
  const claimId = `${storyId}-${beat.id}-claim`;
  const citationIds = [];
  for (const [sourceIndex, sourceId] of beat.sources.entries()) {
    const citationId = `${storyId}-${beat.id}-citation-${sourceIndex + 1}`;
    citationIds.push(citationId);
    await output(`data/citations/${citationId}.research.json`, {
      id: citationId, sourceId,
      section: `${beat.quests[Math.min(sourceIndex, beat.quests.length - 1)]} · ${beat.title}; directly relevant book account, quest locator, objective or completion entry`,
      note: 'Original paraphrase of secondary book or Classic quest reproductions. No original-client capture is claimed. Compare original quest build and text before human review.',
    });
  }
  await output(`data/claims/${claimId}.research.json`, {
    id: claimId, subjectId: eventId, predicate: 'darrowshire_story_scene', value: beat.text,
    citationIds, confidence: beat.confidence ?? 'strongly_supported', status: beat.status ?? 'active',
    editorNote: beat.note ?? 'Exact event date, placement, battle staging and unseen outcomes remain unknown. Quest order is an editorial sequence, not proof of exact chronology.',
  });
  await output(`data/events/${eventId}.research.json`, {
    id: eventId, kind: 'event', name: beat.title, slug: `${storyId}-${beat.id}`, eraId: beat.era, worldspaceId,
    date: { precision: 'relative', label: beat.era === eraThirdWar ? 'Third War historical prologue · exact date disputed in the Annals' : 'Original World of Warcraft Classic quest sequence · exact date unknown' },
    summary: beat.text, locationIds: [beat.location], participantEntityIds: [...new Set([...beat.cast, ...beat.objects].map(aid))],
    sourceIds: beat.sources, claimIds: [claimId], contentStatus: 'research',
  });
  const entityIds = [...new Set([...beat.cast, ...beat.objects].map(aid))];
  const priorNode = priorNodes.get(nodeId);
  const voiceover = priorNode?.narration === beat.text ? priorNode.voiceover : undefined;
  nodes.push({
    id: nodeId, guideId, title: beat.title, narration: beat.text,
    durationMs: voiceover?.durationMs ?? Math.round(((beat.text.split(/\s+/).length / 82) * 60000) / 500) * 500 + 5000,
    ...(voiceover ? { voiceover } : {}),
    eventIds: [eventId], entityIds, locationIds: [beat.location],
    camera: { position: [0, 6.2, 5.4], target: [0, 0, 0], durationMs: 1100 },
    visualActions: [{ type: 'set_map_state', mapStateId: `${storyId}-${beat.env}-scene` }],
    ...(index ? { previousNodeId: nodes[index - 1].id } : {}),
    ...(index < beats.length - 1 ? { nextNodeIds: [`${storyId}-story-${beats[index + 1].id}`] } : {}),
  });
}

const guide = {
  id: guideId, eraId: eraClassic, title: 'Darrowshire: Lost and Remembered',
  description: 'Twenty-one illustrated scenes follow Darrowshire’s disputed Third War fall, Pamela’s Classic-era search, its witness accounts and relics, and the battle replay that gives the quest its homecoming.',
  nodeIds: nodes.map((node) => node.id), contentStatus: 'research',
};
await output(storyFile, { guide, nodes });

const chapters = [
  { id: 'the-fall', eraId: eraThirdWar, title: 'The fall of Darrowshire', body: 'The Scourge attack, Davil’s death and Joseph’s corruption establish the remembered catastrophe. The Annals’ Second War date and the Third War framing remain in direct conflict.' },
  { id: 'pamelas-search', eraId: eraClassic, title: 'Pamela’s family', body: 'Marlene sends the Classic investigator through the ruins, to Pamela, and back through the relatives who remember the village.' },
  { id: 'witnesses-and-relics', eraId: eraClassic, title: 'Witnesses and relics', body: 'Carlin, the Annals and scattered relics let Chromie assemble a constrained retelling. Branch order and item recovery are quest structure, not exact chronology or geography.' },
  { id: 'the-replayed-battle', eraId: eraClassic, title: 'The battle revisited', body: 'The quest replay preserves specific losses and alters others. Joseph and Pamela reunite in the account; the lasting scope of the spell remains unresolved.' },
].map((chapter) => chapter);

const storyline = {
  id: storyId, slug: storyId, title: 'Darrowshire: Lost and Remembered',
  summary: 'Pamela’s search follows a ruined village’s divided accounts, the relatives and relics that preserve them, and Chromie’s attempt to revisit the battle that broke the Redpath family.',
  opening: 'A child in the ruins asks after her family. Her question leads through a village’s torn history, where one book gives a date the wider war will not accept and a later spell offers a limited answer.',
  primaryEraId: eraClassic, eraIds: [eraThirdWar, eraClassic], chapters, sourceIds: allSourceIds,
  reviewNote: 'Complete illustrated research story: 21 scenes, full transcript, event/claim/citation per scene, generated Classic Plaguelands environments, named cast/group art and pivotal relic art. Secondary wiki mirrors reproduce book and Classic quest material; no original client capture is claimed. The Annals’ Second War date conflicts with the Third War frame; Davil Crokford/Lightfire and Marduk the Black/Blackpool variants remain open. Pamela’s reunion follows the quest account; permanent timeline consequences remain uncertain. Verify original client/build, visual resemblance, pronunciation and all claims before editorial promotion.',
  storyGuideId: guideId, contentStatus: 'research',
};
await output(`data/storylines/${storyId}.research.json`, storyline);

for (const [eraId, sourceIds, eventIds] of [[eraClassic, allSourceIds, []], [eraThirdWar, ['darrowshire-annals-book', 'darrowshire-battle-history'], beats.filter((beat) => beat.era === eraThirdWar).map((beat) => `${storyId}-${beat.id}-event`)]]) {
  const file = path.join(root, `data/eras/${eraId}.research.json`);
  const era = JSON.parse(await readFile(file, 'utf8'));
  era.sourceIds = [...new Set([...era.sourceIds, ...sourceIds])];
  if (eventIds.length) era.featuredEventIds = [...new Set([...era.featuredEventIds, ...eventIds])];
  await output(`data/eras/${eraId}.research.json`, era);
}

const tourFile = 'data/story-tours/classic-to-wrath.research.json';
const tour = JSON.parse(await readFile(path.join(root, tourFile), 'utf8'));
const insertion = {
  storylineId: storyId, regionIds: ['eastern-kingdoms'], mapPositionPercent: [70, 43], order: 6,
  periodLabel: 'Original World of Warcraft · Classic', locationLabel: 'The Plaguelands · Darrowshire',
};
tour.entries = [...tour.entries.filter((entry) => entry.storylineId !== storyId), insertion];
const order = new Map([
  ['stormwind-onyxia-conspiracy', 1], ['scepter-of-the-shifting-sands', 2], ['dungeon-set-two-veiled-blade', 3],
  ['fallen-hero-and-rakhlikh', 4], ['tirion-taelan-of-love-and-family', 5], [storyId, 6],
  ['karazhan-masters-key-and-nightbane', 7], ['akama-and-black-temple', 8], ['cipher-of-damnation-oronok', 9],
  ['wrathgate-and-undercity', 10], ['quel-delar-restored', 11],
]);
for (const entry of tour.entries) entry.order = order.get(entry.storylineId) ?? entry.order;
tour.entries.sort((a, b) => a.order - b.order);
tour.chronologyNote = 'Play-all order is an editorial expansion-era sequence: Classic (Onyxia, Scepter, Dungeon Set 2, the Fallen Hero, Tirion and Taelan, then Darrowshire), The Burning Crusade (Karazhan, Akama and the Black Temple, then the Outland Cipher preview), and Wrath (Wrathgate preview followed by Quel’Delar). It organizes access and does not claim canonical relative dates or causal links between stories. Darrowshire’s Third War fall is a labeled flashback; its Classic investigation and constrained battle replay remain distinct. The Annals’ Second War date is disputed. Other branch, faction and flashback caveats remain as recorded in each story.';
tour.reviewNote = 'Playable research guides now include Darrowshire as a 21-scene illustrated story after Tirion and Taelan in the Classic sequence. Cipher of Damnation and Wrathgate remain text-first previews outside Play All. Original-client text/build, disputed chronology, character-name variants, permanent temporal outcome, generated area/model resemblance and narration audition remain human review gates. Markers are illustrative interface anchors, not exact locations or travel routes.';
await output(tourFile, tour);

const productionPath = `docs/research/${storyId}-production.md`;
let production = `# Darrowshire: Lost and Remembered — production and claim ledger\n\n`;
production += `Status: complete illustrated research story; not reviewed or published. ${nodes.length} scenes; ${nodes.reduce((sum, node) => sum + node.narration.split(/\s+/).length, 0)} transcript words. Historical prologue: Era 7 / Third War frame. Investigation: Era 8 / original Classic quest chain. Exact date unknown and disputed.\n\n`;
production += '## Scope and evidence boundary\n\nThe story begins with the Third War account of the village’s fall, then moves to the later Classic investigation. It ends with the replay’s reported reunion and Hidden Treasures key. It excludes Cataclysm’s replacement quest flow and makes no claim that the spell permanently changed every timeline. Secondary quest and book transcriptions are discovery evidence; original game capture is still required for human lore approval.\n\n';
production += 'The Annals place Scourge attacks in the middle of the Second War; the story’s historical prologue uses the Third War because of the Scourge context and competing history summary. It does not declare the Annals corrected. Davil Crokford/Lightfire and Marduk the Black/Blackpool are likewise retained as source variants pending client comparison. Pamela’s reported death and Marlene’s account of hiding her are not reconciled.\n\n';
production += 'Classic quest branches have flexible order: Pamela’s search divides through Marlene and Carlin; witness and relic tasks can vary, and the replay’s objectives establish scene constraints but not exact dates. The authored node sequence is an editorial reading order. Gameplay collection counts, repeated kills and item handoffs are not narrated as historical evidence.\n\n';
production += '## Beat ledger\n\n| Scene | Era and source section | Principal cast and objects | Place traits | Claim confidence and open question |\n| --- | --- | --- | --- | --- |\n';
for (const beat of beats) production += `| ${beat.title} | ${beat.era === eraThirdWar ? 'Era 7 historical prologue' : 'Era 8 Classic quest'} · ${beat.quests.join('; ')} · ${beat.sources.join(', ')} | ${[...beat.cast, ...beat.objects].map(aid).join(', ') || 'environment only'} | ${placeById.get(beat.env).name}: ${placeById.get(beat.env).traits} | ${beat.status === 'disputed' ? 'Disputed' : beat.confidence ?? 'Strongly supported'} · ${beat.note ?? 'Exact chronology, staging, object placement or aftermath remains unknown.'} |\n`;
production += '\n## Scene order and node IDs\n\n';
nodes.forEach((node, index) => { production += `${String(index + 1).padStart(2, '0')}. \`${node.id}\` — ${node.title}\n`; });
production += '\n## Visual and human-review gates\n\nEvery node has a repository-backed Classic Plaguelands environment. Every named principal, significant group, and pivotal object is represented and wired to the renderer. Asset prompts, generated originals, hashes, scene mapping and version traits are recorded in the visual ledger. All art is interpretive; no game capture, exact coordinate, canonical model or exact quest prop appearance is claimed. Compare each asset against the matching Classic zones and models before human approval.\n\n';
production += 'Human review: compare original 1.12-era book/quest records; decide whether the Annals contain an error, retcon, or framing difference; resolve spelling variants; verify the replay ending and its lasting scope; compare zones, cast and relics with the matching Classic build; review claim citations and original paraphrase; audition names and scene transitions. The transcript remains available without audio or WebGL.\n';
await output(productionPath, production);

const ledgerAssets = [];
for (const place of places.filter(([id]) => envIds.includes(id))) {
  const file = `${artDir}/${environmentFiles[place[0]]}.research.webp`;
  const bytes = await readFile(path.join(root, file));
  const info = await stat(path.join(root, file));
  ledgerAssets.push({ id: place[0], kind: 'environment', file, representedBy: place[1], pixelWidth: 1536, pixelHeight: 1024, sourceArtifacts: environmentSourceArtifacts[place[0]], recognizableTraits: place[2], generationPrompt: place[3], generator: 'OpenAI ImageGen; cropped from original multi-panel environment artwork and optimized to WebP. Hearthglen includes a separate generated edit.', targetEditionBuild: 'Original World of Warcraft Classic, pre-Cataclysm Plaguelands area identity; 1.12-era comparison remains open.', transparency: false, visualReference: 'Written trait check only; no matching-client screenshot or approval is claimed.', byteLength: bytes.length, modifiedAt: info.mtime.toISOString(), sha256: createHash('sha256').update(bytes).digest('hex') });
}
for (const subject of subjects.filter((item) => usedSubjectIds.includes(item.id))) {
  const file = `${artDir}/${subject.asset}.research.webp`;
  const bytes = await readFile(path.join(root, file));
  const info = await stat(path.join(root, file));
  const isScourge = subject.short === 'scourge';
  ledgerAssets.push({ id: subject.id, kind: subject.type, file, representedBy: subject.name, pixelWidth: isScourge ? 1200 : subject.type === 'artifact' ? 512 : 397, pixelHeight: isScourge ? 800 : subject.type === 'artifact' ? 512 : 397, sourceArtifacts: subjectSourceArtifacts(subject), recognizableTraits: subject.description, generationPrompt: `Original illustrated cutout direction: ${subject.description} Transparent background, clear silhouette, no text or copied game art. The cutout was cropped from the referenced subject sheet.`, generator: 'OpenAI ImageGen; original cutout optimized as alpha-capable WebP.', targetEditionBuild: 'Classic quest-era identity; precise 1.12-era model match remains open.', transparency: true, visualReference: 'No in-client screenshot comparison or model approval is claimed.', byteLength: bytes.length, modifiedAt: info.mtime.toISOString(), sha256: createHash('sha256').update(bytes).digest('hex') });
}
const sceneLedger = beats.map((beat, index) => ({
  nodeId: nodes[index].id, title: beat.title, eraId: beat.era, mapStateId: `${storyId}-${beat.env}-scene`, worldspaceId,
  environmentPath: `${artDir}/${environmentFiles[beat.env]}.research.webp`, gameArea: placeById.get(beat.env).name,
  referenceEditionBuild: 'Original World of Warcraft Classic, pre-Cataclysm area identity; precise original 1.12-era comparison remains open.',
  recognizableTraits: placeById.get(beat.env).traits, resemblanceReview: 'Written trait check recorded; matching-client side-by-side visual review remains open.',
  cast: beat.cast.map((short) => ({ id: aid(short), name: subjectById.get(aid(short)).name, image: `${artDir}/${subjectById.get(aid(short)).asset}.research.webp` })),
  objects: beat.objects.map((short) => ({ id: aid(short), name: subjectById.get(aid(short)).name, image: `${artDir}/${subjectById.get(aid(short)).asset}.research.webp` })),
  claimIds: [`${storyId}-${beat.id}-claim`], chronologyAndGeography: beat.note ?? 'Relational scene; exact geography, route and date remain unknown.',
}));
await output(`docs/research/${storyId}-visual-assets.json`, {
  storyId, status: 'research', targetEditionBuild: 'Original World of Warcraft Classic / pre-Cataclysm Plaguelands; original 1.12-era visual/text comparison remains open.',
  editorialRule: 'Preserve recognizable Classic zone architecture, palette, rural scale, terrain and vegetation. Compare every scene and principal subject with a matching game build before approval.',
  sourceProvenance: 'Original AI-generated environment and transparent cast/prop illustrations, optimized as WebP. No official game art or source-page screenshots included.',
  humanReview: 'Compare generated Darrowshire, Sorrow Hill, Andorhal, Light’s Hope, Corin’s Crossing, Hearthglen and Gahrron’s Withering against the intended Classic client. Verify each actor and relic model. Written trait checks are not in-client review.',
  assetRecords: ledgerAssets, sceneLedger,
});

const audioManifestPath = path.join(root, 'public/audio/guided/manifest.json');
const audioManifest = await readFile(audioManifestPath, 'utf8').then(JSON.parse).catch(() => undefined);
const audioTracks = audioManifest?.tracks?.filter((track) => track.guideId === guideId) ?? [];
const audioByNode = new Map(audioTracks.map((track) => [track.nodeId, track]));
const audioLedger = [];
for (const node of nodes) {
  const track = audioByNode.get(node.id);
  if (!track || !node.voiceover) continue;
  const bytes = await readFile(path.join(root, 'public', track.assetPath));
  const transcriptSha256 = createHash('sha256').update(node.narration).digest('hex');
  const audioSha256 = createHash('sha256').update(bytes).digest('hex');
  if (track.transcriptSha256 !== transcriptSha256 || track.sha256 !== audioSha256 || node.voiceover.assetPath !== track.assetPath) {
    throw new Error(`Audio manifest verification failed for ${node.id}; regenerate the affected transcript-matched voice track.`);
  }
  audioLedger.push({ nodeId: node.id, assetPath: track.assetPath, durationMs: track.durationMs, bytes: bytes.length, audioSha256, transcriptSha256 });
}
production += '\n## AI voice track ledger\n\n';
if (audioLedger.length === nodes.length) {
  production += 'All tracks use the repository Kokoro voice manifest. Audio and narration SHA-256 values were checked against the rendered MP3 and final transcript; listening and pronunciation review remain open.\n\n| Node | Audio path | Duration | Bytes | Audio SHA-256 | Transcript SHA-256 |\n| --- | --- | ---: | ---: | --- | --- |\n';
  for (const track of audioLedger) production += `| \`${track.nodeId}\` | \`${track.assetPath}\` | ${track.durationMs} ms | ${track.bytes} | \`${track.audioSha256}\` | \`${track.transcriptSha256}\` |\n`;
} else {
  production += `Verified ${audioLedger.length} of ${nodes.length} transcript-matched voice tracks. Regenerate changed or missing nodes before delivery. Listening and pronunciation review remain open.\n`;
}
await output(productionPath, production);

const candidateFile = 'docs/research/questline-story-candidates.md';
let candidates = await readFile(path.join(root, candidateFile), 'utf8');
const gate = '**Gate:** reconcile the annals\' chronology wording against the Third War context rather than silently correcting a source. Place the fall in an Era 7 prologue and the investigation in Era 8; capture the original event ending.';
const sectionStart = candidates.indexOf('### 06. Darrowshire: Pamela and a village\'s memory');
const sectionEnd = candidates.indexOf('\n### 07.', sectionStart);
if (sectionStart < 0 || sectionEnd < 0) throw new Error('Darrowshire candidate section not found.');
const section = candidates.slice(sectionStart, sectionEnd).replace(/\n\n\*\*Implementation:\*\* Complete \d+-scene[\s\S]*?(?=\n\n|$)/g, '');
if (!section.includes(gate)) throw new Error('Darrowshire candidate gate not found.');
const implementation = `\n\n**Implementation:** Complete 21-scene illustrated research story, with transcript-matched Classic quest narration, per-scene events/claims/citations, the Era 7 fall and Era 8 investigation/replay, and the sixth Classic marker in the separate Classic-to-Wrath StoryTour. It keeps the Annals’ date conflict, Davil and Marduk name variants, Pamela’s conflicting accounts, and the replay’s unresolved temporal scope visible. Original-client comparison, human lore review, matching-build area/model resemblance and voice audition remain open. See the [production ledger](${storyId}-production.md) and [visual asset ledger](${storyId}-visual-assets.json).`;
candidates = `${candidates.slice(0, sectionStart)}${section}${implementation}${candidates.slice(sectionEnd)}`;
await output(candidateFile, candidates);

const planFile = 'docs/IMPLEMENTATION_PLAN.md';
let plan = await readFile(path.join(root, planFile), 'utf8');
plan = plan.replace('The Dragon in Stormwind, Scepter of the Shifting Sands, Dungeon Set 2: The Veiled Blade and Lord Valthalak, The Fallen Hero and Rakh’likh, Tirion and Taelan: Of Love and Family, Karazhan: The Master’s Key and Nightbane, and Akama and the Black Temple are its seven playable stories;', 'The Dragon in Stormwind, Scepter of the Shifting Sands, Dungeon Set 2: The Veiled Blade and Lord Valthalak, The Fallen Hero and Rakh’likh, Tirion and Taelan: Of Love and Family, Darrowshire: Lost and Remembered, Karazhan: The Master’s Key and Nightbane, and Akama and the Black Temple are its eight playable stories;');
plan = plan.replace('all 121 era-guide StoryNodes and every node in the playable Classic-to-Wrath StoryTour stories, including Akama and the Black Temple,', 'all 121 era-guide StoryNodes and every node in the playable Classic-to-Wrath StoryTour stories, including Darrowshire and Akama and the Black Temple,');
await output(planFile, plan);

const erasFile = 'docs/eras/README.md';
let eraReadme = await readFile(path.join(root, erasFile), 'utf8');
const eraNote = 'These research packets do not replace the era guides or constitute finished tours.';
const storyNote = ' The separate Classic-to-Wrath StoryTour now includes the completed illustrated Darrowshire research story after Tirion and Taelan; it uses a linked Era 7 historical prologue and an Era 8 Classic quest investigation, and does not enter EraTour or full-history playback.';
if (!eraReadme.includes('completed illustrated Darrowshire research story')) {
  if (!eraReadme.includes(eraNote)) throw new Error('Era research packet note not found.');
  eraReadme = eraReadme.replace(eraNote, `${eraNote}${storyNote}`);
}
await output(erasFile, eraReadme);

process.stdout.write(`Authored ${nodes.length} research scenes, ${usedSubjectIds.length} illustrated subjects, ${envIds.length} Classic area states and ${sourceRecords.length} source records.\n`);
