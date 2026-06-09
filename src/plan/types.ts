export type DateKey = `${number}-${number}-${number}`;

export type ActivityDetail = {
  name: string;
  prescription: string;
  targetRpe: string;
  rest: string;
  coachingCue: string;
};

export type AthletePlan = {
  summary: string;
  warmup: ActivityDetail[];
  main: ActivityDetail[];
  cooldown: ActivityDetail[];
};

export type DailyPlan = {
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

export type PlanContext = {
  date: DateKey;
  dayNumber: number;
  weekNumber: number;
  phase: string;
};
