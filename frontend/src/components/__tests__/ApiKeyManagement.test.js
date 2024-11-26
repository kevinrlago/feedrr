// frontend/src/components/__tests__/ApiKeyManagement.test.js
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ApiKeyManagement from '../ApiKeyManagement';

describe('ApiKeyManagement', () => {
  test('renders API key management', () => {
    render(<ApiKeyManagement />);
    expect(screen.getByText(/api keys/i)).toBeInTheDocument();
  });

  test('creates new API key', async () => {
    render(<ApiKeyManagement />);
    await userEvent.click(screen.getByRole('button', { name: /create api key/i }));
    expect(screen.getByText(/api key created/i)).toBeInTheDocument();
  });
});