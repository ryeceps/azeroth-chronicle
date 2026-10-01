# Akama and the Black Temple — production record

## Delivery scope

- **Content change:** a separate Age of Adventurers Storyline and 20-node StoryGuide, not inserted into an EraTour or the Era 8 guide.
- **Tour change:** one Classic-to-Wrath StoryTour entry after Karazhan and before the Outland Cipher preview. It uses the existing `story-tour` playback engine and participates in Play all because the guide is complete and voiced.
- **Engine change:** `mapFigure.eraVariants` permits a time-appropriate portrait on one lore entity; the renderer selects the variant from the current spatial state’s era and otherwise uses the existing default. This lets Illidan’s ancient-era portrait remain on the ancient guide while the Outland story shows his TBC form. See [the time-aware figure decision](../decisions/time-aware-character-figures.md).
- **Research status:** new source, entity, location, event, claim, citation, MapState, spatial-state, Storyline and StoryGuide records remain `research`.

## Playback structure

1. **The temple and the hidden plan** — Karabor; faction-specific Baa’ri starts; medallion search; Warden’s Cage; proof of allegiance; Akama and Maiev.
2. **The seer’s warning** — Udalo’s death and clue; Heart of Fury; Akama’s promise to A’dal.
3. **A secret under pressure** — Olum’s discovery and sacrifice; Al’ar ruse; Hyjal historical memory; hostage soul.
4. **Inside the Black Temple** — Xi’ri diversion; Deathsworn rendezvous; Shade of Akama; seers’ gate; Illidan’s defeat.

Every node has an environment MapState, a deterministic `set_map_state` action, a transcript, linked Event and Claim, and Citation records. Scene actor/object art appears through the existing map-figure and contextual visual fields. Play all reuses the same guide and voice assets; it does not duplicate node data.

## Production inventory

- 16 original environment illustrations in the generated source sheet, with 15 place-specific MapStates authored for the story; repeated Baa’ri, Warden’s Cage and Arcatraz moments reuse the matching state.
- Distinct illustrated Akama, Maiev, Illidan’s Outland form, Magtheridon, Oronu, Kael’thas, Udalo, Olum, Kanai, Al’ar, Rage Winterchill, and Shade of Akama.
- Separate group visuals for Ashtongue Deathsworn, Ashtongue Corruptors, and Coilfang naga; separate Naaru visuals for Xi’ri and A’dal.
- Pivotal objects: Tablets of Baa’ri, Medallion fragments, Medallion of Karabor, Heart of Fury, Ashtongue Cowl, and Time-Phased Phylactery.
- The 20-node voice-over uses the repository’s Kokoro generation pipeline and has a transcript/hash manifest. Text remains the authoritative narration; pronunciation and model/costume checks await human audition.
- Every placed figure and object uses an explicitly relational unknown-geography state. Figure layouts are editorial and assert no real route, exact formation, or unsupported co-presence.

See [the visual asset ledger](akama-black-temple-visual-assets.json) for per-file hashes, scene IDs, original prompts, source artifact IDs, reference edition, recognizable area traits, and comparison status.

## Overlap and chronology audit

- The Era 8 guide remains era-history only. This Storyline is an independent quest narrative and does not duplicate Era guide nodes.
- Karabor’s prior history is brief context only; the playable story begins with the TBC quest chain. The Hyjal scene is a labeled past instance, not a claim that the TBC party physically travels into the Third War.
- Baa’ri’s Aldor/Scryer openings are alternatives. Repeated collection and enemy-count mechanics are compressed rather than narrated as a complete set of historical encounters.
- Serpentshrine, Tempest Keep, and Hyjal raid requirements are separated from the motives and causal sequence in Akama’s plan.
- The Cipher of Damnation is a separate Shadowmoon questline and remains a research preview in the StoryTour. No `Hand of A’dal` achievement title is described as an in-world office.
- The ending stops at Illidan’s TBC defeat; no immediate restoration of Karabor or later Legion/Cataclysm outcome is claimed.

## Completion label and remaining review

The product record is a **complete research story** after the transcript, source/claim links, image rendering on desktop and phone, audio files, and navigation checks pass. Its content status remains `research`. Original TBC quest/build capture, visual comparison against the matching 2.4.3 client/models, human lore review, and audio audition remain required before promotion.
