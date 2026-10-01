# Karazhan: The Master’s Key and Nightbane

Status: research.

## Candidate and scope

- Candidate ID / slug: `karazhan-masters-key-and-nightbane`
- Primary era / subperiod: Era 8, The Age of Adventurers / original The Burning Crusade quest era.
- Linked prologue eras: none. The Black Morass scene is a historical time-memory within a TBC quest, not a linked prologue itinerary.
- Historical ending and excluded later material: return Nightbane’s essence sample to Alturus. Excludes Keanna’s Log, Legion’s Return to Karazhan (7.1), and outcomes after Wrath.
- Edition, patch/build and faction/class variants: target original TBC quest state, patch 2.0.3 through 2.4.3; both factions may take the key line. The present guide documents original-client capture as an open gate.
- Existing records and overlap: reuses Era 8, existing Medivh, StoryGuide/StoryTour engine, story theater renderer, voice manifest and the Classic-to-Wrath tour. Does not retell the separate Karazhan access quest in another candidate or add content to EraTour.
- Visual reference edition/build: TBC era 2.0.3–2.4.3 area identity. Deadwind Pass/Karazhan, the original Dalaran crater, Shattrath, three Outland dungeons, Black Morass memory, Karazhan library/terrace, Area 52, Shattered Halls and Sethekk Halls each have recorded traits in the [visual asset ledger](karazhan-visual-assets.json). In-game comparison remains open.

## Historical question and evidence

**Question:** Can the Violet Eye reopen Karazhan and learn what the tower’s remembered past—and the remains of Arcanagos—may reveal about Medivh’s power?

The two quest paths are distinct. The Master’s Key attunement solves an access problem. The Nightbane chain is a later Violet Eye research operation that uses Medivh’s Journal, Kalynna’s expertise and Arcanagos’s remains. The story explicitly marks their connection as editorial. Alturus’s reading of a faint demonic echo, Khadgar’s account of moved fragments and Alturus’s theory about Medivh’s essence remain attributed rather than presented as omniscient fact.

Primary sources presently available: Blizzard’s official TBC Classic attunement overview. The detailed quest dialogue and chain order come from secondary quest/wiki mirrors listed in the [production ledger](karazhan-production.md). Original TBC client capture, the complete released journal interaction and direct source review are still required for promotion.

## Inciting problem, turning points and resolution

Alturus’s paired investigations produce a troubling report → Cedric locates Khadgar → Khadgar explains and recovers his three-part key → Medivh enables it in the Black Morass past → Khadgar receives it back. In a separate path, Alturus seeks the journal → three Violet Eye agents point the seeker toward the Shade of Aran → the Master’s Terrace memory shows Arcanagos’s burning flight → Alturus’s hypothesis leads to a bone fragment and Kalynna → two books satisfy her request → Nightbane is raised and defeated → Alturus receives an essence sample. The TBC quest ends on research, not a final explanation.

## Proposed chapters and runtime

- **Restore the Master’s Key:** Alturus’s reports lead to Khadgar. Three fragments must be recovered from Outland before Medivh can enable the restored key in a historical memory. The key chain ends when it is returned to Khadgar. Scenes 1–10.
- **The Journal and its Memory:** The Violet Eye begins a separate investigation for Medivh’s Journal. Wravien, Gradav and Kamsis direct the search to the Shade of Aran; the book then reveals a memory of Medivh and Arcanagos on the Master’s Terrace. Scenes 11–14.
- **From Charred Bone to Nightbane:** Alturus’s hypothesis sends the seeker to Kalynna. Her heroic-dungeon request supplies materials for the urn, Nightbane is raised from Arcanagos’s remains, and the chain ends with an essence sample for further study. Scenes 15–18.

18 nodes; 1239 transcript words before voice timing. The modestly expanded node count reflects two independently gated quest paths, three geographically distinct fragment dungeons, a time-memory, a journal memory and the heroic-dungeon request; it does not narrate farming or collection quotas as history.

## Engine, assets and review

Content work only. Existing static Vite/React, LoreRepository, Zod, Storyline, StoryGuide and StoryTour contracts cover the experience. No architectural decision or reusable engine prerequisite was needed.

Human review needed: TBC client/build and quest text; journal/Nightbane original release evidence; precise chronology and the editorial join; Atiesh’s appearance and time-state; area resemblance for each illustration; source and claim approval; narration pronunciation; and audio audition. No record is marked reviewed or published.
