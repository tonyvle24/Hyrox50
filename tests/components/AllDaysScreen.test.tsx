import { fireEvent, render } from '@testing-library/react-native';

import { AllDaysScreen } from '../../src/screens/AllDaysScreen';

it('groups all days and selects a date', async () => {
  const onSelect = jest.fn();
  const screen = await render(<AllDaysScreen onSelect={onSelect} onClose={jest.fn()} />);
  expect(screen.getByText('June 2026')).toBeTruthy();
  fireEvent.press(screen.getByRole('button', { name: /Monday, June 8, 2026/i }));
  expect(onSelect).toHaveBeenCalledWith('2026-06-08');
});

it('closes without selecting a different day', async () => {
  const onSelect = jest.fn();
  const onClose = jest.fn();
  const screen = await render(<AllDaysScreen onSelect={onSelect} onClose={onClose} />);
  fireEvent.press(screen.getByRole('button', { name: 'Back to Selected Day' }));
  expect(onClose).toHaveBeenCalledTimes(1);
  expect(onSelect).not.toHaveBeenCalled();
});
