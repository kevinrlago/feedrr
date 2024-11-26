// frontend/src/components/__tests__/AddFeed.test.js
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddFeed from '../AddFeed';

describe('AddFeed', () => {
  test('renders feed type cards', () => {
    render(<AddFeed />);
    expect(screen.getByText(/youtube/i)).toBeInTheDocument();
    expect(screen.getByText(/reddit/i)).toBeInTheDocument();
    expect(screen.getByText(/custom rss/i)).toBeInTheDocument();
  });

  test('opens form dialog on card click', async () => {
    render(<AddFeed />);
    await userEvent.click(screen.getByText(/youtube/i));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});