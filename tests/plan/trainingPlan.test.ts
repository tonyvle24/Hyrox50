import { dailyPlanSchema, validateTrainingPlan } from '../../src/plan/schemas';
import { trainingPlan } from '../../src/plan/trainingPlan';

describe('simplified training plan', () => {
  const weekOf = (dayNumber: number) => Math.floor((dayNumber - 1) / 7) + 1;
  const weekMinutes = (weekNumber: number) =>
    trainingPlan
      .filter((day) => weekOf(day.dayNumber) === weekNumber)
      .reduce((sum, day) => sum + day.estimatedMinutes, 0);

  it('contains exactly 164 consecutive HYROX calendar days', () => {
    expect(trainingPlan).toHaveLength(164);
    expect(trainingPlan[0]?.date).toBe('2026-06-08');
    expect(trainingPlan.at(-1)?.date).toBe('2026-11-18');
    expect(new Set(trainingPlan.map((day) => day.date)).size).toBe(164);
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
    const enduranceDay = trainingPlan.find((day) => day.date === '2026-06-14')!;

    expect(skillDay.liz).toEqual(skillDay.tony);
    expect(circuitDay.liz).toEqual(circuitDay.tony);
    expect(runDay.liz.main[0]?.prescription).toMatch(/run|walk/i);
    expect(runDay.liz).not.toEqual(runDay.tony);
    expect(enduranceDay.liz).toEqual(enduranceDay.tony);
    expect(enduranceDay.title).toBe('HYROX Endurance + Stations');
    expect(enduranceDay.tony.main.map((detail) => `${detail.name} ${detail.prescription}`).join(' ')).toMatch(/Sled pull|Burpee broad jump|Wall balls/i);

    for (const day of trainingPlan) {
      expect(`${day.title} ${day.purpose} ${day.phase} ${day.coachingNotes.join(' ')}`).not.toMatch(/\bTony\b|\bLiz\b|\b50K\b|\bUltra\b|\bBMW\b|Long Run/i);
    }
  });

  it('adjusts the first week after the completed lower-body and sled session', () => {
    const monday = trainingPlan.find((day) => day.date === '2026-06-08')!;
    const tuesday = trainingPlan.find((day) => day.date === '2026-06-09')!;
    const wednesday = trainingPlan.find((day) => day.date === '2026-06-10')!;
    const thursday = trainingPlan.find((day) => day.date === '2026-06-11')!;

    expect(monday.title).toMatch(/completed lower body.*sled/i);
    expect(monday.tony.main.map((detail) => detail.name).join(' ')).toMatch(/back squat|single-leg RDL|Bulgarian split squat|sled push|sled pull/i);

    expect(tuesday.title).toMatch(/upper body.*HYROX engine/i);
    expect(tuesday.liz).toEqual(tuesday.tony);
    expect(tuesday.estimatedMinutes).toBeGreaterThanOrEqual(65);
    expect(tuesday.tony.main.map((detail) => `${detail.name} ${detail.prescription}`).join(' ')).toMatch(/SkiErg|RowErg/i);
    expect(tuesday.tony.main.map((detail) => `${detail.name} ${detail.prescription}`).join(' ')).not.toMatch(/squat|RDL|split squat|sled/i);

    expect(wednesday.title).toMatch(/aerobic recovery.*mobility/i);
    expect(wednesday.tony.main.map((detail) => `${detail.name} ${detail.prescription}`).join(' ')).not.toMatch(/deadlift|split squat|sled/i);

    expect(thursday.title).toMatch(/HYROX Circuit/i);
    expect(thursday.liz).toEqual(thursday.tony);
    expect(thursday.tony.main.map((detail) => `${detail.name} ${detail.prescription}`).join(' ')).toMatch(/sled/i);
    expect(thursday.coachingNotes.join(' ')).toMatch(/controlled|moderate|recovered/i);
  });

  it('includes only the HYROX fixed race day', () => {
    expect(trainingPlan.find((day) => day.date === '2026-11-18')?.title).toMatch(/HYROX/i);
    expect(trainingPlan.find((day) => day.date === '2026-12-13')).toBeUndefined();
    expect(trainingPlan.filter((day) => day.title.includes('HYROX Mixed Doubles'))).toHaveLength(1);
    expect(trainingPlan.some((day) => /50K|BMW|Ultra|Long Run/i.test(`${day.title} ${day.purpose}`))).toBe(false);
  });

  it('implements the HYROX taper through race day', () => {
    const taper = trainingPlan.filter((day) => day.date >= '2026-11-09' && day.date < '2026-11-18');
    expect(taper.every((day) => day.estimatedMinutes <= 45)).toBe(true);
    expect(taper.every((day) => /taper|easy|rest/i.test(`${day.title} ${day.purpose}`))).toBe(true);
    expect(taper.every((day) => day.phase === 'HYROX Taper')).toBe(true);
    expect(trainingPlan.at(-1)?.title).toBe('HYROX Mixed Doubles Dallas');
  });

  it('uses planned deload weeks before peak training', () => {
    for (const weekNumber of [4, 8, 12, 16]) {
      expect(weekMinutes(weekNumber)).toBeLessThanOrEqual(360);
      const week = trainingPlan.filter((day) => weekOf(day.dayNumber) === weekNumber);
      expect(week.filter((day) => /deload|rest|recovery/i.test(`${day.title} ${day.purpose}`)).length).toBeGreaterThanOrEqual(3);
    }
  });

  it('makes peak Wednesdays lighter so Thursday simulations stay high quality', () => {
    const peakWednesday = trainingPlan.find((day) => day.date === '2026-10-21')!;
    const mainText = peakWednesday.tony.main.map((detail) => `${detail.name} ${detail.prescription}`).join(' ');
    expect(peakWednesday.title).toMatch(/maintenance/i);
    expect(peakWednesday.estimatedMinutes).toBeLessThanOrEqual(55);
    expect(mainText).not.toMatch(/deadlift|split squat/i);
  });

  it('includes one controlled late-October HYROX dress rehearsal', () => {
    const rehearsal = trainingPlan.find((day) => day.date === '2026-10-25')!;
    const mainText = rehearsal.tony.main.map((detail) => `${detail.name} ${detail.prescription}`).join(' ');
    expect(rehearsal.title).toBe('Controlled HYROX Dress Rehearsal');
    expect(mainText).toMatch(/8 rounds|1 kilometer|SkiErg|Sled push|Sled pull|Burpee broad jump|RowErg|Farmer carry|Sandbag lunges|Wall balls/i);
    expect(mainText).toMatch(/RPE 6-7|controlled/i);
  });

  it('varies the final taper with rest and a race primer instead of repeating one day', () => {
    const taper = trainingPlan.filter((day) => day.date >= '2026-11-09' && day.date < '2026-11-18');
    expect(new Set(taper.map((day) => day.title)).size).toBeGreaterThanOrEqual(3);
    expect(taper.filter((day) => /rest/i.test(day.title) && day.estimatedMinutes <= 20)).toHaveLength(3);
    expect(trainingPlan.find((day) => day.date === '2026-11-17')?.title).toBe('HYROX Race Primer');
  });
});
