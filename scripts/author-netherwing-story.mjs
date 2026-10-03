import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import process from 'node:process';

const root = process.cwd();
const id = 'netherwing-liberation';
const eraId = 'age-of-adventurers';
const worldspaceId = 'netherwing-story-theater';
const guideId = `${id}-guide`;
const prefix = 'netherwing-liberation';
const imageRoot = 'images/storylines/netherwing';
const previousStoryPath = join(root, 'data', 'stories', `${id}.research.json`);
const previousNodes = new Map();
try {
  const previousStory = JSON.parse(await readFile(previousStoryPath, 'utf8'));
  for (const node of previousStory.nodes) previousNodes.set(node.id, node);
} catch (error) {
  if (error?.code !== 'ENOENT') throw error;
}

const sourceDefs = [
  ['netherwing-ally-chain', 'Ally of the Netherwing quest-chain locator', 'https://warcraft.wiki.gg/wiki/Ally_of_the_Netherwing_quest_chain', 'quest', 'Secondary quest-sequence and text locator for the nine hostile-to-neutral quests. It is not a capture of the original 2007 client. Every detail is paraphrased; original build comparison remains open.'],
  ['netherwing-faction-index', 'Netherwing faction and reputation quest index', 'https://warcraft.wiki.gg/wiki/Netherwing', 'website', 'Secondary locator for the later reputation tiers and repeatable/daily task structure. Repetition is not narrated as a sequence of unique historical events. Original client/build review remains open.'],
  ['netherwing-blood-oath', 'Blood Oath of the Netherwing quest locator', 'https://warcraft.wiki.gg/wiki/Blood_Oath_of_the_Netherwing', 'quest', 'Secondary quest-text locator. The oath is paraphrased and remains subject to original TBC client comparison.'],
  ['netherwing-in-service', 'In Service of the Illidari quest locator', 'https://warcraft.wiki.gg/wiki/In_Service_of_the_Illidari', 'quest', 'Secondary quest-text locator for the service papers and disguise. The staging and exact original build remain open.'],
  ['netherwing-enter-taskmaster', 'Enter the Taskmaster quest locator', 'https://warcraft.wiki.gg/wiki/Enter_the_Taskmaster', 'quest', 'Secondary quest-sequence locator. It is treated as the one-time transition into the Dragonmaw task structure, not a daily-work scene.'],
  ['netherwing-friend-inside', 'Your Friend on the Inside quest locator', 'https://warcraft.wiki.gg/wiki/Your_Friend_on_the_Inside', 'quest', 'Secondary quest-text locator for Yarzill. Exact dialogue and original TBC client comparison remain open.'],
  ['netherwing-murkblood-revolt', 'The Great Murkblood Revolt quest locator', 'https://warcraft.wiki.gg/wiki/The_Great_Murkblood_Revolt', 'quest', 'Secondary quest-text locator for the optional escape-plan branch. It does not establish that every player completed this quest.'],
  ['netherwing-seeker-of-truth', 'Seeker of Truth quest locator', 'https://warcraft.wiki.gg/wiki/Seeker_of_Truth', 'quest', 'Secondary quest/gossip transcription locator for an unnamed Murkblood overseer’s testimony. All allegations remain attributed to that speaker; original client comparison remains open.'],
  ['netherwing-bow-to-highlord', 'Bow to the Highlord quest locator', 'https://warcraft.wiki.gg/wiki/Bow_to_the_Highlord', 'quest', 'Secondary quest-text locator for Varkule’s summons and Mor’ghor’s title declaration. A character’s statement is not treated as proof of total command.'],
  ['netherwing-lord-illidan', 'Lord Illidan Stormrage quest locator', 'https://warcraft.wiki.gg/wiki/Lord_Illidan_Stormrage_(quest)', 'quest', 'Secondary quest dialogue/cinematic sequence locator for Illidan’s visit, exposure of the disguise, threat, Yarzill’s rescue, and Shattrath destination. Original scene capture remains open.'],
  ['netherwing-barthamus', 'Barthamus NPC and final turn-in locator', 'https://warcraft.wiki.gg/wiki/Barthamus', 'website', 'Secondary NPC/quest locator for the Lower City turn-in and Netherwing drake offer. Claims about identity beyond the TBC quest remain outside this story.'],
  ['netherwing-shadowmoon-visual-reference', 'Shadowmoon Valley TBC area visual locator', 'https://www.wowhead.com/tbc/zone=3520/shadowmoon-valley', 'website', 'Secondary visual locator for TBC Shadowmoon Valley. The target is original Burning Crusade area presentation; no matching in-client comparison capture is claimed.'],
];

const sourceNotes = Object.fromEntries(sourceDefs.map(([sourceId, title, url, sourceType, notes]) => [sourceId, { id: sourceId, title, url, sourceType, notes: `Accessed 2026-10-03. ${notes}` }]));

const questSource = 'netherwing-ally-chain';
const questCitation = (questId, section = 'Quest sequence, objective, or completion') => ({ sourceId: questSource, questId, section });
const citation = (sourceId, questId, section) => ({ sourceId, questId, section });

