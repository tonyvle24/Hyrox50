# HYROX50 Focused Production V1 Design

## Product Summary

HYROX50 is a premium, mobile-first training companion built specifically for Tony
and Liz as they prepare for HYROX Mixed Doubles Dallas on November 18, 2026 and
the BMW Dallas 50K on December 13, 2026.

V1 focuses on the daily training loop: see the prescribed workout, complete or
skip it, understand weekly progress, review upcoming training, and manually move
future workouts when life changes. V1 is fully local and does not require server
infrastructure. A consent-based AI Coach is planned as V1.1 after a secure
authentication and abuse-prevention design is implemented.

## Goals

- Make the correct workout obvious each day.
- Help Tony and Liz train together Monday through Thursday whenever practical.
- Preserve Tony's 50K preparation while developing shared HYROX readiness.
- Make logging take only a few seconds.
- Provide a complete seeded plan from June 15 through December 13, 2026.
- Offer conservative, explainable, reversible schedule suggestions from a local
  deterministic rules engine.
- Protect private training data through local-first architecture and data
  minimization.

## Non-Goals For V1

- Detailed physiological tracking such as RPE, pain score, body weight, pace,
  duration, distance, or session load.
- Garmin, Apple Health, or Strava integration.
- Cloud sync, shared accounts, comments, or push notifications.
- Automatic background AI reviews while the application is closed.
- AI-generated medical, injury, nutrition, or physiological-readiness advice.
- Silent or automatic modification of the training plan.
- A full visual workout-plan editor.
- Network-connected AI Coach functionality. The V1 UI and domain interfaces may
  prepare for AI Coach, but the feature remains disabled until V1.1.

## Athlete And Race Context

### Tony

- Rebuilding endurance from approximately 12 weekly miles and a four-mile long
  run.
- Has marathon and lifting experience.
- Begins 50K training on June 15, 2026.
- Can run frequently and perform run/lift doubles.
- Goal: finish HYROX and the BMW Dallas 50K.

### Liz

- Can currently run approximately one continuous mile.
- Has prior lifting experience but limited recent training.
- Can train approximately five days per week.
- Goal: finish HYROX confidently and comfortably.

### Shared Training

The plan prioritizes shared HYROX training Monday through Thursday using the
available Life Time Fitness functional equipment. Tony's weekend steady and long
runs support the 50K goal. Liz receives scaled running and HYROX prescriptions.

## Experience Design

### Daily Training Loop

1. Open Home to see today's shared goal, race countdowns, weekly progress, and
   upcoming key sessions.
2. Open Today to review the shared portion plus Tony-specific and Liz-specific
   prescriptions.
3. Each athlete independently marks the workout Completed or Skipped.
4. A skipped workout requires one reason: Rest/recovery, Schedule conflict, Sick
   or injured, or Other.
5. Selecting Other permits one optional short note.
6. Progress and calendar status update immediately.
7. On Sunday evening, while the app is open, the local Schedule Coach may offer a
   weekly review using deterministic safety rules.

### Navigation

The bottom navigation contains:

- Home
- Today
- Calendar
- Progress
- Reference
- Settings

## Screen Design

### Home

Home is the command center. It shows:

- Today's workout summary and status for Tony and Liz
- Current training phase
- Weekly completion percentage for each athlete and the team
- HYROX and 50K race countdowns
- Last completed workout
- Upcoming Tony long run
- Upcoming HYROX simulation
- Pending Schedule Coach proposal, when one exists

### Today

Today is the primary action screen. It shows:

- Workout title, category, estimated time, target intent, and equipment
- Shared warmup and cooldown
- Tony-specific main set
- Liz-specific scaled main set
- Coaching and scaling notes
- Large athlete-specific Complete and Skip actions
- A skip-reason sheet with the four approved reasons

Workouts may be marked independently because one athlete may complete a shared
session while the other skips it.

### Calendar

Calendar provides daily, weekly, and monthly views from June 15 through December
13, 2026. It displays workout category, athlete applicability, key-session
status, and completion state.

V1 permits viewing workouts, manually moving future workouts, and applying
approved Schedule Coach proposals. It does not include unrestricted editing of
workout prescriptions.

### Progress

Progress intentionally uses completion-only analytics:

- Weekly completion trend by athlete
- Joint workouts completed
- Key-workout completion
- Tony long-run consistency
- HYROX-session consistency
- Skip-reason distribution
- Conservative consistency score based only on planned versus completed work

The app does not claim physiological readiness from completion-only data.

### Reference

Reference contains locally available educational content:

- HYROX race format and station descriptions
- Movement standards and doubles strategy
- Team strategy emphasizing Tony's larger share of heavy stations and Liz's
  consistency
- 50K fueling, hydration, pacing, recovery, and taper guidance
- Clear informational-only disclaimer

### Settings

Settings contains:

- Light, dark, and system theme selection
- Manual Schedule Coach weekly-review request
- Weekly review status and next eligible review
- Local data export
- Clear schedule-adjustment history
- Reset application data with destructive-action confirmation
- Privacy and informational-only disclosures
- A disabled AI Coach preview that clearly labels the feature as planned for V1.1

## Training Plan

### Phases

1. Foundation: June 15 through July 12
2. Base Build: July 13 through August 23
3. Specific Build: August 24 through October 11
4. HYROX Peak: October 12 through November 8
5. HYROX Taper: November 9 through November 18
6. 50K Peak and Taper: November 19 through December 13

### Default Weekly Structure

- Monday: joint HYROX skill and strength
- Tuesday: Tony easy run and joint engine session
- Wednesday: Tony run and joint strength session
- Thursday: Tony easy run and joint HYROX circuit
- Friday: recovery day
- Saturday: Tony steady run and Liz optional Zone 2
- Sunday: Tony long run

### Seed Data

The app ships with a complete, realistic schedule including:

- All six phases
- Tony, Liz, and shared workout prescriptions
- HYROX skill sessions and simulations
- Tony's progressive long runs
- Liz's beginner running progression
- Recovery weeks
- HYROX taper
- Post-HYROX recovery and 50K taper
- Reference content and race records

The original seeded schedule is immutable. Approved adjustments are stored as a
separate overlay so they can be audited, reverted, or rebuilt after a migration.

## Data Model

Core TypeScript models:

- `Athlete`
- `Race`
- `TrainingPhase`
- `TrainingWeek`
- `Workout`
- `AthleteWorkoutStatus`
- `SkipReason`
- `PlanAdjustment`
- `ScheduleCoachProposal`
- `AppPreferences`

V1.1 adds `AiReviewRequest` and `AiAdjustmentProposal` without changing the V1
plan-adjustment contract.

`AthleteWorkoutStatus` has exactly three states:

- `not_logged`
- `completed`
- `skipped`

Only a skipped status may contain a skip reason. Only the `other` reason may
contain a short optional note.

## Local Architecture

- Expo and React Native with TypeScript
- React Navigation bottom tabs and nested stacks
- Zustand for application state
- Versioned AsyncStorage persistence
- Runtime schema validation at all persistence and network boundaries
- Feature-focused modules for dashboard, today, calendar, progress, reference,
  settings, training plan, and Schedule Coach
- Pure domain functions for schedule queries, completion metrics, and adjustment
  application

The store persists only mutable user state, preferences, and adjustment history.
Seed data stays in version-controlled source files and is referenced by stable
identifiers.

## Manual Rescheduling

Users may move a future, not-yet-completed workout to another date. Manual moves:

- Must comply with the same deterministic schedule-safety rules used by Schedule
  Coach
- Cannot change the workout prescription, athlete applicability, or completed
  history
- Are stored as reversible plan adjustments
- Show a clear reason when a selected destination is not permitted

## Deterministic Schedule Coach

### Purpose

The local Schedule Coach reviews completion-only history and proposes conservative
schedule changes without sending data over the network. It can:

- Identify repeatedly missed categories or days
- Prioritize key workouts after schedule conflicts
- Preserve recovery space after missed or sick/injured sessions
- Suggest moving or removing future sessions
- Explain each recommendation in plain language

It cannot:

- Diagnose injury or illness
- Recommend training through sickness or injury
- Infer physiological readiness, pace, intensity, or recovery status
- Increase workload
- Invent or alter workout prescriptions
- Modify workouts without explicit approval
- Change completed or historical workouts

### Enforceable Schedule-Safety Rules

Every manual move and Schedule Coach proposal must satisfy:

