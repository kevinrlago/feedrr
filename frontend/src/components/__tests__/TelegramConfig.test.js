// frontend/src/components/__tests__/TelegramConfig.test.js
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TelegramConfig from '../TelegramConfig';

describe('TelegramConfig', () => {
  test('renders configuration options', () => {
    render(<TelegramConfig />);
    expect(screen.getByText(/telegram configuration/i)).toBeInTheDocument();
  });

  test('adds new bot', async () => {
    render(<TelegramConfig />);
    await userEvent.click(screen.getByText(/add bot/i));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});