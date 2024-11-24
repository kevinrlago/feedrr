// frontend/src/components/__tests__/FeedRequests.test.js
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FeedRequests from '../FeedRequests';

describe('FeedRequests', () => {
  test('renders feed requests', () => {
    render(<FeedRequests />);
    expect(screen.getByText(/feed requests/i)).toBeInTheDocument();
  });

  test('approves feed request', async () => {
    render(<FeedRequests />);
    await userEvent.click(screen.getByRole('button', { name: /approve/i }));
    expect(screen.getByText(/request approved/i)).toBeInTheDocument();
  });

  test('rejects feed request', async () => {
    render(<FeedRequests />);
    await userEvent.click(screen.getByRole('button', { name: /reject/i }));
    expect(screen.getByText(/request rejected/i)).toBeInTheDocument();
  });
});