- No more than two planned sessions for one athlete on one day
- At least one recovery day in every rolling seven-day period
- Tony's long runs remain at least five days apart
- HYROX simulations remain at least seven days apart
- No workout moves more than seven calendar days from its seeded or previously
  approved date
- No workout moves past its associated race date
- No added sessions or increased workout prescription
- No changes to completed or historical workouts
- No movement of protected taper sessions unless the move reduces workload
- Replacements, when added in a future version, must come from an explicit
  allowlist and be equal or lower load

### Weekly Review Trigger

On Sunday evening, the app checks for an eligible local review when opened. It
also offers a manual review action. Reviews do not run in the background.

A review runs only when:

- No current proposal is awaiting a decision
- The current week has not already been reviewed, unless manually re-requested

### Proposal Approval And Undo

Schedule Coach proposals display:

- A plain-language weekly summary
- Every proposed move or removal
- The deterministic reason for each proposal
- Any warnings or limitations

Users may approve the entire proposal or reject it. V1 does not support partial
proposal approval. Approved proposals create a dated adjustment record and may
be reverted. Rejection leaves the schedule unchanged.

## V1.1 AI Coach Design

### Purpose

The optional V1.1 AI Coach may explain, rank, or refine proposals that already
satisfy the deterministic schedule-safety rules. It may not bypass or replace
those rules.

- Identify repeatedly missed categories or days
- Prioritize key workouts after schedule conflicts
- Recommend leaving recovery space after missed or sick/injured sessions
- Suggest moving or removing future sessions within deterministic limits
- Explain each recommendation in plain language

It cannot:

- Diagnose injury or illness
- Recommend training through sickness or injury
- Infer physiological readiness, pace, intensity, or recovery status
- Increase workload based solely on completion
- Invent or alter workout prescriptions
- Modify workouts without explicit approval
- Change completed or historical workouts

### V1.1 Weekly Review Trigger

On Sunday evening, the app checks for an eligible review when opened. It also
offers a manual review action. Reviews do not run in the background in V1.1.

A review runs only when:

- AI Coach consent is enabled
- The secure server endpoint is configured
- The device has network connectivity
- No current proposal is awaiting a decision
- The current week has not already been reviewed, unless manually re-requested

### V1.1 Data Sent To The AI Service

The request is minimized to:

- Stable, non-personal athlete aliases
- Workout identifiers, dates, categories, athlete applicability, and key-session
  flags
- Completed, skipped, or not-logged status
- Skip reasons, including the health-adjacent Sick or injured reason, after an
  explicit per-review preview and confirmation
- The optional Other note only after explicit per-review preview and confirmation
- Upcoming schedule context required to propose adjustments

The request excludes names, body metrics, medical records, device identifiers,
credentials, and unrelated local data.

### V1.1 Secure Server Boundary

The mobile application never contains an OpenAI API key. A separately deployable
server function:

- Stores the API credential in server-side secret management
- Accepts authenticated requests using a server-verifiable identity and
  short-lived authorization; no reusable secret is trusted merely because it was
  embedded in the mobile application
- Applies request-size limits and rate limits
- Enforces per-user and deployment-level quotas
- Validates the request schema
- Constructs the fixed system instructions
- Calls the OpenAI Responses API
- Requires strict structured output matching the proposal schema
- Validates and filters the response before returning it
- Re-validates every proposal against deterministic schedule-safety rules
- Avoids logging request bodies or sensitive content

AI Coach remains disabled until this authentication, authorization, rate-limit,
quota, and monitoring design is implemented and verified. Without it, all V1
functionality continues to work.

### V1.1 Proposal Approval And Undo

AI proposals display:

- A plain-language weekly summary
- Every proposed move or removal
- The reason for each proposal
- Any warnings or limitations

Users may approve the entire proposal or reject it. V1.1 does not support partial
proposal approval. Approved proposals create a dated adjustment record and may
be reverted. Rejection leaves the schedule unchanged.

## Security And Privacy

### Assets To Protect

- Local workout completion history
- Skip reasons and optional Other notes
- AI Coach consent state
- AI adjustment history
- Server-side OpenAI credentials
- Integrity of the seeded and adjusted training plan

### Trust Boundaries

- User input to local application state
- Persisted AsyncStorage data loaded into the application
- Mobile application to optional server function
- Server function to OpenAI API
- AI-generated proposal returned to the application
- Exported local data leaving the application

