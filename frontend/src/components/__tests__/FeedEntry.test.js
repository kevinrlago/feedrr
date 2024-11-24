// frontend/src/components/__tests__/FeedEntry.test.js
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FeedEntry from '../FeedEntry';
import axios from 'axios';

jest.mock('axios');

const mockEntry = {
  id: 1,
  title: "Test Entry",
  description: "Test Description",
  link: "http://example.com",
  published: "2024-03-14T12:00:00Z"
};

describe('FeedEntry', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockEntry });
  });

  test('renders feed entry', () => {
    render(<FeedEntry entryId={1} />);
    expect(screen.getByText(/entry details/i)).toBeInTheDocument();
  });

  test('displays entry content', async () => {
    render(<FeedEntry entryId={1} />);
    expect(screen.getByText(/content/i)).toBeInTheDocument();
  });

  test('shows loading state', () => {
    render(<FeedEntry entryId={1} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('displays error message on API failure', async () => {
    axios.get.mockRejectedValueOnce(new Error('API Error'));
    render(<FeedEntry entryId={1} />);
    await waitFor(() => {
      expect(screen.getByText(/error loading entry/i)).toBeInTheDocument();
    });
  });

  test('opens entry link in new tab', () => {
    render(<FeedEntry entryId={1} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('formats published date correctly', async () => {
    render(<FeedEntry entryId={1} />);
    await waitFor(() => {
      expect(screen.getByText(/march 14, 2024/i)).toBeInTheDocument();
    });
  });

  test('handles missing description gracefully', async () => {
    axios.get.mockResolvedValueOnce({ 
      data: { ...mockEntry, description: null } 
    });
    render(<FeedEntry entryId={1} />);
    await waitFor(() => {
      expect(screen.getByText(/no description available/i)).toBeInTheDocument();
    });
  });
});