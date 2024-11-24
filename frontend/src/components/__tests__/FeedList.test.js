// frontend/src/components/__tests__/FeedList.test.js
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FeedList from '../FeedList';
import { mockFeeds } from '../../test/mockData';

jest.mock('axios');

describe('FeedList', () => {
  test('renders feed list', async () => {
    render(<FeedList />);
    expect(screen.getByText(/feeds/i)).toBeInTheDocument();
  });

  test('displays feeds from API', async () => {
    render(<FeedList />);
    await waitFor(() => {
      expect(screen.getByText(mockFeeds[0].name)).toBeInTheDocument();
    });
  });

  test('shows loading state', () => {
    render(<FeedList />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('can add new feed', async () => {
    render(<FeedList />);
    await userEvent.click(screen.getByText(/add feed/i));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});