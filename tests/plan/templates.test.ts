import {
  buildMondayHyroxSkill,
  buildSundayLongRun,
  buildTuesdayEngine,
} from '../../src/plan/templates';

const context = {
  date: '2026-06-08' as const,
  dayNumber: 1,
  weekNumber: 1,
  phase: 'Foundation',
};

describe('detailed workout templates', () => {
  it('builds exact HYROX and strength detail', () => {
    expect(buildMondayHyroxSkill(context).tony.main[0]).toMatchObject({
      name: expect.any(String),
      prescription: expect.stringMatching(/sets|rounds|reps|minutes|meters|feet/i),
      targetRpe: expect.stringMatching(/RPE/i),
      rest: expect.any(String),
      coachingCue: expect.any(String),
    });
  });

  it('builds a Tony run and Liz run-walk progression', () => {
    const day = buildTuesdayEngine(context);
    expect(day.tony.main[0]?.prescription).toMatch(/miles/i);
    expect(day.liz.main[0]?.prescription).toMatch(/run|walk/i);
  });

  it('builds long-run distance and fueling guidance', () => {
    const day = buildSundayLongRun({ ...context, weekNumber: 12 });
    expect(day.tony.main[0]?.prescription).toMatch(/miles/i);
    expect(day.coachingNotes.join(' ')).toMatch(/fuel|hydr/i);
  });
});
