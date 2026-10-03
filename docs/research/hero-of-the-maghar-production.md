# Hero of the Mag'har production ledger

Status: research. Content work under implementation-plan Phases 4 (guided story), 5 (sources and causality), and 6 (accessible presentation). Existing StoryGuide, scene interpreter, text-first storyline page, and StoryTour are reused; there is no engine/schema divergence. The new placard follows Karazhan in the independent Classic-to-Wrath tour. `showInEraTourOffshoots` remains false.

## Production decisions

- Fifteen continuous scenes: repeated gathering is compressed, and the unrest/site-witness quests share one node while retaining both claims and citations.
- The Horde quest chain is presented from its own perspective. Prerequisite branches remain distinct; no singular adventurer is asserted to have taken every optional branch.
- Worldspaces and locations use relational story-theater anchors. They are editorial scene composition, never latitude/longitude, surveyed coordinates, or a measured travel path.
- Present-day Nagrand and the Third War recollection use separate map states and separate background art. The latter is labeled as a flashback in both title and scene caption.
- All claims, sources, events, citations, characters, maps, nodes, and StoryTour entry remain `research` pending human review.
- Environmental assets change at each meaningful place or historical state. Nagrand, Garadar, Oshu'gun, the ancestral grounds, Auchenai Crypts, and Demon Fall Canyon have dedicated art. Shattrath, Orgrimmar, Thrall, Grom, Mannoroth, and A'dal reuse compatible research assets from their existing stories.
- New cast art is wired into rendered `mapFigure` records and each relevant node. No generated image substitutes for a claim about exact costume, architecture, or geography.

## Scene and claim inventory

Each node uses its own deterministic `set_map_state` action. The source-linked event and claim are listed below; citations are attached to the claim and stored as individual records with the `-citation-<n>` suffix. Per-image build traits and visual review gates are in [the asset ledger](hero-of-the-maghar-visual-assets.json).

| # | StoryNode | Historical change | Map state / environment | Cast rendered | Event / Claim | Evidence and uncertainty |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `hero-of-the-maghar-story-garadar-burden` | Garrosh's shame frames the inquiry. | `hero-of-the-maghar-garadar-scene` / Garadar | Garrosh, Mag'har ensemble | `hero-of-the-maghar-garadar-burden-event` / `hero-of-the-maghar-garadar-burden-claim` | Greatmother quest; Blizzard retrospective; date unknown. |
| 2 | `hero-of-the-maghar-story-greatmother-counsel` | Geyah prepares the seeker and points to the ancestors. | Garadar scene / Garadar | Geyah, Garrosh, Mag'har ensemble | `hero-of-the-maghar-greatmother-counsel-event` / matching claim | Material gathering compressed; no permanent spirit sight asserted. |
| 3 | `hero-of-the-maghar-story-mother-kashurs-counsel` | Mother Kashur opens a listening inquiry. | `hero-of-the-maghar-ancestral-scene` / Ancestral Grounds | Mother Kashur, ancestors | `hero-of-the-maghar-mother-kashurs-counsel-event` / matching claim | Quest locator; site composition approximate. |
| 4 | `hero-of-the-maghar-story-ancestors-walk-south` | Restless reports across named sites converge on Oshu'gun. | `hero-of-the-maghar-nagrand-scene` / Nagrand | Mother Kashur, ancestors | `hero-of-the-maghar-ancestors-walk-south-event` / matching claim | Both ancestor quests cited; not a surveyed route or claim that every spirit left. |
| 5 | `hero-of-the-maghar-story-oshugun-calls` | The pilgrimage reaches Oshu'gun. | `hero-of-the-maghar-oshugun-scene` / Oshu'gun | Ancestors, K'ure | `hero-of-the-maghar-oshugun-calls-event` / matching claim | Named destination; exact interior unknown. |
| 6 | `hero-of-the-maghar-story-kure-reveals` | K'ure attributes the danger to a fading Light and rising Void. | Oshu'gun scene / Oshu'gun | K'ure, ancestors | `hero-of-the-maghar-kure-reveals-event` / matching claim | Naaru testimony, not omniscient narration. |
| 7 | `hero-of-the-maghar-story-adal-answers` | A'dal directs the inquiry to Auchindoun. | `hero-of-the-maghar-shattrath-scene` / reused Shattrath | A'dal | `hero-of-the-maghar-adal-answers-event` / matching claim | Quest dialogue paraphrased; travel path unknown. |
| 8 | `hero-of-the-maghar-story-dore-explains-cycle` | D'ore describes the Light/Void cycle. | `hero-of-the-maghar-crypts-scene` / Auchenai Crypts | D'ore | `hero-of-the-maghar-dore-explains-cycle-event` / matching claim | Attributed to D'ore; crypt layout interpretive. |
| 9 | `hero-of-the-maghar-story-soul-mirror` | The Soul Mirror exposes a bounded group of darkened spirits. | Crypts scene / Auchenai Crypts | D'ore, ancestors | `hero-of-the-maghar-soul-mirror-event` / matching claim | Quest item and objective; not every ancestor is saved. |
| 10 | `hero-of-the-maghar-story-return-to-garadar` | The report returns to Geyah. | Garadar scene / Garadar | Kashur, Geyah, Mag'har ensemble | `hero-of-the-maghar-return-to-garadar-event` / matching claim | Adjacent quest handoff summarized. |
| 11 | `hero-of-the-maghar-story-geyah-sends-to-garrosh` | Garrosh remains unable to hope or accept leadership. | Garadar scene / Garadar | Geyah, Garrosh | `hero-of-the-maghar-geyah-sends-to-garrosh-event` / matching claim | Inconsolable Chieftain; no later politics. |
| 12 | `hero-of-the-maghar-story-garrosh-confession` | Geyah recognizes Thrall as her grandson and sends a message. | Garadar scene / Garadar | Geyah, Garrosh, Mag'har ensemble | `hero-of-the-maghar-garrosh-confession-event` / matching claim | There Is No Hope; original cutscene and removed-quest history need client comparison. |
| 13 | `hero-of-the-maghar-story-message-to-thrall` | Thrall learns his grandmother is alive and returns. | `hero-of-the-maghar-orgrimmar-scene` / reused Orgrimmar | Thrall | `hero-of-the-maghar-message-to-thrall-event` / matching claim | Removed original TBC continuation; no route or duration asserted. |
| 14 | `hero-of-the-maghar-story-flashback-demon-fall` | Thrall recalls Grom's last battle and sacrifice. | `hero-of-the-maghar-memory-scene` / Demon Fall Canyon memory | Thrall, Grom, Mannoroth | `hero-of-the-maghar-flashback-demon-fall-event` / matching claim | Distinct Third War memory; present-day Garrosh and Geyah are staged after the flashback; Chronicle page and exact client scene remain open. |
| 15 | `hero-of-the-maghar-story-garrosh-name-restored` | Garrosh's view of his father changes; the original questline closes at Geyah. | Garadar scene / Garadar | Garrosh, Thrall, Geyah, Mag'har ensemble | `hero-of-the-maghar-garrosh-name-restored-event` / matching claim | Original TBC ending; later Garrosh history excluded. |

