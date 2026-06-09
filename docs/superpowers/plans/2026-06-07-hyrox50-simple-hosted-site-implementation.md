# HYROX50 Simple Hosted Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current multi-feature app with a simple hosted mobile website that shows every detailed Tony, Liz, and shared workout from Monday, June 8, 2026 through Sunday, December 13, 2026.

**Architecture:** Keep Expo and React Native Web, but remove mutable state, persistence, logging, Schedule Coach, and six-tab navigation. A validated immutable 189-day plan feeds a daily view and an all-days browse view; GitHub Actions exports and publishes the static web build to GitHub Pages.

**Tech Stack:** Expo, React Native Web, TypeScript, date-fns, Zod, Jest, React Native Testing Library, GitHub Actions, GitHub Pages

---

## File Structure

```text
.
├── App.tsx
├── app.json
├── package.json
├── src
│   ├── components
│   │   ├── DailyHeader.tsx
│   │   ├── DayNavigation.tsx
│   │   ├── DetailBlock.tsx
│   │   ├── PlanDayCard.tsx
│   │   └── Screen.tsx
│   ├── plan
│   │   ├── buildPlan.ts
│   │   ├── phases.ts
│   │   ├── schemas.ts
│   │   ├── templates.ts
│   │   ├── trainingPlan.ts
│   │   └── types.ts
│   ├── screens
│   │   ├── AllDaysScreen.tsx
│   │   └── DailyPlanScreen.tsx
│   ├── theme
│   │   └── tokens.ts
│   └── utils
│       └── dates.ts
├── tests
│   ├── components
│   │   ├── AllDaysScreen.test.tsx
│   │   └── DailyPlanScreen.test.tsx
│   └── plan
│       ├── dates.test.ts
│       └── trainingPlan.test.ts
└── .github
    └── workflows
        └── deploy-pages.yml
```

## Task 1: Establish The Simplified Plan Contract

**Files:**
- Create: `src/plan/types.ts`
- Create: `src/plan/schemas.ts`
- Replace: `src/utils/dates.ts`
- Test: `tests/plan/dates.test.ts`
- Test: `tests/plan/trainingPlan.test.ts`

- [ ] **Step 1: Write failing date and plan-contract tests**

```ts
expect(formatUsDate('2026-06-08')).toBe('Monday, June 8, 2026');
expect(getPlanDayNumber('2026-06-08')).toBe(1);
expect(getPlanDayNumber('2026-12-13')).toBe(189);
expect(clampToPlanDate('2026-01-01')).toBe('2026-06-08');
expect(clampToPlanDate('2027-01-01')).toBe('2026-12-13');
```

Define a plan-validation test that requires:

```ts
{
  date,
  dayNumber,
  phase,
  title,
  purpose,
  estimatedMinutes,
  equipment,
  shared,
  tony,
  liz,
  coachingNotes
}
```

- [ ] **Step 2: Run the tests to verify RED**

Run:

```powershell
& '.\.tools\node-v22.16.0-win-x64\node.exe' '.\node_modules\jest\bin\jest.js' --runInBand tests/plan
```

Expected: FAIL because the simplified plan modules do not exist.

- [ ] **Step 3: Implement the plan types and strict schemas**

Define:

```ts
type ActivityDetail = {
  name: string;
  prescription: string;
  targetRpe: string;
  rest: string;
  coachingCue: string;
};

type AthletePlan = {
  summary: string;
  warmup: ActivityDetail[];
  main: ActivityDetail[];
  cooldown: ActivityDetail[];
};

type DailyPlan = {
  date: DateKey;
  dayNumber: number;
  phase: string;
  title: string;
  purpose: string;
  estimatedMinutes: number;
  equipment: string[];
  shared: AthletePlan;
  tony: AthletePlan;
  liz: AthletePlan;
  coachingNotes: string[];
};
```

The Zod schema must reject empty prescriptions, missing RPE, missing rest
guidance, nonconsecutive day numbers, and duplicate dates.

- [ ] **Step 4: Implement U.S. date helpers**

Implement:

```ts
formatUsDate(date)
formatUsCompactDate(date)
getPlanDayNumber(date)
clampToPlanDate(date)
getPreviousPlanDate(date)
getNextPlanDate(date)
```

Day 1 is `2026-06-08`; final day is `2026-12-13`.

- [ ] **Step 5: Verify the contract**

Run:

```powershell
& '.\.tools\node-v22.16.0-win-x64\node.exe' '.\node_modules\jest\bin\jest.js' --runInBand tests/plan
& '.\.tools\node-v22.16.0-win-x64\node.exe' '.\node_modules\typescript\bin\tsc' --noEmit
```

Expected: PASS.

## Task 2: Build Detailed Workout Templates

**Files:**
- Create: `src/plan/templates.ts`
- Create: `tests/plan/templates.test.ts`

- [ ] **Step 1: Write failing actionable-detail tests**

Test representative templates:

```ts
expect(buildMondayHyroxSkill(context).tony.main[0]).toMatchObject({
  name: expect.any(String),
  prescription: expect.stringMatching(/sets|rounds|reps|minutes|miles/i),
  targetRpe: expect.stringMatching(/RPE/i),
  rest: expect.any(String),
  coachingCue: expect.any(String),
});
```

