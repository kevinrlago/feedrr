// frontend/src/hooks/__tests__/useAuth.test.js
import { renderHook, act } from '@testing-library/react-hooks';
import useAuth from '../useAuth';

describe('useAuth', () => {
  test('handles login', async () => {
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.login('testuser', 'password');
    });
    
    expect(result.current.isAuthenticated).toBe(true);
  });

  test('handles logout', async () => {
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.logout();
    });
    
    expect(result.current.isAuthenticated).toBe(false);
  });
});