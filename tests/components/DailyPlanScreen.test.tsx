import { render, userEvent } from '@testing-library/react-native';

import { DailyPlanScreen } from '../../src/screens/DailyPlanScreen';

describe('DailyPlanScreen', () => {
  it('shows Day 1 with U.S. date and all athlete sections', async () => {
    const screen = await render(<DailyPlanScreen initialDate="2026-06-08" />);
    expect(screen.getByText('Day 1 of 189')).toBeTruthy();
    expect(screen.getByText('Monday, June 8, 2026')).toBeTruthy();
    expect(screen.getByText('TOGETHER')).toBeTruthy();
    expect(screen.getByText('TONY')).toBeTruthy();
    expect(screen.getByText('LIZ')).toBeTruthy();
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

  it('shows completed HYROX wording after race day', async () => {
    const screen = await render(<DailyPlanScreen initialDate="2026-11-19" />);
    expect(screen.getByText('HYROX complete')).toBeTruthy();
    expect(screen.queryByText('0 days to HYROX')).toBeNull();
  });
});
