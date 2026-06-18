import type { DateKey } from './types';

export const phaseForDate = (date: DateKey): string => {
  if (date <= '2026-07-12') return 'Foundation';
  if (date <= '2026-08-23') return 'Base Build';
  if (date <= '2026-10-11') return 'Specific Build';
  if (date <= '2026-11-08') return 'HYROX Peak';
  return 'HYROX Taper';
};
