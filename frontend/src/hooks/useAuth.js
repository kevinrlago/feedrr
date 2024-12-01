// frontend/src/hooks/useAuth.js
import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { userService } from '../services/user.service';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginRequired, setLoginRequired] = useState(false);

  const checkAuth = useCallback(async () => {
    try {
      // First check if any users exist
      const { exists } = await userService.checkUsersExist();
      if (!exists) {
        setLoginRequired(false);
        setLoading(false);
        return;
      }

      // Get login config
      const { data: config } = await api.get('/api/v1/config/login');
      setLoginRequired(config?.loginEnabled || false);

      // Check authentication if required
      if (config?.loginEnabled) {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        const response = await api.get('/api/v1/users/me');
        setUser(response.data);
        setIsAuthenticated(true);
      }
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setIsAuthenticated(false);
      } else {
        console.error('Auth check error:', err);
        setError(err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (username, password) => {
    try {
      console.log('Attempting login with:', { username, password });
      const response = await api.post('/api/v1/auth/token', {
        username,
        password,
        grant_type: 'password'
      });

      console.log('Login response:', response.data);
      const { access_token } = response.data;
      if (access_token) {
        localStorage.setItem('token', access_token);
        await checkAuth();
        return true;
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response?.status === 401) {
        throw new Error('Invalid credentials');
      }
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