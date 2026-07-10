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

const completedPlan = (): AthletePlan =>
  plan(
    'Completed lower-body strength and sled work.',
    [activity('Warmup', 'Completed before the session', 'RPE as performed', 'As performed', 'No additional work required.')],
    [
      activity('Back squat', 'Completed on June 8; sets, reps, and load as performed', 'RPE as performed', 'As performed', 'Treat this as the week\'s primary squat work.'),
      activity('Single-leg RDL', 'Completed on June 8; sets, reps, and load as performed', 'RPE as performed', 'As performed', 'Treat this as the week\'s primary single-leg hinge work.'),
      activity('Bulgarian split squat', 'Completed on June 8; sets, reps, and load as performed', 'RPE as performed', 'As performed', 'No additional split-squat volume is needed this week.'),
      activity('Sled push', 'Completed on June 8; distance and load as performed', 'RPE as performed', 'As performed', 'Allow the legs to recover before the next sled session.'),
      activity('Sled pull', 'Completed on June 8; distance and load as performed', 'RPE as performed', 'As performed', 'Allow the posterior chain to recover.'),
    ],
    [activity('Recovery', 'Easy walking, hydration, and normal post-workout recovery', 'RPE 1-2', 'Continuous', 'Finish the day without adding lower-body volume.')],
  );

export const buildCompletedLowerBodySledDay = (context: PlanContext): DailyPlan =>
  base(
    context,
    'Completed Lower Body + Sled Session',
    'Record the completed session and use it to guide the rest of the week.',
    60,
    ['Barbell', 'Dumbbells', 'Sled'],
    recoveryPlan('Together'),
    completedPlan(),
    completedPlan(),
    ['This completed session replaces the originally scheduled lower-body and sled work.', 'Do not repeat heavy lower-body work on the following two days.'],
  );

export const buildUpperBodyCoreRecoveryDay = (context: PlanContext): DailyPlan => {
  const athletePlan = plan(
    'Train upper body, core, and HYROX engine while the legs recover from heavy strength work.',
    easyWarmup('Both'),
    [
      activity('HYROX engine intervals', '5 rounds: 500 meters SkiErg, 500 meters RowErg, then 60 seconds easy walking', 'RPE 6-7', '90 seconds between rounds', 'Hold repeatable splits and finish the final round strong, not exhausted.'),
      activity('Dumbbell bench press', '4 sets x 8 reps at a challenging but controlled load', 'RPE 7', '90 seconds between sets', 'Leave 3 good reps in reserve.'),
      activity('Chest-supported dumbbell row', '4 sets x 10 reps', 'RPE 7', '75 seconds between sets', 'Keep the torso supported and shoulders controlled.'),
      activity('Half-kneeling single-arm press', '3 sets x 8 reps/side', 'RPE 6-7', '75 seconds between sets', 'Brace the trunk without pushing through the legs.'),
      activity('Pallof press + dead bug', '3 rounds: 10 Pallof presses/side, then 6 slow dead bugs/side', 'RPE 5-6', '45 seconds between rounds', 'Keep every rep controlled and breathe normally.'),
    ],
    cooldown('Both'),
  );
  return base(
    context,
    'Upper Body + HYROX Engine',
    'Complete a substantial training session without repeating yesterday\'s heavy lower-body and sled work.',
    70,
    ['SkiErg', 'RowErg', 'Dumbbells', 'Cable or resistance band', 'Exercise mat'],
    plan('Warm up and establish engine rhythm together.', easyWarmup('Together'), [activity('Engine primer', '2 rounds: 250 meters easy SkiErg, 250 meters easy RowErg, 60 seconds walking', 'RPE 3-4', '30 seconds between rounds', 'Use smooth strokes and relaxed breathing.')], cooldown('Together')),
    athletePlan,
    athletePlan,
    ['Train with intent, but no running, sled work, squats, lunges, or hinging today.', 'Reduce load only if yesterday\'s soreness affects setup or bracing.'],
  );
};

