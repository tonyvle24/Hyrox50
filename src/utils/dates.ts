import { addDays, differenceInCalendarDays, format, parseISO } from 'date-fns';

import type { DateKey } from '../plan/types';

export const PLAN_START: DateKey = '2026-06-08';
export const PLAN_END: DateKey = '2026-12-13';

export const toDateKey = (date: Date): DateKey => format(date, 'yyyy-MM-dd') as DateKey;
export const fromDateKey = (date: DateKey): Date => parseISO(date);
export const addDaysToKey = (date: DateKey, days: number): DateKey =>
  toDateKey(addDays(fromDateKey(date), days));
export const formatUsDate = (date: DateKey): string => format(fromDateKey(date), 'EEEE, MMMM d, yyyy');
export const formatUsCompactDate = (date: DateKey): string => format(fromDateKey(date), 'M/d/yyyy');
export const formatUsMonth = (date: DateKey): string => format(fromDateKey(date), 'MMMM yyyy');
export const daysBetween = (start: DateKey, end: DateKey): number =>
  differenceInCalendarDays(fromDateKey(end), fromDateKey(start));
export const getPlanDayNumber = (date: DateKey): number => daysBetween(PLAN_START, date) + 1;
export const clampToPlanDate = (date: DateKey): DateKey =>
  date < PLAN_START ? PLAN_START : date > PLAN_END ? PLAN_END : date;
export const getPreviousPlanDate = (date: DateKey): DateKey =>
  clampToPlanDate(addDaysToKey(date, -1));
export const getNextPlanDate = (date: DateKey): DateKey => clampToPlanDate(addDaysToKey(date, 1));
