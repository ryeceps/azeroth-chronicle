# Browser acceptance runtime

This Phase 6 hardening change retains all browser acceptance and renderer-budget assertions in the full suite. At the user’s request, normal CI verifies a representative smoke sample. No runtime application or lore data changes are needed.

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

## Routine CI scope

Normal pull-request and main CI runs eight tagged smoke scenarios: archive search/shareable detail, guided era entry, single-era completion, real audio handoff between eras, phone playback controls, storyline placard/playback entry, and both Linux dossier visual baselines. Source checks, unit tests, and lore validation still run in full.

Run pnpm test:e2e:smoke for this sample. The unchanged full test inventory remains available through pnpm test:e2e and the CI workflow’s full_browser_suite manual input; it includes all story traversals and the isolated renderer benchmark. Smoke success does not certify every story’s visual composition. Long full Linux trials were superseded when the user requested sampled verification.

## Verification

- pnpm check: 24 unit files, 78 tests, and 3,204 validated records passed.
- pnpm build passed.
- Initial local capture/config run: 50 passed, 2 Linux-only skips, 1 phone layout race failed, and the dependent renderer test did not run (6m 24s). After polling the same layout condition, both Quel’Delar tests and the isolated renderer test passed (33.9s).
- Final local profile: Windows, Chromium, CI mode, two acceptance workers, isolated renderer worker, 1920x1080 default viewport, optional review captures disabled: **52 passed, 2 Linux-only visual skips, 0 retries, 5.0 minutes**, including the 90-frame renderer benchmark.
- Final Linux CI execution and timing evidence is linked from [PR #35](https://github.com/ryeceps/azeroth-chronicle/pull/35). Compare the browser step against the 1,733-second Linux baseline, rather than treating Windows timing as a Linux result.

- Routine smoke verification, same Windows CI-mode profile: **6 passed, 2 Linux-only visual skips, 0 retries, 12.1 seconds**. The eight-scenario smoke sample is now the normal CI command; the 54-scenario suite remains available on demand.

- Linux smoke trial 37085989106: six behavior scenarios passed in a 32.4-second run; two visual tests failed because the new project name changed default snapshot paths. An explicit snapshotPathTemplate now preserves the existing era-dossier-linux.png and battle-dossier-linux.png baselines without regenerating them.
