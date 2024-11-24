// frontend/src/components/__tests__/NotificationList.test.js
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NotificationList from '../NotificationList';

describe('NotificationList', () => {
  test('renders notification list', () => {
    render(<NotificationList />);
    expect(screen.getByText(/notifications/i)).toBeInTheDocument();
  });

  test('marks notification as read', async () => {
    render(<NotificationList />);
    await userEvent.click(screen.getByRole('button', { name: /mark as read/i }));
    expect(screen.getByText(/no new notifications/i)).toBeInTheDocument();
  });
});