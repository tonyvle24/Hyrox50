# HYROX50 V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished, secure, fully offline Expo mobile app for Tony and Liz to follow, complete, skip, review, and safely reschedule their June 15 through December 13, 2026 training plan.

**Architecture:** The Expo React Native client uses feature-focused modules, React Navigation, Zustand, versioned AsyncStorage, Zod boundary validation, and immutable seed data. All schedule calculations, adjustment validation, and Schedule Coach proposals are pure domain functions with test-first coverage; UI actions may only change the plan through those validated functions.

**Tech Stack:** Expo, React Native, TypeScript, React Navigation, Zustand, AsyncStorage, Zod, date-fns, Jest, React Native Testing Library, Expo Vector Icons

---

## File Structure

```text
.
├── App.tsx
├── app.json
├── package.json
├── tsconfig.json
├── jest.config.js
├── .gitignore
├── src
│   ├── shell
│   │   ├── AppNavigator.tsx
│   │   └── AppProviders.tsx
│   ├── components
│   │   ├── AppButton.tsx
│   │   ├── EmptyState.tsx
│   │   ├── MetricCard.tsx
│   │   ├── Screen.tsx
│   │   ├── SectionHeader.tsx
│   │   ├── StatusBadge.tsx
│   │   └── WorkoutCard.tsx
│   ├── domain
│   │   ├── adjustments.ts
│   │   ├── coach.ts
│   │   ├── metrics.ts
│   │   ├── schedule.ts
│   │   ├── schemas.ts
│   │   └── types.ts
│   ├── features
│   │   ├── calendar
│   │   │   ├── CalendarScreen.tsx
│   │   │   └── MoveWorkoutSheet.tsx
│   │   ├── home
│   │   │   └── HomeScreen.tsx
│   │   ├── progress
│   │   │   └── ProgressScreen.tsx
│   │   ├── reference
│   │   │   └── ReferenceScreen.tsx
│   │   ├── settings
│   │   │   └── SettingsScreen.tsx
│   │   └── today
│   │       ├── SkipWorkoutSheet.tsx
│   │       └── TodayScreen.tsx
│   ├── seed
│   │   ├── phases.ts
│   │   ├── races.ts
│   │   ├── reference.ts
│   │   ├── trainingPlan.ts
│   │   └── workouts.ts
│   ├── store
│   │   ├── appStore.ts
│   │   ├── migrations.ts
│   │   ├── persistence.ts
│   │   └── selectors.ts
│   ├── theme
│   │   ├── ThemeProvider.tsx
│   │   └── tokens.ts
│   └── utils
│       └── dates.ts
├── tests
│   ├── components
│   ├── domain
│   ├── integration
│   └── store
└── docs
    ├── security
    │   └── threat-model.md
    └── superpowers
        ├── plans
        └── specs
```

## Task 1: Scaffold The Expo Project And Test Harness

**Files:**
- Create: `package.json`
- Create: `app.json`
- Create: `App.tsx`
- Create: `tsconfig.json`
- Create: `jest.config.js`
- Create: `.gitignore`
- Create: `tests/smoke.test.ts`

- [ ] **Step 1: Scaffold the TypeScript Expo app**

Run:

```powershell
npx create-expo-app@latest . --template blank-typescript
```

Expected: Expo project files are created in the empty workspace.

- [ ] **Step 2: Install runtime and test dependencies**

Run:

```powershell
npx expo install @react-native-async-storage/async-storage @react-navigation/native @react-navigation/bottom-tabs @react-navigation/native-stack react-native-screens react-native-safe-area-context
npm install zustand zod date-fns
npm install --save-dev jest jest-expo @testing-library/react-native @types/jest
```

Expected: dependencies are pinned in `package-lock.json`.

- [ ] **Step 3: Write the failing smoke test**

Create `tests/smoke.test.ts`:

```ts
describe('project setup', () => {
  it('runs the test harness', () => {
    expect(true).toBe(true);
  });
});
```

Add to `package.json`:

```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "test": "jest",
    "test:ci": "jest --runInBand",
    "typecheck": "tsc --noEmit",
    "audit": "npm audit --audit-level=high"
  }
}
```

- [ ] **Step 4: Run the smoke test**

Run:

