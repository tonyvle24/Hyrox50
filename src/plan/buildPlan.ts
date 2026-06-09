import { addDaysToKey, getPlanDayNumber, PLAN_END, PLAN_START } from '../utils/dates';
import { phaseForDate } from './phases';
import {
  buildAerobicRecoveryMobilityDay,
  buildCompletedLowerBodySledDay,
  buildFridayRecovery,
  buildFiftyKRaceDay,
  buildFiftyKTaperDay,
  buildHyroxRaceDay,
  buildHyroxTaperDay,
  buildMondayHyroxSkill,
  buildSaturdaySteady,
  buildSundayLongRun,
  buildThursdayHyroxCircuit,
  buildTuesdayEngine,
  buildUpperBodyCoreRecoveryDay,
  buildWednesdayStrength,
  buildPostHyroxRecoveryDay,
} from './templates';
import type { ActivityDetail, AthletePlan, DailyPlan, DateKey, PlanContext } from './types';

const builders = [
  buildMondayHyroxSkill,
  buildTuesdayEngine,
  buildWednesdayStrength,
  buildThursdayHyroxCircuit,
  buildFridayRecovery,
  buildSaturdaySteady,
  buildSundayLongRun,
];

const forBoth = (text: string): string =>
  text
    .replace(/\bTony and Liz\b/g, 'Both athletes')
    .replace(/\bTony's\b|\bLiz's\b/g, "Each athlete's")
    .replace(/\bTony:\s*practice\b/g, 'Practice')
    .replace(/\bLiz supports recovery\b/g, 'Support recovery')
    .replace(/\bTony takes\b|\bLiz takes\b/g, 'Both athletes take')
    .replace(/\bTony stays\b|\bLiz stays\b/g, 'Both athletes stay')
    .replace(/\bTony completes\b|\bLiz completes\b/g, 'both athletes complete')
    .replace(/\bTony:\s*/g, 'Both: ')
    .replace(/\bLiz:\s*/g, 'Both: ')
    .replace(/\bhis\b|\bher\b/g, 'their')
    .replace(/\bTony\b|\bLiz\b/g, 'Both athletes');

const activityForBoth = (detail: ActivityDetail): ActivityDetail => ({
  ...detail,
  name: forBoth(detail.name),
  prescription: forBoth(detail.prescription),
  rest: forBoth(detail.rest),
  coachingCue: forBoth(detail.coachingCue),
});

const planForBoth = (athletePlan: AthletePlan): AthletePlan => ({
  summary: forBoth(athletePlan.summary),
  warmup: athletePlan.warmup.map(activityForBoth),
  main: athletePlan.main.map(activityForBoth),
  cooldown: athletePlan.cooldown.map(activityForBoth),
});

const isRunActivity = (detail: ActivityDetail): boolean =>
  /\brun\b|\brunning\b|\brun\/walk\b|\bjog\b|\bjogging\b|zone 2/i.test(`${detail.name} ${detail.prescription}`);

const equalizeAthleteWorkouts = (day: DailyPlan): DailyPlan => {
  const athletePlan = planForBoth(day.tony);
  const originalLizPlan = planForBoth(day.liz);
  const isFiftyKOnlyDay = /\bLong Run\b|\b50K\b/.test(day.title);
  const isStandaloneRunDay = /Easy Run|Run \+ Joint Strength|Steady Run/.test(day.title);
  const lizPlan = isFiftyKOnlyDay
    ? originalLizPlan
    : isStandaloneRunDay
      ? {
        ...athletePlan,
        summary:
          athletePlan.main.some(isRunActivity) || originalLizPlan.main.some(isRunActivity)
            ? originalLizPlan.summary
            : athletePlan.summary,
        main: [
          ...originalLizPlan.main.filter(isRunActivity),
          ...athletePlan.main.filter((detail) => !isRunActivity(detail)),
        ],
        }
      : athletePlan;
  return {
    ...day,
    title: day.title === 'Tony Long Run' ? 'Long Run + HYROX Recovery' : forBoth(day.title),
    purpose: forBoth(day.purpose),
    shared: planForBoth(day.shared),
    tony: athletePlan,
    liz: lizPlan,
    coachingNotes: day.coachingNotes.map(forBoth),
  };
};

export const buildTrainingPlan = (): DailyPlan[] => {
  const result: DailyPlan[] = [];
  let date: DateKey = PLAN_START;
  while (date <= PLAN_END) {
    const context: PlanContext = {
      date,
      dayNumber: getPlanDayNumber(date),
      weekNumber: Math.floor((getPlanDayNumber(date) - 1) / 7) + 1,
      phase: phaseForDate(date),
    };
    let day: DailyPlan;
    if (date === '2026-06-08') day = buildCompletedLowerBodySledDay(context);
    else if (date === '2026-06-09') day = buildUpperBodyCoreRecoveryDay(context);
    else if (date === '2026-06-10') day = buildAerobicRecoveryMobilityDay(context);
    else if (date === '2026-06-11') {
      const circuit = buildThursdayHyroxCircuit(context);
      day = {
        ...circuit,
        coachingNotes: [...circuit.coachingNotes, 'Use a controlled, moderate sled load because heavy sled work was completed on Monday.'],
      };
    }
    else if (date === '2026-11-18') day = buildHyroxRaceDay(context);
    else if (date === '2026-12-13') day = buildFiftyKRaceDay(context);
    else if (date >= '2026-11-09' && date < '2026-11-18') day = buildHyroxTaperDay(context);
    else if (date > '2026-11-18' && date <= '2026-11-22') day = buildPostHyroxRecoveryDay(context);
    else if (date >= '2026-12-07' && date < '2026-12-13') day = buildFiftyKTaperDay(context);
    else day = builders[(context.dayNumber - 1) % 7]!(context);
    result.push(equalizeAthleteWorkouts(day));
    date = addDaysToKey(date, 1);
  }
  return result;
};
