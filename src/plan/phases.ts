import type { DateKey } from './types';

export const phaseForDate = (date: DateKey): string => {
  if (date <= '2026-07-12') return 'Foundation';
  if (date <= '2026-08-23') return 'Base Build';
  if (date <= '2026-10-11') return 'Specific Build';
  if (date <= '2026-11-08') return 'HYROX Peak';
  if (date <= '2026-11-18') return 'HYROX Taper';
  if (date <= '2026-11-22') return 'Post-HYROX Recovery';
  if (date < '2026-12-07') return '50K Peak';
  return '50K Taper';
};
