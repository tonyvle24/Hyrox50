import { addDaysToKey, getPlanDayNumber, PLAN_END, PLAN_START } from '../utils/dates';
import { phaseForDate } from './phases';
import {
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
  buildWednesdayStrength,
  buildPostHyroxRecoveryDay,
} from './templates';
import type { DailyPlan, DateKey, PlanContext } from './types';

const builders = [
  buildMondayHyroxSkill,
  buildTuesdayEngine,
  buildWednesdayStrength,
  buildThursdayHyroxCircuit,
  buildFridayRecovery,
  buildSaturdaySteady,
  buildSundayLongRun,
];

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
    if (date === '2026-11-18') result.push(buildHyroxRaceDay(context));
    else if (date === '2026-12-13') result.push(buildFiftyKRaceDay(context));
    else if (date >= '2026-11-09' && date < '2026-11-18') result.push(buildHyroxTaperDay(context));
    else if (date > '2026-11-18' && date <= '2026-11-22') result.push(buildPostHyroxRecoveryDay(context));
    else if (date >= '2026-12-07' && date < '2026-12-13') result.push(buildFiftyKTaperDay(context));
    else result.push(builders[(context.dayNumber - 1) % 7]!(context));
    date = addDaysToKey(date, 1);
  }
  return result;
};
