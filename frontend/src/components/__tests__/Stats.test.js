// frontend/src/components/__tests__/Stats.test.js
import { render, screen } from '@testing-library/react';
import Stats from '../Stats';

describe('Stats', () => {
  test('renders statistics', () => {
    render(<Stats />);
    expect(screen.getByText(/statistics/i)).toBeInTheDocument();
  });

  test('shows charts', () => {
    render(<Stats />);
    expect(screen.getByRole('img', { name: /chart/i })).toBeInTheDocument();
  });
});