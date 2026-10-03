import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import process from "node:process";

const root = process.cwd();
const id = "hero-of-the-maghar";
const eraId = "age-of-adventurers";
const guideId = id + "-guide";
const theaterId = id + "-theater";
const imageDir = "images/storylines/" + id;
const storyPath = join(root, "data", "stories", id + ".research.json");
const previousNodes = new Map();
try {
  const previous = JSON.parse(await readFile(storyPath, "utf8"));
  for (const node of previous.nodes ?? []) previousNodes.set(node.id, node);
} catch (error) {
  if (error?.code !== "ENOENT") throw error;
}

const sourceDefs = [
  ["hero-maghar-chain", "Hero of the Mag'har quest chain", "https://warcraft.wiki.gg/wiki/Hero_of_the_Mag%27har_quest_chain", "quest", "Secondary quest sequence and dialogue locator for the Horde-only TBC chain and its prerequisite branches; not an original-client capture."],
  ["hero-maghar-greatmother", "A Visit with the Greatmother", "https://warcraft.wiki.gg/wiki/A_Visit_with_the_Greatmother", "quest", "Secondary quest-text locator for Garrosh's introduction and Geyah's opening handoff."],
  ["hero-maghar-materials", "Material Components", "https://warcraft.wiki.gg/wiki/Material_Components", "quest", "Secondary quest-text locator for the material-gathering task and potion; repeated gathering is compressed."],
  ["hero-maghar-kashur", "To Meet Mother Kashur", "https://warcraft.wiki.gg/wiki/To_Meet_Mother_Kashur", "quest", "Secondary quest-text locator for Geyah's direction to Mother Kashur."],
  ["hero-maghar-agitated-ancestors", "The Agitated Ancestors", "https://warcraft.wiki.gg/wiki/The_Agitated_Ancestors", "quest", "Secondary quest-text locator for the ancestors' unrest."],
  ["hero-maghar-ancestors", "A Visit With the Ancestors", "https://warcraft.wiki.gg/wiki/A_Visit_With_the_Ancestors", "quest", "Secondary quest-text locator for the named ancestral sites and spirits moving toward Oshu'gun."],
  ["hero-maghar-spirits-speak", "When Spirits Speak", "https://warcraft.wiki.gg/wiki/When_Spirits_Speak", "quest", "Secondary quest-text locator for Oshu'gun and the ancestral voices."],
  ["hero-maghar-secret", "A Secret Revealed", "https://warcraft.wiki.gg/wiki/A_Secret_Revealed", "quest", "Secondary quest-text locator for K'ure's account and A'dal's response."],
  ["hero-maghar-soul-sees", "What the Soul Sees", "https://warcraft.wiki.gg/wiki/What_the_Soul_Sees", "quest", "Secondary quest-text locator for D'ore, the Soul Mirror, and Mother Kashur."],
  ["hero-maghar-mirror", "Soul Mirror quest item", "https://warcraft.wiki.gg/wiki/Soul_Mirror_(quest_item)", "quest", "Secondary item and quest locator for darkened ancestral spirits."],
  ["hero-maghar-return", "Return to the Greatmother", "https://warcraft.wiki.gg/wiki/Return_to_the_Greatmother", "quest", "Secondary quest-text locator for the report returning to Garadar."],
  ["hero-maghar-inconsolable", "The Inconsolable Chieftain", "https://warcraft.wiki.gg/wiki/The_Inconsolable_Chieftain", "quest", "Secondary quest-text locator for Garrosh's shame and despair."],
  ["hero-maghar-no-hope", "There Is No Hope", "https://warcraft.wiki.gg/wiki/There_Is_No_Hope", "quest", "Secondary quest and cutscene locator; it became the chain endpoint after patch 4.0.1."],
  ["hero-maghar-thrall", "Thrall, Son of Durotan", "https://warcraft.wiki.gg/wiki/Thrall,_Son_of_Durotan", "quest", "Secondary locator for Geyah's message to Thrall; removed in 4.0.1, retained in the TBC-era chain."],
  ["hero-maghar-ending", "Hero of the Mag'har", "https://warcraft.wiki.gg/wiki/Hero_of_the_Mag%27har", "quest", "Secondary quest and scene locator for Thrall's visit, the recalled battle, and the final return to Geyah; removed in 4.0.1."],
  ["blizzard-garrosh", "Garrosh Hellscream: Then and Now", "https://worldofwarcraft.blizzard.com/en-us/news/2629898/garrosh-hellscream-then-and-now", "website", "First-party retrospective supporting Garrosh's shame, fear, Thrall's visit, Grom's sacrifice, and Garrosh's renewed confidence; later career material is excluded."],
  ["hero-maghar-demon-fall", "Demon Fall Canyon", "https://warcraft.wiki.gg/wiki/Demon_Fall_Canyon", "website", "Secondary locator for the Third War battle site in Ashenvale; exact scene comparison remains open."],
  ["hero-maghar-nagrand-visual", "TBC Nagrand and Garadar visual reference", "https://www.wowhead.com/tbc/zone=3518/nagrand#screenshots", "website", "TBC area visual locator for grassland, waterways, mesas, floating islands, Oshu'gun, and the Garadar screenshot gallery. Visual reference only."],
  ["hero-maghar-crypt-visual", "TBC Auchenai Crypts visual reference", "https://www.wowhead.com/tbc/zone=3790/auchenai-crypts#screenshots", "website", "TBC visual locator for the Draenei crypt architecture and violet-blue lighting. Visual reference only."],
];
const sources = Object.fromEntries(sourceDefs.map(([sourceId, title, url, sourceType, notes]) => [
  sourceId, { id: sourceId, title, url, sourceType, notes: "Accessed 2026-10-03. " + notes },
]));
const sourceIds = Object.keys(sources);
const cit = (sourceId, questId, section) => ({ sourceId, questId, section });
const unique = (values) => [...new Set(values)];
const writeRecord = async (folder, record, recordId = record.id) => {
  const path = join(root, "data", folder, recordId + ".research.json");
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(record, null, 2) + "\n", "utf8");
};
const places = [
  ["garadar", "Garadar", "location", "The Mag'har village in Nagrand where Garrosh and Greatmother Geyah anchor the Horde chain.", ["hero-maghar-greatmother", "hero-maghar-nagrand-visual"], eraId],
  ["nagrand-ancestral-grounds", "Ancestral Grounds, Nagrand", "site", "A named spiritual site where Mother Kashur receives the seeker and the ancestor inquiry begins.", ["hero-maghar-kashur", "hero-maghar-agitated-ancestors", "hero-maghar-nagrand-visual"], eraId],
  ["oshugun", "Oshu'gun, Nagrand", "site", "The pale sacred mass in Nagrand associated with the ancestors' call and K'ure's account.", ["hero-maghar-spirits-speak", "hero-maghar-secret", "hero-maghar-nagrand-visual"], eraId],

  ["auchindoun", "Auchindoun", "location", "The ruined draenei complex in Terokkar Forest that contains the Auchenai Crypts.", ["hero-maghar-chain", "hero-maghar-crypt-visual"], eraId],
  ["auchenai-crypts", "Auchenai Crypts", "site", "A funerary wing of Auchindoun where D'ore explains the soul cycle and the Soul Mirror is used.", ["hero-maghar-soul-sees", "hero-maghar-mirror", "hero-maghar-crypt-visual"], eraId],
  ["orgrimmar", "Orgrimmar", "location", "The Horde capital where Geyah's message reaches Thrall in the original TBC continuation.", ["hero-maghar-thrall"], eraId],
  ["demon-fall-canyon", "Demon Fall Canyon, Ashenvale", "site", "The Third War battlefield shown as a distinct remembered scene when Thrall recounts Grom's sacrifice.", ["hero-maghar-ending", "hero-maghar-demon-fall", "warcraft-chronicle-volume-3"], "third-war-frozen-throne"],
];
const actors = [
  ["garrosh-hellscream", "character", "Garrosh Hellscream", "The young Mag'har whose shame over Grom and fear of inherited rage form the opening conflict.", imageDir + "/garrosh.research.webp", 0.88, ["hero-maghar-greatmother", "blizzard-garrosh"]],
  ["geyah", "character", "Greatmother Geyah", "The Mag'har elder who guides the ancestor inquiry and discovers Thrall is her grandson.", imageDir + "/greatmother-geyah.research.webp", 0.8, ["hero-maghar-greatmother", "hero-maghar-no-hope", "hero-maghar-ending"]],
  ["maghar-community", "faction", "The Mag'har of Garadar", "Interpretive community ensemble; not an exact census, named roster, or claim that each villager is present in every scene.", imageDir + "/maghar-community.research.webp", 0.65, ["hero-maghar-chain", "hero-maghar-nagrand-visual"]],
  ["mother-kashur", "character", "Mother Kashur", "The ancestral figure who directs the seeker toward Oshu'gun and receives news of the spirits' release.", imageDir + "/mother-kashur.research.webp", 0.76, ["hero-maghar-kashur", "hero-maghar-agitated-ancestors", "hero-maghar-return"]],
  ["ancient-orc-ancestors-maghar", "other", "Ancient Orc Ancestors", "An unnamed interpretive spirit group; no individual ancestor is named or assigned an invented history.", imageDir + "/ancient-orc-ancestors.research.webp", 0.7, ["hero-maghar-ancestors", "hero-maghar-spirits-speak", "hero-maghar-soul-sees"]],
  ["kure-oshu-gun", "other", "K'ure", "A Naaru associated with Oshu'gun whose quest account describes fading Light, growing Void, and ancestral spirits.", imageDir + "/kure.research.webp", 0.72, ["hero-maghar-secret"]],
  ["dore-auchenai", "other", "D'ore", "The naaru in Auchenai Crypts whose account explains the Light and Void cycle and the Soul Mirror response.", imageDir + "/dore.research.webp", 0.7, ["hero-maghar-soul-sees"]],
];