const places = [
  {
    id: 'netherwing-fields-shadowmoon', name: 'Netherwing Fields, Shadowmoon Valley', type: 'location',
    description: 'A named quest area in TBC Shadowmoon Valley where Mordenai asks for aid and Neltharaku flies overhead.',
    sourceIds: ['netherwing-ally-chain', 'netherwing-shadowmoon-visual-reference'], tags: ['netherwing-story', 'burning-crusade-area-reference'],
  },
  {
    id: 'dragonmaw-fortress-shadowmoon', name: 'Dragonmaw Fortress, Shadowmoon Valley', type: 'site',
    description: 'A named Dragonmaw stronghold in the TBC Shadowmoon Valley quest sequence; no floor plan or exact route is asserted.',
    sourceIds: ['netherwing-ally-chain', 'netherwing-shadowmoon-visual-reference'], tags: ['netherwing-story', 'burning-crusade-area-reference'],
  },
  {
    id: 'netherwing-ledge-shadowmoon', name: 'Netherwing Ledge, Shadowmoon Valley', type: 'location',
    description: 'A named floating island and quest area in TBC Shadowmoon Valley, associated with Nethervine crystals and the Netherwing faction.',
    sourceIds: ['netherwing-ally-chain', 'netherwing-faction-index', 'netherwing-shadowmoon-visual-reference'], tags: ['netherwing-story', 'burning-crusade-area-reference'],
  },
  {
    id: 'dragonmaw-base-camp-shadowmoon', name: 'Dragonmaw Base Camp, Shadowmoon Valley', type: 'site',
    description: 'The named camp where the Illidari papers, exalted summons, and final confrontation are staged in the TBC quest locators.',
    sourceIds: ['netherwing-in-service', 'netherwing-bow-to-highlord', 'netherwing-lord-illidan', 'netherwing-shadowmoon-visual-reference'], tags: ['netherwing-story', 'burning-crusade-area-reference'],
  },
  {
    id: 'netherwing-mines-shadowmoon', name: 'Netherwing Mines, Shadowmoon Valley', type: 'site',
    description: 'A named mining area on Netherwing Ledge used by the optional Murkblood Escape Plans investigation.',
    sourceIds: ['netherwing-murkblood-revolt', 'netherwing-seeker-of-truth', 'netherwing-shadowmoon-visual-reference'], tags: ['netherwing-story', 'burning-crusade-area-reference'],
  },
];

const actors = [
  ['mordenai', 'character', 'Mordenai', 'A quest-giver who asks the seeker to aid the Netherwing and later offers the blood oath.', 'images/storylines/netherwing/mordenai.research.webp', ['netherwing-ally-chain', 'netherwing-blood-oath']],
  ['neltharaku', 'character', 'Neltharaku', 'A Netherwing drake who tells the seeker of the Dragonmaw’s captivity of his flight and asks for help.', 'images/storylines/netherwing/neltharaku.research.webp', ['netherwing-ally-chain']],
  ['karynaku', 'character', 'Karynaku', 'Neltharaku’s mate, held in chains at Dragonmaw Fortress in the quest sequence.', 'images/storylines/netherwing/karynaku.research.webp', ['netherwing-ally-chain']],
  ['zuluhed-the-whacked', 'character', 'Zuluhed the Whacked', 'Dragonmaw chieftain named as keeper of the key to Karynaku’s chains.', 'images/storylines/netherwing/zuluhed.research.webp', ['netherwing-ally-chain']],
  ['dragonmaw-overseers', 'faction', 'Dragonmaw overseers', 'An interpretive ensemble representing the Dragonmaw force encountered in the quest sequence; not a named unit roster.', 'images/storylines/netherwing/dragonmaw-overseers.research.webp', ['netherwing-ally-chain', 'netherwing-in-service']],
  ['enslaved-netherwing-drakes', 'faction', 'Enslaved Netherwing drakes', 'A representative ensemble of captive drakes; the quest frees a limited number, not the entire flight.', 'images/storylines/netherwing/enslaved-netherwing-drakes.research.webp', ['netherwing-ally-chain']],
  ['overlord-morghor', 'character', 'Overlord Mor’ghor', 'The Dragonmaw leader who receives the service papers and announces the Highlord promotion.', 'images/storylines/netherwing/overlord-morghor.research.webp', ['netherwing-in-service', 'netherwing-bow-to-highlord', 'netherwing-lord-illidan']],
  ['yarzill-the-merc', 'character', 'Yarzill the Merc', 'A goblin appearing as a friendly contact at Dragonmaw Base Camp; a later quest identifies him as an ally inside.', 'images/storylines/netherwing/yarzill-the-merc.research.webp', ['netherwing-friend-inside', 'netherwing-lord-illidan']],
  ['yarzill-netherwing-form', 'character', 'Yarzill, revealed as a Netherwing drake', 'The protective drake form Yarzill reveals during the final escape.', 'images/storylines/netherwing/yarzill-netherwing-form.research.webp', ['netherwing-lord-illidan']],
  ['mistress-of-the-mines', 'character', 'Mistress of the Mines', 'The named quest-giver who receives the optional Murkblood escape plans and orders the follow-up inquiry.', 'images/storylines/netherwing/mistress-of-the-mines.research.webp', ['netherwing-murkblood-revolt', 'netherwing-seeker-of-truth']],
  ['unnamed-murkblood-informant', 'character', 'Unnamed Murkblood overseer', 'A composite visual for the unnamed speaker interrogated in Seeker of Truth; no personal name or biography is supplied.', 'images/storylines/netherwing/murkblood-informant.research.webp', ['netherwing-seeker-of-truth']],
  ['barthamus', 'character', 'Barthamus', 'The named Lower City quest-giver who receives the survivor and offers the choice of a Netherwing drake.', 'images/storylines/netherwing/barthamus.research.webp', ['netherwing-barthamus', 'netherwing-lord-illidan']],
  ['netherwing-drake-companions', 'faction', 'Netherwing drake companions', 'A representative ensemble of the six mutually exclusive drake companions offered after the final turn-in.', 'images/storylines/netherwing/netherwing-drake-companions.research.webp', ['netherwing-barthamus']],
];

