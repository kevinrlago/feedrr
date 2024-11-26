// frontend/src/components/__tests__/UserProfile.test.js
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserProfile from '../UserProfile';

describe('UserProfile', () => {
  test('renders user profile', () => {
    render(<UserProfile />);
    expect(screen.getByText(/user profile/i)).toBeInTheDocument();
  });

  test('updates user information', async () => {
    render(<UserProfile />);
    await userEvent.type(screen.getByLabelText(/username/i), 'newusername');
    await userEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(screen.getByText(/profile updated/i)).toBeInTheDocument();
  });
});