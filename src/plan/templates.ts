import type { ActivityDetail, AthletePlan, DailyPlan, PlanContext } from './types';

const activity = (
  name: string,
  prescription: string,
  targetRpe: string,
  rest: string,
  coachingCue: string,
): ActivityDetail => ({ name, prescription, targetRpe, rest, coachingCue });

const easyWarmup = (athlete: string): ActivityDetail[] => [
  activity('Easy cardio', '5 minutes easy walk, bike, row, or treadmill', 'RPE 2-3', 'No rest needed', `${athlete}: breathe easily and finish warmer, not tired.`),
  activity('Dynamic mobility', '2 rounds: 8 leg swings/side, 8 walking lunges, 10 arm circles/side', 'RPE 2', '20 seconds between movements', 'Move through a comfortable range.'),
];

const cooldown = (athlete: string): ActivityDetail[] => [
  activity('Cooldown walk', '5 minutes easy walking', 'RPE 1-2', 'Continuous', `${athlete}: let breathing return to normal.`),
  activity('Mobility', '2 rounds: 30 seconds each calf, hip flexor, glute, and upper back', 'RPE 1-2', 'Move directly between stretches', 'No painful stretching.'),
];

const plan = (summary: string, warmup: ActivityDetail[], main: ActivityDetail[], cool: ActivityDetail[]): AthletePlan => ({
  summary,
  warmup,
  main,
  cooldown: cool,
});

const base = (
  context: PlanContext,
  title: string,
  purpose: string,
  estimatedMinutes: number,
  equipment: string[],
  shared: AthletePlan,
  tony: AthletePlan,
  liz: AthletePlan,
  coachingNotes: string[],
): DailyPlan => ({ ...context, title, purpose, estimatedMinutes, equipment, shared, tony, liz, coachingNotes });

const recoveryPlan = (name: string): AthletePlan =>
  plan(
    'Rest and restore.',
    [activity('Easy reset', '5 minutes relaxed breathing or gentle walking', 'RPE 1', 'Continuous', `${name}: this is optional.`)],
    [activity('Recovery walk + mobility', 'Optional 20-30 minute easy walk, then 2 rounds of 30-second calf, hip flexor, glute, and upper-back stretches', 'RPE 1-2', 'No structured rest', 'Do not make up a missed hard workout today.')],
    [activity('Finish', '2 minutes relaxed breathing', 'RPE 1', 'Continuous', 'Finish feeling better than you started.')],
  );

const taperPlan = (name: string, prescription: string): AthletePlan =>
  plan(
    'Reduce fatigue while keeping movement familiar.',
    [activity('Easy warmup', '5 minutes relaxed walking and gentle mobility', 'RPE 1-2', 'Continuous', `${name}: finish loose and calm.`)],
    [activity('Taper movement', prescription, 'RPE 3-4', 'Full recovery between short efforts', 'Stop while everything still feels easy.')],
    [activity('Cooldown', '5 minutes easy walking, then prepare race gear and hydration', 'RPE 1', 'Continuous', 'Prioritize sleep and familiar food.')],
  );

export const buildMondayHyroxSkill = (context: PlanContext): DailyPlan => {
  const rounds = context.weekNumber < 6 ? 3 : context.weekNumber < 16 ? 4 : 5;
  return base(
    context,
    'HYROX Skill + Strength',
    'Practice efficient station technique and durable lower-body strength together.',
    60,
    ['SkiErg', 'Torque Tank Sled', 'Wall Balls', 'Dumbbells'],
    plan('Warm up and finish together.', easyWarmup('Together'), [activity('Partner movement rehearsal', '2 rounds: 250 meters SkiErg, 30 feet sled push, 8 wall balls each', 'RPE 4', '60 seconds between rounds', 'Use smooth handoffs and calm breathing.')], cooldown('Together')),
    plan('Lead the heavy station work.', easyWarmup('Tony'), [
      activity('Sled push', `${rounds} sets x 50 feet at a challenging but smooth load`, 'RPE 7', '90 seconds between sets', 'Keep ribs stacked and take short powerful steps.'),
      activity('Goblet squat', '4 sets x 8 reps', 'RPE 7', '90 seconds between sets', 'Choose a load that leaves 3 good reps in reserve.'),
      activity('Wall balls', `${rounds} rounds x 15 reps`, 'RPE 6-7', '60 seconds between rounds', 'Breathe every rep and keep the ball path consistent.'),
    ], cooldown('Tony')),
    plan('Build confidence with repeatable technique.', easyWarmup('Liz'), [
      activity('Sled push', `${Math.max(2, rounds - 1)} sets x 30 feet at a controlled load`, 'RPE 6', '90 seconds between sets', 'Use a load that never stalls.'),
      activity('Goblet squat', '3 sets x 8 reps', 'RPE 6', '90 seconds between sets', 'Use a comfortable depth and steady tempo.'),
      activity('Wall balls', `${Math.max(2, rounds - 1)} rounds x 8 reps to a comfortable target`, 'RPE 6', '60-90 seconds between rounds', 'Stop each set before form changes.'),
    ], cooldown('Liz')),
    ['Technique is more important than load.', 'Tony takes the larger share of heavy station work.'],
  );
};