export const buildAerobicRecoveryMobilityDay = (context: PlanContext): DailyPlan => {
  const athletePlan = plan(
    'Restore the legs with low-impact aerobic work and mobility.',
    [activity('Easy warmup', '5 minutes relaxed walking or cycling', 'RPE 1-2', 'Continuous', 'Start easier than feels necessary.')],
    [
      activity('Low-impact aerobic recovery', '25-35 minutes easy bike, walk, SkiErg, or RowErg', 'RPE 3', 'Continuous; short breaks allowed', 'Keep breathing conversational throughout.'),
      activity('Recovery mobility', '2 rounds: 30 seconds each calf, hip flexor, glute, hamstring, and upper back', 'RPE 1-2', 'Move directly between stretches', 'Use a comfortable, pain-free range.'),
    ],
    [activity('Relaxed breathing', '3 minutes easy breathing', 'RPE 1', 'Continuous', 'Finish feeling better than you started.')],
  );
  return base(context, 'Aerobic Recovery + Mobility', 'Recover from Monday while maintaining easy aerobic movement.', 45, ['Bike, treadmill, SkiErg, or RowErg'], athletePlan, athletePlan, athletePlan, ['No lower-body strength work today.', 'Choose walking or cycling if the legs remain sore.']);
};

export const buildHyroxTechniqueNoSledDay = (context: PlanContext): DailyPlan => {
  const athletePlan = plan(
    'Practice HYROX engine pacing and transitions without heavy leg work.',
    easyWarmup('Both'),
    [
      activity('HYROX engine technique', '4 rounds: 500 meters SkiErg, 500 meters RowErg, then 60 seconds easy walking', 'RPE 5-6', '90 seconds between rounds', 'Keep every round smooth and repeatable.'),
      activity('Farmer carry technique', '4 sets x 100 feet at a moderate load', 'RPE 5-6', '60 seconds between sets', 'Stay tall and use short controlled steps.'),
      activity('Transition rehearsal', '4 rounds: practice calm equipment entry, exit, and partner handoff', 'RPE 3', '30 seconds between rounds', 'Communicate before every handoff.'),
    ],
    cooldown('Both'),
  );
  return base(context, 'HYROX Technique - No Sleds', 'Practice pacing and transitions while protecting the recovering legs.', 55, ['SkiErg', 'RowErg', 'Dumbbells or kettlebells'], athletePlan, athletePlan, athletePlan, ['No sleds, squats, lunges, or hard running today.', 'Keep the session technical rather than competitive.']);
};

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
  const lizMiles = context.weekNumber < 4 ? 2 : context.weekNumber < 10 ? 2.5 : 3;
  return base(
    context,
    'Easy Run + Joint Engine',
    'Build aerobic durability without accumulating heavy fatigue.',
    65,
    ['Treadmill', 'SkiErg', 'RowErg'],
    plan('Complete the engine intervals together.', easyWarmup('Together'), [activity('Alternating engine intervals', '4 rounds: 3 minutes SkiErg, 3 minutes RowErg, 2 minutes easy walk', 'RPE 5-6', 'The 2-minute walk is recovery', 'Stay conversational and finish each round evenly.')], cooldown('Together')),
    plan(`${tonyMiles}-mile easy run before the shared engine session.`, easyWarmup('Tony'), [activity('Easy run', `${tonyMiles} miles at conversational effort`, 'RPE 4', 'Continuous; walk 60 seconds only if needed', 'Keep the first mile slower than the last mile.')], cooldown('Tony')),
    plan('Use Liz\'s consistent treadmill base for a modest weekday run.', easyWarmup('Liz'), [activity('Easy treadmill run', `${lizMiles} miles at easy conversational effort; use short walk breaks only if needed`, 'RPE 4-5', 'Continuous; optional 60-second walk breaks', 'Keep this easier than the recent 3-mile treadmill runs so the engine work stays smooth.')], cooldown('Liz')),
    ['No racing during engine intervals.', 'Liz may reduce the treadmill run by 0.5 mile if legs feel heavy.'],
  );
};