const stateDefs = [
  ["garadar", "Garadar", imageDir + "/garadar.research.webp", "TBC Mag'har village: modest hide-and-timber shelters, rough fences, fire ring, totems, grassland, ochre mesas and distant floating islands."],
  ["nagrand", "Nagrand's green reaches", imageDir + "/nagrand-valley.research.webp", "Rolling green-gold grassland, turquoise waterways, broad-canopy trees, plateaus, floating islands and waterfalls."],
  ["ancestral", "The Ancestral Grounds", imageDir + "/ancestral-grounds.research.webp", "Open Nagrand grassland, weathered stones and ancestor markers beside a spring, with floating islands and mesas in the distance."],
  ["oshugun", "Oshu'gun", imageDir + "/oshugun.research.webp", "Nagrand's immense pale crystalline mass amid green pasture, waterways and floating islands; a restrained violet shadow suggests spiritual danger."],
  ["shattrath", "Shattrath City", "images/storylines/akama-black-temple/shattrath-terrace.research.webp", "Reused TBC Shattrath art with bright draenei arches, crystal light and water; not an exact quest-scene capture."],
  ["crypts", "Auchenai Crypts", imageDir + "/auchenai-crypts.research.webp", "Blue-gray Draenei funerary arches, carved stone, crypt hall, cobwebs, bones and restrained violet-blue braziers."],
  ["orgrimmar", "Orgrimmar", "images/storylines/onyxia/orgrimmar.research.webp", "Reused red-stone Horde capital painting; contextual exterior, not a precise Hall of the Warchief plan."],
  ["memory", "Flashback · Demon Fall Canyon", imageDir + "/demon-fall-memory.research.webp", "Barren red-rock Ashenvale ravine, scorched earth, ash, dark stone and restrained fel-green light; explicit Third War memory."],
];