export const buildTuesdayEngine = (context: PlanContext): DailyPlan => {
  const tonyMiles = Math.min(6, 3 + Math.floor((context.weekNumber - 1) / 7));
  const runMinutes = Math.min(8, 1 + Math.floor(context.weekNumber / 4));
  return base(
    context,
    'Easy Run + Joint Engine',
    'Build aerobic durability without accumulating heavy fatigue.',
    65,
    ['Treadmill', 'SkiErg', 'RowErg'],
    plan('Complete the engine intervals together.', easyWarmup('Together'), [activity('Alternating engine intervals', '4 rounds: 3 minutes SkiErg, 3 minutes RowErg, 2 minutes easy walk', 'RPE 5-6', 'The 2-minute walk is recovery', 'Stay conversational and finish each round evenly.')], cooldown('Together')),
    plan(`${tonyMiles}-mile easy run before the shared engine session.`, easyWarmup('Tony'), [activity('Easy run', `${tonyMiles} miles at conversational effort`, 'RPE 4', 'Continuous; walk 60 seconds only if needed', 'Keep the first mile slower than the last mile.')], cooldown('Tony')),
    plan('Use a confidence-first run/walk progression.', easyWarmup('Liz'), [activity('Run/walk progression', `6 rounds: ${runMinutes} minute${runMinutes === 1 ? '' : 's'} easy running, 2 minutes walking`, 'RPE 4-5', 'The 2-minute walk is recovery', 'Running pace must feel sustainable and relaxed.')], cooldown('Liz')),
    ['No racing during engine intervals.', 'Liz may incline-walk instead of running.'],
  );
};

export const buildWednesdayStrength = (context: PlanContext): DailyPlan =>
  base(
    context,
    'Run + Joint Strength',
    'Strengthen the movement patterns that support running and HYROX.',
    70,
    ['Barbell', 'Dumbbells', 'Sandbag'],
    plan('Lift together after Tony completes his easy run.', easyWarmup('Together'), [activity('Carry finisher', '4 rounds: 100 feet farmer carry, 8 controlled sandbag lunges/leg', 'RPE 6', '60 seconds between rounds', 'Keep posture tall and steps controlled.')], cooldown('Together')),
    plan('Easy run plus strength.', easyWarmup('Tony'), [
      activity('Easy run', `${Math.min(7, 4 + Math.floor(context.weekNumber / 7))} miles conversational`, 'RPE 4', 'Continuous', 'Keep this run easy enough to lift well afterward.'),
      activity('Barbell deadlift', '4 sets x 5 reps', 'RPE 7', '2 minutes between sets', 'Use a load with 3 strong reps in reserve.'),
      activity('Dumbbell bench press', '4 sets x 8 reps', 'RPE 7', '90 seconds between sets', 'Keep shoulders controlled.'),
      activity('Rear-foot elevated split squat', '3 sets x 8 reps/leg', 'RPE 7', '90 seconds between sets', 'Use a stable range of motion.'),
    ], cooldown('Tony')),
    plan('Technique-first full-body strength.', easyWarmup('Liz'), [
      activity('Kettlebell or dumbbell deadlift', '3 sets x 8 reps', 'RPE 6', '90 seconds between sets', 'Keep the weight close and back neutral.'),
      activity('Dumbbell bench press', '3 sets x 8 reps', 'RPE 6', '90 seconds between sets', 'Choose a load that moves smoothly.'),
      activity('Supported split squat', '3 sets x 6 reps/leg', 'RPE 6', '90 seconds between sets', 'Hold support for balance as needed.'),
    ], cooldown('Liz')),
    ['Never grind a strength rep.', 'Reduce load before reducing movement quality.'],
  );

