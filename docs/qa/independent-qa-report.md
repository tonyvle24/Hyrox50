# HYROX50 Independent QA Report

**Review date:** June 7, 2026  
**Scope:** Approved simplified hosted-site specification, implementation plan,
current source, tests, generated plan behavior, accessibility/usability,
security/privacy, GitHub Pages workflow, dependencies, and existing production
export.

## Release Recommendation

**Do not publish the current training plan.** The application shell is small,
readable, and close to the approved product shape, but the generated schedule
contains a critical duplicate 50K race prescription and does not implement the
promised event tapers or post-HYROX recovery. These are release-blocking content
and safety defects.

## Findings

### Critical: The plan prescribes a 31-mile "BMW Dallas 50K Race Day" twice

**References:** `src/plan/templates.ts:132-135`,
`tests/plan/trainingPlan.test.ts:27-30`

`longRunMiles` has 26 entries and ends with `31`. The lookup clamps every week
after week 26 to that final entry. As a result:

- Sunday, December 6, 2026 (week 26) becomes a 31-mile "BMW Dallas 50K Race
  Day."
- Sunday, December 13, 2026 (week 27) becomes the same 31-mile race day again.

The current race-day test only confirms that December 13 has a title containing
`50K`; it does not require exactly one 50K race day or reject one on the wrong
date.

**Impact:** Tony is instructed to complete a full 50K one week before the actual
50K, then repeat it on race day. This is unsafe and directly violates the fixed
race-date requirement.

**Recommended fix:** Make the December 13 race an explicit date override, as the
HYROX race is. Give December 6 an intentional taper long run. Add tests requiring
exactly one 50K race-day record and requiring its date to be December 13, 2026.

### High: HYROX taper, post-HYROX recovery, and 50K taper are not implemented

**References:** `src/plan/buildPlan.ts:16-35`, `src/plan/phases.ts:3-9`,
`src/plan/templates.ts:49`, `src/plan/templates.ts:72-73`,
`src/plan/templates.ts:96`, `src/plan/templates.ts:110`,
`src/plan/templates.ts:128`, approved spec `:174-175`

Except for the exact HYROX date, the generator always selects the normal weekday
template. Phase names do not change those prescriptions. Concrete examples:

- Monday, November 16: 5-set/round HYROX skill work.
- Tuesday, November 17: Tony runs 6 miles plus the joint engine session.
- Wednesday, November 18: HYROX race.
- Thursday, November 19: a 5-round HYROX circuit immediately after the race.
- Monday through Thursday of 50K race week retain maximum-volume weekday work.
- Saturday, December 12: Tony is prescribed an 8-mile steady run one day before
  the 50K.

No post-HYROX recovery builder exists, despite being required by the approved
specification and implementation plan.

**Impact:** The schedule does not preserve recovery or race readiness and may
increase fatigue or injury risk around both events.

**Recommended fix:** Add explicit date-aware taper and recovery schedules. At
minimum, cover HYROX race week, several post-HYROX recovery days, and the final
50K taper week. Add assertions for representative dates and maximum allowed
volume immediately before and after each race.

### High: Existing validation tests prove shape, not training correctness

**References:** `src/plan/schemas.ts:5-45`,
`tests/plan/trainingPlan.test.ts:5-31`, `tests/plan/templates.test.ts:13-39`

The schema validates nonempty strings and the tests validate record count,
consecutive dates, generic activity fields, and the presence of race titles.
They do not validate:

- Exactly one record for each race title.
- Recovery/taper prescriptions around fixed events.
- Phase-appropriate volume.
- Recovery-week placement.
- Complete HYROX station coverage in simulations.
- Realistic race-week workload.

This allowed both release-blocking training-plan defects above to pass all 13
tests.

**Recommended fix:** Add schedule-invariant tests around fixed events, taper
windows, recovery windows, race uniqueness, and representative phase
prescriptions. Treat these as deployment-blocking plan validation.

### Medium: Browse All Days has no close/back action

**References:** `src/screens/DailyPlanScreen.tsx:16-18`,
`src/screens/AllDaysScreen.tsx:10-20`,
`tests/components/AllDaysScreen.test.tsx:5-10`, implementation plan `:316`

Once Browse All Days opens, the only way back to the daily page is to select a
day. There is no close/back control, although the implementation plan explicitly
calls for opening and closing Browse All Days. Browser history is not integrated.

**Recommended fix:** Add a clearly labeled close/back button with an accessible
name, preserve the previously viewed date, and test opening and closing without
changing the selected day.

### Medium: Required day-link boundary behavior is not implemented

**References:** `App.tsx:4-9`, `src/screens/DailyPlanScreen.tsx:14-18`, approved
spec `Error And Boundary Handling`

