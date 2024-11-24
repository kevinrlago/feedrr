// frontend/src/components/__tests__/DiscordConfig.test.js
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DiscordConfig from '../DiscordConfig';

describe('DiscordConfig', () => {
  test('renders server list', () => {
    render(<DiscordConfig />);
    expect(screen.getByText(/servers/i)).toBeInTheDocument();
  });

  test('adds new server', async () => {
    render(<DiscordConfig />);
    await userEvent.click(screen.getByText(/add server/i));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});