## Data wiring and access

- `data/stories/hero-of-the-maghar.research.json`: 15 ordered StoryNodes, continuous previous/next graph, transcript and map-state action per scene.
- `data/storylines/hero-of-the-maghar.research.json`: text-first Storyline record, four editorial chapters and explicit research boundary.
- `data/story-tours/classic-to-wrath.research.json`: one playable Outland placard after Karazhan, authored in the expansion collection only.
- `data/worldspaces/hero-of-the-maghar-theater.research.json`, GeoJSON, 8 map states and relational spatial states: scene anchors are editorial and `geographicCertainty: unknown`.
- `data/sources`, `data/citations`, `data/claims`, and `data/events`: narrow source trail for each consequential beat.
- `data/entities` and `public/images/storylines/hero-of-the-maghar`: seven new distinct representations and six original scene environments. Reused cast/background art remains in its existing asset paths.
- Story playback follows the existing standalone guide, transcript, previous/next, reduced-motion, return, and collection playback paths. No React branch or EraTour membership was added.

## Verification record

## Verification record — 2026-10-03

- `pnpm generate:data`, `pnpm check`, and `pnpm build` passed. The check run passed all 83 unit tests across 24 files and validated 3,762 structured records. The build emitted the existing Vite notice for bundles over 500 kB; output was produced successfully.
- Three focused Playwright tests passed: every one of the 15 scenes at desktop 1920×1080 and phone 390×844; the Classic-to-Wrath marker opens playback; Play All advances from Karazhan into Mag'har. Both 15-scene traversals had zero page errors.
- All 30 visual captures are in `output/hero-of-the-maghar-visual-review/{desktop,phone}/`. Environment images loaded above 500 pixels wide, each cast image above 256 pixels, figures stayed inside the map viewport, and the phone traversal had no horizontal overflow. Full-size Garadar, Auchenai Crypts, and Demon Fall memory scenes and both 15-image contact sheets were inspected. Relational figure-focus rings were removed because they implied geographic targets at editorial staging anchors.
- Audio: 15 repository-backed MP3 tracks total 614,675 ms (10:14.7) and 7,391,331 bytes. Tests verify the audio file hashes, narration fingerprints, durations, and node metadata. No human pronunciation/performance audition was performed.
- The visual asset ledger hashes, dimensions, byte sizes, transparency metadata, generated PNG provenance filenames, reconstructed prompt briefs, node wiring, and recognizable TBC area traits were checked. The exact image-generation prompt text was not retained, so ledger prompt fields are explicitly labeled reconstructions rather than verbatim prompts.

## Human review that remains open

Source pages are locators, not primary original-client evidence. Human review must capture the original TBC build, the removed follow-up quests and cutscene, exact dependency branches, Chronicle edition/page locators, side-by-side likeness against each TBC location and character model, and narration pronunciations. The original TBC and Chronicle comparisons remain open; this delivery stays at the research level and does not claim canon approval.