export const buildWednesdayStrength = (context: PlanContext): DailyPlan =>
  context.weekNumber >= 18
    ? base(
      context,
      'HYROX Strength Maintenance',
      'Keep strength patterns sharp without dulling Thursday simulation quality.',
      50,
      ['Dumbbells', 'Sandbag', 'Exercise mat'],
      plan('Move well and leave fresh.', easyWarmup('Together'), [activity('Transition carry primer', '3 rounds: 80 feet farmer carry, 6 controlled sandbag lunges/leg', 'RPE 5-6', '60 seconds between rounds', 'Stay smooth and stop before leg fatigue builds.')], cooldown('Together')),
      plan('Maintain strength without heavy leg fatigue.', easyWarmup('Tony'), [
        activity('Easy aerobic primer', '20 minutes easy bike, walk, or jog', 'RPE 3-4', 'Continuous', 'Finish fresher than a normal run day.'),
        activity('Dumbbell bench press', '3 sets x 8 reps', 'RPE 6', '75 seconds between sets', 'Move every rep cleanly.'),
        activity('Chest-supported row', '3 sets x 10 reps', 'RPE 6', '75 seconds between sets', 'Keep shoulders controlled.'),
        activity('Core brace circuit', '3 rounds: 10 Pallof presses/side, 20-second side plank/side', 'RPE 5', '45 seconds between rounds', 'Brace without creating leg fatigue.'),
      ], cooldown('Tony')),
      plan('Maintain strength without heavy leg fatigue.', easyWarmup('Liz'), [
        activity('Easy aerobic primer', '20 minutes easy bike, walk, or run/walk', 'RPE 3-4', 'Continuous', 'Finish fresher than a normal run day.'),
        activity('Dumbbell bench press', '3 sets x 8 reps', 'RPE 6', '75 seconds between sets', 'Move every rep cleanly.'),
        activity('Chest-supported row', '3 sets x 10 reps', 'RPE 6', '75 seconds between sets', 'Keep shoulders controlled.'),
        activity('Core brace circuit', '3 rounds: 10 Pallof presses/side, 20-second side plank/side', 'RPE 5', '45 seconds between rounds', 'Brace without creating leg fatigue.'),
      ], cooldown('Liz')),
      ['No heavy hinging, squatting, or split-squat work during HYROX Peak Wednesdays.', 'Thursday simulation quality matters more than adding fatigue today.'],
    )
    : base(
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
        activity('Optional easy treadmill run add-on', '1.5-mile easy treadmill run before lifting', 'RPE 3-4', 'Continuous; skip if legs feel heavy', 'This is a small aerobic add-on, not a workout to chase.'),
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
    plan('Start, transition, and cool down together.', easyWarmup('Together'), [activity('Doubles circuit', `${rounds} rounds: both athletes run before each station round, complete the listed station as one team total, then use a planned partner handoff`, 'RPE 6-7', '2 minutes between rounds', 'Agree on division of work before each round.')], cooldown('Together')),
    plan('Practice race-specific stations under controlled fatigue.', easyWarmup('Tony'), [activity('HYROX circuit share', `${rounds} rounds: both athletes complete the 0.5-mile run before each station round, then split this team total however needed: 500 meters SkiErg or RowErg, 50 feet sled push or sled pull, 8 burpee broad jumps, 12 wall balls`, 'RPE 7', '2 minutes between rounds', 'Keep the run controlled and split station reps before form breaks.')], cooldown('Tony')),
    plan('Practice race-specific stations under controlled fatigue.', easyWarmup('Liz'), [activity('HYROX circuit share', `${rounds} rounds: complete the HYROX-specific run/walk before each station round, then split this team total however needed: 500 meters SkiErg or RowErg, 50 feet light sled push or sled pull, 8 burpee broad jumps, 12 wall balls`, 'RPE 6', '2-3 minutes between rounds', 'Use planned breaks and split station reps before form changes.')], cooldown('Liz')),
    ['This is practice, not a race.', 'Stop if either athlete cannot maintain clean mechanics.'],
  );
};

export const buildFridayRecovery = (context: PlanContext): DailyPlan =>
  base(context, 'Rest + Recovery', 'Absorb training and restore movement.', 30, [], recoveryPlan('Together'), recoveryPlan('Tony'), recoveryPlan('Liz'), ['Do not make up missed hard workouts today.']);

export const buildHyroxDeloadSkill = (context: PlanContext): DailyPlan => {
  const athletePlan = plan(
    'Reduce load while keeping HYROX movement patterns familiar.',
    easyWarmup('Both'),
    [
      activity('Technique flow', '3 rounds: 250 meters SkiErg, 30 feet easy sled push, 8 easy wall balls', 'RPE 4-5', '90 seconds between rounds', 'Move crisply and stop far from fatigue.'),
      activity('Mobility strength', '2 rounds: 8 goblet squats, 8 band rows, 20-second dead bug hold/side', 'RPE 4', '45 seconds between rounds', 'Use this as practice, not training stress.'),
    ],
    cooldown('Both'),
  );
  return base(context, 'HYROX Deload Skill', 'Back off volume while preserving station rhythm and confidence.', 45, ['SkiErg', 'Sled', 'Wall Ball', 'Dumbbells or band'], athletePlan, athletePlan, athletePlan, ['Deload week: leave the gym fresher than usual.', 'No heavy loading or hard intervals today.']);
};

