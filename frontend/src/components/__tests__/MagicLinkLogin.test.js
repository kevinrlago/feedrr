// frontend/src/components/__tests__/MagicLinkLogin.test.js
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MagicLinkLogin from '../MagicLinkLogin';

describe('MagicLinkLogin', () => {
  test('renders magic link login form', () => {
    render(<MagicLinkLogin />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  test('sends magic link', async () => {
    render(<MagicLinkLogin />);
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.click(screen.getByRole('button', { name: /send magic link/i }));
    expect(screen.getByText(/magic link sent/i)).toBeInTheDocument();
  });
});