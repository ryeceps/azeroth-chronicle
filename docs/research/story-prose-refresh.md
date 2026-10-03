# Storyline prose and narration pass

This is Phase 4 content work: continuous historical telling through the existing StoryGuide, with text-first access and matching optional audio. The audit covers all 29 guides (465 nodes), all 36 Storylines, and the reusable authoring prompt. No lore record is promoted beyond its existing research status.

The prose uses the original Tolkien-esque era voice: landscape, remembered lives, loss, choices, and consequences. Quest walkthroughs and editorial explanations move out of public narrative fields. Playable text-first chapters reproduce their guide's narrative in existing chapter groups. Preview chapter outlines use restrained prose about their existing premises; their original research instructions remain in `reviewNote`, and they remain previews without new playback or recordings.

## Evidence and interpretation boundaries

The source, citation, claim, event, scene, actor, camera and visual-action records remain the basis of the telling. The accompanying `story-prose-editorial-notes.json` retains the earlier transcript's source and gameplay caveats for editorial comparison. Existing production packets and Storyline review notes remain authoritative for original-client capture and human review.

| Story | Boundary retained outside the spoken telling |
| --- | --- |
| Akama | Aldor/Scryer openings are alternatives. Entry prerequisites do not cause the conspiracy. Hyjal is a past memory. Akama's intended use of the phylactery is not a guaranteed result. |
| Champion of the Naaru | Mercy, Strength and Tenacity are parallel requirements; Strength has two targets. Title eligibility is separate, patch-sensitive, and involves the separate Serpentshrine path. The story ends at the Tempest Keep threshold. |
| Cipher of Damnation | The sons' searches are parallel; narration order is editorial. Oronok's recollection is attributed. Ar'tor remains dead. The later level-70 trials are separate. |
| Darrowshire | The Annals' Second War date conflicts with Third War placement. Davil and Marduk have naming variants. Objective counts are not population counts. Chromie's spell revisits a remembered battle; its permanent timeline effect remains unresolved. |
| Defias | Informants' reports remain attributed. VanCleef's death does not prove the Brotherhood's extinction. The recovered letter's full contents and the secret meeting's precise dialogue are not supplied. The handoff to Katrana does not resolve the court's future. |
| Veiled Blade | Faction introductions and haunted-companion targets are alternatives. All four companion histories may be remembered without assigning all their encounters to one traveller. Valthalak's promise is temporary, not restoration of the company. |
| Fallen Hero | Eighteen bound servants and nineteen men are conflicting source counts. The lieutenants' confrontations are separate. Trebor intends to destroy the returned ward; its destruction is not shown. |
| Hero of the Mag'har | This is the Horde viewpoint. K'ure and D'ore give attributed explanations of the cycle. Grom's last battle is a Third War memory. Garrosh's later history is outside the ending. |
| Karazhan | The key restoration and journal search are distinct investigations. The Black Morass is a past encounter. Khadgar's explanation of the submerged fragment and Alturus's essence hypothesis remain uncertain. The final sample does not explain all of Medivh's magic. |
| Missing Diplomat | Original Classic and patch 2.3 investigations remain separate evidence. Manacles establish a prisoner, not an independently identified king. Alcaz's inhabitants are not a proven alliance. Jaina suspects an unnamed powerful patron; Katrana's objection does not itself identify that patron. Varian is not rescued. |
| Netherwing | Rescue does not free every drake or conquer the fortress. Murkblood testimony is a separate branch and its buyers are suspected, not confirmed. Repeatable reputation labor has no invented duration. The final drake companion is a choice, not one universal named mount. |
| Quel'Delar | Random loot starts play, not a named historical find. Faction/class endings are alternatives. Thalorien's later memory does not revive him. No named adventurer becomes the canonical heir. |
| Ras | Leonid's transformation scene is his recollection. The room locator remains unverified. Mortality is limited to the encounter, with no asserted permanent cure or freed soul. Marduke's number is his declaration, not a census. |
| Scepter | The shard journeys have different outcomes. The shared war effort is separate from the key's recovery. Gong eligibility and later recognition have different gameplay conditions. |
| Scythe | Velinde's journal, dockside recollections and Jitters's separate testimony are attributed. Jitters's causal belief remains a guess. No later bearer or complete cause of Duskwood's worgen is supplied. |
| Stormwind | Alliance and Horde follow separate roads; no single traveller combines both. The final company remains unnamed. |
| Raven's legacy | Clintar's suspected outside presence is not proven by his dream. The book's prophecy is attributed. The three shrines remain distinct. Anzu's defeat does not guarantee permanent absence or explain every Dream threat. |
| Tirion and Taelan | The two source quests titled Of Love and Family remain distinct evidence. Keepsake art is interpretive. Taelan dies; Tirion's vow is a future purpose rather than its later fulfillment. |
| Yeh'kinya | The temple fight is against an avatar, not the later physical Hakkar. Ironboot interprets the tablets. The wind-serpent escape is a secondary report. The ending requests aid at Yojamba, before the later campaign's outcome. |

## Verification contract

- Narrative regression coverage excludes gameplay and editorial framing from public story prose, while supporting citations and review notes retain it.
- Playable text-first chapters must equal the guide's ordered narration when joined.
- Every node's MP3, transcript hash, byte hash, metadata and duration must agree with the audio manifest. Changed MP3s must decode successfully.
- Run `pnpm check`, `pnpm build`, and the relevant storyline/audio desktop and phone browser coverage. Record the final counts and results in the PR.

An earlier set of tests required gameplay caveats in narration. That conflicts with the requested historical voice. Those checks now verify the same boundaries in review notes and keep their source, scene and media assertions; narrative checks protect the corresponding in-world uncertainty.

## Final local verification

The audit revised 307 spoken passages and regenerated exactly their 307 MP3s. The other 158 recordings are unchanged. All 465 transcript and audio hashes agree, and all 307 changed MP3s decode without errors. Existing source links, scenes, cast and actions are preserved; silent-reading timers follow the revised passage lengths.

The 44 desktop/phone browser scenarios passed across the 19 playable storylines and tour-library behavior. The final source, type, unit, lore-data and production-build results are recorded in the pull request.
