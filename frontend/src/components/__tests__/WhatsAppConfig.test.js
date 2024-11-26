// frontend/src/components/__tests__/WhatsAppConfig.test.js
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WhatsAppConfig from '../WhatsAppConfig';

describe('WhatsAppConfig', () => {
  test('renders number list', () => {
    render(<WhatsAppConfig />);
    expect(screen.getByText(/numbers/i)).toBeInTheDocument();
  });

  test('adds new number', async () => {
    render(<WhatsAppConfig />);
    await userEvent.click(screen.getByText(/add number/i));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});