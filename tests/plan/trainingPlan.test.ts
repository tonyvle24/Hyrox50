import { dailyPlanSchema, validateTrainingPlan } from '../../src/plan/schemas';
import { trainingPlan } from '../../src/plan/trainingPlan';

describe('simplified training plan', () => {
  it('contains exactly 189 consecutive calendar days', () => {
    expect(trainingPlan).toHaveLength(189);
    expect(trainingPlan[0]?.date).toBe('2026-06-08');
    expect(trainingPlan.at(-1)?.date).toBe('2026-12-13');
    expect(new Set(trainingPlan.map((day) => day.date)).size).toBe(189);
  });

  it('gives Tony, Liz, and Together actionable guidance every day', () => {
    expect(() => validateTrainingPlan(trainingPlan)).not.toThrow();
    for (const day of trainingPlan) {
      expect(dailyPlanSchema.parse(day)).toBeTruthy();
      for (const plan of [day.shared, day.tony, day.liz]) {
        expect(plan.summary.length).toBeGreaterThan(0);
        for (const activity of [...plan.warmup, ...plan.main, ...plan.cooldown]) {
          expect(activity.prescription.length).toBeGreaterThan(0);
          expect(activity.targetRpe).toMatch(/RPE/i);
          expect(activity.rest.length).toBeGreaterThan(0);
          expect(activity.coachingCue.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it('gives Tony and Liz the same strength and HYROX work, with Liz keeping HYROX-specific runs', () => {
    const skillDay = trainingPlan.find((day) => day.date === '2026-06-08')!;
    const circuitDay = trainingPlan.find((day) => day.date === '2026-06-11')!;
    const runDay = trainingPlan.find((day) => day.date === '2026-06-13')!;
    const longRunDay = trainingPlan.find((day) => day.date === '2026-06-14')!;

    expect(skillDay.liz).toEqual(skillDay.tony);
    expect(circuitDay.liz).toEqual(circuitDay.tony);
    expect(runDay.liz.main[0]?.prescription).toMatch(/run|walk/i);
    expect(runDay.liz).not.toEqual(runDay.tony);
    expect(longRunDay.liz.main[0]?.name).not.toMatch(/long run/i);

    for (const day of trainingPlan) {
      expect(`${day.title} ${day.purpose} ${day.coachingNotes.join(' ')}`).not.toMatch(/\bTony\b|\bLiz\b/);
    }
    expect(longRunDay.title).toBe('Long Run + HYROX Recovery');
  });

  it('adjusts the first week after the completed lower-body and sled session', () => {
    const monday = trainingPlan.find((day) => day.date === '2026-06-08')!;
    const tuesday = trainingPlan.find((day) => day.date === '2026-06-09')!;
    const wednesday = trainingPlan.find((day) => day.date === '2026-06-10')!;
    const thursday = trainingPlan.find((day) => day.date === '2026-06-11')!;

    expect(monday.title).toMatch(/completed lower body.*sled/i);
    expect(monday.tony.main.map((detail) => detail.name).join(' ')).toMatch(/back squat|single-leg RDL|Bulgarian split squat|sled push|sled pull/i);

    expect(tuesday.title).toMatch(/upper body.*core/i);
    expect(tuesday.liz).toEqual(tuesday.tony);
    expect(tuesday.tony.main.map((detail) => `${detail.name} ${detail.prescription}`).join(' ')).not.toMatch(/squat|RDL|split squat|sled/i);

    expect(wednesday.title).toMatch(/aerobic recovery.*mobility/i);
    expect(wednesday.tony.main.map((detail) => `${detail.name} ${detail.prescription}`).join(' ')).not.toMatch(/deadlift|split squat|sled/i);

    expect(thursday.title).toMatch(/HYROX technique/i);
    expect(thursday.liz).toEqual(thursday.tony);
    expect(thursday.tony.main.map((detail) => `${detail.name} ${detail.prescription}`).join(' ')).not.toMatch(/sled|squat|lunge/i);
  });

  it('includes both fixed race days', () => {
    expect(trainingPlan.find((day) => day.date === '2026-11-18')?.title).toMatch(/HYROX/i);
    expect(trainingPlan.find((day) => day.date === '2026-12-13')?.title).toMatch(/50K/i);
  });

  it('contains exactly one race day for each fixed event', () => {
    expect(trainingPlan.filter((day) => day.title.includes('HYROX Mixed Doubles'))).toHaveLength(1);
    const fiftyKDays = trainingPlan.filter((day) => day.title.includes('50K Race Day'));
    expect(fiftyKDays).toHaveLength(1);
    expect(fiftyKDays[0]?.date).toBe('2026-12-13');
  });

  it('implements the HYROX taper and post-race recovery window', () => {
    const taper = trainingPlan.filter((day) => day.date >= '2026-11-09' && day.date < '2026-11-18');
    expect(taper.every((day) => day.estimatedMinutes <= 45)).toBe(true);
    expect(taper.every((day) => /taper|easy|rest/i.test(`${day.title} ${day.purpose}`))).toBe(true);
    expect(taper.every((day) => day.phase === 'HYROX Taper')).toBe(true);

    const recovery = trainingPlan.filter((day) => day.date > '2026-11-18' && day.date <= '2026-11-22');
    expect(recovery.every((day) => day.estimatedMinutes <= 40)).toBe(true);
    expect(recovery.every((day) => /recovery|rest/i.test(`${day.title} ${day.purpose}`))).toBe(true);
    expect(recovery.every((day) => day.phase === 'Post-HYROX Recovery')).toBe(true);
  });

  it('implements a low-volume final 50K taper week', () => {
    const finalWeek = trainingPlan.filter((day) => day.date >= '2026-12-07' && day.date < '2026-12-13');
    expect(finalWeek.every((day) => day.estimatedMinutes <= 45)).toBe(true);
    expect(finalWeek.every((day) => /taper|rest|easy|shakeout/i.test(`${day.title} ${day.purpose}`))).toBe(true);
    expect(finalWeek.every((day) => day.phase === '50K Taper')).toBe(true);
    expect(trainingPlan.find((day) => day.date === '2026-12-12')?.tony.summary).not.toMatch(/8-mile/i);
  });
});