export const buildThursdayHyroxCircuit = (context: PlanContext): DailyPlan => {
  const rounds = context.weekNumber < 8 ? 3 : context.weekNumber < 18 ? 4 : 5;
  return base(
    context,
    context.weekNumber >= 18 && context.weekNumber <= 22 ? 'HYROX Doubles Simulation' : 'HYROX Circuit',
    'Connect running, stations, transitions, and doubles communication.',
    65,
    ['Treadmill', 'SkiErg', 'Sled', 'RowErg', 'Sandbag', 'Wall Balls'],
    plan('Start, transition, and cool down together.', easyWarmup('Together'), [activity('Doubles circuit', `${rounds} rounds: run, station, then planned partner handoff`, 'RPE 6-7', '2 minutes between rounds', 'Agree on division of work before each round.')], cooldown('Together')),
    plan('Take the larger heavy-station share.', easyWarmup('Tony'), [activity('Tony circuit share', `${rounds} rounds: 0.5-mile run, 500 meters SkiErg or RowErg, 50 feet sled push, 12 wall balls`, 'RPE 7', '2 minutes between rounds', 'Keep the run controlled so stations remain strong.')], cooldown('Tony')),
    plan('Protect consistent movement and breathing.', easyWarmup('Liz'), [activity('Liz circuit share', `${rounds} rounds: 0.25-mile run/walk, 250 meters SkiErg or RowErg, 30 feet light sled push, 8 wall balls`, 'RPE 6', '2-3 minutes between rounds', 'Use planned breaks before form changes.')], cooldown('Liz')),
    ['This is practice, not a race.', 'Stop if either athlete cannot maintain clean mechanics.'],
  );
};

export const buildFridayRecovery = (context: PlanContext): DailyPlan =>
  base(context, 'Rest + Recovery', 'Absorb training and restore movement.', 30, [], recoveryPlan('Together'), recoveryPlan('Tony'), recoveryPlan('Liz'), ['Do not make up missed hard workouts today.']);

export const buildSaturdaySteady = (context: PlanContext): DailyPlan => {
  const miles = Math.min(9, 5 + Math.floor(context.weekNumber / 7));
  return base(context, 'Steady Run + Optional Zone 2', 'Build durable aerobic work before Sunday long-run practice.', 75, ['Running shoes', 'Treadmill optional'], recoveryPlan('Together'), plan(`${miles}-mile steady run.`, easyWarmup('Tony'), [activity('Steady run', `${miles} miles at a controlled steady effort`, 'RPE 5-6', 'Continuous', 'Finish feeling capable of another mile.')], cooldown('Tony')), plan('Optional easy aerobic session.', easyWarmup('Liz'), [activity('Optional Zone 2', '25-45 minutes easy walk, incline walk, bike, or run/walk', 'RPE 3-4', 'Continuous; short breaks allowed', 'Skip this session if tired.')], cooldown('Liz')), ['Tony stays controlled to protect Sunday.', 'Liz may take a full rest day.']);
};

const longRunMiles = [5, 6, 7, 5, 8, 9, 10, 7, 11, 12, 13, 9, 14, 15, 16, 11, 17, 18, 14, 10, 8, 12, 16, 10, 7, 7];
export const buildSundayLongRun = (context: PlanContext): DailyPlan => {
  const miles = longRunMiles[Math.min(context.weekNumber - 1, longRunMiles.length - 1)]!;
  return base(context, 'Tony Long Run', 'Build 50K endurance and fueling confidence.', Math.round(miles * 13), ['Running shoes', 'Water', 'Fuel'], recoveryPlan('Together'), plan(`${miles}-mile long run.`, easyWarmup('Tony'), [activity('Long run', `${miles} miles at easy, sustainable effort; walk aid/fueling breaks as planned`, 'RPE 4-5', 'Continuous with planned short walk breaks', 'Start slower than feels necessary and keep fueling consistent.')], cooldown('Tony')), recoveryPlan('Liz'), ['Tony: practice hydration every 20-30 minutes and fueling every 30-40 minutes once runs exceed 75 minutes.', 'Liz supports recovery and takes an easy day.']);
};