export const buildHyroxDeloadCircuit = (context: PlanContext): DailyPlan => {
  const athletePlan = plan(
    'Practice transitions without accumulating heavy fatigue.',
    easyWarmup('Both'),
    [
      activity('Easy station circuit', '3 rounds: 400 meters easy run or walk, 250 meters RowErg, 30 feet light sled pull, 6 burpee broad jumps, 8 wall balls', 'RPE 5', '2 minutes between rounds', 'Keep breathing controlled and mechanics clean.'),
    ],
    cooldown('Both'),
  );
  return base(context, 'HYROX Deload Circuit', 'Keep race movements fresh while cutting circuit intensity.', 45, ['Treadmill', 'RowErg', 'Sled', 'Wall Ball'], athletePlan, athletePlan, athletePlan, ['Deload week: no racing the clock.', 'Use light sled loads and perfect transitions.']);
};

export const buildSaturdayDeloadZone2 = (context: PlanContext): DailyPlan => {
  const athletePlan = plan(
    'Keep aerobic work easy and short.',
    easyWarmup('Both'),
    [activity('Easy Zone 2', '35-40 minutes easy walk, incline walk, bike, or relaxed run/walk', 'RPE 3-4', 'Continuous; short breaks allowed', 'Stay conversational from start to finish.')],
    cooldown('Both'),
  );
  return base(context, 'Deload Zone 2', 'Maintain aerobic rhythm without adding fatigue before Sunday.', 50, ['Running shoes, treadmill, or bike'], athletePlan, athletePlan, athletePlan, ['Deload week: cap the session even if you feel good.', 'Save the harder work for next week.']);
};

export const buildHyroxDeloadEndurance = (context: PlanContext): DailyPlan => {
  const athletePlan = plan(
    'Recover while touching the HYROX station menu lightly.',
    easyWarmup('Both'),
    [
      activity('Light station sampler', '2 rounds: 200 meters SkiErg, 200 meters RowErg, 40 feet farmer carry, 6 sandbag lunges/leg, 8 wall balls', 'RPE 4-5', '90 seconds between rounds', 'Move smoothly and finish wanting more.'),
      activity('Easy mobility', '2 rounds: 30 seconds each calves, hips, glutes, lats, and upper back', 'RPE 1-2', 'Move directly between stretches', 'No painful stretching.'),
    ],
    cooldown('Both'),
  );
  return base(context, 'HYROX Deload Endurance', 'Absorb training while maintaining station confidence.', 45, ['SkiErg', 'RowErg', 'Dumbbells or kettlebells', 'Sandbag', 'Wall Ball'], athletePlan, athletePlan, athletePlan, ['Deload week: this is deliberately lighter.', 'Leave with better movement quality than you started.']);
};

export const buildSaturdaySteady = (context: PlanContext): DailyPlan => {
  const miles = Math.min(9, 5 + Math.floor(context.weekNumber / 7));
  return base(context, 'Steady Run + Optional Zone 2', 'Build durable aerobic work before Sunday HYROX station practice.', 75, ['Running shoes', 'Treadmill optional'], recoveryPlan('Together'), plan(`${miles}-mile steady run.`, easyWarmup('Tony'), [activity('Steady run', `${miles} miles at a controlled steady effort`, 'RPE 5-6', 'Continuous', 'Finish feeling capable of another mile.')], cooldown('Tony')), plan('Optional easy aerobic session.', easyWarmup('Liz'), [activity('Optional Zone 2', '25-45 minutes easy walk, incline walk, bike, or run/walk', 'RPE 3-4', 'Continuous; short breaks allowed', 'Skip this session if tired.')], cooldown('Liz')), ['Both athletes stay controlled to protect Sunday.', 'Either athlete may take a full rest day if fatigue is high.']);
};

export const buildSundayHyroxEndurance = (context: PlanContext): DailyPlan => {
  const rounds = context.weekNumber < 6 ? 3 : context.weekNumber < 14 ? 4 : 5;
  const runDistance = context.weekNumber < 10 ? '600 meters' : '1 kilometer';
  const stationVolume = context.weekNumber < 14 ? 'controlled' : 'race-focused';
  const athletePlan = plan(
    'Build HYROX endurance with station skills under manageable fatigue.',
    easyWarmup('Both'),
    [
      activity('HYROX run repeats', `${rounds} rounds: ${runDistance} easy-to-moderate run, then 90 seconds walking`, 'RPE 5-6', '90 seconds between rounds', 'Keep every run repeat smooth enough to speak in short sentences.'),
      activity('Station technique circuit', `${rounds} rounds: 250 meters SkiErg, 250 meters RowErg, 40 feet sled pull, 40 feet farmer carry, 8 sandbag lunges/leg, 10 wall balls`, 'RPE 6', '90 seconds between rounds', `Move at a ${stationVolume} pace and stop before form breaks.`),
      activity('Burpee broad jump practice', '4 sets x 6 reps with a step-down option as needed', 'RPE 5-6', '60 seconds between sets', 'Land softly, stand tall, and keep reps repeatable.'),
    ],
    cooldown('Both'),
  );
  return base(context, 'HYROX Endurance + Stations', 'Build race-specific aerobic capacity and confidence across the full HYROX station menu.', 75, ['Treadmill or running route', 'SkiErg', 'RowErg', 'Sled', 'Dumbbells or kettlebells', 'Sandbag', 'Wall Ball'], athletePlan, athletePlan, athletePlan, ['Keep this controlled; Thursday remains the harder simulation day.', 'Practice calm transitions and station setup.']);
};