Also test:

- Tony easy run includes miles and RPE.
- Tony long run includes miles and fueling guidance.
- Liz run/walk progression includes interval durations and RPE.
- Strength includes exercise order, sets, reps, RPE, and rest.
- HYROX circuits include rounds, station work, division of labor, and rest.
- Recovery includes optional walk and mobility detail.

- [ ] **Step 2: Run template tests to verify RED**

Run:

```powershell
& '.\.tools\node-v22.16.0-win-x64\node.exe' '.\node_modules\jest\bin\jest.js' --runInBand tests/plan/templates.test.ts
```

Expected: FAIL because templates do not exist.

- [ ] **Step 3: Implement phased detailed templates**

Create typed builders:

```ts
buildMondayHyroxSkill(context)
buildTuesdayEngine(context)
buildWednesdayStrength(context)
buildThursdayHyroxCircuit(context)
buildFridayRecovery(context)
buildSaturdaySteady(context)
buildSundayLongRun(context)
buildHyroxRaceDay(context)
buildPostHyroxRecovery(context)
buildFiftyKRaceDay(context)
```

Each builder returns a complete `DailyPlan`. Use U.S. units except where HYROX
standards are naturally expressed in meters.

- [ ] **Step 4: Verify template detail**

Run:

```powershell
& '.\.tools\node-v22.16.0-win-x64\node.exe' '.\node_modules\jest\bin\jest.js' --runInBand tests/plan/templates.test.ts
```

Expected: PASS.

## Task 3: Generate And Validate All 189 Days

**Files:**
- Create: `src/plan/phases.ts`
- Create: `src/plan/buildPlan.ts`
- Create: `src/plan/trainingPlan.ts`
- Test: `tests/plan/trainingPlan.test.ts`

- [ ] **Step 1: Expand failing full-plan validation tests**

Require:

```ts
expect(trainingPlan).toHaveLength(189);
expect(trainingPlan[0]?.date).toBe('2026-06-08');
expect(trainingPlan.at(-1)?.date).toBe('2026-12-13');
expect(new Set(trainingPlan.map((day) => day.date)).size).toBe(189);
expect(trainingPlan.every((day) => day.tony && day.liz && day.shared)).toBe(true);
```

Validate every activity has a nonempty prescription, RPE, rest guidance, and
coaching cue. Validate every calendar date appears exactly once.

- [ ] **Step 2: Run full-plan tests to verify RED**

Run:

```powershell
& '.\.tools\node-v22.16.0-win-x64\node.exe' '.\node_modules\jest\bin\jest.js' --runInBand tests/plan/trainingPlan.test.ts
```

Expected: FAIL until the complete plan exists.

- [ ] **Step 3: Implement phases and plan generation**

Generate consecutive days from June 8 through December 13. Preserve:

- Shared Monday-Thursday work
- Conservative Liz progression
- Tony 50K long-run progression
- Recovery weeks
- HYROX simulations
- HYROX race on November 18
- Post-HYROX recovery
- 50K taper and race on December 13

All 189 daily records are validated at module load with the strict plan schema.

- [ ] **Step 4: Verify the full plan**

Run:

```powershell
& '.\.tools\node-v22.16.0-win-x64\node.exe' '.\node_modules\jest\bin\jest.js' --runInBand tests/plan
& '.\.tools\node-v22.16.0-win-x64\node.exe' '.\node_modules\typescript\bin\tsc' --noEmit
```

Expected: PASS with exactly 189 valid days.

## Task 4: Replace The App Shell With Daily And All-Days Views

**Files:**
- Replace: `App.tsx`
- Replace: `src/theme/tokens.ts`
- Create: `src/components/DailyHeader.tsx`
- Create: `src/components/DayNavigation.tsx`
- Create: `src/components/DetailBlock.tsx`
- Create: `src/components/PlanDayCard.tsx`
- Replace: `src/components/Screen.tsx`
- Create: `src/screens/DailyPlanScreen.tsx`
- Create: `src/screens/AllDaysScreen.tsx`
- Test: `tests/components/DailyPlanScreen.test.tsx`
- Test: `tests/components/AllDaysScreen.test.tsx`

- [ ] **Step 1: Write failing daily-view tests**

Test:

```ts
it('shows Day 1 and Monday, June 8, 2026', async () => {});
it('shows Together, Tony, and Liz detail blocks', async () => {});
it('shows exercise, prescription, RPE, rest, and coaching cue', async () => {});
it('navigates previous, next, and today with plan clamping', async () => {});
it('opens and closes Browse All Days', async () => {});
```

- [ ] **Step 2: Run component tests to verify RED**

Run:

```powershell
& '.\.tools\node-v22.16.0-win-x64\node.exe' '.\node_modules\jest\bin\jest.js' --runInBand tests/components
```

Expected: FAIL because simplified screens do not exist.

- [ ] **Step 3: Implement the simplified design system**