export const buildHyroxRaceDay = (context: PlanContext): DailyPlan =>
  base(context, 'HYROX Mixed Doubles Dallas', 'Race together with calm pacing and clear communication.', 100, ['Race kit', 'Shoes', 'Fuel', 'Water'], plan('Race together.', easyWarmup('Together'), [activity('HYROX Mixed Doubles race', '8 x 1-kilometer runs with all 8 HYROX stations; use planned handoffs', 'RPE 7-9', 'Use transitions and partner work as recovery', 'Stay controlled through the first half and communicate before every handoff.')], cooldown('Together')), plan('Take the larger share of heavy stations.', easyWarmup('Tony'), [activity('Race role', 'Lead sled push, sled pull, carries, and heavier station work while matching Liz on runs', 'RPE 7-9', 'Use partner handoffs as recovery', 'Do not surge away from Liz on runs.')], cooldown('Tony')), plan('Prioritize consistent movement.', easyWarmup('Liz'), [activity('Race role', 'Maintain steady runs and repeatable station chunks; call handoffs before form changes', 'RPE 7-8', 'Use Tony work periods as recovery', 'Consistency beats heroic early efforts.')], cooldown('Liz')), ['Nothing new on race day.', 'Start patient and finish together.']);

export const buildHyroxTaperDay = (context: PlanContext): DailyPlan =>
  base(context, 'HYROX Taper + Easy Movement', 'Taper for HYROX by shedding fatigue and rehearsing only easy movement.', 35, ['Race shoes', 'Race kit'], taperPlan('Together', '2 rounds: 5-minute easy walk, 3 x 20-second relaxed pickups, and 5 easy wall balls'), taperPlan('Tony', '20 minutes easy walking or jogging with 3 x 20-second relaxed pickups'), taperPlan('Liz', '20 minutes easy walking or run/walk with 3 x 20-second relaxed pickups'), ['No strength work or hard stations.', 'Finish eager to race.']);

export const buildPostHyroxRecoveryDay = (context: PlanContext): DailyPlan =>
  base(context, 'Post-HYROX Recovery', 'Recover from HYROX before resuming 50K preparation.', 30, [], recoveryPlan('Together'), recoveryPlan('Tony'), recoveryPlan('Liz'), ['No hard training or make-up sessions.', 'Resume running only when normal walking feels comfortable.']);

export const buildFiftyKTaperDay = (context: PlanContext): DailyPlan => {
  const isShakeout = context.date === '2026-12-12';
  return base(context, isShakeout ? '50K Shakeout + Rest' : '50K Taper + Easy Movement', 'Taper for the 50K by protecting fresh legs and normal routines.', isShakeout ? 25 : 40, ['Running shoes', 'Race kit'], recoveryPlan('Together'), taperPlan('Tony', isShakeout ? '10-15 minute easy shakeout jog, then 4 x 15-second relaxed strides' : '20-30 minutes easy running or walking; include 4 x 20-second relaxed strides only if legs feel good'), recoveryPlan('Liz'), ['No hard strength or HYROX work.', 'Use only familiar shoes, food, and hydration.']);
};

export const buildFiftyKRaceDay = (context: PlanContext): DailyPlan =>
  base(context, 'BMW Dallas 50K Race Day', 'Complete the 50K with patient pacing, consistent fueling, and planned walk breaks.', 480, ['Race kit', 'Running shoes', 'Water', 'Fuel'], recoveryPlan('Together'), plan('Complete the 50K.', easyWarmup('Tony'), [activity('BMW Dallas 50K', '31.1 miles at sustainable effort with planned aid-station walk breaks', 'RPE 5-7', 'Use planned aid-station walks as recovery', 'Start slower than feels necessary and fuel from the first hour.')], cooldown('Tony')), recoveryPlan('Liz'), ['Nothing new on race day.', 'Stop and seek medical help for severe pain, confusion, chest pain, or concerning symptoms.']);
