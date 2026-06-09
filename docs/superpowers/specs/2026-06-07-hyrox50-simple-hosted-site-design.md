# HYROX50 Simple Hosted Training Site Design

## Product Summary

HYROX50 is a simple, hosted, mobile-first training website for Tony and Liz. It
lists every day of training from Monday, June 8, 2026 through Sunday, December
13, 2026, with enough detail to complete each workout without consulting another
document.

The site is published through GitHub Pages and opened from one permanent link.
Tony and Liz may add the link to their phone home screens. No home computer,
PowerShell command, account, backend, or app-store installation is required to
view the plan.

## Goals

- Make today's prescribed training immediately obvious.
- Give Tony and Liz exact, separate, and shared instructions.
- Provide a complete calendar-day plan through both Dallas events.
- Use U.S. dates, measurements, spelling, and time conventions.
- Make future plan adjustments easy to publish as website updates.
- Keep the product simple enough to use every day.

## Non-Goals

- Workout completion logging
- AI Coach or automated plan changes
- Analytics, readiness scores, or training-load calculations
- Accounts, cloud sync, comments, or notifications
- Calendar subscriptions
- Manual workout rescheduling in the website
- Personal health-data storage

## Dates And U.S. Conventions

- Day 1 is Monday, June 8, 2026.
- The final day is Sunday, December 13, 2026.
- The plan contains 189 calendar days.
- Dates display in full U.S. format, such as `Monday, June 8, 2026`.
- Compact dates use month/day/year ordering.
- Running distance uses miles.
- Short station distances use feet or meters when the HYROX movement standard is
  naturally expressed in meters.
- Loads use pounds.
- Durations use minutes and seconds.
- Clock times, if added later, use 12-hour time with AM or PM.

## Core Experience

### Daily Page

The website opens to the plan day matching the viewer's local date. If the local
date is before June 8, it opens Day 1. If it is after December 13, it opens the
final day.

Each day shows:

- Day number, such as `Day 1 of 189`
- Full U.S. date
- Current training phase
- Training-day title and purpose
- Estimated total duration
- Equipment needed
- Shared warmup, shared work, shared cooldown, and mobility when applicable
- Tony's exact workout
- Liz's exact scaled workout
- Coaching and safety notes
- HYROX and 50K countdowns

Navigation controls:

- Previous Day
- Next Day
- Jump to Today
- Browse All Days

### All Days Page

Browse All Days is a chronological list grouped by month. Each row shows:

- Full date
- Day number
- Workout title
- Tony summary
- Liz summary
- Rest / Recovery label where applicable

Selecting a row opens its daily page.

## Workout Detail Standard

Every prescribed training block must be actionable and include the fields that
apply to that activity:

- Exercise or movement name
- Number of sets or rounds
- Repetitions
- Distance or duration
- Target RPE on a 1-10 scale
- Rest between sets, rounds, or intervals
- Equipment and load guidance
- Tony-specific prescription
- Liz-specific scaling or substitution
- Technique or pacing cue

### Running Prescriptions

Every run specifies:

- Distance in miles or duration in minutes
- Target RPE
- Intended pace description, such as conversational or comfortably hard
- Run/walk structure for Liz when applicable
- Recovery between intervals
- Warmup and cooldown

Tony's long runs include fueling-practice guidance as distance increases. Liz's
running progression begins conservatively and prioritizes confidence and
consistency.

### Strength Prescriptions

Every strength workout specifies:

- Exercise order
- Sets and reps
- Target RPE
- Rest periods
- Load-selection guidance in pounds or relative language
- Tony and Liz scaling
- Key technique cues

### HYROX Prescriptions

Every HYROX workout specifies:

- Run distance or duration
- Station distance, repetitions, or duration
- Number of rounds
- Target RPE
- Rest or transition guidance
- Tony and Liz division of work
- Equipment and load guidance
- Scaling options

### Recovery Days

Every non-training day appears explicitly. Recovery prescriptions contain:

- Rest-day purpose
- Optional walk duration
- Mobility movements with time or repetitions
- Clear instruction not to make up missed hard workouts

## Training Structure

The plan preserves the approved priorities:

- Train together Monday through Thursday whenever practical.
- Tony's successful BMW Dallas 50K completion remains the secondary priority.
- Liz progresses from beginner runner to confident HYROX doubles partner.

Default week:

- Monday: Joint HYROX skill and strength
- Tuesday: Tony easy run plus joint engine work
- Wednesday: Tony run plus joint strength
- Thursday: Tony easy run plus joint HYROX circuit
- Friday: Recovery
- Saturday: Tony steady run plus Liz optional Zone 2
- Sunday: Tony long run plus Liz recovery or optional easy movement

The first week begins Monday, June 8. Training volume progresses conservatively
from the provided starting fitness. The plan includes recovery weeks, HYROX
simulations, HYROX taper, post-HYROX recovery, and 50K taper.

## Phases

The existing phase intent remains, shifted one week earlier to start on June 8:

1. Foundation
2. Base Build
3. Specific Build
4. HYROX Peak
5. HYROX Taper
6. 50K Peak and Taper

Phase boundaries and prescriptions must preserve the fixed race dates:

- HYROX Mixed Doubles Dallas: November 18, 2026
- BMW Dallas 50K: December 13, 2026

## Website Architecture

The website is a static Expo/React Native Web build suitable for GitHub Pages.

Primary modules:

- Immutable detailed daily-plan data
- Date and day-number helpers
- Daily plan view
- All-days browse view
- Small shared design system
- GitHub Pages deployment workflow

The previous logging, persistence, Schedule Coach, AI, analytics, and settings
features are removed from the active website surface. Code that no longer serves
the simplified product is removed rather than hidden.

## Hosting And Access

- GitHub Pages hosts the static production build.
- A GitHub Actions workflow builds and deploys the website after approved changes
  reach the publishing branch.
- The website uses relative asset paths compatible with a GitHub Pages project
  subpath.
- The site includes mobile home-screen metadata and icons when final branding
  assets are available.
- The training plan contains no private health data or credentials.

Publishing requires a GitHub repository and one-time GitHub Pages configuration.
The site remains viewable without authentication once published.

## Visual Direction

- Mobile-first, dark athletic design
- One strong daily-workout focus
- Clear Tony, Liz, and Together visual distinction
- Large readable typography and touch targets
- Minimal navigation
- No dashboard clutter or decorative analytics
- Status colors never imply completion or readiness because the site does not log
  user activity

## Error And Boundary Handling

- Before Day 1, Jump to Today opens Day 1.
- After the final day, Jump to Today opens the final day.
- Invalid or unknown day links open Day 1.
- A plan-data validation failure prevents deployment rather than publishing an
  incomplete schedule.
- Every calendar date must have exactly one daily-plan record.
- Every workout must pass detail validation before deployment.

## Testing Strategy

Automated tests verify:

- Day 1 is June 8, 2026.
- The final day is December 13, 2026.
- Exactly 189 consecutive daily records exist.
- Every day has Tony and Liz guidance, including rest/recovery guidance.
- Every active workout has exact sets/reps, duration/distance, target RPE, and
  rest guidance where applicable.
- U.S. date formatting is used.
- Date navigation and Jump to Today clamp correctly.
- Both race countdowns are accurate.
- The static production website builds with relative assets.

Manual verification covers:

- iPhone-sized layout
- Android-sized layout
- Readability of long workout prescriptions
- Previous Day, Next Day, Jump to Today, and Browse All Days
- GitHub Pages deployment and permanent-link access
- Add-to-home-screen behavior

## Security And Privacy

- The hosted site contains no secrets, credentials, personal health notes, or
  workout-completion data.
- Dependencies remain pinned and audited.
- GitHub Actions receives only the permissions required to publish Pages.
- No third-party scripts, analytics, trackers, or network APIs are included.
- Static plan data is treated as public once published.

## Acceptance Criteria

- The website opens to the correct local plan day.
- Day 1 is Monday, June 8, 2026.
- All 189 days through Sunday, December 13, 2026 are present.
- Every day includes useful Tony and Liz instructions.
- Every active workout includes exact actionable detail.
- Every rest day includes explicit recovery guidance.
- Daily navigation and all-days browsing work on phones.
- Dates and measurements use U.S. conventions.
- The production static build deploys to GitHub Pages.
- Tony and Liz can open the permanent website link without running PowerShell.
