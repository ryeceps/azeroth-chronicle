# Standalone storyline playback

The Scepter implements Phase 4/5/6 content and the reusable playback prerequisite in the storyline template. The existing Storyline collection remains the library/text route. Its optional `storyGuideId` selects an existing StoryGuide through `LoreRepository` using `/map?era=<primary-era>&tour=storyline&storyline=<slug>`.

The map and StoryGuidePanel use that validated link instead of replacing the era's guide. Unknown or mismatched links return to the library. Completion and exit return to the story page. Story-specific map states are allowed only when referenced by the selected guide. A storyline can use a dedicated relational worldspace for illustrated scenes; positions there communicate cast relationships, not invented geographic coordinates. Historical prologues retain their era labels in the text and scene titles while playback remains one continuous sequence attached to the main era.

The Scepter uses original vector illustrations in a relational theater with regional landscape captions. It does not fabricate precise routes between remote quest destinations. Reuse the same action interpreter, camera, transcript, optional audio and accessible controls as era tours. Keep all lore at research status pending human review of original-client evidence and interpretations.
