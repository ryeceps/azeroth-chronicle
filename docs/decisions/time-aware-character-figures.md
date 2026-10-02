# Time-aware character figure art

## Status

Accepted for the illustrated research-story renderer.

## Context

A single character can have materially different appearances across eras. The atlas previously stored one `mapFigure` asset per entity. That made a story either reuse an image from the wrong historical period or create a second entity record for the same person. Illidan's ancient-era portrait, for example, cannot represent his Burning Crusade appearance at the Black Temple.

## Decision

Keep the entity and its default `mapFigure` stable. Permit optional `mapFigure.eraVariants`, each keyed by an existing era ID and carrying an image path and optional scale. The map renderer selects the variant for the current spatial state's era and falls back to the default when none matches. The archive and text-first pages continue to use the default portrait until a page has an explicit era context.

Variants remain editorial image choices. They do not create a new person, establish an exact costume, or change the entity's historical locations. Source and human visual review remain recorded on the story asset ledger.

## Consequences

- One lore entity can have distinct, time-appropriate figures in different era scenes.
- A variant's era must resolve to a validated era record.
- Existing records and scenes retain their current image through the fallback behavior.
- No React or atlas behavior branches on a particular character or era ID.
