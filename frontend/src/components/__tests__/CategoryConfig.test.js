// frontend/src/components/__tests__/CategoryConfig.test.js
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CategoryConfig from '../CategoryConfig';
import { mockCategories } from '../../test/mockData';

describe('CategoryConfig', () => {
  test('renders category grid', () => {
    render(<CategoryConfig />);
    expect(screen.getByText(/categories/i)).toBeInTheDocument();
  });

  test('opens add category dialog', async () => {
    render(<CategoryConfig />);
    await userEvent.click(screen.getByRole('button', { name: /add/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});