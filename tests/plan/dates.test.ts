import {
  clampToPlanDate,
  formatUsCompactDate,
  formatUsDate,
  getNextPlanDate,
  getPlanDayNumber,
  getPreviousPlanDate,
} from '../../src/utils/dates';

describe('U.S. plan date helpers', () => {
  it('formats full and compact U.S. dates', () => {
    expect(formatUsDate('2026-06-08')).toBe('Monday, June 8, 2026');
    expect(formatUsCompactDate('2026-06-08')).toBe('6/8/2026');
  });

  it('numbers all 189 plan days', () => {
    expect(getPlanDayNumber('2026-06-08')).toBe(1);
    expect(getPlanDayNumber('2026-12-13')).toBe(189);
  });

  it('clamps navigation to the plan boundaries', () => {
    expect(clampToPlanDate('2026-01-01')).toBe('2026-06-08');
    expect(clampToPlanDate('2027-01-01')).toBe('2026-12-13');
    expect(getPreviousPlanDate('2026-06-08')).toBe('2026-06-08');
    expect(getNextPlanDate('2026-12-13')).toBe('2026-12-13');
  });
});