```powershell
npm test -- --runInBand tests/smoke.test.ts
```

Expected: PASS.

- [ ] **Step 5: Verify the clean Expo shell**

Run:

```powershell
npm run typecheck
npx expo export --platform web
```

Expected: both commands complete without errors.

## Task 2: Define Domain Types, Schemas, Dates, And Immutable Seed Structure

**Files:**
- Create: `src/domain/types.ts`
- Create: `src/domain/schemas.ts`
- Create: `src/utils/dates.ts`
- Create: `src/seed/phases.ts`
- Create: `src/seed/races.ts`
- Test: `tests/domain/schemas.test.ts`
- Test: `tests/domain/dates.test.ts`

- [ ] **Step 1: Write failing schema tests**

Create `tests/domain/schemas.test.ts`:

```ts
import { athleteWorkoutStatusSchema } from '../../src/domain/schemas';

describe('athleteWorkoutStatusSchema', () => {
  it('requires a skip reason for skipped workouts', () => {
    expect(() =>
      athleteWorkoutStatusSchema.parse({
        workoutId: 'w1',
        athleteId: 'tony',
        state: 'skipped',
      }),
    ).toThrow();
  });

  it('rejects notes unless the reason is other', () => {
    expect(() =>
      athleteWorkoutStatusSchema.parse({
        workoutId: 'w1',
        athleteId: 'liz',
        state: 'skipped',
        skipReason: 'schedule_conflict',
        note: 'private text',
      }),
    ).toThrow();
  });
});
```

- [ ] **Step 2: Run schema tests to verify RED**

Run:

```powershell
npm test -- --runInBand tests/domain/schemas.test.ts
```

Expected: FAIL because the domain schemas do not exist.

- [ ] **Step 3: Implement core types and strict schemas**

Define discriminated unions in `src/domain/types.ts`:

```ts
export type AthleteId = 'tony' | 'liz';
export type WorkoutStatusState = 'not_logged' | 'completed' | 'skipped';
export type SkipReason = 'rest_recovery' | 'schedule_conflict' | 'sick_injured' | 'other';

export type AthleteWorkoutStatus =
  | { workoutId: string; athleteId: AthleteId; state: 'not_logged' }
  | { workoutId: string; athleteId: AthleteId; state: 'completed'; completedAt: string }
  | {
      workoutId: string;
      athleteId: AthleteId;
      state: 'skipped';
      skipReason: SkipReason;
      note?: string;
      skippedAt: string;
    };
```

Implement equivalent Zod schemas in `src/domain/schemas.ts`, using `.max(280)` for
Other notes and `superRefine` to reject notes for every other reason.

- [ ] **Step 4: Add date-boundary tests**

Create `tests/domain/dates.test.ts`:

```ts
import { toDateKey } from '../../src/utils/dates';

it('creates a local calendar date key without UTC drift', () => {
  expect(toDateKey(new Date(2026, 5, 15, 23, 30))).toBe('2026-06-15');
});
```

- [ ] **Step 5: Implement local date helpers and seed phases/races**

Use local calendar parts in `toDateKey`; do not use `toISOString().slice(0, 10)`.
Create immutable phase and race arrays with the approved dates and stable IDs.

- [ ] **Step 6: Verify domain foundation**

Run:

```powershell
npm test -- --runInBand tests/domain
npm run typecheck
```

Expected: PASS.

## Task 3: Generate And Validate The Complete Seeded Training Plan

**Files:**
- Create: `src/seed/workouts.ts`
- Create: `src/seed/trainingPlan.ts`
- Create: `tests/domain/trainingPlan.test.ts`

- [ ] **Step 1: Write failing seed coverage tests**

Create `tests/domain/trainingPlan.test.ts`:

```ts
import { trainingPlan } from '../../src/seed/trainingPlan';

describe('trainingPlan', () => {
  it('covers every date from June 15 through December 13, 2026', () => {
    expect(trainingPlan.startDate).toBe('2026-06-15');
    expect(trainingPlan.endDate).toBe('2026-12-13');
    expect(trainingPlan.weeks).toHaveLength(26);
  });

  it('contains protected HYROX and 50K taper sessions', () => {
    expect(trainingPlan.workouts.some((w) => w.isProtectedTaper)).toBe(true);
  });

  it('uses unique stable workout identifiers', () => {
    const ids = trainingPlan.workouts.map((w) => w.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
```

