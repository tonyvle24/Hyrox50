# HYROX50

HYROX50 is Tony and Liz's simple daily training website for:

- HYROX Mixed Doubles Dallas on November 18, 2026
- BMW Dallas 50K on December 13, 2026

The public site contains every calendar day from Monday, June 8, 2026 through
Sunday, December 13, 2026. Each day includes detailed Together, Tony, and Liz
instructions with exercises, sets, reps, distances, durations, RPE, rest periods,
equipment, scaling, and coaching cues.

## Use The Website

After GitHub Pages is enabled, the website is available at:

`https://tonyvle24.github.io/Hyrox50/`

Open the link on a phone and use the browser's Add to Home Screen action for
app-like access. No account, PowerShell command, or local server is required.
Each selected day is reflected in the URL as `#day=YYYY-MM-DD`, so a specific
day can be bookmarked or shared. Missing or invalid day links open Day 1.

## Publish Updates

The GitHub Pages workflow validates and publishes every approved update pushed to
the `main` branch.

Before treating the site as production, protect `main` with required pull-request
review and passing checks. The workflow scopes permissions per job. Pin its
GitHub Actions references to reviewed immutable commit SHAs once those SHAs have
been verified from trusted upstream release records.

One-time setup:

1. Create a public GitHub repository named `hyrox50`.
2. Push this project to its `main` branch.
3. In GitHub repository Settings, open Pages.
4. Select **GitHub Actions** as the Pages source.

## Local Development

```powershell
npm install
npm test
npm run typecheck
npm run build:web
```

## Privacy

The hosted website is public and contains only the training plan. It contains no
accounts, completion history, personal health notes, analytics, trackers,
credentials, or third-party APIs.