### Security Invariants

- No API key or server secret is bundled into the mobile application.
- Unvalidated persisted or network data never enters trusted application state.
- AI output never directly mutates the plan.
- Manual and generated adjustments must satisfy deterministic schedule-safety
  rules.
- Every applied adjustment is attributable, reviewable, and reversible.
- Historical and completed workouts cannot be changed by AI proposals.
- Reset and export actions require explicit user intent.
- Logs and error reports exclude request bodies, optional notes, and secrets.

### Secure Development Practices

- Pin direct dependencies and commit the lockfile.
- Run dependency audits and TypeScript checks during verification.
- Prefer maintained Expo-compatible libraries and minimize dependency count.
- Validate dates, identifiers, enums, lengths, and proposal references.
- Limit optional Other notes to 280 characters and render them as plain text.
- Disclose that AsyncStorage is unencrypted and that Sick or injured is
  health-adjacent data.
- Exclude optional Other notes from exports by default and require explicit
  inclusion.
- Use safe external-link handling and permit only expected HTTPS destinations.
- Use generic user-facing errors while retaining non-sensitive diagnostic codes.
- Test persistence corruption, migration failure, malformed AI output, replayed
  proposals, and prohibited AI adjustments.
- Maintain a repository-scoped threat model as the architecture evolves.

## Error Handling

- Corrupt local state is rejected and recovered using a safe default while
  preserving a diagnostic signal that excludes user content.
- Failed persistence writes display a non-blocking retry message.
- AI connectivity or server errors leave the plan unchanged and offer retry.
- Invalid AI proposals are rejected in full and never shown as approvable.
- Adjustment application is atomic: either every validated change applies or
  none applies.
- Unsupported stored-data versions fail safely instead of being guessed at.

## Testing Strategy

### Unit Tests

- Training-phase and schedule-date selection
- Athlete-specific workout queries
- Completion metrics and consistency calculations
- Skip-reason validation
- Persistence schema parsing and migrations
- Adjustment validation, atomic application, and revert
- AI request minimization
- AI proposal schema validation and prohibited-action rejection
- Deterministic schedule-safety rule enforcement
- Manual move validation and revert

### Component Tests

- Complete and Skip flows
- Required skip-reason selection
- Tony and Liz independent status handling
- Calendar status rendering
- Manual rescheduling and prohibited-destination feedback
- Proposal approval, rejection, and undo
- Settings consent and destructive confirmations

### Integration And Manual Verification

- Cold-start hydration and offline operation
- Full weekly completion flow
- Corrupt-storage recovery
- AI server unavailable behavior
- Theme and mobile accessibility
- iPhone and Android layout checks
- Dependency audit and secret scan

## Accessibility And Visual Direction

The interface is clean, modern, athletic, and card-based without excessive
decoration. It uses strong typography, large touch targets, clear state colors,
dark mode support, and accessible contrast. Completion state is communicated by
text and iconography, not color alone.

The visual hierarchy emphasizes the day's primary action and keeps secondary
analytics concise. Navigation and logging must feel fast on both iPhone and
Android.

## Future-Compatible Boundaries

V1 leaves explicit interfaces for:

- Garmin, Apple Health, and Strava imports
- Cloud sync and shared accounts
- Push notifications and reliable background reviews
- Richer workout logging
- Race predictions

These integrations must not weaken the local-first default or bypass consent,
validation, adjustment approval, or audit history.

## Acceptance Criteria

- The application includes a complete seeded June 15 through December 13 plan.
- Tony and Liz can independently complete or skip each applicable workout.
- Skipping requires an approved reason; Other supports an optional short note.
- Home, Today, and Calendar provide a polished, coherent daily workflow.
- Progress, Reference, and Settings are useful and complete for V1 scope.
- Mutable data persists locally across restarts with schema validation.
- The V1 app works fully offline.
- Users can manually move eligible future workouts within deterministic safety
  rules.
- Schedule Coach proposals cannot apply without validation and explicit approval.
- Approved schedule adjustments are auditable and reversible.
- V1.1 AI Coach remains disabled until secure server authentication, quotas,
  validation, and consent flows are implemented.
- Automated tests cover core domain, persistence, and AI safety behavior.
- No secrets are bundled into the mobile application.
