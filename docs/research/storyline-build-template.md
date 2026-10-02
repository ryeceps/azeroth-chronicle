# Agent guide: building a complete questline story

**Status:** production instructions for research content; no automatic approval of lore. **Historical scope for the current slate:** through the end of Wrath, before Cataclysm prelaunch changes. Start from the [30 candidate packets](questline-story-candidates.md), the [era authoring standard](../eras/README.md), `AGENTS.md`, and [implementation plan](../IMPLEMENTATION_PLAN.md).

## 1. Preflight and architecture

Classify the task as **era content work** under Phase 4 (continuous data-driven guided story), Phase 5 (claim-level causality and sources), and Phase 6 (accessible presentation). Identify the concrete acceptance criteria before edits. Read the current types, Zod schemas, repository, route selectors, and one completed era guide/node sequence; record their paths and IDs in the packet.

The current implementation has validated `Storyline`, `StoryGuide`, and `StoryNode` collections behind `LoreRepository`. The era-filtered library and text-first pages live at `/storylines` and `/storylines/:slug`. A storyline with a validated `storyGuideId` opens `/map?era=<primary-era-slug>&tour=storyline&storyline=<slug>`, using the same scene, transcript, playback and voice controls as the eras. See [the playback decision](../decisions/standalone-storyline-playback.md) and [Scepter production ledger](scepter-story-production.md) for the first complete research example. Recheck these contracts on the target branch.

If a storyline collection, era-filtered library, standalone playback selector, or multi-era scene transition is missing, identify that **reusable engine prerequisite** and document the decision before coding. Validate new collections with Zod and cross-record checks; route all access through `LoreRepository`. Keep the era guide intact. Audit selectors that assume one guide per era before adding another. Never make the new story depend on title/ID-specific React branches or an unmerged branch by accident.

**Required experience:** a story library reachable from an era, with candidates grouped by their main era and linked historical prologue eras; an individual text-first story page; and, when implemented, the same immersive guided presentation as the eras. Preserve dark archival styling, full-screen scene/transcript, chapter progress, Previous/Next, audio controls, keyboard access and a clear return to the originating era. Do not label a research outline as a finished or playable tour.

## 2. Copy this research packet before writing prose

```markdown
# <Story title>
Status: research
Candidate ID / slug:
Primary era / subperiod:
Linked prologue eras:
Historical ending and excluded later material:
Game edition, patch/build and faction/class variants:
Existing records and overlapping stories:
Visual reference edition/build and recognizable area traits to preserve:
Central historical question:
Principal actors, stated motives, and evidence:
Inciting problem:
Turning points:
Resolution and immediate consequences:
Open questions / retcons / competing accounts:
Proposed chapters, nodes and measured runtime:
Engine prerequisites / decision record:
Human review needed:
```

Choose in-world placement, not release-date placement. Scepter: main quest journey in Era 8; War of the Shifting Sands prologue in Era 5. Darrowshire: Third War background in Era 7; later investigation in Era 8. Historical instances and remembered scenes need visible flashback labels. A link to a distant-era source does not prove a storyline began in that era.

## 3. Capture sources and claims

Use the [citation review checklist](citation-review-checklist.md) and [research-note template](research-note-template.md). Secondary indexes locate evidence; they do not replace game capture or exact book citations. Do not ship bulk copied dialogue, screenshots of source pages, or scans.

| Source field | Required evidence |
| --- | --- |
| Identity | Publisher/author, title, URL or lawful edition, access date |
| Game locator | Edition/build, quest ID and name, faction/class, NPC, zone/instance, objective/progress/completion/gossip or cinematic scene |
| Book locator | Exact edition and page; distinguish prose, framing and narrator perspective |
| Coverage | Which narrow facts the source actually establishes |
| Availability | Original, removed, Classic recreation, altered modern version; comparison gaps |
| Review | Captured / awaiting capture / conflicting; reviewer and decision |

For **every consequential beat**, create a ledger row:

| Beat | Claim | Primary locator | Cause/consequence evidence | Certainty | Era/time | Geography | Review |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `<beat-id>` | Original narrow paraphrase | Quest ID/build/text section or exact page | Explicit evidence, inference, or unknown | Supported/disputed/inferred | Exact/approximate/unknown | Supported/approximate/unknown | Research/human decision |

Store supported public assertions as Source, Citation and Claim records with stable references. Cite causal edges separately: quest order proves a sequence of tasks, not necessarily that one event caused another. Do not invent motives, exact dates, player identities, travel routes, or unseen outcomes. Keep source conflicts visible in research and supporting dossiers. Only a human can promote content to `reviewed` or `published`.

## 4. Turn the chain into a historical narrative

Build two outlines: **playable quest dependencies** (prerequisites, branches, faction/class variants) and **historical scenes** (what happened, why, what changed). Then choose a continuous narrative ordering. Do not confuse repeatable mechanics, collection quotas, random drops or access gates with a sequence of unique historical events.

Each full story should explain:

1. The world and the unresolved problem before the quest begins.
2. Who asks for action and what evidence establishes their purpose.
3. The journey's major discoveries, choices, betrayals and obstacles.
4. How each consequential destination changes knowledge or the situation.
5. The climax, supported resolution and costs to people or places.
6. Immediate aftermath, unanswered questions and the next historical thread **within the cutoff**.

Use 8–15 nodes as the era standard's starting point, then justify additional nodes for substantial branches such as the Scepter's three shard trails. Length follows evidence; do not stretch material into long form by narrating farming. A chapter is a narrative grouping of nodes, not another playback engine. Give each node one question and one meaningful visible change. Keep detailed battle phases and optional dossiers outside the continuous tour.

For mutually exclusive variants, preserve viewpoint explicitly. Never imply one canonical adventurer experienced every racial, faction or class variant. For linked chains, identify the editorial join and source it; don't present it as a quest dependency. Where a chain stops without resolving its mystery, say so in its ending and review note.

## 5. Plan the atlas scenes and cast

**Environmental images and character images are pivotal to understanding a storyline, and are required production assets.** Match the illustrated era tours in visual quality as well as layout and prose. A complete transcript with generic silhouettes, geometric icons, flat gradients, or empty scenery does not meet the complete-story gate.

Before building the nodes, inventory the actual image assets for every scene:

- **Environment:** provide a substantial, recognizable illustrated landscape or interior for every node. Show the relevant desert, forest, coast, settlement, dungeon, raid, or historical setting. Change the environment when the destination or historical situation materially changes; reuse only when the setting and period match. A broad interpretive scene must not imply an exact surveyed location or instance layout.
- **Game-area resemblance:** when a place exists in World of Warcraft, identify the relevant game version and use its recognizable palette, architecture, terrain, vegetation, skyline, and landmark shapes as visual references. Preserve the traits that let a player recognize the place while keeping the composition original and interpretive. For example, Stormwind Keep should read as pale or white stone with blue and gold details; red-brown stone and red banners would misidentify it. Do not substitute generic fantasy scenery or another region's color language. Record the reference traits and review each image against the matching in-game area before completion.
- **Characters and embodied groups:** every principal named actor and significant group needs a distinct, recognizable illustrated portrait, creature cutout, or ensemble, visible during its relevant beat. Match the era art's detail, lighting and readability. Use transparent cutouts for the existing figure renderer; preserve labels and accompanying text. A name beside a generic marker or repeated silhouette is insufficient.
- **Artifacts and pivotal objects:** illustrate objects such as the Scepter when they drive the action. They supplement the setting and cast rather than replacing either.
- **Signature equipment:** when a character is identified by an iconic weapon or other defining implement, show it clearly as part of the character's representation during the relevant beat. Record its recognizable shape and materials, cite a lawful item/model locator, and check that the prop is visible in playback. For example, Medivh should visibly wield Atiesh: a dark gnarled shaft with an integrated carved seated raven, hooked beak and folded wings, a small violet eye detail, and the mage version's hanging red streamer; keep the complete staff in his hand rather than showing a generic bird-head prop.
- **Asset record:** record node IDs, environment path, actor IDs and image paths, creation/reuse provenance, prompt or lawful origin, interpretive limitations, and visual review status. Wire these repository-backed assets into MapState and entity visual fields through the existing engine. An image saved on disk but absent from the rendered scene is unfinished.
- **Scene composition:** frame environment and cast together at readable sizes. Keep faces, creature silhouettes, names and important setting details clear of the transcript and controls on desktop and phone. Do not add unsupported visual events or claim a generated costume or architectural detail as canonical evidence.

Use the same original raster illustration workflow as the eras where new art is needed; do not substitute hand-coded vector stand-ins to declare the story complete. Reuse era imagery only when its subject and historical state fit. Keep generation provenance and prompts in the production ledger, optimize assets for the static site, and retain genuine transparency. Human lore and visual review still gate publication.

| Node | Historical action and result | Era/map state/worldspace | Place and game-area reference | Recognizable traits to preserve | Scene art path and resemblance review | Cast and representation | Camera and visual actions | Claim/citation IDs and uncertainty | Entry/exit state |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `<story-id>-<beat>` | One supported visible change | Existing IDs or justified new state | Place name and matching game edition/build, or “no released depiction” | Materials, palette, architecture, terrain, vegetation, skyline, landmark shapes | Environment asset path; reference capture/source; human review result or open gate | Deliberate actor art and accessible text | Supported regional framing; existing interpreter actions | Source and citation IDs; explicit inference/ambiguity | Deterministic scene state |

For every place-based scene, the asset inventory also records the reference build, recognizable area traits, image path, and the result of the in-game resemblance review. When no released game depiction exists, state that limitation and explain the interpretive choices.

Reuse validated entities, events, worldspaces, terrain and source records where their identity and historical state match. Use SpatialState/MapState for changing positions and geography. Every key figure or embodied group needs a deliberate representation; generic markers alone are insufficient. Put asset provenance and interpretive composition notes in the dossier.