const scenes = [
  { key: "garadar-burden", title: "Garadar beneath the Hellscream name", state: "garadar", places: ["garadar"], quest: "A Visit with the Greatmother", citations: [cit("hero-maghar-greatmother", "A Visit with the Greatmother", "Opening dialogue and handoff"), cit("blizzard-garrosh", "Garrosh Hellscream: Then and Now", "Garrosh's shame before Thrall's visit")], actors: ["garrosh-hellscream", "maghar-community"], summary: "Garrosh carries shame over Grom's corruption and fears the same weakness lies within him.", narration: "Garadar is no fortress of a conquering clan. It is a home held together beneath Nagrand's bright sky, where the Mag'har endure without the strength of the greater Horde around them. At its center stands Garrosh Hellscream, son of a name that brings him no comfort. He remembers Grom through the corruption that claimed the old chieftain and fears that the same rage may live in him. The quest sends the seeker first to Greatmother Geyah. Before Garrosh can imagine a future for his people, the weight of the past must be spoken aloud.", note: "Garrosh's shame and fear are supported by Blizzard's retrospective and the quest chain. No exact date or population is asserted." },
  { key: "greatmother-counsel", title: "The Greatmother's path", state: "garadar", places: ["garadar"], quest: "Material Components", citations: [cit("hero-maghar-greatmother", "A Visit with the Greatmother", "Geyah's dialogue and handoff"), cit("hero-maghar-materials", "Material Components", "Gathering task and potion")], actors: ["geyah", "garrosh-hellscream", "maghar-community"], summary: "Geyah directs the seeker through a short preparation task before the inquiry turns toward the ancestors.", narration: "Geyah receives the seeker as a guest of her people and gives a small task before the deeper questions begin. The chain asks for materials gathered across Outland, then turns them into a potion. Those repeated errands are compressed here; the story is not a record of every plant picked or each path crossed. The important change is one of readiness. Geyah is opening a way toward a witness older than Garrosh's grief: the ancestors who still walk the green places of Nagrand. Her next direction leads beyond the village, to Mother Kashur.", note: "Quest objectives are paraphrased. The potion is not described as granting permanent spirit sight." },
  { key: "mother-kashurs-counsel", title: "A listening place", state: "ancestral", places: ["nagrand-ancestral-grounds"], quest: "To Meet Mother Kashur", citations: [cit("hero-maghar-kashur", "To Meet Mother Kashur", "Destination and dialogue")], actors: ["mother-kashur", "ancient-orc-ancestors-maghar"], summary: "At the Ancestral Grounds, Mother Kashur gives the seeker a way to listen to the unsettled spirits.", narration: "The Ancestral Grounds hold the valley's memory in quieter forms: weathered stones, a spring, and the presence of those who came before. Mother Kashur receives the seeker there. Geyah's preparation has brought the traveler to a listening place, but no potion can make the ancestors' meaning simple. Their unrest is the question now. Mother Kashur turns the inquiry outward, asking that the old sites be visited and the spirits' words carried back. The story follows that chain of testimony rather than inventing a private vision or a prophecy the quests do not give.", note: "The site and handoff follow the quest locator; construction and ritual visuals remain interpretive." },
  { key: "ancestors-walk-south", title: "A valley of restless voices", state: "nagrand", places: ["nagrand-ancestral-grounds", "garadar"], quest: "The Agitated Ancestors · A Visit With the Ancestors", citations: [cit("hero-maghar-agitated-ancestors", "The Agitated Ancestors", "Spirit dialogue and next objective"), cit("hero-maghar-ancestors", "A Visit With the Ancestors", "Named sites and spirit dialogue")], actors: ["mother-kashur", "ancient-orc-ancestors-maghar"], summary: "Reports of unrest lead the seeker through Nagrand's named ancestral sites, where the spirits point toward Oshu'gun.", narration: "The first reports are not of an army crossing the grass, but of spirits who cannot rest. Their broken words speak of a call from the south, so Mother Kashur sends the seeker to look and listen. The investigation reaches Sunspring Post, the Laughing Skull ruins, Garadar, and the Bleeding Hollow ruins; at each, different fragments of memory carry the same pull. The ancestors speak of Oshu'gun, the pale mountain that has long watched over the valley. The quest does not establish that every spirit has left or that these sites share one history. It gives a route of witnesses whose words point in the same direction. A scattered unease now has a destination, and Mother Kashur sends the seeker onward.", note: "Spirit statements and quest-named locations are paraphrased; this is not a surveyed itinerary, and no named ancestor or count is invented." },
  { key: "oshugun-calls", title: "The mountain calls", state: "oshugun", places: ["oshugun"], quest: "When Spirits Speak", citations: [cit("hero-maghar-spirits-speak", "When Spirits Speak", "Quest destination and objective")], actors: ["ancient-orc-ancestors-maghar", "kure-oshu-gun"], summary: "At Oshu'gun, the seeker follows the ancestors' call to its source.", narration: "Oshu'gun rises from Nagrand like a fragment of another world set among grass and water. The ancestor trail ends at its pale mass, where the call grows stronger and the old whispers find a voice. The chain sends the seeker to hear what lies beneath the mountain's silence. The scene treats Oshu'gun as the sacred place the Mag'har know, while the art suggests its deeper nature without claiming a precise interior layout. The voices have not chosen the mountain as a refuge by chance; they are being drawn to something whose light is failing.", note: "Oshu'gun is the named destination; art is a broad impression, not exact geography." },
  { key: "kure-reveals", title: "A light bleeding away", state: "oshugun", places: ["oshugun"], quest: "A Secret Revealed", citations: [cit("hero-maghar-secret", "A Secret Revealed", "K'ure's account of Light, Void, and the spirits")], actors: ["kure-oshu-gun", "ancient-orc-ancestors-maghar"], summary: "K'ure explains that fading energies have left a Void that draws in the orc ancestors.", narration: "K'ure's account changes the meaning of the pilgrimage. The Naaru says that its energies have bled away over centuries and a Void has grown in their place, consuming the souls nearby. Generation after generation of orc ancestors have been drawn into that vortex. K'ure also says the Burning Legion recently harnessed it to bring void minions into its ranks. This is the Naaru's testimony, not an omniscient explanation of every spirit's fate. One part of the cycle may still be answered, K'ure tells the seeker, but the path now leads away from Nagrand to A'dal in Shattrath.", note: "Vortex and Legion claims remain attributed to K'ure." },
  { key: "adal-answers", title: "A'dal's answer", state: "shattrath", places: ["shattrath-city"], quest: "A Secret Revealed", citations: [cit("hero-maghar-secret", "A Secret Revealed", "A'dal's completion dialogue and direction")], actors: ["adal"], summary: "A'dal cannot simply end the ancestors' suffering, but directs the seeker toward the naaru in Auchindoun.", narration: "In Shattrath, A'dal hears K'ure's account and answers with caution. The suffering of the ancestors cannot be lifted by a word of Light alone. Another Naaru is tied to the problem, and A'dal points the seeker toward Auchindoun, where its fate may reveal what can still be done. The city offers no easy comfort: even beings devoted to the Light cannot promise that every wound can be undone. Yet the direction matters. What happened at Oshu'gun belongs to a larger cycle, and the next witness waits beneath the ruined halls of Terokkar.", note: "A'dal's reply is paraphrased; Shattrath painting is reused from another TBC storyline." },
  { key: "dore-explains-cycle", title: "The cycle beneath Auchindoun", state: "crypts", places: ["auchindoun", "auchenai-crypts"], quest: "What the Soul Sees", citations: [cit("hero-maghar-soul-sees", "What the Soul Sees", "D'ore's account of the Light and Void cycle")], actors: ["dore-auchenai"], summary: "D'ore says the Light and Void cannot be separated from the naaru cycle, leaving a difficult choice for the ancestors.", narration: "The Auchenai Crypts descend through blue-gray stone and a silence made for the dead. There, D'ore explains that the cycle cannot simply be stopped: without the Void, the Light cannot exist. The words do not offer a cure that restores each ancestor to the life they knew. They name a harder limit. The spirits drawn toward corruption must be released before the same darkness consumes them. The quest moves from listening to action, but the choice belongs to the seeker who carries a mirror through the crypt, not to a prophecy that has already decided each spirit's fate.", note: "D'ore's account is attributed to the quest. Crypt layout remains interpretive." },
  { key: "soul-mirror", title: "The mirror and the darkened spirit", state: "crypts", places: ["auchenai-crypts", "nagrand-ancestral-grounds"], quest: "What the Soul Sees", citations: [cit("hero-maghar-mirror", "Soul Mirror", "Item effect and use"), cit("hero-maghar-soul-sees", "What the Soul Sees", "Objective and return to Mother Kashur")], actors: ["dore-auchenai", "ancient-orc-ancestors-maghar"], summary: "The Soul Mirror reveals darkened ancestor spirits so they can be released before transformation is complete.", narration: "A Soul Mirror turns the crypt's lesson into a difficult act. Its reflection exposes a darkened spirit drawn from the ancient orc ancestors, and the seeker must defeat those already changing before the Void takes them fully. The task is repeated, but repetition is not made into separate history: the meaningful change is that the unseen danger can now be confronted. When the work is done, Mother Kashur receives the news at the Ancestral Grounds. The journey has not restored the dead to life. It has given them a chance to rest without being consumed by the force that called them south.", note: "The quest asks for a bounded set of spirits; it does not claim every ancestor is saved." },
  { key: "return-to-garadar", title: "News for the Greatmother", state: "garadar", places: ["nagrand-ancestral-grounds", "garadar"], quest: "Return to the Greatmother", citations: [cit("hero-maghar-return", "Return to the Greatmother", "Return objective and Geyah's handoff")], actors: ["mother-kashur", "geyah", "maghar-community"], summary: "Mother Kashur's gratitude returns the seeker to Garadar, where Geyah asks that the news reach Garrosh.", narration: "Mother Kashur receives the report with gratitude for the ancestors who have been freed from the darkening cycle. She sends the seeker back to Garadar with news of the victory. The walk home matters because it returns the story from the crypt to the people who were waiting on an answer. Geyah says the Mag'har have endured and their people have more than one season ahead of them; then she asks for a more personal message. Garrosh has heard of the seeker's work. Geyah hopes that words of service to the clan may reach him where comfort has not.", note: "Adjacent quest handoffs are summarized; no claim that every Mag'har is safe." },
  { key: "geyah-sends-to-garrosh", title: "A chieftain who cannot hope", state: "garadar", places: ["garadar"], quest: "The Inconsolable Chieftain", citations: [cit("hero-maghar-inconsolable", "The Inconsolable Chieftain", "Garrosh's words about shame and leadership"), cit("blizzard-garrosh", "Garrosh Hellscream: Then and Now", "Garrosh's burden before Thrall's visit")], actors: ["geyah", "garrosh-hellscream"], summary: "Garrosh refuses the comfort offered by the seeker's service and names himself unfit to lead.", narration: "Geyah sends the seeker to tell Garrosh that the work was done for him and his people. The words do not lift him. Garrosh sees a clan that may survive another winter, yet he cannot imagine a future beyond it. He asks whether the seeker should lead instead, then speaks of his family's name as a shame he wishes he could lay down. His grief is not only sorrow for Grom; it is fear that the same curse waits inside him. The chain lets his despair stand plainly, without pretending that a stranger's praise has already cured it.", note: "Garrosh's dialogue is paraphrased. Later politics are excluded." },
  { key: "garrosh-confession", title: "A grandmother's urgent message", state: "garadar", places: ["garadar"], quest: "There Is No Hope", citations: [cit("hero-maghar-no-hope", "There Is No Hope", "Garrosh's confession and Geyah's response")], actors: ["geyah", "garrosh-hellscream", "maghar-community"], summary: "Geyah learns Thrall is her grandson and asks the seeker to carry her message across the sea.", narration: "Garrosh asks the seeker to return to Geyah with the words he cannot bear to carry himself: he believes he is unfit to lead and fears that the old corruption will damn the orcs again. Geyah hears more than his despair. In the exchange that follows, she learns that the Horde's Warchief is Thrall, son of her lost child Durotan. The revelation turns a family line separated by the Dark Portal into an urgent summons. Geyah cannot make the journey herself, so she asks the seeker to find Thrall in Orgrimmar and tell him that his blood remains on Draenor.", note: "The family revelation follows the TBC quest/cutscene; no route or travel duration is invented." },
  { key: "message-to-thrall", title: "A message in Orgrimmar", state: "orgrimmar", places: ["orgrimmar"], quest: "Thrall, Son of Durotan", citations: [cit("hero-maghar-thrall", "Thrall, Son of Durotan", "Message objective and Thrall's response")], actors: ["thrall"], summary: "Thrall hears that Geyah lives and his family remains in Nagrand.", narration: "The seeker carries Geyah's message to Orgrimmar: her blood is still in the broken world, and Grom's legacy lives on there too. Thrall answers first with astonishment. He has a grandmother, and she lives. The quest offers no measured travel account for the journey from one world to another, so the scene follows only the message and the decision it changes. Thrall now has a reason to return to Nagrand that reaches beyond old war or duty. He must meet the family who remained behind when his parents crossed the Dark Portal.", note: "Message and response are paraphrased; no route, duration, or escort is asserted." },
  { key: "flashback-demon-fall", title: "Flashback · Demon Fall Canyon", state: "memory", places: ["garadar", "demon-fall-canyon"], quest: "Hero of the Mag'har", citations: [cit("hero-maghar-ending", "Hero of the Mag'har", "Thrall's visit and vision of Grom's last battle"), cit("blizzard-garrosh", "Garrosh Hellscream: Then and Now", "Grom's martyrdom and Garrosh's change"), cit("hero-maghar-demon-fall", "Demon Fall Canyon", "Ashenvale battle location"), cit("warcraft-chronicle-volume-3", "Warcraft Chronicle, Volume III", "Third War; exact edition page review remains open")], actors: ["thrall", "grom-hellscream", "mannoroth"], relatedEventIds: ["grom-breaks-mannoroths-bond"], summary: "Thrall's return brings Grom's last battle into view as a clearly labeled memory from the Third War.", narration: "Thrall returns to Garadar, where Geyah at last meets the grandson she feared she had lost. Garrosh sees the likeness of his father, but resemblance is not yet an answer. Thrall tells him what the old shame left out: at Demon Fall Canyon in Ashenvale, Grom Hellscream stood against Mannoroth and struck the blow that ended the demon's hold over the orcs. Grom died in that act. This is a remembered Third War scene, distinct from the present gathering in Nagrand. The vision does not erase the corruption or the cost; it reveals the choice Grom made when the moment came.", note: "The memory is explicitly distinguished from present-day Nagrand; Geyah and Garrosh are staged in the following Garadar scene. The battle art is not a game capture." },
  { key: "garrosh-name-restored", title: "Garrosh, son of Grom", state: "garadar", places: ["garadar"], quest: "Hero of the Mag'har", citations: [cit("hero-maghar-ending", "Hero of the Mag'har", "Garrosh's response, Thrall's farewell, and final Geyah turn-in"), cit("blizzard-garrosh", "Garrosh Hellscream: Then and Now", "Renewed strength and confidence")], actors: ["garrosh-hellscream", "thrall", "geyah", "maghar-community"], summary: "The truth of Grom's sacrifice lifts Garrosh's shame; the story ends with restored pride and Geyah's recognition.", narration: "The memory returns to Garadar, but Garrosh is no longer looking at the name Hellscream as an inherited sentence. He learns that his father did not leave the orcs bound to the Legion forever; Grom chose to break that hold and paid with his life. Garrosh's burden lifts, and he can name himself with pride: son of Grom, chieftain of the Mag'har. Thrall remains long enough to honor the bond he shared with Grom, then returns to Geyah. The seeker carries the final news to the Greatmother, who names the service done for her people. The chain ends here, before Garrosh's later campaigns.", note: "The full original TBC ending is included; Garrosh's later career is excluded." },
];