- [ ] **Step 2: Run seed tests to verify RED**

Run:

```powershell
npm test -- --runInBand tests/domain/trainingPlan.test.ts
```

Expected: FAIL because seed workouts do not exist.

- [ ] **Step 3: Implement reusable workout templates**

In `src/seed/workouts.ts`, define typed template builders for:

```ts
createJointHyroxSkill(...)
createJointStrength(...)
createJointHyroxCircuit(...)
createTonyRun(...)
createTonyLongRun(...)
createLizRunProgression(...)
createRecovery(...)
createHyroxSimulation(...)
```

Each generated workout must contain stable ID, date, phase ID, category, athlete
applicability, shared/Tony/Liz prescriptions, equipment, coaching notes,
estimated time, key-session flag, and taper protection flag.

- [ ] **Step 4: Implement all 26 training weeks**

Create every week from June 15 through December 13 with recovery weeks, HYROX
simulations, Tony long-run progression, Liz beginner progression, both tapers,
and post-HYROX recovery. Keep workout prescriptions data-driven rather than
embedding them in screens.

- [ ] **Step 5: Verify seed integrity**

Run:

```powershell
npm test -- --runInBand tests/domain/trainingPlan.test.ts
npm run typecheck
```

Expected: PASS with 26 weeks and unique stable IDs.

## Task 4: Build Pure Schedule Queries And Completion Metrics

**Files:**
- Create: `src/domain/schedule.ts`
- Create: `src/domain/metrics.ts`
- Test: `tests/domain/schedule.test.ts`
- Test: `tests/domain/metrics.test.ts`

- [ ] **Step 1: Write failing query and metric tests**

Test:

```ts
it('returns workouts for the requested local date and athlete', () => {
  expect(getWorkoutsForDate(plan, '2026-06-15', 'liz')).toHaveLength(1);
});

it('does not count not-logged workouts as completed or skipped', () => {
  expect(calculateCompletionPercentage(['completed', 'not_logged'])).toBe(50);
});

it('calculates team joint completion only when both athletes complete', () => {
  expect(calculateJointCompletion(jointWorkout, statuses)).toBe(false);
});
```

- [ ] **Step 2: Run tests to verify RED**

Run:

```powershell
npm test -- --runInBand tests/domain/schedule.test.ts tests/domain/metrics.test.ts
```

Expected: FAIL because functions do not exist.

- [ ] **Step 3: Implement pure query and metric functions**

Implement:

```ts
getWorkoutsForDate
getCurrentPhase
getUpcomingLongRun
getUpcomingHyroxSimulation
getWeekWorkouts
calculateCompletionPercentage
calculateJointCompletion
calculateKeyWorkoutConsistency
calculateSkipReasonDistribution
```

No function may read the Zustand store directly.

- [ ] **Step 4: Verify schedule and metrics**

Run:

```powershell
npm test -- --runInBand tests/domain/schedule.test.ts tests/domain/metrics.test.ts
npm run typecheck
```

Expected: PASS.

## Task 5: Implement Safety Rules, Manual Adjustments, And Schedule Coach

**Files:**
- Create: `src/domain/adjustments.ts`
- Create: `src/domain/coach.ts`
- Test: `tests/domain/adjustments.test.ts`
- Test: `tests/domain/coach.test.ts`

- [ ] **Step 1: Write failing safety-rule tests**

Cover every approved invariant:

```ts
it('rejects a third same-day session for an athlete', () => {});
it('preserves a recovery day in every rolling seven-day window', () => {});
it('keeps Tony long runs at least five days apart', () => {});
it('keeps HYROX simulations at least seven days apart', () => {});
it('rejects moves farther than seven days', () => {});
it('rejects moves past a race date', () => {});
it('rejects completed or historical workout changes', () => {});
it('rejects taper moves unless they reduce workload', () => {});
```

- [ ] **Step 2: Run safety-rule tests to verify RED**

Run:

```powershell
npm test -- --runInBand tests/domain/adjustments.test.ts
```

Expected: FAIL because adjustment validation does not exist.

- [ ] **Step 3: Implement atomic validated adjustments**

Implement:

