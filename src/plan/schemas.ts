import { z } from 'zod';

import { addDaysToKey } from '../utils/dates';
import type { DailyPlan } from './types';

const activitySchema = z.object({
  name: z.string().min(2),
  prescription: z.string().min(4),
  targetRpe: z.string().regex(/RPE/i),
  rest: z.string().min(3),
  coachingCue: z.string().min(3),
});

const athletePlanSchema = z.object({
  summary: z.string().min(3),
  warmup: z.array(activitySchema).min(1),
  main: z.array(activitySchema).min(1),
  cooldown: z.array(activitySchema).min(1),
});

export const dailyPlanSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  dayNumber: z.number().int().positive(),
  phase: z.string().min(2),
  title: z.string().min(2),
  purpose: z.string().min(4),
  estimatedMinutes: z.number().int().nonnegative(),
  equipment: z.array(z.string()),
  shared: athletePlanSchema,
  tony: athletePlanSchema,
  liz: athletePlanSchema,
  coachingNotes: z.array(z.string().min(3)).min(1),
});

export const validateTrainingPlan = (plan: DailyPlan[]): DailyPlan[] => {
  const parsed = z.array(dailyPlanSchema).length(189).parse(plan) as DailyPlan[];
  parsed.forEach((day, index) => {
    if (day.dayNumber !== index + 1) throw new Error(`Invalid day number at ${day.date}`);
    if (index > 0 && day.date !== addDaysToKey(parsed[index - 1]!.date, 1)) {
      throw new Error(`Nonconsecutive date at ${day.date}`);
    }
  });
  if (new Set(parsed.map((day) => day.date)).size !== parsed.length) {
    throw new Error('Duplicate plan dates');
  }
  return parsed;
};
