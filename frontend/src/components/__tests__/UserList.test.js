// frontend/src/components/__tests__/UserList.test.js
import { render, screen } from '@testing-library/react';
import UserList from '../UserList';

describe('UserList', () => {
  test('renders user table', () => {
    render(<UserList />);
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  test('shows user roles', () => {
    render(<UserList />);
    expect(screen.getByText(/role/i)).toBeInTheDocument();
  });
});