```ts
validateAdjustment(plan, adjustment, statuses, now)
applyAdjustments(plan, adjustments, statuses, now)
revertAdjustment(adjustmentId, history)
```

Return typed rejection codes such as `TOO_MANY_DAILY_SESSIONS`,
`RECOVERY_DAY_REQUIRED`, and `PROTECTED_TAPER`.

- [ ] **Step 4: Write failing Schedule Coach tests**

Test that the coach proposes only deterministic, valid changes and produces no
proposal when no safe move exists.

- [ ] **Step 5: Implement the local Schedule Coach**

Implement:

```ts
createWeeklyCoachProposal({
  plan,
  statuses,
  adjustments,
  reviewWeek,
  now,
})
```

The coach may move or remove future sessions only. Pass every generated proposal
through `validateAdjustment` before returning it.

- [ ] **Step 6: Verify all domain safety behavior**

Run:

```powershell
npm test -- --runInBand tests/domain
npm run typecheck
```

Expected: PASS.

## Task 6: Implement Versioned Local Persistence And Zustand Store

**Files:**
- Create: `src/store/migrations.ts`
- Create: `src/store/persistence.ts`
- Create: `src/store/appStore.ts`
- Create: `src/store/selectors.ts`
- Test: `tests/store/migrations.test.ts`
- Test: `tests/store/appStore.test.ts`
- Test: `tests/integration/corruptStorage.test.ts`

- [ ] **Step 1: Write failing migration and corruption tests**

Test:

```ts
it('migrates version 0 state to the current schema', () => {});
it('rejects unsupported future storage versions', () => {});
it('recovers from corrupt JSON without trusting partial data', () => {});
it('excludes Other notes from export by default', () => {});
```

- [ ] **Step 2: Run persistence tests to verify RED**

Run:

```powershell
npm test -- --runInBand tests/store tests/integration/corruptStorage.test.ts
```

Expected: FAIL because persistence and store do not exist.

- [ ] **Step 3: Implement the persisted envelope**

Use:

```ts
type PersistedEnvelope = {
  version: 1;
  savedAt: string;
  data: PersistedAppState;
};
```

Parse every loaded envelope with Zod. On parse failure, return safe defaults plus
a non-sensitive diagnostic code. Never log stored content.

- [ ] **Step 4: Implement store actions**

The store must expose:

```ts
hydrate()
completeWorkout(workoutId, athleteId)
skipWorkout(workoutId, athleteId, reason, note?)
clearWorkoutStatus(workoutId, athleteId)
moveWorkout(workoutId, targetDate)
requestCoachReview(reviewWeek)
approveCoachProposal(proposalId)
rejectCoachProposal(proposalId)
revertAdjustment(adjustmentId)
setTheme(theme)
exportData(options)
resetData()
```

All move and proposal actions must call the pure adjustment validator.

- [ ] **Step 5: Verify persistence and state**

Run:

```powershell
npm test -- --runInBand tests/store tests/integration
npm run typecheck
```

Expected: PASS.

## Task 7: Create Theme, Reusable Components, And Navigation Shell

**Files:**
- Create: `src/theme/tokens.ts`
- Create: `src/theme/ThemeProvider.tsx`
- Create: `src/components/AppButton.tsx`
- Create: `src/components/EmptyState.tsx`
- Create: `src/components/MetricCard.tsx`
- Create: `src/components/Screen.tsx`
- Create: `src/components/SectionHeader.tsx`
- Create: `src/components/StatusBadge.tsx`
- Create: `src/components/WorkoutCard.tsx`
- Create: `src/shell/AppProviders.tsx`
- Create: `src/shell/AppNavigator.tsx`
- Modify: `App.tsx`
- Test: `tests/components/AppButton.test.tsx`
- Test: `tests/components/StatusBadge.test.tsx`

- [ ] **Step 1: Write failing component accessibility tests**

Test large touch targets, accessible roles/labels, disabled state, and status text
that does not rely on color alone.

- [ ] **Step 2: Run component tests to verify RED**

Run:

```powershell
npm test -- --runInBand tests/components/AppButton.test.tsx tests/components/StatusBadge.test.tsx
```

Expected: FAIL because components do not exist.

- [ ] **Step 3: Implement the design system**