const fullScenes = scenes.map((scene) => ({
  ...scene,
  id: id + "-story-" + scene.key,
  eventId: id + "-" + scene.key + "-event",
  claimId: id + "-" + scene.key + "-claim",
  citations: scene.citations.map((item, index) => ({ ...item, id: id + "-" + scene.key + "-citation-" + (index + 1) })),
}));
for (const [sourceId, title, url, sourceType, notes] of sourceDefs) {
  await writeRecord("sources", { id: sourceId, title, url, sourceType, notes: "Accessed 2026-10-03. " + notes });
}
await writeRecord("worldspaces", {
  id: theaterId,
  name: "Hero of the Mag'har · relational story theater",
  slug: theaterId,
  coordinateSystem: { width: 10000, height: 10000, origin: "bottom-left", units: "atlas-units" },
});
for (const [placeId, name, type, description, placeSources, placeEra] of places) {
  await writeRecord("entities", {
    id: placeId, type, name, slug: placeId, shortDescription: description,
    body: description + " Story placements and images are interpretive; no exact coordinate, floor plan, or travel route is asserted.",
    firstEraId: placeEra, featuredEraIds: [placeEra], sourceIds: placeSources,
    tags: ["hero-of-the-maghar-story", "tbc-area-reference"], contentStatus: "research",
  });
}
for (const [entityId, type, name, description, asset, scale, actorSources] of actors) {
  await writeRecord("entities", {
    id: entityId, type, name, slug: entityId, shortDescription: description,
    body: description + " The original research illustration is interpretive, not canonical model evidence; compare it with the relevant client before approval.",
    firstEraId: eraId, featuredEraIds: [eraId], sourceIds: actorSources,
    tags: ["hero-of-the-maghar-story", "interpretive-art"],
    mapFigure: { asset, scale }, contentStatus: "research",
  });
}
for (const entityId of ["grom-hellscream", "mannoroth"]) {
  const path = join(root, "data", "entities", entityId + ".research.json");
  const entity = JSON.parse(await readFile(path, "utf8"));
  entity.featuredEraIds = unique([...(entity.featuredEraIds ?? []), eraId]);
  entity.sourceIds = unique([...(entity.sourceIds ?? []), "hero-maghar-ending", "hero-maghar-chain"]);
  const note = " Featured in the age-of-adventurers StoryGuide only as a clearly labeled Third War memory; the relational figure anchor does not assert continued life or a Nagrand location.";
  if (!entity.body?.includes("clearly labeled Third War memory")) entity.body = (entity.body ?? "") + note;
  await writeFile(path, JSON.stringify(entity, null, 2) + "\n", "utf8");
}