const artifacts = [
  ['nethervine-crystal', 'Nethervine crystal', 'Raw crystals gathered at Netherwing Ledge; the illustration is interpretive.', 'images/storylines/netherwing/enchanted-nethervine-crystal.research.webp', ['netherwing-ally-chain']],
  ['enchanted-nethervine-crystal', 'Enchanted Nethervine Crystal', 'Neltharaku’s enchanted crystal used to free enslaved Netherwing drakes.', 'images/storylines/netherwing/enchanted-nethervine-crystal.research.webp', ['netherwing-ally-chain']],
  ['zuluheds-key-and-broken-chain', 'Zuluhed’s key and Karynaku’s opened chain', 'Interpretive object art for the key and chain-opening outcome; not a canonical model capture.', 'images/storylines/netherwing/zuluheds-key-and-broken-chain.research.webp', ['netherwing-ally-chain']],
  ['murkblood-escape-plans', 'Murkblood Escape Plans', 'The named quest-starting document in the optional mine investigation.', 'images/storylines/netherwing/murkblood-escape-plans.research.webp', ['netherwing-murkblood-revolt']],
];

const stateDefs = [
  ['fields', 'Netherwing Fields', 'netherwing-fields.research.webp', 'Named Burning Crusade Shadowmoon Valley field with charcoal volcanic ground, violet twilight, distant fel-green light, broken ridges, and a sparse field horizon. The composition is interpretive; no exact NPC position or surveyed view is asserted.'],
  ['flight', 'Above the Netherwing Fields', 'netherwing-flight.research.webp', 'A relational aerial stage over TBC Shadowmoon Valley: violet storm sky, black ridges, broken horizon, and distant fel-green light. It is not a physical flight route or exact aerial screenshot.'],
  ['fortress', 'Dragonmaw Fortress', 'dragonmaw-fortress.research.webp', 'Interpretive TBC Dragonmaw fortress using rough dark stone, timber platforms, ironwork, muted red cloth, and Shadowmoon’s purple-green sky. It is not a surveyed fortress layout.'],
  ['ledge', 'Netherwing Ledge', 'netherwing-ledge.research.webp', 'Interpretive TBC floating ledge with broken dark basalt, blue-green crystal clusters, rough work platforms, and violet sky. This is not a surveyed island layout or exact crystal placement.'],
  ['mines', 'Netherwing Mines', 'netherwing-mine.research.webp', 'Interpretive TBC mine interior: dark volcanic cavern, rough timber braces, mineral glints, and green-lit pools. It is not a mine map or floor plan.'],
  ['shattrath', 'Shattrath Lower City', 'cipher-of-damnation/shattrath-lower-city.research.webp', 'Reused TBC Lower City environment art from the Cipher storyline because the place and historical presentation match. Composition is interpretive, not an exact in-client capture.'],
];