Define light/dark tokens for background, surface, text, muted text, borders,
Tony accent, Liz accent, shared accent, success, warning, and destructive states.
Use minimum 44-point touch targets and consistent spacing/radii.

- [ ] **Step 4: Implement navigation and providers**

Create six bottom tabs with nested stacks where detail/sheet screens are needed.
App startup must hydrate the store before rendering training content.

- [ ] **Step 5: Verify shell**

Run:

```powershell
npm test -- --runInBand tests/components
npm run typecheck
npx expo export --platform web
```

Expected: PASS.

## Task 8: Build Today Logging Flow

**Files:**
- Create: `src/features/today/TodayScreen.tsx`
- Create: `src/features/today/SkipWorkoutSheet.tsx`
- Test: `tests/components/TodayScreen.test.tsx`
- Test: `tests/integration/loggingFlow.test.tsx`

- [ ] **Step 1: Write failing Today flow tests**

Cover:

```ts
it('shows shared, Tony, and Liz prescriptions', () => {});
it('completes Tony without completing Liz', () => {});
it('requires a skip reason', () => {});
it('permits a note only for Other and limits it to 280 characters', () => {});
```

- [ ] **Step 2: Run Today tests to verify RED**

Run:

```powershell
npm test -- --runInBand tests/components/TodayScreen.test.tsx tests/integration/loggingFlow.test.tsx
```

Expected: FAIL because Today UI does not exist.

- [ ] **Step 3: Implement Today and Skip sheet**

Render workout details from seed data and statuses from store selectors. Use
athlete-specific large Complete and Skip actions. Persist immediately after a
valid action.

- [ ] **Step 4: Verify Today flow**

Run:

```powershell
npm test -- --runInBand tests/components/TodayScreen.test.tsx tests/integration/loggingFlow.test.tsx
npm run typecheck
```

Expected: PASS.

## Task 9: Build Home Dashboard

**Files:**
- Create: `src/features/home/HomeScreen.tsx`
- Test: `tests/components/HomeScreen.test.tsx`

- [ ] **Step 1: Write failing dashboard tests**

Test current phase, both race countdowns, today's statuses, weekly completion,
upcoming Tony long run, upcoming HYROX simulation, and pending Coach proposal.

- [ ] **Step 2: Run dashboard test to verify RED**

Run:

```powershell
npm test -- --runInBand tests/components/HomeScreen.test.tsx
```

Expected: FAIL because Home does not exist.

- [ ] **Step 3: Implement Home**

Use selectors and pure metrics only. Keep the primary Today action visually
dominant and make every dashboard card navigable to its relevant screen.

- [ ] **Step 4: Verify Home**

Run:

```powershell
npm test -- --runInBand tests/components/HomeScreen.test.tsx
npm run typecheck
```

Expected: PASS.

## Task 10: Build Calendar And Manual Rescheduling

**Files:**
- Create: `src/features/calendar/CalendarScreen.tsx`
- Create: `src/features/calendar/MoveWorkoutSheet.tsx`
- Test: `tests/components/CalendarScreen.test.tsx`
- Test: `tests/integration/reschedulingFlow.test.tsx`

- [ ] **Step 1: Write failing calendar and move tests**

Test daily, weekly, and monthly modes; status rendering; allowed moves; prohibited
move explanations; and undo.

- [ ] **Step 2: Run calendar tests to verify RED**

Run:

```powershell
npm test -- --runInBand tests/components/CalendarScreen.test.tsx tests/integration/reschedulingFlow.test.tsx
```

Expected: FAIL because Calendar UI does not exist.

- [ ] **Step 3: Implement calendar modes**

Use one selected date and one view-mode state. Render compact month markers,
weekly workout cards, and daily workout detail without duplicating schedule logic.

- [ ] **Step 4: Implement move and undo flows**

The move sheet previews permitted destination dates, calls `moveWorkout`, and
shows mapped human-readable rejection messages from domain rejection codes.

- [ ] **Step 5: Verify Calendar and rescheduling**

Run:

```powershell
npm test -- --runInBand tests/components/CalendarScreen.test.tsx tests/integration/reschedulingFlow.test.tsx
npm run typecheck
```

Expected: PASS.

## Task 11: Build Progress, Reference, Settings, Export, And Schedule Coach Review