const figureIds = unique(fullScenes.flatMap((scene) => scene.actors));
const figureEntities = new Map();
for (const entityId of figureIds) {
  const entity = JSON.parse(await readFile(join(root, "data", "entities", entityId + ".research.json"), "utf8"));
  if (entity.mapFigure) figureEntities.set(entityId, entity);
}
const geometryFeatures = [...figureEntities.entries()].map(([entityId, entity], index, list) => {
  const angle = (Math.PI * 2 * index) / list.length;
  const radius = 1300 + (index % 4) * 220;
  return {
    type: "Feature",
    id: id + "-" + entityId + "-focus",
    properties: { name: entity.name + " relational story focus", contentStatus: "research", styleRole: "site", geographicCertainty: "unknown" },
    geometry: { type: "Point", coordinates: [Math.round(5000 + Math.cos(angle) * radius), Math.round(5000 + Math.sin(angle) * radius * 0.72)] },
  };
});
await writeFile(join(root, "data", "geometry", theaterId + ".research.geojson"), JSON.stringify({
  type: "FeatureCollection", name: "Hero of the Mag'har relational story theater", features: geometryFeatures,
}, null, 2) + "\n", "utf8");
for (const [index, [entityId, entity]] of [...figureEntities.entries()].entries()) {
  await writeRecord("spatial-states", {
    id: id + "-" + entityId + "-theater", entityId, eraId, worldspaceId: theaterId,
    geometryId: id + "-" + entityId + "-focus", placementKind: "relational",
    geographicCertainty: "unknown", sourceIds: entity.sourceIds,
    editorNote: "Editorial figure anchor in the illustrated TBC story theater; no exact coordinates, formation, route, or permanent presence is asserted. Grom and Mannoroth appear only in the labeled Third War memory. See docs/research/hero-of-the-maghar-visual-assets.json.",
    visualPresence: "contextual", labelPriority: 250 - index,
  });
}
for (const [key, name, assetPath, traits] of stateDefs) {
  await writeRecord("map-states", {
    id: id + "-" + key + "-scene", name: "Mag'har story: " + name, worldspaceId: theaterId,
    presentation: "relational", terrainTextureAsset: assetPath, geometryIds: [],
    cartographyLabel: key === "memory" ? "THIRD WAR MEMORY · DEMON FALL CANYON" : "THE BURNING CRUSADE · " + name.toUpperCase(),
    interpretationNote: "Interpretive story scene. " + traits + " Theater background only; no exact geography or surveyed layout is asserted. Human side-by-side review against the target client remains open.",
  });
}

