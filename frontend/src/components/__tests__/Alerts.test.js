// frontend/src/components/__tests__/Alerts.test.js
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Alerts from '../Alerts';

describe('Alerts', () => {
  test('renders alerts list', () => {
    render(<Alerts />);
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  test('marks alert as read', async () => {
    render(<Alerts />);
    const alert = screen.getByRole('listitem');
    await userEvent.click(alert);
    expect(alert).toHaveClass('read');
  });
});