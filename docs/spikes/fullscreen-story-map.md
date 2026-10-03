# Fullscreen story map and anchor audit

Phase 2/6 presentation: the illustrated StoryTour map fills the viewport beneath
compact navigation and a top-right Play All control. Art and markers share one
percentage coordinate box; responsive resizing scales both axes together without
cropping continents. A 1.5% overscan removes the painted outer rim. The illustration
changes aspect ratio with the viewport; it is explicitly interpretive navigation,
not surveyed cartography. No geographic coordinates or guide scenes change.

All sixteen anchors were inspected against the current Outland-v2 illustration.
One representative location is used for each multi-region story:

| Story | Representative anchor | Image percent |
| --- | --- | --- |
| Onyxia | Stormwind, southern Eastern Kingdoms | 57, 63 |
| Scepter | Silithus / Ahn'Qiraj, southwestern Kalimdor | 16, 77 |
| Dungeon Set 2 | Eastern Plaguelands | 66, 36 |
| Fallen Hero | Blasted Lands, southeastern Eastern Kingdoms | 63, 70 |
| Tirion and Taelan | Western Plaguelands | 62, 32 |
| Darrowshire | Eastern Plaguelands | 70, 38 |
| Defias | Westfall | 55, 73 |
| Scythe of Elune | Duskwood | 59, 66 |
| Yeh'kinya | Tanaris coast | 24, 75 |
| Ras Frostwhisper | Scholomance / Western Plaguelands | 63, 40 |
| Karazhan | Deadwind Pass, Azeroth | 64, 64 |
| Akama | Black Temple, southeastern Outland | 91, 83 |
| Cipher | Shadowmoon Valley, southeastern Outland | 86, 80 |
| Missing Diplomat | Theramore coast, Kalimdor | 28, 57 |
| Wrathgate | Dragonblight, southern-central Northrend | 48, 23 |
| Quel'Delar | Icecrown, northern Northrend | 49, 12 |

The source art does not accurately delineate individual zones. These placements
correct wrong-world, offshore and broad north/south errors; they do not certify
exact town positions or promote any lore record from research status.

Reference checks: [Eastern Kingdoms](https://warcraft.wiki.gg/wiki/Eastern_kingdom),
[Blasted Lands](https://warcraft.wiki.gg/wiki/Blasted_Lands),
[Shadowmoon Valley](https://warcraft.wiki.gg/wiki/Shadowmoon_Valley),
[Theramore](https://warcraft.wiki.gg/wiki/Theramore_Isle),
[Icecrown](https://warcraft.wiki.gg/wiki/Icecrown).
Existing storyline records supply the locations and historical edition.

Browser acceptance checks cover 1920×1080, the supplied 1280×720 framing, and
390×844: full viewport coverage, top-right playback, all sixteen rendered anchors
against image pixels, keyboard focus and unobstructed click targets.
