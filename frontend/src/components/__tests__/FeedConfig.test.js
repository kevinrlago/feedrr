// frontend/src/components/__tests__/FeedConfig.test.js
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FeedConfig from '../FeedConfig';

describe('FeedConfig', () => {
  test('renders feed configuration', () => {
    render(<FeedConfig />);
    expect(screen.getByText(/feed configuration/i)).toBeInTheDocument();
  });

  test('updates feed settings', async () => {
    render(<FeedConfig />);
    await userEvent.type(screen.getByLabelText(/feed name/i), 'Updated Feed Name');
    await userEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(screen.getByText(/settings updated/i)).toBeInTheDocument();
  });
});