The selected day exists only in component state. There are no day URLs, no link
parsing, and no invalid/unknown day-link fallback to Day 1. Refreshing or sharing
a viewed future day returns the recipient to their local "today" rather than the
selected day.

**Recommended fix:** Define a static-site-compatible URL contract, such as a
query parameter or hash, parse and clamp it at startup, update it on selection,
and test invalid, before-plan, and after-plan values.

### Medium: GitHub Actions permissions and supply-chain controls need hardening

**References:** `.github/workflows/deploy-pages.yml:8-11`,
`.github/workflows/deploy-pages.yml:18-44`,
`docs/security/threat-model.md:26-35`

The top-level `pages: write` and `id-token: write` permissions are inherited by
the build job, even though only the deploy job needs them. Actions are referenced
by mutable major-version tags rather than immutable commit SHAs. The workflow
also publishes directly from every push to `main`; the threat model's claim that
only reviewed source is published depends on repository branch protection that
is not verifiable here.

**Recommended fix:** Give the build job `contents: read` only and grant Pages/OIDC
permissions only to deploy. Pin third-party Actions to reviewed commit SHAs.
Require pull-request review and passing checks through GitHub branch protection
before allowing changes to `main`.

### Medium: Release checklist overstates current verification

**References:** `docs/security/release-checklist.md:5-18`,
`docs/security/release-checklist.md:30-37`

The checklist marks least-privilege workflow permissions and dependency audit as
complete. The workflow permission scope is broader than necessary. During this
independent pass, `npm audit --audit-level=high --json` could not reach the npm
audit endpoint, so the vulnerability result could not be independently
reproduced.

**Recommended fix:** Correct the workflow permissions, rerun the audit in a
network-enabled trusted environment, and record the command result or CI run
link before release.

### Low: Countdown wording is misleading after HYROX

**Reference:** `src/components/DailyHeader.tsx:18-19`

After November 18, the HYROX countdown is clamped to `0 days to HYROX` for every
remaining day rather than indicating that the event is complete.

**Recommended fix:** Hide the HYROX countdown after race day or display a clear
completed label.

### Low: One direct dependency appears unused

**Reference:** `package.json:17`

`@expo/vector-icons` is installed but has no source import. Removing unused
dependencies reduces bundle/build surface and dependency-review burden.

**Recommended fix:** Remove it if browser QA confirms no implicit requirement.

## Positive Observations

- The app has no accounts, forms, persistence, analytics, AI integration, or
  network API usage in source.
- Secret-pattern scan returned no matches.
- The lockfile root dependency lists match `package.json`.
- `npm ci --dry-run --offline --ignore-scripts` completed successfully.
- Existing `dist/index.html` uses the expected `/hyrox50/` asset subpath.
- Navigation buttons and all-days cards have explicit button roles and accessible
  labels, and primary touch targets have a 50-pixel minimum height.
- The source is compact and the immutable plan is validated at module load.

## Verification Evidence

| Check | Result |
| --- | --- |
| Jest, all suites | PASS: 5 suites, 13 tests |
| TypeScript `tsc --noEmit` | PASS |
| Root dependency/lockfile comparison | PASS: no root dependency differences |
| `npm ci --dry-run --offline --ignore-scripts` | PASS |
| Secret-pattern scan | PASS: no matches |
| Expo dependency compatibility check | NOT REPRODUCED: network access failed with `EACCES` |
| npm high-severity audit | NOT REPRODUCED: npm audit endpoint unavailable |
| Fresh production export | NOT RUN: QA was restricted to read-only commands outside this report |
| Existing export base path | PASS: `dist/index.html` references `/hyrox50/_expo/...` |

## Remaining Manual And Browser QA

Complete these after the release-blocking plan fixes:

- Review the revised schedule with a qualified coach, especially both tapers,
  post-HYROX recovery, long-run progression, and Liz's beginner progression.
- Fresh-export the production site and verify it at the `/hyrox50/` project
  subpath.
- Test iPhone and Android viewport layouts, long workout readability, scrolling,
  and touch targets.
- Test keyboard-only navigation, visible focus, screen-reader headings/labels,
  and color contrast.
- Test Day 1, final day, strength, HYROX circuit/simulation, long run, recovery,
  HYROX race, and 50K race content.
- Test Previous Day, Next Day, Jump to Today, Browse All Days close/back,
  selection, refresh, and shareable/invalid day URLs.
- Verify browser console output, Add to Home Screen behavior, and the deployed
  GitHub Pages URL on both phones.

## Summary

The simplified hosted-site architecture is appropriate and the current shell is
promising, but the generated plan is not ready to use or publish. Fix the
duplicate early 50K, implement real taper/recovery behavior, and strengthen
schedule-invariant tests first. The remaining usability and deployment-hardening
findings should be addressed before the permanent link is treated as production.
