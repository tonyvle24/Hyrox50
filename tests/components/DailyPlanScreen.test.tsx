import { render, userEvent } from '@testing-library/react-native';

import { DailyPlanScreen } from '../../src/screens/DailyPlanScreen';

describe('DailyPlanScreen', () => {
  it('shows one combined workout on a non-running day', async () => {
    const screen = await render(<DailyPlanScreen initialDate="2026-06-08" />);
    expect(screen.getByText('Day 1 of 164')).toBeTruthy();
    expect(screen.getByText('Monday, June 8, 2026')).toBeTruthy();
    expect(screen.queryByText('TOGETHER')).toBeNull();
    expect(screen.getByText('WORKOUT')).toBeTruthy();
    expect(screen.queryByText('TONY RUN')).toBeNull();
    expect(screen.queryByText('LIZ HYROX RUN')).toBeNull();
  });

  it('splits Tony and Liz only on a standalone running day', async () => {
    const screen = await render(<DailyPlanScreen initialDate="2026-06-13" />);
    expect(screen.getByText('TONY RUN')).toBeTruthy();
    expect(screen.getByText('LIZ HYROX RUN')).toBeTruthy();
    expect(screen.queryByText('TOGETHER')).toBeNull();
    expect(screen.queryByText('WORKOUT')).toBeNull();
  });

  it('shows actionable activity details', async () => {
    const screen = await render(<DailyPlanScreen initialDate="2026-06-08" />);
    expect(screen.getAllByText(/RPE/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Rest:/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Cue:/i).length).toBeGreaterThan(0);
  });

  it('navigates to the next day', async () => {
    const screen = await render(<DailyPlanScreen initialDate="2026-06-08" />);
    await userEvent.press(screen.getAllByRole('button', { name: 'Next Day' })[0]!);
    expect(screen.getByText('Tuesday, June 9, 2026')).toBeTruthy();
  });

  it('opens and closes Browse All Days without changing the selected day', async () => {
    const screen = await render(<DailyPlanScreen initialDate="2026-06-09" />);
    await userEvent.press(screen.getAllByRole('button', { name: 'Browse All Days' })[0]!);
    expect(screen.getByText('Browse All Days')).toBeTruthy();
    await userEvent.press(screen.getByRole('button', { name: 'Back to Selected Day' }));
    expect(screen.getByText('Tuesday, June 9, 2026')).toBeTruthy();
  });

  it('clamps future dates to HYROX race day', async () => {
    const screen = await render(<DailyPlanScreen initialDate="2026-11-19" />);
    expect(screen.getByText('Wednesday, November 18, 2026')).toBeTruthy();
    expect(screen.getByText('0 days to HYROX')).toBeTruthy();
  });

  it('does not show a 50K countdown', async () => {
    const screen = await render(<DailyPlanScreen initialDate="2026-06-08" />);
    expect(screen.queryByText(/50K/i)).toBeNull();
  });
});
