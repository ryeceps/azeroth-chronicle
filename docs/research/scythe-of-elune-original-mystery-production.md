# The Scythe of Elune — production record

**Delivery label:** complete illustrated research story after the recorded transcript, audio, asset, and playback checks pass. **StoryGuide:** `scythe-of-elune-original-mystery-guide`. **StoryTour:** `classic-to-wrath`, order 8, between The Defias and the Unsent Letter and Karazhan. **EraTour:** not included.

## Composition

The StoryGuide has 15 continuous nodes. Nodes 1–14 present the nine-quest Classic Scythe investigation with its recalled journal evidence and final return; node 15 is a separately sourced Jitters testimony from a different Classic quest line. That last scene is explicitly an editorially linked witness strand rather than an asserted quest prerequisite. The tour entry is included in Play all because it has a complete StoryGuide, but remains research data.

The story uses `scythe-of-elune-original-mystery-theater`, an illustrated relational worldspace. Its focus points are editorial cast/object anchors, not coordinates in Azeroth. Eleven authored environment images cover materially different settings; reused images appear only where the place and scene fit. A character/group cutout exists for each named witness and significant creature group. The Tome, journal, Scythe, and Jitters's book have separate object art. The Scythe also appears in Velinde's figure art during its relevant recollection.

## Scene inventory

| # | StoryNode | Evidence/action | Environment and matching Classic reference | Visible cast and objects |
| --- | --- | --- | --- | --- |
| 1 | `the-wolf-men-of-howling-vale` | Quest 1022 opens the investigation. | Howling Vale shrine; mossed moon-elf ruin in deep Ashenvale forest. | Melyria, Duskwood worgen ensemble, Tome. |
| 2 | `tome-of-melthandris` | The Tome's remembered account of Velinde's prayer. | Howling Vale shrine and hollow hill. | Velinde holding the Scythe; Tome. |
| 3 | `velindes-disappearance` | Quest 1023 sends the search to Darnassus. | Forest Song and Darnassus Warrior's Terrace; blue-green Ashenvale and pale night-elf stone/tree forms. | Melyria, Thyn'tel. |
| 4 | `the-journal-in-darnassus` | Quest 1038 recovers Velinde's stored journal. | Darnassus Sentinels' bunkhouse; practical timber beneath pale curved city stone. | Thyn'tel, journal. |
| 5 | `the-first-summoning` | Journal testimony describes the weapon's first use. | Felwood frontier; corrupted teal-green forest and ancient twisted growth. | Velinde, worgen ensemble, Scythe. |
| 6 | `orders-no-longer-hold` | The journal says the summoned pack exceeded its keeper's control. | Howling Vale's ruined shrine. | Velinde, worgen ensemble, Scythe. |
| 7 | `search-for-arugal` | Thyn'tel follows the journal's lead to a port handoff. | Darnassus Warrior's Terrace. | Thyn'tel. |
| 8 | `the-black-osprey` | Quest 1040's ledger is used as a passage record. | Ratchet; dry Barrens shore, wooden goblin harbor and cranes. | Wharfmaster Dizzywig. |
| 9 | `ruzzgot-remembers` | Quest 1041 records a caravan recollection. | Booty Bay; humid jungle inlet, wood stilt harbor and ship masts. | Caravaneer Ruzzgot. |
| 10 | `daltrys-records` | Quest 1042 reports no inn record and refers the search onward. | Darkshire Town Hall; timber civic interior under cool Duskwood light. | Clerk Daltry. |
| 11 | `the-carevin-lead` | Carevin identifies Roland's Doom as the search site. | Duskwood home and mine threshold. | Jonathan Carevin. |
| 12 | `the-mound-at-rolands-doom` | Quest 1043 delivers Velinde's unresolved testimony. | Roland's Doom; narrow timber-braced mine passage and earth/stone. | Velinde as a remembered voice, worgen ensemble; no Scythe is staged as recovered. |
| 13 | `carevin-contains-the-threat` | Carevin states a containment response, not a cure. | Carevin home and Roland's Doom. | Jonathan Carevin. |
| 14 | `answers-return-to-darnassus` | Quest 1044 returns the report to Darnassus. | Darnassus Warrior's Terrace. | Thyn'tel. |
| 15 | `jitters-book-from-svens-farm` | Independent item 2161 account ends with Jitters's uncertainty. | Sven's farm barn with a visual inset of Roland's Doom. | Jitters, worgen ensemble, Book from Sven's Farm. |

Each StoryNode contains its source-linked event, selected entities/locations, an authored camera, and a deterministic map-state action. The stage remains useful with text alone and has no exact geographical coordinates. The story guide is independently playable and the `/tours/classic-to-wrath` entry participates in the ordered Classic-to-Wrath playlist; no EraTour nodes are changed.

## Production records and gates

- Research sources: 13 locators. Scene records: 15 nodes, 15 events, 15 claims, per-scene citations and map states. Cross-record validation is performed by the normal generated-data checks.
- Voice: generated after transcript stabilization for all 15 nodes with the repository's guided-voiceover script. The story data records the audio path, measured duration, voice identifier, transcript hash, and provenance manifest.
- Visual provenance and node-to-asset bindings: `docs/research/scythe-of-elune-visual-assets.json`.
- Research boundaries and evidence evaluation: `docs/research/scythe-of-elune-original-mystery-research.md`.
- Human review remains required for original-client capture, claim/source sign-off, area/NPC/creature comparison, and audio audition. The story and assets remain `research`.

## Verification (2026-10-02)

- `pnpm generate:data`, `pnpm check`, and `pnpm build` passed. The check completed with 24 Vitest files and 78 tests passing; structured lore validation passed for 3,204 records.
- The complete Playwright run finished with 52 passed, 2 skipped, and no failures. StoryTour desktop/phone playback, all 15 Scythe scenes at 1920×1080 and 390×844, and the Classic-to-Wrath placard-to-story handoff passed.
- All 24 optimized WebP scene, cast, group and object assets are wired to nodes and hash-verified. Thirteen transparent cutouts retain a non-opaque alpha channel. Fifteen voice files and manifest records are present.
- Screenshot paths are listed in `docs/research/scythe-of-elune-visual-assets.json`; generated screenshots are under `output/scythe-of-elune-visual-review/` and are kept out of the Git changeset.
- Human original-client comparison, claim/source approval, and audio audition remain open; all story data remains `research`.
