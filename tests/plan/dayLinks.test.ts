import { dayHash, parseDayHash } from '../../src/utils/dayLinks';

describe('shareable day hashes', () => {
  it('creates a static-site-compatible hash for a selected day', () => {
    expect(dayHash('2026-11-18')).toBe('#day=2026-11-18');
  });

  it('falls back to Day 1 for missing, invalid, or out-of-plan hashes', () => {
    expect(parseDayHash('')).toBe('2026-06-08');
    expect(parseDayHash('#day=not-a-date')).toBe('2026-06-08');
    expect(parseDayHash('#day=2026-01-01')).toBe('2026-06-08');
    expect(parseDayHash('#day=2027-01-01')).toBe('2026-06-08');
  });

  it('accepts an in-plan day hash', () => {
    expect(parseDayHash('#day=2026-12-13')).toBe('2026-12-13');
  });
});
