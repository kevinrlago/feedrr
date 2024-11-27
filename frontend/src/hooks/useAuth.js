// frontend/src/hooks/useAuth.js
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEnabled, setLoginEnabled] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      const response = await axios.get('/api/v1/auth/validate', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (err) {
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    try {
      // Change from '/api/v1/auth/login' to '/token' to match backend
      const response = await axios.post('/token', {
        username: email,  // Note: backend expects 'username' not 'email'
        password: password
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      setIsAuthenticated(true);
      await checkAuth(); // This will set the user data
      return true;
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
      throw err;
    }
  };

  const magicLinkLogin = async (email) => {
    try {
      await axios.post('/api/v1/auth/magic-link', { email });
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const verifyMagicLink = async (token) => {
    try {
      const response = await axios.post('/api/v1/auth/verify', { token });
      const { access_token, user } = response.data;
      localStorage.setItem('token', access_token);
      setUser(user);
      setIsAuthenticated(true);
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
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
    magicLinkLogin,
    verifyMagicLink,
    isAuthenticated,
    loginEnabled,
    checkAuth
  };
};