Use a dark athletic palette, clear Together/Tony/Liz accents, large touch
targets, strong typography, and open vertical layouts that can handle long
workout detail without nested-card clutter.

- [ ] **Step 4: Implement Daily Plan**

The screen opens to `clampToPlanDate(today)`, shows both race countdowns, renders
all detailed blocks, and supports Previous Day, Next Day, Jump to Today, and
Browse All Days.

- [ ] **Step 5: Implement All Days**

Group days by U.S. month label. Each row shows date, day number, title, Tony
summary, and Liz summary. Selecting a day returns to the daily view.

- [ ] **Step 6: Remove the old active feature surface**

Delete or stop importing:

```text
src/features/
src/shell/
src/store/
src/domain/
src/seed/
```

Keep only code used by the simplified hosted site. Update tests to remove the old
logging, persistence, Schedule Coach, and navigation suites.

- [ ] **Step 7: Verify the simplified app**

Run:

```powershell
& '.\.tools\node-v22.16.0-win-x64\node.exe' '.\node_modules\jest\bin\jest.js' --runInBand
& '.\.tools\node-v22.16.0-win-x64\node.exe' '.\node_modules\typescript\bin\tsc' --noEmit
```

Expected: PASS with only simplified-site tests.

## Task 5: Configure GitHub Pages Production Export

**Files:**
- Modify: `app.json`
- Modify: `package.json`
- Create: `.github/workflows/deploy-pages.yml`
- Replace: `README.md`
- Modify: `.gitignore`

- [ ] **Step 1: Configure static export scripts**

Add:

```json
{
  "scripts": {
    "build:web": "expo export --platform web --output-dir dist",
    "validate": "npm run typecheck && npm run test:ci && npm run build:web"
  }
}
```

Configure relative or repository-aware asset paths so the website works under a
GitHub Pages project subpath.

- [ ] **Step 2: Add the least-privilege Pages workflow**

Create `.github/workflows/deploy-pages.yml` with:

```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

The workflow installs from the lockfile, runs typecheck and tests, exports the
website, uploads `dist`, and deploys Pages. It contains no secrets.

- [ ] **Step 3: Update documentation**

README must explain:

- Permanent website purpose
- How Tony and Liz use it
- How to publish updates
- How to enable GitHub Pages once
- Public-data and no-health-data assumptions

- [ ] **Step 4: Verify production export**

Run:

```powershell
$env:EXPO_NO_TELEMETRY='1'
$env:HOME=(Resolve-Path '.').Path
$env:USERPROFILE=(Resolve-Path '.').Path
& '.\.tools\node-v22.16.0-win-x64\node.exe' '.\node_modules\expo\bin\cli' export --platform web --output-dir dist
```

Expected: production static site exports successfully.

## Task 6: Final Security, Visual, And Publishing Verification

**Files:**
- Modify: `docs/security/release-checklist.md`
- Test: all simplified-site tests

- [ ] **Step 1: Run full automated verification**

Run:

```powershell
& '.\.tools\node-v22.16.0-win-x64\node.exe' '.\node_modules\jest\bin\jest.js' --runInBand
& '.\.tools\node-v22.16.0-win-x64\node.exe' '.\node_modules\typescript\bin\tsc' --noEmit
$env:EXPO_NO_TELEMETRY='1'
$env:HOME=(Resolve-Path '.').Path
$env:USERPROFILE=(Resolve-Path '.').Path
& '.\.tools\node-v22.16.0-win-x64\node.exe' '.\node_modules\expo\bin\cli' install --check
& '.\.tools\node-v22.16.0-win-x64\node.exe' '.\node_modules\expo\bin\cli' export --platform web --output-dir dist
```

Expected: all commands pass.

- [ ] **Step 2: Run security checks**

Run:

```powershell
& '.\.tools\node-v22.16.0-win-x64\node.exe' '.\.tools\node-v22.16.0-win-x64\node_modules\npm\bin\npm-cli.js' audit --audit-level=high
rg -n --hidden -g '!node_modules' -g '!package-lock.json' -g '!.tools/**' 'sk-[A-Za-z0-9_-]{20,}|OPENAI_API_KEY|BEGIN PRIVATE KEY'
```

Expected: zero unreviewed high/critical vulnerabilities and no credentials.

- [ ] **Step 3: Verify rendered mobile website**

Check iPhone and Android-sized viewports:

- Day 1 and final day
- A detailed strength day
- A detailed HYROX circuit day
- Tony long run
- Liz run/walk prescription
- Recovery day
- HYROX race day
- 50K race day
- All-days browsing
- Previous, next, and today navigation
- GitHub Pages project-subpath asset loading

- [ ] **Step 4: Publish through GitHub Pages**

After the repository is connected to GitHub and the publishing branch is pushed,
enable GitHub Pages with GitHub Actions as the source. Verify the permanent URL
loads on Tony's and Liz's phones.

## Release Boundary

This implementation removes active logging, persistence, analytics, Schedule
Coach, AI, calendar integration, and account features. Future changes should
adjust the detailed immutable plan and republish the website rather than
reintroducing product complexity without a new approved design.