export const buildHyroxDressRehearsal = (context: PlanContext): DailyPlan => {
  const athletePlan = plan(
    'Practice the full race sequence at controlled effort.',
    easyWarmup('Both'),
    [
      activity('Controlled HYROX rehearsal', '8 rounds at controlled RPE 6-7: 1 kilometer run, then one station in race order: 1000 meters SkiErg, 50 meters Sled push, 50 meters Sled pull, 80 meters Burpee broad jump, 1000 meters RowErg, 200 meters Farmer carry, 100 meters Sandbag lunges, 100 Wall balls. Split station work as planned for doubles.', 'RPE 6-7', 'Use transitions and partner work as recovery', 'Move smoothly, communicate early, and finish knowing you could do more.'),
    ],
    cooldown('Both'),
  );
  return base(context, 'Controlled HYROX Dress Rehearsal', 'Run the full HYROX order once at sub-race effort to test pacing, transitions, and station division.', 95, ['Race shoes', 'SkiErg', 'Sled', 'RowErg', 'Dumbbells or kettlebells', 'Sandbag', 'Wall Ball'], athletePlan, athletePlan, athletePlan, ['This is not a time trial.', 'Record what station divisions and pacing felt sustainable.']);
};

export const buildHyroxRaceDay = (context: PlanContext): DailyPlan => {
  const racePlan = plan(
    'Race together with the official HYROX Mixed Doubles structure.',
    easyWarmup('Together'),
    [
      activity('HYROX Mixed Doubles race', '8 x 1-kilometer runs with all 8 HYROX stations; run together and split each station as one team total', 'RPE 7-9', 'Use transitions and partner work as recovery', 'Stay controlled through the first half and communicate before every handoff.'),
      activity('Station execution', 'Use planned station chunks for sled push, sled pull, carries, lunges, and wall balls', 'RPE 7-9', 'Partner working time is the other partner\'s recovery', 'Call handoffs before form breaks.'),
    ],
    cooldown('Together'),
  );
  return base(context, 'HYROX Mixed Doubles Dallas', 'Race together with calm pacing and clear communication.', 100, ['Race kit', 'Shoes', 'Fuel', 'Water'], racePlan, racePlan, racePlan, ['Nothing new on race day.', 'Start patient and finish together.']);
};

export const buildHyroxTaperDay = (context: PlanContext): DailyPlan => {
  if (['2026-11-10', '2026-11-13', '2026-11-16'].includes(context.date)) {
    return base(context, 'HYROX Taper Rest', 'Rest during the HYROX taper so fatigue drops before race day.', 15, [], recoveryPlan('Together'), recoveryPlan('Tony'), recoveryPlan('Liz'), ['No make-up training today.', 'Prioritize sleep, hydration, and normal meals.']);
  }
  if (context.date === '2026-11-17') {
    return base(context, 'HYROX Race Primer', 'Easy race primer to stay sharp without adding fatigue.', 25, ['Race shoes', 'Race kit'], taperPlan('Together', '2 rounds: 5-minute easy walk, 2 x 20-second relaxed pickups, 5 easy wall balls, and one calm handoff rehearsal'), taperPlan('Tony', '10-15 minutes easy walking or jogging with 2 x 20-second relaxed pickups'), taperPlan('Liz', '10-15 minutes easy walking or run/walk with 2 x 20-second relaxed pickups'), ['Pack race gear today.', 'Stop while everything feels easy.']);
  }
  return base(context, 'HYROX Taper + Easy Movement', 'Taper for HYROX by shedding fatigue and rehearsing only easy movement.', 30, ['Race shoes', 'Race kit'], taperPlan('Together', '2 rounds: 5-minute easy walk, 3 x 20-second relaxed pickups, and 5 easy wall balls'), taperPlan('Tony', '20 minutes easy walking or jogging with 3 x 20-second relaxed pickups'), taperPlan('Liz', '20 minutes easy walking or run/walk with 3 x 20-second relaxed pickups'), ['No strength work or hard stations.', 'Finish eager to race.']);
};
