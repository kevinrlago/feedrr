// frontend/src/components/__tests__/Settings.test.js
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Settings from '../Settings';

describe('Settings', () => {
  test('renders settings page', () => {
    render(<Settings />);
    expect(screen.getByText(/settings/i)).toBeInTheDocument();
  });

  test('updates settings', async () => {
    render(<Settings />);
    await userEvent.type(screen.getByLabelText(/api url/i), 'http://newapiurl.com');
    await userEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(screen.getByText(/settings updated/i)).toBeInTheDocument();
  });
});