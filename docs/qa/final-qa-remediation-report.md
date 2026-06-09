# HYROX50 Final QA And Remediation Report

**Review date:** June 7, 2026

## Release Recommendation

No release-blocking findings remain in automated and independent review. The
site is ready for GitHub repository setup and GitHub Pages deployment, with
manual browser/mobile QA still required after the public URL is live.

## Remediated Findings

- Duplicate 50K race day resolved: the plan now contains exactly one BMW Dallas
  50K Race Day on December 13, 2026.
- December 6, 2026 is now a 7-mile long run instead of a duplicated 31-mile
  race.
- HYROX taper added for November 9 through November 17, 2026.
- Post-HYROX recovery added for November 19 through November 22, 2026.
- Final 50K taper added for December 7 through December 12, 2026.
- Schedule invariant tests now cover race uniqueness, taper windows, recovery
  windows, and final-week volume.
- Browse All Days now has a Back to Selected Day control.
- Shareable static day links now use `#day=YYYY-MM-DD`, with invalid links
  falling back to Day 1.
- HYROX countdown now says HYROX complete after race day.
- Unused `@expo/vector-icons` dependency was removed.
- GitHub Pages workflow permissions are scoped per job.
- Security threat model and release checklist now describe the simplified
  public static site.

## Verification Evidence

| Check | Result |
| --- | --- |
| Jest | PASS: 6 suites, 22 tests |
| TypeScript | PASS |
| Expo dependency compatibility | PASS |
| Production web export | PASS: `/Hyrox50` base path |
| High-severity npm audit | PASS |
| Secret-pattern scan | PASS: no credentials found |
| Fresh independent QA pass | PASS: no release-blocking findings |

## Remaining Non-Blocking Work

- Pin GitHub Actions references to reviewed immutable commit SHAs when trusted
  upstream SHAs are available.
- Configure GitHub branch protection so `main` requires review and passing
  checks before publishing.
- Complete manual browser/mobile QA after deployment: Day 1, final day,
  Previous/Next, Jump to Today, Browse All Days, hash refresh/share links,
  iPhone/Android scrolling, console errors, and the live GitHub Pages URL.
