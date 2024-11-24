// frontend/src/components/__tests__/LanguageSelector.test.js
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LanguageSelector from '../LanguageSelector';

describe('LanguageSelector', () => {
  test('renders language selector', () => {
    render(<LanguageSelector />);
    expect(screen.getByLabelText(/language/i)).toBeInTheDocument();
  });

  test('changes language', async () => {
    render(<LanguageSelector />);
    await userEvent.click(screen.getByLabelText(/language/i));
    await userEvent.click(screen.getByText(/español/i));
    expect(screen.getByText(/español/i)).toBeInTheDocument();
  });
});