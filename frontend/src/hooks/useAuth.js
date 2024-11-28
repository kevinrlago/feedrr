// frontend/src/hooks/useAuth.js
import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginRequired, setLoginRequired] = useState(false);

  const checkAuth = useCallback(async () => {
    try {
      // Verificar si el login está habilitado
      const { data: config } = await api.get('/api/v1/config/login');
      const loginEnabled = config?.loginEnabled || false;
      setLoginRequired(loginEnabled);

      if (!loginEnabled) {
        // Si el login no está habilitado, usar el admin por defecto
        setUser({
          username: 'admin',
          email: 'admin@system.local',
          role: 'ADMIN'
        });
        setIsAuthenticated(true);
        setLoading(false);
        return;
      }

      // Si el login está habilitado, verificar autenticación normal
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      const response = await api.get('/api/v1/users/me');
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Auth check error:', err);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (username, password) => {
    try {
      const response = await api.post('/token', {
        username,
        password
      });

      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      await checkAuth();
      return true;
    } catch (err) {
      throw new Error(err.response?.data?.detail || 'Login failed');
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated,
    loginRequired,
    checkAuth
  };
};