const citations = [];
const events = [];
const claims = [];
const nodes = fullScenes.map((scene, index) => {
  const citationIds = scene.citations.map((item) => item.id);
  citations.push(...scene.citations.map((item) => ({
    id: item.id, sourceId: item.sourceId, questId: item.questId, section: item.section,
    note: item.sourceId.startsWith("blizzard-")
      ? "First-party retrospective paraphrase; coverage is limited to the cited character-history point."
      : "Original paraphrase from a secondary quest-text or sequence locator. Exact original TBC wording, dependency edges, build variants, and omitted dialogue remain subject to human verification.",
  })));
  events.push({
    id: scene.eventId, kind: "event", name: scene.title, slug: id + "-" + scene.key,
    eraId, worldspaceId: theaterId,
    date: { precision: "unknown", label: "The Burning Crusade quest arc; exact in-world date unknown" },
    summary: scene.summary, locationIds: scene.places, participantEntityIds: scene.actors,
    sourceIds: unique(scene.citations.map((item) => item.sourceId)), claimIds: [scene.claimId], contentStatus: "research",
  });
  claims.push({
    id: scene.claimId, subjectId: scene.eventId, predicate: "hero_of_the_maghar_story_beat",
    value: scene.summary, citationIds, confidence: "strongly_supported", status: "active",
    editorNote: scene.note + " Keep research status until human claim and original-client review.",
  });
  return {
    id: scene.id, guideId, title: scene.title, narration: scene.narration,
    eventIds: [scene.eventId, ...(scene.relatedEventIds ?? [])], entityIds: scene.actors, locationIds: scene.places,
    camera: { position: [0, 6.2, 5.4], target: [0, 0, 0], durationMs: 1100 },
    visualActions: [{ type: "set_map_state", mapStateId: id + "-" + scene.state + "-scene" }],
    ...(index > 0 ? { previousNodeId: fullScenes[index - 1].id } : {}),
    ...(index < fullScenes.length - 1 ? { nextNodeIds: [fullScenes[index + 1].id] } : {}),
    ...(previousNodes.get(scene.id)?.narration === scene.narration && previousNodes.get(scene.id)?.voiceover ? { voiceover: previousNodes.get(scene.id).voiceover } : {}),
  };
});
await writeRecord("stories", {
  guide: {
    id: guideId, eraId, title: "Hero of the Mag'har · Garrosh, Geyah, and Thrall",
    description: "Fifteen illustrated TBC scenes follow Garrosh's burden through the ancestor quest, the Light and Void cycle, Geyah's message to Thrall, and the remembered battle that restores Garrosh's pride. Later history is excluded.",
    nodeIds: nodes.map((node) => node.id), contentStatus: "research",
  },
  nodes,
}, id);
for (const record of citations) await writeRecord("citations", record);
for (const record of events) await writeRecord("events", record);
for (const record of claims) await writeRecord("claims", record);

