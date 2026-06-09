# HYROX50 Static Site Release Checklist

## Automated Verification

- [x] TypeScript passes
- [x] All tests pass
- [x] Expo dependency compatibility check passes
- [x] Production web export passes with the `/Hyrox50` base path
- [x] Secret scan finds no credentials
- [x] Dependency audit has no high or critical vulnerabilities

## Privacy And Security

- [x] Site contains no accounts, forms, analytics, AI, or persistence
- [x] Site contains no credentials or private health information
- [x] GitHub Pages workflow uses least-privilege permissions
- [ ] GitHub Actions references are pinned to reviewed immutable commit SHAs
- [x] Build uses the committed lockfile through `npm ci`
- [x] Training-plan data is schema-validated before rendering

## Manual Product QA

- [ ] Day 1 and final day content checked
- [ ] Previous Day and Next Day navigation checked
- [ ] Jump to Today checked before, during, and after plan dates
- [ ] Browse All Days selection checked
- [ ] Mobile and desktop layouts checked
- [ ] Console checked for relevant errors or warnings
- [ ] GitHub Pages deployment checked at the public URL

## Current Verification Notes

- TypeScript, 22 tests across 6 suites, and a fresh production export passed on
  June 7, 2026 after independent QA remediation.
- Secret scan found no credential patterns.
- `npm audit --audit-level=high` passed. Ten moderate transitive Expo build-tool
  advisories remain; npm's proposed automated fix is an unsafe Expo major
  downgrade and was not applied.
- Expo dependency compatibility check passed.
- Workflow permissions are scoped per job. Action pinning remains open because
  trusted immutable SHAs were not available from local context.
