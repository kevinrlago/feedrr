// frontend/src/components/__tests__/AddUser.test.js
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddUser from '../AddUser';

describe('AddUser', () => {
  test('renders user form', () => {
    render(<AddUser />);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  test('validates form fields', async () => {
    render(<AddUser />);
    await userEvent.click(screen.getByRole('button', { name: /add user/i }));
    expect(screen.getByText(/username is required/i)).toBeInTheDocument();
  });
});