Use broad framing or a relational scene when evidence gives no exact location. Worldspace-local coordinates are not Earth coordinates. Travel to Outland or a historical instance is a state/worldspace transition, not a geographic line across the void. Render only source-supported routes; a list of destinations is not evidence for the path between them. New terrain or worldspace requirements must be explicit before promising playback.

## 6. Write in the era voice and use the era engine

Write original, warm, elevated chronicle narration attentive to landscape, age, loss and consequence. State actors and causes clearly. Do not copy Tolkien or game dialogue. Keep cartographic caveats and technical production notes in supporting records; omit unsupported details from narration. The transcript remains authoritative and available without audio or WebGL.

Use the existing contracts, not an invented JSON schema. A guide has `id`, `eraId`, `title`, `description`, ordered `nodeIds`, and `contentStatus`. A node has `id`, `guideId`, `title`, `narration`, and supported optional fields including `durationMs`, `voiceover`, `eventIds`, `battleIds`, `entityIds`, `locationIds`, `camera`, `visualActions`, `optionalExploreEntityIds`, `previousNodeId` and `nextNodeIds`. Verify required schema fields on the target branch.

The era scene pattern is the required baseline:

```text
establish the scene in narration
→ camera frames the relevant place and actors
→ highlight cited records
→ apply a supported visual change through the action interpreter
→ hold for narration and readable transcript
→ fill chapter progress
→ settle into the deterministic final state
→ advance
```

Reduced motion and skipping must reach the same final state. Previous, replay, direct-link entry and exit must clean up effects. Avoid nested conflict playback. Keep separate era, story, selection and view state; preserve shareable URLs and the return context.

## 7. Voice production comes after transcript stabilization

First review the complete transcript and claim ledger. Use the repository's existing voice generator and manifest conventions; inspect the script's current arguments. Regenerate only changed nodes, for example:

```bash
pnpm generate:voiceovers --force --nodes=<comma-separated-node-ids>
```

The era pacing baseline is about 82 words/minute plus roughly five seconds for settling. Use measured recording duration once audio exists; reconcile voiceover metadata, node timing and visual action duration with the actual playback implementation. Verify all assets, transcript hashes, voice provenance and manifest references. Listen to samples, especially names and scene transitions. Do not call narration complete when recordings are missing or stale. A research preview can be delivered without audio only when clearly labeled as such.

## 8. Delivery and verification

Deliver the research packet and claim ledger, complete chapter/node outline, authored validated records, scene/cast inventory, asset provenance, text-first page and era-library links, transcript, requested audio, overlap audit, unresolved questions, and human-review checklist. Keep research separate from publishable content. Name any engine prerequisite still blocking the complete experience.

Run the repository gates before committing:

```bash
pnpm generate:data
pnpm check
pnpm build
```

Add focused tests for any changed schema, repository selector, route context or story behavior. Validate the whole narrative traversal, cross-record links, scene cleanup, media references, keyboard/reduced motion, text without WebGL, and direct-link return to the correct era. Inspect desktop and compact layouts using the existing browser coverage. Do not add implementation-mirroring tests for a documentation-only packet.

**Required visual gate:** traverse every node in the built application on desktop and phone. Verify that its environmental image actually renders and that every required character/group/object image loads, remains recognizable, fits the viewport, and avoids material overlap with other figures or the transcript. Capture representative desert, indoor/raid, forest, coast and crowded-cast scenes and compare their quality with a completed era tour. Successful file existence checks or image load counts alone are not visual approval. Missing, placeholder-like, stale or unsuitable images block the `complete research story` label; record the specific gap and finish the imagery before claiming completion.

**Completion labels:** candidate = source leads; research packet = captured evidence and unresolved claims; preview = visible outline; complete research story = full transcript, records, required visuals, navigation and requested audio verified; reviewed/published = explicit human approval. Opening a PR does not change these labels. In the PR, state the exact label, content/engine split, verification and remaining review work.


## Standalone story and collection tours

Keep EraTours and the full-history itinerary composed only of their Era guide nodes. Every playable storyline can link to its existing StoryGuide for independent playback, but it has no era-tour insertion point.

When several stories form an expansion or game-version journey, create a validated `StoryTour` collection with explicit ordered entries, region IDs, edition/period labels, and a chronology note. Do not infer date order or map regions from era IDs, filenames, or titles. Use the same StoryGuide nodes and audio; do not duplicate or retag the story. `Play all` traverses only entries with complete StoryGuides and skips research previews. A placard for a preview opens its text-first research page and never starts playback.

Represent off-world destinations as separate worldspaces. A story-tour illustration may provide buttons with UI layout anchors, but those anchors are not atlas coordinates or geographic evidence. Label map interpretation and preserve source/review boundaries. Validate story-start, all-stories playback across guide boundaries, Previous/Next, audio completion, refreshable current-chapter URLs, finish/return behavior, mouse and keyboard region selection, reduced motion, and compact layouts.
