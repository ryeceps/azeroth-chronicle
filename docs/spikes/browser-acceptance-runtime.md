# Browser acceptance runtime

This Phase 6 hardening change preserves all browser acceptance and renderer-budget assertions. No runtime application or lore data changes are needed.

## Baseline

Production main c8576d8, Ubuntu 24.04 GitHub runner, Chromium, one worker, continuous retained traces and video:

- [CI run 37071196176](https://github.com/ryeceps/azeroth-chronicle/actions/runs/37071196176) passed all 54 browser tests.
- Browser step: 2026-10-02 22:13:55–22:42:48 UTC, **1,733 seconds (28m 53s)**.
- Checks: 35s; production build: 11s; Chromium installation: 23s.
- No retries occurred. Desktop story traversals repeatedly took 49–141s; phone equivalents typically took 13–25s. Continuous capture of large illustrated scenes is expensive even when the files are discarded after a pass.

## Changes and coverage

- Capture a trace on the first retry and keep failure screenshots, rather than capturing traces and encoding video for every passing chapter.
- Use two CI acceptance workers, then run the unchanged 90-frame renderer benchmark in a dependent one-worker project to avoid competing WebGL contexts during measurement.
- Reuse the production build already validated by CI. Normal local runs still build automatically.
- Validate pull requests and main pushes without duplicate feature-branch push runs; cancel superseded runs of the same pull request or ref.
- Keep every scene traversal, transcript, loaded-image check, layout assertion, audio test, and Linux visual baseline. Human review contact sheets remain enabled locally and can be requested in CI with PLAYWRIGHT_VISUAL_REVIEW=1. Successful CI runs no longer create and discard these unasserted captures; the screenshot byte-size assertion remains active.
- Poll the unchanged Quel’Delar phone collision limits until layout settles. Removing continuous capture exposed an immediate geometry assertion racing projected layout after image decode.
- Allow PLAYWRIGHT_PORT to isolate browser servers in simultaneous checkouts.

## Verification

- pnpm check: 24 unit files, 78 tests, and 3,204 validated records passed.
- pnpm build passed.
- Initial local capture/config run: 50 passed, 2 Linux-only skips, 1 phone layout race failed, and the dependent renderer test did not run (6m 24s). After polling the same layout condition, both Quel’Delar tests and the isolated renderer test passed (33.9s).
- Full local browser suite with optional review captures and equivalent fresh Linux CI measurement pending.
