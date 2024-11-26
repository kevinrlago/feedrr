// frontend/src/components/__tests__/Dashboard.test.js
import { render, screen } from '@testing-library/react';
import Dashboard from '../Dashboard';

describe('Dashboard', () => {
  test('renders stats cards', () => {
    render(<Dashboard />);
    expect(screen.getByText(/total feeds/i)).toBeInTheDocument();
    expect(screen.getByText(/categories/i)).toBeInTheDocument();
    expect(screen.getByText(/users/i)).toBeInTheDocument();
  });

  test('displays recent activity', async () => {
    render(<Dashboard />);
    expect(screen.getByText(/recent activity/i)).toBeInTheDocument();
  });
});