**Files:**
- Create: `src/features/progress/ProgressScreen.tsx`
- Create: `src/features/reference/ReferenceScreen.tsx`
- Create: `src/features/settings/SettingsScreen.tsx`
- Create: `src/seed/reference.ts`
- Test: `tests/components/ProgressScreen.test.tsx`
- Test: `tests/components/SettingsScreen.test.tsx`
- Test: `tests/integration/coachReviewFlow.test.tsx`

- [ ] **Step 1: Write failing secondary-screen tests**

Test completion-only analytics, informational disclaimers, theme selection,
default-redacted export, reset confirmation, disabled V1.1 AI preview, Schedule
Coach proposal review, approval, rejection, and undo.

- [ ] **Step 2: Run secondary-screen tests to verify RED**

Run:

```powershell
npm test -- --runInBand tests/components/ProgressScreen.test.tsx tests/components/SettingsScreen.test.tsx tests/integration/coachReviewFlow.test.tsx
```

Expected: FAIL because screens do not exist.

- [ ] **Step 3: Implement Progress and Reference**

Render completion-only metrics with no physiological-readiness language. Add
local HYROX and 50K educational content with an informational-only disclaimer.

- [ ] **Step 4: Implement Settings and Schedule Coach review**

Include theme, local review request, review eligibility, export controls, reset,
privacy disclosure, adjustment history, and a clearly disabled V1.1 AI preview.

- [ ] **Step 5: Verify secondary screens**

Run:

```powershell
npm test -- --runInBand tests/components tests/integration/coachReviewFlow.test.tsx
npm run typecheck
```

Expected: PASS.

## Task 12: Security Hardening, Documentation, And Release Verification

**Files:**
- Create: `README.md`
- Create: `docs/security/release-checklist.md`
- Modify: `.gitignore`
- Modify: `app.json`
- Test: all tests

- [ ] **Step 1: Add security and release configuration**

Ensure `.gitignore` excludes:

```text
.env
.env.*
!.env.example
.expo/
dist/
coverage/
```

Configure app identity, supported orientation, and no unnecessary permissions in
`app.json`. Retain the scaffolded local icon and splash assets until a separate
approved branding pass replaces them.

- [ ] **Step 2: Write README and release checklist**

Document setup, commands, architecture, storage disclosure, data export behavior,
Schedule Coach limits, V1.1 AI boundary, and the fact that no API secrets belong
in Expo client variables.

The release checklist must include:

```text
- TypeScript passes
- Tests pass
- Expo export passes
- Dependency audit reviewed
- Secret scan finds no credentials
- AsyncStorage disclosure present
- Sick/injured disclosure present
- Optional notes excluded from export by default
- Adjustment safety tests pass
- iPhone and Android layouts manually checked
```

- [ ] **Step 3: Run full automated verification**

Run:

```powershell
npm run typecheck
npm run test:ci
npx expo export --platform web
npm run audit
rg -n --hidden -g '!node_modules' -g '!package-lock.json' 'sk-[A-Za-z0-9_-]{20,}|OPENAI_API_KEY|BEGIN PRIVATE KEY'
```

Expected: typecheck, tests, and export pass; dependency audit has no unreviewed
high-severity issue; secret scan finds no credentials.

- [ ] **Step 4: Run mobile visual and interaction QA**

Use the Browser plugin for the web build and Expo-supported device previews for
iPhone and Android. Verify:

- Home first viewport and navigation
- Today complete/skip flow
- Required skip reason and Other note limit
- Calendar modes and manual move rejection messages
- Schedule Coach approval and undo
- Progress language
- Dark mode, large touch targets, and text/icon status cues
- Offline cold start

- [ ] **Step 5: Record deviations and final results**

Update `docs/security/release-checklist.md` with command outcomes, reviewed audit
items, visual QA devices/viewports, and any intentional deviations. Do not mark
V1 complete while a required verification item is unresolved.

## Implementation Order And Release Boundary

Tasks 1 through 7 establish a testable application foundation. Tasks 8 through
11 build the user-facing product. Task 12 is a hard release gate.

V1.1 AI Coach is explicitly excluded from this implementation plan. It requires
a separate approved design and plan for server-verifiable identity, short-lived
authorization, quotas, monitoring, strict structured outputs, consent preview,
and deterministic re-validation.