await writeRecord("storylines", {
  id, slug: id, title: "Hero of the Mag'har: Garrosh, Geyah, and Thrall's Return",
  summary: "Garrosh's shame leads the seeker from Garadar to Oshu'gun, Shattrath, and Auchindoun. The ancestors' danger brings a message to Thrall, whose return and account of Grom's sacrifice change the name Garrosh can bear.",
  opening: "Beneath Nagrand's floating islands, the Mag'har live with a history their young Hellscream cannot yet forgive. Follow the Horde-only TBC chain from Garrosh's doubt through the ancestors' unrest, then carry Geyah's message to Thrall and return to Garadar for the memory that changes everything.",
  primaryEraId: eraId, eraIds: [eraId],
  chapters: [
    { id: id + "-chapter-valley", eraId, title: "A burden in Garadar", body: "Garrosh's shame brings the seeker to Geyah and Mother Kashur; the ancestors' unease leads toward Oshu'gun." },
    { id: id + "-chapter-cycle", eraId, title: "The voices beneath the Light", body: "K'ure, A'dal, and D'ore expose the Light and Void cycle. The Soul Mirror offers a bounded response for darkened spirits." },
    { id: id + "-chapter-message", eraId, title: "A message to the Warchief", body: "The return to Garadar reveals Garrosh's despair and Geyah's family connection to Thrall. The original TBC follow-up carries her message to Orgrimmar." },
    { id: id + "-chapter-memory", eraId, title: "A memory returned", body: "Thrall's Third War memory is distinct from the present-day Nagrand scene. Garrosh accepts Grom's sacrifice and the story ends with the original TBC chain." },
  ],
  sourceIds: unique([...sourceIds, "warcraft-chronicle-volume-3"]),
  reviewNote: "Complete illustrated research StoryGuide with 15 scenes and source-linked events and claims. The Horde-only unlock has its actual prerequisite branches: Totem of Kar'dash/Murkblood and the Nagrand diplomacy and Forge Camp threads ending at Message to Garadar and Forge Camp: Annihilated; it does not require every Nagrand quest. The original TBC continuation includes Thrall, Son of Durotan and Hero of the Mag'har, removed in 4.0.1. Human gates: original quest/build and prerequisite-edge review; exact claim and Chronicle page review; TBC side-by-side area and model resemblance; visual composition review; and voice audition. The Third War scene is labeled as memory. The story ends before Garrosh's later career. Added to the independent Classic-to-Wrath StoryTour, not an EraTour. See hero-of-the-maghar-research.md, hero-of-the-maghar-production.md, and hero-of-the-maghar-visual-assets.json.",
  storyGuideId: guideId, showInEraTourOffshoots: false, contentStatus: "research",
});

