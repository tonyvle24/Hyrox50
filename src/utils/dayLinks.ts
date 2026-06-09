import type { DateKey } from '../plan/types';
import { PLAN_END, PLAN_START } from './dates';

const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const dayHash = (date: DateKey): string => `#day=${date}`;

export const parseDayHash = (hash: string): DateKey => {
  const value = hash.startsWith('#day=') ? hash.slice(5) : '';
  if (!DATE_KEY_PATTERN.test(value) || value < PLAN_START || value > PLAN_END) return PLAN_START;
  return value as DateKey;
};

export const readBrowserDay = (): DateKey | undefined =>
  typeof window === 'undefined' || !window.location ? undefined : parseDayHash(window.location.hash);

export const writeBrowserDay = (date: DateKey): void => {
  if (typeof window !== 'undefined' && window.location && window.history && window.location.hash !== dayHash(date)) {
    window.history.replaceState(null, '', dayHash(date));
  }
};