const scenes = [
  {
    key: 'mordenai-appeal', title: 'A kindness in the fields', state: 'fields', place: 'netherwing-fields-shadowmoon',
    quest: 'Kindness', citations: [questCitation('Kindness', 'Quest opening and objective')], actors: ['mordenai', 'enslaved-netherwing-drakes'],
    summary: 'Mordenai asks the seeker to aid the disturbed Netherwing drakes. The opening task pairs the gathering of Rocknail prey with feeding the drakes; the scene treats those objectives as one appeal rather than a string of farming actions.',
    narration: 'Shadowmoon’s fields open beneath a violet sky, where dark stone holds the day’s last green light. There Mordenai asks a stranger for kindness. The Netherwing drakes have been disturbed, and his first task is plain: gather prey from the Rocknail hunt and feed the creatures that will not trust a hand easily. The errands are modest, but the choice is not. Before the flight can be asked to believe in an ally, someone must answer a need that brings no title or promise in return.',
    confidence: 'strongly_supported', note: 'Quest objectives are paraphrased. Rocknail combat and feeding counts are compressed into one narrative beat; repeated kills are not separate events.',
  },
  {
    key: 'seek-neltharaku', title: 'Search above the broken fields', state: 'flight', place: 'netherwing-fields-shadowmoon',
    quest: 'Seek Out Neltharaku', citations: [questCitation('Seek Out Neltharaku', 'Quest sequence and destination')], actors: ['neltharaku'],
    summary: 'After the opening aid, Mordenai directs the seeker to search the skies for Neltharaku.',
    narration: 'When the first kindness is answered, Mordenai points upward. Neltharaku is not waiting on a road or behind a gate; he crosses the air above the fields, where the broken horizon makes distance difficult to judge. The quest sends the seeker to find him in flight. No route is marked here, for the chain names a meeting and a sky, not a measured passage through them.',
    confidence: 'strongly_supported', note: 'The scene follows the quest handoff but does not claim a route, coordinates, or a specific duration of flight.',
  },
  {
    key: 'neltharakus-tale', title: 'A flight’s testimony', state: 'flight', place: 'netherwing-fields-shadowmoon',
    quest: 'Neltharaku’s Tale', citations: [questCitation('Neltharaku’s Tale', 'Quest dialogue and request for aid')], actors: ['neltharaku'],
    summary: 'Neltharaku tells the seeker of the Dragonmaw’s control over the Netherwing and asks for help.',
    narration: 'Neltharaku speaks not as a distant patron of the sky but as one of a people under another clan’s hand. His account describes the Dragonmaw taking control of Netherwing life and forcing the drakes into service. The telling is the drake’s own testimony, and the story keeps it in that voice. From it comes a request for action: make trouble at the fortress, then help him find a way to reach those still bound.',
    confidence: 'strongly_supported', note: 'The captivity account remains attributed to Neltharaku. No broader history of the Netherwing’s origin is added.',
  },
  {
    key: 'fortress-diversion', title: 'A breach to buy time', state: 'fortress', place: 'dragonmaw-fortress-shadowmoon',
    quest: 'Infiltrating Dragonmaw Fortress', citations: [questCitation('Infiltrating Dragonmaw Fortress', 'Quest objective')], actors: ['dragonmaw-overseers'],
    summary: 'The seeker strikes the Dragonmaw fortress to create a diversion while Neltharaku considers his next step.',
    narration: 'The first answer is a disturbance, not a conquest. At Dragonmaw Fortress, the seeker is told to strike the clan’s operation and draw attention away long enough for Neltharaku to plan. The objective brings violence into the campaign, yet the quest does not say the fortress falls or that its garrison is broken. The opening is narrow: a delay bought in hostile ground, with the next move still to be found.',
    confidence: 'strongly_supported', note: 'Does not convert a kill-count objective into capture of the fortress or defeat of the entire Dragonmaw force.',
  },
  {
    key: 'nethervine-plan', title: 'Crystals from the ledge', state: 'ledge', place: 'netherwing-ledge-shadowmoon',
    quest: 'To Netherwing Ledge!', citations: [questCitation('To Netherwing Ledge!', 'Quest destination and objective')], actors: ['nethervine-crystal'],
    summary: 'Neltharaku’s plan turns on crystals gathered from Netherwing Ledge.',
    narration: 'Neltharaku’s plan leads beyond the fields to Netherwing Ledge, where Nethervine crystals can be gathered amid a hostile Dragonmaw presence. Their power is not enough on its own; the drake will prepare them for a purpose. The scene holds to the task the quest names and leaves the crystals’ position broad across the broken island. A resource taken from a contested place is about to become a means of release.',
    confidence: 'strongly_supported', note: 'Crystal appearance and exact position are interpretive; the quest’s location and collection task are the supported points.',
  },
  {
    key: 'drakes-freed', title: 'The crystal’s force', state: 'fortress', place: 'dragonmaw-fortress-shadowmoon',
    quest: 'The Force of Neltharaku', citations: [questCitation('The Force of Neltharaku', 'Quest item use and result')], actors: ['enslaved-netherwing-drakes', 'dragonmaw-overseers', 'enchanted-nethervine-crystal'],
    summary: 'The enchanted crystal is used on enslaved Netherwing drakes; the freed drakes turn on their captors.',
    narration: 'Neltharaku gives the gathered crystals a force that can reach the drakes’ bondage. At the fortress, the seeker uses one upon enslaved Netherwing. Those newly freed turn against their former captors. The quest describes a limited rescue, not the liberation of every captive. Yet the change is visible: for a moment, the Dragonmaw’s strength becomes a risk inside its own camp, and the Netherwing fight beside the stranger who came to help.',
    confidence: 'strongly_supported', note: 'The quest objective frees a bounded number of drakes. The scene does not claim all captives are released.',
  },
  {
    key: 'karynaku-found', title: 'Karynaku above the bailey', state: 'fortress', place: 'dragonmaw-fortress-shadowmoon',
    quest: 'Karynaku', citations: [questCitation('Karynaku', 'Quest dialogue and request')], actors: ['karynaku'],
    summary: 'The chain turns from freeing captive drakes to reaching Karynaku, who remains bound at the fortress.',
    narration: 'The freed drakes are not the end of the captivity Neltharaku described. He now asks the seeker to find Karynaku, his mate, held high at the fortress. She can speak, but the chains sap her strength. Karynaku names the remaining barrier: Zuluhed the Whacked holds the key. The story narrows to one captive and one object, while the larger operation around her remains intact.',
    confidence: 'strongly_supported', note: 'Karynaku is described as Neltharaku’s mate in the quest chain; no later family history is imported.',
  },
  {
    key: 'zuluheds-key', title: 'The chieftain’s key', state: 'fortress', place: 'dragonmaw-fortress-shadowmoon',
    quest: 'Zuluhed the Whacked', citations: [questCitation('Zuluhed the Whacked', 'Quest objective and completion')], actors: ['zuluhed-the-whacked', 'karynaku', 'zuluheds-key-and-broken-chain'],
    summary: 'Zuluhed is defeated, the key is recovered, and Karynaku’s chains are opened.',
    narration: 'The key belongs to the chieftain who holds Karynaku. The seeker confronts Zuluhed, defeats him, and takes what is needed to open the chains. This is a decisive rescue, though not proof that every Dragonmaw in the fortress has surrendered. Karynaku is free of the restraint that held her, and the path opens back toward the fields and the drake who first trusted a stranger with his account.',
    confidence: 'strongly_supported', note: 'The outcome is bounded to Zuluhed’s defeat and Karynaku’s release; it does not claim a wider military victory.',
  },
  {
    key: 'ally-declared', title: 'An ally of the Netherwing', state: 'fields', place: 'netherwing-fields-shadowmoon',
    quest: 'Ally of the Netherwing', citations: [questCitation('Ally of the Netherwing', 'Quest handoff and completion')], actors: ['mordenai'],
    summary: 'The chain returns to Mordenai, who recognizes the seeker as an ally of the Netherwing.',
    narration: 'Karynaku offers to return the seeker to Mordenai. There, the campaign receives its first clear name: Ally of the Netherwing. The title marks trust earned through care, disruption, a crystal plan, and one leader’s defeat. It does not say the valley has been reclaimed. The first chain closes with a compact between the flight and an outsider; the next begins with a wider promise to act for the Netherwing’s home.',
    confidence: 'strongly_supported', note: 'The ally title is the quest outcome. No exact family relationship involving Mordenai is asserted.',
  },
  {
    key: 'blood-oath', title: 'An oath for a home', state: 'fields', place: 'netherwing-fields-shadowmoon',
    citations: [citation('netherwing-blood-oath', 'Blood Oath of the Netherwing', 'Quest appeal and completion')], actors: ['mordenai'],
    summary: 'At neutral standing, Mordenai asks the ally to help retake Netherwing lands and protect the flight.',
    narration: 'The new ally is called back to Mordenai. His plea names a greater wound: the Netherwing have lost their lands, and their children have been taken into slavery or worse. He asks the adventurer to swear aid in reclaiming a home and guarding the flight. The oath changes the scale of the work. The seeker is no longer only answering one family’s immediate need, but accepting a part in a dangerous campaign against the Dragonmaw presence.',
    confidence: 'strongly_supported', note: 'The loss and request stay attributed to Mordenai. The story does not identify unnamed captives or outcomes beyond the quest text.',
  },
  {
    key: 'service-papers', title: 'A mask of Dragonmaw', state: 'fortress', place: 'dragonmaw-base-camp-shadowmoon',
    citations: [citation('netherwing-in-service', 'In Service of the Illidari', 'Quest premise, disguise, and papers'), citation('netherwing-enter-taskmaster', 'Enter the Taskmaster', 'Quest handoff')], actors: ['overlord-morghor', 'dragonmaw-overseers'],
    summary: 'Netherwing magic disguises the seeker as a Dragonmaw recruit; Illidari papers are delivered to Mor’ghor, opening the taskmaster route.',
    narration: 'Mordenai’s next plan depends upon a borrowed face. Netherwing magic cloaks the seeker as a Dragonmaw fel orc, and Illidari service papers are prepared for Mor’ghor at the base camp. The task is to enter the labor structure from within. The disguise has limits: Mordenai warns that some sentries can see through it. The papers are accepted, and the seeker is placed among the clan’s workers under orders that conceal the purpose of the oath.',
    confidence: 'strongly_supported', note: 'The disguise and warning are quest mechanics/dialogue. The story does not claim every Dragonmaw accepts the deception or that the infiltration has already changed the operation.',
  },
  {
    key: 'yarzill-inside', title: 'A friend behind the disguise', state: 'fortress', place: 'dragonmaw-base-camp-shadowmoon',
    citations: [citation('netherwing-friend-inside', 'Your Friend on the Inside', 'Quest reveal and completion')], actors: ['yarzill-the-merc'],
    summary: 'Yarzill the Merc reveals himself as a Netherwing ally within the Dragonmaw operation.',
    narration: 'A goblin near the camp’s work reveals that the disguise hides more than one ally. Yarzill the Merc is not merely a trader at the edge of the operation; the quest identifies him as a friend on the inside. His presence gives the seeker a point of contact within the camp, but the story does not invent a larger network or attribute every success to hidden agents. The infiltration now has a known companion, still surrounded by a clan that believes the new recruit belongs to it.',
    confidence: 'strongly_supported', note: 'Only Yarzill’s disclosed role is asserted; no wider spy network is inferred.',
  },
  {
    key: 'murkblood-plans', title: 'A revolt beneath the ledge', state: 'mines', place: 'netherwing-mines-shadowmoon',
    citations: [citation('netherwing-murkblood-revolt', 'The Great Murkblood Revolt', 'Escape-plan item and handoff'), citation('netherwing-seeker-of-truth', 'Seeker of Truth', 'Interrogation and attributed testimony')], actors: ['mistress-of-the-mines', 'unnamed-murkblood-informant', 'murkblood-escape-plans'],
    summary: 'An optional friendly-standing branch leads from escape plans to an interrogation. An unnamed Murkblood overseer describes an attempted mine revolt and makes allegations about Dragonmaw extraction and buyers.',
    narration: 'A separate clue comes from the Netherwing Mines, after a reputation gate and the mine quest. Escape plans attributed to the Murkblood workers reach the Mistress of the Mines. Her follow-up sends the disguised seeker to question an overseer. The Broken speaker describes a revolt meant to drive the Dragonmaw from the ledge and alleges that the clan takes resources for Illidan’s forces while selling other goods. The speaker suspects outside buyers, including the Black Dragonflight, but does not name a confirmed purchaser. This branch enriches the account; it is not a required step in the main rescue.',
    confidence: 'strongly_supported', note: 'The Murkblood account is testimony from an unnamed interrogated NPC. Allegations and suspicions are not stated as omniscient fact; optional quest status and reputation prerequisite remain explicit.',
  },
  {
    key: 'highlord-summons', title: 'The summons of the Highlord', state: 'fortress', place: 'dragonmaw-base-camp-shadowmoon',
    citations: [citation('netherwing-faction-index', 'Netherwing reputation tiers', 'Repeatable tasks and faction progression'), citation('netherwing-bow-to-highlord', 'Bow to the Highlord', 'Summons and title declaration')], actors: ['overlord-morghor', 'dragonmaw-overseers'],
    summary: 'After a reputation-gated interval, Varkule summons the exalted seeker; Mor’ghor names them the first Highlord of the Dragonmaw.',
    narration: 'Between the oath and this summons lies work measured in reputation: recurring tasks, ledge labor, and eggs returned for standing. They are game systems renewed over time, not separate dated events, so the telling does not turn each reset into a new chapter or guess how long the ascent took. When Exalted standing opens the final sequence, Varkule sends the seeker to Mor’ghor. There, the Dragonmaw leader announces a first Highlord and says Illidan himself will come to promote the new champion.',
    confidence: 'strongly_supported', note: 'The reputation interval is intentionally compressed. “First Highlord” is Mor’ghor’s title declaration, not proof that the adventurer commands the whole Dragonmaw clan.',
  },
  {
    key: 'illidan-exposes', title: 'The borrowed face is seen through', state: 'fortress', place: 'dragonmaw-base-camp-shadowmoon',
    citations: [citation('netherwing-lord-illidan', 'Lord Illidan Stormrage', 'Meeting scene and confrontation')], actors: ['illidan-stormrage', 'overlord-morghor', 'dragonmaw-overseers'],
    summary: 'Illidan recognizes the deception at the promotion gathering, immobilizes the player, and orders Mor’ghor to have them killed.',
    narration: 'The camp gathers for the promised promotion. Illidan appears and sees through the Dragonmaw disguise. His anger falls first on Mor’ghor, then turns toward the seeker: the operation is compromised, and the impostor is to be killed. Mor’ghor answers his master and threatens vengeance. The celebration becomes a sentence before the gathered clan. The quest’s abrupt reversal is the cost of passing too deeply into an enemy’s trust: the mask has won entry, but no protection once the truth is spoken.',
    confidence: 'strongly_supported', note: 'The confrontation and threat follow the quest dialogue locator; exact original-client scene capture remains open.',
  },
  {
    key: 'yarzill-rescue', title: 'Wings beneath the merchant’s cloak', state: 'flight', place: 'dragonmaw-base-camp-shadowmoon',
    citations: [citation('netherwing-lord-illidan', 'Lord Illidan Stormrage', 'Rescue and transport sequence')], actors: ['yarzill-the-merc', 'yarzill-netherwing-form'],
    summary: 'Yarzill intervenes, reveals a Netherwing drake form, and carries the seeker to Shattrath.',
    narration: 'Before the threat can be carried out, Yarzill refuses to let Mor’ghor harm the seeker. The goblin’s disguise falls away into the form of a Netherwing drake, and the quest places the adventurer on his back. His flight carries the survivor to Shattrath. The revelation is Yarzill’s own intervention, not proof that every worker in the camp has been rescued or that the Dragonmaw have been defeated. The operation is compromised, but its hidden ally preserves one life and brings the story out of Shadowmoon.',
    confidence: 'strongly_supported', note: 'The rescue and destination are quest-script outcomes; no wider liberation of the camp is inferred.',
  },
  {
    key: 'barthamus-offer', title: 'A choice in the Lower City', state: 'shattrath', place: 'cipher-shattrath-lower-city',
    citations: [citation('netherwing-lord-illidan', 'Lord Illidan Stormrage', 'Quest turn-in and reward'), citation('netherwing-barthamus', 'Barthamus', 'NPC identity and optional drake rewards')], actors: ['barthamus', 'netherwing-drake-companions'],
    summary: 'Barthamus receives the survivor in Shattrath and presents one of six possible Netherwing drake companions.',
    narration: 'In Shattrath’s Lower City, the flight’s account receives the survivor. Barthamus hears that the Dragonmaw operation has been exposed and answers with an offer from the Netherwing: one of six drakes may join the adventurer’s road. The choice belongs to the player, so no single companion is made universal here. The story ends with an alliance returned in kind—not with the end of every danger to the flight, but with the seeker no longer travelling alone.',
    confidence: 'strongly_supported', note: 'The quest grants a mutually exclusive player choice; no particular drake is selected as canonical for all players.',
  },
];