const tourPath = join(root, "data", "story-tours", "classic-to-wrath.research.json");
const tour = JSON.parse(await readFile(tourPath, "utf8"));
const existing = tour.entries.find((entry) => entry.storylineId === id);
const karazhan = tour.entries.find((entry) => entry.storylineId === "karazhan-masters-key-and-nightbane");
if (!existing) {
  const order = (karazhan?.order ?? 11) + 1;
  for (const entry of tour.entries) if (entry.order >= order) entry.order += 1;
  tour.entries.push({
    storylineId: id, regionIds: ["outland"], mapPositionPercent: [84, 85], order,
    periodLabel: "The Burning Crusade · patch 2.0.3 Horde chain",
    locationLabel: "Nagrand · Garadar, Oshu'gun, and the Ancestral Grounds",
  });
} else {
  existing.regionIds = ["outland"];
  existing.mapPositionPercent = [84, 85];
  existing.periodLabel = "The Burning Crusade · patch 2.0.3 Horde chain";
  existing.locationLabel = "Nagrand · Garadar, Oshu'gun, and the Ancestral Grounds";
  if (karazhan && existing.order !== karazhan.order + 1) existing.order = karazhan.order + 1;
}
tour.entries.sort((a, b) => a.order - b.order);
tour.reviewNote = "Research StoryTour collection with 19 map placards, 18 playable research StoryGuides, and one research preview. Play All follows the authored expansion-era sequence and skips the preview. Hero of the Mag'har is an early TBC Horde story; its marker is navigational layout only, not an exact coordinate. Stories remain research until human review gates are complete.";
if (!tour.chronologyNote.includes("Hero of the Mag'har")) {
  tour.chronologyNote += " Hero of the Mag'har was added in patch 2.0.3 and is placed among the early Burning Crusade stories, after the Karazhan opening stop and before later TBC campaigns. Its exact in-world date relative to Karazhan is unknown and no cross-story dependency is claimed. The original TBC follow-up quests removed in 4.0.1 are retained for the complete story ending.";
}
await writeFile(tourPath, JSON.stringify(tour, null, 2) + "\n", "utf8");
process.stdout.write("Authored " + nodes.length + " Hero of the Mag'har StoryNodes, " + events.length + " events, " + claims.length + " claims, " + citations.length + " citations, and " + places.length + " locations.\n");
