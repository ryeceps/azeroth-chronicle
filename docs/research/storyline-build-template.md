# Agent guide: building a complete questline story

**Status:** production instructions for research content; no automatic approval of lore. **Historical scope for the current slate:** through the end of Wrath, before Cataclysm prelaunch changes. Start from the [30 candidate packets](questline-story-candidates.md), the [era authoring standard](../eras/README.md), `AGENTS.md`, and [implementation plan](../IMPLEMENTATION_PLAN.md).

## 1. Preflight and architecture

Classify the task as **era content work** under Phase 4 (continuous data-driven guided story), Phase 5 (claim-level causality and sources), and Phase 6 (accessible presentation). Identify the concrete acceptance criteria before edits. Read the current types, Zod schemas, repository, route selectors, and one completed era guide/node sequence; record their paths and IDs in the packet.

On the main baseline inspected for this guide, `StoryGuide` and `StoryNode` exist in `src/domain/types/lore.ts`; authored guides live in `data/stories`. There is no standalone `Storyline` domain collection on that baseline. A separate proposed storyline-library PR is not proof that it has landed. Recheck the target branch before implementation.

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

| Node | Historical action and result | Era/map state/worldspace | Cast and representation | Camera | Highlighted records | Visual actions | Provenance/uncertainty | Entry/exit state |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `<story-id>-<beat>` | One supported visible change | Existing IDs or justified new state | Deliberate actor art and accessible text | Supported regional framing | Entity/event/battle/location IDs | Existing interpreter actions | Claim/citation IDs | Deterministic scene state |

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

**Completion labels:** candidate = source leads; research packet = captured evidence and unresolved claims; preview = visible outline; complete research story = full transcript, records, required visuals, navigation and requested audio verified; reviewed/published = explicit human approval. Opening a PR does not change these labels. In the PR, state the exact label, content/engine split, verification and remaining review work.