const makeCitationId = (sceneKey, index) => `${prefix}-${sceneKey}-citation-${index + 1}`;
const fullScenes = scenes.map((scene) => ({
  ...scene,
  id: `${prefix}-story-${scene.key}`,
  eventId: `${prefix}-${scene.key}-event`,
  claimId: `${prefix}-${scene.key}-claim`,
  citations: scene.citations.map((item, index) => ({ ...item, id: makeCitationId(scene.key, index) })),
}));

const writeRecord = async (folder, record, recordId = record.id) => {
  const path = join(root, 'data', folder, `${recordId}.research.json`);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(record, null, 2)}\n`, 'utf8');
};

for (const source of Object.values(sourceNotes)) await writeRecord('sources', source);

await writeRecord('worldspaces', {
  id: worldspaceId,
  name: 'Netherwing liberation · relational story theater',
  slug: worldspaceId,
  coordinateSystem: { width: 10000, height: 10000, origin: 'bottom-left', units: 'atlas-units' },
});

for (const place of places) {
  await writeRecord('entities', {
    id: place.id,
    type: place.type,
    name: place.name,
    slug: place.id,
    shortDescription: place.description,
    body: `${place.description} Story art and placements are interpretive; exact coordinates, routes, and layouts are not asserted.`,
    firstEraId: eraId,
    featuredEraIds: [eraId],
    sourceIds: place.sourceIds,
    tags: place.tags,
    contentStatus: 'research',
  });
}

for (const [entityId, type, name, description, asset, sourceIds] of actors) {
  await writeRecord('entities', {
    id: entityId,
    type,
    name,
    slug: entityId,
    shortDescription: description,
    body: `${description} The original research illustration is interpretive, not canonical model evidence; compare it with the original TBC client before approval.`,
    firstEraId: eraId,
    featuredEraIds: [eraId],
    sourceIds,
    tags: ['netherwing-story', 'interpretive-art'],
    mapFigure: { asset, scale: type === 'faction' ? 0.78 : 0.9 },
    contentStatus: 'research',
  });
}

for (const [entityId, name, description, asset, sourceIds] of artifacts) {
  await writeRecord('entities', {
    id: entityId,
    type: 'artifact',
    name,
    slug: entityId,
    shortDescription: description,
    body: `${description} This original illustration is a scene prop, not canonical item-model evidence.`,
    firstEraId: eraId,
    featuredEraIds: [eraId],
    sourceIds,
    tags: ['netherwing-story', 'interpretive-art', 'story-prop'],
    mapFigure: { asset, scale: 0.52 },
    contentStatus: 'research',
  });
}

const figurePlacements = [
  ...actors.map(([entityId, , name, , , sourceIds]) => ({ entityId, name, sourceIds })),
  ...artifacts.map(([entityId, name, , , sourceIds]) => ({ entityId, name, sourceIds })),
  { entityId: 'illidan-stormrage', name: 'Illidan Stormrage', sourceIds: ['netherwing-lord-illidan'] },
];
const geometryFeatures = figurePlacements.map(({ entityId, name }, index) => {
  const angle = (Math.PI * 2 * index) / figurePlacements.length;
  const radius = 1250 + (index % 4) * 175;
  const coordinates = [
    Math.round(5000 + Math.cos(angle) * radius),
    Math.round(5000 + Math.sin(angle) * radius * 0.7),
  ];
  return {
    type: 'Feature',
    id: `${prefix}-${entityId}-focus`,
    properties: {
      name: `${name} relational story focus`,
      contentStatus: 'research',
      styleRole: 'site',
      geographicCertainty: 'unknown',
    },
    geometry: { type: 'Point', coordinates },
  };
});
const geometryPath = join(root, 'data', 'geometry', `${worldspaceId}.research.geojson`);
await writeFile(geometryPath, `${JSON.stringify({ type: 'FeatureCollection', name: 'Netherwing relational story theater', features: geometryFeatures }, null, 2)}\n`, 'utf8');
for (const [index, figure] of figurePlacements.entries()) {
  await writeRecord('spatial-states', {
    id: `${prefix}-${figure.entityId}-theater`,
    entityId: figure.entityId,
    eraId,
    worldspaceId,
    geometryId: `${prefix}-${figure.entityId}-focus`,
    placementKind: 'relational',
    geographicCertainty: 'unknown',
    sourceIds: figure.sourceIds,
    editorNote: 'Editorial position in an illustrated TBC story theater; this is a renderer anchor only and asserts no real coordinates, formation, route, or unsupported co-presence. Compare the original TBC figure/area before review; see docs/research/netherwing-liberation-visual-assets.json.',
    visualPresence: 'contextual',
    labelPriority: 250 - index,
  });
}

for (const [key, name, filename, traits] of stateDefs) {
  const asset = filename.startsWith('cipher-of-damnation/')
    ? `images/storylines/${filename}`
    : `${imageRoot}/${filename}`;
  const mapStateId = `${prefix}-${key}-scene`;
  await writeRecord('map-states', {
    id: mapStateId,
    name: `Netherwing story: ${name}`,
    worldspaceId,
    presentation: 'relational',
    terrainTextureAsset: asset,
    geometryIds: [],
    cartographyLabel: 'THE BURNING CRUSADE · SHADOWMOON VALLEY',
    interpretationNote: `Original interpretive TBC-era story art. ${traits} Human side-by-side review against the exact target build remains open; see docs/research/netherwing-liberation-visual-assets.json.`,
  });
}

const citations = [];
const events = [];
const claims = [];
const nodes = fullScenes.map((scene, index) => {
  const citationIds = scene.citations.map((item) => item.id);
  citations.push(...scene.citations.map((item) => ({
    id: item.id,
    sourceId: item.sourceId,
    questId: item.questId,
    section: item.section,
    note: 'Original paraphrase from a secondary quest-text/sequence locator. Exact wording, original TBC build, and omitted variants remain subject to human verification.',
  })));
  events.push({
    id: scene.eventId,
    kind: 'event',
    name: scene.title,
    slug: `${prefix}-${scene.key}`,
    eraId,
    worldspaceId,
    date: { precision: 'unknown', label: 'The Burning Crusade Netherwing quest campaign; exact in-world date unknown' },
    summary: scene.summary,
    locationIds: [scene.place],
    participantEntityIds: scene.actors,
    sourceIds: [...new Set(scene.citations.map((item) => item.sourceId))],
    claimIds: [scene.claimId],
    contentStatus: 'research',
  });
  claims.push({
    id: scene.claimId,
    subjectId: scene.eventId,
    predicate: 'netherwing_story_scene',
    value: scene.summary,
    citationIds,
    confidence: scene.confidence,
    status: 'active',
    editorNote: `${scene.note} Source pages are secondary quest-text locators; exact original client/build comparison remains open.`,
  });
  const mapStateId = `${prefix}-${scene.state}-scene`;
  return {
    id: scene.id,
    guideId,
    title: scene.title,
    narration: scene.narration,
    // Leave durationMs unset: text pacing is estimated when audio is off, and the recorded track duration drives audio playback.
    eventIds: [scene.eventId],
    entityIds: scene.actors,
    locationIds: [scene.place],
    camera: { position: [0, 6.2, 5.4], target: [0, 0, 0], durationMs: 1100 },
    visualActions: [{ type: 'set_map_state', mapStateId }],
    ...(index > 0 ? { previousNodeId: fullScenes[index - 1].id } : {}),
    ...(index < fullScenes.length - 1 ? { nextNodeIds: [fullScenes[index + 1].id] } : {}),
    ...(previousNodes.get(scene.id)?.narration === scene.narration && previousNodes.get(scene.id)?.voiceover
      ? { voiceover: previousNodes.get(scene.id).voiceover }
      : {}),
  };
});

await writeRecord('stories', {
  guide: {
    id: guideId,
    eraId,
    title: 'Netherwing · Rescue, disguise, and liberation',
    description: 'Seventeen illustrated Burning Crusade scenes follow the initial rescue chain, a Netherwing oath and Dragonmaw disguise, an optional Murkblood mine investigation, the Exalted promotion, Illidan’s exposure of the spy, and Yarzill’s escape to Shattrath. Repeatable reputation work is treated as an undated interval.',
    nodeIds: nodes.map((node) => node.id),
    contentStatus: 'research',
  },
  nodes,
}, id);

for (const citationRecord of citations) await writeRecord('citations', citationRecord);
for (const claim of claims) await writeRecord('claims', claim);
for (const event of events) await writeRecord('events', event);

await writeRecord('storylines', {
  id,
  slug: id,
  title: 'Netherwing: Rescue, Disguise, and Liberation',
  summary: 'Mordenai’s appeal leads from kindness in Shadowmoon Valley to the rescue of Karynaku, an oath sworn beneath a borrowed Dragonmaw identity, an optional Murkblood investigation, and a promotion that ends in exposure and escape.',
  opening: 'In the violet fields of Shadowmoon Valley, a stranger is asked to help a troubled flight. Beyond the first rescue waits a larger risk: to wear the enemy’s face long enough to learn how far its power reaches.',
  primaryEraId: eraId,
  eraIds: [eraId],
  chapters: [
    { id: 'netherwing-captives', eraId, title: 'The captive flight', body: 'Mordenai’s appeal, Neltharaku’s testimony, and the rescue of Karynaku establish the alliance without claiming the whole Dragonmaw force has fallen.' },
    { id: 'netherwing-borrowed-face', eraId, title: 'Service beneath a borrowed face', body: 'The blood oath, disguise, Yarzill’s inside role, and an optional Murkblood investigation reveal more of the operation. Reputation work remains an undated game-system interval.' },
    { id: 'netherwing-exposed', eraId, title: 'The Highlord exposed', body: 'The promotion brings Illidan to the camp; he sees through the deception, while Yarzill’s intervention carries the seeker to Shattrath and a choice of companion.' },
  ],
  sourceIds: Object.keys(sourceNotes),
  reviewNote: 'Complete illustrated research StoryGuide with 17 scenes, one source-linked event and claim per scene, dedicated environment and named cast art, optional Murkblood testimony, and an ending through the Shattrath turn-in. Daily and egg repetition is not expanded into invented events. Quest locators are secondary and the original 2.1–2.4.3 client/build comparison, exact TBC area/model review, claim approval, and audio audition remain open. Added to the independent Classic-to-Wrath StoryTour after Champion of the Naaru; no EraTour insertion. See netherwing-liberation-research.md, netherwing-liberation-production.md, and netherwing-liberation-visual-assets.json.',
  storyGuideId: guideId,
  showInEraTourOffshoots: false,
  contentStatus: 'research',
});

const tourPath = join(root, 'data', 'story-tours', 'classic-to-wrath.research.json');
const tour = JSON.parse(await readFile(tourPath, 'utf8'));
const tourEntry = tour.entries.find((entry) => entry.storylineId === id);
if (tourEntry) {
  Object.assign(tourEntry, {
    regionIds: ['outland'],
    mapPositionPercent: [79, 91],
    periodLabel: 'The Burning Crusade · Netherwing quest campaign',
    locationLabel: 'Shadowmoon Valley · fields, fortress, and Netherwing Ledge',
  });
} else {
  for (const entry of tour.entries) if (entry.order >= 15) entry.order += 1;
  tour.entries.push({
    storylineId: id,
    regionIds: ['outland'],
    mapPositionPercent: [79, 91],
    order: 15,
    periodLabel: 'The Burning Crusade · Netherwing quest campaign',
    locationLabel: 'Shadowmoon Valley · fields, fortress, and Netherwing Ledge',
  });
}
tour.entries.sort((a, b) => a.order - b.order);
tour.reviewNote = 'Research StoryTour collection with 18 map placards, 17 playable research StoryGuides and one research preview. Play All follows the explicit editorial order and skips the preview. Netherwing follows Champion of the Naaru as a Burning Crusade playlist placement, not a claim of exact relative dating; repeatable reputation work is not rendered as unique events. Story-tour map markers are navigational layout positions rather than exact locations; each storyline remains research until its human review gates are complete.';
tour.chronologyNote += ' Netherwing follows the Champion of the Naaru as an editorial Burning Crusade stop; exact relative date is unknown. Its repeatable reputation tasks and the optional Murkblood branch are separated from the one-time rescue and ending quests.';
await writeFile(tourPath, `${JSON.stringify(tour, null, 2)}\n`, 'utf8');

process.stdout.write(`Authored ${nodes.length} Netherwing StoryNodes, ${events.length} events, ${claims.length} claims, ${citations.length} citations, and ${places.length} locations.\n`);
